import fs from 'node:fs';
import { pages } from '../data/pages.js';
import * as site from '../data/site.js';
import * as cfg from '../config.js';

const images = JSON.parse(fs.readFileSync(new URL('../data/images.json', import.meta.url), 'utf8'));
const { contacts: C } = site;

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const rub = (n) => `${n.toLocaleString('ru-RU').replace(/ /g, ' ')} ₽`;
const PH = '<span class="ph">[ЗАГЛУШКА]</span>';

export function routeFromFile(file, root) {
  const rel = file.replace(/\\/g, '/').replace(root.replace(/\\/g, '/'), '').replace(/^\//, '');
  if (rel === '404.html') return '/404';
  return '/' + rel.replace(/index\.html$/, '');
}

export function pageMeta(route) {
  if (pages[route]) return pages[route];
  const post = site.blogPosts.find((p) => route === `/blog/${p.slug}/`);
  if (post) return { title: `${post.title} — блог ЦИРЮЛ`, description: post.excerpt, crumb: post.title, parent: '/blog/', article: post };
  throw new Error(`Нет меты для ${route}`);
}

export function img(name, { alt = '', sizes = '100vw', cls = '', eager = false, attrs = '' } = {}) {
  const m = images[name];
  if (!m) throw new Error(`Нет картинки ${name}`);
  const largest = m.sizes[m.sizes.length - 1];
  const srcset = m.sizes.map((w) => `/img/${name}-${w}.webp ${w}w`).join(', ');
  const mid = m.sizes.find((w) => w >= 960) || largest;
  const h = Math.round((m.h / m.w) * largest);
  return `<img src="/img/${name}-${mid}.webp" srcset="${srcset}" sizes="${sizes}" width="${largest}" height="${h}" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${attrs ? ' ' + attrs : ''}>`;
}
const fullSrc = (name) => `{{B}}img/${name}-${images[name].sizes.at(-1)}.webp`;

/* ---------- JSON-LD ---------- */
const shopId = () => cfg.absUrl('/#barbershop');
function barberShopLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BarberShop',
    '@id': shopId(),
    name: 'ЦИРЮЛ',
    description: C.slogan,
    url: cfg.absUrl('/'),
    image: cfg.absUrl('/og-image.jpg'),
    logo: cfg.absUrl('/favicon-512.png'),
    telephone: C.phone.replace(/[\s-]/g, ''),
    email: C.email,
    priceRange: '600–3300 ₽',
    currenciesAccepted: 'RUB',
    paymentAccepted: 'Наличные, банковская карта, QR-код, перевод',
    address: { '@type': 'PostalAddress', streetAddress: 'ул. Гагарина, 42', addressLocality: 'Самара', postalCode: C.postal, addressCountry: 'RU' },
    geo: { '@type': 'GeoCoordinates', latitude: C.geo.lat, longitude: C.geo.lon },
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: C.opens, closes: C.closes,
    }],
    aggregateRating: { '@type': 'AggregateRating', ratingValue: C.rating, ratingCount: C.ratingCount, bestRating: 5 },
    sameAs: C.socials.map((s) => s.url),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Услуги барбершопа',
      itemListElement: site.priceList.map((cat) => ({
        '@type': 'OfferCatalog',
        name: cat.category,
        itemListElement: cat.items.map((i) => ({
          '@type': 'Offer', price: i.price, priceCurrency: 'RUB',
          itemOffered: { '@type': 'Service', name: i.name },
        })),
      })),
    },
  };
}
function breadcrumbLd(route, meta) {
  const chain = [{ name: 'Главная', route: '/' }];
  if (meta.parent) chain.push({ name: pageMeta(meta.parent).crumb, route: meta.parent });
  if (route !== '/') chain.push({ name: meta.crumb, route });
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: chain.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: cfg.absUrl(c.route) })),
  };
}
function serviceLd(sp) {
  const s = site.serviceById(sp.serviceId);
  return {
    '@context': 'https://schema.org', '@type': 'Service',
    name: sp.title, description: sp.lead, serviceType: 'Мужская стрижка и уход',
    url: cfg.absUrl(`/${sp.slug}/`),
    image: cfg.absUrl(`/img/${sp.image}-960.webp`),
    areaServed: { '@type': 'City', name: 'Самара' },
    provider: { '@id': shopId() },
    offers: { '@type': 'Offer', price: s.price, priceCurrency: 'RUB', availability: 'https://schema.org/InStock' },
  };
}
const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`;

/* ---------- head ---------- */
export function head(route) {
  const m = pageMeta(route);
  const url = cfg.absUrl(route === '/404' ? '/404.html' : route);
  const ogImg = cfg.absUrl('/og-image.jpg');
  const schemas = [barberShopLd()];
  if (route !== '/' && route !== '/404') schemas.push(breadcrumbLd(route, m));
  const sp = site.servicePages.find((p) => `/${p.slug}/` === route);
  if (sp) schemas.push(serviceLd(sp));
  if (m.article) schemas.push({
    '@context': 'https://schema.org', '@type': 'Article', headline: m.article.title, datePublished: m.article.date,
    image: cfg.absUrl(`/img/${m.article.image}-960.webp`), author: { '@type': 'Organization', name: 'ЦИРЮЛ' }, publisher: { '@id': shopId() },
  });
  return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(m.title)}</title>
  <meta name="description" content="${esc(m.description)}">
  ${m.noindex ? '<meta name="robots" content="noindex, follow">' : `<link rel="canonical" href="${url}">`}
  <meta name="theme-color" content="#0d2443">
  ${cfg.YANDEX_VERIFICATION ? `<meta name="yandex-verification" content="${cfg.YANDEX_VERIFICATION}">` : ''}
  ${cfg.GOOGLE_VERIFICATION ? `<meta name="google-site-verification" content="${cfg.GOOGLE_VERIFICATION}">` : ''}
  <meta property="og:type" content="${m.article ? 'article' : 'website'}">
  <meta property="og:locale" content="ru_RU">
  <meta property="og:site_name" content="ЦИРЮЛ — барбершоп">
  <meta property="og:title" content="${esc(m.title)}">
  <meta property="og:description" content="${esc(m.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${ogImg}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Барбершоп ЦИРЮЛ: логотип и зал">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(m.title)}">
  <meta name="twitter:description" content="${esc(m.description)}">
  <meta name="twitter:image" content="${ogImg}">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png">
  <link rel="apple-touch-icon" href="/favicon-180.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap">
  <link rel="stylesheet" href="/src/styles/main.css">
  <script type="module" src="/src/js/main.js"></script>
  ${schemas.map(ld).join('\n  ')}`;
}

/* ---------- header / footer ---------- */
export function header(route) {
  const nav = site.navMain.map((n) => {
    const active = route === '/' + n.href || (n.href === 'uslugi/' && pageMeta(route).parent === '/uslugi/');
    return `<li><a href="{{B}}${n.href}"${active ? ' aria-current="page"' : ''}>${n.label}</a></li>`;
  }).join('');
  return `<a class="skip" href="#main">К содержанию</a>
<header class="site-header" data-header>
  <div class="container site-header__row">
    ${brand()}
    <nav class="nav" id="site-nav" aria-label="Основное меню">
      <ul class="nav__list">${nav}</ul>
      <div class="nav__extra">
        <a class="nav__phone" href="${C.phoneHref}" data-goal="click_phone">${C.phone}</a>
        ${iconLinks()}
      </div>
    </nav>
    <div class="header-right">
      ${iconLinks()}
      <button class="btn btn--primary btn--pill header-cta" type="button" data-book>Записаться</button>
      <button class="burger" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Открыть меню" data-burger><span></span><span></span></button>
    </div>
  </div>
</header>`;
}

export function breadcrumbs(route) {
  const m = pageMeta(route);
  const parts = [`<a href="{{B}}">Главная</a>`];
  if (m.parent) parts.push(`<a href="{{B}}${m.parent.slice(1)}">${pageMeta(m.parent).crumb}</a>`);
  parts.push(`<span aria-current="page">${m.crumb}</span>`);
  return `<nav class="crumbs" aria-label="Хлебные крошки">${parts.join('<span class="crumbs__sep" aria-hidden="true">/</span>')}</nav>`;
}

const ICONS = {
  vk: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.8 17.5c-5.6 0-8.9-3.9-9-10.4h2.8c.1 4.8 2.3 6.8 4 7.2V7.1h2.7v4.1c1.6-.2 3.3-2 3.9-4.1h2.6c-.4 2.5-2.3 4.3-3.6 5.1 1.3.6 3.4 2.3 4.2 5.3h-2.9c-.6-2-2.2-3.5-4.2-3.7v3.7h-.5z"/></svg>',
  tg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.4 4.3 2.9 11.5c-1.3.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.4.8.8.8.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.8-1.3-1.5zM8.6 14.2l9.2-5.8c.4-.3.8-.1.5.2l-7.6 6.9-.3 3.2-1.8-4.5z"/></svg>',
  max: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5a9.5 9.5 0 0 0-8.3 14.1L2.6 21l4.6-1.1A9.5 9.5 0 1 0 12 2.5zm4.4 12.9h-1.9v-4.2l-2.5 3.2-2.5-3.2v4.2H7.6V8.6h1.7l2.7 3.6 2.7-3.6h1.7v6.8z"/></svg>',
};
const iconLinks = () => `<ul class="icons">${C.socials.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.label}" data-goal="click_social" data-social="${s.id}">${ICONS[s.id]}</a></li>`).join('')}</ul>`;
const brand = () => `<a class="brand" href="{{B}}" aria-label="ЦИРЮЛ — на главную"><img src="/img/logo-mark-96.webp" width="63" height="96" alt=""><span>ЦИРЮЛ</span></a>`;
export const decor = (variant = 'full') => `<div class="decor" aria-hidden="true"><span class="blob blob--a"></span><span class="blob blob--b"></span>${variant === 'full' ? '<span class="beam beam--1"></span><span class="beam beam--2"></span><span class="frame frame--1"></span><span class="frame frame--2"></span>' : ''}<span class="grain"></span></div>`;

const socialLinks = (cls = 'socials') => `<ul class="${cls}">${C.socials.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener" data-goal="click_social" data-social="${s.id}">${s.label}</a></li>`).join('')}</ul>`;

export function footer() {
  const cols = site.navFooter.map((col) => `<ul>${col.map((n) => `<li><a href="{{B}}${n.href}">${n.label}</a></li>`).join('')}</ul>`).join('');
  return `<footer class="site-footer">
  ${decor('soft')}
  <div class="container site-footer__grid">
    <div class="site-footer__brand">
      ${brand()}
      <p>${C.slogan}</p>
    </div>
    <nav class="site-footer__nav" aria-label="Разделы сайта">${cols}</nav>
    <div class="site-footer__contacts">
      <a class="site-footer__phone" href="${C.phoneHref}" data-goal="click_phone">${C.phone}</a>
      <p>${C.addressFull}<br>${C.metro}</p>
      <p>${C.hoursText}</p>
      ${iconLinks()}
    </div>
  </div>
  <div class="container site-footer__legal">
    <p>© ${new Date().getFullYear()} ЦИРЮЛ. ${C.legal}</p>
    <p>Демо-версия сайта. Запись и формы не отправляют данные.</p>
  </div>
</footer>
<div class="mobile-cta"><button class="btn btn--primary btn--pill" type="button" data-book>Записаться онлайн</button></div>
${bookingModal()}

${lightbox()}`;
}

/* ---------- booking modal ---------- */
function bookingModal() {
  const steps = ['Услуга', 'Мастер', 'Дата', 'Время', 'Контакты'];
  return `<dialog class="booking" data-booking aria-labelledby="booking-title">
  <form class="booking__inner" method="dialog" novalidate data-booking-form>
    <div class="booking__head">
      <h2 class="booking__title" id="booking-title">Запись онлайн</h2>
      <button class="booking__close" type="button" data-booking-close aria-label="Закрыть">×</button>
    </div>
    <ol class="booking__steps" aria-label="Шаги записи">${steps.map((s, i) => `<li data-step-label="${i}">${s}</li>`).join('')}</ol>
    <div class="booking__body" data-booking-body aria-live="polite"></div>
    <div class="booking__summary" data-booking-summary></div>
    <div class="booking__foot">
      <button class="btn btn--ghost" type="button" data-booking-back>Назад</button>
      <button class="btn btn--primary" type="button" data-booking-next>Далее</button>
    </div>
  </form>
</dialog>`;
}

function cookieBanner() {
  return `<div class="cookie" data-cookie hidden role="region" aria-label="Согласие на cookie">
  <p>Мы используем cookie и сервисы аналитики, чтобы понимать, как улучшить сайт. Подробнее — в <a href="{{B}}politika/">политике конфиденциальности</a>.</p>
  <div class="cookie__actions">
    <button class="btn btn--primary" type="button" data-cookie-accept>Принять</button>
    <button class="btn btn--ghost" type="button" data-cookie-decline>Только необходимые</button>
  </div>
</div>`;
}

function lightbox() {
  return `<dialog class="lightbox" data-lightbox aria-label="Просмотр фото">
  <button class="lightbox__close" type="button" data-lightbox-close aria-label="Закрыть">×</button>
  <button class="lightbox__nav lightbox__nav--prev" type="button" data-lightbox-prev aria-label="Предыдущее фото">‹</button>
  <figure><img data-lightbox-img alt=""><figcaption data-lightbox-cap></figcaption></figure>
  <button class="lightbox__nav lightbox__nav--next" type="button" data-lightbox-next aria-label="Следующее фото">›</button>
</dialog>`;
}

/* ---------- blocks ---------- */
const consent = (id) => `<label class="check"><input type="checkbox" name="consent" required id="${id}"><span>Согласен на <a href="{{B}}politika/" target="_blank">обработку персональных данных</a></span></label>`;

const blocks = {
  'price-full': () => site.priceList.map((cat) => `
    <section class="price-cat reveal">
      <h2>${cat.category}</h2>
      <ul class="price">
        ${cat.items.map((i) => {
          const sp = site.servicePages.find((p) => p.serviceId === i.id);
          const name = sp ? `<a href="{{B}}${sp.slug}/">${i.name}</a>` : i.name;
          return `<li class="price__row">
          <span class="price__name">${name}${i.note ? `<small>${i.note}</small>` : ''}</span>
          <span class="price__dur">${i.duration} мин ${PH}</span>
          <span class="price__val">${rub(i.price)}</span>
          <button class="btn btn--small" type="button" data-book data-book-service="${i.id}" aria-label="Записаться: ${esc(i.name)}">Записаться</button>
        </li>`;
        }).join('')}
      </ul>
    </section>`).join(''),

  'service-cards': () => `<ul class="cards cards--services">${site.servicePages.map((sp) => {
    const s = site.serviceById(sp.serviceId);
    return `<li class="svc reveal">
      <a class="svc__media" href="{{B}}${sp.slug}/" tabindex="-1" aria-hidden="true">${img(sp.image, { alt: '', sizes: '(min-width: 1200px) 25vw, (min-width: 700px) 50vw, 100vw' })}</a>
      <div class="svc__body">
        <h3><a href="{{B}}${sp.slug}/">${sp.title}</a></h3>
        <p class="svc__meta"><span>${sp.slug === 'oformlenie-borody' ? 'от ' : ''}${rub(s.price)}</span><span>${s.duration} мин</span></p>
        <button class="btn btn--ghost btn--small" type="button" data-book data-book-service="${s.id}">Записаться</button>
      </div>
    </li>`;
  }).join('')}</ul>`,

  promos: (limit) => {
    const list = limit ? site.promos.slice(0, Number(limit)) : site.promos;
    return `<ul class="cards cards--promos">${list.map((p) => `<li class="promo reveal" id="${p.id}">
      <h3>${p.title}</h3>
      <p>${p.text}</p>
      <p class="promo__terms">${p.terms.replace('[ЗАГЛУШКА]', PH)}</p>
      ${p.link ? `<a class="btn btn--ghost btn--small" href="{{B}}${p.link}">Выбрать сертификат</a>` : `<button class="btn btn--primary btn--small" type="button" data-book data-book-service="${p.service}" data-book-promo="${esc(p.title)}">Записаться по акции</button>`}
    </li>`).join('')}</ul>`;
  },

  masters: () => `<ul class="cards cards--masters">${site.masters.map((m) => `<li class="master reveal">
      <div class="master__photo">${m.photo ? img(m.photo, { alt: m.photoAlt, sizes: '(min-width: 1000px) 30vw, 90vw' }) : `<div class="master__ph"><img src="/img/logo-mark-240.webp" width="157" height="240" alt="" loading="lazy"><span>Фото мастера ${PH}</span></div>`}</div>
      <h3>${m.name}${m.placeholderName ? ` <span class="ph">[проверить имя]</span>` : ''}</h3>
      <p class="master__spec">${m.spec} ${PH}</p>
      <button class="btn btn--ghost btn--small" type="button" data-book data-book-master="${m.id}">Записаться к мастеру</button>
    </li>`).join('')}</ul>`,

  reviews: () => `<ul class="cards cards--reviews">${site.reviews.map((r) => `<li class="review reveal">
      <blockquote><p>${r.text}</p></blockquote>
      <p class="review__by">${r.author}<span>${r.date}, 2ГИС</span></p>
    </li>`).join('')}</ul>`,

  'works-4': () => `<ul class="works">${['work-textured-crop', 'work-beard-fade', 'process-fade', 'work-textured-front'].map((n) => `<li class="reveal">${img(n, { alt: altFor(n), sizes: '(min-width: 900px) 25vw, 50vw' })}</li>`).join('')}</ul>`,

  gallery: () => {
    const groups = [
      ['Работы', ['work-textured-crop', 'work-beard-fade', 'work-textured-crop-2', 'work-beard-fade-2', 'work-textured-front', 'process-fade', 'process-scissors', 'process-beard-clipper', 'process-beard-line', 'process-beard-trim', 'process-wash']],
      ['Интерьер', ['interior-hall', 'interior-hall-wide', 'interior-lights', 'interior-chair-tufted', 'interior-chairs', 'interior-chairs-2', 'interior-reception', 'interior-reception-2', 'facade-evening', 'facade-entrance', 'facade-front']],
      ['Инструменты и косметика', ['tools-clippers', 'tools-station', 'care-oils', 'care-shampoo', 'care-wax', 'care-shelf']],
    ];
    return groups.map(([title, list]) => `<section class="gallery-group">
      <h2>${title}</h2>
      <ul class="gallery" data-gallery>${list.map((n) => `<li><button type="button" class="gallery__item" data-full="${fullSrc(n)}" data-caption="${esc(altFor(n))}" aria-label="Открыть фото: ${esc(altFor(n))}">${img(n, { alt: altFor(n), sizes: '(min-width: 1400px) 20vw, (min-width: 800px) 33vw, 50vw' })}</button></li>`).join('')}</ul>
    </section>`).join('');
  },

  contacts: () => `<dl class="facts">
      <div><dt>Адрес</dt><dd>${C.addressFull}<br><span class="muted">${C.metro}</span></dd></div>
      <div><dt>Телефон</dt><dd><a href="${C.phoneHref}" data-goal="click_phone">${C.phone}</a></dd></div>
      <div><dt>Часы работы</dt><dd>${C.hoursText}</dd></div>
      <div><dt>Почта</dt><dd><a href="mailto:${C.email}">${C.email}</a></dd></div>
      <div><dt>Соцсети</dt><dd>${socialLinks('socials socials--inline')}</dd></div>
    </dl>`,

  'blog-cards': () => `<ul class="cards cards--blog">${site.blogPosts.map((p) => `<li class="post reveal">
      <a href="{{B}}blog/${p.slug}/" class="post__media" tabindex="-1" aria-hidden="true">${img(p.image, { alt: '', sizes: '(min-width: 900px) 33vw, 100vw' })}</a>
      <p class="post__date"><time datetime="${p.date}">${new Date(p.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</time></p>
      <h2><a href="{{B}}blog/${p.slug}/">${p.title}</a></h2>
      <p>${p.excerpt} ${PH}</p>
    </li>`).join('')}</ul>`,

  consent: (id) => consent(id || 'consent'),
};

const ALTS = {
  'work-textured-crop': 'Текстурная стрижка с переходом на висках',
  'work-textured-crop-2': 'Текстурный кроп, вид в профиль',
  'work-textured-front': 'Текстурная стрижка, вид анфас',
  'work-beard-fade': 'Короткая стрижка с фейдом и оформленная борода',
  'work-beard-fade-2': 'Фейд и борода, вид в профиль',
  'process-beard-trim': 'Барбер оформляет бороду триммером',
  'process-beard-clipper': 'Моделирование бороды в кресле',
  'process-wash': 'Мытьё головы перед стрижкой',
  'process-beard-line': 'Контур бороды машинкой',
  'process-fade': 'Барбер делает фейд машинкой',
  'process-scissors': 'Стрижка ножницами по расчёске',
  'tools-clippers': 'Машинки и насадки на рабочем столе',
  'tools-station': 'Рабочее место барбера с мойкой',
  'care-shampoo': 'Шампуни Constant Delight на полке',
  'care-wax': 'Воск для укладки',
  'care-shelf': 'Средства для бороды и бритья',
  'care-oils': 'Масло для бороды, лосьон и гель для бритья',
  'interior-lights': 'Зал с линейными светильниками',
  'interior-hall': 'Три кресла у зеркал и синие стены',
  'interior-hall-wide': 'Общий вид зала барбершопа',
  'interior-reception': 'Стойка администратора с панелями',
  'interior-reception-2': 'Ресепшен и зал',
  'interior-chairs': 'Чёрные кожаные кресла',
  'interior-chairs-2': 'Кресла у синей стены с молдингами',
  'interior-chair-tufted': 'Стёганое кресло барбера',
  'facade-day': 'Вход в барбершоп днём',
  'facade-front': 'Фасад на ул. Гагарина, 42',
  'facade-evening': 'Вывеска ЦИРЮЛ вечером',
  'facade-entrance': 'Вход со светящейся вывеской',
};
export const altFor = (n) => ALTS[n] || '';

/* ---------- шаблоны страниц ---------- */
export function servicePage(slug) {
  const sp = site.servicePages.find((p) => p.slug === slug);
  const s = site.serviceById(sp.serviceId);
  const related = site.priceList.flatMap((c) => c.items).filter((i) =>
    (slug === 'oformlenie-borody' && i.id === 'beard-premium') || (slug === 'strizhka-boroda' && i.id === 'combo-premium') || (slug === 'muzhskaya-strizhka' && ['first-haircut', 'kids'].includes(i.id)));
  return `<section class="page-hero">${decor()}<div class="container">
    ${breadcrumbs(`/${slug}/`)}
    <div class="service">
      <div class="service__text">
        <h1>${sp.title}</h1>
        <p class="lead">${sp.lead} ${PH}</p>
        <dl class="service__facts">
          <div><dt>Цена</dt><dd>${rub(s.price)}</dd></div>
          <div><dt>Время</dt><dd>${s.duration} мин ${PH}</dd></div>
        </dl>
        <button class="btn btn--primary btn--large" type="button" data-book data-book-service="${s.id}">Записаться на «${sp.title}»</button>
        ${related.length ? `<ul class="service__related">${related.map((r) => `<li><span>${r.name}</span><span>${rub(r.price)}</span></li>`).join('')}</ul>` : ''}
      </div>
      <figure class="service__media">${img(sp.image, { alt: sp.imageAlt, sizes: '(min-width: 1000px) 45vw, 100vw', eager: true })}</figure>
    </div>
  </div></section>
  <section class="section sheet"><div class="container">
    <div class="split">
      <div>
        <h2>Что входит</h2>
        <ol class="steps">${sp.includes.map((i) => `<li>${i}</li>`).join('')}</ol>
      </div>
      <ul class="duo">${sp.gallery.map((g) => `<li class="reveal">${img(g, { alt: altFor(g), sizes: '(min-width: 1000px) 25vw, 50vw' })}</li>`).join('')}</ul>
    </div>
  </div></section>
  <section class="section dark">${decor()}<div class="container"><h2>Другие услуги</h2>${blocks['service-cards']()}</div></section>`;
}

export function articlePage(slug) {
  const p = site.blogPosts.find((x) => x.slug === slug);
  return `<section class="page-hero">${decor()}<div class="container">
    ${breadcrumbs(`/blog/${slug}/`)}
    <header class="article__head">
      <p class="post__date"><time datetime="${p.date}">${new Date(p.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</time></p>
      <h1>${p.title}</h1>
      <p class="lead">${p.excerpt}</p>
    </header>
  </div></section>
  <section class="sheet page-body"><article class="article container">
    <figure class="article__media">${img(p.image, { alt: altFor(p.image), sizes: '(min-width: 900px) 760px, 100vw', eager: true })}</figure>
    <div class="prose">
      <p>${PH} Здесь будет текст статьи. Шаблон поддерживает подзаголовки, списки и цитаты.</p>
      <h2>Подзаголовок раздела</h2>
      <p>${PH} Абзац текста статьи длиной 3–5 предложений. Пишите коротко и по делу: один абзац — одна мысль.</p>
      <ul><li>Пункт списка</li><li>Ещё один пункт</li><li>Третий пункт</li></ul>
      <blockquote><p>${PH} Совет барбера или цитата клиента.</p></blockquote>
      <h2>Ещё один раздел</h2>
      <p>${PH} Заключение и приглашение записаться.</p>
    </div>
    <aside class="cta-inline">
      <p>Хотите подобрать форму вместе с мастером?</p>
      <button class="btn btn--primary" type="button" data-book>Записаться</button>
    </aside>
    <p><a class="link" href="{{B}}blog/">Все статьи</a></p>
  </article></section>`;
}

/* ---------- рендер ---------- */
export function render(html, route, base) {
  let out = html
    .replace('<!--@head-->', () => head(route))
    .replace('<!--@header-->', () => header(route))
    .replace('<!--@footer-->', () => footer())
    .replace('<!--@crumbs-->', () => breadcrumbs(route))
    .replace(/<!--@decor(?::(\w+))?-->/g, (_, v) => decor(v))
    .replace('<body>', route === '/' ? '<body class="home">' : '<body>')
    .replace(/<!--@service:([\w-]+)-->/g, (_, s) => servicePage(s))
    .replace(/<!--@article:([\w-]+)-->/g, (_, s) => articlePage(s))
    .replace(/<!--@block:([\w-]+)(?::([\w-]+))?-->/g, (_, b, arg) => {
      if (!blocks[b]) throw new Error(`Нет блока ${b}`);
      return blocks[b](arg);
    })
    .replace(/<!--@img\s+([\w-]+)\s*(\{.*?\})?\s*-->/g, (_, n, opts) => img(n, opts ? JSON.parse(opts) : {}))
    .replace(/<!--@ph-->/g, PH)
    .replace(/<!--@(phone|phoneHref|email|addressFull|metro|hoursText|slogan)-->/g, (_, k) => C[k]);
  return out.replace(/\{\{B\}\}/g, base);
}
