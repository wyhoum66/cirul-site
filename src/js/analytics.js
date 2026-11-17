import { YANDEX_METRIKA_ID, GOOGLE_ANALYTICS_ID } from '../config.js';

// Счётчики пока не подключены. Когда появятся ID — здесь же добавить их загрузку.
export function trackGoal(name, params = {}) {
  if (YANDEX_METRIKA_ID && window.ym) window.ym(YANDEX_METRIKA_ID, 'reachGoal', name, params);
  if (GOOGLE_ANALYTICS_ID && window.gtag) window.gtag('event', name, params);
  console.log('[goal]', name, params);
}
