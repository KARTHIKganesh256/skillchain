@echo off
echo 🚀 Deploying SkillChain to GitHub Pages...

echo.
echo ============================================
echo  GITHUB PAGES DEPLOYMENT STEPS
echo ============================================
echo.

echo Step 1: GitHub Pages Settings
echo ------------------------------
echo 1. Go to: https://github.com/KARTHIKganesh256/skillchain/settings/pages
echo 2. Under "Source", select "Deploy from a branch"
echo 3. Branch: main
echo 4. Folder: / (root)
echo 5. Click "Save"
echo.

echo Step 2: Build Frontend for GitHub Pages
echo ----------------------------------------
echo Building React app for production...
cd frontend
npm run build
echo.

echo Step 3: Deploy to GitHub Pages
echo ------------------------------
echo Copying build files to root directory...
xcopy /E /I /Y build\* ..\..\docs\
echo.

echo Step 4: Commit and Push
echo -----------------------
cd ..
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
echo.

echo ============================================
echo  YOUR APP WILL BE LIVE AT:
echo ============================================
echo https://karthikganesh256.github.io/skillchain
echo.

echo ✅ Deployment complete!
echo Your SkillChain app is now live on GitHub Pages!
echo.
pause






