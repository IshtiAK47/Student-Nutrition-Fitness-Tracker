@echo off
echo ============================================
echo Student Nutrition and Fitness Tracker
echo Database Setup Script
echo ============================================
echo.

REM Get MySQL credentials
set /p DB_USER="Enter MySQL username (default: root): "
if "%DB_USER%"=="" set DB_USER=root

set /p DB_PASS=""
set DB_NAME=nutrition_tracker

echo.
echo Creating database: %DB_NAME%
echo.

REM Create database
mysql -u %DB_USER% -p%DB_PASS% -e "CREATE DATABASE IF NOT EXISTS %DB_NAME%;"

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to create database. Please check your credentials.
    pause
    exit /b 1
)

echo Database created successfully!
echo.

REM Run schema
echo Installing database schema...
mysql -u %DB_USER% -p%DB_PASS% %DB_NAME% < database\schema.sql

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install schema.
    pause
    exit /b 1
)

echo Schema installed successfully!
echo.

REM Run seed data
echo Inserting sample data...
mysql -u %DB_USER% -p%DB_PASS% %DB_NAME% < database\seed.sql

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to insert sample data.
    pause
    exit /b 1
)

echo Sample data inserted successfully!
echo.

REM Verify installation
echo Verifying installation...
mysql -u %DB_USER% -p%DB_PASS% %DB_NAME% -e "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = '%DB_NAME%';"

echo.
echo ============================================
echo Database setup completed successfully!
echo ============================================
echo.
echo Next steps:
echo 1. Update .env.local with your credentials
echo 2. Run: npm install
echo 3. Run: npm run dev
echo 4. Visit: http://localhost:3000
echo.
pause
