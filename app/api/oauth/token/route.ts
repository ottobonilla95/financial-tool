import { allowedScopes, ensureOAuthTokenTable, hashToken, MCP_RESOURCE, oauthError, oauthJson, pkceS256, randomId, readClient, redirectUriMatches } from "@/src/mcp/oauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function tokens(userId: string, clientId: string, scopes: string[], resource: string, includeRefresh = true) {
  const access_token = randomId(); const refresh_token = includeRefresh ? randomId() : undefined;
  await prisma.mcp_oauth_token.createMany({ data: [
    { token_hash: hashToken(access_token), token_type: "access_token", user_id: userId, client_id: clientId, scopes: scopes.join(" "), resource, expires_at: new Date(Date.now() + 60 * 60 * 1000) },
    ...(refresh_token ? [{ token_hash: hashToken(refresh_token), token_type: "refresh_token", user_id: userId, client_id: clientId, scopes: scopes.join(" "), resource, expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }] : []),
  ] });
  return { access_token, token_type: "Bearer", expires_in: 3600, scope: scopes.join(" "), ...(refresh_token ? { refresh_token } : {}) };
}

export async function POST(request: Request) {
  await ensureOAuthTokenTable(prisma);
  const form = await request.formData(); const grant = String(form.get("grant_type") || ""); const clientId = String(form.get("client_id") || "");
  try { readClient(clientId); } catch { return oauthError("invalid_client", "Unknown or expired client.", 401); }
  if (grant === "authorization_code") {
    const rawCode = String(form.get("code") || "");
    const code = await prisma.mcp_oauth_token.findUnique({ where: { token_hash: hashToken(rawCode) } });
    if (!code || code.token_type !== "authorization_code" || code.used_at || code.revoked_at || code.expires_at <= new Date()) return oauthError("invalid_grant", "Authorization code is invalid, used, or expired.");
    const verifier = String(form.get("code_verifier") || ""); const redirectUri = String(form.get("redirect_uri") || ""); const resource = String(form.get("resource") || MCP_RESOURCE);
    if (code.client_id !== clientId || !code.redirect_uri || !redirectUriMatches(code.redirect_uri, redirectUri) || code.resource !== resource || pkceS256(verifier) !== code.code_challenge) return oauthError("invalid_grant", "Authorization code validation failed.");
    const consumed = await prisma.mcp_oauth_token.updateMany({ where: { id: code.id, used_at: null }, data: { used_at: new Date() } });
    if (consumed.count !== 1) return oauthError("invalid_grant", "Authorization code was already used.");
    return oauthJson(await tokens(code.user_id, clientId, code.scopes.split(" "), resource));
  }
  if (grant === "refresh_token") {
    const rawRefresh = String(form.get("refresh_token") || "");
    const refresh = await prisma.mcp_oauth_token.findUnique({ where: { token_hash: hashToken(rawRefresh) } });
    if (!refresh || refresh.token_type !== "refresh_token" || refresh.revoked_at || refresh.expires_at <= new Date()) return oauthError("invalid_grant", "Refresh token is invalid or expired.");
    const resource = String(form.get("resource") || refresh.resource); const originalScopes = refresh.scopes.split(" "); let scopes: string[];
    try { scopes = form.get("scope") ? allowedScopes(String(form.get("scope"))) : originalScopes; } catch { return oauthError("invalid_scope", "Unsupported scope."); }
    if (refresh.client_id !== clientId || resource !== refresh.resource || scopes.some((x) => !originalScopes.includes(x))) return oauthError("invalid_grant", "Refresh token validation failed.");
    return oauthJson(await tokens(refresh.user_id, clientId, scopes, resource, false));
  }
  return oauthError("unsupported_grant_type", "Use authorization_code or refresh_token.");
}
