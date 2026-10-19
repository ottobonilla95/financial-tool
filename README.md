# Track My Spend

Track My Spend is a personal finance web app in English and Spanish. Record expenses, income, and savings, see where your money goes, and explore how emotions and satisfaction relate to your spending.

It combines a monthly dashboard, custom categories, multiple currencies, and expense imports from pasted text. It can also connect to an AI assistant through the Model Context Protocol (MCP).

## Project status

This repository contains the application behind the hosted Track My Spend service. It is being prepared for community use and self-hosting. The code still includes payment-based signup, service-specific branding, and analytics integrations. There is no automated fresh-install bootstrap or payment-free registration mode yet.

**No open-source license has been selected or included yet.** The [release checklist](docs/open-source-readiness.md) tracks what remains before an open-source release.

## Features

- Record, edit, and delete expenses and income; record and delete savings.
- Organize expenses and income into custom categories and subcategories.
- Choose a default currency and record transactions in other currencies with exchange rates.
- Compare monthly totals, category spending, daily spending, and the equivalent period last month.
- Attach an emotion and a satisfaction score from 1–5 to expenses to explore spending patterns.
- Review a proposed expense import from pasted text before saving.
- Use an MCP-compatible assistant to classify transactions, review a batch, and save confirmed expenses.
- Use English (`/en`) or Spanish (`/es`) pages and an onboarding tour.

This is a manual tracking application. It does not connect to bank accounts or automatically sync bank transactions.

## Run a development copy

You need Node.js (the manifest requires version 20.12 or newer), pnpm compatible with the version 9 lockfile, and a separate PostgreSQL database that supports the `uuid-ossp` extension. Neon is used by the hosted service; the Prisma schema uses the standard PostgreSQL provider.

```bash
git clone <your-repository-url> track-my-spend
cd track-my-spend
pnpm install --frozen-lockfile
cp .env.example .env
```

Follow the [local setup guide](docs/self-hosting.md) to configure the database, create its tables and reference data, and create your first account. Creating tables alone is not enough: currencies, emotions, and an activated user are required.

```bash
pnpm dev
```

Open [English login](http://localhost:3005/en/login) or [Spanish login](http://localhost:3005/es/login). Development and production servers both use port **3005**.

The guide uses a manually provisioned account so you can try the dashboard without a purchase. Public signup still depends on Systeme.io and payment configuration. Review the guide's tracking limitations before entering personal data.

## How to use it

1. **Sign in and set a currency.** Use an activated account. The manual setup assigns its currency directly; hosted users may be prompted to choose one.
2. **Set up categories.** Open **Settings** to manage expense and income categories and colors. Add subcategories from the transaction entry forms. For example: Food → Groceries, Transport → Public transport, and Income → Salary.
3. **Add records.** On the dashboard, use **Add Expense**, **Add Income**, or **Add Saving**. Choose the amount and date. Expenses also have categories, optional descriptions and subcategories, emotions, and satisfaction scores.
4. **Review the month.** Choose a month on the dashboard. Explore totals, category breakdowns, daily charts, and comparisons with the previous month. Filter categories to focus the spending charts and tables.
5. **Explore patterns.** Open the summary/insights and psychology pages in the sidebar to examine trends and emotional spending.
6. **Import expenses.** Open **Add Expense** and use its AI import control. Paste transaction text, review proposed rows and skipped items, and check amounts, dates, and categories before saving. This feature needs a configured AI provider.

Expenses and income are managed on the dashboard; there are no separate `/dashboard/expenses` or `/dashboard/income` pages. Account settings include changing your password. Tutorial videos and the onboarding tour provide additional guidance, although the videos are external hosted resources.

## Configuration

[.env.example](.env.example) lists configuration without real credentials. Database variables are intentionally spelled **`POSGRES_*`**, matching the current Prisma schema. Setting only `DATABASE_URL` does not configure this app.

| Integration | Purpose | Needed for local manual tracking? |
| --- | --- | --- |
| PostgreSQL + Prisma | Accounts and financial records | Yes |
| NextAuth + bcrypt | Email/password login | Yes; set `AUTH_SECRET` |
| OpenAI or Z.ai | In-app text-to-expense import | Only for imports; see SDK initialization caveat in setup guide |
| MCP OAuth | User-authorized assistant access | Only for MCP |
| Stripe | Subscription webhooks and billing portal | No, with a manually activated account |
| Hotmart | Purchase webhooks and lifetime accounts | No |
| Systeme.io | Marketing contacts and tags | No for manual login; currently part of public signup |
| Resend | Hotmart welcome email | No for manual login; see initialization caveat |
| ExchangeRate-API | Currency conversion | Only for conversion; current hardcoded credential needs replacement |
| Analytics | Hosted-service usage tracking | Scripts are embedded; review before using personal data |

Empty optional credentials do **not** disable all associated routes, scripts, or links. See [self-hosting limitations](docs/self-hosting.md#before-exposing-an-instance).

## Connect an AI assistant with MCP

Point an MCP client supporting Streamable HTTP and OAuth at **your own origin** followed by `/api/mcp`, for example `http://localhost:3005/api/mcp` locally. Remote clients need a reachable HTTPS deployment. Set `MCP_PUBLIC_ORIGIN` to that same origin and choose `MCP_TIMEZONE` for date interpretation.

Authorization uses the app's login and OAuth consent flow. Tokens are scoped to the approved user. `MCP_USER_ID` is not used by the current implementation.

The MCP server does not call an LLM; the connected assistant classifies source text. This is separate from the in-app AI import API, which calls the configured provider.

| Tool | Purpose |
| --- | --- |
| `get_transaction_import_context` | Get categories, currencies, timezone, current date, and classification policy |
| `get_recent_transactions` | Check recent records for possible duplicates |
| `preview_transaction_import` | Validate a reconciled batch and return a signed review token valid for 15 minutes |
| `commit_transaction_import` | Save reviewed expenses after explicit user confirmation |
| `update_expense_date` | Correct an expense date using its expected saved date to detect conflicts |
| `get_summary` | Get a monthly expense summary by category |
| `get_dashboard_link` | Return links; currently hardcoded to the hosted service |

Import flow: get context → classify all source records → check duplicates → preview → user confirms → commit. Source classifications are `expense`, `income`, `refund`, `declined`, `reversed`, `transfer`, `duplicate`, `non_transaction`, and `uncertain`. Only expenses can be committed through this import workflow. Review tokens are reusable within their validity period, so repeating a commit can insert duplicates.

The server also provides the `import_transactions` prompt, the `trackmyspend://transaction-import-policy` resource, and an optional MCP Apps review interface with text and structured-data fallbacks. Client support varies.

## Development

The stack is Next.js 14 App Router, React 19 release candidate, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and NextAuth 5 beta. Charts use libraries including Nivo, Chart.js, and Visx. Dependencies are in [package.json](package.json); the committed lockfile is `pnpm-lock.yaml`.

```bash
pnpm dev                         # Development server on port 3005
pnpm build                       # Generate Prisma client and build Next.js
pnpm start                       # Serve a production build on port 3005
node --test tests/*.test.cjs      # Existing focused tests
pnpm exec tsc --noEmit            # Separate TypeScript check
```

`next.config.mjs` currently permits builds with TypeScript errors, so a successful build alone does not establish type correctness. Tests cover selected behavior rather than the whole application.

```text
app/[lang]/                   English and Spanish pages, dashboard, auth, pricing
app/api/                      Financial APIs, AI import, payment webhooks, OAuth
app/api/[transport]/route.ts   MCP endpoint
src/ui/components/            Shared UI components
src/ui/financial-app/         Finance-specific UI
src/data/                     Prisma queries and data mapping
src/form-actions/             Server actions
src/mcp/                      MCP authorization and transaction-import support
src/translations/             English and Spanish dictionaries
prisma/schema.prisma          Database schema
tests/                        Focused Node.js tests
```

## Contributing and release work

Start with [CONTRIBUTING.md](CONTRIBUTING.md). The [release checklist](docs/open-source-readiness.md) covers licensing, installation, optional integrations, and concrete security and privacy work still needed. This documentation update does not change the hosted service or publish the repository.
