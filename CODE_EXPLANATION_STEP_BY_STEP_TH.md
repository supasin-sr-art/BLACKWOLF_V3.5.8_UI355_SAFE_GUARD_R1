# BLACKWOLF V3.5.8 — Code Explanation แบบ Step-by-Step (TH)

ไฟล์นี้เพิ่มมาเพื่ออธิบาย logic ทั้งระบบแบบอ่านตามลำดับ โดยไม่ต้องเดาจากโค้ดอย่างเดียว

## หลักการใส่คอมเมนต์
- JavaScript ใช้ `//` ตามที่ร้องขอ เพราะเป็น syntax comment ที่ถูกต้องของ JS
- HTML ใช้ `<!-- ... -->`, CSS ใช้ `/* ... */`, PowerShell ใช้ `#`, Batch ใช้ `REM` เพื่อไม่ให้โปรแกรมพัง
- Vendor minified, Excel, PDF, รูปภาพ และ license ไม่ถูกแก้ เพราะเป็น third-party/binary และการแทรก comment เสี่ยงทำให้ไฟล์เสีย

## ภาพรวมการทำงานตั้งแต่เปิดโปรแกรมจนได้ไฟล์
### 1. เปิดระบบ
ผู้ใช้เปิดผ่าน START_LOCAL_WEB.bat หรือ web server อื่น Browser โหลด index.html เป็นโครงหน้าจอหลัก

### 2. โหลดหน้าตา
index.html โหลด styles.css ซึ่ง import CSS ย่อย เช่น base, report, history, settings, responsive

### 3. โหลด library
Browser โหลด xlsx-js-style สำหรับอ่าน/เขียน Excel, jszip สำหรับแก้ xlsx ภายใน zip, html2canvas สำหรับจับภาพ report

### 4. โหลด config
config.js สร้าง BLACKWOLF_CONFIG เช่น version, dbName, retentionDays และชื่อไฟล์ output

### 5. โหลด engine
engine.js สร้าง BlackwolfEngine ซึ่งมี logic อ่าน Excel, reconcile, classify, build workbook และ patch pivot

### 6. โหลด DB
db.js สร้าง BlackwolfDB สำหรับเก็บ Run History ใน IndexedDB ของ Browser

### 7. โหลด access profile
access-profile.js ให้ hash/salt/iterations สำหรับตรวจ login โดยไม่เก็บรหัสผ่านจริง

### 8. Login
auth.js อ่าน username/password → normalize → คำนวณ hash → เทียบแบบ constant-time → ถ้าผ่านจึงปลดล็อก app-shell

### 9. เริ่ม UI
app.js init() โหลด setting, เปิด worker, ล้าง history หมดอายุ, bind ปุ่ม/drag-drop และ render หน้าจอแรก

### 10. แนบไฟล์
ผู้ใช้ลากไฟล์เข้า loadFiles() → detectFileRole() ส่งไฟล์ให้ engine ช่วยดูโครงสร้าง workbook/header

### 11. Preflight
runPreflight() ส่งคำสั่งไป worker → worker เรียก BlackwolfEngine.preflight() เพื่อตรวจไฟล์, วันที่, template และความพร้อมก่อนรันจริง

### 12. Run จริง
runWorkflow() เตรียมไฟล์เป็น ArrayBuffer → worker เรียก BlackwolfEngine.run() และส่ง progress/heartbeat กลับ UI

### 13. Engine อ่านข้อมูล
engine อ่าน Master/Daily/Issue/M190/SM/Blacklist/Auto-Mail → normalize header/date/id → แปลงเป็น rows object

### 14. รวมและตัดรายการ
reconcileRows() รวม backlog เดิมกับรอบใหม่ ใช้ stable identity กันรายการซ้ำ และตัดรายการที่ออกกรมธรรม์/control แล้ว

### 15. จัดสถานะ
classifyPending() เติมสถานะไม่สมบูรณ์, Blacklist, ติดปัญหา E, ไม่ issue, aging และเหตุผลที่เกี่ยวข้อง

### 16. สรุป KPI
summarize() สร้างยอดรวมตาม status/aging/agency/premium เพื่อใช้ Dashboard, Report, PV

### 17. สร้าง Excel
buildPivotPreservingMaster() หรือ buildMasterWorkbook() สร้าง Master; buildIssueWorkbook() สร้าง ISSUE

### 18. Patch Pivot/XML
engine ใช้ JSZip แก้ worksheet XML, pivot cache, table range, print area และเปิด drill-down เพื่อให้ PV/PV Final/Report ใช้ต่อได้

### 19. Validate
assertPvReportReconciliation() และ validate* ตรวจยอดและโครงสร้าง pivot ก่อนส่งไฟล์ออก

### 20. ส่งผลกลับ UI
worker ส่ง blobs/summary/rows กลับ app.js → UI render dashboard/results/report และ saveRunRecord() เก็บ history 4 วัน

### 21. ดาวน์โหลด
downloadMaster()/downloadIssue() สร้าง object URL ชั่วคราวแล้ว download ไฟล์ที่ชื่อมีวันที่ run

### 22. Optional Finalizer
FINALIZE_BLACKWOLF_EXCEL.bat เรียก PowerShell เปิด Excel จริงเพื่อ refresh/verify pivot และบันทึก *_FINAL.xlsx

## หน้าที่ของไฟล์หลัก
### access-profile.js
1. ไฟล์นี้เก็บข้อมูลยืนยันตัวตนแบบ Hash เท่านั้น ไม่เก็บ Username/Password จริง
2. Browser จะนำค่าจากไฟล์นี้ไปเทียบกับสิ่งที่ผู้ใช้กรอกใน auth.js
3. Object.freeze ใช้ล็อกค่า profile ไม่ให้สคริปต์อื่นแก้ระหว่างรัน

### config.js
1. ไฟล์ตั้งค่ากลางของระบบ เช่น version, namespace, ชื่อฐานข้อมูล, อายุ Run History และชื่อไฟล์ผลลัพธ์
2. ทุกโมดูลอ่านค่าจาก BLACKWOLF_CONFIG เพื่อลดการ hard-code หลายจุด
3. Object.freeze ป้องกันการแก้ config ระหว่างโปรแกรมทำงาน

### db.js
1. ไฟล์จัดการ Local Archive ด้วย IndexedDB ใน Browser
2. เก็บประวัติการรัน ผลลัพธ์ และลบข้อมูลหมดอายุอัตโนมัติตาม retentionDays
3. ทุกฟังก์ชันถูก export ผ่าน global.BlackwolfDB เพื่อให้ app.js เรียกใช้

### auth.js
1. ไฟล์ควบคุมหน้าล็อกอินทั้งหมด ตั้งแต่จำชื่อผู้ใช้ ตรวจ Hash และปลดล็อก UI
2. ใช้ Web Crypto API เพื่อคำนวณ SHA-256/PBKDF2 ใน Browser โดยไม่ส่งข้อมูลออกนอกเครื่อง
3. เก็บเฉพาะ session การล็อกอินและชื่อผู้ใช้ที่เลือกจำ ไม่เก็บรหัสผ่านจริง

### worker.js
1. ไฟล์ Web Worker ใช้รันงานหนักแยกจากหน้าจอหลัก เพื่อให้ UI ไม่ค้างระหว่างอ่าน/สร้าง Excel
2. รับคำสั่งจาก app.js แล้วเรียก BlackwolfEngine.preflight หรือ BlackwolfEngine.run
3. ส่ง progress, heartbeat, result และ error กลับไปให้ UI แสดงสถานะ

### app.js
1. ไฟล์ควบคุมหน้าจอหลักของ BLACKWOLF ทั้งหมด เช่น ปุ่ม, อัปโหลดไฟล์, progress, dashboard, results, report, history และ settings
2. ทำหน้าที่เป็นตัวกลางระหว่างผู้ใช้, Web Worker, IndexedDB และ Engine
3. ไม่ได้คำนวณ Excel หนัก ๆ เอง แต่ส่งงานให้ worker/engine เพื่อความเร็วและลดการค้าง

### engine.js
1. ไฟล์หัวใจของระบบ ใช้อ่าน Excel, normalize header, รวมข้อมูล, ตัดรายการที่ออกกรมธรรม์แล้ว, สร้าง Master/ISSUE และจัดการ Pivot/XML
2. แบ่งงานเป็นชั้น ๆ: helper → extractor → reconcile/classify → summarize → workbook builder → pivot patcher → validation → run
3. export BlackwolfEngine ให้ app.js/worker.js ใช้ และมี internals สำหรับ preview/diagnostic บางส่วน

### CREATOR_ACCESS_PROFILE_BUILDER.html
1. เครื่องมือออฟไลน์สำหรับผู้สร้างระบบ ใช้สร้าง access-profile.js ใหม่จาก Username/Password
2. สร้าง Salt + Hash ใน Browser แล้วดาวน์โหลดไฟล์ JS โดยไม่บันทึกรหัสผ่านจริง
3. ใช้เฉพาะตอนออกหรือเปลี่ยน Access Profile

## Function Index แบบละเอียด
### access-profile.js
ไม่มี function หลัก เป็นไฟล์ค่าคงที่/config

### config.js
ไม่มี function หลัก เป็นไฟล์ค่าคงที่/config

### db.js
- `open` — เปิด IndexedDB และสร้าง object store/indexes ถ้ายังไม่มี
- `transact` — ครอบการทำงาน IndexedDB transaction เพื่อให้ resolve/reject เป็น Promise เดียวกัน
- `put` — บันทึกหรืออัปเดต record ใน Local Archive
- `get` — ดึง record ตาม id จาก Local Archive
- `list` — ดึง record ทั้งหมดและเรียงจากใหม่ไปเก่า
- `remove` — ลบ record ตาม id
- `clear` — ล้าง record ทั้งหมดใน Local Archive
- `pruneExpired` — ลบ Run History ที่เกินวันหมดอายุ
- `count` — นับจำนวน record ใน Local Archive
- `storageInfo` — อ่าน usage/quota/persistent storage ของ Browser
- `requestPersistent` — ขอ Browser ให้เก็บ storage แบบ persistent เพื่อลดโอกาสโดนลบอัตโนมัติ

### auth.js
- `bytesFromBase64` — แปลง Base64 เป็น byte array เพื่อใช้กับ Web Crypto
- `base64FromBytes` — แปลง byte array กลับเป็น Base64 สำหรับเทียบกับค่า Hash ที่เก็บไว้
- `constantTimeEqual` — เทียบ string แบบลด timing leak โดยวนเทียบทุกตำแหน่งก่อนคืนผล
- `normalizeUsername` — ปรับ Username ให้เป็นมาตรฐานเดียวกันก่อนคำนวณ hash
- `sha256Base64` — คำนวณ SHA-256 ของข้อความแล้วคืนเป็น Base64
- `derivePasswordHash` — คำนวณ PBKDF2-SHA-256 จาก password/salt/iterations ตาม profile
- `verifyCredentials` — ตรวจ Username และ Password ที่ผู้ใช้กรอกกับ Hash ใน access-profile.js
- `readRememberedUsername` — อ่านชื่อผู้ใช้ที่เคยเลือกจำไว้จาก localStorage
- `saveRememberedUsername` — บันทึกชื่อผู้ใช้ลง localStorage โดยไม่บันทึกรหัสผ่าน
- `clearRememberedUsername` — ลบชื่อผู้ใช้ที่เคยจำไว้
- `applyRememberedUsername` — เติมชื่อผู้ใช้ที่เคยจำไว้กลับเข้า form login
- `setAuthenticated` — ล็อก/ปลดล็อกหน้า app และบันทึกสถานะใน sessionStorage
- `clearError` — ล้างข้อความ error และกรอบแดงในฟอร์ม login
- `showError` — แสดง error login และเลือกช่อง password เพื่อให้กรอกใหม่ได้ทันที
- `setSubmitting` — เปลี่ยนสถานะปุ่ม login ระหว่างกำลังตรวจรหัส
- `initAuth` — เริ่มระบบ login ผูก event submit/show password และ logout

### worker.js
- `reply` — ส่งข้อความกลับจาก worker ไป main thread พร้อม transfer object ถ้ามี
- `commandErrorCode` — แปลงชนิดคำสั่ง worker เป็น error code มาตรฐาน
- `beginHeartbeat` — ส่ง heartbeat เป็นระยะเพื่อบอก UI ว่า worker ยังไม่ค้าง

### app.js
- `$` — ตัวช่วยเลือก element ตัวแรกจาก CSS selector เพื่อลดการเขียน document.querySelector ซ้ำ
- `$$` — ตัวช่วยเลือก elements หลายตัวแล้วแปลงเป็น Array เพื่อให้ forEach/map ได้ทันที
- `on` — ผูก event ให้ element แบบปลอดภัย ถ้า selector ไม่เจอจะไม่ทำให้โปรแกรม error
- `yieldUi` — พักงานสั้น ๆ เพื่อคืนจังหวะให้ Browser วาดหน้าจอและแสดง progress
- `appError` — สร้าง Error ที่มี error code มาตรฐาน เพื่อให้ผู้ใช้เอารหัสไปค้นหาสาเหตุได้
- `errorText` — แปลง Error เป็นข้อความอ่านง่าย โดยรวม error code กับ message
- `esc` — escape ข้อความก่อนใส่ HTML เพื่อลดโอกาส HTML แทรกผิดรูปหรือ XSS จากข้อมูลไฟล์
- `fmt` — แสดงตัวเลขรูปแบบไทย เช่น ใส่ comma ให้อ่านง่าย
- `money` — แสดงจำนวนเงิน/เบี้ยประกัน โดยคุมจำนวนทศนิยมให้เหมาะกับรายงาน
- `bytes` — แปลงจำนวน byte เป็น B/KB/MB/GB เพื่อใช้ในหน้าสถานะระบบ
- `toast` — แสดงกล่องแจ้งเตือนสั้น ๆ มุมหน้าจอ แล้วซ่อนอัตโนมัติ
- `setStatus` — อัปเดต status chip ด้านบนของระบบ เช่น Ready, Running, Error
- `pageTitles` — คืนชื่อหน้าเมนูตามภาษาที่เลือก
- `applyLanguage` — เปลี่ยนภาษา UI และบันทึกค่าลง localStorage
- `applyTheme` — เปลี่ยนธีม light/dark และบันทึกค่าลง localStorage
- `setPage` — เปลี่ยนหน้าที่กำลังแสดง และ sync สถานะปุ่มเมนู
- `updateClock` — อัปเดตวันเวลาแบบ real-time บน topbar
- `manualStartDate` — อ่าน Manual Start Date จากช่องกรอก เพื่อใช้กรณี Master ไม่มี Date เดิม
- `diagnosticTimestamp` — จัดรูปแบบเวลาสำหรับไฟล์ diagnostic package
- `diagnosticSafeValue` — แปลงค่าที่อาจใหญ่หรือซับซ้อนให้ปลอดภัยก่อนใส่ diagnostic JSON
- `recordDiagnosticError` — บันทึก error ล่าสุดลง state เพื่อ export ให้ตรวจย้อนหลังได้
- `selectedFileMetadata` — สรุปรายละเอียดไฟล์ที่เลือก เช่น ชื่อ ขนาด เวลาแก้ไขล่าสุด
- `compactHistoryRecord` — ย่อข้อมูล Run History ให้พอแสดงใน UI โดยไม่โหลด blob ใหญ่เกินจำเป็น
- `exportDiagnosticPackage` — สร้างไฟล์ ZIP diagnostic รวมสถานะระบบ ไฟล์ที่เลือก และ error log สำหรับ debug
- `detectFileRole` — ตรวจว่าไฟล์ที่ผู้ใช้ลากเข้ามาเป็น Master/Daily/Issue/M190/SM/Blacklist/Auto-Mail จากโครงสร้างจริง
- `loadFiles` — รับไฟล์จาก input/drop แล้วจัดเข้า role ที่ถูกต้อง พร้อม cache workbook ที่อ่านแล้ว
- `invalidate` — ล้างผล preflight/result เดิมเมื่อไฟล์หรือค่าเปลี่ยน เพื่อกันใช้ผลลัพธ์เก่า
- `memoryCapacityAdvice` — ประเมินความพร้อมด้าน memory/storage ของ Browser ก่อนรันไฟล์ใหญ่
- `renderCapacityHint` — แสดงคำแนะนำพื้นที่/หน่วยความจำบน UI
- `renderFiles` — วาดรายการไฟล์ที่แนบแล้วในหน้า Prepare
- `syncEtl` — อ่าน/ซิงก์ข้อความ Auto-Mail 7.2 จาก textarea เข้าสู่ state
- `refreshReady` — ตรวจว่าไฟล์ขั้นต่ำครบหรือยัง เพื่อเปิด/ปิดปุ่ม Preflight/Run
- `progress` — อัปเดตแถบ progress และข้อความสถานะระหว่างรัน
- `clearWorkerJobTimer` — ล้าง timer timeout ของงาน worker ที่จบแล้วหรือถูกยกเลิก
- `rejectPendingWorkerJobs` — ปฏิเสธ promise ที่รอ worker ทั้งหมดเมื่อ worker พัง/ถูก restart
- `terminateWorker` — ปิด worker เดิมและเคลียร์งานที่ค้าง เพื่อเริ่มใหม่แบบปลอดภัย
- `armWorkerTimeout` — ตั้ง timeout ให้ job ใน worker เพื่อกันงานค้างเงียบ
- `touchWorkerJob` — ต่ออายุ timeout เมื่อ worker ส่ง heartbeat/progress กลับมา
- `initWorker` — สร้าง Web Worker และลง listener รับข้อความ result/progress/error
- `workerRequest` — ส่งคำสั่งไป worker พร้อมรอ promise ตอบกลับ
- `restartWorkerEngine` — restart worker แบบโปรแกรมสั่งหรือผู้ใช้สั่ง
- `manualRestartWorker` — ปุ่มผู้ใช้สำหรับ restart engine เมื่อสงสัยว่า worker ค้าง
- `cancelActiveRun` — ยกเลิกงานที่กำลังรันและคืน UI ให้พร้อมใช้งาน
- `prepareWorkerFiles` — เตรียมไฟล์/ArrayBuffer เพื่อส่งเข้า worker แบบ transfer ได้
- `compactResultForUi` — ย่อผลลัพธ์ที่ใหญ่มากเพื่อเก็บใน state/UI โดยยังคง summary สำคัญ
- `ensureWorkerFiles` — ตรวจและเตรียมไฟล์ก่อนเรียก worker
- `mainPreflight` — แกนหลักของการ preflight ใช้ตรวจไฟล์และข้อมูลก่อนรันจริง
- `runPreflight` — ปุ่ม Preflight: เรียกตรวจไฟล์แล้ว render ผลบนหน้าจอ
- `runWorkflow` — ปุ่ม Run: ส่งงานเข้า engine, รับผลลัพธ์, บันทึก history และ render dashboard/results
- `saveRunRecord` — บันทึกผลการรันลง IndexedDB พร้อมวันหมดอายุ
- `downloadBlob` — ดาวน์โหลด Blob เป็นไฟล์ด้วย temporary object URL
- `downloadMaster` — ดาวน์โหลดไฟล์ Master ที่สร้างจากผล run ล่าสุด
- `downloadIssue` — ดาวน์โหลดไฟล์ ISSUE ที่สร้างจากผล run ล่าสุด
- `renderDashboard` — วาด KPI และกราฟสรุปสำหรับผู้บริหาร
- `renderBars` — วาด bar chart แบบง่ายจากข้อมูล label/value
- `resultStatusClass` — แปลงสถานะของ row เป็น class สีสำหรับตารางผลลัพธ์
- `matchesAgingFilter` — เช็คว่า row ตรงกับ filter ช่วงอายุที่เลือกหรือไม่
- `syncResultFilters` — อัปเดต dropdown/filter ผลลัพธ์ให้สัมพันธ์กับข้อมูลจริง
- `normalizeAlienCode` — normalize alienCode เพื่อค้นหา/เทียบซ้ำแบบไม่ติดช่องว่างหรือ case
- `renderResultStats` — วาดตัวเลข summary ในหน้า results
- `renderResults` — จัดการวาดหน้าผลลัพธ์ทั้งหมด ทั้ง stats, table และ detail
- `renderTable` — วาดตารางรายการค้าง/ผลลัพธ์หลัก
- `renderEmptyResultDetail` — แสดง panel ว่างเมื่อยังไม่ได้เลือก row
- `showResultDetail` — แสดงรายละเอียด row ที่ผู้ใช้เลือกจากตาราง
- `renderReport` — วาด Executive Report จาก summary ล่าสุด
- `captureReport` — จับภาพ report panel ด้วย html2canvas
- `saveReportImage` — ดาวน์โหลดรูปภาพรายงานผู้บริหารเป็น PNG
- `formatHistoryDate` — แสดงวันที่ใน Run History แบบ yyyy-mm-dd
- `formatHistoryTime` — แสดงเวลาใน Run History แบบ HH:mm:ss
- `formatCountdown` — คำนวณเวลานับถอยหลังก่อน Run History ถูกลบ
- `renderHistory` — โหลดและวาด Run History จาก IndexedDB
- `openHistoryRun` — เปิดผล Run เก่าจาก History กลับมาแสดงใน UI
- `confirmAction` — เปิด modal ยืนยันก่อนทำงานเสี่ยง เช่น ล้างข้อมูล
- `refreshSystemStatus` — อัปเดตสถานะ Browser/Worker/Storage ในหน้า Settings
- `openGuide` — เปิดหน้าต่างคู่มือรูปภาพ
- `closeGuide` — ปิดหน้าต่างคู่มือรูปภาพ
- `clearAll` — ล้างไฟล์ที่เลือกและผลลัพธ์ในหน้าจอ โดยไม่ลบไฟล์ต้นฉบับในเครื่อง
- `sampleRows` — สร้างข้อมูลตัวอย่างเพื่อ preview หน้าตา Excel-like เมื่อยังไม่มีผล run
- `previewData` — เลือกข้อมูลที่จะใช้ preview: ผลจริงถ้ามี ไม่งั้นใช้ sample
- `excelTable` — สร้าง HTML table แบบคล้าย Excel จาก headers/rows
- `previewResetDrilldowns` — ล้าง registry สำหรับกด drill-down ใน preview
- `previewRegisterDrilldown` — เก็บรายการย่อยของ block แล้วคืน index สำหรับปุ่ม drill-down
- `previewDrillCell` — สร้าง cell ที่กดดูรายละเอียด block ได้ถ้ามีข้อมูลย่อย
- `previewRowMatchesPv` — เช็คว่า row ตรงกับ block PV ที่ preview อยู่หรือไม่
- `previewPivotLabel` — แสดง label ของ Pivot โดยแทนค่าว่างเป็น (blank)
- `previewDate` — แสดง date สำหรับ preview แบบ dd/mm/yyyy หรือ (blank)
- `previewStatusValue` — ดึงสถานะสำหรับ preview และแทนค่าว่างเป็น (blank)
- `openPreviewDrilldown` — เปิด modal แสดงข้อมูลด้านใน block PV/PV Final/Report
- `closePreviewDrilldown` — ปิด modal drill-down preview
- `renderPvPreview` — วาด preview ของ PV/PV Final พร้อม block drill-down
- `renderPreview` — เลือก preview sheet ที่ผู้ใช้เลือกและวาดออกหน้าจอ
- `renderReportPreview` — วาด preview ของ Report ตาม summary ล่าสุด
- `resetProgram` — รีเซ็ตข้อมูลใน Browser เช่น history, setting, local archive ตามที่ผู้ใช้ยืนยัน
- `bind` — ผูก event ทุกปุ่ม/input/drag-drop ตอนเริ่มโปรแกรม
- `init` — ฟังก์ชันเริ่มต้นของ app: โหลด setting, เปิด worker, prune history, bind event และ render UI แรก

### engine.js
- `text` — แปลงค่าทุกแบบเป็นข้อความสะอาด ตัดช่องว่าง/ขึ้นบรรทัด/Excel _x000D_
- `id` — normalize รหัส/เลขอ้างอิง เช่น ProposalID/Policy ให้ไม่ติด apostrophe หรือ .0 จาก Excel
- `rawKey` — ทำ key สำหรับเทียบชื่อ header/sheet แบบไม่สน case, ช่องว่าง และ separator
- `canonicalHeader` — แปลงชื่อ header ที่เขียนต่างกันให้เป็นชื่อมาตรฐานเดียวกันผ่าน alias map
- `headerKey` — สร้าง key มาตรฐานของ header หลัง canonical แล้ว
- `number` — แปลงค่าเป็นตัวเลข โดยรองรับ comma และค่าว่าง
- `hasValue` — เช็คว่าค่ามีเนื้อหาจริง ไม่ใช่ null/undefined/blank
- `pad` — เติม 0 หน้าเลขวัน/เดือน/เวลาให้ครบ 2 หลัก
- `dateKey` — แปลง Date เป็น yyyy-mm-dd เพื่อใช้ในชื่อไฟล์/เปรียบเทียบ
- `dateDisplay` — แปลง Date เป็น dd/mm/yyyy สำหรับแสดงใน Excel/UI
- `dateTimeText` — แปลง Date เป็น yyyy-mm-dd HH:mm:ss สำหรับ audit/log
- `dateOnly` — ตัดเวลาออก เหลือเฉพาะวันเพื่อคำนวณ aging ให้ตรง
- `excelSerial` — แปลง Date เป็น serial number ของ Excel
- `parseDate` — อ่านวันที่จาก Date object, serial Excel, dd/mm/yyyy, yyyy-mm-dd และปี พ.ศ.
- `daysBetween` — คำนวณจำนวนวันระหว่างวันที่เริ่มต้นกับวันที่ปลายทาง
- `agingRange` — จัดกลุ่มอายุค้างเป็น 1-7, 8-15, 16-30, มากกว่า 30 วัน
- `normalizeStatus` — normalize สถานะแบบข้อความ
- `statusKey` — ทำ key ของสถานะเพื่อเทียบแบบไม่สนช่องว่าง/case
- `unique` — คืน array ที่ไม่ซ้ำโดย normalize id ก่อน
- `sum` — รวมตัวเลขของ field หนึ่งใน rows
- `textLines` — แตกข้อความเป็นบรรทัด รองรับ BOM ตอนต้นไฟล์
- `safeFileName` — ลบอักขระต้องห้ามของชื่อไฟล์ Windows
- `readWorkbook` — อ่านไฟล์ Excel ด้วย XLSX library และเลือกเก็บ source buffer ได้
- `sheetMatrix` — แปลง worksheet เป็น matrix สองมิติแบบ raw
- `headerMap` — สร้าง map จาก header name ไป column index
- `findHeaderInMatrix` — ค้นหา row ที่มี header ตามที่ต้องการภายในช่วง row แรก ๆ
- `findSheet` — เลือก sheet ที่มี header required โดยให้ชื่อ preferred มาก่อน
- `findNamedSheet` — หา sheet จากชื่อแบบ normalize
- `auditValue` — อ่านค่า key/value จาก sheet _Audit
- `masterEngineVersion` — อ่าน version ที่สร้าง Master จาก _Audit หรือ workbook properties
- `assertMasterVersionSafe` — กันการใช้ Master เวอร์ชันเก่าที่รู้ว่ามีปัญหา Status/PV
- `valueAt` — อ่านค่า cell จาก row ด้วย header map
- `firstValue` — อ่านค่าจากหลาย header ที่เป็น alias แล้วคืนตัวแรกที่เจอ
- `fileNameHint` — เดา role จากชื่อไฟล์เฉพาะกรณีโครงสร้างแยกยาก เช่น SM/Blacklist
- `detectWorkbookRole` — ตรวจบทบาท workbook จาก sheet/header ไม่พึ่งชื่อไฟล์เป็นหลัก
- `rowFromMap` — แปลง row matrix เป็น object ตาม header map และ header ที่ต้องการ
- `extractMasterData` — ดึงข้อมูล Data จาก Master เดิมและ normalize column
- `extractMasterMaxDate` — หาวันล่าสุดใน Master เพื่อใช้เป็น start date ต่อเนื่อง
- `extractDaily` — ดึงข้อมูล Daily Report รอบปัจจุบัน
- `filterDailyRows` — กรอง Daily ให้เหลือรายการที่ควรเข้าสู่ flow pending
- `extractIds` — ดึงชุดรหัสจาก workbook ตาม header ที่กำหนด
- `extractControlIds` — ดึง control IDs จาก SM/Blacklist/other control sheets
- `extractIssueEtl` — ดึง Auto-Mail 7.2 / ETL จาก ISSUE workbook เดิมถ้ามี
- `extractIssueCheck` — ดึง Check/M190 จาก ISSUE workbook
- `parseEtl` — อ่านข้อความ Auto-Mail 7.2 รูปแบบ No.PropID:Policy:Group เป็น record
- `rowFingerprint` — สร้างลายเซ็นของ row เพื่อช่วยตรวจ duplicate เชิงข้อมูล
- `stableIdentityToken` — สร้าง token ระบุตัวตนที่เสถียรจากข้อมูลสำคัญ
- `usableStableIdentity` — ตรวจว่า token มีข้อมูลพอจะใช้เทียบ carry-forward ได้หรือไม่
- `rowStableIdentity` — สร้าง identity ของ row จาก CertificateNo หรือ alienCode+ProposalID ตามกฎ
- `earliestDateValue` — เลือกวันที่เก่าที่สุดจากกลุ่ม row เพื่อรักษาอายุค้างเดิม
- `mergeIdentityRows` — รวม row ที่เป็นคน/รายการเดียวกันให้เหลือ record ที่ถูกต้องกว่า
- `analyzeStableDuplicateRows` — วิเคราะห์ duplicate จาก stable identity สำหรับ QA/summary
- `analyzeAlienDuplicates` — วิเคราะห์ alienCode ซ้ำเพื่อเตือนความเสี่ยงข้อมูลซ้ำ
- `reconcileRows` — รวม Master เก่ากับ Daily ใหม่ แล้วตัดรายการที่ออกกรมธรรม์/อยู่ control list
- `reconcileIdRows` — reconcile แบบยึดชุดรหัส ใช้กับ check/control บางประเภท
- `resolveDateRange` — หาวันเริ่มต้น/สิ้นสุดของรอบการประมวลผล
- `missingRequiredFields` — เช็ค field สำคัญที่ขาด เพื่อระบุสถานะไม่สมบูรณ์
- `classifyPending` — จัดประเภท row ค้าง เช่น ไม่สมบูรณ์ Blacklist ติดปัญหา E ไม่ issue
- `pvGroupKey` — สร้าง key สำหรับ group ข้อมูลใน PV/PV Final
- `aggregatePvRows` — รวม rows ตาม key เพื่อทำ pivot-like summary
- `summarize` — สร้าง summary/KPI ทั้งหมดจาก context หลัง reconcile/classify
- `border` — สร้าง style border ของ cell ใน Excel
- `baseStyle` — สร้าง style พื้นฐานของ cell
- `headerStyle` — สร้าง style หัวตาราง Excel
- `setCellStyle` — ใส่ style ให้ cell ถ้ามีอยู่
- `setFormulaCell` — สร้าง cell สูตรพร้อม style และ cached value
- `setValueCell` — สร้าง cell value พร้อม style/type
- `applyGridStyles` — ไล่ใส่ style ให้ range ตารางใน worksheet
- `addSheet` — เพิ่ม worksheet เข้า workbook พร้อมตั้งชื่อ
- `outputAoa` — ฟังก์ชัน outputAoa เป็นส่วนหนึ่งของ flow ใน engine.js ใช้จัดการขั้นตอนย่อยตามชื่อฟังก์ชันนี้
- `dataRowFormulas` — สร้างสูตร P:W/คอลัมน์คำนวณของ Data sheet ต่อ row
- `buildDataSheet` — สร้าง sheet Data ของ Master ใหม่จาก rows ที่ผ่านการคัดแล้ว
- `buildControlSheets` — สร้าง sheet Check/SM/Blacklist/ETL หรือ control sheets ที่ต้องแนบใน workbook
- `pivotLabel` — ปรับ label สำหรับ pivot ให้ค่าว่างเป็น (blank)
- `pvRows` — เตรียม rows สำหรับ PV/PV Final
- `buildPvSheets` — สร้าง PV และ PV Final แบบ workbook ปกติ
- `groupByAging` — group rows ตามช่วง aging
- `groupStatusRows` — group rows ตามสถานะ เพื่อใช้ report
- `buildReportSheet` — สร้าง Report sheet แบบ native worksheet
- `add` — ฟังก์ชัน add เป็นส่วนหนึ่งของ flow ใน engine.js ใช้จัดการขั้นตอนย่อยตามชื่อฟังก์ชันนี้
- `title` — ฟังก์ชัน title เป็นส่วนหนึ่งของ flow ใน engine.js ใช้จัดการขั้นตอนย่อยตามชื่อฟังก์ชันนี้
- `buildAuditSheet` — สร้าง _Audit sheet เก็บ version/summary/removed rows
- `setWorkbookProperties` — ตั้ง metadata ของ workbook เช่น Title/Subject/Created
- `buildMasterWorkbook` — สร้าง Master workbook แบบไม่ใช้ template pivot preserving
- `buildIssueWorkbook` — สร้าง ISSUE workbook พร้อม Data/Check/ETL
- `workbookBlob` — เขียน workbook object เป็น Blob .xlsx
- `xmlEscape` — escape XML special characters ก่อน patch ไฟล์ .xlsx ภายใน ZIP
- `regexEscape` — escape string เพื่อใส่ใน RegExp อย่างปลอดภัย
- `columnName` — แปลง index column เป็นชื่อ Excel column เช่น 0=A, 27=AB
- `xmlCellStyle` — อ่าน style id ของ cell จาก worksheet XML
- `xmlTextCell` — สร้าง XML cell แบบ inline string
- `xmlNumberCell` — สร้าง XML cell แบบ number
- `xmlFormulaCell` — สร้าง XML cell แบบ formula พร้อม cached value
- `replaceWorksheetData` — แทนที่ sheetData/dimension/autoFilter ใน worksheet XML
- `directXmlChildren` — ดึง child XML tag ชั้นเดียวจาก block ที่กำหนด
- `ensureCustomNumberFormat` — เพิ่ม custom number format ใน styles.xml ถ้ายังไม่มี
- `ensureNumberFormatStyle` — เพิ่ม cell style ที่อ้าง custom number format
- `ensureDateStyleMap` — เตรียม map style วันที่เพื่อใช้ตอน patch sheet XML
- `updateTableRange` — อัปเดตช่วง ref ของ Excel table
- `normalizeZipPath` — normalize path ภายใน xlsx zip relationship
- `worksheetRelsPath` — คำนวณ path ของ .rels สำหรับ worksheet หนึ่ง
- `attrFromTag` — อ่าน attribute จาก XML tag ด้วย regex
- `worksheetPathByName` — หา path ของ worksheet จากชื่อ sheet ใน workbook.xml/rels
- `tablePathForWorksheet` — หา table XML ที่ผูกกับ worksheet จาก relationship
- `pivotTemplateRequiredFiles` — ตรวจรายการไฟล์สำคัญที่ template pivot ต้องมี
- `rangeWidth` — คำนวณจำนวน column จาก range เช่น A1:W10
- `relationshipTargets` — อ่าน relationship targets ตาม type ที่ต้องการ
- `inspectPivotTemplateZip` — ตรวจโครงสร้าง pivot template ภายใน zip ก่อน patch
- `inspectPivotTemplateBuffer` — เปิด buffer template เป็น zip แล้ว inspect
- `inspectPivotTemplate` — inspect template จาก workbook หรือ bundled buffer
- `loadBundledPivotTemplate` — โหลด template pivot ที่ bundle มากับ assets
- `resolvePivotTemplateBuffer` — เลือก template buffer จาก master เดิมหรือ bundled template
- `buildDataSheetXml` — สร้าง XML ของ Data sheet ใหม่สำหรับ template preserving
- `buildControlSheetXml` — สร้าง XML ของ control sheet เช่น Check/ETL
- `pvFinalDisplayRows` — เตรียม rows สำหรับ PV Final แสดงผลเหมือน PV
- `buildPvSheetXml` — สร้าง XML ของ PV sheet
- `buildPvFinalSheetXml` — สร้าง XML ของ PV Final sheet
- `upsertXmlAttribute` — เพิ่มหรือแก้ attribute ใน XML root attribute string
- `pivotCacheItem` — สร้าง object item สำหรับ pivot cache
- `pivotCacheItemKey` — สร้าง key กันซ้ำของ pivot cache item
- `pivotCacheDateItem` — สร้าง pivot cache item สำหรับวันที่
- `pivotCacheTextItem` — สร้าง pivot cache item สำหรับข้อความหรือ missing item
- `pivotCacheMixedItem` — เลือกชนิด pivot cache item จากค่าจริง number/date/text/blank
- `orderedUniquePivotItems` — สร้างรายการ unique items ตามลำดับที่ pivot ต้องใช้
- `pivotCacheValueXml` — สร้าง XML ของ cache item แต่ละตัว
- `pivotSharedItemsXml` — สร้าง sharedItems XML ของ pivot cache
- `buildReportPivotCacheSnapshot` — สร้าง snapshot items/index ของ pivot cache สำหรับ Report
- `pivotSharedIndex` — หา index ของ item ใน pivot sharedItems และ throw ถ้าไม่เจอ
- `xmlRootAttributes` — อ่าน attributes ของ pivotTableDefinition root
- `pivotStyleInfoXml` — ดึง style info เดิมของ pivot หรือใส่ค่า default
- `cleanPivotRootAttributes` — ทำความสะอาด attributes ที่ไม่ควรซ้ำก่อน rebuild pivot XML
- `pivotItemsXml` — สร้าง items XML ของ pivot field
- `simplePivotField` — สร้าง pivotField XML แบบสั้น
- `reportDataFieldsXml` — สร้าง dataFields XML สำหรับ Report pivot เช่น Count/Sum
- `reportColumnAxisXml` — สร้าง column axis XML ของ Report pivot
- `buildAgingPivotTableDefinition` — สร้าง pivot table XML สำหรับ aging report
- `buildStatusPivotTableDefinition` — สร้าง pivot table XML สำหรับ status report
- `xmlEmptyCell` — สร้าง XML cell ว่างพร้อม style
- `reportRowXml` — สร้าง XML row ของ Report พร้อมกำหนด height/hidden
- `reportCellStyles` — อ่าน style id จาก row ต้นแบบของ Report
- `reportStyledCells` — สร้าง cells ของ Report โดยคง style และชนิด numeric/formula
- `patchMergeCells` — อัปเดต mergeCells ใน worksheet XML
- `buildCompactReportSheetXml` — สร้าง Report sheet XML แบบ compact พร้อม staging ซ่อนสำหรับ pivot
- `patchPivotLocation` — ปรับตำแหน่ง pivot location ref
- `patchPvPivotPackage` — patch package ของ PV pivot ให้ชี้ข้อมูลใหม่
- `pivotOriginalStartRow` — อ่าน row เริ่มต้นเดิมของ pivot location
- `patchReportPivotPackage` — patch Report pivot package ทั้ง worksheet, cache และ definitions
- `patchReportPrintArea` — ตั้ง print area ของ Report ให้พอดีกับแถวจริง
- `patchPivotCacheSavedData` — อัปเดต pivotCacheDefinition ให้ชี้ source range และ record count ใหม่
- `buildReportPivotCacheDefinition` — สร้าง/ปรับ pivotCacheDefinition สำหรับ Report
- `pivotFieldBlocks` — ดึง pivotField blocks จาก XML เพื่อ validation
- `pivotItemReferences` — อ่าน references ของ item ใน pivotField
- `rowItemReferences` — อ่าน item references ใน rowItems
- `validateReportPivotSemanticPackage` — ตรวจ semantic ของ Report pivot ว่า cache/items/reference สอดคล้อง
- `worksheetHiddenRowSet` — อ่านเลข row ที่ถูกซ่อนใน worksheet XML
- `pivotLocationRows` — อ่าน rows ที่ pivot table วางอยู่
- `validateHiddenReportPivotStaging` — ตรวจว่า staging rows ที่ใช้ feed pivot ถูกซ่อนจริงและไม่ชน report
- `writePivotCacheRecords` — เขียน pivotCacheRecords XML กลับเข้า zip
- `enablePivotDrill` — เปิดคุณสมบัติ drill-down ของ pivot XML
- `buildAuditSheetXml` — สร้าง XML ของ _Audit sheet สำหรับ template preserving path
- `ensureAuditSheet` — เพิ่มหรืออัปเดต _Audit sheet ใน xlsx zip package
- `assertPvReportReconciliation` — ตรวจยอด PV/PV Final/Report ให้ reconcile กันก่อนส่งไฟล์ออก
- `buildPivotPreservingMaster` — สร้าง Master โดย patch จาก template เพื่อรักษา native pivot/drill-down
- `makeRunId` — สร้างรหัส Run เช่น BWyyyymmdd_HHMMSS
- `outputNames` — สร้างชื่อไฟล์ output ตาม base name และวันที่รัน
- `preflight` — ตรวจความพร้อมของไฟล์ ข้อมูล วันที่ และ template ก่อนรันจริง
- `run` — ลำดับงานหลักทั้งหมดของ engine ตั้งแต่อ่านข้อมูลจนสร้าง blobs output
- `progress` — อัปเดตแถบ progress และข้อความสถานะระหว่างรัน

## Trick อ่านโค้ดชุดนี้ไม่ให้หลง
- เริ่มอ่านจาก `index.html` เพื่อเห็นโครงหน้า แล้วไป `config.js` → `auth.js` → `app.js` → `worker.js` → `engine.js` → `db.js`
- ถ้าต้อง debug เรื่อง UI ให้เริ่มที่ `app.js` และ CSS
- ถ้าต้อง debug เรื่องผล Excel, PV, Report ให้เริ่มที่ `engine.js`
- ถ้าต้อง debug ประวัติการรัน ให้ดู `db.js` และ function history ใน `app.js`
- ถ้าต้อง debug login ให้ดู `access-profile.js` + `auth.js` เท่านั้น อย่าใส่รหัสผ่านจริงใน source code
- อย่าแก้ vendor minified โดยตรง ให้เปลี่ยน version library จากแหล่งต้นทางแทน
