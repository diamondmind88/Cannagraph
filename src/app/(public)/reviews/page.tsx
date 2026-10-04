import { NotebookView } from "@/components/community/notebook";
import { getPublicEntities } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  let cultivars: Awaited<ReturnType<typeof getPublicEntities>> = [];
  let catalogUnavailable = false;
  try {
    cultivars = await getPublicEntities("cultivar", 100);
  } catch {
    catalogUnavailable = true;
  }
  return <>
    {catalogUnavailable && <p role="status" className="mx-auto max-w-6xl px-5 pt-6 text-sm text-[var(--warning)]">The published cultivar index is unavailable. You can still save a draft with a reported name; it will have no canonical record link.</p>}
    <NotebookView mode="reviews" cultivars={cultivars} />
  </>;
}
