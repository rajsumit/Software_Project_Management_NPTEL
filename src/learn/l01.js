/* ===== Week 1 · story + theory ===== */
learn('t-intro', { ch: '1.1', title: 'The project nobody could see', line: 'Riya is promoted to project manager and learns why software is harder to manage than a building.' }, L => {
  H(L, STORY('1.1', 'The project nobody could see', `
    ${NARR('Monday, 9:30 a.m., Sahyadri Softworks, Pune. Riya has written code here for five years. Today her name is on a new door: <b>Project Manager</b>.')}
    ${SAY('kul', 'Your first project is a big one. Pune City Transport wants <b>Saarthi</b>: passengers see where their bus is and buy tickets on the phone, depot managers plan routes on a web portal, and every bus gets a small GPS unit that reports its position. Two thousand buses.')}
    ${SAY('riya', 'I have written code for five years, sir. How hard can managing it be?')}
    ${NARR('Kulkarni sir walks her to the window. Across the road, a metro station is going up.')}
    ${SAY('kul', 'How far along is that station?')}
    ${SAY('riya', 'Maybe sixty percent? The pillars are up and half the deck is cast.')}
    ${SAY('kul', 'Good. Now tell me how far along our billing project in the next bay is.')}
    ${NARR('Riya looks at the bay: twelve people, twelve screens, folders of code and documents. She has no idea.')}
    ${SAY('kul', 'That is lesson one. You cannot see software until it runs. Everything we will learn, estimation, milestones, reviews, earned value, exists to make invisible work visible.')}`));

  H(L, `<h2>1 · The software crisis</h2>
    <p>The course opens with a paradox. Software runs almost everything and the world spends trillions of dollars a year on it, yet software projects fail far more often than bridges or buildings. Engineers call this the <b>software crisis</b>. Its four symptoms are easy to remember because every user has seen them:</p>
    ${STEPS(['Software <b>fails to meet user requirements</b>: it does the wrong thing, or the right thing badly.', 'Software is <b>expensive</b>.', 'Software is <b>difficult to alter, debug and enhance</b>.', 'Software is <b>often delivered late</b>.'])}
    <p>How bad is it? The <b>Standish Group CHAOS report</b>, quoted in the lecture, sorts projects into three bins. Press play and watch a hundred typical projects fill in.</p>`);
  const waffle = (() => { let s = ''; for (let i = 0; i < 100; i++) { const x = 20 + (i % 20) * 28, y = 18 + Math.floor(i / 20) * 28, c = i < 29 ? 'fill-g' : i < 81 ? 'fill-a' : 'fill-r', st = i < 29 ? 1 : i < 81 ? 2 : 3; s += `<rect x="${x}" y="${y}" width="22" height="22" rx="4" class="fill-s"/><rect x="${x}" y="${y}" width="22" height="22" rx="4" class="${c}"${S(st)}/>`; } return s; })();
  stepper(L, 'CHAOS report: 100 software projects', SVG(600, 200, waffle + tx(90, 168, '29 succeed', { c: 'lg grn', at: S(1) }) + tx(300, 168, '52 challenged', { c: 'lg hot', at: S(2) }) + tx(510, 168, '19 fail', { c: 'lg red', at: S(3) })),
    ['One hundred software projects, before we know how they end.', '<b>29 % succeed</b>: on time, on budget, with the promised features.', '<b>52 % are "challenged"</b>: they finish, but late, over budget or with fewer features than promised. The biggest bin.', '<b>19 % fail</b> outright: cancelled, or delivered and never used. So fewer than one in three projects goes to plan. Notice that most trouble is "challenged", not dramatic failure: exactly what project management can fix.']);
  H(L, `<h3>Hardware got cheap, software did not</h3>
    <p>Prof. Mall's example: a laptop costs about <b>Rs. 45,000</b>, operating system included. A professional design tool to run on it (Rational suite) costs <b>Rs. 3,14,600</b> node-locked and <b>Rs. 6,03,200</b> as a floating licence. In 1960 most of a system's cost was hardware; today almost all of it is software.</p>`);
  H(L, SVG(600, 210, `<line x1="60" y1="170" x2="570" y2="170" class="ln"/><line x1="60" y1="170" x2="60" y2="20" class="ln"/>
    ${tx(66, 12, 'share of system cost ↑', { c: 'xs mu', anchor: 'start' })}${tx(70, 188, '1960', { c: 'sm mu' })}${tx(555, 188, '2019', { c: 'sm mu' })}
    <path d="M70 40 C 220 60, 330 140, 560 158" class="ln thick b draw" style="--len:600"/>${tx(500, 140, 'hardware', { c: 'sm brd' })}
    <path d="M70 155 C 220 140, 330 60, 560 32" class="ln thick r draw" style="--len:600;--dur:3s"/>${tx(500, 22, 'software', { c: 'sm red' })}`));
  H(L, `<p>So why not build everything in hardware? Because software has two virtues hardware can never have: it is <b>relatively easy to change</b>, and it <b>consumes no space, weight or power</b>. "Otherwise all might as well be hardware."</p>
    <h3>Two characteristics that trap every software team</h3>
    <p>The lecture singles out two properties that feed each other:</p>`);
  stepper(L, 'The complexity spiral', SVG(600, 230, `
    ${bx(40, 80, 170, 64, 'Software is\ncomplex', { c: 'blu', at: S(0) })}${bx(390, 80, 170, 64, 'Harder to\nchange', { c: 'red', at: S(1) })}
    ${pth('M210 98 C 280 60, 320 60, 388 98', { c: 'v flow', at: S(1) })}${tx(300, 52, 'to change it you must first\nunderstand it', { c: 'sm', at: S(1) })}
    ${pth('M390 130 C 320 175, 280 175, 212 130', { c: 'r flow', at: S(2) })}${tx(300, 196, 'every change (bug fix, enhancement,\nperformance) adds patches and complexity', { c: 'sm', at: S(2) })}
    ${tx(300, 112, '↻', { c: 'lg pur', at: S(3) })}`),
    ['Start with a working program of some complexity.', '<b>The more complex a program, the harder it is to change.</b> Before changing anything you must understand where the change goes, which variables it touches, what else depends on them. Complexity multiplies that effort.', '<b>The more changes are made, the more complex it becomes.</b> Fixes and enhancements are usually small local patches that were not part of the original design, so the structure degrades.', 'The two feed each other: a spiral. This is why maintenance is the most expensive phase of the life cycle (week 2) and why an old system eventually has to be retired.']);
  H(L, `<h3>Why the crisis happens: five contributors</h3>
    ${COLS(DEF('Larger problems', 'Today\'s systems are far bigger and more complex than those of a generation ago.') + DEF('Poor project management', 'Too few skilled project managers and too little discipline in planning and control.') + DEF('Lack of training', 'Many developers have never been trained in software engineering practice.'), DEF('Skill shortage and turnover', 'People leave mid-project and take their knowledge with them.') + DEF('Low productivity improvement', 'Writing software is still largely manual intellectual work; productivity has not grown like hardware performance.'))}`);
  choice(L, 'Which of these is <b>not</b> one of the lecture\'s contributors to the software crisis?', [
    ['Increasing skill shortage and manpower turnover', 'It is one of the five contributors.', false],
    ['Hardware becoming too expensive', 'Correct: the opposite happened. Hardware became cheap; software became the expensive part.', true],
    ['Lack of adequate training in software engineering', 'It is one of the five.', false],
    ['Low productivity improvements', 'It is one of the five.', false]], { tag: 'Quick check' });

  H(L, `<h2>2 · Why managing software is different</h2>
    <p>Riya's metro station is the key picture. Compare what a construction manager and a software manager can actually see:</p>`);
  const floors = [0, 1, 2, 3, 4, 5].map(i => `<rect x="60" y="${178 - i * 24}" width="150" height="20" rx="2" class="fill-v"${S(i < 3 ? 1 : 2)}/>`).join('');
  const files = [0, 1, 2, 3, 4, 5].map(i => `<g${S(i < 3 ? 1 : 2)}><rect x="${370 + (i % 3) * 62}" y="${100 + Math.floor(i / 3) * 62}" width="46" height="54" rx="4" class="bx"/><line x1="${378 + (i % 3) * 62}" y1="${116 + Math.floor(i / 3) * 62}" x2="${406 + (i % 3) * 62}" y2="${116 + Math.floor(i / 3) * 62}" class="ln"/><line x1="${378 + (i % 3) * 62}" y1="${128 + Math.floor(i / 3) * 62}" x2="${398 + (i % 3) * 62}" y2="${128 + Math.floor(i / 3) * 62}" class="ln"/></g>`).join('');
  stepper(L, 'Visible progress vs invisible progress', SVG(600, 250, `
    <rect x="50" y="34" width="170" height="168" rx="4" class="bx ghost"/>${tx(135, 22, 'Metro station', { c: 'sm mu' })}${floors}
    ${tx(135, 222, '60 % done: you can see it', { c: 'sm grn', at: S(2) })}
    ${tx(460, 22, 'Saarthi code base', { c: 'sm mu' })}${files}
    ${tx(460, 96, '?', { c: 'lg red', at: S(2) })}${tx(560, 140, '?', { c: 'lg red', at: S(2) })}${tx(360, 140, '?', { c: 'lg red', at: S(2) })}
    ${tx(460, 222, 'how far along? nobody can tell', { c: 'sm red', at: S(3) })}
    ${tx(460, 240, 'until it runs', { c: 'sm red', at: S(3) })}`),
    ['Two projects start on the same day.', 'Three floors go up; three folders of code are written.', 'The building is visibly 60 % complete. The code base also "looks" like a lot of work, but a large amount of written code can still be far from done: bugs, integration and testing are invisible.', 'Software is <b>intangible</b>: it is a set of documents and code until it runs. "It is hard to manage anything you cannot see." Week 8-9 tools (milestones, reviews, earned value) are the answer.'], { ms: 3000 });
  H(L, `${VS([['Intangible', 'cannot see it', ['Invisible until it is ready and runs', 'Progress cannot be judged by looking at code or documents']], ['Large change impact', 'small change, big ripple', ['A small change request can have a terrible impact', 'Change is the rule rather than the exception']], ['Intellectual, complex work', 'people, not machines', ['Hard to estimate effort and measure productivity', 'Changing customer requirements, manpower turnover']]])}
    ${ANALOGY('A bridge is half built when you can see half a bridge. A program is "half built" only in the minds of the people writing it, and those minds can walk out of the door (turnover) or change the plan overnight (changing requirements).')}`);

  H(L, `<h2>3 · Task, project or exploration?</h2>
    <p>Project management is not for every piece of work. Place work on a line of <b>uncertainty of outcome</b>:</p>`);
  H(L, SVG(640, 190, `<rect x="30" y="70" width="190" height="34" rx="6" class="bx grn"/><rect x="225" y="70" width="190" height="34" rx="6" class="bx amb"/><rect x="420" y="70" width="190" height="34" rx="6" class="bx red"/>
    ${tx(125, 87, 'Task / job')}${tx(320, 87, 'PROJECT')}${tx(515, 87, 'Exploration')}
    ${ar(30, 130, 610, 130)}${tx(320, 148, 'uncertainty of outcome →', { c: 'sm mu' })}
    ${tx(125, 40, 'book a railway ticket\nattend a lecture', { c: 'xs mu' })}${tx(320, 40, 'a wedding · a B.Tech degree\nhouse construction · Saarthi', { c: 'xs mu' })}${tx(515, 40, 'find a cure for cancer', { c: 'xs mu' })}
    ${tx(125, 172, 'too trivial for PM', { c: 'sm' })}${tx(320, 172, 'PM is made for this', { c: 'sm grn' })}${tx(515, 172, 'too uncertain for PM', { c: 'sm' })}
    <g class="bob">${tx(320, 112, '▲ Saarthi', { c: 'sm pur' })}</g>`));
  H(L, `${DEF('Task (job)', 'A small piece of work with a straightforward goal: no more than a few person-hours, one or two people, usually a repetition of something done before. May or may not be part of a project. Examples: attend a lecture, buy a chocolate, book a railway ticket.')}
    ${DEF('Project', 'PMBOK: "a <b>temporary endeavour</b> undertaken to create a <b>unique</b> product, service or result". Also: a set of activities within a defined time period to meet specific goals within a budget. Typically finite duration, non-trivial, non-repetitive, needs resources, consists of multiple tasks with precedence relationships and a completion date.')}
    ${DEF('Exploration', 'The outcome is very uncertain (finding a cure for cancer). Too challenging for normal project management techniques.')}
    <p>Dictionary definitions ("a planned undertaking", "a large undertaking, e.g. a public works scheme") stress the two key points: <b>planning</b> and <b>size</b>. Projects sit in the middle of the line: they contain challenge as well as routine, which is exactly why they need management.</p>`);

  H(L, `<h2>4 · Stakeholders: everyone with something at stake</h2>
    <p><b>Project stakeholders</b> are individuals and organisations that are actively involved in the project, or whose interests may be positively or negatively affected by its execution or completion; they may also exert influence over the project and its results. For Saarthi:</p>`);
  H(L, SVG(620, 330, `<circle cx="310" cy="165" r="150" class="bx s2"/><circle cx="310" cy="165" r="92" class="bx blu"/><circle cx="310" cy="165" r="40" class="bx b"/>
    ${tx(310, 165, 'Saarthi', { c: 'wh' })}
    ${tx(310, 92, 'INTERNAL', { c: 'xs blu' })}${tx(310, 115, 'Riya (PM) · project team', { c: 'sm' })}${tx(310, 228, 'Sahyadri top\nmanagement', { c: 'sm' })}
    ${tx(310, 30, 'EXTERNAL', { c: 'xs mu' })}${tx(310, 50, 'Pune City Transport: customer + sponsor', { c: 'sm' })}${tx(115, 120, 'passengers\n(users)', { c: 'sm' })}${tx(505, 120, 'GPS hardware\nvendor', { c: 'sm' })}${tx(120, 238, 'bus drivers,\nconductors', { c: 'sm' })}${tx(500, 238, 'depot\nmanagers', { c: 'sm' })}
    <g class="pulse">${tx(310, 300, 'all of them can push the project', { c: 'xs pur' })}</g>`));
  H(L, `${COLS(`<h4>Key stakeholders (lecture)</h4><ul><li><b>Project manager</b>: responsible for managing the project</li><li><b>Customer</b>: will use the project's product or service</li><li><b>Project team members</b>: perform the work</li><li><b>Sponsor</b>: provides the financial resources</li></ul>`, `<h4>Internal vs external</h4><ul><li><b>Internal</b>: project manager, project team, top management</li><li><b>External</b>: the customers (if outside the organisation), vendors, other affected parties</li></ul>`)}`);
  choice(L, 'Mr Bhosale only signs the cheques; he will never use the app. Is he a stakeholder?', [
    ['No: only people who use or build the product are stakeholders.', 'The sponsor provides the financial resources. That alone makes him a key stakeholder (2026 assignment 1).', false],
    ['Yes: the sponsor is one of the key stakeholders.', 'Right. Sponsors are named explicitly among the key stakeholders. Money gives influence.', true],
    ['Only if he attends the review meetings.', 'Attendance does not matter; his interests are affected and he can influence the project.', false]]);
  choice(L, 'And the security guard at Sahyadri\'s gate?', [
    ['Yes, he works in the same building.', 'Sharing a building does not make him involved in, or affected by, Saarthi.', false],
    ['No: he is neither involved in nor affected by the project.', 'Right (2019 week 1 assignment). Stakeholder = involved in the project, or interests affected by it, or able to influence it.', true]], { tag: 'Quick check' });

  H(L, `<h2>5 · Scope, and the sound of failure's footsteps</h2>
    <p><b>Project scope</b> is what needs to be achieved and the work that must be done to deliver the project: a list of specific <b>goals, deliverables, tasks, deadlines and costs</b>. The PM must understand it before anything else, because a poorly defined scope is where most failures begin. The lecture lists the "sounds of failure's footsteps":</p>
    <div class="cols"><div>${STEPS(['Development team does not understand the customer\'s needs', 'Project scope is poorly defined', 'Changes are poorly managed', 'The chosen technology changes'])}</div><div><ol class="steps" start="5" style="counter-reset:st 4">${['Business needs change (e.g. a shop moving from a physical store to online retail)', 'Unrealistic deadlines (they force cuts in requirements, design and testing)', 'Inexperienced team', 'Poor project management'].map(x => `<li>${x}</li>`).join('')}</ol></div></div>
    <h3>W5HH: Boehm's seven questions</h3>
    <p>To pin the scope down, Barry Boehm proposed the <b>W5HH principle</b>: five W questions and two H questions. Kulkarni sir makes Riya answer them for Saarthi before she writes a single plan. Open each one:</p>
    ${REVEAL('<b>Why</b> is the software being built?', 'Passengers wait without knowing when the bus will come; PCT loses revenue to cash leakage and cannot see where its 2,000 buses are. Saarthi gives live tracking, cashless tickets and fleet visibility.')}
    ${REVEAL('<b>What</b> will be done?', 'A passenger app (live bus position, ticket purchase), a depot web portal (routes, schedules, reports) and an in-bus GPS unit with its firmware.')}
    ${REVEAL('<b>When</b> will it be done?', 'Pilot on 3 routes in 6 months; all routes in 12 months.')}
    ${REVEAL('<b>Who</b> is responsible for a function?', 'Riya (PM); Arjun (back end), Pooja (app), Imran (in-bus firmware), Neha (testing), Dev (requirements); the GPS vendor supplies the hardware.')}
    ${REVEAL('<b>Where</b> are they organisationally located?', 'Software team at Sahyadri, Pune; hardware vendor in Bengaluru; client users at PCT\'s 14 depots.')}
    ${REVEAL('<b>How</b> will the job be done, technically and managerially?', 'Technically: cloud back end, Android/iOS app, embedded C on the bus unit. Managerially: phased delivery with reviews at each milestone (the life cycle choice is chapter 2).')}
    ${REVEAL('<b>How much</b> of each resource is needed?', 'Person-months of effort, test buses, servers, hardware units: the subject of estimation (weeks 4-5).')}
    <p class="cap">Exam trap: "Who will be the project manager?" is <b>not</b> one of the W5HH questions.</p>`);

  H(L, `<h2>6 · What kind of software is Saarthi?</h2>
    <p>Software projects are classified two ways. By <b>business model</b>:</p>`);
  H(L, SVG(640, 250, `${bx(250, 10, 140, 36, 'Software', { c: 'b', tc: 'wh' })}
    ${ar(300, 46, 160, 80)}${ar(340, 46, 480, 80)}
    ${bx(60, 80, 200, 44, 'Products\n(generic, packaged)', { c: 'blu' })}${bx(380, 80, 200, 44, 'Services\n(custom)', { c: 'amb' })}
    ${ar(110, 124, 70, 160)}${ar(210, 124, 250, 160)}${bx(10, 160, 130, 54, 'Horizontal market\nneeds of many\ncompanies', { lh: 14 })}${bx(180, 160, 130, 54, 'Vertical market\none industry', { lh: 14 })}
    ${ar(430, 124, 400, 160)}${ar(530, 124, 560, 160)}${bx(330, 160, 140, 54, 'Developed at the\nuser\'s request', { lh: 14 })}${bx(490, 160, 140, 54, 'Developer tailors\nits generic solution', { lh: 14 })}
    ${tx(110, 234, 'MS Office, antivirus', { c: 'xs mu' })}${tx(245, 234, 'banking, mobile billing', { c: 'xs mu' })}${tx(480, 234, 'customisation · maintenance · testing · contract programming', { c: 'xs mu' })}`, 'wide'));
  H(L, `<p>The world software business is about <b>US $3.5 trillion</b>, roughly half products and half services, and the <b>services segment is growing fast</b>. Three reasons push everyone towards services:</p>
    ${STEPS(['<b>Lots of code is already available</b> in a company: new software is developed by modifying the closest existing one.', '<b>Business velocity</b> has increased tremendously: nobody wants multi-year projects; customers expect results in weeks or months.', '<b>Program sizes have become large</b>: customising existing components is more practical than writing from scratch.'])}
    <p><b>Why have Indian companies focused on services?</b> A product needs a large investment up front for something that may or may not succeed in the market (if it does, it brings steady revenue, like Oracle). A service brings an assured one-time revenue for each project. Services avoid the risk.</p>
    <p>By <b>what it does</b>: <b>information systems</b> store, process and present data and statistics (MIS, hotel management, patient management; web-based or stand-alone), while <b>embedded software</b> controls hardware (automobile control, nuclear plant control, robots, toys, TV remote). Saarthi is both: the app and the depot portal are information systems; the firmware in the bus unit is embedded software. That mix will matter when we estimate it with COCOMO in chapter 5.</p>`);
  quickcheck(L, [['Is Saarthi a product or a service project for Sahyadri?', 'A <b>service</b> (custom software at the user\'s request, for one customer, PCT). If Sahyadri later sold "Saarthi" to many cities as a package, it would become a vertical-market product.'], ['Name the four symptoms of the software crisis.', 'Fails to meet user requirements, expensive, difficult to alter/debug/enhance, often delivered late.'], ['Why is complex software harder to change?', 'You must first understand where and what to change; the more complex the program, the more effort that understanding takes.']]);
  H(L, RECAP('Software crisis: fails requirements, expensive, hard to change, late. CHAOS: 29 % success, 52 % challenged, 19 % failed.', 'Software is managed differently because it is <b>intangible</b>, a small change has a <b>large impact</b>, and it is <b>intellectual</b> work with changing requirements and turnover.', 'Task (routine) ↔ project (temporary, unique, planned) ↔ exploration (very uncertain).', 'Stakeholders: PM, customer, team, sponsor; internal vs external.', 'Scope = goals, deliverables, tasks, deadlines, costs; W5HH = why, what, when, who, where, how, how much.', 'Products (horizontal / vertical) vs services (custom); information systems vs embedded software.'));
  H(L, NEXT('Riya now knows why the job is hard. Her next instinct is to call the team and start coding. Kulkarni sir stops her at the door.', 't-pm', 'Chapter 1.2 · Plan the work, work the plan'));
});

learn('t-pm', { ch: '1.2', title: 'Plan the work, work the plan', line: 'What a project manager actually does, the project life cycle, PMBOK vs PRINCE2, and why a life cycle model stops the "99 % complete" trap.' }, L => {
  H(L, STORY('1.2', 'Plan the work, work the plan', `
    ${SAY('riya', 'I\'ll get Arjun and Pooja started on the app today. We can figure out the rest as we go.')}
    ${SAY('kul', 'That is how a student does an assignment: code, test, fix, repeat. It works when the whole problem fits in one head. Saarthi will have fifteen people. If Arjun starts coding, Neha starts writing test documents, Imran defines the file formats and Pooja designs the screens, each in their own order, you will have chaos by Friday.')}
    ${SAY('riya', 'Then what do I do first?')}
    ${SAY('kul', 'First, decide whether the project is worth doing at all. Then plan it. Then run the plan and keep checking it. And choose a life cycle model, so that at any moment you can say "we are in design" instead of asking people how they feel.')}
    ${NARR('He writes six words on the whiteboard: <b>plan the work, work the plan</b>.')}`));

  H(L, `<h2>1 · What a project manager does</h2>
    <p>Project management is summarised as <b>"plan the work and work the plan"</b>. The lecture splits it into four activities:</p>`);
  H(L, SVG(600, 280, `<circle cx="300" cy="140" r="58" class="bx b"/>${tx(300, 132, 'Project', { c: 'wh' })}${tx(300, 150, 'manager', { c: 'wh' })}
    ${bx(205, 6, 190, 58, 'PLANNING\nestimation, resource\nallocation, scheduling', { c: 'blu', lh: 14 })}
    ${bx(420, 111, 175, 58, 'STAFFING\nrecruiting and\nmotivating people', { c: 'grn', lh: 14 })}
    ${bx(205, 216, 190, 58, 'DIRECTING\nensure the team\nacts as a whole', { c: 'amb', lh: 14 })}
    ${bx(5, 111, 175, 58, 'MONITORING &\nCONTROLLING: detect\ndeviations, correct', { c: 'red', lh: 14 })}
    ${pth('M395 50 C 470 60, 500 80, 505 108', { c: 'flow' })}${pth('M505 170 C 500 200, 470 222, 397 238', { c: 'flow' })}${pth('M205 238 C 130 222, 100 200, 95 172', { c: 'flow' })}${pth('M95 110 C 100 80, 130 60, 203 50', { c: 'flow' })}`));
  H(L, `<h3>The PM's job, in time order</h3>`);
  stepper(L, 'Three responsibilities across the project', SVG(640, 150, `
    ${bx(10, 40, 180, 60, 'Feasibility study', { c: 'pur', at: S(0) })}${ar(190, 70, 222, 70, { at: S(1) })}
    ${bx(224, 40, 180, 60, 'Planning', { c: 'blu', at: S(1) })}${ar(404, 70, 436, 70, { at: S(2) })}
    ${bx(438, 40, 192, 60, 'Execution: monitor\n& control', { c: 'red', at: S(2) })}
    ${pth('M534 40 C 520 0, 330 0, 316 38', { c: 'dash a', at: S(3) })}${tx(425, 12, 'plan revised as the project proceeds', { c: 'xs hot', at: S(3) })}
    ${tx(100, 122, 'worth doing? technically\nfeasible?', { c: 'xs mu', at: S(0) })}${tx(314, 122, 'only if feasible;\nbefore development starts', { c: 'xs mu', at: S(1) })}${tx(534, 122, 'whole active duration', { c: 'xs mu', at: S(2) })}`),
    ['<b>Feasibility study</b>: is the project technically feasible, and is it worthwhile from a business point of view? (Chapter 3 shows how to put numbers on "worthwhile".)', '<b>Planning</b>: done only if the project is feasible, and carried out <b>before development starts</b>. Activities: estimation, scheduling, staffing, risk management, miscellaneous plans (quality assurance, configuration management).', '<b>Execution monitoring and control</b>: lasts for the entire active project. Monitoring = checking progress, revising plans. Controlling = taking action to remedy hold-ups. Innovating = solutions when problems emerge. Representing = liaison with clients, users, developers and other stakeholders.', 'The plan is not frozen: it may be changed as the project proceeds. The arrow back from execution to planning is normal, not a failure.']);

  H(L, `<h2>2 · The project life cycle</h2>
    <p>Every project, software or not, passes through the same life cycle. Watch Saarthi move through it:</p>`);
  stepper(L, 'Project life cycle: Saarthi', SVG(660, 170, `
    ${bx(4, 60, 92, 50, 'Need', { c: 's2', at: S(0), g: '' })}${ar(96, 85, 112, 85, { at: S(1) })}
    ${bx(114, 60, 100, 50, 'Initiate', { c: 'pur', at: S(1) })}${ar(214, 85, 230, 85, { at: S(2) })}
    ${bx(232, 60, 92, 50, 'Plan', { c: 'blu', at: S(2) })}${ar(324, 85, 340, 85, { at: S(3) })}
    ${bx(342, 60, 100, 50, 'Execute', { c: 'grn', at: S(3) })}
    ${bx(342, 4, 100, 40, 'Control', { c: 'red', at: S(4) })}${pth('M420 58 L420 46', { c: 'r', at: S(4) })}${pth('M364 46 L364 58', { c: 'r', at: S(4) })}
    ${ar(442, 85, 470, 85, { at: S(5) })}${bx(472, 60, 110, 50, 'Close out', { c: 'amb', at: S(5) })}
    ${tx(330, 150, '', { c: 'sm' })}`),
    ['<b>Need</b>: PCT\'s passengers cannot tell when their bus will arrive.', '<b>Initiate</b>: business case and <b>project charter</b> approved; Riya is assigned as PM; key stakeholders identified.', '<b>Plan</b>: WBS and scope statement, schedule (a Gantt chart with dependencies and resources), cost estimate, list of prioritised risks.', '<b>Execute</b>: the team builds Saarthi as described in the plan.', '<b>Control</b> runs alongside execution: measure progress, detect deviation from the plan, take corrective action. Execute and control loop many times.', '<b>Close out</b>: formal acceptance of the work by PCT and the closing documents (chapter 10).']);
  H(L, `<h3>Two kinds of process run side by side</h3>
    ${SVG(640, 150, `${tx(70, 30, 'Project\nmanagement', { c: 'sm' })}<rect x="130" y="14" width="500" height="34" rx="6" class="bx pur"/>${tx(380, 31, 'initiate · plan · execute · monitor & control · close  (the PM)')}
      ${tx(70, 100, 'Product-\noriented', { c: 'sm' })}${['requirements', 'design', 'coding', 'testing'].map((t, i) => bx(180 + i * 108, 82, 100, 36, t, { c: 'blu' })).join('')}
      ${ar(170, 100, 178, 100)}${tx(380, 140, 'specifying and creating the product: the SDLC (the development team)', { c: 'xs mu' })}`)}
    <p><b>Project management processes</b> are concerned with planning and controlling the work of the project. <b>Product-oriented processes</b> are concerned with specifying and creating the product (requirements, design, coding, testing). The PM's processes span the whole project; the product processes happen inside its execution. Maintenance is a product phase, not a project-management phase.</p>`);

  H(L, `<h2>3 · Standards that write all this down</h2>
    <p>Organisations either adopt an <b>"off-the-shelf"</b> standard (PMBOK, PRINCE2, ISO 21500) or develop an <b>"in-house"</b> standard based on their own requirements, policies and environment, often borrowing processes and tools from one or more off-the-shelf standards. Sahyadri has an in-house standard built on PMBOK.</p>`);
  H(L, SVG(640, 190, `${bx(10, 70, 110, 44, 'Initiating', { c: 'pur' })}${ar(120, 92, 150, 92)}${bx(152, 70, 110, 44, 'Planning', { c: 'blu' })}
    ${pth('M262 84 L 300 84', {})}${pth('M300 100 L 264 100', {})}${bx(302, 70, 110, 44, 'Executing', { c: 'grn' })}
    ${pth('M357 70 C 357 30, 450 30, 470 66', { c: 'flow' })}${pth('M470 120 C 450 160, 357 160, 357 116', { c: 'flow' })}${bx(432, 66, 120, 52, 'Monitoring &\ncontrolling', { c: 'red' })}
    ${ar(552, 92, 572, 92)}${bx(574, 70, 60, 44, 'Closing', { c: 'amb' })}
    ${tx(320, 180, 'PMBOK\'s five process groups. There is no "Designing" group.', { c: 'sm mu' })}`, 'wide'));
  H(L, `${TBL(['', 'PMBOK', 'PRINCE2'], [['Full name', 'Project Management Body of Knowledge', 'PRojects IN Controlled Environments'], ['Origin / owner', 'United States; published by PMI (Project Management Institute)', 'United Kingdom; Office of Government Commerce; administered by APMG'], ['Approach', '<b>Knowledge-based</b>: standard terminology and guidelines', '<b>Process-based</b> (process-driven) method'], ['Style', 'Non-prescriptive', 'Prescriptive, but tailorable'], ['Reach', 'The dominant standard, used worldwide; basis of PMI certifications; 5th edition 2013', 'Popular mostly in the UK; usable for small and big projects'], ['Structure', '5 process groups: initiating, planning, executing, monitoring & controlling, closing', 'Processes: starting up, initiating, directing, managing a stage boundary, controlling a stage, managing product delivery, closing']])}
    <p>PRINCE1 was specific to IT projects; <b>PRINCE2 is generic</b>. ISO 21500 is a third, international standard that also defines a project life cycle.</p>`);
  choice(L, 'PCT\'s tender asks for "a knowledge-based, non-prescriptive project management framework, widely used worldwide". Which standard fits?', [
    ['PRINCE2', 'PRINCE2 is process-based and prescriptive (but tailorable), and used mostly in the UK.', false],
    ['PMBOK', 'Right: PMBOK (PMI) is knowledge-based, non-prescriptive and the dominant standard worldwide.', true],
    ['An in-house standard', 'An in-house standard is the organisation\'s own; the tender describes PMBOK.', false]], { tag: 'Quick check' });

  H(L, `<h2>4 · Why a life cycle model matters to the PM</h2>
    <p>A <b>software life cycle model</b> (also process model or SDLC) is a descriptive and diagrammatic model of the software life cycle. It does three things: it <b>identifies all the activities</b> undertaken during development, <b>establishes a precedence ordering</b> among them, and <b>divides the life cycle into phases</b>. Each phase contains several activities: for example, design might consist of structured analysis, structured design and a design review.</p>
    <p>Intuitively a product is <b>conceptualised → specified → designed → coded → tested → delivered → maintained → retired</b>. A model makes that sequence explicit and agreed.</p>
    <h3>Build and fix: fine for one person, chaos for a team</h3>
    <p>A student writing an assignment unconsciously follows the <b>build-and-fix</b> (exploratory) model: write code, test, fix, test, fix, until it passes. Any order works (code → test → design; specify → code → design → test …) because the whole problem is within one person's grasp. In a team, people must agree <b>when to do what</b>; otherwise one engineer starts coding, another writes the test document first, a third defines the file structure, a fourth defines the I/O for his part, and the project never converges.</p>
    <h3>Entry and exit criteria, milestones</h3>
    <p>A life cycle model defines <b>entry and exit criteria</b> for every phase. A phase is complete only when all its exit criteria are satisfied, and a phase can start only when its entry criteria are met. Example: the exit criterion for the requirements phase is "the SRS document is complete, reviewed and approved by the customer". Phase entries and exits are <b>milestones</b>: with them the PM can say at any time, fairly accurately, which stage the project is in.</p>`);
  stepper(L, 'Without a model: the 99 % complete syndrome', SVG(620, 250, `<line x1="60" y1="210" x2="600" y2="210" class="ln"/><line x1="60" y1="210" x2="60" y2="20" class="ln"/>
    ${tx(30, 115, '% done', { c: 'xs mu' })}${tx(330, 236, 'weekly status meetings →', { c: 'xs mu' })}<line x1="60" y1="30" x2="600" y2="30" class="grid"/>${tx(80, 22, '100 %', { c: 'xs mu' })}
    <path d="M60 210 L120 120 L180 75 L240 52 L300 42 L360 38 L420 36 L480 35 L540 34" class="ln thick a"${S(1)}/>
    ${[[120, 120, '50 %'], [180, 75, '75 %'], [240, 52, '90 %'], [300, 42, '95 %'], [360, 38, '"nearly done"'], [480, 35, '"99 %"']].map(([x, y, t], i) => `<g${S(1)}><circle cx="${x}" cy="${y}" r="4" class="fill-a"/>${tx(x, y - 12, t, { c: 'xs hot' })}</g>`).join('')}
    <path d="M60 210 L540 70" class="ln thick b dash"${S(2)}/>${tx(470, 112, 'actual progress', { c: 'sm blu', at: S(2) })}
    <rect x="520" y="26" width="80" height="188" class="fill-r op3"${S(3)}/>${tx(560, 120, 'months\nmore', { c: 'sm red', at: S(3) })}`),
    ['Saarthi without a life cycle model: the only way Riya can track progress is to ask the team "how much is done?"', 'An enthusiastic team answers optimistically every week: 50 %, 75 %, 90 %, 95 %, "nearly done", "99 %"... the reported curve flattens just below 100 %.', 'Actual progress is much slower: the remaining "1 %" (integration, bugs, testing) is often months of work.', 'This is the <b>99 % complete syndrome</b>. A life cycle model replaces opinions with milestones: "the SRS is approved", "design review passed". Progress becomes a fact.'], { ms: 3200 });
  H(L, `${IDEA('Myth and reality', '<b>Myth:</b> the only deliverable of a successful project is the working program. <b>Reality:</b> documentation of every aspect of development (requirements, design, test plans, user manuals) is needed for operation and maintenance.')}`);
  choice(L, 'Pooja wants to start coding the ticket screen while Dev is still writing the requirements. What does the life cycle model say?', [
    ['Fine: coding early saves time.', 'Coding before the requirements are approved usually means rework; the coding phase\'s entry criteria are not met.', false],
    ['Wait: a phase can start only when its entry criteria are satisfied, here an approved SRS and design.', 'Right. Entry/exit criteria keep the team in step and make progress measurable (iterative and agile models in chapter 2 relax this in controlled ways).', true],
    ['Ask Pooja what percentage she thinks is done.', 'That is exactly the guesswork that causes the 99 % complete syndrome.', false]]);
  quickcheck(L, [['List the PMBOK process groups.', 'Initiating, planning, executing, monitoring & controlling, closing.'], ['What are the key outputs of initiation and planning?', 'Initiation: PM assigned, key stakeholders identified, project charter. Planning: WBS, schedule (Gantt chart with dependencies and resources), list of prioritised risks.'], ['Why does build-and-fix work for a student but not for a team?', 'A single programmer holds the whole problem in mind and can do steps in any order; a team needs an agreed order of activities.']]);
  H(L, RECAP('PM = plan the work, work the plan: planning, staffing, directing, monitoring & controlling.', 'PM responsibilities in order: feasibility study → planning (only if feasible) → execution monitoring and control (plan may change).', 'Project life cycle: need → initiate → plan → execute ⇄ control → close out. PM processes vs product-oriented processes.', 'PMBOK (PMI, USA, knowledge-based, non-prescriptive, 5 process groups) vs PRINCE2 (UK OGC, process-based, prescriptive but tailorable); ISO 21500; in-house standards.', 'Life cycle model: activities + precedence + phases; entry/exit criteria; milestones; without it, the 99 % complete syndrome.'));
  H(L, NEXT('Riya agrees to choose a life cycle model. But which one? The waterfall that her college textbook drew, or something more modern?', 't-waterfall', 'Chapter 2.1 · The waterfall and its feedback'));
});
