#!/bin/bash

# Test script for POST /api/products endpoint
# Make sure the dev server is running: npm run dev
# And Supabase is running: bash scripts/start-supabase.sh

# Load test user credentials from .env.local
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

if [ -z "$TEST_USER_EMAIL" ] || [ -z "$TEST_USER_PASSWORD" ]; then
  echo "Error: TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in .env.local"
  exit 1
fi

# Get Supabase ANON_KEY
ANON_KEY=$(supabase status -o env 2>/dev/null | grep ANON_KEY | cut -d'=' -f2 | tr -d '"')

if [ -z "$ANON_KEY" ]; then
  echo "Error: Could not get Supabase ANON_KEY. Make sure Supabase is running (bash scripts/start-supabase.sh)"
  exit 1
fi

# Login and get JWT token
echo "Logging in as ${TEST_USER_EMAIL}..."
LOGIN_RESPONSE=$(curl -s -X POST http://127.0.0.1:54321/auth/v1/token?grant_type=password \
  -H "Content-Type: application/json" \
  -H "apikey: ${ANON_KEY}" \
  -d "{\"email\": \"${TEST_USER_EMAIL}\", \"password\": \"${TEST_USER_PASSWORD}\"}")

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "Error: Could not get access token. Response:"
  echo $LOGIN_RESPONSE
  exit 1
fi

echo "Successfully logged in!"
echo ""

BASE_URL="http://localhost:3000"
ENDPOINT="${BASE_URL}/api/products"

echo "=========================================="
echo "Testing POST /api/products endpoint"
echo "=========================================="
echo ""

# Test 1: Successful product creation with all required fields
echo "Test 1: Valid product creation (minimal required fields)"
echo "--------------------------------------------------"
curl -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Organic Milk",
    "quantity": 1.0,
    "unit": "l",
    "expiration_date": "2025-12-15"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

# Test 2: Product creation with all optional fields
echo "Test 2: Valid product creation (all fields)"
echo "--------------------------------------------------"
curl -X POST "${ENDPOINT}" \
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
  -w "\nHTTP Status: %{http_code}\n\n"

# Test 3: Product with opened status and opened_date
echo "Test 3: Product with opened=true and opened_date"
echo "--------------------------------------------------"
curl -X POST "${ENDPOINT}" \
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
  -w "\nHTTP Status: %{http_code}\n\n"

# Test 4: Different units
echo "Test 4: Product with different units (kg)"
echo "--------------------------------------------------"
curl -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Rice",
    "brand": "Golden Grain",
    "quantity": 2.5,
    "unit": "kg",
    "expiration_date": "2026-06-01"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "Test 5: Product with pcs unit"
echo "--------------------------------------------------"
curl -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Eggs",
    "quantity": 12,
    "unit": "pcs",
    "expiration_date": "2025-11-20"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

# Test 6: Product with to_buy flag
echo "Test 6: Product with to_buy flag"
echo "--------------------------------------------------"
curl -X POST "${ENDPOINT}" \
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
  -w "\nHTTP Status: %{http_code}\n\n"

# Test 7: Draft status product
echo "Test 7: Product with draft status"
echo "--------------------------------------------------"
curl -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Apple Juice",
    "quantity": 1,
    "unit": "l",
    "expiration_date": "2025-11-30",
    "status": "draft"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "=========================================="
echo "Error Scenarios"
echo "=========================================="
echo ""

# Test 8: Missing authorization header (401)
echo "Test 8: Missing authorization header (401)"
echo "--------------------------------------------------"
curl -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "quantity": 1,
    "unit": "pcs",
    "expiration_date": "2025-12-01"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

# Test 9: Invalid token (401)
echo "Test 9: Invalid token (401)"
echo "--------------------------------------------------"
curl -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer invalid_token_here" \
  -d '{
    "name": "Test Product",
    "quantity": 1,
    "unit": "pcs",
    "expiration_date": "2025-12-01"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

# Test 10: Missing required field - name (400)
echo "Test 10: Missing required field - name (400)"
echo "--------------------------------------------------"
curl -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "quantity": 1,
    "unit": "pcs",
    "expiration_date": "2025-12-01"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

# Test 11: Missing required field - quantity (400)
echo "Test 11: Missing required field - quantity (400)"
echo "--------------------------------------------------"
curl -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Test Product",
    "unit": "pcs",
    "expiration_date": "2025-12-01"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

# Test 12: Invalid unit value (400)
echo "Test 12: Invalid unit value (400)"
echo "--------------------------------------------------"
curl -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Test Product",
    "quantity": 1,
    "unit": "invalid_unit",
    "expiration_date": "2025-12-01"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

# Test 13: Invalid status value (400)
echo "Test 13: Invalid status value (400)"
echo "--------------------------------------------------"
curl -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Test Product",
    "quantity": 1,
    "unit": "pcs",
    "expiration_date": "2025-12-01",
    "status": "invalid_status"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

# Test 14: Negative quantity (400)
echo "Test 14: Negative quantity (400)"
echo "--------------------------------------------------"
curl -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Test Product",
    "quantity": -5,
    "unit": "pcs",
    "expiration_date": "2025-12-01"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

# Test 15: Zero quantity (400)
echo "Test 15: Zero quantity (400)"
echo "--------------------------------------------------"
curl -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Test Product",
    "quantity": 0,
    "unit": "pcs",
    "expiration_date": "2025-12-01"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

# Test 16: Invalid date format (400)
echo "Test 16: Invalid date format (400)"
echo "--------------------------------------------------"
curl -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Test Product",
    "quantity": 1,
    "unit": "pcs",
    "expiration_date": "2025/12/01"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

# Test 17: Name too long (400)
echo "Test 17: Name too long - over 255 characters (400)"
echo "--------------------------------------------------"
curl -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "This is a very long product name that exceeds the maximum allowed length of 255 characters. It should trigger a validation error because the database schema and validation rules enforce this limit. Adding more text to make sure we definitely exceed 255 chars...",
    "quantity": 1,
    "unit": "pcs",
    "expiration_date": "2025-12-01"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

# Test 18: opened=true but missing opened_date (400)
echo "Test 18: opened=true but missing opened_date (400)"
echo "--------------------------------------------------"
curl -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "name": "Opened Product",
    "quantity": 1,
    "unit": "pcs",
    "expiration_date": "2025-12-01",
    "opened": true
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

# Test 19: Invalid opened_date format (400)
echo "Test 19: Invalid opened_date format (400)"
echo "--------------------------------------------------"
curl -X POST "${ENDPOINT}" \
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
  -w "\nHTTP Status: %{http_code}\n\n"

# Test 20: Duplicate barcode (409) - Run twice to test conflict
echo "Test 20a: First product with barcode (should succeed)"
echo "--------------------------------------------------"
UNIQUE_BARCODE="TEST$(date +%s)"
curl -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d "{
    \"name\": \"First Product\",
    \"barcode\": \"${UNIQUE_BARCODE}\",
    \"quantity\": 1,
    \"unit\": \"pcs\",
    \"expiration_date\": \"2025-12-01\"
  }" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "Test 20b: Duplicate barcode (409)"
echo "--------------------------------------------------"
curl -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d "{
    \"name\": \"Duplicate Barcode Product\",
    \"barcode\": \"${UNIQUE_BARCODE}\",
    \"quantity\": 1,
    \"unit\": \"pcs\",
    \"expiration_date\": \"2025-12-01\"
  }" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "=========================================="
echo "Test suite completed!"
echo "=========================================="
