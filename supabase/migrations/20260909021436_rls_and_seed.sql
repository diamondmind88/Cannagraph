-- Slice 1: least-privilege grants, RLS, and conservative source-registry seed data.

revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

grant usage on schema public to anon, authenticated;

grant select on public.entities, public.entity_names, public.cultivars, public.breeders,
  public.cuts, public.phenotypes, public.traditional_populations, public.organizations,
  public.sources, public.source_documents, public.claims, public.claim_evidence,
  public.lineage_relationships, public.lineage_evidence, public.hypotheses,
  public.hypothesis_claims, public.organization_entity_links, public.activity_events
to anon, authenticated;

grant select on public.organization_members, public.verification_requests,
  public.verification_evidence, public.verification_events, public.community_submissions,
  public.submission_entity_links, public.submission_evidence
to authenticated;

grant insert (requested_by, entity_id, organization_id, request_type, statement)
  on public.verification_requests to authenticated;
grant insert (verification_request_id, source_document_id, submitted_by, storage_path, statement)
  on public.verification_evidence to authenticated;
grant insert (submitted_by, title, description, submission_type, status, visibility, submitted_at)
  on public.community_submissions to authenticated;
grant update (title, description, submission_type, status, visibility, submitted_at)
  on public.community_submissions to authenticated;
grant insert, delete on public.submission_entity_links to authenticated;
grant insert, update, delete on public.submission_evidence to authenticated;

alter table public.entities enable row level security;
alter table public.entity_names enable row level security;
alter table public.cultivars enable row level security;
alter table public.breeders enable row level security;
alter table public.cuts enable row level security;
alter table public.phenotypes enable row level security;
alter table public.traditional_populations enable row level security;
alter table public.organizations enable row level security;
alter table public.sources enable row level security;
alter table public.source_documents enable row level security;
alter table public.claims enable row level security;
alter table public.claim_evidence enable row level security;
alter table public.lineage_relationships enable row level security;
alter table public.lineage_evidence enable row level security;
alter table public.hypotheses enable row level security;
alter table public.hypothesis_claims enable row level security;
alter table public.identity_candidates enable row level security;
alter table public.entity_merges enable row level security;
alter table public.source_registry enable row level security;
alter table public.discovery_queue enable row level security;
alter table public.research_jobs enable row level security;
alter table public.research_events enable row level security;
alter table public.organization_members enable row level security;
alter table public.organization_entity_links enable row level security;
alter table public.verification_requests enable row level security;
alter table public.verification_evidence enable row level security;
alter table public.verification_events enable row level security;
alter table public.discovery_candidates enable row level security;
alter table public.community_submissions enable row level security;
alter table public.submission_entity_links enable row level security;
alter table public.submission_evidence enable row level security;
alter table public.activity_events enable row level security;

create policy entities_public_read on public.entities for select to anon, authenticated
using (status = 'published');

create policy entity_names_public_read on public.entity_names for select to anon, authenticated
using (
  status = 'supported' and exists (
    select 1 from public.entities e where e.id = entity_names.entity_id and e.status = 'published'
  )
);

create policy cultivars_public_read on public.cultivars for select to anon, authenticated
using (exists (select 1 from public.entities e where e.id = cultivars.id and e.status = 'published'));
create policy breeders_public_read on public.breeders for select to anon, authenticated
using (exists (select 1 from public.entities e where e.id = breeders.id and e.status = 'published'));
create policy cuts_public_read on public.cuts for select to anon, authenticated
using (exists (select 1 from public.entities e where e.id = cuts.id and e.status = 'published'));
create policy phenotypes_public_read on public.phenotypes for select to anon, authenticated
using (exists (select 1 from public.entities e where e.id = phenotypes.id and e.status = 'published'));
create policy traditional_populations_public_read on public.traditional_populations for select to anon, authenticated
using (exists (select 1 from public.entities e where e.id = traditional_populations.id and e.status = 'published'));
create policy organizations_public_read on public.organizations for select to anon, authenticated
using (exists (select 1 from public.entities e where e.id = organizations.id and e.status = 'published'));

create policy claims_public_read on public.claims for select to anon, authenticated
using (
  status in ('supported', 'disputed') and exists (
    select 1 from public.entities e where e.id = claims.subject_entity_id and e.status = 'published'
  )
);
create policy claim_evidence_public_read on public.claim_evidence for select to anon, authenticated
using (
  exists (
    select 1 from public.claims c
    join public.entities e on e.id = c.subject_entity_id
    where c.id = claim_evidence.claim_id
      and c.status in ('supported', 'disputed') and e.status = 'published'
  )
);

create policy lineage_relationships_public_read on public.lineage_relationships for select to anon, authenticated
using (
  status in ('supported', 'disputed') and exists (
    select 1 from public.entities e where e.id = lineage_relationships.child_entity_id and e.status = 'published'
  )
);
create policy lineage_evidence_public_read on public.lineage_evidence for select to anon, authenticated
using (
  exists (
    select 1 from public.lineage_relationships lr
    join public.entities e on e.id = lr.child_entity_id
    where lr.id = lineage_evidence.lineage_relationship_id
      and lr.status in ('supported', 'disputed') and e.status = 'published'
  )
);

create policy source_documents_public_read on public.source_documents for select to anon, authenticated
using (
  exists (select 1 from public.claim_evidence ce where ce.source_document_id = source_documents.id)
  or exists (select 1 from public.lineage_evidence le where le.source_document_id = source_documents.id)
  or exists (
    select 1 from public.entity_names en
    join public.entities e on e.id = en.entity_id
    where en.source_document_id = source_documents.id
      and en.status = 'supported' and e.status = 'published'
  )
);
create policy sources_public_read on public.sources for select to anon, authenticated
using (exists (select 1 from public.source_documents sd where sd.source_id = sources.id));

create policy hypotheses_public_read on public.hypotheses for select to anon, authenticated
using (status in ('supported', 'disputed', 'closed'));
create policy hypothesis_claims_public_read on public.hypothesis_claims for select to anon, authenticated
using (exists (
  select 1 from public.hypotheses h
  where h.id = hypothesis_claims.hypothesis_id and h.status in ('supported', 'disputed', 'closed')
));

create policy organization_entity_links_public_read on public.organization_entity_links
for select to anon, authenticated
using (
  status in ('verified', 'disputed') and
  exists (select 1 from public.entities e where e.id = organization_entity_links.entity_id and e.status = 'published') and
  exists (select 1 from public.entities e where e.id = organization_entity_links.organization_id and e.status = 'published')
);

create policy organization_members_own_read on public.organization_members
for select to authenticated
using ((select auth.uid()) = user_id);

create policy verification_requests_own_read on public.verification_requests
for select to authenticated
using ((select auth.uid()) = requested_by);
create policy verification_requests_own_insert on public.verification_requests
for insert to authenticated
with check ((select auth.uid()) = requested_by and status = 'submitted');

create policy verification_evidence_own_request_read on public.verification_evidence
for select to authenticated
using (exists (
  select 1 from public.verification_requests vr
  where vr.id = verification_evidence.verification_request_id
    and vr.requested_by = (select auth.uid())
));
create policy verification_evidence_own_request_insert on public.verification_evidence
for insert to authenticated
with check (
  submitted_by = (select auth.uid()) and exists (
    select 1 from public.verification_requests vr
    where vr.id = verification_evidence.verification_request_id
      and vr.requested_by = (select auth.uid()) and vr.status = 'submitted'
  )
);
create policy verification_events_own_request_read on public.verification_events
for select to authenticated
using (exists (
  select 1 from public.verification_requests vr
  where vr.id = verification_events.verification_request_id
    and vr.requested_by = (select auth.uid())
));

create policy community_submissions_public_read on public.community_submissions
for select to anon, authenticated
using (visibility = 'public' and status = 'accepted');
create policy community_submissions_own_read on public.community_submissions
for select to authenticated
using ((select auth.uid()) = submitted_by);
create policy community_submissions_own_insert on public.community_submissions
for insert to authenticated
with check (
  (select auth.uid()) = submitted_by and status in ('draft', 'submitted') and
  ((status = 'draft' and submitted_at is null) or (status = 'submitted' and submitted_at is not null))
);
create policy community_submissions_own_update on public.community_submissions
for update to authenticated
using ((select auth.uid()) = submitted_by and status in ('draft', 'submitted'))
with check (
  (select auth.uid()) = submitted_by and status in ('draft', 'submitted', 'withdrawn') and
  ((status = 'draft' and submitted_at is null) or status <> 'draft')
);

create policy submission_entity_links_public_read on public.submission_entity_links
for select to authenticated
using (exists (
  select 1 from public.community_submissions cs
  where cs.id = submission_entity_links.submission_id
    and ((cs.visibility = 'public' and cs.status = 'accepted') or cs.submitted_by = (select auth.uid()))
));
create policy submission_entity_links_own_insert on public.submission_entity_links
for insert to authenticated
with check (exists (
  select 1 from public.community_submissions cs
  where cs.id = submission_entity_links.submission_id
    and cs.submitted_by = (select auth.uid()) and cs.status = 'draft'
));
create policy submission_entity_links_own_delete on public.submission_entity_links
for delete to authenticated
using (exists (
  select 1 from public.community_submissions cs
  where cs.id = submission_entity_links.submission_id
    and cs.submitted_by = (select auth.uid()) and cs.status = 'draft'
));

create policy submission_evidence_public_read on public.submission_evidence
for select to authenticated
using (exists (
  select 1 from public.community_submissions cs
  where cs.id = submission_evidence.submission_id
    and ((cs.visibility = 'public' and cs.status = 'accepted') or cs.submitted_by = (select auth.uid()))
));
create policy submission_evidence_own_insert on public.submission_evidence
for insert to authenticated
with check (exists (
  select 1 from public.community_submissions cs
  where cs.id = submission_evidence.submission_id
    and cs.submitted_by = (select auth.uid()) and cs.status = 'draft'
));
create policy submission_evidence_own_update on public.submission_evidence
for update to authenticated
using (exists (
  select 1 from public.community_submissions cs
  where cs.id = submission_evidence.submission_id
    and cs.submitted_by = (select auth.uid()) and cs.status = 'draft'
))
with check (exists (
  select 1 from public.community_submissions cs
  where cs.id = submission_evidence.submission_id
    and cs.submitted_by = (select auth.uid()) and cs.status = 'draft'
));
create policy submission_evidence_own_delete on public.submission_evidence
for delete to authenticated
using (exists (
  select 1 from public.community_submissions cs
  where cs.id = submission_evidence.submission_id
    and cs.submitted_by = (select auth.uid()) and cs.status = 'draft'
));

create policy activity_events_public_read on public.activity_events for select to anon, authenticated
using (visibility = 'public');

insert into public.source_registry (
  domain, display_name, source_type, access_mode, policy_status, base_url,
  terms_url, robots_url, citation_required, rate_limit_notes, policy_checked_at
) values (
  'pubmed.ncbi.nlm.nih.gov',
  'PubMed',
  'scientific_database',
  'api',
  'review_required',
  'https://pubmed.ncbi.nlm.nih.gov',
  'https://www.ncbi.nlm.nih.gov/home/about/policies/',
  'https://pubmed.ncbi.nlm.nih.gov/robots.txt',
  true,
  'Use NCBI E-utilities and re-check current NCBI usage policies before collection.',
  now()
);

comment on schema app_private is 'Non-API helper functions. No client role has schema access.';
comment on table public.source_registry is 'Operational allowlist; review_required blocks collection until a human confirms current terms.';
