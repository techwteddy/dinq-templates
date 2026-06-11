# Project Kickoff Questionnaire

Use this questionnaire with Claude Code to plan and set up your Solana fullstack web app. Copy the sections you need or use the full questionnaire.

---

## Quick Start Prompt

Copy and paste this to Claude to get started:

```
I want to build a new Solana web app. Please ask me the project kickoff questions to understand what I'm building, then help me set up the project structure and configuration.
```

---

## Full Questionnaire

### 1. Project Overview

**What are you building?**
- [ ] DeFi app (swaps, lending, staking, etc.)
- [ ] NFT marketplace or collection
- [ ] Token launchpad or creator tools
- [ ] DAO or governance platform
- [ ] Gaming / GameFi
- [ ] Social / community platform
- [ ] Payment / commerce app
- [ ] Portfolio tracker / analytics
- [ ] Other: _______________

**Describe your project in 1-2 sentences:**
> _Your answer here_

**Who is your target user?**
> _Your answer here_

---

### 2. Solana Program Requirements

**Do you need custom on-chain programs?**
- [ ] Yes, I need to write Solana programs
- [ ] No, I'm only interacting with existing programs
- [ ] Not sure yet

**If yes, what does your program need to do?**
> _Your answer here_

**Program framework preference:**
- [ ] Anchor (recommended for most projects - faster development, built-in security)
- [ ] Pinocchio (for performance-critical programs - lower CU, smaller binary)
- [ ] Native Rust (maximum control, no framework)
- [ ] Not sure - help me decide

**Will your program handle tokens?**
- [ ] Yes, SPL Token (classic)
- [ ] Yes, Token-2022 (with extensions like transfer fees, confidential transfers)
- [ ] Yes, both
- [ ] No tokens
- [ ] Not sure

---

### 3. Frontend Setup

**Framework:**
- [ ] Next.js 15 (recommended - App Router, Server Components)
- [ ] Next.js 14 (Pages Router)
- [ ] Vite + React
- [ ] Other: _______________

**Styling approach:**
- [ ] Tailwind CSS (recommended)
- [ ] CSS Modules
- [ ] Styled Components / Emotion
- [ ] Other: _______________

**UI Component library:**
- [ ] shadcn/ui (recommended - copy/paste components, full control)
- [ ] Radix UI (headless primitives)
- [ ] Chakra UI
- [ ] Material UI
- [ ] Build from scratch
- [ ] Other: _______________

**Design preferences:**
- [ ] Dark mode only
- [ ] Light mode only
- [ ] Both (with toggle)
- [ ] System preference

**Do you have existing designs?**
- [ ] Yes, Figma/design files
- [ ] Yes, reference sites I want to match
- [ ] No, need design guidance
- [ ] Minimal UI is fine

---

### 4. Wallet & Authentication

**Wallet connection approach:**
- [ ] Wallet Standard only (recommended - modern, multi-wallet)
- [ ] Specific wallets (Phantom, Solflare, etc.)
- [ ] WalletConnect
- [ ] Not sure

**Additional authentication needed?**
- [ ] No, wallet-only auth
- [ ] Yes, email/password
- [ ] Yes, social login (Google, Twitter, etc.)
- [ ] Yes, passkeys/WebAuthn
- [ ] Magic link / passwordless

**Auth provider (if needed):**
- [ ] Supabase Auth (recommended)
- [ ] NextAuth.js
- [ ] Clerk
- [ ] Auth0
- [ ] Custom implementation

---

### 5. Database & Backend

**Do you need a database?**
- [ ] Yes
- [ ] No, on-chain data only
- [ ] Not sure

**If yes, what data needs to be stored off-chain?**
- [ ] User profiles / preferences
- [ ] Transaction history / analytics
- [ ] Content (posts, comments, etc.)
- [ ] Files / media metadata
- [ ] Other: _______________

**Database preference:**
- [ ] Supabase (recommended - Postgres + realtime + auth + storage)
- [ ] PlanetScale (MySQL)
- [ ] Neon (Postgres)
- [ ] MongoDB
- [ ] SQLite (local/simple)
- [ ] Other: _______________

**ORM preference:**
- [ ] Prisma (recommended - type-safe, great DX)
- [ ] Drizzle
- [ ] Raw SQL
- [ ] Other: _______________

**Do you need realtime features?**
- [ ] Yes (live updates, notifications, chat)
- [ ] No
- [ ] Maybe later

---

### 6. API & Data Fetching

**API approach:**
- [ ] Server Actions (Next.js - recommended for simple cases)
- [ ] tRPC (type-safe API)
- [ ] REST API
- [ ] GraphQL
- [ ] Combination

**External APIs you'll integrate:**
- [ ] Jupiter (swaps)
- [ ] Helius (RPC, webhooks, DAS)
- [ ] Birdeye (price data)
- [ ] Magic Eden (NFT data)
- [ ] Tensor (NFT data)
- [ ] CoinGecko / CoinMarketCap
- [ ] Other: _______________

**RPC provider:**
- [ ] Helius (recommended)
- [ ] QuickNode
- [ ] Triton
- [ ] Alchemy
- [ ] Public RPC (devnet only)
- [ ] Self-hosted

---

### 7. File Storage

**Do you need file/media storage?**
- [ ] Yes
- [ ] No
- [ ] Maybe later

**If yes, what types?**
- [ ] Images (avatars, thumbnails)
- [ ] NFT metadata / assets
- [ ] Documents
- [ ] Large files / videos

**Storage preference:**
- [ ] Supabase Storage (recommended if using Supabase)
- [ ] AWS S3
- [ ] Cloudflare R2
- [ ] IPFS / Arweave (for permanent/decentralized)
- [ ] Uploadthing
- [ ] Other: _______________

---

### 8. Deployment & Infrastructure

**Deployment target:**
- [ ] Vercel (recommended for Next.js)
- [ ] Netlify
- [ ] Railway
- [ ] AWS
- [ ] Self-hosted
- [ ] Other: _______________

**Environment needs:**
- [ ] Development (local)
- [ ] Staging (devnet)
- [ ] Production (mainnet)

**Do you need background jobs/workers?**
- [ ] Yes (indexing, notifications, etc.)
- [ ] No
- [ ] Not sure

---

### 9. Testing Requirements

**Testing approach:**
- [ ] Unit tests (Vitest/Jest)
- [ ] Integration tests
- [ ] E2E tests (Playwright/Cypress)
- [ ] Program tests (LiteSVM/Mollusk)
- [ ] Minimal/manual testing only

**CI/CD:**
- [ ] GitHub Actions (recommended)
- [ ] Other CI
- [ ] None yet

---

### 10. Project Structure

**Monorepo or single app?**
- [ ] Monorepo (recommended for program + frontend + shared packages)
- [ ] Single app (frontend only)
- [ ] Not sure

**If monorepo, what packages?**
- [ ] Frontend (Next.js)
- [ ] Backend API
- [ ] Solana programs
- [ ] Shared types/utils
- [ ] Marketing site
- [ ] Mobile app

---

### 11. Timeline & Priorities

**What's the priority order?**
1. _______________
2. _______________
3. _______________

**MVP scope - what's the minimum to launch?**
> _Your answer here_

**Any hard deadlines?**
> _Your answer here_

---

### 12. Existing Code & Constraints

**Starting from:**
- [ ] Scratch (new project)
- [ ] Existing codebase (need to integrate)
- [ ] Fork of another project
- [ ] Template (create-solana-dapp, etc.)

**Any technical constraints?**
> _Your answer here_

**Team size:**
- [ ] Solo developer
- [ ] Small team (2-5)
- [ ] Larger team (5+)

---

## After Answering

Once you've filled this out, Claude can help you:

1. **Generate project structure** - Create the folder layout and initial files
2. **Configure tooling** - Set up TypeScript, ESLint, Prettier, etc.
3. **Set up database schema** - Design your Prisma/Supabase schema
4. **Create component library** - Set up shadcn/ui with your theme
5. **Configure Solana** - Set up wallet connection, RPC, program clients
6. **Plan the build** - Break down into tasks and milestones

---

## Example Usage

```
I filled out the project kickoff questionnaire:

**Building:** NFT marketplace for music artists
**Target user:** Independent musicians who want to sell music NFTs
**Programs:** Yes, need custom marketplace program
**Framework preference:** Anchor
**Frontend:** Next.js 15, Tailwind, shadcn/ui, dark mode
**Auth:** Wallet-only
**Database:** Supabase for user profiles and listings cache
**Storage:** Supabase Storage + Arweave for NFT assets
**Deploy:** Vercel
**Priority:** 1) Minting flow 2) Marketplace listings 3) Artist profiles

Please help me set up the project structure and create the initial configuration files.
```
