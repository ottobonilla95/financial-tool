import { auth } from "@/auth";
import { ConsentToken, hashToken, oauthError, randomId, verifyEnvelope } from "@/src/mcp/oauth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
    const ticket = randomId();
    await prisma.mcp_oauth_token.create({ data: { token_hash: hashToken(ticket), token_type: "callback_handoff", user_id: consent.userId, client_id: consent.clientId, scopes: consent.scopes.join(" "), resource: consent.resource, redirect_uri: destination.href, expires_at: new Date(Date.now() + 2 * 60 * 1000) } });
    const completeUrl = new URL("/api/oauth/complete", request.url);
    completeUrl.searchParams.set("ticket", ticket);
    return NextResponse.redirect(completeUrl, 303);
  } catch (error) {
    const errorCode = typeof error === "object" && error && "code" in error ? String(error.code) : undefined;
    console.error("OAuth approval failed", { errorCode, error });
    return oauthError("server_error", `Could not issue the authorization code${errorCode ? ` (${errorCode})` : ""}.`, 500);
  }
}
