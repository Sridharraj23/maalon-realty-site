@echo off
title MAALON REALTY - Official Web Server
echo ===================================================
echo   MAALON REALTY - OFFICIAL WEBSITE DEVELOPMENT
echo   Domain: https://maalonrealty.in
echo ===================================================
echo.

set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"

echo Starting production server on http://localhost:3000 ...
start "" http://localhost:3000

npm start
pause
