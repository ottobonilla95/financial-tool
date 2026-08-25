import { auth } from "@/auth";
import { ConsentToken, hashToken, oauthError, randomId, verifyEnvelope } from "@/src/mcp/oauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]!));
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return oauthError("access_denied", "Your login session expired.", 401);

    const form = await request.formData();
    let consent: ConsentToken;
    try {
      consent = verifyEnvelope<ConsentToken>(String(form.get("consent") || ""), "consent");
    } catch {
      return oauthError("invalid_request", "The authorization request expired.");
    }
    if (consent.userId !== session.user.id) return oauthError("access_denied", "This authorization belongs to another user.", 403);

    const destination = new URL(consent.redirectUri);
    if (form.get("decision") !== "approve") {
      destination.searchParams.set("error", "access_denied");
    } else {
      const code = randomId();
      await prisma.mcp_oauth_token.create({ data: { token_hash: hashToken(code), token_type: "authorization_code", user_id: consent.userId, client_id: consent.clientId, scopes: consent.scopes.join(" "), resource: consent.resource, redirect_uri: consent.redirectUri, code_challenge: consent.codeChallenge, expires_at: new Date(Date.now() + 5 * 60 * 1000) } });
      destination.searchParams.set("code", code);
    }
    if (consent.state) destination.searchParams.set("state", consent.state);
    const callbackUrl = escapeHtml(destination.href);
    return new Response(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Authorization approved</title><style>body{font-family:system-ui;background:#171717;color:#fafafa;display:grid;place-items:center;min-height:100vh;margin:0}.card{width:min(440px,calc(100% - 40px));background:#262626;border:1px solid #404040;border-radius:18px;padding:28px}h1{margin-top:0}p{color:#d4d4d4;line-height:1.5}.continue{display:inline-block;background:#1cde98;color:#06140f;text-decoration:none;border-radius:9px;padding:12px 18px;font-weight:700;margin-top:12px}</style></head><body><main class="card"><h1>Authorization approved</h1><p>Continue to your MCP client to finish connecting Track My Spend.</p><a class="continue" href="${callbackUrl}">Continue to Codex</a></main></body></html>`, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", Pragma: "no-cache", "Referrer-Policy": "no-referrer", "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'" } });
  } catch (error) {
    const errorCode = typeof error === "object" && error && "code" in error ? String(error.code) : undefined;
    console.error("OAuth approval failed", { errorCode, error });
    return oauthError("server_error", `Could not issue the authorization code${errorCode ? ` (${errorCode})` : ""}.`, 500);
  }
}
