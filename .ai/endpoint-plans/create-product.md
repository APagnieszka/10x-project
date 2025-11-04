# API Endpoint Implementation Plan: Create Product

## 1. Endpoint Overview
This endpoint allows authenticated users to create a new product in their household's inventory. It validates input data, ensures barcode uniqueness within the household, and returns the created product with all details including generated ID and timestamps.

## 2. Request Details
- **HTTP Method:** POST
- **URL Structure:** `/api/products`
- **Parameters:**
  - Required: None (all in body)
  - Optional: None
- **Request Body:**
  ```json
  {
    "name": "string (required, 1-255 chars)",
    "brand": "string (optional)",
    "barcode": "string (optional, unique per household)",
    "quantity": "number (required, > 0)",
    "unit": "string (required: 'kg', 'g', 'l', 'ml', 'pcs')",
    "expiration_date": "string (required, YYYY-MM-DD format)",
    "status": "string (optional, default: 'draft', values: 'draft', 'active', 'spoiled')",
    "opened": "boolean (optional, default: false)",
    "to_buy": "boolean (optional, default: false)",
    "opened_date": "string (optional, ISO 8601 timestamp, required if opened=true)",
    "main_image_url": "string (optional)"
  }
  ```

## 3. Used Types
- **CreateProductCommand:** From `src/types.ts` - input validation and command object
- **ProductDto:** From `src/types.ts` - response object including potential images array
- **Database Types:** `Products` interface from `src/db/database.types.ts` for database operations

## 4. Response Details
- **Success (201 Created):**
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
- **Error Responses:** As specified in API plan (400, 401, 403, 409, 429, 500)

## 5. Data Flow
1. **Authentication:** JWT token validated by Supabase middleware
2. **Household Extraction:** Extract household_id from user context via user_households table
3. **Input Validation:** Validate request body using Zod schema
4. **Business Logic Validation:** Check barcode uniqueness, conditional opened_date
5. **Database Insertion:** Insert into products table with household_id
6. **Response:** Return created product with generated fields

## 6. Security Considerations
- **Authentication:** JWT token required, validated by Supabase
- **Authorization:** RLS policies ensure users can only create products in their household
- **Input Validation:** Comprehensive validation prevents malicious data
- **Rate Limiting:** Implement per household/user limits to prevent abuse
- **Data Sanitization:** All inputs sanitized through Zod and TypeScript types

## 7. Error Handling
- **400 Bad Request:** Invalid input data (validation errors with detailed messages)
- **401 Unauthorized:** Missing or invalid JWT token
- **403 Forbidden:** User not member of household
- **409 Conflict:** Barcode already exists for household
- **429 Too Many Requests:** Rate limit exceeded
- **500 Internal Server Error:** Database errors or unexpected failures (logged)

## 8. Performance Considerations
- **Database Indexes:** Ensure indexes on household_id, barcode for fast lookups
- **Connection Pooling:** Supabase handles connection pooling
- **Caching:** No caching needed for create operations
- **Rate Limiting:** Implement efficient rate limiting (Redis or in-memory per household)

## 9. Implementation Steps
1. Create Zod validation schema in `src/lib/validation/products.ts`
2. Create `src/lib/services/products.service.ts` with createProduct method
3. Implement API endpoint in `src/pages/api/products.ts` using Astro API routes
4. Add middleware for household_id extraction from JWT context
5. Implement rate limiting logic
6. Add comprehensive error handling and logging
7. Test endpoint with various scenarios (valid/invalid inputs, auth failures)
8. Update API documentation if needed

## 10. Dependencies
- Supabase client from `src/db/supabase.client.ts`
- Zod for validation
- Existing types from `src/types.ts`
- Astro API route structure

## 11. Testing Strategy
- Unit tests for validation schema
- Unit tests for service methods
- Integration tests for full endpoint
- Test edge cases: barcode conflicts, invalid dates, auth failures
- Load testing for rate limits