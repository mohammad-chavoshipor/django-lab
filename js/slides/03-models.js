(function (global) {
  'use strict';
  const { c, callout, exercise, tbl, slide: s, objectives, lab, checklist, quiz } = global.DL;

  global.SLIDES.push(
    s('مدل و دیتابیس', 'Model چیست؟', 'Model کلاس Python است که ساختار داده را به جدول دیتابیس تبدیل می‌کند.', `
      ${objectives([
        'مدل بنویسید و فیلد مناسب هر نوع داده را انتخاب کنید.',
        'چرخه <code>makemigrations</code> ← <code>migrate</code> را اجرا و خطاهایش را رفع کنید.',
        'رابطه‌های یک‌به‌یک، چند‌به‌یک و چند‌به‌چند را مدل کنید و <code>on_delete</code> درست انتخاب کنید.',
        'اعتبارسنجی و قید (constraint) را در سطح مدل تعریف کنید.',
        'از ابتدای پروژه Custom User Model بسازید.',
      ])}
      <p>در Django به جای ساخت مستقیم جدول با SQL، یک کلاس می‌نویسیم. Django از روی این کلاس migration می‌سازد و جدول را در دیتابیس ایجاد یا تغییر می‌دهد.</p>
      ${c('python', [
        '# blog/models.py',
        'from django.db import models',
        '',
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
      ${c('sql', [
        '-- خروجی: python manage.py sqlmigrate blog 0001',
        'CREATE TABLE "blog_post" (',
        '    "id" bigint NOT NULL PRIMARY KEY AUTOINCREMENT,',
        '    "title" varchar(200) NOT NULL,',
        '    "slug" varchar(220) NOT NULL UNIQUE,',
        '    "body" text NOT NULL,',
        '    "is_published" bool NOT NULL,',
        '    "created_at" datetime NOT NULL',
        ');',
      ], 'همان مدل، در زبان دیتابیس')}
      ${callout('info', 'نام جدول و کلید اصلی', 'نام جدول به‌طور خودکار <code>&lt;app&gt;_&lt;model&gt;</code> می‌شود و Django خودش فیلد <code>id</code> را به‌عنوان کلید اصلی اضافه می‌کند؛ لازم نیست بنویسیدش.')}
    `),

    s('مدل و دیتابیس', 'انواع فیلدهای مدل', 'هر نیاز داده‌ای، یک فیلد مناسب دارد.', `
      <p>Django برای متن، عدد، تاریخ، فایل و رابطه فیلد آماده دارد. نوع فیلد هم ستون دیتابیس را تعیین می‌کند و هم validation و داده پاک‌سازی‌شده فرم را.</p>
      ${tbl(['فیلد', 'ستون دیتابیس', 'کاربرد'], [
        ['<code>CharField</code>', 'VARCHAR(n)', 'متن کوتاه؛ حتما <code>max_length</code> لازم دارد.'],
        ['<code>TextField</code>', 'TEXT', 'متن بلند مثل بدنه مقاله.'],
        ['<code>SlugField</code>', 'VARCHAR(n)', 'آدرس URL تمیز؛ معمولا از عنوان ساخته می‌شود.'],
        ['<code>IntegerField</code>', 'INTEGER', 'عدد صحیح.'],
        ['<code>PositiveIntegerField</code>', 'INTEGER', 'عدد صحیح غیرمنفی مثل موجودی.'],
        ['<code>DecimalField</code>', 'NUMERIC', 'عدد دقیق اعشاری؛ <code>max_digits</code> و <code>decimal_places</code> لازم دارد.'],
        ['<code>BooleanField</code>', 'BOOL', 'درست/نادرست مثل is_published.'],
        ['<code>DateField</code> / <code>DateTimeField</code>', 'DATE / TIMESTAMP', 'تاریخ و زمان؛ از <code>auto_now</code> و <code>auto_now_add</code> هم پشتیبانی می‌کند.'],
        ['<code>EmailField</code>', 'VARCHAR(n)', 'ایمیل با validation آماده.'],
        ['<code>URLField</code>', 'VARCHAR(n)', 'آدرس اینترنتی با validation آماده.'],
        ['<code>FileField</code> / <code>ImageField</code>', 'VARCHAR(n)', 'فایل و تصویر آپلودی؛ <code>upload_to</code> لازم دارد.'],
        ['<code>JSONField</code>', 'JSON', 'داده ساختاریافته مثل تنظیمات.'],
        ['<code>UUIDField</code>', 'CHAR(32)', 'شناسه غیرقابل حدس‌زدن به‌جای id عددی.'],
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
      ${callout('danger', 'قیمت را با FloatField ذخیره نکنید', '<code>FloatField</code> اعشار باینری است و <code>0.1 + 0.2</code> دقیقا <code>0.3</code> نمی‌شود؛ در محاسبه پول خطا می‌سازد. برای پول یا <code>DecimalField</code> بگیرید یا مبلغ را به کوچک‌ترین واحد (ریال) به‌صورت <code>PositiveIntegerField</code> ذخیره کنید.')}
      ${callout('warn', 'ImageField به Pillow نیاز دارد', 'قبل از استفاده از <code>ImageField</code> حتما <code>pip install pillow</code> را اجرا کنید؛ وگرنه هنگام <code>makemigrations</code> خطای <code>Cannot use ImageField because Pillow is not installed</code> می‌گیرید.')}
      ${exercise('انتخاب فیلد', 'آسان', '<p>برای «قیمت دقیق محصول»، «آدرس وب‌سایت فروشگاه» و «تصویر محصول» چه فیلدی مناسب است؟</p>', '<p><code>DecimalField(max_digits=10, decimal_places=2)</code>، <code>URLField()</code> و <code>ImageField(upload_to="products/")</code>. قیمت نباید با <code>FloatField</code> ذخیره شود و <code>ImageField</code> به Pillow نیاز دارد.</p>')}
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
        ['<code>validators</code>', 'خیر', 'فهرست توابع اعتبارسنجی اضافه.'],
        ['<code>help_text</code>', 'خیر', 'راهنمای زیر فیلد در فرم و admin.'],
        ['<code>verbose_name</code>', 'خیر', 'نام نمایشی در admin و فرم.'],
      ])}
      ${callout('warn', 'فرق null و blank', '<code>null=True</code> یعنی دیتابیس می‌تواند NULL داشته باشد؛ <code>blank=True</code> یعنی فرم اجازه خالی گذاشتن دارد. برای متن معمولا <code>blank=True</code> بدون <code>null=True</code> کافی است چون Django رشته خالی را ذخیره می‌کند — در غیر این صورت دو حالت «خالی» خواهید داشت: رشته تهی و NULL.')}
      ${c('python', [
        'class Post(models.Model):',
        '    class Status(models.TextChoices):        # روش مدرن choices',
        '        DRAFT = "draft", "پیش‌نویس"',
        '        PUBLISHED = "published", "منتشرشده"',
        '',
        '    title = models.CharField(max_length=200, verbose_name="عنوان")',
        '    slug = models.SlugField(unique=True, db_index=True)',
        '    summary = models.CharField(max_length=300, blank=True)',
        '    status = models.CharField(',
        '        max_length=10,',
        '        choices=Status.choices,',
        '        default=Status.DRAFT,',
        '        help_text="فقط مقاله‌های منتشرشده در سایت دیده می‌شوند.",',
        '    )',
      ], 'استفاده از آپشن‌ها با TextChoices')}
      ${callout('tip', 'مزیت TextChoices', 'به‌جای رشته جادویی <code>"published"</code> در همه‌جای کد، می‌نویسید <code>Post.Status.PUBLISHED</code>؛ اگر مقدار عوض شد فقط یک جا تغییر می‌کند و ویرایشگر هم آن را تکمیل می‌کند.')}
    `),

    s('مدل و دیتابیس', 'Migration چیست؟', 'Migration نسخه‌بندی تغییرات دیتابیس است.', `
      <p>وقتی model را تغییر می‌دهید، دیتابیس خودکار تغییر نمی‌کند. ابتدا migration ساخته می‌شود، سپس روی دیتابیس اعمال می‌شود. این روند برای تیم و production قابل ردیابی است.</p>
      ${lab('اولین چرخه کامل migration', 'زمان: ۱۰ دقیقه', [
        { do: 'مدل <code>Post</code> را در <code>blog/models.py</code> بنویسید و فایل را ذخیره کنید.' },
        { do: c('bash', ['python manage.py makemigrations'], 'ساخت فایل migration'), why: 'خروجی باید بگوید <code>Create model Post</code> و فایلی مثل <code>blog/migrations/0001_initial.py</code> ساخته شود. این فایل را باز کنید و بخوانید — کد Python ساده است.' },
        { do: c('bash', ['python manage.py sqlmigrate blog 0001'], 'دیدن SQL معادل'), why: 'قبل از اعمال روی دیتابیس می‌بینید دقیقا چه دستوری اجرا خواهد شد. عادت بسیار خوبی برای پروژه‌های واقعی است.' },
        { do: c('bash', ['python manage.py migrate'], 'اعمال روی دیتابیس') },
        { do: c('bash', ['python manage.py showmigrations blog'], 'بررسی وضعیت'), why: 'علامت <code>[X]</code> یعنی اعمال شده و <code>[ ]</code> یعنی هنوز اجرا نشده.' },
      ], '<p>در <code>showmigrations</code> باید <code>[X] 0001_initial</code> ببینید و در <code>python manage.py shell</code> دستور <code>Post.objects.count()</code> باید بدون خطا عدد صفر بدهد.</p>')}
      ${tbl(['دستور', 'وظیفه'], [
        ['<code>makemigrations</code>', 'تبدیل تغییرات model به فایل migration.'],
        ['<code>migrate</code>', 'اعمال migrationها روی دیتابیس.'],
        ['<code>showmigrations</code>', 'دیدن وضعیت اجرا شدن migrationها.'],
        ['<code>sqlmigrate app 0001</code>', 'دیدن SQL یک migration بدون اجرای آن.'],
        ['<code>migrate blog 0002</code>', 'برگشت به یک migration قبلی.'],
        ['<code>makemigrations --empty blog</code>', 'ساخت migration خالی برای داده (data migration).'],
      ])}
      ${callout('danger', 'قانون تیمی', 'فایل‌های <code>migrations/</code> بخشی از کد پروژه‌اند و باید در git commit شوند. حذف یا دستکاری آن‌ها بعد از اجرا روی production، دیتابیس تیم را از هم می‌پاشد.')}
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
      ${quiz('فیلد <code>slug</code> با <code>unique=True</code> را به مدلی اضافه می‌کنید که ۱۰۰ ردیف دارد. با یک default ثابت چه می‌شود؟', [
        'همه ردیف‌ها همان مقدار را می‌گیرند و migration با خطای یکتایی شکست می‌خورد.',
        'Django خودش برای هر ردیف مقدار یکتا می‌سازد.',
        'ردیف‌های قبلی حذف می‌شوند.',
      ], 0, 'راه درست سه مرحله‌ای است: ۱) فیلد را <code>null=True</code> اضافه کنید، ۲) یک data migration بنویسید که برای هر ردیف slug یکتا بسازد، ۳) در migration سوم فیلد را <code>unique=True</code> و غیرقابل NULL کنید.')}
    `),

    s('مدل و دیتابیس', 'Relation در مدل‌ها', 'پروژه واقعی تقریبا همیشه رابطه بین داده‌ها دارد.', `
      <p>مقاله نویسنده دارد، محصول دسته‌بندی دارد، سفارش چند آیتم دارد. Django این رابطه‌ها را با fieldهای رابطه‌ای مدل می‌کند.</p>
      ${c('python', [
        'from django.conf import settings',
        'from django.db import models',
        '',
        '',
        'class Category(models.Model):',
        '    name = models.CharField(max_length=120)',
        '    slug = models.SlugField(unique=True)',
        '',
        '',
        'class Tag(models.Model):',
        '    name = models.CharField(max_length=60, unique=True)',
        '',
        '',
        'class Post(models.Model):',
        '    author = models.ForeignKey(',
        '        settings.AUTH_USER_MODEL,',
        '        on_delete=models.CASCADE,',
        '        related_name="posts",',
        '    )',
        '    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="posts")',
        '    tags = models.ManyToManyField(Tag, blank=True, related_name="posts")',
        '    title = models.CharField(max_length=200)'
      ], 'سه نوع رابطه')}
      ${tbl(['فیلد رابطه', 'نوع رابطه', 'مثال', 'دسترسی'], [
        ['<code>ForeignKey</code>', 'چند به یک', 'هر مقاله یک نویسنده؛ هر نویسنده چند مقاله.', '<code>post.author</code> و <code>user.posts.all()</code>'],
        ['<code>OneToOneField</code>', 'یک به یک', 'هر کاربر یک پروفایل.', '<code>user.profile</code>'],
        ['<code>ManyToManyField</code>', 'چند به چند', 'هر مقاله چند برچسب.', '<code>post.tags.all()</code> و <code>tag.posts.all()</code>'],
      ])}
      ${c('python', [
        '# کار با ManyToMany',
        'post.tags.add(tag1, tag2)',
        'post.tags.remove(tag1)',
        'post.tags.set([tag2, tag3])       # جایگزینی کامل',
        'post.tags.clear()',
        'tag2.posts.all()                  # رابطه معکوس',
      ], 'متدهای ManyToMany')}
      ${callout('info', 'related_name', '<code>related_name</code> نام رابطه معکوس را مشخص می‌کند؛ مثلا <code>user.posts.all()</code>. بدون آن، پیش‌فرض <code>user.post_set.all()</code> است. اگر دو ForeignKey به یک مدل دارید، <code>related_name</code> اجباری می‌شود تا تداخل پیش نیاید.')}
    `),

    s('مدل و دیتابیس', 'on_delete به زبان ساده', 'وقتی رکورد والد حذف شود، رکوردهای فرزند چه می‌شوند؟', `
      <p><code>on_delete</code> فقط مخصوص فیلدهای رابطه‌ای است و مشخص می‌کند با حذف رکورد والد، رکوردهای وابسته چه شوند. انتخاب آن به معنای کسب‌وکار بستگی دارد.</p>
      ${tbl(['مقدار', 'رفتار', 'مناسب برای'], [
        ['<code>CASCADE</code>', 'حذف رکوردهای فرزند همراه والد.', 'آیتم‌های یک سفارش که بدون سفارش معنا ندارند.'],
        ['<code>PROTECT</code>', 'جلوگیری از حذف والد اگر فرزند داشته باشد.', 'دسته‌بندی دارای محصول.'],
        ['<code>RESTRICT</code>', 'مانند PROTECT ولی در رابطه‌های چندگانه دقیق‌تر عمل می‌کند.', 'جایگزین PROTECT در پروژه‌های جدید.'],
        ['<code>SET_NULL</code>', 'فیلد را NULL می‌کند؛ نیاز به <code>null=True</code> دارد.', 'حذف نویسنده ولی نگه‌داشتن مقاله‌ها.'],
        ['<code>SET_DEFAULT</code>', 'مقدار <code>default</code> را می‌گذارد؛ نیاز به <code>default</code> دارد.', 'برگرداندن به دسته «متفرقه».'],
        ['<code>SET()</code>', 'مقدار دلخواه یا خروجی یک تابع را می‌گذارد.', 'سناریوهای خاص.'],
        ['<code>DO_NOTHING</code>', 'هیچ کاری نمی‌کند؛ ممکن است خطای دیتابیس بدهد.', 'موارد نادر و خاص.'],
      ])}
      ${c('python', [
        'author = models.ForeignKey(',
        '    settings.AUTH_USER_MODEL,',
        '    on_delete=models.SET_NULL,',
        '    null=True,',
        '    related_name="posts",',
        ')',
        '',
        'category = models.ForeignKey(',
        '    Category,',
        '    on_delete=models.PROTECT,   # حذف دسته دارای مقاله ممنوع',
        '    related_name="posts",',
        ')',
      ], 'نمونه on_delete')}
      ${callout('danger', 'CASCADE خطرناک‌ترین انتخاب پیش‌فرض است', 'حذف یک کاربر با <code>CASCADE</code> می‌تواند زنجیره‌وار سفارش‌ها، نظرات و فاکتورهایش را پاک کند. در داده‌های مالی و حسابرسی معمولا <code>PROTECT</code> یا حذف نرم (فیلد <code>is_deleted</code>) درست‌تر است.')}
      ${exercise('انتخاب on_delete', 'متوسط', '<p>اگر حذف کاربر نباید نظراتش را حذف کند، کدام on_delete مناسب است؟ و اگر حذف سفارش باید آیتم‌هایش را هم حذف کند چطور؟</p>', '<p>برای نظر: <code>SET_NULL</code> با <code>null=True</code> — نظر می‌ماند ولی بی‌نویسنده می‌شود. برای آیتم سفارش: <code>CASCADE</code> چون <code>OrderItem</code> بدون <code>Order</code> بی‌معناست.</p>')}
    `),

    s('مدل و دیتابیس', 'کلاس Meta', 'Meta رفتار عمومی مدل را تنظیم می‌کند.', `
      <p>تنظیماتی مثل ترتیب پیش‌فرض، نام نمایشی، indexها و قیدها داخل کلاس Meta تعریف می‌شوند؛ نه به عنوان فیلد.</p>
      ${c('python', [
        'class Post(models.Model):',
        '    title = models.CharField(max_length=200)',
        '    slug = models.SlugField()',
        '    category = models.ForeignKey(Category, on_delete=models.PROTECT)',
        '    created_at = models.DateTimeField(auto_now_add=True)',
        '',
        '    class Meta:',
        '        ordering = ["-created_at"]',
        '        verbose_name = "مقاله"',
        '        verbose_name_plural = "مقاله‌ها"',
        '        indexes = [',
        '            models.Index(fields=["-created_at"]),',
        '            models.Index(fields=["slug"]),',
        '        ]',
        '        constraints = [',
        '            models.UniqueConstraint(',
        '                fields=["category", "slug"],',
        '                name="unique_slug_per_category",',
        '            ),',
        '        ]',
      ], 'Meta نمونه')}
      ${tbl(['آپشن Meta', 'اثر'], [
        ['<code>ordering</code>', 'ترتیب پیش‌فرض همه queryها؛ مثل <code>["-created_at"]</code>.'],
        ['<code>verbose_name</code> / <code>verbose_name_plural</code>', 'نام نمایشی مفرد و جمع در admin.'],
        ['<code>indexes</code>', 'index دیتابیس برای فیلدهای پرکاربرد در filter و order_by.'],
        ['<code>constraints</code>', 'قید یکتایی یا شرطی روی چند فیلد — در سطح دیتابیس تضمین می‌شود.'],
        ['<code>db_table</code>', 'نام دستی جدول در دیتابیس.'],
        ['<code>abstract = True</code>', 'مدل پایه بدون جدول؛ برای اشتراک فیلدها بین چند مدل.'],
        ['<code>get_latest_by</code>', 'فیلد مبنای <code>.latest()</code> و <code>.earliest()</code>.'],
      ])}
      ${callout('warn', 'ordering رایگان نیست', '<code>ordering</code> در Meta روی همه queryها اعمال می‌شود؛ اگر روی فیلد بدون index باشد، همه صفحات کند می‌شوند. برای هر فیلدی که در <code>ordering</code> می‌گذارید، index هم تعریف کنید.')}
    `),

    s('مدل و دیتابیس', 'متد، property و save() سفارشی', 'مدل فقط ظرف داده نیست؛ جای منطق مربوط به همان داده است.', `
      <p>هر منطقی که فقط به یک رکورد مربوط است، جایش داخل مدل است — نه در view و نه در template. این کار کد را قابل تست و بدون تکرار می‌کند.</p>
      ${c('python', [
        'from django.db import models',
        'from django.urls import reverse',
        'from django.utils import timezone',
        'from django.utils.text import slugify',
        '',
        '',
        'class Post(models.Model):',
        '    title = models.CharField(max_length=200)',
        '    slug = models.SlugField(max_length=220, unique=True, blank=True)',
        '    published_at = models.DateTimeField(null=True, blank=True)',
        '',
        '    def __str__(self):',
        '        return self.title',
        '',
        '    def get_absolute_url(self):',
        '        return reverse("post_detail", kwargs={"slug": self.slug})',
        '',
        '    @property',
        '    def is_visible(self):',
        '        return self.published_at is not None and self.published_at <= timezone.now()',
        '',
        '    def save(self, *args, **kwargs):',
        '        if not self.slug:',
        '            self.slug = slugify(self.title, allow_unicode=True)',
        '        super().save(*args, **kwargs)',
      ], 'مدل با رفتار')}
      ${tbl(['متد', 'کجا استفاده می‌شود'], [
        ['<code>__str__</code>', 'admin، shell و هر جا شیء چاپ شود.'],
        ['<code>get_absolute_url</code>', '<code>{{ post.get_absolute_url }}</code> در template و redirect خودکار CBVها.'],
        ['<code>@property</code>', 'مثل یک فیلد خوانده می‌شود: <code>{{ post.is_visible }}</code> بدون پرانتز.'],
        ['<code>save()</code>', 'هر بار ذخیره؛ برای پرکردن خودکار فیلدها.'],
      ])}
      ${callout('warn', 'دو نکته درباره save() سفارشی', 'اول، فراموش‌نکردن <code>super().save(...)</code> وگرنه چیزی ذخیره نمی‌شود. دوم، <code>QuerySet.update()</code> و <code>bulk_create()</code> متد <code>save()</code> را صدا نمی‌زنند؛ پس منطق حیاتی را فقط به آن نسپارید.')}
      ${callout('tip', 'slugify فارسی', '<code>slugify("سلام دنیا")</code> رشته خالی می‌دهد چون حروف غیرلاتین را حذف می‌کند. برای فارسی حتما <code>slugify(title, allow_unicode=True)</code> بنویسید تا خروجی <code>سلام-دنیا</code> شود.')}
    `),

    s('مدل و دیتابیس', 'اعتبارسنجی در سطح مدل', 'داده نامعتبر نباید حتی به دیتابیس نزدیک شود.', `
      <p>سه لایه اعتبارسنجی داریم و هر سه لازم‌اند: <strong>فرم</strong> (تجربه کاربر)، <strong>مدل</strong> (منطق دامنه) و <strong>دیتابیس</strong> (تضمین نهایی).</p>
      ${c('python', [
        'from django.core.exceptions import ValidationError',
        'from django.core.validators import MinValueValidator, RegexValidator',
        'from django.db import models',
        '',
        '',
        'class Product(models.Model):',
        '    name = models.CharField(max_length=180)',
        '    price = models.PositiveIntegerField(validators=[MinValueValidator(1000)])',
        '    sale_price = models.PositiveIntegerField(null=True, blank=True)',
        '    sku = models.CharField(',
        '        max_length=12,',
        '        validators=[RegexValidator(r"^[A-Z]{3}-[0-9]{4}$", "قالب درست: ABC-1234")],',
        '    )',
        '',
        '    def clean(self):',
        '        """اعتبارسنجی بین چند فیلد."""',
        '        if self.sale_price and self.sale_price >= self.price:',
        '            raise ValidationError({"sale_price": "قیمت فروش باید از قیمت اصلی کمتر باشد."})',
        '',
        '    class Meta:',
        '        constraints = [',
        '            models.CheckConstraint(',
        '                condition=models.Q(price__gt=0),',
        '                name="price_positive",',
        '            ),',
        '        ]',
      ], 'validator، clean و constraint')}
      ${tbl(['لایه', 'ابزار', 'چه زمانی اجرا می‌شود'], [
        ['فرم', '<code>clean_&lt;field&gt;()</code> در Form', 'هنگام <code>form.is_valid()</code>.'],
        ['مدل', '<code>validators</code> و <code>clean()</code>', 'هنگام <code>full_clean()</code> — که ModelForm خودکار صدا می‌زند.'],
        ['دیتابیس', '<code>constraints</code> و <code>unique</code>', 'همیشه؛ حتی در shell و import مستقیم.'],
      ])}
      ${callout('warn', 'نام آرگومان در نسخه‌های مختلف', 'از Django 5.1 آرگومان <code>condition</code> جایگزین <code>check</code> شده است. اگر Django شما قدیمی‌تر است بنویسید <code>models.CheckConstraint(check=models.Q(price__gt=0), name=...)</code>.')}
      ${callout('danger', 'save() اعتبارسنجی نمی‌کند', 'فراخوانی مستقیم <code>Product(price=-5).save()</code> بدون خطا اجرا می‌شود. <code>validators</code> و <code>clean()</code> فقط با <code>full_clean()</code> اجرا می‌شوند. برای تضمین واقعی، <code>CheckConstraint</code> در دیتابیس بگذارید.')}
      ${quiz('کاربری با <code>Product.objects.create(price=-100)</code> رکورد منفی می‌سازد. چه چیزی جلویش را می‌گیرد؟', [
        'فقط <code>MinValueValidator</code>.',
        'فقط <code>CheckConstraint</code> در سطح دیتابیس؛ چون <code>create()</code> متد <code>full_clean()</code> را صدا نمی‌زند.',
        'هیچ‌کدام؛ Django اجازه می‌دهد.',
      ], 1, 'validatorها هنگام اعتبارسنجی فرم یا مدل اجرا می‌شوند، نه هنگام درج مستقیم. قید دیتابیس تنها لایه‌ای است که هیچ مسیری نمی‌تواند دورش بزند.')}
    `),

    s('مدل و دیتابیس', 'Custom User Model — از روز اول', 'مهم‌ترین تصمیمی که در ابتدای هر پروژه Django می‌گیرید.', `
      ${callout('danger', 'چرا حالا و نه بعدا؟', 'تغییر مدل کاربر بعد از اجرای اولین <code>migrate</code> بسیار دشوار است و معمولا یعنی پاک‌کردن کل دیتابیس. حتی اگر امروز به فیلد اضافه نیاز ندارید، Custom User را از روز اول بسازید.')}
      ${c('python', [
        '# accounts/models.py',
        'from django.contrib.auth.models import AbstractUser',
        'from django.db import models',
        '',
        '',
        'class User(AbstractUser):',
        '    phone = models.CharField(max_length=15, blank=True)',
        '    bio = models.TextField(blank=True)',
        '    avatar = models.ImageField(upload_to="avatars/", blank=True)',
        '',
        '    def __str__(self):',
        '        return self.get_full_name() or self.username',
      ], 'accounts/models.py')}
      ${c('python', [
        '# config/settings.py',
        'INSTALLED_APPS = [..., "accounts"]',
        '',
        'AUTH_USER_MODEL = "accounts.User"     # ← این خط کلید کار است',
      ], 'settings.py')}
      ${c('python', [
        '# accounts/admin.py',
        'from django.contrib import admin',
        'from django.contrib.auth.admin import UserAdmin',
        'from .models import User',
        '',
        '',
        '@admin.register(User)',
        'class CustomUserAdmin(UserAdmin):',
        '    fieldsets = UserAdmin.fieldsets + (',
        '        ("اطلاعات تکمیلی", {"fields": ("phone", "bio", "avatar")}),',
        '    )',
      ], 'ثبت در admin')}
      ${tbl(['کار', 'روش درست', 'روش غلط'], [
        ['ارجاع در ForeignKey', '<code>settings.AUTH_USER_MODEL</code>', 'import مستقیم کلاس <code>User</code>'],
        ['گرفتن کلاس کاربر در کد', '<code>get_user_model()</code>', '<code>from django.contrib.auth.models import User</code>'],
        ['گسترش کاربر بعد از شروع پروژه', 'مدل <code>Profile</code> با <code>OneToOneField</code>', 'تعویض <code>AUTH_USER_MODEL</code>'],
      ])}
      ${c('python', [
        'from django.contrib.auth import get_user_model',
        '',
        'User = get_user_model()          # همیشه مدل درست را می‌دهد',
        'User.objects.filter(is_active=True).count()',
      ], 'دسترسی امن به مدل کاربر')}
      ${callout('warn', 'اگر دیر شد', 'اگر پروژه‌تان از قبل migrate شده، دیگر سراغ <code>AbstractUser</code> نروید؛ به‌جایش مدل <code>Profile</code> با <code>OneToOneField</code> به کاربر بسازید. این راه‌حل بی‌دردسر و کاملا رایج است.')}
    `),

    s('مدل و دیتابیس', 'Admin جنگو', 'Admin یک پنل مدیریت آماده برای داده‌های پروژه است.', `
      <p>برای شروع و حتی بسیاری از پروژه‌های داخلی، Django Admin سرعت توسعه را بسیار بالا می‌برد. مدل را ثبت می‌کنیم و تنظیم می‌کنیم چه ستون‌هایی دیده شود.</p>
      ${c('python', [
        '# blog/admin.py',
        'from django.contrib import admin',
        'from .models import Category, Post',
        '',
        '',
        '@admin.register(Category)',
        'class CategoryAdmin(admin.ModelAdmin):',
        '    list_display = ("name", "slug")',
        '    prepopulated_fields = {"slug": ("name",)}',
        '    search_fields = ("name",)',
        '',
        '',
        '@admin.register(Post)',
        'class PostAdmin(admin.ModelAdmin):',
        '    list_display = ("title", "author", "category", "is_published", "created_at")',
        '    list_filter = ("is_published", "category", "created_at")',
        '    search_fields = ("title", "body")',
        '    list_editable = ("is_published",)',
        '    date_hierarchy = "created_at"',
        '    autocomplete_fields = ("category",)',
        '    list_select_related = ("author", "category")   # جلوگیری از N+1',
        '',
        '    @admin.action(description="انتشار مقاله‌های انتخاب‌شده")',
        '    def publish(self, request, queryset):',
        '        updated = queryset.update(is_published=True)',
        '        self.message_user(request, f"{updated} مقاله منتشر شد.")',
        '',
        '    actions = ["publish"]',
      ], 'admin حرفه‌ای')}
      ${tbl(['گزینه ModelAdmin', 'اثر'], [
        ['<code>list_display</code>', 'ستون‌های جدول فهرست.'],
        ['<code>list_filter</code>', 'فیلترهای کناری.'],
        ['<code>search_fields</code>', 'کادر جست‌وجو.'],
        ['<code>list_editable</code>', 'ویرایش مستقیم در فهرست.'],
        ['<code>prepopulated_fields</code>', 'ساخت خودکار slug از عنوان.'],
        ['<code>readonly_fields</code>', 'فیلدهای فقط‌خواندنی مثل <code>created_at</code>.'],
        ['<code>inlines</code>', 'ویرایش مدل فرزند داخل والد (مثل آیتم‌های سفارش).'],
        ['<code>actions</code>', 'عملیات گروهی روی رکوردهای انتخاب‌شده.'],
      ])}
      ${c('bash', 'python manage.py createsuperuser', 'ساخت ادمین')}
      ${callout('warn', 'Admin جای پنل کاربر نیست', 'Django Admin برای کارکنان داخلی طراحی شده، نه برای کاربران نهایی. صفحات عمومی سایت را خودتان با view و template بسازید.')}
    `),

    s('مدل و دیتابیس', 'نقطه کنترل بخش مدل', 'قبل از ورود به ORM این‌ها باید انجام شده باشند.', `
      ${checklist('روی پروژه خودتان', [
        'مدل <code>Post</code> با <code>__str__</code>، <code>get_absolute_url</code> و <code>Meta.ordering</code> ساخته شده است.',
        'Custom User Model ساخته و <code>AUTH_USER_MODEL</code> تنظیم شده است.',
        'حداقل یک <code>ForeignKey</code> با <code>related_name</code> و <code>on_delete</code> آگاهانه دارید.',
        '<code>makemigrations</code> و <code>migrate</code> بدون خطا اجرا شده‌اند.',
        'مدل‌ها در admin ثبت شده‌اند و با superuser می‌توانید رکورد بسازید.',
        'حداقل ۳ رکورد نمونه از طریق admin وارد کرده‌اید.',
      ])}
      ${exercise('طراحی مدل فروشگاه', 'متوسط', `
        <p>مدل‌های <code>ProductCategory</code> و <code>Product</code> را بسازید با این شرایط:</p>
        <ul>
          <li>محصول به دسته <code>ForeignKey</code> با <code>PROTECT</code> داشته باشد.</li>
          <li>slug یکتا و اگر خالی بود از نام ساخته شود.</li>
          <li>قیمت نباید صفر یا منفی باشد (قید دیتابیس).</li>
          <li>ترتیب پیش‌فرض بر اساس جدیدترین.</li>
        </ul>`, c('python', [
        'from django.db import models',
        'from django.urls import reverse',
        'from django.utils.text import slugify',
        '',
        '',
        'class ProductCategory(models.Model):',
        '    title = models.CharField(max_length=120)',
        '    slug = models.SlugField(unique=True)',
        '',
        '    def __str__(self):',
        '        return self.title',
        '',
        '',
        'class Product(models.Model):',
        '    category = models.ForeignKey(',
        '        ProductCategory, on_delete=models.PROTECT, related_name="products"',
        '    )',
        '    name = models.CharField(max_length=180)',
        '    slug = models.SlugField(max_length=200, unique=True, blank=True)',
        '    price = models.PositiveIntegerField()',
        '    stock = models.PositiveIntegerField(default=0)',
        '    is_active = models.BooleanField(default=True)',
        '    created_at = models.DateTimeField(auto_now_add=True)',
        '',
        '    class Meta:',
        '        ordering = ["-created_at"]',
        '        indexes = [models.Index(fields=["-created_at"])]',
        '        constraints = [',
        '            models.CheckConstraint(condition=models.Q(price__gt=0), name="product_price_gt_0"),',
        '        ]',
        '',
        '    def save(self, *args, **kwargs):',
        '        if not self.slug:',
        '            self.slug = slugify(self.name, allow_unicode=True)',
        '        super().save(*args, **kwargs)',
        '',
        '    def get_absolute_url(self):',
        '        return reverse("product_detail", kwargs={"slug": self.slug})',
        '',
        '    def __str__(self):',
        '        return self.name',
      ], 'راه‌حل'))}
    `)
  );
})(window);
