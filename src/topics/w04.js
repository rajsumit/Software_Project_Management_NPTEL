/* ===== Week 4 (lectures 16-20): estimation basics, techniques, function points ===== */
page({ id: 't-estbasics', wk: 4, topic: 1, stars: 2, lec: [16], title: 'Planning & estimation basics', kw: 'project planning SPMP sliding window estimation sequence size effort duration cost person month 152 hours pricing factors Parkinson Weinberg underestimate', lede: 'Planning starts only after feasibility is established. Its first job: turn a vague problem into size, effort, duration and cost numbers.',
  gens: ['pm-hours'],
  render(b) {
    const L = lab(b, 'Over- vs under-estimating', 'Move the estimate relative to the true effort. Parkinson punishes generous estimates, aggressive ones damage morale and quality.');
    const sc = L.scope({ xmin: 50, xmax: 150, ymin: 0, ymax: 160, xt: 5, yt: 4, h: 210, xl: 'estimate as % of true effort', yl: 'actual effort %' });
    const ro = L.readout(); const v = controls(L.body, [{ k: 'e', label: 'Estimate (% of true)', min: 50, max: 150, v: 100, d: 0, unit: '%' }], () => d());
    const act = e => e >= 100 ? e * 0.85 + 15 : 100 + (100 - e) * 1.1;
    function d() { sc.draw([{ fn: act, c: '--ch-i' }, { fn: x => x, c: '--muted', dash: [5, 4], w: 1 }], { v: [{ x: v.e, t: 'your estimate', c: '--ch-v' }], h: [{ y: 100, t: 'true effort', c: '--muted' }] }); ro([['actual effort', fmt(act(v.e), 0) + ' %'], ['what happens', v.e > 105 ? 'Parkinson: work expands to fill the time' : v.e < 95 ? 'Underestimate: low morale, substandard rushed work, may be abandoned' : 'Realistic: least total effort']]); }
    d();
    H(b, TRAP('A person-month is 152 h, not 160 or 172 (2026 A4 Q1, 2019 W4 Q1).', 'COCOMO order is size, effort, duration, cost (2019 W4 Q2).', 'Underestimating: no overspend, but the system is usually unfinished; research shows motivation drops with highly aggressive targets.'));
  } });

page({ id: 't-esttech', wk: 4, topic: 1, stars: 3, lec: [17, 18], title: 'Estimation techniques: expert, Delphi, analogy, top-down, bottom-up', kw: 'top down bottom up parametric algorithmic expert judgement Delphi weighted average consensus analogy price to win lines of code LOC shortcomings calibration empirical heuristic analytical', lede: 'From an educated guess to a calibrated formula: which technique to use when, and why lines of code is a poor size measure.',
  gens: ['simple-effort', 'three-point'],
  render(b) {
    const L = lab(b, 'Delphi vs a group meeting', 'Five experts estimate the same module. In a face-to-face meeting the dominant senior pulls everyone to his number; in Delphi, anonymous rounds with circulated rationale converge on the evidence.');
    const sc = L.scope({ xmin: 0, xmax: 4, ymin: 0, ymax: 60, xt: 4, yt: 6, h: 230, xl: 'round', yl: 'estimate (person-days)', xfmt: v => 'R' + v });
    let mode = 'delphi'; segmented(L.body, [['delphi', 'Delphi (anonymous)'], ['meet', 'Open meeting with a dominant expert']], mode, k => { mode = k; d(); }); const ro = L.readout();
    const truth = 30, start = [18, 26, 31, 44, 52], boss = 50;
    function d() { const ser = start.map((s0, i) => { const xs = [0], ys = [s0]; let e = s0; for (let r = 1; r <= 4; r++) { const target = mode === 'delphi' ? truth + (s0 - truth) * 0.1 : boss; e = e + (target - e) * 0.55; xs.push(r); ys.push(e); } return { x: xs, y: ys, c: ['--ch-v', '--ch-d', '--ch-b', '--ch-x', '--ch-i'][i], w: 2, dots: 3 }; }); sc.draw(ser, { h: [{ y: truth, t: 'true effort 30', c: '--muted' }] }); const fin = ser.map(s => s.y[4]), avg = fin.reduce((a, b) => a + b, 0) / 5; ro([['final average', fmt(avg, 1)], ['error', fmt(avg - truth, 1)], ['why', mode === 'delphi' ? 'anonymity removes group-think and dominance' : 'group-think: the loudest voice wins']]); }
    d();
    H(b, TRAP('Price-to-win is "most appropriate when detailed information is lacking" (2019 W4 Q4).', 'Analogy suits modifying an existing system; Delphi\'s key advantage over one expert is freedom from individual bias (2026 A4 Q2, Q3).', 'Calibration is a STRENGTH of algorithmic models, not a limitation (2026 A4 Q4).', 'COCOMO and Halstead are NOT expert-judgement techniques; only expert judgement and Delphi are "educated guess" (2026 A5 Q1, Q7).', '"LOC depends on the complexity of the requirements" is NOT a reason LOC is poor (2019 W4 Q3).'));
  } });

page({ id: 't-fp', wk: 4, topic: 1, stars: 3, lec: [19, 20], title: 'Function points: IFPUG, Mark II, COSMIC', kw: 'function point IFPUG Albrecht external input output inquiry internal logical file external interface file UFP VAF TDI general system characteristics 14 AFP Mark II Symons COSMIC Cfsu feature point object point', lede: 'Function points measure size from the user\'s view of the requirements, so you can size a system before a line of code exists.',
  gens: ['ufp', 'vaf', 'afp', 'mk2', 'cosmic'],
  render(b) {
    const L = lab(b, 'Function point calculator', 'Enter counts per complexity. Presets: the lecture spell-checker (UFP 55) and 2026 A4 Q10 (UFP 969).');
    const K = ['EI', 'EO', 'EQ', 'ILF', 'EIF'], WT = { EI: [3, 4, 6], EO: [4, 5, 7], EQ: [3, 4, 6], ILF: [7, 10, 15], EIF: [5, 7, 10] }, NAMES = { EI: 'External inputs', EO: 'External outputs', EQ: 'External inquiries', ILF: 'Internal logical files', EIF: 'External interface files' };
    let cnt = { EI: [0, 2, 0], EO: [0, 3, 0], EQ: [0, 2, 0], ILF: [0, 1, 0], EIF: [0, 2, 0] }; let di = Array(14).fill(3);
    const presets = { spell: ['Spell checker (UFP 55)', { EI: [0, 2, 0], EO: [0, 3, 0], EQ: [0, 2, 0], ILF: [0, 1, 0], EIF: [0, 2, 0] }], a4: ['2026 A4 Q10: 80/60/50/10/7', { EI: [0, 80, 0], EO: [0, 60, 0], EQ: [0, 50, 0], ILF: [0, 10, 0], EIF: [0, 7, 0] }], dpm: ['DPM: 50/40/35/6/4 (UFP 628)', { EI: [0, 50, 0], EO: [0, 40, 0], EQ: [0, 35, 0], ILF: [0, 6, 0], EIF: [0, 4, 0] }], pay: ['Payroll example (UFP 30)', { EI: [0, 1, 1], EO: [0, 1, 0], EQ: [0, 0, 0], ILF: [0, 1, 0], EIF: [1, 0, 0] }] };
    const ps = h('select', { class: 'sel' }, Object.entries(presets).map(([k, v]) => h('option', { value: k }, v[0]))); L.add(h('div', { class: 'calc' }, h('div', { class: 'inputs' }, h('label', {}, 'Preset', ps))));
    const tb = h('table', { class: 'etbl' }); L.add(h('div', { class: 'tblwrap' }, tb));
    const gsc = ['Data communication', 'Distributed data processing', 'Performance objectives', 'Heavily used configuration', 'Transaction rate', 'On-line data entry', 'End-user efficiency', 'On-line update', 'Complex processing', 'Reusability', 'Conversion & install ease', 'Operational ease', 'Multiple-site use', 'Facilitate change'];
    const det = h('details', {}, h('summary', {}, '14 general system characteristics (degree of influence 0-5)')); L.add(det); const gwrap = h('div', { class: 'ctls' }); det.append(gwrap);
    const allBtns = h('div', { class: 'flowline' }); [0, 3, 5].forEach(k => allBtns.append(h('button', { class: 'btn', onclick: () => { di = Array(14).fill(k); drawG(); calcF(); } }, 'All = ' + k))); det.append(allBtns);
    const ro = L.readout();
    function drawT() { tb.innerHTML = '<tr><th>Component</th><th class="num">Low</th><th class="num">Average</th><th class="num">High</th><th class="num">Points</th></tr>'; K.forEach(k => { const tr = h('tr', {}, h('td', {}, `${NAMES[k]} (${WT[k].join('/')})`)); [0, 1, 2].forEach(i => { const inp = h('input', { type: 'number', min: 0, value: cnt[k][i] }); inp.addEventListener('input', () => { cnt[k][i] = Math.max(0, +inp.value || 0); calcF(); }); tr.append(h('td', {}, inp)); }); tr.append(h('td', { class: 'num', 'data-k': k })); tb.append(tr); }); }
    function drawG() { gwrap.innerHTML = ''; gsc.forEach((g, i) => { const id = 'g' + i, out = h('output', {}, String(di[i])), inp = h('input', { type: 'range', min: 0, max: 5, value: di[i], id }); inp.addEventListener('input', () => { di[i] = +inp.value; out.textContent = inp.value; calcF(); }); gwrap.append(h('div', { class: 'ctl' }, h('label', { for: id }, (i + 1) + '. ' + g), inp, out)); }); }
    function calcF() { let ufp = 0; K.forEach(k => { const p = cnt[k].reduce((s, c, i) => s + c * WT[k][i], 0); ufp += p; const td = $(`[data-k="${k}"]`, tb); if (td) td.textContent = p; }); const tdi = di.reduce((a, b) => a + b, 0), vaf = 0.65 + 0.01 * tdi; ro([['UFP', ufp], ['TDI', tdi], ['VAF', vaf.toFixed(2)], ['AFP = UFP × VAF', fmt(ufp * vaf, 2)], ['size @ 59 LOC/FP (Java)', fmt(ufp * vaf * 59 / 1000, 2) + ' KLOC']]); }
    ps.addEventListener('change', () => { cnt = JSON.parse(JSON.stringify(presets[ps.value][1])); drawT(); calcF(); });
    drawT(); drawG(); calcF();
    H(b, TRAP('FP is NOT computed from code (2026 A4 Q6); "Number of operations" / "External operations" is not a component (2026 A4 Q7, 2019 W4 Q7).', '14 GSCs, not 12/13/15 (2019 W4 Q8). All DI = 5 → TDI 70 → VAF 1.35, not 70 (2026 A4 Q8).', '"Hard to fudge" and "language independent" are advantages; "ignores algorithmic complexity" and "needs extensive training" are limitations (2026 A4 Q9).', 'Embedded systems → COSMIC (2019 W4 Q10).'));
  } });
