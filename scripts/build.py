#!/usr/bin/env python3
"""Build a small static archive from Markdown and discovered image assets."""
from __future__ import annotations
import json, re, shutil, sys, tomllib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "_site"
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".svg"}
SECTIONS = {
    "research": "Research", "projects/ai": "Artificial Intelligence",
    "projects/neuroscience-psychiatry": "Neuroscience and Psychiatry",
    "projects/other": "Other Software", "thoughts": "Thoughts", "blog": "Blog",
    "scrapper": "Scrapper",
}
GENERATED_SECTIONS = {
    "home": "home", "research": "research", "ai": "ai",
    "neuroscience-psychiatry": "neuroscience-psychiatry", "other": "other",
    "thoughts": "thoughts", "blog": "blog", "scrapper": "scrapper", "about": "about",
}

def frontmatter(path: Path):
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        return {}, text
    end = text.find("\n---\n", 4)
    if end < 0:
        raise ValueError(f"{path}: frontmatter is missing closing ---")
    raw = text[4:end]
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise ValueError(f"{path}: metadata must be JSON-compatible YAML: {exc}") from exc
    return data, text[end + 5:]

def build_index():
    entries=[]
    for folder, label in SECTIONS.items():
        base=ROOT/"content"/folder
        if not base.exists(): continue
        for path in sorted(base.rglob("*.md")):
            if path.name.startswith("_"): continue
            meta, body=frontmatter(path)
            rel=path.relative_to(ROOT).as_posix()
            if not meta.get("title"):
                raise ValueError(f"{rel}: missing title in frontmatter")
            entry={"section":folder.split("/")[0],"subsection":label if folder.startswith("projects/") else "", "path":rel,"slug":path.stem,"title":meta["title"],"date":meta.get("date",""),"summary":meta.get("summary",meta.get("description","")),"status":meta.get("status",""),"technologies":meta.get("technologies",[]),"links":meta.get("links",{}),"illustrations":meta.get("illustrations",[]),"body":body.strip()}
            entries.append(entry)
    return entries

def build_illustrations():
    manifest=ROOT/"content/illustrations.md"
    text=manifest.read_text(encoding="utf-8")
    match=re.search(r"```toml\s*(.*?)\s*```",text,re.S)
    if not match: raise ValueError("content/illustrations.md needs a TOML fenced block")
    data=tomllib.loads(match.group(1))
    overrides={item["file"]:item for item in data.get("illustration",[]) if "file" in item}
    required=overrides.get("home/brain-study.webp",{})
    if required.get("slot") != "home-brain" or not required.get("fixed"):
        raise ValueError("the homepage brain illustration must use slot=home-brain and fixed=true")
    # Normal production folders are discovered directly. Agent-generated
    # source originals stay in images/generated/; only assets placed into one
    # of its named section folders are published automatically.
    allowed=[ROOT/"images"/name for name in ["home","research","projects","thoughts","blog","scrapper","about"]]
    generated=ROOT/"images"/"generated"
    generated_sections=[generated/name for name in GENERATED_SECTIONS]
    found={p.relative_to(ROOT/"images").as_posix():p for folder in [*allowed,*generated_sections] if folder.exists() for p in folder.rglob("*") if p.is_file() and p.suffix.lower() in IMAGE_EXTS}
    for name in sorted(set(overrides)-set(found)):
        print(f"warning: illustration manifest references missing file images/{name}",file=sys.stderr)
    result=[]
    for name,path in sorted(found.items()):
        if name.startswith("generated/"):
            section=name.split("/",2)[1]
        elif name.startswith("projects/ai/"): section="ai"
        elif name.startswith("projects/neuroscience-psychiatry/"): section="neuroscience-psychiatry"
        elif name.startswith("projects/other/"): section="other"
        else: section=name.split("/",1)[0]
        item={"file":"images/"+name,"section":section,"alt":path.stem.replace("-"," "),"caption":"","credit":"","fixed":False,"exclude":False}
        if path.suffix.lower() == ".svg":
            svg = path.read_text(encoding="utf-8")
            viewbox = re.search(r'viewBox=["\']\s*[-\d.]+[ ,]+[-\d.]+[ ,]+([\d.]+)[ ,]+([\d.]+)', svg, re.I)
            if viewbox:
                item["width"], item["height"] = (int(float(value)) for value in viewbox.groups())
        item.update(overrides.get(name,{}))
        item["file"]="images/"+name
        result.append(item)
    return result

def copy_site():
    if OUT.exists(): shutil.rmtree(OUT)
    OUT.mkdir()
    for name in ["index.html","research.html","projects.html","thoughts.html","blog.html","scrapper.html","about.html","entry.html","style.css","site.js","archive.js","entry.js","illustration-tools.js","notebook-render.js","scrapper.js","about.js","content"]:
        src=ROOT/name
        if not src.exists(): continue
        dst=OUT/name
        if src.is_dir(): shutil.copytree(src,dst,ignore=shutil.ignore_patterns("__pycache__","*.pyc"))
        else: shutil.copy2(src,dst)
    for folder in ["home","research","projects","thoughts","blog","scrapper","about"]:
        source=ROOT/"images"/folder
        if source.exists(): shutil.copytree(source,OUT/"images"/folder,dirs_exist_ok=True,ignore=shutil.ignore_patterns("__pycache__","*.pyc"))
    # Keep full-resolution agent/source outputs out of deployment; copy only
    # the section-organized generated artwork that the index can reference.
    generated=ROOT/"images"/"generated"
    for section in GENERATED_SECTIONS:
        source=generated/section
        if source.exists(): shutil.copytree(source,OUT/"images"/"generated"/section,dirs_exist_ok=True,ignore=shutil.ignore_patterns("__pycache__","*.pyc"))
    content_index=json.dumps(build_index(),ensure_ascii=False,indent=2)+"\n"
    illustration_index=json.dumps(build_illustrations(),ensure_ascii=False,indent=2)+"\n"
    # Root copies support the common `python -m http.server` workflow. The
    # generated files are ignored by Git; Pages publishes the copies in _site.
    (ROOT/"content-index.json").write_text(content_index,encoding="utf-8")
    (ROOT/"illustrations-index.json").write_text(illustration_index,encoding="utf-8")
    (OUT/"content-index.json").write_text(content_index,encoding="utf-8")
    (OUT/"illustrations-index.json").write_text(illustration_index,encoding="utf-8")
    (OUT/".nojekyll").touch()

if __name__ == "__main__":
    try:
        copy_site()
        print(f"Built {len(build_index())} Markdown entries and illustration index into _site/")
    except (OSError, ValueError, tomllib.TOMLDecodeError) as exc:
        print(f"Build failed: {exc}",file=sys.stderr)
        raise SystemExit(1)
