import re, json, glob
out=[]
for w in range(1,13):
    f=glob.glob(f'/home/claude/spm/c/week_{w:02d}__Assignment_{w}_-_SPM_2026.pdf.txt')[0]
    t=open(f).read()
    parts=re.split(r'\n\s*QUESTION (\d+):[ \t]*\n', '\n'+t)
    for i in range(1,len(parts),2):
        n=int(parts[i]); body=parts[i+1]
        body=body.split('******THE END')[0]
        m=re.split(r'\nCorrect Answer:\s*', body,maxsplit=1)
        stem_opts=m[0]; rest=m[1] if len(m)>1 else ''
        ca, _, sol = rest.partition('Detailed Solution:')
        # options
        lines=stem_opts.strip().split('\n')
        stem=[];opts=[];cur=None
        for ln in lines:
            mm=re.match(r'^([a-g])\.\s*(.*)',ln.strip())
            if mm and (not opts and mm.group(1)=='a' or opts and ord(mm.group(1))==ord('a')+len(opts)):
                opts.append(mm.group(2).strip())
            elif opts:
                opts[-1]+=' '+ln.strip()
            else: stem.append(ln.strip())
        letters=re.findall(r'(?:^|\n)\s*([a-g])\.\s', '\n'+ca)
        out.append(dict(wk=w,n=n,stem=' '.join(stem),opts=opts,ans=[ord(x)-97 for x in letters],ca=ca.strip(),sol=' '.join(sol.split())))
json.dump(out,open('/home/claude/spm/data/a26_raw.json','w'),indent=1,ensure_ascii=False)
print(len(out))
for q in out:
    flag='' if q['ans'] and len(q['opts'])>=2 else ' <<<<'
    print(q['wk'],q['n'],len(q['opts']),q['ans'],flag, q['stem'][:70])
