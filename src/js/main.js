import { trackGoal } from './analytics.js';
import { initBooking } from './booking.js';
import { initForms } from './forms.js';

document.documentElement.classList.add('js');

// Меню
const burger = document.querySelector('[data-burger]');
const nav = document.getElementById('site-nav');
burger?.addEventListener('click', () => {
  const open = burger.getAttribute('aria-expanded') !== 'true';
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  nav.classList.toggle('is-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Цели по кликам
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-goal]');
  if (el) trackGoal(el.dataset.goal, el.dataset.social ? { network: el.dataset.social } : {});
});

// Появление блоков
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  reveals.forEach((r) => io.observe(r));
} else reveals.forEach((r) => r.classList.add('is-in'));

// Лайтбокс
const lb = document.querySelector('[data-lightbox]');
const items = [...document.querySelectorAll('[data-full]')];
if (lb && items.length) {
  const imgEl = lb.querySelector('[data-lightbox-img]');
  const cap = lb.querySelector('[data-lightbox-cap]');
  let idx = 0;
  const show = (i) => {
    idx = (i + items.length) % items.length;
    imgEl.src = items[idx].dataset.full;
    imgEl.alt = items[idx].dataset.caption || '';
    cap.textContent = items[idx].dataset.caption || '';
  };
  items.forEach((it, i) => it.addEventListener('click', () => { show(i); lb.showModal(); }));
  lb.querySelector('[data-lightbox-close]').addEventListener('click', () => lb.close());
  lb.querySelector('[data-lightbox-prev]').addEventListener('click', () => show(idx - 1));
  lb.querySelector('[data-lightbox-next]').addEventListener('click', () => show(idx + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
}

initBooking();
initForms();
