/* Fuzz-checks every numerical generator and Section II passage: node src/verify.js [runs] */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ctx = { console, Math, Date, JSON, Number, String, Array, Object, Set, isNaN, isFinite, parseFloat };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(`const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1)); const pick = a => a[Math.floor(Math.random() * a.length)];`, ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'gen.js'), 'utf8'), ctx);
const GEN = ctx.GEN, RUNS = +process.argv[2] || 300; let bad = 0, n = 0;
function check(q, where) {
  n++; const fail = m => { bad++; if (bad < 20) console.log('FAIL', where, m, (q.text || '').slice(0, 120)); };
  if (!q || !q.text || !q.exp || !q.topic || !q.wk) return fail('missing field');
  if (q.type === 'nat') { if (![q.v, q.lo, q.hi].every(Number.isFinite)) return fail('non-finite'); if (!(q.lo <= q.v && q.v <= q.hi)) return fail('value outside range'); if ((q.trap || []).some(([t]) => t >= q.lo && t <= q.hi && Math.abs(t - q.v) > 1e-9)) return fail('trap inside accepted range'); }
  else { if (!q.opts || q.opts.length < 2) return fail('few options'); if (new Set(q.opts.map(String)).size !== q.opts.length) return fail('duplicate options: ' + q.opts.join(' | ')); if (!q.ans.length || q.ans.some(a => a < 0 || a >= q.opts.length)) return fail('bad key'); }
}
for (const g of GEN.names) for (let i = 0; i < RUNS; i++) check(GEN.make(g), g);
for (const p of GEN.pnames) for (let i = 0; i < Math.ceil(RUNS / 3); i++) { const P = GEN.passage(p); if (!P.html || !P.qs.length) { bad++; console.log('FAIL passage', p); } P.qs.forEach(q => check(q, 'passage ' + p)); }
console.log(`${GEN.names.length} generators, ${GEN.pnames.length} passages, ${n} questions checked, ${bad} problems`);
process.exit(bad ? 1 : 0);
