(function (global) {
  'use strict';
  const { c, callout, exercise, tbl, flow, slide: s, objectives, lab, checklist, quiz } = global.DL;

  global.SLIDES.push(
    s('احراز هویت و امنیت', 'Authentication و Authorization', 'Authentication یعنی کاربر کیست؛ Authorization یعنی چه اجازه‌ای دارد.', `
      ${objectives([
        'ورود، خروج، ثبت‌نام و بازیابی رمز را پیاده کنید.',
        'viewها را با decorator و mixin محافظت کنید و مالکیت رکورد را بررسی کنید.',
        'با Group و Permission نقش تعریف کنید.',
        'بدانید CSRF، XSS و SQL Injection چه هستند و Django چطور جلویشان را می‌گیرد.',
        'چک‌لیست امنیتی production را اجرا کنید.',
      ])}
      ${tbl(['مفهوم', 'سوال', 'مثال', 'ابزار Django'], [
        ['Authentication', 'آیا کاربر وارد شده است؟', 'ورود با نام کاربری و رمز.', '<code>login()</code>، <code>@login_required</code>'],
        ['Authorization', 'آیا اجازه این کار را دارد؟', 'فقط نویسنده مقاله بتواند ویرایشش کند.', '<code>permissions</code>، <code>UserPassesTestMixin</code>'],
      ])}
      ${c('python', [
        '# سه حالت کاربر در هر request',
        'request.user.is_authenticated    # وارد شده؟',
        'request.user.is_staff            # اجازه ورود به admin دارد؟',
        'request.user.is_superuser        # همه دسترسی‌ها را دارد؟',
        '',
        '# کاربر مهمان یک شیء AnonymousUser است، نه None',
        '# پس request.user همیشه وجود دارد و بررسی None لازم نیست',
      ], 'وضعیت کاربر')}
      ${callout('info', 'AnonymousUser', 'برای بازدیدکننده بدون ورود، <code>request.user</code> یک شیء <code>AnonymousUser</code> است که <code>is_authenticated</code> آن <code>False</code> است. به همین دلیل <code>{% if user.is_authenticated %}</code> همیشه بی‌خطر کار می‌کند.')}
    `),

    s('احراز هویت و امنیت', 'ورود و خروج آماده Django', 'لازم نیست ورود را خودتان بنویسید؛ فقط قالبش را بدهید.', `
      ${c('python', [
        '# accounts/urls.py',
        'from django.contrib.auth import views as auth_views',
        'from django.urls import path',
        'from . import views',
        '',
        'app_name = "accounts"',
        '',
        'urlpatterns = [',
        '    path("login/", auth_views.LoginView.as_view(',
        '        template_name="accounts/login.html"), name="login"),',
        '    path("logout/", auth_views.LogoutView.as_view(), name="logout"),',
        '    path("signup/", views.signup, name="signup"),',
        '    path("dashboard/", views.dashboard, name="dashboard"),',
        ']'
      ], 'مسیرهای احراز هویت')}
      ${c('python', [
        '# config/settings.py',
        'LOGIN_URL = "accounts:login"              # کاربر مهمان به اینجا فرستاده می‌شود',
        'LOGIN_REDIRECT_URL = "accounts:dashboard" # بعد از ورود موفق',
        'LOGOUT_REDIRECT_URL = "blog:home"         # بعد از خروج',
      ], 'تنظیمات مسیر')}
      ${c('html', [
        '<!-- templates/accounts/login.html -->',
        '{% extends "base.html" %}',
        '',
        '{% block content %}',
        '  <h1>ورود</h1>',
        '  <form method="post">',
        '    {% csrf_token %}',
        '    {{ form.as_p }}',
        '    <button type="submit">ورود</button>',
        '  </form>',
        '  <a href="{% url "accounts:password_reset" %}">رمزم را فراموش کرده‌ام</a>',
        '{% endblock %}',
      ], 'قالب ورود')}
      ${callout('danger', 'خروج فقط با POST', 'در نسخه‌های جدید Django، <code>LogoutView</code> درخواست GET را قبول نمی‌کند. به‌جای لینک، فرم بسازید — وگرنه خطای 405 می‌گیرید.')}
      ${c('html', [
        '<form method="post" action="{% url "accounts:logout" %}">',
        '  {% csrf_token %}',
        '  <button type="submit">خروج</button>',
        '</form>',
      ], 'خروج درست')}
      ${callout('info', 'بازگشت به صفحه قبل', 'وقتی <code>@login_required</code> کاربر را به login می‌فرستد، آدرس مقصد را در <code>?next=</code> می‌گذارد و <code>LoginView</code> بعد از ورود موفق، خودکار او را همان‌جا برمی‌گرداند.')}
    `),

    s('احراز هویت و امنیت', 'ثبت‌نام کاربر', 'با Custom User، فرم ثبت‌نام هم باید سفارشی شود.', `
      ${c('python', [
        '# accounts/forms.py',
        'from django.contrib.auth.forms import UserCreationForm',
        'from .models import User',
        '',
        '',
        'class SignUpForm(UserCreationForm):',
        '    class Meta(UserCreationForm.Meta):',
        '        model = User',
        '        fields = ["username", "email", "phone"]',
        '        labels = {"username": "نام کاربری", "email": "ایمیل"}',
        '',
        '    def clean_email(self):',
        '        email = self.cleaned_data["email"].lower()',
        '        if User.objects.filter(email=email).exists():',
        '            raise forms.ValidationError("این ایمیل قبلا ثبت شده است.")',
        '        return email',
      ], 'فرم ثبت‌نام')}
      ${c('python', [
        '# accounts/views.py',
        'from django.contrib.auth import login',
        'from django.shortcuts import redirect, render',
        'from .forms import SignUpForm',
        '',
        '',
        'def signup(request):',
        '    if request.user.is_authenticated:',
        '        return redirect("blog:home")        # کاربر واردشده نباید ثبت‌نام ببیند',
        '',
        '    if request.method == "POST":',
        '        form = SignUpForm(request.POST)',
        '        if form.is_valid():',
        '            user = form.save()',
        '            login(request, user)            # ورود خودکار بعد از ثبت‌نام',
        '            return redirect("accounts:dashboard")',
        '    else:',
        '        form = SignUpForm()',
        '',
        '    return render(request, "accounts/signup.html", {"form": form})',
      ], 'view ثبت‌نام')}
      ${callout('info', 'قوانین رمز عبور', 'Django با <code>AUTH_PASSWORD_VALIDATORS</code> رمزهای کوتاه، رایج، کاملا عددی و شبیه به نام کاربری را رد می‌کند. می‌توانید حداقل طول را در همان تنظیمات تغییر دهید.')}
      ${callout('warn', 'ایمیل یکتا نیست', 'در مدل پیش‌فرض Django فیلد <code>email</code> یکتا نیست. اگر ورود با ایمیل می‌خواهید، در Custom User آن را <code>unique=True</code> کنید.')}
    `),

    s('احراز هویت و امنیت', 'بازیابی رمز عبور', 'چهار view آماده، چهار قالب — بدون یک خط منطق.', `
      ${flow(['درخواست بازیابی', 'ارسال ایمیل با لینک امضاشده', 'صفحه رمز جدید', 'تایید'])}
      ${c('python', [
        '# accounts/urls.py',
        'from django.contrib.auth import views as auth_views',
        '',
        'urlpatterns += [',
        '    path("password-reset/", auth_views.PasswordResetView.as_view(',
        '        template_name="accounts/password_reset.html",',
        '        email_template_name="accounts/password_reset_email.html",',
        '        success_url="/accounts/password-reset/done/",',
        '    ), name="password_reset"),',
        '',
        '    path("password-reset/done/", auth_views.PasswordResetDoneView.as_view(',
        '        template_name="accounts/password_reset_done.html"), name="password_reset_done"),',
        '',
        '    path("reset/<uidb64>/<token>/", auth_views.PasswordResetConfirmView.as_view(',
        '        template_name="accounts/password_reset_confirm.html",',
        '        success_url="/accounts/reset/done/",',
        '    ), name="password_reset_confirm"),',
        '',
        '    path("reset/done/", auth_views.PasswordResetCompleteView.as_view(',
        '        template_name="accounts/password_reset_complete.html"), name="password_reset_complete"),',
        ']'
      ], 'چهار مرحله بازیابی')}
      ${c('python', [
        '# config/settings.py — در توسعه، ایمیل در ترمینال چاپ می‌شود',
        'EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"',
        '',
        '# در production',
        '# EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"',
        '# EMAIL_HOST = "smtp.example.com"',
        '# EMAIL_PORT = 587',
        '# EMAIL_USE_TLS = True',
        '# EMAIL_HOST_USER = os.environ["EMAIL_USER"]',
        '# EMAIL_HOST_PASSWORD = os.environ["EMAIL_PASSWORD"]',
        '# DEFAULT_FROM_EMAIL = "no-reply@example.com"',
      ], 'تنظیم ایمیل')}
      ${callout('tip', 'آزمایش بدون سرور ایمیل', 'با backend کنسول، کل ایمیل بازیابی — همراه لینک — در ترمینال چاپ می‌شود. لینک را کپی کنید و در مرورگر باز کنید؛ کل جریان بدون هیچ سرویس ایمیلی قابل تست است.')}
      ${callout('info', 'چرا لینک امن است؟', 'توکن بازیابی از ترکیب <code>SECRET_KEY</code>، شناسه کاربر، hash رمز فعلی و زمان ساخته می‌شود. پس با یک بار استفاده یا تغییر رمز، خودبه‌خود باطل می‌شود.')}
    `),

    s('احراز هویت و امنیت', 'محافظت از viewها', 'برای viewهای حساس باید ورود کاربر یا سطح دسترسی را بررسی کنیم.', `
      ${c('python', [
        'from django.contrib.auth.decorators import login_required, permission_required',
        'from django.core.exceptions import PermissionDenied',
        'from django.shortcuts import get_object_or_404, render',
        'from .models import Post',
        '',
        '',
        '@login_required',
        'def dashboard(request):',
        '    posts = request.user.posts.all()',
        '    return render(request, "accounts/dashboard.html", {"posts": posts})',
        '',
        '',
        '@login_required',
        'def post_edit(request, slug):',
        '    post = get_object_or_404(Post, slug=slug)',
        '    if post.author != request.user:          # ← بررسی مالکیت',
        '        raise PermissionDenied',
        '    # ادامه پردازش فرم ویرایش',
        '',
        '',
        '@permission_required("blog.delete_post", raise_exception=True)',
        'def post_delete(request, pk):',
        '    ...',
      ], 'decoratorها در FBV')}
      ${c('python', [
        '# همان کار در Class-Based View',
        'from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin',
        'from django.views.generic import UpdateView',
        '',
        '',
        'class PostUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):',
        '    model = Post',
        '    fields = ["title", "body"]',
        '',
        '    def test_func(self):',
        '        return self.request.user == self.get_object().author',
        '',
        '    def get_queryset(self):',
        '        # لایه دوم محافظت: کاربر اصلا مقاله دیگران را نمی‌بیند',
        '        return super().get_queryset().filter(author=self.request.user)',
      ], 'mixinها در CBV')}
      ${callout('danger', 'پنهان‌کردن دکمه کافی نیست', 'اگر فقط در قالب <code>{% if post.author == user %}</code> بگذارید، کاربر می‌تواند آدرس ویرایش را دستی وارد کند. بررسی دسترسی <strong>باید</strong> در view انجام شود. قالب فقط برای تجربه کاربری است.')}
      ${quiz('کدام مورد ناامن است؟', [
        'بررسی <code>post.author != request.user</code> در view و پنهان‌کردن دکمه در قالب.',
        'فقط پنهان‌کردن دکمه ویرایش در قالب.',
        'استفاده از <code>get_queryset</code> برای محدودکردن به رکوردهای خود کاربر.',
      ], 1, 'این یک نمونه از Broken Access Control است — رتبه اول فهرست OWASP. هر کسی می‌تواند آدرس را حدس بزند و مستقیم باز کند.')}
    `),

    s('احراز هویت و امنیت', 'Permission و Group', 'علاوه بر ورود، باید اجازه انجام کار را هم بررسی کنیم.', `
      <p>Django برای هر مدل چهار permission می‌سازد: <code>add</code>، <code>change</code>، <code>delete</code> و <code>view</code>. Group راهی برای بسته‌بندی چند permission و دادن آن به گروهی از کاربران است.</p>
      ${c('python', [
        '# بررسی در view',
        'request.user.has_perm("blog.delete_post")',
        'request.user.has_perms(["blog.add_post", "blog.change_post"])',
        '',
        '# افزودن کاربر به گروه',
        'from django.contrib.auth.models import Group',
        '',
        'editors, _ = Group.objects.get_or_create(name="ویرایشگران")',
        'user.groups.add(editors)',
      ], 'کار با permission')}
      ${c('python', [
        '# permission سفارشی برای منطق کسب‌وکار',
        'class Post(models.Model):',
        '    # ...',
        '    class Meta:',
        '        permissions = [',
        '            ("publish_post", "می‌تواند مقاله را منتشر کند"),',
        '        ]',
        '',
        '',
        '# استفاده',
        '@permission_required("blog.publish_post", raise_exception=True)',
        'def publish(request, pk):',
        '    ...',
      ], 'permission سفارشی')}
      ${c('html', [
        '{% if perms.blog.change_post %}',
        '  <a href="{% url "blog:post_edit" post.slug %}">ویرایش</a>',
        '{% endif %}',
      ], 'در قالب')}
      ${tbl(['نیاز', 'راه‌حل'], [
        ['کاربر باید وارد شده باشد.', '<code>@login_required</code>'],
        ['کاربر باید مجوز مشخصی داشته باشد.', '<code>@permission_required</code>'],
        ['کاربر باید مالک رکورد باشد.', 'بررسی دستی یا <code>UserPassesTestMixin</code>'],
        ['گروهی از کاربران نقش مشترک دارند.', '<code>Group</code> + permission'],
        ['شرط پیچیده روی هر رکورد.', 'کتابخانه‌هایی مثل <code>django-guardian</code>'],
      ])}
      ${callout('warn', 'raise_exception=True را یادتان نرود', 'بدون آن، کاربری که وارد شده ولی مجوز ندارد به صفحه ورود redirect می‌شود — رفتاری گیج‌کننده. با این پارامتر، خطای 403 درست نمایش داده می‌شود.')}
    `),

    s('احراز هویت و امنیت', 'Session و Cookie', 'Session داده کوتاه‌مدت کاربر را بین requestها نگه می‌دارد.', `
      <p>HTTP ذاتا stateless است؛ یعنی هر request مستقل است. Django با cookie یک شناسه session در مرورگر نگه می‌دارد و داده session را سمت سرور مدیریت می‌کند.</p>
      ${c('python', [
        '# نوشتن و خواندن',
        'request.session["theme"] = "dark"',
        'theme = request.session.get("theme", "light")',
        '',
        '# حذف',
        'del request.session["theme"]',
        'request.session.flush()          # پاک‌کردن کامل، مثلا هنگام خروج',
        '',
        '# عمر session',
        'request.session.set_expiry(60 * 60 * 24 * 30)   # ۳۰ روز',
        'request.session.set_expiry(0)                    # تا بستن مرورگر',
        '',
        '# مهم: تغییر داده تودرتو خودکار تشخیص داده نمی‌شود',
        'request.session["cart"]["1"] = {"quantity": 2}',
        'request.session.modified = True   # ← بدون این خط ذخیره نمی‌شود',
      ], 'کار با session')}
      ${tbl(['تنظیم', 'مقدار پیشنهادی production'], [
        ['<code>SESSION_COOKIE_SECURE</code>', '<code>True</code> — فقط روی HTTPS'],
        ['<code>SESSION_COOKIE_HTTPONLY</code>', '<code>True</code> — دور از دسترس JavaScript'],
        ['<code>SESSION_COOKIE_SAMESITE</code>', '<code>"Lax"</code>'],
        ['<code>SESSION_COOKIE_AGE</code>', 'مثلا <code>1209600</code> (دو هفته)'],
        ['<code>SESSION_ENGINE</code>', 'دیتابیس (پیش‌فرض) یا cache برای ترافیک بالا'],
      ])}
      ${callout('info', 'session بعد از ورود', 'Django هنگام <code>login()</code> شناسه session را عوض می‌کند (session fixation protection). به همین دلیل هرگز خودتان کاربر را دستی در session ننشانید؛ همیشه از <code>login()</code> استفاده کنید.')}
    `),

    s('احراز هویت و امنیت', 'CSRF چیست؟', 'CSRF حمله‌ای است که کاربر واردشده را وادار به ارسال درخواست ناخواسته می‌کند.', `
      <p>تصور کنید وارد سایت بانک هستید. در تب دیگری سایت مهاجم را باز می‌کنید که مخفیانه فرمی به سایت بانک ارسال می‌کند. چون cookie شما خودکار همراه request می‌رود، بانک فکر می‌کند خودتان درخواست داده‌اید.</p>
      ${flow(['کاربر وارد سایت است', 'باز کردن سایت مهاجم', 'ارسال مخفیانه فرم', 'بدون توکن: رد می‌شود'])}
      ${c('html', [
        '<form method="post" action="{% url "blog:comment_create" post.slug %}">',
        '  {% csrf_token %}',
        '  <textarea name="body"></textarea>',
        '  <button type="submit">ثبت نظر</button>',
        '</form>'
      ], 'فرم امن')}
      ${c('javascript', [
        '// ارسال با fetch: توکن را از cookie بخوانید',
        'function getCookie(name) {',
        '  const match = document.cookie.match("(^|;)\\\\s*" + name + "=([^;]*)");',
        '  return match ? decodeURIComponent(match[2]) : null;',
        '}',
        '',
        'fetch("/shop/cart/add/5/", {',
        '  method: "POST",',
        '  headers: { "X-CSRFToken": getCookie("csrftoken") },',
        '});',
      ], 'CSRF در AJAX')}
      ${callout('danger', 'هرگز middleware را حذف نکنید', 'برای رفع خطای «CSRF verification failed» راه‌حل، حذف <code>CsrfViewMiddleware</code> یا زدن <code>@csrf_exempt</code> نیست. علت واقعی معمولا یکی از این‌هاست: جاافتادن <code>{% csrf_token %}</code>، نبود cookie (مرورگر آن را بلاک کرده)، یا نفرستادن هدر <code>X-CSRFToken</code> در AJAX.')}
      ${callout('info', 'چرا GET توکن نمی‌خواهد؟', 'CSRF فقط برای درخواست‌هایی معنا دارد که داده را تغییر می‌دهند. اگر GET شما داده را تغییر می‌دهد، مشکل از طراحی است نه از CSRF.')}
    `),

    s('احراز هویت و امنیت', 'XSS و SQL Injection', 'دو حمله رایج وب؛ Django به‌طور پیش‌فرض جلویشان را می‌گیرد.', `
      <p>XSS یعنی تزریق اسکریپت به صفحه؛ SQL Injection یعنی دستکاری query دیتابیس. Django با escape خودکار در template و پارامتری‌کردن queryها هر دو را خنثی می‌کند — اگر خودتان خلافش را نکنید.</p>
      ${tbl(['حمله', 'مثال ورودی مهاجم', 'محافظت Django', 'چطور خرابش می‌کنید'], [
        ['XSS', '<code>&lt;script&gt;alert(1)&lt;/script&gt;</code> در نظر', 'escape خودکار همه متغیرها.', '<code>|safe</code>، <code>mark_safe</code>، <code>{% autoescape off %}</code>'],
        ['SQL Injection', '<code>&#39; OR 1=1 --</code> در جست‌وجو', 'ORM query را پارامتری می‌سازد.', '<code>raw()</code> یا <code>cursor.execute</code> با رشته f-string'],
      ])}
      ${c('python', [
        '# ✗ آسیب‌پذیر — رشته مستقیم داخل SQL',
        'query = f"SELECT * FROM blog_post WHERE title = \\"{user_input}\\""',
        'Post.objects.raw(query)',
        '',
        '# ✓ امن — پارامتر جدا از دستور',
        'Post.objects.raw("SELECT * FROM blog_post WHERE title = %s", [user_input])',
        '',
        '# ✓ بهترین حالت: اصلا SQL خام ننویسید',
        'Post.objects.filter(title=user_input)',
      ], 'SQL امن و ناامن')}
      ${c('html', [
        '<!-- ✓ امن: Django خودکار escape می‌کند -->',
        '<p>{{ comment.body }}</p>',
        '',
        '<!-- ✗ خطرناک: HTML کاربر اجرا می‌شود -->',
        '<p>{{ comment.body|safe }}</p>',
      ], 'XSS در قالب')}
      ${callout('warn', 'اگر واقعا به HTML کاربر نیاز دارید', 'مثلا در ویرایشگر متن غنی، ورودی را با کتابخانه‌ای مثل <code>bleach</code> پاک‌سازی کنید و فهرست سفید تگ‌های مجاز بدهید — نه اینکه مستقیم <code>|safe</code> بزنید.')}
      ${exercise('تشخیص ریسک', 'متوسط', '<p>چرا نمایش خام <code>{% autoescape off %}{{ comment.body }}{% endautoescape %}</code> خطرناک است؟</p>', '<p>چون محتوای کاربر به‌عنوان HTML اجرا می‌شود و می‌تواند اسکریپت تزریق کند؛ مهاجم می‌تواند cookie و session بقیه کاربران را بدزدد. محتوای کاربر را همیشه escaped نمایش دهید یا با bleach پاک‌سازی کنید.</p>')}
    `),

    s('احراز هویت و امنیت', 'چرا رمزها hash می‌شوند؟', 'رمز عبور هرگز به‌صورت خام ذخیره نمی‌شود.', `
      <p>حتی اگر دیتابیس لو برود، رمزها نباید قابل خواندن باشند. Django رمز را با الگوریتم‌های قوی مثل PBKDF2 یا Argon2 و با salt تصادفی hash می‌کند و هنگام ورود، hashها را مقایسه می‌کند.</p>
      ${c('python', [
        '>>> from django.contrib.auth.hashers import check_password, make_password',
        '>>> make_password("secret")',
        "'pbkdf2_sha256$870000$k2f...$8Xq...'",
        '>>> #  الگوریتم    تکرار    salt   hash',
        '>>> check_password("secret", some_hash)',
        'True',
      ], 'ساخت و بررسی hash')}
      ${c('python', [
        '# تغییر رمز — همیشه با set_password',
        'user.set_password("new-password")',
        'user.save()',
        '',
        '# ✗ هرگز این کار را نکنید',
        '# user.password = "new-password"   ← رمز خام در دیتابیس!',
      ], 'روش درست تغییر رمز')}
      ${c('python', [
        '# config/settings.py — Argon2 قوی‌تر از پیش‌فرض است',
        '# نیاز به: pip install "django[argon2]"',
        'PASSWORD_HASHERS = [',
        '    "django.contrib.auth.hashers.Argon2PasswordHasher",',
        '    "django.contrib.auth.hashers.PBKDF2PasswordHasher",',
        ']',
      ], 'تقویت الگوریتم')}
      ${callout('danger', 'هرگز', 'رمز را در log ننویسید، در ایمیل نفرستید، در session نگذارید و برای «یادآوری رمز» ذخیره‌اش نکنید. تنها کار درست، بازنشانی رمز با لینک امضاشده است.')}
    `),

    s('احراز هویت و امنیت', 'کاربر در Template', 'در template هم می‌توانید وضعیت ورود کاربر را بررسی کنید.', `
      <p>متغیرهای <code>user</code> و <code>perms</code> در context همه templateها هستند؛ پس می‌توانید منو را بر اساس وضعیت کاربر تغییر دهید.</p>
      ${c('html', [
        '{% if user.is_authenticated %}',
        '  <span>سلام، {{ user.get_short_name|default:user.username }}</span>',
        '  <a href="{% url "accounts:dashboard" %}">داشبورد</a>',
        '  {% if perms.blog.add_post %}',
        '    <a href="{% url "blog:post_create" %}">مقاله جدید</a>',
        '  {% endif %}',
        '  <form method="post" action="{% url "accounts:logout" %}">',
        '    {% csrf_token %}',
        '    <button type="submit">خروج</button>',
        '  </form>',
        '{% else %}',
        '  <a href="{% url "accounts:login" %}">ورود</a>',
        '  <a href="{% url "accounts:signup" %}">ثبت‌نام</a>',
        '{% endif %}',
      ], 'منوی کاربر')}
      ${c('python', [
        '# رابطه معکوس با related_name',
        'my_posts = request.user.posts.all()',
        'my_orders = request.user.orders.select_related("...").all()',
      ], 'داده کاربر')}
      ${callout('warn', 'یادآوری', 'این شرط‌ها فقط تجربه کاربری را بهتر می‌کنند. محافظت واقعی در view است.')}
    `),

    s('احراز هویت و امنیت', 'چک‌لیست امنیتی production', 'قبل از انتشار، این فهرست را خط به خط اجرا کنید.', `
      ${c('python', [
        '# config/settings.py — تنظیمات production',
        'DEBUG = False',
        'ALLOWED_HOSTS = ["example.com", "www.example.com"]',
        'SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]',
        '',
        '# HTTPS',
        'SECURE_SSL_REDIRECT = True',
        'SECURE_HSTS_SECONDS = 31536000',
        'SECURE_HSTS_INCLUDE_SUBDOMAINS = True',
        'SECURE_HSTS_PRELOAD = True',
        'SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")   # پشت Nginx',
        '',
        '# Cookieها',
        'SESSION_COOKIE_SECURE = True',
        'CSRF_COOKIE_SECURE = True',
        'SESSION_COOKIE_HTTPONLY = True',
        '',
        '# هدرهای مرورگر',
        'X_FRAME_OPTIONS = "DENY"',
        'SECURE_CONTENT_TYPE_NOSNIFF = True',
        '',
        '# دامنه‌های مجاز برای POST',
        'CSRF_TRUSTED_ORIGINS = ["https://example.com"]',
      ], 'settings امن')}
      ${c('bash', ['python manage.py check --deploy'], 'بررسی خودکار Django')}
      ${tbl(['ریسک (OWASP)', 'در Django چه کنیم'], [
        ['Broken Access Control', 'بررسی مالکیت در view، محدودکردن <code>get_queryset</code>.'],
        ['Cryptographic Failures', 'HTTPS اجباری، secret در environment، hash قوی رمز.'],
        ['Injection', 'فقط ORM؛ SQL خام با پارامتر.'],
        ['Insecure Design', 'اعتبارسنجی سمت سرور، تراکنش برای عملیات مالی.'],
        ['Security Misconfiguration', '<code>DEBUG=False</code>، <code>ALLOWED_HOSTS</code>، <code>check --deploy</code>.'],
        ['Vulnerable Components', '<code>pip list --outdated</code> و به‌روزرسانی منظم Django.'],
        ['Identification Failures', 'محدودکردن تلاش ورود (مثلا <code>django-axes</code>).'],
        ['Logging Failures', 'ثبت رویدادهای امنیتی بدون داده حساس.'],
      ])}
      ${callout('danger', 'رایج‌ترین فاجعه', 'commit شدن <code>SECRET_KEY</code> یا فایل <code>.env</code> در یک مخزن عمومی. اگر این اتفاق افتاد، کلید را فورا عوض کنید — پاک‌کردن فایل کافی نیست چون در تاریخچه git باقی می‌ماند.')}
    `),

    s('احراز هویت و امنیت', 'نقطه کنترل امنیت', 'سنجش عملی، نه نظری.', `
      ${checklist('روی پروژه خودتان آزمایش کنید', [
        'بدون ورود، آدرس <code>/accounts/dashboard/</code> را باز کنید — باید به login هدایت شوید.',
        'با کاربر A وارد شوید و آدرس ویرایش مقاله کاربر B را دستی باز کنید — باید 403 بگیرید.',
        'یک فرم POST را بدون <code>{% csrf_token %}</code> ارسال کنید — باید 403 بگیرید.',
        'در یک نظر <code>&lt;script&gt;alert(1)&lt;/script&gt;</code> ثبت کنید — باید به‌صورت متن نمایش داده شود، نه اجرا.',
        'در دیتابیس مقدار ستون <code>password</code> را ببینید — باید hash باشد.',
        '<code>python manage.py check --deploy</code> را اجرا کنید و هشدارها را یادداشت کنید.',
      ])}
      ${exercise('امن‌سازی view حذف', 'چالشی', `
        <p>یک view حذف مقاله بنویسید که همه این شرط‌ها را داشته باشد:</p>
        <ol>
          <li>فقط با POST کار کند.</li>
          <li>کاربر باید وارد شده باشد.</li>
          <li>فقط نویسنده خود مقاله بتواند حذف کند.</li>
          <li>بعد از حذف پیام موفقیت بدهد و redirect کند.</li>
        </ol>`, c('python', [
        'from django.contrib import messages',
        'from django.contrib.auth.decorators import login_required',
        'from django.shortcuts import get_object_or_404, redirect',
        'from django.views.decorators.http import require_POST',
        'from .models import Post',
        '',
        '',
        '@login_required',
        '@require_POST',
        'def post_delete(request, slug):',
        '    # فیلتر روی author یعنی مقاله دیگران اصلا پیدا نمی‌شود → 404',
        '    post = get_object_or_404(Post, slug=slug, author=request.user)',
        '    post.delete()',
        '    messages.success(request, "مقاله حذف شد.")',
        '    return redirect("accounts:dashboard")',
      ], 'راه‌حل') + '<p>نکته: با آوردن شرط <code>author=request.user</code> داخل <code>get_object_or_404</code>، هم بررسی مالکیت انجام می‌شود و هم وجود مقاله دیگران فاش نمی‌شود.</p>')}
    `)
  );
})(window);
