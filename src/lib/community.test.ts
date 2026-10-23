import { describe, expect, it } from "vitest";
import { emptyNotebook, loadNotebook, persistNotebook, parseNotebook, reviewSchema, journalSchema } from "./community";
const base = { id: "local-1", title: "First sample", cultivar: "Reported Sour", cut: "", updatedAt: "2026-10-04T00:00:00Z" };
describe("local community notebook boundaries", () => {
  it("preserves corruption and propagates blocked reads without writing", () => {
    expect(() => loadNotebook({ getItem: () => "broken" })).toThrow();
    expect(() => loadNotebook({ getItem: () => { throw new Error("blocked"); } })).toThrow("blocked");
  });
  it("propagates quota errors without mutating the supplied notebook", () => {
    const book = emptyNotebook();
    expect(() => persistNotebook({ setItem: () => { throw new Error("quota"); } }, book)).toThrow("quota");
    expect(book).toEqual(emptyNotebook());
  });
  it("round-trips an empty notebook", () => { expect(parseNotebook(JSON.stringify(emptyNotebook()))).toEqual(emptyNotebook()); });
  it("keeps unknown cuts and missing canonical identity explicit", () => {
    const review = reviewSchema.parse({ ...base, format: "Flower", batch: "", producer: "", aroma: "", flavor: "", account: "My own observation", disclosure: "" });
    expect(review.cut).toBe(""); expect(review.cultivarEntityId).toBeNull();
  });
  it("rejects invalid stored data rather than silently resetting it", () => { expect(() => parseNotebook('{"version":9}')).toThrow(); });
  it("accepts unsuccessful runs and requires dated nonempty observations", () => {
    const journal = { ...base, environment: "Broad context", outcome: "Unsuccessful", entries: [{ id: "e1", date: "2026-10-04", text: "Observed outcome" }] };
    expect(journalSchema.parse(journal).outcome).toBe("Unsuccessful");
    expect(journalSchema.safeParse({ ...journal, entries: [{ id: "e1", date: "2026-02-30", text: "Impossible date" }] }).success).toBe(false);
    expect(journalSchema.safeParse({ ...journal, entries: [{ id: "e1", date: "", text: "" }] }).success).toBe(false);
  });
});
