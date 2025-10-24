@echo off
echo Checking SkillChain Server Status...
echo.

echo Checking if servers are running on their ports:
echo.

echo Frontend (React) - Port 3000:
netstat -an | findstr :3000
echo.

echo Backend (Node.js) - Port 5000:
netstat -an | findstr :5000
echo.

echo AI API (Python) - Port 8001:
netstat -an | findstr :8001
echo.

echo If you see LISTENING status above, the servers are running!
echo.
echo You can access:
echo - Frontend: http://localhost:3000
echo - Backend: http://localhost:5000
echo - AI API: http://localhost:8001
echo.
pause

