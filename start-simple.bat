@echo off
echo Starting SkillChain (Simple Mode)...
echo.

echo Starting Frontend (React)...
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo Starting Backend (Node.js)...
start "Backend" cmd /k "cd backend && npm run dev"

echo.
echo Starting AI API (Python)...
start "AI API" cmd /k "cd ai-api && python main-simple.py"

echo.
echo All servers starting in simple mode...
echo.
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo AI API: http://localhost:8001
echo.
echo Test endpoints:
echo - Backend: http://localhost:5000/api/test
echo - AI API: http://localhost:8001/health
echo.
pause

