# Smoke test for crew repatriation endpoint
$baseUrl = "http://localhost:3000"

Write-Host "====== SMOKE TEST: Crew Repatriation Endpoint ======" -ForegroundColor Green
Write-Host ""

# Test 1: Invalid crew ID (should return 400)
Write-Host "Test 1: Invalid crew ID (should return 400)" -ForegroundColor Cyan
try {
  $resp = Invoke-WebRequest -Uri "$baseUrl/api/crew/invalid/repatriation" -Method POST -ContentType "application/json" -Body '{"reason":"Test"}' -ErrorAction Stop
  Write-Host "Status: $($resp.StatusCode)" -ForegroundColor Yellow
  Write-Host "Body: $($resp.Content)" -ForegroundColor Yellow
} catch {
  $statusCode = $_.Exception.Response.StatusCode.Value__
  $body = $_.Exception.Response.Content.ReadAsStringAsync().Result | ConvertFrom-Json
  Write-Host "Status: $statusCode" -ForegroundColor Green
  Write-Host "Error: $($body.error)" -ForegroundColor Green
}
Write-Host ""

# Test 2: Crew not found (should return 404)
Write-Host "Test 2: Crew not found (should return 404)" -ForegroundColor Cyan
try {
  $resp = Invoke-WebRequest -Uri "$baseUrl/api/crew/99999/repatriation" -Method POST -ContentType "application/json" -Body '{"reason":"Test"}' -ErrorAction Stop
  Write-Host "Status: $($resp.StatusCode)" -ForegroundColor Yellow
  Write-Host "Body: $($resp.Content)" -ForegroundColor Yellow
} catch {
  $statusCode = $_.Exception.Response.StatusCode.Value__
  $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
  $body = $reader.ReadToEnd() | ConvertFrom-Json
  Write-Host "Status: $statusCode" -ForegroundColor Green
  Write-Host "Error: $($body.error)" -ForegroundColor Green
}
Write-Host ""

# Test 3: Invalid finalAccount (should return 400)
Write-Host "Test 3: Invalid finalAccount (should return 400)" -ForegroundColor Cyan
try {
  $resp = Invoke-WebRequest -Uri "$baseUrl/api/crew/1/repatriation" -Method POST -ContentType "application/json" -Body '{"finalAccount":"not-a-number"}' -ErrorAction Stop
  Write-Host "Status: $($resp.StatusCode)" -ForegroundColor Yellow
  Write-Host "Body: $($resp.Content)" -ForegroundColor Yellow
} catch {
  $statusCode = $_.Exception.Response.StatusCode.Value__
  $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
  $body = $reader.ReadToEnd() | ConvertFrom-Json
  Write-Host "Status: $statusCode" -ForegroundColor Green
  Write-Host "Error: $($body.error)" -ForegroundColor Green
}
Write-Host ""

# Test 4: Invalid date format (should return 400)
Write-Host "Test 4: Invalid date format (should return 400)" -ForegroundColor Cyan
try {
  $resp = Invoke-WebRequest -Uri "$baseUrl/api/crew/1/repatriation" -Method POST -ContentType "application/json" -Body '{"repatriationDate":"invalid-date"}' -ErrorAction Stop
  Write-Host "Status: $($resp.StatusCode)" -ForegroundColor Yellow
  Write-Host "Body: $($resp.Content)" -ForegroundColor Yellow
} catch {
  $statusCode = $_.Exception.Response.StatusCode.Value__
  $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
  $body = $reader.ReadToEnd() | ConvertFrom-Json
  Write-Host "Status: $statusCode" -ForegroundColor Green
  Write-Host "Error: $($body.error)" -ForegroundColor Green
}
Write-Host ""

Write-Host "====== SMOKE TEST COMPLETE ======" -ForegroundColor Green
