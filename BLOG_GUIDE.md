# How to Add Blog Posts

## 1. Create the markdown file

Create a new `.md` file in the `blog/` folder (e.g., `my-post.md`).

Write your content in markdown. Images work like this:

```markdown
![alt text](https://example.com/image.jpg)
![local image](images/photo.jpg)
```

## 2. Add entry to blog.json

Open `blog.json` and add a new entry:

```json
{
  "title": "Your Blog Title",
  "date": "2025-03-15",
  "file": "my-post.md",
  "cover": "https://example.com/cover-image.jpg"
}
```

- `title` - The blog post title (shown on blog list and post page)
- `date` - Publication date
- `file` - The markdown filename inside `blog/` folder
- `cover` - Hero image at the top of the post (leave `""` for no cover)

## 3. Done

Visit `blog.html` to see your new post listed. Click the title to read it.
