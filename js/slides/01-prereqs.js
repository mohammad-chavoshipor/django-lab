(function (global) {
  'use strict';
  const { c, callout, exercise, tbl, flow, slide: s, objectives, lab, checklist, quiz } = global.DL;

  global.SLIDES.push(
    s('پیش‌نیازها', 'چرا این بخش را رد نکنید؟', 'Django فقط Python است؛ اگر Python برایتان مبهم باشد، Django هم مبهم می‌ماند.', `
      <p class="lead">بیشتر کسانی که در Django گیر می‌کنند، مشکلشان Django نیست: کلاس، شیء، دکوریتور، import یا فرم HTML را نمی‌شناسند. این بخش دقیقا همان مقدار پیش‌نیاز را می‌دهد — نه بیشتر.</p>
      ${objectives([
        'ساختار داده‌های Python (لیست، دیکشنری) و کلاس/شیء را بخوانید و بنویسید.',
        'بفهمید <code>from .models import Post</code> و <code>@login_required</code> دقیقا چه کاری می‌کنند.',
        'محیط مجازی بسازید و وابستگی‌ها را در <code>requirements.txt</code> قفل کنید.',
        'یک فرم HTML بنویسید و بدانید <code>name</code>، <code>method</code> و <code>action</code> چه نقشی دارند.',
        'مفهوم جدول، ردیف، کلید اصلی و کلید خارجی را در دیتابیس رابطه‌ای توضیح دهید.',
      ])}
      ${tbl(['قطعه Django', 'پیش‌نیاز واقعی آن'], [
        ['<code>class Post(models.Model)</code>', 'کلاس، وراثت و صفت کلاس در Python.'],
        ['<code>@login_required</code>', 'دکوریتور در Python.'],
        ['<code>{"posts": posts}</code> در <code>render()</code>', 'دیکشنری در Python.'],
        ['<code>from .models import Post</code>', 'ماژول و import نسبی.'],
        ['<code>&lt;form method="post"&gt;</code>', 'فرم HTML و صفت <code>name</code>.'],
        ['<code>ForeignKey</code>', 'کلید خارجی در دیتابیس رابطه‌ای.'],
      ])}
      ${callout('tip', 'اگر Python بلدید', 'اگر کلاس، دکوریتور و venv برایتان روشن است، فقط اسلایدهای «فرم HTML» و «دیتابیس رابطه‌ای» را ببینید و بقیه را رد کنید.')}
    `),

    s('پیش‌نیازها', 'Python: متغیر و انواع داده', 'کوچک‌ترین واحدهایی که در هر view و model می‌بینید.', `
      ${c('python', [
        'title = "شروع جنگو"        # str  — رشته',
        'price = 250000              # int  — عدد صحیح',
        'rate = 4.5                  # float — اعشاری',
        'is_published = True         # bool — درست/نادرست',
        'tags = ["django", "web"]    # list — فهرست مرتب و قابل تغییر',
        'post = {"title": "سلام", "views": 12}   # dict — نگاشت کلید به مقدار',
        'author = None               # None — «مقداری وجود ندارد»',
        '',
        'print(type(title), len(tags), post["title"])',
      ], 'انواع پایه')}
      ${tbl(['نوع Python', 'معادل در Django', 'مثال'], [
        ['<code>str</code>', '<code>CharField</code> / <code>TextField</code>', 'عنوان مقاله.'],
        ['<code>int</code>', '<code>IntegerField</code>', 'موجودی انبار.'],
        ['<code>bool</code>', '<code>BooleanField</code>', '<code>is_published</code>.'],
        ['<code>dict</code>', 'context در <code>render()</code>', '<code>{"posts": posts}</code>.'],
        ['<code>list</code>', 'خروجی <code>QuerySet</code> (شبیه لیست)', 'فهرست مقاله‌ها.'],
        ['<code>None</code>', '<code>NULL</code> در دیتابیس', 'فیلد <code>null=True</code> پر نشده.'],
      ])}
      ${c('python', [
        '# دیکشنری: همان چیزی که به template می‌فرستید',
        'context = {"post": post, "comments": comments}',
        'context["title"] = "عنوان جدید"     # افزودن/تغییر کلید',
        'value = context.get("missing", "پیش‌فرض")  # خواندن امن بدون خطا',
      ], 'دیکشنری در عمل')}
      ${callout('warn', 'تفاوت مهم', '<code>context["missing"]</code> اگر کلید نباشد <code>KeyError</code> می‌دهد، ولی <code>context.get("missing")</code> مقدار <code>None</code> برمی‌گرداند. در view معمولا از <code>request.GET.get("q", "")</code> استفاده می‌کنیم دقیقا به همین دلیل.')}
    `),

    s('پیش‌نیازها', 'Python: شرط، حلقه و تابع', 'منطق هر view از همین سه چیز ساخته می‌شود.', `
      ${c('python', [
        '# شرط — تورفتگی (indent) در Python نقش آکولاد را دارد',
        'if stock > 0:',
        '    status = "موجود"',
        'elif stock == 0:',
        '    status = "ناموجود"',
        'else:',
        '    status = "نامعتبر"',
        '',
        '# حلقه',
        'for tag in ["django", "python"]:',
        '    print(tag)',
        '',
        '# تابع با مقدار پیش‌فرض',
        'def total_price(price, quantity=1):',
        '    return price * quantity',
        '',
        'total_price(1000)        # 1000',
        'total_price(1000, 3)     # 3000',
        'total_price(quantity=2, price=500)   # آرگومان نام‌دار → 1000',
      ], 'کنترل جریان')}
      ${callout('danger', 'رایج‌ترین خطای مبتدی', 'تورفتگی در Python اجباری است. مخلوط‌کردن Tab و Space یا جاافتادن یک سطح تورفتگی، خطای <code>IndentationError</code> می‌دهد. ویرایشگر را روی «۴ فاصله به‌جای Tab» تنظیم کنید.')}
      ${c('python', [
        '# دقیقا همین الگو را در view فرم می‌بینید:',
        'def post_create(request):',
        '    if request.method == "POST":',
        '        form = PostForm(request.POST)',
        '        if form.is_valid():',
        '            form.save()',
        '            return redirect("home")',
        '    else:',
        '        form = PostForm()',
        '    return render(request, "blog/post_form.html", {"form": form})',
      ], 'همین مفاهیم در Django')}
      ${exercise('تابع تخفیف', 'آسان', '<p>تابعی به نام <code>final_price</code> بنویسید که <code>price</code> و <code>percent</code> (پیش‌فرض ۰) بگیرد و قیمت بعد از تخفیف را برگرداند.</p>', c('python', [
        'def final_price(price, percent=0):',
        '    return price - (price * percent // 100)',
        '',
        'final_price(200000, 10)   # 180000',
      ], 'راه‌حل'))}
    `),

    s('پیش‌نیازها', 'Python: کلاس، شیء و وراثت', 'مهم‌ترین پیش‌نیاز؛ هر model و هر CBV یک کلاس است.', `
      <p><strong>کلاس</strong> نقشه ساخت است و <strong>شیء</strong> نمونه ساخته‌شده از آن نقشه. <code>self</code> یعنی «همین شیء».</p>
      ${c('python', [
        'class Product:',
        '    def __init__(self, name, price):   # سازنده: هنگام ساخت شیء اجرا می‌شود',
        '        self.name = name               # صفت (attribute) شیء',
        '        self.price = price',
        '',
        '    def discounted(self, percent):     # متد: تابعی که به شیء تعلق دارد',
        '        return self.price - self.price * percent // 100',
        '',
        '    def __str__(self):                 # نمایش خوانا هنگام print()',
        '        return self.name',
        '',
        'p = Product("کیبورد", 900000)   # ساخت شیء',
        'print(p.name, p.discounted(10), str(p))',
      ], 'کلاس ساده')}
      <h2>وراثت: کلاس فرزند همه چیز والد را به ارث می‌برد</h2>
      ${c('python', [
        'class BaseItem:',
        '    def label(self):',
        '        return "کالا"',
        '',
        'class Book(BaseItem):          # Book از BaseItem ارث می‌برد',
        '    def label(self):           # بازنویسی (override) متد والد',
        '        return "کتاب: " + super().label()',
        '',
        'Book().label()   # "کتاب: کالا"',
      ], 'وراثت و super()')}
      ${callout('info', 'حالا این خط را می‌فهمید', '<code>class Post(models.Model)</code> یعنی «کلاس Post از کلاس Model جنگو ارث می‌برد» و به همین دلیل بدون نوشتن یک خط SQL، متدهایی مثل <code>save()</code> و مدیر <code>objects</code> را دارد. متد <code>__str__</code> هم همان چیزی است که در پنل admin نمایش داده می‌شود.')}
      ${quiz('در <code>class PostListView(ListView)</code> چرا نیازی به نوشتن حلقه و <code>render</code> نیست؟', [
        'چون Django کد را حدس می‌زند.',
        'چون <code>ListView</code> این رفتار را دارد و <code>PostListView</code> با وراثت آن را می‌گیرد؛ ما فقط بخش‌های دلخواه را override می‌کنیم.',
        'چون CBVها اصلا view نیستند.',
      ], 1, 'کل ایده Class-Based View همین است: رفتار پیش‌فرض در کلاس والد پیاده شده و شما فقط تفاوت‌ها (مثل <code>get_queryset</code> یا <code>template_name</code>) را می‌نویسید.')}
    `),

    s('پیش‌نیازها', 'Python: ماژول، پکیج و import', 'چرا نوشتن <code>from .models import Post</code> کار می‌کند؟', `
      <p>هر فایل <code>.py</code> یک <strong>ماژول</strong> است و هر پوشه شامل فایل‌های Python یک <strong>پکیج</strong>. با <code>import</code> کد یک ماژول را در ماژول دیگر در دسترس می‌کنید.</p>
      ${c('python', [
        'import math                      # کل ماژول',
        'math.sqrt(16)',
        '',
        'from math import sqrt            # فقط یک نام',
        'sqrt(16)',
        '',
        'from django.shortcuts import get_object_or_404, render   # چند نام',
        '',
        'from .models import Post         # نقطه = «همین پوشه/همین app»',
        'from ..config import settings    # دو نقطه = یک پوشه بالاتر',
      ], 'شکل‌های import')}
      ${c('text', [
        'blog/',
        '├── __init__.py     ← این فایل پوشه را به پکیج تبدیل می‌کند',
        '├── models.py       ← ماژول models',
        '├── views.py        ← داخل آن: from .models import Post',
        '└── urls.py         ← داخل آن: from . import views',
      ], 'ساختار یک app')}
      ${callout('danger', 'خطای import حلقوی (circular import)', 'اگر <code>models.py</code> از <code>views.py</code> و <code>views.py</code> از <code>models.py</code> import کند، خطای <code>ImportError</code> می‌گیرید. در Django برای ارجاع به مدل در فایل‌های دیگر از رشته استفاده کنید: <code>ForeignKey("shop.Product", ...)</code>.')}
    `),

    s('پیش‌نیازها', 'Python: دکوریتور', 'همان <code>@</code>هایی که بالای viewها می‌بینید.', `
      <p>دکوریتور تابعی است که یک تابع دیگر را می‌گیرد و نسخه‌ای «بسته‌بندی‌شده» از آن برمی‌گرداند — بدون آنکه بدنه تابع اصلی را دست بزنیم.</p>
      ${c('python', [
        'def require_login(view_func):',
        '    def wrapper(request):',
        '        if not request.user.is_authenticated:',
        '            return redirect("login")      # قبل از اجرای view',
        '        return view_func(request)         # اجرای view اصلی',
        '    return wrapper',
        '',
        '@require_login          # معادل: dashboard = require_login(dashboard)',
        'def dashboard(request):',
        '    return render(request, "dashboard.html")',
      ], 'ساخت یک دکوریتور ساده')}
      ${tbl(['دکوریتور Django', 'کارش'], [
        ['<code>@login_required</code>', 'کاربر مهمان را به صفحه ورود می‌فرستد.'],
        ['<code>@permission_required("blog.delete_post")</code>', 'بررسی سطح دسترسی.'],
        ['<code>@require_POST</code>', 'فقط درخواست POST را قبول می‌کند؛ بقیه <code>405</code> می‌گیرند.'],
        ['<code>@cache_page(60 * 15)</code>', 'خروجی view را ۱۵ دقیقه cache می‌کند.'],
        ['<code>@admin.register(Post)</code>', 'ثبت مدل در پنل admin.'],
      ])}
      ${callout('tip', 'ترتیب دکوریتورها', 'دکوریتورها از پایین به بالا اعمال می‌شوند. در <code>@login_required</code> بالای <code>@require_POST</code>، اول بررسی ورود انجام می‌شود — همان چیزی که معمولا می‌خواهیم.')}
    `),

    s('پیش‌نیازها', 'محیط مجازی، pip و requirements', 'هر پروژه باید کتابخانه‌های خودش را جدا داشته باشد.', `
      <p>اگر Django را سراسری نصب کنید، پروژه A با Django 4 و پروژه B با Django 5 به هم می‌خورند. محیط مجازی (<code>venv</code>) یک پوشه جدا با Python و کتابخانه‌های مخصوص همان پروژه می‌سازد.</p>
      ${lab('ساخت محیط مجازی و قفل‌کردن وابستگی‌ها', 'زمان: ۱۰ دقیقه', [
        { do: c('bash', ['mkdir django_lab_project', 'cd django_lab_project', 'python3 -m venv .venv'], 'ساخت پوشه و venv') },
        { do: c('bash', ['# macOS / Linux', 'source .venv/bin/activate', '', '# Windows PowerShell', '.venv\\Scripts\\Activate.ps1'], 'فعال‌سازی'), why: 'بعد از فعال‌سازی، نام <code>(.venv)</code> ابتدای خط ترمینال ظاهر می‌شود؛ یعنی هر <code>pip install</code> فقط داخل همین پروژه نصب می‌شود.' },
        { do: c('bash', ['python -m pip install --upgrade pip', 'pip install "django>=5.0,<6.0"', 'pip install pillow'], 'نصب'), why: '<code>pillow</code> برای <code>ImageField</code> لازم است؛ بدون آن Django هنگام migrate خطا می‌دهد.' },
        { do: c('bash', ['pip freeze > requirements.txt', 'cat requirements.txt'], 'قفل‌کردن نسخه‌ها'), why: 'روی سرور یا کامپیوتر هم‌تیمی، <code>pip install -r requirements.txt</code> دقیقا همان نسخه‌ها را نصب می‌کند و رفتار پروژه یکسان می‌ماند.' },
      ], '<p>دستور <code>python -m django --version</code> باید نسخه Django را چاپ کند و فایل <code>requirements.txt</code> باید حاوی خطی مثل <code>Django==5.x.x</code> باشد.</p>')}
      ${tbl(['دستور', 'کار'], [
        ['<code>python3 -m venv .venv</code>', 'ساخت محیط مجازی در پوشه <code>.venv</code>.'],
        ['<code>source .venv/bin/activate</code>', 'فعال‌سازی (macOS/Linux).'],
        ['<code>deactivate</code>', 'خروج از محیط مجازی.'],
        ['<code>pip install &lt;name&gt;</code>', 'نصب کتابخانه.'],
        ['<code>pip freeze &gt; requirements.txt</code>', 'ثبت نسخه دقیق همه کتابخانه‌ها.'],
        ['<code>pip install -r requirements.txt</code>', 'نصب همه وابستگی‌های پروژه.'],
      ])}
      ${callout('danger', 'هرگز', 'پوشه <code>.venv/</code> را در Git commit نکنید؛ حجیم است و به سیستم‌عامل وابسته. فقط <code>requirements.txt</code> را commit کنید.')}
    `),

    s('پیش‌نیازها', 'خط فرمان: حداقل لازم', 'تمام کار با Django از ترمینال شروع می‌شود.', `
      ${tbl(['دستور', 'کار', 'معادل Windows (PowerShell)'], [
        ['<code>pwd</code>', 'نمایش پوشه فعلی.', '<code>pwd</code>'],
        ['<code>ls</code>', 'فهرست فایل‌ها.', '<code>ls</code> یا <code>dir</code>'],
        ['<code>cd blog</code>', 'ورود به پوشه.', '<code>cd blog</code>'],
        ['<code>cd ..</code>', 'یک پوشه بالاتر.', '<code>cd ..</code>'],
        ['<code>mkdir templates</code>', 'ساخت پوشه.', '<code>mkdir templates</code>'],
        ['<kbd class="kbd">Ctrl</kbd>+<kbd class="kbd">C</kbd>', 'توقف سرور در حال اجرا.', 'همان'],
      ])}
      ${callout('warn', 'رایج‌ترین سردرگمی', 'دستور <code>python manage.py runserver</code> فقط وقتی کار می‌کند که در همان پوشه‌ای باشید که فایل <code>manage.py</code> در آن است. خطای <code>No such file or directory: manage.py</code> یعنی در پوشه اشتباه هستید؛ با <code>ls</code> بررسی کنید.')}
      ${exercise('پیدا کردن مسیر', 'آسان', '<p>در ترمینال به پوشه پروژه بروید و ثابت کنید <code>manage.py</code> آنجاست.</p>', '<p>با <code>cd &lt;path&gt;</code> وارد پوشه شوید و <code>ls</code> بزنید؛ باید <code>manage.py</code>، پوشه <code>config/</code> و <code>.venv/</code> را ببینید.</p>')}
    `),

    s('پیش‌نیازها', 'HTML: ساختار یک صفحه', 'Template جنگو در نهایت همین HTML را تولید می‌کند.', `
      ${c('html', [
        '<!doctype html>',
        '<html lang="fa" dir="rtl">',
        '<head>',
        '  <meta charset="utf-8">',
        '  <meta name="viewport" content="width=device-width, initial-scale=1">',
        '  <title>عنوان صفحه</title>',
        '  <link rel="stylesheet" href="/static/css/style.css">',
        '</head>',
        '<body>',
        '  <header><nav><a href="/">خانه</a></nav></header>',
        '  <main>',
        '    <h1>عنوان اصلی</h1>',
        '    <p>یک پاراگراف با <strong>متن پررنگ</strong>.</p>',
        '    <ul><li>آیتم اول</li><li>آیتم دوم</li></ul>',
        '    <img src="/media/a.jpg" alt="توضیح تصویر">',
        '  </main>',
        '</body>',
        '</html>',
      ], 'کمینه HTML لازم')}
      ${tbl(['تگ', 'کاربرد'], [
        ['<code>&lt;h1&gt;…&lt;h6&gt;</code>', 'سرتیتر؛ هر صفحه فقط یک <code>h1</code>.'],
        ['<code>&lt;p&gt;</code>', 'پاراگراف.'],
        ['<code>&lt;a href&gt;</code>', 'لینک؛ در Django با <code>{% url %}</code> ساخته می‌شود.'],
        ['<code>&lt;img src alt&gt;</code>', 'تصویر؛ <code>alt</code> برای دسترس‌پذیری و SEO الزامی است.'],
        ['<code>&lt;ul&gt;/&lt;ol&gt;/&lt;li&gt;</code>', 'فهرست؛ خروجی معمول یک حلقه <code>{% for %}</code>.'],
        ['<code>&lt;table&gt;</code>', 'جدول داده؛ مثلا سبد خرید.'],
        ['<code>class="card"</code>', 'قلاب استایل برای CSS.'],
      ])}
      ${callout('tip', 'کافی است', 'برای این دوره لازم نیست CSS حرفه‌ای بلد باشید. کافی است بدانید تگ‌ها را کجا بگذارید و با <code>class</code> به آن‌ها استایل بدهید.')}
    `),

    s('پیش‌نیازها', 'HTML: فرم — مهم‌ترین اسلاید این بخش', 'هر چیزی که Django Forms انجام می‌دهد، روی همین فرم HTML سوار است.', `
      ${c('html', [
        '<form method="post" action="/posts/new/">',
        '  <label for="id_title">عنوان</label>',
        '  <input type="text" name="title" id="id_title" required>',
        '',
        '  <label for="id_body">متن</label>',
        '  <textarea name="body" id="id_body" rows="6"></textarea>',
        '',
        '  <label for="id_category">دسته</label>',
        '  <select name="category" id="id_category">',
        '    <option value="1">جنگو</option>',
        '    <option value="2">پایتون</option>',
        '  </select>',
        '',
        '  <label><input type="checkbox" name="is_published" value="1"> منتشر شود</label>',
        '',
        '  <button type="submit">ذخیره</button>',
        '</form>',
      ], 'فرم خام HTML')}
      ${tbl(['صفت', 'نقش', 'در Django'], [
        ['<code>method="post"</code>', 'داده در body ارسال می‌شود، نه در URL.', 'خوانده می‌شود با <code>request.POST</code>.'],
        ['<code>method="get"</code>', 'داده در query string می‌رود و قابل bookmark است.', 'خوانده می‌شود با <code>request.GET</code> — مناسب جست‌وجو.'],
        ['<code>action="/path/"</code>', 'مقصد ارسال؛ خالی یعنی همین آدرس فعلی.', 'معمولا <code>{% url "name" %}</code>.'],
        ['<strong><code>name="title"</code></strong>', '<strong>کلید داده ارسالی.</strong>', '<code>request.POST["title"]</code> و نام فیلد فرم.'],
        ['<code>type</code>', 'نوع ورودی: text، email، number، password، file، date.', 'Django از روی نوع فیلد مدل، widget مناسب می‌سازد.'],
        ['<code>enctype="multipart/form-data"</code>', 'برای آپلود فایل الزامی است.', 'بدون آن <code>request.FILES</code> خالی می‌ماند.'],
      ])}
      ${callout('danger', 'بدون <code>name</code> داده‌ای ارسال نمی‌شود', 'اگر یک <code>&lt;input&gt;</code> صفت <code>name</code> نداشته باشد، مرورگر مقدارش را اصلا نمی‌فرستد. این یکی از رایج‌ترین دلایل «فرم من خالی می‌آید» است.')}
      ${quiz('برای فرم آپلود تصویر محصول، کدام مورد الزامی است؟', [
        'فقط <code>method="post"</code>.',
        '<code>method="post"</code> به‌همراه <code>enctype="multipart/form-data"</code> و در view خواندن <code>request.FILES</code>.',
        'استفاده از <code>method="get"</code> با <code>type="file"</code>.',
      ], 1, 'فایل‌ها فقط با encoding نوع <code>multipart/form-data</code> ارسال می‌شوند و در Django باید فرم را با <code>PostForm(request.POST, request.FILES)</code> بسازید.')}
    `),

    s('پیش‌نیازها', 'دیتابیس رابطه‌ای در ۵ دقیقه', 'ORM جنگو روی همین مفاهیم ساخته شده است.', `
      <p>دیتابیس رابطه‌ای داده را در <strong>جدول</strong> نگه می‌دارد. هر جدول <strong>ستون</strong> (نوع داده) و <strong>ردیف</strong> (یک رکورد) دارد.</p>
      ${tbl(['مفهوم دیتابیس', 'معادل Django', 'مثال'], [
        ['Table (جدول)', 'کلاس <code>Model</code>', '<code>blog_post</code>'],
        ['Column (ستون)', 'Field', '<code>title = CharField(...)</code>'],
        ['Row (ردیف)', 'یک شیء از مدل', 'یک مقاله مشخص.'],
        ['Primary Key', 'فیلد <code>id</code> (خودکار)', 'شناسه یکتای هر ردیف.'],
        ['Foreign Key', '<code>ForeignKey</code>', 'ستون <code>author_id</code> در جدول مقاله.'],
        ['Index', '<code>db_index=True</code>', 'جست‌وجوی سریع روی <code>slug</code>.'],
        ['Constraint', '<code>unique=True</code> / <code>constraints</code>', 'جلوگیری از slug تکراری.'],
      ])}
      ${c('text', [
        'جدول blog_post                        جدول auth_user',
        '┌────┬──────────┬───────────┐        ┌────┬──────────┐',
        '│ id │ title    │ author_id │───┐    │ id │ username │',
        '├────┼──────────┼───────────┤   │    ├────┼──────────┤',
        '│ 1  │ سلام     │     7     │   └───▶│ 7  │ ali      │',
        '│ 2  │ جنگو     │     7     │        │ 9  │ sara     │',
        '└────┴──────────┴───────────┘        └────┴──────────┘',
        '      author_id یک «کلید خارجی» است: به id جدول کاربر اشاره می‌کند.',
      ], 'رابطه چند-به-یک')}
      ${callout('info', 'چرا رابطه؟', 'به‌جای تکرار نام نویسنده در هر مقاله، فقط شناسه او را ذخیره می‌کنیم. اگر نام نویسنده عوض شود، یک جا عوض می‌شود — نه در هزار ردیف.')}
    `),

    s('پیش‌نیازها', 'SQL کمینه: چه چیزی زیر ORM اجرا می‌شود؟', 'لازم نیست SQL بنویسید، ولی باید بتوانید آن را بخوانید.', `
      ${c('sql', [
        '-- خواندن',
        'SELECT id, title FROM blog_post WHERE is_published = 1 ORDER BY created_at DESC LIMIT 5;',
        '',
        '-- ساختن',
        'INSERT INTO blog_post (title, slug) VALUES (\'سلام\', \'salam\');',
        '',
        '-- ویرایش',
        'UPDATE blog_post SET is_published = 1 WHERE id = 3;',
        '',
        '-- حذف',
        'DELETE FROM blog_post WHERE id = 3;',
        '',
        '-- پیوند دو جدول',
        'SELECT p.title, u.username',
        'FROM blog_post p JOIN auth_user u ON p.author_id = u.id;',
      ], 'پنج دستور اصلی')}
      ${tbl(['ORM جنگو', 'SQL معادل'], [
        ['<code>Post.objects.all()</code>', '<code>SELECT * FROM blog_post</code>'],
        ['<code>Post.objects.filter(is_published=True)</code>', '<code>… WHERE is_published = 1</code>'],
        ['<code>.order_by("-created_at")</code>', '<code>ORDER BY created_at DESC</code>'],
        ['<code>[:5]</code>', '<code>LIMIT 5</code>'],
        ['<code>.select_related("author")</code>', '<code>JOIN auth_user …</code>'],
        ['<code>.count()</code>', '<code>SELECT COUNT(*) …</code>'],
      ])}
      ${c('python', [
        '# همیشه می‌توانید SQL تولیدشده را ببینید:',
        '>>> print(Post.objects.filter(is_published=True).order_by("-created_at")[:5].query)',
        'SELECT "blog_post"."id", ... FROM "blog_post" WHERE ... ORDER BY ... LIMIT 5',
      ], 'دیدن query واقعی')}
      ${callout('tip', 'عادت حرفه‌ای', 'وقتی صفحه‌ای کند شد، اولین کار دیدن queryهای تولیدشده است. در بخش خطایابی با Django Debug Toolbar این کار را بصری انجام می‌دهیم.')}
      ${exercise('ترجمه به ORM', 'متوسط', '<p>این SQL را به ORM ترجمه کنید: <code>SELECT * FROM shop_product WHERE stock > 0 ORDER BY price LIMIT 10;</code></p>', c('python', 'Product.objects.filter(stock__gt=0).order_by("price")[:10]', 'راه‌حل'))}
    `),

    s('پیش‌نیازها', 'نقطه کنترل بخش پیش‌نیازها', 'قبل از ورود به Django این‌ها باید برایتان روشن باشد.', `
      ${checklist('اگر همه را می‌توانید انجام دهید، آماده بخش بعدید', [
        'یک کلاس Python با <code>__init__</code>، یک متد و <code>__str__</code> بنویسید.',
        'توضیح دهید <code>@login_required</code> از نظر Python دقیقا چه می‌کند.',
        'یک <code>venv</code> بسازید، فعال کنید، Django و Pillow نصب کنید و <code>requirements.txt</code> بگیرید.',
        'یک فرم HTML با <code>method</code>، <code>action</code> و <code>name</code> درست بنویسید.',
        'تفاوت کلید اصلی و کلید خارجی را با یک مثال بگویید.',
        'یک <code>SELECT … WHERE … ORDER BY</code> را بخوانید و بفهمید.',
      ])}
      ${exercise('تمرین ترکیبی پیش‌نیاز', 'متوسط', `
        <p>یک فایل <code>practice.py</code> بسازید که:</p>
        <ol>
          <li>کلاس <code>Product</code> با <code>name</code>، <code>price</code> و <code>stock</code> داشته باشد.</li>
          <li>متد <code>is_available()</code> که اگر <code>stock &gt; 0</code> بود <code>True</code> بدهد.</li>
          <li>متد <code>__str__</code> که نام محصول را برگرداند.</li>
          <li>یک لیست از سه محصول بسازد و فقط موجودها را چاپ کند.</li>
        </ol>`, c('python', [
        'class Product:',
        '    def __init__(self, name, price, stock=0):',
        '        self.name = name',
        '        self.price = price',
        '        self.stock = stock',
        '',
        '    def is_available(self):',
        '        return self.stock > 0',
        '',
        '    def __str__(self):',
        '        return self.name',
        '',
        '',
        'products = [',
        '    Product("کیبورد", 900_000, 3),',
        '    Product("موس", 450_000, 0),',
        '    Product("مانیتور", 12_000_000, 1),',
        ']',
        '',
        'for product in products:',
        '    if product.is_available():',
        '        print(product, product.price)',
      ], 'راه‌حل'))}
      ${callout('tip', 'همین ساختار در Django', 'در بخش بعد دقیقا همین کلاس را به <code>models.Model</code> تبدیل می‌کنیم؛ آن‌وقت به‌جای لیست داخل حافظه، داده در دیتابیس ذخیره می‌شود و با <code>Product.objects.filter(stock__gt=0)</code> خوانده می‌شود.')}
    `)
  );
})(window);
