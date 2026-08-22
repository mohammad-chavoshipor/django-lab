(function (global) {
  'use strict';
  const { c, callout, exercise, tbl, flow, slide: s, objectives, lab, checklist, quiz } = global.DL;

  global.SLIDES.push(
    s('View و Template', 'View دقیقاً چه کاری می‌کند؟', 'View نقطه تصمیم‌گیری request است.', `
      ${objectives([
        'view بنویسید که داده را از مدل بگیرد و به template بدهد.',
        'با ارث‌بری و <code>include</code> از تکرار در قالب‌ها جلوگیری کنید.',
        'URLهای نام‌گذاری‌شده و namespace بسازید و هرگز آدرس را دستی ننویسید.',
        'فایل static و media را درست تنظیم و در قالب استفاده کنید.',
        'فیلتر و تگ سفارشی و context processor بنویسید.',
      ])}
      <p>View ورودی را از <code>request</code> می‌گیرد، داده لازم را از مدل یا سرویس می‌خواند، قوانین کسب‌وکار را اجرا می‌کند و در نهایت یک response می‌سازد.</p>
      ${c('python', [
        '# blog/views.py',
        'from django.shortcuts import render',
        'from .models import Post',
        '',
        '',
        'def post_list(request):',
        '    posts = Post.objects.published().select_related("author", "category")',
        '    return render(request, "blog/post_list.html", {"posts": posts})'
      ], 'view لیست مقاله‌ها')}
      ${flow(['request', 'خواندن داده', 'اجرای منطق', 'ساخت context', 'render'])}
      ${tbl(['این کار', 'جایش کجاست؟'], [
        ['فیلتر و مرتب‌سازی داده', 'Manager یا QuerySet مدل.'],
        ['تصمیم «کدام template؟»', 'view.'],
        ['محاسبه مربوط به یک رکورد', 'متد یا property مدل.'],
        ['حلقه و شرط نمایشی', 'template.'],
        ['اعتبارسنجی ورودی کاربر', 'Form.'],
        ['منطق چندمرحله‌ای کسب‌وکار', 'ماژول جدا مثل <code>services.py</code>.'],
      ])}
      ${callout('tip', 'اصل ساده', 'view نباید به فایل HTML تبدیل شود و template هم نباید منطق سنگین کسب‌وکار داشته باشد. اگر view شما بیش از ۳۰ خط شد، احتمالا منطقی دارد که جایش مدل یا service است.')}
    `),

    s('View و Template', 'Template و inheritance', 'Templateها HTML پویا می‌سازند و با inheritance از تکرار جلوگیری می‌کنند.', `
      ${c('html', [
        '<!-- templates/base.html -->',
        '<!doctype html>',
        '<html lang="fa" dir="rtl">',
        '<head>',
        '  <meta charset="utf-8">',
        '  <title>{% block title %}MiniShop Blog{% endblock %}</title>',
        '  {% block extra_head %}{% endblock %}',
        '</head>',
        '<body>',
        '  <header><a href="{% url "blog:home" %}">خانه</a></header>',
        '  <main>{% block content %}{% endblock %}</main>',
        '  <footer>{% block footer %}© MiniShop{% endblock %}</footer>',
        '</body>',
        '</html>'
      ], 'base.html')}
      ${c('html', [
        '<!-- templates/blog/post_list.html -->',
        '{% extends "base.html" %}',
        '',
        '{% block title %}مقاله‌ها | {{ block.super }}{% endblock %}',
        '',
        '{% block content %}',
        '  <h1>مقاله‌ها</h1>',
        '  {% for post in posts %}',
        '    <article>',
        '      <h2><a href="{{ post.get_absolute_url }}">{{ post.title }}</a></h2>',
        '      <p>{{ post.body|truncatewords:25 }}</p>',
        '    </article>',
        '  {% empty %}',
        '    <p>هنوز مقاله‌ای منتشر نشده است.</p>',
        '  {% endfor %}',
        '{% endblock %}'
      ], 'post_list.html')}
      ${tbl(['ابزار', 'کارش'], [
        ['<code>{% extends "base.html" %}</code>', 'ارث‌بری؛ باید <strong>اولین</strong> خط فایل باشد.'],
        ['<code>{% block name %}</code>', 'جای قابل جایگزینی در قالب والد.'],
        ['<code>{{ block.super }}</code>', 'محتوای همان block در والد را هم نگه می‌دارد.'],
        ['<code>{% include "partial.html" %}</code>', 'درج یک قطعه قالب.'],
      ])}
      ${callout('warn', 'خطای TemplateDoesNotExist', 'Django قالب‌ها را در <code>TEMPLATES[0]["DIRS"]</code> و در پوشه <code>templates/</code> هر app نصب‌شده می‌گردد. مسیر را کامل بنویسید: <code>"blog/post_list.html"</code> نه <code>"post_list.html"</code> — این کار از تداخل نام بین appها هم جلوگیری می‌کند.')}
    `),

    s('View و Template', 'include و قالب‌های تکه‌ای', 'هر چیزی که در دو صفحه تکرار شد، باید partial شود.', `
      <p>ارث‌بری برای «اسکلت صفحه» است؛ <code>include</code> برای «قطعه قابل تکرار» مثل کارت محصول، نوار جست‌وجو یا فهرست پیام‌ها.</p>
      ${c('html', [
        '<!-- templates/blog/partials/post_card.html -->',
        '<article class="card">',
        '  {% if post.cover %}<img src="{{ post.cover.url }}" alt="{{ post.title }}">{% endif %}',
        '  <h3><a href="{{ post.get_absolute_url }}">{{ post.title }}</a></h3>',
        '  <p>{{ post.summary }}</p>',
        '</article>',
      ], 'قطعه قابل استفاده مجدد')}
      ${c('html', [
        '<!-- استفاده در هر صفحه -->',
        '{% for post in posts %}',
        '  {% include "blog/partials/post_card.html" %}',
        '{% endfor %}',
        '',
        '<!-- تغییر نام متغیر هنگام درج -->',
        '{% include "blog/partials/post_card.html" with post=featured %}',
        '',
        '<!-- فقط متغیرهای داده‌شده منتقل شوند -->',
        '{% include "blog/partials/post_card.html" with post=item only %}',
      ], 'سه شکل include')}
      ${callout('tip', 'قرارداد نام‌گذاری', 'قطعه‌ها را در <code>templates/&lt;app&gt;/partials/</code> بگذارید و نامشان را با کاری که می‌کنند بنویسید: <code>post_card.html</code>، <code>pagination.html</code>، <code>messages.html</code>.')}
      ${exercise('استخراج partial', 'آسان', '<p>نوار پیام‌های <code>{% if messages %}…{% endif %}</code> را از <code>base.html</code> به یک partial منتقل کنید و با include صدا بزنید.</p>', c('html', [
        '<!-- templates/partials/messages.html -->',
        '{% if messages %}',
        '  <ul class="messages">',
        '    {% for message in messages %}',
        '      <li class="{{ message.tags }}">{{ message }}</li>',
        '    {% endfor %}',
        '  </ul>',
        '{% endif %}',
        '',
        '<!-- base.html -->',
        '{% include "partials/messages.html" %}',
      ], 'راه‌حل'))}
    `),

    s('View و Template', 'URLهای نام‌گذاری‌شده و namespace', 'هرگز آدرس را دستی در HTML ننویسید.', `
      <p>اگر در قالب بنویسید <code>&lt;a href="/posts/5/"&gt;</code>، روزی که ساختار آدرس عوض شود، همه لینک‌ها می‌شکنند. با نام route، Django آدرس را برایتان می‌سازد.</p>
      ${c('python', [
        '# blog/urls.py',
        'from django.urls import path',
        'from . import views',
        '',
        'app_name = "blog"            # ← تعریف namespace',
        '',
        'urlpatterns = [',
        '    path("", views.home, name="home"),',
        '    path("posts/", views.post_list, name="post_list"),',
        '    path("posts/<slug:slug>/", views.post_detail, name="post_detail"),',
        ']'
      ], 'namespace در app')}
      ${c('python', [
        '# config/urls.py',
        'urlpatterns = [',
        '    path("admin/", admin.site.urls),',
        '    path("", include("blog.urls")),',
        '    path("shop/", include("shop.urls")),',
        '    path("accounts/", include("accounts.urls")),',
        ']'
      ], 'اتصال به پروژه')}
      ${tbl(['ساخت آدرس در…', 'نحو'], [
        ['template', '<code>{% url "blog:post_detail" post.slug %}</code>'],
        ['template با kwargs', '<code>{% url "blog:post_detail" slug=post.slug %}</code>'],
        ['view', '<code>reverse("blog:post_detail", kwargs={"slug": slug})</code>'],
        ['redirect', '<code>redirect("blog:post_detail", slug=post.slug)</code>'],
        ['مدل', '<code>get_absolute_url()</code> با <code>reverse()</code>'],
        ['CBV', '<code>success_url = reverse_lazy("blog:home")</code>'],
      ])}
      ${callout('danger', 'خطای NoReverseMatch', 'این خطا یعنی Django نتوانست آدرس را بسازد. سه علت رایج: ۱) نام route غلط یا namespace جاافتاده، ۲) تعداد یا نام آرگومان‌ها اشتباه، ۳) خود URL هنوز در <code>urlpatterns</code> تعریف نشده است.')}
      ${callout('warn', 'reverse یا reverse_lazy؟', 'در سطح ماژول (مثلا مقدار <code>success_url</code> کلاس) از <code>reverse_lazy</code> استفاده کنید؛ چون هنگام import هنوز URLها بارگذاری نشده‌اند. داخل تابع، <code>reverse</code> کافی است.')}
    `),

    s('View و Template', 'Converterهای URL', 'با converter، قسمت متغیر آدرس را با نوع مشخص می‌گیرید.', `
      <p>هر قسمت پویا از آدرس یک نوع دارد؛ converter هم آن را پارس می‌کند، هم validation می‌کند و مقدار را با همان نوع به view می‌فرستد.</p>
      ${tbl(['Converter', 'نمونه', 'نوع ورودی view'], [
        ['<code>str</code>', '<code>&lt;str:name&gt;</code>', 'رشته بدون / (پیش‌فرض).'],
        ['<code>int</code>', '<code>&lt;int:pk&gt;</code>', 'عدد صحیح.'],
        ['<code>slug</code>', '<code>&lt;slug:slug&gt;</code>', 'رشته slug مثل start-django.'],
        ['<code>uuid</code>', '<code>&lt;uuid:code&gt;</code>', 'شناسه UUID.'],
        ['<code>path</code>', '<code>&lt;path:path&gt;</code>', 'هر چیزی شامل / (برای فایل).'],
      ])}
      ${c('python', [
        'urlpatterns = [',
        '    path("cart/", views.cart_detail, name="cart_detail"),        # ← ثابت‌ها اول',
        '    path("products/<int:pk>/", views.product_detail, name="product_detail"),',
        '    path("<slug:slug>/", views.category_detail, name="category"),  # ← کلی‌ها آخر',
        ']',
        '',
        'def product_detail(request, pk):',
        '    # pk عدد صحیح است، نه رشته',
        '    product = get_object_or_404(Product, pk=pk)',
        '    return render(request, "shop/detail.html", {"product": product})',
      ], 'ترتیب درست الگوها')}
      ${callout('danger', 'ترتیب urlpatterns مهم است', 'Django از بالا به پایین می‌گردد و اولین تطابق را برمی‌دارد. اگر <code>&lt;slug:slug&gt;</code> بالای <code>cart/</code> باشد، آدرس <code>/cart/</code> به view دسته‌بندی می‌رود و ۴۰۴ می‌گیرید. همیشه مسیرهای ثابت را بالاتر بگذارید.')}
      ${quiz('آدرس <code>/shop/cart/</code> خطای «محصولی با این slug یافت نشد» می‌دهد. علت؟', [
        'محصولی به نام cart در دیتابیس نیست و باید ساخته شود.',
        'الگوی <code>&lt;slug:slug&gt;</code> بالاتر از <code>cart/</code> تعریف شده و زودتر تطبیق خورده است.',
        'باید <code>DEBUG</code> را روشن کنیم.',
      ], 1, 'راه‌حل: جابه‌جا کردن ترتیب <code>urlpatterns</code> تا مسیر ثابت <code>cart/</code> قبل از الگوی عمومی slug بررسی شود.')}
    `),

    s('View و Template', 'Tags و Filters کاربردی', 'Template language فقط نمایش است؛ با tags و filters داده را آماده نمایش کنید.', `
      ${tbl(['نحو', 'کاربرد'], [
        ['<code>{% for %}</code> … <code>{% empty %}</code>', 'حلقه با حالت «خالی».'],
        ['<code>{% if %}</code> / <code>{% elif %}</code> / <code>{% else %}</code>', 'شرط.'],
        ['<code>{% url %}</code>', 'ساخت آدرس از نام route.'],
        ['<code>{% csrf_token %}</code>', 'توکن امنیت در فرم‌های POST.'],
        ['<code>{% with total=a|add:b %}</code>', 'تعریف متغیر موقت.'],
        ['<code>{{ value|date:"Y/m/d" }}</code>', 'قالب‌بندی تاریخ.'],
        ['<code>{{ text|truncatewords:25 }}</code>', 'کوتاه‌کردن متن در حد کلمه.'],
        ['<code>{{ text|linebreaks }}</code>', 'تبدیل خط جدید به پاراگراف.'],
        ['<code>{{ items|length }}</code>', 'طول list یا رشته.'],
        ['<code>{{ x|default:"—" }}</code>', 'مقدار جایگزین وقتی خالی است.'],
        ['<code>{{ price|floatformat:0 }}</code>', 'حذف اعشار.'],
        ['<code>{{ n|intcomma }}</code>', 'جداکننده هزارگان (نیاز به <code>django.contrib.humanize</code>).'],
      ])}
      ${c('html', [
        '{% load humanize %}',
        '',
        '{% for post in posts %}',
        '  <h2>{{ post.title }}</h2>',
        '  <p>{{ post.body|truncatewords:25|linebreaks }}</p>',
        '  <time>{{ post.created_at|date:"Y/m/d" }}</time>',
        '  <span>{{ post.price|intcomma }} تومان</span>',
        '{% empty %}',
        '  <p>موردی نیست.</p>',
        '{% endfor %}',
      ], 'ترکیب tags و filters')}
      ${callout('danger', 'فیلتر safe و XSS', 'فیلتر <code>safe</code> و تابع <code>mark_safe</code> جلوی escape خودکار را می‌گیرند و باعث می‌شوند HTML داده کاربر اجرا شود. این یعنی ریسک XSS؛ فقط برای محتوای کاملا مطمئن استفاده کنید.')}
      ${callout('warn', 'محدودیت عمدی', 'زبان قالب Django عمدا ضعیف است: نمی‌توانید تابع با آرگومان صدا بزنید یا انتساب پیچیده بنویسید. این محدودیت شما را مجبور می‌کند منطق را به view یا مدل ببرید — که همان‌جا هم درست است.')}
    `),

    s('View و Template', 'فیلتر و تگ سفارشی', 'وقتی زبان قالب کم می‌آورد، خودتان گسترشش بدهید.', `
      <p>مثال واقعی: نمایش قیمت به‌صورت «۱٬۲۵۰٬۰۰۰ تومان» یا تبدیل تاریخ میلادی به شمسی. این‌ها را با تگ و فیلتر سفارشی می‌سازیم.</p>
      ${c('text', [
        'blog/',
        '└── templatetags/',
        '    ├── __init__.py        ← نبودن این فایل، رایج‌ترین علت کار نکردن است',
        '    └── blog_extras.py',
      ], 'ساختار پوشه لازم')}
      ${c('python', [
        '# blog/templatetags/blog_extras.py',
        'from django import template',
        'from blog.models import Post',
        '',
        'register = template.Library()',
        '',
        '',
        '@register.filter',
        'def toman(value):',
        '    """۱۲۵۰۰۰۰ → ۱٬۲۵۰٬۰۰۰ تومان"""',
        '    try:',
        '        return f"{int(value):,} تومان".replace(",", "٬")',
        '    except (TypeError, ValueError):',
        '        return value',
        '',
        '',
        '@register.simple_tag',
        'def total_posts():',
        '    return Post.objects.published().count()',
        '',
        '',
        '@register.inclusion_tag("blog/partials/latest_posts.html")',
        'def latest_posts(count=5):',
        '    return {"posts": Post.objects.published()[:count]}',
      ], 'سه نوع افزونه قالب')}
      ${c('html', [
        '{% load blog_extras %}',
        '',
        '<p>{{ product.price|toman }}</p>',
        '<p>تعداد کل مقاله‌ها: {% total_posts %}</p>',
        '{% latest_posts 3 %}',
      ], 'استفاده در قالب')}
      ${tbl(['نوع', 'کی استفاده کنیم'], [
        ['<code>@register.filter</code>', 'تبدیل یک مقدار: قالب‌بندی عدد، تاریخ، متن.'],
        ['<code>@register.simple_tag</code>', 'محاسبه و برگرداندن یک مقدار.'],
        ['<code>@register.inclusion_tag</code>', 'رندر یک قطعه قالب با داده خودش (مثل سایدبار).'],
      ])}
      ${callout('warn', 'بعد از ساخت، سرور را ری‌استارت کنید', 'Django فایل‌های <code>templatetags</code> را فقط هنگام شروع بارگذاری می‌کند. اگر <code>{% load %}</code> خطای <code>is not a registered tag library</code> داد: وجود <code>__init__.py</code> را بررسی کنید، app در <code>INSTALLED_APPS</code> باشد و سرور را دوباره اجرا کنید.')}
    `),

    s('View و Template', 'Context Processor — داده مشترک همه صفحات', 'وقتی یک متغیر باید در همه قالب‌ها باشد.', `
      <p>تعداد آیتم‌های سبد خرید باید در header همه صفحات دیده شود. فرستادن آن از تک‌تک viewها اشتباه است؛ راه درست context processor است.</p>
      ${c('python', [
        '# shop/context_processors.py',
        'from .cart import Cart',
        '',
        '',
        'def cart(request):',
        '    """در همه قالب‌ها متغیر cart در دسترس می‌شود."""',
        '    return {"cart": Cart(request)}',
      ], 'تعریف')}
      ${c('python', [
        '# config/settings.py',
        'TEMPLATES = [{',
        '    # ...',
        '    "OPTIONS": {',
        '        "context_processors": [',
        '            "django.template.context_processors.request",',
        '            "django.contrib.auth.context_processors.auth",',
        '            "django.contrib.messages.context_processors.messages",',
        '            "shop.context_processors.cart",      # ← افزودن مورد خودمان',
        '        ],',
        '    },',
        '}]',
      ], 'ثبت در settings')}
      ${c('html', [
        '<!-- در هر قالبی، بدون هیچ کاری در view -->',
        '<a href="{% url "shop:cart_detail" %}">سبد خرید ({{ cart|length }})</a>',
      ], 'استفاده')}
      ${tbl(['متغیر همیشه در دسترس', 'از کجا می‌آید'], [
        ['<code>{{ user }}</code>', '<code>auth</code> context processor'],
        ['<code>{{ perms }}</code>', '<code>auth</code> context processor'],
        ['<code>{{ messages }}</code>', '<code>messages</code> context processor'],
        ['<code>{{ request }}</code>', '<code>request</code> context processor'],
      ])}
      ${callout('warn', 'هزینه دارد', 'context processor برای <em>هر</em> رندر صفحه اجرا می‌شود. اگر داخلش query سنگین بزنید، همه صفحات سایت کند می‌شوند. آن را سبک نگه دارید یا نتیجه را cache کنید.')}
    `),

    s('View و Template', 'Static و Media', 'Static برای فایل‌های پروژه است؛ Media برای فایل‌های آپلودی کاربر.', `
      ${tbl(['', 'Static', 'Media'], [
        ['محتوا', 'CSS، JS، لوگو، فونت', 'تصویر محصول، آواتار کاربر'],
        ['چه کسی می‌سازد', 'برنامه‌نویس', 'کاربر'],
        ['در git', 'بله', 'خیر'],
        ['تنظیمات', '<code>STATIC_URL</code>، <code>STATICFILES_DIRS</code>، <code>STATIC_ROOT</code>', '<code>MEDIA_URL</code>، <code>MEDIA_ROOT</code>'],
        ['در production', 'با <code>collectstatic</code> جمع و توسط Nginx/WhiteNoise سرو می‌شود', 'از دیسک یا فضای ابری سرو می‌شود'],
      ])}
      ${c('python', [
        '# config/settings.py',
        'STATIC_URL = "static/"',
        'STATICFILES_DIRS = [BASE_DIR / "static"]      # فایل‌های خودتان در توسعه',
        'STATIC_ROOT = BASE_DIR / "staticfiles"        # مقصد collectstatic در production',
        '',
        'MEDIA_URL = "media/"',
        'MEDIA_ROOT = BASE_DIR / "media"',
      ], 'تنظیم static/media')}
      ${c('python', [
        '# config/urls.py — سرو media فقط در حالت توسعه',
        'from django.conf import settings',
        'from django.conf.urls.static import static',
        '',
        'if settings.DEBUG:',
        '    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)',
      ], 'سرو فایل آپلودی در توسعه')}
      ${c('html', [
        '{% load static %}',
        '',
        '<link rel="stylesheet" href="{% static "css/app.css" %}">',
        '<img src="{% static "images/logo.png" %}" alt="logo">',
        '',
        '<!-- فایل آپلودی از خود شیء می‌آید، نه از static -->',
        '{% if post.cover %}',
        '  <img src="{{ post.cover.url }}" alt="{{ post.title }}">',
        '{% endif %}',
      ], 'استفاده در template')}
      ${callout('danger', 'اشتباه بسیار رایج', 'برای فایل آپلودی <code>{% static post.cover %}</code> ننویسید. مسیر درست <code>{{ post.cover.url }}</code> است. همچنین شرط <code>{% if post.cover %}</code> را بگذارید وگرنه برای رکوردهای بدون تصویر خطا می‌گیرید.')}
      ${callout('warn', 'در production چه می‌شود؟', 'با <code>DEBUG=False</code> سرور توسعه دیگر فایل static را سرو نمی‌کند. باید <code>python manage.py collectstatic</code> اجرا شود و WhiteNoise یا Nginx آن را سرو کند — در بخش استقرار کامل می‌بینیم.')}
    `),

    s('View و Template', 'انواع Response', 'هر view در نهایت یک HttpResponse برمی‌گرداند؛ ولی با راه‌های آماده.', `
      ${tbl(['کمک', 'کاربرد', 'خروجی'], [
        ['<code>render()</code>', 'ترکیب template با context', 'صفحه HTML کامل، status 200.'],
        ['<code>redirect()</code>', 'انتقال کاربر به آدرس دیگر', 'پاسخ 302 با Location.'],
        ['<code>HttpResponse</code>', 'پاسخ ساده با متن دلخواه', 'متن خام یا HTML.'],
        ['<code>JsonResponse</code>', 'پاسخ داده برای frontend/API', 'JSON با status 200.'],
        ['<code>get_object_or_404</code>', '404 خودکار اگر پیدا نشد', 'پاسخ 404.'],
        ['<code>HttpResponseForbidden</code>', 'عدم دسترسی', 'status 403.'],
        ['<code>FileResponse</code>', 'ارسال فایل برای دانلود', 'stream فایل.'],
      ])}
      ${c('python', [
        'from django.http import HttpResponse, JsonResponse',
        'from django.shortcuts import redirect, render',
        '',
        'def home(request):',
        '    return render(request, "home.html", {"posts": posts})',
        '',
        'def after_submit(request):',
        '    return redirect("blog:home")             # با نام route',
        '',
        'def api_stats(request):',
        '    return JsonResponse({"count": Post.objects.count()})',
        '',
        'def raw(request):',
        '    return HttpResponse("<b>ساده</b>", status=200)',
      ], 'انواع response')}
      ${callout('info', 'الگوی PRG', 'اگر view داده را تغییر می‌دهد، در پایان با <code>redirect</code> برگردید (Post/Redirect/Get). در غیر این صورت کاربر با یک بار refresh فرم را دوباره ارسال می‌کند و رکورد تکراری می‌سازد.')}
    `),

    s('View و Template', 'Messages framework', 'بعد از هر عملیات، نتیجه را به کاربر اطلاع دهید.', `
      <p>messages چارچوب آماده‌ای برای نمایش پیام یکبارمصرف است؛ بعد از redirect، پیام در صفحه بعدی نمایش داده می‌شود و سپس پاک می‌شود.</p>
      ${c('python', [
        'from django.contrib import messages',
        '',
        'def post_create(request):',
        '    if request.method == "POST":',
        '        form = PostForm(request.POST)',
        '        if form.is_valid():',
        '            form.save()',
        '            messages.success(request, "مقاله با موفقیت ثبت شد.")',
        '            return redirect("blog:home")',
        '        messages.error(request, "لطفا خطاهای فرم را برطرف کنید.")',
        '    # ...',
      ], 'ارسال پیام')}
      ${c('html', [
        '<!-- templates/partials/messages.html -->',
        '{% if messages %}',
        '  <ul class="messages">',
        '    {% for message in messages %}',
        '      <li class="{{ message.tags }}">{{ message }}</li>',
        '    {% endfor %}',
        '  </ul>',
        '{% endif %}',
      ], 'نمایش پیام')}
      ${tbl(['سطح', 'کلاس CSS تولیدی', 'کاربرد'], [
        ['<code>messages.success()</code>', '<code>success</code>', 'عملیات موفق.'],
        ['<code>messages.info()</code>', '<code>info</code>', 'اطلاع‌رسانی خنثی.'],
        ['<code>messages.warning()</code>', '<code>warning</code>', 'هشدار.'],
        ['<code>messages.error()</code>', '<code>error</code>', 'خطا.'],
      ])}
      ${callout('warn', 'پیش‌نیاز', 'messages به <code>django.contrib.messages</code> در <code>INSTALLED_APPS</code>، به middleware مربوطه و به context processor آن نیاز دارد. در پروژه پیش‌فرض Django هر سه فعال‌اند.')}
    `),

    s('View و Template', 'نقطه کنترل View و Template', 'قبل از رفتن به فرم‌ها.', `
      ${checklist('روی پروژه خودتان', [
        '<code>base.html</code> با blockهای <code>title</code> و <code>content</code> دارید.',
        'حداقل یک partial ساخته‌اید و با <code>include</code> استفاده می‌کنید.',
        'همه appها <code>app_name</code> دارند و همه لینک‌ها با <code>{% url %}</code> ساخته می‌شوند.',
        'صفحه لیست و صفحه جزئیات هر دو کار می‌کنند.',
        'یک فایل CSS از <code>static/</code> بارگذاری می‌شود.',
        'حداقل یک فیلتر سفارشی نوشته‌اید.',
      ])}
      ${exercise('صفحه دسته‌بندی', 'متوسط', `
        <p>یک صفحه بسازید که مقاله‌های یک دسته را نشان دهد:</p>
        <ol>
          <li>URL به شکل <code>/category/&lt;slug&gt;/</code> با نام <code>blog:category</code>.</li>
          <li>view که دسته را با <code>get_object_or_404</code> بگیرد و مقاله‌های منتشرشده‌اش را بدهد.</li>
          <li>قالبی که از partial کارت مقاله استفاده کند و اگر مقاله‌ای نبود پیام مناسب نشان دهد.</li>
        </ol>`, c('python', [
        '# blog/urls.py',
        'path("category/<slug:slug>/", views.category_detail, name="category"),',
        '',
        '# blog/views.py',
        'def category_detail(request, slug):',
        '    category = get_object_or_404(Category, slug=slug)',
        '    posts = category.posts.published().select_related("author")',
        '    return render(request, "blog/category_detail.html", {',
        '        "category": category,',
        '        "posts": posts,',
        '    })',
      ], 'راه‌حل') + c('html', [
        '{% extends "base.html" %}',
        '',
        '{% block title %}{{ category.name }}{% endblock %}',
        '',
        '{% block content %}',
        '  <h1>{{ category.name }}</h1>',
        '  {% for post in posts %}',
        '    {% include "blog/partials/post_card.html" %}',
        '  {% empty %}',
        '    <p>در این دسته هنوز مقاله‌ای نیست.</p>',
        '  {% endfor %}',
        '{% endblock %}',
      ], 'قالب'))}
    `)
  );
})(window);
