---
title: "Neo Vim For Uni"
description: "How I use Neovim for university notes, documents, programming, notebooks, and everyday work."
date: 2026-11-28
tags:
  - Neovim
  - University
  - Linux
  - Quarto
  - Jupyter
draft: true
---

# Setting Up Neovim for University

I use Neovim for quite a bit of my university work: writing notes, preparing assignments, working with code, managing TODOs, and keeping all those lecture materials in order.

This isn't an argument about which editor is better. You might use Notepad, Notepad++, Emacs, Nano, VS Code, or something else. That's completely fine. I just happen to use Neovim, and this is how I've set it up to work for university.

If you're coming from a traditional IDE or editor, the first few days can feel a little strange. Modal editing takes some getting used to, and you might find yourself reaching for familiar shortcuts that aren't there. That's normal. Give it some time. Once the motions become second nature, moving around and editing text can feel remarkably quick. You don't need to memorise the whole keyboard on day one.

Let's get into it.

## The foundation: LazyVim

I use **[LazyVim](https://www.lazyvim.org/)** as the starting point for my Neovim setup. It gives me a solid collection of sensible defaults and useful plugins, so I don't have to build every basic feature myself. From there, I've added my own options, key mappings, plugins, and language-specific configuration.

If you're new to Neovim, LazyVim is a good place to start.

![The LazyVim dashboard running in Neovim](/assets/images/thoughts/neovim-university-setup/lazyvim-startup.png)

## 1. Writing notes with Markdown and LaTeX

Most of my notes start as Markdown files. When I need mathematical notation, I use LaTeX inside them.

I like this setup because it stays simple. A Markdown file is just text: I can open it in Neovim, search it from the terminal, edit it in another application, or link it to another note. I'm not tied to one particular editor, and I don't have to move my notes into a special database just to keep them organised.

I'm not going to turn this into a Markdown or LaTeX tutorial. There are already good resources that explain both much better than I could in a section of this article. These are the ones I'd point you to:

- [CommonMark: Markdown quick reference](https://commonmark.org/help/)
- [Overleaf: Learn LaTeX in 30 minutes](https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes)

For a quick look at how a Markdown file renders, I use **Glow** in the terminal. If I want a more complete graphical view, I can open the same file in Zettlr or Obsidian.

- [Glow](https://github.com/charmbracelet/glow)
- [Zettlr](https://www.zettlr.com/)
- [Obsidian](https://obsidian.md/)

![A Markdown note in Neovim](/assets/images/thoughts/neovim-university-setup/markdown-in-neovim.png)



## 2. Git and GitHub for my notes

My notes live in files, so keeping them in Git is a natural fit. I use **Git** to track changes and **GitHub** to store a remote copy of my notes repository.

This gives me a history of my work and makes it easier to move between machines. I can update my notes on one device, push the changes to GitHub, and pull them onto another machine when I need them. It also means my notes aren't locked into Neovim: they're still ordinary Markdown and other files that I can open wherever I want.

If you're planning to do the same, think about what you're putting in the repository. I keep private notes and coursework in a private repository. Don't push passwords, API keys, personal information, or material you're not allowed to share.

Useful references:

- [Git documentation](https://git-scm.com/doc)
- [GitHub documentation](https://docs.github.com/)
- [Adding a local repository to GitHub](https://docs.github.com/en/repositories/creating-and-managing-repositories/adding-locally-hosted-code-to-github)

## 3. Quarto: the bread and butter

For assignments, reports, and longer pieces of writing, **Quarto** is probably the most useful part of this workflow.

A Quarto file (`.qmd`) is essentially a Markdown document with a few extra capabilities. It has a YAML header where I can set things like the title, author, output format, and table of contents. The document itself can contain normal Markdown, LaTeX equations, references, figures, and executable code chunks.

The useful part is that I can write the whole thing in Neovim and render it to PDF, HTML, or DOCX when the format-specific tools are installed. I can also put small pieces of Python or other supported code directly into the document. When Quarto renders the file, it can execute those chunks and include their output — tables, plots, and printed results — in the finished document.

There is one distinction to remember: the rendered file is not the same thing as the source. A PDF or DOCX can contain the code and its results, but it doesn't retain the live notebook environment. HTML can include interactive elements when the relevant output format and tools support them. The `.qmd` file remains the editable source, so I can change it and render it again.

I use the Quarto Neovim integration for editing support and code-cell workflows. The Quarto and plugin documentation below explains the tools I use:

- [Quarto website](https://quarto.org/)
- [Quarto documentation](https://quarto.org/docs/)
- [Getting started with a text editor](https://quarto.org/docs/get-started/hello/text-editor)
- [Code execution options](https://quarto.org/docs/computations/execution-options.html)

![A Quarto source file in Neovim](/assets/images/thoughts/neovim-university-setup/quarto-source.png)

![A rendered Quarto document](/assets/images/thoughts/neovim-university-setup/quarto-rendered.png)

## 4. Jupyter notebooks in Neovim

I also work with Jupyter notebooks, especially for Python, data science, and machine learning. You don't have to use the browser interface if you'd rather stay in your editor.

In my setup, **Molten** handles cell execution and displays the output inside Neovim. With image rendering configured, I can inspect plots and other visual results without switching back and forth between the editor and a browser. That's particularly handy when I'm experimenting with data or checking a Matplotlib figure.

There are a few pieces involved: a Python environment, Jupyter and its kernel, Molten, Jupytext, and image-rendering support. I use `uv` to manage the Python environment; the example below creates the project and adds the packages I need:

```bash
mkdir -p ~/Projects/jupyter
cd ~/Projects/jupyter

# Initialise the project (run once)
uv init --bare

# Add the dependencies
uv add pynvim jupyter ipykernel jupytext

# Register the environment as a Jupyter kernel
uv run python -m ipykernel install --user --name jupyter --display-name "Python (Jupyter)"
```

Once the environment and plugins are configured, I can open an `.ipynb` file in Neovim and initialise the kernel with `<leader>mi`.

Molten runs the cells. Jupytext lets me work with notebook content in a text-based format, and my image setup uses ImageMagick with a terminal that supports the configured Sixel backend.

- [Jupyter](https://jupyter.org/)
- [Molten](https://github.com/benlubas/molten-nvim)
- [Jupytext](https://jupytext.readthedocs.io/)
- [Image.nvim](https://github.com/3rd/image.nvim)
- [uv documentation](https://docs.astral.sh/uv/)

## 5. Python environments and packages

A quick note about Python environments, because I use them across my projects, not just for Jupyter.

I prefer **[uv](https://docs.astral.sh/uv/)**. You can absolutely use Python's built-in `venv` and `pip`; they work perfectly well. I just find `uv` faster and easier to manage. Creating an environment and adding packages is straightforward, and `uv` keeps the project dependencies recorded in `pyproject.toml` with a lockfile.

For example, this is how I'd start a small project:

```bash
uv init my-project
cd my-project

# Add dependencies to the project
uv add numpy matplotlib pandas

# Run a script inside the project environment
uv run python main.py
```

That's pretty much why I use it: less environment setup to think about, and a simple way to add or remove packages as a project grows. If you already have a workflow with `venv`, there's no urgent reason to change it. `uv` is just what I reach for.

Useful references:

- [uv documentation](https://docs.astral.sh/uv/)
- [Python `venv` documentation](https://docs.python.org/3/library/venv.html)

## 6. Language servers and programming support

For programming, I want the usual editor features to be there: completion, diagnostics, and formatting. In Neovim, that means setting up the language tooling for the languages I actually use.

My current setup covers:

- Markdown
- Quarto
- Python
- C
- C++
- Fortran

For Python, I use Pyright and Ruff. For Fortran, I have `gfortran` syntax diagnostics configured. `fortls` is installed, but its executable path in my Neovim configuration needs correcting before I can rely on its LSP features.

If you're putting together your own setup, start with the languages you use most. Get the basics working first, then add more tooling when you need it. There is no point installing a pile of language servers for languages you never touch.

A few useful references:

- [Neovim LSP documentation](https://neovim.io/doc/user/lsp.html)
- [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig)
- [Mason](https://github.com/mason-org/mason.nvim)
- [My Neovim configuration](https://github.com/Muhsiinn/dot-files/tree/main/nvim)

## 7. Browsers and document applications

I use **Vivaldi** and **Firefox** as my browsers. Which one you use is really a matter of preference; both fit into my workflow.

For reading PDFs, I have **Zathura** and **Okular**. Zathura is lightweight and keyboard-friendly, while Okular gives me a more traditional graphical PDF viewer. When I need to write on lecture slides, annotate a handout, or work through an exercise by hand, I use **Xournal++**.

I also keep **Zettlr** and **Obsidian** around for working with Markdown in a graphical interface. They can open the same files I edit in Neovim, which is exactly what I want. And for a quick terminal preview, there's Glow.

I don't try to make Neovim replace every application on my machine. It's where I do most of my writing and editing; the other tools handle the jobs they're good at.

- [Vivaldi](https://vivaldi.com/)
- [Firefox](https://www.mozilla.org/firefox/)
- [Zathura](https://pwmt.org/projects/zathura/)
- [Okular](https://okular.kde.org/)
- [Xournal++](https://xournalpp.github.io/)
- [Zettlr](https://www.zettlr.com/)
- [Obsidian](https://obsidian.md/)
- [Glow](https://github.com/charmbracelet/glow)

## 8. Managing TODOs in Neovim

I keep my main TODO list as a Markdown file in my knowledge base and edit it in Neovim. I also have a small shell function in my `~/.bashrc` that opens the file directly:

```bash
KNOWLEDGE_BASE_DIR="${KNOWLEDGE_BASE_DIR:-$HOME/Knowledge}"

todo() {
  nvim "$KNOWLEDGE_BASE_DIR/11_Life/todo.md"
}
```

After adding the function, I reload my shell configuration with `source ~/.bashrc`. From then on, running `todo` takes me straight to the list.

I like keeping tasks in Markdown for the same reason I keep notes in Markdown: it's a normal file. I can link a task to a course note or project, edit it from anywhere, and keep it alongside the rest of my knowledge base.

## 9. Configuration and examples

My public [dotfiles repository](https://github.com/Muhsiinn/dot-files) contains an older snapshot of my Neovim configuration. My local setup has moved on, so some plugin details there may differ from the workflow described here.

So that's my current university workflow. Markdown and LaTeX for notes, GitHub to keep them backed up and in sync, Quarto for proper documents, Molten for Jupyter-style work, and a few dedicated applications for PDFs and handwriting.

The main reason I like it is that everything stays connected without being tied to one application. I can link a lecture note to an assignment, keep code and documents beside the relevant course material, and open the same files in different tools. Once I'm comfortable with the Neovim workflow, it also makes a lot of everyday editing feel quick.

It's not a finished or perfect setup. It's simply the one that works for me right now, and I'll keep adjusting it as I go.

---

*Last updated: 28 November 2026.*
