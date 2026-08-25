import { auth } from "@/auth";
import { allowedScopes, ConsentToken, ensureOAuthTokenTable, hashToken, MCP_RESOURCE, oauthError, randomId, readClient, signEnvelope, verifyEnvelope } from "@/src/mcp/oauth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function escapeHtml(value: string) { return value.replace(/[&<>"']/g, (x) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[x]!)); }
function redirectUriMatches(registered: string, requested: string) {
  try {
    const expected = new URL(registered); const actual = new URL(requested);
    if (expected.href === actual.href) return true;
    const loopback = (hostname: string) => hostname === "127.0.0.1" || hostname === "[::1]" || hostname === "localhost";
    return loopback(expected.hostname) && loopback(actual.hostname) && expected.protocol === "http:" && actual.protocol === "http:" && expected.pathname === actual.pathname && expected.search === actual.search && !expected.hash && !actual.hash;
  } catch { return false; }
}

export async function GET(request: Request) {
  const url = new URL(request.url); const q = url.searchParams;
  const clientId = q.get("client_id") || ""; const redirectUri = q.get("redirect_uri") || "";
  const codeChallenge = q.get("code_challenge") || ""; const resource = q.get("resource") || MCP_RESOURCE;
  if (q.get("response_type") !== "code" || q.get("code_challenge_method") !== "S256" || !codeChallenge) return oauthError("invalid_request", "Authorization code flow with PKCE S256 is required.");
  let client; let scopes: string[];
  try { client = readClient(clientId); scopes = allowedScopes(q.get("scope")); } catch { return oauthError("invalid_client", "The MCP client is not registered or requested an invalid scope."); }
  if (!client.redirectUris.some((registered) => redirectUriMatches(registered, redirectUri)) || resource !== MCP_RESOURCE) return oauthError("invalid_request", "The redirect URI or resource is invalid.");
  const session = await auth();
  if (!session?.user?.id) redirect(`/en/login?callbackUrl=${encodeURIComponent(url.toString())}`);
  const consent = signEnvelope({ kind: "consent", exp: Math.floor(Date.now() / 1000) + 10 * 60, userId: session.user.id, clientId, redirectUri, codeChallenge, state: q.get("state") || undefined, scopes, resource });
  const scopeList = scopes.map((scope) => `<li>${escapeHtml(scope === "transactions:write" ? "Create confirmed expenses" : "Read your categories and transactions")}</li>`).join("");
  return new Response(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Authorize Track My Spend</title><style>body{font-family:system-ui;background:#171717;color:#fafafa;display:grid;place-items:center;min-height:100vh;margin:0}.card{width:min(440px,calc(100% - 40px));background:#262626;border:1px solid #404040;border-radius:18px;padding:28px}h1{margin-top:0}p,li{color:#d4d4d4;line-height:1.5}.actions{display:flex;gap:10px;margin-top:24px}button{border:0;border-radius:9px;padding:12px 18px;font-weight:700;cursor:pointer}.approve{background:#1cde98;color:#06140f}.deny{background:#404040;color:#fff}</style></head><body><main class="card"><h1>Connect ${escapeHtml(client.clientName)}</h1><p>This application wants to access your Track My Spend account.</p><ul>${scopeList}</ul><p>Only expenses you explicitly confirm in the conversation can be inserted.</p><form method="post"><input type="hidden" name="consent" value="${escapeHtml(consent)}"><div class="actions"><button class="approve" name="decision" value="approve">Approve</button><button class="deny" name="decision" value="deny">Cancel</button></div></form></main></body></html>`, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'" } });
}

export async function POST(request: Request) {
  try {
    const session = await auth(); if (!session?.user?.id) return oauthError("access_denied", "Your login session expired.", 401);
    const form = await request.formData(); const token = String(form.get("consent") || "");
    let consent: ConsentToken; try { consent = verifyEnvelope<ConsentToken>(token, "consent"); } catch { return oauthError("invalid_request", "The authorization request expired."); }
    if (consent.userId !== session.user.id) return oauthError("access_denied", "This authorization belongs to another user.", 403);
    const destination = new URL(consent.redirectUri);
    if (form.get("decision") !== "approve") destination.searchParams.set("error", "access_denied");
    else {
      const code = randomId();
      await ensureOAuthTokenTable(prisma);
      await prisma.mcp_oauth_token.create({ data: { token_hash: hashToken(code), token_type: "authorization_code", user_id: consent.userId, client_id: consent.clientId, scopes: consent.scopes.join(" "), resource: consent.resource, redirect_uri: consent.redirectUri, code_challenge: consent.codeChallenge, expires_at: new Date(Date.now() + 5 * 60 * 1000) } });
      destination.searchParams.set("code", code);
    }
    if (consent.state) destination.searchParams.set("state", consent.state);
    return Response.redirect(destination, 303);
  } catch (error) {
    console.error("OAuth approval failed:", error);
    return oauthError("server_error", "Could not issue the authorization code.", 500);
  }
}
