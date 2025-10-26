@echo off
echo 🚀 Deploying SkillChain AI API to Railway...

echo.
echo Step 1: Initialize Railway project for AI API...
cd ai-api
railway init

echo.
echo Step 2: Deploy AI API to Railway...
railway up

echo.
echo ✅ AI API deployed!
echo Note the Railway URL for environment variables.
echo.
pause


