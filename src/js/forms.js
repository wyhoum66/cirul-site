import { trackGoal } from './analytics.js';
import { formatPhone, phoneValid } from './booking.js';

// Демо-формы: валидация, сохранение в localStorage, экран «отправлено»
export function initForms() {
  document.querySelectorAll('form[data-fake]').forEach((form) => {
    form.querySelectorAll('input[type="tel"]').forEach((i) => i.addEventListener('input', () => { i.value = formatPhone(i.value); }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const err = form.querySelector('.form-err');
      const tel = form.querySelector('input[type="tel"]');
      let msg = '';
      if (!form.checkValidity()) msg = 'Заполните обязательные поля и отметьте согласие на обработку данных.';
      else if (tel && !phoneValid(tel.value)) msg = 'Введите телефон полностью: +7 и 10 цифр.';
      if (msg) { err.textContent = msg; form.reportValidity(); return; }
      try {
        const key = `cirul_${form.dataset.fake}`;
        const prev = JSON.parse(localStorage.getItem(key)) || [];
        localStorage.setItem(key, JSON.stringify([...prev, { ...Object.fromEntries(new FormData(form)), at: new Date().toISOString() }]));
      } catch { /* приватный режим */ }
      trackGoal(form.dataset.goal);
      const ok = document.createElement('div');
      ok.className = 'form-ok panel';
      ok.setAttribute('role', 'status');
      ok.innerHTML = `<h3>${form.dataset.okTitle}</h3><p>${form.dataset.okText}</p>`;
      form.replaceWith(ok);
    });
  });
}

const certValue = document.querySelector('[data-cert-value]');
document.querySelectorAll('input[name="value"]').forEach((r) => r.addEventListener('change', () => {
  if (certValue) certValue.textContent = Number(r.value).toLocaleString('ru-RU') + ' ₽';
}));
