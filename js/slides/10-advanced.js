(function (global) {
  'use strict';
  const { c, callout, exercise, tbl, flow, slide: s, objectives, lab, checklist, quiz } = global.DL;

  global.SLIDES.push(
    s('حرفه‌ای‌سازی', 'Class-Based Views: چرا و کِی؟', 'CBV کد تکراری را حذف می‌کند — به قیمت کمی جادو.', `
      ${objectives([
        'بدانید کِی CBV بهتر از FBV است و کِی بدتر.',
        'با generic viewها فهرست، جزئیات و CRUD بسازید.',
        'صفحه‌بندی، cache و بهینه‌سازی عملکرد را اعمال کنید.',
        'تست‌های حرفه‌ای‌تر با پوشش سنجیده بنویسید.',
        'پروژه را برای فارسی‌سازی و API آماده کنید.',
      ])}
      ${tbl(['وضعیت', 'انتخاب بهتر'], [
        ['CRUD استاندارد روی یک مدل', '<strong>CBV</strong> — بیشترین صرفه‌جویی.'],
        ['منطق پیچیده و شرطی چندمرحله‌ای', '<strong>FBV</strong> — خواناتر و قابل ردگیری.'],
        ['چند مدل و چند فرم در یک صفحه', '<strong>FBV</strong>.'],
        ['رفتار مشترک بین چند view', '<strong>CBV</strong> با mixin.'],
        ['شما تازه‌کارید', '<strong>FBV</strong> تا وقتی چرخه request را کامل بفهمید.'],
      ])}
      ${callout('warn', 'هزینه پنهان CBV', 'در CBV بخش زیادی از کد شما نیست بلکه در کلاس والد است. وقتی رفتار غیرمنتظره دیدید باید بدانید کدام متد را باید override کنید. مرجع <em>Classy Class-Based Views</em> نقشه کامل این متدها را نشان می‌دهد.')}
    `),

    s('حرفه‌ای‌سازی', 'ListView و DetailView', 'همان صفحات پروژه، این بار با کلاس.', `
      ${c('python', [
        '# blog/views.py',
        'from django.views.generic import DetailView, ListView',
        'from .models import Post',
        '',
        '',
        'class PostListView(ListView):',
        '    template_name = "blog/post_list.html"',
        '    context_object_name = "posts"',
        '    paginate_by = 6',
        '',
        '    def get_queryset(self):',
        '        return Post.objects.published().with_relations()',
        '',
        '    def get_context_data(self, **kwargs):',
        '        context = super().get_context_data(**kwargs)',
        '        context["categories"] = Category.objects.all()',
        '        return context',
        '',
        '',
        'class PostDetailView(DetailView):',
        '    template_name = "blog/post_detail.html"',
        '    context_object_name = "post"',
        '    slug_field = "slug"',
        '    slug_url_kwarg = "slug"',
        '',
        '    def get_queryset(self):',
        '        return Post.objects.published().with_relations()',
      ], 'CBV نمونه')}
      ${c('python', [
        '# blog/urls.py',
        'path("posts/", views.PostListView.as_view(), name="post_list"),',
        'path("posts/<slug:slug>/", views.PostDetailView.as_view(), name="post_detail"),',
      ], 'اتصال به URL')}
      ${tbl(['متد قابل override', 'کارش'], [
        ['<code>get_queryset()</code>', 'تعیین داده‌ای که نمایش داده می‌شود — امن‌ترین جای فیلتر دسترسی.'],
        ['<code>get_context_data()</code>', 'افزودن داده اضافه به context.'],
        ['<code>get_object()</code>', 'تعیین شیء در DetailView/UpdateView.'],
        ['<code>get_template_names()</code>', 'انتخاب پویای قالب.'],
        ['<code>form_valid()</code>', 'کار اضافه بعد از اعتبارسنجی موفق فرم.'],
      ])}
      ${callout('info', 'با paginate_by چه چیزی به context می‌آید؟', 'خود Django متغیرهای <code>page_obj</code>، <code>paginator</code> و <code>is_paginated</code> را اضافه می‌کند؛ پس همان partial صفحه‌بندی پروژه بدون تغییر کار می‌کند.')}
    `),

    s('حرفه‌ای‌سازی', 'CBV برای Create/Update/Delete', 'کل CRUD در حدود ۲۰ خط.', `
      ${c('python', [
        'from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin',
        'from django.urls import reverse_lazy',
        'from django.views.generic import CreateView, DeleteView, UpdateView',
        'from .forms import PostForm',
        'from .models import Post',
        '',
        '',
        'class PostCreateView(LoginRequiredMixin, CreateView):',
        '    model = Post',
        '    form_class = PostForm',
        '    template_name = "blog/post_form.html"',
        '',
        '    def form_valid(self, form):',
        '        form.instance.author = self.request.user',
        '        return super().form_valid(form)',
        '',
        '',
        'class OwnerRequiredMixin(LoginRequiredMixin, UserPassesTestMixin):',
        '    """فقط مالک رکورد اجازه دارد — قابل استفاده در همه viewها."""',
        '',
        '    def test_func(self):',
        '        return self.get_object().author == self.request.user',
        '',
        '',
        'class PostUpdateView(OwnerRequiredMixin, UpdateView):',
        '    model = Post',
        '    form_class = PostForm',
        '    template_name = "blog/post_form.html"',
        '',
        '',
        'class PostDeleteView(OwnerRequiredMixin, DeleteView):',
        '    model = Post',
        '    template_name = "blog/post_confirm_delete.html"',
        '    success_url = reverse_lazy("accounts:dashboard")',
      ], 'CRUD با CBV')}
      ${tbl(['نکته', 'توضیح'], [
        ['<code>form_class</code> بهتر از <code>fields</code>', 'با ModelForm خودتان، اعتبارسنجی و widget هم دارید.'],
        ['<code>form_valid</code>', 'جای پرکردن فیلدهای سمت سرور مثل <code>author</code>.'],
        ['redirect بعد از موفقیت', 'از <code>get_absolute_url()</code> مدل؛ برای Delete چون شیء دیگر نیست، <code>success_url</code> لازم است.'],
        ['ترتیب mixinها', 'همیشه mixinهای دسترسی <strong>قبل از</strong> کلاس view اصلی بیایند.'],
      ])}
      ${callout('danger', 'UserPassesTestMixin و کاربر مهمان', 'اگر فقط <code>UserPassesTestMixin</code> بگذارید، کاربر مهمان ۴۰۳ می‌گیرد نه هدایت به صفحه ورود. ترکیب آن با <code>LoginRequiredMixin</code> — همان‌طور که در <code>OwnerRequiredMixin</code> بالا انجام شد — رفتار درست را می‌دهد.')}
    `),

    s('حرفه‌ای‌سازی', 'Cache کاربردی', 'صفحه‌ای که برای همه یکسان است، نباید هر بار ساخته شود.', `
      ${c('python', [
        '# config/settings.py — توسعه',
        'CACHES = {',
        '    "default": {',
        '        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",',
        '        "TIMEOUT": 300,',
        '    },',
        '}',
        '',
        '# production — Redis',
        '# CACHES = {',
        '#     "default": {',
        '#         "BACKEND": "django.core.cache.backends.redis.RedisCache",',
        '#         "LOCATION": os.environ["REDIS_URL"],',
        '#     },',
        '# }',
      ], 'تنظیم cache')}
      ${c('python', [
        '# ۱) کل صفحه',
        'from django.views.decorators.cache import cache_page',
        '',
        '@cache_page(60 * 15)',
        'def home(request):',
        '    ...',
        '',
        '# ۲) مقدار دلخواه',
        'from django.core.cache import cache',
        '',
        'def popular_posts():',
        '    posts = cache.get("popular_posts")',
        '    if posts is None:',
        '        posts = list(Post.objects.published().order_by("-views")[:5])',
        '        cache.set("popular_posts", posts, 60 * 10)',
        '    return posts',
      ], 'دو سطح cache')}
      ${c('html', [
        '<!-- ۳) بخشی از قالب -->',
        '{% load cache %}',
        '',
        '{% cache 300 sidebar request.user.username %}',
        '  ... محتوای سنگین سایدبار ...',
        '{% endcache %}',
      ], 'fragment cache')}
      ${callout('danger', 'صفحه شخصی را cache نکنید', 'اگر روی view سبد خرید یا داشبورد <code>@cache_page</code> بگذارید، ممکن است سبد یک کاربر به کاربر دیگر نمایش داده شود. cache فقط برای محتوای عمومی و یکسان است؛ در غیر این صورت کلید cache باید شامل شناسه کاربر باشد.')}
      ${callout('warn', 'LocMemCache در production', 'این backend در هر process جداست؛ با چند worker گانیکورن، هر کدام cache خودشان را دارند و نتیجه غیرقابل پیش‌بینی می‌شود. در production حتما Redis یا Memcached.')}
    `),

    s('حرفه‌ای‌سازی', 'بهینه‌سازی عملکرد', 'ترتیب درست: اول اندازه‌گیری، بعد بهینه‌سازی.', `
      ${flow(['اندازه‌گیری', 'یافتن گلوگاه', 'اصلاح', 'اندازه‌گیری دوباره'])}
      ${tbl(['مسئله', 'نشانه', 'راهکار'], [
        ['N+1 query', 'تعداد query با اندازه لیست زیاد می‌شود.', '<code>select_related</code> / <code>prefetch_related</code>.'],
        ['query بدون index', 'یک query تنها، کند است.', '<code>db_index=True</code> یا <code>Meta.indexes</code>.'],
        ['آوردن داده اضافه', 'حافظه بالا در لیست‌های بزرگ.', '<code>values()</code>، <code>only()</code>، <code>defer()</code>.'],
        ['شمارش گران', '<code>count()</code> روی جدول بزرگ.', 'cache یا شمارنده جدا.'],
        ['محاسبه در Python', 'حلقه روی هزاران رکورد.', '<code>aggregate</code> / <code>annotate</code>.'],
        ['فایل static سنگین از Django', 'کندی کل سایت.', 'WhiteNoise یا Nginx یا CDN.'],
        ['کار طولانی داخل request', 'کاربر منتظر می‌ماند.', 'صف پس‌زمینه (Celery / django-q).'],
      ])}
      ${c('python', [
        '# فقط ستون‌های لازم',
        'Post.objects.only("title", "slug")            # بقیه فیلدها تنبل بارگذاری می‌شوند',
        'Post.objects.defer("body")                    # فیلد سنگین را نیاور',
        'Post.objects.values_list("title", flat=True)  # بدون ساخت شیء مدل',
        '',
        '# درج گروهی به‌جای حلقه save()',
        'Product.objects.bulk_create(products, batch_size=500)',
        'Product.objects.bulk_update(products, ["price"], batch_size=500)',
        '',
        '# شمارش ارزان',
        'if Post.objects.filter(...).exists(): ...',
      ], 'ابزارهای بهینه‌سازی')}
      ${callout('warn', 'بهینه‌سازی زودهنگام', 'قبل از اینکه با Debug Toolbar ببینید کندی از کجاست، کد را پیچیده نکنید. اغلب یک <code>select_related</code> جاافتاده، کل مشکل است.')}
    `),

    s('حرفه‌ای‌سازی', 'Signal و کارهای پس‌زمینه', 'دو ابزار که خیلی زود از حد استفاده می‌شوند.', `
      ${c('python', [
        '# accounts/signals.py — ساخت خودکار پروفایل هنگام ساخت کاربر',
        'from django.conf import settings',
        'from django.db.models.signals import post_save',
        'from django.dispatch import receiver',
        'from .models import Profile',
        '',
        '',
        '@receiver(post_save, sender=settings.AUTH_USER_MODEL)',
        'def create_profile(sender, instance, created, **kwargs):',
        '    if created:',
        '        Profile.objects.create(user=instance)',
        '',
        '',
        '# accounts/apps.py — بدون این خط، signal اصلا اجرا نمی‌شود',
        'class AccountsConfig(AppConfig):',
        '    name = "accounts"',
        '',
        '    def ready(self):',
        '        from . import signals   # noqa',
      ], 'signal نمونه')}
      ${tbl(['signal پرکاربرد', 'کِی اجرا می‌شود'], [
        ['<code>pre_save</code> / <code>post_save</code>', 'قبل و بعد از ذخیره یک شیء.'],
        ['<code>pre_delete</code> / <code>post_delete</code>', 'قبل و بعد از حذف.'],
        ['<code>m2m_changed</code>', 'تغییر رابطه چند‌به‌چند.'],
        ['<code>user_logged_in</code>', 'ورود موفق کاربر.'],
      ])}
      ${callout('warn', 'signal را کم استفاده کنید', 'کد signal از جای دیگری اجرا می‌شود و ردیابی‌اش سخت است؛ آزمایش و اشکال‌زدایی را دشوار می‌کند. اگر می‌توانید همان کار را صریح در متد <code>save()</code> یا در یک تابع service بنویسید، همان بهتر است. signal برای اتصال بخش‌هایی است که نباید به هم وابسته باشند.')}
      ${c('python', [
        '# کار سنگین را از چرخه request بیرون ببرید',
        '# نصب: pip install celery redis',
        '',
        '# shop/tasks.py',
        'from celery import shared_task',
        '',
        '',
        '@shared_task',
        'def send_order_email(order_id):',
        '    order = Order.objects.get(pk=order_id)',
        '    # ارسال ایمیل ...',
        '',
        '',
        '# در view — کاربر منتظر ارسال ایمیل نمی‌ماند',
        'send_order_email.delay(order.pk)',
      ], 'کار پس‌زمینه با Celery')}
      ${callout('danger', 'ایمیل داخل view ممنوع', 'ارسال ایمیل، تولید PDF، فراخوانی API خارجی و پردازش تصویر همگی کند و شکننده‌اند. اگر داخل view باشند، کاربر ثانیه‌ها منتظر می‌ماند و با هر قطعی سرویس بیرونی، سفارش شما شکست می‌خورد.')}
    `),

    s('حرفه‌ای‌سازی', 'تست حرفه‌ای‌تر', 'از «تست دارم» به «تست‌های مفید دارم».', `
      ${c('python', [
        '# ساخت داده تست تمیز و بدون تکرار',
        'from django.test import TestCase',
        '',
        '',
        'class BaseTestCase(TestCase):',
        '    @classmethod',
        '    def setUpTestData(cls):',
        '        """یک بار برای کل کلاس اجرا می‌شود — بسیار سریع‌تر از setUp."""',
        '        cls.user = User.objects.create_user("ali", password="pass12345")',
        '',
        '    def login(self, username="ali", password="pass12345"):',
        '        self.client.login(username=username, password=password)',
      ], 'پایه مشترک تست‌ها')}
      ${c('python', [
        '# بررسی تعداد query — جلوگیری از بازگشت N+1',
        'def test_list_page_query_count(self):',
        '    with self.assertNumQueries(3):',
        '        self.client.get(reverse("blog:post_list"))',
        '',
        '# بررسی redirect',
        'def test_anonymous_redirected_to_login(self):',
        '    response = self.client.get(reverse("accounts:dashboard"))',
        '    self.assertRedirects(response, "/accounts/login/?next=/accounts/dashboard/")',
        '',
        '# بررسی قالب استفاده‌شده',
        'def test_uses_correct_template(self):',
        '    response = self.client.get(reverse("blog:home"))',
        '    self.assertTemplateUsed(response, "blog/home.html")',
        '',
        '# بررسی استثنا',
        'def test_cannot_order_without_stock(self):',
        '    with self.assertRaises(OutOfStock):',
        '        place_order(user=self.user, cart=self.empty_stock_cart, address="x")',
      ], 'assertهای کاربردی Django')}
      ${c('bash', [
        '# سنجش پوشش تست',
        'pip install coverage',
        'coverage run --source="." manage.py test',
        'coverage report -m',
        'coverage html          # گزارش قابل کلیک در htmlcov/index.html',
        '',
        '# اجرای موازی و سریع‌تر',
        'python manage.py test --parallel',
        '',
        '# نگه‌داشتن دیتابیس تست برای اجراهای بعدی',
        'python manage.py test --keepdb',
      ], 'ابزارهای تست')}
      ${callout('tip', 'هدف پوشش', 'عدد ۱۰۰ درصد هدف خوبی نیست. هدف این است که <em>مسیرهای حیاتی</em> پوشش داشته باشند: احراز هویت، دسترسی، پول و موجودی. پوشش ۷۰ تا ۸۰ درصد با تمرکز درست، بهتر از ۹۵ درصد پر از تست بی‌ارزش است.')}
    `),

    s('حرفه‌ای‌سازی', 'Git برای پروژه', 'تاریخچه تغییرات و کار تیمی.', `
      ${c('bash', [
        'git init',
        'git add .',
        'git commit -m "feat: initial MiniShop Blog project"',
        '',
        '# شاخه برای هر قابلیت',
        'git switch -c feature/cart',
        '# ... کد بزنید ...',
        'git add shop/cart.py shop/views.py',
        'git commit -m "feat(shop): add session-based cart"',
        'git switch main',
        'git merge feature/cart',
        '',
        '# وضعیت و تاریخچه',
        'git status',
        'git log --oneline --graph',
        'git diff',
      ], 'جریان کاری پایه')}
      ${c('ini', [
        '# .gitignore',
        '.venv/',
        '__pycache__/',
        '*.pyc',
        'db.sqlite3',
        'media/',
        'staticfiles/',
        '.env',
        '.DS_Store',
        '.idea/',
        '.vscode/',
        'htmlcov/',
        '.coverage',
      ], '.gitignore')}
      ${tbl(['commit شود؟', 'فایل'], [
        ['بله', 'کد، قالب‌ها، <code>migrations/</code>، <code>requirements.txt</code>، <code>.gitignore</code>'],
        ['خیر', '<code>.env</code>، <code>db.sqlite3</code>، <code>media/</code>، <code>.venv/</code>، <code>staticfiles/</code>'],
      ])}
      ${callout('danger', 'اگر secret را commit کردید', 'حذف فایل در commit بعدی کافی <strong>نیست</strong>؛ مقدار در تاریخچه باقی می‌ماند. تنها کار درست: بلافاصله کلید را در سرویس مربوطه باطل و جایگزین کنید.')}
      ${exercise('اولین commit', 'آسان', '<p>برای پروژه خود <code>.gitignore</code> بسازید، مطمئن شوید <code>db.sqlite3</code> در <code>git status</code> نیست و اولین commit را ثبت کنید.</p>', '<p>ابتدا <code>.gitignore</code> را بسازید، سپس <code>git init</code>، <code>git add .</code> و <code>git status</code> را بررسی کنید. اگر فایلی که نباید، در فهرست بود، آن را به <code>.gitignore</code> اضافه و با <code>git rm --cached &lt;file&gt;</code> از stage خارج کنید.</p>')}
    `),

    s('حرفه‌ای‌سازی', 'فارسی‌سازی و تاریخ شمسی', 'نکته‌ای که در دوره‌های انگلیسی پیدا نمی‌کنید.', `
      ${c('python', [
        '# config/settings.py',
        'LANGUAGE_CODE = "fa-ir"',
        'TIME_ZONE = "Asia/Tehran"',
        'USE_I18N = True',
        'USE_L10N = True',
        'USE_TZ = True',
      ], 'تنظیمات محلی')}
      ${c('python', [
        '# ترجمه رشته‌ها در کد',
        'from django.utils.translation import gettext_lazy as _',
        '',
        '',
        'class Post(models.Model):',
        '    title = models.CharField(max_length=200, verbose_name=_("عنوان"))',
        '',
        '    class Meta:',
        '        verbose_name = _("مقاله")',
        '        verbose_name_plural = _("مقاله‌ها")',
      ], 'gettext')}
      ${c('bash', [
        '# نمایش تاریخ شمسی',
        'pip install django-jalali-date',
        '# یا کتابخانه سبک‌تر:',
        'pip install jdatetime',
      ], 'تاریخ شمسی')}
      ${c('python', [
        '# blog/templatetags/blog_extras.py',
        'import jdatetime',
        'from django import template',
        'from django.utils import timezone',
        '',
        'register = template.Library()',
        '',
        '',
        '@register.filter',
        'def jalali(value, fmt="%Y/%m/%d"):',
        '    """DateTime میلادی را به رشته شمسی تبدیل می‌کند."""',
        '    if not value:',
        '        return ""',
        '    local = timezone.localtime(value)          # تبدیل UTC به وقت تهران',
        '    return jdatetime.datetime.fromgregorian(datetime=local).strftime(fmt)',
      ], 'فیلتر تاریخ شمسی')}
      ${c('html', [
        '{% load blog_extras %}',
        '<time>{{ post.published_at|jalali }}</time>       <!-- ۱۴۰۴/۰۶/۰۱ -->',
      ], 'استفاده')}
      ${callout('warn', 'ذخیره همیشه میلادی و UTC', 'تاریخ را شمسی <em>ذخیره نکنید</em>. با <code>USE_TZ=True</code> همه چیز به وقت UTC در دیتابیس می‌نشیند و فقط هنگام <strong>نمایش</strong> به شمسی و وقت محلی تبدیل می‌شود. این کار محاسبه، مرتب‌سازی و مقایسه تاریخ‌ها را سالم نگه می‌دارد.')}
      ${callout('tip', 'اعداد فارسی', 'برای نمایش ارقام فارسی یک فیلتر ساده بنویسید که کاراکترهای <code>0-9</code> را با معادل فارسی جایگزین کند — همان کاری که همین اسلایدها انجام می‌دهند.')}
    `),

    s('حرفه‌ای‌سازی', 'API با Django REST Framework', 'وقتی مصرف‌کننده، برنامه است نه مرورگر.', `
      <p>اگر frontend جدا (React/Vue) یا اپ موبایل دارید، Django به‌جای HTML، JSON برمی‌گرداند. DRF ابزار استاندارد این کار است.</p>
      ${c('bash', ['pip install djangorestframework'], 'نصب')}
      ${c('python', [
        '# shop/serializers.py',
        'from rest_framework import serializers',
        'from .models import Product',
        '',
        '',
        'class ProductSerializer(serializers.ModelSerializer):',
        '    category_title = serializers.CharField(source="category.title", read_only=True)',
        '',
        '    class Meta:',
        '        model = Product',
        '        fields = ["id", "name", "slug", "price", "stock", "category_title"]',
      ], 'serializer')}
      ${c('python', [
        '# shop/api.py',
        'from rest_framework import viewsets',
        'from rest_framework.permissions import IsAuthenticatedOrReadOnly',
        'from .models import Product',
        'from .serializers import ProductSerializer',
        '',
        '',
        'class ProductViewSet(viewsets.ReadOnlyModelViewSet):',
        '    queryset = Product.objects.active().select_related("category")',
        '    serializer_class = ProductSerializer',
        '    permission_classes = [IsAuthenticatedOrReadOnly]',
        '    lookup_field = "slug"',
      ], 'viewset')}
      ${c('python', [
        '# config/urls.py',
        'from rest_framework.routers import DefaultRouter',
        'from shop.api import ProductViewSet',
        '',
        'router = DefaultRouter()',
        'router.register("products", ProductViewSet, basename="product")',
        '',
        'urlpatterns += [path("api/", include(router.urls))]',
      ], 'مسیرهای API')}
      ${tbl(['آدرس', 'کار'], [
        ['<code>GET /api/products/</code>', 'فهرست محصولات (JSON).'],
        ['<code>GET /api/products/&lt;slug&gt;/</code>', 'یک محصول.'],
        ['<code>/api/</code>', 'صفحه قابل مرور DRF برای آزمایش.'],
      ])}
      ${callout('warn', 'ترتیب یادگیری', 'API را بعد از تسلط بر view، model، form، auth و permission شروع کنید؛ وگرنه فقط نحو DRF را یاد می‌گیرید، نه طراحی backend. همان مفاهیم دسترسی و اعتبارسنجی اینجا هم برقرارند — فقط خروجی JSON است.')}
    `),

    s('حرفه‌ای‌سازی', 'نقطه کنترل حرفه‌ای‌سازی', 'قبل از استقرار.', `
      ${checklist('روی پروژه خودتان', [
        'حداقل یک صفحه را با CBV بازنویسی کرده‌اید و تفاوت را می‌فهمید.',
        'صفحه‌بندی روی فهرست مقاله‌ها و محصولات فعال است.',
        'با Debug Toolbar تعداد query صفحه اصلی را اندازه گرفته و کم کرده‌اید.',
        'صفحه اصلی یا یک بخش سنگین cache می‌شود.',
        '<code>coverage report</code> اجرا شده و می‌دانید کدام بخش‌ها تست ندارند.',
        'پروژه در git است، <code>.gitignore</code> درست دارد و secret در تاریخچه نیست.',
        'تاریخ‌ها به شمسی نمایش داده می‌شوند.',
      ])}
      ${exercise('بهینه‌سازی واقعی', 'چالشی', `
        <p>روی صفحه فهرست مقاله‌ها این کارها را انجام دهید و نتیجه هر مرحله را با Debug Toolbar ثبت کنید:</p>
        <ol>
          <li>تعداد query فعلی را یادداشت کنید.</li>
          <li>عمدا <code>with_relations()</code> را بردارید و دوباره اندازه بگیرید.</li>
          <li>برگردانید و این بار نظرها را هم در همان صفحه نمایش دهید — ببینید چه اتفاقی می‌افتد.</li>
          <li>با <code>prefetch_related</code> رفعش کنید.</li>
          <li>یک تست با <code>assertNumQueries</code> بنویسید تا این بهینه‌سازی دوباره خراب نشود.</li>
        </ol>`,
        '<p>عدد نهایی باید ثابت بماند حتی اگر تعداد مقاله‌های صفحه از ۶ به ۶۰ برسد. اگر با افزایش تعداد، queryها هم زیاد شدند، هنوز یک N+1 باقی مانده است — معمولا در قالب و روی رابطه‌ای که در view آماده نشده.</p>')}
    `)
  );
})(window);
