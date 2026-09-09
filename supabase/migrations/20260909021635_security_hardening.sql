-- Slice 1: make intentional client-deny boundaries explicit and close an exposed helper RPC.

revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

create policy discovery_candidates_client_deny on public.discovery_candidates
for all to anon, authenticated using (false) with check (false);
create policy discovery_queue_client_deny on public.discovery_queue
for all to anon, authenticated using (false) with check (false);
create policy entity_merges_client_deny on public.entity_merges
for all to anon, authenticated using (false) with check (false);
create policy identity_candidates_client_deny on public.identity_candidates
for all to anon, authenticated using (false) with check (false);
create policy research_events_client_deny on public.research_events
for all to anon, authenticated using (false) with check (false);
create policy research_jobs_client_deny on public.research_jobs
for all to anon, authenticated using (false) with check (false);
create policy source_registry_client_deny on public.source_registry
for all to anon, authenticated using (false) with check (false);

drop policy community_submissions_public_read on public.community_submissions;
drop policy community_submissions_own_read on public.community_submissions;

create policy community_submissions_public_read on public.community_submissions
for select to anon
using (visibility = 'public' and status = 'accepted');

create policy community_submissions_authenticated_read on public.community_submissions
for select to authenticated
using (
  (visibility = 'public' and status = 'accepted') or
  submitted_by = (select auth.uid())
);
