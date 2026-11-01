"use client";

import { useTranslations } from "@/src/translations/use-translations";

export function CategoryLoadError({ error, retry }: { error: unknown; retry: () => Promise<unknown> }) {
  const { dict } = useTranslations();
  if (!error) return null;
  return (
    <div role="alert" className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
      <p>{dict.forms?.shared.categoryLoadError}</p>
      <button type="button" className="mt-2 underline" onClick={() => void retry().catch(() => {})}>
        {dict.forms?.shared.retry}
      </button>
    </div>
  );
}
