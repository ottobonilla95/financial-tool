# Track My Spend

A bilingual (EN/ES) budgeting and expense tracking web application.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19-rc, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Neon serverless)
- **Auth**: NextAuth 5 (Credentials provider, bcrypt hashing)
- **Payments**: Hotmart (one-time purchases), Stripe (subscriptions)
- **AI**: OpenAI for expense import
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
├── api/                    # API routes (expense, income, hotmart, stripe, MCP)
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
- Savings tracking
- Interactive dashboard with charts
- Onboarding tour (Reactour)

## MCP Endpoint

- **Production URL:** `https://financial-tool.vercel.app/api/mcp`
- **Transport:** Streamable HTTP, with a fresh stateless handler for each request
- **Route:** `app/api/[transport]/route.ts`
- **Auth:** OAuth authorization code with PKCE. Bearer tokens are bound to the authenticated user and the MCP resource; `MCP_USER_ID` is not used.
- **Read-only starting tool:** `get_transaction_import_context` returns categories, currencies, timezone, and classification rules.
- **Import flow:** get context → classify all source items → check duplicates → preview → user confirms → commit. Never commit without explicit confirmation.
- **Other tools:** recent transactions, income category creation and preview/commit, expense date correction, monthly summary, and dashboard link.

## Environment Variables

Required in `.env`:
- `DATABASE_URL` / `POSGRES_PRISMA_URL` - Neon PostgreSQL
- `AUTH_SECRET` - NextAuth secret
- `OPENAI_API_KEY` - AI expense import
- `MCP_PUBLIC_ORIGIN` - Public deployment origin for OAuth metadata and resource URLs (defaults to `https://financial-tool.vercel.app`)
- `MCP_OAUTH_SECRET` / `MCP_REVIEW_SECRET` - OAuth and review-token signing secrets (each falls back to `AUTH_SECRET`)
- `STRIPE_*` - Payment processing
- `SYSTEME_API_KEY` - Email marketing
- `HOTMART_CHECKOUT_URL_ES/EN` - Checkout links
- `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` - Analytics

## Git

- **Before committing**, always ensure the local repo git config is set:
  - `git config user.name "ottobonilla95"`
  - `git config user.email "ottobonilla95@users.noreply.github.com"`
- Never rely on the global git config — always verify/set the local repo config first

## Vercel CLI

- The local `.env` file is git-ignored and may include `VERCEL_TOKEN`.
- For Vercel CLI interactions, load `.env` and pass the token explicitly with `--token "$VERCEL_TOKEN"`; do not rely on global Vercel login state.
- Keep Vercel tokens out of committed files and command output.

## Important Files

- `auth.ts` / `auth.config.ts` - NextAuth configuration
- `middleware.ts` - Route protection and locale detection
- `prisma/schema.prisma` - Database schema
- `src/translations/*.json` - i18n strings
- `app/api/[transport]/route.ts` - MCP HTTP endpoint
