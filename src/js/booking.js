import { priceList, masters, serviceById } from '../data/site.js';
import { trackGoal } from './analytics.js';

const KEY = 'cirul_bookings';
const STEP_GOALS = ['booking_step_service', 'booking_step_master', null, 'booking_step_time'];
const rub = (n) => n.toLocaleString('ru-RU') + ' ₽';
const pad = (n) => String(n).padStart(2, '0');
const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fmtDate = (iso) => new Date(iso + 'T12:00').toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });

const loadBookings = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const saveBooking = (b) => { try { localStorage.setItem(KEY, JSON.stringify([...loadBookings(), b])); } catch { /* приватный режим */ } };

function hash(str) { let h = 2166136261; for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }

function slotsFor(date, master) {
  const res = [];
  const now = new Date();
  const taken = loadBookings().filter((b) => b.date === date && (master === 'any' || b.master === master || b.master === 'any')).map((b) => b.time);
  for (let m = 9 * 60; m <= 20 * 60; m += 30) {
    const t = `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
    const past = date === isoDate(now) && m <= now.getHours() * 60 + now.getMinutes() + 30;
    const busy = master === 'any' ? hash(date + t) % 7 === 0 : hash(date + t + master) % 3 === 0;
    res.push({ t, free: !past && !busy && !taken.includes(t) });
  }
  return res;
}

export function formatPhone(v) {
  let d = v.replace(/\D/g, '');
  if (d.startsWith('8')) d = '7' + d.slice(1);
  if (d && !d.startsWith('7')) d = '7' + d;
  d = d.slice(0, 11);
  const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)];
  let out = d ? '+7' : '';
  if (p[0]) out += ` (${p[0]}`;
  if (p[0].length === 3) out += ')';
  if (p[1]) out += ` ${p[1]}`;
  if (p[2]) out += `-${p[2]}`;
  if (p[3]) out += `-${p[3]}`;
  return out;
}
export const phoneValid = (v) => /^7\d{10}$/.test(v.replace(/\D/g, '').replace(/^8/, '7'));

export function initBooking() {
  const dlg = document.querySelector('[data-booking]');
  if (!dlg) return;
  const body = dlg.querySelector('[data-booking-body]');
  const summary = dlg.querySelector('[data-booking-summary]');
  const btnNext = dlg.querySelector('[data-booking-next]');
  const btnBack = dlg.querySelector('[data-booking-back]');
  const labels = [...dlg.querySelectorAll('[data-step-label]')];
  const masterName = (id) => (id === 'any' ? 'Любой мастер' : masters.find((m) => m.id === id)?.name);
  let st;
  let step;

  const reset = () => { st = { service: null, master: null, date: null, time: null, name: '', phone: '', consent: false, promo: '' }; step = 0; };
  const canNext = () => [st.service, st.master, st.date, st.time, st.name.trim().length > 1 && phoneValid(st.phone) && st.consent][step];

  function renderSummary() {
    const parts = [];
    if (st.service) parts.push(`${serviceById(st.service).name}, ${rub(serviceById(st.service).price)}`);
    if (st.master) parts.push(masterName(st.master));
    if (st.date) parts.push(fmtDate(st.date) + (st.time ? `, ${st.time}` : ''));
    if (st.promo) parts.push(`акция «${st.promo}»`);
    summary.textContent = parts.join(' · ');
  }

  const opt = (v, html, pressed, disabled) => `<button type="button" class="opt" data-v="${v}" aria-pressed="${pressed}" ${disabled ? 'disabled' : ''}>${html}</button>`;

  function render() {
    labels.forEach((l, i) => { l.classList.toggle('is-done', i < step); l.classList.toggle('is-current', i === step); });
    btnBack.hidden = step === 0 || step === 5;
    btnNext.hidden = step === 5;
    btnNext.textContent = step === 4 ? 'Записаться' : 'Далее';
    btnNext.disabled = !canNext();
    renderSummary();

    if (step === 0) {
      body.innerHTML = '<h3>Выберите услугу</h3>' + priceList.map((c) => `<div class="opt-group"><h4>${c.category}</h4><div class="opts">${c.items.map((s) => opt(s.id, `<span>${s.name}</span><small>${rub(s.price)} · ${s.duration} мин</small>`, st.service === s.id)).join('')}</div></div>`).join('');
    } else if (step === 1) {
      body.innerHTML = '<h3>Выберите мастера</h3><div class="opts">'
        + opt('any', '<span>Любой свободный мастер</span><small>больше свободного времени</small>', st.master === 'any')
        + masters.map((m) => opt(m.id, `<span>${m.name}</span><small>${m.role}</small>`, st.master === m.id)).join('') + '</div>';
    } else if (step === 2) {
      const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; });
      body.innerHTML = '<h3>Выберите дату</h3><div class="opts opts--grid">' + days.map((d) => {
        const v = isoDate(d);
        const free = slotsFor(v, st.master).some((s) => s.free);
        return opt(v, `<small>${d.toLocaleDateString('ru-RU', { weekday: 'short' })}</small><span>${d.getDate()} ${d.toLocaleDateString('ru-RU', { month: 'short' })}</span>`, st.date === v, !free);
      }).join('') + '</div>';
    } else if (step === 3) {
      body.innerHTML = `<h3>Свободное время, ${fmtDate(st.date)}</h3><div class="opts opts--grid">`
        + slotsFor(st.date, st.master).map((s) => opt(s.t, `<span>${s.t}</span>`, st.time === s.t, !s.free)).join('') + '</div>';
    } else if (step === 4) {
      body.innerHTML = `<h3>Ваши контакты</h3>
        <div class="form">
          <div class="field"><label for="bk-name">Имя</label><input id="bk-name" autocomplete="given-name" required></div>
          <div class="field"><label for="bk-phone">Телефон</label><input id="bk-phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" required aria-describedby="bk-phone-err"><span class="err" id="bk-phone-err"></span></div>
          <label class="check"><input type="checkbox" id="bk-consent" required><span>Согласен на <a href="${import.meta.env.BASE_URL}politika/" target="_blank">обработку персональных данных</a></span></label>
        </div>`;
      const name = body.querySelector('#bk-name');
      const phone = body.querySelector('#bk-phone');
      const consent = body.querySelector('#bk-consent');
      const err = body.querySelector('#bk-phone-err');
      name.value = st.name;
      phone.value = st.phone;
      consent.checked = st.consent;
      const upd = () => { btnNext.disabled = !canNext(); };
      name.addEventListener('input', () => { st.name = name.value; upd(); });
      phone.addEventListener('input', () => { phone.value = formatPhone(phone.value); st.phone = phone.value; err.textContent = ''; upd(); });
      phone.addEventListener('blur', () => { if (st.phone && !phoneValid(st.phone)) err.textContent = 'Введите номер полностью: +7 и 10 цифр'; });
      consent.addEventListener('change', () => { st.consent = consent.checked; upd(); });
      setTimeout(() => name.focus(), 50);
    } else if (step === 5) {
      const s = serviceById(st.service);
      body.innerHTML = `<div class="booking__done">
        <h3>Вы записаны</h3>
        <p>${s.name} — ${rub(s.price)}<br>${masterName(st.master)}, ${fmtDate(st.date)}, ${st.time}</p>
        <p class="muted">Администратор позвонит на ${st.phone}, чтобы подтвердить визит.<br>Это демо: запись сохранена только в вашем браузере.</p>
        <button type="button" class="btn btn--primary" data-booking-close>Готово</button>
      </div>`;
      summary.textContent = '';
    }
  }

  body.addEventListener('click', (e) => {
    const b = e.target.closest('.opt');
    if (!b || b.disabled) return;
    const field = ['service', 'master', 'date', 'time'][step];
    st[field] = b.dataset.v;
    if (field === 'master') { st.date = null; st.time = null; }
    if (field === 'date') st.time = null;
    render();
    btnNext.focus();
  });

  btnNext.addEventListener('click', () => {
    if (!canNext()) return;
    if (STEP_GOALS[step]) trackGoal(STEP_GOALS[step]);
    if (step === 4) {
      saveBooking({ ...st, createdAt: new Date().toISOString() });
      trackGoal('booking_success', { service: st.service, master: st.master });
    }
    step++;
    render();
    body.scrollTop = 0;
  });
  btnBack.addEventListener('click', () => { step = Math.max(0, step - 1); render(); });
  dlg.addEventListener('click', (e) => { if (e.target.closest('[data-booking-close]') || e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => { document.body.style.overflow = ''; });

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-book]');
    if (!t) return;
    e.preventDefault();
    reset();
    if (t.dataset.bookService && serviceById(t.dataset.bookService)) st.service = t.dataset.bookService;
    if (t.dataset.bookMaster) st.master = t.dataset.bookMaster;
    if (t.dataset.bookPromo) st.promo = t.dataset.bookPromo;
    step = st.service ? (st.master ? 2 : 1) : 0;
    render();
    dlg.showModal();
    document.body.style.overflow = 'hidden';
    trackGoal('open_booking', { service: st.service, master: st.master });
  });
}
