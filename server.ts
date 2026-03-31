import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Database
  const db = {
    users: [],
    faqs: {
      uz: [
        {
          question: "iQUB ERP tizimi aynan qaysi sohalar uchun mo'ljallangan?",
          answer: "iQUB ERP maxsus ko'p qavatli turar-joy binolari qurilishi, boshqaruvi va sotuv bo'limlari uchun ishlab chiqilgan. Tizim qurilish jarayonlarini, moliyaviy oqimlarni va mijozlar bilan munosabatlarni yagona platformada birlashtiradi.",
        },
        {
          question: "Tizimni joriy qilish uchun qancha vaqt talab etiladi?",
          answer: "Kompaniyangiz hajmi va mavjud ma'lumotlar miqdoriga qarab, tizimni to'liq joriy qilish va xodimlarni o'qitish odatda 1 haftadan 3 haftagacha vaqt oladi.",
        },
        {
          question: "Ma'lumotlarimiz xavfsizligi qanday ta'minlanadi?",
          answer: "Biz eng zamonaviy shifrlash usullaridan va xavfsiz bulutli serverlardan foydalanamiz. Har bir foydalanuvchi uchun alohida kirish huquqlari (RBAC) belgilanadi va ma'lumotlar muntazam ravishda zaxiralanadi.",
        },
      ],
      ru: [
        {
          question: "Для каких отраслей предназначена система iQUB ERP?",
          answer: "iQUB ERP специально разработана для строительства многоэтажных жилых домов, управления и отделов продаж. Система объединяет строительные процессы, финансовые потоки и отношения с клиентами на единой платформе.",
        },
        {
          question: "Сколько времени требуется для внедрения системы?",
          answer: "В зависимости от размера вашей компании и объема существующих данных, полное внедрение системы и обучение персонала обычно занимает от 1 до 3 недель.",
        },
        {
          question: "Как обеспечивается безопасность наших данных?",
          answer: "Мы используем самые современные методы шифрования и защищенные облачные серверы. Для каждого пользователя устанавливаются отдельные права доступа (RBAC), а данные регулярно копируются.",
        },
      ],
      en: [
        {
          question: "Which industries is the iQUB ERP system designed for?",
          answer: "iQUB ERP is specifically designed for multi-story residential building construction, management, and sales departments. The system integrates construction processes, financial flows, and customer relations into a single platform.",
        },
        {
          question: "How long does it take to implement the system?",
          answer: "Depending on your company size and the amount of existing data, full system implementation and staff training usually take 1 to 3 weeks.",
        },
        {
          question: "How is our data security ensured?",
          answer: "We use state-of-the-art encryption methods and secure cloud servers. Individual access rights (RBAC) are set for each user, and data is regularly backed up.",
        },
      ]
    },
    dashboard: {
      stats: [
        { label: "Obyektlar", value: 12, icon: "Building2", color: "from-blue-500 to-blue-600" },
        { label: "Xonadonlar", value: 452, icon: "Home", color: "from-orange-500 to-orange-600" },
        { label: "Jarayonda", value: 84, icon: "Clock", color: "from-purple-500 to-purple-600" },
        { label: "Tayyor", value: 1240, icon: "CheckCircle2", color: "from-green-500 to-green-600" },
      ],
      objects: [
        { name: "Yunusobod City", blocks: 4, apartments: 240, progress: 75, status: "Qurilmoqda" },
        { name: "Chilonzor Residence", blocks: 2, apartments: 120, progress: 100, status: "Tayyor" },
        { name: "Mirzo Ulug'bek Park", blocks: 6, apartments: 360, progress: 30, status: "Poydevor" },
      ],
      recentSales: [
        { client: "Azizov Akmal", object: "Yunusobod City", amount: "850,000,000", date: "28.03", status: "To'landi" },
        { client: "Karimova Zilola", object: "Chilonzor Residence", amount: "620,000,000", date: "27.03", status: "Kutilmoqda" },
        { client: "Nazarov Jamshid", object: "Mirzo Ulug'bek Park", amount: "1,200,000,000", date: "26.03", status: "To'landi" },
      ],
      clients: [
        { name: "Azizov Akmal", phone: "+998 90 123 45 67", total: "850,000,000", status: "Faol" },
        { name: "Karimova Zilola", phone: "+998 93 765 43 21", total: "620,000,000", status: "Kutilmoqda" },
        { name: "Nazarov Jamshid", phone: "+998 94 987 65 43", total: "1,200,000,000", status: "Faol" },
      ]
    },
    features: {
      uz: [
        { title: "CRM va Sotuv", description: "Mijozlar bilan ishlash va shartnomalarni boshqarish.", icon: "Users" },
        { title: "Moliya", description: "To'lovlar, kassalar va bank hisobotlari nazorati.", icon: "LayoutDashboard" },
        { title: "Omborxona", description: "Materiallar hisobi va zaxiralarni boshqarish.", icon: "Home" },
        { title: "Xodimlar", description: "KPI, ish haqi va rollarni boshqarish.", icon: "Warehouse" },
      ],
      ru: [
        { title: "CRM и Продажи", description: "Работа с клиентами и управление договорами.", icon: "Users" },
        { title: "Финансы", description: "Контроль платежей, касс и банковских отчетов.", icon: "LayoutDashboard" },
        { title: "Склад", description: "Учет материалов и управление запасами.", icon: "Home" },
        { title: "Персонал", description: "Управление KPI, зарплатами и ролями.", icon: "Warehouse" },
      ],
      en: [
        { title: "CRM & Sales", description: "Customer relations and contract management.", icon: "Users" },
        { title: "Finance", description: "Control of payments, cash desks, and bank reports.", icon: "LayoutDashboard" },
        { title: "Warehouse", description: "Material accounting and inventory management.", icon: "Home" },
        { title: "Personnel", description: "KPI, salary, and role management.", icon: "Warehouse" },
      ]
    },
    testimonials: {
      uz: [
        { name: "Malika K.", position: "Sotuv menejeri", quote: "iQUB ning eng menga yoqqan tarafi bu - omborxona nazoratidir." },
        { name: "Ahmad S.", position: "Ombor menejeri", quote: "Hozirgi kunda qarzdorliklar bo'yicha hech qanday muammo bo'lmayapti." },
      ],
      ru: [
        { name: "Малика К.", position: "Менеджер по продажам", quote: "Что мне больше всего нравится в iQUB, так это контроль склада." },
        { name: "Ахмад С.", position: "Менеджер склада", quote: "На данный момент проблем с задолженностью нет." },
      ],
      en: [
        { name: "Malika K.", position: "Sales Manager", quote: "My favorite part of iQUB is the warehouse control." },
        { name: "Ahmad S.", position: "Warehouse Manager", quote: "Currently, there are no problems with debt." },
      ]
    }
  };

  // API Routes
  app.get("/api/faqs", (req, res) => {
    const lang = (req.query.lang as string) || "uz";
    const faqs = db.faqs[lang as keyof typeof db.faqs] || db.faqs.uz;
    res.json(faqs);
  });

  app.get("/api/dashboard", (req, res) => {
    res.json(db.dashboard);
  });

  app.get("/api/features", (req, res) => {
    const lang = (req.query.lang as string) || "uz";
    const features = (db as any).features?.[lang] || (db as any).features?.uz || [];
    res.json(features);
  });

  app.get("/api/testimonials", (req, res) => {
    const lang = (req.query.lang as string) || "uz";
    const testimonials = (db as any).testimonials?.[lang] || (db as any).testimonials?.uz || [];
    res.json(testimonials);
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    // Simple mock auth
    if (email === "admin@iqub.uz" && password === "admin123") {
      res.json({ success: true, user: { name: "Admin", email: "admin@iqub.uz" } });
    } else {
      res.status(401).json({ success: false, message: "Email yoki parol noto'g'ri" });
    }
  });

  app.post("/api/auth/signup", (req, res) => {
    const { name, email, password } = req.body;
    // Mock signup
    res.json({ success: true, user: { name, email } });
  });

  // Catch-all for API routes to return JSON 404
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: "API route not found" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
