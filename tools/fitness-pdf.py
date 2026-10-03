#!/usr/bin/env python3
"""Build Monthly_Fitness_Checklist_Grades_1-6.pdf from the MONTHS array in fitness.html.
Needs: python3 + reportlab, node.   Usage: python3 tools/fitness-pdf.py
Edit the month tasks in fitness.html, then rerun so the PDF never drifts from the page."""
import json, os, subprocess, sys
from reportlab.pdfgen import canvas
from reportlab.lib.utils import simpleSplit

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "Monthly_Fitness_Checklist_Grades_1-6.pdf")
JS = r'''
const s=require("fs").readFileSync(process.argv[1],"utf8");
const m=/const MONTHS = (\[[\s\S]*?\n    \]);/.exec(s);
console.log(JSON.stringify(eval(m[1])));'''
MONTHS = json.loads(subprocess.check_output(["node", "-e", JS, os.path.join(ROOT, "fitness.html")]))

NAVY=(.101961,.184314,.419608); GREEN=(.176471,.415686,.309804); GREY=(.352941,.396078,.439216)
BOX=(.933333,.960784,.984314); RULE=(.772549,.815686,.847059)
H, HB, HI = "Helvetica", "Helvetica-Bold", "Helvetica-Oblique"
L, R = 39.6, 572.4
TOTAL = 1 + len(MONTHS)

c = canvas.Canvas(OUT, pagesize=(612, 792))
c.setTitle("Monthly Fitness Checklist · Grades 1–6"); c.setAuthor("SCA Elementary PE")
c.setSubject("Private monthly fitness checklist, Grades 1–6")

def col(rgb, stroke=False):
    (c.setStrokeColorRGB if stroke else c.setFillColorRGB)(*rgb)

def header(title, sub):
    col(NAVY); c.rect(0, 756, 612, 36, stroke=0, fill=1)
    c.setFillColorRGB(1, 1, 1)
    c.setFont(HB, 11); c.drawString(L, 771.84, title)
    c.setFont(H, 8); c.drawString(L, 761.76, sub)

def footer(n):
    col(GREY); c.setFont(H, 8)
    c.drawString(L, 25.2, "SCA Elementary PE · Grades 1–6 · Private fitness · Not for ranking")
    c.drawString(552.384, 25.2, "%d / %d" % (n, TOTAL))

def wrap(text, font, size, width):
    return simpleSplit(text, font, size, width)

# ---------- page 1 ----------
header("Monthly Fitness Checklist · Grades 1–6", "How to do each station · private student record")
col(NAVY); c.setFont(HB, 12); c.drawString(L, 738, "Teacher & student guidelines")
GUIDE = [
 "Private record only. Do not post scores, read numbers aloud, or rank the class.",
 "Students compare only to their own earlier month — never to a classmate.",
 "Stop any station that causes sharp pain. Tell the teacher.",
 "Modifications are success: march instead of skip, knee plank, walk–jog instead of run.",
 "Grades 1–2: teacher may help count. Short bouts (15–30 seconds).",
 "Grades 3–4: quiet self-count. Grades 5–6: self-count; optional private goal.",
 "One sheet per student per month. Teacher dates and initials. Keep sheets private.",
]
y = 738 - 15.84
c.setFillColorRGB(0, 0, 0)
for g in GUIDE:
    lines = wrap(g, H, 9, R - 57.6)
    col(NAVY); c.circle(46.8, y + 2.7, 1.5, stroke=0, fill=1)
    c.setFillColorRGB(0, 0, 0); c.setFont(H, 9)
    for i, ln in enumerate(lines):
        c.drawString(57.6, y, ln); y -= 11 if i < len(lines) - 1 else 14
y -= 6
col(GREEN); c.setFont(HB, 11); c.drawString(L, y, "How to do the standard stations")
y -= 12.96
STD = [
 ("Pulse check", "Stand still after activity. Two fingers on neck or wrist (not thumb). Count beats for 15 seconds. Write the number privately."),
 ("Skip / march", "30 seconds. Rope optional. Soft landings. High-knee march or jump-the-river is full success."),
 ("Shuttle", "Two lines 4–8 m apart. Easy walk–jog, touch, return. Freeze on the whistle. No racing."),
 ("Sit-and-reach", "Sit, legs forward. Slow reach toward toes. No bouncing. Stop at a gentle stretch."),
 ("Hold", "Knee plank, wall sit, still shape, balance, or parachute hold 10–20 seconds. Steady breath. Lower if it hurts."),
 ("Skill count", "Dribble, wall-pass, stick-handle, catch–throw, keep-up, or underhand send for 20–30 seconds. Private count only."),
]
for name, txt in STD:
    col(NAVY); c.setFont(HB, 9); c.drawString(L, y, name)
    c.setFillColorRGB(0, 0, 0); c.setFont(H, 8.5)
    lines = wrap(txt, H, 8.5, R - 111.6)
    for i, ln in enumerate(lines):
        c.drawString(111.6, y, ln); y -= 11 if i < len(lines) - 1 else 14
last_base = y + 14
btop = last_base - 14.8
col(BOX); col(RULE, True); c.setLineWidth(0.7)
c.roundRect(36, btop - 75.6, 540, 75.6, 6, stroke=1, fill=1)
col(NAVY); c.setFont(HB, 10); c.drawString(L + 3.6, btop - 20.16, "Student folder label (optional)")
c.setFillColorRGB(0, 0, 0); c.setFont(H, 9)
for i, t in enumerate(["Name: ________________________________ Grade: ______ Year: __________",
                       "Teacher: Mr. Fung                           Class: ________________________",
                       "I know this is my private record. Student initial (optional): ______  Date: __________"]):
    c.drawString(L + 3.6, btop - 36 - i * 12.96, t)
footer(1); c.showPage()

# ---------- month pages ----------
def month_page(n, M):
    header("%s Fitness Checklist" % M["name"], "%s · %s" % (M["theme"], M["focus"]))
    c.setFillColorRGB(0, 0, 0); c.setFont(H, 9)
    c.drawString(L, 743.04, "Name: ______________________  Grade: ______  Date: __________  Teacher initial: ______")
    col(GREEN); c.setFont(HB, 10); c.drawString(L, 728.64, "Stations — how to do each one")
    col(RULE, True); c.setLineWidth(0.7); c.line(L, 724.32, R, 724.32)
    y = 712.8
    for t in M["tasks"]:
        col(NAVY, True); c.setLineWidth(0.9); c.rect(L, y - 0.5, 8, 8, stroke=1, fill=0)
        col(NAVY); c.setFont(HB, 9); c.drawString(54, y, t["title"])
        y -= 9.36
        c.setFillColorRGB(0, 0, 0); c.setFont(H, 8)
        for b in t["how"]:
            lines = wrap(b, H, 8, R - 54 - 8)
            for i, ln in enumerate(lines):
                c.drawString(54 if i == 0 else 60, y, ("• " + ln) if i == 0 else ln); y -= 10
        col(GREY); c.setFont(H, 7.5)
        c.drawString(54, y, "My count / note: ______________________   Felt:  easy  ·  just right  ·  hard")
        y -= 22.5
    top = y + 10
    tips = []
    for lab, key in (("1–2: ", "g12"), ("5–6: ", "g56")):
        tips += wrap(lab + M[key], H, 8, 520)
    bh = 61.2 + 10 * (len(tips) - 2)
    col(BOX); col(RULE, True); c.roundRect(36, top - bh, 540, bh, 6, stroke=1, fill=1)
    col(NAVY); c.setFont(HB, 8); c.drawString(L + 3.6, top - 10.08, "Grade band tips")
    c.setFillColorRGB(0, 0, 0); c.setFont(H, 8)
    ty = top - 21.6
    for ln in tips:
        c.drawString(L + 3.6, ty, ln); ty -= 10
    bottom = top - bh
    c.setFont(H, 8); c.drawString(L, bottom - 8.64, "One thing that felt stronger: ____________________________________________________")
    col(GREY); c.setFont(HI, 7)
    c.drawString(L, bottom - 18.72, "House rules: soft effort, private numbers, freeze on the whistle, stop if it hurts.")
    assert bottom - 18.72 > 40, (M["name"], bottom)
    footer(n); c.showPage()

for i, M in enumerate(MONTHS):
    month_page(i + 2, M)
c.save()
print("wrote", OUT, TOTAL, "pages")
