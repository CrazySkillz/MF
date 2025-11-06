@echo off
REM Quick Start Script for PerformanceCore (Windows)
REM This script sets up and runs the application locally with in-memory storage

echo.
echo ================================
echo PerformanceCore - Quick Start
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo X Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Node.js found: %NODE_VERSION%
echo.

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies (this may take 1-2 minutes)...
    call npm install
    echo Dependencies installed
    echo.
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating environment configuration...
    (
        echo PORT=5000
        echo NODE_ENV=development
        echo SESSION_SECRET=dev-secret-change-in-production
    ) > .env
    echo Environment configured
    echo.
)

echo ================================
echo Setup complete!
echo.
echo Starting server on http://localhost:5000
echo Press Ctrl+C to stop
echo ================================
echo.

REM Start the development server
call npm run dev
