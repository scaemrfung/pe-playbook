#!/usr/bin/env python3
"""Games of the Week printables, run by tools/build.js when the content changes (tools/gotw-print.sha1).
Reads the print data (JSON) on stdin and writes, in the site root:
  <file>.pdf   games-of-the-week-print.html printed by Chrome (per school week: a Grades 1–3 page and a Grades 4–6 page, + contents)
  <file>.docx  the same pages as a Word document, in the weekly-plans style (Calibri, headings, one week per page)
Needs: python3 + python-docx + playwright + pikepdf + Chrome.   Manual run: node tools/build.js (it pipes the data in)."""
import json, os, sys, datetime
from docx import Document
from docx.enum.section import WD_ORIENT
from docx.enum.text import WD_BREAK
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Pt, Inches, RGBColor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = json.load(sys.stdin)
NAVY, GREEN, MUTED, AMBER = RGBColor(0x1A, 0x2F, 0x6B), RGBColor(0x1F, 0x6F, 0x4A), RGBColor(0x55, 0x60, 0x6B), RGBColor(0x6B, 0x46, 0x00)
CHROME = next((p for p in ("/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser") if os.path.exists(p)), None)

# ------------------------------------------------------------------ PDF (tagged HTML print, then lossless compression)
def make_pdf():
    from playwright.sync_api import sync_playwright
    import pikepdf, tempfile
    from html import escape
    E=lambda x:escape(str(x or ""))
    # Use the same two reporting periods as school-year.js / the Kindergarten page.
    cut=G["term2Start"]
    variants=[(G["file"],"Full year",G["weeks"])] + [(G["file"]+"-Term-"+str(t["n"]),"Term %d · %s"%(t["n"],t["label"]),[w for w in G["weeks"] if (w["start"] < cut)==(t["n"]==1)]) for t in G["terms"]]
    with sync_playwright() as p:
        b=p.chromium.launch(executable_path=CHROME,args=["--no-sandbox"]) if CHROME else p.chromium.launch()
        for filename,label,weeks in variants:
            pg=b.new_page(viewport={"width":1000,"height":1200})
            pg.goto("file://"+os.path.join(ROOT,"games-of-the-week-print.html"),wait_until="load")
            pg.wait_for_selector("html[data-fitted]",timeout=30000)
            if filename!=G["file"]:
                nums=[w["n"] for w in weeks]
                # Remove unrelated sheets and build a term-only contents table.
                pg.evaluate("nums => document.querySelectorAll('.gp-week').forEach(el => {if(!nums.includes(+el.dataset.week))el.remove();})",nums)
                rows='<tr><th>Week</th><th>Dates</th>'+''.join('<th>'+E(band["label"])+"</th>" for band in G["bands"])+"</tr>"
                for w in weeks:
                    rows+='<tr><td>Week %d</td><td>%s</td>'%(w["n"],E(w["range"]))+''.join('<td>'+E(' · '.join(g["name"] for g in band["games"]))+'</td>' for band in w["bands"])+"</tr>"
                pg.locator('.gp-contents').evaluate('(el,html)=>el.innerHTML=html',rows)
                pg.locator('.gp-cover h1').evaluate('(el,label)=>el.textContent+=" · "+label',label)
            over=pg.eval_on_selector_all('.gp-sheet[data-overflow]',"els=>els.map(e=>e.id)")
            if over:raise RuntimeError("Printable overflow: "+", ".join(over))
            foot=('<div style="width:100%%;font:7pt Arial,sans-serif;color:#55606b;padding:0 .5in;display:flex;justify-content:space-between">'
                  '<span>%s · %s · %s</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>')%(E(G["title"]),E(G["teacher"]),E(label))
            with tempfile.TemporaryDirectory() as tmp:
                raw=os.path.join(tmp,"raw.pdf")
                pg.pdf(path=raw,format="Letter",print_background=True,prefer_css_page_size=True,display_header_footer=True,
                       header_template="<span></span>",footer_template=foot,margin={"top":".5in","bottom":".5in","left":".5in","right":".5in"},outline=True,tagged=True)
                pdf=pikepdf.open(raw)
                if '/StructTreeRoot' not in pdf.Root:raise RuntimeError("PDF accessibility tags missing")
                out=os.path.join(ROOT,filename+".pdf")
                pdf.save(out,object_stream_mode=pikepdf.ObjectStreamMode.generate,compress_streams=True,recompress_flate=True)
                print("wrote",filename+".pdf",os.path.getsize(out),"bytes (tagged, lossless compression)")
            pg.close()
        b.close()

# ------------------------------------------------------------------ Word
def hyperlink(par, url, text, bold=True, color=None, size=None):
    part = par.part
    rid = part.relate_to(url, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink", is_external=True)
    h = OxmlElement("w:hyperlink"); h.set(qn("r:id"), rid)
    r = OxmlElement("w:r"); rpr = OxmlElement("w:rPr")
    if bold: rpr.append(OxmlElement("w:b"))
    if color is not None:
        c = OxmlElement("w:color"); c.set(qn("w:val"), str(color)); rpr.append(c)
    if size:
        s = OxmlElement("w:sz"); s.set(qn("w:val"), str(int(size * 2))); rpr.append(s)
    r.append(rpr); t = OxmlElement("w:t"); t.text = text; t.set(qn("xml:space"), "preserve"); r.append(t); h.append(r)
    par._p.append(h)

def field(par, code):
    for kind, txt in (("begin", None), (None, code), ("separate", None), (None, "1"), ("end", None)):
        r = par.add_run()
        if kind:
            f = OxmlElement("w:fldChar"); f.set(qn("w:fldCharType"), kind); r._r.append(f)
        elif txt == code:
            it = OxmlElement("w:instrText"); it.set(qn("xml:space"), "preserve"); it.text = code; r._r.append(it)
        else: r.text = txt
    return par

def tight(par, before=0, after=2):
    pf = par.paragraph_format; pf.space_before = Pt(before); pf.space_after = Pt(after); pf.line_spacing = 1.0
    return par

def labelled(doc, label, text, color=None, size=None):
    p = tight(doc.add_paragraph())
    r = p.add_run(label + " "); r.bold = True
    r2 = p.add_run(text)
    if color is not None: r2.font.color.rgb = color
    if size: r.font.size = r2.font.size = Pt(size)
    return p

def make_docx():
    doc = Document()
    sec = doc.sections[0]
    sec.page_width, sec.page_height = Inches(8.5), Inches(11)
    sec.left_margin = sec.right_margin = Inches(0.6); sec.top_margin = Inches(0.5); sec.bottom_margin = Inches(0.55)
    sec.footer_distance = Inches(0.3)
    st = doc.styles
    st["Normal"].font.name = "Calibri"; st["Normal"].font.size = Pt(10)
    st["Normal"].element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")
    for name, size, color in (("Title", 22, NAVY), ("Heading 1", 16, NAVY), ("Heading 2", 12, GREEN), ("Heading 3", 11, NAVY)):
        s = st[name]; s.font.name = "Calibri"; s.font.size = Pt(size); s.font.color.rgb = color; s.font.bold = True
        rpr = s.element.get_or_add_rPr(); fonts = rpr.find(qn("w:rFonts"))
        if fonts is None: fonts = OxmlElement("w:rFonts"); rpr.append(fonts)
        for a in ("w:ascii", "w:hAnsi", "w:cs", "w:eastAsia"): fonts.set(qn(a), "Calibri")
        for a in ("w:asciiTheme", "w:hAnsiTheme", "w:cstheme", "w:eastAsiaTheme"):
            if fonts.get(qn(a)) is not None: del fonts.attrib[qn(a)]
    cp = doc.core_properties
    cp.title = G["title"]; cp.author = G["teacher"]; cp.subject = "Every school week: 3 games for Grades 1–3 and 3 for Grades 4–6, with equipment, set-up, how to play, cues and safety"
    cp.created = cp.modified = datetime.datetime(2026, 10, 31, 12, 0, 0); cp.last_modified_by = G["teacher"]; cp.revision = 1
    fp = sec.footer.paragraphs[0]
    r = fp.add_run("%s · %s · Page " % (G["title"], G["teacher"])); r.font.size = Pt(8); r.font.color.rgb = MUTED
    field(fp, "PAGE")
    for run in fp.runs: run.font.size = Pt(8); run.font.color.rgb = MUTED

    # contents
    t = doc.add_paragraph(G["title"], style="Title"); tight(t, 0, 2)
    tight(doc.add_paragraph("%s · %s · every school week: 3 games for Grades 1–3 and 3 for Grades 4–6 that fit the month’s unit · one page per grade band" % (G["teacher"], G["school"])), 0, 6)
    weeks = {w["n"]: w for w in G["weeks"]}
    NB = len(G["bands"]); tab = doc.add_table(rows=0, cols=2 + NB); tab.style = "Table Grid"
    tblpr = tab._tbl.tblPr; mar = OxmlElement("w:tblCellMar")
    for side, v in (("top", 0), ("bottom", 0), ("left", 70), ("right", 70)):
        e = OxmlElement("w:" + side); e.set(qn("w:w"), str(v)); e.set(qn("w:type"), "dxa"); mar.append(e)
    tblpr.append(mar)
    widths = (Inches(0.7), Inches(1.1)) + tuple(Inches(5.5 / NB) for _ in range(NB))
    def row(cells, bold=False, color=None, shade=None, merge=False):
        rw = tab.add_row(); cs = rw.cells
        if merge: cs = [cs[0].merge(cs[-1])]
        for c, txt in zip(cs, cells):
            p = c.paragraphs[0]; tight(p, 0, 0); r = p.add_run(txt); r.font.size = Pt(8.5); r.bold = bold
            if color is not None: r.font.color.rgb = color
            if shade:
                tcpr = c._tc.get_or_add_tcPr(); sh = OxmlElement("w:shd"); sh.set(qn("w:val"), "clear"); sh.set(qn("w:fill"), shade); tcpr.append(sh)
        if not merge:
            for c, wd in zip(rw.cells, widths): c.width = wd
    row(["Week", "Dates"] + [b["label"] for b in G["bands"]], bold=True, color=MUTED)
    for m in G["months"]:
        row(["%s · %s" % (m["name"], m["unit"])], bold=True, color=NAVY, shade="E8EEF7", merge=True)
        for n in m["weeks"]:
            w = weeks[n]
            row(["Week %d" % n, w["range"]] + [" · ".join(g["name"] for g in b["games"]) for b in w["bands"]])
            for b in w["breakAfter"]:
                row(["%s (%s): no school" % (b["name"], b["range"])], color=AMBER, shade="FDF6E6", merge=True)
    tab.autofit = False
    for i, wd in enumerate(widths): tab.columns[i].width = wd
    tight(doc.add_paragraph(), 0, 0)
    p = tight(doc.add_paragraph()); r = p.add_run("Every game has its full card on the PE Playbook: "); r.font.size = Pt(8.5); r.font.color.rgb = MUTED
    hyperlink(p, G["site"] + "games-of-the-week.html", G["site"] + "games-of-the-week.html", bold=False, color="1A2F6B", size=8.5)

    month_seen = set()
    pages = [(w, b, bi == len(w["bands"]) - 1) for w in G["weeks"] for bi, b in enumerate(w["bands"])]
    for w, band, last in pages:
        games = band["games"]
        # Word has no shrink-to-fit, so long weeks get a smaller body size to stay on one page
        score = sum(len(g.get("setup") or "") + len(g.get("safety") or "") + len(g.get("equipment") or "") + len(g.get("reason") or "")
                    + sum(len(x) + 60 for x in (g.get("how") or [])) + sum(len(x) for x in (g.get("cues") or [])) + 150 for g in games)
        fs = max(7.5, min(10.0, round(10 * (3800.0 / max(score, 1)) ** 0.5 * 2) / 2))
        k = tight(doc.add_paragraph(), 0, 0); kr = k.add_run("GAMES OF THE WEEK · %s · %s" % (G["year"], G["teacher"].upper())); kr.font.size = Pt(8); kr.font.color.rgb = MUTED; kr.bold = True
        k.paragraph_format.page_break_before = True
        h = doc.add_paragraph("Week %d · %s" % (w["n"], w["dates"]), style="Heading 1"); tight(h, 0, 1)
        gr = h.add_run("   " + band["label"]); gr.font.color.rgb = GREEN if band["id"] == "g46" else NAVY; gr.font.size = Pt(13)
        u = tight(doc.add_paragraph(), 0, 5); ur = u.add_run("%s: %s" % (w["month"], w["unit"])); ur.bold = True; ur.font.size = Pt(11)
        if w.get("note"):
            nr = u.add_run("   " + w["note"]); nr.font.size = Pt(9); nr.font.color.rgb = AMBER
        for i, g in enumerate(games, 1):
            hp = doc.add_paragraph(style="Heading 2"); tight(hp, 6, 0)
            hp.add_run("%d. " % i)
            hyperlink(hp, g["url"], g["name"], bold=True, color="1F6F4A", size=12)
            meta = " · ".join(x for x in (g.get("type"), ("Grades " + g["grades"]) if g.get("grades") else "", g.get("page")) if x)
            mp = tight(doc.add_paragraph(), 0, 1); mr = mp.add_run(meta); mr.font.size = Pt(8.5); mr.font.color.rgb = MUTED; mr.bold = True
            wp = tight(doc.add_paragraph(), 0, 1); wr = wp.add_run(g["reason"]); wr.italic = True; wr.font.size = Pt(fs)
            labelled(doc, "Equipment:", g.get("equipment") or "See the card", size=fs)
            if g.get("setup"): labelled(doc, "Set-up:", g["setup"], size=fs)
            labelled(doc, "How we play:", "", size=fs)
            for j, step in enumerate(g.get("how") or [], 1):
                sp = tight(doc.add_paragraph(), 0, 0)
                sp.paragraph_format.left_indent = Inches(0.3); sp.paragraph_format.first_line_indent = Inches(-0.2)
                sp.add_run("%d.  %s" % (j, step)).font.size = Pt(fs)
            if g.get("cues"): labelled(doc, "Cues:", " · ".join(g["cues"]), size=fs)
            if g.get("safety"): labelled(doc, "Safety:", g["safety"], color=RGBColor(0x5A, 0x2A, 0x00), size=fs)
        for b in (w["breakAfter"] if last else []):
            bp = tight(doc.add_paragraph(), 6, 2); br = bp.add_run("Next: %s (%s). No school, no games that week." % (b["name"], b["range"])); br.bold = True; br.font.color.rgb = AMBER
        fp2 = tight(doc.add_paragraph(), 6, 0); fr = fp2.add_run(G["house"]); fr.font.size = Pt(8); fr.font.color.rgb = MUTED
    out = os.path.join(ROOT, G["file"] + ".docx")
    doc.save(out)
    print("wrote", G["file"] + ".docx")

make_pdf()
make_docx()
