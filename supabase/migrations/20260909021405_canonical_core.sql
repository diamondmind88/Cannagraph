-- Slice 1: canonical identity, provenance, claims, lineage, and hypotheses.

create schema if not exists app_private;
revoke all on schema app_private from public, anon, authenticated;

create sequence public.entity_public_id_seq;

create or replace function app_private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function app_private.set_entity_public_id()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  prefix text;
begin
  if new.public_id is not null then
    return new;
  end if;

  prefix := case new.entity_type
    when 'cultivar' then 'CUL'
    when 'breeder' then 'BRE'
    when 'cut' then 'CUT'
    when 'phenotype' then 'PHE'
    when 'traditional_population' then 'POP'
    when 'organization' then 'ORG'
  end;

  new.public_id := 'CNG-' || prefix || '-' ||
    lpad(nextval('public.entity_public_id_seq')::text, 8, '0');
  return new;
end;
$$;

create table public.entities (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique,
  entity_type text not null check (entity_type in (
    'cultivar', 'breeder', 'cut', 'phenotype', 'traditional_population', 'organization'
  )),
  canonical_name text not null check (length(trim(canonical_name)) > 0),
  slug text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived', 'merged')),
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  constraint entities_slug_format check (slug is null or slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint entities_public_id_format check (public_id ~ '^CNG-(CUL|BRE|CUT|PHE|POP|ORG)-[0-9]{8}$'),
  constraint entities_public_id_type check (
    split_part(public_id, '-', 2) = case entity_type
      when 'cultivar' then 'CUL'
      when 'breeder' then 'BRE'
      when 'cut' then 'CUT'
      when 'phenotype' then 'PHE'
      when 'traditional_population' then 'POP'
      when 'organization' then 'ORG'
    end
  ),
  constraint entities_publication_time check (
    (status = 'published' and published_at is not null) or status <> 'published'
  )
);

create trigger entities_set_public_id before insert on public.entities
for each row execute function app_private.set_entity_public_id();
create trigger entities_set_updated_at before update on public.entities
for each row execute function app_private.set_updated_at();
create unique index entities_slug_unique on public.entities (slug) where slug is not null;
create index entities_type_status_idx on public.entities (entity_type, status);
create index entities_canonical_name_idx on public.entities (lower(canonical_name));

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) > 0),
  publisher text,
  source_type text not null check (source_type in (
    'scientific_database', 'journal', 'book', 'registry', 'breeder', 'archive',
    'government', 'website', 'community', 'interview', 'other'
  )),
  canonical_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index sources_canonical_url_unique on public.sources (canonical_url) where canonical_url is not null;
create trigger sources_set_updated_at before update on public.sources
for each row execute function app_private.set_updated_at();

create table public.source_documents (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources(id) on delete restrict,
  title text,
  document_url text,
  published_at timestamptz,
  retrieved_at timestamptz not null default now(),
  content_hash text,
  relationship_type text not null default 'original' check (relationship_type in (
    'original', 'derived', 'quoted', 'syndicated', 'copied', 'unknown'
  )),
  parent_document_id uuid references public.source_documents(id) on delete set null,
  extractor_version text,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  constraint source_documents_not_self_parent check (parent_document_id is null or parent_document_id <> id),
  constraint source_documents_locator check (document_url is not null or content_hash is not null)
);
create index source_documents_source_id_idx on public.source_documents (source_id);
create index source_documents_parent_document_id_idx on public.source_documents (parent_document_id);
create unique index source_documents_hash_unique on public.source_documents (source_id, content_hash)
  where content_hash is not null;
create unique index source_documents_url_unique on public.source_documents (source_id, document_url)
  where document_url is not null;

create table public.entity_names (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  normalized_name text not null check (length(trim(normalized_name)) > 0),
  name_type text not null check (name_type in ('canonical', 'alias', 'historical', 'trade', 'misspelling')),
  language_code text check (language_code is null or language_code ~ '^[a-z]{2,3}(?:-[A-Z]{2})?$'),
  source_document_id uuid references public.source_documents(id) on delete set null,
  status text not null default 'candidate' check (status in ('candidate', 'supported', 'disputed', 'rejected')),
  created_at timestamptz not null default now(),
  unique (entity_id, normalized_name, name_type)
);
create index entity_names_entity_id_idx on public.entity_names (entity_id);
create index entity_names_source_document_id_idx on public.entity_names (source_document_id);
create index entity_names_lookup_idx on public.entity_names (normalized_name, status);

create table public.cultivars (
  id uuid primary key references public.entities(id) on delete cascade,
  origin_country_code text check (origin_country_code is null or origin_country_code ~ '^[A-Z]{2}$'),
  year_introduced smallint check (year_introduced is null or year_introduced between 1800 and 2200),
  created_at timestamptz not null default now()
);

create table public.breeders (
  id uuid primary key references public.entities(id) on delete cascade,
  breeder_kind text check (breeder_kind is null or breeder_kind in ('person', 'collective', 'company', 'unknown')),
  country_code text check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  created_at timestamptz not null default now()
);

create table public.cuts (
  id uuid primary key references public.entities(id) on delete cascade,
  cultivar_id uuid references public.cultivars(id) on delete restrict,
  held_by_entity_id uuid references public.entities(id) on delete set null,
  created_at timestamptz not null default now()
);
create index cuts_cultivar_id_idx on public.cuts (cultivar_id);
create index cuts_held_by_entity_id_idx on public.cuts (held_by_entity_id);

create table public.phenotypes (
  id uuid primary key references public.entities(id) on delete cascade,
  cultivar_id uuid references public.cultivars(id) on delete restrict,
  selection_label text,
  created_at timestamptz not null default now()
);
create index phenotypes_cultivar_id_idx on public.phenotypes (cultivar_id);

create table public.traditional_populations (
  id uuid primary key references public.entities(id) on delete cascade,
  region_name text,
  country_code text check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  created_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key references public.entities(id) on delete cascade,
  organization_type text not null check (organization_type in (
    'breeder', 'research', 'government', 'archive', 'community', 'commercial', 'other'
  )),
  website_url text,
  created_at timestamptz not null default now()
);

create table public.claims (
  id uuid primary key default gen_random_uuid(),
  subject_entity_id uuid not null references public.entities(id) on delete restrict,
  predicate text not null check (predicate ~ '^[a-z][a-z0-9_]*$'),
  object_entity_id uuid references public.entities(id) on delete restrict,
  object_text text,
  object_number numeric,
  object_date date,
  object_boolean boolean,
  status text not null default 'candidate' check (status in (
    'candidate', 'supported', 'disputed', 'rejected', 'superseded'
  )),
  confidence numeric(4,3) check (confidence is null or confidence between 0 and 1),
  asserted_by uuid references auth.users(id) on delete set null,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint claims_exactly_one_object check (num_nonnulls(
    object_entity_id, object_text, object_number, object_date, object_boolean
  ) = 1),
  constraint claims_review_consistency check (
    (reviewed_by is null and reviewed_at is null) or
    (reviewed_by is not null and reviewed_at is not null)
  )
);
create index claims_subject_status_idx on public.claims (subject_entity_id, status);
create index claims_object_entity_id_idx on public.claims (object_entity_id);
create index claims_asserted_by_idx on public.claims (asserted_by);
create index claims_reviewed_by_idx on public.claims (reviewed_by);
create index claims_predicate_idx on public.claims (predicate);
create trigger claims_set_updated_at before update on public.claims
for each row execute function app_private.set_updated_at();

create table public.claim_evidence (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references public.claims(id) on delete cascade,
  source_document_id uuid not null references public.source_documents(id) on delete restrict,
  stance text not null check (stance in ('supports', 'contradicts', 'context')),
  excerpt text,
  locator text,
  notes text,
  created_at timestamptz not null default now(),
  unique (claim_id, source_document_id, stance, locator)
);
create index claim_evidence_claim_id_idx on public.claim_evidence (claim_id);
create index claim_evidence_source_document_id_idx on public.claim_evidence (source_document_id);

create table public.lineage_relationships (
  id uuid primary key default gen_random_uuid(),
  child_entity_id uuid not null references public.entities(id) on delete restrict,
  parent_entity_id uuid not null references public.entities(id) on delete restrict,
  parent_role text not null check (parent_role in (
    'mother', 'father', 'seed_parent', 'pollen_parent', 'known_parent', 'unknown'
  )),
  status text not null default 'candidate' check (status in (
    'candidate', 'supported', 'disputed', 'rejected', 'superseded'
  )),
  confidence numeric(4,3) check (confidence is null or confidence between 0 and 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lineage_relationships_not_self check (child_entity_id <> parent_entity_id),
  unique (child_entity_id, parent_entity_id, parent_role, status)
);
create index lineage_relationships_child_idx on public.lineage_relationships (child_entity_id, status);
create index lineage_relationships_parent_idx on public.lineage_relationships (parent_entity_id, status);
create trigger lineage_relationships_set_updated_at before update on public.lineage_relationships
for each row execute function app_private.set_updated_at();

create table public.lineage_evidence (
  id uuid primary key default gen_random_uuid(),
  lineage_relationship_id uuid not null references public.lineage_relationships(id) on delete cascade,
  source_document_id uuid not null references public.source_documents(id) on delete restrict,
  stance text not null check (stance in ('supports', 'contradicts', 'context')),
  excerpt text,
  locator text,
  notes text,
  created_at timestamptz not null default now(),
  unique (lineage_relationship_id, source_document_id, stance, locator)
);
create index lineage_evidence_relationship_id_idx on public.lineage_evidence (lineage_relationship_id);
create index lineage_evidence_source_document_id_idx on public.lineage_evidence (source_document_id);

create table public.hypotheses (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) > 0),
  description text,
  status text not null default 'open' check (status in ('open', 'supported', 'disputed', 'rejected', 'closed')),
  created_by uuid references auth.users(id) on delete set null,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
  ,constraint hypotheses_review_consistency check (
    (reviewed_by is null and reviewed_at is null) or
    (reviewed_by is not null and reviewed_at is not null)
  )
);
create index hypotheses_created_by_idx on public.hypotheses (created_by);
create index hypotheses_reviewed_by_idx on public.hypotheses (reviewed_by);
create index hypotheses_status_idx on public.hypotheses (status);
create trigger hypotheses_set_updated_at before update on public.hypotheses
for each row execute function app_private.set_updated_at();

create table public.hypothesis_claims (
  hypothesis_id uuid not null references public.hypotheses(id) on delete cascade,
  claim_id uuid not null references public.claims(id) on delete cascade,
  role text not null default 'supporting' check (role in ('supporting', 'contradicting', 'context')),
  created_at timestamptz not null default now(),
  primary key (hypothesis_id, claim_id)
);
create index hypothesis_claims_claim_id_idx on public.hypothesis_claims (claim_id);

comment on table public.entities is 'Canonical identity records. Names are labels, not identity keys.';
comment on table public.claims is 'Atomic assertions whose support and contradictions are preserved in claim_evidence.';
comment on table public.lineage_relationships is 'Directed child-to-parent assertions; unknown roles remain explicit and are never inferred.';
