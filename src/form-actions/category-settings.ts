"use server";

import { auth } from "@/auth";
import { mutateManagedCategory } from "@/src/data/category/settings";
import { AvailableLanguages, getDictionary } from "@/src/translations";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  kind: z.enum(["expense", "income"]),
  operation: z.enum(["create", "update", "delete"]),
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(100).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
}).superRefine((value, ctx) => {
  if ((value.operation !== "create" && !value.id) ||
      (value.operation !== "delete" && (!value.name || !value.color))) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid category" });
  }
});

export async function saveCategorySettings(lang: AvailableLanguages, formData: FormData) {
  const locale = lang === "es" ? "es" : "en";
  const dict = await getDictionary(locale);
  const session = await auth();
  if (!session?.user?.id) return { ok: false, message: dict.settings.signIn };
  const parsed = schema.safeParse({
    kind: formData.get("kind"), operation: formData.get("operation"),
    id: formData.get("id") || undefined,
    name: formData.get("name") ?? undefined, color: formData.get("color") ?? undefined,
  });
  if (!parsed.success) return { ok: false, message: dict.settings.invalid };
  const { kind, operation, id, name, color } = parsed.data;
  try {
    const result = await mutateManagedCategory(session.user.id, kind, operation, id, name && color ? { name, color } : undefined);
    if (result !== "success") return { ok: false, message: dict.settings[result] };
  } catch {
    return { ok: false, message: dict.settings.error };
  }
  revalidatePath("/[lang]/dashboard", "layout");
  return { ok: true, message: dict.settings.saved };
}
