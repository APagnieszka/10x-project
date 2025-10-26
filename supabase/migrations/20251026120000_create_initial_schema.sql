-- Migration: Initial database schema for Foodzilla MVP
-- Created: 2025-10-26 12:00:00 UTC
-- Purpose: Create all tables, indexes, and RLS policies for the Foodzilla application
-- Affected tables: households, user_households, products, shopping_lists, shopping_list_items, reports, images, archived_products, scans_log, analytics_events
-- Special considerations: Enables RLS on all tables for multi-tenant security. References Supabase auth.users table.

-- Create households table
-- Stores household information for account sharing
create table households (
    id integer primary key generated always as identity,
    name varchar not null,
    created_at timestamp not null default now()
);

-- Enable RLS for households
alter table households enable row level security;

-- RLS policy for households: anon users cannot access
create policy "anon_cannot_access_households" on households
for all using (false);

-- Create user_households table
-- Maps Supabase auth users to households
create table user_households (
    user_id uuid primary key references auth.users(id) on delete cascade,
    household_id integer not null references households(id) on delete cascade
);

-- Enable RLS for user_households
alter table user_households enable row level security;

-- RLS policy for user_households: authenticated users can access their own mapping
create policy "authenticated_users_can_access_own_user_household" on user_households
for all using (user_id = auth.uid());

-- RLS policy for user_households: anon users cannot access
create policy "anon_cannot_access_user_households" on user_households
for all using (false);

-- RLS policy for households: authenticated users can access households they belong to
create policy "authenticated_users_can_access_their_households" on households
for all using (
    id in (
        select household_id from user_households where user_id = auth.uid()
    )
);

-- Create products table
-- Stores food product information
create table products (
    id integer primary key generated always as identity,
    household_id integer not null references households(id) on delete cascade,
    name varchar not null,
    brand varchar,
    barcode varchar unique,
    quantity numeric not null check (quantity > 0),
    unit varchar not null,
    expiration_date date not null,
    status varchar not null check (status in ('draft', 'active', 'spoiled')),
    opened boolean not null default false,
    to_buy boolean not null default false,
    opened_date timestamp,
    created_at timestamp not null default now(),
    main_image_url varchar
);

-- Enable RLS for products
alter table products enable row level security;

-- RLS policy for products: users can access products from their household
create policy "users_can_access_household_products" on products
for all using (
    household_id in (
        select household_id from user_households where user_id = auth.uid()
    )
);

-- RLS policy for products: anon users cannot access
create policy "anon_cannot_access_products" on products
for all using (false);

-- Create shopping_lists table
-- Manages named shopping lists
create table shopping_lists (
    id integer primary key generated always as identity,
    household_id integer not null references households(id) on delete cascade,
    name varchar not null,
    created_at timestamp not null default now()
);

-- Enable RLS for shopping_lists
alter table shopping_lists enable row level security;

-- RLS policy for shopping_lists: users can access lists from their household
create policy "users_can_access_household_shopping_lists" on shopping_lists
for all using (
    household_id in (
        select household_id from user_households where user_id = auth.uid()
    )
);

-- RLS policy for shopping_lists: anon users cannot access
create policy "anon_cannot_access_shopping_lists" on shopping_lists
for all using (false);

-- Create shopping_list_items table
-- Items within shopping lists
create table shopping_list_items (
    id integer primary key generated always as identity,
    list_id integer not null references shopping_lists(id) on delete cascade,
    product_id integer not null references products(id) on delete cascade,
    status varchar not null check (status in ('to_buy', 'bought'))
);

-- Enable RLS for shopping_list_items
alter table shopping_list_items enable row level security;

-- RLS policy for shopping_list_items: users can access items from their household lists
create policy "users_can_access_household_shopping_list_items" on shopping_list_items
for all using (
    list_id in (
        select id from shopping_lists where household_id in (
            select household_id from user_households where user_id = auth.uid()
        )
    )
);

-- RLS policy for shopping_list_items: anon users cannot access
create policy "anon_cannot_access_shopping_list_items" on shopping_list_items
for all using (false);

-- Create reports table
-- Aggregated reports for food waste tracking
create table reports (
    id integer primary key generated always as identity,
    household_id integer not null references households(id) on delete cascade,
    start_date date not null,
    unit varchar not null check (unit in ('day', 'week', 'month')),
    length integer not null check (length > 0),
    spoiled_count integer not null default 0,
    details jsonb
);

-- Enable RLS for reports
alter table reports enable row level security;

-- RLS policy for reports: users can access reports from their household
create policy "users_can_access_household_reports" on reports
for all using (
    household_id in (
        select household_id from user_households where user_id = auth.uid()
    )
);

-- RLS policy for reports: anon users cannot access
create policy "anon_cannot_access_reports" on reports
for all using (false);

-- Create images table
-- Links photos to products
create table images (
    id integer primary key generated always as identity,
    product_id integer not null references products(id) on delete cascade,
    bucket_name varchar not null check (bucket_name in ('expiry-images', 'product-images')),
    file_path varchar not null,
    type varchar not null check (type in ('expiry', 'product')),
    uploaded_at timestamp not null default now()
);

-- Enable RLS for images
alter table images enable row level security;

-- RLS policy for images: users can access images of products from their household
create policy "users_can_access_household_product_images" on images
for all using (
    product_id in (
        select id from products where household_id in (
            select household_id from user_households where user_id = auth.uid()
        )
    )
);

-- RLS policy for images: anon users cannot access
create policy "anon_cannot_access_images" on images
for all using (false);

-- Create archived_products table
-- Archival table for old products
create table archived_products (
    id integer primary key generated always as identity,
    household_id integer not null references households(id) on delete cascade,
    name varchar not null,
    brand varchar,
    barcode varchar unique,
    quantity numeric not null check (quantity > 0),
    unit varchar not null,
    expiration_date date not null,
    status varchar not null check (status in ('draft', 'active', 'spoiled')),
    opened boolean not null default false,
    to_buy boolean not null default false,
    opened_date timestamp,
    created_at timestamp not null default now(),
    main_image_url varchar
);

-- Enable RLS for archived_products
alter table archived_products enable row level security;

-- RLS policy for archived_products: users can access archived products from their household
create policy "users_can_access_household_archived_products" on archived_products
for all using (
    household_id in (
        select household_id from user_households where user_id = auth.uid()
    )
);

-- RLS policy for archived_products: anon users cannot access
create policy "anon_cannot_access_archived_products" on archived_products
for all using (false);

-- Create scans_log table
-- Logs for OCR and barcode scan operations
create table scans_log (
    id integer primary key generated always as identity,
    household_id integer not null references households(id) on delete cascade,
    operation_type varchar not null,
    timestamp timestamp not null default now()
);

-- Enable RLS for scans_log
alter table scans_log enable row level security;

-- RLS policy for scans_log: users can access logs from their household
create policy "users_can_access_household_scans_log" on scans_log
for all using (
    household_id in (
        select household_id from user_households where user_id = auth.uid()
    )
);

-- RLS policy for scans_log: anon users cannot access
create policy "anon_cannot_access_scans_log" on scans_log
for all using (false);

-- Create analytics_events table
-- Anonymous events for usage analytics
create table analytics_events (
    id integer primary key generated always as identity,
    household_id integer not null references households(id) on delete cascade,
    event_type varchar not null,
    timestamp timestamp not null default now(),
    data jsonb
);

-- Enable RLS for analytics_events
alter table analytics_events enable row level security;

-- RLS policy for analytics_events: users can access events from their household
create policy "users_can_access_household_analytics_events" on analytics_events
for all using (
    household_id in (
        select household_id from user_households where user_id = auth.uid()
    )
);

-- RLS policy for analytics_events: anon users cannot access
create policy "anon_cannot_access_analytics_events" on analytics_events
for all using (false);

-- Create indexes for performance optimization

-- Composite index on products for household and status filtering
create index idx_products_household_status on products (household_id, status);

-- Composite index on products for household and expiration date
create index idx_products_household_expiration on products (household_id, expiration_date);

-- Partial index on products for opened products by household and opened date
create index idx_products_household_opened_date on products (household_id, opened_date) where opened = true;

-- Composite index on reports for household and start date
create index idx_reports_household_start_date on reports (household_id, start_date);

-- Index on shopping_lists for household
create index idx_shopping_lists_household on shopping_lists (household_id);

-- Composite index on scans_log for household and timestamp
create index idx_scans_log_household_timestamp on scans_log (household_id, timestamp);

-- Composite index on analytics_events for household, event type, and timestamp
create index idx_analytics_events_household_type_timestamp on analytics_events (household_id, event_type, timestamp);