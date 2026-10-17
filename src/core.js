/* ===== core helpers ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
function h(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  for (const k in (attrs || {})) {
    const v = attrs[k];
    if (k === 'class') e.className = v; else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v);
  }
  kids.flat().forEach(c => c != null && e.append(c.nodeType ? c : document.createTextNode(c)));
  return e;
}
const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const fmt = (x, d = 2) => (Math.abs(x) >= 1e7 || (Math.abs(x) < 1e-3 && x !== 0)) ? x.toExponential(2) : (+x.toFixed(d)).toLocaleString('en-IN', { maximumFractionDigits: d });
const store = {
  get(k, d) { try { const v = localStorage.getItem('spm:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('spm:' + k, JSON.stringify(v)); } catch (e) {} }
};
const LAB_STOPS = []; // cleanup callbacks run on route change
function onLeave(fn) { LAB_STOPS.push(fn); }
const H = (body, html) => body.insertAdjacentHTML('beforeend', html);
const MUST = (...li) => `<div class="must"><h4>★ Must remember</h4><ul>${li.map(x => `<li>${x}</li>`).join('')}</ul></div>`;
const IDEA = (t, html) => `<div class="idea"><h4>${t}</h4>${html}</div>`;
const ANALOGY = (html) => `<div class="analogy"><h4>Think of it like this</h4>${html}</div>`;
const TRAP = (...li) => `<div class="trapbox"><h4>⚠ Exam traps</h4><ul>${li.map(x => `<li>${x}</li>`).join('')}</ul></div>`;
const F = (t, tag) => `<div class="formula">${t}${tag ? `<span class="tag">${tag}</span>` : ''}</div>`;
const HOT = (t, q) => `<mark class="hot"${q ? ` data-q="${q}"` : ''}>${t}</mark>`;
const TBL = (head, rows, cls) => `<div class="tblwrap"><table${cls ? ` class="${cls}"` : ''}><thead><tr>${head.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const CARD = (t, html) => `<div class="card"><h3>${t}</h3>${html}</div>`;
const VS = (items) => `<div class="vs">${items.map(([t, tag, li]) => `<div><h4>${t}</h4>${tag ? `<div class="tagline">${tag}</div>` : ''}<ul>${li.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>`;
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];

/* ===== theme ===== */
const Theme = {
  mode: store.get('theme', 'auto'),
  apply() {
    const r = document.documentElement;
    if (this.mode === 'auto') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', this.mode);
    window.dispatchEvent(new Event('themechange'));
  },
  cycle() { this.mode = ({ auto: 'light', light: 'dark', dark: 'auto' })[this.mode]; store.set('theme', this.mode); this.apply(); return this.mode; }
};

/* ===== canvas plotter ===== */
class Scope {
  constructor(cv, o) {
    this.cv = cv; this.o = Object.assign({ xmin: 0, xmax: 1, ymin: -1, ymax: 1, xt: 5, yt: 4, xl: '', yl: '', h: 240, pad: [52, 14, 30, 12], xfmt: null, yfmt: null }, o);
    this.last = null;
    this._rs = () => this.draw(this.last && this.last.s, this.last && this.last.x);
    window.addEventListener('themechange', this._rs); window.addEventListener('resize', this._rs);
    onLeave(() => { window.removeEventListener('themechange', this._rs); window.removeEventListener('resize', this._rs); });
  }
  set(o) { Object.assign(this.o, o); }
  draw(series, extra) {
    this.last = { s: series, x: extra };
    const cv = this.cv, o = this.o, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = cv.clientWidth || 600, H = o.h;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + 'px'; }
    const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    const [pl, pr, pb, pt] = o.pad; const iw = W - pl - pr, ih = H - pb - pt;
    const X = x => pl + (x - o.xmin) / (o.xmax - o.xmin) * iw, Y = y => pt + (1 - (y - o.ymin) / (o.ymax - o.ymin)) * ih;
    this.X = X; this.Y = Y;
    const grid = css('--grid'), mut = css('--muted'), ink = css('--ink');
    g.font = '600 10.5px ' + css('--f-mono'); g.lineWidth = 1;
    const nice = (lo, hi, n) => { const st = (hi - lo) / n; return Array.from({ length: n + 1 }, (_, i) => lo + st * i); };
    g.strokeStyle = grid; g.fillStyle = mut; g.textBaseline = 'middle';
    nice(o.ymin, o.ymax, o.yt).forEach(v => { const y = Y(v); g.beginPath(); g.moveTo(pl, y); g.lineTo(W - pr, y); g.stroke(); g.textAlign = 'right'; g.fillText(o.yfmt ? o.yfmt(v) : fmt(v, 1), pl - 6, y); });
    g.textBaseline = 'top'; g.textAlign = 'center';
    nice(o.xmin, o.xmax, o.xt).forEach(v => { const x = X(v); g.beginPath(); g.moveTo(x, pt); g.lineTo(x, H - pb); g.stroke(); g.fillText(o.xfmt ? o.xfmt(v) : fmt(v, 1), x, H - pb + 5); });
    if (o.ymin < 0 && o.ymax > 0) { g.strokeStyle = mut; g.beginPath(); g.moveTo(pl, Y(0)); g.lineTo(W - pr, Y(0)); g.stroke(); }
    g.save(); g.beginPath(); g.rect(pl, pt - 2, iw, ih + 4); g.clip();
    (series || []).forEach(s => {
      const col = s.c && s.c.startsWith('--') ? css(s.c) : (s.c || ink);
      if (s.bars) { g.fillStyle = col; g.globalAlpha = s.alpha || .85; s.bars.forEach(([x0, x1, y0, y1]) => { g.fillRect(X(x0), Y(y1), X(x1) - X(x0), Y(y0) - Y(y1)); }); g.globalAlpha = 1; return; }
      let xs = s.x, ys = s.y;
      if (s.fn) { const N = s.n || 400; xs = []; ys = []; for (let i = 0; i <= N; i++) { const x = o.xmin + (o.xmax - o.xmin) * i / N; xs.push(x); ys.push(s.fn(x)); } }
      g.beginPath(); g.lineWidth = s.w || 2; g.strokeStyle = col; g.setLineDash(s.dash || []); g.lineJoin = 'round';
      for (let i = 0; i < xs.length; i++) {
        if (s.step && i > 0) g.lineTo(X(xs[i]), Y(ys[i - 1]));
        i ? g.lineTo(X(xs[i]), Y(ys[i])) : g.moveTo(X(xs[i]), Y(ys[i]));
      }
      g.stroke(); g.setLineDash([]);
      if (s.fill) { g.lineTo(X(xs[xs.length - 1]), Y(s.fillTo || 0)); g.lineTo(X(xs[0]), Y(s.fillTo || 0)); g.closePath(); g.globalAlpha = .16; g.fillStyle = col; g.fill(); g.globalAlpha = 1; }
      if (s.dots) { g.fillStyle = col; xs.forEach((x, i) => { g.beginPath(); g.arc(X(x), Y(ys[i]), s.dots, 0, 7); g.fill(); }); }
    });
    ((extra && extra.h) || []).forEach(l => { g.strokeStyle = l.c && l.c.startsWith('--') ? css(l.c) : (l.c || mut); g.setLineDash([5, 4]); g.lineWidth = 1.4; g.beginPath(); g.moveTo(pl, Y(l.y)); g.lineTo(W - pr, Y(l.y)); g.stroke(); g.setLineDash([]); if (l.t) { g.fillStyle = g.strokeStyle; g.textAlign = 'right'; g.textBaseline = 'bottom'; g.fillText(l.t, W - pr - 4, Y(l.y) - 2); } });
    ((extra && extra.v) || []).forEach(l => { g.strokeStyle = l.c && l.c.startsWith('--') ? css(l.c) : (l.c || mut); g.setLineDash([5, 4]); g.lineWidth = 1.4; g.beginPath(); g.moveTo(X(l.x), pt); g.lineTo(X(l.x), H - pb); g.stroke(); g.setLineDash([]); if (l.t) { g.fillStyle = g.strokeStyle; g.textAlign = 'left'; g.textBaseline = 'top'; g.fillText(l.t, X(l.x) + 4, pt + 2 + (l.dy || 0)); } });
    ((extra && extra.t) || []).forEach(l => { g.fillStyle = l.c && l.c.startsWith('--') ? css(l.c) : (l.c || ink); g.textAlign = l.a || 'left'; g.textBaseline = 'middle'; g.font = '700 11.5px ' + css('--f-mono'); g.fillText(l.s, X(l.x), Y(l.y)); });
    g.restore();
    g.fillStyle = mut; g.font = '600 10.5px ' + css('--f-mono');
    if (o.xl) { g.textAlign = 'right'; g.textBaseline = 'bottom'; g.fillText(o.xl, W - pr, H - 1); }
    if (o.yl) { g.save(); g.translate(11, pt + ih / 2); g.rotate(-Math.PI / 2); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(o.yl, 0, 0); g.restore(); }
  }
}
/* build a lab card */
function lab(parent, title, caption) {
  const body = h('div', { class: 'body' });
  const root = h('section', { class: 'lab' }, h('header', {}, h('i'), title), body);
  if (caption) body.append(h('p', { class: 'cap', html: caption }));
  parent.append(root);
  return {
    root, body,
    scope(o) { const cv = h('canvas', { class: 'scope' }); body.append(cv); return new Scope(cv, o); },
    legend(items) { body.append(h('div', { class: 'legend', html: items.map(i => `<span style="--c:var(${i[1]})">${i[0]}</span>`).join('') })); },
    readout() { const r = h('div', { class: 'readout' }); body.append(r); return (items) => { r.innerHTML = items.map(i => `<div><small>${i[0]}</small><b>${i[1]}</b></div>`).join(''); }; },
    add(el) { body.append(el); return el; }
  };
}
function controls(parent, specs, onchange) {
  const vals = {}, wrap = h('div', { class: 'ctls' }); parent.append(wrap);
  specs.forEach((s) => {
    vals[s.k] = s.v; const id = 'c' + Math.random().toString(36).slice(2, 8);
    const out = h('output', { for: id }), inp = h('input', { type: 'range', id, min: s.min, max: s.max, step: s.step || 1, value: s.v, 'aria-label': s.label });
    const upd = () => { vals[s.k] = +inp.value; out.textContent = (s.fmt ? s.fmt(+inp.value) : fmt(+inp.value, s.d == null ? 2 : s.d)) + (s.unit ? ' ' + s.unit : ''); };
    inp.addEventListener('input', () => { upd(); onchange(vals); }); upd();
    wrap.append(h('div', { class: 'ctl' }, h('label', { for: id }, s.label), inp, out));
  });
  return vals;
}
function segmented(parent, items, cur, onpick) {
  const seg = h('div', { class: 'seg', role: 'group' });
  items.forEach(([k, label]) => { const b = h('button', { 'aria-pressed': k === cur, onclick: () => { $$('button', seg).forEach(x => x.setAttribute('aria-pressed', 'false')); b.setAttribute('aria-pressed', 'true'); onpick(k); } }, label); seg.append(b); });
  parent.append(seg); return seg;
}
/* number-input calculator: fields [{k,l,v,u,opts?}] ; out(v) -> [[label,value]] */
function calc(parent, title, fields, out, note) {
  const L = lab(parent, title, note); const vals = {};
  const inputs = h('div', { class: 'inputs' }); const res = L.readout();
  const wrap = h('div', { class: 'calc' }, inputs);
  fields.forEach(f => {
    vals[f.k] = f.v; const id = 'f' + Math.random().toString(36).slice(2, 8);
    const inp = f.opts ? h('select', { id }, f.opts.map(o => h('option', { value: o[0], selected: o[0] == f.v }, o[1]))) : h('input', { id, type: 'number', step: 'any', value: f.v, inputmode: 'decimal' });
    inp.addEventListener('input', () => { vals[f.k] = f.opts && isNaN(+inp.value) ? inp.value : +inp.value; run(); });
    inputs.append(h('label', {}, f.l + (f.u ? ' (' + f.u + ')' : ''), inp));
  });
  L.body.insertBefore(wrap, res ? L.body.lastChild : null);
  const run = () => { try { res(out(vals)); } catch (e) { res([['error', String(e)]]); } }; run();
  L.vals = vals; L.run = run;
  return L;
}
/* click-to-sort game: items [[text, binKey]], bins [[key,label]] */
function sorter(parent, title, caption, bins, items) {
  const L = lab(parent, title, caption + ' Tap a card, then tap the box it belongs to.');
  const box = h('div', { class: 'sorter' }); L.add(box);
  const pool = h('div', { class: 'pool' }), binsEl = h('div', { class: 'bins' }), score = h('div', { class: 'score' });
  box.append(pool, binsEl, score);
  let sel = null, right = 0, done = 0;
  const cards = shuffle(items).map(([t, k, why]) => { const c = h('button', { class: 'card2', 'aria-pressed': 'false', title: why || '' }, t); c._k = k; c._why = why; c.addEventListener('click', () => { if (c._placed) return; $$('.card2', pool).forEach(x => x.setAttribute('aria-pressed', 'false')); sel = c; c.setAttribute('aria-pressed', 'true'); }); pool.append(c); return c; });
  bins.forEach(([k, label]) => { const b = h('div', { class: 'bin', role: 'button', tabindex: 0 }, h('b', {}, label)); const drop = () => { if (!sel) return; const ok = sel._k === k; sel.classList.add(ok ? 'ok' : 'no'); sel.setAttribute('aria-pressed', 'false'); sel._placed = true; if (!ok) sel.textContent += ' → ' + bins.find(x => x[0] === sel._k)[1]; b.append(sel); right += ok; done++; sel = null; score.textContent = `${right} / ${done} correct` + (done === cards.length ? (right === done ? ' — perfect!' : ' — wrong ones show the right box.') : ''); }; b.addEventListener('click', drop); b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); drop(); } }); binsEl.append(b); });
  L.add(h('button', { class: 'btn', onclick: () => { L.root.remove(); } , hidden: true }));
  return L;
}

/* ===== figures used by questions ===== */
const FIGS = {};
function figure(name) { const f = FIGS[name]; if (!f) return null; const d = h('div', { class: 'netwrap', style: 'margin:8px 0' }); d.innerHTML = f(); return d; }

/* ===== lectures ===== */
const VIDEOS = '01=ilHPCbkZLV4 02=nmhuINAXksk 03=rAo0iMok7lI 04=A8-PtgugnGE 05=yC0A6_nYPYQ 06=J1-LpZr9GSQ 07=0O6fJSkafOo 08=sQyR78dlSzc 09=lWkKAZ0jatM 10=0JYkgfgKn8I 11=8RuJfk1Xj2U 12=iL1Tr96niAw 13=8UlgpszPK6w 14=GqMtULB0rLE 15=5W5xe-CJZTQ 16=0mpuhlabOWE 17=wqyJF-Gbdp0 18=U5v_uKQe0Ic 19=MzhN6eZIUNU 20=rOn-GA71uKM 21=sHoPCWz6YeQ 22=tgfMSfxqZRg 23=JXiFgnkKGAQ 24=w_Ka3XuXEbw 25=_KdYrzzMuBo 26=AvwZ7JO8LNk 27=B6Awvb58gIA 28=-gqtKDlYSJc 29=8w2gm0AO-KY 30=lFu77P8s2QQ 31=ikOTZBPaklE 32=TQWJYqOzs0g 33=MpNjo7bhBTg 34=wjd0YMixlJA 35=PehmL5jOmW8 36=Sg5eFtcugEA 37=ZcO5UNzMtz8 38=0aN4LPr7F_8 39=3Rjj4IyO3hc 40=UElqWoV7BgE 41=4ZLbpoBcdo8 42=bvt6NAabXPA 43=88pXUUtmnbg 44=I81fOjyzb0E 45=Ar0ynpJ86QU 46=zTpcEQH0T5c 47=uITAo7fbm3M 48=olrW1tqGnsM 49=-hlbuCXjNGY 50=TfvonvpVeTE 51=zQXss82WudM 52=ODQNex8xtjU 53=x9OHuhxICRw 54=kZ0HN-9zdik 55=k6I04YmQWl8 56=bfx1u27hvvU 57=jUUcunXtii0 58=5iuEGNEyAPU 59=M82c48MiL4w 60=Qfy0niH--tk'.split(' ').reduce((o, s) => { const [k, v] = s.split('='); o[+k] = v; return o; }, {});
const LECT = { 1: 'Introduction I', 2: 'Introduction II', 3: 'Introduction III', 4: 'PM standards', 5: 'Life cycle models I', 6: 'Life cycle models II', 7: 'Life cycle models III', 8: 'Life cycle models IV', 9: 'Life cycle models V', 10: 'Life cycle models VI', 11: 'Project evaluation I', 12: 'Project evaluation II', 13: 'Project evaluation III', 14: 'Project evaluation IV', 15: 'Programme management', 16: 'Estimation I', 17: 'Estimation II', 18: 'Estimation III', 19: 'Estimation IV (FP)', 20: 'Estimation V (FP)', 21: 'COCOMO basic', 22: 'COCOMO intermediate', 23: 'COCOMO II', 24: 'Halstead', 25: 'Staffing: Putnam, Jensen', 26: 'Project scheduling', 27: 'PERT/CPM I', 28: 'PERT/CPM II', 29: 'Project characteristics', 30: 'PERT/CPM illustration', 31: 'PERT, crashing', 32: 'Team management', 33: 'Organization & teams', 34: 'Teams, risk', 35: 'Risk, quality intro', 36: 'Resource allocation I', 37: 'Resource allocation II', 38: 'Resource allocation III', 39: 'Monitoring & control I', 40: 'Monitoring: reviews', 41: 'Code review', 42: 'Gantt, slip, timeline', 43: 'Earned value I', 44: 'Earned value II', 45: 'Back to target', 46: 'Change control, SCM', 47: 'SCM process & tools', 48: 'Contracts I', 49: 'Contracts II', 50: 'Project close-out', 51: 'Quality management', 52: 'ISO 9000', 53: 'ISO 9001, SEI CMM', 54: 'SEI CMM II', 55: 'SEI CMM III', 56: 'PSP, Six Sigma', 57: 'Reliability I', 58: 'Reliability II', 59: 'Reliability III', 60: 'Software testing' };
const lecLinks = (arr) => `<div class="lecs">${arr.map(n => `<a href="https://www.youtube.com/watch?v=${VIDEOS[n]}" target="_blank" rel="noopener" title="Lecture ${n}: ${LECT[n]}">L${n} ${LECT[n]}</a>`).join('')}</div>`;

/* ===== question rendering ===== */
const QPROG = store.get('q', {});
function recordQ(id, ok) { QPROG[id] = ok ? 1 : 0; store.set('q', QPROG); window.dispatchEvent(new Event('qprog')); }
const SRCNAME = { A26: 'ASSIGNMENT 2026', A19: 'ASSIGNMENT 2019', AI: 'NPTEL AI MOCK', N: 'NEW', G: 'FRESH NUMERICAL' };
function qLabel(q) { return q.src === 'AI' ? `NPTEL AI MOCK ${q.paper} · Q${q.n} · ${q.diff}` : q.src === 'A26' || q.src === 'A19' ? `${SRCNAME[q.src]} · W${q.wk} · Q${q.n}` : (SRCNAME[q.src] || 'PRACTICE') + (q.wk ? ' · W' + q.wk : ''); }
const L = i => String.fromCharCode(65 + i);
function renderQuestion(q, opts = {}) {
  const box = h('div', { class: 'q', id: 'q-' + q.id });
  const kind = q.type === 'nat' ? 'Numerical answer' : q.type === 'msq' ? 'Select all that apply' : 'Single answer';
  box.append(h('div', { class: 'qh' }, h('span', { class: 'pill hot' }, qLabel(q)), h('span', { class: 'pill' }, kind), opts.showTopic && q.topicTitle ? h('span', { class: 'pill' }, q.topicTitle) : null));
  if (q.passage) box.append(h('div', { class: 'passage', html: q.passage }));
  box.append(h('div', { class: 'qt', html: q.text }));
  if (q.fig) { const f = figure(q.fig); if (f) box.append(f); }
  let chosen = new Set(), answered = false, natIn, btn;
  const fb = h('div'), optsEl = h('div');
  const keyTxt = () => q.type === 'nat' ? `Answer: ${q.show || ((q.lo + q.hi) / 2)}` + ` (accepted ${q.lo} to ${q.hi})` : 'Correct: ' + q.ans.map(L).join(', ');
  const reveal = () => {
    if (answered) return; answered = true;
    let ok;
    if (q.type === 'nat') { const v = parseFloat(String(natIn.value).replace(/,/g, '')); ok = !isNaN(v) && v >= q.lo && v <= q.hi; }
    else { const A = new Set(q.ans); ok = A.size === chosen.size && [...A].every(x => chosen.has(x)); $$('.opt', optsEl).forEach((o, i) => { if (A.has(i)) o.classList.add('right'); else if (chosen.has(i)) o.classList.add('wrong'); $('input', o).disabled = true; }); }
    if (!q.noRecord) recordQ(q.id, ok);
    fb.innerHTML = `<div class="verdict ${ok ? 'ok' : 'no'}">${ok ? '✔ CORRECT' : '✘ NOT QUITE'} — ${keyTxt()}</div><div class="exp">${q.exp || ''}</div>`;
    if (btn) btn.hidden = true; if (opts.onAnswer) opts.onAnswer(ok);
  };
  if (q.type === 'nat') {
    natIn = h('input', { type: 'text', 'aria-label': 'your answer', placeholder: 'type a number', inputmode: 'decimal' });
    natIn.addEventListener('keydown', e => { if (e.key === 'Enter') reveal(); });
    btn = h('button', { class: 'btn primary', onclick: () => reveal() }, 'Check');
    box.append(h('div', { class: 'nat' }, natIn, btn, q.unit ? h('span', { class: 'cap' }, q.unit) : null));
  } else {
    const nm = 'q' + q.id + Math.random().toString(36).slice(2, 6);
    q.opts.forEach((t, i) => {
      const inp = h('input', { type: q.type === 'msq' ? 'checkbox' : 'radio', name: nm, id: `${nm}_${i}` });
      const o = h('label', { class: 'opt', for: inp.id }, inp, h('span', { html: `<b>${L(i)}.</b> ${t}` }));
      inp.addEventListener('change', () => {
        if (answered) return;
        if (q.type === 'msq') { inp.checked ? chosen.add(i) : chosen.delete(i); o.classList.toggle('sel', inp.checked); }
        else { chosen = new Set([i]); $$('.opt', optsEl).forEach(x => x.classList.remove('sel')); o.classList.add('sel'); reveal(); }
      });
      optsEl.append(o);
    });
    box.append(optsEl);
    if (q.type === 'msq') { btn = h('button', { class: 'btn primary', onclick: () => reveal() }, 'Check answer'); box.append(btn); }
  }
  box.append(h('button', { class: 'btn', style: 'margin-top:8px', onclick: () => { if (!answered) showOnly(); } }, 'Just show the answer'));
  function showOnly() {
    answered = true;
    if (q.type !== 'nat') { const A = new Set(q.ans); $$('.opt', optsEl).forEach((o, i) => { if (A.has(i)) o.classList.add('right'); $('input', o).disabled = true; }); }
    fb.innerHTML = `<div class="verdict ok">${keyTxt()}</div><div class="exp">${q.exp || ''}</div>`; if (btn) btn.hidden = true;
  }
  box.append(fb);
  return box;
}
function questionsFor(topicId, srcs) { return (window.QBANK || []).filter(q => q.topic === topicId && (!srcs || srcs.includes(q.src))); }

/* ===== registry + router ===== */
const PAGES = [];
const EMBED = {}; const embed = (id, fn) => (EMBED[id] = EMBED[id] || []).push(fn);
const MODULES = {
  home: 'Exam kit', w1: 'Week 1 · Introduction & standards', w2: 'Week 2 · Life cycle models', w3: 'Week 3 · Project evaluation', w4: 'Week 4 · Estimation & size', w5: 'Week 5 · COCOMO, Halstead, staffing', w6: 'Week 6 · Scheduling, PERT/CPM', w7: 'Week 7 · PERT, people, risk', w8: 'Week 8 · Resources & monitoring', w9: 'Week 9 · Reviews & earned value', w10: 'Week 10 · SCM, contracts, close-out', w11: 'Week 11 · Quality, ISO, CMM', w12: 'Week 12 · PSP, Six Sigma, reliability'
};
function page(p) { if (p.wk && !p.mod) p.mod = 'w' + p.wk; PAGES.push(p); }
const done = store.get('done', {});
function stars(n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }
const IMPORT = ['', 'Good to know', 'Likely asked', 'Must know'];
function topicHeader(p) {
  const nA = questionsFor(p.id, ['A26', 'A19']).length, nAI = questionsFor(p.id, ['AI']).length;
  return `<div class="crumb"><span>${MODULES[p.mod]}</span><span class="pill hot">${stars(p.stars)} ${IMPORT[p.stars]}</span>${nA ? `<span class="pill">${nA} assignment Qs</span>` : ''}${nAI ? `<span class="pill">${nAI} AI-mock Qs</span>` : ''}</div><h1>${p.title}</h1>${p.lede ? `<p class="lede">${p.lede}</p>` : ''}${p.lec ? lecLinks(p.lec) : ''}`;
}
function renderPage(id) {
  while (LAB_STOPS.length) { try { LAB_STOPS.pop()(); } catch (e) {} }
  const p = PAGES.find(x => x.id === id) || PAGES[0];
  const root = $('#page'); root.innerHTML = '';
  if (p.topic) root.insertAdjacentHTML('beforeend', topicHeader(p));
  if (p.topic && window.renderLearn) renderLearn(p, root);
  const body = h('div'); root.append(body);
  p.render(body, p);
  (EMBED[p.id] || []).forEach(fn => { const box = h('div', { class: 'embed' }); body.append(box); fn(box); });
  if (p.topic) {
    if (p.gens && window.GEN) {
      root.append(h('h2', {}, 'Fresh numericals on this topic'));
      root.append(h('p', { class: 'cap' }, 'New numbers every time you press the button. Type the answer like in the exam.'));
      const slot = h('div'); root.append(slot);
      const more = () => { slot.innerHTML = ''; p.gens.forEach(g => { const q = GEN.make(g); if (q) slot.append(renderQuestion(q)); }); };
      more(); root.append(h('button', { class: 'btn', onclick: more }, '↻ New numbers'));
    }
    const qs = questionsFor(p.id, ['A26', 'A19']);
    if (qs.length) {
      root.append(h('h2', { id: 'practice' }, 'Assignment questions on this topic'));
      root.append(h('p', { class: 'cap' }, 'From the 2026 and 2019 runs of this course. About 80-90 % of the exam is assignment-type, so answer these first, then read the reason.'));
      qs.forEach(q => root.append(renderQuestion(q)));
    }
    const ai = questionsFor(p.id, ['AI']);
    if (ai.length) { const d = h('details', {}, h('summary', {}, `More practice: ${ai.length} questions from the NPTEL AI mock papers`)); ai.forEach(q => d.append(renderQuestion(q))); root.append(d); }
    const topics = PAGES.filter(x => x.topic), ti = topics.indexOf(p);
    const mk = h('button', { class: 'btn' + (done[p.id] ? '' : ' primary'), onclick: (e) => { done[p.id] = !done[p.id]; store.set('done', done); e.target.textContent = done[p.id] ? '✔ Studied (tap to undo)' : 'Mark as studied'; e.target.classList.toggle('primary', !done[p.id]); buildNav(); } }, done[p.id] ? '✔ Studied (tap to undo)' : 'Mark as studied');
    root.append(h('div', { class: 'nextprev' }, ti > 0 ? h('button', { class: 'btn', onclick: () => go(topics[ti - 1].id) }, '← ' + topics[ti - 1].title) : h('span'), mk, ti < topics.length - 1 ? h('button', { class: 'btn', onclick: () => go(topics[ti + 1].id) }, topics[ti + 1].title + ' →') : h('span')));
  }
  document.title = p.id === 'home' ? 'SPM Exam Lab' : p.title + ' · SPM Exam Lab';
  $('#main').scrollTop = 0;
  $$('.navitem').forEach(b => b.getAttribute('data-id') === p.id ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current'));
  closeRail();
}
function go(id) { if (location.hash !== '#' + id) location.hash = id; else renderPage(id); }
function buildNav() {
  const nav = $('#nav'); const q = ($('#search').value || '').toLowerCase().trim(); nav.innerHTML = '';
  let lastMod = null;
  PAGES.forEach(p => {
    if (q && !(p.title + ' ' + (p.kw || '') + ' ' + MODULES[p.mod]).toLowerCase().includes(q)) return;
    if (p.mod !== lastMod) { nav.append(h('div', { class: 'navmod' }, MODULES[p.mod])); lastMod = p.mod; }
    nav.append(h('button', { class: 'navitem', 'data-id': p.id, onclick: () => go(p.id), 'aria-current': (location.hash.slice(1) || 'home') === p.id ? 'page' : null },
      h('span', {}, p.title), done[p.id] ? h('span', { class: 'done', title: 'studied' }) : (p.stars ? h('span', { class: 'stars', title: IMPORT[p.stars] }, '★'.repeat(p.stars)) : null)));
  });
}
function closeRail() { $('#rail').classList.remove('open'); const s = $('.scrim'); if (s) s.remove(); }
function openRail() { $('#rail').classList.add('open'); document.body.append(h('div', { class: 'scrim', onclick: closeRail })); }
function boot() {
  Theme.apply(); if (window.svgDefs) svgDefs();
  const tt = {}; PAGES.forEach(p => { if (p.topic) tt[p.id] = p.title; }); (window.QBANK || []).forEach(q => q.topicTitle = tt[q.topic] || q.topic);
  buildNav();
  $('#search').addEventListener('input', buildNav);
  $$('.themebtn').forEach(b => b.addEventListener('click', () => { const m = Theme.cycle(); $$('.themebtn').forEach(x => x.textContent = 'Theme: ' + m); }));
  $$('.themebtn').forEach(x => x.textContent = 'Theme: ' + Theme.mode);
  $('#menu').addEventListener('click', openRail);
  window.addEventListener('hashchange', () => renderPage(location.hash.slice(1) || 'home'));
  renderPage(location.hash.slice(1) || 'home');
}
