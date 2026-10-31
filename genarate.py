import json
import re
from datetime import date
from pathlib import Path

def load_json(path):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def load_projects():
    entries = []
    for path in sorted(Path("src/projects").glob("*.md")):
        source = path.read_text(encoding="utf-8")
        match = re.match(r"---\s*\n(.*?)\n---", source, re.S)
        if not match:
            continue
        if re.search(r"^draft:\s*true\s*$", match.group(1), re.M):
            continue
        metadata = {}
        for key in ("title", "description", "github"):
            field = re.search(r"^" + key + r":\s*(.+)$", match.group(1), re.M)
            if field:
                try:
                    metadata[key] = json.loads(field.group(1))
                except json.JSONDecodeError:
                    metadata[key] = field.group(1).strip().strip("'\"")
        tags = re.search(r"^tags:\s*\n((?:\s+-.*\n)+)", match.group(1), re.M)
        if tags:
            metadata["tech"] = [item.strip().strip("'\"") for item in re.findall(r"^\s+-\s*(.+)$", tags.group(1), re.M)]
        metadata["links"] = {"GitHub": metadata["github"]} if metadata.get("github") else {}
        if metadata.get("title"):
            entries.append(metadata)
    return entries

def line(char="-", count=3):
    return char * count

def main():
    data = load_json("data.json")
    edu = load_json("education.json")
    projects = load_projects()

    lines = []
    # Header
    lines.append(f"{data.get('name','muhsin')}")
    if data.get("bio"): lines.append(f"{data['bio']}")
    if data.get("email"): lines.append(f" {data['email']}")
    if data.get("location"): lines.append(f" {data['location']}")
    if data.get("socials"):
        socials = " | ".join(f"{k}: {v}" for k, v in data["socials"].items())
        lines.append(socials)
    lines.append(line("=")*10 + "\n")  # top divider

    # Education
    if edu.get("formal"):
        lines.append("Education")
        lines.append(line("-")*10)
        for e in edu["formal"]:
            lines.append(f"{e['degree']}  --  {e['institution']}")
            lines.append(f"({e['start']} – {e['end']})  |  {e.get('location','')}")
            if e.get("details"): lines.append(f"- {e['details']}")
            lines.append(line("-"))
        lines.append(line("="))

    # Side Quests
    if edu.get("side_quests"):
        lines.append("Side Quests")
        lines.append(line("-")*10)
        for s in edu["side_quests"]:
            lines.append(f"{s['title']}  --  {s['organizer']}")
            if s.get("start") or s.get("end"):
                lines.append(f"({s.get('start','')} – {s.get('end','')})")
            if s.get("focus"): lines.append(f"- {s['focus']}")
            if s.get("type"): lines.append(f"- {s['type']}")
            lines.append(line("-"))
        lines.append(line("="))

    # Projects
    if projects:
        lines.append("Projects")
        lines.append(line("-")*10)
        for p in projects:
            lines.append(f"{p.get('title','Untitled')}  --  {p.get('description','')}")
            if p.get("tech"): lines.append(f"- {', '.join(p['tech'])}")
            if p.get("links"):
                for label, url in p["links"].items():
                    lines.append(f"- {label}: {url}")
            lines.append(line("-"))
        lines.append(line("="))

    lines.append(f"Updated: {date.today().strftime('%B %Y')}")
    Path("cv.txt").write_text("\n".join(lines), encoding="utf-8")
    print("Minimal CV generated (cv.txt)")

if __name__ == "__main__":
    main()
