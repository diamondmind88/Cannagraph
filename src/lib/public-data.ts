import { createSupabaseServerClient } from "@/lib/supabase/server";

export type PublicEntity = {
  canonicalName: string;
  description: string | null;
  entityType: string;
  id: string;
  publicId: string;
  publishedAt: string | null;
  slug: string | null;
};

export type PublicSource = {
  canonicalUrl: string | null;
  id: string;
  publisher: string | null;
  sourceType: string;
  title: string;
};

function safeExternalUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function mapEntity(row: {
  canonical_name: string;
  description: string | null;
  entity_type: string;
  id: string;
  public_id: string;
  published_at: string | null;
  slug: string | null;
}): PublicEntity {
  return {
    canonicalName: row.canonical_name,
    description: row.description,
    entityType: row.entity_type,
    id: row.id,
    publicId: row.public_id,
    publishedAt: row.published_at,
    slug: row.slug,
  };
}

export async function getPublicStats() {
  const supabase = await createSupabaseServerClient();
  const [entities, cultivars, breeders, sources] = await Promise.all([
    supabase.from("entities").select("id", { count: "exact", head: true }),
    supabase.from("entities").select("id", { count: "exact", head: true }).eq("entity_type", "cultivar"),
    supabase.from("entities").select("id", { count: "exact", head: true }).eq("entity_type", "breeder"),
    supabase.from("sources").select("id", { count: "exact", head: true }),
  ]);

  const error = entities.error ?? cultivars.error ?? breeders.error ?? sources.error;
  if (error) throw error;

  return {
    entities: entities.count ?? 0,
    cultivars: cultivars.count ?? 0,
    breeders: breeders.count ?? 0,
    sources: sources.count ?? 0,
  };
}

export async function getPublicEntities(entityType: "cultivar" | "breeder", limit = 24) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("entities")
    .select("id, public_id, canonical_name, entity_type, slug, description, published_at")
    .eq("entity_type", entityType)
    .order("canonical_name")
    .limit(limit);

  if (error) throw error;
  return data.map(mapEntity);
}

export async function getPublicEntityBySlug(entityType: "cultivar" | "breeder", slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("entities")
    .select("id, public_id, canonical_name, entity_type, slug, description, published_at")
    .eq("entity_type", entityType)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? mapEntity(data) : null;
}

export async function searchPublicEntities(rawQuery: string, limit = 40) {
  const query = rawQuery.trim().slice(0, 100);
  if (query.length < 2) return [];

  const supabase = await createSupabaseServerClient();
  const pattern = `%${query.replaceAll("%", "\\%").replaceAll("_", "\\_")}%`;
  const [canonicalMatches, publicIdMatches] = await Promise.all([
    supabase
      .from("entities")
      .select("id, public_id, canonical_name, entity_type, slug, description, published_at")
      .ilike("canonical_name", pattern)
      .limit(limit),
    supabase
      .from("entities")
      .select("id, public_id, canonical_name, entity_type, slug, description, published_at")
      .ilike("public_id", pattern)
      .limit(limit),
  ]);

  const { data: nameMatches, error: nameError } = await supabase
    .from("entity_names")
    .select("entity_id")
    .ilike("normalized_name", pattern)
    .limit(limit);

  if (canonicalMatches.error) throw canonicalMatches.error;
  if (publicIdMatches.error) throw publicIdMatches.error;
  if (nameError) throw nameError;

  const directMatches = [...canonicalMatches.data];
  const directIds = new Set(directMatches.map((entity) => entity.id));
  for (const entity of publicIdMatches.data) {
    if (!directIds.has(entity.id)) {
      directIds.add(entity.id);
      directMatches.push(entity);
    }
  }
  const aliasIds = [...new Set(nameMatches.map((name) => name.entity_id))].filter((id) => !directIds.has(id));
  let aliasMatches: typeof directMatches = [];

  if (aliasIds.length > 0) {
    const { data, error } = await supabase
      .from("entities")
      .select("id, public_id, canonical_name, entity_type, slug, description, published_at")
      .in("id", aliasIds)
      .limit(Math.max(0, limit - directMatches.length));
    if (error) throw error;
    aliasMatches = data;
  }

  return [...directMatches, ...aliasMatches].slice(0, limit).map(mapEntity);
}

export async function getPublicSource(id: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return null;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("sources")
    .select("id, title, publisher, source_type, canonical_url")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const { data: documents, error: documentsError } = await supabase
    .from("source_documents")
    .select("id, title, document_url, published_at, retrieved_at, relationship_type")
    .eq("source_id", id)
    .order("published_at", { ascending: false, nullsFirst: false });
  if (documentsError) throw documentsError;

  return {
    source: {
      canonicalUrl: safeExternalUrl(data.canonical_url),
      id: data.id,
      publisher: data.publisher,
      sourceType: data.source_type,
      title: data.title,
    } satisfies PublicSource,
    documents: documents.map((document) => ({
      ...document,
      document_url: safeExternalUrl(document.document_url),
    })),
  };
}
