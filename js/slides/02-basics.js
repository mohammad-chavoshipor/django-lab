(function (global) {
  'use strict';
  const { c, callout, exercise, tbl, flow, slide: s, objectives, lab, checklist, quiz } = global.DL;

  global.SLIDES.push(
    s('Django پایه', 'Framework چیست؟', 'Framework مجموعه‌ای از قوانین، ابزارها و قطعات آماده برای ساخت سریع‌تر و منظم‌تر نرم‌افزار است.', `
      ${objectives([
        'تفاوت framework و کتابخانه را توضیح دهید و بگویید Django کدام است.',
        'یک پروژه Django بسازید، app اضافه کنید و سرور توسعه را بالا بیاورید.',
        'مسیر یک request را از <code>urls.py</code> تا view و response دنبال کنید.',
        'کلیدهای مهم <code>settings.py</code> را بشناسید و بدانید هرکدام چه چیزی را کنترل می‌کند.',
        'اولین تست خودکار پروژه را بنویسید و اجرا کنید.',
      ])}
      <p>وقتی بدون framework کار می‌کنید، باید routing، اتصال دیتابیس، امنیت فرم‌ها، session، ساخت HTML، مدیریت فایل و ده‌ها کار تکراری را خودتان طراحی کنید. Framework این قطعات را با معماری مشخص آماده می‌کند.</p>
      ${tbl(['بدون Framework', 'با Framework'], [
        ['هر پروژه ساختار متفاوتی دارد.', 'ساختار استاندارد و قابل فهم برای تیم.'],
        ['امنیت و validation ممکن است فراموش شود.', 'قابلیت‌های امنیتی و validation آماده.'],
        ['توسعه کندتر و پرریسک‌تر است.', 'تمرکز روی منطق کسب‌وکار.'],
      ])}
      ${callout('tip', 'تفاوت با کتابخانه', 'در کتابخانه <em>شما</em> کد کتابخانه را صدا می‌زنید؛ در framework <em>framework</em> کد شما را صدا می‌زند. برای همین Django تعیین می‌کند view شما چه امضایی داشته باشد و کِی اجرا شود.')}
    `),

    s('Django پایه', 'Django چیست؟', 'Django یک web framework سطح بالا برای Python است که ساخت وب‌اپلیکیشن امن و قابل نگهداری را سریع می‌کند.', `
      <p>Django اصطلاحا «batteries included» است؛ یعنی بسیاری از نیازهای رایج وب را در خودش دارد: ORM، migration، admin، template engine، form، authentication، session، middleware و ابزارهای امنیتی.</p>
      ${tbl(['قابلیت', 'کاربرد'], [
        ['URL dispatcher', 'وصل کردن آدرس‌ها به viewها.'],
        ['Views', 'اجرای منطق request و ساخت response.'],
        ['Models/ORM', 'تعریف جدول‌ها با کلاس Python و query بدون SQL خام.'],
        ['Templates', 'ساخت HTML پویا.'],
        ['Forms', 'ساخت، نمایش و اعتبارسنجی ورودی کاربر.'],
        ['Admin', 'پنل مدیریت آماده برای داده‌ها.'],
        ['Auth', 'کاربر، گروه، permission، ورود و خروج.'],
        ['Middleware', 'پردازش request/response در لایه‌های عمومی.'],
      ])}
      ${callout('info', 'کدام نسخه؟', 'این دوره با Django 5 نوشته شده است. نسخه‌های LTS (پشتیبانی بلندمدت) برای پروژه‌های واقعی مناسب‌ترند؛ نسخه نصب‌شده را با <code>python -m django --version</code> ببینید.')}
    `),

    s('Django پایه', 'معماری MVT در Django', 'Django به جای MVC رایج، از الگوی Model-View-Template استفاده می‌کند.', `
      <ul>
        <li><strong>Model:</strong> شکل داده و رابطه با دیتابیس را تعریف می‌کند.</li>
        <li><strong>View:</strong> request را می‌گیرد، منطق را اجرا می‌کند و response می‌سازد.</li>
        <li><strong>Template:</strong> ظاهر HTML را با داده‌های view ترکیب می‌کند.</li>
      </ul>
      ${flow(['URL', 'View', 'Model/Service', 'Template', 'Response'])}
      ${tbl(['اگر این را می‌خواهید تغییر دهید…', 'به این فایل بروید'], [
        ['شکل داده و جدول دیتابیس', '<code>models.py</code>'],
        ['اینکه چه آدرسی چه صفحه‌ای بدهد', '<code>urls.py</code>'],
        ['منطق و تصمیم‌گیری صفحه', '<code>views.py</code>'],
        ['ظاهر و HTML صفحه', '<code>templates/…</code>'],
        ['اعتبارسنجی ورودی کاربر', '<code>forms.py</code>'],
        ['تنظیمات کل پروژه', '<code>config/settings.py</code>'],
      ])}
      ${callout('info', 'نام‌گذاری مهم', 'در Django، View همان controller عملی است؛ Template نقش لایه نمایش را دارد.')}
    `),

    s('Django پایه', 'ساخت Project و App', 'Project تنظیمات کل سایت است؛ App یک بخش مستقل از قابلیت‌هاست.', `
      ${lab('ساخت پروژه و اولین app', 'پیش‌نیاز: venv فعال باشد — زمان: ۱۰ دقیقه', [
        { do: c('bash', ['django-admin startproject config .'], 'ساخت پروژه'), why: 'نقطه انتهای دستور یعنی «همین‌جا بساز»؛ بدون آن یک پوشه اضافه تودرتو می‌سازد که فقط سردرگمی می‌آورد.' },
        { do: c('bash', ['python manage.py startapp blog'], 'ساخت app') },
        { do: c('python', [
            '# config/settings.py',
            'INSTALLED_APPS = [',
            '    "django.contrib.admin",',
            '    "django.contrib.auth",',
            '    "django.contrib.contenttypes",',
            '    "django.contrib.sessions",',
            '    "django.contrib.messages",',
            '    "django.contrib.staticfiles",',
            '    "blog",          # ← app خودمان',
            ']'
          ], 'ثبت app'), why: 'تا وقتی app در <code>INSTALLED_APPS</code> نباشد، Django مدل‌ها، migrationها، templateها و adminش را نمی‌بیند. جاافتادن همین خط، منشأ خطای <code>no such table</code> است.' },
        { do: c('bash', ['python manage.py migrate', 'python manage.py runserver'], 'راه‌اندازی') },
      ], '<p>در مرورگر <code>http://127.0.0.1:8000/</code> را باز کنید؛ باید صفحه سبز خوش‌آمدگویی Django با موشک را ببینید. اگر پورت اشغال بود از <code>python manage.py runserver 8001</code> استفاده کنید.</p>')}
      ${tbl(['Project', 'App'], [
        ['یکی در هر سایت.', 'چند تا در هر سایت.'],
        ['تنظیمات، urls اصلی، WSGI/ASGI.', 'مدل، view، template و منطق یک قابلیت.'],
        ['مثال: <code>config/</code>', 'مثال: <code>blog</code>، <code>shop</code>، <code>accounts</code>'],
      ])}
      ${callout('warn', 'اشتباه رایج', 'همه کدها را داخل <code>config</code> ننویسید. هر قابلیت قابل تفکیک (blog، shop، accounts) باید app جدا داشته باشد تا پروژه قابل نگهداری بماند.')}
    `),

    s('Django پایه', 'ساختار فایل‌های مهم', 'شناخت فایل‌ها جلوی سردرگمی ابتدای کار را می‌گیرد.', `
      ${c('text', [
        'django_lab_project/',
        '├── .venv/                 محیط مجازی (در git نرود)',
        '├── manage.py              نقطه ورود دستورها',
        '├── requirements.txt       فهرست وابستگی‌ها',
        '├── db.sqlite3             دیتابیس توسعه',
        '├── config/                «پروژه»',
        '│   ├── settings.py        تنظیمات',
        '│   ├── urls.py            جدول آدرس اصلی',
        '│   ├── wsgi.py / asgi.py  نقطه اتصال به سرور production',
        '│   └── __init__.py',
        '├── blog/                  یک «app»',
        '│   ├── models.py          مدل‌ها',
        '│   ├── views.py           viewها',
        '│   ├── urls.py            (خودتان می‌سازید)',
        '│   ├── admin.py           ثبت در پنل مدیریت',
        '│   ├── apps.py            تنظیم app',
        '│   ├── tests.py           تست‌ها',
        '│   └── migrations/        تاریخچه تغییرات دیتابیس',
        '└── templates/             قالب‌های HTML (خودتان می‌سازید)',
      ], 'ساختار استاندارد پروژه')}
      ${tbl(['فایل/پوشه', 'نقش'], [
        ['<code>manage.py</code>', 'اجرای commandهای پروژه مثل runserver و migrate.'],
        ['<code>config/settings.py</code>', 'تنظیمات پروژه، دیتابیس، زبان، static و appها.'],
        ['<code>config/urls.py</code>', 'جدول آدرس‌های اصلی پروژه.'],
        ['<code>config/wsgi.py</code>', 'در production، Gunicorn از همین فایل برنامه را بالا می‌آورد.'],
        ['<code>blog/models.py</code>', 'تعریف مدل‌های app.'],
        ['<code>blog/views.py</code>', 'تابع‌ها یا کلاس‌های پاسخ‌دهنده به request.'],
        ['<code>blog/admin.py</code>', 'ثبت مدل‌ها در پنل مدیریت.'],
        ['<code>blog/migrations/</code>', 'فایل‌های تغییر دیتابیس؛ حتما در git commit شوند.'],
      ])}
    `),

    s('Django پایه', 'settings.py از نزدیک', 'یک فایل، کنترل کل رفتار پروژه.', `
      <p>بیشتر رفتارهای عجیب Django ریشه در یک کلید اشتباه در <code>settings.py</code> دارند. این‌ها مهم‌ترین‌ها هستند:</p>
      ${tbl(['کلید', 'کارش', 'خطای رایج مربوطه'], [
        ['<code>SECRET_KEY</code>', 'امضای رمزنگاری session، CSRF و توکن‌ها.', 'commit شدن در git = نشت امنیتی.'],
        ['<code>DEBUG</code>', 'نمایش صفحه خطای کامل و سرو فایل static در توسعه.', '<code>True</code> در production = افشای کد و تنظیمات.'],
        ['<code>ALLOWED_HOSTS</code>', 'دامنه‌های مجاز.', '<code>DisallowedHost</code> وقتی <code>DEBUG=False</code> است.'],
        ['<code>INSTALLED_APPS</code>', 'appهای فعال.', 'ثبت‌نکردن app = مدل و template دیده نمی‌شود.'],
        ['<code>MIDDLEWARE</code>', 'زنجیره پردازش request/response.', 'حذف <code>CsrfViewMiddleware</code> = حفره امنیتی.'],
        ['<code>TEMPLATES[0]["DIRS"]</code>', 'پوشه قالب‌های سراسری.', '<code>TemplateDoesNotExist</code>.'],
        ['<code>DATABASES</code>', 'نوع و آدرس دیتابیس.', '<code>OperationalError</code>.'],
        ['<code>STATIC_URL</code> / <code>STATIC_ROOT</code>', 'آدرس و مقصد جمع‌آوری فایل static.', 'خطای <code>collectstatic</code> بدون <code>STATIC_ROOT</code>.'],
        ['<code>MEDIA_URL</code> / <code>MEDIA_ROOT</code>', 'فایل‌های آپلودی کاربر.', 'تصویر آپلودشده نمایش داده نمی‌شود.'],
        ['<code>LANGUAGE_CODE</code> / <code>TIME_ZONE</code>', 'زبان و منطقه زمانی.', 'تاریخ‌ها با اختلاف ساعت نمایش داده می‌شوند.'],
      ])}
      ${c('python', [
        '# config/settings.py — تنظیمات فارسی',
        'LANGUAGE_CODE = "fa-ir"',
        'TIME_ZONE = "Asia/Tehran"',
        'USE_I18N = True',
        'USE_TZ = True',
        '',
        'TEMPLATES = [{',
        '    "BACKEND": "django.template.backends.django.DjangoTemplates",',
        '    "DIRS": [BASE_DIR / "templates"],      # ← قالب‌های سراسری',
        '    "APP_DIRS": True,                      # ← قالب داخل هر app',
        '    # ...',
        '}]',
      ], 'تنظیمات پایه فارسی')}
      ${callout('warn', 'USE_TZ چیست؟', 'با <code>USE_TZ = True</code> همه تاریخ‌ها به وقت UTC ذخیره می‌شوند و هنگام نمایش به <code>TIME_ZONE</code> تبدیل می‌شوند. این درست‌ترین حالت است؛ فقط یادتان باشد در کد از <code>django.utils.timezone.now()</code> استفاده کنید، نه <code>datetime.now()</code>.')}
      ${quiz('در حالت <code>DEBUG = False</code> صفحه سایت خطای <code>DisallowedHost</code> می‌دهد. علت؟', [
        'دیتابیس migrate نشده است.',
        'دامنه یا IP درخواستی در <code>ALLOWED_HOSTS</code> نیست.',
        'فایل static جمع‌آوری نشده است.',
      ], 1, 'وقتی <code>DEBUG=False</code> شود، Django فقط به دامنه‌های فهرست‌شده در <code>ALLOWED_HOSTS</code> پاسخ می‌دهد؛ این یک محافظت در برابر حمله Host header است.')}
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
        '# blog/urls.py  ← این فایل وجود ندارد؛ خودتان بسازید',
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
        '    path("", include("blog.urls")),   # ← وصل‌کردن urls اپ به پروژه',
        ']'
      ], 'config/urls.py')}
      ${callout('info', 'چرا include؟', 'با <code>include</code> هر app آدرس‌های خودش را مدیریت می‌کند. اگر بعدا بخواهید کل بلاگ زیر <code>/blog/</code> برود، فقط یک خط در <code>config/urls.py</code> عوض می‌شود.')}
      ${exercise('صفحه درباره ما', 'آسان', '<p>یک view به نام <code>about</code> بسازید که در آدرس <code>/about/</code> متن «درباره ما» را نمایش دهد.</p>', c('python', [
        '# blog/views.py',
        'def about(request):',
        '    return HttpResponse("درباره ما")',
        '',
        '# blog/urls.py',
        'urlpatterns = [',
        '    path("", views.home, name="home"),',
        '    path("about/", views.about, name="about"),',
        ']',
      ], 'راه‌حل'))}
    `),

    s('Django پایه', 'ساختار request در Django', 'از request تا response یک مسیر مشخص وجود دارد.', `
      <p>هر request وارد پروژه می‌شود، از middlewareها عبور می‌کند، با الگوهای <code>urls.py</code> تطبیق داده می‌شود، view اجرا می‌شود و response از همان مسیر به مرورگر برمی‌گردد.</p>
      ${flow(['Request', 'Middleware', 'URL Resolver', 'View', 'Template/Model', 'Response'])}
      ${tbl(['لایه', 'نقش'], [
        ['<code>Middleware</code>', 'پردازش عمومی request/response: session، CSRF، امنیت و فشرده‌سازی.'],
        ['<code>URL Resolver</code>', 'تطبیق آدرس درخواستی با الگوهای urls.py — از بالا به پایین، اولین تطابق برنده است.'],
        ['<code>View</code>', 'منطق اصلی: خواندن داده، اجرای قانون کسب‌وکار و ساخت response.'],
      ])}
      ${c('python', [
        '# مقادیر پرکاربرد روی request',
        'request.method            # "GET" یا "POST"',
        'request.GET.get("q", "")  # پارامترهای query string',
        'request.POST             # داده فرم ارسالی',
        'request.FILES            # فایل‌های آپلودی',
        'request.user             # کاربر واردشده یا AnonymousUser',
        'request.session          # داده session',
        'request.path             # "/posts/5/"',
      ], 'شیء request')}
      ${callout('warn', 'ترتیب مهم است', 'هم middlewareها به ترتیب <code>MIDDLEWARE</code> اجرا می‌شوند و هم الگوهای <code>urlpatterns</code> از بالا به پایین بررسی می‌شوند. یک الگوی کلی مثل <code>&lt;slug:slug&gt;</code> اگر بالای الگوی ثابتی مثل <code>cart/</code> بیاید، جلوی آن را می‌گیرد.')}
    `),

    s('Django پایه', 'دستورات کاربردی manage.py', 'بیشتر کارهای روزمره با manage.py انجام می‌شود.', `
      ${tbl(['دستور', 'وظیفه'], [
        ['<code>runserver</code>', 'اجرای سرور توسعه.'],
        ['<code>startapp</code>', 'ساخت app جدید.'],
        ['<code>makemigrations</code>', 'ساخت migration از تغییرات مدل.'],
        ['<code>migrate</code>', 'اعمال migrationها روی دیتابیس.'],
        ['<code>showmigrations</code>', 'دیدن وضعیت اجرا شدن migrationها.'],
        ['<code>sqlmigrate blog 0001</code>', 'دیدن SQL دقیق یک migration.'],
        ['<code>shell</code>', 'محیط تعاملی Python با تنظیمات پروژه.'],
        ['<code>dbshell</code>', 'ورود مستقیم به کنسول دیتابیس.'],
        ['<code>createsuperuser</code>', 'ساخت کاربر ادمین.'],
        ['<code>changepassword &lt;user&gt;</code>', 'تغییر رمز یک کاربر.'],
        ['<code>check</code>', 'بررسی سلامت تنظیمات و کد.'],
        ['<code>check --deploy</code>', 'بررسی آمادگی production.'],
        ['<code>test</code>', 'اجرای تست‌ها.'],
        ['<code>collectstatic</code>', 'جمع‌آوری فایل‌های static برای production.'],
        ['<code>dumpdata</code> / <code>loaddata</code>', 'خروجی‌گرفتن و بارگذاری داده به‌صورت fixture.'],
      ])}
      ${c('bash', ['python manage.py check --deploy', 'python manage.py sqlmigrate blog 0001'], 'دو دستور کمتر شناخته‌شده و پرارزش')}
      ${callout('tip', 'کمک گرفتن', 'هر دستور را می‌توانید با <code>--help</code> بررسی کنید؛ مثلا <code>python manage.py makemigrations --help</code>. فهرست کامل دستورها با <code>python manage.py help</code>.')}
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
      ${callout('tip', 'shell بهتر', 'با نصب <code>django-extensions</code> دستور <code>python manage.py shell_plus</code> همه مدل‌ها را خودکار import می‌کند و دیگر لازم نیست هر بار import بنویسید.')}
      ${exercise('شمارش با shell', 'آسان', '<p>در shell تعداد مقاله‌های منتشرنشده را با یک query بشمارید.</p>', '<p><code>Post.objects.filter(is_published=False).count()</code></p>')}
    `),

    s('Django پایه', 'اولین تست خودکار', 'تست را از همین‌جا شروع کنید، نه در انتهای دوره.', `
      <p>تست یعنی کدی که کد شما را اجرا می‌کند و نتیجه را می‌سنجد. مزیتش این است که وقتی فردا چیزی را تغییر دادید، خودتان بلافاصله می‌فهمید چه چیزی شکسته است. Django یک client مرورگر شبیه‌سازی‌شده دارد که این کار را ساده می‌کند.</p>
      ${c('python', [
        '# blog/tests.py',
        'from django.test import TestCase',
        'from django.urls import reverse',
        '',
        '',
        'class HomePageTests(TestCase):',
        '    def test_home_returns_200(self):',
        '        response = self.client.get(reverse("home"))',
        '        self.assertEqual(response.status_code, 200)',
        '',
        '    def test_home_shows_greeting(self):',
        '        response = self.client.get(reverse("home"))',
        '        self.assertContains(response, "سلام")',
      ], 'اولین تست')}
      ${c('bash', [
        '$ python manage.py test',
        'Found 2 test(s).',
        'Creating test database for alias "default"...',
        '..',
        '----------------------------------------------------------------------',
        'Ran 2 tests in 0.012s',
        '',
        'OK',
      ], 'اجرای تست')}
      ${tbl(['ابزار تست', 'کارش'], [
        ['<code>self.client.get(url)</code>', 'شبیه‌سازی یک request GET.'],
        ['<code>self.client.post(url, data)</code>', 'ارسال فرم.'],
        ['<code>reverse("home")</code>', 'ساخت آدرس از نام route — بهتر از نوشتن دستی آدرس.'],
        ['<code>assertEqual(a, b)</code>', 'بررسی برابری، مثلا status code.'],
        ['<code>assertContains(response, "x")</code>', 'بررسی وجود متن در خروجی.'],
        ['<code>assertRedirects(response, url)</code>', 'بررسی درست بودن redirect.'],
      ])}
      ${callout('info', 'دیتابیس تست', 'Django برای اجرای تست یک دیتابیس موقت جدا می‌سازد و در پایان حذف می‌کند؛ پس تست‌ها هرگز به داده واقعی شما دست نمی‌زنند.')}
      ${exercise('تست صفحه about', 'آسان', '<p>برای صفحه <code>/about/</code> که قبلا ساختید یک تست بنویسید که هم status 200 و هم وجود متن «درباره ما» را بررسی کند.</p>', c('python', [
        'class AboutPageTests(TestCase):',
        '    def test_about_page(self):',
        '        response = self.client.get(reverse("about"))',
        '        self.assertEqual(response.status_code, 200)',
        '        self.assertContains(response, "درباره ما")',
      ], 'راه‌حل'))}
    `),

    s('Django پایه', 'نقطه کنترل بخش Django پایه', 'قبل از ورود به مدل‌ها این‌ها باید کار کنند.', `
      ${checklist('روی کامپیوتر خودتان بررسی کنید', [
        'پروژه با <code>django-admin startproject config .</code> ساخته شده و <code>manage.py</code> در ریشه است.',
        'app شما در <code>INSTALLED_APPS</code> ثبت شده است.',
        '<code>python manage.py runserver</code> بدون خطا اجرا می‌شود.',
        'آدرس <code>/</code> و <code>/about/</code> هر دو پاسخ می‌دهند.',
        '<code>python manage.py migrate</code> اجرا شده و <code>db.sqlite3</code> ساخته شده است.',
        '<code>python manage.py test</code> با پیام <code>OK</code> تمام می‌شود.',
        'می‌توانید بگویید <code>DEBUG</code>، <code>ALLOWED_HOSTS</code> و <code>INSTALLED_APPS</code> هرکدام چه می‌کنند.',
      ])}
      ${exercise('صفحه وضعیت پروژه', 'متوسط', '<p>یک view به نام <code>status</code> در آدرس <code>/status/</code> بسازید که با <code>JsonResponse</code> یک JSON شامل نام پروژه و مقدار <code>DEBUG</code> برگرداند، و برای آن تستی بنویسید که status code را بررسی کند.</p>', c('python', [
        '# blog/views.py',
        'from django.conf import settings',
        'from django.http import JsonResponse',
        '',
        'def status(request):',
        '    return JsonResponse({"project": "MiniShop Blog", "debug": settings.DEBUG})',
        '',
        '# blog/urls.py',
        'path("status/", views.status, name="status"),',
        '',
        '# blog/tests.py',
        'class StatusTests(TestCase):',
        '    def test_status_ok(self):',
        '        response = self.client.get(reverse("status"))',
        '        self.assertEqual(response.status_code, 200)',
        '        self.assertIn("project", response.json())',
      ], 'راه‌حل'))}
    `)
  );
})(window);
