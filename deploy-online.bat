@echo off
echo 🚀 Deploying SkillChain Online...

echo.
echo Choose your deployment option:
echo 1. GitHub Pages + Railway (Recommended)
echo 2. Vercel (All services)
echo 3. Render (All services)
echo.

set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" goto railway
if "%choice%"=="2" goto vercel
if "%choice%"=="3" goto render

:railway
echo.
echo 🚀 Deploying with Railway + GitHub Pages...
echo.

echo Step 1: Installing Railway CLI...
npm install -g @railway/cli

echo.
echo Step 2: Login to Railway...
railway login

echo.
echo Step 3: Deploying Backend...
cd backend
railway init
railway up
echo Backend deployed! Note the URL for environment variables.

echo.
echo Step 4: Deploying AI API...
cd ../ai-api
railway init
railway up
echo AI API deployed! Note the URL for environment variables.

echo.
echo Step 5: Setting up GitHub Pages...
echo 1. Push your code to GitHub
echo 2. Go to repository Settings > Pages
echo 3. Select Source: GitHub Actions
echo 4. Your app will be available at: https://yourusername.github.io/skillchain

echo.
echo ✅ Deployment complete!
echo Frontend: https://yourusername.github.io/skillchain
echo Backend: Check Railway dashboard for URL
echo AI API: Check Railway dashboard for URL
goto end

:vercel
echo.
echo 🚀 Deploying with Vercel...
echo.

echo Step 1: Installing Vercel CLI...
npm install -g vercel

echo.
echo Step 2: Deploying Frontend...
cd frontend
vercel
echo Frontend deployed! Note the URL.

echo.
echo Step 3: Deploying Backend...
cd ../backend
vercel
echo Backend deployed! Note the URL.

echo.
echo Step 4: Deploying AI API...
cd ../ai-api
vercel
echo AI API deployed! Note the URL.

echo.
echo ✅ Deployment complete!
echo Check Vercel dashboard for all URLs
goto end

:render
echo.
echo 🚀 Deploying with Render...
echo.

echo Step 1: Go to https://render.com
echo Step 2: Connect your GitHub repository
echo Step 3: Create 3 services:
echo    - Frontend: Static Site
echo    - Backend: Web Service
echo    - AI API: Web Service
echo Step 4: Use the configuration from DEPLOYMENT_GUIDE.md

echo.
echo ✅ Follow the guide in DEPLOYMENT_GUIDE.md for Render setup
goto end

:end
echo.
echo 📚 For detailed instructions, see DEPLOYMENT_GUIDE.md
echo.
pause
