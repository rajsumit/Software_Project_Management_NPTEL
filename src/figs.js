/* ===== SVG network drawing (activity-on-node boxes) + question figures ===== */
/* nodes: [{id,name,x,y,es,d,ef,ls,fl,lf,cr}] ; edges: [[from,to]] ; 'S' and 'F' are start/finish pills */
function netSVG(nodes, edges, o = {}) {
  const W = o.w || 760, Hh = o.h || 320, bw = o.bw || 128, bh = 52;
  const by = {}; nodes.forEach(n => by[n.id] = n);
  const port = (n, side) => n.pill ? [n.x + (side === 'r' ? 30 : -30), n.y] : [n.x + (side === 'r' ? bw / 2 : -bw / 2), n.y];
  let s = `<svg class="net" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="${o.label || 'activity network'}"><defs><marker id="ah${o.k || ''}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="ah" d="M0 0L10 5L0 10z"/></marker><marker id="ahc${o.k || ''}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="ah cr" d="M0 0L10 5L0 10z"/></marker></defs>`;
  edges.forEach(([a, b]) => { const A = by[a], B = by[b]; if (!A || !B) return; const cr = A.cr && B.cr; const [x1, y1] = port(A, 'r'), [x2, y2] = port(B, 'l'); const mx = (x1 + x2) / 2; s += `<path class="ed${cr ? ' cr' : ''}" d="M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2 - 2} ${y2}" marker-end="url(#ah${cr ? 'c' : ''}${o.k || ''})"/>`; });
  nodes.forEach(n => {
    if (n.pill) { s += `<g class="se"><rect x="${n.x - 30}" y="${n.y - 14}" width="60" height="28" rx="14"/><text x="${n.x}" y="${n.y + 4}" text-anchor="middle">${n.name}</text></g>`; return; }
    const x = n.x - bw / 2, y = n.y - bh / 2, c3 = bw / 3; const v = k => n[k] == null ? '' : n[k];
    s += `<g class="nd${n.cr ? ' cr' : ''}"><rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="6"/><line x1="${x}" y1="${y + 17}" x2="${x + bw}" y2="${y + 17}"/><line x1="${x}" y1="${y + 35}" x2="${x + bw}" y2="${y + 35}"/><line x1="${x + c3}" y1="${y}" x2="${x + c3}" y2="${y + 17}"/><line x1="${x + 2 * c3}" y1="${y}" x2="${x + 2 * c3}" y2="${y + 17}"/><line x1="${x + c3}" y1="${y + 35}" x2="${x + c3}" y2="${y + bh}"/><line x1="${x + 2 * c3}" y1="${y + 35}" x2="${x + 2 * c3}" y2="${y + bh}"/>
      <text x="${x + c3 / 2}" y="${y + 13}" text-anchor="middle">${v('es')}</text><text x="${x + 1.5 * c3}" y="${y + 13}" text-anchor="middle">${v('d')}</text><text x="${x + 2.5 * c3}" y="${y + 13}" text-anchor="middle">${v('ef')}</text>
      <text class="nm" x="${n.x}" y="${y + 30}" text-anchor="middle">${n.name}</text>
      <text x="${x + c3 / 2}" y="${y + 48}" text-anchor="middle">${v('ls')}</text><text class="fl" x="${x + 1.5 * c3}" y="${y + 48}" text-anchor="middle">${v('fl')}</text><text x="${x + 2.5 * c3}" y="${y + 48}" text-anchor="middle">${v('lf')}</text></g>`;
  });
  return s + '</svg>';
}
const NODE_KEY = `<p class="cap">Box layout: <span class="mono">ES | duration | EF</span> on top, <span class="mono">LS | float | LF</span> below. Critical activities and arrows in red.</p>`;
FIGS.brigette = () => netSVG([
  { id: 'S', name: 'Start', pill: 1, x: 40, y: 160, cr: 1 },
  { id: 'A', name: 'A. Hardware selection', x: 190, y: 60, es: 0, d: 6, ef: 6, ls: 2, fl: 2, lf: 8 },
  { id: 'B', name: 'B. Software config', x: 190, y: 160, es: 0, d: 4, ef: 4, ls: 3, fl: 3, lf: 7 },
  { id: 'E', name: 'E. Recruit staff', x: 190, y: 262, es: 0, d: 10, ef: 10, ls: 0, fl: 0, lf: 10, cr: 1 },
  { id: 'C', name: 'C. Install hardware', x: 360, y: 60, es: 6, d: 3, ef: 9, ls: 8, fl: 2, lf: 11 },
  { id: 'D', name: 'D. Data migration', x: 360, y: 160, es: 4, d: 4, ef: 8, ls: 7, fl: 3, lf: 11 },
  { id: 'F', name: 'F. Draft office proc.', x: 360, y: 262, es: 10, d: 3, ef: 13, ls: 10, fl: 0, lf: 13, cr: 1 },
  { id: 'G', name: 'G. Install and test', x: 540, y: 110, es: 9, d: 2, ef: 11, ls: 11, fl: 2, lf: 13 },
  { id: 'Z', name: 'Finish', pill: 1, x: 700, y: 185, cr: 1 }],
  [['S', 'A'], ['S', 'B'], ['S', 'E'], ['A', 'C'], ['B', 'D'], ['C', 'G'], ['D', 'G'], ['E', 'F'], ['G', 'Z'], ['F', 'Z']], { k: 'b', h: 310, bw: 136, label: 'PERT chart, 2026 assignment 6' }) + NODE_KEY;
FIGS.net19 = () => {
  const P = { A: [50, 160], B: [150, 100], C: [150, 220], F: [250, 50], E: [250, 140], D: [250, 270], H: [350, 100], J: [350, 215], G: [350, 280], I: [450, 100], K: [450, 245], L: [560, 170] };
  const E = [['A', 'B', 1], ['A', 'C', 2], ['B', 'F', 2], ['B', 'E', 4], ['C', 'E', 2], ['C', 'D', 3], ['F', 'H', 2], ['E', 'H', 3], ['E', 'L', 5], ['H', 'I', 1], ['I', 'L', 2], ['D', 'J', 3], ['D', 'G', 2], ['J', 'K', 1], ['G', 'K', 1], ['K', 'L', 3]];
  let s = `<svg class="net" viewBox="0 0 620 320" role="img" aria-label="activity network with durations on arrows" style="min-width:520px"><defs><marker id="ahn" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="ah" d="M0 0L10 5L0 10z"/></marker></defs>`;
  E.forEach(([a, b, w]) => { const [x1, y1] = P[a], [x2, y2] = P[b], dx = x2 - x1, dy = y2 - y1, L0 = Math.hypot(dx, dy), ux = dx / L0, uy = dy / L0; s += `<line class="ed" x1="${x1 + ux * 20}" y1="${y1 + uy * 20}" x2="${x2 - ux * 22}" y2="${y2 - uy * 22}" marker-end="url(#ahn)"/><text x="${(x1 + x2) / 2 - uy * 10}" y="${(y1 + y2) / 2 + ux * 10 + 4}" text-anchor="middle" style="fill:var(--ch-i);font:800 13px var(--f-mono)">${w}</text>`; });
  Object.entries(P).forEach(([k, [x, y]]) => { s += `<g class="nd"><circle cx="${x}" cy="${y}" r="19" style="fill:var(--surface);stroke:var(--ink);stroke-width:1.6"/><text class="nm" x="${x}" y="${y + 5}" text-anchor="middle">${k}</text></g>`; });
  return s + '</svg><p class="cap">Numbers on the arrows are durations (redrawn from the 2019 assignment, week 6 Q2).</p>';
};
FIGS.cnode19 = () => {
  const N = { A: [90, 60, 'ES=7, EF=9', 'LS=10, LF=12'], B: [90, 210, 'ES=7, EF=10', 'LS=9, LF=12'], C: [300, 135, '', ''], D: [500, 60, 'ES=15, EF=25', 'LS=17, LF=27'], E: [500, 210, 'ES=15, EF=21', 'LS=17, LF=23'] };
  let s = `<svg class="net" viewBox="0 0 620 270" role="img" aria-label="portion of a PERT network" style="min-width:480px"><defs><marker id="ahq" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="ah" d="M0 0L10 5L0 10z"/></marker></defs>`;
  [['A', 'C'], ['B', 'C'], ['C', 'D'], ['C', 'E']].forEach(([a, b]) => { const [x1, y1] = N[a], [x2, y2] = N[b], dx = x2 - x1, dy = y2 - y1, L0 = Math.hypot(dx, dy); s += `<line class="ed" x1="${x1 + dx / L0 * 24}" y1="${y1 + dy / L0 * 24}" x2="${x2 - dx / L0 * 26}" y2="${y2 - dy / L0 * 26}" marker-end="url(#ahq)"/>`; });
  Object.entries(N).forEach(([k, [x, y, a, b]]) => { s += `<g class="nd"><circle cx="${x}" cy="${y}" r="22" style="fill:var(--surface);stroke:var(--ink);stroke-width:1.6"/><text class="nm" x="${x}" y="${y + 5}" text-anchor="middle">${k}</text>${a ? `<text x="${x}" y="${y - 38}" text-anchor="middle">${a}</text><text x="${x}" y="${y - 26}" text-anchor="middle">${b}</text>` : ''}</g>`; });
  return s + '</svg>';
};
