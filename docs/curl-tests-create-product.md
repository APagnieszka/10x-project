# cURL Tests for POST /api/products

## Setup

First, get your JWT token (recommended: run the helper script that logs in and executes requests):

1. Create `.env.e2e.local` (never commit secrets):

  ```bash
  cp .env.e2e.example .env.e2e.local
  ```

2. Fill `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_KEY`, `TEST_USER_EMAIL`, `TEST_USER_PASSWORD`.
3. Run:

  ```bash
  bash test-create-product.sh
  ```

Or set `TOKEN` manually (if you already have it):
```bash
TOKEN="your_jwt_token_here"
```

Base URL (adjust if needed):
```bash
BASE_URL="http://localhost:4321"
```

---

## Success Test Cases

### Test 1: Minimal Required Fields
```bash
curl -X POST "${BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Organic Milk",
    "quantity": 1.0,
    "unit": "l",
    "expiration_date": "2025-12-15"
  }' \
  -w "\nStatus: %{http_code}\n"
```

**Expected:** 201 Created with product details

---

### Test 2: All Fields Included
```bash
curl -X POST "${BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Premium Butter",
    "brand": "Dairy Best",
    "barcode": "9876543210",
    "quantity": 250,
    "unit": "g",
    "expiration_date": "2025-12-20",
    "status": "active",
    "opened": false,
    "to_buy": false,
    "main_image_url": "https://example.com/butter.jpg"
  }' \
  -w "\nStatus: %{http_code}\n"
```

**Expected:** 201 Created with all fields populated

---

### Test 3: Opened Product with opened_date
```bash
curl -X POST "${BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Yogurt",
    "brand": "Bio Natural",
    "quantity": 500,
    "unit": "g",
    "expiration_date": "2025-11-10",
    "status": "active",
    "opened": true,
    "opened_date": "2025-11-04T10:00:00Z"
  }' \
  -w "\nStatus: %{http_code}\n"
```

**Expected:** 201 Created

---

### Test 4: Different Units - Kilograms
```bash
curl -X POST "${BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Rice",
    "brand": "Golden Grain",
    "quantity": 2.5,
    "unit": "kg",
    "expiration_date": "2026-06-01"
  }' \
  -w "\nStatus: %{http_code}\n"
```

**Expected:** 201 Created

---

### Test 5: Pieces Unit
```bash
curl -X POST "${BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Eggs",
    "quantity": 12,
    "unit": "pcs",
    "expiration_date": "2025-11-20"
  }' \
  -w "\nStatus: %{http_code}\n"
```

**Expected:** 201 Created

---

### Test 6: Product with to_buy Flag
```bash
curl -X POST "${BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Coffee",
    "brand": "Premium Roast",
    "quantity": 500,
    "unit": "g",
    "expiration_date": "2026-01-01",
    "to_buy": true
  }' \
  -w "\nStatus: %{http_code}\n"
```

**Expected:** 201 Created

---

### Test 7: Draft Status
```bash
curl -X POST "${BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Apple Juice",
    "quantity": 1,
    "unit": "l",
    "expiration_date": "2025-11-30",
    "status": "draft"
  }' \
  -w "\nStatus: %{http_code}\n"
```

**Expected:** 201 Created

---

### Test 8: Milliliters Unit
```bash
curl -X POST "${BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Vanilla Extract",
    "quantity": 50,
    "unit": "ml",
    "expiration_date": "2026-12-31"
  }' \
  -w "\nStatus: %{http_code}\n"
```

**Expected:** 201 Created

---

## Error Test Cases

### Test 9: Missing Authorization (401)
```bash
curl -X POST "${BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "quantity": 1,
    "unit": "pcs",
    "expiration_date": "2025-12-01"
  }' \
  -w "\nStatus: %{http_code}\n"
```

**Expected:** 401 Unauthorized

---

### Test 10: Invalid Token (401)
```bash
curl -X POST "${BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer invalid_token" \
  -d '{
    "name": "Test Product",
    "quantity": 1,
    "unit": "pcs",
    "expiration_date": "2025-12-01"
  }' \
  -w "\nStatus: %{http_code}\n"
```

**Expected:** 401 Unauthorized

---

### Test 11: Missing Required Field - name (400)
```bash
curl -X POST "${BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "quantity": 1,
    "unit": "pcs",
    "expiration_date": "2025-12-01"
  }' \
  -w "\nStatus: %{http_code}\n"
```

**Expected:** 400 Bad Request - Validation error for missing name

---

### Test 12: Missing Required Field - quantity (400)
```bash
curl -X POST "${BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Test Product",
    "unit": "pcs",
    "expiration_date": "2025-12-01"
  }' \
  -w "\nStatus: %{http_code}\n"
```

**Expected:** 400 Bad Request - Validation error for missing quantity

---

### Test 13: Invalid Unit (400)
```bash
curl -X POST "${BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Test Product",
    "quantity": 1,
    "unit": "pounds",
    "expiration_date": "2025-12-01"
  }' \
  -w "\nStatus: %{http_code}\n"
```

**Expected:** 400 Bad Request - Invalid enum value

---

### Test 14: Invalid Status (400)
```bash
curl -X POST "${BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Test Product",
    "quantity": 1,
    "unit": "pcs",
    "expiration_date": "2025-12-01",
    "status": "expired"
  }' \
  -w "\nStatus: %{http_code}\n"
```

**Expected:** 400 Bad Request - Invalid enum value

---

### Test 15: Negative Quantity (400)
```bash
curl -X POST "${BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Test Product",
    "quantity": -5,
    "unit": "pcs",
    "expiration_date": "2025-12-01"
  }' \
  -w "\nStatus: %{http_code}\n"
```

**Expected:** 400 Bad Request - Quantity must be positive

---

### Test 16: Zero Quantity (400)
```bash
curl -X POST "${BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Test Product",
    "quantity": 0,
    "unit": "pcs",
    "expiration_date": "2025-12-01"
  }' \
  -w "\nStatus: %{http_code}\n"
```

**Expected:** 400 Bad Request - Quantity must be positive

---

### Test 17: Invalid Date Format (400)
```bash
curl -X POST "${BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Test Product",
    "quantity": 1,
    "unit": "pcs",
    "expiration_date": "12/01/2025"
  }' \
  -w "\nStatus: %{http_code}\n"
```

**Expected:** 400 Bad Request - Invalid date format (must be YYYY-MM-DD)

---

### Test 18: Name Too Long (400)
```bash
curl -X POST "${BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "'"$(printf 'A%.0s' {1..300})"'",
    "quantity": 1,
    "unit": "pcs",
    "expiration_date": "2025-12-01"
  }' \
  -w "\nStatus: %{http_code}\n"
```

**Expected:** 400 Bad Request - Name exceeds 255 characters

---

### Test 19: opened=true Without opened_date (400)
```bash
curl -X POST "${BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Opened Product",
    "quantity": 1,
    "unit": "pcs",
    "expiration_date": "2025-12-01",
    "opened": true
  }' \
  -w "\nStatus: %{http_code}\n"
```

**Expected:** 400 Bad Request - opened_date required when opened is true

---

### Test 20: Invalid opened_date Format (400)
```bash
curl -X POST "${BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Opened Product",
    "quantity": 1,
    "unit": "pcs",
    "expiration_date": "2025-12-01",
    "opened": true,
    "opened_date": "2025-11-04"
  }' \
  -w "\nStatus: %{http_code}\n"
```

**Expected:** 400 Bad Request - opened_date must be ISO 8601 timestamp

---

### Test 21: Duplicate Barcode (409)

First, create a product with a barcode:
```bash
curl -X POST "${BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Original Product",
    "barcode": "DUPLICATE_TEST_123",
    "quantity": 1,
    "unit": "pcs",
    "expiration_date": "2025-12-01"
  }' \
  -w "\nStatus: %{http_code}\n"
```

Then try to create another with the same barcode:
```bash
curl -X POST "${BASE_URL}/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Duplicate Barcode Product",
    "barcode": "DUPLICATE_TEST_123",
    "quantity": 1,
    "unit": "pcs",
    "expiration_date": "2025-12-01"
  }' \
  -w "\nStatus: %{http_code}\n"
```

**Expected:** 409 Conflict - Barcode already exists

---

## Quick Test Commands

### Run all tests
```bash
bash test-create-product.sh
```

### Simple valid product
```bash
curl -X POST http://localhost:4321/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(bash scripts/get-anon-key.sh)" \
  -d '{"name":"Quick Test","quantity":1,"unit":"pcs","expiration_date":"2025-12-01"}' \
  -w "\nStatus: %{http_code}\n"
```

### Check response with verbose output
```bash
curl -v -X POST http://localhost:4321/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(bash scripts/get-anon-key.sh)" \
  -d '{"name":"Verbose Test","quantity":1,"unit":"pcs","expiration_date":"2025-12-01"}'
```

### Pretty print JSON response (requires jq)
```bash
curl -s -X POST http://localhost:4321/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(bash scripts/get-anon-key.sh)" \
  -d '{"name":"Pretty Test","quantity":1,"unit":"pcs","expiration_date":"2025-12-01"}' \
  | jq '.'
```
