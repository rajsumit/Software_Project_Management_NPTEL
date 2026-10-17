/* ===== Question bank ===== */
page({ id: 'qbank', mod: 'home', title: 'All assignment questions', kw: 'assignment practice quiz questions wrong redo 2026 2019 AI mock bank', render(b) {
  H(b, `<h1>Question bank</h1><p class="lede">All 120 questions of the 2026 assignments (with the official solutions), all 120 of the 2019 run (accepted answers), and the 150 questions of the five NPTEL AI mock papers. Your answers are remembered in this browser.</p>`);
  const tt = {}; PAGES.forEach(p => { if (p.topic) tt[p.id] = p.title; });
  const ALL = window.QBANK || [];
  const bar = h('div', { class: 'calc' }), inputs = h('div', { class: 'inputs' }); bar.append(inputs);
  const src = h('select', { class: 'sel', 'aria-label': 'source' }, [['a', 'Assignments 2026 + 2019 (240)'], ['A26', 'Assignments 2026 (120)'], ['A19', 'Assignments 2019 (120)'], ['AI', 'NPTEL AI mock papers (150)'], ['all', 'Everything (390)']].map(([v, t]) => h('option', { value: v }, t)));
  const wk = h('select', { class: 'sel', 'aria-label': 'week' }, h('option', { value: '' }, 'All weeks'), ...Array.from({ length: 12 }, (_, i) => h('option', { value: i + 1 }, 'Week ' + (i + 1))));
  const tp = h('select', { class: 'sel', 'aria-label': 'topic' }, h('option', { value: '' }, 'All topics'), ...Object.keys(tt).map(k => h('option', { value: k }, tt[k].slice(0, 48))));
  const ty = h('select', { class: 'sel', 'aria-label': 'type' }, h('option', { value: '' }, 'All types'), h('option', { value: 'mcq' }, 'Single answer'), h('option', { value: 'msq' }, 'Multiple select'));
  const stt = h('select', { class: 'sel', 'aria-label': 'status' }, h('option', { value: '' }, 'Any status'), h('option', { value: 'new' }, 'Not tried yet'), h('option', { value: 'wrong' }, 'Wrong so far (redo)'), h('option', { value: 'right' }, 'Correct'));
  [['Source', src], ['Week', wk], ['Topic', tp], ['Type', ty], ['Status', stt]].forEach(([l, e]) => inputs.append(h('label', {}, l, e)));
  const row = h('div', { class: 'nextprev', style: 'margin:10px 0;justify-content:flex-start' });
  b.append(row, bar);
  const score = h('div', { class: 'qscore' }), info = h('p', { class: 'cap' }), list = h('div');
  let shown = 12, cur = [];
  const more = h('button', { class: 'btn', onclick: () => { shown += 12; draw(); } }, 'Show 12 more'), all = h('button', { class: 'btn primary', onclick: () => { shown = cur.length; draw(); } }, 'Show all');
  b.append(score, info, list, h('div', { class: 'nextprev', style: 'justify-content:flex-start' }, more, all));
  const inSrc = q => src.value === 'all' || (src.value === 'a' ? (q.src === 'A26' || q.src === 'A19') : q.src === src.value);
  const filt = () => ALL.filter(q => inSrc(q) && (!wk.value || q.wk == wk.value) && (!tp.value || q.topic === tp.value) && (!ty.value || q.type === ty.value) && (!stt.value || (stt.value === 'new' ? QPROG[q.id] === undefined : stt.value === 'wrong' ? QPROG[q.id] === 0 : QPROG[q.id] === 1)));
  const A = ALL.filter(q => q.src === 'A26' || q.src === 'A19');
  function upScore() { const ids = cur.map(q => q.id), tried = ids.filter(id => QPROG[id] !== undefined).length, ok = ids.filter(id => QPROG[id] === 1).length, aOk = A.filter(q => QPROG[q.id] === 1).length; score.innerHTML = `<div><small>score on this list</small><b>${ok} / ${ids.length}</b></div><div><small>attempted</small><b>${tried} / ${ids.length}</b></div><div><small>accuracy</small><b>${tried ? Math.round(ok / tried * 100) : 0} %</b></div><div><small>all assignments</small><b>${aOk} / ${A.length}</b></div>`; }
  window.addEventListener('qprog', upScore); onLeave(() => window.removeEventListener('qprog', upScore));
  function draw() { upScore(); list.innerHTML = ''; cur.slice(0, shown).forEach(q => list.append(renderQuestion(q, { showTopic: true }))); more.hidden = all.hidden = shown >= cur.length; info.textContent = `${cur.length} questions match.`; }
  const reset = () => { shown = 12; cur = filt(); draw(); }; [src, wk, tp, ty, stt].forEach(e => e.addEventListener('change', reset));
  row.append(h('button', { class: 'btn primary', onclick: () => { cur = shuffle(A).slice(0, 10); shown = 10; draw(); info.textContent = 'Random 10 assignment questions.'; } }, 'Random 10'), h('button', { class: 'btn', onclick: () => { stt.value = 'wrong'; reset(); } }, 'Redo my wrong answers'), h('button', { class: 'btn', onclick: () => { stt.value = 'new'; reset(); } }, 'Only untried'), h('button', { class: 'btn', onclick: () => { Object.keys(QPROG).forEach(k => delete QPROG[k]); store.set('q', QPROG); reset(); } }, 'Reset my progress'));
  reset();
} });

/* ===== Numericals & passages drill ===== */
page({ id: 'drill', mod: 'home', title: 'Numericals & Section II passages', kw: 'numerical drill practice fresh numbers passage case study section II scenario', render(b) {
  H(b, `<h1>Numericals & Section II passages</h1><p class="lede">Every press of a button generates new numbers, so you can practise the same method until it is automatic. Answers are typed, as in the exam; the accepted range allows small rounding differences.</p>`);
  const tt = {}; PAGES.forEach(p => { if (p.topic) tt[p.id] = p.title; });
  const groups = {}; GEN.names.forEach(n => { const q = GEN.make(n); (groups[q.topic] = groups[q.topic] || []).push(n); });
  const seg = h('div'); b.append(seg); let mode = 'num';
  segmented(seg, [['num', 'Fresh numericals'], ['pas', 'Section II passages']], mode, k => { mode = k; drawAll(); });
  const area = h('div', { class: 'drill' }); b.append(area);
  function drawAll() { area.innerHTML = ''; mode === 'num' ? drawNum() : drawPas(); }
  function drawNum() {
    const sel = h('select', { class: 'sel' }, h('option', { value: '' }, `Mixed: all ${GEN.names.length} types`), ...Object.keys(groups).map(t => h('option', { value: t }, `${(PAGES.find(p => p.id === t) || {}).wk ? 'W' + PAGES.find(p => p.id === t).wk + ' · ' : ''}${tt[t] || t} (${groups[t].length})`)));
    const nSel = h('select', { class: 'sel' }, [5, 10, 20].map(n => h('option', { value: n }, n + ' questions')));
    const res = h('div', { class: 'qscore' }), list = h('div'); let ok = 0, ans = 0;
    const gen = () => { list.innerHTML = ''; ok = 0; ans = 0; upd(); const pool = shuffle(sel.value ? groups[sel.value] : GEN.names); for (let i = 0; i < +nSel.value; i++) list.append(renderQuestion(GEN.make(pool[i % pool.length]), { onAnswer: r => { ans++; ok += r; upd(); } })); };
    const upd = () => res.innerHTML = `<div><small>answered</small><b>${ans} / ${+nSel.value}</b></div><div><small>correct</small><b>${ok}</b></div><div><small>accuracy</small><b>${ans ? Math.round(ok / ans * 100) : 0} %</b></div>`;
    area.append(h('div', { class: 'calc' }, h('div', { class: 'inputs' }, h('label', {}, 'Topic', sel), h('label', {}, 'How many', nSel))), h('button', { class: 'btn primary', style: 'margin:8px 0', onclick: gen }, '↻ Generate'), res, list);
    sel.addEventListener('change', gen); nSel.addEventListener('change', gen); gen();
  }
  function drawPas() {
    const sel = h('select', { class: 'sel' }, ...GEN.pnames.map(n => { const p = GEN.passage(n); return h('option', { value: n }, `${p.title} (${p.qs.length} questions)`); }));
    const box = h('div'); const res = h('div', { class: 'qscore' }); let ok = 0, ans = 0, n = 0;
    const upd = () => res.innerHTML = `<div><small>answered</small><b>${ans} / ${n}</b></div><div><small>correct</small><b>${ok}</b></div>`;
    const gen = () => { box.innerHTML = ''; ok = 0; ans = 0; const p = GEN.passage(sel.value); n = p.qs.length; upd(); box.append(h('h3', {}, p.title), h('div', { class: 'passage', html: p.html })); p.qs.forEach((q, i) => { const q2 = Object.assign({}, q, { passage: null, text: `<b>${i + 1}.</b> ` + q.text }); box.append(renderQuestion(q2, { onAnswer: r => { ans++; ok += r; upd(); } })); }); };
    area.append(h('p', { class: 'cap' }, 'A scenario followed by 4-5 linked questions, the expected style of Section II. Numerical cases get new numbers each time; theory cases reshuffle their options.'), h('div', { class: 'calc' }, h('div', { class: 'inputs' }, h('label', {}, 'Case', sel))), h('button', { class: 'btn primary', style: 'margin:8px 0', onclick: gen }, '↻ New version'), res, box);
    sel.addEventListener('change', gen); gen();
  }
  drawAll();
} });
