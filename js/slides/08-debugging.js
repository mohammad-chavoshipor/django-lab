(function (global) {
  'use strict';
  const { c, callout, exercise, tbl, flow, slide: s, objectives, lab, checklist, quiz } = global.DL;

  global.SLIDES.push(
    s('خطایابی', 'خطایابی، مهارت شماره یک', 'تفاوت برنامه‌نویس مبتدی و حرفه‌ای، سرعت پیدا کردن علت خطاست.', `
      <p class="lead">مبتدی پیام خطا را کپی می‌کند و در اینترنت می‌گردد. حرفه‌ای پیام خطا را <em>می‌خواند</em> و در سه خط اول، فایل و شماره خط مشکل را پیدا می‌کند. این بخش همان مهارت را آموزش می‌دهد.</p>
      ${objectives([
        'یک traceback را از پایین به بالا بخوانید و خط مقصر را پیدا کنید.',
        'صفحه خطای Django را بخوانید و از بخش‌های مختلفش استفاده کنید.',
        'پانزده خطای پرتکرار Django را از روی پیام تشخیص دهید.',
        'با Django Debug Toolbar تعداد query و زمان هر صفحه را ببینید.',
        'به‌جای <code>print</code> از logging و breakpoint استفاده کنید.',
      ])}
      ${flow(['پیام خطا را بخوان', 'خط مقصر را پیدا کن', 'فرضیه بساز', 'کوچک‌ترین آزمایش', 'رفع و تایید'])}
      ${callout('danger', 'سه کار ممنوع هنگام خطا', 'یک: تغییرات تصادفی تا «شاید درست شود». دو: خاموش‌کردن محافظت (حذف middleware، <code>@csrf_exempt</code>، <code>DEBUG=True</code> در production). سه: کپی‌کردن کد از اینترنت بدون فهمیدن آن.')}
    `),

    s('خطایابی', 'خواندن Traceback', 'traceback را همیشه از پایین به بالا بخوانید.', `
      ${c('bash', [
        'Traceback (most recent call last):',
        '  File ".../django/core/handlers/exception.py", line 55, in inner',
        '    response = get_response(request)',
        '  File ".../django/core/handlers/base.py", line 197, in _get_response',
        '    response = wrapped_callback(request, *callback_args, **callback_kwargs)',
        '  File "/home/ali/shop/blog/views.py", line 24, in post_detail      ← کد خودتان',
        '    context = {"author": post.author.profile.bio}',
        '                        ^^^^^^^^^^^^^^^^^^^^^^^^',
        'blog.models.User.profile.RelatedObjectDoesNotExist: User has no profile.',
      ], 'یک traceback واقعی')}
      ${tbl(['خط', 'چه می‌گوید'], [
        ['آخرین خط', '<strong>نوع خطا و پیام</strong> — همیشه اول این را بخوانید.'],
        ['خط قبل از آن', 'کد دقیقی که خطا داد.'],
        ['آخرین <code>File</code> با مسیر پروژه <em>خودتان</em>', 'جایی که باید نگاه کنید.'],
        ['خطوط <code>.../django/...</code>', 'داخل خود Django؛ معمولا مقصر نیستند، ردشان کنید.'],
      ])}
      ${callout('tip', 'روش سه‌ثانیه‌ای', 'آخرین خط را بخوانید تا بفهمید <em>چه</em> خطایی است، سپس از پایین به بالا اولین فایلی را پیدا کنید که مسیرش داخل پروژه شماست تا بفهمید <em>کجاست</em>. در ۹۰ درصد موارد همین کافی است.')}
      ${c('python', [
        '# رفع خطای بالا — سه راه، به ترتیب کیفیت',
        '',
        '# ۱) در query مطمئن شوید رابطه وجود دارد',
        'post = get_object_or_404(Post.objects.select_related("author__profile"), slug=slug)',
        '',
        '# ۲) در کد بررسی کنید',
        'bio = post.author.profile.bio if hasattr(post.author, "profile") else ""',
        '',
        '# ۳) در قالب — زبان قالب خطای دسترسی را بی‌صدا رد می‌کند',
        '# {{ post.author.profile.bio|default:"" }}',
      ], 'رفع خطا')}
    `),

    s('خطایابی', 'صفحه خطای Django را کامل بخوانید', 'با <code>DEBUG=True</code>، Django یکی از بهترین صفحات خطای دنیا را می‌دهد.', `
      ${tbl(['بخش صفحه خطا', 'چه چیزی در آن هست', 'کی به دردتان می‌خورد'], [
        ['عنوان قرمز بالا', 'نوع استثنا و پیام.', 'همیشه — اولین چیزی که می‌خوانید.'],
        ['Request Method / URL', 'method و آدرس درخواست.', 'وقتی شک دارید فرم GET رفته یا POST.'],
        ['Traceback', 'زنجیره فراخوانی با امکان باز کردن هر فریم.', 'پیدا کردن خط مقصر.'],
        ['<strong>Local vars</strong> (با کلیک روی هر فریم)', 'مقدار همه متغیرهای آن لحظه.', 'حیاتی — می‌بینید متغیر واقعا چه مقداری داشته.'],
        ['Request information → GET/POST', 'داده ارسالی کاربر.', 'وقتی فرم مقدار نمی‌گیرد.'],
        ['COOKIES / META', 'کوکی‌ها و هدرها.', 'مشکلات session و CSRF.'],
        ['Settings', 'همه تنظیمات فعال پروژه.', 'بررسی <code>INSTALLED_APPS</code>، مسیر قالب‌ها.'],
      ])}
      ${callout('tip', 'Local vars را جدی بگیرید', 'روی خط مقصر در traceback کلیک کنید تا مقدار متغیرها باز شود. اینجا معلوم می‌شود <code>slug</code> واقعا <code>None</code> بوده یا <code>request.POST</code> خالی است — بدون نوشتن حتی یک <code>print</code>.')}
      ${callout('danger', 'در production خاموش', 'همین صفحه با <code>DEBUG=True</code> کل تنظیمات، مسیر فایل‌ها و بخشی از کد شما را به هر بازدیدکننده نشان می‌دهد. در سرور واقعی حتما <code>DEBUG=False</code> باشد و خطاها به log و ایمیل مدیر برود.')}
    `),

    s('خطایابی', 'پانزده خطای رایج Django', 'این جدول را نشان کنید؛ بیشتر خطاهای شما همین‌جاست.', `
      ${tbl(['پیام خطا', 'علت رایج', 'رفع'], [
        ['<code>TemplateDoesNotExist</code>', 'مسیر قالب اشتباه یا app در <code>INSTALLED_APPS</code> نیست.', 'مسیر کامل بنویسید و <code>DIRS</code> را بررسی کنید.'],
        ['<code>NoReverseMatch</code>', 'نام route غلط، namespace جاافتاده یا آرگومان اشتباه.', 'نام و آرگومان‌های <code>{% url %}</code> را با <code>urls.py</code> تطبیق دهید.'],
        ['<code>no such table: blog_post</code>', 'migrate اجرا نشده یا app ثبت نشده.', '<code>makemigrations</code> و سپس <code>migrate</code>.'],
        ['<code>OperationalError</code>', 'دیتابیس در دسترس نیست یا تنظیماتش غلط است.', '<code>DATABASES</code> و اجرای سرویس دیتابیس را بررسی کنید.'],
        ['<code>ImproperlyConfigured</code>', 'تنظیمی لازم است ولی وجود ندارد (مثل <code>SECRET_KEY</code>).', 'پیام خطا دقیقا می‌گوید کدام تنظیم.'],
        ['<code>CSRF verification failed</code>', 'جاافتادن <code>{% csrf_token %}</code> یا نبود cookie.', 'توکن را در فرم بگذارید؛ در AJAX هدر بفرستید.'],
        ['<code>RelatedObjectDoesNotExist</code>', 'رابطه یک‌به‌یک وجود ندارد.', 'با <code>hasattr</code> بررسی کنید یا رکورد را بسازید.'],
        ['<code>MultipleObjectsReturned</code>', '<code>get()</code> روی فیلد غیریکتا.', 'از <code>filter().first()</code> استفاده کنید.'],
        ['<code>DoesNotExist</code>', '<code>get()</code> چیزی پیدا نکرد.', '<code>get_object_or_404</code> یا <code>try/except</code>.'],
        ['<code>IntegrityError: UNIQUE constraint failed</code>', 'مقدار تکراری در فیلد یکتا.', 'قبل از ذخیره در فرم بررسی کنید.'],
        ['<code>Cannot use ImageField because Pillow is not installed</code>', 'Pillow نصب نیست.', '<code>pip install pillow</code>.'],
        ['<code>DisallowedHost</code>', '<code>DEBUG=False</code> و دامنه در <code>ALLOWED_HOSTS</code> نیست.', 'دامنه یا IP را اضافه کنید.'],
        ['<code>You are trying to add a non-nullable field</code>', 'فیلد جدید بدون <code>default</code> روی جدول پر.', '<code>default</code> بدهید یا <code>null=True</code>.'],
        ['<code>is not a registered tag library</code>', 'نبود <code>__init__.py</code> در <code>templatetags</code>.', 'فایل را بسازید و سرور را ری‌استارت کنید.'],
        ['<code>405 Method Not Allowed</code> در خروج', 'logout با GET صدا زده شده.', 'فرم POST بسازید.'],
      ])}
      ${callout('tip', 'قانون جست‌وجو', 'وقتی خطا را در اینترنت می‌جویید، مسیرهای شخصی و نام‌های پروژه خودتان را حذف کنید. جست‌وجوی <code>django NoReverseMatch reverse for not found</code> نتیجه بهتری می‌دهد تا کپی کل پیام.')}
    `),

    s('خطایابی', 'Django Debug Toolbar', 'ببینید هر صفحه دقیقا چند query می‌زند و کجا وقت می‌گذارد.', `
      ${lab('نصب و راه‌اندازی', 'زمان: ۱۰ دقیقه — فقط برای محیط توسعه', [
        { do: c('bash', ['pip install django-debug-toolbar'], 'نصب') },
        { do: c('python', [
            '# config/settings.py',
            'if DEBUG:',
            '    INSTALLED_APPS += ["debug_toolbar"]',
            '    MIDDLEWARE.insert(0, "debug_toolbar.middleware.DebugToolbarMiddleware")',
            '    INTERNAL_IPS = ["127.0.0.1"]',
          ], 'تنظیمات'), why: 'میان‌افزار باید تا حد امکان بالا باشد تا کل چرخه request را اندازه بگیرد.' },
        { do: c('python', [
            '# config/urls.py',
            'if settings.DEBUG:',
            '    urlpatterns += [path("__debug__/", include("debug_toolbar.urls"))]',
          ], 'مسیر') },
        { do: 'سرور را اجرا کنید و صفحه لیست مقاله‌ها را باز کنید؛ نوار ابزار در کنار صفحه ظاهر می‌شود.' },
      ], '<p>روی پنل <strong>SQL</strong> کلیک کنید. تعداد queryها را یادداشت کنید. حالا از view خود <code>select_related</code> را بردارید و صفحه را دوباره باز کنید — باید تعداد queryها به‌شدت بالا برود. این تفاوت، همان مسئله N+1 است که در بخش ORM دیدید.</p>')}
      ${tbl(['پنل', 'چه چیزی نشان می‌دهد'], [
        ['SQL', 'تعداد query، زمان هر کدام، queryهای تکراری و کد فراخوان.'],
        ['Time', 'زمان CPU و زمان کل ساخت پاسخ.'],
        ['Templates', 'قالب‌های رندرشده و context هرکدام.'],
        ['Request', 'مقادیر GET، POST، cookie و session.'],
        ['Settings', 'تنظیمات فعال.'],
        ['Cache', 'برخورد و عدم‌برخورد cache.'],
      ])}
      ${callout('danger', 'فقط در توسعه', 'Debug Toolbar را هرگز در production فعال نکنید؛ کل تنظیمات، queryها و داده session را افشا می‌کند. حتما داخل شرط <code>if DEBUG:</code> بماند.')}
    `),

    s('خطایابی', 'به‌جای print، از logging استفاده کنید', 'print در production نه دیده می‌شود، نه قابل جست‌وجوست.', `
      ${c('python', [
        '# config/settings.py',
        'LOGGING = {',
        '    "version": 1,',
        '    "disable_existing_loggers": False,',
        '    "formatters": {',
        '        "verbose": {"format": "{levelname} {asctime} {name} {message}", "style": "{"},',
        '    },',
        '    "handlers": {',
        '        "console": {"class": "logging.StreamHandler", "formatter": "verbose"},',
        '        "file": {',
        '            "class": "logging.FileHandler",',
        '            "filename": BASE_DIR / "logs/app.log",',
        '            "formatter": "verbose",',
        '        },',
        '    },',
        '    "root": {"handlers": ["console"], "level": "INFO"},',
        '    "loggers": {',
        '        "shop": {"handlers": ["console", "file"], "level": "DEBUG", "propagate": False},',
        '        "django.db.backends": {"level": "INFO"},   # DEBUG یعنی چاپ همه queryها',
        '    },',
        '}',
      ], 'تنظیم logging')}
      ${c('python', [
        '# shop/views.py',
        'import logging',
        '',
        'logger = logging.getLogger(__name__)',
        '',
        '',
        'def cart_add(request, product_id):',
        '    product = get_object_or_404(Product, id=product_id, is_active=True)',
        '    logger.info("cart_add product=%s user=%s", product.id, request.user.id)',
        '',
        '    try:',
        '        Cart(request).add(product)',
        '    except ValueError:',
        '        logger.warning("cart_add failed product=%s", product.id)',
        '        messages.error(request, "افزودن به سبد ممکن نشد.")',
        '',
        '    return redirect("shop:cart_detail")',
      ], 'استفاده')}
      ${tbl(['سطح', 'کی استفاده کنیم'], [
        ['<code>DEBUG</code>', 'جزئیات فقط برای توسعه.'],
        ['<code>INFO</code>', 'رویداد عادی مهم: ثبت سفارش، ورود کاربر.'],
        ['<code>WARNING</code>', 'اتفاق غیرعادی که سرویس را نخوابانده.'],
        ['<code>ERROR</code>', 'عملیات شکست خورد.'],
        ['<code>CRITICAL</code>', 'کل سرویس در خطر است.'],
      ])}
      ${callout('danger', 'در log ننویسید', 'رمز عبور، توکن، شماره کارت، کد ملی و محتوای کامل request. log معمولا در چند سیستم کپی می‌شود و دسترسی به آن گسترده‌تر از دیتابیس است.')}
    `),

    s('خطایابی', 'روش سیستماتیک: از حدس زدن تا دانستن', 'وقتی خطا پیام روشنی ندارد.', `
      <p>حالت سخت‌تر: کد خطا نمی‌دهد ولی نتیجه اشتباه است — صفحه خالی، عدد غلط، فرم ذخیره نمی‌شود. اینجا باید مثل کارآگاه عمل کنید.</p>
      ${c('python', [
        '# ابزار شماره یک: توقف اجرا و بررسی زنده',
        'def post_detail(request, slug):',
        '    post = get_object_or_404(Post, slug=slug)',
        '    breakpoint()          # اجرا اینجا متوقف می‌شود و کنسول pdb باز می‌شود',
        '    return render(request, "blog/post_detail.html", {"post": post})',
      ], 'breakpoint داخلی Python')}
      ${tbl(['دستور pdb', 'کار'], [
        ['<code>p post.title</code>', 'چاپ مقدار یک عبارت.'],
        ['<code>pp vars(post)</code>', 'چاپ خوانا همه صفات.'],
        ['<code>n</code>', 'اجرای خط بعد.'],
        ['<code>s</code>', 'ورود به داخل تابع.'],
        ['<code>c</code>', 'ادامه اجرا.'],
        ['<code>q</code>', 'خروج.'],
      ])}
      ${c('python', [
        '# ابزار شماره دو: آزمایش فرضیه در shell، جدا از وب',
        '$ python manage.py shell',
        '>>> from blog.models import Post',
        '>>> Post.objects.filter(slug="my-post").exists()',
        'False                      # ← مشکل از query است، نه از قالب',
        '>>> Post.objects.values_list("slug", flat=True)[:5]',
        "['my-post ', 'other']      # ← فاصله اضافه در انتهای slug!",
      ], 'جداسازی لایه‌ها')}
      ${c('python', [
        '# ابزار شماره سه: دیدن SQL واقعی',
        '>>> print(Post.objects.filter(is_published=True).query)',
        '',
        '# یا همه queryهای اجراشده در این session',
        '>>> from django.db import connection',
        '>>> len(connection.queries), connection.queries[-1]',
      ], 'بازرسی query')}
      ${callout('tip', 'جست‌وجوی دودویی', 'وقتی نمی‌دانید مشکل کجاست، وسط مسیر را بررسی کنید: آیا داده درست به view رسیده؟ اگر بله، مشکل در قالب است؛ اگر نه، در query یا URL. هر بررسی، فضای جست‌وجو را نصف می‌کند.')}
      ${quiz('صفحه لیست مقاله‌ها خالی است ولی در admin ۱۰ مقاله دیده می‌شود. اولین کاری که می‌کنید؟', [
        'قالب را بازنویسی می‌کنم.',
        'در shell همان query view را اجرا می‌کنم تا ببینم داده برمی‌گردد یا نه.',
        'سرور را ری‌استارت می‌کنم.',
      ], 1, 'با یک آزمایش، مشکل نصف می‌شود: اگر query در shell نتیجه دارد، ایراد از قالب یا نام متغیر context است؛ اگر ندارد، ایراد از فیلتر query است — مثلا همه مقاله‌ها <code>is_published=False</code> هستند.')}
    `),

    s('خطایابی', 'نقطه کنترل خطایابی', 'این تمرین را با کد شکسته انجام دهید.', `
      ${exercise('چهار باگ را پیدا کنید', 'چالشی', `
        <p>این کد چهار اشکال دارد. بدون اجرا کردن، هر چهار مورد را پیدا کنید و بگویید چه خطایی تولید می‌کنند.</p>
        ${c('python', [
          '# blog/views.py',
          'def post_detail(request, slug):',
          '    post = Post.objects.get(category="django")',
          '    comments = []',
          '    for comment in post.comments.all():',
          '        comments.append(comment.author.profile.bio)',
          '    return render(request, "post_detail.html", {"post": post})',
          '',
          '',
          '# blog/urls.py',
          'urlpatterns = [',
          '    path("<slug:slug>/", views.post_detail, name="detail"),',
          ']',
          '',
          '# templates/blog/post_detail.html',
          '# <a href="{% url "post_detail" post.slug %}">{{ post.title }}</a>',
        ], 'کد معیوب')}`,
        `<ol>
          <li><strong><code>MultipleObjectsReturned</code> یا <code>DoesNotExist</code>:</strong> <code>get(category="django")</code> از پارامتر <code>slug</code> استفاده نمی‌کند و روی فیلد غیریکتاست. درست: <code>get_object_or_404(Post, slug=slug)</code>.</li>
          <li><strong>N+1 و <code>RelatedObjectDoesNotExist</code>:</strong> حلقه برای هر نظر چند query می‌زند و اگر کاربری profile نداشته باشد خطا می‌دهد. درست: <code>prefetch_related("comments__author__profile")</code> و بررسی وجود profile. ضمنا <code>comments</code> اصلا به context فرستاده نشده است.</li>
          <li><strong><code>TemplateDoesNotExist</code>:</strong> مسیر قالب باید <code>"blog/post_detail.html"</code> باشد، نه <code>"post_detail.html"</code>.</li>
          <li><strong><code>NoReverseMatch</code>:</strong> نام route در <code>urls.py</code> برابر <code>detail</code> است ولی در قالب <code>post_detail</code> صدا زده شده — و اگر <code>app_name</code> تعریف شده باشد باید <code>blog:detail</code> نوشته شود.</li>
        </ol>`)}
      ${checklist('باید بتوانید', [
        'از روی traceback، فایل و خط مقصر را در کمتر از ده ثانیه پیدا کنید.',
        'در صفحه خطای Django بخش Local vars را باز کنید و مقدار متغیرها را ببینید.',
        'حداقل ده خطای جدول رایج را از روی پیام تشخیص دهید.',
        'Debug Toolbar را نصب کنید و تعداد query یک صفحه را بگویید.',
        'یک logger با نام ماژول بسازید و پیام <code>INFO</code> بنویسید.',
        'با <code>breakpoint()</code> اجرای یک view را متوقف و متغیری را بررسی کنید.',
      ])}
    `)
  );
})(window);
