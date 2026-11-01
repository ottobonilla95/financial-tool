import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Use the same signed JWT and callbacks as login, without loading credentials
// providers, password hashing, or account-creation modules for session reads.
export const { auth: sessionAuth } = NextAuth(authConfig);
