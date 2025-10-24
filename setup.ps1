Write-Host "Setting up SkillChain Platform..." -ForegroundColor Green
Write-Host ""

Write-Host "Installing root dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

Write-Host ""
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
Set-Location ..

Write-Host ""
Write-Host "Installing AI API dependencies..." -ForegroundColor Yellow
Set-Location ai-api
pip install -r requirements.txt
Set-Location ..

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the development servers:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Or use Docker:" -ForegroundColor Cyan
Write-Host "  docker-compose -f deployment/docker-compose.yml up -d" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to continue"

