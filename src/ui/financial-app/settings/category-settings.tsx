"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { CategoryKind, ManagedCategory } from "@/src/data/category/settings";
import { saveCategorySettings } from "@/src/form-actions/category-settings";
import type { AppDictionary, AvailableLanguages } from "@/src/translations";

type Labels = AppDictionary["settings"];
const button = "rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50";

function CategoryForm({ category, kind, lang, labels, onClose }: {
  category?: ManagedCategory; kind: CategoryKind; lang: AvailableLanguages; labels: Labels; onClose?: (saved?: boolean) => void;
}) {
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; message: string }>();
  const prefix = category?.id || `new-${kind}`;

  async function submit(data: FormData) {
    setPending(true);
    setMessage(undefined);
    try {
      const result = await saveCategorySettings(lang, data);
      setMessage(result);
      if (result.ok) {
        if (!category) form.current?.reset();
        router.refresh();
        onClose?.(true);
      }
    } catch {
      setMessage({ ok: false, message: labels.error });
    } finally {
      setPending(false);
    }
  }

  return (
    <form ref={form} action={submit} className="space-y-3">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="operation" value={category ? "update" : "create"} />
      {category && <input type="hidden" name="id" value={category.id} />}
      <fieldset disabled={pending} className="flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1 basis-40">
          <label className="mb-1 block text-sm font-medium" htmlFor={`${prefix}-name`}>{labels.name}</label>
          <input autoFocus={!!category} id={`${prefix}-name`} name="name" required maxLength={100} defaultValue={category?.name || ""} className="w-full rounded-md border-gray-300" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor={`${prefix}-color`}>{labels.color}</label>
          <input id={`${prefix}-color`} type="color" name="color" defaultValue={category?.color || "#6366f1"} className="h-[42px] w-14 cursor-pointer rounded border border-gray-300 bg-white p-1" />
        </div>
        <button type="submit" className={`${button} bg-black text-white hover:bg-gray-800`}>{pending ? labels.saving : category ? labels.save : labels.add}</button>
        {onClose && <button type="button" className={button} onClick={() => onClose(false)}>{labels.cancel}</button>}
      </fieldset>
      {message && <p role={message.ok ? "status" : "alert"} className={`text-sm ${message.ok ? "text-green-700" : "text-red-700"}`}>{message.message}</p>}
    </form>
  );
}

function CategoryRow({ category, kind, lang, labels }: { category: ManagedCategory; kind: CategoryKind; lang: AvailableLanguages; labels: Labels }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const inUse = category.transactions > 0 || category.subcategories > 0;

  async function remove() {
    setPending(true);
    setMessage("");
    const data = new FormData();
    data.set("kind", kind);
    data.set("operation", "delete");
    data.set("id", category.id);
    try {
      const result = await saveCategorySettings(lang, data);
      if (result.ok) router.refresh();
      else setMessage(result.message);
    } catch {
      setMessage(labels.error);
    } finally {
      setPending(false);
    }
  }

  return (
    <li className="p-4">
      {editing ? <CategoryForm category={category} kind={kind} lang={lang} labels={labels} onClose={(saved) => { setEditing(false); setMessage(saved ? labels.saved : ""); }} /> : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span aria-hidden="true" className="h-4 w-4 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: category.color || "#6366f1" }} />
              <div className="min-w-0">
                <p className="break-words font-medium">{category.name}</p>
                <p className="text-xs text-gray-500">{category.transactions} {labels.transactions} · {category.subcategories} {labels.subcategories}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" className={button} disabled={pending || confirming} aria-label={`${labels.edit}: ${category.name}`} onClick={() => { setEditing(true); setMessage(""); }}>{labels.edit}</button>
              <button type="button" className={`${button} text-red-700`} disabled={inUse || pending || confirming} title={inUse ? labels.inUse : undefined} aria-label={`${labels.delete}: ${category.name}`} onClick={() => { setConfirming(true); setMessage(""); }}>{labels.delete}</button>
            </div>
          </div>
          {confirming && <div className="mt-3 rounded-md bg-red-50 p-3">
            <p className="mb-3 text-sm">{labels.confirmDelete} <strong>{category.name}</strong>?</p>
            <div className="flex gap-2">
              <button type="button" disabled={pending} className={`${button} text-red-700`} onClick={remove}>{pending ? labels.saving : labels.delete}</button>
              <button type="button" disabled={pending} className={button} onClick={() => setConfirming(false)}>{labels.cancel}</button>
            </div>
          </div>}
          {message && <p role="status" className="mt-2 text-sm">{message}</p>}
        </>
      )}
    </li>
  );
}

export default function CategorySettings({ categories, lang, labels }: {
  categories: Record<CategoryKind, ManagedCategory[]>; lang: AvailableLanguages; labels: Labels;
}) {
  const [kind, setKind] = useState<CategoryKind>("expense");
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm" aria-label={labels.categories}>
      <div className="border-b border-gray-200 p-4 md:p-6">
        <h2 className="text-lg font-semibold">{labels.categories}</h2>
        <div className="my-4 flex gap-2" role="group" aria-label={labels.categoryType}>
          {(["expense", "income"] as const).map((value) => <button key={value} type="button" aria-pressed={kind === value} onClick={() => setKind(value)} className={`${button} ${kind === value ? "bg-black text-white hover:bg-gray-800" : ""}`}>{labels[value]} ({categories[value].length})</button>)}
        </div>
        <CategoryForm key={kind} kind={kind} lang={lang} labels={labels} />
      </div>
      <p className="border-b border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600 md:px-6">{labels.deleteHint}</p>
      {categories[kind].length ? <ul className="divide-y divide-gray-100">
        {categories[kind].map((category) => <CategoryRow key={category.id} category={category} kind={kind} lang={lang} labels={labels} />)}
      </ul> : <p className="p-8 text-center text-gray-500">{labels.empty}</p>}
    </section>
  );
}
