@echo off
echo 🚀 Starting Complete SkillChain Application
echo ============================================
echo.

echo Starting Backend API...
start "SkillChain Backend" cmd /k "cd backend && npm start"

echo Starting AI API...
start "SkillChain AI API" cmd /k "cd ai-api && python main-simple.py"

echo Starting Frontend...
start "SkillChain Frontend" cmd /k "cd frontend && npm start"

echo.
echo ⏳ Please wait 30-60 seconds for all services to start...
echo.

echo 🌐 Access URLs:
echo ================
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo AI API: http://localhost:8000
echo Live: https://karthikganesh256.github.io/skillchain
echo.

echo 📋 Features Available:
echo =====================
echo ✅ Complete Frontend with Navigation
echo ✅ Skill Management (View, Add, Edit)
echo ✅ User Management
echo ✅ SkillCoin Calculator
echo ✅ AI Learning Assistant
echo ✅ Skill Recommendations
echo ✅ Learning Paths
echo ✅ Skill Matching
echo ✅ Trending Skills
echo ✅ Quiz Generation
echo ✅ Analytics Dashboard
echo ✅ Transaction Management
echo ✅ Learning Sessions
echo ✅ Challenges System
echo.

echo 🎯 Full-Stack Features:
echo =======================
echo Frontend: React + TypeScript + TailwindCSS
echo Backend: Node.js + Express + REST API
echo AI API: Python + FastAPI + AI Features
echo Database: Mock data (ready for real DB)
echo Authentication: Ready for implementation
echo Real-time: WebSocket ready
echo.

echo Press any key to open the application...
pause

echo Opening SkillChain in your browser...
start http://localhost:3000

echo.
echo ✅ SkillChain is now running with ALL features!
echo.
echo Press any key to exit...
pause



