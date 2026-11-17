# ЦИРЮЛ — сайт-макет барбершопа

Vite (multi-page), vanilla JS, CSS. Деплой: GitHub Actions → GitHub Pages.

```bash
npm install
npm run dev      # http://localhost:5173/cirul-site/
npm run build    # сборка в dist/
npm run check    # проверка ссылок в dist/
```

- Шапка, подвал, мета, JSON-LD и блоки (прайс, мастера, акции…) подставляются при сборке: `src/build/render.js`, данные — `src/data/site.js`, мета страниц — `src/data/pages.js`.
- Страницы — `*/index.html` с маркерами `<!--@header-->`, `<!--@block:...-->` и т.д.
- Фото пересобираются из оригиналов: `npm run images` (нужна папка `src/assets/src-photos`, в репозиторий не входит).

## Домен и счётчики
Всё в `src/config.js`:
- `SITE_URL` — свой домен (для цирюл.рф: `https://xn--e1aanbbr.xn--p1ai`), `BASE` — `'/'` при своём домене; добавить `public/CNAME`.
- `YANDEX_METRIKA_ID`, `GOOGLE_ANALYTICS_ID`, `YANDEX_VERIFICATION`, `GOOGLE_VERIFICATION`.
Цели уже размечены через `trackGoal()` (`src/js/analytics.js`); сейчас они пишутся в консоль.
