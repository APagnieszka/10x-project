# Database Schema for Foodzilla MVP

This document outlines the comprehensive PostgreSQL database schema for the Foodzilla application, designed to support household-based food product management, expiration tracking, shopping lists, reports, and analytics. The schema is based on the Product Requirements Document (PRD), database planning session notes, and the chosen technology stack (Supabase with PostgreSQL).

## 1. Tables with Columns, Data Types, and Constraints

### Households
Represents a household entity, allowing multiple users to share an account via Supabase Auth.

| Column      | Type       | Constraints                  | Description                          |
|-------------|------------|------------------------------|--------------------------------------|
| id          | integer    | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the household |
| name        | varchar    | NOT NULL                     | Name of the household                |
| created_at  | timestamp  | NOT NULL, DEFAULT NOW()      | Timestamp of creation                |

### User_households
Maps Supabase Auth users to households for account sharing.

| Column        | Type    | Constraints                  | Description                          |
|---------------|---------|------------------------------|--------------------------------------|
| user_id       | uuid    | PRIMARY KEY, FOREIGN KEY REFERENCES auth.users(id) | Supabase Auth user ID |
| household_id  | integer | NOT NULL, FOREIGN KEY REFERENCES Households(id) | Household ID |

### Products
Stores information about food products in a household, including status, expiration, and quantities.

| Column          | Type       | Constraints                  | Description                          |
|-------------    |------------|------------------------------|--------------------------------------|
| id              | integer    | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the product    |
| household_id    | integer    | NOT NULL, FOREIGN KEY REFERENCES Households(id) | Household owning the product |
| name            | varchar    | NOT NULL                     | Product name                         |
| brand           | varchar    | NULL                         | Product brand (optional)             |
| barcode         | varchar    | NULL, UNIQUE                 | Product barcode (optional, unique)   |
| quantity        | numeric    | NOT NULL, CHECK (quantity > 0) | Product quantity                    |
| unit            | varchar    | NOT NULL                     | Unit of measurement (enum-like: 'kg', 'g', 'l', 'ml', 'pcs') |
| expiration_date | date       | NOT NULL                     | Expiration date                      |
| status          | varchar    | NOT NULL, CHECK (status IN ('draft', 'active', 'spoiled')) | Product status |
| opened          | boolean    | NOT NULL, DEFAULT FALSE      | Whether the product is opened        |
| to_buy          | boolean    | NOT NULL, DEFAULT FALSE      | Whether to add to shopping list      |
| opened_date     | timestamp  | NULL                         | Date when product was opened         |
| created_at      | timestamp  | NOT NULL, DEFAULT NOW()      | Timestamp of creation                |
| main_image_url  | varchar    | NULL                         | URL to main product image            |

### Shopping_lists
Manages named shopping lists for households.

| Column       | Type       | Constraints                  | Description                          |
|--------------|------------|------------------------------|--------------------------------------|
| id           | integer    | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the list       |
| household_id | integer    | NOT NULL, FOREIGN KEY REFERENCES Households(id) | Household owning the list |
| name         | varchar    | NOT NULL                     | Name of the shopping list            |
| created_at   | timestamp  | NOT NULL, DEFAULT NOW()      | Timestamp of creation                |

### Shopping_list_items
Items within shopping lists, linked to products.

| Column     | Type       | Constraints                  | Description                          |
|------------|------------|------------------------------|--------------------------------------|
| id         | integer    | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the item       |
| list_id    | integer    | NOT NULL, FOREIGN KEY REFERENCES Shopping_lists(id) | Shopping list ID |
| product_id | integer    | NOT NULL, FOREIGN KEY REFERENCES Products(id) | Product ID |
| status     | varchar    | NOT NULL, CHECK (status IN ('to_buy', 'bought')) | Item status |

### Reports
Aggregated reports for food waste tracking, with flexible periods.

| Column        | Type       | Constraints                  | Description                          |
|---------------|------------|------------------------------|--------------------------------------|
| id            | integer    | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the report     |
| household_id  | integer    | NOT NULL, FOREIGN KEY REFERENCES Households(id) | Household ID |
| start_date    | date       | NOT NULL                     | Start date of the reporting period   |
| unit          | varchar    | NOT NULL, CHECK (unit IN ('day', 'week', 'month')) | Period unit |
| length        | integer    | NOT NULL, CHECK (length > 0) | Length of the period                 |
| spoiled_count | integer    | NOT NULL, DEFAULT 0          | Number of spoiled products           |
| details       | jsonb      | NULL                         | Additional JSON details              |

### Images
Links photos to products, stored in Supabase buckets.

| Column       | Type       | Constraints                  | Description                          |
|--------------|------------|------------------------------|--------------------------------------|
| id           | integer    | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the image      |
| product_id   | integer    | NOT NULL, FOREIGN KEY REFERENCES Products(id) | Product ID |
| bucket_name  | varchar    | NOT NULL, CHECK (bucket_name IN ('expiry-images', 'product-images')) | Supabase bucket name |
| file_path    | varchar    | NOT NULL                     | Path to the file in the bucket       |
| type         | varchar    | NOT NULL, CHECK (type IN ('expiry', 'product')) | Image type |
| uploaded_at  | timestamp  | NOT NULL, DEFAULT NOW()      | Upload timestamp                     |

### Archived_products
Archival table for old products, identical to Products for history preservation.

| Column          | Type       | Constraints                  | Description                          |
|-------------    |------------|------------------------------|--------------------------------------|
| id              | integer    | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for archived product |
| household_id    | integer    | NOT NULL, FOREIGN KEY REFERENCES Households(id) | Household owning the product |
| name            | varchar    | NOT NULL                     | Product name                         |
| brand           | varchar    | NULL                         | Product brand (optional)             |
| barcode         | varchar    | NULL, UNIQUE                 | Product barcode (optional, unique)   |
| quantity        | numeric    | NOT NULL, CHECK (quantity > 0) | Product quantity                    |
| unit            | varchar    | NOT NULL                     | Unit of measurement                  |
| expiration_date | date       | NOT NULL                     | Expiration date                      |
| status          | varchar    | NOT NULL, CHECK (status IN ('draft', 'active', 'spoiled')) | Product status |
| opened          | boolean    | NOT NULL, DEFAULT FALSE      | Whether the product is opened        |
| to_buy          | boolean    | NOT NULL, DEFAULT FALSE      | Whether to add to shopping list      |
| opened_date     | timestamp  | NULL                         | Date when product was opened         |
| created_at      | timestamp  | NOT NULL, DEFAULT NOW()      | Timestamp of creation                |
| main_image_url  | varchar    | NULL                         | URL to main product image            |

### Scans_log
Logs for OCR and barcode scan operations to enforce rate limiting.

| Column         | Type       | Constraints                  | Description                          |
|-------------   |------------|------------------------------|--------------------------------------|
| id             | integer    | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the log entry  |
| household_id   | integer    | NOT NULL, FOREIGN KEY REFERENCES Households(id) | Household ID |
| operation_type | varchar    | NOT NULL                     | Type of operation (e.g., 'ocr', 'scan') |
| timestamp      | timestamp  | NOT NULL, DEFAULT NOW()      | Timestamp of the operation           |

### Analytics_events
Anonymous events for usage analytics.

| Column       | Type       | Constraints                  | Description                          |
|--------------|------------|------------------------------|--------------------------------------|
| id           | integer    | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the event      |
| household_id | integer    | NOT NULL, FOREIGN KEY REFERENCES Households(id) | Household ID |
| event_type   | varchar    | NOT NULL                     | Type of event (e.g., 'product_added') |
| timestamp    | timestamp  | NOT NULL, DEFAULT NOW()      | Timestamp of the event               |
| data         | jsonb      | NULL                         | Additional JSON data                 |

## 2. Relationships Between Tables

- **Households** (1) → (many) **User_households**: One household can have multiple users.
- **Auth.users** (1) → (1) **User_households**: One user belongs to one household (account sharing model).
- **Households** (1) → (many) **Products**: One household can have multiple products.
- **Households** (1) → (many) **Shopping_lists**: One household can have multiple shopping lists.
- **Households** (1) → (many) **Reports**: One household can have multiple reports.
- **Households** (1) → (many) **Archived_products**: One household can have multiple archived products.
- **Households** (1) → (many) **Scans_log**: One household can have multiple scan logs.
- **Households** (1) → (many) **Analytics_events**: One household can have multiple analytics events.
- **Products** (1) → (many) **Images**: One product can have multiple images.
- **Products** (1) → (many) **Shopping_list_items**: One product can appear in multiple shopping list items.
- **Shopping_lists** (1) → (many) **Shopping_list_items**: One shopping list can have multiple items.

All relationships are enforced via foreign keys with CASCADE on delete for data integrity.

## 3. Indexes

To optimize query performance for common operations like filtering by household, status, and dates:

- Composite index on Products: (household_id, status)
- Composite index on Products: (household_id, expiration_date)
- Composite index on Products: (household_id, opened_date) WHERE opened = true
- Composite index on Reports: (household_id, start_date)
- Composite index on Shopping_lists: (household_id)
- Composite index on Scans_log: (household_id, timestamp)
- Composite index on Analytics_events: (household_id, event_type, timestamp)

## 4. Row Level Security (RLS) Policies

All tables enable RLS to ensure users can only access data from their own household. Policies check auth.uid() against the household_id via a user-household mapping (assumed via Supabase Auth extension).

Example policy for Products:
```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access only their household products" ON products
FOR ALL USING (household_id IN (
  SELECT household_id FROM user_households WHERE user_id = auth.uid()
));
```

Similar policies apply to all tables with household_id. For tables without direct household_id (e.g., Images), access is controlled via product_id relationship.

## 5. Additional Notes and Design Decisions

- **Supabase Auth**: User management is handled by Supabase Auth. The 'users' table is not created in the public schema to avoid conflicts and ensure all authentication benefits (e.g., JWT, password reset) are utilized. User-household mappings are stored in the user_households table, referencing auth.users(id).
- **Normalization**: Schema follows 3NF to minimize redundancy while maintaining performance.
- **Data Types**: Uses numeric for quantities to support decimals; varchar for enums to allow easy extension; jsonb for flexible details in reports and analytics.
- **Scalability**: Archiving to archived_products prevents table bloat; indexes optimized for household-scoped queries.
- **Security**: RLS ensures multi-tenant isolation; rate limiting enforced via application checks against scans_log.
- **Triggers**: Reports table updated via triggers on product status changes (not detailed here, to be implemented in migrations).
- **Buckets**: Supabase storage buckets ('expiry-images' with 100-day retention, 'product-images' indefinite) linked via Images table.
- **Internationalization**: Unit enum supports common units; status enums are simple strings for i18n compatibility.
- **Performance**: Composite indexes reduce query times; partial indexes minimize storage for opened products.

This schema is production-ready and aligned with Supabase best practices for security, scalability, and the MVP requirements.