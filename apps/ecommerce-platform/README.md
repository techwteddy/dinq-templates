# HealMitra E-Commerce Website

A production-ready e-commerce website for HealMitra, an Ayurvedic wellness brand selling natural hair care and skincare products.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Supabase
- **Payment:** Razorpay
- **State Management:** Zustand
- **Form Validation:** React Hook Form + Zod
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Features

- 🛍️ Complete e-commerce functionality
- 🎨 Beautiful Ayurvedic-themed design
- 📱 Fully responsive (mobile, tablet, desktop)
- 🛒 Shopping cart with persistent state
- 💳 Razorpay payment integration
- 📦 Order management system
- 🔍 Product filtering and search
- ✨ Smooth animations and transitions
- 🌿 SEO optimized

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account
- Razorpay account (for payments)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd healmitra-ecommerce
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:
- Supabase URL and keys
- Razorpay keys
- Site URL

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Database Setup

The project uses Supabase with the following tables:
- `products` - Product catalog
- `customers` - Customer information
- `addresses` - Shipping addresses
- `orders` - Order records
- `order_items` - Order line items
- `cart_items` - Shopping cart
- `reviews` - Product reviews

Refer to the specification document for the complete database schema.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── cart/              # Cart page
│   ├── checkout/          # Checkout page
│   ├── products/          # Product detail pages
│   └── shop/              # Shop page
├── components/            # React components
│   ├── home/             # Homepage sections
│   ├── layout/           # Layout components
│   ├── product/          # Product components
│   └── ui/               # UI components
├── lib/                   # Utility libraries
│   ├── supabase/         # Supabase clients
│   ├── utils.ts          # Helper functions
│   └── razorpay.ts       # Razorpay utilities
├── store/                 # Zustand stores
├── types/                 # TypeScript types
└── hooks/                 # Custom React hooks
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Design System

### Colors
- **Primary Sage Green:** #8B9D6D
- **Cream Background:** #F5F5F0
- **Charcoal Text:** #2C2C2C
- **Accent Orange:** #D97642
- **Deep Forest Green:** #2C5F2D

### Typography
- **Headings:** Playfair Display
- **Body:** Inter

## Deployment

The site is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Business Rules

- **Shipping:** FREE on orders ≥ ₹499, otherwise ₹49
- **Tax:** 18% GST on subtotal
- **Payment Methods:** Online (Razorpay) and Cash on Delivery
- **Delivery:** 2-4 days (Maharashtra), 4-7 days (Rest of India)

## License

All rights reserved © 2026 HealMitra – Ayurvedic Wellness

## Contact

- **Email:** healmitraayurvedicproducts@gmail.com
- **Phone:** +91 9322318810
- **Location:** Jalna, Maharashtra, India
- **UDYAM:** UDYAM-MH-13-0101419
