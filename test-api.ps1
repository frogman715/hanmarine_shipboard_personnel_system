Write-Host "====== API SMOKE TEST ======" -ForegroundColor Green
Write-Host ""

$base = "http://localhost:3000"
$headers = @{ "Content-Type" = "application/json" }

Write-Host "Test 1: Invalid crew ID" -ForegroundColor Yellow
$resp1 = $(try {Invoke-WebRequest -Uri "$base/api/crew/invalid/repatriation" -Method POST -Headers $headers -Body "{`"reason`":`"Test`"}" -ErrorAction Stop} catch {$_.Exception.Response.StatusCode.Value__})
Write-Host "Status: $resp1" -ForegroundColor Green

Write-Host "Test 2: Crew not found" -ForegroundColor Yellow
$resp2 = $(try {Invoke-WebRequest -Uri "$base/api/crew/9999/repatriation" -Method POST -Headers $headers -Body "{`"reason`":`"Test`"}" -ErrorAction Stop} catch {$_.Exception.Response.StatusCode.Value__})
Write-Host "Status: $resp2" -ForegroundColor Green

Write-Host "Test 3: Invalid finalAccount" -ForegroundColor Yellow
$resp3 = $(try {Invoke-WebRequest -Uri "$base/api/crew/1/repatriation" -Method POST -Headers $headers -Body "{`"finalAccount`":`"abc`"}" -ErrorAction Stop} catch {$_.Exception.Response.StatusCode.Value__})
Write-Host "Status: $resp3" -ForegroundColor Green

Write-Host ""
Write-Host "====== COMPLETE ======" -ForegroundColor Green
