# Database Planning Summary for Foodzilla MVP

<conversation_summary>
<decisions>
1. Households will be the main entity with users extended through Supabase Auth, allowing account sharing by multiple users in a household.
2. Product statuses will be modeled as a main enum ('draft', 'active', 'spoiled') and additional boolean fields for opened and to_buy to handle complex states.
3. Indexing will include composite indexes on (household_id, status), (household_id, expiration_date), (household_id, opened_date) and partial indexes for query optimization.
4. Reports will be stored as aggregated data in a separate table with household_id, start_date, unit (enum: 'day', 'week', 'month'), length (integer for period length), spoiled_count and JSON details, updated by triggers, allowing universal reporting periods.
5. Photos will be stored in two separate Supabase buckets (expiry-images with 100-day retention and product-images indefinitely), linked via an Images table with product_id, bucket_name, file_path, and type (expiry/product), but cleanup will be omitted in MVP.
6. RLS policies will be applied to all tables with household_id, checking auth.uid() for access only to own household data.
7. Shopping lists will be modeled with a separate table for lists (Shopping_lists with household_id, name) and items (Shopping_list_items with list_id, product_id, status), allowing multiple named shopping lists per household.
8. Product quantities will be of type numeric with positive constraints, units as enum varchar with allowed values for consistency and internationalization.
9. Rate limiting for OCR and scans will be enforced in the application by checking the number of operations before execution, with a scans_log table for logging.
10. For scalability, instead of partitioning, old products will be archived to archived_products table when household exceeds 10,000 products, preserving history without data loss.
</decisions>

<matched_recommendations>
1. Implementation of households as the main entity with Supabase Auth extension for users – matched to the decision on account sharing.
2. Use of enum for product statuses with additional boolean fields – matched to the complex states model.
3. Composite and partial indexes for query optimization on dates and statuses – matched to the indexing strategy.
4. Storing reports as aggregated records with triggers and universal period fields – matched to the flexible reporting decision.
5. Two buckets for photos with different retention policies and Images table for links – matched, with cleanup omitted in MVP.
6. RLS policies on all tables with household_id – matched to security requirements.
7. Separate tables for shopping lists and items with statuses – matched to the multiple lists model.
8. Numeric types and enum varchar for quantities and units – matched to the data types decision.
9. Enforcing rate limiting in application with logs table – matched to the security decisions.
10. Archiving instead of partitioning for scalability – matched to the FIFO/archiving alternative.
</matched_recommendations>

<database_planning_summary>
### Main Requirements for Database Schema
The PostgreSQL-based database in Supabase must support the MVP of the Foodzilla app for managing food products in households. Key requirements include support for multiple users on one household account, tracking products with expiration dates, statuses (active, draft, spoiled), shopping lists, food waste reports (universal periods: daily, weekly, monthly), notifications, photos, and analytics. Non-functional requirements include security through RLS, scalability to 50,000 products per household, query performance <800ms average, and support for internationalization (Polish/English).

### Key Entities and Their Relationships
- **Households**: Main entity representing a household, with household_id as foreign key in other tables. Relationship: one-to-many with users (via Supabase Auth), products, reports, etc.
- **Products**: Product entity with fields: household_id, name, brand, barcode, quantity, unit, expiration_date, status (enum), opened (boolean), to_buy (boolean), opened_date, created_at, main_image_url (optional, for quick access to primary photo). Relationships: one-to-many with photos (via Images), links to shopping list items.
- **Shopping_lists**: Table for shopping lists with household_id, name (e.g., 'Weekend', 'Holidays'), created_at.
- **Shopping_list_items**: Table for shopping list items with list_id (FK to Shopping_lists), product_id (FK to Products), status ('to_buy', 'bought').
- **Reports**: Table of aggregated reports with household_id, start_date, unit (enum: 'day', 'week', 'month'), length (integer), spoiled_count, details (JSON).
- **Archived_products**: Archival table for old products, identical structure to Products (including barcode and main_image_url), moved when 10k limit exceeded.
- **Scans_log**: Logs table for OCR/scan operations with household_id, operation_type, timestamp.
- **Images**: Table linking photos to products with product_id (FK), bucket_name (expiry-images/product-images), file_path, type (expiry/product), uploaded_at.
- **Analytics_events**: Table for anonymous events with household_id, event_type, timestamp, data (JSON).

Relationships are based on household_id for data isolation, with optional FKs to Products in other tables.

### Important Security and Scalability Issues
- **Security**: RLS enabled on all tables, checking household_id and auth.uid(). Private buckets with signed URLs. Rate limiting enforced in app. Sensitive data (date photos) with 100-day retention.
- **Scalability**: Archiving old products to maintain <10k active per household. Composite indexes on household_id + key fields for fast queries. Performance monitoring before further optimizations like partitioning.

### Unresolved Issues or Areas Requiring Further Clarification
No unresolved issues – discussion covered all key areas of database planning for MVP.
</database_planning_summary>

## Entity Visualizations

### Households
```
+-------------+
| Households  |
+-------------+
| id: integer (PK) |
| name: varchar   |
| created_at: timestamp |
+-------------+
```

### Products
```
+-----------------+
| Products        |
+-----------------+
| id: integer (PK) |
| household_id: integer (FK) |
| name: varchar    |
| brand: varchar (nullable) |
| barcode: varchar (nullable, unique) |
| quantity: numeric |
| unit: varchar    |
| expiration_date: date |
| status: varchar  |
| opened: boolean  |
| to_buy: boolean  |
| opened_date: timestamp (nullable) |
| created_at: timestamp |
| main_image_url: varchar (nullable) |
+-----------------+
```
```
+-----------------+
| Products        |
+-----------------+
| id: integer (PK) |
| household_id: integer (FK) |
| name: varchar    |
| brand: varchar   |
| barcode: varchar |
| quantity: numeric |
| unit: varchar    |
| expiration_date: date |
| status: varchar  |
| opened: boolean  |
| to_buy: boolean  |
| opened_date: timestamp |
| created_at: timestamp |
+-----------------+
```

### Shopping_lists
```
+-----------------+
| Shopping_lists  |
+-----------------+
| id: integer (PK) |
| household_id: integer (FK) |
| name: varchar    |
| created_at: timestamp |
+-----------------+
```

### Shopping_list_items
```
+-----------------+
| Shopping_list_items |
+-----------------+
| id: integer (PK) |
| list_id: integer (FK) |
| product_id: integer (FK) |
| status: varchar  |
+-----------------+
```

### Reports
```
+-----------------+
| Reports         |
+-----------------+
| id: integer (PK) |
| household_id: integer (FK) |
| start_date: date |
| unit: varchar    |
| length: integer  |
| spoiled_count: integer |
| details: jsonb (nullable) |
+-----------------+
```

### Images
```
+-----------------+
| Images          |
+-----------------+
| id: integer (PK) |
| product_id: integer (FK) |
| bucket_name: varchar |
| file_path: varchar |
| type: varchar    |
| uploaded_at: timestamp |
+-----------------+
```

### Archived_products
```
+-----------------+
| Archived_products |
+-----------------+
| id: integer (PK) |
| household_id: integer (FK) |
| name: varchar    |
| brand: varchar (nullable) |
| barcode: varchar (nullable, unique) |
| quantity: numeric |
| unit: varchar    |
| expiration_date: date |
| status: varchar  |
| opened: boolean  |
| to_buy: boolean  |
| opened_date: timestamp (nullable) |
| created_at: timestamp |
| main_image_url: varchar (nullable) |
+-----------------+
```
```
+-----------------+
| Archived_products |
+-----------------+
| id: integer (PK) |
| household_id: integer (FK) |
| name: varchar    |
| brand: varchar   |
| barcode: varchar |
| quantity: numeric |
| unit: varchar    |
| expiration_date: date |
| status: varchar  |
| opened: boolean  |
| to_buy: boolean  |
| opened_date: timestamp |
| created_at: timestamp |
+-----------------+
```

### Scans_log
```
+-----------------+
| Scans_log       |
+-----------------+
| id: integer (PK) |
| household_id: integer (FK) |
| operation_type: varchar |
| timestamp: timestamp |
+-----------------+
```

### Analytics_events
```
+-----------------+
| Analytics_events |
+-----------------+
| id: integer (PK) |
| household_id: integer (FK) |
| event_type: varchar |
| timestamp: timestamp |
| data: jsonb (nullable) |
+-----------------+
```
```
+-----------------+
| Analytics_events |
+-----------------+
| id: integer (PK) |
| household_id: integer (FK) |
| event_type: varchar |
| timestamp: timestamp |
| data: jsonb     |
+-----------------+
```

<unresolved_issues>
No unresolved issues – discussion covered all key areas of database planning for MVP.
</unresolved_issues>
</conversation_summary>