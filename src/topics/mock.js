/* ===== Full timed mock exam + results analysis ===== */
page({ id: 'mock-exam', mod: 'home', title: 'Timed mock exam (3 h)', kw: 'mock test exam timed full paper practice result analysis score section', render(body) {
  const KEY = 'mock', HKEY = 'mockhist';
  const BANK = {}; (window.QBANK || []).forEach(q => BANK[q.id] = q);
  const TT = {}; PAGES.forEach(p => { if (p.topic) TT[p.id] = p.title; });
  const AW = {}; (window.QBANK || []).filter(q => q.src !== 'AI').forEach(q => AW[q.topic] = (AW[q.topic] || 0) + 1);
  let M = store.get(KEY, null), tick = null, tShow = 0;
  /* runtime view: bank question (with option permutation) or generated question stored in the paper */
  const QM = (m, id) => { if (m && m.gq && m.gq[id]) return m.gq[id]; const q = BANK[id], p = m && m.perm && m.perm[id]; if (!q) return null; if (p) return Object.assign({}, q, { opts: p.map(i => q.opts[i]), ans: q.ans.map(a => p.indexOf(a)) }); return q; };
  const Q = id => QM(M, id);
  const save = () => store.set(KEY, M);
  const fmtT = s => { s = Math.max(0, Math.round(s)); const hh = Math.floor(s / 3600), mm = Math.floor(s % 3600 / 60), ss = s % 60; return (hh ? hh + ':' : '') + String(mm).padStart(2, '0') + ':' + String(ss).padStart(2, '0'); };
  const left = () => M.dur - (Date.now() - M.start) / 1000;
  onLeave(() => { if (tick) clearInterval(tick); document.body.classList.remove('exam-on'); if (M && !M.done) { flushTime(); save(); } });
  /* ---------------------------------------------------------- paper */
  function seenCount() { const hist = store.get(HKEY, []), s = {}; hist.forEach(x => (x.qs || []).forEach(id => s[id] = (s[id] || 0) + 1)); return s; }
  function makePaper(n1, n2, mcqOnly, sec2) {
    const seen = seenCount(), pref = a => shuffle(a).sort((x, y) => (seen[x.id] || 0) - (seen[y.id] || 0));
    const ALL = window.QBANK || [], heavy = [2, 3, 5, 6, 7, 9, 4, 8, 10, 11, 12, 1];
    const quota = {}; for (let w = 1; w <= 12; w++) quota[w] = Math.floor(n1 / 12); for (let i = 0; i < n1 - Math.floor(n1 / 12) * 12; i++) quota[heavy[i]]++;
    const ok = q => !mcqOnly || q.type === 'mcq'; const used = new Set(), tUsed = {};
    let s1 = [];
    for (let w = 1; w <= 12; w++) { const pool = pref(ALL.filter(q => q.wk === w && ok(q))); const a26 = pool.filter(q => q.src === 'A26'), a19 = pool.filter(q => q.src === 'A19'), ai = pool.filter(q => q.src === 'AI'); const order = []; for (let k = 0; k < 20; k++) { [a26, a19, a26, ai, a19].forEach(arr => { if (arr[k]) order.push(arr[k]); }); } const pick = []; for (const q of order) { if (pick.length >= quota[w]) break; if (used.has(q.id) || (tUsed[q.topic] || 0) >= 2) continue; used.add(q.id); tUsed[q.topic] = (tUsed[q.topic] || 0) + 1; pick.push(q); } if (pick.length < quota[w]) for (const q of order) { if (pick.length >= quota[w]) break; if (!used.has(q.id)) { used.add(q.id); pick.push(q); } } s1 = s1.concat(pick); }
    const perm = {}; s1.forEach(q => { if (q.src === 'AI') perm[q.id] = shuffle(q.opts.map((_, i) => i)); });
    s1 = shuffle(s1);
    const gq = {}, s2 = [], pass = {};
    if (sec2 === 'nat') { const names = shuffle(GEN.names); for (let i = 0; i < n2; i++) { const q = GEN.make(names[i % names.length]); gq[q.id] = q; s2.push(q.id); } }
    else { const num = shuffle(['invest', 'size', 'sched', 'eva', 'risk', 'reliab', 'compress', 'halstead']), th = shuffle(['caseStartup', 'caseAvionics', 'caseScrum', 'caseConfig', 'casePeople', 'caseClose']); const plan = []; let ni = 0, ti = 0, cnt = 0; while (cnt < n2) { const name = (plan.length % 3 === 2 ? th[ti++ % th.length] : num[ni++ % num.length]); const p = GEN.passage(name); plan.push(p); pass[p.name + plan.length] = { title: p.title, html: p.html }; p.qs.forEach((q, i) => { if (cnt >= n2) return; q.passKey = p.name + plan.length; q.passIdx = i + 1; q.passage = null; delete q.passHtml; gq[q.id] = q; s2.push(q.id); cnt++; }); } }
    return { qs: s1.map(q => q.id).concat(s2), perm, gq, pass, sec: [['Section I · MCQ', 0, s1.length], ['Section II · ' + (sec2 === 'nat' ? 'numerical' : 'passages'), s1.length, s1.length + s2.length]] };
  }
  function startExam(len, mins, mcqOnly, sec2) {
    let P;
    if (len === 'all240') { const A = (window.QBANK || []).filter(q => q.src === 'A26' || q.src === 'A19'); P = { qs: A.map(q => q.id), perm: {}, gq: {}, pass: {}, sec: [['Assignments 2026', 0, 120], ['Assignments 2019', 120, 240]] }; }
    else { const [n1, n2] = { 50: [30, 20], 25: [15, 10], 10: [6, 4] }[len]; P = makePaper(n1, n2, mcqOnly, sec2); }
    M = Object.assign({ v: 3, start: Date.now(), dur: mins * 60, ans: {}, mark: {}, vis: {}, t: {}, chg: {}, first: {}, cur: 0, done: false, len }, P); save(); render();
  }
  /* ---------------------------------------------------------- grading */
  const norm = (q, a) => a == null || a === '' || (Array.isArray(a) && !a.length) ? null : a;
  function isRight(q, a) { if (norm(q, a) == null) return false; if (q.type === 'nat') { const v = parseFloat(String(a).replace(/,/g, '')); return !isNaN(v) && v >= q.lo - 1e-9 && v <= q.hi + 1e-9; } if (q.type === 'mcq') return q.ans[0] === a; const A = new Set(q.ans); return a.length === A.size && a.every(x => A.has(x)); }
  const ansTxt = (q, a) => norm(q, a) == null ? '—' : q.type === 'nat' ? String(a) : q.type === 'mcq' ? L(a) : a.map(L).join(', ');
  const keyTxt = q => q.type === 'nat' ? `${q.show || (q.lo + q.hi) / 2} (accepted ${q.lo} to ${q.hi})` : q.ans.map(L).join(', ');
  /* ---------------------------------------------------------- start screen */
  function startScreen() {
    body.innerHTML = '';
    H(body, `<div class="crumb"><span>Exam simulation</span><span class="pill hot">Section I + Section II</span></div><h1>Timed mock exam</h1><p class="lede">A full paper with countdown, question palette, mark-for-review and auto-submit, like the NPTEL exam screen. When you submit you get an analysis: where to focus, which mistakes were avoidable, which areas only need revision.</p>`);
    if (M && !M.done && left() > 0) { const c = h('div', { class: 'card', style: 'border-left:5px solid var(--hot)' }); c.innerHTML = `<h3>Exam in progress</h3><p>${Object.keys(M.ans).length} of ${M.qs.length} answered · ${fmtT(left())} left. The clock kept running while you were away, as in the real exam.</p>`; c.append(h('button', { class: 'btn primary', onclick: () => render() }, 'Resume exam'), ' ', h('button', { class: 'btn', onclick: () => { M.done = true; finish(); } }, 'Submit it now')); body.append(c); }
    else if (M && !M.done) { M.done = true; finish(true); return; }
    const card = h('div', { class: 'card' }); body.append(card); card.innerHTML = '<h3>Exam settings</h3>';
    const row = h('div', { class: 'inputs' }); card.append(h('div', { class: 'calc' }, row));
    const nSel = h('select', { class: 'sel' }, [['50', '50 questions: 30 + 20 (full paper)'], ['25', '25 questions: 15 + 10 (half paper)'], ['10', '10 questions: 6 + 4 (quick check)'], ['all240', 'All 240 assignment questions (practice, scored out of 240)']].map(([v, t]) => h('option', { value: v }, t)));
    const tSel = h('select', { class: 'sel' }, [[360, '6 hours (for all 240)'], [180, '180 minutes (real)'], [90, '90 minutes'], [36, '36 minutes'], [20, '20 minutes']].map(([v, t]) => h('option', { value: v }, t))); tSel.value = '180';
    const m1 = h('select', { class: 'sel' }, h('option', { value: '1' }, 'Single-correct MCQ only (as reported)'), h('option', { value: '0' }, 'Include multiple-select (harder, 2026 style)'));
    const s2 = h('select', { class: 'sel' }, h('option', { value: 'pas' }, 'Passages / case studies (expected)'), h('option', { value: 'nat' }, 'Standalone numericals (like Charging Infra)'));
    nSel.addEventListener('change', () => { tSel.value = { 50: 180, 25: 90, 10: 36, all240: 360 }[nSel.value]; });
    row.append(h('label', {}, 'Length', nSel), h('label', {}, 'Time', tSel), h('label', {}, 'Section I', m1), h('label', {}, 'Section II', s2));
    card.append(h('button', { class: 'btn primary', style: 'margin-top:12px', onclick: () => startExam(nSel.value, +tSel.value, m1.value === '1', s2.value) }, '▶ Start the exam'));
    H(body, `<h2>How this mock is built</h2><ul>
      <li><b>Section I (30)</b>: assignment-type questions from every week (2-3 per week, more from the heavier weeks), mixing the 2026 assignments, the 2019 assignments and the NPTEL AI mock papers (their options re-shuffled, since in those papers the key was almost always B or C). Questions you have seen least come first, so successive papers differ.</li>
      <li><b>Section II (20)</b>: generated fresh for every paper. Default: 4-5 case studies, each a short scenario followed by linked questions (typed numericals where the topic allows: ROI/NPV, FP + COCOMO, CPM, earned value, risk, reliability, schedule compression, Halstead; theory cases for SDLC choice, Scrum, SCM, motivation, close-out). Option: 20 standalone numericals.</li>
      <li><b>Marking here</b>: equal marks, MSQ all-or-nothing, numericals accepted inside a small range, no negative marking. The score is also shown out of 75 (the exam's weight).</li>
      <li><b>Timer</b> keeps running if you close the page and auto-submits at zero. Marked + answered questions are graded. Use the on-screen calculator habit: no physical calculators in the exam.</li></ul>`);
    const hist = store.get(HKEY, []);
    if (hist.length) { H(body, '<h2>Your previous attempts</h2>'); const t = h('div', { class: 'heat' }); body.append(t); hist.slice().reverse().forEach(x => { t.append(h('div', { class: 'heatrow' }, h('button', { onclick: () => { M = x.full; analysis(); } }, `${new Date(x.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} · ${x.n} Q`), h('div', { class: 'bar' }, h('i', { style: `width:${x.pct}%;background:${x.pct >= 60 ? 'var(--good)' : x.pct >= 40 ? 'var(--warn)' : 'var(--bad)'}` })), h('b', {}, x.pct.toFixed(0) + ' %'))); }); body.append(h('button', { class: 'btn', style: 'margin-top:8px', onclick: () => { store.set(HKEY, []); startScreen(); } }, 'Clear attempt history')); }
  }
  /* ---------------------------------------------------------- exam screen */
  let qBox, pal, timerEl, cnt;
  function flushTime() { if (!M || M.done || !tShow) return; const id = M.qs[M.cur]; M.t[id] = (M.t[id] || 0) + (Date.now() - tShow) / 1000; tShow = Date.now(); }
  function render() {
    if (M.done) return analysis();
    body.innerHTML = ''; document.body.classList.add('exam-on');
    const bar = h('div', { class: 'exbar' }); timerEl = h('b', { class: 'extimer' }); cnt = h('span', { class: 'excnt' });
    bar.append(h('span', { class: 'exname' }, 'Software Project Management · Mock'), cnt, h('span', { class: 'extl' }, 'Time left ', timerEl));
    const wrap = h('div', { class: 'exwrap' }); qBox = h('div', { class: 'exq' }); pal = h('div', { class: 'expal' }); wrap.append(qBox, pal); body.append(bar, wrap);
    show(M.cur);
    if (tick) clearInterval(tick); tick = setInterval(() => { const l = left(); timerEl.textContent = fmtT(l); timerEl.classList.toggle('low', l < 600); if (l <= 0) { clearInterval(tick); flushTime(); M.done = true; save(); finish(true); } else if (Math.round(l) % 5 === 0) { flushTime(); save(); } }, 500);
    timerEl.textContent = fmtT(left());
  }
  function status(id) { const a = norm(Q(id), M.ans[id]) != null, m = M.mark[id]; return m ? (a ? 'am' : 'm') : a ? 'a' : M.vis[id] ? 'na' : 'nv'; }
  function drawPal() {
    pal.innerHTML = ''; const c = { a: 0, na: 0, nv: 0, m: 0, am: 0 }; M.qs.forEach(id => c[status(id)]++);
    pal.append(h('div', { class: 'pallegend', html: `<span class="pq a">${c.a}</span>Answered <span class="pq na">${c.na}</span>Not answered <span class="pq nv">${c.nv}</span>Not visited <span class="pq m">${c.m}</span>Marked <span class="pq am">${c.am}</span>Answered &amp; marked` }));
    const g = h('div', { class: 'palgrid' }); M.qs.forEach((id, i) => { const sc = (M.sec || []).find(x => x[1] === i); if (sc) g.append(h('div', { class: 'palsec' }, sc[0])); g.append(h('button', { class: 'pq ' + status(id) + (i === M.cur ? ' cur' : ''), 'aria-label': 'question ' + (i + 1), onclick: () => go2(i) }, String(i + 1))); }); pal.append(g);
    pal.append(h('button', { class: 'btn primary', style: 'width:100%;margin-top:12px', onclick: () => confirmSubmit() }, 'Submit exam'));
    cnt.textContent = `Q ${M.cur + 1} / ${M.qs.length} · answered ${c.a + c.am}`;
  }
  function go2(i) { flushTime(); M.cur = i; save(); show(i); }
  function setAns(id, v) { const q = Q(id); if (!(id in M.first) && norm(q, v) != null) M.first[id] = v; const prev = M.ans[id]; if (prev != null && JSON.stringify(prev) !== JSON.stringify(v)) M.chg[id] = (M.chg[id] || 0) + 1; M.ans[id] = v; save(); drawPal(); }
  function show(i) {
    const id = M.qs[i], q = Q(id); M.vis[id] = 1; tShow = Date.now(); save(); qBox.innerHTML = '';
    const kind = q.type === 'nat' ? 'Numerical answer: type a number' : q.type === 'msq' ? 'Multiple select: one or more correct' : 'Single correct answer';
    const secN = (M.sec || []).find(x => i >= x[1] && i < x[2]); qBox.append(h('div', { class: 'qh' }, secN ? h('span', { class: 'secbadge' }, secN[0]) : null, h('span', { class: 'pill hot' }, 'Question ' + (i + 1)), h('span', { class: 'pill' }, kind)));
    if (q.passKey && M.pass[q.passKey]) qBox.append(h('div', { class: 'passage', html: `<small class="mono">${M.pass[q.passKey].title} · question ${q.passIdx}</small><br>` + M.pass[q.passKey].html }));
    qBox.append(h('div', { class: 'qt', html: q.text })); if (q.fig) { const f = figure(q.fig); if (f) qBox.append(f); }
    const a = M.ans[id];
    if (q.type === 'nat') { const inp = h('input', { type: 'text', inputmode: 'decimal', class: 'sel', style: 'max-width:240px', placeholder: 'type your answer', value: a == null ? '' : a, 'aria-label': 'numerical answer' }); inp.addEventListener('input', () => setAns(id, inp.value.trim())); qBox.append(h('div', { class: 'nat' }, inp, q.unit ? h('span', { class: 'cap' }, '(' + q.unit + ')') : null)); setTimeout(() => inp.focus(), 30); }
    else { const box = h('div'); q.opts.forEach((t, k) => { const checked = q.type === 'msq' ? (a || []).includes(k) : a === k; const inp = h('input', { type: q.type === 'msq' ? 'checkbox' : 'radio', name: 'mq', id: 'mo' + k, checked }); inp.addEventListener('change', () => { if (q.type === 'msq') { const s = $$('input', box).map((x, j) => x.checked ? j : -1).filter(j => j >= 0); setAns(id, s); } else setAns(id, k); $$('.opt', box).forEach((o, j) => o.classList.toggle('sel', $$('input', box)[j].checked)); }); box.append(h('label', { class: 'opt q' + (checked ? ' sel' : ''), for: 'mo' + k }, inp, h('span', { html: `<b>${L(k)}.</b> ${t}` }))); }); qBox.append(box); }
    const nav = h('div', { class: 'exnav' });
    nav.append(h('button', { class: 'btn', disabled: i === 0, onclick: () => go2(i - 1) }, '← Previous'), h('button', { class: 'btn', onclick: () => { setAns(id, q.type === 'msq' ? [] : null); show(i); } }, 'Clear response'), h('button', { class: 'btn mk', onclick: () => { M.mark[id] = !M.mark[id]; save(); if (i < M.qs.length - 1) go2(i + 1); else drawPal(); } }, M.mark[id] ? 'Unmark & next' : 'Mark for review & next'), h('button', { class: 'btn primary', onclick: () => { if (i < M.qs.length - 1) go2(i + 1); else confirmSubmit(); } }, i < M.qs.length - 1 ? 'Save & next →' : 'Save & finish'));
    qBox.append(nav); drawPal();
  }
  function confirmSubmit() {
    flushTime(); save(); const c = { a: 0, na: 0, nv: 0, m: 0, am: 0 }; M.qs.forEach(id => c[status(id)]++);
    qBox.innerHTML = ''; const d = h('div', { class: 'card', style: 'border-left:5px solid var(--hot)' });
    d.innerHTML = `<h3>Submit the exam?</h3><p>Answered: <b>${c.a + c.am}</b> · Not answered: <b>${c.na + c.nv}</b> · Marked for review: <b>${c.m + c.am}</b> · Time left: <b>${fmtT(left())}</b></p>${c.na + c.nv ? '<p class="cap">No negative marking here: a guess on every blank question can only help.</p>' : ''}`;
    d.append(h('button', { class: 'btn primary', onclick: () => { M.done = true; M.end = Date.now(); clearInterval(tick); save(); finish(); } }, 'Yes, submit'), ' ', h('button', { class: 'btn', onclick: () => show(M.cur) }, 'Back to the paper'));
    qBox.append(d);
  }
  function finish(auto) {
    document.body.classList.remove('exam-on'); if (!M.end) M.end = Math.min(Date.now(), M.start + M.dur * 1000); M.auto = !!auto; save();
    const R = grade(M), hist = store.get(HKEY, []); if (!hist.some(x => x.start === M.start)) { hist.push({ date: M.end, start: M.start, n: M.qs.length, pct: R.pct, qs: M.qs.filter(id => BANK[id]), full: M }); store.set(HKEY, hist.slice(-12)); }
    analysis();
  }
  /* ---------------------------------------------------------- analysis */
  function grade(m) { const rows = m.qs.map(id => { const q = QM(m, id), a = m.ans[id]; return { id, q, a, ok: isRight(q, a), blank: norm(q, a) == null, t: m.t[id] || 0, first: m.first[id], chg: m.chg[id] || 0 }; }); const ok = rows.filter(r => r.ok).length; return { rows, ok, n: rows.length, pct: ok / rows.length * 100 }; }
  function diagnose(r, acc, med) {
    const q = r.q, out = [];
    if (r.blank) return [['blank', 'Left blank. With no negative marking, always enter your best guess.']];
    if (r.ok) return [];
    if (r.first != null && isRight(q, r.first)) out.push(['silly', `You first answered <b>${ansTxt(q, r.first)}</b> (correct) and then changed it. Trust your first worked answer unless you find a concrete error.`]);
    if (q.type === 'nat') { const v = parseFloat(String(r.a).replace(/,/g, '')), m = (q.lo + q.hi) / 2;
      if (isNaN(v)) out.push(['silly', 'Not a number. Type digits only, no units or symbols.']);
      else { (q.trap || []).forEach(([tv, why]) => { if (Math.abs(v / tv - 1) < .03) out.push(['silly', 'Typical slip: ' + why + '.']); });
        if (!out.some(o => o[1].startsWith('Typical'))) { const rr = m ? v / m : 0, near = (x, tol = .03) => Math.abs(rr / x - 1) < tol;
          if (m && Math.abs(rr - 1) < .1) out.push(['silly', `Very close (${v} vs ${q.show}): rounding. Keep 4 significant figures until the last step.`]);
          else if (near(-1)) out.push(['silly', 'Sign error: variances (SV, CV) and NPV keep their sign (EV − PV, EV − AC).']);
          else if (near(100) || near(.01)) out.push(['silly', 'Off by 100: percent vs fraction. Check what the question asks.']);
          else if ([10, 1000, .1, .001, 1e5, 1e-5].some(x => near(x))) out.push(['silly', 'Off by a power of ten: unit slip (LOC vs KLOC, rupees vs lakh, hours vs days).']);
          else if (near(2) || near(.5)) out.push(['silly', 'Off by a factor of 2: check squares vs fourth powers (Jensen vs Putnam) or a halving step.']); } } }
    if (q.type === 'msq' && Array.isArray(r.a)) { const A = new Set(q.ans), S = new Set(r.a), miss = q.ans.filter(x => !S.has(x)), extra = r.a.filter(x => !A.has(x)); if (miss.length + extra.length === 1) out.push(['silly', miss.length ? `Missed one correct option (${L(miss[0])}). In MSQ judge every option on its own.` : `Ticked one extra option (${L(extra[0])}). Only tick what you can justify.`]); }
    if (r.t > 0 && r.t < Math.min(20, med * .35)) out.push(['silly', `Answered in ${Math.round(r.t)} s: rushed. Re-read the stem (NOT, FALSE, "which one", units).`]);
    if (!out.length && (acc[q.topic] || 0) >= .75) out.push(['silly', 'A slip in a topic you otherwise know well: re-read this one.']);
    if (!out.length) out.push(['gap', 'Concept gap: re-learn it on the topic page.']);
    return out;
  }
  function analysis() {
    if (tick) clearInterval(tick); document.body.classList.remove('exam-on');
    const R = grade(M), med = (() => { const t = R.rows.map(r => r.t).filter(x => x > 0).sort((a, b) => a - b); return t.length ? t[Math.floor(t.length / 2)] : 60; })();
    const byT = {}; R.rows.forEach(r => { const k = r.q.topic, o = byT[k] = byT[k] || { n: 0, ok: 0, blank: 0, wk: r.q.wk }; o.n++; o.ok += r.ok; o.blank += r.blank; });
    const acc = {}; Object.keys(byT).forEach(k => acc[k] = byT[k].ok / byT[k].n); R.rows.forEach(r => r.dx = diagnose(r, acc, med));
    const silly = R.rows.filter(r => r.dx.some(d => d[0] === 'silly')), blanks = R.rows.filter(r => r.blank);
    const used = ((M.end || Date.now()) - M.start) / 1000, of75 = R.pct * .75;
    body.innerHTML = '';
    H(body, `<div class="crumb"><span>Mock exam result</span><span class="pill">${new Date(M.end || Date.now()).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>${M.auto ? '<span class="pill hot">auto-submitted at time-out</span>' : ''}</div><h1>Your result: ${R.ok} / ${R.n}</h1>`);
    const verdict = R.pct >= 60 ? ['good', 'Comfortably above the pass line. Use the analysis to push higher.'] : R.pct >= 40 ? ['warn', 'Above the 40 % exam threshold, with little margin. Fix the avoidable mistakes first: they are the cheapest marks.'] : ['bad', 'Below the 40 % exam threshold. Start with the Easy-marks list and the focus topics below.'];
    H(body, `<div class="readout"><div><small>score</small><b>${R.pct.toFixed(1)} %</b></div><div><small>as exam marks</small><b>${of75.toFixed(1)} / 75</b></div><div><small>pass line (exam)</small><b>30 / 75</b></div><div><small>avoidable mistakes</small><b>${silly.length + blanks.length}</b></div><div><small>time used</small><b>${fmtT(used)} / ${fmtT(M.dur)}</b></div><div><small>median per question</small><b>${Math.round(med)} s</b></div></div><p class="ivtxt" style="border-left-color:var(--${verdict[0] === 'good' ? 'good' : verdict[0] === 'warn' ? 'warn' : 'bad'})">${verdict[1]}${silly.length + blanks.length ? ` Fixing only the avoidable ones would give <b>${((R.ok + silly.length + blanks.length) / R.n * 100).toFixed(0)} %</b>.` : ''}</p>`);
    if (M.sec) { H(body, '<h2>Score by section</h2>'); const hs = h('div', { class: 'heat' }); body.append(hs); M.sec.forEach(([nm, a, b2]) => { const rr = R.rows.slice(a, b2), ok = rr.filter(r => r.ok).length, p = rr.length ? ok / rr.length * 100 : 0; hs.append(h('div', { class: 'heatrow' }, h('span', {}, nm), h('div', { class: 'bar' }, h('i', { style: `width:${p}%;background:${p >= 80 ? 'var(--good)' : p >= 60 ? 'var(--warn)' : 'var(--bad)'}` })), h('b', {}, `${ok}/${rr.length}`))); }); }
    const T = Object.entries(byT).map(([k, o]) => Object.assign({ k, acc: o.ok / o.n, lost: o.n - o.ok, w: AW[k] || 1 }, o));
    const focus = T.filter(o => o.acc < .6).sort((a, b) => b.lost * b.w - a.lost * a.w), mid = T.filter(o => o.acc >= .6 && o.acc < .8), strong = T.filter(o => o.acc >= .8).sort((a, b) => b.n - a.n);
    const chip = o => `<button class="tchip" data-go="${o.k}"><b>${TT[o.k] || o.k}</b><small>W${o.wk} · ${o.ok}/${o.n} right${o.blank ? ` · ${o.blank} blank` : ''} · ${AW[o.k] || 0} assignment Qs on this topic</small></button>`;
    H(body, `<h2>1 · Focus here first (biggest gains)</h2><p class="cap">Topics under 60 % in this paper, ordered by marks lost × how often the topic appears in the assignments. Open the topic, do its assignment questions and its fresh numericals, then retake.</p><div class="tchips">${focus.length ? focus.map(chip).join('') : '<p>No weak topics in this paper.</p>'}</div>`);
    if (mid.length) H(body, `<h3>Nearly there (60-79 %): a few more questions</h3><div class="tchips">${mid.map(chip).join('')}</div>`);
    H(body, `<h2>2 · Mistakes you could have avoided</h2><p class="cap">Detected automatically: changed-correct answers, MSQs with exactly one wrong tick, sign/percent/unit slips and known traps in numericals, rushed answers, blanks.</p>`);
    const sl = h('div'); body.append(sl); if (!silly.length && !blanks.length) sl.innerHTML = '<p>None. Clean paper.</p>'; silly.concat(blanks).forEach(r => sl.append(reviewCard(r, true)));
    H(body, `<h2>3 · Strong areas: revision only</h2><p class="cap">80 % or better. Skim the revision sheet for these; do not spend new study time here.</p><div class="tchips">${strong.length ? strong.map(chip).join('') : '<p>None yet. Take another paper after revising.</p>'}</div>`);
    const slow = R.rows.filter(r => r.t > Math.max(2.2 * med, 150)).sort((a, b) => b.t - a.t).slice(0, 6);
    H(body, `<h2>4 · Time management</h2><p>Average ${fmtT(used / R.n)} per question, ${R.n - blanks.length} answered${M.auto ? ', auto-submitted at zero' : `, ${fmtT(Math.max(0, M.dur - used))} left at submit`}. 180 min for 50 questions = 3.6 min each; Section II passages need more, so bank time in Section I.${slow.length ? ' These took much longer than your median; in the exam, mark and return:' : ''}</p>${slow.length ? '<ul>' + slow.map(r => `<li>Q${M.qs.indexOf(r.id) + 1} (${TT[r.q.topic] || r.q.topic}): ${fmtT(r.t)}, ${r.ok ? 'right' : 'wrong'}</li>`).join('') + '</ul>' : ''}`);
    const W = {}; R.rows.forEach(r => { const o = W[r.q.wk] = W[r.q.wk] || { n: 0, ok: 0 }; o.n++; o.ok += r.ok; });
    H(body, '<h2>5 · Score by week</h2>'); const heat = h('div', { class: 'heat' }); body.append(heat);
    Object.keys(W).sort((a, b) => a - b).forEach(w => { const o = W[w], p = o.ok / o.n * 100; heat.append(h('div', { class: 'heatrow' }, h('span', {}, 'Week ' + w), h('div', { class: 'bar' }, h('i', { style: `width:${p}%;background:${p >= 80 ? 'var(--good)' : p >= 60 ? 'var(--warn)' : 'var(--bad)'}` })), h('b', {}, `${o.ok}/${o.n}`))); });
    H(body, '<h2>6 · Review every question</h2>'); const fl = h('div', { class: 'seg', style: 'margin-bottom:10px' }); body.append(fl); const list = h('div'); body.append(list);
    const drawList = f => { list.innerHTML = ''; R.rows.filter(r => f === 'all' || (f === 'wrong' ? !r.ok : r.ok)).forEach(r => list.append(reviewCard(r))); };
    segmented(fl, [['wrong', 'Wrong / blank'], ['all', 'All'], ['right', 'Right']], 'wrong', drawList); drawList('wrong');
    body.append(h('div', { class: 'nextprev' }, h('button', { class: 'btn primary', onclick: () => { M = null; store.set(KEY, null); startScreen(); } }, 'New paper'), h('button', { class: 'btn', onclick: () => go('revision-sheet') }, 'Revision sheet'), h('button', { class: 'btn', onclick: () => go('easy-marks') }, 'Easy marks')));
    $$('[data-go]', body).forEach(bt => bt.addEventListener('click', () => go(bt.dataset.go))); $('#main').scrollTop = 0;
  }
  function reviewCard(r, compact) {
    const q = r.q, i = M.qs.indexOf(r.id), c = h('div', { class: 'q rv ' + (r.ok ? 'ok' : r.blank ? 'bl' : 'no') });
    c.append(h('div', { class: 'qh' }, h('span', { class: 'pill ' + (r.ok ? '' : 'hot') }, `Q${i + 1} · ${r.ok ? '✔ right' : r.blank ? '— blank' : '✘ wrong'}`), h('span', { class: 'pill' }, qLabel(q)), h('span', { class: 'pill' }, TT[q.topic] || q.topic), h('span', { class: 'pill' }, fmtT(r.t))));
    if (q.passKey && M.pass[q.passKey] && !compact) c.append(h('details', {}, h('summary', {}, 'Show the passage: ' + M.pass[q.passKey].title), h('div', { class: 'passage', html: M.pass[q.passKey].html })));
    c.append(h('div', { class: 'qt', html: q.text }));
    if (q.fig && !compact) { const f = figure(q.fig); if (f) c.append(f); }
    if (q.type !== 'nat' && !compact) c.append(h('ol', { class: 'rvopts', type: 'A', html: q.opts.map((t, k) => `<li class="${q.ans.includes(k) ? 'k' : ''}${(q.type === 'msq' ? (r.a || []).includes(k) : r.a === k) ? ' y' : ''}">${t}</li>`).join('') }));
    c.append(h('div', { class: 'rvans', html: `Your answer: <b>${ansTxt(q, r.a)}</b> · Correct: <b>${keyTxt(q)}</b>` }));
    (r.dx || []).forEach(([k, t]) => c.append(h('div', { class: 'dx ' + k, html: (k === 'silly' ? '⚠ ' : k === 'blank' ? '○ ' : '◆ ') + t })));
    c.append(h('details', {}, h('summary', {}, 'Explanation'), h('div', { class: 'exp', html: q.exp || '' }), h('button', { class: 'btn', style: 'margin-top:6px', onclick: () => go(q.topic) }, 'Open topic page →')));
    return c;
  }
  startScreen();
} });
