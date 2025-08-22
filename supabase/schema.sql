-- Enable extensions
create extension if not exists "pgcrypto";

-- ========= Enums =========
create type public.user_role as enum ('empreendedor', 'cooperativa', 'consumidor');
create type public.credit_status as enum ('draft','submitted','under_review','approved','rejected','disbursed','settled');
create type public.task_status as enum ('todo','in_progress','done');
create type public.order_status as enum ('cart','placed','paid','fulfilled','cancelled');

-- ========= Core tables =========
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'consumidor',
  full_name text not null,
  cpf_cnpj text unique,
  bairro text,
  category text,
  doc_url text,
  is_staff boolean not null default false,
  geo jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.cooperatives (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  cnpj text unique,
  bairro text,
  admin_user_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.cooperative_members (
  cooperative_id uuid not null references public.cooperatives(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (cooperative_id, user_id)
);

create table if not exists public.credit_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_user_id uuid not null references public.profiles(id) on delete cascade,
  cooperative_id uuid references public.cooperatives(id) on delete set null,
  amount_mbc numeric(12,2) not null check (amount_mbc > 0),
  purpose text,
  ai_plan jsonb,
  status public.credit_status not null default 'draft',
  schedule jsonb,
  approved_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.credit_payments (
  id uuid primary key default gen_random_uuid(),
  credit_id uuid not null references public.credit_applications(id) on delete cascade,
  amount_mbc numeric(12,2) not null check (amount_mbc > 0),
  paid_at timestamptz not null default now(),
  metadata jsonb
);

create table if not exists public.production_tasks (
  id uuid primary key default gen_random_uuid(),
  cooperative_id uuid not null references public.cooperatives(id) on delete cascade,
  title text not null,
  description text,
  status public.task_status not null default 'todo',
  due_date date,
  assignee_user_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.shared_resources (
  id uuid primary key default gen_random_uuid(),
  cooperative_id uuid not null references public.cooperatives(id) on delete cascade,
  name text not null,
  kind text,
  quantity numeric,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references public.profiles(id) on delete set null,
  cooperative_id uuid references public.cooperatives(id) on delete set null,
  name text not null,
  description text,
  price_mbc numeric(12,2) not null check (price_mbc >= 0),
  stock integer not null default 0,
  image_url text,
  category text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_user_id uuid not null references public.profiles(id) on delete cascade,
  seller_user_id uuid references public.profiles(id) on delete set null,
  total_mbc numeric(12,2) not null check (total_mbc >= 0),
  status public.order_status not null default 'placed',
  bairro text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price_mbc numeric(12,2) not null check (unit_price_mbc >= 0)
);

create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references public.profiles(id) on delete set null,
  cooperative_id uuid references public.cooperatives(id) on delete set null,
  url text not null,
  kind text,
  created_at timestamptz not null default now()
);

create table if not exists public.external_payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  provider text not null,
  external_id text,
  payload jsonb,
  status text,
  created_at timestamptz not null default now()
);

create table if not exists public.activity_events (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete set null,
  cooperative_id uuid references public.cooperatives(id) on delete set null,
  kind text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

-- ========= Trigger to create profile on new user =========
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Usuário'), 'consumidor')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ========= Row Level Security =========

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.cooperatives enable row level security;
alter table public.cooperative_members enable row level security;
alter table public.credit_applications enable row level security;
alter table public.credit_payments enable row level security;
alter table public.production_tasks enable row level security;
alter table public.shared_resources enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.attachments enable row level security;
alter table public.external_payments enable row level security;
alter table public.activity_events enable row level security;

-- Helper: staff check
create or replace function public.is_staff(uid uuid)
returns boolean language sql stable as $$
  select exists(
    select 1 from public.profiles p where p.id = uid and p.is_staff = true
  );
$$;

-- profiles policies
create policy "Read own profile or staff" on public.profiles
  for select
  using (auth.uid() = id or public.is_staff(auth.uid()));

create policy "Update own profile or staff" on public.profiles
  for update
  using (auth.uid() = id or public.is_staff(auth.uid()));

-- cooperatives policies
create policy "Coops are readable by anyone" on public.cooperatives
  for select using (true);

create policy "Create cooperative (auth)" on public.cooperatives
  for insert with check (auth.uid() is not null);

create policy "Update coop by admin or staff" on public.cooperatives
  for update using (admin_user_id = auth.uid() or public.is_staff(auth.uid()));

-- cooperative_members policies
create policy "Members can read their cooperative memberships" on public.cooperative_members
  for select using (
    user_id = auth.uid() or
    exists (
      select 1 from public.cooperatives c where c.id = cooperative_id and (c.admin_user_id = auth.uid() or public.is_staff(auth.uid()))
    )
  );

create policy "Admin can manage memberships" on public.cooperative_members
  for all using (
    exists (
      select 1 from public.cooperatives c where c.id = cooperative_id and (c.admin_user_id = auth.uid() or public.is_staff(auth.uid()))
    )
  ) with check (
    exists (
      select 1 from public.cooperatives c where c.id = cooperative_id and (c.admin_user_id = auth.uid() or public.is_staff(auth.uid()))
    )
  );

-- credit applications policies
create policy "Read own or coop admin or staff" on public.credit_applications
  for select using (
    applicant_user_id = auth.uid() or
    public.is_staff(auth.uid()) or
    exists (
      select 1 from public.cooperatives c where c.id = cooperative_id and (c.admin_user_id = auth.uid())
    )
  );

create policy "Insert credit application as self" on public.credit_applications
  for insert with check (applicant_user_id = auth.uid());

create policy "Update own credit or staff" on public.credit_applications
  for update using (applicant_user_id = auth.uid() or public.is_staff(auth.uid()));

-- credit payments policies
create policy "Read/Insert credit payments (owner or staff)" on public.credit_payments
  for all using (
    exists (
      select 1 from public.credit_applications ca
      where ca.id = credit_id and (ca.applicant_user_id = auth.uid() or public.is_staff(auth.uid()))
    )
  ) with check (
    exists (
      select 1 from public.credit_applications ca
      where ca.id = credit_id and (ca.applicant_user_id = auth.uid() or public.is_staff(auth.uid()))
    )
  );

-- tasks policies (members of coop)
create policy "Members can read tasks" on public.production_tasks
  for select using (
    exists (
      select 1 from public.cooperative_members m where m.cooperative_id = cooperative_id and m.user_id = auth.uid()
    ) or public.is_staff(auth.uid())
  );

create policy "Members can create tasks" on public.production_tasks
  for insert with check (
    exists (
      select 1 from public.cooperative_members m where m.cooperative_id = cooperative_id and m.user_id = auth.uid()
    ) or public.is_staff(auth.uid())
  );

create policy "Assignee or admin can update tasks" on public.production_tasks
  for update using (
    assignee_user_id = auth.uid() or
    exists (
      select 1 from public.cooperatives c where c.id = cooperative_id and (c.admin_user_id = auth.uid())
    ) or public.is_staff(auth.uid())
  );

-- products policies
create policy "Products are public readable if active" on public.products
  for select using (is_active = true or owner_user_id = auth.uid() or public.is_staff(auth.uid()));

create policy "Create products (auth)" on public.products
  for insert with check (auth.uid() is not null);

create policy "Update product by owner or coop admin or staff" on public.products
  for update using (
    owner_user_id = auth.uid() or public.is_staff(auth.uid()) or
    exists (
      select 1 from public.cooperatives c where c.id = cooperative_id and (c.admin_user_id = auth.uid())
    )
  );

-- orders policies
create policy "Buyer or seller can read" on public.orders
  for select using (buyer_user_id = auth.uid() or seller_user_id = auth.uid() or public.is_staff(auth.uid()));

create policy "Buyer can create order" on public.orders
  for insert with check (buyer_user_id = auth.uid());

create policy "Buyer or seller can update" on public.orders
  for update using (buyer_user_id = auth.uid() or seller_user_id = auth.uid() or public.is_staff(auth.uid()));

-- order_items policies (follow order)
create policy "Items follow parent order permissions" on public.order_items
  for all using (
    exists (
      select 1 from public.orders o where o.id = order_id and (o.buyer_user_id = auth.uid() or o.seller_user_id = auth.uid() or public.is_staff(auth.uid()))
    )
  ) with check (
    exists (
      select 1 from public.orders o where o.id = order_id and (o.buyer_user_id = auth.uid() or o.seller_user_id = auth.uid() or public.is_staff(auth.uid()))
    )
  );

-- attachments policies
create policy "Owner or coop admin can manage attachments" on public.attachments
  for all using (
    owner_user_id = auth.uid() or public.is_staff(auth.uid()) or
    exists (
      select 1 from public.cooperatives c where c.id = cooperative_id and (c.admin_user_id = auth.uid())
    )
  ) with check (
    owner_user_id = auth.uid() or public.is_staff(auth.uid()) or
    exists (
      select 1 from public.cooperatives c where c.id = cooperative_id and (c.admin_user_id = auth.uid())
    )
  );

-- external payments policies
create policy "Read/Insert payments tied to own orders" on public.external_payments
  for all using (
    exists (
      select 1 from public.orders o where o.id = order_id and (o.buyer_user_id = auth.uid() or o.seller_user_id = auth.uid() or public.is_staff(auth.uid()))
    )
  ) with check (
    exists (
      select 1 from public.orders o where o.id = order_id and (o.buyer_user_id = auth.uid() or o.seller_user_id = auth.uid() or public.is_staff(auth.uid()))
    )
  );

-- activity events policies
create policy "Users can insert own events" on public.activity_events
  for insert with check (user_id = auth.uid());
create policy "Staff can read events" on public.activity_events
  for select using (public.is_staff(auth.uid())); 