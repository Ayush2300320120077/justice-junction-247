@echo off
echo ========================================
echo   Justice Junction 24/7 - Starting...
echo ========================================
echo.

REM Check if .env exists
if not exist .env (
  echo ERROR: .env file not found!
  echo Please read env-setup.txt and create your .env file first.
  echo.
  pause
  exit
)

REM Check if node_modules exists
if not exist node_modules (
  echo Installing dependencies...
  npm install
)

REM Check if netlify-cli is installed
netlify --version >nul 2>&1
if errorlevel 1 (
  echo Installing Netlify CLI...
  npm install -g netlify-cli
)

echo.
echo Starting Justice Junction...
echo Open http://localhost:8888 in your browser
echo.
netlify dev
