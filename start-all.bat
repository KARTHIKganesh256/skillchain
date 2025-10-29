@echo off
echo 🚀 Starting All SkillChain Services...
echo.

echo Starting Frontend in new window...
start "SkillChain Frontend" cmd /k "cd frontend && npm start"

echo Starting Backend in new window...
start "SkillChain Backend" cmd /k "cd backend && npm start"

echo Starting AI API in new window...
start "SkillChain AI API" cmd /k "cd ai-api && python main-simple.py"

echo.
echo ✅ All services are starting in separate windows!
echo.
echo 🌐 Access URLs:
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo AI API: http://localhost:8000
echo Live: https://karthikganesh256.github.io/skillchain
echo.
pause













