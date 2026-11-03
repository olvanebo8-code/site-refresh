create extension if not exists pgcrypto with schema extensions;

create table if not exists public.restaurant_tables (
  number smallint primary key check (number between 1 and 20),
  label text not null unique,
  occupancy_status text not null default 'free' check (occupancy_status in ('free', 'occupied'))
);

alter table public.restaurant_tables
  add column if not exists occupancy_status text not null default 'free'
  check (occupancy_status in ('free', 'occupied'));

insert into public.restaurant_tables (number, label)
select n, 'Tisch ' || n from generate_series(1, 20) as n
on conflict (number) do update set label = excluded.label;

create table if not exists public.products (
  id text primary key,
  name text not null,
  description text not null,
  category text not null,
  image_url text not null,
  price_cents integer not null check (price_cents >= 0),
  active boolean not null default true
);

insert into public.products (id, name, description, category, image_url, price_cents) values
('caprese', 'Caprese', 'Tomaten, Mozzarella, Basilikum und Olivenöl.', 'salads', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=85', 950),
('burrata-pfirsich', 'Burrata mit Pfirsich', 'Burrata, Pfirsich, Rucola und Balsamico.', 'salads', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=85', 1250),
('caesar-salad', 'Caesar Salad', 'Römersalat, Parmesan, Croûtons und hausgemachtes Dressing.', 'salads', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=85', 1050),
('antipasti-misti', 'Antipasti misti', 'Gegrillte Zucchini, Paprika und Aubergine.', 'salads', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=85', 1100),
('bruschetta-pomodoro', 'Bruschetta al pomodoro', 'Geröstetes Brot mit Tomaten, Knoblauch und Basilikum.', 'salads', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=85', 750),
('tagliatelle-ragu', 'Tagliatelle al ragù', 'Frische Bandnudeln mit Rinderragù und Parmesan.', 'noodles', 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=500&q=85', 1650),
('spaghetti-aglio-olio', 'Spaghetti aglio e olio', 'Spaghetti mit Knoblauch, Olivenöl, Petersilie und Chili.', 'noodles', 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=500&q=85', 1300),
('pappardelle-funghi', 'Pappardelle ai funghi', 'Breite Eiernudeln mit Pilzen, Thymian und Parmesan.', 'noodles', 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=500&q=85', 1700),
('penne-arrabbiata', 'Penne all’arrabbiata', 'Penne in Tomatensauce mit Knoblauch und Chili.', 'noodles', 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=500&q=85', 1400),
('ravioli-ricotta-spinaci', 'Ravioli ricotta e spinaci', 'Ravioli mit Ricotta und Spinat in Salbeibutter.', 'noodles', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=500&q=85', 1750),
('lasagne-forno', 'Lasagne al forno', 'Pasta mit Rinderragù, Béchamel und Parmesan.', 'noodles', 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=500&q=85', 1700),
('pollo-griglia', 'Pollo alla griglia', 'Gegrilltes Hähnchen mit Rosmarinkartoffeln und Kräutersalat.', 'mains', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=85', 1950),
('saltimbocca-romana', 'Saltimbocca alla romana', 'Kalbsschnitzel mit Parmaschinken und Salbei.', 'mains', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=85', 2400),
('branzino-forno', 'Branzino al forno', 'Ofengebackener Wolfsbarsch mit Zitrone und Gemüse.', 'mains', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=85', 2550),
('melanzane-parmigiana', 'Melanzane alla parmigiana', 'Aubergine mit Tomate, Mozzarella und Parmesan.', 'mains', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=85', 1800),
('bistecca-pepe-verde', 'Bistecca al pepe verde', 'Rindersteak mit Pfeffersauce und gegrilltem Gemüse.', 'mains', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=85', 2900),
('risotto-funghi', 'Risotto ai funghi', 'Cremiges Risotto mit Pilzen, Thymian und Parmesan.', 'mains', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=500&q=85', 1800),
('gnocchi-pesto', 'Gnocchi al pesto', 'Kartoffelgnocchi mit Basilikumpesto und Pinienkernen.', 'mains', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=500&q=85', 1650),
('focaccia-rosmarino', 'Focaccia al rosmarino', 'Ofenbrot mit Rosmarin und Olivenöl.', 'dumplings', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=500&q=85', 600),
('arancini', 'Arancini', 'Knusprige Risottobällchen mit Mozzarella und Tomate.', 'dumplings', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=500&q=85', 850),
('calzone-classico', 'Calzone classico', 'Teigtasche mit Mozzarella, Tomate und Basilikum.', 'dumplings', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=500&q=85', 1550),
('panzerotti', 'Panzerotti', 'Gebackene Teigtaschen mit Ricotta und Spinat.', 'dumplings', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=500&q=85', 950),
('acqua-1', 'Acqua naturale / frizzante · 0,25 l', 'Italienisches Mineralwasser, still oder prickelnd.', 'drinks', 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=500&q=85', 350),
('acqua-2', 'Acqua naturale / frizzante · 0,75 l', 'Italienisches Mineralwasser, still oder prickelnd.', 'drinks', 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=500&q=85', 650),
('limonata', 'Limonata', 'Italienische Zitronenlimonade.', 'drinks', 'https://images.unsplash.com/photo-1658238613850-fbd27df10421?auto=format&fit=crop&w=500&q=85', 400),
('espresso', 'Espresso', 'Kräftiger Espresso aus frisch gemahlenen Bohnen.', 'drinks', 'https://images.unsplash.com/photo-1658238613850-fbd27df10421?auto=format&fit=crop&w=500&q=85', 300),
('cappuccino', 'Cappuccino', 'Espresso mit cremig aufgeschäumter Milch.', 'drinks', 'https://images.unsplash.com/photo-1658238613850-fbd27df10421?auto=format&fit=crop&w=500&q=85', 450),
('aperol-spritz', 'Aperol Spritz', 'Aperol, Prosecco und Soda mit Orangenscheibe.', 'drinks', 'https://images.unsplash.com/photo-1658238613850-fbd27df10421?auto=format&fit=crop&w=500&q=85', 900),
('primitivo-1', 'Primitivo · Glas', 'Fruchtiger Rotwein aus Apulien.', 'drinks', 'https://images.unsplash.com/photo-1658238613850-fbd27df10421?auto=format&fit=crop&w=500&q=85', 800),
('primitivo-2', 'Primitivo · Flasche', 'Fruchtiger Rotwein aus Apulien.', 'drinks', 'https://images.unsplash.com/photo-1658238613850-fbd27df10421?auto=format&fit=crop&w=500&q=85', 2600),
('pinot-grigio-1', 'Pinot Grigio · Glas', 'Weißwein mit Noten von Birne und Zitrus.', 'drinks', 'https://images.unsplash.com/photo-1658238613850-fbd27df10421?auto=format&fit=crop&w=500&q=85', 800),
('pinot-grigio-2', 'Pinot Grigio · Flasche', 'Weißwein mit Noten von Birne und Zitrus.', 'drinks', 'https://images.unsplash.com/photo-1658238613850-fbd27df10421?auto=format&fit=crop&w=500&q=85', 2600)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  category = excluded.category,
  image_url = excluded.image_url,
  price_cents = excluded.price_cents,
  active = true;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,
  table_number smallint not null references public.restaurant_tables(number),
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'accepted', 'preparing', 'ready', 'completed')),
  payment_status text not null default 'open' check (payment_status in ('open', 'paid')),
  instructions text not null default '',
  total_cents integer not null check (total_cents >= 0)
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id),
  product_name text not null,
  quantity integer not null check (quantity between 1 and 20),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  line_total_cents integer not null check (line_total_cents >= 0)
);

create table if not exists public.kitchen_orders (
  id uuid primary key references public.orders(id) on delete cascade,
  table_number smallint not null references public.restaurant_tables(number),
  created_at timestamptz not null,
  status text not null check (status in ('new', 'accepted', 'preparing', 'ready', 'completed')),
  instructions text not null default ''
);

create table if not exists public.kitchen_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.kitchen_orders(id) on delete cascade,
  product_name text not null,
  quantity integer not null check (quantity between 1 and 20)
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_table_number_idx on public.orders (table_number, created_at desc);
create index if not exists kitchen_orders_created_at_idx on public.kitchen_orders (created_at desc);
create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists kitchen_order_items_order_id_idx on public.kitchen_order_items (order_id);

create or replace function public.current_staff_role()
returns text
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '')
$$;

alter table public.restaurant_tables enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.kitchen_orders enable row level security;
alter table public.kitchen_order_items enable row level security;

drop policy if exists "Public can read tables" on public.restaurant_tables;
drop policy if exists "Administrators can read tables" on public.restaurant_tables;
create policy "Administrators can read tables" on public.restaurant_tables
  for select to authenticated using (public.current_staff_role() = 'admin');
drop policy if exists "Administrators can update table occupancy" on public.restaurant_tables;
create policy "Administrators can update table occupancy" on public.restaurant_tables
  for update to authenticated using (public.current_staff_role() = 'admin')
  with check (public.current_staff_role() = 'admin');
drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products" on public.products for select using (active);
drop policy if exists "Administrators can read orders" on public.orders;
create policy "Administrators can read orders" on public.orders for select to authenticated using (public.current_staff_role() = 'admin');
drop policy if exists "Administrators can read order items" on public.order_items;
create policy "Administrators can read order items" on public.order_items for select to authenticated using (
  exists (select 1 from public.orders o where o.id = order_id and public.current_staff_role() = 'admin')
);
drop policy if exists "Kitchen staff can read kitchen orders" on public.kitchen_orders;
create policy "Kitchen staff can read kitchen orders" on public.kitchen_orders for select to authenticated using (
  public.current_staff_role() in ('kitchen', 'admin')
);
drop policy if exists "Kitchen staff can read kitchen items" on public.kitchen_order_items;
create policy "Kitchen staff can read kitchen items" on public.kitchen_order_items for select to authenticated using (
  exists (
    select 1 from public.kitchen_orders ko
    where ko.id = order_id and public.current_staff_role() in ('kitchen', 'admin')
  )
);

revoke select on public.restaurant_tables from anon;
grant select on public.restaurant_tables to authenticated;
grant select on public.products to anon, authenticated;
grant select on public.orders, public.order_items, public.kitchen_orders, public.kitchen_order_items to authenticated;

create or replace function public.submit_order(
  p_table_number integer,
  p_items jsonb,
  p_instructions text default '',
  p_submission_id uuid default gen_random_uuid()
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_order_id uuid;
  v_total integer := 0;
  v_item jsonb;
  v_product public.products%rowtype;
  v_quantity integer;
begin
  if p_table_number is null or p_table_number not between 1 and 20
     or not exists (select 1 from public.restaurant_tables where number = p_table_number) then
    raise exception 'Ungültige Tischnummer.';
  end if;
  if coalesce(jsonb_typeof(p_items), '') <> 'array'
     or coalesce(jsonb_array_length(p_items), 0) not between 1 and 50 then
    raise exception 'Die Bestellung enthält keine gültigen Artikel.';
  end if;
  if length(coalesce(p_instructions, '')) > 1000 then
    raise exception 'Der Hinweis ist zu lang.';
  end if;

  perform 1 from public.restaurant_tables where number = p_table_number for update;
  if not found then raise exception 'Tisch nicht gefunden.'; end if;

  insert into public.orders (submission_id, table_number, instructions, total_cents)
  values (p_submission_id, p_table_number, left(coalesce(p_instructions, ''), 1000), 0)
  on conflict (submission_id) do nothing
  returning id into v_order_id;

  if v_order_id is null then
    select id into v_order_id from public.orders where submission_id = p_submission_id;
    return jsonb_build_object('id', v_order_id, 'duplicate', true);
  end if;
  insert into public.kitchen_orders (id, table_number, created_at, status, instructions)
  select id, table_number, created_at, status, instructions from public.orders where id = v_order_id;
  update public.restaurant_tables set occupancy_status = 'occupied' where number = p_table_number;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    if coalesce(jsonb_typeof(v_item -> 'product_id'), '') <> 'string'
       or coalesce(v_item ->> 'quantity', '') !~ '^[0-9]+$' then
      raise exception 'Ein Artikel ist ungültig.';
    end if;
    v_quantity := (v_item ->> 'quantity')::integer;
    if v_quantity not between 1 and 20 then
      raise exception 'Die Artikelmenge muss zwischen 1 und 20 liegen.';
    end if;
    select * into v_product from public.products
    where id = v_item ->> 'product_id' and active
    for share;
    if not found then
      raise exception 'Ein ausgewähltes Produkt ist nicht verfügbar.';
    end if;

    insert into public.order_items (order_id, product_id, product_name, quantity, unit_price_cents, line_total_cents)
    values (v_order_id, v_product.id, v_product.name, v_quantity, v_product.price_cents, v_product.price_cents * v_quantity);
    insert into public.kitchen_order_items (order_id, product_name, quantity)
    values (v_order_id, v_product.name, v_quantity);
    v_total := v_total + v_product.price_cents * v_quantity;
  end loop;

  update public.orders set total_cents = v_total where id = v_order_id;

  return jsonb_build_object('id', v_order_id, 'total_cents', v_total, 'duplicate', false);
end;
$$;

create or replace function public.update_order_status(p_order_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if public.current_staff_role() not in ('kitchen', 'admin') then
    raise exception 'Keine Berechtigung für Küchenbestellungen.';
  end if;
  if p_status not in ('accepted', 'preparing', 'ready', 'completed') then
    raise exception 'Ungültiger Bestellstatus.';
  end if;
  update public.orders set status = p_status where id = p_order_id;
  if not found then raise exception 'Bestellung nicht gefunden.'; end if;
  update public.kitchen_orders set status = p_status where id = p_order_id;
end;
$$;

create or replace function public.mark_order_paid(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_table_number smallint;
begin
  if public.current_staff_role() <> 'admin' then
    raise exception 'Nur Administratoren können Zahlungen verbuchen.';
  end if;
  select table_number into v_table_number from public.orders where id = p_order_id;
  if not found then raise exception 'Bestellung nicht gefunden.'; end if;
  perform 1 from public.restaurant_tables where number = v_table_number for update;
  update public.orders set payment_status = 'paid' where id = p_order_id;
  if not found then raise exception 'Bestellung nicht gefunden.'; end if;
  update public.restaurant_tables t
  set occupancy_status = 'free'
  where t.number = v_table_number
    and not exists (
      select 1 from public.orders o
      where o.table_number = t.number and o.payment_status = 'open'
    );
end;
$$;

create or replace function public.mark_table_paid(p_table_number integer)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if public.current_staff_role() <> 'admin' then
    raise exception 'Nur Administratoren können Zahlungen verbuchen.';
  end if;
  if p_table_number is null or p_table_number not between 1 and 20 then
    raise exception 'Ungültige Tischnummer.';
  end if;

  perform 1 from public.restaurant_tables where number = p_table_number for update;
  if not found then raise exception 'Tisch nicht gefunden.'; end if;

  update public.orders
  set payment_status = 'paid'
  where table_number = p_table_number and payment_status = 'open';
  if not found then raise exception 'Für diesen Tisch gibt es keine offene Rechnung.'; end if;

  update public.restaurant_tables
  set occupancy_status = 'free'
  where number = p_table_number;
end;
$$;

create or replace function public.set_table_occupancy(p_table_number integer, p_occupancy_status text)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if public.current_staff_role() <> 'admin' then
    raise exception 'Nur Administratoren können den Tischstatus ändern.';
  end if;
  if p_table_number is null or p_table_number not between 1 and 20
     or p_occupancy_status is null or p_occupancy_status not in ('free', 'occupied') then
    raise exception 'Ungültiger Tischstatus.';
  end if;
  perform 1 from public.restaurant_tables where number = p_table_number for update;
  if not found then raise exception 'Tisch nicht gefunden.'; end if;
  if p_occupancy_status = 'free' and exists (
    select 1 from public.kitchen_orders
    where table_number = p_table_number and status <> 'completed'
  ) then
    raise exception 'Ein Tisch mit einer offenen Bestellung kann nicht freigegeben werden.';
  end if;
  update public.restaurant_tables set occupancy_status = p_occupancy_status
  where number = p_table_number;
end;
$$;

revoke all on function public.submit_order(integer, jsonb, text, uuid) from public;
revoke all on function public.update_order_status(uuid, text) from public;
revoke all on function public.mark_order_paid(uuid) from public;
revoke all on function public.mark_table_paid(integer) from public;
revoke all on function public.set_table_occupancy(integer, text) from public;
grant execute on function public.submit_order(integer, jsonb, text, uuid) to anon, authenticated;
grant execute on function public.update_order_status(uuid, text) to authenticated;
grant execute on function public.mark_order_paid(uuid) to authenticated;
grant execute on function public.mark_table_paid(integer) to authenticated;
grant execute on function public.set_table_occupancy(integer, text) to authenticated;

alter table public.restaurant_tables replica identity full;
alter table public.kitchen_orders replica identity full;
alter table public.kitchen_order_items replica identity full;
do $$
begin
  alter publication supabase_realtime add table public.kitchen_orders;
exception when duplicate_object then null;
end;
$$;
do $$
begin
  alter publication supabase_realtime add table public.restaurant_tables;
exception when duplicate_object then null;
end;
$$;
do $$
begin
  alter publication supabase_realtime add table public.kitchen_order_items;
exception when duplicate_object then null;
end;
$$;
do $$
begin
  alter publication supabase_realtime add table public.orders;
exception when duplicate_object then null;
end;
$$;
do $$
begin
  alter publication supabase_realtime add table public.order_items;
exception when duplicate_object then null;
end;
$$;
