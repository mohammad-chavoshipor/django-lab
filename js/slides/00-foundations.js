(function (global) {
  'use strict';
  const { c, callout, exercise, tbl, flow, slide: s, objectives, lab, checklist, quiz } = global.DL;

  global.SLIDES.push(
    s('نقشه راه', 'آزمایشگاه جنگو از صفر تا صد', 'یک مسیر حرفه‌ای و مرتب برای کسی که تازه برنامه‌نویسی وب را شروع می‌کند.', `
      <p class="lead">این دوره از مفهوم وب و HTTP شروع می‌شود، بعد وارد Python/Django می‌شود، سپس با یک پروژه واقعی وبلاگ و فروشگاه کوچک همه قطعات را کنار هم می‌گذارد و در نهایت آن را روی سرور منتشر می‌کند.</p>
      <h2>خروجی دوره</h2>
      <ul>
        <li>درک درست از request، response، status code، routing و چرخه اجرای وب.</li>
        <li>توانایی ساخت پروژه Django با مدل، دیتابیس، migration، admin، view، template، form، authentication و permission.</li>
        <li>خواندن و رفع خطاهای Django به‌جای کپی‌کردن کورکورانه از اینترنت.</li>
        <li>ساخت مرحله‌به‌مرحله پروژه <strong>MiniShop Blog</strong>: محتوا، محصول، سبد خرید، سفارش، ورود کاربر، تست و انتشار روی سرور واقعی.</li>
      </ul>
      ${callout('tip', 'ترتیب یادگیری', 'برای شروع برنامه‌نویسی، ابتدا ذهنیت وب مهم است؛ اگر مستقیم سراغ مدل‌ها و کلاس‌ها برویم، علت وجود هر قطعه در جنگو مبهم می‌ماند.')}
    `),

    s('نقشه راه', 'سرفصل کامل دوره', 'ابتدا تصویر کلی، سپس جزئیات اجرایی هر بخش.', `
      ${tbl(['#', 'بخش', 'چه چیزی یاد می‌گیرید'], [
        ['۰', 'مبانی وب', 'client/server، URL و DNS، HTTP، request، response، status، cookie، JSON.'],
        ['۱', 'پیش‌نیازها', 'همان مقدار Python، HTML و دیتابیس رابطه‌ای که Django لازم دارد.'],
        ['۲', 'Django پایه', 'framework، MVT، venv، project/app، settings، urls، اولین view، shell.'],
        ['۳', 'مدل و دیتابیس', 'model، field، migration، ORM، lookup، relation، manager، constraint، custom user.'],
        ['۴', 'View و Template', 'view، template، inheritance، static/media، tag و filter، context processor.'],
        ['۵', 'فرم و اعتبارسنجی', 'Form، ModelForm، clean، widget، آپلود فایل، formset، الگوی PRG.'],
        ['۶', 'احراز هویت و امنیت', 'login، permission، session، CSRF، XSS، SQLi، hash رمز، بازیابی رمز.'],
        ['۷', 'خطایابی', 'خواندن traceback، ده خطای رایج، Django Debug Toolbar، logging.'],
        ['۸', 'پروژه عملی', 'MiniShop Blog: blog، shop، cart، order، accounts، تست و seed.'],
        ['۹', 'حرفه‌ای‌سازی', 'CBV، pagination، cache، performance، تست، Git.'],
        ['۱۰', 'استقرار', 'requirements، env، PostgreSQL، Gunicorn، Nginx، HTTPS، backup، CI.'],
        ['۱۱', 'کارگاه تمرین', 'تمرین‌های درجه‌بندی‌شده، پروژه پایانی و معیار نمره‌دهی.'],
      ])}
      ${callout('info', 'قانون پیشرفت', 'هر بخش یک «نقطه کنترل» دارد. تا وقتی خروجی نقطه کنترل را روی کامپیوتر خودتان ندیده‌اید، به بخش بعدی نروید.')}
    `),

    s('نقشه راه', 'روش استفاده از دوره', 'این دوره خواندنی نیست؛ اجرایی است.', `
      <p>هر اسلاید یکی از این سه نقش را دارد: <strong>مفهوم</strong> (چرا)، <strong>کارگاه</strong> (قدم‌به‌قدم انجام بده) و <strong>تمرین</strong> (خودت بنویس). اگر فقط مفهوم‌ها را بخوانید، در پروژه واقعی گیر می‌کنید.</p>
      ${tbl(['نشان', 'یعنی', 'کار شما'], [
        ['<span class="chip">مقدماتی/متوسط/پیشرفته</span>', 'سطح اسلاید', 'ترتیب را رعایت کنید.'],
        ['کارگاه', 'مرحله‌به‌مرحله با نقطه کنترل', 'دستورها را واقعا اجرا کنید.'],
        ['تمرین', 'بدون دیدن راه‌حل بنویسید', 'اول تلاش، بعد «نمایش راه‌حل».'],
        ['خودآزمایی', 'سنجش سریع فهم', 'گزینه را انتخاب کنید تا توضیح باز شود.'],
      ])}
      <h2>پیش‌نیاز ابزاری</h2>
      ${checklist('قبل از شروع این‌ها را نصب کنید', [
        '<strong>Python 3.10 یا بالاتر</strong> — بررسی با <code>python3 --version</code>.',
        '<strong>یک ویرایشگر کد</strong> — VS Code یا PyCharm.',
        '<strong>ترمینال</strong> — Terminal در macOS/Linux، PowerShell یا Git Bash در Windows.',
        '<strong>Git</strong> — بررسی با <code>git --version</code>.',
        '<strong>مرورگر با DevTools</strong> — Chrome یا Firefox.',
      ])}
      ${callout('warn', 'زمان لازم', 'برای یادگیری واقعی روزی ۱ تا ۲ ساعت و مجموعا حدود ۳۰ روز در نظر بگیرید. برنامه ۳۰ روزه در بخش کارگاه تمرین آمده است.')}
      ${exercise('آماده‌سازی محیط', 'آسان', '<p>سه دستور <code>python3 --version</code>، <code>git --version</code> و <code>pip3 --version</code> را اجرا کنید و خروجی هر سه را یادداشت کنید.</p>', '<p>اگر Python نسخه کمتر از ۳٫۱۰ داشتید یا دستور پیدا نشد، از <code>python.org</code> نسخه جدید نصب کنید. در Windows هنگام نصب گزینه <em>Add Python to PATH</em> را حتما تیک بزنید.</p>')}
    `),

    s('مبانی وب', 'وب از چه قطعاتی ساخته شده است؟', 'قبل از Django باید بدانیم مرورگر و سرور با هم چه قراردادی دارند.', `
      ${objectives([
        'چرخه request/response را با کلمات خودتان توضیح دهید.',
        'اجزای یک URL را جدا کنید و بگویید هرکدام به چه کار Django می‌آید.',
        'معنی کدهای وضعیت پرکاربرد و علت هرکدام را بشناسید.',
        'تفاوت GET و POST و دلیل امنیتی آن را بدانید.',
      ])}
      <p>کاربر در مرورگر یک آدرس وارد می‌کند. مرورگر برای آن آدرس یک درخواست HTTP می‌سازد و به سرور می‌فرستد. سرور برنامه شما را اجرا می‌کند و یک پاسخ شامل status، header و body برمی‌گرداند.</p>
      ${flow(['مرورگر', 'Request', 'Django View', 'Response', 'صفحه نهایی'])}
      <h2>نقش‌ها</h2>
      <ul>
        <li><strong>Client:</strong> مرورگر، اپ موبایل یا هر برنامه‌ای که درخواست می‌فرستد.</li>
        <li><strong>Server:</strong> ماشینی که برنامه Django روی آن اجرا می‌شود.</li>
        <li><strong>HTTP:</strong> زبان مشترک client و server.</li>
      </ul>
    `),

    s('مبانی وب', 'Request چیست؟', 'Request بسته اطلاعاتی است که client برای server می‌فرستد.', `
      <p>هر request می‌گوید کاربر چه منبعی را می‌خواهد، با چه روشی می‌خواهد، چه داده‌ای همراه آن است و چه اطلاعاتی درباره مرورگر یا کاربر وجود دارد.</p>
      ${tbl(['بخش', 'مثال', 'توضیح'], [
        ['Method', '<code>GET</code>', 'نوع عملیات: گرفتن، ساختن، ویرایش یا حذف.'],
        ['Path', '<code>/posts/5/</code>', 'آدرس منبع داخل سایت.'],
        ['Headers', '<code>Accept-Language: fa</code>', 'اطلاعات جانبی مثل زبان، کوکی و نوع محتوا.'],
        ['Body', '<code>{\"title\":\"...\"}</code>', 'داده ارسالی در فرم‌ها و APIها.'],
      ])}
      ${c('text', [
        'GET /posts/5/ HTTP/1.1',
        'Host: example.com',
        'Cookie: sessionid=abc123',
        'Accept: text/html'
      ], 'نمونه خام Request')}
      ${callout('info', 'همین‌ها در Django کجا هستند؟', 'همه این بخش‌ها داخل شیء <code>request</code> در view شما در دسترس‌اند: <code>request.method</code>، <code>request.path</code>، <code>request.headers</code>، <code>request.GET</code>، <code>request.POST</code> و <code>request.COOKIES</code>.')}
    `),

    s('مبانی وب', 'انواع رایج Request Method', 'Method مشخص می‌کند هدف request چیست.', `
      ${tbl(['Method', 'هدف', 'نمونه در پروژه'], [
        ['<code>GET</code>', 'دریافت اطلاعات بدون تغییر دادن داده.', 'دیدن لیست مقاله‌ها یا صفحه محصول.'],
        ['<code>POST</code>', 'ارسال داده برای ساخت یا اجرای عملیات.', 'ثبت‌نام، ورود، ثبت نظر، افزودن محصول.'],
        ['<code>PUT/PATCH</code>', 'ویرایش کامل یا جزئی داده در API.', 'ویرایش محصول از طریق REST API.'],
        ['<code>DELETE</code>', 'حذف منبع در API.', 'حذف نظر یا محصول.'],
      ])}
      ${callout('warn', 'نکته مهم', 'در صفحات HTML معمولی Django معمولا GET و POST را زیاد می‌بینید. PUT، PATCH و DELETE بیشتر در APIها و JavaScript frontend رایج‌اند.')}
      ${quiz('چرا «حذف محصول» را نباید با لینک GET پیاده کنیم؟', [
        'چون GET کندتر از POST است.',
        'چون GET نباید داده را تغییر دهد؛ مرورگر، افزونه یا crawler ممکن است لینک را خودکار باز کند و محصول حذف شود.',
        'چون Django از GET پشتیبانی نمی‌کند.',
      ], 1, 'GET باید «امن» و بدون اثر جانبی باشد. عملیات تغییر داده با POST انجام می‌شود و در Django با <code>{% csrf_token %}</code> محافظت می‌گردد.')}
    `),

    s('مبانی وب', 'فرایند ارسال و دریافت درخواست', 'از کلیک کاربر تا اجرای view در Django.', `
      <ol>
        <li>کاربر روی لینک یا دکمه فرم کلیک می‌کند.</li>
        <li>مرورگر URL، method، header و در صورت نیاز body را می‌سازد.</li>
        <li>درخواست از شبکه به web server و سپس Django می‌رسد.</li>
        <li>Django آدرس را با فایل <code>urls.py</code> تطبیق می‌دهد.</li>
        <li>view اجرا می‌شود، ممکن است از model داده بخواند یا در template HTML بسازد.</li>
        <li>response با status code و body به مرورگر برمی‌گردد.</li>
      </ol>
      ${c('python', [
        'from django.http import HttpResponse',
        '',
        'def hello(request):',
        '    return HttpResponse("سلام Django")'
      ], 'اولین view')}
    `),

    s('مبانی وب', 'Status Code چیست؟', 'عدد وضعیت به client می‌گوید نتیجه request چه شد.', `
      ${tbl(['گروه', 'معنی', 'کدهای مهم'], [
        ['<code>2xx</code>', 'موفقیت', '<code>200 OK</code>، <code>201 Created</code>، <code>204 No Content</code>'],
        ['<code>3xx</code>', 'انتقال مسیر', '<code>301</code> دائمی، <code>302</code> موقت'],
        ['<code>4xx</code>', 'خطای سمت کاربر', '<code>400</code>، <code>401</code>، <code>403</code>، <code>404</code>، <code>405</code>'],
        ['<code>5xx</code>', 'خطای سمت سرور', '<code>500</code>، <code>502</code>، <code>504</code>'],
      ])}
      ${tbl(['کد', 'در Django چه زمانی می‌بینید؟'], [
        ['<code>200</code>', 'خروجی موفق <code>render()</code>.'],
        ['<code>302</code>', 'خروجی <code>redirect()</code>؛ همچنین وقتی <code>@login_required</code> کاربر مهمان را به login می‌فرستد.'],
        ['<code>403</code>', 'خطای CSRF یا <code>PermissionDenied</code>.'],
        ['<code>404</code>', '<code>get_object_or_404</code> چیزی پیدا نکرد یا هیچ URL patternای مطابقت نداشت.'],
        ['<code>405</code>', 'view فقط POST را قبول می‌کند ولی GET آمد (مثلا <code>@require_POST</code>).'],
        ['<code>500</code>', 'استثنای مدیریت‌نشده در view شما.'],
      ])}
      ${c('python', [
        'from django.shortcuts import get_object_or_404, render',
        'from .models import Post',
        '',
        'def post_detail(request, pk):',
        '    post = get_object_or_404(Post, pk=pk)',
        '    return render(request, "blog/detail.html", {"post": post})'
      ], 'ساخت خودکار 404 در Django')}
    `),

    s('مبانی وب', 'URL و DNS چیست؟', 'URL آدرس دقیق منبع است و DNS آن را به IP سرور تبدیل می‌کند.', `
      <p>هر منبع در وب یک URL دارد. وقتی آدرس را در مرورگر وارد می‌کنید، DNS نام دامنه را به IP سرور تبدیل می‌کند و سپس request به همان IP ارسال می‌شود.</p>
      ${tbl(['قسمت', 'مثال', 'نقش'], [
        ['Scheme', '<code>https://</code>', 'پروتکل ارتباط؛ HTTP یا HTTPS.'],
        ['Host', '<code>example.com</code>', 'نام دامنه که DNS آن را به IP تبدیل می‌کند.'],
        ['Path', '<code>/posts/django-intro/</code>', 'مسیر منبع در سایت؛ با الگوهای urls.py تطبیق داده می‌شود.'],
        ['Query', '<code>?q=django&page=2</code>', 'پارامترهای جست‌وجو و فیلتر؛ در Django با <code>request.GET</code>.'],
        ['Fragment', '<code>#comments</code>', 'موقعیت داخل صفحه؛ به سرور ارسال نمی‌شود.'],
      ])}
      ${c('text', 'https://example.com/posts/django-intro/?q=django&page=2#comments', 'نمونه URL')}
      ${callout('info', 'DNS', 'DNS مثل دفترچه تلفن اینترنت است: نام دامنه را به IP سرور تبدیل می‌کند. در Django، دامنه‌های مجاز در <code>ALLOWED_HOSTS</code> مشخص می‌شوند.')}
      ${exercise('تشخیص URL', 'آسان', '<p>در آدرس <code>https://shop.example.com/products/5/?page=2</code>، host، path و query را جدا کنید و بگویید کدام قسمت در <code>urls.py</code> و کدام در <code>request.GET</code> دیده می‌شود.</p>', '<p>host: <code>shop.example.com</code>، path: <code>/products/5/</code> و query: <code>page=2</code>. مسیر با الگوی <code>urls.py</code> تطبیق می‌خورد و <code>5</code> به view می‌رسد؛ <code>page</code> فقط از <code>request.GET.get("page")</code> خوانده می‌شود.</p>')}
    `),

    s('مبانی وب', 'Response چه شکلی است؟', 'پاسخ سرور از سه بخش status، header و body تشکیل شده است.', `
      <p>مرورگر برای نمایش صفحه، نه فقط به HTML بلکه به اطلاعات جانبی هم نیاز دارد. سرور در headerها نوع محتوا، زبان و کوکی‌ها را می‌فرستد و body محتوای اصلی را حمل می‌کند.</p>
      ${tbl(['بخش', 'مثال', 'توضیح'], [
        ['Status line', '<code>HTTP/1.1 200 OK</code>', 'نسخه پروتکل، کد وضعیت و پیام کوتاه.'],
        ['Headers', '<code>Content-Type: text/html; charset=utf-8</code>', 'نوع محتوا، طول، زبان، کوکی و قوانین cache.'],
        ['Body', '<code>&lt;html&gt;...&lt;/html&gt;</code>', 'محتویات اصلی؛ در Django خروجی template است.'],
      ])}
      ${c('text', [
        'HTTP/1.1 200 OK',
        'Content-Type: text/html; charset=utf-8',
        'Content-Length: 512',
        '',
        '<!doctype html>',
        '<html>...</html>'
      ], 'نمونه خام Response')}
      ${callout('tip', 'در Django', 'body را با template می‌سازید؛ status و headerها را یا Django تنظیم می‌کند یا خودتان با <code>HttpResponse</code> تعیین می‌کنید.')}
    `),

    s('مبانی وب', 'HTTP یا HTTPS؟', 'HTTPS یعنی HTTP روی اتصال رمزنگاری‌شده TLS.', `
      <p>بدون رمزنگاری، داده‌هایی مثل رمز عبور از مسیر عبور می‌کنند و هر کسی در مسیر می‌تواند آن‌ها را بخواند یا تغییر دهد. HTTPS با گواهی و TLS این داده‌ها را قبل از ارسال رمز می‌کند.</p>
      ${tbl(['مورد', 'HTTP', 'HTTPS'], [
        ['رمزنگاری داده', 'ندارد', 'دارد (TLS)'],
        ['اعتماد کاربر', 'کم', 'زیاد؛ قفل سبز در مرورگر'],
        ['امنیت فرم و ورود', 'در معرض خطر', 'امن'],
        ['رتبه SEO', 'کمتر', 'بهتر'],
      ])}
      ${callout('warn', 'در Django', 'در production تنظیمات <code>SECURE_SSL_REDIRECT</code>، <code>SECURE_HSTS_SECONDS</code> و <code>SESSION_COOKIE_SECURE</code> را فعال کنید؛ در بخش امنیت و استقرار کامل می‌بینید.')}
    `),

    s('مبانی وب', 'Cookie و مفهوم وضعیت (State)', 'HTTP حافظه ندارد؛ cookie همان حافظه‌ای است که به آن اضافه می‌کنیم.', `
      <p>HTTP <strong>stateless</strong> است: سرور بعد از پاسخ دادن، درخواست را فراموش می‌کند. پس چطور سایت می‌فهمد شما همان کاربری هستید که یک دقیقه پیش وارد شدید؟ سرور در پاسخ یک cookie می‌فرستد و مرورگر آن را در همه درخواست‌های بعدی همان دامنه پس می‌فرستد.</p>
      ${flow(['ورود کاربر', 'Set-Cookie: sessionid', 'مرورگر ذخیره می‌کند', 'Cookie در هر request', 'سرور کاربر را می‌شناسد'])}
      ${c('text', [
        '# پاسخ سرور بعد از ورود موفق',
        'HTTP/1.1 302 Found',
        'Set-Cookie: sessionid=k7f2...; HttpOnly; Secure; SameSite=Lax',
        '',
        '# درخواست بعدی مرورگر',
        'GET /dashboard/ HTTP/1.1',
        'Cookie: sessionid=k7f2...'
      ], 'چرخه cookie')}
      ${tbl(['ویژگی cookie', 'یعنی چه', 'چرا مهم است'], [
        ['<code>HttpOnly</code>', 'JavaScript نمی‌تواند آن را بخواند.', 'جلوی سرقت session با XSS را می‌گیرد.'],
        ['<code>Secure</code>', 'فقط روی HTTPS ارسال می‌شود.', 'جلوی شنود در شبکه عمومی.'],
        ['<code>SameSite</code>', 'ارسال در درخواست‌های سایت دیگر محدود می‌شود.', 'کاهش ریسک CSRF.'],
        ['<code>Max-Age</code>', 'مدت اعتبار.', 'کنترل «مرا به خاطر بسپار».'],
      ])}
      ${callout('info', 'در Django', 'Django خودش این را مدیریت می‌کند: داده session سمت سرور ذخیره می‌شود و فقط شناسه آن در cookie می‌رود. تنظیمات مربوطه <code>SESSION_COOKIE_HTTPONLY</code>، <code>SESSION_COOKIE_SECURE</code> و <code>SESSION_COOKIE_AGE</code> هستند.')}
    `),

    s('مبانی وب', 'JSON و API چیست؟', 'گاهی خروجی سرور به‌جای صفحه HTML، داده خام است.', `
      <p>وقتی مصرف‌کننده پاسخ یک انسان باشد، HTML می‌فرستیم. وقتی مصرف‌کننده یک برنامه دیگر باشد — اپ موبایل، فرانت‌اند React، یا حتی JavaScript همان صفحه — داده را با فرمت <strong>JSON</strong> می‌فرستیم. به این نقطه‌های داده‌ای می‌گوییم API.</p>
      ${tbl(['پاسخ', 'Content-Type', 'مصرف‌کننده', 'در Django'], [
        ['HTML', '<code>text/html</code>', 'مرورگر و انسان', '<code>render()</code>'],
        ['JSON', '<code>application/json</code>', 'برنامه دیگر', '<code>JsonResponse()</code> یا DRF'],
      ])}
      ${c('python', [
        'from django.http import JsonResponse',
        '',
        'def api_post_count(request):',
        '    return JsonResponse({"published": 12, "draft": 3})'
      ], 'ساده‌ترین API در Django')}
      ${c('text', [
        'HTTP/1.1 200 OK',
        'Content-Type: application/json',
        '',
        '{"published": 12, "draft": 3}'
      ], 'پاسخ JSON')}
      ${callout('tip', 'چه زمانی API؟', 'در این دوره ابتدا سایت کامل با HTML می‌سازیم (چون همه مفاهیم را نشان می‌دهد) و در بخش حرفه‌ای‌سازی با Django REST Framework همان داده را به‌شکل API هم بیرون می‌دهیم.')}
    `),

    s('مبانی وب', 'DevTools مرورگر: ابزار اصلی خطایابی', 'هر چیزی که تا اینجا گفتیم را می‌توانید با چشم ببینید.', `
      <p>با <kbd class="kbd">F12</kbd> یا کلیک راست و «Inspect» ابزار توسعه‌دهنده باز می‌شود. برای برنامه‌نویس وب، تب <strong>Network</strong> مهم‌ترین ابزار است.</p>
      ${tbl(['تب', 'چه می‌بینید', 'کاربرد در Django'], [
        ['<strong>Network</strong>', 'همه requestها با method، status، زمان و اندازه.', 'دیدن اینکه فرم واقعا POST شد؟ status چه بود؟ redirect خورد؟'],
        ['<strong>Console</strong>', 'خطاهای JavaScript.', 'وقتی فایل static لود نمی‌شود یا اسکریپت خطا می‌دهد.'],
        ['<strong>Elements</strong>', 'HTML نهایی رندرشده.', 'بررسی خروجی واقعی template.'],
        ['<strong>Application</strong>', 'cookieها و ذخیره‌سازی مرورگر.', 'دیدن <code>sessionid</code> و <code>csrftoken</code>.'],
      ])}
      ${lab('نگاه کردن به یک request واقعی', 'زمان: ۵ دقیقه', [
        { do: 'یک سایت دلخواه را باز کنید و <kbd class="kbd">F12</kbd> بزنید، سپس به تب <strong>Network</strong> بروید.' },
        { do: 'صفحه را با <kbd class="kbd">Ctrl</kbd>+<kbd class="kbd">R</kbd> دوباره بارگذاری کنید تا لیست پر شود.' },
        { do: 'روی اولین ردیف (خود سند HTML) کلیک کنید و بخش <strong>Headers</strong> را باز کنید.', why: 'همان‌جا method، status code، request headers و response headers را که در اسلایدهای قبل خواندیم با داده واقعی می‌بینید.' },
        { do: 'ستون <strong>Status</strong> را نگاه کنید و یک نمونه <code>200</code>، یک نمونه <code>304</code> و در صورت وجود یک <code>404</code> پیدا کنید.' },
      ], '<p>باید بتوانید بگویید: این صفحه با چه method گرفته شد، چه status داشت، <code>Content-Type</code> آن چه بود و چند فایل جانبی (CSS/JS/تصویر) هم درخواست شد.</p>')}
      ${quiz('در تب Network می‌بینید فرم ورود شما status <code>200</code> برگرداند و روی همان صفحه ماند. یعنی چه؟', [
        'ورود موفق بوده است.',
        'فرم معتبر نبوده؛ Django همان صفحه را با خطاهای فرم دوباره رندر کرده است. ورود موفق معمولا <code>302</code> می‌دهد.',
        'سرور خاموش است.',
      ], 1, 'الگوی استاندارد فرم در Django: موفقیت یعنی <code>redirect()</code> و status <code>302</code>؛ شکست یعنی رندر دوباره همان template با <code>form.errors</code> و status <code>200</code>.')}
    `)
  );

})(window);
