import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const MCP_ORIGIN = process.env.MCP_PUBLIC_ORIGIN || "https://financial-tool.vercel.app";
export const MCP_RESOURCE = `${MCP_ORIGIN}/api/mcp`;
export const MCP_SCOPES = ["transactions:read", "transactions:write"] as const;

type SignedEnvelope = { kind: string; exp: number; [key: string]: unknown };

function secret() {
  const value = process.env.MCP_OAUTH_SECRET || process.env.AUTH_SECRET;
  if (!value) throw new Error("MCP_OAUTH_SECRET or AUTH_SECRET must be configured.");
  return value;
}

export function signEnvelope(payload: SignedEnvelope) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret()).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifyEnvelope<T extends SignedEnvelope>(token: string, kind: string): T {
  const [encoded, signature, extra] = token.split(".");
  if (!encoded || !signature || extra) throw new Error("Invalid token.");
  const expected = createHmac("sha256", secret()).update(encoded).digest();
  const received = Buffer.from(signature, "base64url");
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) throw new Error("Invalid token signature.");
  const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as T;
  if (payload.kind !== kind || !Number.isFinite(payload.exp) || payload.exp <= Math.floor(Date.now() / 1000)) throw new Error("Token is invalid or expired.");
  return payload;
}

export type ClientToken = SignedEnvelope & { kind: "client"; clientName: string; redirectUris: string[] };
export type ConsentToken = SignedEnvelope & {
  kind: "consent"; userId: string; clientId: string; redirectUri: string; codeChallenge: string;
  state?: string; scopes: string[]; resource: string;
};
export type AuthorizationCode = SignedEnvelope & {
  kind: "authorization_code"; userId: string; clientId: string; redirectUri: string; codeChallenge: string;
  state?: string; scopes: string[]; resource: string;
};
export type AccessToken = SignedEnvelope & {
  kind: "access_token"; userId: string; clientId: string; scopes: string[]; resource: string;
};
export type RefreshToken = SignedEnvelope & {
  kind: "refresh_token"; userId: string; clientId: string; scopes: string[]; resource: string;
};

export function createClient(clientName: string, redirectUris: string[]) {
  return signEnvelope({ kind: "client", exp: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, clientName, redirectUris });
}

export function readClient(clientId: string) { return verifyEnvelope<ClientToken>(clientId, "client"); }
export function randomId() { return randomBytes(24).toString("base64url"); }
export function hashToken(value: string) { return createHash("sha256").update(value).digest("hex"); }
export function pkceS256(verifier: string) { return createHash("sha256").update(verifier).digest("base64url"); }
export function redirectUriMatches(expectedValue: string, actualValue: string, allowLoopbackPortChange = false) {
  try {
    const expected = new URL(expectedValue); const actual = new URL(actualValue);
    if (expected.href === actual.href) return true;
    const loopback = (hostname: string) => hostname === "127.0.0.1" || hostname === "[::1]" || hostname === "localhost";
    return loopback(expected.hostname) && loopback(actual.hostname) && expected.protocol === "http:" && actual.protocol === "http:"
      && (allowLoopbackPortChange || expected.port === actual.port) && expected.pathname === actual.pathname
      && expected.search === actual.search && !expected.hash && !actual.hash;
  } catch { return false; }
}
export function allowedScopes(value?: string | null) {
  const requested = (value || MCP_SCOPES.join(" ")).split(/\s+/).filter(Boolean);
  if (!requested.length || requested.some((scope) => !MCP_SCOPES.includes(scope as typeof MCP_SCOPES[number]))) throw new Error("Unsupported scope.");
  return [...new Set(requested)];
}

export function oauthError(error: string, description: string, status = 400) {
  return oauthJson({ error, error_description: description }, status);
}

export function oauthJson(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", Pragma: "no-cache" } });
}

type SqlExecutor = {
  $executeRawUnsafe(query: string): Promise<number>;
  $queryRawUnsafe<T = unknown>(query: string): Promise<T>;
};
export async function ensureOAuthTokenTable(prisma: SqlExecutor) {
  const existing = await prisma.$queryRawUnsafe<Array<{ table_name: string | null }>>(
    `SELECT to_regclass('public.mcp_oauth_token')::text AS "table_name"`,
  );
  if (existing[0]?.table_name) return;
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "mcp_oauth_token" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(), "token_hash" VARCHAR(64) NOT NULL UNIQUE,
    "token_type" VARCHAR(24) NOT NULL, "user_id" UUID NOT NULL, "client_id" TEXT NOT NULL,
    "scopes" TEXT NOT NULL, "resource" TEXT NOT NULL, "redirect_uri" TEXT, "code_challenge" TEXT,
    "expires_at" TIMESTAMP(6) NOT NULL, "used_at" TIMESTAMP(6), "revoked_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "mcp_oauth_token_token_hash_token_type_idx" ON "mcp_oauth_token"("token_hash", "token_type")`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "mcp_oauth_token_user_id_client_id_idx" ON "mcp_oauth_token"("user_id", "client_id")`);
}
