# SPM Exam Lab

An interactive study site for the NPTEL course **Software Project Management** (noc26_cs152, IIT Kharagpur, Prof. Rajib Mall and Prof. Durga Prasad Mohapatra). The whole course is told as one connected story (a city bus-ticketing project) with animated diagrams, followed on every topic page by games and labs, all assignment questions with reasons, unlimited fresh numericals, passage-style Section II practice and a timed mock exam with a results analysis.

**Live site:** https://rajsumit.github.io/Software_Project_Management_NPTEL/

## What is inside
- **40 story chapters / topic pages** across the 12 weeks, each with the full theory, step-by-step animated diagrams, quick checks and a recap: life cycle models, project evaluation (ROI, payback, NPV, IRR, decision trees), estimation (function points, COCOMO 81 and II, Halstead, Putnam/Jensen), CPM/PERT and crashing, people and organisations, risk, resource allocation, monitoring, earned value, SCM, contracts, quality, ISO 9001, CMM/CMMI, PSP, Six Sigma, reliability and testing.
- **Labs:** cash-flow workbench, decision tree, function-point calculator with the 14 GSCs, COCOMO calculators, Halstead token counter, Rayleigh staffing curve, CPM workbench (network, float, Gantt, delays), PERT and crashing simulator, resource smoothing, risk register with RRL, EVA calculator with SPI/CPI quadrant, reserve/restore simulator, six-sigma DPMO calculator and many sorting games, each followed by the exam traps the assignments set.
- **Easy marks:** 20 recall topics asked every run, ranked by likelihood × effort.
- **Question bank:** all 120 questions of the 2026 assignments (official solutions), all 120 of the 2019 run, and 150 questions from the five NPTEL AI mock papers. Filters, show all, redo wrong, live score.
- **Numericals & Section II passages:** 44 generators give new numbers every time; 14 case studies (scenario + 4-5 linked questions).
- **Timed mock exam:** 30 Section I MCQs + 20 Section II questions, 3-hour timer, palette, mark for review, auto-submit, then an analysis (focus topics, avoidable mistakes, time per question, score by section and week).
- **Revision sheet and 114 flashcards** for the last days.

Progress is stored only in your browser (localStorage); nothing is sent anywhere.

## Run or build locally
No dependencies except Python 3 (build), Node (optional check) and a browser.

```bash
python3 build.py                        # writes docs/index.html (one self-contained page)
python3 -m http.server -d docs 8000     # then open http://localhost:8000
node src/verify.js 300                  # fuzz-checks every numerical generator and passage
```

## Project layout
```
src/qbank.js        question bank (2026 + 2019 assignments, NPTEL AI mock papers)
src/core.js         helpers, plotter, question renderer, router
src/gen.js          numerical generators and Section II passages
src/figs.js         activity-network figures for assignment questions
src/learn.js        story framework: chapters, animated step-by-step diagrams, quick checks
src/learn/l01-12.js story chapters with the full theory for weeks 1-12
src/topics/*.js     exam hub, easy marks, question bank, mock exam, revision; weeks 1-12 games, labs and exam traps
src/style.css       design tokens, light and dark themes
src/verify.js       generator checks
tools/qbank/        scripts that parsed the assignment PDFs into the question bank
build.py            bundles everything into docs/index.html (and dist/artifact.html)
course-material/    original NPTEL slides, transcripts, assignments and AI mock papers
```

## Notes
- The 2019 assignments were scanned images; they were OCR'd and checked by hand. Network diagrams were redrawn as SVG.
- A few official keys or slides disagree with the lecture rule (for example 2026 A10 Q9, a COCOMO slide typo, a Herzberg key in 2019). Each is flagged in its explanation.
- Exam format for Section II (passages vs numericals) is not officially confirmed; the mock supports both.

## Credits and licence
Code and original explanations: MIT (see `LICENSE`). Course questions, slides and transcripts belong to NPTEL / IIT Kharagpur and the instructors; see `CREDITS.md`. Not affiliated with NPTEL.
