import { z } from "zod";

export const reviewSchema = z.object({
  id: z.string(), title: z.string().trim().min(1).max(160), cultivar: z.string().trim().min(1).max(160),
  cultivarEntityId: z.string().nullable().default(null), cut: z.string().max(160), format: z.enum(["Flower", "Hash", "Rosin", "Other"]),
  batch: z.string().max(160), producer: z.string().max(160), aroma: z.string().max(4000),
  flavor: z.string().max(4000), account: z.string().trim().min(1).max(8000),
  disclosure: z.string().max(1000), updatedAt: z.string(),
});
export const entrySchema = z.object({ id: z.string(), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => { const date = new Date(value); return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value; }, "Use a valid calendar date"), text: z.string().trim().min(1).max(8000) });
export const journalSchema = z.object({
  id: z.string(), title: z.string().trim().min(1).max(160), cultivar: z.string().trim().min(1).max(160),
  cultivarEntityId: z.string().nullable().default(null), cut: z.string().max(160), environment: z.string().max(2000),
  outcome: z.enum(["In progress", "Successful", "Unsuccessful", "Inconclusive"]),
  entries: z.array(entrySchema).max(1000), updatedAt: z.string(),
});
export const notebookSchema = z.object({ version: z.literal(1), reviews: z.array(reviewSchema).max(1000), journals: z.array(journalSchema).max(1000) });
export type Review = z.infer<typeof reviewSchema>;
export type Journal = z.infer<typeof journalSchema>;
export type Notebook = z.infer<typeof notebookSchema>;
export const storageKey = "cannagraph.community.notebook.v1";
export function emptyNotebook(): Notebook { return { version: 1, reviews: [], journals: [] }; }
export function parseNotebook(raw: string): Notebook { return notebookSchema.parse(JSON.parse(raw)); }

export function loadNotebook(storage: Pick<Storage, "getItem">): Notebook {
  const raw = storage.getItem(storageKey);
  return raw === null ? emptyNotebook() : parseNotebook(raw);
}
export function persistNotebook(storage: Pick<Storage, "setItem">, notebook: Notebook): void {
  // Validate the complete notebook before any mutation, including aggregate limits.
  storage.setItem(storageKey, JSON.stringify(notebookSchema.parse(notebook)));
}
