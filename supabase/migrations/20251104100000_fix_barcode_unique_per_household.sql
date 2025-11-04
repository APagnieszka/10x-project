-- Migration: Fix barcode uniqueness to be per household instead of global
-- Created: 2025-11-04 10:00:00 UTC
-- Purpose: Remove global unique constraint on barcode and add composite unique constraint per household
-- Affected tables: products, archived_products
-- Special considerations: This allows different households to have products with the same barcode

-- Drop the global unique constraint on products.barcode
alter table products drop constraint if exists products_barcode_key;

-- Add composite unique constraint on (household_id, barcode) for products
-- This ensures barcodes are unique within each household
alter table products add constraint products_household_barcode_unique 
    unique (household_id, barcode);

-- Create index on (household_id, barcode) for fast lookups during product creation
-- Note: The unique constraint above already creates an index, but we explicitly document it
-- create index idx_products_household_barcode on products (household_id, barcode);

-- Do the same for archived_products table
alter table archived_products drop constraint if exists archived_products_barcode_key;

-- Add composite unique constraint on (household_id, barcode) for archived_products
alter table archived_products add constraint archived_products_household_barcode_unique 
    unique (household_id, barcode);
