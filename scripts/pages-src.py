# Одноразовый генератор исходных HTML-страниц (каркас + контент). Дальше правятся вручную.
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def page(main):
    return f'''<!doctype html>
<html lang="ru">
<head><!--@head--></head>
<body>
<!--@header-->
<main id="main">
{main}
</main>
<!--@footer-->
</body>
</html>
'''

P = {}

P['index.html'] = '''<section class="hero">
  <div class="container hero__grid">
    <div class="hero__text">
      <img class="hero__logo" src="/img/logo-320.webp" width="320" height="320" alt="ЦИРЮЛ" fetchpriority="high">
      <h1>Премиальный барбершоп с точной мужской подачей</h1>
      <p class="hero__sub">Барбершоп ЦИРЮЛ в Самаре на Гагарина, 42 — в двух минутах от метро «Гагаринская». Стрижки, борода и опасное бритьё без суеты.</p>
      <div class="hero__actions">
        <button class="btn btn--primary btn--large" type="button" data-book>Записаться онлайн</button>
        <a class="btn btn--ghost btn--large" href="{{B}}uslugi/">Услуги и цены</a>
      </div>
      <ul class="hero__facts">
        <li><strong>5,0</strong> на 2ГИС, 32 оценки</li>
        <li><strong>09:00–21:00</strong> ежедневно</li>
        <li>Стрижка от <strong>1 700 ₽</strong></li>
      </ul>
    </div>
    <div class="mirror">
      <div class="mirror__frame">
        <video autoplay muted loop playsinline preload="metadata" poster="/video/poster.webp" aria-hidden="true">
          <source src="/video/hero.webm" type="video/webm">
          <source src="/video/hero.mp4" type="video/mp4">
        </video>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container intro">
    <div>
      <h2>Форма, качество и ваше время</h2>
      <p class="lead">Три кресла, спокойный зал и мастера, которые сначала слушают, а потом берут машинку. Подбираем форму под тип лица и показываем, как укладывать дома.</p>
      <ul class="facts-grid">
        <li><strong>Гарантия</strong><span>Поправим стрижку бесплатно, если что-то не так</span></li>
        <li><strong>2 минуты</strong><span>пешком от м. Гагаринская</span></li>
        <li><strong>Кофе и Wi-Fi</strong><span>пока ждёте или пока стрижётся сын</span></li>
        <li><strong>Парковка</strong><span>15 мест рядом с входом</span></li>
      </ul>
      <p style="margin-top:28px"><a class="link" href="{{B}}o-nas/">Подробнее о барбершопе</a></p>
    </div>
    <div class="intro__media panel reveal"><!--@img interior-hall {"alt":"Зал барбершопа: три кресла у зеркал и синие стены","sizes":"(min-width: 900px) 45vw, 100vw"}--></div>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <div class="section__head"><h2>Популярные услуги</h2><a class="link" href="{{B}}uslugi/">Весь прайс</a></div>
    <!--@block:service-cards-->
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section__head"><h2>Акции</h2><a class="link" href="{{B}}akcii/">Все акции</a></div>
    <!--@block:promos:3-->
  </div>
</section>

<section class="section section--dark">
  <div class="container">
    <div class="section__head"><h2>Работы мастеров</h2><a class="link" href="{{B}}galereya/">Галерея</a></div>
    <!--@block:works-4-->
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section__head"><h2>Мастера</h2><a class="link" href="{{B}}mastera/">Все мастера</a></div>
    <!--@block:masters-->
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <div class="section__head"><h2>Отзывы</h2><p class="rating"><strong>5,0</strong><span>32 оценки на 2ГИС</span></p></div>
    <!--@block:reviews-->
  </div>
</section>

<section class="cta">
  <div class="cta__bg" aria-hidden="true"><!--@img interior-lights {"alt":"","sizes":"100vw"}--></div>
  <div class="container">
    <div class="cta__box panel">
      <h2>Запишитесь на удобное время</h2>
      <p>Онлайн за минуту или по телефону <a href="<!--@phoneHref-->" data-goal="click_phone"><!--@phone--></a>. Ежедневно с 9:00 до 21:00.</p>
      <div class="cta__actions">
        <button class="btn btn--primary btn--large" type="button" data-book>Записаться онлайн</button>
        <a class="btn btn--ghost btn--large" href="<!--@phoneHref-->" data-goal="click_phone">Позвонить</a>
      </div>
    </div>
  </div>
</section>'''

P['uslugi/index.html'] = '''<section class="page-hero container">
  <!--@crumbs-->
  <h1>Услуги и цены</h1>
  <p class="lead">Цены окончательные. Первая стрижка для новых клиентов — со скидкой 20%.</p>
</section>
<section class="container price-wrap" style="padding-bottom:clamp(64px,9vw,140px)">
  <!--@block:price-full-->
</section>'''

for slug in ['muzhskaya-strizhka', 'strizhka-boroda', 'oformlenie-borody', 'opasnoe-britie']:
    P[f'{slug}/index.html'] = f'<!--@service:{slug}-->'

P['akcii/index.html'] = '''<section class="page-hero container">
  <!--@crumbs-->
  <h1>Акции</h1>
  <p class="lead">Скидки не суммируются. Выберите акцию — она подставится в запись.</p>
</section>
<section class="container" style="padding-bottom:clamp(64px,9vw,140px)">
  <!--@block:promos-->
</section>'''

P['mastera/index.html'] = '''<section class="page-hero container">
  <!--@crumbs-->
  <h1>Мастера</h1>
  <p class="lead">Выберите мастера — или запишитесь к любому свободному, так больше вариантов по времени.</p>
</section>
<section class="container" style="padding-bottom:clamp(64px,9vw,140px)">
  <!--@block:masters-->
</section>'''

P['o-nas/index.html'] = '''<section class="page-hero container">
  <!--@crumbs-->
  <div class="intro">
    <div>
      <h1>О барбершопе</h1>
      <p class="lead">ЦИРЮЛ открылся в 2026 году на Гагарина, 42. Мы делаем мужские стрижки и бороду так, чтобы форма держалась и без укладочных средств.</p>
      <p>Зал на три кресла: синие стены с панелями, линейный свет без теней, чёрные кожаные кресла. Никто ничего не навязывает — можно поговорить с мастером, а можно помолчать.</p>
      <p>Работаем на косметике Constant Delight, даём гарантию на стрижку и угощаем кофе. Можно прийти с собакой.</p>
      <button class="btn btn--primary" type="button" data-book>Записаться</button>
    </div>
    <div class="intro__media panel"><!--@img interior-chair-tufted {"alt":"Стёганое кресло барбера у синей стены","sizes":"(min-width: 900px) 45vw, 100vw","eager":true}--></div>
  </div>
</section>
<section class="section section--alt">
  <div class="container">
    <h2>Интерьер</h2>
    <ul class="works">
      <li class="reveal"><!--@img interior-reception {"alt":"Стойка администратора с панелями","sizes":"(min-width: 900px) 25vw, 50vw"}--></li>
      <li class="reveal"><!--@img interior-lights {"alt":"Зал с линейными светильниками","sizes":"(min-width: 900px) 25vw, 50vw"}--></li>
      <li class="reveal"><!--@img care-shampoo {"alt":"Шампуни Constant Delight на полке","sizes":"(min-width: 900px) 25vw, 50vw"}--></li>
      <li class="reveal"><!--@img facade-entrance {"alt":"Вход со светящейся вывеской","sizes":"(min-width: 900px) 25vw, 50vw"}--></li>
    </ul>
  </div>
</section>'''

P['galereya/index.html'] = '''<section class="page-hero container">
  <!--@crumbs-->
  <h1>Галерея</h1>
  <p class="lead">Работы мастеров и зал. Нажмите на фото, чтобы открыть крупно.</p>
</section>
<section class="container" style="padding-bottom:clamp(64px,9vw,140px)">
  <!--@block:gallery-->
</section>'''

P['sertifikat/index.html'] = '''<section class="page-hero container">
  <!--@crumbs-->
  <div class="split">
    <div>
      <h1>Подарочный сертификат</h1>
      <p class="lead">Сертификат на сумму или на конкретную услугу. Действует 6 месяцев <!--@ph-->.</p>
      <div class="cert panel" aria-label="Макет сертификата">
        <img src="/img/logo-320.webp" width="200" height="200" alt="ЦИРЮЛ" loading="lazy">
        <div>
          <p class="cert__title">Подарочный сертификат</p>
          <p class="muted">барбершоп ЦИРЮЛ, Самара, ул. Гагарина, 42</p>
          <p class="cert__value" data-cert-value>3 000 ₽</p>
          <small>№ 0000-0000 · действует до ДД.ММ.ГГГГ <!--@ph--></small>
        </div>
      </div>
    </div>
    <form class="form" data-fake="certificates" data-goal="certificate_request" data-ok-title="Заявка отправлена" data-ok-text="Администратор позвонит, чтобы оформить сертификат. Это демо: данные никуда не отправлены." novalidate>
      <h2>Заявка</h2>
      <fieldset class="field" style="border:0;padding:0;margin:0">
        <legend>Номинал <!--@ph--></legend>
        <div class="denoms">
          <input type="radio" name="value" id="d1" value="1700" required><label for="d1">1 700 ₽ · стрижка</label>
          <input type="radio" name="value" id="d2" value="2700"><label for="d2">2 700 ₽ · стрижка + борода</label>
          <input type="radio" name="value" id="d3" value="3000" checked><label for="d3">3 000 ₽</label>
          <input type="radio" name="value" id="d4" value="5000"><label for="d4">5 000 ₽</label>
        </div>
      </fieldset>
      <div class="field"><label for="c-name">Ваше имя</label><input id="c-name" name="name" required autocomplete="name"></div>
      <div class="field"><label for="c-phone">Телефон</label><input id="c-phone" name="phone" type="tel" inputmode="tel" required autocomplete="tel" placeholder="+7 (___) ___-__-__"></div>
      <div class="field"><label for="c-to">Кому (необязательно)</label><input id="c-to" name="to"></div>
      <!--@block:consent:c-consent-->
      <p class="form-err" role="alert"></p>
      <button class="btn btn--primary btn--large" type="submit">Отправить заявку</button>
    </form>
  </div>
</section>'''

P['blog/index.html'] = '''<section class="page-hero container">
  <!--@crumbs-->
  <h1>Блог</h1>
  <p class="lead">Коротко о стрижках, бороде и уходе.</p>
</section>
<section class="container" style="padding-bottom:clamp(64px,9vw,140px)">
  <!--@block:blog-cards-->
</section>'''

for slug in ['kak-vybrat-strizhku-pod-formu-lica', 'uhod-za-borodoy-mezhdu-vizitami', 'kak-chasto-strichsya']:
    P[f'blog/{slug}/index.html'] = f'<!--@article:{slug}-->'

P['vakansii/index.html'] = '''<section class="page-hero container">
  <!--@crumbs-->
  <h1>Вакансии</h1>
  <p class="lead">Ищем людей, которым важна аккуратность. <!--@ph--></p>
</section>
<section class="container" style="padding-bottom:clamp(64px,9vw,140px)">
  <div class="split">
    <div class="cards">
      <article class="vacancy panel">
        <h2>Барбер</h2>
        <p class="muted">Опыт от 1 года · сменный график · процент + оклад <!--@ph--></p>
        <ul><li>Уверенные фейды и стрижки ножницами</li><li>Работа с бородой и опасной бритвой</li><li>Портфолио работ</li></ul>
      </article>
      <article class="vacancy panel">
        <h2>Администратор</h2>
        <p class="muted">2/2 · 09:00–21:00 · оклад <!--@ph--></p>
        <ul><li>Запись клиентов и звонки</li><li>Касса и порядок в зале</li><li>Вежливость без навязчивости</li></ul>
      </article>
    </div>
    <form class="form" data-fake="vacancies" data-goal="vacancy_request" data-ok-title="Отклик отправлен" data-ok-text="Мы свяжемся с вами в течение двух рабочих дней. Это демо: данные никуда не отправлены." novalidate>
      <h2>Откликнуться</h2>
      <div class="field"><label for="v-pos">Вакансия</label><select id="v-pos" name="position" required><option value="Барбер">Барбер</option><option value="Администратор">Администратор</option></select></div>
      <div class="field"><label for="v-name">Имя</label><input id="v-name" name="name" required autocomplete="name"></div>
      <div class="field"><label for="v-phone">Телефон</label><input id="v-phone" name="phone" type="tel" inputmode="tel" required autocomplete="tel" placeholder="+7 (___) ___-__-__"></div>
      <div class="field"><label for="v-about">Опыт и ссылка на портфолио</label><textarea id="v-about" name="about"></textarea></div>
      <!--@block:consent:v-consent-->
      <p class="form-err" role="alert"></p>
      <button class="btn btn--primary btn--large" type="submit">Отправить отклик</button>
    </form>
  </div>
</section>'''

P['kontakty/index.html'] = '''<section class="page-hero container">
  <!--@crumbs-->
  <h1>Контакты</h1>
</section>
<section class="container" style="padding-bottom:clamp(64px,9vw,140px)">
  <div class="split">
    <div>
      <!--@block:contacts-->
      <p style="margin-top:28px"><button class="btn btn--primary btn--large" type="button" data-book>Записаться онлайн</button></p>
    </div>
    <div class="map panel">
      <div>
        <p>Здесь будет интерактивная карта <!--@ph--></p>
        <p>Самара, ул. Гагарина, 42 · 53.200615, 50.179068</p>
        <a class="btn btn--ghost" href="https://yandex.ru/maps/?pt=50.179068,53.200615&amp;z=17&amp;l=map" target="_blank" rel="noopener">Открыть в Яндекс Картах</a>
      </div>
    </div>
  </div>
</section>'''

P['politika/index.html'] = '''<section class="page-hero container">
  <!--@crumbs-->
  <h1>Политика конфиденциальности</h1>
  <p class="lead"><!--@ph--> Шаблон. Перед запуском текст должен проверить юрист.</p>
</section>
<section class="container prose" style="padding-bottom:clamp(64px,9vw,140px)">
  <h2>1. Оператор</h2>
  <p>Оператор персональных данных — ИП Лисина Анна Олеговна, ИНН 526113057630 (далее — Оператор). Адрес: Самара, ул. Гагарина, 42. Почта: ciryul@yandex.ru.</p>
  <h2>2. Какие данные мы обрабатываем</h2>
  <p>Имя, номер телефона, данные, указанные в формах записи, заявки на сертификат и отклика на вакансию, а также технические данные (cookie, IP-адрес, сведения о браузере) при подключении сервисов аналитики.</p>
  <h2>3. Цели обработки</h2>
  <ul><li>запись на услуги и подтверждение визита;</li><li>оформление подарочных сертификатов;</li><li>рассмотрение откликов на вакансии;</li><li>улучшение работы сайта.</li></ul>
  <h2>4. Правовые основания</h2>
  <p>Согласие субъекта персональных данных (ст. 6 и 9 Федерального закона № 152-ФЗ «О персональных данных»).</p>
  <h2>5. Сроки и порядок</h2>
  <p>Данные хранятся до достижения целей обработки или до отзыва согласия. Согласие можно отозвать письмом на ciryul@yandex.ru.</p>
  <h2>6. Cookie</h2>
  <p>Сайт может использовать cookie и сервисы веб-аналитики (Яндекс Метрика, Google Analytics). Их можно отключить в настройках браузера.</p>
  <h2>7. Права субъекта</h2>
  <p>Вы вправе получить сведения об обработке своих данных, потребовать их уточнения, блокирования или удаления.</p>
</section>'''

P['404.html'] = '''<section class="container notfound">
  <div>
    <p class="notfound__code" aria-hidden="true">404</p>
    <h1>Такой страницы нет</h1>
    <p class="lead" style="margin-inline:auto">Возможно, ссылка устарела. Вернитесь на главную или сразу запишитесь.</p>
    <div class="cta__actions">
      <a class="btn btn--ghost btn--large" href="{{B}}">На главную</a>
      <button class="btn btn--primary btn--large" type="button" data-book>Записаться</button>
    </div>
  </div>
</section>'''

for path, main in P.items():
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8', newline='\n') as f:
        f.write(page(main))
print(len(P), 'pages')
