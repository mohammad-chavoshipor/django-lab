# Django Lab

An interactive slide-based course for learning **Django from zero to production** — a single-page web application with **153 Persian-language slides**, live code examples, syntax highlighting, guided labs with checkpoints, graded exercises with solutions, self-check quizzes, and a full step-by-step real-world project.

**Live site:** <https://django.mchavoshipor.ir>

## Features

- **153 slides** across 14 sections, from HTTP fundamentals to a deployed HTTPS site
- **Guided labs** — numbered steps, a "why" note per step, and a verification checkpoint before moving on
- **44 exercises** with collapsible suggested solutions, graded آسان / متوسط / چالشی
- **14 self-check quizzes** with instant feedback and an explanation of *why*
- **14 section checkpoints** so learners can verify progress on their own machine
- **282 live code blocks** with zero-dependency syntax highlighting (Python, HTML/DTL, Bash, SQL, INI, JS)
- One-click **copy** on every code block
- **Search** across all slides (press `/`), **dark/light theme**, progress bar, TOC sidebar, section jump
- **Print/PDF export** of the entire deck (solutions and quiz explanations expanded)
- **Overview mode** for the full course roadmap (double-click the logo)
- Keyboard navigation: `←`/`→` move, `T` toggles the sidebar, `O` opens overview, `/` focuses search

## Course outline

| # | Section | Slides | Topics |
|---|---|---|---|
| — | نقشه راه | 3 | Course path, syllabus, how to study, tooling prerequisites |
| 0 | مبانی وب | 11 | HTTP, request/response, methods, status codes, URL & DNS, HTTPS, cookies & state, JSON/API, browser DevTools |
| 1 | پیش‌نیازها | 13 | Python (types, control flow, classes, modules, decorators), venv/pip/requirements, CLI, HTML & forms, relational DB, minimal SQL |
| 2 | Django پایه | 12 | Framework vs library, MVT, project/app, `settings.py` deep-dive, URLs & views, request cycle, `manage.py`, shell, **first test** |
| 3 | مدل و دیتابیس | 13 | Models, field types & options, migrations, relations, `on_delete`, `Meta`, model methods & `save()`, model-level validation & constraints, **custom user model**, admin |
| 4 | ORM و کوئری | 11 | CRUD, QuerySet laziness, field lookups, `get`/`filter`/`first`, `Q`/`F`, `aggregate`/`annotate`, **N+1 & select/prefetch_related**, custom managers, transactions, fixtures & seed commands |
| 5 | View و Template | 12 | Views, inheritance, `include`/partials, named URLs & namespaces, converters & pattern order, tags & filters, **custom template tags**, **context processors**, static/media, responses, messages |
| 6 | فرم و اعتبارسنجی | 8 | Why forms, `Form` vs `ModelForm`, the GET/POST/PRG cycle, custom `clean()`, rendering, **file uploads**, formsets |
| 7 | احراز هویت و امنیت | 13 | Auth vs authz, login/logout, signup, **password reset**, protecting views, permissions & groups, sessions & cookies, CSRF, XSS & SQLi, password hashing, **OWASP-mapped production checklist** |
| 8 | خطایابی | 8 | Reading tracebacks, the Django error page, **15 common errors**, Django Debug Toolbar, logging, systematic debugging with `breakpoint()` |
| 9 | پروژه عملی | 17 | **MiniShop Blog**, built step by step: custom user, blog + comments, shop, session cart, transactional checkout, accounts, error pages, tests |
| 10 | حرفه‌ای‌سازی | 11 | CBVs, pagination, cache, performance, signals & background jobs, advanced testing & coverage, Git, **i18n & Jalali dates**, DRF |
| 11 | استقرار | 11 | Env-based settings, PostgreSQL, static in production, Gunicorn + systemd, Nginx + HTTPS, release checklist, backups & logging, Docker, CI |
| 12 | کارگاه تمرین | 10 | 30-day plan, 5 levels of graded exercises, debugging challenges, **capstone project** and grading rubric |

## The hands-on project: MiniShop Blog

Sections 9 builds one complete, deployable Django site — not code snippets:

- `accounts` — custom user model from day one, signup, login, dashboard
- `blog` — categories, posts with a custom `QuerySet`, comments with moderation, search, pagination
- `shop` — products, a session-backed `Cart` class, `Order`/`OrderItem`, and a **transactional checkout** that decrements stock atomically with `F()` expressions
- Ownership checks on every edit/delete path, custom `404`/`403`/`500` pages, a `seed` management command, and a test suite covering access control and business logic

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
├── css/styles.css        # All styling (dark/light themes, print)
└── js/
    ├── app.js            # Slide engine: render, nav, search, quiz, theme, print
    ├── highlight.js      # Zero-dependency syntax highlighter
    └── slides/           # Course content, one file per section
        ├── 00-helpers.js         # Authoring helpers (global.DL)
        ├── 00-foundations.js     # Roadmap + web fundamentals
        ├── 01-prereqs.js         # Python / HTML / DB prerequisites
        ├── 02-basics.js          # Django basics
        ├── 03-models.js          # Models & database
        ├── 04-orm.js             # ORM & queries
        ├── 05-views-templates.js # Views & templates
        ├── 06-forms.js           # Forms & validation
        ├── 07-auth-security.js   # Auth & security
        ├── 08-debugging.js       # Debugging & tooling
        ├── 09-project.js         # Hands-on project
        ├── 10-advanced.js        # Going professional
        ├── 11-deploy.js          # Deployment
        └── 12-workbook.js        # Exercise workbook & capstone
```

## Authoring a slide

Every content file destructures the helpers from `window.DL` (defined in `00-helpers.js`) and pushes onto `window.SLIDES`. Adding a slide is pushing one more entry.

| Helper | Renders |
|---|---|
| `c(lang, lines, title)` | Highlighted code block with a copy button |
| `callout(type, title, text)` | `info` / `tip` / `warn` / `danger` note |
| `tbl(headers, rows)` | Responsive table |
| `flow(items)` | RTL step diagram |
| `objectives(items)` | "By the end of this section you can…" list |
| `lab(title, meta, steps, checkpoint)` | Guided lab: numbered steps, optional `why` per step, verification checkpoint |
| `checklist(title, items)` | Self-verification checklist |
| `quiz(question, options, answerIndex, explain)` | Interactive multiple-choice with explanation |
| `exercise(title, difficulty, body, solution)` | Exercise with a revealable solution |
| `slide(section, title, subtitle, body, level)` | The slide object itself |

Slides of the same `section` must stay contiguous — the TOC, section jump and overview all group by section in slide order.

## Deployment

The site is deployed automatically on every push to `main` via GitHub Pages (source: branch `main`, root folder), served under the custom domain `django.mchavoshipor.ir` (CNAME → `mohammad-chavoshipor.github.io`) with HTTPS.

## License

MIT
