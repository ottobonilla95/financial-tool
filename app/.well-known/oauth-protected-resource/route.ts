import { MCP_ORIGIN, MCP_RESOURCE, MCP_SCOPES } from "@/src/mcp/oauth";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ resource: MCP_RESOURCE, authorization_servers: [MCP_ORIGIN], scopes_supported: MCP_SCOPES, bearer_methods_supported: ["header"], resource_name: "Track My Spend" }, { headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=3600" } });
}
