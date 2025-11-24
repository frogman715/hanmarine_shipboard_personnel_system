# Script to allow port 3000 through Windows Firewall
# Run as Administrator

Write-Host "Adding firewall rule for port 3000..." -ForegroundColor Green

# Remove old rule if exists
netsh advfirewall firewall delete rule name="Next.js App Port 3000" 2>$null

# Add inbound rule
netsh advfirewall firewall add rule name="Next.js App Port 3000" dir=in action=allow protocol=TCP localport=3000

# Add outbound rule
netsh advfirewall firewall add rule name="Next.js App Port 3000" dir=out action=allow protocol=TCP localport=3000

Write-Host "Firewall rule added successfully!" -ForegroundColor Green
Write-Host "Port 3000 is now accessible from other computers" -ForegroundColor Cyan
