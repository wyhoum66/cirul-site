// Единственное место для доменов и счётчиков. Пустая строка = выключено.
export const SITE_URL = ''; // напр. 'https://xn--e1aanbbr.xn--p1ai' (цирюл.рф). Пусто → GitHub Pages
export const GITHUB_PAGES_URL = 'https://wyhoum66.github.io/cirul-site';
export const BASE = '/cirul-site/'; // для своего домена поставить '/'

export const YANDEX_METRIKA_ID = '';
export const GOOGLE_ANALYTICS_ID = ''; // G-XXXXXXXXXX
export const YANDEX_VERIFICATION = '';
export const GOOGLE_VERIFICATION = '';

export const siteOrigin = () => (SITE_URL || GITHUB_PAGES_URL).replace(/\/$/, '');
export const absUrl = (path = '/') => siteOrigin() + path;
