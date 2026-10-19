# Open-source release checklist

The README and setup guide describe the current implementation. Unchecked items here are not implemented by this documentation change.

## Release blockers

- [ ] Choose a license and add its text. Check ownership and permissions for contributed code and bundled assets before release.
- [ ] Scan the working tree **and Git history** for secrets and personal data. A hardcoded credential exists in `app/api/exchange-rate/route.ts`; move it to server-side configuration and rotate it. Removing a value from the latest commit does not remove it from history.
- [ ] Review `NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN` in `app/api/meta-events/route.ts` and keep service access tokens in server-only configuration.
- [ ] Remove fixed tracking identifiers or make analytics opt-in and configurable. The locale layout embeds Google Analytics, Datafast, Hotjar, and other analytics components.
- [ ] Verify Hotmart webhook authenticity and replace shared default passwords with individual activation. Disable unused payment routes in self-host deployments.
- [ ] Review account isolation and authorization across APIs and server actions before offering a public multi-user installation. Existing focused tests do not constitute a full security review.

## Installation anyone can use

- [ ] Add a self-host mode with registration and dashboard access independent of Stripe, Hotmart, and Systeme.io.
- [ ] Make AI, email, payments, marketing, and tracking optional in code, including SDK initialization. Missing optional keys should not prevent basic builds or manual tracking.
- [ ] Add repeatable bootstrap for currencies, emotions, and the first user. Remove hardcoded reference IDs such as neutral emotion ID 9.
- [ ] Establish versioned migrations, extension setup, and upgrade instructions.
- [ ] Verify a clean install on an empty database without production credentials. The current manual guide has not been tested end to end on a fresh database.
- [ ] Provide a deployment recipe with persistence, backups, and upgrades.
- [ ] Make URLs, branding, senders, support links, and tutorials configurable. MCP dashboard links still reference the hosted service, including paths without separate pages.
- [ ] Prevent repeated MCP review-token commits from inserting duplicates. Signed preview tokens currently expire but are reusable within their validity period.

## Community and maintenance

- [x] Replace starter README with product overview, usage, architecture, and commands.
- [x] Add an environment template with example values and caveats.
- [x] Document manual database and first-account setup.
- [x] Add contribution guidance.
- [ ] Add screenshots with synthetic data and a Spanish version of the user guide.
- [ ] Establish a private security-reporting channel and support policy.
- [ ] Add CI for tests, type checking, and builds. Resolve underlying type errors before removing `ignoreBuildErrors`.
- [ ] Review dependency security and versions, including the React release candidate and NextAuth beta.
- [ ] Publish release notes, supported versions, and tested upgrade/rollback steps.

The next implementation milestone is a clean installation where a person configures a database and auth secret, creates their own account, and records expenses without payment, marketing, or AI credentials.
