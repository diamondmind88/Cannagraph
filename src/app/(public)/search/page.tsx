import { EmptyState } from "@/components/public/empty-state";
import { EntityRow } from "@/components/public/entity-row";
import { PageHeading } from "@/components/public/page-heading";
import { SearchBox } from "@/components/public/search-box";
import { searchPublicEntities } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const query = (await searchParams).q?.trim() ?? "";
  const results = await searchPublicEntities(query);

  return (
    <div className="mx-auto min-h-[70vh] max-w-[90rem] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
      <PageHeading eyebrow="Research index" title="Search the archive" description="Search canonical names, public record IDs, and supported aliases without collapsing distinct identities." />
      <div className="py-9"><SearchBox defaultValue={query} /></div>
      {query.length < 2 ? (
        <EmptyState title="Enter at least two characters" description="Try a cultivar name, breeder name, known alias, or a Cannagraph public ID." />
      ) : results.length === 0 ? (
        <EmptyState title={`No published matches for “${query}”`} description="The archive only returns records that have passed publication review. A missing result does not mean the name or cultivar never existed." />
      ) : (
        <section aria-labelledby="results-title">
          <div className="flex items-baseline justify-between border-b border-[var(--line)] pb-4">
            <h2 id="results-title" className="text-xl font-semibold">Results</h2>
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--muted)]">{results.length} records</p>
          </div>
          {results.map((entity) => <EntityRow entity={entity} key={entity.id} />)}
        </section>
      )}
    </div>
  );
}
