/* ===== Week 5 (lectures 21-25): COCOMO, COCOMO II, Halstead, staffing ===== */
const COCOMO_MODES = { organic: { a: 2.4, b: 1.05, c: 0.38, ai: 3.2, d: 'Familiar, stable environment; product similar to earlier ones; small team; e.g. accounting, student information system (< 50 KDSI)' }, semidetached: { a: 3.0, b: 1.12, c: 0.35, ai: 3.0, d: 'Between the two; mixed experience; e.g. compilers, linkers, utility programs' }, embedded: { a: 3.6, b: 1.20, c: 0.32, ai: 2.8, d: 'New, innovative; tight hardware/interface constraints; e.g. operating systems, real-time systems' } };
page({ id: 't-cocomo', wk: 5, topic: 1, stars: 3, lec: [21, 22], title: 'COCOMO 81: basic, intermediate, complete', kw: 'COCOMO Boehm organic semidetached embedded effort development time KLOC person months EAF cost drivers RELY MODP complete detailed subsystem', lede: 'Boehm\'s Constructive Cost Model (1981, 63 projects): size in KLOC goes in, effort, duration and staffing come out.',
  gens: ['cocomo-effort', 'cocomo-tdev', 'cocomo-staff', 'cocomo-int'],
  render(b) {
    const L = lab(b, 'COCOMO 81 calculator', 'Lecture examples to try: organic 32 KLOC → 91 PM, 14 months; embedded 50 KLOC → 394 PM, 17 months, 23 people; organic 7.5 KLOC → 20 PM, 8 months.');
    let mode = 'organic'; segmented(L.body, [['organic', 'Organic'], ['semidetached', 'Semi-detached'], ['embedded', 'Embedded']], mode, k => { mode = k; d(); });
    const desc = h('p', { class: 'cap' }); L.add(desc);
    const v = controls(L.body, [{ k: 'kloc', label: 'Size (KLOC)', min: 2, max: 200, step: .5, v: 32, d: 1 }, { k: 'sal', label: 'Cost per PM (Rs.)', min: 5000, max: 200000, step: 1000, v: 15000, d: 0 }], () => d());
    const ro = L.readout();
    const sc = L.scope({ xmin: 0, xmax: 200, ymin: 0, ymax: 1500, xt: 5, yt: 5, h: 220, xl: 'KLOC', yl: 'effort (PM)' }); L.legend([['organic', '--ch-d'], ['semi-detached', '--ch-v'], ['embedded', '--ch-i']]);
    const sc2 = L.scope({ xmin: 0, xmax: 200, ymin: 0, ymax: 40, xt: 5, yt: 4, h: 180, xl: 'KLOC', yl: 'Tdev (months)' });
    function d() { const m = COCOMO_MODES[mode], E = m.a * v.kloc ** m.b, T = 2.5 * E ** m.c; desc.textContent = m.d; ro([['effort', fmt(E, 1) + ' PM'], ['Tdev', fmt(T, 1) + ' months'], ['average staff', fmt(E / T, 1)], ['productivity', fmt(v.kloc * 1000 / E, 0) + ' LOC/PM'], ['cost', 'Rs. ' + fmt(E * v.sal, 0)]]);
      const cols = { organic: '--ch-d', semidetached: '--ch-v', embedded: '--ch-i' };
      sc.draw(Object.keys(COCOMO_MODES).map(k => ({ fn: x => COCOMO_MODES[k].a * x ** COCOMO_MODES[k].b, c: cols[k], w: k === mode ? 3 : 1.5 })), { v: [{ x: v.kloc, t: fmt(E, 0) + ' PM' }] });
      sc2.draw(Object.keys(COCOMO_MODES).map(k => ({ fn: x => 2.5 * (COCOMO_MODES[k].a * x ** COCOMO_MODES[k].b) ** COCOMO_MODES[k].c, c: cols[k], w: k === mode ? 3 : 1.5 })), { v: [{ x: v.kloc, t: fmt(T, 1) + ' months' }] }); }
    d();
    H(b, `<p class="cap">Notice in the lower plot that the three Tdev curves almost coincide: development time is roughly independent of the mode, because larger and more complex products have more parallel activities.</p>`);
    const drivers = [['RELY Required reliability', [.75, .88, 1, 1.15, 1.40]], ['DATA Database size', [null, .94, 1, 1.08, 1.16]], ['CPLX Product complexity', [.70, .85, 1, 1.15, 1.30]], ['TIME Execution time constraint', [null, null, 1, 1.11, 1.30]], ['STOR Memory constraint', [null, null, 1, 1.06, 1.21]], ['VIRT Virtual machine volatility', [null, .87, 1, 1.15, 1.30]], ['TURN Turnaround time', [null, .87, 1, 1.07, 1.15]], ['ACAP Analyst capability', [1.46, 1.19, 1, .86, .71]], ['AEXP Application experience', [1.29, 1.13, 1, .91, .82]], ['PCAP Programmer capability', [1.42, 1.17, 1, .86, .70]], ['VEXP Virtual machine experience', [1.21, 1.10, 1, .90, null]], ['LEXP Language experience', [1.14, 1.07, 1, .95, null]], ['MODP Modern practices', [1.24, 1.10, 1, .91, .82]], ['TOOL Software tools', [1.24, 1.10, 1, .91, .83]], ['SCED Schedule', [1.23, 1.08, 1, 1.04, 1.10]]];
    const LV = ['very low', 'low', 'nominal', 'high', 'very high'];
    const L2 = lab(b, 'Intermediate COCOMO: set the cost drivers', 'Lecture example 1: 10 KLOC organic, ACAP low, AEXP low, PCAP low, LEXP high → EAF 1.49, effort 40 PM, 10.2 months.');
    const v2 = controls(L2.body, [{ k: 'E0', label: 'Basic COCOMO effort (PM)', min: 5, max: 500, step: .1, v: 26.9, d: 1 }], () => c2());
    const tb = h('table', { class: 'etbl' }); L2.add(h('div', { class: 'tblwrap' }, tb)); const rating = drivers.map(() => 2); const ro2 = L2.readout();
    drivers.forEach(([n, vals], i) => { const s = h('select', { class: 'sel' }, vals.map((x, j) => x == null ? null : h('option', { value: j, selected: j === 2 }, `${LV[j]} (${x})`)).filter(Boolean)); s.addEventListener('change', () => { rating[i] = +s.value; c2(); }); tb.append(h('tr', {}, h('td', {}, n), h('td', {}, s))); });
    L2.add(h('button', { class: 'btn', onclick: () => { const set = { 7: 1, 8: 1, 9: 1, 11: 3 }; $$('select', tb).forEach((s, i) => { rating[i] = set[i] != null ? set[i] : 2; s.value = rating[i]; }); v2.E0 = 26.9; c2(); } }, 'Load lecture example 1'));
    function c2() { const eaf = drivers.reduce((p, d, i) => p * d[1][rating[i]], 1), E = v2.E0 * eaf, T = 2.5 * E ** 0.38; ro2([['EAF', eaf.toFixed(3)], ['adjusted effort', fmt(E, 1) + ' PM'], ['Tdev (organic c)', fmt(T, 1) + ' months'], ['staff', fmt(E / T, 1)]]); }
    c2();
    H(b, `<p class="cap">Slide note: DPM's intermediate-COCOMO slide also lists nominal constants a = 3.2 (organic), 3.0 (semi), 2.8 (embedded) with the same exponents; the worked examples instead take the basic-COCOMO effort and multiply by the EAF, as here. The analyst-capability "high" value appears as 0.86 in the table and 0.80 in one example. If a question gives the multiplier, just use it.</p>`);
    const L3 = lab(b, 'Complete COCOMO: add up heterogeneous sub-systems', 'Lecture MIS example: database part semi-detached, GUI organic, communication embedded. Each is estimated with its own mode and the costs are summed (2026 A5 Q4 distributed DSS).');
    const subs = [['Database', 'semidetached', 20], ['GUI', 'organic', 15], ['Communication', 'embedded', 10]]; const st = h('table', { class: 'etbl' }); L3.add(h('div', { class: 'tblwrap' }, st)); const ro3 = L3.readout();
    function c3() { st.innerHTML = '<tr><th>Sub-system</th><th>Mode</th><th class="num">KLOC</th><th class="num">Effort (PM)</th></tr>'; let tot = 0, ks = 0; subs.forEach((s, i) => { const m = COCOMO_MODES[s[1]], E = m.a * s[2] ** m.b; tot += E; ks += s[2]; const sel = h('select', { class: 'sel' }, Object.keys(COCOMO_MODES).map(k => h('option', { value: k, selected: k === s[1] }, k))); sel.addEventListener('change', () => { s[1] = sel.value; c3(); }); const inp = h('input', { type: 'number', value: s[2], min: 1 }); inp.addEventListener('change', () => { s[2] = Math.max(1, +inp.value); c3(); }); st.append(h('tr', {}, h('td', {}, s[0]), h('td', {}, sel), h('td', {}, inp), h('td', { class: 'num' }, fmt(E, 1)))); }); const one = 3.0 * ks ** 1.12; ro3([['sum of sub-systems', fmt(tot, 1) + ' PM'], ['whole system as ONE semi-detached', fmt(one, 1) + ' PM'], ['total KLOC', ks]]); }
    c3();
    H(b, TRAP('Organic: accounting system, student information system. Semi-detached: compilers, linkers. Embedded: OS, real-time systems (2026 A5 Q2).', 'Stringent reliability scales UP; modern programming practices scale DOWN (2026 A5 Q3, 2019 W5 Q3).', 'Size is the most fundamental attribute in COCOMO (2019 W5 Q2).'));
  } });

page({ id: 't-cocomo2', wk: 5, topic: 1, stars: 2, lec: [23], title: 'COCOMO II', kw: 'COCOMO II application composition early design reuse post architecture scale factors PREC FLEX RESL TEAM PMAT effort multipliers object points NAP productivity DSI SLOC', lede: 'Boehm\'s 1995 update for reuse, GUIs and component-based development: four sub-models used at different stages of the same project.',
  gens: ['cocomo2-exp', 'appcomp'],
  render(b) {
    const L = lab(b, 'Scale factors and effort multipliers', 'Lecture example: PREC very high 1.24, FLEX very low 5.07, RESL high 2.83, TEAM high 2.19, PMAT low 6.24 → B = 1.0857; 10 KSLOC → 35.8 PM; with RCPX 1.91, PDIF 1.81, PERS 0.50 → 61.9 PM.');
    const SF = { PREC: [6.20, 4.96, 3.72, 2.48, 1.24, 0], FLEX: [5.07, 4.05, 3.04, 2.03, 1.01, 0], RESL: [7.07, 5.65, 4.24, 2.83, 1.41, 0], TEAM: [5.48, 4.38, 3.29, 2.19, 1.10, 0], PMAT: [7.80, 6.24, 4.68, 3.12, 1.56, 0] };
    const EM = { RCPX: [0.49, 0.60, 0.83, 1.00, 1.33, 1.91, 2.72], RUSE: [null, null, 0.95, 1.00, 1.07, 1.15, 1.24], PDIF: [null, null, 0.87, 1.00, 1.29, 1.81, 2.61], PERS: [2.12, 1.62, 1.26, 1.00, 0.83, 0.63, 0.50], PREX: [1.59, 1.33, 1.12, 1.00, 0.87, 0.74, 0.62], FCIL: [1.43, 1.30, 1.10, 1.00, 0.87, 0.73, 0.62], SCED: [null, 1.43, 1.14, 1.00, 1.00, 1.00, null] };
    const LS = ['very low', 'low', 'nominal', 'high', 'very high', 'extra high'], LE = ['extra low', 'very low', 'low', 'nominal', 'high', 'very high', 'extra high'];
    const sfr = { PREC: 4, FLEX: 0, RESL: 3, TEAM: 3, PMAT: 1 }, emr = { RCPX: 3, RUSE: 3, PDIF: 3, PERS: 3, PREX: 3, FCIL: 3, SCED: 3 };
    const grid = h('div', { class: 'calc' }), inp = h('div', { class: 'inputs' }); grid.append(inp); L.add(grid);
    const ks = h('input', { type: 'number', value: 10, step: 'any' }); inp.append(h('label', {}, 'Size (KSLOC)', ks)); ks.addEventListener('input', c);
    Object.keys(SF).forEach(k => { const s = h('select', {}, SF[k].map((x, j) => h('option', { value: j, selected: j === sfr[k] }, `${LS[j]} (${x})`))); s.addEventListener('change', () => { sfr[k] = +s.value; c(); }); inp.append(h('label', {}, 'SF ' + k, s)); });
    Object.keys(EM).forEach(k => { const s = h('select', {}, EM[k].map((x, j) => x == null ? null : h('option', { value: j, selected: j === emr[k] }, `${LE[j]} (${x})`)).filter(Boolean)); s.addEventListener('change', () => { emr[k] = +s.value; c(); }); inp.append(h('label', {}, 'EM ' + k, s)); });
    const ro = L.readout();
    function c() { const sum = Object.keys(SF).reduce((s, k) => s + SF[k][sfr[k]], 0), B = 0.91 + 0.01 * sum, size = +ks.value || 0, nom = 2.94 * size ** B, em = Object.keys(EM).reduce((p, k) => p * EM[k][emr[k]], 1), pm = nom * em, tdev = 3 * pm ** (0.33 + 0.2 * (B - 1.01)); ro([['Σ scale factors', sum.toFixed(2)], ['exponent B', B.toFixed(4)], ['nominal PM', fmt(nom, 1)], ['Π EM', em.toFixed(3)], ['effort', fmt(pm, 1) + ' PM'], ['TDEV = 3·PM^(0.33+0.2(B−1.01))', fmt(tdev, 1) + ' months']]); }
    c();
    H(b, `${TBL(['Scale factor', 'Meaning', 'Very low … extra high'], [['PREC', 'Degree to which there are past examples that can be consulted', 'thoroughly unprecedented … thoroughly familiar'], ['FLEX', 'Degree of flexibility in implementing the project', 'rigorous … general goals'], ['RESL', 'Degree of uncertainty about requirements (architecture/risk resolution)', 'little (20 %) … full (100 %)'], ['TEAM', 'How well the team works together', 'very difficult … seamless interactions'], ['PMAT', 'Process maturity, weighted sum of 18 CMM KPAs', '']])}
    ${TRAP('Requirements known, design not started → <b>early design</b> (2026 A5 Q5, 2019 W5 Q6). Most accurate → <b>post-architecture</b> (2019 W5 Q5).', 'Post-architecture: effort from the design specification AND evaluating the impact of cost drivers and scale factors (2026 A5 Q6, two answers).', 'RESL = uncertainty about requirements, not "past examples" (that is PREC) (2019 W5 Q7).', 'Application points count screens, reports and modules (AI mock 4 Q30).')}`);
  } });

page({ id: 't-halstead', wk: 5, topic: 1, stars: 2, lec: [24], title: "Halstead's software science", kw: 'Halstead operators operands length vocabulary volume potential minimum volume program level effort time mental discriminations empirical heuristic analytical', lede: 'An analytical technique: count operators and operands, and derive length, volume, effort and time. Best known for estimating maintenance effort.',
  gens: ['halstead', 'halstead-e'],
  render(b) {
    const L = lab(b, 'Halstead counter', 'Type a small C fragment. This counter follows the lecture rules approximately (keywords and paired brackets count as one operator each; identifiers and constants are operands; declarations are skipped).');
    const ta = h('textarea', { rows: 4, class: 'sel', style: 'width:100%;font:600 .95rem var(--f-mono)' }); ta.value = 'x = a + b;\ny = x * x;\nprint(y);'; L.add(ta);
    const out = h('div', { class: 'ivtxt' }); L.add(out); const ro = L.readout();
    function count() {
      const src = ta.value.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').replace(/\b(int|float|double|char|long|short|void|unsigned)\s+[\w\s,*\[\]=0-9]*;/g, '');
      const toks = src.match(/[A-Za-z_]\w*|\d+(?:\.\d+)?|==|!=|<=|>=|&&|\|\||\+\+|--|\+=|-=|\*=|\/=|->|<<|>>|[-+*\/%=<>!&|^~?:;,.(){}\[\]]/g) || [];
      const KW = ['if', 'else', 'while', 'for', 'do', 'switch', 'case', 'default', 'return', 'break', 'continue', 'goto'];
      const ops = {}, opd = {}; let N1 = 0, N2 = 0; const add = (m, k) => { m[k] = (m[k] || 0) + 1; };
      toks.forEach((t, i) => { if (t === ')' || t === '}' || t === ']') return; if (t === '(') { if (i > 0 && /^[A-Za-z_]\w*$/.test(toks[i - 1]) && !KW.includes(toks[i - 1])) return; add(ops, '()'); N1++; return; } if (t === '{') { add(ops, '{}'); N1++; return; } if (t === '[') { add(ops, '[]'); N1++; return; } if (t === 'else') return; if (KW.includes(t)) { add(ops, t === 'if' ? 'if…else' : t); N1++; return; } if (/^[A-Za-z_]\w*$/.test(t) && toks[i + 1] === '(') { add(ops, t + '()'); N1++; return; } if (/^[A-Za-z_]\w*$|^\d/.test(t)) { add(opd, t); N2++; return; } add(ops, t); N1++; });
      const n1 = Object.keys(ops).length, n2 = Object.keys(opd).length, N = N1 + N2, eta = n1 + n2, V = eta > 1 ? N * Math.log2(eta) : 0, Vs = (2 + n2) * Math.log2(2 + n2), Lv = V ? Vs / V : 0, E = Lv ? V / Lv : 0;
      out.innerHTML = `Operators: ${Object.entries(ops).map(([k, c]) => `<code>${k.replace(/</g, '&lt;')}</code>×${c}`).join(' ')}<br>Operands: ${Object.entries(opd).map(([k, c]) => `<code>${k}</code>×${c}`).join(' ')}`;
      ro([['η₁ / η₂', n1 + ' / ' + n2], ['N₁ / N₂', N1 + ' / ' + N2], ['length N', N], ['vocabulary η', eta], ['volume V', fmt(V, 1) + ' bits'], ['V* (η₂* = η₂)', fmt(Vs, 1)], ['level L = V*/V', fmt(Lv, 3)], ['effort E = V²/V*', fmt(E, 0)], ['time T = E/18', fmt(E / 18, 1) + ' s']]);
    }
    ta.addEventListener('input', count); count();
    H(b, `<p class="cap">Lecture examples: <code>a = &b;</code> → operands a, b; operators =, &, ;. <code>func(a, b);</code> → operators func, ",", ";" and operands a, b. (In the real method η₂* in V* is the number of input/output parameters of the algorithm; here it is approximated by η₂.)</p>
    ${TRAP('Programming effort varies as the SQUARE of the volume (2026 A5 Q8). Higher-level language → LESS effort (2019 W5 Q8).', 'Halstead is analytical, not expert judgement; Delphi and expert judgement are the "educated guess" techniques (2026 A5 Q1, Q7).', 'Halstead is especially useful for estimating MAINTENANCE effort; it gives gross estimates for large collections, inaccurate for individual cases.')}`);
  } });

page({ id: 't-staffing', wk: 5, topic: 1, stars: 3, lec: [25], title: 'Staffing: Rayleigh, Putnam, Jensen', kw: 'staffing level Rayleigh curve Norden Putnam technology constant Ck schedule compression fourth power Jensen square Boehm 75 percent Brooks law adding manpower late project', lede: 'How many people when, and what happens if the customer wants it sooner. The favourite numerical: "time halved → effort ×16".',
  gens: ['putnam', 'jensen'],
  render(b) {
    const L = lab(b, 'Rayleigh staffing curve', 'Effort K is the area under the curve; t<sub>d</sub> is where staffing peaks. Compress t<sub>d</sub> and watch the area (effort) explode under Putnam.');
    const v = controls(L.body, [{ k: 'td', label: 'Development time t_d (months)', min: 6, max: 24, step: .5, v: 12, d: 1 }, { k: 'K0', label: 'Effort at nominal 12 months (PM)', min: 20, max: 300, v: 100, d: 0 }], () => d());
    let law = 'putnam'; segmented(L.body, [['putnam', 'Putnam (1/t⁴)'], ['jensen', 'Jensen (1/t²)']], law, k => { law = k; d(); });
    const sc = L.scope({ xmin: 0, xmax: 50, ymin: 0, ymax: 30, xt: 10, yt: 5, h: 230, xl: 'month', yl: 'people' }); const ro = L.readout();
    function d() { const p = law === 'putnam' ? 4 : 2, K = v.K0 * (12 / v.td) ** p, a = 1 / (2 * v.td * v.td), m = t => 2 * K * a * t * Math.exp(-a * t * t), pk = m(v.td); sc.set({ ymax: Math.max(10, Math.ceil(pk * 1.2 / 5) * 5) }); sc.draw([{ fn: m, c: '--ch-i', fill: true, w: 2.5 }], { v: [{ x: v.td, t: 't_d (peak)' }, { x: 9, t: '75 % of nominal', c: '--bad', dy: 14 }] }); ro([['effort K', fmt(K, 0) + ' PM'], ['× nominal effort', fmt(K / v.K0, 2)], ['peak staff', fmt(pk, 1)], ['Boehm check', v.td < 9 ? 'below 75 % of 12 months: very unlikely to succeed' : 'within the feasible region']]); }
    d();
    const L2 = lab(b, 'Compression calculator', 'The two laws side by side.');
    const v2 = controls(L2.body, [{ k: 't1', label: 'Nominal time (months)', min: 3, max: 36, v: 18, d: 0 }, { k: 't2', label: 'Required time (months)', min: 2, max: 36, v: 9, d: 0 }], () => d2()); const ro2 = L2.readout();
    function d2() { const r = v2.t1 / v2.t2; ro2([['time ratio', fmt(r, 3)], ['Putnam effort ×', fmt(r ** 4, 2)], ['Jensen effort ×', fmt(r ** 2, 2)], ['% of nominal', fmt(v2.t2 / v2.t1 * 100, 0) + ' %']]); }
    d2();
    H(b, `<p class="cap">Check against the assignments: 18 → 9 months, Putnam → 16× (2019 W5 Q9). 18 → 6 months, Jensen → 9× (2026 A5 Q10). 1 year → 6 months: Putnam 16×, Jensen 4×.</p>
    ${TRAP('Putnam uses the FOURTH power, Jensen the SQUARE. Read which model the question names.', 'Boehm\'s limit is 75 % of the nominal time (not 25 % or 50 %) (2019 W5 Q10).', '"Increased project scope" is NOT a reason why adding people delays a late project (2026 A5 Q9).')}`);
  } });
