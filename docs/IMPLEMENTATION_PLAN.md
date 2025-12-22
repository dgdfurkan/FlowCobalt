# FlowCobalt Site Implementation Plan

## 🎯 Proje Hedefi

Relevance AI benzeri modern, responsive bir web sitesi oluşturmak:
- GitHub Pages'te yayınlanabilir (statik)
- Supabase ile admin panel + tracking
- Telegram bildirimleri
- Modern UI/UX (Relevance AI referanslı)

---

## 📋 ÖN HAZIRLIK - SİZDEN İSTEDİKLERİM

### 1. GitHub Repository ⚠️ ÖNEMLİ
- [ ] **GitHub repo oluşturun** (public veya private, tercihinize göre)
- [ ] **Repo adı önerisi:** `flowcobalt-website` veya `flowcobalt-site`
- [ ] **README.md** hazır (zaten var)
- [ ] **.gitignore** ekleyin (node_modules, .env, vb.)

**Neden gerekli?**
- GitHub Pages için repo şart
- Kod versiyonlaması için
- Deploy için

### 2. Supabase Projesi ⚠️ ÖNEMLİ
- [ ] **Supabase hesabı** oluşturun (ücretsiz tier yeterli)
- [ ] **Yeni proje** oluşturun
- [ ] **Project URL** ve **anon key** alın (bana vereceksiniz)
- [ ] **Edge Functions** aktif mi kontrol edin

**Neden gerekli?**
- Admin panel authentication
- Visitor tracking
- Telegram notifications (edge function ile)
- IP geolocation

**Not:** Supabase kurulumunu ben yapabilirim, ama sizden URL ve key gerekiyor.

### 3. Telegram Bot (Opsiyonel - sonra eklenebilir)
- [ ] **Telegram Bot** oluşturun (@BotFather ile)
- [ ] **Bot Token** alın
- [ ] **Chat ID** alın (bildirimlerin gideceği chat)

**Not:** Bu şimdilik opsiyonel, tracking sistemi kurulduktan sonra eklenebilir.

### 4. Domain (Opsiyonel - sonra)
- [ ] **Custom domain** varsa hazırlayın
- [ ] GitHub Pages'e bağlamak için DNS ayarları gerekli

---

## 🚀 BENİM YAPACAKLARIM - ADIM ADIM PLAN

### FAZE 1: Proje Kurulumu ve Temel Yapı

#### 1.1 Proje Yapısı Oluşturma
- [x] Logo ekleme (`public/images/logo/`)
- [ ] **Tech stack seçimi:**
  - **Framework:** Next.js (static export) veya Vite + React
  - **Styling:** Tailwind CSS (Relevance AI benzeri)
  - **Animations:** GSAP + ScrollTrigger
  - **Build:** Static HTML/CSS/JS (GitHub Pages uyumlu)

#### 1.2 Dosya Yapısı
```
/
├── public/
│   ├── images/
│   │   └── logo/
│   │       └── FlowCobaltLogo.png ✅
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── Pricing.tsx
│   │   │   └── CTA.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Input.tsx
│   ├── pages/
│   │   ├── index.tsx (Home)
│   │   ├── pricing.tsx
│   │   ├── blog.tsx
│   │   └── admin/
│   │       └── index.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── tracking.ts
│   │   └── telegram.ts
│   ├── styles/
│   │   └── globals.css
│   └── utils/
├── infra/
│   └── supabase/
│       ├── schema.sql
│       ├── migrations/
│       └── edge-functions/
│           └── track-visit.ts
├── docs/
│   └── (mevcut dokümantasyonlar)
└── resources/
    └── clone_reference/
        └── (mevcut referanslar)
```

#### 1.3 Package.json ve Dependencies
```json
{
  "dependencies": {
    "react": "^18.x",
    "next": "^14.x" (veya vite),
    "tailwindcss": "^3.x",
    "gsap": "^3.12.2",
    "@supabase/supabase-js": "^2.x",
    "framer-motion": "^10.x" (opsiyonel)
  }
}
```

---

### FAZE 2: Design System ve Styling

#### 2.1 Design Tokens (Relevance AI referanslı)
- [ ] **Renkler:** Mor/purple gradient (#685FFF, #A4A1FF)
- [ ] **Tipografi:** Inter, Noto Sans (Relevance AI'den)
- [ ] **Spacing:** Tailwind default + custom
- [ ] **Border Radius:** 8-16px
- [ ] **Shadows:** Minimal, hafif

#### 2.2 Tailwind Config
- [ ] Custom colors (brand colors)
- [ ] Custom fonts
- [ ] Custom spacing
- [ ] Responsive breakpoints

#### 2.3 Global Styles
- [ ] Reset CSS
- [ ] Typography styles
- [ ] Utility classes

---

### FAZE 3: Core Components

#### 3.1 Layout Components
- [ ] **Header/Navigation**
  - Sticky header
  - Dropdown menüler
  - Mobile hamburger menu
  - Logo entegrasyonu

- [ ] **Footer**
  - Link kolonları
  - Sosyal medya linkleri
  - Copyright

#### 3.2 UI Components
- [ ] **Button** (primary, secondary, alternate)
- [ ] **Card** (feature cards, pricing cards)
- [ ] **Input** (form inputs)
- [ ] **Modal** (opsiyonel)

#### 3.3 Section Components
- [ ] **Hero Section**
  - Büyük başlık
  - 2 CTA butonu
  - Animasyonlar

- [ ] **Features Section**
  - Grid layout
  - Card components

- [ ] **Pricing Section**
  - Toggle (Annual/Monthly)
  - Pricing cards

- [ ] **CTA Section**
  - Footer CTA

---

### FAZE 4: Pages

#### 4.1 Public Pages
- [ ] **Homepage** (`/`)
  - Hero
  - Features
  - Testimonials (opsiyonel)
  - CTA

- [ ] **Pricing** (`/pricing`)
  - Pricing cards
  - Feature comparison

- [ ] **Blog** (`/blog`)
  - Blog list
  - Category filters

- [ ] **Diğer sayfalar** (ihtiyaca göre)

#### 4.2 Admin Pages
- [ ] **Admin Login** (`/admin/login`)
  - Supabase auth

- [ ] **Admin Dashboard** (`/admin`)
  - Visitor stats
  - Settings
  - Telegram config

---

### FAZE 5: Supabase Integration

#### 5.1 Database Schema
- [ ] **Admins/Users** tablosu
- [ ] **Visitors** tablosu
- [ ] **Visits** tablosu
- [ ] **Events** tablosu
- [ ] **Settings** tablosu

#### 5.2 Authentication
- [ ] Supabase Auth setup
- [ ] Admin login flow
- [ ] Protected routes

#### 5.3 Edge Functions
- [ ] **track-visit** function
  - IP alma
  - Geolocation
  - Visit kaydı
  - Telegram notification

---

### FAZE 6: Tracking System

#### 6.1 Visitor Tracking
- [ ] IP tracking (edge function)
- [ ] New vs returning visitor
- [ ] Page view tracking
- [ ] Event tracking (button clicks)

#### 6.2 Visit Algorithm
- [ ] Refresh = new visit
- [ ] Tab switch = not new visit
- [ ] Route change = not new visit

#### 6.3 Admin Dashboard
- [ ] Visitor stats
- [ ] Visit history
- [ ] Event logs

---

### FAZE 7: Telegram Integration

#### 7.1 Bot Setup
- [ ] Bot token config
- [ ] Chat ID config
- [ ] Muted IPs list

#### 7.2 Notifications
- [ ] New visitor notification
- [ ] Returning visitor notification
- [ ] Custom messages

---

### FAZE 8: Animations & Interactions

#### 8.1 GSAP Animations
- [ ] ScrollTrigger setup
- [ ] Text reveal animations
- [ ] Scroll-based animations

#### 8.2 Interactions
- [ ] Hover effects
- [ ] Button animations
- [ ] Card animations

---

### FAZE 9: Responsive Design

#### 9.1 Breakpoints
- [ ] Mobile (< 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (> 1024px)
- [ ] Ultra-wide (> 1920px)

#### 9.2 Testing
- [ ] 1366x768 test
- [ ] Mobile test
- [ ] Tablet test

---

### FAZE 10: Build & Deploy

#### 10.1 Static Build
- [ ] Next.js static export (veya Vite build)
- [ ] Asset optimization
- [ ] SEO optimization

#### 10.2 GitHub Pages Setup
- [ ] GitHub Actions workflow
- [ ] Deploy script
- [ ] Custom domain (opsiyonel)

#### 10.3 Testing
- [ ] Local test
- [ ] Production test
- [ ] Supabase connection test

---

## 📝 ÖNCELİK SIRASI

### İlk Sprint (Hemen Başlayabiliriz)
1. ✅ Logo ekleme
2. ⏳ Proje yapısı kurulumu
3. ⏳ Design tokens
4. ⏳ Header/Footer components
5. ⏳ Homepage temel yapı

### İkinci Sprint
6. ⏳ Supabase setup
7. ⏳ Admin panel
8. ⏳ Tracking system

### Üçüncü Sprint
9. ⏳ Telegram integration
10. ⏳ Animations
11. ⏳ Responsive polish

---

## ❓ SİZDEN ONAY BEKLEDİKLERİM

### Tech Stack Onayı
- [ ] **Next.js** mi yoksa **Vite + React** mi? (Ben Next.js öneriyorum - static export için)
- [ ] **Tailwind CSS** onaylı mı?
- [ ] **GSAP** animasyonlar için onaylı mı?

### Proje Yapısı
- [ ] Dosya yapısı uygun mu?
- [ ] Klasör isimleri uygun mu?

### Öncelikler
- [ ] Hangi sayfalar önce yapılsın? (Homepage, Pricing, Blog?)
- [ ] Admin panel öncelikli mi?

---

## 🎯 BAŞLAMAK İÇİN

**Sizden beklediklerim:**
1. ✅ Logo eklendi
2. ⏳ GitHub repo oluşturun (veya bana repo adı verin)
3. ⏳ Supabase projesi oluşturun (veya bana URL/key verin)
4. ⏳ Tech stack onayı

**Ben başlayabilirim:**
- Proje yapısını oluşturabilirim
- Design tokens'ı ekleyebilirim
- Temel component'leri yazabilirim

---

## 📞 SORULARIM

1. **GitHub repo** hazır mı? Repo adı nedir?
2. **Supabase** projesi var mı? Yoksa ben mi oluşturayım?
3. **Tech stack** onaylı mı? (Next.js + Tailwind + GSAP)
4. **İlk sayfa** hangisi olsun? (Homepage öneriyorum)
5. **Admin panel** şimdilik basit mi olsun, yoksa tam özellikli mi?

---

**Hazır olduğunuzda "başla" deyin, ben de kodlamaya başlayacağım! 🚀**

