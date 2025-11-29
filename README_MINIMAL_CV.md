# Minimal CV Builder

A clean, minimal CV/Resume builder with your portfolio's aesthetic. Build professional CVs with complete flexibility - add any sections you want!

## Features

- **Auto-Loads Your Data**: Fetches from existing JSON files (data.json, education.json, projects.json)
- **Minimal Design**: Black and white theme with Roboto Mono font
- **Animated Background**: Same animated lines as your portfolio
- **Flexible Sections**: Add any type of section you need
- **Professional PDFs**: Clean, ATS-friendly, neat PDF output
- **Simple Interface**: No clutter, just the essentials
- **Pre-Populated**: Your info, education, projects automatically loaded

## Section Types

### 1. Text Section
Perfect for: Summary, About Me, Objective
- Section title
- Paragraph text

### 2. List Section
Perfect for: Skills, Languages, Interests
- Section title
- Bullet point items

### 3. Experience Entry
Perfect for: Work Experience, Internships
- Job title & company
- Duration & location
- Bullet points for responsibilities

### 4. Education Entry
Perfect for: Education, Certifications
- Degree & institution
- Duration & location
- Details (GPA, honors, etc.)

### 5. Project Entry
Perfect for: Projects, Publications
- Project name
- Description
- Technologies used
- Link (GitHub, etc.)

## Quick Start

```bash
# Run the app
python cv_app.py

# Open browser
http://localhost:5000
```

The form will **automatically load**:
- Your name, email, phone, links from `data.json`
- Your "About" section as a Summary
- All education entries from `education.json`
- All certifications/side quests from `education.json`
- All projects from `projects.json`

Just review, edit, and add anything else you need!

## Usage

1. **Fill Basic Info**: Name, email, phone, location, links

2. **Add Sections**: Choose section type from dropdown and click "Add Section"
   - Text Section for summaries/paragraphs
   - List Section for skills/languages
   - Experience Entry for jobs
   - Education Entry for degrees
   - Project Entry for projects

3. **Customize**: Each section has a title field - use it to create custom section names

4. **Generate PDF**: Click "Generate PDF" to download

## Examples

### Creating a Skills Section
1. Choose "List Section"
2. Title: "Technical Skills"
3. Items (one per line):
   ```
   Python
   JavaScript
   Machine Learning
   Flask
   ```

### Creating Work Experience
1. Choose "Experience Entry"
2. Title: "Work Experience"
3. Job Title: "Software Engineer"
4. Company: "Tech Corp"
5. Duration: "Jan 2023 - Present"
6. Location: "Remote"
7. Description (one per line):
   ```
   Developed ML models
   Led team of 3 engineers
   Improved performance by 40%
   ```

### Creating Multiple Entries in Same Section
Want 3 jobs under "Work Experience"?
- Add Experience Entry, title it "Work Experience"
- Add another Experience Entry, title it "Work Experience" again
- Add another Experience Entry, title it "Work Experience" again
→ All three will group under one "WORK EXPERIENCE" section in the PDF!

## PDF Style

The PDF matches your minimal aesthetic:
- Clean black and white
- Simple typography
- Clear hierarchy
- Professional layout
- No fancy colors or graphics

## Tips

- **Group sections**: Use the same title for multiple entries to group them
- **One item per line**: For lists and descriptions, put each item on a new line
- **Keep it simple**: Minimal is better - focus on content
- **ATS-friendly**: The clean design works great with applicant tracking systems

## File Structure

```
Portfolio/
├── cv_app.py                    # Flask application
├── cv_generator_minimal.py      # PDF generator
├── templates/
│   └── cv_builder.html         # Minimal CV form
└── output/                      # Generated PDFs
```

## Dependencies

```
Flask==3.0.0
reportlab==4.0.7
```

Install:
```bash
pip install flask reportlab
```

## Customization

### Change PDF Style
Edit `cv_generator_minimal.py`:
```python
# Font sizes
fontSize=18,  # Name size
fontSize=11,  # Section titles
fontSize=9,   # Body text

# Margins
rightMargin=1*inch,
leftMargin=1*inch,
```

### Change Web Design
Edit `templates/cv_builder.html` styles section

## Why This Approach?

Instead of predefined rigid sections, you build your CV like Lego blocks:
- ✅ Want a "Volunteer Work" section? Add it!
- ✅ Want "Publications"? Add it!
- ✅ Want "Hobbies"? Add it!
- ✅ Want 5 projects? Add 5 project entries!

You're not limited by what the app thinks a CV should have.

## Notes

- All fields are optional except Name and Email
- Remove sections with the "Remove" button
- Sections appear in PDF in the order you add them
- Same section titles automatically group together

---

**Simple. Clean. Professional.**
