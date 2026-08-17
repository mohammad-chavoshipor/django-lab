# Django Lab

An interactive slide-based course for learning **Django from zero to professional** — a single-page web application with 81 bilingual (Persian-first) educational slides, live code examples, syntax highlighting, exercises with solutions, and a step-by-step project.

**Live site:** <https://django.mchavoshipor.ir>

## Features

- **81 slides** across 8 sections, from web fundamentals to production deployment
- Live code blocks with **zero-dependency syntax highlighting** (Python, HTML, Bash, SQL, INI)
- One-click **copy** on every code block
- **Exercises** with collapsible suggested solutions
- **Search** across all slides (press `/`)
- **Dark/light theme** toggle, progress bar, TOC sidebar, section jump
- **Print/PDF** friendly output
- **Overview mode** for the full course roadmap (double-click the logo)
- Keyboard navigation: `←`/`→` move, `T` toggles the sidebar, `O` opens overview

## Course outline

| Section | Slides | Topics |
|---|---|---|
| نقشه راه (Roadmap) | 2 | Course path and syllabus |
| مبانی وب (Web Basics) | 8 | HTTP, request/response, status codes, URL & DNS, HTTPS |
| Django پایه (Django Basics) | 10 | Framework, MVT, venv, project/app, manage.py, Django shell |
| مدل و دیتابیس (Models & DB) | 12 | Models, fields & options, migrations, ORM, relations, on_delete, Q/F, Meta |
| View و Template | 10 | Views, inheritance, URL converters, filters, forms, static/media, messages |
| احراز هویت و امنیت (Auth & Security) | 9 | Authentication, permissions, sessions, CSRF, XSS/SQLi, password hashing |
| پروژه عملی (Hands-on Project) | 17 | MiniShop Blog: blog + shop + cart + auth + search + error pages |
| حرفهایسازی (Pro) | 12 | CBVs, pagination, testing, caching, logging, env, Git, deployment, DRF |

## Tech stack

- Plain **HTML/CSS/JavaScript** — no build step, no dependencies, no framework
- Custom lightweight syntax highlighter (`js/highlight.js`)
- Hosted on **GitHub Pages** with a custom domain

## Run locally

```bash
git clone git@github.com:mohammad-chavoshipor/django-lab.git
cd django-lab
python3 -m http.server 8000
# open http://localhost:8000
```

Or open `index.html` directly in a browser.

## Project structure

```
├── index.html            # App shell (layout, controls, scripts)
├── css/styles.css        # All styling (dark/light themes)
└── js/
    ├── app.js            # Slide engine: render, nav, search, theme, print
    ├── highlight.js      # Zero-dependency syntax highlighter
    └── slides/           # Course content, one file per section
        ├── 00-foundations.js
        ├── 01-basics.js
        ├── 02-models.js
        ├── 03-views-templates.js
        ├── 04-auth-security.js
        ├── 05-blog-project.js
        └── 06-advanced.js
```

Each slide file pushes slide objects into `window.SLIDES` using the small helpers (`c`, `callout`, `tbl`, `exercise`, `flow`, `slide`) defined in `00-foundations.js` — adding a slide is just pushing one more entry.

## Deployment

The site is deployed automatically on every push to `main` via GitHub Pages (source: branch `main`, root folder), served under the custom domain `django.mchavoshipor.ir` (CNAME → `mohammad-chavoshipor.github.io`) with HTTPS.

## License

MIT