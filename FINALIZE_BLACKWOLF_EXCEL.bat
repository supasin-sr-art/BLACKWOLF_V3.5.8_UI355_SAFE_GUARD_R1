@echo off
REM [L0001] ปิดการ echo คำสั่ง เพื่อให้หน้าต่าง command แสดงเฉพาะข้อความที่เราตั้งใจให้เห็น
REM [L0002] คอมเมนต์ Batch เดิม ใช้อธิบายขั้นตอน ไม่ถูกรันเป็นคำสั่ง
REM BLACKWOLF BATCH TEACHING COMMENTS: เปิด PowerShell Finalizer สำหรับ refresh/verify Pivot ด้วย Microsoft Excel
REM [L0003] คอมเมนต์ Batch เดิม ใช้อธิบายขั้นตอน ไม่ถูกรันเป็นคำสั่ง
REM ใช้ REM เป็น comment ของ .bat; ไม่ใช้ // เพราะ cmd.exe จะพยายามรันเป็นคำสั่ง
REM [L0004] เริ่ม local scope ของตัวแปรใน batch เพื่อลดผลกระทบกับ environment ภายนอก
setlocal EnableExtensions
REM [L0005] ย้าย working directory ไปยังโฟลเดอร์โปรแกรม เพื่อให้ path อ้างอิงไฟล์ถูกต้อง
cd /d "%~dp0"
REM [L0006] ตั้งชื่อหน้าต่าง command prompt ให้รู้ว่าหน้าต่างนี้ทำงานอะไรอยู่
title BLACKWOLF V3.5.8 Excel Pivot Finalizer
REM [L0007] บรรทัดว่าง แบ่งคำสั่งใน batch file ให้อ่านง่าย

REM [L0008] พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command
echo ============================================================
REM [L0009] พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command
echo BLACKWOLF V3.5.8 - Excel Pivot Finalizer
REM [L0010] พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command
echo Optional Microsoft Excel refresh and verification tool
REM [L0011] พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command
echo ============================================================
REM [L0012] พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command
echo.
REM [L0013] บรรทัดว่าง แบ่งคำสั่งใน batch file ให้อ่านง่าย

REM [L0014] คอมเมนต์ Batch เดิม ใช้อธิบายขั้นตอน ไม่ถูกรันเป็นคำสั่ง
REM STEP 1: รับ path xlsx จาก argument ถ้ามี; ถ้าไม่มีให้ PowerShell เปิด dialog เลือกไฟล์
REM [L0015] ตั้งค่าตัวแปรใน batch file เพื่อนำไปใช้ในคำสั่งถัดไป
set "INPUT=%~1"
REM [L0016] ตรวจเงื่อนไขใน batch ก่อนเลือกทำคำสั่ง เช่น ถ้าไม่มี Python หรือ port ถูกใช้
if not defined INPUT (
REM [L0017] เรียก PowerShell จาก batch เพื่อทำงานที่ command prompt ทำเองไม่สะดวก
  powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\Finalize-BlackwolfExcel.ps1"
REM [L0018] คำสั่ง Batch สำหรับเปิดเครื่องมือหรือควบคุม flow การรันบน Windows
) else (
REM [L0019] เรียก PowerShell จาก batch เพื่อทำงานที่ command prompt ทำเองไม่สะดวก
  powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\Finalize-BlackwolfExcel.ps1" -InputPath "%INPUT%"
REM [L0020] คำสั่ง Batch สำหรับเปิดเครื่องมือหรือควบคุม flow การรันบน Windows
)
REM [L0021] คอมเมนต์ Batch เดิม ใช้อธิบายขั้นตอน ไม่ถูกรันเป็นคำสั่ง
REM STEP 2: เก็บ exit code จาก PowerShell เพื่อแจ้ง PASSED/FAILED
REM [L0022] ตั้งค่าตัวแปรใน batch file เพื่อนำไปใช้ในคำสั่งถัดไป
set "EXITCODE=%ERRORLEVEL%"
REM [L0023] บรรทัดว่าง แบ่งคำสั่งใน batch file ให้อ่านง่าย

REM [L0024] พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command
echo.
REM [L0025] ตรวจเงื่อนไขใน batch ก่อนเลือกทำคำสั่ง เช่น ถ้าไม่มี Python หรือ port ถูกใช้
if "%EXITCODE%"=="0" (
REM [L0026] พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command
  echo [PASSED] Open the *_FINAL.xlsx file and test Pivot drill-down.
REM [L0027] คำสั่ง Batch สำหรับเปิดเครื่องมือหรือควบคุม flow การรันบน Windows
) else (
REM [L0028] พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command
  echo [FAILED] See the *_FINALIZER_LOG.txt file and Error Code.
REM [L0029] คำสั่ง Batch สำหรับเปิดเครื่องมือหรือควบคุม flow การรันบน Windows
)
REM [L0030] พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command
echo.
REM [L0031] หยุดรอผู้ใช้กดปุ่ม เพื่อให้เห็นข้อความก่อนหน้าต่างปิด
pause
REM [L0032] ออกจาก batch พร้อม exit code เพื่อบอกว่าสำเร็จหรือผิดพลาด
exit /b %EXITCODE%
