# อธิบายบรรทัดต่อบรรทัด: `START_LOCAL_WEB.bat`

**บทบาทไฟล์:** Batch launcher: ช่วยเปิด local server หรือเรียก PowerShell tool บน Windows

> วิธีอ่าน: ดูเลขบรรทัด L0001, L0002, ... แล้วเทียบกับไฟล์โค้ดต้นฉบับ/ไฟล์ที่ใส่คอมเมนต์แล้วได้ทันที

| บรรทัด | โค้ด | คำอธิบายแบบคนเริ่มจากศูนย์ |
|---:|---|---|
| L0001 | `@echo off` | ปิดการ echo คำสั่ง เพื่อให้หน้าต่าง command แสดงเฉพาะข้อความที่เราตั้งใจให้เห็น |
| L0002 | `REM BLACKWOLF BATCH TEACHING COMMENTS: เปิด local web server ด้วย Python แล้วเปิด BLACKWOLF ผ่าน http://127.0.0.1` | คอมเมนต์ Batch เดิม ใช้อธิบายขั้นตอน ไม่ถูกรันเป็นคำสั่ง |
| L0003 | `REM ใช้ REM เป็น comment ของ .bat; ไม่ใช้ // เพราะ cmd.exe จะพยายามรันเป็นคำสั่ง` | คอมเมนต์ Batch เดิม ใช้อธิบายขั้นตอน ไม่ถูกรันเป็นคำสั่ง |
| L0004 | `setlocal EnableExtensions EnableDelayedExpansion` | เริ่ม local scope ของตัวแปรใน batch เพื่อลดผลกระทบกับ environment ภายนอก |
| L0005 | `cd /d "%~dp0"` | ย้าย working directory ไปยังโฟลเดอร์โปรแกรม เพื่อให้ path อ้างอิงไฟล์ถูกต้อง |
| L0006 | `title BLACKWOLF V3.5.8 Local Web Launcher` | ตั้งชื่อหน้าต่าง command prompt ให้รู้ว่าหน้าต่างนี้ทำงานอะไรอยู่ |
| L0007 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งคำสั่งใน batch file ให้อ่านง่าย |
| L0008 | `REM STEP 1: หา port ว่างช่วง 8765-8775` | คอมเมนต์ Batch เดิม ใช้อธิบายขั้นตอน ไม่ถูกรันเป็นคำสั่ง |
| L0009 | `set "PORT="` | ตั้งค่าตัวแปรใน batch file เพื่อนำไปใช้ในคำสั่งถัดไป |
| L0010 | `for /L %%P in (8765,1,8775) do (` | เริ่ม loop ใน batch เช่น ไล่หา port ว่างหรือรอ server พร้อม |
| L0011 | `  netstat -ano -p tcp 2>nul \| findstr /R /C:":%%P .*LISTENING" >nul` | คำสั่ง Batch สำหรับเปิดเครื่องมือหรือควบคุม flow การรันบน Windows |
| L0012 | `  if errorlevel 1 if not defined PORT set "PORT=%%P"` | ตรวจเงื่อนไขใน batch ก่อนเลือกทำคำสั่ง เช่น ถ้าไม่มี Python หรือ port ถูกใช้ |
| L0013 | `)` | คำสั่ง Batch สำหรับเปิดเครื่องมือหรือควบคุม flow การรันบน Windows |
| L0014 | `if not defined PORT (` | ตรวจเงื่อนไขใน batch ก่อนเลือกทำคำสั่ง เช่น ถ้าไม่มี Python หรือ port ถูกใช้ |
| L0015 | `  echo [BW-LAUNCH-001] Ports 8765-8775 are already in use.` | พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command |
| L0016 | `  echo Close an old BLACKWOLF server window and try again.` | พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command |
| L0017 | `  pause` | หยุดรอผู้ใช้กดปุ่ม เพื่อให้เห็นข้อความก่อนหน้าต่างปิด |
| L0018 | `  exit /b 1` | ออกจาก batch พร้อม exit code เพื่อบอกว่าสำเร็จหรือผิดพลาด |
| L0019 | `)` | คำสั่ง Batch สำหรับเปิดเครื่องมือหรือควบคุม flow การรันบน Windows |
| L0020 | `set "URL=http://127.0.0.1:%PORT%"` | ตั้งค่าตัวแปรใน batch file เพื่อนำไปใช้ในคำสั่งถัดไป |
| L0021 | `REM STEP 2: หา Python launcher ที่มีในเครื่อง` | คอมเมนต์ Batch เดิม ใช้อธิบายขั้นตอน ไม่ถูกรันเป็นคำสั่ง |
| L0022 | `set "PYTHON_CMD="` | ตั้งค่าตัวแปรใน batch file เพื่อนำไปใช้ในคำสั่งถัดไป |
| L0023 | `where py >nul 2>nul && set "PYTHON_CMD=py"` | คำสั่ง Batch สำหรับเปิดเครื่องมือหรือควบคุม flow การรันบน Windows |
| L0024 | `if not defined PYTHON_CMD where python >nul 2>nul && set "PYTHON_CMD=python"` | ตรวจเงื่อนไขใน batch ก่อนเลือกทำคำสั่ง เช่น ถ้าไม่มี Python หรือ port ถูกใช้ |
| L0025 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งคำสั่งใน batch file ให้อ่านง่าย |
| L0026 | `if not defined PYTHON_CMD (` | ตรวจเงื่อนไขใน batch ก่อนเลือกทำคำสั่ง เช่น ถ้าไม่มี Python หรือ port ถูกใช้ |
| L0027 | `  echo.` | พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command |
| L0028 | `  echo [BW-LAUNCH-002] Python 3 was not found.` | พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command |
| L0029 | `  echo Background Worker requires http:// mode. Install Python 3 or use GitHub Pages.` | พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command |
| L0030 | `  echo The program will NOT open index.html directly because file:// can limit Worker and storage.` | พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command |
| L0031 | `  pause` | หยุดรอผู้ใช้กดปุ่ม เพื่อให้เห็นข้อความก่อนหน้าต่างปิด |
| L0032 | `  exit /b 2` | ออกจาก batch พร้อม exit code เพื่อบอกว่าสำเร็จหรือผิดพลาด |
| L0033 | `)` | คำสั่ง Batch สำหรับเปิดเครื่องมือหรือควบคุม flow การรันบน Windows |
| L0034 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งคำสั่งใน batch file ให้อ่านง่าย |
| L0035 | `echo Starting BLACKWOLF V3.5.8 on %URL%` | พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command |
| L0036 | `REM STEP 3: เปิด server window แล้ว bind เฉพาะ 127.0.0.1 เพื่อใช้งานในเครื่อง` | คอมเมนต์ Batch เดิม ใช้อธิบายขั้นตอน ไม่ถูกรันเป็นคำสั่ง |
| L0037 | `start "BLACKWOLF V3.5.8 Server" cmd /k "cd /d ""%~dp0"" ^&^& %PYTHON_CMD% -m http.server %PORT% --bind 127.0.0.1"` | เปิดหน้าต่างใหม่หรือเปิด URL/โปรแกรมตามคำสั่ง |
| L0038 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งคำสั่งใน batch file ให้อ่านง่าย |
| L0039 | `REM STEP 4: รอ server พร้อมก่อนเปิด browser` | คอมเมนต์ Batch เดิม ใช้อธิบายขั้นตอน ไม่ถูกรันเป็นคำสั่ง |
| L0040 | `set "READY="` | ตั้งค่าตัวแปรใน batch file เพื่อนำไปใช้ในคำสั่งถัดไป |
| L0041 | `for /L %%I in (1,1,15) do (` | เริ่ม loop ใน batch เช่น ไล่หา port ว่างหรือรอ server พร้อม |
| L0042 | `  powershell.exe -NoLogo -NoProfile -Command "try { $r=Invoke-WebRequest -UseBasicParsing -TimeoutSec 1 '%URL%'; if($r.StatusCode -ge 200){exit 0}else{exit 1...` | เรียก PowerShell จาก batch เพื่อทำงานที่ command prompt ทำเองไม่สะดวก |
| L0043 | `  if not errorlevel 1 set "READY=1"` | ตรวจเงื่อนไขใน batch ก่อนเลือกทำคำสั่ง เช่น ถ้าไม่มี Python หรือ port ถูกใช้ |
| L0044 | `  if defined READY goto :OPEN` | ตรวจเงื่อนไขใน batch ก่อนเลือกทำคำสั่ง เช่น ถ้าไม่มี Python หรือ port ถูกใช้ |
| L0045 | `  timeout /t 1 /nobreak >nul` | คำสั่ง Batch สำหรับเปิดเครื่องมือหรือควบคุม flow การรันบน Windows |
| L0046 | `)` | คำสั่ง Batch สำหรับเปิดเครื่องมือหรือควบคุม flow การรันบน Windows |
| L0047 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งคำสั่งใน batch file ให้อ่านง่าย |
| L0048 | `echo [BW-LAUNCH-003] Local server did not become ready within 15 seconds.` | พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command |
| L0049 | `echo Check the server window for details.` | พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command |
| L0050 | `pause` | หยุดรอผู้ใช้กดปุ่ม เพื่อให้เห็นข้อความก่อนหน้าต่างปิด |
| L0051 | `exit /b 3` | ออกจาก batch พร้อม exit code เพื่อบอกว่าสำเร็จหรือผิดพลาด |
| L0052 | `(บรรทัดว่าง)` | บรรทัดว่าง แบ่งคำสั่งใน batch file ให้อ่านง่าย |
| L0053 | `:OPEN` | ประกาศ label สำหรับใช้กับ goto เพื่อกระโดดมาทำงานจุดนี้ |
| L0054 | `start "" "%URL%"` | เปิดหน้าต่างใหม่หรือเปิด URL/โปรแกรมตามคำสั่ง |
| L0055 | `echo BLACKWOLF opened successfully. Keep the server window open.` | พิมพ์ข้อความสถานะให้ผู้ใช้เห็นในหน้าต่าง command |
| L0056 | `exit /b 0` | ออกจาก batch พร้อม exit code เพื่อบอกว่าสำเร็จหรือผิดพลาด |
