create extension if not exists "uuid-ossp";

create table if not exists households (
  id uuid primary key default uuid_generate_v4(),
  name text not null default 'DietApp Casa',
  owner_user_id uuid not null,
  created_at timestamptz not null default now()
);

create table if not exists household_members (
  household_id uuid references households(id) on delete cascade,
  user_id uuid not null,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

create table if not exists household_invites (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade not null,
  email text not null,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  unique(household_id, email)
);

create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade not null,
  name text not null,
  sex text,
  age int,
  height_cm numeric,
  current_weight_kg numeric,
  goal_weight_kg numeric,
  pace_lb_per_week numeric default 1,
  diet_type text default 'carnivore_flexible',
  diet_options jsonb default '{}'::jsonb,
  routine jsonb default '{}'::jsonb,
  unit_prefs jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists weekly_plans (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade not null,
  profile_id uuid references profiles(id) on delete cascade not null,
  week_start date not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(profile_id, week_start)
);

create table if not exists exceptions (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade not null,
  profile_id uuid references profiles(id) on delete cascade not null,
  eaten_at timestamptz not null default now(),
  item text not null,
  note text,
  estimated_calories numeric,
  created_at timestamptz not null default now()
);

create table if not exists weight_logs (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade not null,
  profile_id uuid references profiles(id) on delete cascade not null,
  logged_at date not null default current_date,
  weight_kg numeric not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists reminders (
  id uuid primary key default uuid_generate_v4(),
  household_id uuid references households(id) on delete cascade not null,
  profile_id uuid references profiles(id) on delete cascade,
  title text not null,
  remind_at timestamptz not null,
  repeat_rule text,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function ensure_household()
returns trigger
language plpgsql
security definer
as $$
declare
  hid uuid;
  invited_role text;
begin
  select household_id, role into hid, invited_role from household_invites where lower(email) = lower(new.email) limit 1;
  if hid is not null then
    insert into household_members(household_id, user_id, role) values (hid, new.id, coalesce(invited_role,'member')) on conflict do nothing;
  else
    insert into households(name, owner_user_id) values ('DietApp Casa', new.id) returning id into hid;
    insert into household_members(household_id, user_id, role) values (hid, new.id, 'owner') on conflict do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_dietapp on auth.users;
create trigger on_auth_user_created_dietapp
after insert on auth.users
for each row execute procedure ensure_household();

alter table households enable row level security;
alter table household_members enable row level security;
alter table household_invites enable row level security;
alter table profiles enable row level security;
alter table weekly_plans enable row level security;
alter table exceptions enable row level security;
alter table weight_logs enable row level security;
alter table reminders enable row level security;

create policy "members view households" on households for select using (id in (select household_id from household_members where user_id = auth.uid()));
create policy "owners update households" on households for update using (owner_user_id = auth.uid());

create policy "members view members" on household_members for select using (household_id in (select household_id from household_members where user_id = auth.uid()));
create policy "owners add members" on household_members for insert with check (household_id in (select household_id from household_members where user_id = auth.uid() and role='owner'));

create policy "members invites all" on household_invites for all using (household_id in (select household_id from household_members where user_id = auth.uid())) with check (household_id in (select household_id from household_members where user_id = auth.uid()));

create policy "members profiles all" on profiles for all using (household_id in (select household_id from household_members where user_id = auth.uid())) with check (household_id in (select household_id from household_members where user_id = auth.uid()));
create policy "members plans all" on weekly_plans for all using (household_id in (select household_id from household_members where user_id = auth.uid())) with check (household_id in (select household_id from household_members where user_id = auth.uid()));
create policy "members exceptions all" on exceptions for all using (household_id in (select household_id from household_members where user_id = auth.uid())) with check (household_id in (select household_id from household_members where user_id = auth.uid()));
create policy "members weights all" on weight_logs for all using (household_id in (select household_id from household_members where user_id = auth.uid())) with check (household_id in (select household_id from household_members where user_id = auth.uid()));
create policy "members reminders all" on reminders for all using (household_id in (select household_id from household_members where user_id = auth.uid())) with check (household_id in (select household_id from household_members where user_id = auth.uid()));
