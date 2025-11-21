#!/bin/bash
# Smoke test for crew repatriation endpoint using curl

baseUrl="http://localhost:3000"

echo "====== SMOKE TEST: Crew Repatriation Endpoint ======"
echo ""

# Test 1: Invalid crew ID (should return 400)
echo "Test 1: Invalid crew ID (should return 400)"
curl -X POST "$baseUrl/api/crew/invalid/repatriation" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Test"}' \
  -w "\nStatus: %{http_code}\n\n"

# Test 2: Crew not found (should return 404)
echo "Test 2: Crew not found (should return 404)"
curl -X POST "$baseUrl/api/crew/99999/repatriation" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Test"}' \
  -w "\nStatus: %{http_code}\n\n"

# Test 3: Invalid finalAccount (should return 400)
echo "Test 3: Invalid finalAccount (should return 400)"
curl -X POST "$baseUrl/api/crew/1/repatriation" \
  -H "Content-Type: application/json" \
  -d '{"finalAccount":"not-a-number"}' \
  -w "\nStatus: %{http_code}\n\n"

# Test 4: Invalid date format (should return 400)
echo "Test 4: Invalid date format (should return 400)"
curl -X POST "$baseUrl/api/crew/1/repatriation" \
  -H "Content-Type: application/json" \
  -d '{"repatriationDate":"invalid-date"}' \
  -w "\nStatus: %{http_code}\n\n"

echo "====== SMOKE TEST COMPLETE ======"
