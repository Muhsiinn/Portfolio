from flask import Flask, render_template, request, send_file, jsonify
from cv_generator_minimal import generate_minimal_pdf
import json

app = Flask(__name__)

def load_json(path):
    """Load JSON file"""
    try:
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

@app.route('/')
def index():
    """Main CV builder page with pre-populated data"""
    # Load existing data
    data = load_json("data.json")
    education = load_json("education.json")
    projects = load_json("projects.json")

    # Prepare pre-populated sections
    prepopulated_sections = []

    # Add about/summary if exists
    if data.get('about'):
        prepopulated_sections.append({
            'type': 'text',
            'title': 'Summary',
            'content': data['about']
        })

    # Add technical skills section
    prepopulated_sections.append({
        'type': 'list',
        'title': 'Technical Skills',
        'items': [
            'Python, JavaScript, C, C++, SQL',
            'TensorFlow, PyTorch, Scikit-learn, FAISS',
            'Flask, REST APIs, Git, Docker',
            'Pandas, NumPy, Matplotlib, Data Analysis',
            'Machine Learning, NLP, Computer Vision'
        ]
    })

    # Add languages section
    prepopulated_sections.append({
        'type': 'list',
        'title': 'Languages',
        'items': ['English (Fluent)', 'German (Intermediate)', 'Malayalam (Native)']
    })

    # Add education sections
    if education.get('formal'):
        for edu in education['formal']:
            prepopulated_sections.append({
                'type': 'education',
                'title': 'Education',
                'degree': edu.get('degree', ''),
                'institution': edu.get('institution', ''),
                'duration': f"{edu.get('start', '')} - {edu.get('end', '')}",
                'location': edu.get('location', ''),
                'details': edu.get('details', '')
            })

    # Add side quests/certifications
    if education.get('side_quests'):
        for sq in education['side_quests']:
            prepopulated_sections.append({
                'type': 'education',
                'title': 'Certifications',
                'degree': sq.get('title', ''),
                'institution': sq.get('organizer', ''),
                'duration': f"{sq.get('start', '')} - {sq.get('end', '')}",
                'location': sq.get('type', ''),
                'details': sq.get('focus', '')
            })

    # Add projects
    if isinstance(projects, list):
        for proj in projects:
            prepopulated_sections.append({
                'type': 'project',
                'title': 'Projects',
                'project_name': proj.get('title', ''),
                'description': proj.get('description', ''),
                'technologies': '',
                'link': proj.get('links', {}).get('github', '') if isinstance(proj.get('links'), dict) else ''
            })

    return render_template('cv_builder.html',
                         data=data,
                         prepopulated_sections=prepopulated_sections)

@app.route('/generate-pdf', methods=['POST'])
def generate_pdf():
    """Generate PDF from form data"""
    try:
        # Get basic info
        cv_data = {
            'name': request.form.get('name', ''),
            'email': request.form.get('email', ''),
            'phone': request.form.get('phone', ''),
            'location': request.form.get('location', ''),
            'links': [link.strip() for link in request.form.get('links', '').split('\n') if link.strip()],
        }

        # Get dynamic sections
        sections = []
        section_count = int(request.form.get('sectionCount', 0))

        for i in range(section_count):
            section_type = request.form.get(f'section_{i}_type')
            if not section_type:
                continue

            section = {
                'type': section_type,
                'title': request.form.get(f'section_{i}_title', ''),
            }

            if section_type == 'text':
                section['content'] = request.form.get(f'section_{i}_content', '')

            elif section_type == 'list':
                items_text = request.form.get(f'section_{i}_items', '')
                section['items'] = [item.strip() for item in items_text.split('\n') if item.strip()]

            elif section_type == 'experience':
                section['job'] = request.form.get(f'section_{i}_job', '')
                section['company'] = request.form.get(f'section_{i}_company', '')
                section['duration'] = request.form.get(f'section_{i}_duration', '')
                section['location'] = request.form.get(f'section_{i}_location', '')
                desc_text = request.form.get(f'section_{i}_description', '')
                section['description'] = [d.strip() for d in desc_text.split('\n') if d.strip()]

            elif section_type == 'education':
                section['degree'] = request.form.get(f'section_{i}_degree', '')
                section['institution'] = request.form.get(f'section_{i}_institution', '')
                section['duration'] = request.form.get(f'section_{i}_duration', '')
                section['location'] = request.form.get(f'section_{i}_location', '')
                section['details'] = request.form.get(f'section_{i}_details', '')

            elif section_type == 'project':
                section['project_name'] = request.form.get(f'section_{i}_project_name', '')
                section['description'] = request.form.get(f'section_{i}_description', '')
                section['technologies'] = request.form.get(f'section_{i}_technologies', '')
                section['link'] = request.form.get(f'section_{i}_link', '')

            sections.append(section)

        # Generate PDF
        pdf_path = generate_minimal_pdf(cv_data, sections)

        return send_file(pdf_path,
                        as_attachment=True,
                        download_name=f"{cv_data['name']}_CV.pdf",
                        mimetype='application/pdf')

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
