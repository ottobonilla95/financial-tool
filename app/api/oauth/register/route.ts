import { createClient, oauthError } from "@/src/mcp/oauth";

function safeRedirect(value: string) {
  try { const url = new URL(value); return url.protocol === "https:" || (url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)); } catch { return false; }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return oauthError("invalid_client_metadata", "Expected a JSON registration document."); }
  const redirectUris = Array.isArray(body.redirect_uris) ? body.redirect_uris.filter((x): x is string => typeof x === "string") : [];
  if (!redirectUris.length || redirectUris.length > 10 || !redirectUris.every(safeRedirect)) return oauthError("invalid_redirect_uri", "Register one or more HTTPS or loopback redirect URIs.");
  const clientName = typeof body.client_name === "string" ? body.client_name.slice(0, 120) : "MCP client";
  const clientId = createClient(clientName, redirectUris);
  return Response.json({ client_id: clientId, client_id_issued_at: Math.floor(Date.now() / 1000), client_name: clientName, redirect_uris: redirectUris, token_endpoint_auth_method: "none", grant_types: ["authorization_code", "refresh_token"], response_types: ["code"] }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
