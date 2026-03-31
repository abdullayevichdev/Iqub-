import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'uz' | 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  uz: {
    // Navbar
    'nav.home': 'Bosh sahifa',
    'nav.modules': 'Modullar',
    'nav.benefits': 'Afzalliklar',
    'nav.faq': 'FAQ',
    'nav.login': 'Kirish',
    'nav.dashboard': 'Dashboard',
    'nav.landing': 'Landing',

    // Hero
    'hero.title': 'Qurilish Biznesingiz Uchun Mukammal ERP Tizimi',
    'hero.subtitle': 'iQUB - qurilish jarayonlarini avtomatlashtirish, sotuvlarni nazorat qilish va moliyaviy shaffoflikni ta\'minlash uchun yagona yechim.',
    'hero.cta.demo': 'Demoni ko\'rish',
    'hero.cta.contact': 'Bog\'lanish',

    // Features / Modules
    'features.title': 'Asosiy Modullar',
    'features.subtitle': 'Barcha jarayonlar yagona tizimda',
    'features.crm.title': 'CRM va Sotuv',
    'features.crm.desc': 'Mijozlar bilan ishlash va shartnomalarni boshqarish.',
    'features.finance.title': 'Moliya',
    'features.finance.desc': 'To\'lovlar, kassalar va bank hisobotlari nazorati.',
    'features.warehouse.title': 'Omborxona',
    'features.warehouse.desc': 'Materiallar hisobi va zaxiralarni boshqarish.',
    'features.hr.title': 'Xodimlar',
    'features.hr.desc': 'KPI, ish haqi va rollarni boshqarish.',

    // Why iQUB
    'why.title': 'Nega Aynan iQUB ERP?',
    'why.subtitle': 'Bizning tizim ko\'p qavatli turar-joy binolari qurilishini va sotuv jarayonlarini yanada samarali boshqaradi.',
    'why.control.title': 'Obyektlar ustidan to‘liq nazorat',
    'why.control.desc': 'Qurilish obyektlari va xonadonlarning sotuv jarayonini real vaqt rejimida kuzatish.',
    'why.crm.title': 'CRM va mijozlar bilan ishlash',
    'why.crm.desc': 'Lidlar, mijozlar va shartnomalarni yagona tizimda boshqarib, sotuvlarni oshirish.',
    'why.finance.title': 'Moliyaviy shaffoflik',
    'why.finance.desc': 'Mijoz to‘lovlari, bank hisobotlari, kontragentlar va kassalarni bir joyda nazorat qilish.',
    'why.hr.title': 'Xodimlarni boshqarish',
    'why.hr.desc': 'Xodimlar, maoshlar va rollarni samarali boshqarish.',
    'why.warehouse.title': 'Ombor va materiallar',
    'why.warehouse.desc': 'Qurilish materiallari buyurtmasi va zaxiralarni aniq hisobda yuritish.',
    'why.kpi.title': 'Hisobotlar va KPI',
    'why.kpi.desc': 'Aktlar, tahliliy hisobotlar va KPI ko‘rsatkichlari orqali samarali qaror qabul qilish.',

    // Testimonials
    'testimonials.title': 'Biz Haqimizda Boshqalar Nima Deyishmoqda?',
    'testimonials.subtitle': 'Mijozlarimizning muvaffaqiyat hikoyalari',
    'testimonials.pos1': 'Sotuv menejeri',
    'testimonials.pos2': 'Ombor menejeri',
    'testimonials.pos3': 'Qurilish kompaniyasi rahbari',
    'testimonials.pos4': 'Sotuv bo‘limi rahbari',
    'testimonials.pos5': 'Moliya direktori',
    'testimonials.pos6': 'HR menejer',
    'testimonials.pos7': 'Logistika boshlig\'i',
    'testimonials.pos8': 'Buxgalter',

    // FAQ
    'faq.title': 'Ko\'p so\'raladigan savollar',
    'faq.subtitle': 'Tizim haqida batafsil ma\'lumot oling',
    'faq.q1': 'iQUB ERP tizimi nima?',
    'faq.a1': 'iQUB ERP - bu qurilish kompaniyalari uchun maxsus ishlab chiqilgan, barcha jarayonlarni avtomatlashtiruvchi boshqaruv tizimi.',
    'faq.q2': 'Tizimni o\'rnatish qancha vaqt oladi?',
    'faq.a2': 'Kompaniyangiz hajmi va talablariga qarab, o\'rnatish va xodimlarni o\'qitish 2 haftadan 1 oygacha davom etishi mumkin.',
    'faq.q3': 'Ma\'lumotlar xavfsizligi qanday ta\'minlanadi?',
    'faq.a3': 'Barcha ma\'lumotlar zamonaviy bulutli serverlarda saqlanadi va muntazam ravishda zaxiralanadi. Kirish huquqlari rollar bo\'yicha qat\'iy nazorat qilinadi.',

    // AutomationSteps
    'steps.title': 'Soddalashtirilgan Avtomatlashtirish 3 Qadamda',
    'steps.s1_title': 'Tizimni ulash',
    'steps.s1_desc': 'iQUB ERP’ni kompaniyangiz jarayonlariga ulash.',
    'steps.s2_title': 'Jarayonlarni kuzatish',
    'steps.s2_desc': 'CRM, obyektlar, to\'lovlar va omborlarni real vaqt rejimida nazorat qiling.',
    'steps.s3_title': 'Qarorlarni amalga oshiring',
    'steps.s3_desc': 'Hisobotlar va KPI orqali tezkor qarorlar qabul qiling.',

    // Dashboard
    'dash.home': 'Bosh sahifa',
    'dash.objects': 'Obyektlar',
    'dash.sales': 'Sotuvlar',
    'dash.clients': 'Mijozlar',
    'dash.inventory': 'Inventarizatsiya',
    'dash.search': 'Qidirish...',
    'dash.obj_status': 'Obyektlar holati',
    'dash.all': 'Barchasi',
    'dash.obj_name': 'Obyekt nomi',
    'dash.blocks': 'Bloklar',
    'dash.progress': 'Progress',
    'dash.status': 'Status',
    'dash.apartments': 'xonadon',
    'dash.blocks_count': 'ta',
    'dash.ready': 'Tayyor',
    'dash.in_progress': 'Jarayonda',
    'dash.recent_sales': 'Oxirgi sotuvlar',
    'dash.paid': 'To\'landi',
    'dash.pending': 'Kutilmoqda',
    'dash.client_list': 'Mijozlar ro\'yxati',
    'dash.client': 'Mijoz',
    'dash.phone': 'Telefon',
    'dash.total': 'Jami to\'lov',
    'dash.actions': 'Amallar',
    'dash.active': 'Faol',
    'dash.foundation': 'Poydevor',
    'dash.building': 'Qurilmoqda',

    // Extra
    'features.more': 'Batafsil ma\'lumot',
    'features.dashboard': 'Dashboard',
    'features.objects': 'Obyektlar',
    'testimonials.subtitle_val': 'Mijozlarimizning muvaffaqiyat hikoyalari',
    'footer.m1': 'CRM',
    'footer.m2': 'Dashboard',
    'footer.m3': 'Obyektlar',
    'footer.m4': 'Omborxona',
    'footer.m5': 'Moliya',
    'footer.m6': 'Hisobotlar',

    // Testimonials Quotes
    'testimonials.q1': 'iQUB ning eng menga yoqqan tarafi bu - omborxona nazoratidir. Bu bo\'lim orqali biz omborxonadagi barcha mahsulotlarimizning sonini bemalol ko\'ra olamiz. Undan tashqari yangi mahsulotlar buyurtma qilishimiz yoki boshqa omborimizdan olib keltirishimiz mumkin bo\'ladi. Bunday imkoniyatlar uchun iQUB ga rahmat!',
    'testimonials.q2': 'Hozirgi kunda qarzdorliklar bo\'yicha hech qanday muammo bo\'lmayapti, hammasi o\'z vaqtida to\'lanmoqda. Buning asosiy sababi esa bizda iQUB tizimining borligidir. iQUB orqali endilikda biz har bir qarzdorga masofadan turib qarzdorlik haqida SMS xabarlarini yubora olamiz. Bu ishimizni 2x ga tezlashtirdi deb bemalol aytishimiz mumkin.',
    'testimonials.q3': 'Boshida iQUB tizimini o\'rnatishga ikkilangan edim, o\'zimiz ham binoyidek exceldan foydalanib yuribmizku, ortiqcha xarajat qilib nima qilamiz yana deb. Baribir tavakkal qilib o\'rnatishga qaror qilgan edik va bu qaror kompaniyamizning o\'sishi, xarajatlar miqdorining keskin pasayishi, xodimlar ustidan to\'liq nazorat va adolat o\'rnatuvchi poydevor vazifasini o\'tadi.',
    'testimonials.q4': 'Oldin qurilishimizning har bir qismi uchun alohida-alohida tizimlardan foydalanar edik. Bu esa ma\'lumotlarni yig\'ishda juda ko\'p vaqt va xatoliklarga sabab bo\'lardi. iQUB kelishi bilan barcha jarayonlar yagona tizimga birlashdi.',
    'testimonials.q5': 'Moliya bo\'limi uchun iQUB haqiqiy najot bo\'ldi. Xarajatlarni nazorat qilish, foyda va zarar hisobotlarini avtomatik shakllantirish bizga strategik qarorlar qabul qilishda yordam bermoqda.',
    'testimonials.q6': 'Xodimlar faoliyatini kuzatish va KPI tizimini joriy qilish iQUB bilan ancha osonlashdi. Har bir xodim o\'z natijalarini ko\'rib turishi ularning motivatsiyasiga ijobiy ta\'sir ko\'rsatmoqda.',
    'testimonials.q7': 'Yetkazib berish zanjirini boshqarish iQUB bilan yangi bosqichga chiqdi. Marshrutlarni optimallashtirish va xarajatlarni kamaytirish orqali kompaniyamiz samaradorligini 30% ga oshirdik.',
    'testimonials.q8': 'Soliq hisobotlari va oylik maoshlarni hisoblashda iQUB bizga katta yordam bermoqda. Xatoliklar ehtimoli nolga tushdi, barcha ma\'lumotlar shaffof va aniq.',

    // Login
    'login.title': 'Tizimga kirish',
    'login.subtitle': 'iQUB ERP boshqaruv paneliga kiring',
    'login.email_placeholder': 'Email manzilingiz',
    'login.password_placeholder': 'Parolingiz',
    'login.submit': 'Kirish',
    'login.no_account': 'Hisobingiz yo\'qmi?',
    'login.register': 'Ro\'yxatdan o\'ting',
    'login.error_conn': 'Server bilan bog\'lanishda xatolik yuz berdi',

    // Footer
    'footer.desc': 'Ko\'p qavatli turar-joy binolari qurilishi va sotuv jarayonlarini avtomatlashtirish uchun mukammal yechim.',
    'footer.links': 'Tezkor havolalar',
    'footer.modules': 'Modullar',
    'footer.contact': 'Bog\'lanish',
    'footer.rights': 'Barcha huquqlar himoyalangan.',
    'footer.privacy': 'Maxfiylik siyosati',
    'footer.terms': 'Foydalanish shartlari',
    'footer.phone': 'Telefon',
    'footer.email': 'Email',
    'footer.address': 'Manzil',
    'footer.address_val': 'Toshkent sh., Yunusobod tumani, 12-mavze',
    'hero.trust': 'Bizga 20+ kompaniya ishonmoqda',
  },
  ru: {
    // Navbar
    'nav.home': 'Главная',
    'nav.modules': 'Модули',
    'nav.benefits': 'Преимущества',
    'nav.faq': 'FAQ',
    'nav.login': 'Войти',
    'nav.dashboard': 'Дашборд',
    'nav.landing': 'Лендинг',

    // Hero
    'hero.title': 'Идеальная ERP-система для вашего строительного бизнеса',
    'hero.subtitle': 'iQUB — единое решение для автоматизации строительных процессов, контроля продаж и обеспечения финансовой прозрачности.',
    'hero.cta.demo': 'Посмотреть демо',
    'hero.cta.contact': 'Связаться',

    // Features / Modules
    'features.title': 'Основные модули',
    'features.subtitle': 'Все процессы в одной системе',
    'features.crm.title': 'CRM и Продажи',
    'features.crm.desc': 'Работа с клиентами и управление договорами.',
    'features.finance.title': 'Финансы',
    'features.finance.desc': 'Контроль платежей, касс и банковских отчетов.',
    'features.warehouse.title': 'Склад',
    'features.warehouse.desc': 'Учет материалов и управление запасами.',
    'features.hr.title': 'Персонал',
    'features.hr.desc': 'Управление KPI, зарплатами и ролями.',

    // Why iQUB
    'why.title': 'Почему именно iQUB ERP?',
    'why.subtitle': 'Наша система более эффективно управляет строительством многоэтажных жилых домов и процессами продаж.',
    'why.control.title': 'Полный контроль над объектами',
    'why.control.desc': 'Мониторинг процесса продаж строительных объектов и квартир в режиме реального времени.',
    'why.crm.title': 'CRM и работа с клиентами',
    'why.crm.desc': 'Управление лидами, клиентами и контрактами в единой системе для увеличения продаж.',
    'why.finance.title': 'Финансовая прозрачность',
    'why.finance.desc': 'Контроль платежей клиентов, банковских отчетов, контрагентов и касс в одном месте.',
    'why.hr.title': 'Управление персоналом',
    'why.hr.desc': 'Эффективное управление сотрудниками, зарплатами и ролями.',
    'why.warehouse.title': 'Склад и материалы',
    'why.warehouse.desc': 'Точный учет заказов строительных материалов и запасов.',
    'why.kpi.title': 'Отчеты и KPI',
    'why.kpi.desc': 'Принятие эффективных решений на основе актов, аналитических отчетов и показателей KPI.',

    // Testimonials
    'testimonials.title': 'Что говорят о нас другие?',
    'testimonials.subtitle': 'Истории успеха наших клиентов',
    'testimonials.pos1': 'Менеджер по продажам',
    'testimonials.pos2': 'Менеджер склада',
    'testimonials.pos3': 'Руководитель строительной компании',
    'testimonials.pos4': 'Руководитель отдела продаж',
    'testimonials.pos5': 'Финансовый директор',
    'testimonials.pos6': 'HR-менеджер',
    'testimonials.pos7': 'Начальник логистики',
    'testimonials.pos8': 'Бухгалтер',

    // FAQ
    'faq.title': 'Часто задаваемые вопросы',
    'faq.subtitle': 'Получите подробную информацию о системе',
    'faq.q1': 'Что такое система iQUB ERP?',
    'faq.a1': 'iQUB ERP — это система управления, специально разработанная для строительных компаний, которая автоматизирует все процессы.',
    'faq.q2': 'Сколько времени занимает установка системы?',
    'faq.a2': 'В зависимости от размера вашей компании и требований, установка и обучение персонала могут занять от 2 недель до 1 месяца.',
    'faq.q3': 'Как обеспечивается безопасность данных?',
    'faq.a3': 'Все данные хранятся на современных облачных серверах и регулярно копируются. Права доступа строго контролируются ролями.',

    // AutomationSteps
    'steps.title': 'Упрощенная автоматизация в 3 шага',
    'steps.s1_title': 'Подключение системы',
    'steps.s1_desc': 'Подключите iQUB ERP к процессам вашей компании.',
    'steps.s2_title': 'Отслеживание процессов',
    'steps.s2_desc': 'Контролируйте CRM, объекты, платежи и склады в режиме реального времени.',
    'steps.s3_title': 'Принимайте решения',
    'steps.s3_desc': 'Принимайте оперативные решения с помощью отчетов и KPI.',

    // Dashboard
    'dash.home': 'Главная',
    'dash.objects': 'Объекты',
    'dash.sales': 'Продажи',
    'dash.clients': 'Клиенты',
    'dash.inventory': 'Инвентаризация',
    'dash.search': 'Поиск...',
    'dash.obj_status': 'Статус объектов',
    'dash.all': 'Все',
    'dash.obj_name': 'Название объекта',
    'dash.blocks': 'Блоки',
    'dash.progress': 'Прогресс',
    'dash.status': 'Статус',
    'dash.apartments': 'квартир',
    'dash.blocks_count': 'шт',
    'dash.ready': 'Готово',
    'dash.in_progress': 'В процессе',
    'dash.recent_sales': 'Последние продажи',
    'dash.paid': 'Оплачено',
    'dash.pending': 'Ожидается',
    'dash.client_list': 'Список клиентов',
    'dash.client': 'Клиент',
    'dash.phone': 'Телефон',
    'dash.total': 'Общая сумма',
    'dash.actions': 'Действия',
    'dash.active': 'Активен',
    'dash.foundation': 'Фундамент',
    'dash.building': 'Строится',

    // Extra
    'features.more': 'Подробнее',
    'features.dashboard': 'Дашборд',
    'features.objects': 'Объекты',
    'testimonials.subtitle_val': 'Истории успеха наших клиентов',
    'footer.m1': 'CRM',
    'footer.m2': 'Дашборд',
    'footer.m3': 'Объекты',
    'footer.m4': 'Склад',
    'footer.m5': 'Финансы',
    'footer.m6': 'Отчеты',

    // Testimonials Quotes
    'testimonials.q1': 'Что мне больше всего нравится в iQUB, так это контроль склада. Через этот раздел мы можем легко видеть количество всех наших товаров на складе. Кроме того, мы можем заказать новые товары или привезти их с другого нашего склада. Спасибо iQUB за такие возможности!',
    'testimonials.q2': 'На данный момент проблем с задолженностью нет, все выплачивается вовремя. Основная причина этого в том, что у нас есть система iQUB. Через iQUB теперь мы можем отправлять SMS-сообщения о задолженности каждому должнику удаленно. Можно смело сказать, что это ускорило нашу работу в 2 раза.',
    'testimonials.q3': 'Сначала я сомневался в установке системы iQUB, думал, что мы и так неплохо пользуемся Excel, зачем тратить лишние деньги. Все же мы решили рискнуть и установить ее, и это решение стало фундаментом для роста нашей компании, резкого снижения затрат, полного контроля над персоналом и установления справедливости.',
    'testimonials.q4': 'Раньше мы использовали отдельные системы для каждой части нашего строительства. Это приводило к большим затратам времени и ошибкам при сборе данных. С приходом iQUB все процессы объединились в единую систему.',
    'testimonials.q5': 'Для финансового отдела iQUB стал настоящим спасением. Контроль расходов, автоматическое формирование отчетов о прибылях и убытках помогают нам принимать стратегические решения.',
    'testimonials.q6': 'Отслеживание деятельности сотрудников и внедрение системы KPI стало намного проще с iQUB. То, что каждый сотрудник видит свои результаты, положительно сказывается на их мотивации.',
    'testimonials.q7': 'Управление цепочкой поставок вышло на новый уровень с iQUB. Оптимизировав маршруты и сократив расходы, мы повысили эффективность нашей компании на 30%.',
    'testimonials.q8': 'iQUB очень помогает нам в налоговой отчетности и расчете ежемесячной заработной платы. Вероятность ошибок упала до нуля, все данные прозрачны и точны.',

    // Login
    'login.title': 'Вход в систему',
    'login.subtitle': 'Войдите в панель управления iQUB ERP',
    'login.email_placeholder': 'Ваш Email',
    'login.password_placeholder': 'Ваш пароль',
    'login.submit': 'Войти',
    'login.no_account': 'Нет аккаунта?',
    'login.register': 'Зарегистрируйтесь',
    'login.error_conn': 'Произошла ошибка при подключении к серверу',

    // Footer
    'footer.desc': 'Идеальное решение для автоматизации строительства многоэтажных жилых домов и процессов продаж.',
    'footer.links': 'Быстрые ссылки',
    'footer.modules': 'Модули',
    'footer.contact': 'Контакты',
    'footer.rights': 'Все права защищены.',
    'footer.privacy': 'Политика конфиденциальности',
    'footer.terms': 'Условия использования',
    'footer.phone': 'Телефон',
    'footer.email': 'Email',
    'footer.address': 'Адрес',
    'footer.address_val': 'г. Ташкент, Юнусабадский р-н, 12-й квартал',
    'hero.trust': 'Нам доверяют более 20 компаний',
  },
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.modules': 'Modules',
    'nav.benefits': 'Benefits',
    'nav.faq': 'FAQ',
    'nav.login': 'Login',
    'nav.dashboard': 'Dashboard',
    'nav.landing': 'Landing',

    // Hero
    'hero.title': 'Perfect ERP System for Your Construction Business',
    'hero.subtitle': 'iQUB is a single solution for automating construction processes, controlling sales, and ensuring financial transparency.',
    'hero.cta.demo': 'View Demo',
    'hero.cta.contact': 'Contact Us',

    // Features / Modules
    'features.title': 'Core Modules',
    'features.subtitle': 'All processes in one system',
    'features.crm.title': 'CRM & Sales',
    'features.crm.desc': 'Customer relations and contract management.',
    'features.finance.title': 'Finance',
    'features.finance.desc': 'Control of payments, cash desks, and bank reports.',
    'features.warehouse.title': 'Warehouse',
    'features.warehouse.desc': 'Material accounting and inventory management.',
    'features.hr.title': 'Personnel',
    'features.hr.desc': 'KPI, salary, and role management.',

    // Why iQUB
    'why.title': 'Why Choose iQUB ERP?',
    'why.subtitle': 'Our system manages the construction of multi-story residential buildings and sales processes more efficiently.',
    'why.control.title': 'Full Control Over Objects',
    'why.control.desc': 'Real-time monitoring of the sales process for construction objects and apartments.',
    'why.crm.title': 'CRM & Customer Relations',
    'why.crm.desc': 'Manage leads, customers, and contracts in a single system to increase sales.',
    'why.finance.title': 'Financial Transparency',
    'why.finance.desc': 'Control customer payments, bank reports, counterparties, and cash desks in one place.',
    'why.hr.title': 'Personnel Management',
    'why.hr.desc': 'Efficient management of employees, salaries, and roles.',
    'why.warehouse.title': 'Warehouse & Materials',
    'why.warehouse.desc': 'Accurate accounting of construction material orders and stocks.',
    'why.kpi.title': 'Reports & KPI',
    'why.kpi.desc': 'Make effective decisions through acts, analytical reports, and KPI indicators.',

    // Testimonials
    'testimonials.title': 'What Others Are Saying About Us?',
    'testimonials.subtitle': 'Success stories from our clients',
    'testimonials.pos1': 'Sales Manager',
    'testimonials.pos2': 'Warehouse Manager',
    'testimonials.pos3': 'Construction Company CEO',
    'testimonials.pos4': 'Head of Sales Department',
    'testimonials.pos5': 'Finance Director',
    'testimonials.pos6': 'HR Manager',
    'testimonials.pos7': 'Logistics Manager',
    'testimonials.pos8': 'Accountant',

    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Get detailed information about the system',
    'faq.q1': 'What is iQUB ERP system?',
    'faq.a1': 'iQUB ERP is a management system specifically designed for construction companies that automates all processes.',
    'faq.q2': 'How long does it take to install the system?',
    'faq.a2': 'Depending on your company size and requirements, installation and staff training can take from 2 weeks to 1 month.',
    'faq.q3': 'How is data security ensured?',
    'faq.a3': 'All data is stored on modern cloud servers and regularly backed up. Access rights are strictly controlled by roles.',

    // AutomationSteps
    'steps.title': 'Simplified Automation in 3 Steps',
    'steps.s1_title': 'Connect System',
    'steps.s1_desc': 'Connect iQUB ERP to your company processes.',
    'steps.s2_title': 'Track Processes',
    'steps.s2_desc': 'Control CRM, objects, payments and warehouses in real time.',
    'steps.s3_title': 'Make Decisions',
    'steps.s3_desc': 'Make quick decisions through reports and KPIs.',

    // Dashboard
    'dash.home': 'Home',
    'dash.objects': 'Objects',
    'dash.sales': 'Sales',
    'dash.clients': 'Clients',
    'dash.inventory': 'Inventory',
    'dash.search': 'Search...',
    'dash.obj_status': 'Object Status',
    'dash.all': 'All',
    'dash.obj_name': 'Object Name',
    'dash.blocks': 'Blocks',
    'dash.progress': 'Progress',
    'dash.status': 'Status',
    'dash.apartments': 'apartments',
    'dash.blocks_count': 'pcs',
    'dash.ready': 'Ready',
    'dash.in_progress': 'In Progress',
    'dash.recent_sales': 'Recent Sales',
    'dash.paid': 'Paid',
    'dash.pending': 'Pending',
    'dash.client_list': 'Client List',
    'dash.client': 'Client',
    'dash.phone': 'Phone',
    'dash.total': 'Total Payment',
    'dash.actions': 'Actions',
    'dash.active': 'Active',
    'dash.foundation': 'Foundation',
    'dash.building': 'Building',

    // Extra
    'features.more': 'Learn More',
    'features.dashboard': 'Dashboard',
    'features.objects': 'Objects',
    'testimonials.subtitle_val': 'Success stories from our clients',
    'footer.m1': 'CRM',
    'footer.m2': 'Dashboard',
    'footer.m3': 'Objects',
    'footer.m4': 'Warehouse',
    'footer.m5': 'Finance',
    'footer.m6': 'Reports',

    // Testimonials Quotes
    'testimonials.q1': 'My favorite part of iQUB is the warehouse control. Through this section, we can easily see the quantity of all our products in the warehouse. In addition, we can order new products or bring them from our other warehouse. Thanks to iQUB for such opportunities!',
    'testimonials.q2': 'Currently, there are no problems with debt, everything is paid on time. The main reason for this is that we have the iQUB system. Through iQUB, we can now send SMS messages about debt to each debtor remotely. We can safely say that this has sped up our work by 2x.',
    'testimonials.q3': 'At first, I was hesitant to install the iQUB system, thinking that we were already using Excel quite well, why spend extra money. Still, we decided to take a risk and install it, and this decision became the foundation for our company\'s growth, a sharp reduction in costs, full control over staff, and establishing justice.',
    'testimonials.q4': 'Previously, we used separate systems for each part of our construction. This led to a lot of time and errors in data collection. With the arrival of iQUB, all processes were combined into a single system.',
    'testimonials.q5': 'For the finance department, iQUB has been a real lifesaver. Controlling costs, automatically generating profit and loss reports help us make strategic decisions.',
    'testimonials.q6': 'Tracking employee activities and implementing the KPI system has become much easier with iQUB. The fact that each employee sees their results has a positive effect on their motivation.',
    'testimonials.q7': 'Supply chain management has reached a new level with iQUB. By optimizing routes and reducing costs, we have increased our company\'s efficiency by 30%.',
    'testimonials.q8': 'iQUB helps us a lot in tax reporting and calculating monthly salaries. The probability of errors has dropped to zero, all data is transparent and accurate.',

    // Login
    'login.title': 'Login',
    'login.subtitle': 'Enter the iQUB ERP dashboard',
    'login.email_placeholder': 'Your email',
    'login.password_placeholder': 'Your password',
    'login.submit': 'Login',
    'login.no_account': 'Don\'t have an account?',
    'login.register': 'Register',
    'login.error_conn': 'An error occurred while connecting to the server',

    // Footer
    'footer.desc': 'The perfect solution for automating multi-story residential building construction and sales processes.',
    'footer.links': 'Quick Links',
    'footer.modules': 'Modules',
    'footer.contact': 'Contact',
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Use',
    'footer.phone': 'Phone',
    'footer.email': 'Email',
    'footer.address': 'Address',
    'footer.address_val': 'Toshkent, Yunusobod district, 12th block',
    'hero.trust': 'More than 20 companies trust us',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('uz');

  const t = (key: string): string => {
    const langTranslations = translations[language] as Record<string, string>;
    return langTranslations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
