(function (global) {
  'use strict';
  const { c, callout, exercise, tbl, flow, slide: s, objectives, lab, checklist, quiz } = global.DL;

  global.SLIDES.push(
    s('ORM و کوئری', 'ORM چیست؟', 'ORM پلی بین objectهای Python و جدول‌های دیتابیس است.', `
      ${objectives([
        'عملیات CRUD را با ORM انجام دهید.',
        'بدانید یک QuerySet دقیقا چه زمانی به دیتابیس می‌زند.',
        'با lookupها فیلترهای دقیق بنویسید و <code>get</code> را از <code>filter</code> تشخیص دهید.',
        'مسئله N+1 را ببینید و با <code>select_related</code> و <code>prefetch_related</code> حل کنید.',
        'Manager سفارشی، تراکنش و داده اولیه (fixture) بسازید.',
      ])}
      <p>با ORM می‌توانید بدون نوشتن SQL خام، داده بسازید، بخوانید، فیلتر کنید، مرتب کنید و حذف کنید. Django در پشت صحنه query مناسب دیتابیس را می‌سازد.</p>
      ${c('python', [
        'from blog.models import Post',
        '',
        '# Create — دو روش',
        'post = Post.objects.create(title="شروع جنگو", slug="start-django", body="متن")',
        '',
        'post = Post(title="شروع جنگو", slug="start-django", body="متن")',
        'post.save()',
        '',
        '# Read',
        'Post.objects.all()',
        'Post.objects.filter(is_published=True).order_by("-created_at")',
        'Post.objects.get(slug="start-django")        # دقیقا یکی',
        '',
        '# Update — یک شیء',
        'post.title = "شروع حرفه‌ای جنگو"',
        'post.save()',
        '',
        '# Update — گروهی (سریع، ولی save() را صدا نمی‌زند)',
        'Post.objects.filter(is_published=False).update(is_published=True)',
        '',
        '# Delete',
        'post.delete()',
        'Post.objects.filter(created_at__year=2020).delete()',
      ], 'CRUD با ORM')}
      ${tbl(['متد پرکاربرد', 'خروجی', 'کاربرد'], [
        ['<code>.all()</code>', 'QuerySet', 'همه ردیف‌ها.'],
        ['<code>.filter(...)</code>', 'QuerySet', 'ردیف‌های مطابق شرط.'],
        ['<code>.exclude(...)</code>', 'QuerySet', 'ردیف‌های غیرمطابق شرط.'],
        ['<code>.get(...)</code>', 'یک شیء', 'دقیقا یک ردیف؛ وگرنه استثنا.'],
        ['<code>.first()</code> / <code>.last()</code>', 'یک شیء یا None', 'اولین/آخرین بدون خطر استثنا.'],
        ['<code>.count()</code>', 'عدد', 'شمارش در دیتابیس.'],
        ['<code>.exists()</code>', 'bool', 'فقط «آیا حداقل یکی هست؟» — ارزان‌ترین بررسی.'],
        ['<code>.values()</code> / <code>.values_list()</code>', 'dict / tuple', 'گرفتن فقط چند ستون بدون ساخت شیء.'],
        ['<code>.order_by()</code>', 'QuerySet', 'مرتب‌سازی؛ <code>-</code> یعنی نزولی.'],
        ['<code>.distinct()</code>', 'QuerySet', 'حذف تکرار.'],
      ])}
    `),

    s('ORM و کوئری', 'QuerySet تنبل است', 'مهم‌ترین نکته‌ای که درباره ORM باید بدانید.', `
      <p>نوشتن <code>Post.objects.filter(...)</code> هیچ queryای اجرا نمی‌کند. QuerySet فقط «دستور پخت» را نگه می‌دارد و تا لحظه‌ای که واقعا به داده نیاز نباشد، به دیتابیس نمی‌زند. به این می‌گویند <strong>lazy evaluation</strong>.</p>
      ${c('python', [
        'qs = Post.objects.filter(is_published=True)   # هنوز هیچ queryای اجرا نشده',
        'qs = qs.exclude(category__slug="news")        # هنوز هم نه',
        'qs = qs.order_by("-created_at")[:10]          # هنوز هم نه',
        '',
        'for post in qs:                               # ← اینجا query اجرا می‌شود',
        '    print(post.title)',
        '',
        'len(qs)      # نتیجه از cache خوانده می‌شود، query دوباره اجرا نمی‌شود',
      ], 'تنبلی در عمل')}
      ${tbl(['این کار', 'query اجرا می‌کند؟'], [
        ['<code>qs = Post.objects.filter(...)</code>', 'خیر'],
        ['<code>qs2 = qs.exclude(...)</code>', 'خیر'],
        ['<code>for p in qs:</code>', 'بله'],
        ['<code>list(qs)</code> / <code>len(qs)</code>', 'بله'],
        ['<code>qs[0]</code>', 'بله (با LIMIT 1)'],
        ['<code>qs.count()</code>', 'بله (COUNT در دیتابیس)'],
        ['<code>qs.exists()</code>', 'بله (با LIMIT 1)'],
        ['<code>{% for p in qs %}</code> در template', 'بله'],
      ])}
      ${callout('warn', 'اشتباه رایج عملکردی', 'برای بررسی «آیا نتیجه‌ای هست؟» از <code>if qs.count() > 0</code> یا <code>if len(qs)</code> استفاده نکنید؛ اولی همه ردیف‌ها را می‌شمارد و دومی همه را در حافظه می‌آورد. بنویسید <code>if qs.exists()</code>.')}
      ${callout('danger', 'برش بعد از برش ممنوع', 'بعد از <code>qs[:10]</code> دیگر نمی‌توانید <code>.filter()</code> یا <code>.order_by()</code> بزنید؛ خطای <code>Cannot filter a query once a slice has been taken</code> می‌گیرید. اول فیلتر و مرتب‌سازی، آخر برش.')}
      ${quiz('این کد چند بار به دیتابیس می‌زند؟<br><code>posts = Post.objects.all()</code><br><code>print(posts.count())</code><br><code>for p in posts: ...</code>', [
        'یک بار.',
        'دو بار: یکی برای <code>COUNT(*)</code> و یکی برای خواندن ردیف‌ها هنگام حلقه.',
        'صفر بار.',
      ], 1, '<code>count()</code> یک query جدا اجرا می‌کند و نتیجه‌اش را cache نمی‌کند. اگر بعدش حلقه هم بزنید، query دوم اجرا می‌شود. اگر هر دو را لازم دارید: <code>posts = list(Post.objects.all())</code> و بعد <code>len(posts)</code>.')}
    `),

    s('ORM و کوئری', 'Field Lookups — زبان فیلتر Django', 'با دو زیرخط، هر شرطی که در SQL می‌خواهید بسازید.', `
      <p>الگو همیشه <code>&lt;field&gt;__&lt;lookup&gt;=&lt;value&gt;</code> است. بدون lookup، یعنی برابری دقیق.</p>
      ${tbl(['Lookup', 'معنی', 'مثال'], [
        ['<code>exact</code> / <code>iexact</code>', 'برابری دقیق / بدون حساسیت به بزرگی حروف', '<code>title__iexact="django"</code>'],
        ['<code>contains</code> / <code>icontains</code>', 'شامل بودن متن', '<code>title__icontains="جنگو"</code>'],
        ['<code>startswith</code> / <code>endswith</code>', 'شروع/پایان با', '<code>slug__startswith="how-"</code>'],
        ['<code>in</code>', 'عضو یک فهرست', '<code>id__in=[1, 2, 3]</code>'],
        ['<code>gt</code> / <code>gte</code> / <code>lt</code> / <code>lte</code>', 'بزرگ‌تر / کوچک‌تر', '<code>price__gte=100000</code>'],
        ['<code>range</code>', 'بین دو مقدار', '<code>price__range=(1000, 5000)</code>'],
        ['<code>isnull</code>', 'خالی بودن', '<code>published_at__isnull=True</code>'],
        ['<code>date</code> / <code>year</code> / <code>month</code> / <code>day</code>', 'اجزای تاریخ', '<code>created_at__year=2025</code>'],
        ['<code>regex</code> / <code>iregex</code>', 'تطبیق با عبارت باقاعده', '<code>sku__regex=r"^[A-Z]{3}"</code>'],
      ])}
      ${c('python', [
        '# پیمایش رابطه با __ — به هر عمقی',
        'Post.objects.filter(category__slug="django")',
        'Post.objects.filter(author__username="ali")',
        'OrderItem.objects.filter(order__user__email__endswith="@example.com")',
        '',
        '# ترکیب چند شرط (AND)',
        'Product.objects.filter(is_active=True, stock__gt=0, price__lte=500000)',
        '',
        '# نفی',
        'Post.objects.exclude(status="draft")',
        '',
        '# رابطه معکوس هم کار می‌کند',
        'Category.objects.filter(posts__is_published=True).distinct()',
      ], 'lookup روی رابطه‌ها')}
      ${callout('tip', 'چرا distinct لازم شد؟', 'وقتی روی رابطه یک‌به‌چند فیلتر می‌کنید، هر دسته به‌ازای هر مقاله منتشرشده یک بار در نتیجه می‌آید. <code>distinct()</code> تکرارها را حذف می‌کند.')}
      ${exercise('سه فیلتر', 'متوسط', '<p>بنویسید: ۱) محصولات فعال با موجودی بیشتر از صفر و قیمت زیر ۵۰۰٬۰۰۰، ۲) مقاله‌های امسال، ۳) کاربرانی که ایمیلشان به <code>@gmail.com</code> ختم می‌شود.</p>', c('python', [
        'Product.objects.filter(is_active=True, stock__gt=0, price__lt=500_000)',
        'Post.objects.filter(created_at__year=2025)',
        'User.objects.filter(email__iendswith="@gmail.com")',
      ], 'راه‌حل'))}
    `),

    s('ORM و کوئری', 'get یا filter؟ و استثناهایشان', 'انتخاب اشتباه اینجا، مستقیم به خطای 500 ختم می‌شود.', `
      ${tbl(['متد', 'وقتی چیزی پیدا نشود', 'وقتی چند مورد پیدا شود'], [
        ['<code>.get()</code>', 'استثنای <code>Model.DoesNotExist</code>', 'استثنای <code>MultipleObjectsReturned</code>'],
        ['<code>.filter()</code>', 'QuerySet خالی (بدون خطا)', 'QuerySet با چند عضو'],
        ['<code>.first()</code>', '<code>None</code>', 'اولین مورد'],
        ['<code>get_object_or_404()</code>', 'پاسخ HTTP 404', 'استثنا'],
      ])}
      ${c('python', [
        'from django.core.exceptions import MultipleObjectsReturned',
        'from django.shortcuts import get_object_or_404',
        'from .models import Post',
        '',
        '# روش پیشنهادی در view — تمیزترین حالت',
        'post = get_object_or_404(Post, slug=slug, is_published=True)',
        '',
        '# روش دستی، وقتی می‌خواهید رفتار خاصی بدهید',
        'try:',
        '    post = Post.objects.get(slug=slug)',
        'except Post.DoesNotExist:',
        '    return redirect("home")',
        'except MultipleObjectsReturned:',
        '    post = Post.objects.filter(slug=slug).first()',
        '',
        '# بدون خطر استثنا',
        'post = Post.objects.filter(slug=slug).first()   # ممکن است None باشد',
      ], 'مدیریت درست')}
      ${c('python', [
        '# ساخت-یا-گرفتن: بسیار پرکاربرد',
        'category, created = Category.objects.get_or_create(',
        '    slug="django",',
        '    defaults={"name": "جنگو"},      # فقط هنگام ساخت استفاده می‌شود',
        ')',
        '',
        '# به‌روزرسانی-یا-ساخت',
        'profile, created = Profile.objects.update_or_create(',
        '    user=user,',
        '    defaults={"phone": "0912..."},',
        ')',
      ], 'get_or_create و update_or_create')}
      ${callout('danger', 'get با فیلد غیریکتا', '<code>Post.objects.get(is_published=True)</code> اگر دو مقاله منتشرشده باشد خطای <code>MultipleObjectsReturned</code> می‌دهد و صفحه ۵۰۰ می‌شود. <code>get()</code> فقط با فیلدهای یکتا مثل <code>pk</code> یا <code>slug</code> استفاده کنید.')}
    `),

    s('ORM و کوئری', 'Q و F', 'Q برای ترکیب شرط‌ها و F برای کار با ستون‌هاست.', `
      <p>با <code>Q</code> می‌توانید شرط‌های OR و NOT بسازید؛ با <code>F</code> می‌توانید فیلد را با فیلد دیگر مقایسه یا به‌روزرسانی کنید — بدون آوردن داده به Python.</p>
      ${c('python', [
        'from django.db.models import F, Q',
        '',
        '# OR با Q (در جست‌وجو استفاده می‌شود)',
        'results = Post.objects.filter(',
        '    Q(title__icontains="django") | Q(body__icontains="django")',
        ')',
        '',
        '# NOT با Q',
        'drafts = Post.objects.filter(~Q(status="published"))',
        '',
        '# ترکیب پیچیده',
        'Product.objects.filter(',
        '    Q(is_active=True) & (Q(stock__gt=0) | Q(is_preorder=True))',
        ')',
        '',
        '# مقایسه فیلد با فیلد دیگر با F',
        'promoted = Product.objects.filter(sale_price__lt=F("price"))',
        '',
        '# کاهش موجودی بدون race condition',
        'Product.objects.filter(id=1, stock__gte=1).update(stock=F("stock") - 1)',
      ], 'Q و F')}
      ${callout('danger', 'چرا F حیاتی است؟', 'اگر بنویسید <code>product.stock -= 1</code> و بعد <code>save()</code>، مقدار قدیمی را از حافظه می‌خوانید. اگر دو کاربر هم‌زمان خرید کنند، هر دو مقدار ۵ را می‌خوانند و هر دو ۴ می‌نویسند — یک واحد موجودی گم می‌شود. <code>F("stock") - 1</code> این محاسبه را داخل دیتابیس و به‌صورت اتمیک انجام می‌دهد.')}
      ${callout('warn', 'ترتیب آرگومان‌ها', 'در <code>filter()</code> آرگومان‌های <code>Q</code> باید <em>قبل</em> از آرگومان‌های کلیدواژه‌ای بیایند: <code>filter(Q(a=1) | Q(b=2), is_active=True)</code> درست است، برعکسش خطای نحوی Python می‌دهد.')}
    `),

    s('ORM و کوئری', 'aggregate و annotate', 'محاسبه در دیتابیس، نه در Python.', `
      <p><code>aggregate</code> یک عدد برای کل QuerySet می‌دهد؛ <code>annotate</code> یک ستون محاسباتی به هر ردیف اضافه می‌کند.</p>
      ${c('python', [
        'from django.db.models import Avg, Count, Max, Min, Sum',
        '',
        '# aggregate → یک دیکشنری برای کل نتیجه',
        'Product.objects.aggregate(Avg("price"), Max("price"), Count("id"))',
        '# {"price__avg": 480000.0, "price__max": 12000000, "id__count": 42}',
        '',
        '# annotate → یک ستون اضافه روی هر ردیف',
        'categories = Category.objects.annotate(post_count=Count("posts"))',
        'for category in categories:',
        '    print(category.name, category.post_count)',
        '',
        '# فیلتر و مرتب‌سازی روی ستون محاسباتی',
        'Category.objects.annotate(',
        '    published=Count("posts", filter=Q(posts__is_published=True))',
        ').filter(published__gt=0).order_by("-published")',
        '',
        '# جمع کل یک سفارش',
        'order.items.aggregate(total=Sum(F("price") * F("quantity")))["total"]',
      ], 'محاسبات تجمعی')}
      ${tbl(['به‌جای این کار در Python', 'این را بنویسید'], [
        ['<code>sum(p.price for p in products)</code>', '<code>products.aggregate(Sum("price"))</code>'],
        ['<code>len(category.posts.all())</code>', '<code>category.posts.count()</code>'],
        ['حلقه برای شمارش مقاله هر دسته', '<code>annotate(Count("posts"))</code>'],
      ])}
      ${callout('tip', 'چرا در دیتابیس؟', 'محاسبه در دیتابیس یعنی فقط نتیجه از شبکه عبور می‌کند، نه هزاران ردیف. تفاوت عملکرد در جدول‌های بزرگ چند برابر است.')}
      ${exercise('گزارش فروشگاه', 'متوسط', '<p>یک query بنویسید که برای هر دسته محصول، تعداد محصولات فعال و گران‌ترین قیمت را بدهد و بر اساس تعداد نزولی مرتب کند.</p>', c('python', [
        'from django.db.models import Count, Max, Q',
        '',
        'ProductCategory.objects.annotate(',
        '    active_count=Count("products", filter=Q(products__is_active=True)),',
        '    top_price=Max("products__price"),',
        ').order_by("-active_count")',
      ], 'راه‌حل'))}
    `),

    s('ORM و کوئری', 'مسئله N+1 و راه‌حل آن', 'رایج‌ترین علت کندی یک صفحه Django.', `
      <p>وقتی روی یک لیست حلقه می‌زنید و داخل حلقه به رابطه هر شیء دست می‌زنید، Django برای هر ردیف یک query جدا اجرا می‌کند: ۱ query برای لیست + N query برای رابطه‌ها.</p>
      ${c('python', [
        '# ✗ بد — ۱ + ۵۰ query برای ۵۰ مقاله',
        'posts = Post.objects.all()[:50]',
        'for post in posts:',
        '    print(post.author.username)      # هر بار یک query جدید!',
        '',
        '# ✓ خوب — فقط ۱ query با JOIN',
        'posts = Post.objects.select_related("author", "category")[:50]',
        'for post in posts:',
        '    print(post.author.username)      # از همان نتیجه خوانده می‌شود',
      ], 'ForeignKey: select_related')}
      ${c('python', [
        '# برای ManyToMany و رابطه معکوس، select_related کار نمی‌کند',
        '# ✓ prefetch_related: ۲ query (یکی برای مقاله‌ها، یکی برای همه برچسب‌ها)',
        'posts = Post.objects.prefetch_related("tags", "comments")',
        '',
        '# ترکیب هر دو',
        'posts = (',
        '    Post.objects',
        '    .select_related("author", "category")     # چند-به-یک',
        '    .prefetch_related("tags")                 # چند-به-چند',
        '    .filter(is_published=True)',
        ')',
        '',
        '# کنترل دقیق prefetch',
        'from django.db.models import Prefetch',
        '',
        'Post.objects.prefetch_related(',
        '    Prefetch("comments", queryset=Comment.objects.filter(is_approved=True))',
        ')',
      ], 'ManyToMany: prefetch_related')}
      ${tbl(['نوع رابطه', 'ابزار درست', 'چطور کار می‌کند'], [
        ['<code>ForeignKey</code> (رو به جلو)', '<code>select_related</code>', 'یک JOIN در همان query.'],
        ['<code>OneToOneField</code>', '<code>select_related</code>', 'یک JOIN.'],
        ['<code>ManyToManyField</code>', '<code>prefetch_related</code>', 'query دوم و اتصال در Python.'],
        ['رابطه معکوس ForeignKey', '<code>prefetch_related</code>', 'query دوم.'],
      ])}
      ${callout('warn', 'چطور بفهمم N+1 دارم؟', 'با Django Debug Toolbar (بخش خطایابی) تعداد query هر صفحه دیده می‌شود. اگر با اضافه‌شدن هر ردیف به لیست، تعداد queryها هم زیاد می‌شود، N+1 دارید.')}
    `),

    s('ORM و کوئری', 'Manager و QuerySet سفارشی', 'query تکراری را یک بار بنویسید، همه‌جا استفاده کنید.', `
      <p>وقتی <code>filter(is_published=True, published_at__lte=now())</code> در ده جای پروژه تکرار شود، اگر منطق «منتشرشده» عوض شود باید ده جا را عوض کنید. راه‌حل: انتقال آن به QuerySet سفارشی.</p>
      ${c('python', [
        '# blog/models.py',
        'from django.db import models',
        'from django.utils import timezone',
        '',
        '',
        'class PostQuerySet(models.QuerySet):',
        '    def published(self):',
        '        return self.filter(is_published=True, published_at__lte=timezone.now())',
        '',
        '    def by_category(self, slug):',
        '        return self.filter(category__slug=slug)',
        '',
        '    def with_relations(self):',
        '        return self.select_related("author", "category").prefetch_related("tags")',
        '',
        '',
        'class Post(models.Model):',
        '    # ...فیلدها...',
        '',
        '    objects = PostQuerySet.as_manager()',
      ], 'تعریف QuerySet سفارشی')}
      ${c('python', [
        '# استفاده — قابل زنجیر کردن',
        'Post.objects.published()',
        'Post.objects.published().by_category("django").with_relations()[:10]',
        '',
        '# در view',
        'def post_list(request):',
        '    posts = Post.objects.published().with_relations()',
        '    return render(request, "blog/post_list.html", {"posts": posts})',
      ], 'استفاده')}
      ${callout('tip', 'چرا as_manager و نه Manager جدا؟', 'با <code>PostQuerySet.as_manager()</code> متدها هم روی <code>Post.objects</code> و هم روی نتیجه هر filter در دسترس‌اند و می‌توانید آن‌ها را زنجیر کنید. با کلاس <code>Manager</code> جداگانه فقط سطح اول کار می‌کند.')}
      ${exercise('QuerySet فروشگاه', 'متوسط', '<p>برای <code>Product</code> یک QuerySet سفارشی با متدهای <code>active()</code> (فعال و موجود) و <code>cheap(limit)</code> (ارزان‌تر از مبلغ داده‌شده) بسازید.</p>', c('python', [
        'class ProductQuerySet(models.QuerySet):',
        '    def active(self):',
        '        return self.filter(is_active=True, stock__gt=0)',
        '',
        '    def cheap(self, limit):',
        '        return self.filter(price__lte=limit)',
        '',
        '',
        'class Product(models.Model):',
        '    # ...',
        '    objects = ProductQuerySet.as_manager()',
        '',
        '',
        '# Product.objects.active().cheap(500_000)',
      ], 'راه‌حل'))}
    `),

    s('ORM و کوئری', 'تراکنش: همه یا هیچ', 'وقتی چند نوشتن باید با هم موفق یا با هم لغو شوند.', `
      <p>ثبت سفارش یعنی: ساخت <code>Order</code>، ساخت چند <code>OrderItem</code>، کم‌کردن موجودی. اگر وسط کار خطایی رخ دهد، نباید سفارشی نصفه در دیتابیس بماند. تراکنش دقیقا همین را تضمین می‌کند.</p>
      ${flow(['شروع تراکنش', 'ساخت Order', 'ساخت OrderItemها', 'کاهش موجودی', 'commit یا rollback'])}
      ${c('python', [
        'from django.db import transaction',
        '',
        '',
        '@transaction.atomic',
        'def place_order(user, cart):',
        '    order = Order.objects.create(user=user)',
        '    for item in cart:',
        '        OrderItem.objects.create(',
        '            order=order,',
        '            product=item["product"],',
        '            quantity=item["quantity"],',
        '            price=item["product"].price,',
        '        )',
        '        updated = Product.objects.filter(',
        '            pk=item["product"].pk, stock__gte=item["quantity"]',
        '        ).update(stock=F("stock") - item["quantity"])',
        '',
        '        if not updated:                      # موجودی کافی نبود',
        '            raise ValueError("موجودی کافی نیست")   # ← کل تراکنش برمی‌گردد',
        '    return order',
      ], 'دکوریتور atomic')}
      ${c('python', [
        '# به‌صورت بلوک، برای بخشی از تابع',
        'with transaction.atomic():',
        '    order.status = Order.Status.PAID',
        '    order.save()',
        '    payment.mark_settled()',
        '',
        '# قفل ردیف تا پایان تراکنش (جلوگیری از فروش هم‌زمان)',
        'with transaction.atomic():',
        '    product = Product.objects.select_for_update().get(pk=pk)',
        '    product.stock -= 1',
        '    product.save()',
      ], 'بلوک atomic و select_for_update')}
      ${callout('warn', 'استثنا را نبلعید', 'تراکنش فقط وقتی برمی‌گردد که استثنا از بلوک <code>atomic</code> بیرون بزند. اگر داخل بلوک <code>try/except</code> بگذارید و خطا را بی‌صدا رد کنید، تراکنش commit می‌شود و داده ناقص می‌ماند.')}
    `),

    s('ORM و کوئری', 'داده اولیه: fixture و management command', 'پروژه خالی قابل آزمایش نیست.', `
      <p>برای توسعه و تست، به داده نمونه نیاز دارید. دو راه استاندارد وجود دارد.</p>
      ${c('bash', [
        '# گرفتن خروجی از دیتابیس فعلی',
        'python manage.py dumpdata blog --indent 2 > blog/fixtures/sample.json',
        '',
        '# بارگذاری در هر محیط دیگر',
        'python manage.py loaddata sample',
      ], 'روش ۱: fixture')}
      ${c('python', [
        '# blog/management/commands/seed.py',
        '# ساختار پوشه‌ها لازم است: management/__init__.py و commands/__init__.py',
        'from django.core.management.base import BaseCommand',
        'from django.contrib.auth import get_user_model',
        'from blog.models import Category, Post',
        '',
        '',
        'class Command(BaseCommand):',
        '    help = "ساخت داده نمونه برای توسعه"',
        '',
        '    def add_arguments(self, parser):',
        '        parser.add_argument("--posts", type=int, default=10)',
        '',
        '    def handle(self, *args, **options):',
        '        user, _ = get_user_model().objects.get_or_create(',
        '            username="demo", defaults={"is_staff": True}',
        '        )',
        '        category, _ = Category.objects.get_or_create(',
        '            slug="django", defaults={"name": "جنگو"}',
        '        )',
        '',
        '        for i in range(1, options["posts"] + 1):',
        '            Post.objects.get_or_create(',
        '                slug=f"sample-{i}",',
        '                defaults={',
        '                    "title": f"مقاله نمونه {i}",',
        '                    "body": "متن آزمایشی.",',
        '                    "author": user,',
        '                    "category": category,',
        '                    "is_published": True,',
        '                },',
        '            )',
        '',
        '        self.stdout.write(self.style.SUCCESS("داده نمونه ساخته شد."))',
      ], 'روش ۲: دستور سفارشی')}
      ${c('bash', ['python manage.py seed --posts 20'], 'اجرای دستور')}
      ${callout('tip', 'کدام را انتخاب کنم؟', 'fixture برای داده ثابت و کوچک (مثل فهرست استان‌ها) خوب است. دستور سفارشی برای داده توسعه بهتر است چون با <code>get_or_create</code> قابل اجرای مکرر است و با تغییر مدل نمی‌شکند.')}
    `),

    s('ORM و کوئری', 'نقطه کنترل بخش ORM', 'سنجش تسلط بر پرکاربردترین بخش Django.', `
      ${checklist('باید بتوانید', [
        'بگویید یک QuerySet دقیقا در کدام خط به دیتابیس می‌زند.',
        'با lookupها روی رابطه‌ها فیلتر بنویسید.',
        'تفاوت <code>get</code>، <code>filter</code> و <code>first</code> و استثناهایشان را توضیح دهید.',
        'یک N+1 را در کد تشخیص دهید و با <code>select_related</code> یا <code>prefetch_related</code> رفع کنید.',
        'با <code>annotate</code> گزارش شمارشی بسازید.',
        'بدانید چرا کاهش موجودی باید با <code>F()</code> و داخل تراکنش انجام شود.',
        'با دستور <code>seed</code> داده نمونه بسازید.',
      ])}
      ${exercise('تمرین ترکیبی ORM', 'چالشی', `
        <p>در <code>python manage.py shell</code> این‌ها را بنویسید و خروجی هرکدام را ثبت کنید:</p>
        <ol>
          <li>۵ مقاله منتشرشده جدید، همراه نویسنده و دسته، با حداقل تعداد query.</li>
          <li>تعداد مقاله‌های هر دسته، مرتب‌شده از بیشترین.</li>
          <li>محصولاتی که قیمت فروش ویژه‌شان از قیمت اصلی کمتر است.</li>
          <li>افزایش ۱۰ درصدی قیمت همه محصولات یک دسته، در یک query.</li>
        </ol>`, c('python', [
        'from django.db.models import Count, F',
        '',
        '# ۱',
        'Post.objects.filter(is_published=True).select_related("author", "category").order_by("-created_at")[:5]',
        '',
        '# ۲',
        'Category.objects.annotate(total=Count("posts")).order_by("-total")',
        '',
        '# ۳',
        'Product.objects.filter(sale_price__lt=F("price"))',
        '',
        '# ۴ — بدون حلقه و بدون آوردن داده به Python',
        'Product.objects.filter(category__slug="digital").update(price=F("price") * 11 / 10)',
      ], 'راه‌حل'))}
    `)
  );
})(window);
