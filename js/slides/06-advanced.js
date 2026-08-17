(function (global) {
  'use strict';
  const { c, callout, exercise, tbl, slide: s } = global.DL;

  global.SLIDES.push(
    s('حرفه‌ای‌سازی', 'Class-Based Views', 'CBVها viewهای قابل ترکیب و قابل reuse هستند.', `
      <p>برای CRUDهای استاندارد، class-based viewها کد تکراری را کم می‌کنند. ابتدا function-based view را خوب بفهمید، سپس CBV را وارد کنید.</p>
      ${c('python', [
        'from django.views.generic import DetailView, ListView',
        'from .models import Post',
        '',
        'class PostListView(ListView):',
        '    model = Post',
        '    template_name = "blog/post_list.html"',
        '    context_object_name = "posts"',
        '    paginate_by = 10',
        '',
        '    def get_queryset(self):',
        '        return Post.objects.filter(is_published=True).select_related("author", "category")',
        '',
        'class PostDetailView(DetailView):',
        '    model = Post',
        '    template_name = "blog/post_detail.html"',
        '    context_object_name = "post"',
        '    slug_field = "slug"'
      ], 'CBV نمونه')}
    `),

    s('حرفه‌ای‌سازی', 'Pagination', 'لیست‌های بزرگ باید صفحه‌بندی شوند.', `
      ${c('python', [
        'from django.core.paginator import Paginator',
        'from django.shortcuts import render',
        '',
        'def post_list(request):',
        '    posts = Post.objects.filter(is_published=True)',
        '    paginator = Paginator(posts, 10)',
        '    page_number = request.GET.get("page")',
        '    page_obj = paginator.get_page(page_number)',
        '    return render(request, "blog/post_list.html", {"page_obj": page_obj})'
      ], 'pagination در FBV')}
      ${c('html', [
        '{% for post in page_obj %}',
        '  <h2>{{ post.title }}</h2>',
        '{% endfor %}',
        '',
        '{% if page_obj.has_previous %}',
        '  <a href="?page={{ page_obj.previous_page_number }}">قبلی</a>',
        '{% endif %}',
        '',
        '<span>{{ page_obj.number }} از {{ page_obj.paginator.num_pages }}</span>',
        '',
        '{% if page_obj.has_next %}',
        '  <a href="?page={{ page_obj.next_page_number }}">بعدی</a>',
        '{% endif %}'
      ], 'template صفحه‌بندی')}
    `),

    s('حرفه‌ای‌سازی', 'Testing در Django', 'تست تضمین می‌کند تغییرات بعدی رفتار فعلی را خراب نکند.', `
      ${c('python', [
        '# blog/tests.py',
        'from django.contrib.auth import get_user_model',
        'from django.test import TestCase',
        'from django.urls import reverse',
        'from .models import BlogCategory, Post',
        '',
        'class PostPagesTests(TestCase):',
        '    def setUp(self):',
        '        user = get_user_model().objects.create_user("ali", password="pass12345")',
        '        category = BlogCategory.objects.create(title="Django", slug="django")',
        '        self.post = Post.objects.create(',
        '            author=user, category=category, title="Test", slug="test",',
        '            summary="summary", body="body", is_published=True,',
        '        )',
        '',
        '    def test_post_detail_returns_200(self):',
        '        response = self.client.get(reverse("post_detail", args=[self.post.slug]))',
        '        self.assertEqual(response.status_code, 200)',
        '        self.assertContains(response, "Test")'
      ], 'تست صفحه مقاله')}
      ${c('bash', 'python manage.py test', 'اجرای تست‌ها')}
    `),

    s('حرفه‌ای‌سازی', 'Performance پایه', 'کندی اغلب از queryهای زیاد، فایل‌های سنگین یا نبود cache می‌آید.', `
      ${tbl(['مسئله', 'راهکار'], [
        ['N+1 query', '<code>select_related</code> برای ForeignKey و <code>prefetch_related</code> برای ManyToMany.'],
        ['لیست بزرگ', 'pagination و index دیتابیس.'],
        ['صفحه تکراری', 'cache صفحه یا fragment cache.'],
        ['فایل static/media', 'سرو از CDN یا web server، نه خود Django در production.'],
      ])}
      ${c('python', [
        'posts = Post.objects.filter(is_published=True).select_related("author", "category")',
        '',
        'products = Product.objects.filter(is_active=True).select_related("category")'
      ], 'کاهش query')}
    `),

    s('حرفه‌ای‌سازی', 'Logging و خطایابی', 'در production نباید با print خطا پیدا کنید.', `
      ${c('python', [
        'import logging',
        '',
        'logger = logging.getLogger(__name__)',
        '',
        'def cart_add(request, product_id):',
        '    product = get_object_or_404(Product, id=product_id, is_active=True)',
        '    logger.info("product_added_to_cart", extra={"product_id": product.id})',
        '    Cart(request).add(product)',
        '    return redirect("cart_detail")'
      ], 'استفاده از logger')}
      ${callout('info', 'اصل حرفه‌ای', 'پیام log باید قابل جست‌وجو باشد و داده حساس مثل password، token و اطلاعات کارت بانکی در log نیاید.')}
    `),

    s('حرفه‌ای‌سازی', 'Environment و تنظیمات امن', 'تنظیمات حساس را از کد جدا کنید.', `
      ${c('bash', [
        'export DJANGO_SECRET_KEY="change-me"',
        'export DJANGO_DEBUG="False"',
        'export DATABASE_URL="postgres://user:pass@localhost:5432/minishop"'
      ], 'نمونه env')}
      ${c('python', [
        '# config/settings.py',
        'import os',
        '',
        'SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]',
        'DEBUG = os.environ.get("DJANGO_DEBUG") == "True"',
        'ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "").split(",")'
      ], 'خواندن env')}
      ${callout('danger', 'نباید commit شود', '<code>.env</code>، فایل دیتابیس واقعی، secret key، token پرداخت و رمز سرویس‌ها نباید وارد git شوند.')}
    `),

    s('حرفه‌ای‌سازی', 'Deployment Checklist', 'قبل از انتشار، پروژه باید آماده production باشد.', `
      <ul>
        <li><code>DEBUG=False</code> و <code>ALLOWED_HOSTS</code> درست.</li>
        <li>Secretها در environment.</li>
        <li>دیتابیس production مثل PostgreSQL.</li>
        <li>اجرای <code>python manage.py collectstatic</code>.</li>
        <li>اجرای <code>python manage.py migrate</code> روی سرور.</li>
        <li>اجرای برنامه با WSGI/ASGI server مثل Gunicorn/Uvicorn پشت Nginx.</li>
        <li>فعال بودن HTTPS و تنظیمات secure cookie.</li>
        <li>backup دیتابیس و مانیتورینگ خطا.</li>
      </ul>
      ${c('bash', [
        'python manage.py check --deploy',
        'python manage.py collectstatic',
        'python manage.py migrate'
      ], 'دستورهای نهایی')}
    `),

    s('حرفه‌ای‌سازی', 'API با Django REST Framework', 'بعد از تسلط روی Django، می‌توانید API بسازید.', `
      <p>اگر frontend جدا مثل React/Vue یا اپ موبایل دارید، معمولا Django داده را از طریق API برمی‌گرداند. برای این مسیر، Django REST Framework گزینه رایج است.</p>
      ${c('python', [
        '# نمونه آموزشی بعد از نصب djangorestframework',
        'from rest_framework import serializers, viewsets',
        'from .models import Product',
        '',
        'class ProductSerializer(serializers.ModelSerializer):',
        '    class Meta:',
        '        model = Product',
        '        fields = ["id", "name", "slug", "price", "stock"]',
        '',
        'class ProductViewSet(viewsets.ReadOnlyModelViewSet):',
        '    queryset = Product.objects.filter(is_active=True)',
        '    serializer_class = ProductSerializer'
      ], 'DRF preview')}
      ${callout('warn', 'ترتیب یادگیری', 'API را بعد از فهم view، model، form، auth و permission شروع کنید؛ وگرنه فقط syntax یاد می‌گیرید نه طراحی web backend.')}
    `),

    s('حرفه‌ای‌سازی', 'Git پایه برای پروژه', 'Git تاریخچه تغییرات پروژه و همکاری تیمی را ممکن می‌کند.', `
      <p>با git می‌توانید هر تغییر را ثبت کنید، به حالت قبل برگردید و با تیم هماهنگ بمانید. برای یک پروژه آموزشی همین چند دستور پایه کافی است.</p>
      ${c('bash', [
        'git init',
        'git add .',
        'git commit -m "پروژه اولیه MiniShop Blog"',
        '',
        '# وضعیت فعلی',
        'git status',
        '# مشاهده تاریخچه',
        'git log --oneline',
      ], 'دستورهای پایه')}
      ${c('ini', [
        '.venv/',
        '__pycache__/',
        '*.pyc',
        'db.sqlite3',
        'media/',
        '.env',
        'staticfiles/',
      ], '.gitignore')}
      ${callout('danger', 'هرگز commit نکنید', '<code>.env</code>، secret key، دیتابیس و فایل‌های media نباید وارد git شوند؛ <code>.gitignore</code> جلویشان را می‌گیرد.')}
      ${exercise('اولین commit', 'آسان', '<p>برای پروژه خود <code>.gitignore</code> بسازید و اولین commit را ثبت کنید.</p>', '<p><code>git init</code>، سپس <code>git add .</code> و <code>git commit -m "..."</code>؛ قبل از add مطمئن شوید .gitignore درست است.</p>')}
    `),

    s('حرفه‌ای‌سازی', 'CBV برای Create/Update/Delete', 'برای فرم‌های CRUD، generic viewها کد را کوتاه می‌کنند.', `
      <p>CreateView، UpdateView و DeleteView ساخت فرم، ذخیره و redirect را خودکار انجام می‌دهند؛ فقط template و آدرس موفقیت را مشخص می‌کنید.</p>
      ${c('python', [
        'from django.contrib.auth.mixins import LoginRequiredMixin',
        'from django.urls import reverse_lazy',
        'from django.views.generic import CreateView, DeleteView, UpdateView',
        'from .models import Post',
        '',
        'class PostCreateView(LoginRequiredMixin, CreateView):',
        '    model = Post',
        '    fields = ["title", "slug", "summary", "body", "category", "is_published"]',
        '    template_name = "blog/post_form.html"',
        '',
        '    def form_valid(self, form):',
        '        form.instance.author = self.request.user',
        '        return super().form_valid(form)',
        '',
        'class PostUpdateView(LoginRequiredMixin, UpdateView):',
        '    model = Post',
        '    fields = ["title", "slug", "summary", "body", "category", "is_published"]',
        '    template_name = "blog/post_form.html"',
        '',
        'class PostDeleteView(LoginRequiredMixin, DeleteView):',
        '    model = Post',
        '    success_url = reverse_lazy("home")',
      ], 'CRUD با CBV')}
      ${callout('tip', 'redirect خودکار', 'بعد از موفقیت، CBV به <code>get_absolute_url</code> مدل می‌رود؛ برای حذف که مدل دیگر وجود ندارد، <code>success_url</code> لازم است.')}
    `),

    s('حرفه‌ای‌سازی', 'Cache کاربردی', 'صفحات تکراری را با cache سریع‌تر کنید.', `
      <p>cache نتیجه محاسبه را برای مدتی نگه می‌دارد؛ برای صفحه اصلی و بخش‌های پرترافیک مناسب است و از تکرار queryهای سنگین جلوگیری می‌کند.</p>
      ${c('python', [
        '# config/settings.py',
        'CACHES = {',
        '    "default": {',
        '        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",',
        '        "TIMEOUT": 300,',
        '    },',
        '}',
      ], 'تنظیم cache')}
      ${c('python', [
        'from django.views.decorators.cache import cache_page',
        '',
        '@cache_page(60 * 15)',
        'def home(request):',
        '    posts = Post.objects.filter(is_published=True)',
        '    return render(request, "blog/home.html", {"posts": posts})',
      ], 'cache کل صفحه')}
      ${c('html', [
        '{% load cache %}',
        '',
        '{% cache 300 latest_posts %}',
        '  {% for post in posts %}',
        '    <h2>{{ post.title }}</h2>',
        '  {% endfor %}',
        '{% endcache %}',
      ], 'fragment cache')}
      ${callout('info', 'تولید', 'در production به‌جای LocMemCache از Redis یا Memcached استفاده کنید؛ LocMem فقط در هر process به‌صورت جدا کار می‌کند.')}
    `),

    s('حرفه‌ای‌سازی', 'تست بیشتر', 'تست باید رفتار صفحه، فرم و مدل را پوشش دهد.', `
      <p>علاوه بر پاسخ صفحات، ورود کاربر، فرم‌ها و متدهای مدل را هم تست کنید. <code>setUpTestData</code> داده را یک‌بار برای کل کلاس می‌سازد و سرعت تست‌ها را بالا می‌برد.</p>
      ${c('python', [
        'from django.contrib.auth import get_user_model',
        'from django.test import TestCase',
        'from django.urls import reverse',
        'from .models import Post',
        '',
        'class PostCreateTests(TestCase):',
        '    @classmethod',
        '    def setUpTestData(cls):',
        '        cls.user = get_user_model().objects.create_user("ali", password="pass12345")',
        '',
        '    def test_redirects_anonymous_user(self):',
        '        response = self.client.get(reverse("post_create"))',
        '        self.assertEqual(response.status_code, 302)',
        '',
        '    def test_creates_post_for_logged_in_user(self):',
        '        self.client.login(username="ali", password="pass12345")',
        '        response = self.client.post(reverse("post_create"), {',
        '            "title": "Test", "slug": "test", "summary": "s", "body": "b",',
        '        })',
        '        self.assertEqual(Post.objects.count(), 1)',
        '        self.assertEqual(Post.objects.first().author, self.user)',
        '',
        '    def test_str_method(self):',
        '        post = Post(title="عنوان")',
        '        self.assertEqual(str(post), "عنوان")',
      ], 'تست ورود و فرم')}
      ${c('bash', 'python manage.py test', 'اجرای همه تست‌ها')}
    `),

    s('جمع‌بندی', 'برنامه تمرین ۳۰ روزه', 'برای تبدیل آموزش به مهارت، هر روز خروجی کوچک بسازید.', `
      ${tbl(['روزها', 'تمرکز'], [
        ['۱ تا ۴', 'HTTP، request/response، URL، status و اولین viewها.'],
        ['۵ تا ۸', 'project/app، template، static، فرم ساده.'],
        ['۹ تا ۱۴', 'model، migration، ORM، admin و relationها.'],
        ['۱۵ تا ۲۰', 'پروژه Blog: لیست، جزئیات، جست‌وجو، فرم نظر.'],
        ['۲۱ تا ۲۵', 'پروژه Shop: محصول، cart session، auth.'],
        ['۲۶ تا ۳۰', 'تست، امنیت، performance، deployment checklist.'],
      ])}
      ${exercise('پروژه نهایی', 'چالشی', '<p>MiniShop Blog را کامل کنید: حداقل ۵ مقاله، ۸ محصول، صفحه جست‌وجو، cart، signup/login و ۳ تست بنویسید.</p>', '<p>پروژه را feature به feature بسازید. بعد از هر feature، migration/test/runserver را اجرا کنید و خطاها را همان لحظه رفع کنید.</p>')}
    `)
  );
})(window);
