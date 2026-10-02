from __future__ import annotations
import argparse,json,os,re,subprocess,sys,urllib.parse,urllib.request
from pathlib import Path
from datetime import datetime
ROOT=Path(__file__).resolve().parents[1];MODEL=os.getenv("AI_MODEL","openrouter/free");API="https://openrouter.ai/api/v1/chat/completions";MIN_WORDS=1500;MAX_WORDS=2200
def emit(t,**kw): print(json.dumps({"type":t,**kw}),flush=True)
def run(cmd,check=True): return subprocess.run(cmd,cwd=ROOT,text=True,capture_output=True,check=check)
def ask(system,user,temp=.4):
    key=os.getenv("OPENROUTER_API_KEY")
    if not key: raise RuntimeError("OPENROUTER_API_KEY is not configured.")
    body=json.dumps({"model":MODEL,"messages":[{"role":"system","content":system},{"role":"user","content":user}],"temperature":temp}).encode()
    req=urllib.request.Request(API,data=body,headers={"Authorization":"Bearer "+key,"Content-Type":"application/json","HTTP-Referer":"https://www.grandmasterchess.in","X-Title":"Grandmaster AI HQ"})
    with urllib.request.urlopen(req,timeout=120) as r: data=json.loads(r.read().decode())
    return data["choices"][0]["message"]["content"]
def search_web(q):
    url="https://html.duckduckgo.com/html/?"+urllib.parse.urlencode({"q":q});req=urllib.request.Request(url,headers={"User-Agent":"Grandmaster-AI-HQ/0.1"})
    with urllib.request.urlopen(req,timeout=20) as r: html=r.read().decode("utf-8","ignore")
    return [urllib.parse.unquote(x) for x in re.findall(r'nuddg=([^&"]+)',html)[:8]]
def repo_context(): return "\n".join(run(["git","ls-files"],False).stdout.splitlines()[:500])
def verify_article(text):
    words=len(re.findall(r"\b[\w’'-]+\b",text))
    if not MIN_WORDS<=words<=MAX_WORDS:return False,f"Article word count {words}; expected {MIN_WORDS}-{MAX_WORDS}."
    if re.search(r"BEGIN PRIVATE KEY|ghp_[A-Za-z0-9]{20,}|sk-or-v1-[A-Za-z0-9_-]{20,}",text):return False,"Possible secret detected."
    return True,f"{words} words"
def main():
    ap=argparse.ArgumentParser();ap.add_argument("--task",required=True);a=ap.parse_args()
    if not os.getenv("OPENROUTER_API_KEY"):raise RuntimeError("Set OPENROUTER_API_KEY before starting the team.")
    emit("agent",agent="director",status="Planning",message="Inspecting repository and defining one measurable growth task.")
    if run(["git","status","--short"],False).stdout.strip():raise RuntimeError("Working tree is not clean. Commit or stash local changes first.")
    ctx=repo_context();plan=ask("You are the Growth Director for a chess gaming website. Choose one high-value user-helpful organic-growth task. No spam, fake links, fabricated facts, or doorway pages.",f"User task: {a.task}\nRepository files:\n{ctx}\nChoose one task and explain why.",.2)
    emit("result",agent="director",message=plan[:1200])
    emit("agent",agent="researcher",status="Researching",message="Searching the web for evidence and opportunities.")
    urls=search_web(plan.splitlines()[0][:220]+" chess");research="\n".join(urls)
    research+="\n\n"+ask("You are a chess research specialist. Produce a factual research brief. Do not invent facts. Flag current claims needing primary-source verification.",f"Plan:\n{plan}\nSearch results:\n{research}")
    emit("result",agent="researcher",message="Research package prepared.")
    emit("agent",agent="writer",status="Writing",message="Creating a substantial original article.")
    article=ask("You are the Article Writer for Grandmaster Chess. Write an original useful 1500-2200 word Markdown article with H1, H2/H3 sections, examples and a short FAQ. Never fabricate current facts, ratings, results, quotes or citations.",f"Plan:\n{plan}\nResearch:\n{research}\nRepository:\n{ctx}",.5)
    ok,reason=verify_article(article)
    if not ok:raise RuntimeError("Writer gate failed: "+reason)
    emit("result",agent="writer",message="Draft passes article gate: "+reason)
    emit("agent",agent="seo",status="Auditing",message="Reviewing SEO/AEO opportunities.")
    seo=ask("You are an SEO/AEO engineer. Recommend only concrete user-helpful changes: metadata, internal links, schema, indexability, performance and answer clarity. No keyword stuffing.",f"Article:\n{article}\nRepository:\n{ctx}",.2)
    emit("result",agent="seo",message=seo[:1200])
    emit("agent",agent="coder",status="Applying",message="Creating isolated branch and adding the article.")
    branch="ai/growth/"+datetime.utcnow().strftime("%Y%m%d-%H%M%S");run(["git","checkout","-b",branch])
    slug=re.sub(r"[^a-z0-9]+","-",plan.lower()).strip("-")[:65] or "chess-growth-article";target=ROOT/"content/blog"/("ai-"+slug+".md");target.write_text(article.strip()+"\n",encoding="utf-8")
    run(["git","add",str(target.relative_to(ROOT))]);run(["git","commit","-m","ai: add growth article"])
    emit("result",agent="coder",message=f"Committed {target.relative_to(ROOT)} on {branch}.")
    emit("agent",agent="verifier",status="Testing",message="Running lint and production build.")
    for cmd in [["npm","run","lint"],["npm","run","build"]]:
        p=run(cmd,False)
        if p.returncode:raise RuntimeError("Verifier failed on "+" ".join(cmd)+"\n"+(p.stdout+p.stderr)[-1800:])
    emit("result",agent="verifier",message="Lint, production build and article gates passed.")
    emit("agent",agent="release",status="Preparing",message="Checking GitHub CLI for PR creation.")
    gh=run(["gh","--version"],False)
    if gh.returncode!=0:emit("result",agent="release",message="GitHub CLI is not installed; branch is ready locally. Install gh and run gh auth login to enable PR creation.")
    else:
        auth=run(["gh","auth","status"],False)
        if auth.returncode!=0:emit("result",agent="release",message="GitHub CLI is not authenticated. Run gh auth login to enable PR creation.")
        else:
            pr=run(["gh","pr","create","--base","main","--head",branch,"--title","AI growth: "+slug,"--body","Grandmaster AI HQ growth cycle. Verifier passed lint, build and article gates. Review before merge."],False)
            if pr.returncode:emit("result",agent="release",message="PR creation failed: "+pr.stderr[-900:])
            else:emit("result",agent="release",message="Pull request created: "+pr.stdout.strip())
    emit("agent",agent="learner",status="Recording",message="Recording cycle outcome.")
    mem=ROOT/"harness/memory";mem.mkdir(exist_ok=True)
    with (mem/"cycles.jsonl").open("a",encoding="utf-8") as f:f.write(json.dumps({"at":datetime.utcnow().isoformat()+"Z","task":a.task,"branch":branch,"verified":True})+"\n")
    emit("result",agent="learner",message="Cycle recorded.")
    emit("complete",message="Growth cycle completed. Review the PR before production merge.")
if __name__=="__main__":
    try:main()
    except Exception as e:emit("failed",message=str(e));sys.exit(1)
