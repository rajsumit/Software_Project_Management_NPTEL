/* ===== Week 6 (lectures 26-30): scheduling, WBS, PERT/CPM ===== */
page({ id: 't-wbs', wk: 6, topic: 1, stars: 2, lec: [26, 27], title: 'Scheduling, WBS & activity networks', kw: 'project scheduling process activity work breakdown structure WBS granularity deliverable task network activity on node activity on arrow PERT CPM DuPont Polaris dangle loop', lede: 'Turn the scope into activities, arrange them in a network, and the critical path tells you the shortest possible project.',
  render(b) {
    H(b, `<h2>Which chart shows what?</h2>${TBL(['Chart', 'Shows', 'Does not show'], [['Work breakdown structure', 'Hierarchy: deliverables → tasks → sub-tasks', 'Durations, precedence, critical path'], ['Activity network / PERT chart', 'Sequence, dependencies, concurrency, critical path; used for monitoring progress', 'Calendar picture of resource use'], ['Gantt chart', 'Bars along a time line, durations, slack; used for <b>resource planning</b>; today cursor in monitoring', 'Dependencies clearly'], ['Resource histogram', 'Demand for one resource over time', 'Activity durations']])}`);
    const L = lab(b, 'WBS explorer: an MIS project', 'Click a node to expand it. A WBS answers "what work is there?", not "when?" or "in what order?".');
    const tree = { n: 'MIS project', c: [{ n: 'Feasibility', c: [{ n: 'Overall requirements' }, { n: 'Risk analysis' }, { n: 'Cost/benefit' }] }, { n: 'Analysis', c: [{ n: 'Interview users' }, { n: 'Write SRS' }, { n: 'Review SRS' }] }, { n: 'Design', c: [{ n: 'Architecture' }, { n: 'Database design' }, { n: 'UI design' }] }, { n: 'Programming', c: [{ n: 'Code module A' }, { n: 'Code module B' }, { n: 'Test plan' }] }, { n: 'Testing', c: [{ n: 'Integration test' }, { n: 'System test' }] }] };
    const box = h('div'); L.add(box); const open = new Set(['MIS project']);
    const rend = (t, lvl) => { const has = t.c && t.c.length, isO = open.has(t.n); const row = h('div', { style: `margin-left:${lvl * 22}px;display:flex;gap:6px;align-items:center;margin-top:4px` }, h('button', { class: 'btn', style: 'padding:3px 9px', onclick: () => { if (has) { isO ? open.delete(t.n) : open.add(t.n); draw(); } } }, (has ? (isO ? '▾ ' : '▸ ') : '• ') + t.n), h('span', { class: 'cap' }, 'level ' + (lvl + 1))); box.append(row); if (has && isO) t.c.forEach(c => rend(c, lvl + 1)); };
    const draw = () => { box.innerHTML = ''; rend(tree, 0); }; draw();
    L.add(h('div', { class: 'flowline' }, h('button', { class: 'btn', onclick: () => { const all = t => { open.add(t.n); (t.c || []).forEach(all); }; all(tree); draw(); } }, 'Expand all'), h('button', { class: 'btn', onclick: () => { open.clear(); open.add('MIS project'); draw(); } }, 'Collapse')));
    H(b, TRAP('A WBS does NOT show durations or dependencies (2026 A6 Q1, Q3). An activity network CAN show concurrent activities (2026 A6 Q2).', 'To decompose activities into manageable tasks use a WBS, not a PERT or Gantt chart (2019 W6 Q1).', 'PERT vs CPM: statistical vs deterministic durations (2019 W6 Q5).'));
  } });

page({ id: 't-cpm', wk: 6, topic: 1, stars: 3, lec: [27, 28, 29, 30], title: 'CPM/PERT: forward & backward pass', kw: 'earliest start finish latest start finish float slack forward pass backward pass merge burst critical path sub-critical free float Gantt', lede: 'The most reliable source of marks in the course: given a table of activities, find ES, EF, LS, LF, float and the critical path. Practise until it is mechanical.',
  gens: ['cpm-T', 'cpm-float', 'float-basic'],
  render(b) {
    const L = lab(b, 'CPM workbench', 'Edit the activity table (predecessors separated by commas) or load a preset. The network, table and Gantt chart are recomputed. Try delaying an activity.');
    const presets = {
      brig: ['Lecture example (Hughes/Mall, 8 activities)', [['A', 'Hardware selection', 6, ''], ['B', 'System configuration', 4, ''], ['C', 'Install hardware', 3, 'A'], ['D', 'Data migration', 4, 'B'], ['E', 'Draft office procedures', 3, 'B'], ['F', 'Recruit staff', 10, ''], ['G', 'User training', 3, 'E,F'], ['H', 'Install and test', 2, 'C,D']]],
      a26: ['2026 assignment 6 figure', [['A', 'Hardware selection', 6, ''], ['B', 'Software config', 4, ''], ['C', 'Install hardware', 3, 'A'], ['D', 'Data migration', 4, 'B'], ['E', 'Recruit staff', 10, ''], ['F', 'Draft office procedures', 3, 'E'], ['G', 'Install and test', 2, 'C,D']]],
      ex1: ['Scheduling exercise 1 (lecture)', [['A', '', 5, ''], ['B', '', 6, ''], ['C', '', 4, 'A'], ['D', '', 3, 'A'], ['E', '', 1, 'A'], ['F', '', 4, 'E'], ['G', '', 14, 'D,F'], ['H', '', 12, 'B,C'], ['I', '', 2, 'G,H']]],
      ex2: ['Scheduling exercise 2 (lecture)', [['A', '', 2, ''], ['B', '', 6, ''], ['C', '', 4, ''], ['D', '', 3, 'A'], ['E', '', 5, 'C'], ['F', '', 6, 'A'], ['G', '', 3, 'B,D,E']]],
      q19: ['2019 W6 Q9 (followers converted)', [['A', '', 3, ''], ['B', '', 2, 'A'], ['C', '', 8, 'B'], ['D', '', 4, 'C'], ['E', '', 5, 'A'], ['F', '', 10, 'B,D,E'], ['G', '', 10, 'C']]] };
    let rows = presets.brig[1].map(r => r.slice()), delay = {};
    const ps = h('select', { class: 'sel' }, Object.entries(presets).map(([k, v]) => h('option', { value: k }, v[0]))); L.add(h('div', { class: 'calc' }, h('div', { class: 'inputs' }, h('label', {}, 'Preset', ps))));
    const tb = h('table', { class: 'etbl' }); L.add(h('div', { class: 'tblwrap' }, tb));
    L.add(h('div', { class: 'flowline' }, h('button', { class: 'btn', onclick: () => { const id = String.fromCharCode(65 + rows.length); rows.push([id, '', 3, rows.length ? rows[rows.length - 1][0] : '']); delay = {}; draw(); } }, '+ activity'), h('button', { class: 'btn', onclick: () => { delay = {}; draw(); } }, 'Clear delays')));
    const netBox = h('div', { class: 'netwrap' }); L.add(netBox); const ro = L.readout(); const res = h('div'); L.add(res); const gBox = h('div', { class: 'netwrap' }); L.add(gBox);
    ps.addEventListener('change', () => { rows = presets[ps.value][1].map(r => r.slice()); delay = {}; draw(); });
    function draw() {
      tb.innerHTML = '<tr><th>ID</th><th>Name</th><th class="num">Duration</th><th>Predecessors</th><th class="num">Delay +</th><th></th></tr>';
      rows.forEach((r, i) => { const mk = (k, w) => { const inp = h('input', { value: r[k], style: w ? `width:${w}` : '' }); inp.addEventListener('change', () => { r[k] = k === 2 ? Math.max(0, +inp.value || 0) : inp.value.toUpperCase().replace(/\s/g, ''); if (k === 1) r[k] = inp.value; draw(); }); return inp; }; const dl = h('input', { type: 'number', min: 0, value: delay[r[0]] || 0 }); dl.addEventListener('change', () => { delay[r[0]] = Math.max(0, +dl.value || 0); draw(); }); tb.append(h('tr', {}, h('td', {}, mk(0, '3.2em')), h('td', {}, mk(1)), h('td', {}, mk(2, '4.5em')), h('td', {}, mk(3, '6em')), h('td', {}, dl), h('td', {}, h('button', { class: 'rm', title: 'remove', onclick: () => { rows.splice(i, 1); draw(); } }, '×')))); });
      const ids = rows.map(r => r[0]); const acts = rows.map(r => ({ id: r[0], name: r[1], d: (+r[2] || 0) + (delay[r[0]] || 0), pre: (r[3] || '').split(',').map(s => s.trim()).filter(s => s && ids.includes(s)) }));
      // topological order check
      const order = [], seen = new Set(); let guard = 0; while (order.length < acts.length && guard++ < 500) { acts.forEach(a => { if (!seen.has(a.id) && a.pre.every(p => seen.has(p))) { seen.add(a.id); order.push(a); } }); }
      if (order.length < acts.length) { netBox.innerHTML = '<p class="cap" style="padding:10px">The network has a loop or an unknown predecessor: fix the table (networks may not contain loops).</p>'; ro([]); res.innerHTML = ''; gBox.innerHTML = ''; return; }
      const net = GEN.cpm(order);
      // layout
      const lvl = {}; order.forEach(a => lvl[a.id] = a.pre.length ? Math.max(...a.pre.map(p => lvl[p])) + 1 : 0); const maxL = Math.max(...Object.values(lvl)); const cols = {}; order.forEach(a => (cols[lvl[a.id]] = cols[lvl[a.id]] || []).push(a));
      const colW = 170, H0 = Math.max(...Object.values(cols).map(c => c.length)) * 78 + 40, Wd = (maxL + 1) * colW + 200;
      const nodes = [{ id: '_S', name: 'Start', pill: 1, x: 40, y: H0 / 2, cr: 1 }]; order.forEach(a => { const c = cols[lvl[a.id]], k = c.indexOf(a); nodes.push({ id: a.id, name: (a.id + (a.name ? '. ' + a.name : '')).slice(0, 18), x: 160 + lvl[a.id] * colW, y: (k + 1) * H0 / (c.length + 1), es: a.es, d: a.d, ef: a.ef, ls: a.ls, fl: a.fl, lf: a.lf, cr: a.fl === 0 }); }); nodes.push({ id: '_F', name: 'Finish', pill: 1, x: Wd - 50, y: H0 / 2, cr: 1 });
      const edges = []; order.forEach(a => { if (!a.pre.length) edges.push(['_S', a.id]); a.pre.forEach(p => edges.push([p, a.id])); if (!order.some(s => s.pre.includes(a.id))) edges.push([a.id, '_F']); });
      netBox.innerHTML = netSVG(nodes, edges, { w: Wd, h: H0, k: 'cpm', bw: 132 }) + NODE_KEY;
      const base = presets[ps.value] ? null : null;
      ro([['project duration', net.T], ['critical path(s)', net.paths.map(p => p.join('-')).join(' · ') || '—'], ['activities with float', order.filter(a => a.fl > 0).map(a => a.id + ':' + a.fl).join(' ') || 'none']]);
      res.innerHTML = GEN.netWork(net);
      // gantt
      const T = net.T || 1, gw = 640, rowH = 22, gx = v => 90 + v / T * (gw - 110); let g = `<svg class="gantt" viewBox="0 0 ${gw} ${order.length * rowH + 30}">`; for (let t = 0; t <= T; t += Math.max(1, Math.round(T / 10))) g += `<line class="ax" x1="${gx(t)}" y1="0" x2="${gx(t)}" y2="${order.length * rowH + 4}"/><text class="axt" x="${gx(t)}" y="${order.length * rowH + 18}" text-anchor="middle">${t}</text>`;
      order.forEach((a, i) => { const y = i * rowH + 4; g += `<text x="6" y="${y + 13}">${a.id}${a.name ? ' ' + a.name.slice(0, 9) : ''}</text><rect class="bar${a.fl === 0 ? ' cr' : ''}" x="${gx(a.es)}" y="${y}" width="${Math.max(2, gx(a.ef) - gx(a.es))}" height="14" rx="3"/>${a.fl > 0 ? `<rect class="fl" x="${gx(a.ef)}" y="${y}" width="${gx(a.lf) - gx(a.ef)}" height="14" rx="3"/>` : ''}`; });
      gBox.innerHTML = g + '</svg><p class="cap">Gantt chart at earliest start; dashed box = float (the unshaded "lax time" of the lecture\'s Gantt chart).</p>';
    }
    draw();
    H(b, TRAP('The critical path need not contain the most activities, and never contains all of them (unless the network is one chain) (2026 A6 Q4, 2019 W6 Q7).', 'Float = LS − ES, NOT duration-dependent; critical activities have ZERO float; not all activities can have float (2026 A6 Q9).', 'ES = 5, LF = 30, d = 10 → EF 15, LS 20, float 15 (2026 A6 Q10).', 'Delay D by 2 weeks in the 2026 figure: D finishes at 10, project still 13, D still not critical (it had 3 weeks of float) (2026 A6 Q8).', 'Merge point → MAX of predecessor EFs; burst point → MIN of successor LSs. Do not swap them.'));
  } });
