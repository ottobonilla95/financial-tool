# Track My Spend

A bilingual (EN/ES) budgeting and expense tracking web application with AI-powered financial insights.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19-rc, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Neon serverless)
- **Auth**: NextAuth 5 (Credentials provider, bcrypt hashing)
- **Payments**: Hotmart (one-time purchases), Stripe (subscriptions)
- **AI**: OpenAI GPT-4o for financial advisor
- **Charts**: Nivo, Chart.js, AG Charts, Visx
- **Marketing**: Systeme.io (email automation), Facebook Pixel

## Commands

```bash
npm run dev      # Start dev server on port 3005
npm run build    # prisma generate && next build
npm start        # Production server on port 3005
```

## Project Structure

```
app/
├── api/                    # API routes (expense, income, hotmart, stripe, advisor)
└── [lang]/                 # i18n routes (en, es)
    ├── dashboard/          # Protected app pages
    ├── login/, signup/     # Auth pages
    └── pricing/            # Public pricing

src/
├── ui/
│   ├── components/         # Atomic design (atoms/molecules/organisms)
│   └── financial-app/      # App-specific components
├── data/                   # Prisma queries (data layer)
├── form-actions/           # Server actions (business logic)
├── translations/           # i18n JSON files (en.json, es.json)
└── types/                  # TypeScript interfaces
```

## Key Patterns

- **Server Components**: Default for data fetching with async/await
- **Server Actions**: Form submissions via `src/form-actions/`
- **Data Layer**: All Prisma queries in `src/data/` with type mapping
- **Atomic Design**: Components organized as atoms → molecules → organisms
- **i18n**: Dynamic `[lang]` route parameter, dictionary-based translations

## Naming Conventions

- Database fields: `snake_case` (user_id, created_at)
- TypeScript: `camelCase` for functions/variables
- Components: `PascalCase` (ExpensePieChart, DashboardTotals)
- Routes: `kebab-case` (/expense-categories)

## Hotmart Integration

User creation happens via webhooks when a purchase completes:

- `POST /api/hotmart/purchase-completed-es` (Spanish users)
- `POST /api/hotmart/purchase-completed-en` (English users)

Flow:
1. Webhook receives buyer email/name from Hotmart
2. Creates user with default password `Trackmyspend.24!` or updates existing user
3. Sets `subscription_plan: "lifetime"`, `pricing_group: "one_time_purchase"`
4. Syncs contact to Systeme.io with premium tags

## Authentication

- **Regular signup**: Email → Pricing → Complete registration → Stripe checkout
- **Hotmart purchase**: Webhook auto-creates user with lifetime access
- **Key user flags**:
  - `fully_signed_up`: true after completing registration + payment
  - `subscription_plan`: "lifetime" (Hotmart) or Stripe plan
  - `pricing_group`: "one_time_purchase" (Hotmart) or other groups

## Core Features

- Expense/income tracking with categories and subcategories
- Multi-currency support with exchange rates
- Emotional spending analysis (emotion + satisfaction 1-5)
- AI financial advisor (premium)
- Savings goals tracking
- Interactive dashboard with charts
- Onboarding tour (Reactour)

## MCP Endpoint

- **URL:** `https://trackmyspend.co/api/mcp`
- **Transport:** Streamable HTTP (POST for JSON-RPC, SSE responses)
- **Route:** `app/api/[transport]/route.ts`
- **Auth:** Uses `MCP_USER_ID` env var (bypasses NextAuth since MCP calls come from OpenClaw)
- **Tools:**
  - `parse_expenses` — AI-powered natural language expense parsing (uses GPT-4o)
  - `save_expenses` — Save confirmed parsed expenses to database
  - `get_summary` — Monthly spending summary with category breakdown
  - `get_dashboard_link` — Returns dashboard URLs
- **Flow:** parse_expenses (AI classifies) → user confirms → save_expenses (bulk create)
- **Key pattern:** Uses Prisma directly (not fetch to own API routes) to avoid Vercel serverless self-call deadlock

## Environment Variables

Required in `.env`:
- `DATABASE_URL` / `POSGRES_PRISMA_URL` - Neon PostgreSQL
- `AUTH_SECRET` - NextAuth secret
- `OPENAI_API_KEY` - AI advisor + MCP expense parsing
- `MCP_USER_ID` - User ID for MCP endpoint auth (single-user)
- `STRIPE_*` - Payment processing
- `SYSTEME_API_KEY` - Email marketing
- `HOTMART_CHECKOUT_URL_ES/EN` - Checkout links
- `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` - Analytics

## Git

- Always use `ottobonilla95` as the git user

## Important Files

- `auth.ts` / `auth.config.ts` - NextAuth configuration
- `middleware.ts` - Route protection and locale detection
- `prisma/schema.prisma` - Database schema
- `src/translations/*.json` - i18n strings
- `app/api/[transport]/route.ts` - MCP HTTP endpoint
