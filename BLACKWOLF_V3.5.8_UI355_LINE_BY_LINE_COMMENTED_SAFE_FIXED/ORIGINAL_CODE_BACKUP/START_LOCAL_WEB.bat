@echo off
REM BLACKWOLF BATCH TEACHING COMMENTS: เปิด local web server ด้วย Python แล้วเปิด BLACKWOLF ผ่าน http://127.0.0.1
REM ใช้ REM เป็น comment ของ .bat; ไม่ใช้ // เพราะ cmd.exe จะพยายามรันเป็นคำสั่ง
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"
title BLACKWOLF V3.5.8 Local Web Launcher

REM STEP 1: หา port ว่างช่วง 8765-8775
set "PORT="
for /L %%P in (8765,1,8775) do (
  netstat -ano -p tcp 2>nul | findstr /R /C:":%%P .*LISTENING" >nul
  if errorlevel 1 if not defined PORT set "PORT=%%P"
)
if not defined PORT (
  echo [BW-LAUNCH-001] Ports 8765-8775 are already in use.
  echo Close an old BLACKWOLF server window and try again.
  pause
  exit /b 1
)
set "URL=http://127.0.0.1:%PORT%"
REM STEP 2: หา Python launcher ที่มีในเครื่อง
set "PYTHON_CMD="
where py >nul 2>nul && set "PYTHON_CMD=py"
if not defined PYTHON_CMD where python >nul 2>nul && set "PYTHON_CMD=python"

if not defined PYTHON_CMD (
  echo.
  echo [BW-LAUNCH-002] Python 3 was not found.
  echo Background Worker requires http:// mode. Install Python 3 or use GitHub Pages.
  echo The program will NOT open index.html directly because file:// can limit Worker and storage.
  pause
  exit /b 2
)

echo Starting BLACKWOLF V3.5.8 on %URL%
REM STEP 3: เปิด server window แล้ว bind เฉพาะ 127.0.0.1 เพื่อใช้งานในเครื่อง
start "BLACKWOLF V3.5.8 Server" cmd /k "cd /d ""%~dp0"" ^&^& %PYTHON_CMD% -m http.server %PORT% --bind 127.0.0.1"

REM STEP 4: รอ server พร้อมก่อนเปิด browser
set "READY="
for /L %%I in (1,1,15) do (
  powershell.exe -NoLogo -NoProfile -Command "try { $r=Invoke-WebRequest -UseBasicParsing -TimeoutSec 1 '%URL%'; if($r.StatusCode -ge 200){exit 0}else{exit 1} } catch { exit 1 }" >nul 2>nul
  if not errorlevel 1 set "READY=1"
  if defined READY goto :OPEN
  timeout /t 1 /nobreak >nul
)

echo [BW-LAUNCH-003] Local server did not become ready within 15 seconds.
echo Check the server window for details.
pause
exit /b 3

:OPEN
start "" "%URL%"
echo BLACKWOLF opened successfully. Keep the server window open.
exit /b 0
