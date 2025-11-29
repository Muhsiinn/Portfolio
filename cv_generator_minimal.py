from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.lib.colors import black, HexColor
from datetime import date
import os

def generate_minimal_pdf(cv_data, sections):
    """
    Generate a minimal, clean CV PDF matching portfolio aesthetic
    """
    # Create output directory
    output_dir = "output"
    os.makedirs(output_dir, exist_ok=True)

    # PDF filename
    filename = f"{output_dir}/{cv_data.get('name', 'CV').replace(' ', '_')}_CV.pdf"

    # Create PDF with tighter margins for neater look
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.6*inch,
        bottomMargin=0.6*inch
    )

    # Container for PDF elements
    story = []

    # Define minimal styles
    styles = getSampleStyleSheet()

    # Custom minimal styles - cleaner and tighter
    name_style = ParagraphStyle(
        'NameStyle',
        parent=styles['Normal'],
        fontSize=20,
        textColor=black,
        spaceAfter=2,
        spaceBefore=0,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold',
        leading=24
    )

    contact_style = ParagraphStyle(
        'ContactStyle',
        parent=styles['Normal'],
        fontSize=9,
        textColor=HexColor('#333333'),
        spaceAfter=1,
        spaceBefore=0,
        alignment=TA_CENTER,
        fontName='Helvetica',
        leading=11
    )

    section_title_style = ParagraphStyle(
        'SectionTitle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=black,
        spaceAfter=4,
        spaceBefore=10,
        fontName='Helvetica-Bold',
        leading=12,
        letterSpacing=0.5
    )

    item_title_style = ParagraphStyle(
        'ItemTitle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=black,
        spaceAfter=1,
        spaceBefore=0,
        fontName='Helvetica-Bold',
        leading=12
    )

    item_subtitle_style = ParagraphStyle(
        'ItemSubtitle',
        parent=styles['Normal'],
        fontSize=9,
        textColor=HexColor('#444444'),
        spaceAfter=2,
        spaceBefore=0,
        fontName='Helvetica-Oblique',
        leading=11
    )

    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontSize=9,
        textColor=HexColor('#222222'),
        spaceAfter=1,
        spaceBefore=0,
        fontName='Helvetica',
        leading=12,
        leftIndent=12
    )

    text_style = ParagraphStyle(
        'TextStyle',
        parent=styles['Normal'],
        fontSize=9,
        textColor=HexColor('#222222'),
        spaceAfter=3,
        spaceBefore=0,
        fontName='Helvetica',
        leading=13,
        alignment=TA_LEFT
    )

    # Header - Name and Contact (neater, tighter)
    story.append(Paragraph(cv_data.get('name', '').upper(), name_style))
    story.append(Spacer(1, 0.04*inch))

    # Contact Information - single line
    contact_parts = []
    if cv_data.get('email'):
        contact_parts.append(cv_data['email'])
    if cv_data.get('phone'):
        contact_parts.append(cv_data['phone'])
    if cv_data.get('location'):
        contact_parts.append(cv_data['location'])

    if contact_parts:
        story.append(Paragraph(' · '.join(contact_parts), contact_style))

    # Links - on same line if possible
    if cv_data.get('links'):
        links_text = ' · '.join([link for link in cv_data['links'] if link])
        if links_text:
            story.append(Paragraph(links_text, contact_style))

    # Cleaner horizontal line
    story.append(Spacer(1, 0.08*inch))
    story.append(HRFlowable(width="100%", thickness=0.5, color=black))
    story.append(Spacer(1, 0.06*inch))

    # Group sections by title
    section_groups = {}
    for section in sections:
        title = section.get('title', 'Untitled')
        if title not in section_groups:
            section_groups[title] = []
        section_groups[title].append(section)

    # Process sections - much neater layout
    for title, group in section_groups.items():
        if not title:
            continue

        # Section title with minimal separator
        story.append(Paragraph(title.upper(), section_title_style))
        story.append(HRFlowable(width="60%", thickness=0.5, color=HexColor('#AAAAAA'), spaceAfter=4))

        for section in group:
            section_type = section.get('type')

            if section_type == 'text':
                # Text section - cleaner
                content = section.get('content', '')
                if content:
                    story.append(Paragraph(content, text_style))
                    story.append(Spacer(1, 0.06*inch))

            elif section_type == 'list':
                # List section - tighter bullets
                items = section.get('items', [])
                for item in items:
                    if item:
                        story.append(Paragraph(f"• {item}", body_style))
                if items:
                    story.append(Spacer(1, 0.04*inch))

            elif section_type == 'experience':
                # Experience entry - neater layout
                job = section.get('job', '')
                company = section.get('company', '')
                duration = section.get('duration', '')
                location = section.get('location', '')

                # Title line - cleaner formatting
                if job and company:
                    story.append(Paragraph(f"<b>{job}</b> — {company}", item_title_style))
                elif job:
                    story.append(Paragraph(f"<b>{job}</b>", item_title_style))

                # Subtitle line - tighter
                subtitle_parts = []
                if duration:
                    subtitle_parts.append(duration)
                if location:
                    subtitle_parts.append(location)
                if subtitle_parts:
                    story.append(Paragraph(' · '.join(subtitle_parts), item_subtitle_style))

                # Description - tighter bullets
                description = section.get('description', [])
                for desc in description:
                    if desc:
                        story.append(Paragraph(f"• {desc}", body_style))

                story.append(Spacer(1, 0.06*inch))

            elif section_type == 'education':
                # Education entry - neater layout
                degree = section.get('degree', '')
                institution = section.get('institution', '')
                duration = section.get('duration', '')
                location = section.get('location', '')
                details = section.get('details', '')

                # Title line
                if degree and institution:
                    story.append(Paragraph(f"<b>{degree}</b> — {institution}", item_title_style))
                elif degree:
                    story.append(Paragraph(f"<b>{degree}</b>", item_title_style))

                # Subtitle line
                subtitle_parts = []
                if duration:
                    subtitle_parts.append(duration)
                if location:
                    subtitle_parts.append(location)
                if subtitle_parts:
                    story.append(Paragraph(' · '.join(subtitle_parts), item_subtitle_style))

                # Details - inline, not as bullet
                if details:
                    story.append(Paragraph(details, text_style))

                story.append(Spacer(1, 0.06*inch))

            elif section_type == 'project':
                # Project entry - cleaner, tighter
                project_name = section.get('project_name', '')
                description = section.get('description', '')
                technologies = section.get('technologies', '')
                link = section.get('link', '')

                # Project name
                if project_name:
                    story.append(Paragraph(f"<b>{project_name}</b>", item_title_style))

                # Description - tighter spacing
                if description:
                    story.append(Paragraph(description, text_style))

                # Technologies - inline
                if technologies:
                    story.append(Paragraph(f"<i>{technologies}</i>", item_subtitle_style))

                # Link - cleaner
                if link:
                    story.append(Paragraph(f'<a href="{link}" color="#333333">{link}</a>', item_subtitle_style))

                story.append(Spacer(1, 0.06*inch))

    # Footer - minimal
    story.append(Spacer(1, 0.15*inch))
    story.append(HRFlowable(width="30%", thickness=0.3, color=HexColor('#CCCCCC'), spaceAfter=4))
    footer_style = ParagraphStyle(
        'FooterStyle',
        parent=contact_style,
        fontSize=7,
        textColor=HexColor('#888888'),
        alignment=TA_CENTER
    )
    story.append(Paragraph(
        f"{date.today().strftime('%B %Y')}",
        footer_style
    ))

    # Build PDF
    doc.build(story)

    return filename
