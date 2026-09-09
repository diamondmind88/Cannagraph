import Link from "next/link";

import type { PublicEntity } from "@/lib/public-data";

const labels: Record<string, string> = {
  breeder: "Breeder",
  cultivar: "Cultivar",
  cut: "Clone-only cut",
  organization: "Organization",
  phenotype: "Phenotype",
  traditional_population: "Traditional population",
};

export function entityHref(entity: PublicEntity) {
  if (entity.entityType === "cultivar" && entity.slug) return `/cultivars/${entity.slug}`;
  if (entity.entityType === "breeder" && entity.slug) return `/breeders/${entity.slug}`;
  return "/cultivars";
}

export function EntityRow({ entity }: { entity: PublicEntity }) {
  return (
    <Link href={entityHref(entity)} className="group grid gap-4 border-b border-[var(--line)] px-1 py-6 transition hover:bg-[var(--surface-muted)] sm:grid-cols-[9rem_1fr_auto] sm:items-center sm:px-5">
      <div>
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--accent)]">{labels[entity.entityType] ?? entity.entityType}</p>
        <p className="mt-1 font-mono text-xs text-[var(--muted-light)]">{entity.publicId}</p>
      </div>
      <div className="min-w-0">
        <h2 className="truncate text-lg font-semibold tracking-tight group-hover:text-[var(--accent)]">{entity.canonicalName}</h2>
        <p className="mt-1 line-clamp-1 text-sm text-[var(--muted)]">{entity.description ?? "Canonical record with no public summary yet."}</p>
      </div>
      <span aria-hidden="true" className="hidden text-xl text-[var(--muted-light)] transition group-hover:translate-x-1 group-hover:text-[var(--accent)] sm:block">→</span>
    </Link>
  );
}
