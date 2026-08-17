(function (global) {
  'use strict';
  const { c, callout, exercise, tbl, slide: s } = global.DL;

  global.SLIDES.push(
    s('پروژه عملی', 'پروژه MiniShop Blog', 'یک سایت محتوایی همراه با فروشگاه کوچک می‌سازیم.', `
      <p>این پروژه برای آموزش انتخاب شده چون هم مفاهیم وبلاگ را دارد، هم مفاهیم فروشگاه: مقاله، دسته‌بندی، محصول، تصویر، سبد خرید ساده، فرم، ورود کاربر و admin.</p>
      ${tbl(['App', 'مسئولیت'], [
        ['<code>blog</code>', 'مقاله، دسته‌بندی، صفحه جزئیات، جست‌وجوی ساده.'],
        ['<code>shop</code>', 'محصول، دسته‌بندی محصول، سبد خرید session-based.'],
        ['<code>accounts</code>', 'ثبت‌نام، ورود، داشبورد کاربر.'],
      ])}
      ${c('bash', [
        'django-admin startproject config .',
        'python manage.py startapp blog',
        'python manage.py startapp shop',
        'python manage.py startapp accounts'
      ], 'ساخت appها')}
    `),

    s('پروژه عملی', 'مرحله ۱: تنظیمات پایه پروژه', 'زبان، timezone، appها، templateها و media را تنظیم می‌کنیم.', `
      ${c('python', [
        '# config/settings.py',
        'LANGUAGE_CODE = "fa-ir"',
        'TIME_ZONE = "Asia/Tehran"',
        'USE_I18N = True',
        'USE_TZ = True',
        '',
        'INSTALLED_APPS = [',
        '    # django apps ...',
        '    "blog",',
        '    "shop",',
        '    "accounts",',
        ']',
        '',
        'TEMPLATES[0]["DIRS"] = [BASE_DIR / "templates"]',
        '',
        'STATIC_URL = "static/"',
        'MEDIA_URL = "media/"',
        'MEDIA_ROOT = BASE_DIR / "media"'
      ], 'settings.py')}
      ${c('python', [
        '# config/urls.py',
        'from django.conf import settings',
        'from django.conf.urls.static import static',
        'from django.contrib import admin',
        'from django.urls import include, path',
        '',
        'urlpatterns = [',
        '    path("admin/", admin.site.urls),',
        '    path("", include("blog.urls")),',
        '    path("shop/", include("shop.urls")),',
        '    path("accounts/", include("accounts.urls")),',
        ']',
        '',
        'if settings.DEBUG:',
        '    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)'
      ], 'urls.py')}
    `),

    s('پروژه عملی', 'مرحله ۲: قالب مشترک base.html', 'همه صفحات از یک قالب پایه ارث می‌برند.', `
      <p>با یک base، منو، استایل و پیام‌ها در یکجا می‌مانند و هر صفحه فقط محتوای خودش را در <code>{% block content %}</code> می‌نویسد.</p>
      ${c('html', [
        '<!-- templates/base.html -->',
        '<!doctype html>',
        '<html lang="fa" dir="rtl">',
        '<head>',
        '  <meta charset="utf-8">',
        '  <meta name="viewport" content="width=device-width, initial-scale=1">',
        '  <title>{% block title %}MiniShop Blog{% endblock %}</title>',
        '  {% load static %}',
        '  <link rel="stylesheet" href="{% static "css/style.css" %}">',
        '</head>',
        '<body>',
        '  <header>',
        '    <nav>',
        '      <a href="{% url "home" %}">خانه</a>',
        '      <a href="{% url "product_list" %}">فروشگاه</a>',
        '      <a href="{% url "cart_detail" %}">سبد خرید</a>',
        '      {% if user.is_authenticated %}',
        '        <span>{{ user.username }}</span>',
        '      {% else %}',
        '        <a href="{% url "login" %}">ورود</a>',
        '      {% endif %}',
        '    </nav>',
        '  </header>',
        '',
        '  {% if messages %}',
        '    <ul class="messages">',
        '      {% for message in messages %}',
        '        <li class="{{ message.tags }}">{{ message }}</li>',
        '      {% endfor %}',
        '    </ul>',
        '  {% endif %}',
        '',
        '  <main>{% block content %}{% endblock %}</main>',
        '</body>',
        '</html>',
      ], 'templates/base.html')}
      ${callout('tip', 'چرا اول؟', 'با داشتن base، همه صفحات بعدی فقط <code>{% block content %}</code> را پیاده می‌کنند و منو و استایل یک‌جا می‌ماند.')}
    `),

    s('پروژه عملی', 'مرحله ۳: مدل‌های Blog', 'ابتدا داده‌های محتوایی را طراحی می‌کنیم.', `
      ${c('python', [
        '# blog/models.py',
        'from django.conf import settings',
        'from django.db import models',
        'from django.urls import reverse',
        '',
        'class BlogCategory(models.Model):',
        '    title = models.CharField(max_length=120)',
        '    slug = models.SlugField(unique=True)',
        '',
        '    def __str__(self):',
        '        return self.title',
        '',
        'class Post(models.Model):',
        '    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="posts")',
        '    category = models.ForeignKey(BlogCategory, on_delete=models.PROTECT, related_name="posts")',
        '    title = models.CharField(max_length=200)',
        '    slug = models.SlugField(unique=True)',
        '    summary = models.CharField(max_length=300)',
        '    body = models.TextField()',
        '    cover = models.ImageField(upload_to="posts/", blank=True)',
        '    is_published = models.BooleanField(default=False)',
        '    created_at = models.DateTimeField(auto_now_add=True)',
        '    updated_at = models.DateTimeField(auto_now=True)',
        '',
        '    class Meta:',
        '        ordering = ["-created_at"]',
        '',
        '    def get_absolute_url(self):',
        '        return reverse("post_detail", kwargs={"slug": self.slug})',
        '',
        '    def __str__(self):',
        '        return self.title'
      ], 'blog/models.py')}
    `),

    s('پروژه عملی', 'مرحله ۴: مدل‌های Shop', 'محصول و دسته‌بندی محصول را جدا از blog نگه می‌داریم.', `
      ${c('python', [
        '# shop/models.py',
        'from django.db import models',
        'from django.urls import reverse',
        '',
        'class ProductCategory(models.Model):',
        '    title = models.CharField(max_length=120)',
        '    slug = models.SlugField(unique=True)',
        '',
        '    def __str__(self):',
        '        return self.title',
        '',
        'class Product(models.Model):',
        '    category = models.ForeignKey(ProductCategory, on_delete=models.PROTECT, related_name="products")',
        '    name = models.CharField(max_length=180)',
        '    slug = models.SlugField(unique=True)',
        '    description = models.TextField()',
        '    image = models.ImageField(upload_to="products/", blank=True)',
        '    price = models.PositiveIntegerField()',
        '    stock = models.PositiveIntegerField(default=0)',
        '    is_active = models.BooleanField(default=True)',
        '    created_at = models.DateTimeField(auto_now_add=True)',
        '',
        '    class Meta:',
        '        ordering = ["-created_at"]',
        '',
        '    def get_absolute_url(self):',
        '        return reverse("product_detail", kwargs={"slug": self.slug})',
        '',
        '    def __str__(self):',
        '        return self.name'
      ], 'shop/models.py')}
      ${c('bash', [
        'python manage.py makemigrations',
        'python manage.py migrate'
      ], 'اعمال دیتابیس')}
    `),

    s('پروژه عملی', 'مرحله ۵: Admin پروژه', 'برای ورود داده اولیه، admin را حرفه‌ای‌تر می‌کنیم.', `
      ${c('python', [
        '# shop/admin.py',
        'from django.contrib import admin',
        'from .models import Product, ProductCategory',
        '',
        '@admin.register(ProductCategory)',
        'class ProductCategoryAdmin(admin.ModelAdmin):',
        '    list_display = ("title", "slug")',
        '    prepopulated_fields = {"slug": ("title",)}',
        '',
        '@admin.register(Product)',
        'class ProductAdmin(admin.ModelAdmin):',
        '    list_display = ("name", "category", "price", "stock", "is_active")',
        '    list_filter = ("category", "is_active")',
        '    search_fields = ("name", "description")',
        '    prepopulated_fields = {"slug": ("name",)}'
      ], 'shop/admin.py')}
      ${callout('tip', 'کار عملی', 'بعد از ساخت superuser، چند دسته، مقاله و محصول از admin وارد کنید تا صفحات عمومی داده واقعی داشته باشند.')}
    `),

    s('پروژه عملی', 'مرحله ۶: صفحات Blog', 'لیست و جزئیات مقاله را می‌سازیم.', `
      ${c('python', [
        '# blog/views.py',
        'from django.shortcuts import get_object_or_404, render',
        'from .models import Post',
        '',
        'def home(request):',
        '    posts = Post.objects.filter(is_published=True).select_related("category", "author")[:6]',
        '    return render(request, "blog/home.html", {"posts": posts})',
        '',
        'def post_detail(request, slug):',
        '    post = get_object_or_404(',
        '        Post.objects.select_related("category", "author"),',
        '        slug=slug,',
        '        is_published=True,',
        '    )',
        '    return render(request, "blog/post_detail.html", {"post": post})'
      ], 'blog/views.py')}
      ${c('python', [
        '# blog/urls.py',
        'from django.urls import path',
        'from . import views',
        '',
        'urlpatterns = [',
        '    path("", views.home, name="home"),',
        '    path("posts/<slug:slug>/", views.post_detail, name="post_detail"),',
        ']'
      ], 'blog/urls.py')}
    `),

    s('پروژه عملی', 'مرحله ۷: Template صفحه خانه', 'صفحه اصلی آخرین مقاله‌ها را نمایش می‌دهد.', `
      ${c('html', [
        '{% extends "base.html" %}',
        '',
        '{% block title %}خانه{% endblock %}',
        '',
        '{% block content %}',
        '  <section class="hero">',
        '    <h1>MiniShop Blog</h1>',
        '    <p>آموزش، مقاله و محصولات منتخب.</p>',
        '  </section>',
        '',
        '  <section class="grid">',
        '    {% for post in posts %}',
        '      <article class="card">',
        '        {% if post.cover %}<img src="{{ post.cover.url }}" alt="{{ post.title }}">{% endif %}',
        '        <span>{{ post.category.title }}</span>',
        '        <h2><a href="{{ post.get_absolute_url }}">{{ post.title }}</a></h2>',
        '        <p>{{ post.summary }}</p>',
        '      </article>',
        '    {% endfor %}',
        '  </section>',
        '{% endblock %}'
      ], 'templates/blog/home.html')}
      ${exercise('صفحه جزئیات', 'متوسط', '<p>برای <code>post_detail.html</code> عنوان، نویسنده، دسته، تصویر و متن کامل مقاله را نمایش دهید.</p>', '<p>از <code>{{ post.title }}</code>، <code>{{ post.author }}</code>، <code>{{ post.category.title }}</code> و شرط <code>{% if post.cover %}</code> استفاده کنید.</p>')}
    `),

    s('پروژه عملی', 'مرحله ۸: صفحات Shop', 'لیست محصولات و صفحه محصول را می‌سازیم.', `
      ${c('python', [
        '# shop/views.py',
        'from django.shortcuts import get_object_or_404, render',
        'from .models import Product',
        '',
        'def product_list(request):',
        '    products = Product.objects.filter(is_active=True).select_related("category")',
        '    return render(request, "shop/product_list.html", {"products": products})',
        '',
        'def product_detail(request, slug):',
        '    product = get_object_or_404(Product, slug=slug, is_active=True)',
        '    return render(request, "shop/product_detail.html", {"product": product})'
      ], 'shop/views.py')}
      ${c('python', [
        '# shop/urls.py',
        'from django.urls import path',
        'from . import views',
        '',
        'urlpatterns = [',
        '    path("", views.product_list, name="product_list"),',
        '    path("<slug:slug>/", views.product_detail, name="product_detail"),',
        ']'
      ], 'shop/urls.py')}
    `),

    s('پروژه عملی', 'مرحله ۹: سبد خرید ساده با Session', 'برای آموزش، cart را بدون مدل دیتابیس و داخل session می‌سازیم.', `
      ${c('python', [
        '# shop/cart.py',
        'class Cart:',
        '    def __init__(self, request):',
        '        self.session = request.session',
        '        self.items = self.session.setdefault("cart", {})',
        '',
        '    def add(self, product, quantity=1):',
        '        key = str(product.id)',
        '        current = self.items.get(key, {"quantity": 0, "price": product.price})',
        '        current["quantity"] += quantity',
        '        current["price"] = product.price',
        '        self.items[key] = current',
        '        self.session.modified = True',
        '',
        '    def remove(self, product):',
        '        self.items.pop(str(product.id), None)',
        '        self.session.modified = True',
        '',
        '    def total(self):',
        '        return sum(item["price"] * item["quantity"] for item in self.items.values())'
      ], 'shop/cart.py')}
    `),

    s('پروژه عملی', 'مرحله ۱۰: افزودن محصول به سبد', 'POST برای عملیاتی که داده را تغییر می‌دهد.', `
      ${c('python', [
        '# shop/views.py',
        'from django.shortcuts import get_object_or_404, redirect, render',
        'from .cart import Cart',
        'from .models import Product',
        '',
        'def cart_add(request, product_id):',
        '    product = get_object_or_404(Product, id=product_id, is_active=True)',
        '    cart = Cart(request)',
        '    cart.add(product, quantity=1)',
        '    return redirect("cart_detail")',
        '',
        'def cart_detail(request):',
        '    cart = Cart(request)',
        '    return render(request, "shop/cart_detail.html", {"cart": cart})'
      ], 'cart views')}
      ${c('html', [
        '<form method="post" action="{% url "cart_add" product.id %}">',
        '  {% csrf_token %}',
        '  <button type="submit">افزودن به سبد</button>',
        '</form>'
      ], 'دکمه افزودن')}
    `),

    s('پروژه عملی', 'مرحله ۱۱: cart_detail و تکمیل سبد', 'viewهای سبد آماده‌اند؛ حالا صفحه نمایش سبد را می‌سازیم.', `
      <p>سبد باید محصولات، تعداد، جمع کل و امکان حذف را نشان دهد. دقت کنید کلید هر آیتم در session، رشته‌ای از product.id است.</p>
      ${c('html', [
        '{% extends "base.html" %}',
        '',
        '{% block title %}سبد خرید{% endblock %}',
        '',
        '{% block content %}',
        '  <h1>سبد خرید</h1>',
        '  {% if cart.items %}',
        '    <table>',
        '      <tr><th>محصول</th><th>تعداد</th><th>قیمت</th><th></th></tr>',
        '      {% for key, item in cart.items.items %}',
        '        <tr>',
        '          <td>{{ item.name }}</td>',
        '          <td>{{ item.quantity }}</td>',
        '          <td>{{ item.price }}</td>',
        '          <td>',
        '            <form method="post" action="{% url "cart_remove" key %}">',
        '              {% csrf_token %}',
        '              <button type="submit">حذف</button>',
        '            </form>',
        '          </td>',
        '        </tr>',
        '      {% endfor %}',
        '    </table>',
        '    <p>جمع کل: {{ cart.total }}</p>',
        '  {% else %}',
        '    <p>سبد خرید خالی است.</p>',
        '  {% endif %}',
        '{% endblock %}',
      ], 'templates/shop/cart_detail.html')}
      ${c('python', [
        '# shop/views.py',
        'def cart_remove(request, product_id):',
        '    product = get_object_or_404(Product, id=product_id)',
        '    cart = Cart(request)',
        '    cart.remove(product)',
        '    return redirect("cart_detail")',
      ], 'حذف از سبد')}
      ${callout('warn', 'توجه', 'برای نمایش نام محصول در سبد، هنگام افزودن، <code>name</code> را هم در session ذخیره کنید؛ یعنی در <code>Cart.add</code> خط <code>item["name"] = product.name</code> را اضافه کنید.')}
    `),

    s('پروژه عملی', 'مرحله ۱۲: ثبت‌نام کاربر', 'برای accounts یک فرم ساده روی UserCreationForm می‌سازیم.', `
      ${c('python', [
        '# accounts/views.py',
        'from django.contrib.auth import login',
        'from django.contrib.auth.forms import UserCreationForm',
        'from django.shortcuts import redirect, render',
        '',
        'def signup(request):',
        '    if request.method == "POST":',
        '        form = UserCreationForm(request.POST)',
        '        if form.is_valid():',
        '            user = form.save()',
        '            login(request, user)',
        '            return redirect("home")',
        '    else:',
        '        form = UserCreationForm()',
        '    return render(request, "accounts/signup.html", {"form": form})'
      ], 'signup view')}
      ${c('python', [
        '# accounts/urls.py',
        'from django.urls import path',
        'from . import views',
        '',
        'urlpatterns = [',
        '    path("signup/", views.signup, name="signup"),',
        ']'
      ], 'accounts/urls.py')}
    `),

    s('پروژه عملی', 'مرحله ۱۳: ورود و خروج کامل', 'viewهای آماده ورود/خروج Django را به قالب و تنظیمات وصل می‌کنیم.', `
      <p>با تنظیم <code>LOGIN_URL</code> و <code>LOGIN_REDIRECT_URL</code>، کاربر بدون ورود به صفحه داشبورد هدایت می‌شود و بعد از ورود به مقصد برمی‌گردد.</p>
      ${c('python', [
        '# config/settings.py',
        'LOGIN_URL = "login"',
        'LOGIN_REDIRECT_URL = "dashboard"',
        'LOGOUT_REDIRECT_URL = "home"',
      ], 'تنظیمات ورود')}
      ${c('python', [
        '# accounts/urls.py',
        'from django.contrib.auth import views as auth_views',
        'from django.urls import path',
        'from . import views',
        '',
        'urlpatterns = [',
        '    path("login/", auth_views.LoginView.as_view(template_name="accounts/login.html"), name="login"),',
        '    path("logout/", auth_views.LogoutView.as_view(), name="logout"),',
        '    path("signup/", views.signup, name="signup"),',
        '    path("dashboard/", views.dashboard, name="dashboard"),',
        ']',
      ], 'accounts/urls.py')}
      ${c('html', [
        '{% extends "base.html" %}',
        '',
        '{% block content %}',
        '  <h1>ورود</h1>',
        '  <form method="post">',
        '    {% csrf_token %}',
        '    {{ form.as_p }}',
        '    <button type="submit">ورود</button>',
        '  </form>',
        '{% endblock %}',
      ], 'templates/accounts/login.html')}
      ${exercise('داشبورد کاربر', 'متوسط', '<p>یک view به نام dashboard بسازید که فقط مقاله‌های کاربر واردشده را با <code>login_required</code> نمایش دهد.</p>', '<p>با <code>@login_required</code> روی view و <code>request.user.posts.all()</code> مقاله‌های کاربر را بخوانید و در قالب نمایش دهید.</p>')}
    `),

    s('پروژه عملی', 'مرحله ۱۴: جست‌وجو', 'جست‌وجوی ساده با query string و ORM.', `
      ${c('python', [
        '# blog/views.py',
        'from django.db.models import Q',
        '',
        'def search(request):',
        '    query = request.GET.get("q", "").strip()',
        '    posts = Post.objects.none()',
        '    if query:',
        '        posts = Post.objects.filter(',
        '            Q(title__icontains=query) | Q(summary__icontains=query) | Q(body__icontains=query),',
        '            is_published=True,',
        '        )',
        '    return render(request, "blog/search.html", {"query": query, "posts": posts})'
      ], 'search view')}
      ${c('html', [
        '<form method="get" action="{% url "search" %}">',
        '  <input type="search" name="q" value="{{ query }}" placeholder="جست‌وجو...">',
        '  <button type="submit">جست‌وجو</button>',
        '</form>'
      ], 'search form')}
      ${exercise('فیلتر محصول', 'متوسط', '<p>در فروشگاه، اگر پارامتر <code>?category=slug</code> وجود داشت، محصولات همان دسته را نمایش دهید.</p>', '<p>در view مقدار <code>request.GET.get("category")</code> را بخوانید و اگر وجود داشت <code>products.filter(category__slug=category)</code> را اعمال کنید.</p>')}
    `),

    s('پروژه عملی', 'مرحله ۱۵: صفحات خطا', 'به کاربران صفحه‌های خطای تمیز و مرتب نشان دهید.', `
      <p>Django برای خطای 404 و 500، templateهایی با همین نام‌ها از پوشه templates برمی‌دارد؛ اگر نباشند، صفحه پیش‌فرض نمایش داده می‌شود.</p>
      ${c('html', [
        '<!-- templates/404.html -->',
        '{% extends "base.html" %}',
        '',
        '{% block title %}صفحه پیدا نشد{% endblock %}',
        '',
        '{% block content %}',
        '  <h1>۴۰۴</h1>',
        '  <p>صفحه‌ای که دنبالش بودید وجود ندارد.</p>',
        '  <a href="{% url "home" %}">بازگشت به خانه</a>',
        '{% endblock %}',
      ], 'templates/404.html')}
      ${c('html', [
        '<!-- templates/500.html -->',
        '{% extends "base.html" %}',
        '',
        '{% block content %}',
        '  <h1>خطای سرور</h1>',
        '  <p>مشکلی پیش آمده؛ بعدا دوباره تلاش کنید.</p>',
        '{% endblock %}',
      ], 'templates/500.html')}
      ${callout('info', 'نکته', 'صفحه 500 باید ساده و بدون وابستگی باشد چون ممکن است خود templateها خطا داشته باشند؛ نمایش آن فقط با <code>DEBUG=False</code> دیده می‌شود.')}
    `),

    s('پروژه عملی', 'مرحله ۱۶: مسیر بعدی پروژه', 'بعد از نسخه آموزشی، پروژه را حرفه‌ای‌تر کنید.', `
      <ul>
        <li>برای سفارش واقعی مدل‌های <code>Order</code> و <code>OrderItem</code> بسازید.</li>
        <li>برای پرداخت، gateway را در service جدا پیاده کنید.</li>
        <li>برای مقاله‌ها pagination اضافه کنید.</li>
        <li>برای محصول‌ها تصویر اجباری، قیمت معتبر و stock logic بنویسید.</li>
        <li>برای dashboard، viewهای کاربر را با <code>login_required</code> محافظت کنید.</li>
      </ul>
      ${callout('tip', 'قانون پروژه واقعی', 'هر feature را کوچک بسازید، migrate و تست کنید، بعد feature بعدی را اضافه کنید. این روش برای مبتدی‌ها از انباشت خطا جلوگیری می‌کند.')}
    `)
  );
})(window);
