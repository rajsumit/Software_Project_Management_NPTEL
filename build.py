#!/usr/bin/env python3
"""Bundle the SPM Exam Lab into one self-contained HTML page.
Usage: python3 build.py [output]   (default: docs/index.html)"""
import os, sys
ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src')
ORDER = ['qbank.js', 'core.js', 'gen.js', 'figs.js'] + ['topics/%s.js' % t for t in
         ['home', 'easy', 'qbank', 'mock', 'revision'] + ['w%02d' % i for i in range(1, 13)]]
def rd(p): return open(os.path.join(SRC, p), encoding='utf-8').read()
js = '\n'.join('/* ---- %s ---- */\n' % p + rd(p) for p in ORDER)
js += '\ntry { boot(); } catch (e) { document.getElementById("page").innerHTML = "<h1>Something went wrong</h1><pre>" + (e && e.stack || e) + "</pre>"; }\n'
js = js.replace('</script', '<\\/script')
html = rd('shell.html').replace('/*CSS*/', rd('style.css')).replace('/*JS*/', js)
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'docs', 'index.html')
os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
with open(out, 'w', encoding='utf-8') as f: f.write(html)
print(out, '%.0f KB' % (len(html.encode()) / 1024))
