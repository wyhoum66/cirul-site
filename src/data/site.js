export const contacts = {
  name: 'ЦИРЮЛ',
  slogan: 'Премиальный барбершоп с точной мужской подачей',
  city: 'Самара',
  street: 'ул. Гагарина, 42',
  district: 'Октябрьский район',
  postal: '443079',
  addressFull: 'Самара, ул. Гагарина, 42',
  metro: 'м. Гагаринская — 2 минуты пешком',
  geo: { lat: 53.200615, lon: 50.179068 },
  hoursText: 'Ежедневно 09:00–21:00',
  opens: '09:00',
  closes: '21:00',
  phone: '+7 920 075-33-09',
  phoneHref: 'tel:+79200753309',
  email: 'ciryul@yandex.ru',
  socials: [
    { id: 'vk', label: 'ВКонтакте', url: 'https://vk.ru/id1121274447' },
    { id: 'tg', label: 'Telegram', url: 'https://t.me/ciryulbarber' },
    { id: 'max', label: 'MAX', url: 'https://max.ru/u/f9LHodD0cOLYob6qA-fYtjVcopK_as0T0wX5w3yzU975kggC2d3eALhbIdQ' },
  ],
  mapUrl: 'https://yandex.ru/maps/?pt=50.179068,53.200615&z=17&l=map',
  rating: 5,
  ratingCount: 32,
  legal: 'ИП Лисина Анна Олеговна, ИНН 526113057630',
};

// Все позиции прайса. id используется в записи.
export const priceList = [
  {
    category: 'Стрижки',
    items: [
      { id: 'haircut', name: 'Мужская стрижка', price: 1700, duration: 60 },
      { id: 'first-haircut', name: 'Первая стрижка', price: 1400, duration: 60, note: '−20% для новых клиентов' },
      { id: 'kids', name: 'Детская стрижка (до 12 лет)', price: 1400, duration: 45 },
      { id: 'wash', name: 'Мытьё головы + укладка', price: 600, duration: 20 },
    ],
  },
  {
    category: 'Борода и бритьё',
    items: [
      { id: 'beard', name: 'Моделирование бороды', price: 1200, duration: 40 },
      { id: 'beard-premium', name: 'Премиум моделирование бороды', price: 1800, duration: 60 },
      { id: 'shave', name: 'Опасное бритьё', price: 1700, duration: 45 },
    ],
  },
  {
    category: 'Комплексы',
    items: [
      { id: 'combo', name: 'Стрижка + борода', price: 2700, duration: 90 },
      { id: 'combo-premium', name: 'Стрижка + премиум моделирование бороды', price: 3300, duration: 105 },
      { id: 'father-son', name: 'Папа + сын', price: 2900, duration: 105 },
    ],
  },
];
export const allServices = priceList.flatMap((c) => c.items);
export const serviceById = (id) => allServices.find((s) => s.id === id);

// Страницы услуг: один шаблон, данные отсюда
export const servicePages = [
  {
    slug: 'muzhskaya-strizhka',
    serviceId: 'haircut',
    title: 'Мужская стрижка',
    lead: 'Форма под тип лица и рост волос, чистые переходы и укладка, которая держится без долгих сборов утром.',
    includes: ['Разговор о форме и образе жизни', 'Мытьё головы', 'Стрижка машинкой и ножницами', 'Окантовка и укладка', 'Совет по уходу и средствам'],
    image: 'work-textured-crop',
    imageAlt: 'Текстурная мужская стрижка с плавным переходом',
    gallery: ['work-textured-front', 'process-scissors'],
  },
  {
    slug: 'strizhka-boroda',
    serviceId: 'combo',
    title: 'Стрижка + борода',
    lead: 'Стрижка и борода за один визит в одной линии: мастер связывает переход на висках с контуром бороды.',
    includes: ['Мужская стрижка', 'Моделирование формы бороды', 'Чёткий контур опасной бритвой', 'Горячее полотенце', 'Масло и укладка'],
    image: 'work-beard-fade',
    imageAlt: 'Короткая стрижка с фейдом и оформленная борода',
    gallery: ['process-beard-clipper', 'work-beard-fade-2'],
  },
  {
    slug: 'oformlenie-borody',
    serviceId: 'beard',
    title: 'Оформление бороды',
    lead: 'Форма бороды под овал лица, ровные щёки и шея. Премиум-вариант с горячим полотенцем и уходовыми маслами.',
    includes: ['Подбор формы', 'Моделирование машинкой и ножницами', 'Контур опасной бритвой', 'Масло для бороды'],
    image: 'process-beard-trim',
    imageAlt: 'Барбер оформляет бороду триммером',
    gallery: ['process-beard-line', 'care-oils'],
  },
  {
    slug: 'opasnoe-britie',
    serviceId: 'shave',
    title: 'Опасное бритьё',
    lead: 'Классическое бритьё опасной бритвой: распаривание, гель для точных контуров, лосьон после бритья.',
    includes: ['Горячее полотенце', 'Гель для бритья', 'Бритьё опасной бритвой', 'Холодное полотенце', 'Лосьон после бритья'],
    image: 'process-beard-line',
    imageAlt: 'Подготовка к бритью в кресле барбера',
    gallery: ['care-oils', 'interior-chair-tufted'],
  },
];

export const masters = [
  {
    id: 'andrey',
    name: 'Андрей',
    role: 'Барбер',
    spec: 'Фейды, текстурные стрижки, детские стрижки', // [ЗАГЛУШКА]
    photo: 'process-fade',
    photoAlt: 'Барбер Андрей за работой',
    placeholderName: true,
  },
  { id: 'oksana', name: 'Оксана', role: 'Барбер', spec: 'Классические стрижки, борода', photo: null },
  { id: 'yan', name: 'Ян', role: 'Барбер', spec: 'Стрижки ножницами, укладка', photo: null },
];

export const promos = [
  {
    id: 'first',
    title: 'Первая стрижка −20%',
    text: 'Для новых клиентов: мужская стрижка за 1 400 ₽ вместо 1 700 ₽.',
    terms: 'Один раз на клиента. Скажите администратору, что вы у нас впервые.',
    service: 'first-haircut',
  },
  {
    id: 'father-son',
    title: 'Отец и сын',
    text: 'Две стрижки в одно время — 2 900 ₽ за обе.',
    terms: 'Сын до 12 лет. Записывайтесь на соседние кресла или одно время.',
    service: 'father-son',
  },
  {
    id: 'birthday',
    title: 'День рождения',
    text: 'Скидка 20% на любую услугу за 3 дня до и 3 дня после дня рождения.',
    terms: 'Покажите паспорт. Не суммируется с другими акциями.',
    service: 'haircut',
  },
  {
    id: 'certificate',
    title: 'Подарочный сертификат',
    text: 'Подарите визит в ЦИРЮЛ: номинал или конкретная услуга.',
    terms: 'Действует 6 месяцев. [ЗАГЛУШКА]',
    link: 'sertifikat/',
  },
  {
    id: 'friend',
    title: 'Приведи друга',
    text: 'Другу −20% на первый визит, вам −300 ₽ на следующую стрижку.',
    terms: '[ЗАГЛУШКА] Условия уточняются у администратора.',
    service: 'haircut',
    placeholder: true,
  },
];

export const reviews = [
  {
    author: 'Вова Миронов',
    date: '9 сентября 2026',
    text: 'Попал к мастеру Андрею, он быстро нашёл общий язык, сделал форму аккуратно и без лишней суеты. Приятно удивило, что на стрижку дают гарантию.',
  },
  {
    author: 'Олег Морозов',
    date: '18 сентября 2026',
    text: 'Мастер внимательно выслушал пожелания, подсказал форму под лицо. Стрижка аккуратная, укладка тоже. Атмосфера спокойная, записали быстро.',
  },
  {
    author: 'Оксана Щеголькова',
    date: '18 августа 2026',
    text: 'Записывала мужа на стрижку. Мастер отлично чувствует клиента: можно и поговорить, и помолчать в тишине. Идеально чисто и очень современный интерьер.',
  },
];

export const blogPosts = [
  {
    slug: 'kak-vybrat-strizhku-pod-formu-lica',
    title: 'Как выбрать стрижку под форму лица',
    excerpt: 'Круглое, квадратное, вытянутое: что делать с висками и объёмом сверху.',
    image: 'work-textured-front',
    date: '2026-11-10',
  },
  {
    slug: 'uhod-za-borodoy-mezhdu-vizitami',
    title: 'Уход за бородой между визитами',
    excerpt: 'Масло, расчёска и две минуты утром — чтобы форма держалась три недели.',
    image: 'care-oils',
    date: '2026-10-28',
  },
  {
    slug: 'kak-chasto-strichsya',
    title: 'Как часто стричься, чтобы форма не терялась',
    excerpt: 'Фейд, классика, длинный верх: короткая шпаргалка по срокам.',
    image: 'work-beard-fade',
    date: '2026-10-14',
  },
];

export const navMain = [
  { href: 'uslugi/', label: 'Услуги и цены' },
  { href: 'akcii/', label: 'Акции' },
  { href: 'mastera/', label: 'Мастера' },
  { href: 'o-nas/', label: 'О нас' },
  { href: 'galereya/', label: 'Галерея' },
  { href: 'kontakty/', label: 'Контакты' },
];

export const navFooter = [
  [
    { href: 'uslugi/', label: 'Услуги и цены' },
    { href: 'muzhskaya-strizhka/', label: 'Мужская стрижка' },
    { href: 'strizhka-boroda/', label: 'Стрижка + борода' },
    { href: 'oformlenie-borody/', label: 'Оформление бороды' },
    { href: 'opasnoe-britie/', label: 'Опасное бритьё' },
  ],
  [
    { href: 'akcii/', label: 'Акции' },
    { href: 'sertifikat/', label: 'Подарочный сертификат' },
    { href: 'mastera/', label: 'Мастера' },
    { href: 'o-nas/', label: 'О нас' },
    { href: 'galereya/', label: 'Галерея' },
  ],
  [
    { href: 'blog/', label: 'Блог' },
    { href: 'vakansii/', label: 'Вакансии' },
    { href: 'kontakty/', label: 'Контакты' },
    { href: 'politika/', label: 'Политика конфиденциальности' },
  ],
];
