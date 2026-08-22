(function (global) {
  'use strict';
  const { c, callout, exercise, tbl, flow, slide: s, objectives, lab, checklist, quiz } = global.DL;

  global.SLIDES.push(
    s('استقرار', 'توسعه در مقابل Production', 'سرور <code>runserver</code> برای اینترنت ساخته نشده است.', `
      ${objectives([
        'تنظیمات را از کد جدا کنید و secretها را از environment بخوانید.',
        'روی PostgreSQL مهاجرت کنید.',
        'فایل static را درست جمع‌آوری و سرو کنید.',
        'پروژه را با Gunicorn پشت Nginx و روی HTTPS بالا بیاورید.',
        'پشتیبان‌گیری، لاگ و CI راه بیندازید.',
      ])}
      ${tbl(['موضوع', 'توسعه', 'Production'], [
        ['سرور', '<code>runserver</code> (تک‌رشته‌ای، بدون امنیت)', 'Gunicorn/Uvicorn پشت Nginx'],
        ['<code>DEBUG</code>', '<code>True</code>', '<code>False</code> — بدون استثنا'],
        ['دیتابیس', 'SQLite', 'PostgreSQL'],
        ['فایل static', 'Django سرو می‌کند', 'WhiteNoise یا Nginx یا CDN'],
        ['secret', 'داخل فایل', 'در environment یا vault'],
        ['خطا', 'صفحه کامل traceback', 'صفحه ۵۰۰ ساده + ثبت در log و ابزار رصد'],
        ['ایمیل', 'کنسول', 'SMTP واقعی'],
      ])}
      ${flow(['کد آماده', 'تنظیمات محیط', 'دیتابیس', 'static', 'Gunicorn', 'Nginx + HTTPS'])}
      ${callout('danger', 'یک اشتباه کافی است', 'انتشار با <code>DEBUG=True</code> یعنی افشای <code>SECRET_KEY</code>، رشته اتصال دیتابیس، مسیر فایل‌ها و بخشی از کد شما به هر بازدیدکننده. این رایج‌ترین رخنه امنیتی پروژه‌های Django تازه‌کار است.')}
    `),

    s('استقرار', 'جداسازی تنظیمات از کد', 'یک کد، چند محیط.', `
      ${c('bash', ['pip install django-environ'], 'نصب')}
      ${c('python', [
        '# config/settings.py',
        'from pathlib import Path',
        'import environ',
        '',
        'BASE_DIR = Path(__file__).resolve().parent.parent',
        '',
        'env = environ.Env(',
        '    DEBUG=(bool, False),          # نوع و مقدار پیش‌فرض',
        ')',
        'environ.Env.read_env(BASE_DIR / ".env")',
        '',
        'SECRET_KEY = env("DJANGO_SECRET_KEY")',
        'DEBUG = env("DEBUG")',
        'ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[])',
        'CSRF_TRUSTED_ORIGINS = env.list("CSRF_TRUSTED_ORIGINS", default=[])',
        '',
        'DATABASES = {"default": env.db("DATABASE_URL", default=f"sqlite:///{BASE_DIR}/db.sqlite3")}',
        '',
        'if not DEBUG:',
        '    SECURE_SSL_REDIRECT = True',
        '    SECURE_HSTS_SECONDS = 31536000',
        '    SECURE_HSTS_INCLUDE_SUBDOMAINS = True',
        '    SECURE_HSTS_PRELOAD = True',
        '    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")',
        '    SESSION_COOKIE_SECURE = True',
        '    CSRF_COOKIE_SECURE = True',
        '    SECURE_CONTENT_TYPE_NOSNIFF = True',
        '    X_FRAME_OPTIONS = "DENY"',
      ], 'settings مبتنی بر محیط')}
      ${c('ini', [
        '# .env — هرگز commit نشود',
        'DJANGO_SECRET_KEY=یک-کلید-تصادفی-طولانی',
        'DEBUG=False',
        'ALLOWED_HOSTS=example.com,www.example.com',
        'CSRF_TRUSTED_ORIGINS=https://example.com,https://www.example.com',
        'DATABASE_URL=postgres://minishop:PASSWORD@localhost:5432/minishop',
      ], '.env')}
      ${c('ini', [
        '# .env.example — این یکی commit می‌شود، بدون مقدار واقعی',
        'DJANGO_SECRET_KEY=',
        'DEBUG=True',
        'ALLOWED_HOSTS=127.0.0.1,localhost',
        'DATABASE_URL=',
      ], '.env.example')}
      ${c('bash', [
        '# ساخت SECRET_KEY جدید',
        'python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"',
      ], 'تولید کلید امن')}
      ${callout('tip', 'چرا .env.example؟', 'هم‌تیمی جدید با یک نگاه می‌فهمد چه متغیرهایی لازم است، بدون اینکه مقدار محرمانه‌ای فاش شود. این فایل بخشی از مستندات پروژه است.')}
    `),

    s('استقرار', 'مهاجرت به PostgreSQL', 'SQLite برای توسعه عالی است؛ برای production نه.', `
      ${tbl(['محدودیت SQLite', 'اثر در production'], [
        'نوشتن هم‌زمان محدود|با ترافیک بالا خطای <code>database is locked</code>',
        'بدون کاربر و دسترسی|امنیت در سطح فایل',
        'نبود امکانات پیشرفته|بدون جست‌وجوی متن کامل، JSON پیشرفته و ایندکس‌های خاص',
        'پشتیبان‌گیری فایل‌محور|بازیابی نقطه‌ای دشوار',
      ].map(row => row.split('|')))}
      ${lab('راه‌اندازی PostgreSQL', 'زمان: ۲۰ دقیقه', [
        { do: c('bash', [
            '# نصب روی اوبونتو',
            'sudo apt update && sudo apt install postgresql postgresql-contrib libpq-dev',
          ], 'نصب سرور') },
        { do: c('sql', [
            'CREATE DATABASE minishop;',
            "CREATE USER minishop WITH PASSWORD 'a-strong-password';",
            'ALTER ROLE minishop SET client_encoding TO "utf8";',
            "ALTER ROLE minishop SET default_transaction_isolation TO 'read committed';",
            "ALTER ROLE minishop SET timezone TO 'Asia/Tehran';",
            'GRANT ALL PRIVILEGES ON DATABASE minishop TO minishop;',
          ], 'ساخت دیتابیس و کاربر') },
        { do: c('bash', ['pip install "psycopg[binary]"', 'pip freeze > requirements.txt'], 'درایور Python') },
        { do: c('ini', ['DATABASE_URL=postgres://minishop:a-strong-password@localhost:5432/minishop'], 'به‌روزرسانی .env') },
        { do: c('bash', ['python manage.py migrate', 'python manage.py createsuperuser'], 'ساخت جدول‌ها'), why: 'migrationها روی هر دیتابیسی همان ساختار را می‌سازند؛ به همین دلیل نگهداری‌شان در git مهم بود.' },
      ], '<p><code>python manage.py dbshell</code> باید وارد کنسول PostgreSQL شود و دستور <code>\\\\dt</code> جدول‌های پروژه را نشان دهد.</p>')}
      ${c('bash', [
        '# انتقال داده از SQLite به PostgreSQL (اختیاری)',
        '# ۱) با تنظیمات SQLite:',
        'python manage.py dumpdata --natural-foreign --natural-primary \\',
        '  --exclude contenttypes --exclude auth.Permission --indent 2 > data.json',
        '# ۲) DATABASE_URL را به postgres تغییر دهید، سپس:',
        'python manage.py migrate',
        'python manage.py loaddata data.json',
      ], 'انتقال داده موجود')}
    `),

    s('استقرار', 'فایل static در production', 'رایج‌ترین جایی که سایت «بدون استایل» بالا می‌آید.', `
      <p>با <code>DEBUG=False</code> دیگر Django فایل static را سرو نمی‌کند. باید همه فایل‌ها را یک‌جا جمع کنید و یک سرو‌کننده واقعی به آن‌ها پاسخ دهد.</p>
      ${c('bash', ['pip install whitenoise'], 'ساده‌ترین راه: WhiteNoise')}
      ${c('python', [
        '# config/settings.py',
        'MIDDLEWARE = [',
        '    "django.middleware.security.SecurityMiddleware",',
        '    "whitenoise.middleware.WhiteNoiseMiddleware",     # ← بلافاصله بعد از security',
        '    # ... بقیه',
        ']',
        '',
        'STATIC_URL = "static/"',
        'STATICFILES_DIRS = [BASE_DIR / "static"]',
        'STATIC_ROOT = BASE_DIR / "staticfiles"',
        '',
        'STORAGES = {',
        '    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},',
        '    "staticfiles": {',
        '        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",',
        '    },',
        '}',
      ], 'تنظیم WhiteNoise')}
      ${c('bash', [
        'python manage.py collectstatic --noinput',
        '# همه فایل‌های static اپ‌ها و STATICFILES_DIRS در staticfiles/ جمع می‌شوند',
      ], 'جمع‌آوری')}
      ${tbl(['خطا', 'علت', 'رفع'], [
        ['<code>You are using the staticfiles app without having set STATIC_ROOT</code>', '<code>STATIC_ROOT</code> تعریف نشده.', 'آن را در settings اضافه کنید.'],
        ['سایت بدون CSS بالا می‌آید', '<code>collectstatic</code> اجرا نشده.', 'اجرا کنید و سرویس را ری‌استارت کنید.'],
        ['<code>Missing staticfiles manifest entry</code>', 'فایلی در قالب هست ولی در <code>staticfiles/</code> نیست.', 'نام فایل را بررسی و دوباره <code>collectstatic</code>.'],
        ['تصاویر آپلودی ۴۰۴', 'media با WhiteNoise سرو نمی‌شود.', 'Nginx یا فضای ابری برای media.'],
      ])}
      ${callout('warn', 'static و media یکی نیستند', 'WhiteNoise فقط static را سرو می‌کند. فایل‌های آپلودی کاربر (<code>MEDIA_ROOT</code>) باید توسط Nginx یا یک سرویس ذخیره‌سازی (S3 یا معادل داخلی) سرو شوند.')}
    `),

    s('استقرار', 'اجرای برنامه با Gunicorn', 'یک process manager واقعی به‌جای runserver.', `
      ${c('bash', [
        'pip install gunicorn',
        '',
        '# آزمایش دستی',
        'gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3',
      ], 'نصب و آزمایش')}
      ${c('ini', [
        '# /etc/systemd/system/minishop.service',
        '[Unit]',
        'Description=MiniShop Gunicorn daemon',
        'After=network.target',
        '',
        '[Service]',
        'User=www-data',
        'Group=www-data',
        'WorkingDirectory=/srv/minishop',
        'EnvironmentFile=/srv/minishop/.env',
        'ExecStart=/srv/minishop/.venv/bin/gunicorn \\',
        '          --workers 3 \\',
        '          --bind unix:/run/minishop.sock \\',
        '          config.wsgi:application',
        'Restart=always',
        '',
        '[Install]',
        'WantedBy=multi-user.target',
      ], 'سرویس systemd')}
      ${c('bash', [
        'sudo systemctl daemon-reload',
        'sudo systemctl enable --now minishop',
        'sudo systemctl status minishop',
        'sudo journalctl -u minishop -f          # دیدن لاگ زنده',
      ], 'مدیریت سرویس')}
      ${tbl(['گزینه Gunicorn', 'توضیح'], [
        ['<code>--workers</code>', 'معمولا <code>۲ × تعداد هسته + ۱</code>.'],
        ['<code>--bind unix:/run/app.sock</code>', 'ارتباط با Nginx از طریق socket، سریع‌تر از TCP.'],
        ['<code>--timeout 60</code>', 'کشتن worker گیرکرده.'],
        ['<code>--access-logfile -</code>', 'ارسال لاگ به خروجی استاندارد (برای journald یا Docker).'],
      ])}
      ${callout('info', 'WSGI یا ASGI؟', 'اگر پروژه شما همه‌جا همگام (sync) است، Gunicorn با WSGI کافی است. اگر WebSocket یا view‌های <code>async</code> دارید، از Uvicorn با <code>config.asgi:application</code> استفاده کنید.')}
    `),

    s('استقرار', 'Nginx و HTTPS', 'دروازه ورودی سایت.', `
      ${c('ini', [
        '# /etc/nginx/sites-available/minishop',
        'server {',
        '    listen 80;',
        '    server_name example.com www.example.com;',
        '    client_max_body_size 10M;      # حداکثر حجم آپلود',
        '',
        '    location /static/ {',
        '        alias /srv/minishop/staticfiles/;',
        '        expires 30d;',
        '    }',
        '',
        '    location /media/ {',
        '        alias /srv/minishop/media/;',
        '        expires 7d;',
        '    }',
        '',
        '    location / {',
        '        proxy_pass http://unix:/run/minishop.sock;',
        '        proxy_set_header Host $host;',
        '        proxy_set_header X-Real-IP $remote_addr;',
        '        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;',
        '        proxy_set_header X-Forwarded-Proto $scheme;',
        '    }',
        '}',
      ], 'پیکربندی Nginx')}
      ${c('bash', [
        'sudo ln -s /etc/nginx/sites-available/minishop /etc/nginx/sites-enabled/',
        'sudo nginx -t              # بررسی صحت پیکربندی',
        'sudo systemctl reload nginx',
        '',
        '# گواهی رایگان HTTPS',
        'sudo apt install certbot python3-certbot-nginx',
        'sudo certbot --nginx -d example.com -d www.example.com',
        '# certbot خودش تنظیمات SSL و تمدید خودکار را اضافه می‌کند',
      ], 'فعال‌سازی و گواهی')}
      ${callout('danger', 'X-Forwarded-Proto را جدی بگیرید', 'بدون <code>proxy_set_header X-Forwarded-Proto $scheme;</code> در Nginx و <code>SECURE_PROXY_SSL_HEADER</code> در Django، برنامه فکر می‌کند درخواست HTTP است. نتیجه: حلقه بی‌نهایت redirect وقتی <code>SECURE_SSL_REDIRECT=True</code> باشد.')}
      ${quiz('بعد از فعال‌کردن HTTPS، سایت در حلقه بی‌نهایت redirect می‌افتد. محتمل‌ترین علت؟', [
        'گواهی SSL نامعتبر است.',
        'Django هدر <code>X-Forwarded-Proto</code> را نمی‌شناسد و هر درخواست را HTTP می‌بیند، پس دوباره به HTTPS ریدایرکت می‌کند.',
        'دیتابیس در دسترس نیست.',
      ], 1, 'رفع: هم Nginx هدر را بفرستد و هم Django با <code>SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")</code> به آن اعتماد کند.')}
    `),

    s('استقرار', 'چک‌لیست انتشار', 'قبل از هر deploy، خط به خط.', `
      ${c('bash', [
        '# ۱) بررسی خودکار Django',
        'python manage.py check --deploy',
        '',
        '# ۲) تست‌ها',
        'python manage.py test',
        '',
        '# ۳) وابستگی‌ها',
        'pip install -r requirements.txt',
        '',
        '# ۴) دیتابیس',
        'python manage.py migrate --noinput',
        '',
        '# ۵) فایل static',
        'python manage.py collectstatic --noinput',
        '',
        '# ۶) ری‌استارت سرویس',
        'sudo systemctl restart minishop',
      ], 'ترتیب استاندارد deploy')}
      ${checklist('قبل از انتشار', [
        '<code>DEBUG=False</code> و <code>ALLOWED_HOSTS</code> دقیق تنظیم شده.',
        '<code>SECRET_KEY</code> جدید و فقط در environment است.',
        'فایل <code>.env</code> در <code>.gitignore</code> است و در تاریخچه git نیست.',
        'دیتابیس PostgreSQL است و پشتیبان‌گیری خودکار دارد.',
        '<code>collectstatic</code> اجرا شده و سایت استایل دارد.',
        'HTTPS فعال و <code>SECURE_SSL_REDIRECT</code> روشن است.',
        'قالب‌های <code>404.html</code>، <code>403.html</code> و <code>500.html</code> وجود دارند.',
        'لاگ به فایل یا سرویس رصد می‌رود و خطاها گم نمی‌شوند.',
        'همه تست‌ها سبز هستند.',
        '<code>python manage.py check --deploy</code> بدون هشدار جدی است.',
      ])}
      ${callout('warn', 'ترتیب مهم است', 'همیشه <code>migrate</code> قبل از ری‌استارت سرویس اجرا شود؛ وگرنه کد جدید با ساختار قدیمی دیتابیس بالا می‌آید و خطای ستون ناموجود می‌گیرید.')}
    `),

    s('استقرار', 'پشتیبان‌گیری، لاگ و رصد', 'سایتی که پشتیبان ندارد، هنوز منتشر نشده است.', `
      ${c('bash', [
        '#!/usr/bin/env bash',
        '# /srv/minishop/backup.sh',
        'set -euo pipefail',
        '',
        'STAMP=$(date +%F-%H%M)',
        'DEST=/var/backups/minishop',
        'mkdir -p "$DEST"',
        '',
        '# دیتابیس',
        'pg_dump -U minishop minishop | gzip > "$DEST/db-$STAMP.sql.gz"',
        '',
        '# فایل‌های آپلودی',
        'tar -czf "$DEST/media-$STAMP.tar.gz" -C /srv/minishop media',
        '',
        '# نگه‌داشتن ۱۴ نسخه آخر',
        'find "$DEST" -type f -mtime +14 -delete',
      ], 'اسکریپت پشتیبان')}
      ${c('bash', [
        '# اجرای روزانه ساعت ۳ بامداد',
        'crontab -e',
        '0 3 * * * /srv/minishop/backup.sh >> /var/log/minishop-backup.log 2>&1',
      ], 'زمان‌بندی')}
      ${c('python', [
        '# config/settings.py — ارسال خطاها به مدیر',
        'ADMINS = [("Admin", "admin@example.com")]',
        'SERVER_EMAIL = "server@example.com"',
        '',
        'LOGGING = {',
        '    "version": 1,',
        '    "disable_existing_loggers": False,',
        '    "handlers": {',
        '        "file": {',
        '            "level": "INFO",',
        '            "class": "logging.handlers.RotatingFileHandler",',
        '            "filename": "/var/log/minishop/app.log",',
        '            "maxBytes": 10 * 1024 * 1024,',
        '            "backupCount": 5,',
        '        },',
        '        "mail_admins": {',
        '            "level": "ERROR",',
        '            "class": "django.utils.log.AdminEmailHandler",',
        '        },',
        '    },',
        '    "root": {"handlers": ["file"], "level": "INFO"},',
        '    "loggers": {',
        '        "django.request": {"handlers": ["file", "mail_admins"], "level": "ERROR"},',
        '    },',
        '}',
      ], 'لاگ چرخشی و ایمیل خطا')}
      ${callout('danger', 'پشتیبان آزمایش‌نشده، پشتیبان نیست', 'حداقل یک بار فایل پشتیبان را روی یک دیتابیس خالی بازیابی کنید و مطمئن شوید کار می‌کند. بسیاری تازه هنگام فاجعه می‌فهمند فایل‌های پشتیبانشان خالی بوده است.')}
      ${callout('tip', 'رصد خطا', 'برای پروژه‌های جدی از یک سرویس رصد خطا (مثل Sentry یا نمونه self-hosted آن) استفاده کنید تا هر استثنا با traceback و context کامل ثبت شود — خیلی بهتر از گشتن در فایل لاگ.')}
    `),

    s('استقرار', 'Docker (اختیاری ولی مفید)', 'یک تصویر، همه‌جا یکسان اجرا می‌شود.', `
      ${c('ini', [
        '# Dockerfile',
        'FROM python:3.12-slim',
        '',
        'ENV PYTHONDONTWRITEBYTECODE=1 \\',
        '    PYTHONUNBUFFERED=1',
        '',
        'WORKDIR /app',
        '',
        'RUN apt-get update && apt-get install -y --no-install-recommends \\',
        '    libpq-dev gcc && rm -rf /var/lib/apt/lists/*',
        '',
        'COPY requirements.txt .',
        'RUN pip install --no-cache-dir -r requirements.txt',
        '',
        'COPY . .',
        '',
        'RUN python manage.py collectstatic --noinput',
        '',
        'CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]',
      ], 'Dockerfile')}
      ${c('ini', [
        '# compose.yaml',
        'services:',
        '  db:',
        '    image: postgres:16',
        '    environment:',
        '      POSTGRES_DB: minishop',
        '      POSTGRES_USER: minishop',
        '      POSTGRES_PASSWORD: ${DB_PASSWORD}',
        '    volumes:',
        '      - pgdata:/var/lib/postgresql/data',
        '',
        '  web:',
        '    build: .',
        '    env_file: .env',
        '    depends_on:',
        '      - db',
        '    ports:',
        '      - "8000:8000"',
        '    volumes:',
        '      - media:/app/media',
        '',
        'volumes:',
        '  pgdata:',
        '  media:',
      ], 'compose.yaml')}
      ${c('bash', [
        'docker compose up --build -d',
        'docker compose exec web python manage.py migrate',
        'docker compose exec web python manage.py createsuperuser',
        'docker compose logs -f web',
      ], 'اجرا')}
      ${callout('warn', 'دو نکته Docker', 'یک: <code>.env</code> و <code>.venv</code> را در <code>.dockerignore</code> بگذارید. دو: داده دیتابیس و media باید در volume باشند، وگرنه با هر بازسازی کانتینر پاک می‌شوند.')}
    `),

    s('استقرار', 'CI: تست خودکار روی هر push', 'کاری که یک بار تنظیم می‌شود و همیشه کار می‌کند.', `
      ${c('ini', [
        '# .github/workflows/ci.yml',
        'name: CI',
        '',
        'on:',
        '  push:',
        '    branches: [main]',
        '  pull_request:',
        '',
        'jobs:',
        '  test:',
        '    runs-on: ubuntu-latest',
        '',
        '    services:',
        '      postgres:',
        '        image: postgres:16',
        '        env:',
        '          POSTGRES_DB: test_db',
        '          POSTGRES_USER: postgres',
        '          POSTGRES_PASSWORD: postgres',
        '        ports: ["5432:5432"]',
        '        options: >-',
        '          --health-cmd pg_isready --health-interval 10s --health-retries 5',
        '',
        '    env:',
        '      DJANGO_SECRET_KEY: test-key-not-secret',
        '      DEBUG: "False"',
        '      ALLOWED_HOSTS: localhost',
        '      DATABASE_URL: postgres://postgres:postgres@localhost:5432/test_db',
        '',
        '    steps:',
        '      - uses: actions/checkout@v4',
        '',
        '      - uses: actions/setup-python@v5',
        '        with:',
        '          python-version: "3.12"',
        '          cache: pip',
        '',
        '      - run: pip install -r requirements.txt',
        '',
        '      - run: python manage.py check --deploy --fail-level WARNING',
        '',
        '      - run: python manage.py migrate --noinput',
        '',
        '      - run: python manage.py test --parallel',
      ], 'GitHub Actions')}
      ${tbl(['مرحله CI', 'چه چیزی را می‌گیرد'], [
        ['<code>check --deploy</code>', 'تنظیمات ناامن قبل از رسیدن به سرور.'],
        ['<code>migrate</code>', 'migration خراب یا جاافتاده.'],
        ['<code>test</code>', 'شکستن رفتار موجود.'],
        ['<code>ruff</code> یا <code>flake8</code>', 'خطاهای سبکی و import بلااستفاده.'],
      ])}
      ${callout('tip', 'قدم بعدی: deploy خودکار', 'وقتی CI سبز است، می‌توانید مرحله‌ای اضافه کنید که با SSH روی سرور <code>git pull</code>، <code>migrate</code>، <code>collectstatic</code> و ری‌استارت سرویس را اجرا کند. ولی اول مطمئن شوید تست‌هایتان واقعا قابل اتکا هستند.')}
    `),

    s('استقرار', 'نقطه کنترل استقرار', 'سایت شما روی اینترنت است — حالا بررسی کنید.', `
      ${checklist('روی سایت منتشرشده آزمایش کنید', [
        'آدرس <code>http://</code> خودکار به <code>https://</code> منتقل می‌شود.',
        'صفحه اصلی با استایل کامل بالا می‌آید.',
        'تصویر آپلودشده از admin در صفحه عمومی دیده می‌شود.',
        'یک آدرس اشتباه، صفحه ۴۰۴ اختصاصی شما را می‌دهد نه صفحه Django.',
        'ورود، ثبت‌نام و افزودن به سبد کار می‌کند.',
        'در <code>journalctl -u minishop</code> خطای تکراری نیست.',
        'فایل پشتیبان امروز در مسیر backup وجود دارد.',
        '<code>curl -I https://example.com</code> هدرهای امنیتی HSTS را نشان می‌دهد.',
      ])}
      ${exercise('اولین استقرار واقعی', 'چالشی', `
        <p>پروژه MiniShop خود را روی یک سرور واقعی یا یک سرویس رایگان منتشر کنید و این‌ها را تحویل دهید:</p>
        <ol>
          <li>آدرس سایت زنده با HTTPS فعال.</li>
          <li>خروجی <code>python manage.py check --deploy</code> بدون هشدار جدی.</li>
          <li>فایل <code>.env.example</code> در مخزن.</li>
          <li>یک فایل <code>DEPLOY.md</code> که مراحل انتشار را برای نفر بعدی توضیح می‌دهد.</li>
        </ol>`,
        '<p>اگر سرور اختصاصی ندارید، سرویس‌هایی مثل Railway، Render یا Liara همین مسیر را با تنظیمات کمتر فراهم می‌کنند: مخزن را وصل می‌کنید، متغیرهای محیطی را می‌گذارید و دستور <code>gunicorn config.wsgi</code> را به‌عنوان فرمان اجرا معرفی می‌کنید. مفاهیم دقیقا همین‌هاست، فقط زیرساخت مدیریت‌شده است.</p>')}
    `)
  );
})(window);
