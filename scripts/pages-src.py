# Генератор исходных HTML-страниц (каркас + контент).
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


def inner(title, lead, body, extra_head=''):
    return f'''<section class="page-hero"><!--@decor--><div class="container">
  <!--@crumbs-->
  <h1>{title}</h1>
  {f'<p class="lead">{lead}</p>' if lead else ''}{extra_head}
</div></section>
<section class="sheet page-body"><div class="container">
{body}
</div></section>'''


P = {}

P['index.html'] = '''<section class="hero">
  <div class="hero__bg" aria-hidden="true"><!--@img interior-hall-wide {"alt":"","sizes":"100vw","eager":true}--></div>
  <!--@decor-->
  <div class="hero__inner">
    <h1 class="hero__title">ЦИРЮЛ</h1>
    <p class="hero__slogan">Премиальный барбершоп с точной мужской подачей</p>
    <div class="hero__actions">
      <button class="btn btn--primary btn--pill btn--large" type="button" data-book>Онлайн-запись</button>
      <a class="btn btn--ghost btn--pill btn--large" href="{{B}}uslugi/">Услуги и цены</a>
    </div>
  </div>
  <span class="hero__scroll" aria-hidden="true"></span>
  <ul class="hero__facts">
    <li>Самара, <strong>ул. Гагарина, 42</strong></li>
    <li><strong>5,0</strong> на 2ГИС</li>
    <li>Ежедневно <strong>09:00–21:00</strong></li>
  </ul>
</section>

<section class="section sheet">
  <!--@decor:soft-->
  <div class="container intro">
    <div class="reveal">
      <p class="eyebrow">О барбершопе</p>
      <h2>Форма, качество и ваше время</h2>
      <p class="lead">Три кресла, спокойный зал и мастера, которые сначала слушают, а потом берут машинку. Подбираем форму под тип лица и показываем, как укладывать дома.</p>
      <ul class="facts-grid">
        <li><strong>Гарантия</strong><span>Поправим стрижку бесплатно, если что-то не так</span></li>
        <li><strong>2 минуты</strong><span>пешком от м. Гагаринская</span></li>
        <li><strong>Кофе и Wi-Fi</strong><span>пока ждёте своей очереди</span></li>
        <li><strong>Парковка</strong><span>15 мест рядом с входом</span></li>
      </ul>
      <p style="margin-top:28px"><a class="link" href="{{B}}o-nas/">Подробнее о барбершопе</a></p>
    </div>
    <div class="intro__media reveal"><!--@img interior-hall {"alt":"Зал барбершопа: три кресла у зеркал и синие стены","sizes":"(min-width: 900px) 45vw, 100vw"}--></div>
  </div>
</section>

<section class="section dark">
  <!--@decor-->
  <div class="container">
    <div class="section__head"><div><p class="eyebrow">Услуги</p><h2>Популярные услуги</h2></div><a class="link" href="{{B}}uslugi/">Весь прайс</a></div>
    <!--@block:service-cards-->
  </div>
</section>

<section class="section sheet">
  <!--@decor:soft-->
  <div class="container">
    <div class="section__head"><div><p class="eyebrow">Выгодно</p><h2>Акции</h2></div><a class="link" href="{{B}}akcii/">Все акции</a></div>
    <!--@block:promos:3-->
  </div>
</section>

<section class="section dark">
  <!--@decor-->
  <div class="container">
    <div class="section__head"><div><p class="eyebrow">Портфолио</p><h2>Работы мастеров</h2></div><a class="link" href="{{B}}galereya/">Вся галерея</a></div>
    <!--@block:works-4-->
  </div>
</section>

<section class="section sheet" style="padding-top:clamp(112px,12vw,190px)">
  <!--@decor:soft-->
  <div class="container">
    <div class="section__head"><div><p class="eyebrow">Команда</p><h2>Мастера</h2></div><a class="link" href="{{B}}mastera/">Все мастера</a></div>
    <!--@block:masters-->
  </div>
</section>

<section class="section dark">
  <!--@decor-->
  <div class="container">
    <div class="section__head"><div><p class="eyebrow">Отзывы</p><h2>Что говорят гости</h2></div><p class="rating"><strong>5,0</strong><span>32 оценки на 2ГИС</span></p></div>
    <div class="sheet-cards"><!--@block:reviews--></div>
  </div>
</section>

<section class="section sheet consult">
  <!--@decor:soft-->
  <div class="container reveal">
    <p class="eyebrow">Консультация в один клик</p>
    <h2>Есть вопросы по стрижке или времени?</h2>
    <p class="lead">Напишите нам в Telegram, MAX или VK. Барбер подскажет онлайн: присылайте фото желаемой стрижки, уточняйте детали визита и стоимость прямо в чате.</p>
    <div class="consult__actions">
      <button class="btn btn--primary" type="button" data-book>Записаться</button>
      <a class="btn btn--navy" href="https://t.me/ciryulbarber" target="_blank" rel="noopener" data-goal="click_social" data-social="tg">Telegram</a>
      <a class="btn btn--navy" href="https://max.ru/u/f9LHodD0cOLYob6qA-fYtjVcopK_as0T0wX5w3yzU975kggC2d3eALhbIdQ" target="_blank" rel="noopener" data-goal="click_social" data-social="max">MAX</a>
      <a class="btn btn--navy" href="https://vk.ru/id1121274447" target="_blank" rel="noopener" data-goal="click_social" data-social="vk">VK</a>
    </div>
  </div>
</section>'''

P['uslugi/index.html'] = inner('Услуги и цены', 'Цены окончательные. Первая стрижка для новых клиентов — со скидкой 20%.',
                               '<div class="price-wrap"><!--@block:price-full--></div>')

for slug in ['muzhskaya-strizhka', 'strizhka-boroda', 'oformlenie-borody', 'opasnoe-britie']:
    P[f'{slug}/index.html'] = f'<!--@service:{slug}-->'

P['akcii/index.html'] = inner('Акции', 'Скидки не суммируются. Выберите акцию — она подставится в запись.', '<!--@block:promos-->')

P['mastera/index.html'] = inner('Мастера', 'Выберите мастера — или запишитесь к любому свободному, так больше вариантов по времени.', '<!--@block:masters-->')

P['o-nas/index.html'] = '''<section class="page-hero"><!--@decor--><div class="container">
  <!--@crumbs-->
  <div class="intro">
    <div>
      <h1>О барбершопе</h1>
      <p class="lead">ЦИРЮЛ открылся в 2026 году на Гагарина, 42. Делаем мужские стрижки и бороду так, чтобы форма держалась и без укладочных средств.</p>
      <p>Зал на три кресла: синие стены с панелями, линейный свет без теней, чёрные кожаные кресла. Никто ничего не навязывает — можно поговорить с мастером, а можно помолчать.</p>
      <p>Работаем на косметике Constant Delight, даём гарантию на стрижку и угощаем кофе. Можно прийти с собакой.</p>
      <button class="btn btn--primary btn--pill" type="button" data-book>Записаться</button>
    </div>
    <div class="intro__media"><!--@img interior-chair-tufted {"alt":"Стёганое кресло барбера у синей стены","sizes":"(min-width: 900px) 45vw, 100vw","eager":true}--></div>
  </div>
</div></section>
<section class="sheet page-body"><div class="container">
  <h2>Интерьер</h2>
  <ul class="works">
    <li class="reveal"><!--@img interior-reception {"alt":"Стойка администратора с панелями","sizes":"(min-width: 900px) 25vw, 50vw"}--></li>
    <li class="reveal"><!--@img interior-lights {"alt":"Зал с линейными светильниками","sizes":"(min-width: 900px) 25vw, 50vw"}--></li>
    <li class="reveal"><!--@img care-shampoo {"alt":"Шампуни Constant Delight на полке","sizes":"(min-width: 900px) 25vw, 50vw"}--></li>
    <li class="reveal"><!--@img facade-entrance {"alt":"Вход со светящейся вывеской","sizes":"(min-width: 900px) 25vw, 50vw"}--></li>
  </ul>
</div></section>'''

P['galereya/index.html'] = inner('Галерея', 'Работы мастеров и зал. Нажмите на фото, чтобы открыть крупно.', '<!--@block:gallery-->')

P['sertifikat/index.html'] = '''<section class="page-hero"><!--@decor--><div class="container">
  <!--@crumbs-->
  <div class="split">
    <div>
      <h1>Подарочный сертификат</h1>
      <p class="lead">Сертификат на сумму или на конкретную услугу. Действует 6 месяцев.</p>
    </div>
    <div class="cert" aria-label="Макет сертификата">
      <img src="/img/logo-mark-240.webp" width="157" height="240" alt="" loading="lazy">
      <div>
        <p class="cert__title">ЦИРЮЛ</p>
        <p class="muted">Подарочный сертификат · Самара, ул. Гагарина, 42</p>
        <p class="cert__value" data-cert-value>3 000 ₽</p>
        <small>Действует 6 месяцев с даты покупки</small>
      </div>
    </div>
  </div>
</div></section>
<section class="sheet page-body"><div class="container">
  <div class="split">
    <div>
      <h2>Как это работает</h2>
      <ol class="steps">
        <li>Выберите номинал и оставьте заявку</li>
        <li>Администратор перезвонит и уточнит детали</li>
        <li>Заберите сертификат в барбершопе или получите электронный</li>
        <li>Получатель записывается на удобное время</li>
      </ol>
    </div>
    <form class="form form-card" data-fake="certificates" data-goal="certificate_request" data-ok-title="Заявка отправлена" data-ok-text="Администратор позвонит, чтобы оформить сертификат. Это демо: данные никуда не отправлены." novalidate>
      <h2>Заявка</h2>
      <fieldset class="field" style="border:0;padding:0;margin:0">
        <legend>Номинал</legend>
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
</div></section>'''

P['blog/index.html'] = inner('Блог', 'Коротко о стрижках, бороде и уходе.', '<!--@block:blog-cards-->')

for slug in ['kak-vybrat-strizhku-pod-formu-lica', 'uhod-za-borodoy-mezhdu-vizitami', 'kak-chasto-strichsya']:
    P[f'blog/{slug}/index.html'] = f'<!--@article:{slug}-->'

P['vakansii/index.html'] = inner('Вакансии', 'Ищем людей, которым важна аккуратность.', '''<div class="split">
  <div class="cards">
    <article class="vacancy">
      <h2>Барбер</h2>
      <p class="muted">Опыт от 1 года · сменный график · процент + оклад</p>
      <ul><li>Уверенные фейды и стрижки ножницами</li><li>Работа с бородой и опасной бритвой</li><li>Портфолио работ</li></ul>
    </article>
    <article class="vacancy">
      <h2>Администратор</h2>
      <p class="muted">2/2 · 09:00–21:00 · оклад</p>
      <ul><li>Запись клиентов и звонки</li><li>Касса и порядок в зале</li><li>Вежливость без навязчивости</li></ul>
    </article>
  </div>
  <form class="form form-card" data-fake="vacancies" data-goal="vacancy_request" data-ok-title="Отклик отправлен" data-ok-text="Мы свяжемся с вами в течение двух рабочих дней. Это демо: данные никуда не отправлены." novalidate>
    <h2>Откликнуться</h2>
    <div class="field"><label for="v-pos">Вакансия</label><select id="v-pos" name="position" required><option value="Барбер">Барбер</option><option value="Администратор">Администратор</option></select></div>
    <div class="field"><label for="v-name">Имя</label><input id="v-name" name="name" required autocomplete="name"></div>
    <div class="field"><label for="v-phone">Телефон</label><input id="v-phone" name="phone" type="tel" inputmode="tel" required autocomplete="tel" placeholder="+7 (___) ___-__-__"></div>
    <div class="field"><label for="v-about">Опыт и ссылка на портфолио</label><textarea id="v-about" name="about"></textarea></div>
    <!--@block:consent:v-consent-->
    <p class="form-err" role="alert"></p>
    <button class="btn btn--primary btn--large" type="submit">Отправить отклик</button>
  </form>
</div>''')

P['kontakty/index.html'] = inner('Контакты', 'Самара, ул. Гагарина, 42 · ежедневно 09:00–21:00', '''<div class="split">
  <div>
    <!--@block:contacts-->
    <p style="margin-top:28px"><button class="btn btn--primary btn--large" type="button" data-book>Записаться онлайн</button></p>
  </div>
  <div class="map map--embed">
    <div>
      <iframe src="https://yandex.ru/map-widget/v1/?ll=50.179068%2C53.200615&amp;z=16&amp;pt=50.179068%2C53.200615%2Cpm2dbm" title="Барбершоп ЦИРЮЛ на карте: Самара, ул. Гагарина, 42" loading="lazy" allowfullscreen></iframe>
    </div>
  </div>
</div>''')

P['politika/index.html'] = inner('Политика конфиденциальности', 'Как мы обрабатываем персональные данные посетителей сайта.', '''<div class="prose">
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
  <p>Сайт может использовать cookie и сервисы веб-аналитики. Их можно отключить в настройках браузера.</p>
  <h2>7. Права субъекта</h2>
  <p>Вы вправе получить сведения об обработке своих данных, потребовать их уточнения, блокирования или удаления.</p>
</div>''')

P['404.html'] = '''<section class="page-hero notfound"><!--@decor--><div class="container">
  <p class="notfound__code" aria-hidden="true">404</p>
  <h1>Такой страницы нет</h1>
  <p class="lead">Возможно, ссылка устарела. Вернитесь на главную или сразу запишитесь.</p>
  <div class="center-actions">
    <a class="btn btn--ghost btn--pill btn--large" href="{{B}}">На главную</a>
    <button class="btn btn--primary btn--pill btn--large" type="button" data-book>Записаться</button>
  </div>
</div></section>'''

for path, main in P.items():
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8', newline='\n') as f:
        f.write(page(main))
print(len(P), 'pages')
