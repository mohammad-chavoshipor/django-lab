(function (global) {
  'use strict';
  const { c, callout, exercise, tbl, slide: s } = global.DL;

  global.SLIDES.push(
    s('View و Template', 'View دقیقاً چه کاری می‌کند؟', 'View نقطه تصمیم‌گیری request است.', `
      <p>View ورودی را از <code>request</code> می‌گیرد، داده لازم را از مدل یا سرویس می‌خواند، قوانین کسب‌وکار را اجرا می‌کند و در نهایت یک response می‌سازد.</p>
      ${c('python', [
        '# blog/views.py',
        'from django.shortcuts import render',
        'from .models import Post',
        '',
        'def post_list(request):',
        '    posts = Post.objects.filter(is_published=True).order_by("-created_at")',
        '    return render(request, "blog/post_list.html", {"posts": posts})'
      ], 'view لیست مقاله‌ها')}
      ${callout('tip', 'اصل ساده', 'view نباید به فایل HTML تبدیل شود و template هم نباید منطق سنگین کسب‌وکار داشته باشد.')}
    `),

    s('View و Template', 'Template و inheritance', 'Templateها HTML پویا می‌سازند و با inheritance از تکرار جلوگیری می‌کنند.', `
      ${c('html', [
        '<!-- templates/base.html -->',
        '<!doctype html>',
        '<html lang="fa" dir="rtl">',
        '<head>',
        '  <meta charset="utf-8">',
        '  <title>{% block title %}MiniShop Blog{% endblock %}</title>',
        '</head>',
        '<body>',
        '  <header><a href="/">خانه</a></header>',
        '  <main>{% block content %}{% endblock %}</main>',
        '</body>',
        '</html>'
      ], 'base.html')}
      ${c('html', [
        '<!-- templates/blog/post_list.html -->',
        '{% extends "base.html" %}',
        '',
        '{% block title %}مقاله‌ها{% endblock %}',
        '',
        '{% block content %}',
        '  <h1>مقاله‌ها</h1>',
        '  {% for post in posts %}',
        '    <article>',
        '      <h2><a href="{% url "post_detail" post.slug %}">{{ post.title }}</a></h2>',
        '      <p>{{ post.body|truncatewords:25 }}</p>',
        '    </article>',
        '  {% empty %}',
        '    <p>هنوز مقاله‌ای منتشر نشده است.</p>',
        '  {% endfor %}',
        '{% endblock %}'
      ], 'post_list.html')}
    `),

    s('View و Template', 'URLهای نام‌گذاری‌شده', 'نام URL باعث می‌شود لینک‌ها با تغییر مسیر خراب نشوند.', `
      ${c('python', [
        '# blog/urls.py',
        'from django.urls import path',
        'from . import views',
        '',
        'urlpatterns = [',
        '    path("posts/", views.post_list, name="post_list"),',
        '    path("posts/<slug:slug>/", views.post_detail, name="post_detail"),',
        ']'
      ], 'URL patterns')}
      ${c('python', [
        '# blog/views.py',
        'from django.shortcuts import get_object_or_404, render',
        'from .models import Post',
        '',
        'def post_detail(request, slug):',
        '    post = get_object_or_404(Post, slug=slug, is_published=True)',
        '    return render(request, "blog/post_detail.html", {"post": post})'
      ], 'detail view')}
      ${c('html', '<a href="{% url "post_detail" post.slug %}">{{ post.title }}</a>', 'لینک در template')}
    `),

    s('View و Template', 'Static و Media', 'Static برای فایل‌های پروژه است؛ Media برای فایل‌های آپلودی کاربر.', `
      ${tbl(['نوع', 'مثال', 'محل تنظیم'], [
        ['Static', 'CSS، JS، logo، فونت محلی', '<code>STATIC_URL</code> و پوشه <code>static/</code>'],
        ['Media', 'تصویر محصول، فایل پروفایل', '<code>MEDIA_URL</code> و <code>MEDIA_ROOT</code>'],
      ])}
      ${c('python', [
        '# config/settings.py',
        'STATIC_URL = "static/"',
        'MEDIA_URL = "media/"',
        'MEDIA_ROOT = BASE_DIR / "media"',
        '',
        '# فقط در توسعه',
        '# config/urls.py',
        'from django.conf import settings',
        'from django.conf.urls.static import static',
        '',
        'urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)'
      ], 'تنظیم static/media')}
      ${c('html', [
        '{% load static %}',
        '',
        '<link rel="stylesheet" href="{% static "css/app.css" %}">',
        '<img src="{% static "images/logo.png" %}" alt="logo">'
      ], 'استفاده در template')}
      ${callout('info', 'فایل‌های آپلودی', 'در template برای تصویر آپلودی از <code>{{ post.cover.url }}</code> استفاده می‌شود که Django مسیر media را کامل می‌کند.')}
    `),

    s('View و Template', 'Form و Validation', 'فرم‌ها داده کاربر را امن‌تر و قابل اعتبارسنجی وارد سیستم می‌کنند.', `
      <p>Django Form از fieldهای تعریف‌شده، HTML فرم، validation و داده پاک‌سازی‌شده تولید می‌کند. برای مدل‌ها معمولا <code>ModelForm</code> بهترین شروع است.</p>
      ${c('python', [
        '# blog/forms.py',
        'from django import forms',
        'from .models import Post',
        '',
        'class PostForm(forms.ModelForm):',
        '    class Meta:',
        '        model = Post',
        '        fields = ["title", "slug", "body", "category", "is_published"]',
        '',
        '    def clean_title(self):',
        '        title = self.cleaned_data["title"].strip()',
        '        if len(title) < 5:',
        '            raise forms.ValidationError("عنوان باید حداقل ۵ کاراکتر باشد.")',
        '        return title'
      ], 'ModelForm')}
      ${c('python', [
        'class PostForm(forms.ModelForm):',
        '    class Meta:',
        '        model = Post',
        '        fields = ["title", "body"]',
        '        widgets = {',
        '            "body": forms.Textarea(attrs={"rows": 8, "placeholder": "متن مقاله..."}),',
        '        }',
      ], 'widget و attrs')}
      ${c('html', [
        '<form method="post">',
        '  {% csrf_token %}',
        '  {{ form.non_field_errors }}',
        '  {% for field in form %}',
        '    <div class="field">',
        '      {{ field.label_tag }}',
        '      {{ field }}',
        '      {{ field.errors }}',
        '      {% if field.help_text %}<small>{{ field.help_text }}</small>{% endif %}',
        '    </div>',
        '  {% endfor %}',
        '  <button type="submit">ذخیره</button>',
        '</form>'
      ], 'رندر دستی فرم')}
      ${callout('info', 'داده تمیز', 'بعد از <code>form.is_valid()</code>، مقدار پاک‌سازی‌شده هر فیلد در <code>form.cleaned_data["title"]</code> است؛ از <code>request.POST</code> مستقیم استفاده نکنید.')}
    `),

    s('View و Template', 'پردازش GET و POST', 'یک view فرم معمولا دو حالت دارد: نمایش فرم و دریافت فرم.', `
      ${c('python', [
        '# blog/views.py',
        'from django.shortcuts import redirect, render',
        'from .forms import PostForm',
        '',
        'def post_create(request):',
        '    if request.method == "POST":',
        '        form = PostForm(request.POST)',
        '        if form.is_valid():',
        '            post = form.save(commit=False)',
        '            post.author = request.user',
        '            post.save()',
        '            return redirect("post_detail", slug=post.slug)',
        '    else:',
        '        form = PostForm()',
        '',
        '    return render(request, "blog/post_form.html", {"form": form})'
      ], 'create view')}
      ${c('html', [
        '<form method="post">',
        '  {% csrf_token %}',
        '  {{ form.as_p }}',
        '  <button type="submit">ذخیره</button>',
        '</form>'
      ], 'post_form.html')}
      ${exercise('فرم تماس', 'متوسط', '<p>یک فرم تماس با name، email و message بسازید و اگر معتبر بود پیام موفقیت نمایش دهید.</p>', '<p>از <code>forms.Form</code> استفاده کنید، در view برای POST اعتبارسنجی کنید و بعد از موفقیت با <code>redirect</code> از ارسال دوباره فرم جلوگیری کنید.</p>')}
    `),

    s('View و Template', 'Converterهای URL', 'با converter، قسمت متغیر آدرس را با نوع مشخص می‌گیرید.', `
      <p>هر قسمت پویا از آدرس یک نوع دارد؛ converter هم آن را پارس می‌کند هم validation می‌کند و مقدار را با همان نوع به view می‌فرستد.</p>
      ${tbl(['Converter', 'نمونه', 'نوع ورودی view'], [
        ['<code>str</code>', '<code>&lt;str:name&gt;</code>', 'رشته بدون / (پیش‌فرض).'],
        ['<code>int</code>', '<code>&lt;int:pk&gt;</code>', 'عدد صحیح.'],
        ['<code>slug</code>', '<code>&lt;slug:slug&gt;</code>', 'رشته slug مثل start-django.'],
        ['<code>uuid</code>', '<code>&lt;uuid:code&gt;</code>', 'شناسه UUID.'],
        ['<code>path</code>', '<code>&lt;path:path&gt;</code>', 'هر چیزی شامل / (برای فایل).'],
      ])}
      ${c('python', [
        'urlpatterns = [',
        '    path("products/<int:pk>/", views.product_detail, name="product_detail"),',
        '    path("posts/<slug:slug>/", views.post_detail, name="post_detail"),',
        '    path("files/<path:path>/", views.serve_file, name="serve_file"),',
        ']',
        '',
        'def product_detail(request, pk):',
        '    # pk عدد صحیح است، نه رشته',
        '    product = get_object_or_404(Product, pk=pk)',
        '    return render(request, "shop/detail.html", {"product": product})',
      ], 'استفاده از converter')}
      ${callout('tip', 'ساخت آدرس', 'در template با <code>{% url "product_detail" product.pk %}</code> و در view با <code>reverse("product_detail", args=[product.pk])</code> آدرس ساخته می‌شود.')}
    `),

    s('View و Template', 'Tags و Filters کاربردی', 'Template language فقط نمایش است؛ با tags و filters داده را آماده نمایش کنید.', `
      ${tbl(['نحو', 'کاربرد'], [
        ['<code>{% for %}</code>', 'حلقه روی listها؛ همراه <code>{% empty %}</code>.'],
        ['<code>{% if %}</code>', 'شرط؛ همراه elif و else.'],
        ['<code>{% url %}</code>', 'ساخت آدرس از نام route.'],
        ['<code>{% csrf_token %}</code>', 'توکن امنیت در فرم‌های POST.'],
        ['<code>{{ value|date:"Y/m/d" }}</code>', 'قالب‌بندی تاریخ.'],
        ['<code>{{ text|truncatewords:25 }}</code>', 'کوتاه‌کردن متن در حد کلمه.'],
        ['<code>{{ text|linebreaks }}</code>', 'تبدیل خط جدید به <code>&lt;p&gt;</code>.'],
        ['<code>{{ items|length }}</code>', 'طول list یا رشته.'],
        ['<code>{{ x|default:"—" }}</code>', 'مقدار جایگزین وقتی خالی است.'],
      ])}
      ${c('html', [
        '{% for post in posts %}',
        '  <h2>{{ post.title }}</h2>',
        '  <p>{{ post.body|truncatewords:25|linebreaks }}</p>',
        '  <time>{{ post.created_at|date:"Y/m/d" }}</time>',
        '{% empty %}',
        '  <p>موردی نیست.</p>',
        '{% endfor %}',
      ], 'ترکیب tags و filters')}
      ${callout('warn', 'فیلتر safe', 'فیلتر <code>safe</code> یا <code>mark_safe</code> باعث می‌شود HTML داده کاربر اجرا شود و ریسک XSS دارد؛ فقط برای محتوای کاملا مطمئن استفاده کنید.')}
      ${exercise('نمایش تاریخ و متن', 'آسان', '<p>تاریخ را به فرمت سال/ماه/روز و متن را با محدودیت ۱۰ کلمه نمایش دهید.</p>', '<p><code>{{ post.created_at|date:"Y/m/d" }}</code> و <code>{{ post.body|truncatewords:10 }}</code></p>')}
    `),

    s('View و Template', 'انواع Response', 'هر view در نهایت یک HttpResponse برمی‌گرداند؛ ولی با راه‌های آماده.', `
      ${tbl(['کمک', 'کاربرد', 'خروجی'], [
        ['<code>render()</code>', 'ترکیب template با context', 'صفحه HTML کامل.'],
        ['<code>redirect()</code>', 'انتقال کاربر به آدرس دیگر', 'پاسخ 302 با Location.'],
        ['<code>HttpResponse</code>', 'پاسخ ساده با متن دلخواه', 'متن خام یا HTML.'],
        ['<code>JsonResponse</code>', 'پاسخ داده برای frontend/API', 'JSON با status 200.'],
        ['<code>get_object_or_404</code>', '404 خودکار اگر پیدا نشد', 'پاسخ 404.'],
      ])}
      ${c('python', [
        'from django.http import HttpResponse, JsonResponse',
        'from django.shortcuts import redirect, render',
        '',
        'def home(request):',
        '    return render(request, "home.html", {"posts": posts})',
        '',
        'def after_submit(request):',
        '    return redirect("home")',
        '',
        'def api_stats(request):',
        '    return JsonResponse({"count": Post.objects.count()})',
        '',
        'def raw(request):',
        '    return HttpResponse("<b>ساده</b>")',
      ], 'انواع response')}
      ${callout('info', 'انتخاب درست', 'اگر داده را تغییر می‌دهید، با <code>redirect</code> برگردید تا کاربر با refresh دوباره فرم را ارسال نکند (الگوی PRG).')}
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
        '            return redirect("home")',
        '    # ...',
      ], 'ارسال پیام')}
      ${c('html', [
        '{% if messages %}',
        '  <ul class="messages">',
        '    {% for message in messages %}',
        '      <li class="{{ message.tags }}">{{ message }}</li>',
        '    {% endfor %}',
        '  </ul>',
        '{% endif %}',
      ], 'نمایش پیام در base.html')}
      ${callout('info', 'انواع پیام', '<code>messages.success</code>، <code>error</code>، <code>warning</code> و <code>info</code> وجود دارد و کلاس <code>message.tags</code> برای استایل هر نوع آماده است.')}
    `)
  );
})(window);
