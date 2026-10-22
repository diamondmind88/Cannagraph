-- Reversible integration gate. Fixture rows never commit; explicit public IDs
-- prevent test execution from advancing the canonical public-ID sequence.
begin;
create temporary table lineage_gate_ids (
  name text primary key, entity_id uuid, relationship_id uuid, source_id uuid, document_id uuid
) on commit drop;
insert into lineage_gate_ids(name,entity_id,relationship_id,source_id,document_id)
select name,gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid()
from unnest(array['focus','parent','draft','supported','disputed','candidate','rejected','hidden_child','unlinked']) as name;
insert into public.entities(id,public_id,entity_type,canonical_name,status,published_at)
select entity_id,'CNG-CUL-'||(90000000 + row_number() over(order by name))::text,'cultivar','Transaction-only lineage check',case when name='draft' then 'draft' else 'published' end,case when name='draft' then null else now() end
from lineage_gate_ids where name in ('focus','parent','draft');
insert into public.lineage_relationships(id,child_entity_id,parent_entity_id,parent_role,status)
select relationship_id,
  (select entity_id from lineage_gate_ids where name=case when g.name='hidden_child' then 'draft' else 'focus' end),
  (select entity_id from lineage_gate_ids where name='parent'),'unknown',
  case when name='hidden_child' then 'supported' else name end
from lineage_gate_ids g where name in ('supported','disputed','candidate','rejected','hidden_child');
insert into public.sources(id,title,source_type)
select source_id,'Transaction-only evidence check','other' from lineage_gate_ids
where name in ('supported','disputed','candidate','rejected','hidden_child','unlinked');
insert into public.source_documents(id,source_id,title,document_url)
select document_id,source_id,'Transaction-only document','https://example.com/lineage-check/'||document_id::text
from lineage_gate_ids where name in ('supported','disputed','candidate','rejected','hidden_child','unlinked');
insert into public.lineage_evidence(lineage_relationship_id,source_document_id,stance,locator)
select relationship_id,document_id,case when name='disputed' then 'contradicts' else 'supports' end,'transaction fixture'
from lineage_gate_ids where name in ('supported','disputed','candidate','rejected','hidden_child');
grant select on lineage_gate_ids to anon, authenticated;
set local role anon;
do $$
begin
  if (select count(*) from public.entities where id in (select entity_id from lineage_gate_ids))<>2 then raise exception 'Public entity visibility failed'; end if;
  if (select count(*) from public.lineage_relationships where id in (select relationship_id from lineage_gate_ids))<>2 then raise exception 'Lineage status/draft visibility failed'; end if;
  if (select count(*) from public.lineage_evidence where lineage_relationship_id in (select relationship_id from lineage_gate_ids))<>2 then raise exception 'Evidence visibility failed'; end if;
  if (select count(*) from public.source_documents where id in (select document_id from lineage_gate_ids))<>2 then raise exception 'Document visibility failed'; end if;
  if (select count(*) from public.sources where id in (select source_id from lineage_gate_ids))<>2 then raise exception 'Source visibility failed'; end if;
  if has_table_privilege(current_user,'public.lineage_relationships','INSERT') then raise exception 'Client canonical write boundary failed'; end if;
end;
$$;
reset role;
set local role authenticated;
do $$
begin
  if (select count(*) from public.entities where id in (select entity_id from lineage_gate_ids))<>2 then raise exception 'Public entity visibility failed'; end if;
  if (select count(*) from public.lineage_relationships where id in (select relationship_id from lineage_gate_ids))<>2 then raise exception 'Lineage status/draft visibility failed'; end if;
  if (select count(*) from public.lineage_evidence where lineage_relationship_id in (select relationship_id from lineage_gate_ids))<>2 then raise exception 'Evidence visibility failed'; end if;
  if (select count(*) from public.source_documents where id in (select document_id from lineage_gate_ids))<>2 then raise exception 'Document visibility failed'; end if;
  if (select count(*) from public.sources where id in (select source_id from lineage_gate_ids))<>2 then raise exception 'Source visibility failed'; end if;
  if has_table_privilege(current_user,'public.lineage_relationships','INSERT') then raise exception 'Client canonical write boundary failed'; end if;
end;
$$;
reset role;
rollback;
select 'PASS: public lineage RLS, evidence/document/source visibility, anon/authenticated write boundary; fixture transaction rolled back' as result;
