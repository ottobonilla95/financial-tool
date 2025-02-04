import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type UserToCreate = {
  email: string;
  lang: string;
  password?: string;
  name?: string;
  pricing_Group?: string;
  fullySignedUp?: boolean;
  subscriptionPlan?: string;
};

export async function createDbUser({
  email,
  lang,
  name,
  password,
  pricing_Group,
  fullySignedUp,
  subscriptionPlan,
}: UserToCreate) {
  try {
    const user = await prisma.users.create({
      data: {
        email,
        created_at: new Date(),
        lang,
        name: name || "",
        password: password || "",
        pricing_group: pricing_Group,
        fully_signed_up: fullySignedUp || false,
        subscription_plan: subscriptionPlan,
      },
    });
    return user;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create user.");
  }
}
