-- Tacoma Nights episode studio: align production tasks with the episode plan
-- table used by control-room.html and add missing editor fields.

alter table public.tacoma_nights_episode_plans
  add column if not exists research_notes text,
  add column if not exists rundown_text text,
  add column if not exists talking_points_text text;

alter table public.tacoma_nights_production_tasks
  drop constraint if exists tacoma_nights_production_tasks_episode_id_fkey;

alter table public.tacoma_nights_production_tasks
  add constraint tacoma_nights_production_tasks_episode_id_fkey
  foreign key (episode_id)
  references public.tacoma_nights_episode_plans(id)
  on delete cascade;

create index if not exists tacoma_nights_production_tasks_episode_sort_idx
  on public.tacoma_nights_production_tasks (episode_id, sort_order, created_at);

create index if not exists tacoma_nights_episode_plans_date_idx
  on public.tacoma_nights_episode_plans (episode_date desc, created_at desc);

grant select, insert, update, delete
  on public.tacoma_nights_episode_plans, public.tacoma_nights_production_tasks
  to authenticated;

comment on column public.tacoma_nights_episode_plans.research_notes is
  'Private episode research and fact-check notes for the Tacoma Nights production team.';
comment on column public.tacoma_nights_episode_plans.rundown_text is
  'Private, editable plain-text episode rundown; one segment per line.';
comment on column public.tacoma_nights_episode_plans.talking_points_text is
  'Private host talking points and segment beats for the episode.';
