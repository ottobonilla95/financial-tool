"use client";

import { ExpenseCategory } from "@/src/types";
import { useTranslations } from "@/src/translations/use-translations";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Button, Dropdown, Spinner } from "@/src/ui/components";

type DraftExpenseRow = {
  id: string;
  date: string; // YYYY-MM-DD
  amount: string; // keep as string for editing
  description: string;
  categoryId: string;
  subCategoryId?: string;
};

type SkippedItem = { raw: string; reason: string };

function ymd(date: Date) {
  return date.toISOString().slice(0, 10);
}

function makeId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readJsonResponse(res: Response) {
  const text = await res.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      res.ok
        ? "Server returned an invalid response."
        : text.slice(0, 160) || "Request failed."
    );
  }
}

export type AiImportExpensesProps = {
  categories: ExpenseCategory[];
  month: number;
  year: number;
  currencyId?: number;
  closeModal: () => void;
};

export function AiImportExpenses({
  categories,
  month,
  year,
  currencyId,
  closeModal,
}: AiImportExpensesProps) {
  const { dict, lang } = useTranslations();
  const router = useRouter();

  const fallbackCategoryId = categories[0]?.id;
  const baseDate = useMemo(() => new Date(year, month - 1, 1), [year, month]);
  const defaultDate = useMemo(() => ymd(baseDate), [baseDate]);

  const [text, setText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState<DraftExpenseRow[]>([]);
  const [skipped, setSkipped] = useState<SkippedItem[]>([]);

  const categoryOptions = useMemo(
    () =>
      categories.map((c) => ({
        value: c.id,
        label: c.name,
      })),
    [categories]
  );

  const getSubcategoryOptions = (categoryId: string) => {
    const subs = categories.find((c) => c.id === categoryId)?.subcategories || [];
    return subs.map((s) => ({ value: s.id, label: s.name }));
  };

  const pollImportResult = async (responseId: string) => {
    for (let attempt = 0; attempt < 90; attempt += 1) {
      await sleep(attempt < 5 ? 1000 : 2500);

      const res = await fetch(
        `/api/expense/ai-import?responseId=${encodeURIComponent(
          responseId
        )}&baseDate=${encodeURIComponent(defaultDate)}`
      );
      const data = await readJsonResponse(res);

      if (res.status === 202) continue;
      if (!res.ok) {
        throw new Error(data?.error || "Failed to process text");
      }

      return data;
    }

    throw new Error("AI import is still processing. Try again in a moment.");
  };

  const onProcess = async () => {
    if (!text.trim()) {
      toast("Paste some text first.", { type: "info" });
      return;
    }
    if (!fallbackCategoryId) {
      toast("You need at least one category to import expenses.", {
        type: "error",
      });
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch("/api/expense/ai-import", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          text,
          baseDate: defaultDate,
          lang,
        }),
      });

      let data = await readJsonResponse(res);
      if (res.status === 202 && data?.responseId) {
        data = await pollImportResult(String(data.responseId));
      } else if (!res.ok) {
        throw new Error(data?.error || "Failed to process text");
      }

      const nextRows: DraftExpenseRow[] = (data.expenses || []).map((e: any) => ({
        id: makeId(),
        date: typeof e.date === "string" ? e.date : defaultDate,
        amount: String(e.amount ?? ""),
        description: String(e.description ?? ""),
        categoryId: String(e.categoryId ?? fallbackCategoryId),
        subCategoryId: e.subCategoryId ? String(e.subCategoryId) : undefined,
      }));

      setRows(nextRows);
      setSkipped(Array.isArray(data.skipped) ? data.skipped : []);

      if (!nextRows.length) {
        toast("No expenses found with an amount. Nothing to import.", {
          type: "info",
        });
      }
    } catch (err: any) {
      toast(err?.message || "Something went wrong.", { type: "error" });
    } finally {
      setProcessing(false);
    }
  };

  const onSaveAll = async () => {
    if (!rows.length) {
      toast("No rows to save.", { type: "info" });
      return;
    }
    if (!fallbackCategoryId) return;

    setSaving(true);
    try {
      const payload = rows
        .map((r) => ({
          amount: Number(String(r.amount).replace(",", ".")),
          date: r.date || defaultDate,
          description: r.description || "",
          categoryId: r.categoryId || fallbackCategoryId,
          subCategoryId: r.subCategoryId || null,
          currencyId: typeof currencyId === "number" ? currencyId : null,
        }))
        .filter((r) => Number.isFinite(r.amount) && r.amount > 0);

      const res = await fetch("/api/expense/bulk-create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ expenses: payload }),
      });

      const data = await readJsonResponse(res);
      if (!res.ok) {
        throw new Error(data?.error || "Failed to save expenses");
      }

      toast(
        `Created ${data.createdCount} expense${data.createdCount === 1 ? "" : "s"}.`,
        { type: "success" }
      );

      router.refresh();
      closeModal();
    } catch (err: any) {
      toast(err?.message || "Something went wrong.", { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const removeRow = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id));

  return (
    <div className="rounded-md p-4 md:p-6">
      <div className="mb-3">
        <div className="text-lg font-bold">Import with AI</div>
        <div className="text-sm text-neutral-600">
          Paste messy text. We’ll extract expenses, then you review/edit before
          saving.
        </div>
      </div>

      <div className="relative">
        {(processing || saving) && (
          <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center">
            <Spinner className="h-8 w-8" />
          </div>
        )}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          className="w-full rounded-md border border-gray-200 p-3 text-sm outline-2"
          placeholder='Example: "12th April supermarket 11.20", "10 April uber 7.50"...'
        />

        <div className="mt-3 flex flex-wrap gap-3">
          <Button onClick={onProcess} className="bg-black text-white">
            Process
          </Button>
          <Button
            onClick={() => {
              setRows([]);
              setSkipped([]);
              setText("");
            }}
            className="bg-white text-black border border-gray-200"
          >
            Clear
          </Button>
        </div>
      </div>

      {skipped.length > 0 && (
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm">
          <div className="font-semibold mb-1">
            Skipped ({skipped.length}) — missing/invalid amount
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {skipped.slice(0, 8).map((s, i) => (
              <li key={`${s.raw}-${i}`}>
                <span className="font-medium">{s.reason}:</span> {s.raw}
              </li>
            ))}
            {skipped.length > 8 && (
              <li>…and {skipped.length - 8} more</li>
            )}
          </ul>
        </div>
      )}

      {rows.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">
              Review ({rows.length}) — edit inline, then save all
            </div>
            <div className="flex gap-3">
              <Button onClick={closeModal} disabled={saving}>
                {dict.shared?.close || "Close"}
              </Button>
              <Button
                onClick={onSaveAll}
                className="bg-black text-white whitespace-nowrap min-w-[100px] flex items-center justify-center gap-2"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save all"
                )}
              </Button>
            </div>
          </div>

          <div className="w-full overflow-x-auto rounded-md border border-gray-200">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 w-[140px]">Date</th>
                  <th className="text-left p-3 w-[140px]">Amount</th>
                  <th className="text-left p-3">Description</th>
                  <th className="text-left p-3 w-[220px]">Category</th>
                  <th className="text-left p-3 w-[220px]">Subcategory</th>
                  <th className="text-left p-3 w-[90px]">Remove</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const subOptions = getSubcategoryOptions(r.categoryId);
                  return (
                    <tr key={r.id} className="border-t border-gray-100">
                      <td className="p-3">
                        <input
                          type="date"
                          value={r.date || defaultDate}
                          onChange={(e) =>
                            setRows((prev) =>
                              prev.map((x) =>
                                x.id === r.id ? { ...x, date: e.target.value } : x
                              )
                            )
                          }
                          className="w-full rounded-md border border-gray-200 px-2 py-1"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={r.amount}
                          onChange={(e) =>
                            setRows((prev) =>
                              prev.map((x) =>
                                x.id === r.id ? { ...x, amount: e.target.value } : x
                              )
                            )
                          }
                          className="w-full rounded-md border border-gray-200 px-2 py-1"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={r.description}
                          onChange={(e) =>
                            setRows((prev) =>
                              prev.map((x) =>
                                x.id === r.id
                                  ? { ...x, description: e.target.value }
                                  : x
                              )
                            )
                          }
                          className="w-full rounded-md border border-gray-200 px-2 py-1"
                        />
                      </td>
                      <td className="p-3">
                        <Dropdown
                          options={categoryOptions}
                          defaultValue={{
                            value: r.categoryId,
                            label:
                              categories.find((c) => c.id === r.categoryId)?.name ||
                              categories[0]?.name ||
                              "",
                          }}
                          onChange={(opt) => {
                            const nextCategoryId = opt?.value || fallbackCategoryId;
                            setRows((prev) =>
                              prev.map((x) =>
                                x.id === r.id
                                  ? {
                                      ...x,
                                      categoryId: nextCategoryId!,
                                      subCategoryId: undefined,
                                    }
                                  : x
                              )
                            );
                          }}
                          showAddButon={false}
                          isClearable={false}
                        />
                      </td>
                      <td className="p-3">
                        <Dropdown
                          options={subOptions}
                          defaultValue={
                            r.subCategoryId
                              ? {
                                  value: r.subCategoryId,
                                  label:
                                    categories
                                      .find((c) => c.id === r.categoryId)
                                      ?.subcategories?.find(
                                        (s) => s.id === r.subCategoryId
                                      )?.name || "",
                                }
                              : undefined
                          }
                          onChange={(opt) =>
                            setRows((prev) =>
                              prev.map((x) =>
                                x.id === r.id
                                  ? { ...x, subCategoryId: opt?.value }
                                  : x
                              )
                            )
                          }
                          showAddButon={false}
                          isClearable
                        />
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          className="text-red-600 hover:underline"
                          onClick={() => removeRow(r.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-3 text-xs text-neutral-500">
            Emotion defaults to neutral. Rows with missing/invalid amount are skipped.
          </div>
        </div>
      )}
    </div>
  );
}
