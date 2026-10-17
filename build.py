#!/usr/bin/env python3
"""Bundle the SPM Exam Lab into one self-contained HTML page.
Usage: python3 build.py [output]   (default: docs/index.html)"""
import os, sys
ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src')
ORDER = ['qbank.js', 'core.js', 'gen.js', 'figs.js'] + ['topics/%s.js' % t for t in
         ['home']] + ['learn.js'] + ['topics/%s.js' % t for t in ['easy', 'qbank', 'mock', 'revision'] + ['w%02d' % i for i in range(1, 13)]] + ['learn/l%02d.js' % i for i in range(1, 13) if os.path.exists(os.path.join(SRC, 'learn', 'l%02d.js' % i))]
def rd(p): return open(os.path.join(SRC, p), encoding='utf-8').read()
js = '\n'.join('/* ---- %s ---- */\n' % p + rd(p) for p in ORDER)
js += '\ntry { boot(); } catch (e) { document.getElementById("page").innerHTML = "<h1>Something went wrong</h1><pre>" + (e && e.stack || e) + "</pre>"; }\n'
js = js.replace('</script', '<\\/script')
html = rd('shell.html').replace('/*CSS*/', rd('style.css')).replace('/*JS*/', js)
# Full standalone document for GitHub Pages: doctype (standards mode), charset and the mobile
# viewport meta. Without the viewport tag phones lay the page out at 980 px and shrink it.
HEAD = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        '<meta name="theme-color" content="#F6F3EC" media="(prefers-color-scheme: light)">\n'
        '<meta name="theme-color" content="#11141B" media="(prefers-color-scheme: dark)">\n'
        '<meta name="description" content="NPTEL Software Project Management (noc26_cs152) exam lab: the whole course as a connected story with animated diagrams, all assignments, mock exam and revision.">\n')
title_end = html.index('</title>') + len('</title>')
full = HEAD + html[:title_end] + '\n' + html[title_end:].replace('<div class="app">', '</head>\n<body>\n<div class="app">', 1) + '\n</body>\n</html>\n'
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'docs', 'index.html')
os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
with open(out, 'w', encoding='utf-8') as f: f.write(full)
print(out, '%.0f KB' % (len(full.encode()) / 1024))
# Fragment for the claude.ai artifact (the host wraps it in its own document skeleton).
frag = os.path.join(ROOT, 'dist', 'artifact.html')
os.makedirs(os.path.dirname(frag), exist_ok=True)
with open(frag, 'w', encoding='utf-8') as f: f.write(html)
