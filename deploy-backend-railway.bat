@echo off
echo 🚀 Deploying SkillChain Backend to Railway...

echo.
echo Step 1: Installing Railway CLI...
npm install -g @railway/cli

echo.
echo Step 2: Login to Railway...
railway login

echo.
echo Step 3: Initialize Railway project...
cd backend
railway init

echo.
echo Step 4: Deploy to Railway...
railway up

echo.
echo ✅ Backend deployed! 
echo Note the Railway URL for environment variables.
echo.
pause
