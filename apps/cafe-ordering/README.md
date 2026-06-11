# ☕ Brew-Bite Cafe

> A modern, full-stack cafe ordering web app — browse the menu, add to cart, and place pickup or delivery orders in seconds.

---

## 🌐 Live Demo

🔗 **[brewbite.netlify.app](https://brewbite.netlify.app)**

---

## 📸 Screenshots

> _Visit the [live demo](https://brewbite.netlify.app) to see it in action._

---

## ✨ Features

- 🛒 **Cart system** — add, remove, and adjust quantities with persistent state (Zustand)
- 📋 **Menu browsing** — filter by category (Drink / Food) and subcategory (Coffee, Bakery, etc.)
- 🔍 **Search bar** — find items instantly
- 📦 **Order flow** — pickup or delivery, with customer name, phone, and notes
- ✅ **Order success page** — confirmation with order number and QR code
- 🗃️ **Supabase backend** — orders and menu items stored in a real database
- 🔔 **Toast notifications** — real-time feedback on every user action
- 📱 **Responsive design** — works seamlessly on mobile and desktop

---

## 🛠️ Tech Stack

| Layer         | Technology                                                                                                        |
| ------------- | ----------------------------------------------------------------------------------------------------------------- |
| Framework     | [Next.js 16](https://nextjs.org) (App Router)                                                                     |
| UI            | [Tailwind CSS](https://tailwindcss.com), [Radix UI](https://www.radix-ui.com), [shadcn/ui](https://ui.shadcn.com) |
| State         | [Zustand](https://zustand-demo.pmnd.rs)                                                                           |
| Data fetching | [TanStack Query (React Query)](https://tanstack.com/query)                                                        |
| Backend / DB  | [Supabase](https://supabase.com) (PostgreSQL)                                                                     |
| Icons         | [Lucide React](https://lucide.dev), [Tabler Icons](https://tabler.io/icons)                                       |
| Notifications | [React Hot Toast](https://react-hot-toast.com)                                                                    |
| QR Code       | [qrcode.react](https://github.com/zpao/qrcode.react)                                                              |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Eyasdm/brew-bite-website.git
cd brew-bite-website
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> You can find these in your [Supabase project dashboard](https://supabase.com/dashboard) under **Project Settings → API**.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗂️ Project Structure

```
brew-bite-website/
├── app/                  # Next.js App Router pages
│   ├── page.js           # Home page
│   ├── menu/             # Menu browsing page
│   ├── cart/             # Cart & checkout page
│   ├── about/            # About page
│   └── order/success/    # Order confirmation page
├── components/           # Reusable UI components
│   ├── ui/               # Base components (shadcn/ui pattern)
│   └── icons/            # Custom SVG icon components
├── hooks/                # Custom React hooks
├── lib/                  # Supabase client & utilities
├── store/                # Zustand state stores
└── public/               # Static assets
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Built with ☕ by Eyas — <a href="https://github.com/Eyasdm">GitHub</a> · <a href="https://www.linkedin.com/in/eyas-mohammed/">LinkedIn</a></p>
