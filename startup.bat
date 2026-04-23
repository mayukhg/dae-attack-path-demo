@echo off
echo ========================================================
echo Starting DAE Attack Path Demo (Frontend + Backend)
echo ========================================================
echo.

REM Starts the Next.js server in a separate window
start "DAE_NextJS_Server" cmd /c "npm run dev"

echo The server is spinning up. 
echo Once ready, access the application at: http://localhost:3000
echo.
pause
