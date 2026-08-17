(function (global) {
  'use strict';
  const { c, callout, exercise, tbl, flow, slide: s } = global.DL;

  global.SLIDES.push(
    s('Django پایه', 'Framework چیست؟', 'Framework مجموعه‌ای از قوانین، ابزارها و قطعات آماده برای ساخت سریع‌تر و منظم‌تر نرم‌افزار است.', `
      <p>وقتی بدون framework کار می‌کنید، باید routing، اتصال دیتابیس، امنیت فرم‌ها، session، ساخت HTML، مدیریت فایل و ده‌ها کار تکراری را خودتان طراحی کنید. Framework این قطعات را با معماری مشخص آماده می‌کند.</p>
      ${tbl(['بدون Framework', 'با Framework'], [
        ['هر پروژه ساختار متفاوتی دارد.', 'ساختار استاندارد و قابل فهم برای تیم.'],
        ['امنیت و validation ممکن است فراموش شود.', 'قابلیت‌های امنیتی و validation آماده.'],
        ['توسعه کندتر و پرریسک‌تر است.', 'تمرکز روی منطق کسب‌وکار.'],
      ])}
      ${callout('tip', 'تعریف عملی', 'Framework به شما می‌گوید کد را کجا بنویسید و بسیاری از کارهای تکراری وب را برایتان انجام می‌دهد.')}
    `),

    s('Django پایه', 'Django چیست؟', 'Django یک web framework سطح بالا برای Python است که ساخت وب‌اپلیکیشن امن و قابل نگهداری را سریع می‌کند.', `
      <p>Django اصطلاحا «batteries included» است؛ یعنی بسیاری از نیازهای رایج وب را در خودش دارد: ORM، migration، admin، template engine، form، authentication، session، middleware و ابزارهای امنیتی.</p>
      ${tbl(['قابلیت', 'کاربرد'], [
        ['URL dispatcher', 'وصل کردن آدرس‌ها به viewها.'],
        ['Views', 'اجرای منطق request و ساخت response.'],
        ['Models/ORM', 'تعریف جدول‌ها با کلاس Python و query بدون SQL خام.'],
        ['Templates', 'ساخت HTML پویا.'],
        ['Admin', 'پنل مدیریت آماده برای داده‌ها.'],
        ['Middleware', 'پردازش request/response در لایه‌های عمومی.'],
      ])}
    `),

    s('Django پایه', 'معماری MVT در Django', 'Django به جای MVC رایج، از الگوی Model-View-Template استفاده می‌کند.', `
      <ul>
        <li><strong>Model:</strong> شکل داده و رابطه با دیتابیس را تعریف می‌کند.</li>
        <li><strong>View:</strong> request را می‌گیرد، منطق را اجرا می‌کند و response می‌سازد.</li>
        <li><strong>Template:</strong> ظاهر HTML را با داده‌های view ترکیب می‌کند.</li>
      </ul>
      ${flow(['URL', 'View', 'Model/Service', 'Template', 'Response'])}
      ${callout('info', 'نام‌گذاری مهم', 'در Django، View همان controller عملی است؛ Template نقش لایه نمایش را دارد.')}
    `),

    s('Django پایه', 'راه‌اندازی محیط توسعه', 'پروژه Django باید در محیط مجازی جداگانه ساخته شود.', `
      <p>محیط مجازی باعث می‌شود dependencyهای هر پروژه جدا بماند. این کار از conflict نسخه‌ها جلوگیری می‌کند و deployment را قابل تکرار می‌کند.</p>
      ${c('bash', [
        'mkdir django_lab_project',
        'cd django_lab_project',
        'python3 -m venv .venv',
        'source .venv/bin/activate',
        'python -m pip install --upgrade pip',
        'pip install django'
      ], 'ساخت venv و نصب Django')}
      ${exercise('بررسی نصب', 'آسان', '<p>بعد از نصب، نسخه Django را از ترمینال بگیرید.</p>', c('bash', 'python -m django --version', 'دستور'))}
    `),

    s('Django پایه', 'ساخت Project و App', 'Project تنظیمات کل سایت است؛ App یک بخش مستقل از قابلیت‌هاست.', `
      ${c('bash', [
        'django-admin startproject config .',
        'python manage.py startapp blog',
        'python manage.py runserver'
      ], 'ساخت پروژه')}
      <p>بعد از ساخت app باید آن را در <code>INSTALLED_APPS</code> ثبت کنیم تا Django مدل‌ها، templateها، admin و migrationهای آن را بشناسد.</p>
      ${c('python', [
        '# config/settings.py',
        'INSTALLED_APPS = [',
        '    "django.contrib.admin",',
        '    "django.contrib.auth",',
        '    "django.contrib.contenttypes",',
        '    "django.contrib.sessions",',
        '    "django.contrib.messages",',
        '    "django.contrib.staticfiles",',
        '    "blog",',
        ']'
      ], 'ثبت app')}
      ${callout('info', 'فایل settings.py', '<code>SECRET_KEY</code> امضای امن پروژه است و نباید فاش شود، <code>DEBUG</code> فقط در توسعه True باشد و <code>DATABASES</code> نوع و آدرس دیتابیس را مشخص می‌کند.')}
    `),

    s('Django پایه', 'ساختار فایل‌های مهم', 'شناخت فایل‌ها جلوی سردرگمی ابتدای کار را می‌گیرد.', `
      ${tbl(['فایل/پوشه', 'نقش'], [
        ['<code>manage.py</code>', 'اجرای commandهای پروژه مثل runserver و migrate.'],
        ['<code>config/settings.py</code>', 'تنظیمات پروژه، دیتابیس، زبان، static و appها.'],
        ['<code>config/urls.py</code>', 'جدول آدرس‌های اصلی پروژه.'],
        ['<code>blog/models.py</code>', 'تعریف مدل‌های app.'],
        ['<code>blog/views.py</code>', 'تابع‌ها یا کلاس‌های پاسخ‌دهنده به request.'],
        ['<code>blog/admin.py</code>', 'ثبت مدل‌ها در پنل مدیریت.'],
      ])}
      ${callout('warn', 'اشتباه رایج', 'همه کدها را داخل config ننویسید. قابلیت‌های قابل تفکیک مثل blog، shop و accounts باید app جدا داشته باشند.')}
    `),

    s('Django پایه', 'اولین URL و View', 'URL الگوی آدرس را به view وصل می‌کند.', `
      ${c('python', [
        '# blog/views.py',
        'from django.http import HttpResponse',
        '',
        'def home(request):',
        '    return HttpResponse("سلام، اولین صفحه جنگو")'
      ], 'blog/views.py')}
      ${c('python', [
        '# blog/urls.py',
        'from django.urls import path',
        'from . import views',
        '',
        'urlpatterns = [',
        '    path("", views.home, name="home"),',
        ']'
      ], 'blog/urls.py')}
      ${c('python', [
        '# config/urls.py',
        'from django.contrib import admin',
        'from django.urls import include, path',
        '',
        'urlpatterns = [',
        '    path("admin/", admin.site.urls),',
        '    path("", include("blog.urls")),',
        ']'
      ], 'config/urls.py')}
    `),

    s('Django پایه', 'ساختار request در Django', 'از request تا response یک مسیر مشخص وجود دارد.', `
      <p>هر request وارد پروژه می‌شود، از middlewareها عبور می‌کند، با الگوهای <code>urls.py</code> تطبیق داده می‌شود، view اجرا می‌شود و response از همان مسیر به مرورگر برمی‌گردد.</p>
      ${flow(['Request', 'Middleware', 'URL Resolver', 'View', 'Template/Model', 'Response'])}
      ${tbl(['لایه', 'نقش'], [
        ['<code>Middleware</code>', 'پردازش عمومی request/response: session، CSRF، امنیت و فشرده‌سازی.'],
        ['<code>URL Resolver</code>', 'تطبیق آدرس درخواستی با الگوهای urls.py.'],
        ['<code>View</code>', 'منطق اصلی: خواندن داده، اجرای قانون کسب‌وکار و ساخت response.'],
      ])}
      ${callout('info', 'ترتیب مهم است', 'middlewareها به ترتیب تنظیم <code>MIDDLEWARE</code> اجرا می‌شوند؛ بعضی فقط هنگام ورود و بعضی فقط هنگام خروج کار می‌کنند.')}
    `),

    s('Django پایه', 'دستورات کاربردی manage.py', 'بیشتر کارهای روزمره با manage.py انجام می‌شود.', `
      ${tbl(['دستور', 'وظیفه'], [
        ['<code>runserver</code>', 'اجرای سرور توسعه.'],
        ['<code>startapp</code>', 'ساخت app جدید.'],
        ['<code>makemigrations</code>', 'ساخت migration از تغییرات مدل.'],
        ['<code>migrate</code>', 'اعمال migrationها روی دیتابیس.'],
        ['<code>shell</code>', 'محیط تعاملی Python با تنظیمات پروژه.'],
        ['<code>createsuperuser</code>', 'ساخت کاربر ادمین.'],
        ['<code>check</code>', 'بررسی سلامت تنظیمات و کد.'],
        ['<code>test</code>', 'اجرای تست‌ها.'],
        ['<code>collectstatic</code>', 'جمع‌آوری فایل‌های static برای production.'],
      ])}
      ${c('bash', 'python manage.py check --deploy', 'بررسی آمادگی production')}
      ${callout('tip', 'کمک گرفتن', 'هر دستور را می‌توانید با <code>--help</code> بررسی کنید؛ مثلا <code>python manage.py makemigrations --help</code>.')}
    `),

    s('Django پایه', 'Django Shell', 'با shell می‌توانید بدون مرورگر، کد Django را آزمایش کنید.', `
      <p>shell یک محیط تعاملی است که تنظیمات و دیتابیس پروژه را بارگذاری می‌کند؛ برای آزمایش ORM، مدل‌ها و متدهایشان عالی است.</p>
      ${c('bash', 'python manage.py shell', 'ورود به shell')}
      ${c('python', [
        '>>> from blog.models import Post',
        '>>> Post.objects.count()',
        '3',
        '>>> Post.objects.filter(is_published=True).first()',
        '<Post: شروع جنگو>',
        '>>> post = Post(title="تست", body="متن")',
        '>>> post.save()',
        '>>> Post.objects.count()',
        '4',
      ], 'آزمایش ORM در shell')}
      ${exercise('شمارش با shell', 'آسان', '<p>در shell تعداد مقاله‌های منتشرنشده را با یک query بشمارید.</p>', '<p><code>Post.objects.filter(is_published=False).count()</code></p>')}
    `)
  );
})(window);
