# REST API Plan

## 1. Resources

| Resource | Database Table | Purpose |
|----------|---|---------|
| **Households** | households | Represents a household entity for shared account management |
| **Products** | products | Food products in inventory with status tracking and expiration dates |
| **Shopping Lists** | shopping_lists | Named shopping lists for household members |
| **Shopping List Items** | shopping_list_items | Individual items within shopping lists |
| **Reports** | reports | Aggregated food waste reports with flexible time periods |
| **Images** | images | Product images stored in Supabase buckets |
| **Scans Log** | scans_log | Rate limiting records for OCR and barcode operations |
| **Analytics Events** | analytics_events | Anonymous usage analytics events |

---

## 2. Endpoints

### 2.1 Products Resource

#### 2.1.1 Create Product

**POST** `/api/products`

**Description:** Create a new product in the household inventory.

**Authentication:** Required (JWT token from Supabase Auth)

**Request Body:**
```json
{
  "name": "string (required)",
  "brand": "string (optional)",
  "barcode": "string (optional, unique)",
  "quantity": "number (required, > 0)",
  "unit": "string (required: 'kg', 'g', 'l', 'ml', 'pcs')",
  "expiration_date": "date (YYYY-MM-DD, required)",
  "status": "string (optional, default: 'draft', values: 'draft', 'active', 'spoiled')",
  "opened": "boolean (optional, default: false)",
  "to_buy": "boolean (optional, default: false)",
  "opened_date": "timestamp (optional, required if opened=true)",
  "main_image_url": "string (optional)"
}
```

**Response Body (201 Created):**
```json
{
  "id": 1,
  "household_id": 123,
  "name": "Milk",
  "brand": "Dairy Farm",
  "barcode": "1234567890",
  "quantity": 1.0,
  "unit": "l",
  "expiration_date": "2025-11-15",
  "status": "active",
  "opened": false,
  "to_buy": false,
  "opened_date": null,
  "created_at": "2025-10-27T10:30:00Z",
  "main_image_url": "https://storage.example.com/products/1.jpg"
}
```

**Error Codes:**
- `400 Bad Request`: Invalid input data (e.g., negative quantity, invalid date format)
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User does not belong to the household
- `409 Conflict`: Barcode already exists for this household
- `429 Too Many Requests`: Rate limit exceeded

---

#### 2.1.2 Get Product

**GET** `/api/products/{productId}`

**Description:** Retrieve details of a specific product.

**Authentication:** Required

**Query Parameters:** None

**Response Body (200 OK):**
```json
{
  "id": 1,
  "household_id": 123,
  "name": "Milk",
  "brand": "Dairy Farm",
  "barcode": "1234567890",
  "quantity": 1.0,
  "unit": "l",
  "expiration_date": "2025-11-15",
  "status": "active",
  "opened": false,
  "to_buy": false,
  "opened_date": null,
  "created_at": "2025-10-27T10:30:00Z",
  "main_image_url": "https://storage.example.com/products/1.jpg",
  "images": [
    {
      "id": 101,
      "product_id": 1,
      "type": "expiry",
      "signed_url": "https://storage.example.com/signed/expiry_1.jpg?token=...",
      "uploaded_at": "2025-10-27T10:30:00Z"
    }
  ]
}
```

**Error Codes:**
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User does not belong to the product's household
- `404 Not Found`: Product does not exist

---

#### 2.1.3 List Products

**GET** `/api/products`

**Description:** Retrieve a paginated list of products for the household.

**Authentication:** Required

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | integer | Page number (1-indexed) | 1 |
| `limit` | integer | Items per page (1-100) | 20 |
| `status` | string | Filter by status (draft, active, spoiled) | null (all) |
| `opened` | boolean | Filter by opened status | null (all) |
| `to_buy` | boolean | Filter by to_buy status | null (all) |
| `sort_by` | string | Sort field (expiration_date, created_at, name) | expiration_date |
| `sort_order` | string | Sort order (asc, desc) | asc |

**Response Body (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "household_id": 123,
      "name": "Milk",
      "brand": "Dairy Farm",
      "barcode": "1234567890",
      "quantity": 1.0,
      "unit": "l",
      "expiration_date": "2025-11-15",
      "status": "active",
      "opened": false,
      "to_buy": false,
      "opened_date": null,
      "created_at": "2025-10-27T10:30:00Z",
      "main_image_url": "https://storage.example.com/products/1.jpg"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

**Error Codes:**
- `400 Bad Request`: Invalid query parameters
- `401 Unauthorized`: Missing or invalid authentication token

---

#### 2.1.4 Update Product

**PATCH** `/api/products/{productId}`

**Description:** Update a product's details.

**Authentication:** Required

**Request Body:**
```json
{
  "name": "string (optional)",
  "brand": "string (optional)",
  "quantity": "number (optional, > 0)",
  "unit": "string (optional)",
  "expiration_date": "date (optional)",
  "status": "string (optional)",
  "opened": "boolean (optional)",
  "to_buy": "boolean (optional)",
  "opened_date": "timestamp (optional)",
  "main_image_url": "string (optional)"
}
```

**Response Body (200 OK):**
```json
{
  "id": 1,
  "household_id": 123,
  "name": "Milk (Updated)",
  "brand": "Dairy Farm",
  "barcode": "1234567890",
  "quantity": 0.5,
  "unit": "l",
  "expiration_date": "2025-11-15",
  "status": "active",
  "opened": true,
  "to_buy": false,
  "opened_date": "2025-10-27T10:30:00Z",
  "created_at": "2025-10-27T10:30:00Z",
  "main_image_url": "https://storage.example.com/products/1.jpg"
}
```

**Error Codes:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User does not belong to the product's household
- `404 Not Found`: Product does not exist
- `409 Conflict`: Last-write-wins strategy applied (no error, but note timestamp collision detected)

---

#### 2.1.5 Delete Product

**DELETE** `/api/products/{productId}`

**Description:** Remove a product from inventory.

**Authentication:** Required

**Response Body (204 No Content):** Empty

**Error Codes:**
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User does not belong to the product's household
- `404 Not Found`: Product does not exist

---

#### 2.1.6 Mark Product as Spoiled

**POST** `/api/products/{productId}/mark-spoiled`

**Description:** Mark a product as spoiled and create a waste event.

**Authentication:** Required

**Request Body:**
```json
{
  "remove_from_inventory": "boolean (optional, default: true)"
}
```

**Response Body (200 OK):**
```json
{
  "id": 1,
  "household_id": 123,
  "name": "Milk",
  "status": "spoiled",
  "removed": true,
  "event_recorded": true
}
```

**Error Codes:**
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User does not belong to the product's household
- `404 Not Found`: Product does not exist
- `400 Bad Request`: Product already marked as spoiled

---

#### 2.1.7 Mark Product as Opened

**POST** `/api/products/{productId}/mark-opened`

**Description:** Mark a product as opened and record the opening date.

**Authentication:** Required

**Request Body:**
```json
{
  "opened_date": "timestamp (optional, default: now())"
}
```

**Response Body (200 OK):**
```json
{
  "id": 1,
  "household_id": 123,
  "name": "Milk",
  "opened": true,
  "opened_date": "2025-10-27T15:45:00Z"
}
```

**Error Codes:**
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User does not belong to the product's household
- `404 Not Found`: Product does not exist

---

### 2.2 Shopping Lists Resource

#### 2.2.1 Create Shopping List

**POST** `/api/shopping-lists`

**Description:** Create a new named shopping list for the household.

**Authentication:** Required

**Request Body:**
```json
{
  "name": "string (required)"
}
```

**Response Body (201 Created):**
```json
{
  "id": 10,
  "household_id": 123,
  "name": "Weekly Groceries",
  "created_at": "2025-10-27T10:30:00Z"
}
```

**Error Codes:**
- `400 Bad Request`: Missing or invalid name
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User does not belong to the household

---

#### 2.2.2 Get Shopping List

**GET** `/api/shopping-lists/{listId}`

**Description:** Retrieve a shopping list with its items.

**Authentication:** Required

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `include_items` | boolean | Include shopping list items (default: true) |

**Response Body (200 OK):**
```json
{
  "id": 10,
  "household_id": 123,
  "name": "Weekly Groceries",
  "created_at": "2025-10-27T10:30:00Z",
  "items": [
    {
      "id": 50,
      "product_id": 1,
      "status": "to_buy",
      "product": {
        "id": 1,
        "name": "Milk",
        "brand": "Dairy Farm",
        "quantity": 1.0,
        "unit": "l"
      }
    }
  ]
}
```

**Error Codes:**
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User does not belong to the list's household
- `404 Not Found`: Shopping list does not exist

---

#### 2.2.3 List Shopping Lists

**GET** `/api/shopping-lists`

**Description:** Retrieve all shopping lists for the household.

**Authentication:** Required

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | integer | Page number (1-indexed) | 1 |
| `limit` | integer | Items per page (1-100) | 20 |

**Response Body (200 OK):**
```json
{
  "data": [
    {
      "id": 10,
      "household_id": 123,
      "name": "Weekly Groceries",
      "created_at": "2025-10-27T10:30:00Z",
      "item_count": 5
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "pages": 1
  }
}
```

**Error Codes:**
- `400 Bad Request`: Invalid query parameters
- `401 Unauthorized`: Missing or invalid authentication token

---

#### 2.2.4 Update Shopping List

**PATCH** `/api/shopping-lists/{listId}`

**Description:** Update a shopping list name.

**Authentication:** Required

**Request Body:**
```json
{
  "name": "string (required)"
}
```

**Response Body (200 OK):**
```json
{
  "id": 10,
  "household_id": 123,
  "name": "Updated List Name",
  "created_at": "2025-10-27T10:30:00Z"
}
```

**Error Codes:**
- `400 Bad Request`: Invalid name
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User does not belong to the list's household
- `404 Not Found`: Shopping list does not exist

---

#### 2.2.5 Delete Shopping List

**DELETE** `/api/shopping-lists/{listId}`

**Description:** Delete a shopping list and all its items.

**Authentication:** Required

**Response Body (204 No Content):** Empty

**Error Codes:**
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User does not belong to the list's household
- `404 Not Found`: Shopping list does not exist

---

### 2.3 Shopping List Items Resource

#### 2.3.1 Add Item to Shopping List

**POST** `/api/shopping-lists/{listId}/items`

**Description:** Add a product to a shopping list.

**Authentication:** Required

**Request Body:**
```json
{
  "product_id": "integer (required)",
  "status": "string (optional, default: 'to_buy', values: 'to_buy', 'bought')"
}
```

**Response Body (201 Created):**
```json
{
  "id": 50,
  "list_id": 10,
  "product_id": 1,
  "status": "to_buy"
}
```

**Error Codes:**
- `400 Bad Request`: Invalid product_id or status
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User does not belong to the list's household or product's household
- `404 Not Found`: Shopping list or product does not exist
- `409 Conflict`: Product already in shopping list

---

#### 2.3.2 Update Shopping List Item

**PATCH** `/api/shopping-lists/{listId}/items/{itemId}`

**Description:** Update a shopping list item status (mark as bought/to_buy).

**Authentication:** Required

**Request Body:**
```json
{
  "status": "string (required, values: 'to_buy', 'bought')"
}
```

**Response Body (200 OK):**
```json
{
  "id": 50,
  "list_id": 10,
  "product_id": 1,
  "status": "bought"
}
```

**Error Codes:**
- `400 Bad Request`: Invalid status value
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User does not belong to the list's household
- `404 Not Found`: Shopping list item does not exist

---

#### 2.3.3 Remove Item from Shopping List

**DELETE** `/api/shopping-lists/{listId}/items/{itemId}`

**Description:** Remove a product from a shopping list.

**Authentication:** Required

**Response Body (204 No Content):** Empty

**Error Codes:**
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User does not belong to the list's household
- `404 Not Found`: Shopping list item does not exist

---

### 2.4 Reports Resource

#### 2.4.1 Create Report

**POST** `/api/reports`

**Description:** Generate or create a food waste report for a specified time period.

**Authentication:** Required

**Request Body:**
```json
{
  "start_date": "date (YYYY-MM-DD, required)",
  "unit": "string (required, values: 'day', 'week', 'month')",
  "length": "integer (required, > 0)"
}
```

**Response Body (201 Created):**
```json
{
  "id": 5,
  "household_id": 123,
  "start_date": "2025-10-20",
  "unit": "week",
  "length": 1,
  "spoiled_count": 3,
  "details": {
    "products": [
      {
        "id": 1,
        "name": "Milk",
        "spoiled_date": "2025-10-22"
      }
    ]
  }
}
```

**Error Codes:**
- `400 Bad Request`: Invalid date format, unit, or length
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User does not belong to the household

---

#### 2.4.2 Get Report

**GET** `/api/reports/{reportId}`

**Description:** Retrieve a specific food waste report.

**Authentication:** Required

**Response Body (200 OK):**
```json
{
  "id": 5,
  "household_id": 123,
  "start_date": "2025-10-20",
  "unit": "week",
  "length": 1,
  "spoiled_count": 3,
  "details": {
    "products": [
      {
        "id": 1,
        "name": "Milk",
        "brand": "Dairy Farm",
        "spoiled_date": "2025-10-22",
        "quantity": 1.0,
        "unit": "l"
      }
    ]
  }
}
```

**Error Codes:**
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User does not belong to the report's household
- `404 Not Found`: Report does not exist

---

#### 2.4.3 List Reports

**GET** `/api/reports`

**Description:** Retrieve a paginated list of reports for the household.

**Authentication:** Required

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | integer | Page number (1-indexed) | 1 |
| `limit` | integer | Items per page (1-100) | 20 |
| `unit` | string | Filter by period unit (day, week, month) | null |
| `sort_by` | string | Sort field (start_date, spoiled_count) | start_date |
| `sort_order` | string | Sort order (asc, desc) | desc |

**Response Body (200 OK):**
```json
{
  "data": [
    {
      "id": 5,
      "household_id": 123,
      "start_date": "2025-10-20",
      "unit": "week",
      "length": 1,
      "spoiled_count": 3
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "pages": 1
  }
}
```

**Error Codes:**
- `400 Bad Request`: Invalid query parameters
- `401 Unauthorized`: Missing or invalid authentication token

---

#### 2.4.4 Auto-Generate Weekly Report

**POST** `/api/reports/auto-generate-weekly`

**Description:** Automatically generate a weekly report for the current week (internal endpoint, typically called by scheduled task).

**Authentication:** Required (Service role recommended)

**Request Body:** Empty or optional system identifier

**Response Body (201 Created):**
```json
{
  "id": 6,
  "household_id": 123,
  "start_date": "2025-10-20",
  "unit": "week",
  "length": 1,
  "spoiled_count": 2,
  "auto_generated": true
}
```

**Error Codes:**
- `401 Unauthorized`: Missing or invalid authentication token

---

### 2.5 Images Resource

#### 2.5.1 Upload Product Image

**POST** `/api/products/{productId}/images`

**Description:** Upload an image for a product (barcode, product photo, or expiry date).

**Authentication:** Required

**Content-Type:** `multipart/form-data`

**Request Form Data:**
| Field | Type | Description |
|-------|------|-------------|
| `file` | file (binary, ≤ 5MB) | Image file |
| `type` | string (required) | Image type: 'expiry' or 'product' |

**Response Body (201 Created):**
```json
{
  "id": 101,
  "product_id": 1,
  "bucket_name": "expiry-images",
  "file_path": "products/1/expiry_1730000000.jpg",
  "type": "expiry",
  "uploaded_at": "2025-10-27T10:30:00Z",
  "signed_url": "https://storage.example.com/signed/expiry_1730000000.jpg?token=..."
}
```

**Error Codes:**
- `400 Bad Request`: Invalid file format, missing type, or file too large
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User does not belong to the product's household
- `404 Not Found`: Product does not exist
- `413 Payload Too Large`: File exceeds 5MB limit
- `429 Too Many Requests`: Rate limit exceeded

---

#### 2.5.2 Get Image Signed URL

**GET** `/api/products/{productId}/images/{imageId}/signed-url`

**Description:** Get a temporary signed URL for accessing a product image.

**Authentication:** Required

**Query Parameters:** None

**Response Body (200 OK):**
```json
{
  "id": 101,
  "product_id": 1,
  "type": "expiry",
  "signed_url": "https://storage.example.com/signed/expiry_1730000000.jpg?token=...",
  "expires_in": 900,
  "expires_at": "2025-10-27T10:45:00Z"
}
```

**Error Codes:**
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User does not belong to the image's product's household
- `404 Not Found`: Image does not exist

---

#### 2.5.3 Delete Product Image

**DELETE** `/api/products/{productId}/images/{imageId}`

**Description:** Delete an image from a product.

**Authentication:** Required

**Response Body (204 No Content):** Empty

**Error Codes:**
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User does not belong to the image's product's household
- `404 Not Found`: Image does not exist

---

### 2.6 Barcode Scan & OCR Resource

#### 2.6.1 Log Barcode Scan

**POST** `/api/scans/barcode`

**Description:** Log a barcode scan operation for rate limiting and analytics.

**Authentication:** Required

**Request Body:**
```json
{
  "barcode": "string (required)",
  "source": "string (optional, e.g., 'mobile_app', 'web')"
}
```

**Response Body (200 OK):**
```json
{
  "logged": true,
  "rate_limit_remaining": 119,
  "rate_limit_reset_at": "2025-10-27T11:30:00Z"
}
```

**Error Codes:**
- `400 Bad Request`: Invalid barcode format
- `401 Unauthorized`: Missing or invalid authentication token
- `429 Too Many Requests`: Rate limit exceeded (max 120 scans/hour)

---

#### 2.6.2 Log OCR Operation

**POST** `/api/scans/ocr`

**Description:** Log an OCR operation for rate limiting and analytics.

**Authentication:** Required

**Request Body:**
```json
{
  "confidence": "number (0-100, required)",
  "detected_date": "date or null (optional)",
  "source": "string (optional)"
}
```

**Response Body (200 OK):**
```json
{
  "logged": true,
  "rate_limit_remaining": 59,
  "rate_limit_reset_at": "2025-10-27T11:30:00Z"
}
```

**Error Codes:**
- `400 Bad Request`: Invalid confidence value
- `401 Unauthorized`: Missing or invalid authentication token
- `429 Too Many Requests`: Rate limit exceeded (max 60 OCR operations/hour)

---

### 2.7 Analytics Resource

#### 2.7.1 Track Analytics Event

**POST** `/api/analytics/events`

**Description:** Log an anonymous analytics event.

**Authentication:** Required

**Request Body:**
```json
{
  "event_type": "string (required, e.g., 'product_added', 'product_spoiled', 'ocr_success')",
  "data": "object (optional, additional event-specific data)"
}
```

**Response Body (202 Accepted):**
```json
{
  "event_id": 1001,
  "event_type": "product_added",
  "household_id": 123,
  "timestamp": "2025-10-27T10:30:00Z",
  "recorded": true
}
```

**Error Codes:**
- `400 Bad Request`: Invalid event_type
- `401 Unauthorized`: Missing or invalid authentication token

---

#### 2.7.2 Get Analytics Summary

**GET** `/api/analytics/summary`

**Description:** Retrieve anonymized usage analytics for the household (admin access).

**Authentication:** Required (Admin role or service role)

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `period` | string | Time period (day, week, month) | week |
| `event_types` | string | Comma-separated event types to filter | null (all) |

**Response Body (200 OK):**
```json
{
  "household_id": 123,
  "period": "week",
  "start_date": "2025-10-20",
  "end_date": "2025-10-27",
  "events": {
    "product_added": 10,
    "product_spoiled": 2,
    "ocr_success": 8,
    "barcode_scan_success": 5
  }
}
```

**Error Codes:**
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Insufficient permissions

---

### 2.8 Households Resource

#### 2.8.1 Get Household Info

**GET** `/api/households/{householdId}`

**Description:** Retrieve household information.

**Authentication:** Required

**Response Body (200 OK):**
```json
{
  "id": 123,
  "name": "Smith Family",
  "created_at": "2025-10-01T08:00:00Z",
  "members_count": 2,
  "product_count": 45
}
```

**Error Codes:**
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User does not belong to the household
- `404 Not Found`: Household does not exist

---

#### 2.8.2 Update Household Info

**PATCH** `/api/households/{householdId}`

**Description:** Update household name and settings.

**Authentication:** Required

**Request Body:**
```json
{
  "name": "string (optional)",
  "timezone": "string (optional, IANA timezone)"
}
```

**Response Body (200 OK):**
```json
{
  "id": 123,
  "name": "Updated Family Name",
  "timezone": "Europe/Warsaw",
  "created_at": "2025-10-01T08:00:00Z"
}
```

**Error Codes:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User does not belong to the household
- `404 Not Found`: Household does not exist

---

## 3. Authentication and Authorization

### 3.1 Authentication Mechanism

**Type:** JWT (JSON Web Token) via Supabase Auth

**Implementation:**
- Users authenticate via email/password through Supabase Auth endpoints
- Supabase generates a JWT token upon successful authentication
- JWT token is included in the `Authorization: Bearer <token>` header for all API requests
- Token validation is performed by Supabase middleware on every request

### 3.2 Authorization Mechanism

**Strategy:** Row-Level Security (RLS) + Application-Level Checks

**Implementation:**
1. **Database Level:** PostgreSQL RLS policies enforce that users can only access data from their assigned household
2. **Application Level:**
   - `household_id` is extracted from the JWT context and verified against request parameters
   - All household-scoped queries filter by `household_id IN (SELECT household_id FROM user_households WHERE user_id = auth.uid())`
   - Mid-tier validation ensures user belongs to the resource's household before performing operations

### 3.3 Account Sharing

- One household account shared among multiple users via Supabase Auth
- The `user_households` table maps Supabase users to households
- Any user in the household can perform CRUD operations on household data
- No role-based access control (RBAC) in MVP; all users have equal permissions within a household

### 3.4 Token Management

- Token issued upon login with Supabase Auth
- Default token expiration: 1 hour (configurable)
- Refresh tokens available for extended sessions
- Token revocation handled by Supabase (logout)

---

## 4. Validation and Business Logic

### 4.1 Product Validation

| Field | Validation Rule | Error Message |
|-------|-----------------|---------------|
| `name` | Required, non-empty string (1-255 chars) | "Product name is required" |
| `barcode` | Optional, unique per household | "Barcode already exists for this household" |
| `quantity` | Required, numeric > 0 | "Quantity must be greater than 0" |
| `unit` | Required, must be one of: kg, g, l, ml, pcs | "Invalid unit of measurement" |
| `expiration_date` | Required, ISO 8601 date (YYYY-MM-DD) | "Invalid expiration date format" |
| `status` | Optional (default: active), must be: draft, active, spoiled | "Invalid product status" |
| `opened` | Optional boolean (default: false) | N/A |
| `opened_date` | Required if `opened=true`, ISO 8601 timestamp | "Opened date required when product is marked as opened" |

### 4.2 Shopping List Validation

| Field | Validation Rule | Error Message |
|-------|-----------------|---------------|
| `name` | Required, non-empty string (1-255 chars) | "Shopping list name is required" |

### 4.3 Report Validation

| Field | Validation Rule | Error Message |
|-------|-----------------|---------------|
| `start_date` | Required, ISO 8601 date (YYYY-MM-DD), not in future | "Invalid start date" |
| `unit` | Required, must be: day, week, month | "Invalid reporting period unit" |
| `length` | Required, integer > 0 | "Period length must be greater than 0" |

### 4.4 Image Validation

| Field | Validation Rule | Error Message |
|-------|-----------------|---------------|
| `file` | Required, max 5MB, JPEG/PNG only | "File must be JPEG or PNG, max 5MB" |
| `type` | Required, must be: expiry, product | "Invalid image type" |

### 4.5 Business Logic Implementation

#### 4.5.1 Product Lifecycle

1. **Draft Status:** Product added but not yet confirmed in inventory
2. **Active Status:** Product is in active inventory
3. **Spoiled Status:** Product marked as waste; triggers report entry

#### 4.5.2 Expiration Tracking

- Products are sorted by `expiration_date` ascending by default
- Notifications triggered for products expiring within 3 and 1 day
- Additional alerts for opened products > 3 days old

#### 4.5.3 Shopping List Integration

- Products marked with `to_buy=true` appear in shopping lists
- Items move from "to_buy" to "bought" status when user marks them purchased
- Bought items transition to draft state for later inventory addition

#### 4.5.4 Waste Reporting

- When product marked as `spoiled`, an entry is automatically added to weekly report
- Weekly reports generated once per week (Sunday) with aggregated spoiled product count
- Monthly and yearly reports generated on-demand by aggregating weekly data

#### 4.5.5 Rate Limiting

**Barcode Scans:** Max 120 per hour per household
**OCR Operations:** Max 60 per hour per household
**Image Uploads:** Max 100 per day per household
**Recipe Generation:** Max 5 per day per household (P2 feature)

Rate limit checks performed via `scans_log` table; tracking timestamps to enforce rolling windows.

#### 4.5.6 Image Management

**Expiry Images:**
- Stored in private `expiry-images` bucket
- Auto-deleted after 100 days via scheduled task
- Accessed via signed URLs (15-minute validity, re-generated on each request)
- EXIF/metadata stripped during upload

**Product Images:**
- Stored in public `product-images` bucket (neutral packaging only)
- Retained indefinitely
- Accessible via direct URLs

#### 4.5.7 Concurrent Edit Handling

- Last-write-wins strategy: final update timestamp determines persistence
- Conflict detection via timestamp comparison; alert user on collision
- No manual conflict resolution required; backend logs collision event

#### 4.5.8 Analytics Event Recording

Events recorded asynchronously; 15-second batch insert for performance:
- `product_added`
- `product_removed`
- `product_spoiled`
- `barcode_scan_success`
- `barcode_scan_fail`
- `ocr_attempt`
- `ocr_success` (with confidence bucket: <50, 50-79, 80-89, 90+)
- `notification_sent`
- `notification_clicked`
- `digest_email_sent`
- `spoiled_report_generated`

Events are anonymous (linked only by household_id, not user-specific).

---

## 5. Error Handling

### 5.1 Global Error Response Format

**All errors return JSON with the following structure:**

```json
{
  "error": {
    "code": "string (machine-readable error code)",
    "message": "string (human-readable error message)",
    "details": "object (optional, additional context)",
    "timestamp": "ISO 8601 timestamp"
  }
}
```

### 5.2 Common HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| `200 OK` | Request successful, data returned | GET product details |
| `201 Created` | Resource created successfully | POST new product |
| `202 Accepted` | Request accepted for async processing | POST analytics event |
| `204 No Content` | Request successful, no data returned | DELETE product |
| `400 Bad Request` | Invalid input data or query parameters | Invalid date format |
| `401 Unauthorized` | Missing or invalid authentication token | Expired JWT |
| `403 Forbidden` | Authenticated but not authorized for resource | User from different household |
| `404 Not Found` | Resource does not exist | GET non-existent product |
| `409 Conflict` | Conflict with existing data | Duplicate barcode |
| `413 Payload Too Large` | Request body or file exceeds limit | Image > 5MB |
| `429 Too Many Requests` | Rate limit exceeded | 120+ barcode scans/hour |
| `500 Internal Server Error` | Unexpected server error | Database connection failure |
| `503 Service Unavailable` | Service temporarily down | Supabase maintenance |

### 5.3 Error Example

```json
{
  "error": {
    "code": "PRODUCT_BARCODE_DUPLICATE",
    "message": "A product with this barcode already exists in your household",
    "details": {
      "existing_product_id": 42,
      "barcode": "1234567890"
    },
    "timestamp": "2025-10-27T10:30:00Z"
  }
}
```

---

## 6. Pagination

### 6.1 Pagination Strategy

**Type:** Offset-based pagination

**Parameters:**
- `page` (1-indexed): Page number starting from 1
- `limit` (1-100): Items per page; default 20

### 6.2 Pagination Response

All list endpoints return a standardized pagination object:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

---

## 7. Filtering, Sorting, and Search

### 7.1 Filtering

Filters applied via query parameters (e.g., `?status=active&opened=false`)

**Supported Filters:**
- **Products:** status, opened, to_buy, brand
- **Reports:** unit (day/week/month)
- **Shopping Lists:** (none; typically filtered by household)

### 7.2 Sorting

Sorting controlled via `sort_by` and `sort_order` query parameters

**Supported Sort Fields:**
- **Products:** expiration_date (default), created_at, name, quantity
- **Reports:** start_date (default), spoiled_count

---

## 8. Rate Limiting

### 8.1 Rate Limit Headers

All responses include rate limit information:

```
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2025-10-27T11:30:00Z
```

### 8.2 Enforced Limits

| Operation | Limit | Window |
|-----------|-------|--------|
| Barcode Scans | 120 | per hour |
| OCR Operations | 60 | per hour |
| Image Uploads | 100 | per day |
| General API Requests | 1000 | per hour |

---

## 9. Caching Strategy

### 9.1 Cache Headers

- **Short-lived data** (products list): Cache-Control: max-age=300 (5 minutes)
- **Static data** (household info): Cache-Control: max-age=3600 (1 hour)
- **Signed URLs** (images): Cache-Control: max-age=900 (15 minutes)
- **List endpoints**: Vary: Authorization, User-Agent

### 9.2 Cache Invalidation

Caches invalidated on:
- Product status changes (draft → active → spoiled)
- Product deletion or creation
- Shopping list updates
- Report generation

---

## 10. Versioning Strategy

**Current Version:** v1 (no versioning in URLs for MVP)

**Future Versioning:** URL-based versioning `/api/v2/products` (if needed for breaking changes)

---

## 11. Documentation Standards

### 11.1 API Documentation

- OpenAPI 3.0 specification generated from code annotations
- Interactive Swagger UI available at `/api/docs`
- Postman collection provided for testing

### 11.2 SDK & Client Libraries

- TypeScript client auto-generated from OpenAPI spec
- Astro/React integration helpers provided in `src/lib` directory

---

## 12. Security Considerations

### 12.1 HTTPS

- All API endpoints require HTTPS (enforced in production)
- Certificates managed by hosting provider

### 12.2 CORS

- CORS enabled for frontend domain only
- Credentials included in requests (sameSite: Lax)

### 12.3 Input Validation

- All inputs validated server-side (client-side validation is supplementary)
- SQL injection prevented via parameterized queries and ORM
- XSS prevention via output encoding

### 12.4 Data Protection

- Sensitive data (images, dates) protected by RLS
- Signed URLs for time-limited image access
- Rate limiting prevents abuse

### 12.5 Logging & Monitoring

- All API requests logged with timestamp, user ID, endpoint, status code
- Errors logged with full context for debugging
- Sensitive data (passwords, tokens) excluded from logs

---

## 13. API Client Usage Examples

### 13.1 TypeScript/React Example (via Astro)

```typescript
// Add a product
const response = await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Milk',
    quantity: 1,
    unit: 'l',
    expiration_date: '2025-11-15'
  })
});

const product = await response.json();
```

### 13.2 Service Worker Integration

Push notifications triggered via `/api/products?sort_by=expiration_date&limit=5` to fetch upcoming expirations.

---

## 14. Deployment and Infrastructure

### 14.1 API Hosting

- Hosted on DigitalOcean via Docker container
- Load balanced via Nginx
- Database: Supabase PostgreSQL (managed)
- Storage: Supabase S3-compatible buckets

### 14.1 API Lifecycle

- Blue-green deployments for zero downtime
- Automated testing via CI/CD (GitHub Actions)
- Monitoring via Sentry and custom dashboards

---

## 15. Future Enhancements (P1/P2)

1. **Webhooks:** Notify external services on product status changes
2. **GraphQL API:** Alternative to REST for complex queries
3. **Batch Operations:** Add/update multiple products in single request
4. **Advanced Filtering:** Full-text search on product names
5. **Recipe Generation Integration:** Connect to OpenRouter.ai
6. **Offline Support:** Service Worker queue for offline product additions
7. **Export:** CSV/PDF report exports
8. **API Keys:** Service-to-service authentication for integrations

---

## Appendix: Schema-to-API Mapping

| Database Table | Primary Endpoints |
|---|---|
| households | GET/PATCH /api/households/{householdId} |
| products | POST/GET/PATCH/DELETE /api/products[/{productId}] |
| shopping_lists | POST/GET/PATCH/DELETE /api/shopping-lists[/{listId}] |
| shopping_list_items | POST/PATCH/DELETE /api/shopping-lists/{listId}/items[/{itemId}] |
| reports | POST/GET /api/reports[/{reportId}] |
| images | POST/GET/DELETE /api/products/{productId}/images[/{imageId}] |
| scans_log | POST /api/scans/{operation} |
| analytics_events | POST /api/analytics/events |
