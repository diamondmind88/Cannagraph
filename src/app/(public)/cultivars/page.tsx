import { EmptyState } from "@/components/public/empty-state";
import { EntityRow } from "@/components/public/entity-row";
import { PageHeading } from "@/components/public/page-heading";
import { getPublicEntities } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function CultivarsPage() {
  const cultivars = await getPublicEntities("cultivar", 100);
  return (
    <div className="mx-auto min-h-[70vh] max-w-[90rem] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
      <PageHeading eyebrow="Canonical index" title="Cultivars" description="Published cultivar identities ordered by canonical name. Cuts, phenotypes, and traditional populations remain separate research objects." />
      <div className="mt-9">
        {cultivars.length > 0 ? <div className="border-t border-[var(--line)]">{cultivars.map((entity) => <EntityRow entity={entity} key={entity.id} />)}</div> : <EmptyState title="No cultivars have been published yet" description="Records will appear here only after identity and evidence review. The live database is connected and ready for the first accepted research records." />}
      </div>
    </div>
  );
}
