@echo off
echo 🚀 Deploying SkillChain to GitHub Pages...
echo.

echo ============================================
echo  SKILLCHAIN GITHUB PAGES DEPLOYMENT
echo ============================================
echo.

echo Step 1: Checking prerequisites...
echo --------------------------------
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Git is not installed or not in PATH
    echo Please install Git and try again
    pause
    exit /b 1
)

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js and try again
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed
echo.

echo Step 2: Installing dependencies...
echo --------------------------------
cd frontend
if not exist node_modules (
    echo Installing npm dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo ✅ Dependencies already installed
)
echo.

echo Step 3: Building React app for production...
echo -------------------------------------------
echo Building with GitHub Pages configuration...
set PUBLIC_URL=https://karthikganesh256.github.io/skillchain
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)
echo ✅ Build completed successfully
echo.

echo Step 4: Preparing for GitHub Pages...
echo -------------------------------------
echo Creating docs directory...
cd ..
if not exist docs mkdir docs
echo Copying build files to docs directory...
xcopy /E /I /Y /Q frontend\build\* docs\
if %errorlevel% neq 0 (
    echo ❌ Failed to copy build files
    pause
    exit /b 1
)
echo ✅ Files copied to docs directory
echo.

echo Step 5: Creating .nojekyll file...
echo ----------------------------------
echo. > docs\.nojekyll
echo ✅ .nojekyll file created
echo.

echo Step 6: Committing and pushing to GitHub...
echo -------------------------------------------
git add .
git commit -m "Deploy SkillChain to GitHub Pages - %date% %time%"
if %errorlevel% neq 0 (
    echo ❌ Failed to commit changes
    pause
    exit /b 1
)

git push origin main
if %errorlevel% neq 0 (
    echo ❌ Failed to push to GitHub
    pause
    exit /b 1
)
echo ✅ Changes pushed to GitHub
echo.

echo ============================================
echo  DEPLOYMENT COMPLETE! 🎉
echo ============================================
echo.
echo Your SkillChain app will be available at:
echo 🌐 https://karthikganesh256.github.io/skillchain
echo.
echo Note: It may take 5-10 minutes for GitHub Pages to update
echo You can check the deployment status at:
echo 📊 https://github.com/KARTHIKganesh256/skillchain/actions
echo.
echo ============================================
echo  NEXT STEPS:
echo ============================================
echo 1. Go to: https://github.com/KARTHIKganesh256/skillchain/settings/pages
echo 2. Under "Source", select "Deploy from a branch"
echo 3. Branch: main
echo 4. Folder: /docs
echo 5. Click "Save"
echo.
echo ✅ Deployment process completed successfully!
echo.
pause















