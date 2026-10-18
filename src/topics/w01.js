/* ===== Week 1 ===== */
page({ id: 't-intro', wk: 1, topic: 1, stars: 3, lec: [1, 2, 3], title: 'Why software projects are hard', kw: 'software crisis intangible job project exploration stakeholder scope W5HH product service embedded packaged custom horizontal vertical', lede: 'The course starts with one question: why do so many software projects end late, over budget or unusable? Everything else in SPM is a tool for that problem.',
  render(b) {
    sorter(b, 'Game: job, project or exploration?', 'Sort the examples used in the lectures and assignments.', [['job', 'Routine job / task'], ['proj', 'Project'], ['exp', 'Exploration']], [
      ['Processing monthly salaries', 'job'], ['Manufacturing cars on an assembly line', 'job'], ['Handling daily customer support requests', 'job'], ['Buying grocery from a supermarket', 'job'], ['Booking a railway ticket', 'job'],
      ['Developing a new mobile app', 'proj'], ['Organising the Olympic Games', 'proj'], ['A wedding', 'proj'], ['A political election campaign', 'proj'], ['Construction of a house', 'proj'], ['A B.Tech degree', 'proj'],
      ['Finding a cure for cancer', 'exp']]);
    const L2 = lab(b, 'W5HH scope builder', 'Boehm\'s seven questions. Pick a project, then click each question to see what a good answer looks like.');
    const ex = { lib: ['Library automation for a college', ['Students waste time finding books; the college wants online search and issue/return.', 'Catalogue search, issue/return, fines, reports.', 'Pilot in 4 months, full roll-out in 6.', 'Librarian (requirements), 3 developers, 1 tester, PM.', 'Developers at the IT cell, librarian in the library block.', 'Web app, incremental delivery; weekly review with the librarian.', '18 person-months, 2 servers, Rs. 9 lakh.']], ecu: ['Body-control ECU software update', ['New lighting regulation and customer complaints about wipers.', 'Adaptive headlamp logic, wiper speed control, diagnostics.', 'SOP in 9 months, freeze 3 months before.', 'System engineer, 4 embedded developers, 2 testers, functional-safety manager.', 'Software team in Pune, hardware team in Germany.', 'V-model with model-based design; reviews at each phase gate.', '30 person-months, HIL rig, test vehicles.']] };
    const qs = ['Why is the software being built?', 'What will be done?', 'When will it be done?', 'Who is responsible for a function?', 'Where are they organizationally located?', 'How will the job be done technically and managerially?', 'How much of each resource is needed?'];
    let curEx = 'lib'; const out = h('div', { class: 'ivtxt' }, 'Click a question.'); const btns = h('div', { class: 'flowline' });
    segmented(L2.body, [['lib', 'College library system'], ['ecu', 'Automotive ECU update']], 'lib', k => { curEx = k; out.textContent = 'Click a question.'; });
    qs.forEach((q, i) => btns.append(h('button', { class: 'btn', onclick: () => { out.innerHTML = `<b>${q}</b><br>${ex[curEx][1][i]}`; } }, ['Why', 'What', 'When', 'Who', 'Where', 'How', 'How much'][i])));
    L2.add(btns); L2.add(out); L2.add(h('p', { class: 'cap' }, '"Who will be the project manager?" is NOT one of the W5HH questions (2019 W1 Q9).'));
    sorter(b, 'Game: embedded software or information system?', 'From 2026 assignment 1 Q7 and the slides.', [['emb', 'Embedded'], ['is', 'Information system']], [
      ['TV remote software', 'emb'], ['Nuclear plant control software', 'emb'], ['Robot control software', 'emb'], ['Automobile control software', 'emb'], ['Toy control software', 'emb'],
      ['Patient management software for a hospital', 'is'], ['Hotel management software', 'is'], ['MIS for a company', 'is'], ['Payroll system', 'is']]);
    H(b, TRAP('"Software projects are always larger than manufacturing projects" is <b>not</b> a reason they are harder to manage; "people management" is needed in every project, so it is not special either (2026 A1 Q2).',
      'Sponsors ARE stakeholders even though they "only" provide money (2026 A1 Q4).',
      'Professional developers do not make software as complex as possible; complexity does not fall with age; maintenance changes DO add complexity (2026 A1 Q3).',
      'A security guard of the building is not a stakeholder (2019 W1 Q2).'));
  } });

page({ id: 't-pm', wk: 1, topic: 1, stars: 3, lec: [3, 4, 5], title: 'PM activities, life cycle & standards', kw: 'planning staffing directing monitoring controlling feasibility PMBOK PRINCE2 ISO 21500 process groups initiating closing milestone 99 percent complete build and fix phase entry exit', lede: 'What a project manager actually does, the phases every project passes through, and the three standards (PMBOK, PRINCE2, ISO 21500) that write them down.',
  render(b) {
    sorter(b, 'Game: which PMBOK process group?', 'Where does each activity belong?', [['ini', 'Initiating'], ['pla', 'Planning'], ['exe', 'Executing'], ['mon', 'Monitoring & controlling'], ['clo', 'Closing']], [
      ['Complete the project charter', 'ini'], ['Assign the project manager', 'ini'], ['Identify key stakeholders', 'ini'],
      ['Prepare the WBS', 'pla'], ['Develop the schedule', 'pla'], ['Allocate resources', 'pla'], ['Prioritise risks', 'pla'],
      ['Carry out the planned activities', 'exe'],
      ['Compare progress with the plan', 'mon'], ['Take corrective action on a slip', 'mon'],
      ['Formal acceptance of deliverables', 'clo'], ['Lessons-learned review', 'clo'], ['Release project resources', 'clo']]);
    H(b, TRAP('Planning activities = developing schedules and allocating resources. Formally accepting deliverables, lessons-learned reviews and releasing resources belong to closing (2026 A1 Q9).', 'Maintenance is a product (SDLC) phase, not a project management phase (2019 W1 Q7).', 'Feasibility study and execution are different activities; feasibility generally precedes planning; planning is mainly before execution (2026 A1 Q8).',
      'Milestones give progress tracking and visibility. They do not generate code, do not remove the need for planning and do not solve manpower turnover (2026 A1 Q10).',
      'PMBOK process groups do not include "Designing" (AI mock 1 Q4).'));
  } });
