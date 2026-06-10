<div align="center">

# KeyCloud | Premium Mechanical Keyboard Experience

[![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge&logo=vercel)](https://your-demo-link.com)
[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%2016%20•%20TypeScript%20•%20GSAP%20•%20Tailwind-blue?style=for-the-badge)](https://nextjs.org)

<p align="center">
  <a href="#tr-türkçe-proje-dokümantasyonu">🇹🇷 TÜRKÇE DOKÜMANTASYON</a> &nbsp;|&nbsp; 
  <a href="#en-english-project-documentation">🇬🇧 ENGLISH DOCUMENTATION</a>
</p>

</div>

---

# [TR] Türkçe Proje Dokümantasyonu

Ödül alabilecek kalitede (`Awwwards`), hikaye anlatımı odaklı ve yüksek performanslı bir mekanik klavye tanıtım sitesi. Bu proje, standart bir web sitesinden ziyade, **fizik tabanlı etkileşimler, gerçek zamanlı ses sentezi ve sinematik kaydırma deneyimi** sunan interaktif bir sanat eseridir.

**İş Verenler İçin Not:** Bu proje, sadece arayüz kodlaması değil; **performans mimarisi, GPU optimizasyonu, Canvas programlama ve gelişmiş kullanıcı deneyimi (UX)** mühendisliği yeteneklerini sergilemek amacıyla geliştirilmiştir.

## 🏗️ Proje Mimarisi ve Dosya Yapısı

Bir geliştiricinin projeye dahil olduğunda neyin nerede olduğunu ve **neden** orada olduğunu anlaması için detaylı döküm:

```bash
/
├── app/                        # Next.js App Router Yapısı
│   ├── page.tsx               # [LCP Optimizasyonu] Ana sayfa. Ağır bileşenler (Dynamic Imports) ile burada lazy-load edilir.
│   ├── layout.tsx             # Global Fontlar (Space Grotesk & Inter) ve Metadata ayarları.
│   └── globals.css            # Tailwind direktifleri ve CSS değişkenleri.
│
├── components/                 # Modüler Bileşen Kütüphanesi
│   ├── Hero.tsx               # [İlk İzlenim] Açılış sekansı, video background ve staggered text animasyonları.
│   ├── SoundWaveSection.tsx   # [Web Audio API] Scroll hızına göre değişen ses sentezi (Thock effect) ve Canvas vizualizasyonu.
│   ├── HorizontalGallery.tsx  # [GSAP ScrollTrigger] Dikey scroll'u yatay galeriye çeviren pinleme mantığı. GPU hızlandırmalı.
│   ├── MagneticFooter.tsx     # [Fizik Motoru] Mouse hareketine vektörel tepki veren manyetik CTA butonu.
│   ├── DeepDiveFeatures.tsx   # [Paralaks] Çok katmanlı ürün detay anlatımı. Scroll hızına göre derinlik algısı.
│   ├── SpecsGrid.tsx          # [Bento Grid] Teknik özellikleri modern, responsive grid yapısında sunar.
│   ├── Testimonials.tsx       # [Infinite Marquee] Sonsuz döngülü kullanıcı yorumları animasyonu.
│   ├── Navbar.tsx             # Scroll yönüne duyarlı, glassmorphism efektli navigasyon.
│   ├── Loader.tsx             # Site varlıkları yüklenirken kullanıcıyı karşılayan preloader.
│   ├── SmoothScroll.tsx       # Lenis tabanlı yumuşak kaydırma (momentum scroll) entegrasyonu.
│   ├── Hotspot.tsx            # Ürün üzerindeki interaktif bilgi noktaları (Tooltip).
│   ├── FinalCTA.tsx           # (Eski) Alternatif kapanış bileşeni.
│   └── Footer.tsx             # (Eski) Standart footer bileşeni.
│
├── public/
│   ├── images/
│   │   └── gallery/           # [SVG Optimizasyonu] Teknik şemalar vektörel formatta tutularak retina ekranlarda keskinlik sağlanır.
│
└── tailwind.config.ts          # Özel renk paleti (#F97316 - Neon Orange) ve tasarım sistemi tanımları.
```

## � Teknik Özellikler ve Mühendislik Kararları

### 1. Performans Mühendisliği (Web Vitals)
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
*   **Main Thread Blocking Önleme:** Canvas çizimleri `requestAnimationFrame` ile yapılırken, bileşen viewport dışına çıktığı an döngü durdurulur. Bu, mobil cihazlarda pil tüketimini ve ısınmayı engeller.
*   **GPU Offloading:** Kaydırma animasyonlarında `force3D: true` ve `will-change: transform` kullanılarak render yükü CPU'dan GPU'ya aktarılır.

### 2. Audio Mühendisliği (Web Audio API)
Sitede statik ses dosyası yoktur. "Thock" sesi, tarayıcı içinde matematiksel osilatörler kullanılarak **prosedürel olarak** üretilir.
*   **Velocity Mapping:** Kullanıcı ne kadar hızlı kaydırırsa, sesin sıklığı ve tonu ona göre değişir. Bu, kullanıcıya "kontrol bende" hissi verir.

### 3. İleri Düzey Animasyon (GSAP)
Standart CSS geçişleri yerine GreenSock Animation Platform (GSAP) kullanılmıştır.
*   **Scrubbing:** Animasyonlar zaman çizelgesine değil, kullanıcının kaydırma pozisyonuna (scroll progress) bağlıdır.
*   **Pinning:** Belirli bölümler ekrana sabitlenirken içerik akmaya devam eder (Örn: Yatay Galeri).

---

## 💻 Kurulum

Projeyi kendi bilgisayarınızda çalıştırmak için:

```bash
# 1. Repoyu klonlayın
git clone https://github.com/m0Corut/keyboard-premium-landing-page.git

# 2. Klasöre girin
cd keyboard-premium-landing-page

# 3. Bağımlılıkları yükleyin
npm install

# 4. Geliştirme sunucusunu başlatın
npm run dev
```

---

<br>
<br>

# [EN] English Project Documentation

A premium, Awwwards-caliber landing page for a high-end mechanical keyboard. This project is built to demonstrate **advanced frontend engineering**, focusing on physics-based interactions, procedural audio synthesis, and cinematic storytelling through code.

**Note for Recruiters:** This repository showcases capabilities in **Performance Architecture, GPU Optimization, Creative Coding (Canvas), and Advanced UX Engineering**.

## 🏗️ Project Architecture & File Anatomy

A complete breakdown for developers to understand the "What" and "Why" of the codebase:

```bash
/
├── app/                        # Next.js App Router Structure
│   ├── page.tsx               # [LCP Optimized] Main Entry. Heavy components are lazy-loaded here using Dynamic Imports.
│   ├── layout.tsx             # Global Fonts (Space Grotesk & Inter) and SEO Metadata.
│   └── globals.css            # Tailwind directives and CSS variables.
│
├── components/                 # Modular Component Library
│   ├── Hero.tsx               # [First Impression] Opening sequence, video background, and staggered text reveals.
│   ├── SoundWaveSection.tsx   # [Web Audio API] Procedural sound synthesis (Thock effect) & breakdown of the Canvas setup.
│   ├── HorizontalGallery.tsx  # [GSAP ScrollTrigger] Transforms vertical scroll logic into a horizontal timeline. GPU accelerated.
│   ├── MagneticFooter.tsx     # [Physics Engine] CTA button that reacts to mouse vectors with magnetic pull.
│   ├── DeepDiveFeatures.tsx   # [Parallax] Multi-layer product breakdown. Depth perception based on scroll velocity.
│   ├── SpecsGrid.tsx          # [Bento Grid] Technical specifications presented in a modern, responsive grid.
│   ├── Testimonials.tsx       # [Infinite Marquee] Smooth, infinite scrolling loop of user reviews.
│   ├── Navbar.tsx             # Scroll-direction aware navigation with glassmorphism support.
│   ├── Loader.tsx             # Initial preloader to ensure assets are ready before the experience starts.
│   ├── SmoothScroll.tsx       # Lenis-based momentum scrolling wrapper.
│   ├── Hotspot.tsx            # Interactive tooltips on product images.
│   ├── FinalCTA.tsx           # (Legacy) Alternative footer component.
│   └── Footer.tsx             # (Legacy) Standard footer component.
│
├── public/
│   ├── images/
│   │   └── gallery/           # [SVG Optimized] Technical schematics kept in vector format for sharpness.
│
└── tailwind.config.ts          # Custom Design System configuration (Colors, Typography).
```

## 🚀 Engineering Highlights

### 1. Performance Architecture (Web Vitals)
*   **Strategic Lazy Loading:** Heavy interactive sections (`SoundWaveSection`, `HorizontalGallery`) are isolated and loaded only when approaching the viewport.
*   **Main Thread Optimization:** The Canvas animation loop is strictly managed via `IntersectionObserver`. It pauses immediately when off-screen to prevent battery drain.
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router & Turbopack)

### 2. Audio Engineering (Web Audio API)
No static audio files are used for interactions. The "Thock" sound is generated **prosedurally** in real-time.
*   **Velocity Mapping:** The output audio density tracks the user's scroll velocity. Faster scrolling creates a typing-like rhythm.

### 3. Advanced Choreography (GSAP)
Beyond simple fade-ins, this project uses complex timelines tied to user interaction.
*   **Scrubbing & Pinning:** The interface locks and scrubs through animations based on precise scroll progress, giving users frame-by-frame control over the narrative suitable for technical product showcases.

---

## 💻 Getting Started

To run this project locally:

```bash
# 1. Clone the repository
git clone https://github.com/m0Corut/keyboard-premium-landing-page.git

# 2. Navigate to directory
cd keyboard-premium-landing-page

# 3. Install dependencies
npm install

# 4. Run development server
npm run dev
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
