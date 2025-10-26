@echo off
echo 🚀 Starting SkillChain Application (Fixed Version)...

echo.
echo ============================================
echo Starting Frontend (React)...
echo ============================================
start "SkillChain Frontend" cmd /k "cd /d K:\SKILLCHAIN\frontend && npm start"

echo.
echo ============================================
echo Starting Backend (Node.js)...
echo ============================================
start "SkillChain Backend" cmd /k "cd /d K:\SKILLCHAIN\backend && npm start"

echo.
echo ============================================
echo Starting AI API (Python)...
echo ============================================
start "SkillChain AI API" cmd /k "cd /d K:\SKILLCHAIN\ai-api && python main-simple.py"

echo.
echo ============================================
echo SkillChain Services Started!
echo ============================================
echo.
echo Please wait 30-60 seconds for all services to fully start up.
echo Then, open your browser and go to:
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo AI API: http://localhost:8000
echo Live Deployment: https://karthikganesh256.github.io/skillchain
echo.
echo All JavaScript errors have been fixed!
echo.
pause



