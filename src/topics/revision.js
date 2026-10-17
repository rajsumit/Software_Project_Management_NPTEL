/* ===== Revision sheet ===== */
page({ id: 'revision-sheet', mod: 'home', title: 'Revision sheet: the night before', kw: 'revision formula sheet summary cheat one page traps checklist exam day', render(b) {
  H(b, `<h1>Revision sheet</h1><p class="lede">Everything you must be able to write from memory, on one page: every formula with its unit and its classic trap, one-liners per week, and the exam-day checklist.</p>`);
  const FX = [
    ['W3 · Evaluation', [
      ['Net profit', 'Σ income − Σ cost over the project life', 'Ignores timing of cash flows'],
      ['ROI', '(net profit ÷ number of years) ÷ total investment × 100', 'Divide by years first; ROI ignores timing'],
      ['Payback period', 'first year in which accumulated cash flow ≥ 0', 'Count from year 0 (the investment)'],
      ['Discount factor', '1 / (1 + r)<sup>t</sup>', 'r as a fraction: 10 % → 0.10'],
      ['NPV', 'Σ CF<sub>t</sub> / (1 + r)<sup>t</sup>  (year 0 is not discounted)', 'Higher NPV is better; risky project → higher r'],
      ['IRR', 'the r at which NPV = 0', 'Compare with the cost of capital'],
      ['Expected value', 'Σ outcome × probability', 'Probabilities must add up to 1']]],
    ['W4 · Size', [
      ['Simplistic effort', 'size ÷ productivity (e.g. SLOC ÷ SLOC/PM)', ''],
      ['Person-month', '1 PM = 152 hours (19 days × 8 h, COCOMO)', 'Not 160 or 176'],
      ['UFP (IFPUG)', 'Σ count × weight; average weights EI 4, EO 5, EQ 4, ILF 10, EIF 7', 'Simple/average/complex: EI 3/4/6, EO 4/5/7, EQ 3/4/6, ILF 7/10/15, EIF 5/7/10'],
      ['VAF', '0.65 + 0.01 × TDI  (14 GSCs, each 0-5, TDI 0-70)', 'VAF range 0.65-1.35; do not forget 0.65'],
      ['Adjusted FP', 'UFP × VAF', ''],
      ['Mark II FP', '0.58·N<sub>i</sub> + 1.66·N<sub>e</sub> + 0.26·N<sub>o</sub>', 'Inputs, entity accesses, outputs'],
      ['COSMIC FP', 'entries + exits + reads + writes (1 CFP each)', 'For real-time/embedded']]],
    ['W5 · COCOMO & co.', [
      ['Basic COCOMO effort', 'E = a · KLOC<sup>b</sup> PM; organic 2.4/1.05, semi-detached 3.0/1.12, embedded 3.6/1.20', 'KLOC, not LOC'],
      ['Development time', 'Tdev = 2.5 · E<sup>c</sup> months; c = 0.38 / 0.35 / 0.32', 'Tdev depends on effort, not size'],
      ['Staff & cost', 'average staff = E ÷ Tdev;  cost = E × salary per PM', ''],
      ['Intermediate COCOMO', 'E = E<sub>nominal</sub> × EAF;  EAF = product of 15 cost-driver multipliers', 'Multiplier > 1 raises effort, < 1 lowers it'],
      ['COCOMO II (early/post-arch.)', 'E = 2.94 × size<sup>B</sup> × Π EM;  B = 0.91 + 0.01 × Σ SF (5 scale factors)', 'Application composition: PM = NAP × (1 − %reuse/100) ÷ PROD; NAP weights screens 1/2/3, reports 2/5/8, 3GL module 10'],
      ['Halstead', 'η = η₁ + η₂, N = N₁ + N₂, V = N log₂η, N̂ = η₁log₂η₁ + η₂log₂η₂', 'η = unique, N = total'],
      ['Halstead effort', 'L = V*/V, E = V/L = V²/V*, T = E/S with S = 18 per s', 'V* = (2 + η₂*) log₂(2 + η₂*)'],
      ['Putnam', 'effort ∝ 1/t<sub>d</sub><sup>4</sup> → ratio (t₁/t₂)<sup>4</sup>', 'Half the time → 16 × effort'],
      ['Jensen', 'effort ∝ 1/t<sub>d</sub><sup>2</sup> → ratio (t₁/t₂)<sup>2</sup>', 'Half the time → 4 × effort'],
      ['Boehm limit', 'cannot compress below ≈ 75 % of the nominal schedule', '']]],
    ['W6-7 · Scheduling & risk', [
      ['Forward pass', 'ES = max EF of predecessors; EF = ES + d', 'Merge → MAX'],
      ['Backward pass', 'LF = min LS of successors; LS = LF − d', 'Burst → MIN'],
      ['Total float', 'LS − ES = LF − EF  (0 on the critical path)', ''],
      ['Free float', 'min ES of successors − EF', 'Free ≤ total'],
      ['PERT expected time', 't<sub>e</sub> = (a + 4m + b) / 6', 'a optimistic, m most likely, b pessimistic'],
      ['PERT spread', 'σ = (b − a)/6, σ² = ((b − a)/6)²; path σ² = Σ σ²', 'Add variances, never σ'],
      ['Probability', 'z = (target − T<sub>e</sub>) / σ<sub>path</sub>', ''],
      ['Risk exposure', 'RE = probability × loss', ''],
      ['Risk reduction leverage', 'RRL = (RE<sub>before</sub> − RE<sub>after</sub>) / cost of reduction', 'RRL > 1 → worth doing'],
      ['Communication paths', 'n(n − 1)/2', '10 people → 45']]],
    ['W8-9 · Monitoring', [
      ['Schedule variance', 'SV = EV − PV', 'Negative = behind schedule'],
      ['Cost variance', 'CV = EV − AC', 'Negative = over budget'],
      ['SPI, CPI', 'SPI = EV/PV,  CPI = EV/AC', '< 1 is bad'],
      ['Estimate at completion', 'EAC = BAC / CPI', 'Divide, do not multiply'],
      ['Time estimate at completion', 'TEAC = SAC / SPI', ''],
      ['% complete', 'EV / BAC × 100 (% spent = AC / BAC)', 'Use 0/100 crediting for software']]],
    ['W10-12 · Contracts, quality, reliability', [
      ['FP pricing', 'price = FP × rate (by FP slab)', 'Fixed price per unit contract'],
      ['POFOD', 'failures ÷ demands', '0.001 = 1 in 1000; no time involved'],
      ['MTTF', 'Σ(t<sub>i+1</sub> − t<sub>i</sub>) / (n − 1)', 'n failure times → n − 1 gaps'],
      ['MTBF', 'MTTF + MTTR', ''],
      ['Availability (inherent)', 'MTBF / (MTBF + MTTR) (course formula)', 'Convert days to hours first'],
      ['DPMO', 'defects ÷ (units × opportunities) × 10⁶', 'Six Sigma = 3.4; 5σ ≈ 230; 4σ ≈ 6210']]]];
  FX.forEach(([g, rows]) => H(b, `<h3>${g}</h3>${TBL(['Quantity', 'Formula', 'Trap / note'], rows.map(r => [`<b>${r[0]}</b>`, `<span class="mono">${r[1]}</span>`, r[2]]), 'rev')}`));

  H(b, `<h2>One line per lecture block</h2>`);
  const WK = [
    ['W1', 'Introduction & standards', ['Project = unique, planned, specific objective, temporary, has a client; job = routine; exploration = outcome uncertain', 'Software projects: invisible, complex, flexible, conformity', 'PM: planning (estimation, scheduling, staffing), monitoring and control; "plan the work, work the plan"', 'PMBOK (PMI, knowledge-based) groups: initiating, planning, executing, monitoring & controlling, closing; PRINCE2 (UK, process-based)', 'W5HH (Boehm): why, what, when, who, where, how, how much']],
    ['W2', 'Life cycle models', ['Waterfall: max total effort = maintenance; among development phases = testing; no phase overlap, big-bang integration', 'V-model: each development phase pairs with a test phase', 'Prototyping: throw-away vs evolutionary; good when requirements or technology are unclear', 'Spiral (Boehm): risk-driven meta-model, each loop = a phase; incremental: value/cost ratio first', 'Agile: Scrum (PO, Scrum master, team; sprint ≤ 1 month; daily scrum), XP (pair programming, TDD), burndown chart']],
    ['W3', 'Evaluation & programmes', ['Business case: benefits, costs, risks; strategic, technical, economic assessment', 'Cost categories: development, setting up, operational; fixed/variable; direct/indirect (overheads)', 'ROI, payback, NPV, IRR (see formulas); NPV handles timing, ROI does not', 'Risk evaluation: risk matrix, risk premium on r, expected value, sensitivity (risk profile), decision trees', 'Programme types: strategic, business cycle, infrastructure, R&D, innovative partnership; PPM: definition, management, optimisation']],
    ['W4', 'Estimation basics, FP', ['Estimates: effort, duration, cost; over-estimate → Parkinson\'s law; under-estimate → Brooks\' law / poor quality', 'Techniques: expert judgement, Delphi, analogy, parametric, top-down vs bottom-up, price to win', 'LOC: language-dependent, known late; FP: language-independent, from the requirements', 'FP: EI, EO, EQ, ILF, EIF + 14 GSCs; Mark II for transactions; COSMIC for embedded']],
    ['W5', 'COCOMO, Halstead, staffing', ['Organic (accounting), semi-detached (compilers, linkers), embedded (OS, real-time)', 'Intermediate: 15 drivers in 4 groups (product, computer, personnel, project); complete COCOMO: per sub-system', 'COCOMO II: application composition → early design → post-architecture (+ reuse)', 'Halstead = analytical; operators/operands', 'Rayleigh/Norden staffing; Putnam t⁴, Jensen t²; Brooks: adding people to a late project makes it later']],
    ['W6', 'Scheduling, CPM', ['WBS: deliverable- or activity-oriented; leaf = work package', 'Activity-on-node (precedence) vs activity-on-arrow; dummy activities only in AoA', 'Critical path = longest path = shortest project duration; float 0', 'Gantt chart shows bars over time; network shows logic']],
    ['W7', 'PERT, people, organisations, risk', ['PERT: three estimates, probability of meeting a date; crashing: shorten cheapest critical activity, re-check paths', 'Taylor (scientific mgmt), McGregor X/Y, Maslow, Herzberg (hygiene vs motivators), Vroom (expectancy × instrumentality × valence), Oldham-Hackman', 'Belbin: eligible vs suitable candidates; Hawthorne effect', 'Functional / project / matrix organisation; chief-programmer, democratic, mixed teams', 'Risk: identify, analyse (P × impact), plan (accept, avoid, reduce, transfer), monitor; Boehm\'s top 10']],
    ['W8', 'Resources & monitoring', ['Resource histogram, smoothing/levelling within float; priority: total float, ordered list', 'Three schedules: activity, resource, cost', 'Monitoring: reporting (oral/written × formal/informal × regular/ad hoc), RAG traffic lights, checkpoints (time- vs event-driven)', 'Reviews: planning, overview, preparation, meeting, rework, follow-up']],
    ['W9', 'Code review, EVA', ['Code walkthrough (informal) vs inspection (formal, checklists, defect classes)', 'Gantt, slip chart (sharper bend = further behind), timeline chart', 'EVA: PV/BCWS, EV/BCWP, AC/ACWP; crediting 0/100, 50/50, milestone, 75/25', 'Getting back on track: shorten critical path, add resources, overtime, reduce scope or quality, change precedences']],
    ['W10', 'SCM, contracts, close-out', ['SCM: version, revision, variant, baseline; reserve/restore (check-out/check-in); CCB; SCCS/RCS (deltas, text files only)', 'Contracts: fixed price, time & materials, fixed price per unit; tendering open, restricted, negotiated', 'Contract terms: scope, acceptance procedures, standards, project and quality management, timetable, price and payment', 'Close-out: administrative and contract closure; lessons learnt, archive']],
    ['W11', 'Quality, ISO, CMM', ['Quality factors: portability, usability, reusability, correctness, maintainability', 'QA (process, preventive) vs QC (product, detective); quality evolved inspection → QC → QA → TQM', 'ISO 9000 series 1987; 9001 = design, development, production, servicing; certification via a registrar, re-audit', 'CMM levels 1-5: Initial, Repeatable, Defined, Managed, Optimizing; KPAs from level 2; ISO 9001 ≈ level 3']],
    ['W12', 'PSP, Six Sigma, reliability, testing', ['CMMI (integrates many models): development, services, acquisition', 'PSP0 measurement → PSP1 planning → PSP2 quality → PSP3 evolution', 'Six Sigma: 3.4 DPMO; DMAIC (improve existing), DMADV (new process)', 'Reliability: observer-dependent, 90-10 rule; growth models Jelinski-Moranda (step), Littlewood-Verall (allows negative growth)', 'Error → fault → failure; unit, integration and system testing across the life cycle; stop when the bug-detection rate falls off (or estimate with bug seeding)']]];
  const g = h('div', { class: 'grid2' }); WK.forEach(([w, t, li]) => { const c = h('div', { class: 'card' }); c.innerHTML = `<h3><span class="pill">${w}</span> ${t}</h3><ul>${li.map(x => `<li>${x}</li>`).join('')}</ul>`; g.append(c); }); b.append(g);

  H(b, `<h2>Top 15 traps</h2>${TRAP(
    'Maintenance is the largest effort overall; testing is the largest among development phases.',
    'Merge node → MAX in the forward pass; burst node → MIN in the backward pass.',
    'PERT: add variances along the path, then take the square root.',
    'Putnam (t⁴) vs Jensen (t²): read which model is asked.',
    'Tdev uses effort E, not KLOC; COCOMO uses KLOC, not LOC.',
    'VAF = 0.65 + 0.01 × TDI; TDI is the SUM of 14 ratings.',
    'EI updates an ILF; EQ retrieves without derived data; EO has derived data or calculations.',
    'SV and CV: EV first (EV − PV, EV − AC).',
    'EAC = BAC ÷ CPI.',
    'Hygiene factors only prevent dissatisfaction; they do not motivate.',
    'Canteen chat = oral, informal, ad hoc; weekly meeting = oral, formal, regular.',
    'POFOD has no time in it; ROCOF does.',
    'ISO 9001 certifies a process (the organisation), not a product.',
    'CMM level 2 = project management; level 3 = organisation-wide defined process.',
    'Crashing costs money; reducing scope is not crashing.')}`);

  H(b, `<h2>Exam-day checklist</h2>`);
  const CK = ['Hall ticket printed, government photo ID', 'Reach the centre early (reporting time on the hall ticket)', 'No physical calculator: practise with an on-screen calculator', 'Read each question\'s type: single answer, multiple select, or typed numerical', 'Section II: read the whole passage first, note the given numbers, then answer each linked question', 'Write units in your head (hours vs days, Rs. vs lakh, % vs fraction)', 'No question left blank (no negative marking reported in this cycle; confirm the on-screen instructions)', 'Keep 15 minutes at the end to review flagged questions'];
  const ck = store.get('ck', {}); const ul = h('div', { class: 'card' }); CK.forEach((t, i) => { const cb = h('input', { type: 'checkbox' }); cb.checked = !!ck[i]; cb.addEventListener('change', () => { ck[i] = cb.checked; store.set('ck', ck); }); ul.append(h('label', { style: 'display:flex;gap:10px;align-items:flex-start;padding:5px 0' }, cb, h('span', {}, t))); }); b.append(ul);
} });

/* ===== Flashcards ===== */
const FLASH = [
  [1, 'Project (vs job, exploration)', 'Non-routine, planned, specific objective, temporary, has a client/sponsor. A job is routine and repetitive; an exploration has an uncertain outcome.'],
  [1, 'Software projects vs other projects', 'Invisibility (progress cannot be seen), frequent changes with a large, hard-to-estimate impact, and complexity.'],
  [1, 'Software crisis symptoms', 'Late, over budget, fails requirements, hard to alter, debug or enhance.'],
  [1, 'PMBOK process groups', 'Initiating, planning, executing, monitoring & controlling, closing.'],
  [1, 'PMBOK vs PRINCE2', 'PMBOK: PMI (USA), knowledge-based guide. PRINCE2: UK government, process-based method.'],
  [1, 'W5HH principle', 'Boehm: why, what, when, who, where, how, how much.'],
  [1, 'Stakeholder', 'Anyone with an interest in the project: sponsor, customer, users, team, management, suppliers.'],
  [2, 'Classical waterfall phases', 'Feasibility → requirements → design → coding & unit testing → integration & system testing → maintenance.'],
  [2, 'Iterative waterfall', 'Adds feedback paths to earlier phases to correct errors; phase containment of errors.'],
  [2, 'V-model pairs', 'Requirements ↔ system/acceptance test, high-level design ↔ integration test, detailed design ↔ unit test.'],
  [2, 'Prototyping model', 'Build a quick working model to clarify requirements or technical issues, then build the real system. Throw-away or evolutionary.'],
  [2, 'Spiral model', 'Boehm\'s risk-driven meta-model: each loop = objectives, risk analysis, development, review/planning.'],
  [2, 'Incremental delivery priority', 'Deliver increments in order of value-to-cost ratio, highest first.'],
  [2, 'RAD', 'Rapid application development: reduce development time and cost and accommodate change requests as early as possible, via quick prototypes and customer feedback.'],
  [2, 'Scrum roles', 'Product owner (backlog priorities), Scrum master (removes impediments), development team (self-organising).'],
  [2, 'Daily scrum', '15-minute standing meeting: what I did yesterday, what I will do today, obstacles.'],
  [2, 'Burndown chart', 'Remaining work (hours) plotted against sprint days.'],
  [2, 'XP practices', 'Pair programming, test-driven development, continuous integration, small releases, refactoring, simple design.'],
  [3, 'Feasibility study', 'The business case: strategic, technical and economic assessment that justifies starting the project.'],
  [3, 'ROI', '(Average annual profit ÷ total investment) × 100. Ignores timing of cash flows.'],
  [3, 'Payback period', 'Time until accumulated cash flow turns non-negative. Ignores what happens afterwards.'],
  [3, 'NPV', 'Sum of discounted cash flows Σ CF/(1+r)^t. Accounts for timing; choose the highest NPV.'],
  [3, 'IRR', 'The discount rate at which NPV = 0. Compare with the cost of capital.'],
  [3, 'Risk premium', 'Add a few % to the discount rate for riskier projects (risk and NPV method).'],
  [3, 'Risk profile analysis', 'Sensitivity analysis: vary each factor to find which most affects the outcome.'],
  [3, 'Decision tree', 'Evaluates a decision by expected values of its branches, including effects on future options.'],
  [3, 'Programme (Ferns)', 'A group of projects managed in a coordinated way to obtain benefits not available individually.'],
  [3, 'Project portfolio management', 'Portfolio definition → portfolio management → portfolio optimisation.'],
  [3, 'Indirect cost', 'Overheads not tied to one project: insurance, air conditioning, lighting, admin staff.'],
  [4, 'Parkinson\'s law', 'Work expands to fill the time available: over-estimates get used up.'],
  [4, 'Brooks\' law', 'Adding manpower to a late software project makes it later.'],
  [4, 'Delphi technique', 'Experts estimate anonymously; a coordinator circulates a summary; repeat until estimates converge.'],
  [4, 'Estimation by analogy', 'Base the estimate on completed projects with similar characteristics, adjusted for the differences.'],
  [4, 'Top-down vs bottom-up', 'Top-down: overall estimate split among parts (parametric). Bottom-up: estimate each work package and add up (WBS).'],
  [4, 'Price to win', 'The estimate is whatever wins the contract: not a real estimation technique.'],
  [4, 'External input (EI)', 'Data entering the boundary that updates an internal logical file.'],
  [4, 'External output (EO)', 'Data leaving the boundary with derived data or calculations (reports).'],
  [4, 'External inquiry (EQ)', 'Input-output retrieval with no update and no derived data.'],
  [4, 'ILF vs EIF', 'ILF: logical file maintained inside the boundary. EIF: referenced but maintained by another application.'],
  [4, 'VAF', '0.65 + 0.01 × TDI; 14 general system characteristics rated 0-5; range 0.65-1.35.'],
  [4, 'Mark II FP', 'Symons: 0.58 × input items + 1.66 × entity accesses + 0.26 × output items.'],
  [4, 'COSMIC FP', 'For real-time/embedded: count entries, exits, reads, writes (1 CFP each).'],
  [5, 'COCOMO organic', 'Familiar, small team, stable: e.g. accounting, student information. a = 2.4, b = 1.05, c = 0.38.'],
  [5, 'COCOMO semi-detached', 'Mixed experience: compilers, linkers, utilities. a = 3.0, b = 1.12, c = 0.35.'],
  [5, 'COCOMO embedded', 'Tight hardware constraints: OS, real-time. a = 3.6, b = 1.20, c = 0.32.'],
  [5, 'Intermediate COCOMO', 'Nominal effort × EAF, the product of 15 cost-driver multipliers (product, computer, personnel, project).'],
  [5, 'Complete COCOMO', 'Estimates each heterogeneous sub-system separately and adds them.'],
  [5, 'COCOMO II sub-models', 'Application composition (object points), early design, post-architecture; plus reuse.'],
  [5, 'COCOMO II scale factors', 'PREC, FLEX, RESL, TEAM, PMAT; B = 0.91 + 0.01 Σ SF.'],
  [5, 'Halstead operators/operands', 'η₁, η₂ unique; N₁, N₂ total; V = N log₂ η.'],
  [5, 'Estimation categories', 'Empirical (expert judgement, Delphi), heuristic (COCOMO), analytical (Halstead).'],
  [5, 'Rayleigh curve (Norden)', 'Staffing builds up, peaks and tails off; Putnam applied it to software.'],
  [5, 'Putnam vs Jensen', 'Effort ∝ 1/t⁴ (Putnam) vs 1/t² (Jensen) when the schedule is compressed.'],
  [6, 'Work breakdown structure', 'Hierarchical decomposition of the work; leaf = work package to estimate and assign.'],
  [6, 'Critical path', 'Longest path through the network; its length = minimum project duration; zero float.'],
  [6, 'Total float', 'LS − ES: how far an activity can slip without delaying the project.'],
  [6, 'Free float', 'Slip possible without delaying any successor\'s earliest start.'],
  [6, 'Activity-on-node vs activity-on-arrow', 'AoN (precedence) puts activities on boxes, no dummies. AoA (CPM/PERT arrows) may need dummy activities.'],
  [7, 'PERT three estimates', 'Optimistic a, most likely m, pessimistic b: te = (a + 4m + b)/6, σ = (b − a)/6.'],
  [7, 'Crashing', 'Shorten critical activities at extra cost, cheapest per day first, re-checking the critical path each step.'],
  [7, 'Hawthorne effect', 'Productivity rises simply because people know they are being observed or cared about.'],
  [7, 'McGregor X and Y', 'Theory X: people dislike work, need control. Theory Y: work is natural, people seek responsibility.'],
  [7, 'Maslow (bottom → top)', 'Physiological, safety, social, esteem, self-actualisation.'],
  [7, 'Herzberg', 'Hygiene (pay, conditions, policy, supervision) prevent dissatisfaction; motivators (achievement, recognition, the work itself, responsibility, advancement) motivate.'],
  [7, 'Vroom', 'Motivation = expectancy × instrumentality × valence.'],
  [7, 'Oldham-Hackman', 'Skill variety, task identity, task significance, autonomy, feedback.'],
  [7, 'Belbin: selecting people', 'Distinguish eligible (right qualifications) from suitable (can do the job) candidates; hiring eligible-but-unsuitable is the danger.'],
  [7, 'Matrix organisation', 'Staff report to a functional manager and a project manager (two bosses).'],
  [7, 'Chief programmer team', 'One expert leads, others support; good for small, simple projects; single point of failure.'],
  [7, 'Democratic team', 'No formal leader; good for small, complex/research projects; n(n−1)/2 paths.'],
  [7, 'Risk exposure', 'Probability × loss (impact).'],
  [7, 'Risk responses', 'Accept, avoid, reduce (mitigate), transfer, plus contingency planning.'],
  [7, 'RRL', '(RE before − RE after) / cost of the risk-reduction action; > 1 worth doing.'],
  [8, 'Resource histogram', 'Bar chart of resource need over time; smooth peaks by moving activities within float.'],
  [8, 'Three schedules from resource allocation', 'Activity schedule, resource schedule, cost schedule.'],
  [8, 'RAG reporting', 'Green on target; amber not on target but recoverable; red not recoverable without difficulty.'],
  [8, 'Checkpoints', 'Regular (time-driven, e.g. weekly) or tied to events (milestones, end of a phase).'],
  [8, 'Report categories', 'Oral formal regular (weekly meetings), oral formal ad hoc (end-of-stage review), written formal regular (job sheets), written formal ad hoc (exception reports), oral informal ad hoc (canteen chat).'],
  [9, 'Why review before test', 'Cheaper defect removal; works on non-executable documents; spreads knowledge.'],
  [9, 'Code walkthrough', 'Informal: team members trace the code by hand with test cases.'],
  [9, 'Code inspection', 'Formal review for common errors using checklists (e.g. uninitialised variables, mismatched interfaces).'],
  [9, 'Slip chart', 'Alternative to the Gantt chart: the slip line bends more sharply the further an activity falls behind schedule.'],
  [9, 'Timeline chart', 'Shows how targets and planned completion dates have changed over the project\'s duration.'],
  [9, 'PV, EV, AC', 'PV = BCWS (planned), EV = BCWP (earned, value of work done), AC = ACWP (actual cost).'],
  [9, '0/100 technique', 'Credit 0 until the task completes, then 100 %: preferred for software (avoids "99 % complete").'],
  [9, 'SPI and CPI', 'EV/PV and EV/AC; below 1 = behind schedule / over budget.'],
  [10, 'Baseline', 'A configuration formally reviewed and agreed, the basis for further development; changed only via change control.'],
  [10, 'Version, revision, variant', 'Version: a configuration that existed at a point in time (version m.n). Revision: successive state of one configuration item after each update. Variants: versions meant to coexist (different OS, hardware or feature levels).'],
  [10, 'Reserve / restore', 'Check-out a configuration item to a private workspace; check-in after the change control board approves.'],
  [10, 'SCCS / RCS', 'Early version-control tools storing deltas of text files; not for binaries.'],
  [10, 'Fixed price contract', 'Price agreed up front; risk on the supplier.'],
  [10, 'Time & materials contract', 'Customer pays a rate per unit of effort; risk on the customer.'],
  [10, 'Fixed price per unit', 'Paid per function point (or unit of size) delivered.'],
  [10, 'Tendering', 'Open (any supplier), restricted (invited suppliers), negotiated (one supplier).'],
  [10, 'Project close-out', 'Administrative closure and contract closure; lessons learnt, archive, release resources.'],
  [11, 'Quality: traditional definition', 'Fitness for purpose / conformance to requirements; not enough for software (usability, maintainability matter).'],
  [11, 'QA vs QC', 'QA: process-oriented, preventive. QC: product-oriented, detects defects (inspection, testing).'],
  [11, 'Quality evolution', 'Inspection → quality control → quality assurance → total quality management.'],
  [11, 'ISO 9000 series', 'Process standards (1987). 9001: design, development, production, servicing (applies to software firms); 9002: production only, no design (not for software); 9003: inspection and testing only.'],
  [11, 'ISO 9001 vs CMM', 'ISO: certification, pass/fail, generic. CMM: five levels, software-specific, roadmap for improvement; ISO 9001 ≈ level 3.'],
  [11, 'CMM level 1-5', 'Initial, Repeatable, Defined, Managed, Optimizing.'],
  [11, 'Level-2 KPAs', 'Requirements management, project planning, tracking & oversight, subcontract mgmt, SQA, configuration management.'],
  [11, 'Level-5 KPAs', 'Defect prevention, technology change management, process change management.'],
  [12, 'CMMI flavours', 'Successor of CMM integrating many models into one framework (v1.1 2002, v1.2 2006): CMMI for Development, for Services, for Acquisition.'],
  [12, 'PSP levels', 'PSP0 personal measurement, PSP1 personal planning, PSP2 personal quality (reviews), PSP3 personal process evolution.'],
  [12, 'Six Sigma', '3.4 defects per million opportunities; DMAIC for existing processes, DMADV for new ones.'],
  [12, 'Reliability', 'Probability of correct operation for a given time under given conditions; observer-dependent.'],
  [12, '90-10 rule', '90 % of execution time is spent in 10 % of the code (core), so where bugs are matters.'],
  [12, 'POFOD vs ROCOF', 'POFOD: failures per demand (no time). ROCOF: failures per unit time.'],
  [12, 'Jelinski-Moranda', 'Reliability growth model: each fix removes one fault; failure rate ∝ faults remaining.'],
  [12, 'Littlewood-Verall', 'Growth model allowing negative growth (a fix can add faults).'],
  [12, 'Operational profile', 'Probability of each kind of input in use; drives statistical testing.'],
  [12, 'Error → fault → failure', 'Human mistake → defect in the product → observable wrong behaviour.'],
  [12, 'Verification vs validation', 'Verification: building the product right (each phase). Validation: building the right product (final vs requirements).']];

page({ id: 'flashcards', mod: 'home', title: 'Flashcards', kw: 'flashcards definitions recall terms flip memorise', render(b) {
  H(b, `<h1>Flashcards</h1><p class="lede">${FLASH.length} cards, one concept each. Say the answer out loud, flip, then be honest: "Again" puts the card back in your pile. Keys: space flips, ← again, → got it.</p>`);
  const FP = store.get('flash', {});
  const deck = h('select', { class: 'sel' }, h('option', { value: 'all' }, 'All weeks'), h('option', { value: 'again' }, 'Only my "again" cards'), ...Array.from({ length: 12 }, (_, i) => h('option', { value: i + 1 }, 'Week ' + (i + 1) + ` (${FLASH.filter(c => c[0] === i + 1).length})`)));
  const stat = h('div', { class: 'qscore' }), wrap = h('div', { class: 'flash' }), card = h('div', { class: 'fc', tabindex: 0, role: 'button', 'aria-label': 'flip card' });
  const again = h('button', { class: 'btn' }, '← Again'), got = h('button', { class: 'btn primary' }, 'Got it →'), flipB = h('button', { class: 'btn' }, 'Flip');
  b.append(h('div', { class: 'calc' }, h('div', { class: 'inputs' }, h('label', {}, 'Deck', deck))), stat, wrap);
  wrap.append(card, h('div', { class: 'nextprev', style: 'justify-content:center;gap:10px' }, again, flipB, got));
  let pile = [], i = 0, back = false;
  const key = c => 'f' + FLASH.indexOf(c);
  function build() { const v = deck.value; pile = shuffle(FLASH.filter(c => v === 'all' ? true : v === 'again' ? FP[key(c)] === 0 : c[0] === +v)); i = 0; show(); }
  function show() { back = false; const c = pile[i]; const known = FLASH.filter(x => FP[key(x)] === 1).length;
    stat.innerHTML = `<div><small>card</small><b>${pile.length ? Math.min(i + 1, pile.length) : 0} / ${pile.length}</b></div><div><small>known</small><b>${known} / ${FLASH.length}</b></div><div><small>again pile</small><b>${FLASH.filter(x => FP[key(x)] === 0).length}</b></div>`;
    card.classList.remove('back');
    if (!c) { card.innerHTML = `<div><small>deck finished</small>${deck.value === 'again' ? 'No cards in the again pile.' : 'Done. Pick another deck or press Got it to reshuffle.'}</div>`; return; }
    card.innerHTML = `<div><small>Week ${c[0]} · term</small><b>${c[1]}</b></div>`; }
  function flip() { const c = pile[i]; if (!c) return; back = !back; card.classList.toggle('back', back); card.innerHTML = back ? `<div><small>${c[1]}</small>${c[2]}</div>` : `<div><small>Week ${c[0]} · term</small><b>${c[1]}</b></div>`; }
  function mark(ok) { const c = pile[i]; if (!c) { build(); return; } FP[key(c)] = ok ? 1 : 0; store.set('flash', FP); i++; show(); }
  card.addEventListener('click', flip); flipB.onclick = flip; again.onclick = () => mark(false); got.onclick = () => mark(true);
  const kd = e => { if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return; if (e.key === ' ') { e.preventDefault(); flip(); } else if (e.key === 'ArrowRight') mark(true); else if (e.key === 'ArrowLeft') mark(false); };
  document.addEventListener('keydown', kd); onLeave(() => document.removeEventListener('keydown', kd));
  deck.addEventListener('change', build); build();
  H(b, `<h2>All cards as a list</h2>`);
  const d = h('details', {}, h('summary', {}, 'Show every card (for a quick read-through)'));
  d.insertAdjacentHTML('beforeend', TBL(['Week', 'Term', 'Meaning'], FLASH.map(c => ['W' + c[0], `<b>${c[1]}</b>`, c[2]])));
  b.append(d);
} });
