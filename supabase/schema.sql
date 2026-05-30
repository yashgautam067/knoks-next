-- ============================================
-- KNOKS E-Commerce — Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================

create extension if not exists "uuid-ossp";

-- ─── Profiles ───
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null default 'User',
  phone text,
  avatar_url text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Addresses ───
create table addresses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  label text default 'Home',
  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  pincode text not null,
  is_default boolean default false,
  created_at timestamptz default now()
);

-- ─── Products ───
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text not null,
  short_desc text not null,
  price integer not null,
  mrp integer not null,
  images text[] default '{}',
  category text not null check (category in ('boxer-brief','trunk','brief','pack')),
  sizes text[] not null default '{}',
  colors jsonb not null default '[]',
  stock integer not null default 0,
  badge text check (badge in ('NEW','BESTSELLER','LIMITED')),
  material text,
  care_instructions text,
  rating numeric(2,1) default 0.0,
  review_count integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Reviews ───
create table reviews (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  reviewer_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  is_verified boolean default false,
  created_at timestamptz default now()
);

-- ─── Orders ───
create table orders (
  id uuid default uuid_generate_v4() primary key,
  order_id text unique not null,
  user_id uuid references profiles(id) on delete set null,
  guest_name text, guest_email text, guest_phone text,
  items jsonb not null default '[]',
  shipping_address jsonb not null,
  pricing jsonb not null,
  coupon_code text,
  delivery_type text default 'standard' check (delivery_type in ('standard','express')),
  payment_method text,
  payment_status text default 'pending' check (payment_status in ('pending','paid','failed')),
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  status text default 'pending' check (status in ('pending','confirmed','packed','shipped','delivered','cancelled')),
  tracking_number text,
  tracking_timeline jsonb default '[]',
  admin_notes text,
  estimated_delivery date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Newsletter ───
create table newsletter (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  created_at timestamptz default now()
);

-- ─── Coupons ───
create table coupons (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  type text not null check (type in ('percent','flat')),
  value integer not null,
  min_order integer default 0,
  is_active boolean default true,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- ─── Indexes ───
create index idx_products_slug on products(slug);
create index idx_products_category on products(category);
create index idx_orders_order_id on orders(order_id);
create index idx_orders_user_id on orders(user_id);
create index idx_orders_status on orders(status);

-- ─── RLS ───
alter table profiles enable row level security;
alter table addresses enable row level security;
alter table orders enable row level security;
alter table products enable row level security;
alter table reviews enable row level security;

create policy "Public read products" on products for select using (is_active = true);
create policy "Own profile" on profiles for all using (auth.uid() = id);
create policy "Own addresses" on addresses for all using (auth.uid() = user_id);
create policy "Own orders" on orders for select using (auth.uid() = user_id);
create policy "Insert orders" on orders for insert with check (true);
create policy "Public reviews" on reviews for select using (true);

-- ─── Auto-create profile on signup ───
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles(id, name, avatar_url)
  values(
    new.id,
    coalesce(new.raw_user_meta_data->>'name','User'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ─── Default Coupons ───
insert into coupons(code, type, value, min_order) values
('KNOKS10', 'percent', 10, 0),
('FLAT50', 'flat', 5000, 50000),
('WELCOME20', 'percent', 20, 99900);

-- ─── Seed Products ───
insert into products(name,slug,description,short_desc,price,mrp,images,category,sizes,colors,stock,badge,material,rating,review_count) values
('Classic Black Boxer Brief','classic-black-boxer-brief','Premium 95% cotton boxer brief engineered for all-day comfort. Breathable fabric with 4-way stretch. Flat-lock seams prevent chafing.','Signature boxer brief, all-day comfort',49900,69900,ARRAY['/images/products/black-lifestyle.jpg','/images/products/product-1.jpg','/images/products/product-1b.jpg'],'boxer-brief',ARRAY['S','M','L','XL','XXL'],'[{"name":"Black","hex":"#0A0A0A"},{"name":"Charcoal","hex":"#36454F"}]'::jsonb,150,'BESTSELLER','95% Cotton, 5% Elastane',4.8,247),
('Navy Essential Boxer Brief','navy-essential-boxer-brief','Signature navy boxer brief in ultra-soft combed cotton. KNOKS branded waistband with premium finish.','Navy everyday boxer brief',44900,59900,ARRAY['/images/products/navy-front.jpg','/images/products/navy-lifestyle.jpg','/images/products/product-2.jpg'],'boxer-brief',ARRAY['S','M','L','XL','XXL'],'[{"name":"Navy","hex":"#001F5B"},{"name":"Black","hex":"#0A0A0A"}]'::jsonb,120,'NEW','95% Cotton, 5% Elastane',4.7,163),
('Pack of 3 Boxer Briefs','pack-of-3-boxer-briefs','Value pack of 3 premium boxer briefs in Black, Navy, and Grey. Our best-selling pack.','3-pack premium boxer briefs',129900,179900,ARRAY['/images/products/black-lifestyle.jpg','/images/products/navy-lifestyle.jpg','/images/products/grey-lifestyle.jpg'],'pack',ARRAY['S','M','L','XL','XXL'],'[{"name":"Black","hex":"#0A0A0A"},{"name":"Mix","hex":"#666666"}]'::jsonb,60,'BESTSELLER','95% Cotton, 5% Elastane',4.9,412),
('Grey Melange Trunks','grey-melange-trunks','Soft heather grey trunks with a modern fit. Anti-odor technology keeps you fresh all day.','Heather grey premium trunks',44900,59900,ARRAY['/images/products/grey-lifestyle.jpg','/images/products/product-4.jpg'],'trunk',ARRAY['S','M','L','XL'],'[{"name":"Grey","hex":"#808080"},{"name":"Charcoal","hex":"#36454F"}]'::jsonb,90,'NEW','90% Cotton, 10% Elastane',4.6,89),
('Cotton Classic Briefs','cotton-classic-briefs','Pure combed cotton for maximum softness. Timeless design with reinforced waistband.','Pure cotton everyday briefs',34900,49900,ARRAY['/images/products/product-5.jpg','/images/products/navy-front.jpg'],'brief',ARRAY['S','M','L','XL'],'[{"name":"White","hex":"#F5F5F0"},{"name":"Black","hex":"#0A0A0A"},{"name":"Navy","hex":"#001F5B"}]'::jsonb,200,null,'100% Combed Cotton',4.5,334),
('Limited Edition Red','limited-edition-red','Bold red accent boxer brief. Limited stock. Make a statement.','Limited edition bold red boxer',59900,79900,ARRAY['/images/products/product-6.jpg','/images/products/black-lifestyle.jpg'],'boxer-brief',ARRAY['M','L','XL'],'[{"name":"Red/Black","hex":"#E63946"}]'::jsonb,30,'LIMITED','95% Cotton, 5% Elastane',4.8,67);
