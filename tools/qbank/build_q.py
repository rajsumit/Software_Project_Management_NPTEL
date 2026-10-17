import json, re, sys
sys.path.insert(0, '/home/claude/spm/data')
from a19 import A19
from exp19 import EXP19
from expai import EXPAI

def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

# ---------------- 2026 assignments
T26 = {
1: ['t-intro'] * 7 + ['t-pm'] * 3,
2: ['t-waterfall', 't-waterfall', 't-proto', 't-proto'] + ['t-agile'] * 6,
3: ['t-bizcase'] * 4 + ['t-cba', 't-cba', 't-riskeval', 't-riskeval', 't-programme', 't-programme'],
4: ['t-estbasics', 't-esttech', 't-esttech', 't-esttech', 't-esttech'] + ['t-fp'] * 5,
5: ['t-esttech', 't-cocomo', 't-cocomo', 't-cocomo', 't-cocomo2', 't-cocomo2', 't-halstead', 't-halstead', 't-staffing', 't-staffing'],
6: ['t-wbs'] * 3 + ['t-cpm'] * 7,
7: ['t-pert', 't-pert', 't-people', 't-org', 't-people', 't-people', 't-org', 't-people', 't-people', 't-people'],
8: ['t-resource'] * 4 + ['t-costsched', 't-costsched', 't-monitor', 't-monitor', 't-monitor', 't-review'],
9: ['t-codereview'] * 3 + ['t-visual'] + ['t-eva'] * 5 + ['t-backontrack'],
10: ['t-scm'] * 5 + ['t-contract'] * 4 + ['t-closeout'],
11: ['t-quality', 't-iso', 't-iso', 't-cmm', 't-cmm', 't-cmm', 't-cmm', 't-cmm', 't-quality', 't-quality'],
12: ['t-cmmi'] * 4 + ['t-reliab'] * 3 + ['t-relgrowth'] * 3,
}
T19 = {
1: ['t-intro', 't-intro', 't-intro', 't-intro', 't-bizcase', 't-intro', 't-pm', 't-pm', 't-intro', 't-intro'],
2: ['t-agile'] * 6 + ['t-waterfall'] + ['t-agile'] * 3,
3: ['t-bizcase'] * 4 + ['t-cba', 't-cba', 't-riskeval', 't-riskeval', 't-programme', 't-programme'],
4: ['t-estbasics', 't-estbasics'] + ['t-esttech'] * 4 + ['t-fp'] * 4,
5: ['t-cocomo'] * 4 + ['t-cocomo2'] * 3 + ['t-halstead', 't-staffing', 't-staffing'],
6: ['t-wbs'] + ['t-cpm'] * 9,
7: ['t-people'] * 6 + ['t-org'] * 3 + ['t-risk'],
8: ['t-resource'] * 4 + ['t-costsched', 't-costsched', 't-monitor', 't-monitor', 't-monitor', 't-review'],
9: ['t-codereview'] * 3 + ['t-visual', 't-visual'] + ['t-eva'] * 4 + ['t-backontrack'],
10: ['t-scm'] * 4 + ['t-contract'] * 4 + ['t-closeout'] * 2,
11: ['t-quality', 't-iso', 't-cmm', 't-quality', 't-cmm', 't-iso', 't-cmmi', 't-quality', 't-cmm', 't-testing'],
12: ['t-reliab', 't-reliab', 't-testing', 't-testing', 't-relgrowth', 't-relgrowth', 't-reliab', 't-reliab', 't-reliab', 't-testing'],
}
raw = json.load(open('/home/claude/spm/data/a26_raw.json'))
Q = []
fix_sol = {
(4, 5): "Effort = size / productivity = 90,000 SLOC ÷ 500 SLOC per person-month = 180 person-months.",
(5, 8): "In Halstead's software science E = V/L and L = V*/V, so E = V²/V*: programming effort varies as the square of the volume V (V measures the information content from operators and operands).",
(5, 10): "Jensen's model (a softened Putnam model) gives effort ∝ 1/td². Compressing 18 months to 6 months is a ratio of 3, so effort grows 3² = 9 times. (Putnam's model would give 3⁴ = 81 times.)",
(10, 9): "Services are intangible activities done for the client (training, documentation, insurance arrangements, telecom facilities). Equipment and consumables are tangible goods, so (a) and (d) are NOT services. The official key text printed 'c. Consumables' but consumables is option (d); the solution itself says (a) and (d).",
}
notes = {
(3, 10): " <br><b>Watch out:</b> in the textbook table (Hughes, Cotterell & Mall), the programme manager has <i>personal</i> relationships with skilled resources, <i>optimises</i> resource use and sees projects as <i>similar</i>; 'minimise demand' and 'projects as unique' are project-manager traits. The official key marks only (b); if the exam asks this as an MSQ, (c) and (d) are also project-manager traits.",
(7, 7): " <br><i>The official solution itself flagged option (a) as doubtful.</i>",
(7, 9): " <br><i>The official solution flagged option (c) as doubtful: task significance is about the impact of the job on other people, not just 'understanding importance'.</i>",
(2, 7): " <br>Lecture slides: sprint 'target duration is one month' (not exactly) and 'no changes entertained during a sprint'.",
}
for q in raw:
    w, n = q['wk'], q['n']
    stem = q['stem']
    stem = re.sub(r'\(doubt on\s*option [a-z]\)', '', stem).strip()
    opts = [o.rstrip(' .') for o in q['opts']]
    ans = q['ans']
    if (w, n) == (10, 9):
        ans = [0, 3]
        opts = ['Equipment', 'Training', 'Documentation', 'Consumables', 'Transitional insurance arrangements', 'Providing telecommunication facilities', 'All of these']
    text = esc(stem)
    if (w, n) == (3, 6):
        text = 'What will be the ROI for the following project details?<div class="tblwrap"><table class="mini"><tr><th>Year</th><th>Cash flow, project B (Rs.)</th></tr>' + ''.join(f'<tr><td>{y}</td><td>{c}</td></tr>' for y, c in [(0, '−1,000,000'), (1, '200,000'), (2, '200,000'), (3, '200,000'), (4, '200,000'), (5, '300,000')]) + '</table></div>'
    if (w, n) == (6, 6):
        text = 'Which activities have zero float (slack) in the network in the PERT chart shown?'
    if (w, n) in ((6, 7), (6, 8)):
        text = text.replace('above ', '').replace('given ', '')
    sol = fix_sol.get((w, n), q['sol'])
    sol = esc(sol) + notes.get((w, n), '')
    single = len(ans) == 1 and re.search(r'\b(one|What will|How many|known as|represents|is NOT true|is used|would be|primarily used|is true of|the proper|the period)\b', stem, re.I)
    item = dict(id=f'A26-{w}-{n}', src='A26', wk=w, n=n, type='mcq' if single else 'msq', text=text, opts=[esc(o) for o in opts], ans=ans, exp=sol, topic=T26[w][n - 1])
    if w == 6 and n in (6, 7, 8):
        item['fig'] = 'brigette'
    Q.append(item)

# ---------------- 2019 assignments
figs19 = {(6, 2): 'net19', (6, 3): 'cnode19', (6, 4): 'cnode19'}
for (w, n, stem, opts, ans) in A19:
    item = dict(id=f'A19-{w}-{n}', src='A19', wk=w, n=n, type='mcq', text=esc(stem), opts=[esc(o) for o in opts], ans=ans, exp=esc(EXP19[(w, n)]), topic=T19[w][n - 1])
    if (w, n) in figs19: item['fig'] = figs19[(w, n)]
    Q.append(item)

# ---------------- NPTEL AI mock papers
VID = dict(x.split('=') for x in open('/home/claude/spm/videos.txt').read().split())
def lec_of(src):
    if src in VID.values():
        return int([k for k, v in VID.items() if v == src][0])
    best, bl = 0, None
    for k, v in VID.items():
        s = sum(a == b for a, b in zip(v[::-1], src[::-1]))
        if s > best: best, bl = s, int(k)
    return bl
ai = json.load(open('/home/claude/spm/data/ai_raw.json'))
for q in ai:
    key = f"{q['p']}.{q['n']}"
    topic, e = EXPAI[key]
    lec = lec_of(q['src'])
    wk = {'t-intro':1,'t-pm':1,'t-waterfall':2,'t-proto':2,'t-agile':2,'t-bizcase':3,'t-cba':3,'t-riskeval':3,'t-programme':3,'t-estbasics':4,'t-esttech':4,'t-fp':4,'t-cocomo':5,'t-cocomo2':5,'t-halstead':5,'t-staffing':5,'t-wbs':6,'t-cpm':6,'t-pert':7,'t-people':7,'t-org':7,'t-risk':7,'t-resource':8,'t-costsched':8,'t-monitor':8,'t-review':8,'t-codereview':9,'t-visual':9,'t-eva':9,'t-backontrack':9,'t-scm':10,'t-contract':10,'t-closeout':10,'t-quality':11,'t-iso':11,'t-cmm':11,'t-cmmi':12,'t-reliab':12,'t-relgrowth':12,'t-testing':12}[topic]
    Q.append(dict(id=f'AI-{q["p"]}-{q["n"]}', src='AI', paper=q['p'], wk=wk, n=q['n'], type='mcq', diff=q['diff'], text=esc(q['stem']), opts=[esc(o) for o in q['opts']], ans=[q['ans']], exp=esc(e), topic=topic, lec=lec))

open('/home/claude/spm/site/qbank.js', 'w').write('/* Question bank: 2026 assignments (official solutions), 2019 assignments (accepted answers), NPTEL AI mock papers 1-5 */\nwindow.QBANK=' + json.dumps(Q, ensure_ascii=False, separators=(',', ':')) + ';\n')
from collections import Counter
print(len(Q), Counter(q['src'] for q in Q), Counter(q['type'] for q in Q if q['src']=='A26'))
print(Counter(q['topic'] for q in Q))
