#!/usr/bin/env python3
"""Take three sections out of every weekly plan Word file in weekly-plans/ (Mr. Fung, Oct 28 2026):
  "Notes for teacher", "Curriculum outcomes ..." and "Game & activity links used this week".
Each section is its heading plus everything after it (paragraphs and tables) up to the next heading
of the same or a higher level. Everything else in the file is left byte-for-byte as it was.

Before the links section is removed, its links are saved to weekly-plans-links.json, because the
site's week view (tools/weekly-view.js) puts each of those links on its game card.

Idempotent: a file with none of the sections is not touched. Run by tools/build.js.
  python3 tools/strip-plan-sections.py          strip + update the links file
  python3 tools/strip-plan-sections.py --check  exit 1 if any file still has one of the sections
"""
import json, os, re, sys, zipfile, io
from lxml import etree

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PLANS = os.path.join(ROOT, "weekly-plans")
SIDECAR = os.path.join(ROOT, "weekly-plans-links.json")
W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
q = lambda t: "{%s}%s" % (W, t)
SECTIONS = [
    ("notes", re.compile(r"^notes for teachers?\b", re.I)),
    ("outcomes", re.compile(r"^curriculum outcomes\b", re.I)),
    ("links", re.compile(r"^(game\s*(&|and)\s*activity\s+)?links used this week\b", re.I)),
]

def text_of(el):
    out = []
    for n in el.iter(q("t"), q("tab"), q("br")):
        out.append(n.text or "" if n.tag == q("t") else " ")
    return "".join(out)

def heading_level(p):
    st = p.find("./%s/%s" % (q("pPr"), q("pStyle")))
    if st is None: return None
    m = re.match(r"^(?:Heading|heading)\s*(\d)$", st.get(q("val"), "")) or (re.match(r"^Title$", st.get(q("val"), "")) and re.match(r"(.)", "0"))
    return int(m.group(1)) if m else None

def links_of(p, rels):
    segs = []
    for ch in p:
        if ch.tag == q("hyperlink"):
            rid = ch.get("{%s}id" % R)
            segs.append((text_of(ch), rels.get(rid)))
        elif ch.tag == q("r"):
            segs.append((text_of(ch), None))
    urls = [(t, u) for t, u in segs if u]
    if not urls: return []
    label = re.sub(r":\s*$", "", "".join(t for t, u in segs if not u).strip()).strip()
    return [{"label": label, "text": t.strip(), "url": u} for t, u in urls]

def process(path, check):
    z = zipfile.ZipFile(path)
    xml = z.read("word/document.xml")
    root = etree.fromstring(xml)
    body = root.find(q("body"))
    rels = {}
    rx = etree.fromstring(z.read("word/_rels/document.xml.rels"))
    for r in rx:
        rels[r.get("Id")] = r.get("Target")
    kids = list(body)
    remove, found, links = [], set(), []
    i = 0
    while i < len(kids):
        el = kids[i]
        lvl = heading_level(el) if el.tag == q("p") else None
        hit = None
        if lvl is not None:
            t = text_of(el).strip()
            hit = next((k for k, rx_ in SECTIONS if rx_.search(t)), None)
        if not hit:
            i += 1; continue
        found.add(hit)
        remove.append(el)
        j = i + 1
        while j < len(kids):
            e = kids[j]
            if e.tag == q("sectPr"): break
            l2 = heading_level(e) if e.tag == q("p") else None
            if l2 is not None and l2 <= lvl: break
            if hit == "links" and e.tag == q("p"): links.extend(links_of(e, rels))
            remove.append(e); j += 1
        i = j
    z.close()
    if not found or check:
        return found, links
    for e in remove: body.remove(e)
    new = etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True)
    src = zipfile.ZipFile(path)
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as out:
        for info in src.infolist():
            data = new if info.filename == "word/document.xml" else src.read(info.filename)
            out.writestr(info, data, compress_type=info.compress_type)
    src.close()
    with open(path, "wb") as f: f.write(buf.getvalue())
    return found, links

def main():
    check = "--check" in sys.argv
    side = json.load(open(SIDECAR, encoding="utf-8")) if os.path.exists(SIDECAR) else {}
    changed, left = [], []
    for name in sorted(os.listdir(PLANS)):
        if not name.endswith(".docx"): continue
        found, links = process(os.path.join(PLANS, name), check)
        if not found: continue
        if check: left.append("%s (%s)" % (name, ", ".join(sorted(found)))); continue
        if links: side[name] = links
        changed.append("%s: removed %s" % (name, ", ".join(sorted(found))))
    if check:
        if left: print("Weekly plans still have sections to remove:\n  " + "\n  ".join(left)); sys.exit(1)
        return
    if changed:
        with open(SIDECAR, "w", encoding="utf-8") as f:
            json.dump(dict(sorted(side.items())), f, ensure_ascii=False, indent=1); f.write("\n")
        for c in changed: print("  weekly plan " + c)

if __name__ == "__main__":
    main()
