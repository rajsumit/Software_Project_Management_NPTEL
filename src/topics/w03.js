/* ===== Week 3 (lectures 11-15): project evaluation & programme management ===== */
page({ id: 't-bizcase', wk: 3, topic: 1, stars: 3, lec: [11, 12], title: 'Business case, portfolio & cost categories', kw: 'business case feasibility project portfolio management definition optimization cost benefit tangible intangible direct indirect fixed variable overhead opportunity cash flow forecast', lede: 'Before anyone asks "how do we build it?", someone has to show it is worth building. That is the business case, and the language of costs and benefits it uses.',
  render(b) {
    sorter(b, 'Game: classify the cost or benefit', 'Examples from DPM lecture 12 and the assignments.', [['dir', 'Direct cost'], ['ind', 'Indirect cost (overhead)'], ['var', 'Variable cost'], ['tb', 'Tangible benefit'], ['ib', 'Intangible benefit']], [
      ['Purchase of a box of CDs/diskettes', 'dir'], ['Salary of developers (development cost)', 'dir'], ['Hardware purchase (set-up cost)', 'dir'],
      ['Insurance', 'ind'], ['Building maintenance', 'ind'], ['Air conditioning and lighting', 'ind'], ['Protection of computer centre from heat and fire', 'ind'],
      ['Computer forms, in proportion to processing', 'var'],
      ['Completing jobs in fewer hours', 'tb'], ['Reports produced with no errors', 'tb'], ['Saving manpower costs', 'tb'],
      ['Improved corporate image', 'ib'], ['More satisfied customers', 'ib']]);
    H(b, TRAP('Insurance is indirect AND fixed. Hardware cost is a set-up cost (direct), but the 2026 key gave "salary to staff" as the example of DEVELOPMENT cost (2026 A3 Q1, Q3).', 'Straight-line depreciation, exempt salaries, insurance, a fixed annual licence fee are all FIXED costs (2026 A3 Q4).', 'In 2019 W1: "Once the business case is approved, the feasibility study is undertaken" is FALSE: the feasibility study produces the business case.'));
  } });

page({ id: 't-cba', wk: 3, topic: 1, stars: 3, lec: [12, 13], title: 'Net profit, payback, ROI, NPV, IRR, break-even', kw: 'net profit payback period return on investment ROI present value NPV discount factor IRR internal rate break even investment period return period cash flow', lede: 'The numerical heart of week 3. Four ways to judge a project from its cash flows, and why only NPV/IRR respect the time value of money.',
  gens: ['roi', 'npv', 'payback', 'pv'],
  render(b) {
    const L = lab(b, 'Cash-flow workbench', 'Pick a preset from the lectures/assignments or type your own cash flows (year 0 negative). Everything recomputes live.');
    const presets = { p1: ['Project 1 (lecture)', [-100000, 10000, 10000, 10000, 20000, 100000]], p2: ['Project 2 (= 2026 A3 Q6 Project B)', [-1000000, 200000, 200000, 200000, 200000, 300000]], p3: ['Project 3 (lecture)', [-100000, 30000, 30000, 30000, 30000, 30000]], p4: ['Project 4 (lecture)', [-120000, 30000, 30000, 30000, 30000, 75000]] };
    let cf = presets.p1[1].slice(), r = 10;
    const sel = h('select', { class: 'sel' }, Object.entries(presets).map(([k, v]) => h('option', { value: k }, v[0])));
    const rate = h('input', { type: 'number', value: r, step: 'any' });
    L.add(h('div', { class: 'calc' }, h('div', { class: 'inputs' }, h('label', {}, 'Preset', sel), h('label', {}, 'Discount rate (%)', rate))));
    const tb = h('table', { class: 'etbl' }); L.add(h('div', { class: 'tblwrap' }, tb));
    const addBtn = h('button', { class: 'btn', onclick: () => { cf.push(0); draw(); } }, '+ year'); L.add(addBtn);
    const sc = L.scope({ xmin: 0, xmax: 5, ymin: -1, ymax: 1, xt: 5, yt: 4, h: 230, xl: 'year', yl: 'accumulated cash flow', yfmt: v => fmt(v / 1000, 0) + 'k' });
    L.legend([['accumulated', '--ch-v'], ['accumulated, discounted', '--ch-i']]);
    const ro = L.readout();
    sel.addEventListener('change', () => { cf = presets[sel.value][1].slice(); draw(); }); rate.addEventListener('input', () => { r = +rate.value; draw(); });
    const npvAt = (c, rr) => c.reduce((s, x, t) => s + x / (1 + rr / 100) ** t, 0);
    function irr(c) { let lo = -99, hi = 500; if (npvAt(c, lo) * npvAt(c, hi) > 0) return NaN; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (npvAt(c, lo) * npvAt(c, m) <= 0) hi = m; else lo = m; } return (lo + hi) / 2; }
    function draw() {
      tb.innerHTML = '<tr><th>Year</th><th class="num">Cash flow</th><th class="num">Accumulated</th><th class="num">DF</th><th class="num">Discounted</th><th></th></tr>';
      let acc = 0, accd = 0; const xs = [], ya = [], yd = [];
      cf.forEach((c, t) => { const df = 1 / (1 + r / 100) ** t; acc += c; accd += c * df; xs.push(t); ya.push(acc); yd.push(accd); const inp = h('input', { type: 'number', value: c, step: 1000 }); inp.addEventListener('change', () => { cf[t] = +inp.value; draw(); }); tb.append(h('tr', {}, h('td', {}, String(t)), h('td', {}, inp), h('td', { class: 'num' }, fmt(acc, 0)), h('td', { class: 'num' }, df.toFixed(4)), h('td', { class: 'num' }, fmt(c * df, 0)), h('td', {}, t > 0 ? h('button', { class: 'rm', title: 'remove year', onclick: () => { cf.splice(t, 1); draw(); } }, '×') : ''))); });
      const inv = -cf[0], net = cf.reduce((a, b) => a + b, 0), n = cf.length - 1; let pb = '—'; let a2 = 0; for (let t = 0; t < cf.length; t++) { a2 += cf[t]; if (t > 0 && a2 >= 0) { pb = 'year ' + t; break; } }
      const lo = Math.min(...ya, ...yd, 0), hi = Math.max(...ya, ...yd, 0); sc.set({ xmax: n, xt: n, ymin: lo * 1.1, ymax: Math.max(hi * 1.1, 1) });
      sc.draw([{ x: xs, y: ya, c: '--ch-v', w: 2.5, dots: 3 }, { x: xs, y: yd, c: '--ch-i', w: 2.5, dots: 3 }]);
      const I = irr(cf);
      ro([['net profit', fmt(net, 0)], ['payback', pb], ['ROI', fmt(net / n / inv * 100, 2) + ' %'], ['NPV @ ' + r + ' %', fmt(npvAt(cf, r), 0)], ['IRR', isNaN(I) ? '—' : fmt(I, 2) + ' %']]);
    }
    draw();
    const L2 = lab(b, 'Break-even chart', 'Current (manual) system has low fixed cost and high cost per transaction; the candidate system costs more up front but less per transaction.');
    const sc2 = L2.scope({ xmin: 0, xmax: 120, ymin: 0, ymax: 300, xt: 6, yt: 5, h: 230, xl: 'transactions (thousand)', yl: 'total cost (thousand $)' });
    L2.legend([['current system', '--ch-v'], ['candidate system', '--ch-i']]);
    const ro2 = L2.readout(); const v2 = controls(L2.body, [{ k: 'f1', label: 'Current: fixed cost', min: 0, max: 100, v: 20, d: 0 }, { k: 'c1', label: 'Current: cost / 1000 tx', min: 1, max: 4, step: .1, v: 2.5, d: 1 }, { k: 'f2', label: 'Candidate: fixed cost', min: 20, max: 200, v: 105, d: 0 }, { k: 'c2', label: 'Candidate: cost / 1000 tx', min: .1, max: 3, step: .1, v: 1.2, d: 1 }], () => d2());
    function d2() { const be = v2.c1 > v2.c2 ? (v2.f2 - v2.f1) / (v2.c1 - v2.c2) : NaN; sc2.draw([{ fn: x => v2.f1 + v2.c1 * x, c: '--ch-v' }, { fn: x => v2.f2 + v2.c2 * x, c: '--ch-i' }], { v: isNaN(be) ? [] : [{ x: be, t: 'break-even', c: '--hot-ink' }] }); ro2([['break-even volume', isNaN(be) ? 'never' : fmt(be, 1) + 'k tx'], ['below it', 'investment period: candidate costs more'], ['above it', 'return period: candidate gives more benefit']]); }
    d2();
    H(b, TRAP('Return period = candidate gives MORE benefit than the old system (2026 A3 Q5); investment period = candidate costs MORE (2019 W3 Q6).', 'IRR is inferior to NPV because it may give multiple rates, is harder to compute AND does not show the absolute size of the return → "all of the above" (2019 W3 Q5).', 'Payback ignores everything after break-even; net profit and ROI ignore timing; only NPV/IRR discount.'));
  } });

page({ id: 't-riskeval', wk: 3, topic: 1, stars: 2, lec: [14], title: 'Risk evaluation of projects & decision trees', kw: 'risk evaluation identification ranking risk matrix risk premium NPV cost benefit expected value risk profile sensitivity decision tree', lede: 'A project can be profitable on paper and still a bad bet. Five methods to bring risk into project evaluation.',
  gens: ['exp-income', 'dtree'],
  render(b) {
    const L = lab(b, '5 · Decision tree: extend or replace the sales-order system?', 'Lecture example (DPM 14). Move the probability that the market expands and watch the decision flip.');
    const v = controls(L.body, [{ k: 'p', label: 'P(market expands)', min: 0, max: 1, step: .05, v: .2, d: 2 }], () => d());
    const svgBox = h('div', { class: 'netwrap' }); L.add(svgBox); const ro = L.readout();
    function d() { const p = v.p, eE = (1 - p) * 75000 + p * -100000, eR = p * 250000 + (1 - p) * -50000, best = eE >= eR ? 'E' : 'R';
      const node = (x, y, t, cls) => `<g class="nd${cls ? ' cr' : ''}"><rect x="${x}" y="${y - 16}" width="150" height="32" rx="6"/><text class="nm" x="${x + 75}" y="${y + 5}" text-anchor="middle">${t}</text></g>`;
      svgBox.innerHTML = `<svg class="net" viewBox="0 0 720 260" style="min-width:600px"><path class="ed" d="M90 130 L190 70"/><path class="ed" d="M90 130 L190 190"/><path class="ed" d="M340 70 L470 35"/><path class="ed" d="M340 70 L470 105"/><path class="ed" d="M340 190 L470 155"/><path class="ed" d="M340 190 L470 225"/>
      <g class="se"><rect x="30" y="112" width="60" height="36" rx="4"/><text x="60" y="135" text-anchor="middle">D</text></g>${node(190, 70, 'Extend: E = ' + fmt(eE, 0), best === 'E')}${node(190, 190, 'Replace: E = ' + fmt(eR, 0), best === 'R')}
      ${node(470, 35, `expands (${p.toFixed(2)}): −100,000`)}${node(470, 105, `no (${(1 - p).toFixed(2)}): 75,000`)}${node(470, 155, `expands (${p.toFixed(2)}): 250,000`)}${node(470, 225, `no (${(1 - p).toFixed(2)}): −50,000`)}</svg>`;
      ro([['E(extend)', fmt(eE, 0)], ['E(replace)', fmt(eR, 0)], ['decision', best === 'E' ? 'extend the existing system' : 'replace now']]); }
    d();
    H(b, `<p class="cap">At p = 0.2: extend = 0.8×75,000 − 0.2×100,000 = <b>40,000</b>; replace = 0.2×250,000 − 0.8×50,000 = <b>10,000</b> → extend (the slide's text says −$500,000 but its calculation uses −$50,000, as in the textbook).</p>`);
    H(b, TRAP('Use a decision tree when you must decide whether a risk matters and choose a course of action (2019 W3 Q8).', 'A project <b>risk matrix</b> belongs to "risk identification and ranking" (2026 A3 Q7).', 'In C-B analysis for risk: consider each outcome, its probability and value (2026 A3 Q8). Categorising projects and assigning a risk premium is "risk and NPV".', 'For a risky project use a HIGHER discount rate (2019 W3 Q7).'));
  } });

page({ id: 't-programme', wk: 3, topic: 1, stars: 2, lec: [15], title: 'Programme & benefits management', kw: 'programme management strategic business cycle infrastructure research development innovative partnership programme manager project manager mandate brief vision blueprint benefits quantified valued', lede: 'Several related projects managed together can deliver benefits none of them gives alone. Short lecture, steady source of one-mark questions.',
  render(b) {
    sorter(b, 'Game: which type of programme?', 'Match each description to the programme type.', [['str', 'Strategic'], ['bc', 'Business cycle'], ['inf', 'Infrastructure'], ['rd', 'Research & development'], ['ip', 'Innovative partnership']], [
      ['Projects implementing a single strategy', 'str'], ['All projects in this year\'s budget', 'bc'], ['Common network and data centre for all departments', 'inf'], ['New innovative product from lab research', 'rd'], ['Joint product with a university and another company', 'ip'], ['Portfolio of projects contributing to a common objective (OGC)', 'str']]);
    sorter(b, 'Game: how measurable is the benefit?', 'From DPM lecture 15 and 2019 W3 Q10.', [['qv', 'Quantified and valued'], ['qn', 'Quantified but not valued'], ['iq', 'Identified, not easily quantified']], [
      ['Reduction of 3 staff saving Rs. 18 lakh per year', 'qv'], ['10 % decrease in customer complaints', 'qn'], ['Public approval for the organisation in its locality', 'iq'], ['Local administration approval for a mobile tower', 'iq'], ['Processing time cut from 5 to 2 days', 'qn']]);
    H(b, TRAP('Innovative partnerships = collaboration of DIFFERENT organisations (2026 A3 Q9).', 'Programme managers have PERSONAL, not impersonal, relationships with skilled resources (2026 A3 Q10). By the textbook table, "minimise demand" and "projects as distinct/unique" are project-manager traits too: if asked as MSQ, think about them.'));
  } });
