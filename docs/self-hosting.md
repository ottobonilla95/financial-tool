# Local setup and self-hosting notes

This guide describes a manual development setup for the current code. A payment-free installer and registration flow are still release work. Use a fresh development database and sample transactions while evaluating the app.

## 1. Install and configure

Install Node.js compatible with the `engines` field in `package.json`, pnpm compatible with the version 9 lockfile, and PostgreSQL. From your cloned repository:

```bash
pnpm install --frozen-lockfile
cp .env.example .env
openssl rand -base64 32
```

Paste the generated secret into `AUTH_SECRET` in `.env`. Set `POSGRES_PRISMA_URL` and `POSGRES_URL_NON_POOLING` to your development database. These exact names, including the `POSGRES` spelling, match the schema; `DATABASE_URL` alone is not read.

For local PostgreSQL both URLs can be identical. For a pooled service, use the pooled URL first and the direct URL second. Retain any TLS options required by the service. The database must already exist.

Keep `NEXT_PUBLIC_APP_URL=http://localhost:3005`; the dashboard makes a server-side request to its currency API at this origin. Restart the server after environment changes.

The example includes nonfunctional OpenAI and Resend placeholders because their SDK clients are constructed when route modules load. These permit initialization without enabling paid API calls. Use real credentials only when testing those integrations. The OpenAI placeholder is currently needed even if the selected provider is Z.ai.

## 2. Create tables

The schema uses PostgreSQL's `uuid_generate_v4()`. Enable its extension **before** creating tables:

```bash
pnpm exec prisma db execute --schema prisma/schema.prisma --stdin <<'SQL'
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SQL

pnpm exec prisma db push
```

If the database role cannot create extensions, run the extension statement through an administrator or your provider's SQL console first.

`db push` is for this empty development database. There is no versioned Prisma migration history in the repository; this is not a production upgrade procedure. Do not run schema pushes or reset commands against the hosted service's database.

## 3. Add currencies and emotions

There is no seed command yet. On the fresh database above, run:

```bash
pnpm exec prisma db execute --schema prisma/schema.prisma --stdin <<'SQL'
BEGIN;

INSERT INTO currency (id, name, symbol, "countryCode", "currencyCode") VALUES
  (1, 'US Dollar', '$', 'US', 'USD'),
  (2, 'Euro', '€', 'IE', 'EUR'),
  (3, 'Pound Sterling', '£', 'GB', 'GBP'),
  (4, 'Colombian Peso', '$', 'CO', 'COP'),
  (5, 'Mexican Peso', '$', 'MX', 'MXN');

INSERT INTO emotion (id, name, emotion_type, color) VALUES
  (1, 'sadness', 'negative', '#64748B'),
  (2, 'happiness', 'positive', '#22C55E'),
  (3, 'stress', 'negative', '#EF4444'),
  (4, 'boredom', 'negative', '#A855F7'),
  (5, 'excitement', 'positive', '#F59E0B'),
  (6, 'guilt', 'negative', '#F97316'),
  (7, 'anxiety', 'negative', '#EC4899'),
  (9, 'neutral', 'neutral', '#94A3B8');

SELECT setval(pg_get_serial_sequence('currency', 'id'), (SELECT MAX(id) FROM currency));
SELECT setval(pg_get_serial_sequence('emotion', 'id'), (SELECT MAX(id) FROM emotion));

COMMIT;
SQL
```

This is a small starter currency list. Add others through Prisma Studio as needed. Emotion names match translation keys; neutral must currently have **ID 9**, the expense form's default. These explicit IDs are only for a fresh database. Do not run this seed twice or merge it into an existing installation blindly.

## 4. Create your first account

Normal signup creates marketing contacts and redirects to pricing/payment. Login rejects users without `fully_signed_up=true`, and the dashboard redirects users without a subscription plan. For local development, provision your own account directly.

Generate a random password and its bcrypt hash locally:

```bash
node <<'JS'
const { randomBytes } = require('node:crypto');
const bcrypt = require('bcrypt');
const password = randomBytes(24).toString('base64url');
bcrypt.hash(password, 10).then(hash => {
  console.log('Login password:', password);
  console.log('Database password hash:', hash);
});
JS
```

Keep the output private. Save the login password in your password manager; the database receives only its hash.

```bash
pnpm exec prisma studio
```

Add and save a record in `users`:

| Field | Value |
| --- | --- |
| `name` | Your display name |
| `email` | Your login email |
| `password` | The bcrypt hash, **not** the login password |
| `lang` | `en` or `es` |
| `currency_id` | A seeded currency ID, such as `2` for EUR |
| `fully_signed_up` | `true` |
| `subscription_plan` | `lifetime` |
| `tour_finished` | `true` to skip onboarding during this manual setup |

Let the database generate `id` and date defaults. Leave Stripe identifiers and subscription IDs empty. The `lifetime` value satisfies the existing dashboard gate without a payment request; it is a local provisioning workaround, not a new registration mode. Close Studio afterward and do not expose it publicly.

## 5. Run and verify

```bash
pnpm dev
```

Open `http://localhost:3005/en/login` or `/es/login` and sign in with the email and generated **login password**.

1. Open Settings; create an expense category and an income category. Add a subcategory from the expense entry form.
2. Add an expense in the account's default currency. Check its dashboard total and category chart.
3. Add income and a saving. Reload and confirm records persist.
4. Check the month picker, insights, and psychology pages.
5. Test AI or MCP imports separately if configured; inspect previews before saving.

These are the manual acceptance steps for a fresh installation. This documentation has not been verified end to end against a newly provisioned PostgreSQL instance.

## Optional AI imports

The in-app import route is `app/api/expense/ai-import/route.ts`. Set `EXPENSE_IMPORT_PROVIDER` to `openai` or `zai` and provide that provider's key. The environment template lists model settings and request limits. Commented defaults mirror the source and may need adjustment for your provider account.

Transaction text is sent to the selected provider. MCP instead relies on the connected assistant's model and data handling. Manual entry does not require a model API call. Cross-currency conversion separately uses an external exchange-rate service.

## Before exposing an instance

The current code needs additional work before a general-purpose public deployment:

- **Tracking:** `app/[lang]/layout.tsx` includes fixed Google Analytics and Datafast identifiers, a production Hotjar script, and Vercel/Facebook analytics components. Some scripts also load in development. Empty environment values do not remove them. Remove or configure tracking before using personal data.
- **Exchange rates:** `app/api/exchange-rate/route.ts` has a hardcoded API credential. Replace it with your own server-side configuration; the existing credential needs rotation. Default-currency manual entry avoids conversion requests.
- **Purchase routes:** Hotmart handlers create accounts with a shared default password and do not validate the webhook sender before processing the payload. Disable unused purchase routes, or add verification and secure account activation before enabling them.
- **Registration and branding:** Public signup uses Systeme.io, pricing, and payments. Tutorial/support content, email sender settings, public metadata, and some MCP links refer to the original service. Implement a self-host mode and configure destinations for your instance.
- **Database operations:** Establish migrations, backups, and a tested restore procedure. `pnpm build` generates Prisma Client but does not create tables or populate data.

For a configured production instance, set app and MCP origins to your own HTTPS origin, configure authentication for the hosting environment, install dependencies, run `pnpm build`, and serve with `pnpm start` (port 3005). Verify login and record creation on that host. The items above remain necessary; setting origins alone is not a complete production setup.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Prisma reports missing configuration | Use `.env` and the exact `POSGRES_*` names |
| `uuid_generate_v4()` is missing | Enable `uuid-ossp` before `db push` |
| Login rejects your account | Check the bcrypt hash, email, and `fully_signed_up=true` |
| Dashboard redirects to pricing | Set `subscription_plan` on the provisioned development account |
| Currency list is empty | Add currency rows and check `NEXT_PUBLIC_APP_URL` |
| Expense insertion fails with an emotion foreign-key error | Ensure neutral emotion ID 9 exists |
| SDK reports missing keys during loading/build | Retain development placeholders or configure real integration keys |
| Currency conversion fails | Replace the current exchange-rate credential and check the provider response |
