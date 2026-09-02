document.addEventListener('DOMContentLoaded', () => {
    const blogList = document.getElementById('blog-list');
    const postTitle = document.getElementById('post-title');
    const postDate = document.getElementById('post-date');
    const postContent = document.getElementById('post-content');

    if (blogList) {
        loadBlogList();
    } else if (postTitle) {
        loadBlogPost();
    }
});

async function loadBlogList() {
    try {
        const res = await fetch('blog.json');
        const blogs = await res.json();
        const container = document.getElementById('blog-list');

        blogs.forEach(blog => {
            const entry = document.createElement('div');
            entry.className = 'blog-entry';
            entry.innerHTML = `
                <a href="post.html?post=${encodeURIComponent(blog.file)}">
                    <h2>${blog.title}</h2>
                    <p>${blog.date}</p>
                </a>
            `;
            container.appendChild(entry);
        });
    } catch (error) {
        console.error('Error loading blogs:', error);
    }
}

async function loadBlogPost() {
    try {
        const params = new URLSearchParams(window.location.search);
        const file = params.get('post');

        if (!file) {
            document.getElementById('post-content').textContent = 'No post specified.';
            return;
        }

        const res = await fetch('blog.json');
        const blogs = await res.json();
        const blog = blogs.find(b => b.file === file);

        if (blog) {
            document.getElementById('post-title').textContent = blog.title;
            document.getElementById('post-date').textContent = blog.date;
            document.title = `${blog.title} - Muhsin`;

            if (blog.cover) {
                const coverDiv = document.getElementById('post-cover');
                coverDiv.innerHTML = `<img src="${blog.cover}" alt="${blog.title}">`;
            }
        }

        const mdRes = await fetch(`blog/${file}`);
        if (mdRes.ok) {
            const md = await mdRes.text();
            document.getElementById('post-content').innerHTML = marked.parse(md);
        } else {
            document.getElementById('post-content').textContent = 'Post not found.';
        }
    } catch (error) {
        console.error('Error loading post:', error);
    }
}
