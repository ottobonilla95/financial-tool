import { auth } from "@/auth";
import { hashToken, oauthError } from "@/src/mcp/oauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]!));
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return oauthError("access_denied", "Your login session expired.", 401);

  const ticket = new URL(request.url).searchParams.get("ticket") || "";
  const handoff = await prisma.mcp_oauth_token.findUnique({ where: { token_hash: hashToken(ticket) } });
  if (!handoff || handoff.token_type !== "callback_handoff" || handoff.user_id !== session.user.id || handoff.used_at || handoff.revoked_at || handoff.expires_at <= new Date() || !handoff.redirect_uri) {
    return oauthError("invalid_request", "This callback handoff is invalid or expired.");
  }
  const consumed = await prisma.mcp_oauth_token.updateMany({ where: { id: handoff.id, used_at: null }, data: { used_at: new Date() } });
  if (consumed.count !== 1) return oauthError("invalid_request", "This callback handoff was already used.");

  const callbackUrl = escapeHtml(handoff.redirect_uri);
  return new Response(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Authorization approved</title><style>body{font-family:system-ui;background:#171717;color:#fafafa;display:grid;place-items:center;min-height:100vh;margin:0}.card{width:min(440px,calc(100% - 40px));background:#262626;border:1px solid #404040;border-radius:18px;padding:28px}h1{margin-top:0}p{color:#d4d4d4;line-height:1.5}.continue{display:inline-block;background:#1cde98;color:#06140f;text-decoration:none;border-radius:9px;padding:12px 18px;font-weight:700;margin-top:12px}</style></head><body><main class="card"><h1>Authorization approved</h1><p>Continue to your MCP client to finish connecting Track My Spend.</p><a class="continue" href="${callbackUrl}">Continue to Codex</a></main></body></html>`, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", Pragma: "no-cache", "Referrer-Policy": "no-referrer", "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'" } });
}
