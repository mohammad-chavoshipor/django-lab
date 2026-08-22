(function (global) {
  'use strict';
  const { c, callout, exercise, tbl, flow, slide: s, objectives, lab, checklist, quiz } = global.DL;

  global.SLIDES.push(
    s('فرم و اعتبارسنجی', 'چرا Form و نه request.POST؟', 'هر داده‌ای که از بیرون می‌آید، تا اثبات خلافش نامعتبر است.', `
      ${objectives([
        'تفاوت <code>Form</code> و <code>ModelForm</code> را بدانید و درست انتخاب کنید.',
        'الگوی استاندارد view فرم (GET/POST/PRG) را پیاده کنید.',
        'اعتبارسنجی تک‌فیلدی و چندفیلدی بنویسید.',
        'فرم آپلود فایل و تصویر بسازید.',
        'خطاها را به‌شکل قابل فهم به کاربر نشان دهید.',
      ])}
      ${c('python', [
        '# ✗ روش خطرناک — بدون اعتبارسنجی',
        'def post_create(request):',
        '    Post.objects.create(',
        '        title=request.POST["title"],       # اگر نباشد: KeyError → خطای 500',
        '        body=request.POST["body"],         # طول؟ خالی بودن؟ نوع؟ هیچ بررسی‌ای نیست',
        '    )',
      ], 'آنچه نباید بنویسید')}
      ${tbl(['کاری که Form برایتان می‌کند', 'اگر خودتان بنویسید'], [
        'ساخت HTML فیلدها با <code>label</code> و <code>id</code> درست|نوشتن دستی هر فیلد',
        'بررسی اجباری/اختیاری بودن|<code>if not value: ...</code> برای هر فیلد',
        'بررسی نوع و تبدیل (رشته به عدد، تاریخ)|<code>int()</code> داخل <code>try</code>',
        'پیام خطای فارسی کنار هر فیلد|مدیریت دستی دیکشنری خطاها',
        'حفظ مقادیر واردشده هنگام خطا|پرکردن دستی <code>value=</code> هر input',
        'محافظت در برابر فیلدهای دستکاری‌شده|بررسی دستی هر کلید',
      ].map(row => row.split('|')))}
      ${callout('danger', 'قانون طلایی', 'هرگز به داده کاربر اعتماد نکنید — حتی اگر در HTML فیلد را <code>readonly</code> یا <code>hidden</code> گذاشته باشید. کاربر می‌تواند request را دستی بسازد. اعتبارسنجی فقط سمت سرور معتبر است.')}
    `),

    s('فرم و اعتبارسنجی', 'Form یا ModelForm؟', 'اگر داده مستقیم به یک مدل می‌رود، ModelForm بنویسید.', `
      ${c('python', [
        '# forms.Form — وقتی داده به مدل خاصی مربوط نیست',
        'from django import forms',
        '',
        '',
        'class ContactForm(forms.Form):',
        '    name = forms.CharField(max_length=80, label="نام")',
        '    email = forms.EmailField(label="ایمیل")',
        '    subject = forms.ChoiceField(',
        '        choices=[("bug", "گزارش خطا"), ("sales", "فروش")], label="موضوع"',
        '    )',
        '    message = forms.CharField(widget=forms.Textarea, label="پیام")',
        '    accept = forms.BooleanField(label="قوانین را می‌پذیرم")',
      ], 'forms.Form')}
      ${c('python', [
        '# forms.ModelForm — فیلدها از روی مدل ساخته می‌شوند',
        'from django import forms',
        'from .models import Post',
        '',
        '',
        'class PostForm(forms.ModelForm):',
        '    class Meta:',
        '        model = Post',
        '        fields = ["title", "summary", "body", "category", "cover", "is_published"]',
        '        labels = {"title": "عنوان", "body": "متن مقاله"}',
        '        help_texts = {"summary": "حداکثر ۳۰۰ کاراکتر."}',
        '        widgets = {',
        '            "body": forms.Textarea(attrs={"rows": 10, "class": "input"}),',
        '            "summary": forms.TextInput(attrs={"placeholder": "خلاصه کوتاه"}),',
        '        }',
      ], 'forms.ModelForm')}
      ${tbl(['', '<code>Form</code>', '<code>ModelForm</code>'], [
        ['فیلدها', 'دستی تعریف می‌کنید', 'از مدل ساخته می‌شوند'],
        ['ذخیره', 'خودتان می‌نویسید', '<code>form.save()</code>'],
        ['اعتبارسنجی مدل', 'ندارد', '<code>full_clean()</code> مدل اجرا می‌شود'],
        ['کاربرد', 'تماس، جست‌وجو، فیلتر، ورود سفارشی', 'ساخت/ویرایش رکورد'],
      ])}
      ${callout('danger', 'هرگز <code>fields = "__all__"</code> ننویسید', 'اگر فردا فیلد <code>is_staff</code> یا <code>is_approved</code> به مدل اضافه شود، خودبه‌خود در فرم عمومی ظاهر می‌شود و کاربر می‌تواند آن را دستکاری کند. همیشه فهرست فیلدها را صریح بنویسید.')}
    `),

    s('فرم و اعتبارسنجی', 'چرخه کامل یک view فرم', 'یک الگو که در هر پروژه Django بارها می‌نویسید.', `
      ${flow(['GET: فرم خالی', 'کاربر پر می‌کند', 'POST', 'is_valid()؟', 'save + redirect'])}
      ${c('python', [
        '# blog/views.py',
        'from django.contrib import messages',
        'from django.contrib.auth.decorators import login_required',
        'from django.shortcuts import get_object_or_404, redirect, render',
        'from .forms import PostForm',
        'from .models import Post',
        '',
        '',
        '@login_required',
        'def post_create(request):',
        '    if request.method == "POST":',
        '        form = PostForm(request.POST, request.FILES)   # فرم پر از داده کاربر',
        '        if form.is_valid():',
        '            post = form.save(commit=False)             # هنوز ذخیره نکن',
        '            post.author = request.user                 # فیلد سمت سرور',
        '            post.save()',
        '            form.save_m2m()                            # لازم برای ManyToMany',
        '            messages.success(request, "مقاله ثبت شد.")',
        '            return redirect(post.get_absolute_url())   # ← الگوی PRG',
        '    else:',
        '        form = PostForm()                              # فرم خالی برای GET',
        '',
        '    return render(request, "blog/post_form.html", {"form": form})',
      ], 'ساخت')}
      ${c('python', [
        '# ویرایش: همان الگو، فقط instance اضافه می‌شود',
        '@login_required',
        'def post_edit(request, slug):',
        '    post = get_object_or_404(Post, slug=slug)',
        '    if post.author != request.user:',
        '        raise PermissionDenied',
        '',
        '    form = PostForm(request.POST or None, request.FILES or None, instance=post)',
        '    if request.method == "POST" and form.is_valid():',
        '        form.save()',
        '        return redirect(post.get_absolute_url())',
        '',
        '    return render(request, "blog/post_form.html", {"form": form, "post": post})',
      ], 'ویرایش')}
      ${tbl(['نکته', 'چرا'], [
        ['<code>commit=False</code>', 'وقتی می‌خواهید قبل از ذخیره فیلدی را از سمت سرور پر کنید (مثل <code>author</code>).'],
        ['<code>save_m2m()</code>', 'بعد از <code>commit=False</code> باید دستی صدا زده شود، وگرنه ManyToManyها ذخیره نمی‌شوند.'],
        ['<code>instance=post</code>', 'فرم را با مقادیر رکورد موجود پر می‌کند و همان را به‌روزرسانی می‌کند.'],
        ['<code>redirect</code> بعد از موفقیت', 'جلوگیری از ارسال دوباره فرم با refresh.'],
      ])}
      ${callout('danger', 'فیلد author را در فرم نگذارید', 'اگر <code>author</code> جزو <code>fields</code> باشد، کاربر می‌تواند مقاله را به نام شخص دیگری ثبت کند. هر فیلدی که کاربر نباید کنترلش کند، در view از روی <code>request.user</code> پر شود.')}
    `),

    s('فرم و اعتبارسنجی', 'اعتبارسنجی سفارشی', 'سه لایه: فیلد، بین‌فیلدی و مدل.', `
      ${c('python', [
        'from django import forms',
        'from .models import Post',
        '',
        '',
        'class PostForm(forms.ModelForm):',
        '    class Meta:',
        '        model = Post',
        '        fields = ["title", "slug", "summary", "body", "published_at"]',
        '',
        '    def clean_title(self):',
        '        """اعتبارسنجی یک فیلد؛ نام متد باید clean_<field> باشد."""',
        '        title = self.cleaned_data["title"].strip()',
        '        if len(title) < 5:',
        '            raise forms.ValidationError("عنوان باید حداقل ۵ کاراکتر باشد.")',
        '        return title            # ← مقدار پاک‌شده را حتما برگردانید',
        '',
        '    def clean_slug(self):',
        '        slug = self.cleaned_data["slug"]',
        '        qs = Post.objects.filter(slug=slug)',
        '        if self.instance.pk:',
        '            qs = qs.exclude(pk=self.instance.pk)      # خودش را نشمار',
        '        if qs.exists():',
        '            raise forms.ValidationError("این نشانی قبلا استفاده شده است.")',
        '        return slug',
        '',
        '    def clean(self):',
        '        """اعتبارسنجی بین چند فیلد."""',
        '        data = super().clean()',
        '        if data.get("is_published") and not data.get("published_at"):',
        '            self.add_error("published_at", "برای انتشار، تاریخ انتشار لازم است.")',
        '        return data',
      ], 'clean_field و clean')}
      ${tbl(['متد', 'محدوده', 'خطا کجا نمایش داده می‌شود'], [
        ['<code>clean_&lt;field&gt;()</code>', 'یک فیلد', 'کنار همان فیلد.'],
        ['<code>clean()</code>', 'همه فیلدها', '<code>form.non_field_errors</code> یا با <code>add_error("field", ...)</code> کنار فیلد.'],
        ['<code>validators</code> فیلد', 'یک مقدار', 'کنار همان فیلد.'],
      ])}
      ${callout('warn', 'ترتیب اجرا', 'اول <code>to_python</code> و validatorهای هر فیلد، بعد <code>clean_&lt;field&gt;</code> برای هر فیلد، و در آخر <code>clean()</code>. اگر فیلدی در مرحله قبل رد شده باشد، کلیدش در <code>cleaned_data</code> نیست — پس همیشه با <code>data.get("x")</code> بخوانید نه <code>data["x"]</code>.')}
      ${quiz('در <code>clean_title</code> فراموش می‌کنید <code>return title</code> بنویسید. چه می‌شود؟', [
        'خطای نحوی می‌گیرید.',
        'مقدار <code>title</code> برابر <code>None</code> ذخیره می‌شود، چون خروجی متد جایگزین مقدار فیلد می‌شود.',
        'هیچ اتفاقی نمی‌افتد.',
      ], 1, 'خروجی <code>clean_&lt;field&gt;</code> همان چیزی است که در <code>cleaned_data</code> می‌نشیند. بدون <code>return</code>، مقدار <code>None</code> می‌شود — یک باگ بی‌سروصدا و رایج.')}
    `),

    s('فرم و اعتبارسنجی', 'رندر فرم در قالب', 'از سریع‌ترین حالت تا کامل‌ترین کنترل.', `
      ${c('html', [
        '<!-- ۱) سریع‌ترین: مناسب نمونه اولیه -->',
        '<form method="post">',
        '  {% csrf_token %}',
        '  {{ form.as_p }}',
        '  <button type="submit">ذخیره</button>',
        '</form>',
      ], 'حالت سریع')}
      ${c('html', [
        '<!-- ۲) حلقه روی فیلدها: تعادل خوب بین کنترل و سادگی -->',
        '<form method="post" enctype="multipart/form-data" novalidate>',
        '  {% csrf_token %}',
        '',
        '  {% if form.non_field_errors %}',
        '    <div class="alert error">{{ form.non_field_errors }}</div>',
        '  {% endif %}',
        '',
        '  {% for field in form %}',
        '    <div class="field {% if field.errors %}has-error{% endif %}">',
        '      {{ field.label_tag }}',
        '      {{ field }}',
        '      {% if field.help_text %}<small>{{ field.help_text }}</small>{% endif %}',
        '      {% for error in field.errors %}<span class="error">{{ error }}</span>{% endfor %}',
        '    </div>',
        '  {% endfor %}',
        '',
        '  <button type="submit">ذخیره</button>',
        '</form>',
      ], 'حالت پیشنهادی')}
      ${c('html', [
        '<!-- ۳) کنترل کامل: فیلد به فیلد -->',
        '{{ form.title.label_tag }}',
        '{{ form.title }}',
        '{{ form.title.errors }}',
      ], 'حالت دستی')}
      ${tbl(['نکته قالب فرم', 'چرا'], [
        ['<code>{% csrf_token %}</code>', 'بدون آن هر POST خطای 403 می‌گیرد.'],
        ['<code>enctype="multipart/form-data"</code>', 'برای آپلود فایل الزامی است.'],
        ['<code>novalidate</code>', 'خاموش‌کردن اعتبارسنجی مرورگر تا پیام‌های فارسی خودتان دیده شوند.'],
        ['<code>form.non_field_errors</code>', 'خطاهای <code>clean()</code> که به فیلد خاصی وصل نیستند.'],
      ])}
      ${callout('tip', 'استایل یکنواخت', 'برای اینکه همه inputها کلاس CSS بگیرند، در <code>__init__</code> فرم حلقه بزنید: <code>for field in self.fields.values(): field.widget.attrs["class"] = "input"</code>.')}
    `),

    s('فرم و اعتبارسنجی', 'آپلود فایل و تصویر', 'سه قطعه که با هم کار می‌کنند، وگرنه فایل گم می‌شود.', `
      ${lab('افزودن تصویر به مقاله', 'زمان: ۱۵ دقیقه', [
        { do: c('bash', ['pip install pillow'], 'نصب پیش‌نیاز'), why: '<code>ImageField</code> بدون Pillow حتی migration هم نمی‌سازد.' },
        { do: c('python', ['# blog/models.py', 'cover = models.ImageField(upload_to="posts/%Y/%m/", blank=True)'], 'فیلد مدل'), why: 'الگوی <code>%Y/%m/</code> فایل‌ها را بر اساس سال و ماه دسته‌بندی می‌کند تا یک پوشه با هزاران فایل نداشته باشید.' },
        { do: c('python', ['# config/settings.py', 'MEDIA_URL = "media/"', 'MEDIA_ROOT = BASE_DIR / "media"'], 'تنظیمات') },
        { do: c('html', ['<form method="post" enctype="multipart/form-data">'], 'قالب'), why: 'بدون <code>enctype</code>، مرورگر فقط نام فایل را می‌فرستد و <code>request.FILES</code> خالی می‌ماند.' },
        { do: c('python', ['form = PostForm(request.POST, request.FILES)'], 'view'), why: 'اگر <code>request.FILES</code> را پاس ندهید، فرم فایل را نمی‌بیند و فیلد خالی می‌ماند — بدون هیچ پیام خطایی.' },
        { do: c('python', ['# config/urls.py', 'if settings.DEBUG:', '    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)'], 'سرو فایل در توسعه') },
      ], '<p>مقاله‌ای با تصویر ثبت کنید. فایل باید در <code>media/posts/&lt;سال&gt;/&lt;ماه&gt;/</code> ظاهر شود و <code>{{ post.cover.url }}</code> در صفحه تصویر را نشان دهد.</p>')}
      ${c('python', [
        '# محدودکردن حجم و نوع فایل',
        'from django import forms',
        '',
        '',
        'class PostForm(forms.ModelForm):',
        '    def clean_cover(self):',
        '        cover = self.cleaned_data.get("cover")',
        '        if cover and cover.size > 2 * 1024 * 1024:',
        '            raise forms.ValidationError("حجم تصویر نباید بیشتر از ۲ مگابایت باشد.")',
        '        return cover',
      ], 'اعتبارسنجی فایل')}
      ${callout('danger', 'امنیت آپلود', 'به پسوند فایل اعتماد نکنید؛ حجم را محدود کنید، فایل‌های آپلودی را هرگز به‌عنوان کد اجرا نکنید و آن‌ها را از دامنه‌ای جدا یا با <code>Content-Disposition: attachment</code> سرو کنید.')}
    `),

    s('فرم و اعتبارسنجی', 'Formset: چند فرم با هم', 'وقتی کاربر باید چند ردیف را هم‌زمان ثبت کند.', `
      <p>نمونه واقعی: ثبت چند تصویر برای یک محصول، یا ویرایش آیتم‌های یک سفارش در یک صفحه.</p>
      ${c('python', [
        '# shop/forms.py',
        'from django.forms import inlineformset_factory',
        'from .models import Order, OrderItem',
        '',
        'OrderItemFormSet = inlineformset_factory(',
        '    Order,                 # مدل والد',
        '    OrderItem,             # مدل فرزند',
        '    fields=["product", "quantity"],',
        '    extra=1,               # تعداد فرم خالی اضافه',
        '    can_delete=True,',
        ')',
      ], 'تعریف inline formset')}
      ${c('python', [
        '# shop/views.py',
        'def order_edit(request, pk):',
        '    order = get_object_or_404(Order, pk=pk, user=request.user)',
        '    formset = OrderItemFormSet(request.POST or None, instance=order)',
        '',
        '    if request.method == "POST" and formset.is_valid():',
        '        formset.save()',
        '        return redirect("shop:order_detail", pk=order.pk)',
        '',
        '    return render(request, "shop/order_edit.html", {"formset": formset})',
      ], 'view')}
      ${c('html', [
        '<form method="post">',
        '  {% csrf_token %}',
        '  {{ formset.management_form }}      <!-- بدون این خط formset کار نمی‌کند -->',
        '  {% for form in formset %}',
        '    <div class="row">{{ form.as_p }}</div>',
        '  {% endfor %}',
        '  <button type="submit">ذخیره</button>',
        '</form>',
      ], 'قالب')}
      ${callout('danger', 'management_form فراموش نشود', 'بدون <code>{{ formset.management_form }}</code> خطای <code>ManagementForm data is missing or has been tampered with</code> می‌گیرید. این فیلدهای مخفی تعداد فرم‌ها را به سرور می‌گویند.')}
    `),

    s('فرم و اعتبارسنجی', 'نقطه کنترل بخش فرم', 'فرم‌ها بیشترین باگ پروژه‌های مبتدی را دارند؛ اینجا دقیق باشید.', `
      ${checklist('بررسی کنید', [
        'فرم ساخت و ویرایش مقاله کار می‌کند و بعد از موفقیت redirect می‌شود.',
        'داده نامعتبر باعث ۵۰۰ نمی‌شود؛ فرم دوباره با پیام خطای فارسی رندر می‌شود.',
        'فیلدهای حساس (نویسنده، وضعیت تایید) در <code>fields</code> نیستند و در view پر می‌شوند.',
        'آپلود تصویر با <code>enctype</code> و <code>request.FILES</code> کار می‌کند.',
        'مقادیر واردشده بعد از خطا در فرم باقی می‌مانند.',
        'هر فرم POST توکن <code>{% csrf_token %}</code> دارد.',
      ])}
      ${exercise('فرم تماس کامل', 'متوسط', `
        <p>یک فرم تماس بسازید که:</p>
        <ol>
          <li>فیلدهای نام، ایمیل، موضوع (انتخابی) و پیام داشته باشد.</li>
          <li>پیام کمتر از ۲۰ کاراکتر را رد کند.</li>
          <li>در صورت موفقیت پیام <code>messages.success</code> بدهد و redirect کند.</li>
          <li>در صورت خطا همان صفحه با خطاها نمایش داده شود.</li>
        </ol>`, c('python', [
        '# pages/forms.py',
        'from django import forms',
        '',
        '',
        'class ContactForm(forms.Form):',
        '    name = forms.CharField(max_length=80, label="نام")',
        '    email = forms.EmailField(label="ایمیل")',
        '    subject = forms.ChoiceField(',
        '        choices=[("support", "پشتیبانی"), ("sales", "فروش")], label="موضوع"',
        '    )',
        '    message = forms.CharField(widget=forms.Textarea, label="پیام")',
        '',
        '    def clean_message(self):',
        '        message = self.cleaned_data["message"].strip()',
        '        if len(message) < 20:',
        '            raise forms.ValidationError("پیام باید حداقل ۲۰ کاراکتر باشد.")',
        '        return message',
        '',
        '',
        '# pages/views.py',
        'from django.contrib import messages',
        'from django.shortcuts import redirect, render',
        'from .forms import ContactForm',
        '',
        '',
        'def contact(request):',
        '    if request.method == "POST":',
        '        form = ContactForm(request.POST)',
        '        if form.is_valid():',
        '            # اینجا ارسال ایمیل یا ذخیره در دیتابیس',
        '            messages.success(request, "پیام شما ثبت شد.")',
        '            return redirect("pages:contact")',
        '    else:',
        '        form = ContactForm()',
        '',
        '    return render(request, "pages/contact.html", {"form": form})',
      ], 'راه‌حل'))}
    `)
  );
})(window);
