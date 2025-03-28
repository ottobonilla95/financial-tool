import { Currency, User } from "@/src/types";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export type Data = {
  id: string;
  name: string;
  email: string;
  last_updated: Date;
  password: string;
  currency?: Currency;
  tour_finished?: boolean;
  subscription_plan?: string;
  subscription_cancel_at?: number;
  stripeId?: string;
  subscription_id?: string;
  fully_signed_up?: boolean;
  pricing_group?: string;
  lang: string;
  created_at: Date;
};

type GetUserDataProps = {
  filters?: Prisma.usersWhereInput;
  select?: Prisma.usersSelect;
};

export async function getDBUser({ filters, select }: GetUserDataProps) {
  try {
    const user = await prisma.users.findFirst({
      where: filters,
      select: select,
    });

    if (user) {
      return mapUser(user as Data);
    }
    return undefined;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to get user.");
  }
}

export const mapUser = (user: Data): User => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    lastUpdated: user.last_updated?.toISOString(),
    password: user.password,
    currency: user.currency,
    tourFinished: user.tour_finished,
    subscriptionPlan: user.subscription_plan,
    subscriptionCancelAt: user.subscription_cancel_at,
    stripeId: user.stripeId,
    subscriptionId: user.subscription_id,
    fullySignedUp: user.fully_signed_up || false,
    pricingGroup: user.pricing_group || "",
    lang: user.lang,
    createdAt: user.created_at?.toISOString(),
  };
};
