# SkillChain Startup Script for PowerShell
Write-Host "🚀 Starting SkillChain Application" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Start Backend
Write-Host "Starting Backend API..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm start"

# Wait a moment
Start-Sleep -Seconds 2

# Start AI API
Write-Host "Starting AI API..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\ai-api'; python main-simple.py"

# Wait a moment
Start-Sleep -Seconds 2

# Start Frontend
Write-Host "Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm start"

Write-Host ""
Write-Host "✅ All services are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access URLs:" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend API: http://localhost:5000" -ForegroundColor White
Write-Host "AI API: http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "⏳ Please wait 30-60 seconds for all services to start..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to open the application..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open the application
Start-Process "http://localhost:3000"

