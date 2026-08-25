import { MCP_ORIGIN, MCP_SCOPES } from "@/src/mcp/oauth";

export const dynamic = "force-dynamic";

export async function GET() {
  const metadata = {
    issuer: MCP_ORIGIN,
    authorization_endpoint: `${MCP_ORIGIN}/api/oauth/authorize`,
    token_endpoint: `${MCP_ORIGIN}/api/oauth/token`,
    registration_endpoint: `${MCP_ORIGIN}/api/oauth/register`,
    revocation_endpoint: `${MCP_ORIGIN}/api/oauth/revoke`,
    scopes_supported: MCP_SCOPES,
    response_types_supported: ["code"],
    response_modes_supported: ["query"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    token_endpoint_auth_methods_supported: ["none"],
    revocation_endpoint_auth_methods_supported: ["none"],
    code_challenge_methods_supported: ["S256"],
  };
  return new Response(JSON.stringify(metadata), { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=3600" } });
}

export async function OPTIONS() { return new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "*" } }); }
