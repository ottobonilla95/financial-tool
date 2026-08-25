import { ensureOAuthTokenTable, hashToken } from "@/src/mcp/oauth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(request: Request) {
  await ensureOAuthTokenTable(prisma);
  const form = await request.formData(); const token = String(form.get("token") || "");
  if (token) await prisma.mcp_oauth_token.updateMany({ where: { token_hash: hashToken(token), revoked_at: null }, data: { revoked_at: new Date() } });
  return new Response(null, { status: 200, headers: { "Cache-Control": "no-store" } });
}
