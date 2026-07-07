# BLACKWOLF V3.5.8 — SAFE GUARD R1 Change Report (TH)

วันที่สร้าง: 2026-07-07

## สรุปคำตอบตรงคำถาม

ผมแก้เฉพาะส่วนที่ลดความเสี่ยงและไม่แตะ logic Excel/Pivot/XML ได้แก่ `app.js`, `worker.js`, `db.js`, `START_LOCAL_WEB.bat`, `index.html`, `styles.css`, และ `css/components.css`

ผม **ไม่ได้แก้ `engine.js`** เพราะเป็นชั้นที่เกี่ยวกับ Master / ISSUE / PV / Report / Pivot XML / Formula โดยตรง ความเสี่ยง Regression สูงมาก ถ้าจะแก้ต้องมีไฟล์ตัวอย่างและต้องเทียบ output Excel ก่อน-หลังทุก sheet

## สิ่งที่ทำแล้วแบบ Low Impact

### 1) กัน Event ซ้ำ / Double Click / Action ชนกัน — `app.js`

| ไฟล์/บรรทัดใหม่ | แก้ไข | Logic แบบทีละขั้น | ผลกระทบต่อ Excel |
|---|---|---|---|
| `app.js:99-103` | เพิ่ม `actionLocks`, `confirmPending`, `boundEvents` | สร้างตัวแปรกลางเพื่อจำว่า action ไหนกำลังทำงานอยู่ | ไม่มี |
| `app.js:121-122` | เพิ่ม `isUiBusy()` | เช็กว่า Upload / Preflight / Run / History / Diagnostic / Report Image กำลังทำงานหรือไม่ | ไม่มี |
| `app.js:452-456` | Upload guard | ถ้ากำลัง Run อยู่ จะไม่รับ Upload ใหม่ / ถ้ากำลังจำแนกไฟล์อยู่ จะไม่เริ่มรอบใหม่ | ไม่มี |
| `app.js:506` | Unlock Upload ใน `finally` | ไม่ว่างานสำเร็จหรือ error จะปลดล็อก Upload เสมอ และ clear input เพื่อให้เลือกไฟล์เดิมซ้ำได้ | ไม่มี |
| `app.js:904-931` | Preflight lock | กันกด Preflight ซ้ำเร็ว ๆ และปลดล็อกเสมอใน `finally` | ไม่มี |
| `app.js:939-966` | Run lock | กันกด Run ซ้ำ / Run ชนกัน | ไม่มี |
| `app.js:1610-1612` | Bind guard | ถ้า `bind()` ถูกเรียกซ้ำ จะไม่ผูก `addEventListener` ซ้ำ | ไม่มี |

### 2) UI State Lock ระหว่าง Processing — `app.js` + CSS

| ไฟล์/บรรทัดใหม่ | แก้ไข | Logic แบบทีละขั้น | ผลกระทบต่อ Excel |
|---|---|---|---|
| `app.js:604-613` | ปิด input/ปุ่มขณะ busy | ถ้าระบบกำลังทำงาน จะ disable Upload, Auto-Mail textarea, manual date, clear buttons, download และ save image | ไม่มี |
| `styles.css:68-75` | เพิ่ม style fallback | ทำให้ Drop Zone ดูจางและกดไม่ได้ตอน busy | ไม่มี |
| `css/components.css:19-26` | เพิ่ม style ในไฟล์ component | ทำให้ UI สอดคล้องกับ disabled state | ไม่มี |

### 3) Download ซ้ำ / Object URL Memory — `app.js`

| ไฟล์/บรรทัดใหม่ | แก้ไข | Logic แบบทีละขั้น | ผลกระทบต่อ Excel |
|---|---|---|---|
| `app.js:992-1005` | ปรับ `downloadBlob()` | 1) ถ้าไม่มี blob ให้หยุด 2) ถ้ากำลัง Run/Classify ให้ไม่ดาวน์โหลด 3) ถ้าไฟล์เดิมกำลัง download ให้กันซ้ำ 4) สร้าง Object URL 5) click download 6) remove anchor 7) revoke Object URL ใน `setTimeout` | ไม่มี |
| `app.js:1267-1281` | Save Report Image lock | กันกดบันทึกรูปรายงานซ้ำ และปลดล็อกเสมอหลังจบ | ไม่มี |

### 4) Modal ซ้อน — `app.js`

| ไฟล์/บรรทัดใหม่ | แก้ไข | Logic แบบทีละขั้น | ผลกระทบต่อ Excel |
|---|---|---|---|
| `app.js:1345-1355` | `confirmAction()` guard | ถ้ามี Confirm modal เปิดอยู่แล้ว จะไม่เปิด modal ตัวที่สองซ้อน | ไม่มี |
| `app.js:1376` | `openGuide()` ปิด drilldown ก่อน | เปิดคู่มือแล้วปิด preview drilldown เพื่อไม่ให้ modal ซ้อน | ไม่มี |
| `app.js:1462` | `openPreviewDrilldown()` ปิด guide ก่อน | เปิด drilldown แล้วปิด guide ก่อน | ไม่มี |

### 5) Worker Error / Unknown Message / Global Promise — `worker.js`

| ไฟล์/บรรทัดใหม่ | แก้ไข | Logic แบบทีละขั้น | ผลกระทบต่อ Excel |
|---|---|---|---|
| `worker.js:25` | เพิ่ม `busyStage` | จำ stage ล่าสุด เช่น ping / load-file / validate / run | ไม่มี |
| `worker.js:35-41` | เพิ่ม global worker error handlers | ถ้า Worker error หรือ Promise หลุดนอก catch จะพยายามส่ง error กลับ UI แทนเงียบ | ไม่มี |
| `worker.js:62-65` | Validate message | ถ้า message ไม่มี `id` หรือ `type` จะตอบ error ทันที | ไม่มี |
| `worker.js:75` และ `worker.js:181` | set/clear stage | เริ่มงานแล้วจำ stage / จบงานแล้วคืนเป็น idle | ไม่มี |

### 6) IndexedDB / db.js เสียหรือโดนแท็บอื่นค้าง — `db.js`

| ไฟล์/บรรทัดใหม่ | แก้ไข | Logic แบบทีละขั้น | ผลกระทบต่อ Excel |
|---|---|---|---|
| `db.js:60` | `onversionchange` close DB | ถ้า Browser แจ้งว่า DB version เปลี่ยน จะปิด connection เก่าแบบสุภาพ | ไม่มี |
| `db.js:61` | `onblocked` error | ถ้าแท็บเก่าถือ DB ค้างอยู่ จะตอบ error อ่านง่าย แทนค้างเงียบ | ไม่มี |

### 7) START_LOCAL_WEB.bat Debug Log + Timeout — `START_LOCAL_WEB.bat`

| ไฟล์/บรรทัดใหม่ | แก้ไข | Logic แบบทีละขั้น | ผลกระทบต่อ Excel |
|---|---|---|---|
| `START_LOCAL_WEB.bat:41` | เก็บ startup time | จำเวลาเปิดระบบไว้ใน log | ไม่มี |
| `START_LOCAL_WEB.bat:69-71` | อ่าน Python version | แสดง Python ที่ใช้จริงเพื่อช่วย debug | ไม่มี |
| `START_LOCAL_WEB.bat:75-78` | เพิ่ม log port/python/time | ผู้ใช้เห็น Port, Python, Startup Time ทันที | ไม่มี |
| `START_LOCAL_WEB.bat:90` | เพิ่มรอ server จาก 15 เป็น 30 วินาที | ลด false fail สำหรับเครื่องช้า / antivirus scan | ไม่มี |
| `START_LOCAL_WEB.bat:104` | ข้อความ timeout เป็น 30 วินาที | ให้ข้อความตรงกับ logic | ไม่มี |

### 8) Cache Bust เพื่อให้ Browser โหลดไฟล์แก้ล่าสุด — `index.html`, `app.js`, `worker.js`

| ไฟล์/บรรทัดใหม่ | แก้ไข | Logic แบบทีละขั้น | ผลกระทบต่อ Excel |
|---|---|---|---|
| `index.html:25,323,326,327,329,330,331` | เปลี่ยน query string เป็น `3.5.8-safe-r1` | บังคับ browser โหลดไฟล์ใหม่ ไม่ใช้ cache เก่า | ไม่มี |
| `app.js:732` | Worker URL เป็น `worker.js?v=3.5.8-safe-r1` | บังคับโหลด worker ใหม่ | ไม่มี |
| `worker.js:16` | importScripts query string ใหม่ | บังคับโหลด dependency ผ่าน cache key ใหม่ | ไม่มี |

## สิ่งที่ผมตั้งใจไม่ทำ เพราะมีโอกาสกระทบงาน

1. ไม่แก้ `engine.js`
2. ไม่แก้ Pivot XML / sharedItems / cacheDefinition / relationship XML
3. ไม่แก้ formula generation
4. ไม่แก้ mapping column / workbook structure
5. ไม่แก้ vendor library เช่น `xlsx-js-style.min.js`, `jszip.min.js`, `html2canvas.min.js`
6. ไม่เพิ่ม logic database แบบใหม่ที่เปลี่ยน schema
7. ไม่เปลี่ยน username/password/hash

## สิ่งที่ตรวจแล้ว

- `node --check app.js` ผ่าน
- `node --check worker.js` ผ่าน
- `node --check db.js` ผ่าน
- `node --check auth.js` ผ่าน
- `node --check config.js` ผ่าน
- ตรวจ marker สำคัญครบ: action lock, upload guard, download lock, worker global error, db blocked, launcher timeout, cache bust

หมายเหตุ: ผมลองเตรียม browser smoke test ด้วย Playwright แต่ environment นี้ไม่มี Chromium runtime ที่ติดตั้งไว้ จึงยังไม่ได้ยืนยันผ่าน browser จริง ต้องทดสอบบน Chrome/Edge เครื่องใช้งานจริงอีกครั้ง

## Checklist ทดสอบจริงหลังนำ ZIP ไปใช้

### Level 1 — ไม่ต้องใช้ไฟล์ใหญ่
1. เปิดด้วย `START_LOCAL_WEB.bat`
2. ดู log ต้องเห็น Port, Python, Startup Time
3. Login
4. กดปุ่มคู่มือ แล้วเปิด Preview drilldown ต้องไม่ซ้อนกัน
5. กด Diagnostic ZIP รัว ๆ ต้องสร้างแค่รอบเดียว

### Level 2 — Upload / Preflight / Run
1. Upload ไฟล์ชุดปกติ
2. ระหว่างกำลังจำแนกไฟล์ ลองกด Upload ซ้ำ ต้องขึ้นเตือนและไม่เริ่มซ้อน
3. กด Preflight รัว ๆ ต้องไม่เริ่มหลายรอบ
4. กด Run รัว ๆ ต้องไม่เริ่มหลายรอบ
5. ระหว่าง Run ต้อง Upload / Clear / Download ถูกปิด

### Level 3 — Download / History
1. หลัง Run สำเร็จ กด Download Master รัว ๆ ต้องไม่เกิดหลาย Object URL ซ้อน
2. กด Download ISSUE รัว ๆ ต้องไม่ error
3. เปิด History ระหว่างระบบ busy ต้องขึ้นเตือน
4. ลบ History แล้ว Confirm modal ต้องไม่ซ้อน

### Level 4 — Edge Case ที่ยังต้องยืนยันกับไฟล์จริง
1. Upload ไฟล์ใหญ่มาก 300-500 MB
2. ปิด Browser ระหว่าง Worker ทำงาน
3. Refresh หน้าเว็บระหว่าง Worker ทำงาน
4. Worker crash ระหว่าง Export
5. ไฟล์ Excel เสียตั้งแต่ต้น
6. Header สลับตำแหน่ง
7. Unicode ไทย/จีน/ญี่ปุ่น/Emoji

## ผลกระทบหากไฟล์เสีย หลังแก้รอบนี้

- ถ้า `app.js` เสีย: Login อาจยังผ่าน แต่ Upload/Progress/Dashboard/Download/History ใช้งานไม่ได้
- ถ้า `worker.js` เสีย: UI ยังเปิดได้ แต่ Background Worker ใช้ไม่ได้ อาจ fallback หรือค้างตาม browser
- ถ้า `db.js` เสีย: Run History ใช้ไม่ได้ แต่ Engine/Excel ยังประมวลผลได้ถ้า UI ทำงาน
- ถ้า `START_LOCAL_WEB.bat` เสีย: เปิด local server ไม่ได้ แต่ไฟล์เว็บยังอยู่
- ถ้า `engine.js` เสีย: กระทบหนักที่สุด เพราะ Master/ISSUE/PV/Report/Pivot/XML อาจผิดทั้งหมด — รอบนี้ไม่ได้แตะ

## ไฟล์อ้างอิงในชุดนี้

- `SAFE_GUARD_R1_FULL_DIFF.patch` = diff เต็มทุกบรรทัดที่แก้
- `FILE_MANIFEST_SHA256_SAFE_GUARD_R1.txt` = hash หลังแก้
- `SAFE_GUARD_R1_TEST_CHECKLIST_TH.md` = checklist ทดสอบจริงแบบสั้น
