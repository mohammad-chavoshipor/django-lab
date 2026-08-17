(function (global) {
  'use strict';
  const { c, callout, exercise, tbl, slide: s } = global.DL;

  global.SLIDES.push(
    s('مدل و دیتابیس', 'Model چیست؟', 'Model کلاس Python است که ساختار داده را به جدول دیتابیس تبدیل می‌کند.', `
      <p>در Django به جای ساخت مستقیم جدول با SQL، یک کلاس می‌نویسیم. Django از روی این کلاس migration می‌سازد و جدول را در دیتابیس ایجاد یا تغییر می‌دهد.</p>
      ${c('python', [
        '# blog/models.py',
        'from django.db import models',
        '',
        'class Post(models.Model):',
        '    title = models.CharField(max_length=200)',
        '    slug = models.SlugField(max_length=220, unique=True)',
        '    body = models.TextField()',
        '    is_published = models.BooleanField(default=False)',
        '    created_at = models.DateTimeField(auto_now_add=True)',
        '',
        '    def __str__(self):',
        '        return self.title'
      ], 'مدل مقاله')}
      ${callout('info', 'معنی فیلدها', 'هر field مثل CharField یا DateTimeField به یک ستون دیتابیس تبدیل می‌شود و همزمان validation پایه را هم تعریف می‌کند.')}
    `),

    s('مدل و دیتابیس', 'Migration چیست؟', 'Migration نسخه‌بندی تغییرات دیتابیس است.', `
      <p>وقتی model را تغییر می‌دهید، دیتابیس خودکار تغییر نمی‌کند. ابتدا migration ساخته می‌شود، سپس روی دیتابیس اعمال می‌شود. این روند برای تیم و production قابل ردیابی است.</p>
      ${c('bash', [
        'python manage.py makemigrations',
        'python manage.py migrate',
        'python manage.py showmigrations'
      ], 'دستورهای migration')}
      ${tbl(['دستور', 'وظیفه'], [
        ['<code>makemigrations</code>', 'تبدیل تغییرات model به فایل migration.'],
        ['<code>migrate</code>', 'اعمال migrationها روی دیتابیس.'],
        ['<code>showmigrations</code>', 'دیدن وضعیت اجرا شدن migrationها.'],
      ])}
    `),

    s('مدل و دیتابیس', 'ORM چیست؟', 'ORM پلی بین objectهای Python و جدول‌های دیتابیس است.', `
      <p>با ORM می‌توانید بدون نوشتن SQL خام، داده بسازید، بخوانید، فیلتر کنید، مرتب کنید و حذف کنید. Django در پشت صحنه query مناسب دیتابیس را می‌سازد.</p>
      ${c('python', [
        'from blog.models import Post',
        '',
        '# Create',
        'post = Post.objects.create(',
        '    title="شروع جنگو",',
        '    slug="start-django",',
        '    body="متن مقاله",',
        '    is_published=True,',
        ')',
        '',
        '# Read',
        'published = Post.objects.filter(is_published=True).order_by("-created_at")',
        '',
        '# Update',
        'post.title = "شروع حرفه‌ای جنگو"',
        'post.save()',
        '',
        '# Delete',
        'post.delete()'
      ], 'CRUD با ORM')}
    `),

    s('مدل و دیتابیس', 'Relation در مدل‌ها', 'پروژه واقعی تقریبا همیشه رابطه بین داده‌ها دارد.', `
      <p>مقاله نویسنده دارد، محصول دسته‌بندی دارد، سفارش چند آیتم دارد. Django این رابطه‌ها را با fieldهای رابطه‌ای مدل می‌کند.</p>
      ${c('python', [
        'from django.conf import settings',
        'from django.db import models',
        '',
        'class Category(models.Model):',
        '    name = models.CharField(max_length=120)',
        '    slug = models.SlugField(unique=True)',
        '',
        'class Post(models.Model):',
        '    author = models.ForeignKey(',
        '        settings.AUTH_USER_MODEL,',
        '        on_delete=models.CASCADE,',
        '        related_name="posts"',
        '    )',
        '    category = models.ForeignKey(Category, on_delete=models.PROTECT)',
        '    title = models.CharField(max_length=200)'
      ], 'ForeignKey')}
      ${tbl(['فیلد رابطه', 'نوع رابطه', 'مثال'], [
        ['<code>ForeignKey</code>', 'چند به یک', 'هر مقاله یک نویسنده؛ هر نویسنده چند مقاله.'],
        ['<code>OneToOneField</code>', 'یک به یک', 'هر کاربر یک پروفایل؛ هر پروفایل یک کاربر.'],
        ['<code>ManyToManyField</code>', 'چند به چند', 'هر مقاله چند برچسب؛ هر برچسب چند مقاله.'],
      ])}
      ${callout('info', 'related_name', '<code>related_name</code> نام رابطه معکوس را مشخص می‌کند؛ مثلا <code>user.posts.all()</code>. بدون آن، پیش‌فرض <code>user.post_set.all()</code> است.')}
      ${callout('warn', 'on_delete', 'هر ForeignKey به <code>on_delete</code> نیاز دارد؛ همه گزینه‌ها در اسلاید بعدی توضیح داده می‌شوند.')}
    `),

    s('مدل و دیتابیس', 'انواع فیلدهای مدل', 'هر نیاز داده‌ای، یک فیلد مناسب دارد.', `
      <p>Django برای متن، عدد، تاریخ، فایل و رابطه فیلد آماده دارد. نوع فیلد هم ستون دیتابیس را تعیین می‌کند و هم validation و داده پاک‌سازی‌شده فرم را.</p>
      ${tbl(['فیلد', 'ستون دیتابیس', 'کاربرد'], [
        ['<code>CharField</code>', 'VARCHAR(n)', 'متن کوتاه؛ حتما <code>max_length</code> لازم دارد.'],
        ['<code>TextField</code>', 'TEXT', 'متن بلند مثل بدنه مقاله.'],
        ['<code>SlugField</code>', 'VARCHAR(n)', 'آدرس URL تمیز؛ معمولا از عنوان ساخته می‌شود.'],
        ['<code>IntegerField</code>', 'INTEGER', 'عدد صحیح.'],
        ['<code>PositiveIntegerField</code>', 'INTEGER', 'عدد صحیح غیرمنفی مثل قیمت و موجودی.'],
        ['<code>DecimalField</code>', 'NUMERIC', 'عدد دقیق اعشاری؛ <code>max_digits</code> و <code>decimal_places</code> لازم دارد.'],
        ['<code>BooleanField</code>', 'BOOL', 'درست/نادرست مثل is_published.'],
        ['<code>DateField</code> / <code>DateTimeField</code>', 'DATE / TIMESTAMP', 'تاریخ و زمان؛ از <code>auto_now</code> و <code>auto_now_add</code> هم پشتیبانی می‌کند.'],
        ['<code>EmailField</code>', 'VARCHAR(n)', 'ایمیل با validation آماده.'],
        ['<code>URLField</code>', 'VARCHAR(n)', 'آدرس اینترنتی با validation آماده.'],
        ['<code>ImageField</code>', 'VARCHAR(n)', 'تصویر آپلودی؛ <code>upload_to</code> لازم دارد.'],
        ['<code>JSONField</code>', 'JSON', 'داده ساختاریافته مثل تنظیمات.'],
        ['<code>ForeignKey</code> / <code>OneToOneField</code> / <code>ManyToManyField</code>', 'FK / UNIQUE FK / جدول واسط', 'رابطه بین مدل‌ها.'],
      ])}
      ${c('python', [
        'class Product(models.Model):',
        '    name = models.CharField(max_length=180)',
        '    price = models.DecimalField(max_digits=10, decimal_places=2)',
        '    stock = models.PositiveIntegerField(default=0)',
        '    available = models.BooleanField(default=True)',
        '    published_at = models.DateTimeField(auto_now_add=True)',
        '    meta = models.JSONField(default=dict, blank=True)',
      ], 'نمونه فیلدهای متنوع')}
      ${exercise('انتخاب فیلد', 'آسان', '<p>برای «قیمت دقیق محصول» و «آدرس وب‌سایت فروشگاه» چه فیلدی مناسب است؟</p>', '<p><code>DecimalField(max_digits=10, decimal_places=2)</code> برای قیمت و <code>URLField()</code> برای آدرس وب‌سایت؛ چون قیمت اعشاری است نباید با FloatField ذخیره شود.</p>')}
    `),

    s('مدل و دیتابیس', 'آپشن‌های فیلد', 'آپشن‌ها رفتار فیلد را در دیتابیس و فرم تعیین می‌کنند.', `
      <p>بعضی آپشن‌ها اجباری هستند (مثل <code>max_length</code> برای CharField) و بقیه اختیاری. هر آپشن یک رفتار مشخص دارد؛ انتخاب درست آن‌ها داده تمیزتری می‌سازد.</p>
      ${tbl(['آپشن', 'اجباری؟', 'اثر'], [
        ['<code>max_length</code>', 'بله (برای CharField و SlugField)', 'حداکثر طول متن در دیتابیس و validation فرم.'],
        ['<code>on_delete</code>', 'بله (برای ForeignKey و OneToOneField)', 'رفتار حذف رکورد مرتبط.'],
        ['<code>null</code>', 'خیر', 'اجازه مقدار NULL در دیتابیس؛ معمولا برای فیلدهای غیرمتنی.'],
        ['<code>blank</code>', 'خیر', 'اجازه خالی بودن در فرم؛ مربوط به validation است نه دیتابیس.'],
        ['<code>default</code>', 'خیر', 'مقدار پیش‌فرض وقتی مقداری داده نشود.'],
        ['<code>unique</code>', 'خیر', 'جلوگیری از تکرار مقدار؛ مثل slug.'],
        ['<code>choices</code>', 'خیر', 'محدود کردن مقدار به گزینه‌های مشخص.'],
        ['<code>auto_now</code>', 'خیر', 'به‌روزرسانی خودکار تاریخ با هر save (مثل updated_at).'],
        ['<code>auto_now_add</code>', 'خیر', 'ثبت تاریخ فقط هنگام ساخت (مثل created_at).'],
        ['<code>db_index</code>', 'خیر', 'ساخت index دیتابیس برای جست‌وجوی سریع‌تر.'],
        ['<code>verbose_name</code>', 'خیر', 'نام نمایشی در admin و فرم.'],
      ])}
      ${callout('warn', 'فرق null و blank', '<code>null=True</code> یعنی دیتابیس می‌تواند NULL داشته باشد؛ <code>blank=True</code> یعنی فرم اجازه خالی گذاشتن دارد. برای متن معمولا <code>blank=True</code> بدون <code>null=True</code> کافی است چون Django رشته خالی را ذخیره می‌کند.')}
      ${c('python', [
        'class Post(models.Model):',
        '    title = models.CharField(max_length=200, verbose_name="عنوان")',
        '    slug = models.SlugField(unique=True)',
        '    summary = models.CharField(max_length=300, blank=True)',
        '    status = models.CharField(',
        '        max_length=10,',
        '        choices=[("draft", "پیش‌نویس"), ("published", "منتشرشده")],',
        '        default="draft",',
        '    )',
      ], 'استفاده از آپشن‌ها')}
    `),

    s('مدل و دیتابیس', 'افزودن فیلد به مدل موجود', 'هر فیلد جدید باید برای ردیف‌های قبلی هم مقدار داشته باشد.', `
      <p>فیلدها به طور پیش‌فرض اجباری هستند (NOT NULL). وقتی فیلدی را به مدلی اضافه می‌کنید که ردیف دارد، <code>makemigrations</code> از شما می‌پرسد ردیف‌های موجود چه مقداری بگیرند.</p>
      ${c('bash', [
        '$ python manage.py makemigrations',
        'You are trying to add a non-nullable field "stock"',
        'to product without a default; we cannot do that.',
        'Please select a fix:',
        ' 1) Provide a one-off default now',
        ' 2) Quit and change the field to nullable (null=True)',
      ], 'پرسش تعاملی migration')}
      ${callout('warn', 'راه درست', 'اگر فیلد واقعا اختیاری است <code>null=True</code> یا <code>blank=True</code> بدهید؛ اگر اجباری است <code>default</code> معقول تعریف کنید تا ردیف‌های قبلی مقدار بگیرند.')}
      ${c('python', [
        '# قبل از makemigrations، در مدل تعریف کنید:',
        'stock = models.PositiveIntegerField(default=0)',
        '# یا برای فیلد اختیاری:',
        'note = models.TextField(blank=True, default="")',
      ], 'تعریف درست فیلد جدید')}
    `),

    s('مدل و دیتابیس', 'on_delete به زبان ساده', 'وقتی رکورد والد حذف شود، رکوردهای فرزند چه می‌شوند؟', `
      <p><code>on_delete</code> فقط مخصوص فیلدهای رابطه‌ای است و مشخص می‌کند با حذف رکورد والد، رکوردهای وابسته چه شوند. انتخاب آن به معنای کسب‌وکار بستگی دارد.</p>
      ${tbl(['مقدار', 'رفتار', 'مناسب برای'], [
        ['<code>CASCADE</code>', 'حذف رکوردهای فرزند همراه والد.', 'مقاله‌های یک نویسنده که بدون نویسنده معنا ندارند.'],
        ['<code>PROTECT</code>', 'جلوگیری از حذف والد اگر فرزند داشته باشد.', 'دسته‌بندی دارای مقاله.'],
        ['<code>RESTRICT</code>', 'مانند PROTECT ولی با رفتار دقیق‌تر در رابطه‌های چندگانه.', 'جایگزین PROTECT در پروژه‌های جدید.'],
        ['<code>SET_NULL</code>', 'فیلد را NULL می‌کند؛ نیاز به <code>null=True</code> دارد.', 'حذف نویسنده ولی نگه‌داشتن مقاله‌ها.'],
        ['<code>SET_DEFAULT</code>', 'مقدار <code>default</code> را می‌گذارد؛ نیاز به <code>default</code> دارد.', 'برگرداندن به یک مقدار پیش‌فرض.'],
        ['<code>SET()</code>', 'مقدار دلخواه یا خروجی یک تابع را می‌گذارد.', 'سناریوهای خاص.'],
        ['<code>DO_NOTHING</code>', 'هیچ کاری نمی‌کند؛ ممکن است خطای دیتابیس بدهد.', 'موارد نادر و خاص.'],
      ])}
      ${c('python', [
        'author = models.ForeignKey(',
        '    settings.AUTH_USER_MODEL,',
        '    on_delete=models.CASCADE,',
        ')',
        '',
        'category = models.ForeignKey(',
        '    Category,',
        '    on_delete=models.SET_NULL,',
        '    null=True,',
        '    blank=True,',
        ')',
      ], 'نمونه on_delete')}
      ${exercise('انتخاب on_delete', 'متوسط', '<p>اگر حذف کاربر نباید نظراتش را حذف کند، کدام on_delete مناسب است؟</p>', '<p><code>SET_NULL</code>؛ ولی فیلد باید <code>null=True</code> باشد. با CASCADE همه نظرات کاربر حذف می‌شوند.</p>')}
    `),

    s('مدل و دیتابیس', 'Q و F در QuerySet', 'Q برای ترکیب شرط‌ها و F برای کار با ستون‌هاست.', `
      <p>با <code>Q</code> می‌توانید شرط‌های OR و NOT بسازید؛ با <code>F</code> می‌توانید فیلد را با مقدار خودش مقایسه یا به‌روزرسانی کنید و با <code>annotate</code> ستون محاسباتی بسازید.</p>
      ${c('python', [
        'from django.db.models import F, Q',
        '',
        '# OR با Q (در جست‌وجو استفاده شد)',
        'results = Post.objects.filter(',
        '    Q(title__icontains="django") | Q(body__icontains="django")',
        ')',
        '',
        '# NOT با Q',
        'drafts = Post.objects.filter(~Q(is_published=True))',
        '',
        '# مقایسه فیلد با فیلد دیگر با F',
        'promoted = Product.objects.filter(sale_price__lt=F("price"))',
        '',
        '# کاهش موجودی بدون race condition',
        'Product.objects.filter(id=1).update(stock=F("stock") - 1)',
      ], 'Q و F')}
      ${callout('tip', 'چرا F؟', 'اگر مقدار stock را با Python بخوانید، کم کنید و دوباره ذخیره کنید، بین دو request ممکن است مقدار قدیمی باشد. F این کار را داخل دیتابیس و اتمیک انجام می‌دهد.')}
    `),

    s('مدل و دیتابیس', 'کلاس Meta', 'Meta رفتار عمومی مدل را تنظیم می‌کند.', `
      <p>تنظیماتی مثل ترتیب پیش‌فرض، نام نمایشی و indexها داخل کلاس Meta تعریف می‌شوند؛ نه به عنوان فیلد.</p>
      ${c('python', [
        'class Post(models.Model):',
        '    title = models.CharField(max_length=200)',
        '    created_at = models.DateTimeField(auto_now_add=True)',
        '',
        '    class Meta:',
        '        ordering = ["-created_at"]',
        '        verbose_name = "مقاله"',
        '        verbose_name_plural = "مقاله‌ها"',
        '        indexes = [',
        '            models.Index(fields=["-created_at"]),',
        '        ]',
      ], 'Meta نمونه')}
      ${tbl(['آپشن Meta', 'اثر'], [
        ['<code>ordering</code>', 'ترتیب پیش‌فرض همه queryها؛ مثل <code>["-created_at"]</code>.'],
        ['<code>verbose_name</code> / <code>verbose_name_plural</code>', 'نام نمایشی مفرد و جمع در admin.'],
        ['<code>indexes</code>', 'index دیتابیس برای فیلدهای پرکاربرد در filter.'],
        ['<code>unique_together</code> / <code>constraints</code>', 'قید یکتایی یا اعتبارسنجی روی چند فیلد.'],
        ['<code>db_table</code>', 'نام دستی جدول در دیتابیس.'],
      ])}
      ${callout('info', 'نکته', 'ordering در Meta روی همه QuerySetها اثر می‌گذارد؛ اگر ترتیب خاصی لازم دارید با <code>order_by</code> در همان query آن را لغو کنید.')}
    `),

    s('مدل و دیتابیس', 'Admin جنگو', 'Admin یک پنل مدیریت آماده برای داده‌های پروژه است.', `
      <p>برای شروع و حتی بسیاری از پروژه‌های داخلی، Django Admin سرعت توسعه را بسیار بالا می‌برد. مدل را ثبت می‌کنیم و تنظیم می‌کنیم چه ستون‌هایی دیده شود.</p>
      ${c('python', [
        '# blog/admin.py',
        'from django.contrib import admin',
        'from .models import Category, Post',
        '',
        '@admin.register(Category)',
        'class CategoryAdmin(admin.ModelAdmin):',
        '    list_display = ("name", "slug")',
        '    prepopulated_fields = {"slug": ("name",)}',
        '',
        '@admin.register(Post)',
        'class PostAdmin(admin.ModelAdmin):',
        '    list_display = ("title", "author", "category", "is_published", "created_at")',
        '    list_filter = ("is_published", "category")',
        '    search_fields = ("title", "body")',
        '    prepopulated_fields = {"slug": ("title",)}'
      ], 'تنظیم admin')}
      ${c('bash', 'python manage.py createsuperuser', 'ساخت ادمین')}
    `),

    s('مدل و دیتابیس', 'Queryهای کاربردی', 'برای performance و خوانایی، queryها را هدفمند بنویسید.', `
      ${c('python', [
        '# مقاله‌های منتشر شده در یک دسته',
        'posts = Post.objects.filter(',
        '    is_published=True,',
        '    category__slug="django"',
        ').select_related("author", "category")',
        '',
        '# گرفتن یک object یا 404',
        'from django.shortcuts import get_object_or_404',
        'post = get_object_or_404(Post, slug="start-django", is_published=True)',
        '',
        '# شمارش و محدودسازی',
        'latest_posts = Post.objects.filter(is_published=True)[:5]',
        'count = Post.objects.filter(is_published=True).count()'
      ], 'QuerySet')}
      ${exercise('ساخت مدل Product', 'متوسط', '<p>مدلی با نام <code>Product</code> بسازید که name، slug، price، stock و is_active داشته باشد.</p>', c('python', [
        'class Product(models.Model):',
        '    name = models.CharField(max_length=160)',
        '    slug = models.SlugField(unique=True)',
        '    price = models.PositiveIntegerField()',
        '    stock = models.PositiveIntegerField(default=0)',
        '    is_active = models.BooleanField(default=True)',
        '',
        '    def __str__(self):',
        '        return self.name'
      ], 'راه‌حل'))}
    `)
  );
})(window);
