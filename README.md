# مشويات أيادينا — منصة المطعم الرقمية
# Ayadina Restaurant Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/Aiven-MySQL-4479A1?logo=mysql&logoColor=white)](https://aiven.io/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

منصة ويب متكاملة لمطعم **مشويات أيادينا** لإدارة القائمة والعروض وعرضها للزوار بواجهة ثنائية اللغة (العربية / الإنجليزية)، متجاوبة بالكامل، مع لوحة تحكم إدارية محمية.

A full-stack restaurant platform for **Ayadina Grills**: public menu & offers, bilingual Arabic/English UI, and a secured admin dashboard for content management.

Built with **Next.js (App Router)**, **Prisma**, **Aiven MySQL**, and **ImgBB** for image hosting.

---

## نظرة عامة | Overview

يوفّر المشروع موقعًا عامًا للزوار (القائمة، العروض، من نحن، تواصل) ولوحة إدارة لتعديل التصنيفات والأطباق والعروض ورفع الصور.

The public site serves the menu, offers, about, and contact pages. Administrators authenticate with JWT and manage catalog data through REST API routes backed by Prisma.

| | العربية | English |
| --- | --- | --- |
| **الجمهور** | زوار المطعم | Restaurant guests |
| **الإدارة** | لوحة تحكم CRUD | Admin CRUD dashboard |
| **اللغات** | عربي (افتراضي) + إنجليزي | Arabic (default) + English |
| **الاستضافة** | Vercel (فرع `main`) | Vercel (`main` production) |

---

## المميزات | Features

- **دعم ثنائي اللغة (AR / EN)** — تبديل فوري للواجهة مع محتوى عربي وإنجليزي مخزَّن في قاعدة البيانات.
- **لوحة تحكم إدارية** — إنشاء وتعديل وحذف التصنيفات، الأطباق، والعروض (CRUD).
- **رفع الصور السحابي** — رفع صور الأطباق والعروض عبر **ImgBB API** وإرجاع رابط HTTPS جاهز للحفظ.
- **مصادقة JWT** — تسجيل دخول الأدمن عبر `bcryptjs` ومسارات `/api/auth/login` مع حماية مسارات الإدارة والرفع.
- **تصميم متجاوب** — واجهة Tailwind CSS تعمل على الجوال والكمبيوتر، مع اتجاه RTL للعربية.

---

## التقنيات | Tech Stack

| الطبقة | التقنية |
| --- | --- |
| الإطار | Next.js 16 (App Router) + TypeScript |
| الواجهة | React 19 + Tailwind CSS |
| جلب البيانات | SWR + طبقة `src/lib/api.ts` |
| قاعدة البيانات | Aiven Cloud MySQL |
| ORM | Prisma 6 |
| المصادقة | JWT (`jsonwebtoken`) + `bcryptjs` |
| الصور | ImgBB REST API |
| النشر | Vercel |

---

## البدء | Getting Started

### المتطلبات | Prerequisites

- Node.js 20+
- حساب [Aiven MySQL](https://aiven.io/) (أو أي خادم MySQL متوافق)
- مفتاح [ImgBB](https://api.imgbb.com/)

### 1. استنساخ المشروع وتثبيت الحزم

```bash
git clone <repository-url>
cd ayadina-restaurant
npm install
```

### 2. متغيرات البيئة | Environment variables

أنشئ ملف `.env` في جذر المشروع:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE?ssl-mode=REQUIRED"
JWT_SECRET="replace-with-a-long-random-secret"
IMGBB_API_KEY="your-imgbb-api-key"
```

| المتغير | الغرض |
| --- | --- |
| `DATABASE_URL` | سلسلة اتصال Aiven MySQL |
| `JWT_SECRET` | توقيع رموز جلسة الأدمن |
| `IMGBB_API_KEY` | رفع الصور من لوحة التحكم |

على Vercel أضف نفس المتغيرات في إعدادات المشروع (Production).

### 3. Prisma — التوليد والبذر

تأكد أن الجداول موجودة على قاعدة البيانات (`prisma db push` أو الهجرات)، ثم:

```bash
npx prisma generate
npx prisma db seed
```

> **ملاحظة:** سكربت `npm run build` على Vercel ينفّذ `prisma generate` ثم `prisma db seed` ثم `next build`. ملف البذر يستخدم `upsert` حتى لا تفشل عمليات البناء المتكررة بسبب المفاتيح المكررة.

### 4. تشغيل التطوير | Development

```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000).

لوحة الإدارة: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

---

## بيانات الأدمن الافتراضية | Default Admin Credentials

يُنشئ البذر حسابًا إداريًا أوليًا:

| الحقل | القيمة |
| --- | --- |
| اسم المستخدم | `admin` |
| كلمة المرور | `admin123` |

**غيّر كلمة المرور فورًا في بيئة الإنتاج.** لا تعتمد على هذه القيم في نظام حيّ.

---

## سكربتات npm | Scripts

```bash
npm run dev      # خادم التطوير
npm run build    # prisma generate + seed + next build
npm run start    # تشغيل البناء للإنتاج
npm run lint     # ESLint
```

---

## هيكل مبسّط | Project layout

```text
src/app/api/          # مسارات API (عام، أدمن، مصادقة، رفع)
src/components/       # واجهة الموقع ولوحة التحكم
src/context/          # DataContext + AuthContext
src/lib/              # Prisma، JWT، طبقة API
prisma/schema.prisma  # نماذج قاعدة البيانات
prisma/seed.ts        # بيانات أولية (upsert)
```

---

## الترخيص | License

مشروع خاص بمطعم مشويات أيادينا — الاستخدام وفق سياسة المستودع.
