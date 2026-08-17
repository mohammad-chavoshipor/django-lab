(function (global) {
  'use strict';
  const { c, callout, exercise, tbl, slide: s } = global.DL;

  global.SLIDES.push(
    s('احراز هویت و امنیت', 'Authentication و Authorization', 'Authentication یعنی کاربر کیست؛ Authorization یعنی چه اجازه‌ای دارد.', `
      ${tbl(['مفهوم', 'سوال', 'مثال'], [
        ['Authentication', 'آیا کاربر وارد شده است؟', 'ورود با username/password.'],
        ['Authorization', 'آیا اجازه انجام این کار را دارد؟', 'فقط نویسنده مقاله بتواند آن را ویرایش کند.'],
      ])}
      ${c('python', [
        '# config/urls.py',
        'from django.contrib.auth import views as auth_views',
        'from django.urls import path',
        '',
        'urlpatterns = [',
        '    path("login/", auth_views.LoginView.as_view(template_name="accounts/login.html"), name="login"),',
        '    path("logout/", auth_views.LogoutView.as_view(), name="logout"),',
        ']'
      ], 'ورود و خروج آماده Django')}
    `),

    s('احراز هویت و امنیت', 'محافظت از viewها', 'برای viewهای حساس باید ورود کاربر یا سطح دسترسی را بررسی کنیم.', `
      ${c('python', [
        'from django.contrib.auth.decorators import login_required',
        'from django.core.exceptions import PermissionDenied',
        'from django.shortcuts import get_object_or_404, render',
        'from .models import Post',
        '',
        '@login_required',
        'def dashboard(request):',
        '    posts = request.user.posts.all()',
        '    return render(request, "accounts/dashboard.html", {"posts": posts})',
        '',
        '@login_required',
        'def post_edit(request, slug):',
        '    post = get_object_or_404(Post, slug=slug)',
        '    if post.author != request.user:',
        '        raise PermissionDenied',
        '    # ادامه پردازش فرم ویرایش'
      ], 'login_required و permission')}
      ${callout('danger', 'ریسک امنیتی', 'پنهان کردن دکمه ویرایش در template کافی نیست. خود view هم باید مالکیت یا permission را بررسی کند.')}
    `),

    s('احراز هویت و امنیت', 'Session و Cookie', 'Session داده کوتاه‌مدت کاربر را بین requestها نگه می‌دارد.', `
      <p>HTTP ذاتا stateless است؛ یعنی هر request مستقل است. Django با cookie یک شناسه session در مرورگر نگه می‌دارد و داده session را سمت سرور مدیریت می‌کند.</p>
      ${c('python', [
        'def set_preferred_theme(request):',
        '    request.session["theme"] = "dark"',
        '    request.session.set_expiry(60 * 60 * 24 * 30)',
        '    return redirect("home")',
        '',
        'def home(request):',
        '    theme = request.session.get("theme", "light")',
        '    return render(request, "home.html", {"theme": theme})'
      ], 'استفاده ساده از session')}
    `),

    s('احراز هویت و امنیت', 'CSRF چیست؟', 'CSRF حمله‌ای است که کاربر واردشده را وادار به ارسال درخواست ناخواسته می‌کند.', `
      <p>Django برای فرم‌های POST از token استفاده می‌کند. اگر token معتبر نباشد، request رد می‌شود. بنابراین در هر فرم HTML که داده تغییر می‌دهد، <code>{% csrf_token %}</code> لازم است.</p>
      ${c('html', [
        '<form method="post" action="{% url "comment_create" post.slug %}">',
        '  {% csrf_token %}',
        '  <textarea name="body"></textarea>',
        '  <button type="submit">ثبت نظر</button>',
        '</form>'
      ], 'فرم امن')}
      ${callout('warn', 'اشتباه رایج', 'برای حل خطای CSRF، middleware را حذف نکنید. مشکل را با template درست، cookie/session درست و ارسال token در AJAX حل کنید.')}
    `),

    s('احراز هویت و امنیت', 'تنظیمات امنیتی پایه', 'امنیت Django ترکیبی از تنظیمات، validation و کنترل دسترسی است.', `
      ${c('python', [
        '# config/settings.py',
        'DEBUG = False',
        'ALLOWED_HOSTS = ["example.com", "www.example.com"]',
        '',
        'CSRF_COOKIE_SECURE = True',
        'SESSION_COOKIE_SECURE = True',
        'SECURE_SSL_REDIRECT = True',
        'SECURE_HSTS_SECONDS = 31536000',
        'SECURE_HSTS_INCLUDE_SUBDOMAINS = True',
        'SECURE_HSTS_PRELOAD = True',
        'X_FRAME_OPTIONS = "DENY"'
      ], 'نمونه production settings')}
      ${tbl(['موضوع', 'کار درست'], [
        ['Secret key', 'در کد commit نشود و از environment خوانده شود.'],
        ['DEBUG', 'در production همیشه False باشد.'],
        ['Input', 'همیشه validation شود؛ به داده کاربر اعتماد نکنید.'],
        ['Permission', 'در view یا service بررسی شود، نه فقط در UI.'],
      ])}
      ${exercise('تحلیل امنیتی', 'متوسط', '<p>اگر کاربر URL ویرایش مقاله فرد دیگر را دستی وارد کند، برنامه باید چه کند؟</p>', '<p>view باید مالکیت مقاله را بررسی کند و در صورت نداشتن اجازه، <code>PermissionDenied</code> یا redirect مناسب برگرداند.</p>')}
    `),

    s('احراز هویت و امنیت', 'XSS و SQL Injection', 'دو حمله رایج وب؛ Django به‌طور پیش‌فرض جلویشان را می‌گیرد.', `
      <p>XSS یعنی تزریق اسکریپت به صفحه؛ SQL Injection یعنی دستکاری query دیتابیس. Django با escape خودکار در template و پارامتری‌کردن queryها، هر دو را خنثی می‌کند — اگر خودتان خلافش را نکنید.</p>
      ${tbl(['حمله', 'مثال', 'محافظت Django'], [
        ['XSS', 'ثبت <code>&lt;script&gt;alert(1)&lt;/script&gt;</code> در نظر', 'escape خودکار همه متغیرها در template.'],
        ['SQL Injection', 'ورود <code>&#39; OR 1=1 --</code> در جست‌وجو', 'ORM همیشه query را پارامتری می‌سازد.'],
      ])}
      ${callout('danger', 'خطر دست‌ساز', 'با <code>mark_safe</code>، فیلتر <code>safe</code> یا <code>connection.cursor()</code> و SQL خام، محافظت پیش‌فرض را دور می‌زنید؛ فقط با داده کاملا مطمئن این کار را انجام دهید.')}
      ${exercise('تشخیص ریسک', 'متوسط', '<p>چرا نمایش خام <code>{% autoescape off %}{{ comment.body }}{% endautoescape %}</code> خطرناک است؟</p>', '<p>چون محتوای کاربر به‌عنوان HTML اجرا می‌شود و می‌تواند اسکریپت تزریق کند. محتوای کاربر را همیشه escaped نمایش دهید.</p>')}
    `),

    s('احراز هویت و امنیت', 'Permission و Group', 'علاوه بر ورود، باید اجازه انجام کار را هم بررسی کنیم.', `
      <p>جنگو برای هر مدل permissionهای add/change/delete/view می‌سازد و Group راهی برای دادن چند permission به یک مجموعه کاربر است.</p>
      ${c('python', [
        'from django.contrib.auth.decorators import permission_required',
        '',
        '@permission_required("blog.delete_post")',
        'def post_delete(request, pk):',
        '    post = get_object_or_404(Post, pk=pk)',
        '    post.delete()',
        '    return redirect("home")',
      ], 'permission_required')}
      ${c('python', [
        '# CBV: ترکیب با mixin',
        'from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin',
        'from django.views.generic import UpdateView',
        '',
        'class PostUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):',
        '    model = Post',
        '    fields = ["title", "body"]',
        '',
        '    def test_func(self):',
        '        return self.request.user == self.get_object().author',
      ], 'mixinهای CBV')}
      ${callout('info', 'Group', 'با <code>Group</code> نقش‌هایی مثل ویرایشگر یا مدیر فروشگاه بسازید و permissionها را به گروه بدهید تا اعضا به‌طور خودکار آن‌ها را بگیرند.')}
    `),

    s('احراز هویت و امنیت', 'کاربر در Template', 'در template هم می‌توانید وضعیت ورود کاربر را بررسی کنید.', `
      <p>متغیر <code>user</code> در context همه templateها هست؛ پس می‌توانید منو را بر اساس وضعیت ورود کاربر تغییر دهید.</p>
      ${c('html', [
        '{% if user.is_authenticated %}',
        '  <span>سلام، {{ user.username }}</span>',
        '  <a href="{% url "dashboard" %}">داشبورد</a>',
        '  <form method="post" action="{% url "logout" %}">',
        '    {% csrf_token %}',
        '    <button type="submit">خروج</button>',
        '  </form>',
        '{% else %}',
        '  <a href="{% url "login" %}">ورود</a>',
        '  <a href="{% url "signup" %}">ثبت‌نام</a>',
        '{% endif %}',
      ], 'منوی کاربر')}
      ${c('python', [
        '# رابطه معکوس با related_name',
        'my_posts = request.user.posts.all()',
        'my_orders = request.user.orders.all()',
      ], 'داده کاربر')}
      ${callout('warn', 'خروج با POST', 'در نسخه‌های جدید Django، logout باید با POST باشد؛ فرم خروج با <code>{% csrf_token %}</code> بسازید، نه لینک GET.')}
    `),

    s('احراز هویت و امنیت', 'چرا رمزها hash می‌شوند؟', 'رمز عبور هرگز به‌صورت خام ذخیره نمی‌شود.', `
      <p>حتی اگر دیتابیس لو برود، رمزها نباید قابل خواندن باشند. Django رمز را با الگوریتم‌های قوی مثل PBKDF2 یا Argon2 hash می‌کند و هنگام ورود، hashها را مقایسه می‌کند.</p>
      ${c('python', [
        '# config/settings.py',
        'PASSWORD_HASHERS = [',
        '    "django.contrib.auth.hashers.Argon2PasswordHasher",',
        '    "django.contrib.auth.hashers.PBKDF2PasswordHasher",',
        ']',
      ], 'تنظیم الگوریتم hash')}
      ${c('python', [
        '>>> from django.contrib.auth.hashers import check_password, make_password',
        '>>> make_password("secret")',
        "'argon2$argon2id$v=19$m=65536...'",
        '>>> check_password("secret", some_hash)',
        'True',
      ], 'ساخت و بررسی hash')}
      ${callout('danger', 'هرگز', 'رمز را در model ذخیره نکنید، در log ننویسید و با request.POST مقایسه نکنید. برای تغییر رمز از <code>set_password</code> استفاده کنید.')}
    `)
  );
})(window);
