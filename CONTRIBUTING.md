# Contributing to Track My Spend

The project is being prepared for an open-source release. A license has not yet been selected. Start with the [README](README.md), [setup guide](docs/self-hosting.md), and [release checklist](docs/open-source-readiness.md).

## Workflow

1. Use your own development database and sample transactions. Keep real customer data out of fixtures, screenshots, issues, and pull requests.
2. Follow the setup guide and create a branch for your change.
3. Keep changes focused; explain the user-visible problem and resulting behavior.
4. Verify translated UI in both languages when changing it.
5. Include reproduction steps and validation results in your pull request. Mention checks that fail or could not run.

## Conventions

- Use TypeScript and the existing Next.js App Router structure.
- Prefer Server Components for data fetching and server actions in `src/form-actions/` for form submissions.
- Keep database access in `src/data/` with existing field-to-type mapping. MCP code currently also queries Prisma directly.
- Use the session or scoped MCP identity for ownership; do not trust a submitted user ID.
- Follow existing database field names; use camelCase for TypeScript variables and PascalCase for components.
- Put shared UI in `src/ui/components/` and finance-specific UI in `src/ui/financial-app/`.
- Update both `src/translations/en.json` and `src/translations/es.json` for translated UI.
- Document new configuration in `.env.example`. Never commit real keys, tokens, database credentials, or `.env` files.

## Verification

```bash
node --test tests/*.test.cjs
pnpm exec tsc --noEmit
pnpm build
```

Run checks appropriate to your change and report the results. Tests cover selected behavior, not the entire application. Builds currently skip TypeScript errors, so run the type checker separately when changing TypeScript. Some integrations initialize at module load, so a build needs environment configuration.

For a fresh installation or financial-record change, also follow the setup guide's manual verification steps. Never run database reset commands against production or a shared database.

## Reporting problems

Include the page or tool, language, reproduction steps, expected behavior, and actual behavior. Redact transaction details, emails, cookies, tokens, and connection strings from logs. Report suspected vulnerabilities privately to the maintainer; a dedicated security-reporting channel is still pending.
