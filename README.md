## Next.js App Router Course - Starter

This is the starter template for the Next.js App Router Course. It contains the starting code for the dashboard application.

For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.
# financial-tool

## Portable transaction-import MCP

The production MCP endpoint is:

```text
https://trackmyspend.co/api/mcp
```

It does not call an LLM. The connected MCP host (Codex, Claude, or another
compatible client) classifies pasted transactions and uses these contracts:

- `get_transaction_import_context` returns the user's categories, currencies,
  timezone, current date, and classification policy.
- `get_recent_transactions` supports duplicate checks.
- `preview_transaction_import` validates a fully reconciled batch and returns
  a signed, 15-minute review token. It also advertises an optional MCP Apps
  review UI while retaining a complete text and structured-data fallback.
- `commit_transaction_import` inserts only the payload contained in the signed
  token and must be called only after explicit confirmation.

The server also exposes the `import_transactions` MCP prompt and the
`trackmyspend://transaction-import-policy` resource for clients that support
those MCP capabilities.

Required environment variables:

```text
MCP_USER_ID=<Track My Spend user UUID>
AUTH_SECRET=<existing application secret>
```

Optional environment variables:

```text
MCP_REVIEW_SECRET=<dedicated HMAC secret; falls back to AUTH_SECRET>
MCP_TIMEZONE=Europe/Warsaw
```

The workflow classifies every source record as `expense`, `income`, `refund`,
`declined`, `reversed`, `transfer`, `duplicate`, `non_transaction`, or
`uncertain`. Only `expense` records can be committed.
