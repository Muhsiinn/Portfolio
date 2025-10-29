document.addEventListener('DOMContentLoaded', () => {
    loadAllData();
});

async function loadAllData() {
    try {
        const [dataRes, eduRes, projRes] = await Promise.all([
            fetch('data.json'),
            fetch('education.json'),
            fetch('projects.json')
        ]);

        const data = await dataRes.json();
        const education = await eduRes.json();
        const projects = await projRes.json();

        // Populate Header
        document.getElementById('name').textContent = data.name || '';
        document.getElementById('bio').textContent = data.bio || '';

        const nameElement = document.getElementById('name');
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        nameElement.parentNode.insertBefore(cursor, nameElement.nextSibling);


        // Populate About
        document.getElementById('about-content').textContent = data.about || '';

        // Populate Education
        const eduContainer = document.getElementById('education-content');
        let eduHTML = '';
        if (education.formal) {
            education.formal.forEach(e => {
                eduHTML += `<div class="edu-entry"><strong>${e.degree}</strong>, ${e.institution} (${e.start}–${e.end})</div>`;
            });
        }
        if (education.side_quests) {
            eduHTML += '<br><h3>Side Quests</h3>';
            education.side_quests.forEach(s => {
                eduHTML += `<div class="side-entry"><strong>${s.title}</strong> — ${s.organizer}</div>`;
            });
        }
        eduContainer.innerHTML = eduHTML;

        // Populate Projects
        const projectsContainer = document.getElementById('projects-content');
        projectsContainer.innerHTML = ''; // Clear previous content
        for (let i = 0; i < projects.length; i++) {
            const p = projects[i];
            const projectDiv = document.createElement('div');
            projectDiv.className = 'project';

            const projectHeader = document.createElement('h3');
            projectHeader.innerHTML = `${p.title} <span class="icon"></span>`;
            projectHeader.addEventListener('click', () => {
                projectHeader.classList.toggle('active');
                const content = projectDiv.querySelector('.project-content');
                if (content.style.display === 'none' || content.style.display === '') {
                    content.style.display = 'block';
                } else {
                    content.style.display = 'none';
                }
            });

            const projectContent = document.createElement('div');
            projectContent.className = 'project-content';
            projectContent.style.display = 'none';

            let contentHTML = `<p>${p.description}</p>`;
            if (p.file) {
                const mdRes = await fetch(`projects/${p.file}`);
                if (mdRes.ok) {
                    const md = await mdRes.text();
                    contentHTML += `<div>${marked.parse(md)}</div>`;
                }
            }
            if (p.links) {
                contentHTML += '<div class="links">';
                for (const [label, url] of Object.entries(p.links)) {
                    contentHTML += `<a href="${url}" target="_blank">${label}</a>`;
                }
                contentHTML += '</div>';
            }

            projectContent.innerHTML = contentHTML;
            projectDiv.appendChild(projectHeader);
            projectDiv.appendChild(projectContent);
            projectsContainer.appendChild(projectDiv);
        }

        // Populate Contact
        const contactContainer = document.getElementById('contact-content');
        let contactHTML = '';
        if (data.email) {
            contactHTML += `<div><a href="mailto:${data.email}">${data.email}</a></div>`;
        }
        if (data.socials) {
            for (const [name, url] of Object.entries(data.socials)) {
                contactHTML += `<div><a href="${url}" target="_blank">${name}</a></div>`;
            }
        }
        contactContainer.innerHTML = contactHTML;

    } catch (error) {
        console.error('Error loading data:', error);
    }
}