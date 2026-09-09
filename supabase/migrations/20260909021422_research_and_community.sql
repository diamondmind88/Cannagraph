-- Slice 1: identity resolution, research operations, organizations, verification, and community intake.

create table public.identity_candidates (
  id uuid primary key default gen_random_uuid(),
  left_entity_id uuid not null references public.entities(id) on delete cascade,
  right_entity_id uuid not null references public.entities(id) on delete cascade,
  score numeric(4,3) check (score is null or score between 0 and 1),
  reasons jsonb not null default '[]'::jsonb check (jsonb_typeof(reasons) = 'array'),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'expired')),
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint identity_candidates_ordered_pair check (left_entity_id::text < right_entity_id::text),
  constraint identity_candidates_review_consistency check (
    (reviewed_by is null and reviewed_at is null) or
    (reviewed_by is not null and reviewed_at is not null)
  ),
  unique (left_entity_id, right_entity_id)
);
create index identity_candidates_left_entity_id_idx on public.identity_candidates (left_entity_id);
create index identity_candidates_right_entity_id_idx on public.identity_candidates (right_entity_id);
create index identity_candidates_reviewed_by_idx on public.identity_candidates (reviewed_by);
create index identity_candidates_status_score_idx on public.identity_candidates (status, score desc);

create table public.entity_merges (
  id uuid primary key default gen_random_uuid(),
  source_entity_id uuid not null references public.entities(id) on delete restrict,
  target_entity_id uuid not null references public.entities(id) on delete restrict,
  identity_candidate_id uuid references public.identity_candidates(id) on delete set null,
  approved_by uuid not null references auth.users(id) on delete restrict,
  rationale text not null check (length(trim(rationale)) > 0),
  merged_at timestamptz not null default now(),
  reversed_at timestamptz,
  reversed_by uuid references auth.users(id) on delete restrict,
  reversal_reason text,
  constraint entity_merges_not_self check (source_entity_id <> target_entity_id),
  constraint entity_merges_reversal_consistency check (
    (reversed_at is null and reversed_by is null and reversal_reason is null) or
    (reversed_at is not null and reversed_by is not null and reversal_reason is not null
      and length(trim(reversal_reason)) > 0)
  )
);
create unique index entity_merges_active_source_unique on public.entity_merges (source_entity_id)
  where reversed_at is null;
create index entity_merges_target_entity_id_idx on public.entity_merges (target_entity_id);
create index entity_merges_identity_candidate_id_idx on public.entity_merges (identity_candidate_id);
create index entity_merges_approved_by_idx on public.entity_merges (approved_by);
create index entity_merges_reversed_by_idx on public.entity_merges (reversed_by);

create table public.source_registry (
  id uuid primary key default gen_random_uuid(),
  domain text not null unique check (domain = lower(domain) and domain !~ '[/[:space:]]'),
  display_name text not null check (length(trim(display_name)) > 0),
  source_type text not null check (source_type in (
    'scientific_database', 'journal', 'book', 'registry', 'breeder', 'archive',
    'government', 'website', 'community', 'interview', 'other'
  )),
  access_mode text not null check (access_mode in ('api', 'crawl', 'manual', 'prohibited')),
  policy_status text not null default 'review_required' check (policy_status in (
    'allowed', 'review_required', 'prohibited'
  )),
  base_url text,
  terms_url text,
  robots_url text,
  citation_required boolean not null default true,
  rate_limit_notes text,
  policy_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index source_registry_policy_idx on public.source_registry (policy_status, access_mode);
create trigger source_registry_set_updated_at before update on public.source_registry
for each row execute function app_private.set_updated_at();

create table public.discovery_queue (
  id uuid primary key default gen_random_uuid(),
  requested_by uuid references auth.users(id) on delete set null,
  query text not null check (length(trim(query)) > 0),
  entity_id uuid references public.entities(id) on delete set null,
  source_registry_id uuid references public.source_registry(id) on delete restrict,
  priority smallint not null default 50 check (priority between 0 and 100),
  status text not null default 'queued' check (status in ('queued', 'running', 'completed', 'failed', 'cancelled')),
  idempotency_key text unique,
  available_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index discovery_queue_requested_by_idx on public.discovery_queue (requested_by);
create index discovery_queue_entity_id_idx on public.discovery_queue (entity_id);
create index discovery_queue_source_registry_id_idx on public.discovery_queue (source_registry_id);
create index discovery_queue_claim_idx on public.discovery_queue (status, priority desc, available_at);
create trigger discovery_queue_set_updated_at before update on public.discovery_queue
for each row execute function app_private.set_updated_at();

create table public.research_jobs (
  id uuid primary key default gen_random_uuid(),
  discovery_queue_id uuid references public.discovery_queue(id) on delete set null,
  job_type text not null check (job_type ~ '^[a-z][a-z0-9_]*$'),
  status text not null default 'queued' check (status in ('queued', 'running', 'completed', 'failed', 'cancelled')),
  attempts smallint not null default 0 check (attempts >= 0),
  max_attempts smallint not null default 3 check (max_attempts between 1 and 20),
  idempotency_key text not null unique,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),
  result_summary jsonb check (result_summary is null or jsonb_typeof(result_summary) = 'object'),
  error_message text,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint research_jobs_time_order check (finished_at is null or started_at is null or finished_at >= started_at)
);
create index research_jobs_discovery_queue_id_idx on public.research_jobs (discovery_queue_id);
create index research_jobs_status_idx on public.research_jobs (status, created_at);
create trigger research_jobs_set_updated_at before update on public.research_jobs
for each row execute function app_private.set_updated_at();

create table public.research_events (
  id bigint generated always as identity primary key,
  research_job_id uuid not null references public.research_jobs(id) on delete cascade,
  event_type text not null check (event_type ~ '^[a-z][a-z0-9_]*$'),
  event_data jsonb not null default '{}'::jsonb check (jsonb_typeof(event_data) = 'object'),
  created_at timestamptz not null default now()
);
create index research_events_job_created_idx on public.research_events (research_job_id, created_at);

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('viewer', 'contributor', 'researcher', 'admin')),
  status text not null default 'active' check (status in ('invited', 'active', 'suspended', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);
create index organization_members_organization_id_idx on public.organization_members (organization_id);
create index organization_members_user_id_idx on public.organization_members (user_id);
create trigger organization_members_set_updated_at before update on public.organization_members
for each row execute function app_private.set_updated_at();

create table public.organization_entity_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_id uuid not null references public.entities(id) on delete cascade,
  relationship_type text not null check (relationship_type in (
    'breeder', 'originator', 'maintainer', 'custodian', 'researcher', 'other'
  )),
  status text not null default 'candidate' check (status in ('candidate', 'verified', 'disputed', 'rejected')),
  created_at timestamptz not null default now(),
  unique (organization_id, entity_id, relationship_type)
);
create index organization_entity_links_organization_id_idx on public.organization_entity_links (organization_id);
create index organization_entity_links_entity_id_idx on public.organization_entity_links (entity_id);

create table public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities(id) on delete restrict,
  organization_id uuid references public.organizations(id) on delete set null,
  requested_by uuid not null references auth.users(id) on delete restrict,
  request_type text not null check (request_type in ('identity', 'lineage', 'name', 'organization_link', 'other')),
  statement text not null check (length(trim(statement)) > 0),
  status text not null default 'submitted' check (status in ('submitted', 'in_review', 'approved', 'rejected', 'withdrawn')),
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index verification_requests_entity_id_idx on public.verification_requests (entity_id);
create index verification_requests_organization_id_idx on public.verification_requests (organization_id);
create index verification_requests_requested_by_idx on public.verification_requests (requested_by);
create index verification_requests_assigned_to_idx on public.verification_requests (assigned_to);
create index verification_requests_status_idx on public.verification_requests (status, created_at);
create trigger verification_requests_set_updated_at before update on public.verification_requests
for each row execute function app_private.set_updated_at();

create table public.verification_evidence (
  id uuid primary key default gen_random_uuid(),
  verification_request_id uuid not null references public.verification_requests(id) on delete cascade,
  source_document_id uuid references public.source_documents(id) on delete restrict,
  submitted_by uuid not null references auth.users(id) on delete restrict,
  storage_path text,
  statement text,
  created_at timestamptz not null default now(),
  constraint verification_evidence_has_content check (
    source_document_id is not null or storage_path is not null or
    (statement is not null and length(trim(statement)) > 0)
  )
);
create index verification_evidence_request_id_idx on public.verification_evidence (verification_request_id);
create index verification_evidence_source_document_id_idx on public.verification_evidence (source_document_id);
create index verification_evidence_submitted_by_idx on public.verification_evidence (submitted_by);

create table public.verification_events (
  id bigint generated always as identity primary key,
  verification_request_id uuid not null references public.verification_requests(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  from_status text,
  to_status text not null check (to_status in ('submitted', 'in_review', 'approved', 'rejected', 'withdrawn')),
  note text,
  created_at timestamptz not null default now()
);
create index verification_events_request_created_idx on public.verification_events (verification_request_id, created_at);
create index verification_events_actor_id_idx on public.verification_events (actor_id);

create table public.discovery_candidates (
  id uuid primary key default gen_random_uuid(),
  research_job_id uuid not null references public.research_jobs(id) on delete cascade,
  candidate_type text not null check (candidate_type in ('entity', 'name', 'claim', 'lineage', 'source')),
  candidate_data jsonb not null check (jsonb_typeof(candidate_data) = 'object'),
  deduplication_key text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'duplicate')),
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create index discovery_candidates_research_job_id_idx on public.discovery_candidates (research_job_id);
create index discovery_candidates_reviewed_by_idx on public.discovery_candidates (reviewed_by);
create index discovery_candidates_status_idx on public.discovery_candidates (status, created_at);
create unique index discovery_candidates_dedup_unique on public.discovery_candidates (deduplication_key)
  where deduplication_key is not null;

create table public.community_submissions (
  id uuid primary key default gen_random_uuid(),
  submitted_by uuid not null references auth.users(id) on delete restrict,
  title text not null check (length(trim(title)) > 0),
  description text not null check (length(trim(description)) > 0),
  submission_type text not null check (submission_type in ('new_entity', 'correction', 'lineage', 'source', 'other')),
  status text not null default 'draft' check (status in ('draft', 'submitted', 'in_review', 'accepted', 'rejected', 'withdrawn')),
  visibility text not null default 'private' check (visibility in ('private', 'public')),
  submitted_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint community_submissions_submit_time check (
    (status = 'draft' and submitted_at is null) or status <> 'draft'
  )
);
create index community_submissions_submitted_by_idx on public.community_submissions (submitted_by);
create index community_submissions_reviewed_by_idx on public.community_submissions (reviewed_by);
create index community_submissions_status_idx on public.community_submissions (status, created_at);
create trigger community_submissions_set_updated_at before update on public.community_submissions
for each row execute function app_private.set_updated_at();

create table public.submission_entity_links (
  submission_id uuid not null references public.community_submissions(id) on delete cascade,
  entity_id uuid not null references public.entities(id) on delete restrict,
  relationship_type text not null check (relationship_type in ('subject', 'possible_duplicate', 'parent', 'related')),
  created_at timestamptz not null default now(),
  primary key (submission_id, entity_id, relationship_type)
);
create index submission_entity_links_entity_id_idx on public.submission_entity_links (entity_id);

create table public.submission_evidence (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.community_submissions(id) on delete cascade,
  source_document_id uuid references public.source_documents(id) on delete restrict,
  storage_path text,
  statement text,
  created_at timestamptz not null default now(),
  constraint submission_evidence_has_content check (
    source_document_id is not null or storage_path is not null or
    (statement is not null and length(trim(statement)) > 0)
  )
);
create index submission_evidence_submission_id_idx on public.submission_evidence (submission_id);
create index submission_evidence_source_document_id_idx on public.submission_evidence (source_document_id);

create table public.activity_events (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  event_type text not null check (event_type ~ '^[a-z][a-z0-9_]*$'),
  entity_id uuid references public.entities(id) on delete set null,
  submission_id uuid references public.community_submissions(id) on delete set null,
  verification_request_id uuid references public.verification_requests(id) on delete set null,
  event_data jsonb not null default '{}'::jsonb check (jsonb_typeof(event_data) = 'object'),
  visibility text not null default 'private' check (visibility in ('private', 'public')),
  created_at timestamptz not null default now()
);
create index activity_events_actor_id_idx on public.activity_events (actor_id);
create index activity_events_entity_id_idx on public.activity_events (entity_id);
create index activity_events_submission_id_idx on public.activity_events (submission_id);
create index activity_events_verification_request_id_idx on public.activity_events (verification_request_id);
create index activity_events_public_feed_idx on public.activity_events (created_at desc) where visibility = 'public';

comment on table public.identity_candidates is 'Human-review queue only; similarity scores never merge entities automatically.';
comment on table public.entity_merges is 'Append-only merge decisions with explicit approval and reversible audit fields.';
comment on table public.community_submissions is 'Community intake boundary; accepted submissions still require a separate canonical write workflow.';
comment on table public.research_events is 'Append-only operational event log for idempotent research jobs.';
