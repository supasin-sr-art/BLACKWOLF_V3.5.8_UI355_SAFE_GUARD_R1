@echo off
REM BLACKWOLF BATCH TEACHING COMMENTS: เปิด PowerShell Finalizer สำหรับ refresh/verify Pivot ด้วย Microsoft Excel
REM ใช้ REM เป็น comment ของ .bat; ไม่ใช้ // เพราะ cmd.exe จะพยายามรันเป็นคำสั่ง
setlocal EnableExtensions
cd /d "%~dp0"
title BLACKWOLF V3.5.8 Excel Pivot Finalizer

echo ============================================================
echo BLACKWOLF V3.5.8 - Excel Pivot Finalizer
echo Optional Microsoft Excel refresh and verification tool
echo ============================================================
echo.

REM STEP 1: รับ path xlsx จาก argument ถ้ามี; ถ้าไม่มีให้ PowerShell เปิด dialog เลือกไฟล์
set "INPUT=%~1"
if not defined INPUT (
  powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\Finalize-BlackwolfExcel.ps1"
) else (
  powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\Finalize-BlackwolfExcel.ps1" -InputPath "%INPUT%"
)
REM STEP 2: เก็บ exit code จาก PowerShell เพื่อแจ้ง PASSED/FAILED
set "EXITCODE=%ERRORLEVEL%"

echo.
if "%EXITCODE%"=="0" (
  echo [PASSED] Open the *_FINAL.xlsx file and test Pivot drill-down.
) else (
  echo [FAILED] See the *_FINALIZER_LOG.txt file and Error Code.
)
echo.
pause
exit /b %EXITCODE%
