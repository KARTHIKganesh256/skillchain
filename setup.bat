@echo off
echo Setting up SkillChain Platform...
echo.

echo Installing root dependencies...
npm install

echo.
echo Installing frontend dependencies...
cd frontend
npm install
cd ..

echo.
echo Installing backend dependencies...
cd backend
npm install
cd ..

echo.
echo Installing AI API dependencies...
cd ai-api
pip install -r requirements.txt
cd ..

echo.
echo Setup complete! 
echo.
echo To start the development servers:
echo   npm run dev
echo.
echo Or use Docker:
echo   docker-compose -f deployment/docker-compose.yml up -d
echo.
pause

