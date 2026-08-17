(function (global) {
  'use strict';

  const esc = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const faDigits = (value) => String(value).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

  function c(lang, source, title) {
    const code = Array.isArray(source) ? source.join('\n') : String(source);
    const highlighted = global.DjangoLab && global.DjangoLab.highlight
      ? global.DjangoLab.highlight(code, lang)
      : esc(code);
    return `
      <div class="code-block" dir="ltr">
        <div class="code-head">
          <span class="code-lang">${esc(title || lang)}</span>
          <button class="copy-btn" type="button" data-code="${esc(code)}">کپی</button>
        </div>
        <pre class="code"><code>${highlighted}</code></pre>
      </div>`;
  }

  function callout(type, title, text) {
    return `
      <div class="callout ${type}">
        <div class="callout-ico">${type === 'warn' ? '!' : type === 'danger' ? 'x' : 'i'}</div>
        <div class="callout-body">
          <div class="callout-title">${title}</div>
          <p>${text}</p>
        </div>
      </div>`;
  }

  function exercise(title, difficulty, body, solution) {
    return `
      <div class="exercise">
        <div class="exercise-head">
          <span class="exercise-badge">تمرین</span>
          <span class="ex-label">${title}</span>
          <span class="exercise-diff">${difficulty}</span>
        </div>
        <div class="exercise-body">
          ${body}
          ${solution ? `<button class="reveal-btn" type="button">نمایش راه‌حل</button><div class="exercise-solution"><div class="exercise-solution-label">راه‌حل پیشنهادی</div>${solution}</div>` : ''}
        </div>
      </div>`;
  }

  function tbl(headers, rows) {
    return `
      <div class="table-wrap">
        <table class="tbl">
          <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>`;
  }

  function flow(items) {
    return `
      <div class="diagram">
        <div class="flow" dir="rtl">
          <div class="flow-row">
            ${items.map((item, index) => `
              <span class="flow-box ${index === 0 || index === items.length - 1 ? 'accent' : ''}">${item}</span>
              ${index < items.length - 1 ? '<span class="flow-arrow">←</span>' : ''}
            `).join('')}
          </div>
        </div>
      </div>`;
  }

  function slide(section, title, subtitle, body, level) {
    return { section, title, subtitle, body, level: level || 'مقدماتی' };
  }

  global.SLIDES = global.SLIDES || [];
  global.DL = { c, callout, exercise, tbl, flow, slide, faDigits };

  const { c: code, callout: note, exercise: ex, tbl: table, flow: requestFlow, slide: s } = global.DL;

  global.SLIDES.push(
    s('نقشه راه', 'آزمایشگاه جنگو از صفر تا صد', 'یک مسیر حرفه‌ای و مرتب برای کسی که تازه برنامه‌نویسی وب را شروع می‌کند.', `
      <p class="lead">این دوره از مفهوم وب و HTTP شروع می‌شود، بعد وارد Python/Django می‌شود، سپس با یک پروژه واقعی وبلاگ و فروشگاه کوچک همه قطعات را کنار هم می‌گذارد.</p>
      <h2>خروجی دوره</h2>
      <ul>
        <li>درک درست از request، response، status code، routing و چرخه اجرای وب.</li>
        <li>توانایی ساخت پروژه Django با مدل، دیتابیس، migration، admin، view، template، form، authentication و permission.</li>
        <li>ساخت مرحله‌به‌مرحله پروژه <strong>MiniShop Blog</strong>: محتوا، محصول، سبد خرید ساده، ورود کاربر، پنل ادمین و آماده‌سازی انتشار.</li>
      </ul>
      ${note('tip', 'ترتیب یادگیری', 'برای شروع برنامه‌نویسی، ابتدا ذهنیت وب مهم است؛ اگر مستقیم سراغ مدل‌ها و کلاس‌ها برویم، علت وجود هر قطعه در جنگو مبهم می‌ماند.')}
    `),

    s('نقشه راه', 'سرفصل کامل دوره', 'ابتدا تصویر کلی، سپس جزئیات اجرایی هر بخش.', `
      <ol>
        <li>وب چگونه کار می‌کند: client، server، URL، DNS، HTTP، request، response و status.</li>
        <li>Framework چیست و چرا Django یک web framework کامل است.</li>
        <li>راه‌اندازی محیط: Python، venv، pip، نصب Django، ساخت project و app.</li>
        <li>URL، view، template و معماری MVT در Django.</li>
        <li>دیتابیس: model، migration، ORM، relation، query، admin.</li>
        <li>فرم‌ها، validation، static/media و تجربه کاربر.</li>
        <li>Authentication، authorization، session، CSRF، امنیت پایه.</li>
        <li>پروژه واقعی: وبلاگ + فروشگاه کوچک با کد مرحله‌به‌مرحله.</li>
        <li>تست، بهینه‌سازی، cache، logging، محیط production و deployment.</li>
      </ol>
      ${ex('مرتب‌سازی مفاهیم', 'آسان', '<p>برای خودتان توضیح دهید چرا یادگیری HTTP باید قبل از ساخت model باشد.</p>', '<p>چون view و model در پاسخ به request کار می‌کنند. وقتی چرخه request/response را بفهمیم، می‌دانیم داده چرا خوانده می‌شود، کجا پردازش می‌شود و response چگونه برمی‌گردد.</p>')}
    `),

    s('مبانی وب', 'وب از چه قطعاتی ساخته شده است؟', 'قبل از Django باید بدانیم مرورگر و سرور با هم چه قراردادی دارند.', `
      <p>کاربر در مرورگر یک آدرس وارد می‌کند. مرورگر برای آن آدرس یک درخواست HTTP می‌سازد و به سرور می‌فرستد. سرور برنامه شما را اجرا می‌کند و یک پاسخ شامل status، header و body برمی‌گرداند.</p>
      ${requestFlow(['مرورگر', 'Request', 'Django View', 'Response', 'صفحه نهایی'])}
      <h2>نقش‌ها</h2>
      <ul>
        <li><strong>Client:</strong> مرورگر، اپ موبایل یا هر برنامه‌ای که درخواست می‌فرستد.</li>
        <li><strong>Server:</strong> ماشینی که برنامه Django روی آن اجرا می‌شود.</li>
        <li><strong>HTTP:</strong> زبان مشترک client و server.</li>
      </ul>
    `),

    s('مبانی وب', 'Request چیست؟', 'Request بسته اطلاعاتی است که client برای server می‌فرستد.', `
      <p>هر request می‌گوید کاربر چه منبعی را می‌خواهد، با چه روشی می‌خواهد، چه داده‌ای همراه آن است و چه اطلاعاتی درباره مرورگر یا کاربر وجود دارد.</p>
      ${table(['بخش', 'مثال', 'توضیح'], [
        ['Method', '<code>GET</code>', 'نوع عملیات: گرفتن، ساختن، ویرایش یا حذف.'],
        ['Path', '<code>/posts/5/</code>', 'آدرس منبع داخل سایت.'],
        ['Headers', '<code>Accept-Language: fa</code>', 'اطلاعات جانبی مثل زبان، کوکی و نوع محتوا.'],
        ['Body', '<code>{\"title\":\"...\"}</code>', 'داده ارسالی در فرم‌ها و APIها.'],
      ])}
      ${code('text', [
        'GET /posts/5/ HTTP/1.1',
        'Host: example.com',
        'Cookie: sessionid=abc123',
        'Accept: text/html'
      ], 'نمونه خام Request')}
    `),

    s('مبانی وب', 'انواع رایج Request Method', 'Method مشخص می‌کند هدف request چیست.', `
      ${table(['Method', 'هدف', 'نمونه در پروژه'], [
        ['<code>GET</code>', 'دریافت اطلاعات بدون تغییر دادن داده.', 'دیدن لیست مقاله‌ها یا صفحه محصول.'],
        ['<code>POST</code>', 'ارسال داده برای ساخت یا اجرای عملیات.', 'ثبت‌نام، ورود، ثبت نظر، افزودن محصول.'],
        ['<code>PUT/PATCH</code>', 'ویرایش کامل یا جزئی داده در API.', 'ویرایش محصول از طریق REST API.'],
        ['<code>DELETE</code>', 'حذف منبع در API.', 'حذف نظر یا محصول.'],
      ])}
      ${note('warn', 'نکته مهم', 'در صفحات HTML معمولی Django معمولا GET و POST را زیاد می‌بینید. PUT، PATCH و DELETE بیشتر در APIها و JavaScript frontend رایج‌اند.')}
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
      ${code('python', [
        'from django.http import HttpResponse',
        '',
        'def hello(request):',
        '    return HttpResponse("سلام Django")'
      ], 'اولین view')}
    `),

    s('مبانی وب', 'Status Code چیست؟', 'عدد وضعیت به client می‌گوید نتیجه request چه شد.', `
      ${table(['گروه', 'معنی', 'کدهای مهم'], [
        ['<code>2xx</code>', 'موفقیت', '<code>200 OK</code>، <code>201 Created</code>'],
        ['<code>3xx</code>', 'انتقال مسیر', '<code>301</code>، <code>302</code>'],
        ['<code>4xx</code>', 'خطای سمت کاربر', '<code>400</code>، <code>401</code>، <code>403</code>، <code>404</code>'],
        ['<code>5xx</code>', 'خطای سمت سرور', '<code>500</code>، <code>502</code>'],
      ])}
      ${code('python', [
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
      ${table(['قسمت', 'مثال', 'نقش'], [
        ['Scheme', '<code>https://</code>', 'پروتکل ارتباط؛ HTTP یا HTTPS.'],
        ['Host', '<code>example.com</code>', 'نام دامنه که DNS آن را به IP تبدیل می‌کند.'],
        ['Path', '<code>/posts/django-intro/</code>', 'مسیر منبع در سایت؛ با الگوهای urls.py تطبیق داده می‌شود.'],
        ['Query', '<code>?q=django&page=2</code>', 'پارامترهای جست‌وجو و فیلتر.'],
        ['Fragment', '<code>#comments</code>', 'موقعیت داخل صفحه؛ به سرور ارسال نمی‌شود.'],
      ])}
      ${code('text', 'https://example.com/posts/django-intro/?q=django&page=2#comments', 'نمونه URL')}
      ${callout('info', 'DNS', 'DNS مثل دفترچه تلفن اینترنت است: نام دامنه را به IP سرور تبدیل می‌کند. در Django، دامنه‌های مجاز در <code>ALLOWED_HOSTS</code> مشخص می‌شوند.')}
      ${exercise('تشخیص URL', 'آسان', '<p>در آدرس <code>https://shop.example.com/products/5/?page=2</code>، host، path و query را جدا کنید.</p>', '<p>host: <code>shop.example.com</code>، path: <code>/products/5/</code> و query: <code>page=2</code>.</p>')}
    `),

    s('مبانی وب', 'Response چه شکلی است؟', 'پاسخ سرور از سه بخش status، header و body تشکیل شده است.', `
      <p>مرورگر برای نمایش صفحه، نه فقط به HTML بلکه به اطلاعات جانبی هم نیاز دارد. سرور در headerها نوع محتوا، زبان و کوکی‌ها را می‌فرستد و body محتوای اصلی را حمل می‌کند.</p>
      ${table(['بخش', 'مثال', 'توضیح'], [
        ['Status line', '<code>HTTP/1.1 200 OK</code>', 'نسخه پروتکل، کد وضعیت و پیام کوتاه.'],
        ['Headers', '<code>Content-Type: text/html; charset=utf-8</code>', 'نوع محتوا، طول، زبان، کوکی و قوانین cache.'],
        ['Body', '<code>&lt;html&gt;...&lt;/html&gt;</code>', 'محتویات اصلی؛ در Django خروجی template است.'],
      ])}
      ${code('text', [
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
      ${table(['مورد', 'HTTP', 'HTTPS'], [
        ['رمزنگاری داده', 'ندارد', 'دارد (TLS)'],
        ['اعتماد کاربر', 'کم', 'زیاد؛ قفل سبز در مرورگر'],
        ['امنیت فرم و ورود', 'در معرض خطر', 'امن'],
        ['رتبه SEO', 'کمتر', 'بهتر'],
      ])}
      ${callout('warn', 'در Django', 'در production تنظیمات <code>SECURE_SSL_REDIRECT</code>، <code>SECURE_HSTS_SECONDS</code> و <code>SESSION_COOKIE_SECURE</code> را فعال کنید؛ در بخش امنیت کامل می‌بینید.')}
    `)
  );
})(window);
