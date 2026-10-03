#!/usr/bin/env python3
"""Crawl the site and check every internal link and #anchor in the rendered pages
(so anchors that JavaScript creates, like game cards, count too).
Needs: python3 + playwright + Chrome.   Usage:
  python3 tools/check-links.py                 # serves this folder on a local port
  python3 tools/check-links.py https://scaemrfung.github.io/pe-playbook/   # check the live site
Exit code 1 if anything is broken. Anchors that only exist for a renamed game (old #hula-hut etc.)
are followed through the redirect map in chrome.js, like a browser would."""
import asyncio, http.server, os, re, socketserver, sys, threading, urllib.parse
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = next((p for p in ("/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser") if os.path.exists(p)), None)

def serve():
    os.chdir(ROOT)
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    srv = socketserver.TCPServer(("127.0.0.1", 0), Q)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, "http://127.0.0.1:%d/" % srv.server_address[1]

async def main(base):
    pages = sorted(f for f in os.listdir(ROOT) if f.endswith(".html")) if base.startswith("http://127") else None
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=["--no-sandbox"]) if CHROME else await p.chromium.launch()
        ctx = await b.new_context(viewport={"width": 1200, "height": 900})
        if pages is None:  # live site: start from index and follow links
            pages = ["index.html"]
        seen, queue, links, ids_by_page, bad = set(), list(pages), [], {}, []
        renamed = {}
        while queue:
            f = queue.pop(0)
            if f in seen: continue
            seen.add(f)
            pg = await ctx.new_page()
            r = await pg.goto(base + f, wait_until="networkidle")
            if not r or r.status != 200:
                bad.append((f, "(page itself)", "HTTP %s" % (r.status if r else "none"))); await pg.close(); continue
            # redirect pages (videos.html, month.html ...) end up elsewhere: record the final file
            final = urllib.parse.urlparse(pg.url).path.split("/")[-1] or "index.html"
            data = await pg.evaluate("""() => ({
              ids: [...document.querySelectorAll('[id]')].map(e => e.id),
              hrefs: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')),
              srcs: [...document.querySelectorAll('script[src],link[href]')].map(e => e.getAttribute('src') || e.getAttribute('href')),
              renamed: window.RENAMED_GAMES ? 1 : 0 })""")
            ids_by_page[f] = set(data["ids"])
            for h in data["hrefs"]:
                if re.match(r"^(https?:|mailto:|tel:|javascript:|data:)", h) and not h.startswith(base): continue
                u = urllib.parse.urlparse(h)
                tgt = u.path if u.path else f
                if not tgt or tgt.endswith("/"): tgt = "index.html" if (not tgt or tgt == "/") else tgt
                links.append((f, h, tgt, urllib.parse.unquote(u.fragment)))
                if tgt.endswith(".html") and tgt not in seen: queue.append(tgt)
                elif not tgt.endswith(".html") and "." in tgt: links.append((f, h, tgt, "FILE"))
            for s in data["srcs"]:
                if s and not s.startswith(("http", "data:")): links.append((f, s, s.split("?")[0], "FILE"))
            await pg.close()
        # old anchors that chrome.js redirects to a renamed card
        src = open(os.path.join(ROOT, "chrome.js"), encoding="utf8").read()
        m = re.search(r"var IDS = \{([\s\S]*?)\};", src)
        if m: renamed = dict(re.findall(r'"([^"]+)":\s*"([^"]+)"', m.group(1)))
        checked_files = {}
        for f, h, tgt, frag in links:
            if frag == "FILE":
                if tgt not in checked_files:
                    if base.startswith("http://127"): checked_files[tgt] = os.path.exists(os.path.join(ROOT, urllib.parse.unquote(tgt)))
                    else:
                        rr = await ctx.request.get(base + tgt); checked_files[tgt] = rr.status == 200
                if not checked_files[tgt]: bad.append((f, h, "missing file"))
                continue
            if tgt.endswith(".html") and tgt not in ids_by_page:
                bad.append((f, h, "page not found")); continue
            if frag and tgt in ids_by_page and frag not in ids_by_page[tgt] and renamed.get(frag) not in ids_by_page[tgt]:
                bad.append((f, h, "anchor #%s not on %s" % (frag, tgt)))
        print("pages checked: %d, links checked: %d" % (len(seen), len(links)))
        for x in sorted(set(bad)): print("BROKEN", *x)
        print("PROBLEMS:", len(set(bad)))
        await b.close()
        return 1 if bad else 0

if __name__ == "__main__":
    srv = None
    if len(sys.argv) > 1: base = sys.argv[1].rstrip("/") + "/"
    else: srv, base = serve()
    sys.exit(asyncio.run(main(base)))
