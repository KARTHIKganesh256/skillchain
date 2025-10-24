@echo off
echo 🚀 Deploying Complete SkillChain Application...

echo.
echo ============================================
echo  SKILLCHAIN DEPLOYMENT GUIDE
echo ============================================
echo.

echo 1. FRONTEND (GitHub Pages) - ALREADY DONE ✅
echo    URL: https://karthikganesh256.github.io/skillchain
echo.

echo 2. BACKEND (Railway) - RUN THIS:
echo    .\deploy-backend-railway.bat
echo.

echo 3. AI API (Railway) - RUN THIS:
echo    .\deploy-ai-railway.bat
echo.

echo 4. UPDATE ENVIRONMENT VARIABLES:
echo    - Copy backend URL to frontend environment
echo    - Copy AI API URL to frontend environment
echo    - Set up database connections
echo.

echo ============================================
echo  QUICK DEPLOYMENT OPTIONS
echo ============================================
echo.

echo Option A: Railway (Recommended)
echo - Run: .\deploy-backend-railway.bat
echo - Run: .\deploy-ai-railway.bat
echo.

echo Option B: Vercel (Alternative)
echo - Go to: https://vercel.com
echo - Import your GitHub repository
echo - Deploy backend and AI API as separate projects
echo.

echo Option C: Render (Free Tier)
echo - Go to: https://render.com
echo - Connect GitHub repository
echo - Create 2 services: Backend + AI API
echo.

echo ============================================
echo  YOUR APP WILL BE LIVE AT:
echo ============================================
echo Frontend: https://karthikganesh256.github.io/skillchain
echo Backend: [Your Railway URL]
echo AI API: [Your Railway URL]
echo.

echo Choose your deployment method and run the commands above!
echo.
pause
