# lifebeet

Lifebeet is a Next.js 15 + Supabase app with Prisma ORM for multi-tenant finance tracking. Users manage income, expenses, purchases, and exchange rates in PYG/USD with auto conversion. UI uses Tailwind + DaisyUI, dashboards support SSR, and RLS secures tenant data.

## Features

- 🏢 **Multi-tenant Architecture**: Isolated data per organization/tenant
- 🔐 **Secure Authentication**: Powered by Supabase Auth with Row Level Security
- 💰 **Expense Management**: Track regular, fixed, and variable expenses
- 💵 **Income Tracking**: Record and categorize income sources
- 🛒 **Purchase Tracking**: Monitor purchases by store
- 💱 **Currency Conversion**: Automatic USD ↔ PYG conversion with historical rates
- 🎨 **Modern UI**: Tailwind CSS + DaisyUI with dark mode support
- ⚡ **Server-Side Rendering**: Fast page loads with Next.js App Router
- 📊 **Dashboard**: Real-time financial overview
- 🔄 **Comparison Tools**: Compare financial data across periods

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Authentication**: Supabase Auth
- **UI**: Tailwind CSS + DaisyUI
- **Deployment**: Docker + GitHub Packages

## Quick Start

See [SETUP.md](./SETUP.md) for detailed setup instructions.

```bash
# 1. Clone and install
git clone <repository-url>
cd lifebeet
npm install

# 2. Configure environment variables (see .env.example)
cp .env.example .env
# Edit .env with your Supabase credentials

# 3. Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# 4. (Optional) Seed sample data
npx prisma db seed

# 5. Run development server
npm run dev
```

## Pages

- **Authentication**: `/auth/login`, `/auth/signup`
- **Dashboard**: `/dashboard` - Overview of finances with stats
- **Expenses**: `/expenses` - Manage all types of expenses
- **Income**: `/income` - Track income sources
- **Purchases**: `/purchases` - Monitor purchases by store
- **Settings**: `/settings` - Tenant and exchange rate management

## Database Schema

### Core Models

- **Tenant**: Organization/company entity
- **User**: Users belonging to tenants
- **Category**: Expense and income categories
- **ExchangeRate**: USD/PYG conversion rates with historical data

### Financial Models

- **Expense**: General expenses
- **Income**: Income entries
- **FixedExpense**: Recurring fixed expenses (rent, subscriptions)
- **VariableExpense**: Variable recurring expenses
- **Purchase**: Store purchases
- **Comparison**: Period-based financial comparisons

## Currency Support

- **PYG** (Paraguayan Guaraní): Primary currency
- **USD** (US Dollar): Secondary currency
- Automatic conversion based on latest exchange rate

## Security

- Row Level Security (RLS) enabled on all tables
- Tenant data isolation enforced at database level
- Secure authentication with Supabase
- Middleware-based route protection

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# Seed database
npx prisma db seed
```

## Deployment

### Docker (Recommended)

The application is containerized and published to GitHub Container Registry.

```bash
# Pull the latest image
docker pull ghcr.io/devpbeat/lifebeet:latest

# Run with Docker
docker run -d \
  --name lifebeet \
  -p 3000:3000 \
  --env-file .env \
  ghcr.io/devpbeat/lifebeet:latest

# Or use Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

See [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md) for complete deployment instructions including:
- GitHub Container Registry setup
- Portainer deployment
- Reverse proxy configuration
- Monitoring and troubleshooting

### CI/CD

GitHub Actions automatically builds and pushes Docker images to GHCR on every push to main.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

