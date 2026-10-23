"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { emptyNotebook, loadNotebook, persistNotebook, reviewSchema, journalSchema, entrySchema, type Notebook } from "@/lib/community";
import { PageHeading } from "@/components/public/page-heading";

const control = "mt-2 block w-full rounded-md border border-[var(--line)] bg-[var(--surface)] p-3";
const button = "rounded-md bg-[var(--accent)] px-4 py-3 text-white disabled:opacity-50";
function Field({ name, label, required = false, multiline = false, value = "" }: { name: string; label: string; required?: boolean; multiline?: boolean; value?: string }) {
  return <label className="block text-sm font-medium">{label}{multiline ? <textarea className={control} name={name} required={required} defaultValue={value} maxLength={name === "account" || name === "text" ? 8000 : 2000} rows={4} /> : <input className={control} name={name} required={required} defaultValue={value} maxLength={160} />}</label>;
}
export function NotebookView({ mode, cultivars = [] }: { mode: "reviews" | "journals"; cultivars?: { id: string; canonicalName: string }[] }) {
  const [book, setBook] = useState<Notebook>(emptyNotebook);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [entryFor, setEntryFor] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
    if (!active) return;
    try { setBook(loadNotebook(localStorage)); setReady(true); }
    catch { setError("Your saved notebook could not be opened. Existing data has not been replaced. Try another browser or recover it from browser storage."); }
    });
    return () => { active = false; };
  }, []);
  function save(next: Notebook) {
    try { persistNotebook(localStorage, next); setBook(next); setError(""); setNotice("Saved in this browser."); return true; }
    catch { setError("Could not save. Browser storage may be blocked or full. Your form is still here; export saved records before clearing storage."); return false; }
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
    const get = (key: string) => String(data.get(key) ?? "");
    const base = { cultivarEntityId: get("cultivarEntityId") || null, id: editing ?? crypto.randomUUID(), title: get("title"), cultivar: get("cultivar").trim() || "Unknown cultivar", cut: get("cut"), updatedAt: new Date().toISOString() };
    const result = mode === "reviews"
      ? reviewSchema.safeParse({ ...base, format: get("format"), batch: get("batch"), producer: get("producer"), aroma: get("aroma"), flavor: get("flavor"), account: get("account"), disclosure: get("disclosure") })
      : journalSchema.safeParse({ ...base, environment: get("environment"), outcome: get("outcome"), entries: book.journals.find(j => j.id === editing)?.entries ?? [] });
    if (!result.success) { setError("Check required fields and shorten text that exceeds the field limits."); return; }
    const next = mode === "reviews" ? { ...book, reviews: [result.data as Notebook["reviews"][number], ...book.reviews.filter(r => r.id !== editing)] } : { ...book, journals: [result.data as Notebook["journals"][number], ...book.journals.filter(j => j.id !== editing)] };
    if (save(next)) { setEditing(null); form.reset(); }
  }
  function addEntry(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
    const result = entrySchema.safeParse({ id: crypto.randomUUID(), date: data.get("date"), text: data.get("text") });
    if (!result.success) { setError("Enter an observation date and some notes."); return; }
    const next = { ...book, journals: book.journals.map(j => j.id === id ? { ...j, updatedAt: new Date().toISOString(), entries: [...j.entries, result.data] } : j) };
    if (save(next)) { form.reset(); setEntryFor(null); }
  }
  function remove(id: string) {
    if (!window.confirm("Delete this saved record and its entries from this browser?")) return;
    if (save({ ...book, [mode]: book[mode].filter(r => r.id !== id) })) { setEditing(null); setNotice("Record deleted from this browser."); }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(book, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "CannaGraph_personal_notebook.json"; anchor.click(); URL.revokeObjectURL(url);
  }
  const record = book[mode].find(r => r.id === editing);
  const review = mode === "reviews" ? book.reviews.find(r => r.id === editing) : undefined;
  const journal = mode === "journals" ? book.journals.find(r => r.id === editing) : undefined;
  return <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
    <PageHeading eyebrow="Personal notebook · local preview" title={mode === "reviews" ? "Reviews in your own words" : "Your grow journal"} description={mode === "reviews" ? "Keep batch-specific aroma, flavor and experience notes. These are your observations, not verified cultivar facts." : "Document context, dated observations and outcomes, including unsuccessful runs and unanswered questions."} />
    <nav className="my-6 flex flex-wrap gap-5" aria-label="Notebook"><Link href="/reviews" className="underline">Reviews</Link><Link href="/journals" className="underline">Journals</Link><button type="button" onClick={download} disabled={!ready} className="underline disabled:opacity-50">Export saved notebook</button></nav>
    <p className="rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] p-4 text-sm leading-6">Saved only in this browser on this device. Nothing is published or synced. This is not an encrypted private account; anyone using this browser can access it. Clearing browser data removes these records. Export a backup. Cultivar and cut names are unverified labels here.</p>
    {error && <p role="alert" className="mt-4 text-[var(--danger)]">{error}</p>}{notice && <p role="status" className="mt-4">{notice}</p>}
    <section className="mt-8 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
      <h2 className="text-2xl font-semibold">{editing ? "Edit saved record" : mode === "reviews" ? "Write a review draft" : "Start a journal"}</h2>
      <form key={editing ?? "new"} onSubmit={submit} className="mt-5 grid gap-5">
        <Field name="title" label="Title" required value={record?.title} /><label>Optional published cultivar reference<select name="cultivarEntityId" className={control} defaultValue={record?.cultivarEntityId ?? ""}><option value="">Unlinked / unknown identity</option>{record?.cultivarEntityId && !cultivars.some(c => c.id === record.cultivarEntityId) && <option value={record.cultivarEntityId}>Saved reference (catalog currently unavailable)</option>}{cultivars.map(c => <option key={c.id} value={c.id}>{c.canonicalName}</option>)}</select><span className="mt-1 block text-xs text-[var(--muted)]">Selecting a reference does not verify the identity of your specimen or batch.</span></label><div className="grid gap-5 sm:grid-cols-2"><Field name="cultivar" label="Reported cultivar name" value={record?.cultivar} /><Field name="cut" label="Reported cut (leave blank if unknown)" value={record?.cut} /></div>
        {mode === "reviews" ? <><label>Product format<select name="format" className={control} defaultValue={review?.format ?? "Flower"}>{["Flower", "Hash", "Rosin", "Other"].map(v => <option key={v}>{v}</option>)}</select></label><Field name="producer" label="Grower / producer (if known)" value={review?.producer} /><Field name="batch" label="Batch or sample identifier (if known)" value={review?.batch} /><Field name="aroma" label="Aroma" multiline value={review?.aroma} /><Field name="flavor" label="Flavor" multiline value={review?.flavor} /><Field name="account" label="Your full account and relevant context" required multiline value={review?.account} /><Field name="disclosure" label="Gifted sample, sponsorship or commercial connection" multiline value={review?.disclosure} /></> : <><Field name="environment" label="Broad environment and run context (avoid exact addresses)" multiline value={journal?.environment} /><label>Outcome<select name="outcome" className={control} defaultValue={journal?.outcome ?? "In progress"}>{["In progress", "Successful", "Unsuccessful", "Inconclusive"].map(v => <option key={v}>{v}</option>)}</select></label></>}
        <div className="flex gap-4"><button disabled={!ready} className={button}>{editing ? "Save changes locally" : "Save locally"}</button>{editing && <button type="button" onClick={() => setEditing(null)}>Cancel edit</button>}</div>
      </form>
    </section>
    <section className="mt-10" aria-label="Saved records"><h2 className="text-2xl font-semibold">Saved {mode}</h2>{ready && book[mode].length === 0 && <p className="mt-4 text-[var(--muted)]">Your first saved {mode === "reviews" ? "review" : "journal"} will appear here.</p>}
      {book[mode].map(item => <article key={item.id} className="mt-5 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5"><h3 className="text-xl font-semibold">{item.title}</h3><p className="mt-2 text-sm">{item.cultivar} · {item.cut || "Cut unknown"} · Local only</p>{item.cultivarEntityId && <p className="mt-1 text-xs text-[var(--muted)]">Associated reference: {cultivars.find(c => c.id === item.cultivarEntityId)?.canonicalName ?? item.cultivarEntityId} (reported association; identity unverified)</p>}
        {"account" in item ? <div className="mt-4 space-y-3 whitespace-pre-wrap break-words"><p>{item.format} · {item.producer || "Producer unknown"} · {item.batch || "Batch unknown"}</p>{item.aroma && <p><strong>Aroma: </strong>{item.aroma}</p>}{item.flavor && <p><strong>Flavor: </strong>{item.flavor}</p>}<p>{item.account}</p>{item.disclosure && <p><strong>Disclosure: </strong>{item.disclosure}</p>}</div> : <><p className="mt-4 whitespace-pre-wrap break-words">{item.environment || "Environment not recorded"}</p><p className="mt-2">Outcome: {item.outcome}</p><ol className="mt-4 space-y-4">{[...item.entries].sort((a,b) => a.date.localeCompare(b.date)).map(e => <li key={e.id}><time dateTime={e.date} className="font-mono text-sm">{e.date}</time><p className="mt-1 whitespace-pre-wrap break-words">{e.text}</p><button type="button" className="mt-2 text-xs underline text-[var(--danger)]" onClick={() => { if (window.confirm("Delete this observation from this browser?")) save({ ...book, journals: book.journals.map(j => j.id === item.id ? { ...j, entries: j.entries.filter(entry => entry.id !== e.id), updatedAt: new Date().toISOString() } : j) }); }}>Delete observation</button></li>)}</ol>{entryFor === item.id ? <form onSubmit={e => addEntry(e, item.id)} className="mt-5 grid gap-4"><label>Observed date<input type="date" name="date" required className={control} /></label><Field name="text" label="Observation, question or hypothesis (label hypotheses explicitly)" multiline required /><div><button className={button}>Save entry locally</button><button type="button" className="ml-4" onClick={() => setEntryFor(null)}>Cancel</button></div></form> : <button type="button" className="mt-4 underline" onClick={() => setEntryFor(item.id)}>Add dated observation</button>}</>}
        <div className="mt-5 flex gap-5 text-sm"><button type="button" className="underline" onClick={() => { setEditing(item.id); setNotice(""); }}>Edit</button><button type="button" className="underline text-[var(--danger)]" onClick={() => remove(item.id)}>Delete</button></div>
      </article>)}
    </section>
  </div>;
}
