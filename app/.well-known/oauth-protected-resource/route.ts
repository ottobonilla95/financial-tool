import { MCP_ORIGIN, MCP_RESOURCE, MCP_SCOPES } from "@/src/mcp/oauth";

export const dynamic = "force-dynamic";

export async function GET() {
  const metadata = { resource: MCP_RESOURCE, authorization_servers: [MCP_ORIGIN], scopes_supported: MCP_SCOPES, bearer_methods_supported: ["header"], resource_name: "Track My Spend" };
  return new Response(JSON.stringify(metadata), { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=3600" } });
}

export async function OPTIONS() { return new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "*" } }); }
