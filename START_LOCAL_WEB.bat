@echo off
REM [L0001] ปิดการ echo คำสั่ง เพื่อให้หน้าต่าง command แสดงเฉพาะข้อความที่เราตั้งใจให้เห็น
REM [L0002] คอมเมนต์ Batch เดิม ใช้อธิบายขั้นตอน ไม่ถูกรันเป็นคำสั่ง
REM BLACKWOLF BATCH TEACHING COMMENTS: เปิด local web server ด้วย Python แล้วเปิด BLACKWOLF ผ่าน http://127.0.0.1
REM [L0003] คอมเมนต์ Batch เดิม ใช้อธิบายขั้นตอน ไม่ถูกรันเป็นคำสั่ง
REM ใช้ REM เป็น comment ของ .bat; ไม่ใช้ // เพราะ cmd.exe จะพยายามรันเป็นคำสั่ง
REM [L0004] เริ่ม local scope ของตัวแปรใน batch เพื่อลดผลกระทบกับ environment ภายนอก
setlocal EnableExtensions EnableDelayedExpansion
REM [L0005] ย้าย working directory ไปยังโฟลเดอร์โปรแกรม เพื่อให้ path อ้างอิงไฟล์ถูกต้อง
cd /d "%~dp0"
REM [L0006] ตั้งชื่อหน้าต่าง command prompt ให้รู้ว่าหน้าต่างนี้ทำงานอะไรอยู่
title BLACKWOLF V3.5.8 Local Web Launcher
REM [L0007] บรรทัดว่าง แบ่งคำสั่งใน batch file ให้อ่านง่าย

REM [L0008] คอมเมนต์ Batch เดิม ใช้อธิบายขั้นตอน ไม่ถูกรันเป็นคำสั่ง
REM STEP 1: หา port ว่างช่วง 8765-8775
REM [L0009] ตั้งค่าตัวแปรใน batch file เพื่อนำไปใช้ในคำสั่งถัดไป
set "PORT="
REM [L0010] เริ่ม loop ใน batch เช่น ไล่หา port ว่างหรือรอ server พร้อม
for /L %%P in (8765,1,8775) do (
REM [L0011] คำสั่ง Batch สำหรับเปิดเครื่องมือหรือควบคุม flow การรันบน Windows
  netstat -ano -p tcp 2>nul | findstr /R /C:":%%P .*LISTENING" >nul
REM [L0012] ตรวจเงื่อนไขใน batch ก่อนเลือกทำคำสั่ง เช่น ถ้าไม่มี Python หรือ port ถูกใช้
  if errorlevel 1 if not defined PORT set "PORT=%%P"
REM [L0013] คำสั่ง Batch สำหรับเปิดเครื่องมือหรือควบคุม flow การรันบน Windows
)
REM [L0014] ตรวจเงื่อนไขใน batch ก่อนเลือกทำคำสั่ง เช่น ถ้าไม่มี Python หรือ port ถูกใช้
if not defined PORT (
REM [L0015] พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command
  echo [BW-LAUNCH-001] Ports 8765-8775 are already in use.
REM [L0016] พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command
  echo Close an old BLACKWOLF server window and try again.
REM [L0017] หยุดรอผู้ใช้กดปุ่ม เพื่อให้เห็นข้อความก่อนหน้าต่างปิด
  pause
REM [L0018] ออกจาก batch พร้อม exit code เพื่อบอกว่าสำเร็จหรือผิดพลาด
  exit /b 1
REM [L0019] คำสั่ง Batch สำหรับเปิดเครื่องมือหรือควบคุม flow การรันบน Windows
)
REM [L0020] ตั้งค่าตัวแปรใน batch file เพื่อนำไปใช้ในคำสั่งถัดไป
set "URL=http://127.0.0.1:%PORT%"
REM SAFE GUARD R1: เก็บเวลาเริ่มเปิดโปรแกรมไว้แสดง log ช่วย Debug
set "LAUNCH_START=%DATE% %TIME%"
REM [L0021] คอมเมนต์ Batch เดิม ใช้อธิบายขั้นตอน ไม่ถูกรันเป็นคำสั่ง
REM STEP 2: หา Python launcher ที่มีในเครื่อง
REM [L0022] ตั้งค่าตัวแปรใน batch file เพื่อนำไปใช้ในคำสั่งถัดไป
set "PYTHON_CMD="
REM [L0023] คำสั่ง Batch สำหรับเปิดเครื่องมือหรือควบคุม flow การรันบน Windows
where py >nul 2>nul && set "PYTHON_CMD=py"
REM [L0024] ตรวจเงื่อนไขใน batch ก่อนเลือกทำคำสั่ง เช่น ถ้าไม่มี Python หรือ port ถูกใช้
if not defined PYTHON_CMD where python >nul 2>nul && set "PYTHON_CMD=python"
REM [L0025] บรรทัดว่าง แบ่งคำสั่งใน batch file ให้อ่านง่าย

REM [L0026] ตรวจเงื่อนไขใน batch ก่อนเลือกทำคำสั่ง เช่น ถ้าไม่มี Python หรือ port ถูกใช้
if not defined PYTHON_CMD (
REM [L0027] พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command
  echo.
REM [L0028] พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command
  echo [BW-LAUNCH-002] Python 3 was not found.
REM [L0029] พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command
  echo Background Worker requires http:// mode. Install Python 3 or use GitHub Pages.
REM [L0030] พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command
  echo The program will NOT open index.html directly because file:// can limit Worker and storage.
REM [L0031] หยุดรอผู้ใช้กดปุ่ม เพื่อให้เห็นข้อความก่อนหน้าต่างปิด
  pause
REM [L0032] ออกจาก batch พร้อม exit code เพื่อบอกว่าสำเร็จหรือผิดพลาด
  exit /b 2
REM [L0033] คำสั่ง Batch สำหรับเปิดเครื่องมือหรือควบคุม flow การรันบน Windows
)
REM SAFE GUARD R1: อ่าน Python version เพื่อให้เวลามีปัญหาเปิดเว็บจะรู้ทันทีว่าเครื่องใช้ Python ตัวไหน
set "PYTHON_VERSION=Unknown Python"
for /f "delims=" %%V in ('%PYTHON_CMD% --version 2^>^&1') do set "PYTHON_VERSION=%%V"
REM [L0034] บรรทัดว่าง แบ่งคำสั่งใน batch file ให้อ่านง่าย

REM [L0035] พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command
echo Starting BLACKWOLF V3.5.8 on %URL%
echo Port = %PORT%
echo Python = %PYTHON_VERSION%
echo Startup Time = %LAUNCH_START%
REM [L0036] คอมเมนต์ Batch เดิม ใช้อธิบายขั้นตอน ไม่ถูกรันเป็นคำสั่ง
REM STEP 3: เปิด server window แล้ว bind เฉพาะ 127.0.0.1 เพื่อใช้งานในเครื่อง
REM [L0037] เปิดหน้าต่างใหม่หรือเปิด URL/โปรแกรมตามคำสั่ง
start "BLACKWOLF V3.5.8 Server" cmd /k "cd /d ""%~dp0"" ^&^& %PYTHON_CMD% -m http.server %PORT% --bind 127.0.0.1"
REM [L0038] บรรทัดว่าง แบ่งคำสั่งใน batch file ให้อ่านง่าย

REM [L0039] คอมเมนต์ Batch เดิม ใช้อธิบายขั้นตอน ไม่ถูกรันเป็นคำสั่ง
REM STEP 4: รอ server พร้อมก่อนเปิด browser
REM [L0040] ตั้งค่าตัวแปรใน batch file เพื่อนำไปใช้ในคำสั่งถัดไป
set "READY="
REM [L0041] เริ่ม loop ใน batch เช่น ไล่หา port ว่างหรือรอ server พร้อม
for /L %%I in (1,1,30) do (
REM [L0042] เรียก PowerShell จาก batch เพื่อทำงานที่ command prompt ทำเองไม่สะดวก
  powershell.exe -NoLogo -NoProfile -Command "try { $r=Invoke-WebRequest -UseBasicParsing -TimeoutSec 1 '%URL%'; if($r.StatusCode -ge 200){exit 0}else{exit 1} } catch { exit 1 }" >nul 2>nul
REM [L0043] ตรวจเงื่อนไขใน batch ก่อนเลือกทำคำสั่ง เช่น ถ้าไม่มี Python หรือ port ถูกใช้
  if not errorlevel 1 set "READY=1"
REM [L0044] ตรวจเงื่อนไขใน batch ก่อนเลือกทำคำสั่ง เช่น ถ้าไม่มี Python หรือ port ถูกใช้
  if defined READY goto :OPEN
REM [L0045] คำสั่ง Batch สำหรับเปิดเครื่องมือหรือควบคุม flow การรันบน Windows
  timeout /t 1 /nobreak >nul
REM [L0046] คำสั่ง Batch สำหรับเปิดเครื่องมือหรือควบคุม flow การรันบน Windows
)
REM [L0047] บรรทัดว่าง แบ่งคำสั่งใน batch file ให้อ่านง่าย

REM [L0048] พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command
echo [BW-LAUNCH-003] Local server did not become ready within 30 seconds.
REM [L0049] พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command
echo Check the server window for details.
REM [L0050] หยุดรอผู้ใช้กดปุ่ม เพื่อให้เห็นข้อความก่อนหน้าต่างปิด
pause
REM [L0051] ออกจาก batch พร้อม exit code เพื่อบอกว่าสำเร็จหรือผิดพลาด
exit /b 3
REM [L0052] บรรทัดว่าง แบ่งคำสั่งใน batch file ให้อ่านง่าย

REM [L0053] ประกาศ label สำหรับใช้กับ goto เพื่อกระโดดมาทำงานจุดนี้
:OPEN
REM [L0054] เปิดหน้าต่างใหม่หรือเปิด URL/โปรแกรมตามคำสั่ง
start "" "%URL%"
REM [L0055] พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command
echo BLACKWOLF opened successfully. Keep the server window open.
REM [L0056] ออกจาก batch พร้อม exit code เพื่อบอกว่าสำเร็จหรือผิดพลาด
exit /b 0
