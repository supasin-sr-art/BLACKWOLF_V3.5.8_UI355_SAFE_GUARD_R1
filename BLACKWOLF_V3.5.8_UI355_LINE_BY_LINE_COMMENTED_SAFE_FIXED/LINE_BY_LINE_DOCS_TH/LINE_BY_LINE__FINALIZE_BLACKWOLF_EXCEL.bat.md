# อธิบายบรรทัดต่อบรรทัด: `FINALIZE_BLACKWOLF_EXCEL.bat`

**บทบาทไฟล์:** Batch launcher: ช่วยเปิด local server หรือเรียก PowerShell tool บน Windows

> วิธีอ่าน: ดูเลขบรรทัด L0001, L0002, ... แล้วเทียบกับไฟล์โค้ดต้นฉบับ/ไฟล์ที่ใส่คอมเมนต์แล้วได้ทันที

| บรรทัด | โค้ด | คำอธิบายแบบคนเริ่มจากศูนย์ |
|---:|---|---|
| L0001 | `@echo off` | ปิดการ echo คำสั่ง เพื่อให้หน้าต่าง command แสดงเฉพาะข้อความที่เราตั้งใจให้เห็น |
| L0002 | `REM BLACKWOLF BATCH TEACHING COMMENTS: เปิด PowerShell Finalizer สำหรับ refresh/verify Pivot ด้วย Microsoft Excel` | คอมเมนต์ Batch เดิม ใช้อธิบายขั้นตอน ไม่ถูกรันเป็นคำสั่ง |
| L0003 | `REM ใช้ REM เป็น comment ของ .bat; ไม่ใช้ // เพราะ cmd.exe จะพยายามรันเป็นคำสั่ง` | คอมเมนต์ Batch เดิม ใช้อธิบายขั้นตอน ไม่ถูกรันเป็นคำสั่ง |
| L0004 | `setlocal EnableExtensions` | เริ่ม local scope ของตัวแปรใน batch เพื่อลดผลกระทบกับ environment ภายนอก |
| L0005 | `cd /d "%~dp0"` | ย้าย working directory ไปยังโฟลเดอร์โปรแกรม เพื่อให้ path อ้างอิงไฟล์ถูกต้อง |
| L0006 | `title BLACKWOLF V3.5.8 Excel Pivot Finalizer` | ตั้งชื่อหน้าต่าง command prompt ให้รู้ว่าหน้าต่างนี้ทำงานอะไรอยู่ |
| L0007 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งคำสั่งใน batch file ให้อ่านง่าย |
| L0008 | `echo ============================================================` | พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command |
| L0009 | `echo BLACKWOLF V3.5.8 - Excel Pivot Finalizer` | พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command |
| L0010 | `echo Optional Microsoft Excel refresh and verification tool` | พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command |
| L0011 | `echo ============================================================` | พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command |
| L0012 | `echo.` | พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command |
| L0013 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งคำสั่งใน batch file ให้อ่านง่าย |
| L0014 | `REM STEP 1: รับ path xlsx จาก argument ถ้ามี; ถ้าไม่มีให้ PowerShell เปิด dialog เลือกไฟล์` | คอมเมนต์ Batch เดิม ใช้อธิบายขั้นตอน ไม่ถูกรันเป็นคำสั่ง |
| L0015 | `set "INPUT=%~1"` | ตั้งค่าตัวแปรใน batch file เพื่อนำไปใช้ในคำสั่งถัดไป |
| L0016 | `if not defined INPUT (` | ตรวจเงื่อนไขใน batch ก่อนเลือกทำคำสั่ง เช่น ถ้าไม่มี Python หรือ port ถูกใช้ |
| L0017 | `  powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\Finalize-BlackwolfExcel.ps1"` | เรียก PowerShell จาก batch เพื่อทำงานที่ command prompt ทำเองไม่สะดวก |
| L0018 | `) else (` | คำสั่ง Batch สำหรับเปิดเครื่องมือหรือควบคุม flow การรันบน Windows |
| L0019 | `  powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\Finalize-BlackwolfExcel.ps1" -InputPath "%INPUT%"` | เรียก PowerShell จาก batch เพื่อทำงานที่ command prompt ทำเองไม่สะดวก |
| L0020 | `)` | คำสั่ง Batch สำหรับเปิดเครื่องมือหรือควบคุม flow การรันบน Windows |
| L0021 | `REM STEP 2: เก็บ exit code จาก PowerShell เพื่อแจ้ง PASSED/FAILED` | คอมเมนต์ Batch เดิม ใช้อธิบายขั้นตอน ไม่ถูกรันเป็นคำสั่ง |
| L0022 | `set "EXITCODE=%ERRORLEVEL%"` | ตั้งค่าตัวแปรใน batch file เพื่อนำไปใช้ในคำสั่งถัดไป |
| L0023 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งคำสั่งใน batch file ให้อ่านง่าย |
| L0024 | `echo.` | พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command |
| L0025 | `if "%EXITCODE%"=="0" (` | ตรวจเงื่อนไขใน batch ก่อนเลือกทำคำสั่ง เช่น ถ้าไม่มี Python หรือ port ถูกใช้ |
| L0026 | `  echo [PASSED] Open the *_FINAL.xlsx file and test Pivot drill-down.` | พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command |
| L0027 | `) else (` | คำสั่ง Batch สำหรับเปิดเครื่องมือหรือควบคุม flow การรันบน Windows |
| L0028 | `  echo [FAILED] See the *_FINALIZER_LOG.txt file and Error Code.` | พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command |
| L0029 | `)` | คำสั่ง Batch สำหรับเปิดเครื่องมือหรือควบคุม flow การรันบน Windows |
| L0030 | `echo.` | พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command |
| L0031 | `pause` | หยุดรอผู้ใช้กดปุ่ม เพื่อให้เห็นข้อความก่อนหน้าต่างปิด |
| L0032 | `exit /b %EXITCODE%` | ออกจาก batch พร้อม exit code เพื่อบอกว่าสำเร็จหรือผิดพลาด |
