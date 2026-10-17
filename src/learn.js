/* ===== Learn: story + theory framework =====
   learn(id, meta, fn) registers the story/theory part of a topic page.
   The page renders: header → section nav → Learn (story + theory) → Exam toolkit (old page) → questions. */
const LEARN = {}, CHAPTERS = [];
function learn(id, meta, fn) { LEARN[id] = fn; CHAPTERS.push(Object.assign({ id }, meta)); }

/* ---------- the cast ---------- */
const CAST = {
  riya: ['Riya', 'R', '--ch-v', 'new project manager, Sahyadri Softworks, Pune'],
  kul: ['Kulkarni sir', 'K', '--ch-b', 'Riya\'s mentor, 25 years of running projects'],
  bho: ['Mr Bhosale', 'B', '--warn', 'General Manager, Pune City Transport (the client)'],
  mehta: ['Ms Mehta', 'M', '--bad', 'finance head, Sahyadri Softworks'],
  arjun: ['Arjun', 'A', '--ch-d', 'senior developer, back end'],
  imran: ['Imran', 'I', '--ch-x', 'embedded engineer, the in-bus unit'],
  neha: ['Neha', 'N', '--ch-i', 'test and quality lead'],
  pooja: ['Pooja', 'P', '--hot', 'fresher developer, mobile app'],
  dev: ['Dev', 'D', '--muted', 'business analyst'],
  vik: ['Vikram', 'V', '--ch-v', 'vendor, GPS hardware supplier'] };
const SAY = (who, t) => { const c = CAST[who] || [who, who[0], '--muted']; return `<div class="say"><span class="av" style="--c:var(${c[2]})" title="${c[0]}">${c[1]}</span><div><span class="who">${c[0]}</span>${t}</div></div>`; };
const NARR = t => `<p class="narr">${t}</p>`;
const STORY = (ch, title, body) => `<section class="story"><div class="sthead"><span class="chap">Chapter ${ch}</span><h3>${title}</h3></div>${body}</section>`;
const RECAP = (...li) => `<div class="recap"><h4>In one breath</h4><ul>${li.map(x => `<li>${x}</li>`).join('')}</ul></div>`;
const REVEAL = (q, a) => `<details class="reveal"><summary>${q}</summary><div>${a}</div></details>`;
const NEXT = (t, id, label) => `<div class="nextch"><p>${t}</p><button class="btn primary" data-goto="${id}">${label} →</button></div>`;
const LINK = (id, t) => `<a href="#${id}" class="xref">${t}</a>`;
const DEF = (term, t) => `<div class="def"><b>${term}</b><span>${t}</span></div>`;
const STEPS = (items) => `<ol class="steps">${items.map(x => `<li>${x}</li>`).join('')}</ol>`;
const COLS = (...cols) => `<div class="cols">${cols.map(c => `<div>${c}</div>`).join('')}</div>`;

/* ---------- SVG helpers (colours come from CSS classes so both themes work) ---------- */
const SVG = (w, hgt, inner, cls = '') => `<div class="dgwrap"><svg class="dg ${cls}" viewBox="0 0 ${w} ${hgt}" role="img" preserveAspectRatio="xMidYMid meet">${inner}</svg></div>`;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
function tx(x, y, s, a = {}) { const lines = String(s).split('\n'), lh = a.lh || 15, y0 = y - (lines.length - 1) * lh / 2; return `<text x="${x}" y="${y0}" class="${a.c || ''}" text-anchor="${a.anchor || 'middle'}" dominant-baseline="middle"${a.at || ''}>${lines.map((l, i) => `<tspan x="${x}" dy="${i ? lh : 0}">${l}</tspan>`).join('')}</text>`; }
function bx(x, y, w, hgt, label, a = {}) { return `<g${a.at || ''}${a.g ? ` class="${a.g}"` : ''}><rect x="${x}" y="${y}" width="${w}" height="${hgt}" rx="${a.r == null ? 8 : a.r}" class="bx ${a.c || ''}"/>${label != null ? tx(x + w / 2, y + hgt / 2, label, { c: a.tc || '', lh: a.lh }) : ''}</g>`; }
function ar(x1, y1, x2, y2, a = {}) { return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="ln ${a.c || ''}" marker-end="url(#${a.m || 'mk'})"${a.at || ''}/>`; }
function pth(d, a = {}) { return `<path d="${d}" class="ln ${a.c || ''}"${a.m === false ? '' : ` marker-end="url(#${a.m || 'mk'})"`}${a.at || ''}/>`; }
const S = n => ` data-s="${n}"`, X = n => ` data-x="${n}"`, HL = (...n) => ` data-h="${n.join(',')}"`, U = n => ` data-u="${n}"`;
function svgDefs() {
  if (document.getElementById('svgdefs')) return;
  const d = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); d.id = 'svgdefs'; d.setAttribute('width', 0); d.setAttribute('height', 0); d.style.position = 'absolute';
  d.innerHTML = `<defs>${[['mk', 'mkf'], ['mkb', 'mkf b'], ['mkr', 'mkf r'], ['mkg', 'mkf g'], ['mka', 'mkf a']].map(([id, c]) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="${c}"/></marker>`).join('')}</defs>`;
  document.body.append(d);
}

/* ---------- animated build-up diagram ----------
   Elements carry data-s="k" (appear at step k), data-x="k" (only at step k), data-u="k" (until step k), data-h="k,.." (highlight). */
function stepper(parent, title, svg, caps, o = {}) {
  const box = h('div', { class: 'anim' }); parent.append(box);
  box.append(h('header', {}, h('i'), title));
  const stage = h('div', { class: 'stage', html: svg }), cap = h('div', { class: 'acap' });
  const prev = h('button', { class: 'btn', 'aria-label': 'previous step' }, '◀'), next = h('button', { class: 'btn', 'aria-label': 'next step' }, '▶'), play = h('button', { class: 'btn primary' }, '▶ Play'), cnt = h('span', { class: 'acnt mono' });
  const dots = h('div', { class: 'adots' }); caps.forEach((_, i) => dots.append(h('button', { 'aria-label': 'step ' + (i + 1), onclick: () => { stop(); set(i); } })));
  box.append(stage, cap, h('div', { class: 'actl' }, prev, play, next, cnt, dots));
  let k = 0, timer = null, seen = false;
  const els = $$('[data-s],[data-x],[data-h],[data-u]', stage);
  function set(i) {
    k = Math.max(0, Math.min(caps.length - 1, i));
    els.forEach(e => { const s = e.dataset.s, x = e.dataset.x, u = e.dataset.u, hh = e.dataset.h; let vis = true; if (s != null && k < +s) vis = false; if (x != null && k !== +x) vis = false; if (u != null && k >= +u) vis = false; e.classList.toggle('off', !vis); if (hh != null) e.classList.toggle('hl', hh.split(',').map(Number).includes(k)); });
    cap.innerHTML = caps[k]; cnt.textContent = `${k + 1} / ${caps.length}`; $$('button', dots).forEach((d, j) => d.classList.toggle('on', j === k)); prev.disabled = k === 0;
    if (o.onstep) o.onstep(k, stage);
  }
  function stop(user) { if (user !== false) seen = true; if (timer) clearInterval(timer); timer = null; play.textContent = k >= caps.length - 1 ? '↻ Replay' : '▶ Play'; }
  function start() { if (k >= caps.length - 1) set(0); timer = setInterval(() => { if (k >= caps.length - 1) return stop(false); set(k + 1); if (k >= caps.length - 1) stop(false); }, o.ms || 3200); play.textContent = '⏸ Pause'; }
  play.onclick = () => timer ? stop() : start(); prev.onclick = () => { stop(); set(k - 1); }; next.onclick = () => { stop(); set(k + 1); if (k >= caps.length - 1) stop(); };
  onLeave(() => { if (timer) clearInterval(timer); });
  set(o.start || 0); stop(false);
  if (o.auto !== false && 'IntersectionObserver' in window) { const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting) && !seen) { seen = true; start(); io.disconnect(); } }, { threshold: .55 }); io.observe(box); onLeave(() => io.disconnect()); }
  return { set, box, stage };
}

/* ---------- decision point ---------- */
function choice(parent, q, opts, o = {}) {
  const box = h('div', { class: 'choice' }); parent.append(box);
  box.append(h('div', { class: 'cq', html: `<span class="ctag">${o.tag || 'What would you do?'}</span>${q}` }));
  const fb = h('div', { class: 'cfb' }), list = h('div', { class: 'copts' });
  opts.forEach(([t, f, good]) => list.append(h('button', { class: 'copt', onclick: (e) => { $$('.copt', list).forEach(b => b.classList.remove('picked')); e.currentTarget.classList.add('picked'); e.currentTarget.classList.toggle('good', !!good); e.currentTarget.classList.toggle('bad', !good); fb.className = 'cfb ' + (good ? 'good' : 'bad'); fb.innerHTML = (good ? '✔ ' : '✘ ') + f; } }, h('span', { html: t }))));
  box.append(list, fb); return box;
}

/* ---------- flip-to-check mini quiz inside theory ---------- */
function quickcheck(parent, items) { const box = h('div', { class: 'qcheck' }); box.append(h('h4', {}, 'Check yourself')); items.forEach(([q, a]) => box.insertAdjacentHTML('beforeend', REVEAL(q, a))); parent.append(box); }

/* ---------- render hook used by renderPage ---------- */
function renderLearn(p, root) {
  const fn = LEARN[p.id]; if (!fn) return false;
  const ch = CHAPTERS.find(c => c.id === p.id);
  const nav = h('div', { class: 'secnav' });
  const L = h('section', { class: 'learn', id: 'learn' });
  nav.append(h('span', { class: 'mono' }, 'On this page'), h('button', { class: 'chipbtn', onclick: () => L.scrollIntoView({ behavior: 'smooth' }) }, '📖 Story & theory'), h('button', { class: 'chipbtn', onclick: () => { const t = $('#toolkit'); if (t) t.scrollIntoView({ behavior: 'smooth' }); } }, '🧰 Exam toolkit'), h('button', { class: 'chipbtn', onclick: () => { const t = $('#practice'); if (t) t.scrollIntoView({ behavior: 'smooth' }); } }, '✍ Questions'));
  root.append(nav, L);
  if (ch && ch.line) L.append(h('p', { class: 'chline' }, h('span', { class: 'mono' }, `Story · chapter ${ch.ch}`), ' ', ch.line));
  fn(L);
  root.append(h('div', { class: 'toolkit', id: 'toolkit' }, h('span', { class: 'mono' }, 'Exam toolkit'), h('h2', {}, 'Must-remember, labs and traps'), h('p', { class: 'cap' }, 'The same topic condensed for revision: what to memorise, interactive labs, and the traps the assignments set.')));
  return true;
}
document.addEventListener('click', e => { const t = e.target.closest('[data-goto]'); if (t) { e.preventDefault(); go(t.dataset.goto); } });

/* ---------- the story page ---------- */
page({ id: 'story', mod: 'home', title: 'Read the course as a story', kw: 'story chapters saarthi riya narrative connected course overview', render(b) {
  H(b, `<h1>The Saarthi project: the whole course as one story</h1><p class="lede">Riya has just been made project manager. Her first project: <b>Saarthi</b>, a smart-bus system for Pune City Transport (a passenger app, a depot portal and an embedded unit in every bus). Each chapter is one topic of the course, in the order the project needs it. Read them in order once; after that use them as reference.</p>`);
  const cast = h('div', { class: 'cast' }); Object.keys(CAST).forEach(k => { const c = CAST[k]; cast.insertAdjacentHTML('beforeend', `<div class="castm"><span class="av" style="--c:var(${c[2]})">${c[1]}</span><div><b>${c[0]}</b><small>${c[3]}</small></div></div>`); });
  b.append(h('h2', {}, 'Cast'), cast, h('h2', {}, 'Chapters'));
  const tl = h('div', { class: 'tline' }); let lastWk = 0;
  PAGES.filter(p => p.topic).forEach(p => { const c = CHAPTERS.find(x => x.id === p.id); if (p.wk !== lastWk) { tl.append(h('div', { class: 'tlwk mono' }, MODULES[p.mod])); lastWk = p.wk; } tl.append(h('button', { class: 'tlitem' + (c ? '' : ' soon'), onclick: () => go(p.id) }, h('span', { class: 'tlch mono' }, c ? c.ch : '·'), h('span', {}, h('b', {}, c ? c.title : p.title), h('small', {}, c ? c.line : 'Story chapter coming soon; the topic page is ready.')), done[p.id] ? h('span', { class: 'done' }) : null)); });
  b.append(tl);
} });
