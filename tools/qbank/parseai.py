import re, json
out=[]
for p in range(1,6):
    t=open(f'/home/claude/spm/mocks/mock{p}.txt').read()
    t=re.sub(r'[ \t]+',' ',t)
    key=dict((int(a),b) for a,b in re.findall(r'(\d+):\s*([A-D])',t.split('Answer Key')[1]))
    body=t.split('Answer Key')[0]
    qs=re.split(r'\n\s*Q(\d+)\.\s',body)
    for i in range(1,len(qs),2):
        n=int(qs[i]); b=qs[i+1]
        src=re.search(r'Source:\s*(\S+)\s*\|\s*Difficulty:\s*(\w+)',b)
        b=b[:src.start()] if src else b
        parts=re.split(r'\n\s*([A-D])\)\s',b)
        stem=' '.join(parts[0].split())
        opts=[' '.join(parts[j+1].split()) for j in range(1,len(parts),2)]
        out.append(dict(p=p,n=n,stem=stem,opts=opts,ans=ord(key[n])-65,src=src.group(1) if src else '',diff=src.group(2) if src else ''))
json.dump(out,open('ai_raw.json','w'),indent=1,ensure_ascii=False)
print(len(out))
from collections import Counter
print(Counter(len(q['opts']) for q in out), Counter(q['diff'] for q in out), Counter('ABCD'[q['ans']] for q in out))
