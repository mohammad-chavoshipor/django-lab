(function (global) {
  'use strict';
  const { c, callout, exercise, tbl, flow, slide: s, objectives, lab, checklist, quiz } = global.DL;

  global.SLIDES.push(
    s('کارگاه تمرین', 'چطور تمرین کنیم؟', 'تفاوت «دیدن آموزش» و «بلد بودن» فقط در تمرین است.', `
      ${objectives([
        'با برنامه ۳۰ روزه پیش بروید و هر روز خروجی قابل اجرا بسازید.',
        'تمرین‌های پنج سطح را بدون نگاه‌کردن به راه‌حل انجام دهید.',
        'پروژه پایانی خودتان را طراحی و پیاده کنید.',
        'کار خودتان را با معیار ارزیابی نمره بدهید.',
      ])}
      ${tbl(['روش غلط', 'روش درست'], [
        ['کد را از اسلاید کپی و اجرا می‌کنم.', 'کد را می‌بندم و از حافظه می‌نویسم؛ بعد مقایسه می‌کنم.'],
        ['وقتی خطا دیدم، فورا جواب را می‌جویم.', '۱۰ دقیقه خودم traceback را می‌خوانم، بعد جست‌وجو.'],
        ['همه ویدیو/اسلایدها را یک‌جا می‌بینم.', 'هر بخش را می‌بینم و بلافاصله تمرینش را می‌زنم.'],
        ['پروژه را یک شبه می‌سازم.', 'هر روز یک قابلیت کوچک، با commit و تست.'],
        ['تمرین را می‌خوانم و می‌گویم «بلدم».', 'می‌نویسم، اجرا می‌کنم و خروجی را می‌بینم.'],
      ])}
      ${callout('tip', 'قانون ۲۰ دقیقه', 'اگر ۲۰ دقیقه روی یک خطا گیر کردید و پیشرفتی نبود، مسئله را روی کاغذ بنویسید: چه انتظاری داشتم، چه دیدم، چه چیزهایی را امتحان کردم. اغلب همین نوشتن، جواب را نشان می‌دهد.')}
      ${callout('warn', 'راه‌حل‌ها را زود باز نکنید', 'هر تمرین دکمه «نمایش راه‌حل» دارد. اگر قبل از تلاش بازش کنید، مغزتان تصور می‌کند یاد گرفته — ولی در پروژه واقعی نمی‌توانید بازتولیدش کنید.')}
    `),

    s('کارگاه تمرین', 'برنامه ۳۰ روزه', 'روزی یک تا دو ساعت، با خروجی مشخص.', `
      ${tbl(['روزها', 'موضوع', 'خروجی روز'], [
        ['۱ تا ۳', 'مبانی وب و DevTools', 'تحلیل ۳ سایت در تب Network و یادداشت status codeها.'],
        ['۴ تا ۶', 'پیش‌نیاز Python و HTML', 'اسکریپت کلاس <code>Product</code> و یک فرم HTML کامل.'],
        ['۷ تا ۹', 'راه‌اندازی Django، URL و View', 'پروژه‌ای با ۳ صفحه و اولین تست سبز.'],
        ['۱۰ تا ۱۳', 'مدل، migration و admin', 'مدل‌های blog با Custom User و داده نمونه در admin.'],
        ['۱۴ تا ۱۶', 'ORM و کوئری', 'دفترچه‌ای از ۲۰ query در shell، همراه خروجی.'],
        ['۱۷ تا ۱۹', 'Template و static', 'صفحات فهرست، جزئیات و دسته‌بندی با base مشترک.'],
        ['۲۰ تا ۲۲', 'فرم و اعتبارسنجی', 'فرم ثبت نظر و فرم مقاله با آپلود تصویر.'],
        ['۲۳ تا ۲۵', 'احراز هویت و امنیت', 'ثبت‌نام، ورود، داشبورد و بررسی مالکیت.'],
        ['۲۶ تا ۲۷', 'فروشگاه و سبد', 'سبد session، افزودن و حذف، شمارنده در header.'],
        ['۲۸', 'سفارش و تراکنش', 'ثبت سفارش با کاهش موجودی و تست آن.'],
        ['۲۹', 'تست و بهینه‌سازی', 'حداقل ۸ تست سبز و رفع N+1 صفحه اصلی.'],
        ['۳۰', 'استقرار', 'سایت زنده روی HTTPS با <code>DEBUG=False</code>.'],
      ])}
      ${callout('info', 'اگر عقب افتادید', 'برنامه را کش ندهید، عمق را کم کنید. مثلا فروشگاه را بدون سفارش تحویل دهید ولی همان بخش را کامل و تست‌شده. یک پروژه کوچک کامل، از یک پروژه بزرگ نیمه‌کاره خیلی ارزشمندتر است.')}
    `),

    s('کارگاه تمرین', 'سطح ۱ — مبانی و پیش‌نیاز', 'اگر این‌ها را نمی‌توانید، به عقب برگردید.', `
      ${exercise('۱٫۱ تحلیل چرخه request', 'آسان', '<p>یک فرم ورود در سایتی دلخواه پر کنید و در تب Network بگویید: چه method، چه status code، چه هدر <code>Set-Cookie</code> و چه redirectای رخ داد.</p>', '<p>انتظار: <code>POST</code> به آدرس ورود، status <code>302</code> در صورت موفقیت (یا <code>200</code> در صورت خطای فرم)، هدر <code>Set-Cookie</code> با یک شناسه session، و سپس یک <code>GET</code> به صفحه مقصد.</p>')}
      ${exercise('۱٫۲ کلاس و وراثت', 'آسان', '<p>کلاس <code>Item</code> با <code>name</code> و <code>price</code> بسازید و کلاس <code>DiscountedItem</code> که از آن ارث ببرد و متد <code>final_price()</code> با درصد تخفیف داشته باشد.</p>', c('python', [
        'class Item:',
        '    def __init__(self, name, price):',
        '        self.name = name',
        '        self.price = price',
        '',
        '    def final_price(self):',
        '        return self.price',
        '',
        '    def __str__(self):',
        '        return f"{self.name}: {self.final_price()}"',
        '',
        '',
        'class DiscountedItem(Item):',
        '    def __init__(self, name, price, percent):',
        '        super().__init__(name, price)',
        '        self.percent = percent',
        '',
        '    def final_price(self):',
        '        return self.price - self.price * self.percent // 100',
      ], 'راه‌حل'))}
      ${exercise('۱٫۳ فرم HTML خام', 'آسان', '<p>یک فرم ثبت‌نام با نام کاربری، ایمیل، رمز و آپلود آواتار بنویسید که آماده ارسال به Django باشد.</p>', c('html', [
        '<form method="post" action="/accounts/signup/" enctype="multipart/form-data">',
        '  <label for="id_username">نام کاربری</label>',
        '  <input type="text" name="username" id="id_username" required>',
        '',
        '  <label for="id_email">ایمیل</label>',
        '  <input type="email" name="email" id="id_email" required>',
        '',
        '  <label for="id_password1">رمز عبور</label>',
        '  <input type="password" name="password1" id="id_password1" required>',
        '',
        '  <label for="id_avatar">آواتار</label>',
        '  <input type="file" name="avatar" id="id_avatar" accept="image/*">',
        '',
        '  <button type="submit">ثبت‌نام</button>',
        '</form>',
      ], 'راه‌حل') + '<p>نکته کلیدی: <code>enctype</code> برای فایل، <code>name</code> روی همه ورودی‌ها و <code>method="post"</code>.</p>')}
    `),

    s('کارگاه تمرین', 'سطح ۲ — مدل و ORM', 'قلب هر پروژه Django.', `
      ${exercise('۲٫۱ مدل‌سازی دامنه', 'متوسط', `
        <p>برای یک «کتابخانه» مدل بسازید: <code>Author</code>، <code>Book</code>، <code>Member</code> و <code>Loan</code> (امانت). شرایط:</p>
        <ul>
          <li>هر کتاب یک نویسنده دارد؛ حذف نویسنده نباید کتاب‌ها را پاک کند.</li>
          <li>هر امانت یک کتاب و یک عضو دارد، با تاریخ امانت و تاریخ بازگشت (اختیاری).</li>
          <li>یک کتاب نمی‌تواند هم‌زمان دو امانت باز داشته باشد.</li>
        </ul>`, c('python', [
        'from django.conf import settings',
        'from django.db import models',
        '',
        '',
        'class Author(models.Model):',
        '    name = models.CharField(max_length=150)',
        '',
        '',
        'class Book(models.Model):',
        '    author = models.ForeignKey(',
        '        Author, on_delete=models.SET_NULL, null=True, related_name="books"',
        '    )',
        '    title = models.CharField(max_length=200)',
        '    isbn = models.CharField(max_length=13, unique=True)',
        '',
        '',
        'class Loan(models.Model):',
        '    book = models.ForeignKey(Book, on_delete=models.PROTECT, related_name="loans")',
        '    member = models.ForeignKey(',
        '        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="loans"',
        '    )',
        '    borrowed_at = models.DateTimeField(auto_now_add=True)',
        '    returned_at = models.DateTimeField(null=True, blank=True)',
        '',
        '    class Meta:',
        '        constraints = [',
        '            # فقط یک امانت باز برای هر کتاب',
        '            models.UniqueConstraint(',
        '                fields=["book"],',
        '                condition=models.Q(returned_at__isnull=True),',
        '                name="one_open_loan_per_book",',
        '            ),',
        '        ]',
      ], 'راه‌حل') + '<p>نکته: قید شرطی (<code>condition</code>) دقیقا برای همین موارد ساخته شده — بدون آن باید در کد بررسی کنید و همیشه راهی برای دور زدنش باقی می‌ماند.</p>')}
      ${exercise('۲٫۲ ده کوئری', 'متوسط', `
        <p>در shell بنویسید: ۱) کتاب‌های امانت‌داده‌نشده، ۲) اعضایی که بیش از ۳ امانت دارند، ۳) نویسندگان به‌همراه تعداد کتاب، ۴) امانت‌های دیرکرد بیش از ۱۴ روز، ۵) عنوان همه کتاب‌ها فقط به‌صورت لیست رشته.</p>`, c('python', [
        'from datetime import timedelta',
        'from django.db.models import Count, Q',
        'from django.utils import timezone',
        '',
        '# ۱',
        'Book.objects.exclude(loans__returned_at__isnull=True)',
        '',
        '# ۲',
        'User.objects.annotate(n=Count("loans")).filter(n__gt=3)',
        '',
        '# ۳',
        'Author.objects.annotate(book_count=Count("books")).order_by("-book_count")',
        '',
        '# ۴',
        'Loan.objects.filter(',
        '    returned_at__isnull=True,',
        '    borrowed_at__lt=timezone.now() - timedelta(days=14),',
        ').select_related("book", "member")',
        '',
        '# ۵',
        'list(Book.objects.values_list("title", flat=True))',
      ], 'راه‌حل'))}
      ${exercise('۲٫۳ رفع N+1', 'متوسط', '<p>این کد ۱ + N query می‌زند. بازنویسی کنید تا تعداد query ثابت بماند و یک تست <code>assertNumQueries</code> برایش بنویسید.</p>' + c('python', [
        'for loan in Loan.objects.all():',
        '    print(loan.book.title, loan.member.username)',
      ], 'کد مشکل‌دار'), c('python', [
        'for loan in Loan.objects.select_related("book", "member"):',
        '    print(loan.book.title, loan.member.username)',
        '',
        '',
        '# تست محافظ',
        'def test_loan_list_query_count(self):',
        '    with self.assertNumQueries(1):',
        '        list(Loan.objects.select_related("book", "member"))',
      ], 'راه‌حل'))}
    `),

    s('کارگاه تمرین', 'سطح ۳ — View، Template و Form', 'ساخت رابط کاربر.', `
      ${exercise('۳٫۱ صفحه آرشیو ماهانه', 'متوسط', '<p>صفحه‌ای در آدرس <code>/archive/&lt;int:year&gt;/&lt;int:month&gt;/</code> بسازید که مقاله‌های آن ماه را با صفحه‌بندی نشان دهد و اگر ماه نامعتبر بود ۴۰۴ بدهد.</p>', c('python', [
        '# urls.py',
        'path("archive/<int:year>/<int:month>/", views.archive, name="archive"),',
        '',
        '# views.py',
        'from django.http import Http404',
        'from django.core.paginator import Paginator',
        '',
        '',
        'def archive(request, year, month):',
        '    if not 1 <= month <= 12:',
        '        raise Http404("ماه نامعتبر است.")',
        '',
        '    posts = Post.objects.published().filter(',
        '        published_at__year=year, published_at__month=month,',
        '    ).with_relations()',
        '',
        '    page = Paginator(posts, 10).get_page(request.GET.get("page"))',
        '    return render(request, "blog/archive.html", {',
        '        "year": year, "month": month, "page_obj": page,',
        '    })',
      ], 'راه‌حل'))}
      ${exercise('۳٫۲ فیلتر سفارشی', 'متوسط', '<p>فیلتری به نام <code>reading_time</code> بنویسید که از روی تعداد کلمات متن، زمان تقریبی مطالعه را به دقیقه بدهد (فرض: ۲۰۰ کلمه در دقیقه).</p>', c('python', [
        '# blog/templatetags/blog_extras.py',
        'import math',
        'from django import template',
        '',
        'register = template.Library()',
        '',
        '',
        '@register.filter',
        'def reading_time(text, wpm=200):',
        '    words = len(str(text).split())',
        '    return max(1, math.ceil(words / wpm))',
      ], 'راه‌حل') + c('html', ['{% load blog_extras %}', '<span>{{ post.body|reading_time }} دقیقه مطالعه</span>'], 'استفاده'))}
      ${exercise('۳٫۳ فرم با اعتبارسنجی چندفیلدی', 'چالشی', '<p>فرم «رزرو» با <code>start_date</code> و <code>end_date</code> بسازید که: تاریخ شروع در گذشته نباشد، پایان بعد از شروع باشد، و مدت رزرو بیشتر از ۳۰ روز نباشد.</p>', c('python', [
        'from datetime import timedelta',
        'from django import forms',
        'from django.utils import timezone',
        '',
        '',
        'class ReservationForm(forms.Form):',
        '    start_date = forms.DateField(label="از تاریخ")',
        '    end_date = forms.DateField(label="تا تاریخ")',
        '',
        '    def clean_start_date(self):',
        '        start = self.cleaned_data["start_date"]',
        '        if start < timezone.localdate():',
        '            raise forms.ValidationError("تاریخ شروع نمی‌تواند در گذشته باشد.")',
        '        return start',
        '',
        '    def clean(self):',
        '        data = super().clean()',
        '        start, end = data.get("start_date"), data.get("end_date")',
        '',
        '        if not start or not end:',
        '            return data          # خطای فیلدی قبلا ثبت شده',
        '',
        '        if end <= start:',
        '            self.add_error("end_date", "تاریخ پایان باید بعد از شروع باشد.")',
        '        elif end - start > timedelta(days=30):',
        '            self.add_error("end_date", "حداکثر مدت رزرو ۳۰ روز است.")',
        '',
        '        return data',
      ], 'راه‌حل') + '<p>نکته مهم: در <code>clean()</code> حتما با <code>data.get()</code> بخوانید و اگر فیلدی خطا داشته زودتر برگردید — وگرنه <code>KeyError</code> می‌گیرید.</p>')}
    `),

    s('کارگاه تمرین', 'سطح ۴ — احراز هویت و امنیت', 'اینجا اشتباه، هزینه واقعی دارد.', `
      ${exercise('۴٫۱ سه حفره را ببندید', 'چالشی', '<p>در این view سه اشکال امنیتی هست. هر سه را پیدا و رفع کنید.</p>' + c('python', [
        'def order_detail(request, pk):',
        '    order = Order.objects.get(pk=pk)',
        '    return render(request, "shop/order_detail.html", {"order": order})',
        '',
        '',
        'def order_cancel(request, pk):',
        '    order = Order.objects.get(pk=pk)',
        '    order.status = "canceled"',
        '    order.save()',
        '    return redirect("shop:order_list")',
      ], 'کد آسیب‌پذیر'), c('python', [
        'from django.contrib.auth.decorators import login_required',
        'from django.shortcuts import get_object_or_404, redirect, render',
        'from django.views.decorators.http import require_POST',
        '',
        '',
        '@login_required                       # ۱) کاربر مهمان نباید دسترسی داشته باشد',
        'def order_detail(request, pk):',
        '    order = get_object_or_404(        # ۲) DoesNotExist → خطای ۵۰۰',
        '        Order, pk=pk, user=request.user,   # ۳) IDOR: سفارش دیگران دیده می‌شد',
        '    )',
        '    return render(request, "shop/order_detail.html", {"order": order})',
        '',
        '',
        '@login_required',
        '@require_POST                         # تغییر وضعیت نباید با GET ممکن باشد',
        'def order_cancel(request, pk):',
        '    order = get_object_or_404(',
        '        Order, pk=pk, user=request.user, status=Order.Status.PENDING,',
        '    )',
        '    order.status = Order.Status.CANCELED',
        '    order.save(update_fields=["status"])',
        '    return redirect("shop:order_list")',
      ], 'راه‌حل') + '<p>سه اشکال: نبود بررسی ورود، نبود بررسی مالکیت (IDOR)، و امکان تغییر وضعیت با درخواست GET. اشکال چهارم هم داشت: <code>get()</code> بدون مدیریت استثنا.</p>')}
      ${exercise('۴٫۲ تست دسترسی', 'متوسط', '<p>سه تست بنویسید: مهمان به داشبورد دسترسی ندارد، کاربر A نمی‌تواند مقاله B را ویرایش کند، و POST بدون CSRF رد می‌شود.</p>', c('python', [
        'from django.test import TestCase',
        'from django.urls import reverse',
        '',
        '',
        'class AccessTests(TestCase):',
        '    @classmethod',
        '    def setUpTestData(cls):',
        '        cls.a = User.objects.create_user("a", password="pass12345")',
        '        cls.b = User.objects.create_user("b", password="pass12345")',
        '        cls.post = Post.objects.create(author=cls.b, title="x")   # بقیه فیلدها را کامل کنید',
        '',
        '    def test_anonymous_cannot_open_dashboard(self):',
        '        response = self.client.get(reverse("accounts:dashboard"))',
        '        self.assertEqual(response.status_code, 302)',
        '',
        '    def test_user_cannot_edit_others_post(self):',
        '        self.client.login(username="a", password="pass12345")',
        '        url = reverse("blog:post_edit", args=[self.post.slug])',
        '        self.assertEqual(self.client.get(url).status_code, 403)',
        '',
        '    def test_post_without_csrf_is_rejected(self):',
        '        csrf_client = Client(enforce_csrf_checks=True)',
        '        csrf_client.login(username="a", password="pass12345")',
        '        response = csrf_client.post(reverse("blog:post_create"), {"title": "x"})',
        '        self.assertEqual(response.status_code, 403)',
      ], 'راه‌حل') + '<p>نکته: در تست‌های معمولی Django بررسی CSRF خاموش است؛ برای آزمودنش باید <code>Client(enforce_csrf_checks=True)</code> بسازید.</p>')}
    `),

    s('کارگاه تمرین', 'سطح ۵ — چالش‌های خطایابی', 'کد شکسته را درست کنید.', `
      ${exercise('۵٫۱ سبد خالی می‌ماند', 'متوسط', '<p>کاربر محصول را اضافه می‌کند ولی سبد همیشه خالی است. چرا؟</p>' + c('python', [
        'class Cart:',
        '    def __init__(self, request):',
        '        self.session = request.session',
        '        self.items = self.session.get("cart", {})',
        '',
        '    def add(self, product):',
        '        self.items[str(product.id)] = {"quantity": 1}',
      ], 'کد معیوب'), '<p>دو مشکل: یک، <code>session.get()</code> یک کپی برمی‌گرداند و تغییر آن به session نوشته نمی‌شود. دو، حتی با <code>setdefault</code> هم تغییر دیکشنری تودرتو خودکار تشخیص داده نمی‌شود. رفع: بعد از هر تغییر <code>self.session["cart"] = self.items</code> و <code>self.session.modified = True</code> بنویسید.</p>')}
      ${exercise('۵٫۲ تاریخ‌ها ۳ ساعت و نیم عقب‌اند', 'متوسط', '<p>تاریخ ثبت مقاله‌ها همیشه با اختلاف نمایش داده می‌شود. علت و راه‌حل؟</p>', '<p>علت: در کد از <code>datetime.now()</code> استفاده شده که وقت محلی <em>بدون</em> اطلاعات منطقه زمانی می‌دهد، در حالی که <code>USE_TZ=True</code> است و Django انتظار زمان آگاه از منطقه (aware) دارد. راه‌حل: همه‌جا <code>django.utils.timezone.now()</code> و برای نمایش <code>timezone.localtime(value)</code>. برای مقایسه تاریخ روز هم <code>timezone.localdate()</code>.</p>')}
      ${exercise('۵٫۳ صفحه اصلی هر روز کندتر می‌شود', 'چالشی', '<p>صفحه اصلی روز اول ۸۰ میلی‌ثانیه بود و حالا ۴ ثانیه است. با چه ترتیبی بررسی می‌کنید؟</p>', `<ol>
        <li>با Debug Toolbar تعداد query و زمان کل را ببینید — اگر تعداد query با رشد داده زیاد شده، N+1 دارید.</li>
        <li>پنل SQL را مرتب کنید و کندترین query را پیدا کنید؛ <code>EXPLAIN</code> بگیرید و ببینید index استفاده شده یا نه.</li>
        <li>بررسی کنید <code>Meta.ordering</code> روی فیلد بدون index نباشد.</li>
        <li>ببینید صفحه‌بندی دارید یا کل جدول را می‌آورید.</li>
        <li>context processorها را بررسی کنید — یک query سنگین آنجا همه صفحات را کند می‌کند.</li>
        <li>در آخر، برای بخش‌های عمومی cache بگذارید.</li>
      </ol>`)}
      ${exercise('۵٫۴ روی سرور ۵۰۰ می‌دهد ولی محلی سالم است', 'چالشی', '<p>پنج علت محتمل را فهرست کنید.</p>', `<ol>
        <li><code>DEBUG=False</code> و <code>ALLOWED_HOSTS</code> ناقص است.</li>
        <li><code>collectstatic</code> اجرا نشده یا <code>STATIC_ROOT</code> تنظیم نیست.</li>
        <li>متغیر محیطی روی سرور تعریف نشده و <code>ImproperlyConfigured</code> رخ می‌دهد.</li>
        <li><code>migrate</code> روی سرور اجرا نشده و ستون جدید وجود ندارد.</li>
        <li>وابستگی نصب‌نشده (مثل <code>pillow</code> یا درایور PostgreSQL) چون <code>requirements.txt</code> به‌روز نبوده.</li>
      </ol><p>اولین کار: <code>journalctl -u &lt;service&gt; -n 100</code> یا فایل لاگ — traceback واقعی همان‌جاست.</p>`)}
    `),

    s('کارگاه تمرین', 'پروژه پایانی', 'یک پروژه از صفر، با دامنه انتخابی خودتان.', `
      <p>MiniShop را ساختید. حالا یک پروژه <strong>متفاوت</strong> بسازید تا معلوم شود مفاهیم را فهمیده‌اید، نه اینکه کد را حفظ کرده‌اید.</p>
      ${tbl(['گزینه پروژه', 'دامنه', 'چالش اصلی'], [
        ['سامانه رزرو کلاس', 'آموزشگاه', 'تداخل زمانی و ظرفیت.'],
        ['مدیریت تیکت پشتیبانی', 'خدمات', 'وضعیت، تخصیص و نقش‌ها.'],
        ['کتابخانه امانت کتاب', 'فرهنگی', 'امانت باز، دیرکرد و جریمه.'],
        ['ثبت هزینه‌های شخصی', 'مالی', 'گزارش تجمعی و نمودار ماهانه.'],
        ['نوبت‌دهی مطب', 'سلامت', 'بازه زمانی و لغو نوبت.'],
      ])}
      ${checklist('الزامات اجباری پروژه پایانی', [
        'حداقل ۴ مدل با هر سه نوع رابطه (<code>FK</code>، <code>M2M</code>، <code>O2O</code> یا معادل منطقی).',
        'Custom User Model از روز اول.',
        'حداقل یک <code>CheckConstraint</code> یا <code>UniqueConstraint</code> معنادار.',
        'QuerySet سفارشی با حداقل دو متد.',
        'ثبت‌نام، ورود، خروج و داشبورد کاربر.',
        'حداقل ۳ فرم شامل یکی با آپلود فایل و یکی با <code>clean()</code> چندفیلدی.',
        'حداقل یک عملیات چندمرحله‌ای داخل <code>transaction.atomic</code>.',
        'بررسی مالکیت روی همه viewهای ویرایش و حذف.',
        'صفحه‌بندی، جست‌وجو و فیلتر.',
        'قالب پایه، حداقل دو partial و یک فیلتر یا تگ سفارشی.',
        'صفحات <code>404</code>، <code>403</code> و <code>500</code>.',
        'حداقل ۱۰ تست شامل تست دسترسی و تست منطق اصلی.',
        'دستور <code>seed</code> برای داده نمونه.',
        '<code>README.md</code> با نصب و اجرا، و <code>.env.example</code>.',
        'انتشار روی یک سرور با HTTPS و <code>DEBUG=False</code>.',
      ])}
      ${callout('tip', 'ترتیب پیشنهادی ساخت', 'مدل‌ها و admin ← داده نمونه ← صفحات فقط‌خواندنی ← احراز هویت ← فرم‌ها ← منطق اصلی با تراکنش ← تست ← بهینه‌سازی ← استقرار. بعد از هر مرحله commit بزنید.')}
    `),

    s('کارگاه تمرین', 'معیار ارزیابی پروژه', 'کار خودتان را با همین جدول نمره بدهید.', `
      ${tbl(['معیار', 'سهم', 'نمره کامل یعنی'], [
        ['طراحی داده', '۲۰', 'رابطه‌ها درست، <code>on_delete</code> آگاهانه، constraint و index معنادار، بدون داده تکراری.'],
        ['درستی عملکرد', '۲۰', 'همه مسیرهای اصلی کاربر بدون خطا کار می‌کنند؛ حالت‌های مرزی (سبد خالی، موجودی صفر) مدیریت شده‌اند.'],
        ['امنیت', '۲۰', 'بررسی مالکیت در همه‌جا، CSRF، اعتبارسنجی سمت سرور، secret در environment، <code>DEBUG=False</code>.'],
        ['کیفیت کد', '۱۵', 'منطق در جای درست (مدل/service نه view یا قالب)، بدون تکرار، نام‌گذاری روشن.'],
        ['تست', '۱۵', 'حداقل ۱۰ تست معنادار شامل دسترسی و منطق اصلی؛ همه سبز.'],
        ['تحویل و مستندات', '۱۰', 'سایت زنده، README قابل اجرا، <code>.env.example</code>، تاریخچه git تمیز.'],
      ])}
      ${tbl(['نمره', 'یعنی'], [
        ['۹۰ به بالا', 'آماده مصاحبه کاری Django Junior.'],
        ['۷۵ تا ۸۹', 'مفاهیم را بلدید؛ روی امنیت و تست کار کنید.'],
        ['۶۰ تا ۷۴', 'پروژه کار می‌کند ولی شکننده است؛ بخش‌های مربوطه را دوباره ببینید.'],
        ['زیر ۶۰', 'قبل از ادامه، پروژه MiniShop را کامل و تست‌شده بسازید.'],
      ])}
      ${callout('warn', 'امنیت را با ویژگی معاوضه نکنید', 'در ارزیابی واقعی، یک پروژه با ۵ قابلیت امن، از پروژه‌ای با ۱۵ قابلیت که هرکدام حفره IDOR دارند بالاتر است. هیچ کارفرمایی برای «تعداد صفحه» استخدام نمی‌کند.')}
    `),

    s('کارگاه تمرین', 'بعد از این دوره', 'مسیر ادامه، به ترتیب اولویت.', `
      ${tbl(['گام بعدی', 'چرا', 'از کجا'], [
        ['خواندن مستندات رسمی Django', 'کامل‌ترین و به‌روزترین منبع؛ مهارت خواندن مستندات از خود Django مهم‌تر است.', '<code>docs.djangoproject.com</code>'],
        ['Django REST Framework', 'اگر با frontend جدا یا موبایل کار می‌کنید.', 'بعد از تسلط بر form و permission.'],
        ['PostgreSQL جدی‌تر', 'index، EXPLAIN، جست‌وجوی متن کامل.', 'وقتی داده‌تان بزرگ شد.'],
        ['Celery و کارهای پس‌زمینه', 'ایمیل، گزارش، پردازش سنگین.', 'وقتی requestها کند شدند.'],
        ['تست پیشرفته و CI', 'اعتماد به تغییرات.', '<code>pytest-django</code> و GitHub Actions.'],
        ['Docker و زیرساخت', 'یکسان‌سازی محیط‌ها.', 'وقتی تیمی کار می‌کنید.'],
        ['خواندن کد پروژه‌های متن‌باز Django', 'دیدن الگوهای واقعی.', 'مخازن با ستاره بالا و کد تمیز.'],
      ])}
      ${flow(['Django پایه', 'پروژه واقعی', 'DRF', 'زیرساخت', 'مقیاس'])}
      ${callout('tip', 'مهم‌ترین توصیه', 'یک پروژه واقعی برای خودتان یا یک نفر دیگر بسازید و نگهداری کنید. مهارت واقعی از «نگهداری کدی که شش ماه پیش نوشتید» می‌آید، نه از تماشای دوره بعدی.')}
      ${callout('info', 'جمع‌بندی دوره', 'شما از مفهوم HTTP شروع کردید و به یک پروژه منتشرشده روی اینترنت رسیدید: مدل و دیتابیس، ORM، view و قالب، فرم، احراز هویت، امنیت، خطایابی، تست، بهینه‌سازی و استقرار. همه چیزهایی که یک توسعه‌دهنده Django در کار روزمره لازم دارد.')}
    `)
  );
})(window);
