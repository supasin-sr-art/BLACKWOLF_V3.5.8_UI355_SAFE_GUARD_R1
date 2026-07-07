# อธิบายบรรทัดต่อบรรทัด: `app.js`

**บทบาทไฟล์:** ตัวควบคุมหน้าเว็บหลัก: ปุ่ม, อัปโหลด, preflight, worker, dashboard, results, report, history, settings

> วิธีอ่าน: ดูเลขบรรทัด L0001, L0002, ... แล้วเทียบกับไฟล์โค้ดต้นฉบับ/ไฟล์ที่ใส่คอมเมนต์แล้วได้ทันที

| บรรทัด | โค้ด | คำอธิบายแบบคนเริ่มจากศูนย์ |
|---:|---|---|
| L0001 | `(function(){` | เริ่ม IIFE/ฟังก์ชันครอบไฟล์ เพื่อแยก scope ไม่ให้ตัวแปรชนกับไฟล์อื่น |
| L0002 | `'use strict';` | เปิด strict mode เพื่อให้ JavaScript จับข้อผิดพลาดเข้มขึ้น เช่น ห้ามใช้ตัวแปรที่ยังไม่ประกาศ |
| L0003 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0004 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0005 | `// BLACKWOLF TEACHING COMMENTS: คอมเมนต์ชุดนี้เพิ่มเพื่ออธิบาย logic สำหรับอ่าน/ดูแลโค้ด` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0006 | `// หลักสำคัญ: คอมเมนต์ขึ้นต้นด้วย // จะไม่ถูกรัน จึงไม่เปลี่ยน behavior ของ JavaScript` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0007 | `// ภาพรวม: ไฟล์ควบคุมหน้าจอหลักของ BLACKWOLF ทั้งหมด เช่น ปุ่ม, อัปโหลดไฟล์, progress, dashboard, results, report, history และ settings` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0008 | `// ภาพรวม: ทำหน้าที่เป็นตัวกลางระหว่างผู้ใช้, Web Worker, IndexedDB และ Engine` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0009 | `// ภาพรวม: ไม่ได้คำนวณ Excel หนัก ๆ เอง แต่ส่งงานให้ worker/engine เพื่อความเร็วและลดการค้าง` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0010 | `// อธิบาย: ตัวช่วยเลือก element ตัวแรกจาก CSS selector เพื่อลดการเขียน document.querySelector ซ้ำ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0011 | `// ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0012 | `const $=(selector,root=document)=>root.querySelector(selector);` | ประกาศตัวแปร $ แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0013 | `// อธิบาย: ตัวช่วยเลือก elements หลายตัวแล้วแปลงเป็น Array เพื่อให้ forEach/map ได้ทันที` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0014 | `// ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0015 | `const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];` | ประกาศตัวแปร $$ แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0016 | `// อธิบาย: ผูก event ให้ element แบบปลอดภัย ถ้า selector ไม่เจอจะไม่ทำให้โปรแกรม error` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0017 | `// ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0018 | `const on=(selector,event,handler)=>{const element=$(selector);if(element)element.addEventListener(event,handler);return element;};` | สร้างตัวช่วยแบบ arrow function ชื่อ on เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0019 | `const CONFIG=window.BLACKWOLF_CONFIG;` | กำหนดค่าคงที่ CONFIG สำหรับใช้เป็นค่ากลางของ flow นี้ |
| L0020 | `const requiredRoles=['master','issue','daily','m190'];` | สร้าง object/array requiredRoles เพื่อเก็บสถานะหรือข้อมูลอ้างอิงที่ UI/ระบบใช้ร่วมกัน |
| L0021 | `const roles=['master','issue','daily','m190','sm','blacklist','etl'];` | สร้าง object/array roles เพื่อเก็บสถานะหรือข้อมูลอ้างอิงที่ UI/ระบบใช้ร่วมกัน |
| L0022 | `const display={master:'ไฟล์หลัก / Master Working File',issue:'ไฟล์หลัก / เช็คสถานะ ISSUE',daily:'Daily Report',m190:'M190 Premium by Policy',sm:'ข้อมูลไม่สมบ...` | สร้าง object/array display เพื่อเก็บสถานะหรือข้อมูลอ้างอิงที่ UI/ระบบใช้ร่วมกัน |
| L0023 | `const RETENTION_MS=CONFIG.retentionDays*24*60*60*1000;` | กำหนดค่าคงที่ RETENTION_MS สำหรับใช้เป็นค่ากลางของ flow นี้ |
| L0024 | `const storage={` | สร้าง object/array storage เพื่อเก็บสถานะหรือข้อมูลอ้างอิงที่ UI/ระบบใช้ร่วมกัน |
| L0025 | `  get:key=>{try{return localStorage.getItem(key);}catch{return null;}},` | อ่านหรือบันทึกข้อมูลชั่วคราวใน Browser เช่น session login หรือค่าที่ผู้ใช้เลือกจำไว้ |
| L0026 | `  set:(key,value)=>{try{localStorage.setItem(key,value);}catch{}},` | อ่านหรือบันทึกข้อมูลชั่วคราวใน Browser เช่น session login หรือค่าที่ผู้ใช้เลือกจำไว้ |
| L0027 | `  remove:key=>{try{localStorage.removeItem(key);}catch{}}` | อ่านหรือบันทึกข้อมูลชั่วคราวใน Browser เช่น session login หรือค่าที่ผู้ใช้เลือกจำไว้ |
| L0028 | `};` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0029 | `const storageKey=name=>\`${CONFIG.storageNamespace}.${name}\`;` | สร้างตัวช่วยแบบ arrow function ชื่อ storageKey เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0030 | `const state={` | สร้าง object/array state เพื่อเก็บสถานะหรือข้อมูลอ้างอิงที่ UI/ระบบใช้ร่วมกัน |
| L0031 | `  files:Object.fromEntries(roles.map(role=>[role,null])),` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L0032 | `  workbooks:{},` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0033 | `  etlText:'',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0034 | `  preflight:null,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0035 | `  result:null,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0036 | `  activePreview:'Report',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0037 | `  worker:null,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0038 | `  workerReady:false,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0039 | `  workerSeq:0,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0040 | `  workerJobs:new Map(),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0041 | `  workerCachedRoles:new Set(),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0042 | `  workerGeneration:0,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0043 | `  workerLastHeartbeat:null,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0044 | `  activeWorkerJobId:null,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0045 | `  cancelRequested:false,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0046 | `  language:storage.get(storageKey('language'))\|\|'th',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0047 | `  running:false,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0048 | `  classifying:false,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0049 | `  diagnosticErrors:[]` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0050 | `};` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0051 | `let toastTimer,historyCountdownTimer,clockTimer,lastProgressAt=0;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0052 | `let selectedDetailIndex=null;` | ประกาศตัวแปร selectedDetailIndex แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0053 | `let previewDrillRegistry=[];` | ประกาศตัวแปร previewDrillRegistry แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0054 | `let previewPvStatusFilter='(All)';` | ประกาศตัวแปร previewPvStatusFilter แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0055 | `// อธิบาย: พักงานสั้น ๆ เพื่อคืนจังหวะให้ Browser วาดหน้าจอและแสดง progress` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0056 | `// ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0057 | `const yieldUi=(milliseconds=0)=>new Promise(resolve=>setTimeout(resolve,milliseconds));` | ประกาศตัวแปร yieldUi แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0058 | `const WORKER_INACTIVITY_TIMEOUTS={ping:4500,'detect-file':180000,'load-file':600000,validate:600000,run:900000,reset:120000};` | กำหนดค่าคงที่ WORKER_INACTIVITY_TIMEOUTS สำหรับใช้เป็นค่ากลางของ flow นี้ |
| L0059 | `// อธิบาย: สร้าง Error ที่มี error code มาตรฐาน เพื่อให้ผู้ใช้เอารหัสไปค้นหาสาเหตุได้` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0060 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0061 | `function appError(code,message,cause){const error=new Error(message);error.code=code\|\|'BW-UNCLASSIFIED';if(cause)error.cause=cause;return error;}` | ประกาศฟังก์ชัน appError เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0062 | `// อธิบาย: แปลง Error เป็นข้อความอ่านง่าย โดยรวม error code กับ message` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0063 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0064 | `function errorText(error){return\`${error?.code?\`[${error.code}] \`:''}${error?.message\|\|String(error\|\|'Unknown error')}\`;}` | ประกาศฟังก์ชัน errorText เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0065 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0066 | `// อธิบาย: escape ข้อความก่อนใส่ HTML เพื่อลดโอกาส HTML แทรกผิดรูปหรือ XSS จากข้อมูลไฟล์` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0067 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0068 | `function esc(value){return String(value??'').replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));}` | ประกาศฟังก์ชัน esc เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0069 | `// อธิบาย: แสดงตัวเลขรูปแบบไทย เช่น ใส่ comma ให้อ่านง่าย` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0070 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0071 | `function fmt(value){return Number(value\|\|0).toLocaleString('th-TH');}` | ประกาศฟังก์ชัน fmt เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0072 | `// อธิบาย: แสดงจำนวนเงิน/เบี้ยประกัน โดยคุมจำนวนทศนิยมให้เหมาะกับรายงาน` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0073 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0074 | `function money(value){return Number(value\|\|0).toLocaleString('th-TH',{minimumFractionDigits:0,maximumFractionDigits:2});}` | ประกาศฟังก์ชัน money เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0075 | `// อธิบาย: แปลงจำนวน byte เป็น B/KB/MB/GB เพื่อใช้ในหน้าสถานะระบบ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0076 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0077 | `function bytes(value){const size=Number(value\|\|0);if(size<1024)return\`${size} B\`;if(size<1048576)return\`${(size/1024).toFixed(1)} KB\`;if(size<1073741824)retu...` | ประกาศฟังก์ชัน bytes เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0078 | `// อธิบาย: แสดงกล่องแจ้งเตือนสั้น ๆ มุมหน้าจอ แล้วซ่อนอัตโนมัติ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0079 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0080 | `function toast(message,milliseconds=3000){const element=$('#toast');element.textContent=message;element.classList.add('show');clearTimeout(toastTimer);toastT...` | ประกาศฟังก์ชัน toast เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0081 | `// อธิบาย: อัปเดต status chip ด้านบนของระบบ เช่น Ready, Running, Error` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0082 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0083 | `function setStatus(label,type=''){const element=$('#globalStatus');element.textContent=label;element.className=\`status-chip ${type}\`;}` | ประกาศฟังก์ชัน setStatus เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0084 | `// อธิบาย: คืนชื่อหน้าเมนูตามภาษาที่เลือก` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0085 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0086 | `function pageTitles(){return state.language==='en'?{prepare:'Prepare & Run',dashboard:'Executive Dashboard',results:'Approval & Download',report:'Executive R...` | ประกาศฟังก์ชัน pageTitles เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0087 | `// อธิบาย: เปลี่ยนภาษา UI และบันทึกค่าลง localStorage` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0088 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0089 | `function applyLanguage(language){state.language=language==='en'?'en':'th';storage.set(storageKey('language'),state.language);const labels=pageTitles();$$('.n...` | ประกาศฟังก์ชัน applyLanguage เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0090 | `// อธิบาย: เปลี่ยนธีม light/dark และบันทึกค่าลง localStorage` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0091 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0092 | `function applyTheme(theme){const normalized=theme==='dark'?'dark':'light';document.body.classList.toggle('dark',normalized==='dark');storage.set(storageKey('...` | ประกาศฟังก์ชัน applyTheme เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0093 | `// อธิบาย: เปลี่ยนหน้าที่กำลังแสดง และ sync สถานะปุ่มเมนู` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0094 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0095 | `function setPage(page){$$('.page').forEach(element=>element.classList.toggle('active',element.id===\`page-${page}\`));$$('.nav').forEach(element=>element.class...` | ประกาศฟังก์ชัน setPage เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0096 | `// อธิบาย: อัปเดตวันเวลาแบบ real-time บน topbar` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0097 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0098 | `function updateClock(){const date=new Date();$('#liveDateTime').textContent=date.toLocaleString('th-TH',{weekday:'short',day:'2-digit',month:'short',year:'nu...` | ประกาศฟังก์ชัน updateClock เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0099 | `// อธิบาย: อ่าน Manual Start Date จากช่องกรอก เพื่อใช้กรณี Master ไม่มี Date เดิม` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0100 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0101 | `function manualStartDate(){return $('#manualStartDate')?.value\|\|'';}` | ประกาศฟังก์ชัน manualStartDate เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0102 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0103 | `// อธิบาย: จัดรูปแบบเวลาสำหรับไฟล์ diagnostic package` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0104 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0105 | `function diagnosticTimestamp(date=new Date()){` | ประกาศฟังก์ชัน diagnosticTimestamp เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0106 | `  const pad=value=>String(value).padStart(2,'0');` | สร้างตัวช่วยแบบ arrow function ชื่อ pad เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0107 | `  return\`${date.getFullYear()}${pad(date.getMonth()+1)}${pad(date.getDate())}_${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}\`;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0108 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0109 | `// อธิบาย: แปลงค่าที่อาจใหญ่หรือซับซ้อนให้ปลอดภัยก่อนใส่ diagnostic JSON` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0110 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0111 | `function diagnosticSafeValue(value){` | ประกาศฟังก์ชัน diagnosticSafeValue เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0112 | `  if(value===undefined)return null;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0113 | `  try{return JSON.parse(JSON.stringify(value));}catch{return String(value);}` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L0114 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0115 | `// อธิบาย: บันทึก error ล่าสุดลง state เพื่อ export ให้ตรวจย้อนหลังได้` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0116 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0117 | `function recordDiagnosticError(source,error,code='BW-UNCLASSIFIED'){` | ประกาศฟังก์ชัน recordDiagnosticError เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0118 | `  const item={timestamp:new Date().toISOString(),source:String(source\|\|'unknown'),code,message:error?.message\|\|String(error\|\|'Unknown error'),stack:error?.st...` | ประกาศตัวแปร item แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0119 | `  state.diagnosticErrors.push(item);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0120 | `  if(state.diagnosticErrors.length>50)state.diagnosticErrors.splice(0,state.diagnosticErrors.length-50);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0121 | `  return item;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0122 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0123 | `// อธิบาย: สรุปรายละเอียดไฟล์ที่เลือก เช่น ชื่อ ขนาด เวลาแก้ไขล่าสุด` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0124 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0125 | `function selectedFileMetadata(){` | ประกาศฟังก์ชัน selectedFileMetadata เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0126 | `  return roles.map(role=>{` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0127 | `    const file=state.files[role];` | ประกาศตัวแปร file แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0128 | `    return{role,label:display[role],selected:!!file,name:file?.name\|\|null,size:file?.size\|\|0,sizeDisplay:file?bytes(file.size):null,type:file?.type\|\|null,las...` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0129 | `  });` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0130 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0131 | `// อธิบาย: ย่อข้อมูล Run History ให้พอแสดงใน UI โดยไม่โหลด blob ใหญ่เกินจำเป็น` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0132 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0133 | `function compactHistoryRecord(record){` | ประกาศฟังก์ชัน compactHistoryRecord เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0134 | `  return{id:record.id\|\|null,status:record.status\|\|null,createdAt:record.createdAt\|\|null,expiresAt:record.expiresAt\|\|null,message:record.message\|\|null,outputN...` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0135 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0136 | `// อธิบาย: สร้างไฟล์ ZIP diagnostic รวมสถานะระบบ ไฟล์ที่เลือก และ error log สำหรับ debug` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0137 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0138 | `async function exportDiagnosticPackage(){` | ประกาศฟังก์ชัน exportDiagnosticPackage เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0139 | `  const button=$('#exportDiagnosticBtn'),status=$('#diagnosticExportStatus');` | ประกาศตัวแปร button แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0140 | `  if(button)button.disabled=true;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0141 | `  if(status)status.textContent='กำลังรวบรวมข้อมูลตรวจสอบ...';` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0142 | `  try{` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L0143 | `    if(typeof JSZip==='undefined')throw new Error('JSZip ไม่พร้อมใช้งาน');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0144 | `    const now=new Date(),packageId=\`BW-DIAG-${diagnosticTimestamp(now)}\`;` | ประกาศตัวแปร now แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0145 | `    let storageInfo={usage:0,quota:0,persisted:false},history=[];` | ประกาศตัวแปร storageInfo แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0146 | `    try{storageInfo=await BlackwolfDB.storageInfo();}catch(error){recordDiagnosticError('diagnostic.storageInfo',error,'BW-DIAG-STORAGE');}` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L0147 | `    try{history=(await BlackwolfDB.list()).map(compactHistoryRecord);}catch(error){recordDiagnosticError('diagnostic.history',error,'BW-DIAG-HISTORY');}` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L0148 | `    const environment={` | ประกาศตัวแปร environment แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0149 | `      packageId,generatedAt:now.toISOString(),appVersion:CONFIG.version,displayVersion:CONFIG.displayVersion,edition:CONFIG.edition,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0150 | `      location:{protocol:location.protocol,host:location.host\|\|null,path:location.pathname},` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0151 | `      browser:{userAgent:navigator.userAgent,platform:navigator.platform\|\|null,language:navigator.language,languages:navigator.languages\|\|[],online:navigator...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0152 | `      screen:{width:screen.width,height:screen.height,availWidth:screen.availWidth,availHeight:screen.availHeight,pixelRatio:window.devicePixelRatio\|\|1},` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0153 | `      timezone:Intl.DateTimeFormat().resolvedOptions().timeZone\|\|null,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0154 | `      worker:{ready:state.workerReady,generation:state.workerGeneration,lastHeartbeat:state.workerLastHeartbeat,cachedRoles:[...state.workerCachedRoles],pend...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0155 | `      workflow:{running:state.running,classifying:state.classifying,activePreview:state.activePreview,preflightOk:state.preflight?.ok??null,currentRunId:stat...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0156 | `      capacity:memoryCapacityAdvice(),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0157 | `      storage:{usage:storageInfo.usage\|\|0,quota:storageInfo.quota\|\|0,persisted:!!storageInfo.persisted,retentionDays:CONFIG.retentionDays}` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0158 | `    };` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0159 | `    const outputMetadata=state.result?{` | ประกาศตัวแปร outputMetadata แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0160 | `      runId:state.result.runId\|\|null,names:diagnosticSafeValue(state.result.outputs?.names\|\|{}),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0161 | `      masterSize:state.result.outputs?.master?.size\|\|0,issueSize:state.result.outputs?.issue?.size\|\|0` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0162 | `    }:null;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0163 | `    const diagnostic={` | ประกาศตัวแปร diagnostic แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0164 | `      packageId,generatedAt:now.toISOString(),privacyNotice:'แพ็กเกจนี้ไม่รวมข้อมูลแรงงาน รายการ Data, รหัสผ่าน, ไฟล์ Excel ต้นฉบับ หรือไฟล์ผลลัพธ์',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0165 | `      environment,files:selectedFileMetadata(),preflight:diagnosticSafeValue(state.preflight),runSummary:diagnosticSafeValue(state.result?.summary\|\|null),out...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0166 | `      errors:diagnosticSafeValue(state.diagnosticErrors),historyCount:history.length` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0167 | `    };` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0168 | `    const logText=$('#logBox')?.innerText?.trim()\|\|'ไม่มี Run Log ในหน้าปัจจุบัน';` | ประกาศตัวแปร logText แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0169 | `    const readme=[` | ประกาศตัวแปร readme แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0170 | `      'BLACKWOLF Diagnostic Package',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0171 | `      \`Package ID: ${packageId}\`,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0172 | `      \`Generated: ${now.toISOString()}\`,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0173 | `      '',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0174 | `      'ไฟล์ภายใน:',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0175 | `      '- diagnostic.json: สรุปสถานะระบบและ Error',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0176 | `      '- environment.json: Browser / Worker / Storage',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0177 | `      '- file-metadata.json: ชื่อและขนาดไฟล์ที่เลือก (ไม่มีเนื้อหาข้อมูล)',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0178 | `      '- preflight.json: ผลตรวจโครงสร้างล่าสุด',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0179 | `      '- run-summary.json: Summary ล่าสุดเท่านั้น',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0180 | `      '- run-log.txt: Log ที่แสดงบนหน้าจอ',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0181 | `      '- history-summary.json: Summary ของ Run History โดยไม่แนบ Workbook หรือข้อมูลรายแถว',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0182 | `      '',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0183 | `      'ส่ง ZIP นี้ให้ผู้ดูแลพร้อม Screenshot และบอกขั้นตอนก่อนเกิดปัญหา',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0184 | `      'ข้อควรระวัง: แพ็กเกจไม่เก็บ Username/Password และไม่แนบไฟล์ Excel'` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0185 | `    ].join('\r\n');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0186 | `    const zip=new JSZip();` | ประกาศตัวแปร zip แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0187 | `    zip.file('README.txt',readme);` | ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache |
| L0188 | `    zip.file('diagnostic.json',JSON.stringify(diagnostic,null,2));` | ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache |
| L0189 | `    zip.file('environment.json',JSON.stringify(environment,null,2));` | ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache |
| L0190 | `    zip.file('file-metadata.json',JSON.stringify(selectedFileMetadata(),null,2));` | ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache |
| L0191 | `    zip.file('preflight.json',JSON.stringify(diagnosticSafeValue(state.preflight),null,2));` | ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache |
| L0192 | `    zip.file('run-summary.json',JSON.stringify(diagnosticSafeValue(state.result?.summary\|\|null),null,2));` | ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache |
| L0193 | `    zip.file('run-log.txt',logText);` | ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache |
| L0194 | `    zip.file('history-summary.json',JSON.stringify(history,null,2));` | ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache |
| L0195 | `    const blob=await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:6}});` | ประกาศตัวแปร blob แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0196 | `    downloadBlob(blob,\`${packageId}.zip\`);` | เริ่ม loop แบบวนซ้ำตามเงื่อนไข ใช้รอหรือทำงานจนกว่าจะครบเงื่อนไข |
| L0197 | `    if(status)status.textContent=\`สร้างสำเร็จ: ${packageId}\`;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0198 | `    toast('สร้าง Diagnostic ZIP สำเร็จ — ไม่มีข้อมูลแรงงานหรือรหัสผ่าน',5000);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0199 | `  }catch(error){` | จับ error จาก try block แล้วแปลงเป็นข้อความ/สถานะที่ผู้ใช้หรือระบบเข้าใจได้ |
| L0200 | `    recordDiagnosticError('exportDiagnosticPackage',error,'BW-DIAG-EXPORT');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0201 | `    if(status)status.textContent=\`สร้างไม่สำเร็จ: ${error.message}\`;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0202 | `    toast(\`สร้าง Diagnostic ZIP ไม่สำเร็จ: ${error.message}\`,6500);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0203 | `  }finally{if(button)button.disabled=false;}` | ส่วนที่ต้องทำเสมอหลัง try/catch เช่น ปลดล็อกปุ่ม เคลียร์สถานะ หรือคืน resource |
| L0204 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0205 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0206 | `// อธิบาย: ตรวจว่าไฟล์ที่ผู้ใช้ลากเข้ามาเป็น Master/Daily/Issue/M190/SM/Blacklist/Auto-Mail จากโครงสร้างจริง` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0207 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0208 | `async function detectFileRole(file){` | ประกาศฟังก์ชัน detectFileRole เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0209 | `  if(file.name.toLowerCase().endsWith('.txt'))return{role:'etl',message:'ไฟล์ข้อความ Auto-Mail 7.2'};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0210 | `  let buffer=await file.arrayBuffer();` | ประกาศตัวแปร buffer แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0211 | `  if(state.workerReady){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0212 | `    try{const result=await workerRequest('detect-file',{file:{name:file.name,buffer}},[buffer]);if(result.role)state.workerCachedRoles.add(result.role);retur...` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L0213 | `    catch(error){console.warn('Worker detection fallback',error);buffer=await file.arrayBuffer();}` | จับ error จาก try block แล้วแปลงเป็นข้อความ/สถานะที่ผู้ใช้หรือระบบเข้าใจได้ |
| L0214 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0215 | `  const pseudo={name:file.name,arrayBuffer:async()=>buffer};` | สร้างตัวช่วยแบบ arrow function ชื่อ pseudo เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0216 | `  const workbook=await BlackwolfEngine.readWorkbook(pseudo);` | ประกาศตัวแปร workbook แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0217 | `  return BlackwolfEngine.detectWorkbookRole(workbook,file.name);` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0218 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0219 | `// อธิบาย: รับไฟล์จาก input/drop แล้วจัดเข้า role ที่ถูกต้อง พร้อม cache workbook ที่อ่านแล้ว` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0220 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0221 | `async function loadFiles(fileList){` | ประกาศฟังก์ชัน loadFiles เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0222 | `  if(state.classifying)return;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0223 | `  state.classifying=true;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0224 | `  setStatus('CLASSIFYING','running');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0225 | `  let matched=0;` | ประกาศตัวแปร matched แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0226 | `  try{` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L0227 | `    for(const file of [...fileList]){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0228 | `      if(file.name.toLowerCase().endsWith('.txt')){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0229 | `        const content=await file.text();` | ประกาศตัวแปร content แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0230 | `        const input=$('#autoMail72Input');` | ประกาศตัวแปร input แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0231 | `        input.value=input.value.trim()?\`${input.value.trim()}\n${content.trim()}\`:content;` | อ่านหรือเขียนข้อความ/ค่าฟอร์มบนหน้าเว็บ |
| L0232 | `        state.files.etl=file;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0233 | `        syncEtl(false);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0234 | `        matched++;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0235 | `        continue;` | ข้ามรอบ loop ปัจจุบัน แล้วไปตรวจรายการถัดไปทันที |
| L0236 | `      }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0237 | `      toast(\`กำลังตรวจโครงสร้าง ${file.name}\`,1600);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0238 | `      const detection=await detectFileRole(file);` | ประกาศตัวแปร detection แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0239 | `      if(!detection.role){toast(\`จำแนกไฟล์ไม่ได้: ${file.name} — ${detection.message}\`,6000);continue;}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0240 | `      if(state.files[detection.role])toast(\`แทนที่ ${display[detection.role]} ด้วย ${file.name}\`,3500);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0241 | `      state.files[detection.role]=file;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0242 | `      matched++;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0243 | `      await yieldUi(10);` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L0244 | `    }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0245 | `    if(matched){invalidate({resetWorker:false,clearWorkbooks:true});renderFiles();toast(\`รับและจำแนกไฟล์จากโครงสร้างภายในแล้ว ${matched} รายการ\`,4200);}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0246 | `  }catch(error){recordDiagnosticError('loadFiles',error,'BW-FILE-READ');console.error(error);toast(\`อ่านไฟล์ไม่สำเร็จ: ${error.message}\`,6000);}` | จับ error จาก try block แล้วแปลงเป็นข้อความ/สถานะที่ผู้ใช้หรือระบบเข้าใจได้ |
| L0247 | `  finally{state.classifying=false;refreshReady();}` | ส่วนที่ต้องทำเสมอหลัง try/catch เช่น ปลดล็อกปุ่ม เคลียร์สถานะ หรือคืน resource |
| L0248 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0249 | `// อธิบาย: ล้างผล preflight/result เดิมเมื่อไฟล์หรือค่าเปลี่ยน เพื่อกันใช้ผลลัพธ์เก่า` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0250 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0251 | `function invalidate({resetWorker=true,clearWorkbooks=true}={}){if(clearWorkbooks)state.workbooks={};state.preflight=null;$('#preflightResult').classList.add(...` | ประกาศฟังก์ชัน invalidate เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0252 | `// อธิบาย: ประเมินความพร้อมด้าน memory/storage ของ Browser ก่อนรันไฟล์ใหญ่` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0253 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0254 | `function memoryCapacityAdvice(){` | ประกาศฟังก์ชัน memoryCapacityAdvice เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0255 | `  const total=roles.reduce((sum,role)=>sum+Number(state.files[role]?.size\|\|0),0),deviceMemory=Number(navigator.deviceMemory\|\|0);` | สร้างตัวช่วยแบบ arrow function ชื่อ total เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0256 | `  const advisoryLimit=deviceMemory&&deviceMemory<=4?250*1024**2:deviceMemory&&deviceMemory<=8?500*1024**2:750*1024**2;` | ประกาศตัวแปร advisoryLimit แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0257 | `  const level=total>advisoryLimit?'warn':total>advisoryLimit*.7?'watch':'ok';` | ประกาศตัวแปร level แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0258 | `  const ram=deviceMemory?\`${deviceMemory} GB RAM profile\`:'Browser ไม่รายงาน RAM';` | ประกาศตัวแปร ram แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0259 | `  const text=total?\`ไฟล์รวม ${bytes(total)} · ${ram} · ระดับทดสอบแนะนำไม่เกิน ${bytes(advisoryLimit)}\`:\`${ram} · ระบบใช้ Dense Workbook + Worker Cache เพื่อล...` | ประกาศตัวแปร text แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0260 | `  return{total,deviceMemory,advisoryLimit,level,text};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0261 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0262 | `// อธิบาย: แสดงคำแนะนำพื้นที่/หน่วยความจำบน UI` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0263 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0264 | `function renderCapacityHint(){` | ประกาศฟังก์ชัน renderCapacityHint เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0265 | `  const element=$('#capacityHint');if(!element)return;` | ประกาศตัวแปร element แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0266 | `  const advice=memoryCapacityAdvice();element.className=\`capacity-hint ${advice.level}\`;` | ประกาศตัวแปร advice แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0267 | `  $('strong',element).textContent=advice.level==='warn'?'ขนาดไฟล์สูงกว่าระดับทดสอบของเครื่องนี้':advice.level==='watch'?'ขนาดไฟล์เริ่มสูง — ปิดโปรแกรมอื่นก่อ...` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0268 | `  $('small',element).textContent=advice.text;` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0269 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0270 | `// อธิบาย: วาดรายการไฟล์ที่แนบแล้วในหน้า Prepare` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0271 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0272 | `function renderFiles(){` | ประกาศฟังก์ชัน renderFiles เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0273 | `  const ready=requiredRoles.filter(role=>state.files[role]).length;` | สร้างตัวช่วยแบบ arrow function ชื่อ ready เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0274 | `  $('#readyCount').textContent=\`${ready}/4\`;` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0275 | `  $('#fileChips').innerHTML=roles.map(role=>{` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0276 | `    const file=state.files[role],optional=!requiredRoles.includes(role);` | ประกาศตัวแปร file แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0277 | `    let emptyText=optional?'Optional — ไม่ได้เลือก':'Required — ยังไม่ได้เลือก';` | ประกาศตัวแปร emptyText แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0278 | `    if(role==='etl')emptyText=state.etlText?'ใช้ข้อความ Auto-Mail 7.2 ด้านล่าง':'ไม่มีข้อมูลรอบนี้ — ETL เดิมใน ISSUE จะถูกล้าง';` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0279 | `    return\`<div class="file-chip ${file?'ready':''} ${optional?'optional':''}"><strong>${esc(display[role])}</strong><small>${file?esc(file.name):emptyText}<...` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0280 | `  }).join('');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0281 | `  renderCapacityHint();refreshReady();` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0282 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0283 | `// อธิบาย: อ่าน/ซิงก์ข้อความ Auto-Mail 7.2 จาก textarea เข้าสู่ state` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0284 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0285 | `function syncEtl(shouldInvalidate=true){` | ประกาศฟังก์ชัน syncEtl เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0286 | `  state.etlText=$('#autoMail72Input').value;` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0287 | `  const parsed=BlackwolfEngine.parseEtl(state.etlText);` | ประกาศตัวแปร parsed แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0288 | `  $('#etlValid').textContent=fmt(parsed.valid);$('#etlInvalid').textContent=fmt(parsed.invalid);$('#etlDuplicate').textContent=fmt(parsed.duplicates);` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0289 | `  $('#autoMail72Input').classList.toggle('invalid',parsed.invalid>0);` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0290 | `  $('#etlHint').textContent=parsed.invalid?\`พบรูปแบบผิด ${parsed.invalid} บรรทัด — ตรวจ ลำดับ.ProposalID:Policy:Group\`:'รูปแบบ: ลำดับ.ProposalID:Policy:Group...` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0291 | `  if(shouldInvalidate&&state.preflight)invalidate({resetWorker:false,clearWorkbooks:false});` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0292 | `  renderFiles();` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0293 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0294 | `// อธิบาย: ตรวจว่าไฟล์ขั้นต่ำครบหรือยัง เพื่อเปิด/ปิดปุ่ม Preflight/Run` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0295 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0296 | `function refreshReady(){` | ประกาศฟังก์ชัน refreshReady เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0297 | `  const ready=requiredRoles.every(role=>state.files[role]);` | สร้างตัวช่วยแบบ arrow function ชื่อ ready เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0298 | `  $('#preflightBtn').disabled=!ready\|\|state.running\|\|state.classifying;` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0299 | `  $('#runBtn').disabled=!state.preflight?.ok\|\|state.running\|\|state.classifying;const cancel=$('#cancelRunBtn');if(cancel){cancel.classList.toggle('hidden',!s...` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0300 | `  const box=$('#inlineStatus');` | ประกาศตัวแปร box แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0301 | `  if(state.classifying){box.className='inline-status';box.innerHTML='<i></i><div><strong>กำลังจำแนกไฟล์</strong><small>ตรวจ Sheet และ Header ภายใน ไม่ใช้ชื่อ...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0302 | `  if(state.running){box.className='inline-status';box.innerHTML='<i></i><div><strong>กำลังประมวลผล</strong><small>ทำงานใน Background Worker กรุณารอจนเสร็จ</s...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0303 | `  if(state.preflight?.ok){box.className='inline-status ready';box.innerHTML='<i></i><div><strong>พร้อม Run</strong><small>จะสร้าง Master และเช็คสถานะ ISSUE ใ...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0304 | `  if(state.preflight&&!state.preflight.ok){box.className='inline-status error';box.innerHTML='<i></i><div><strong>พบปัญหาในไฟล์</strong><small>ตรวจรายละเอียด...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0305 | `  if(ready){box.className='inline-status';box.innerHTML='<i></i><div><strong>ไฟล์ Required ครบแล้ว</strong><small>กดตรวจสอบไฟล์ก่อน Run</small></div>';setSta...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0306 | `  const missing=requiredRoles.filter(role=>!state.files[role]).length;` | สร้างตัวช่วยแบบ arrow function ชื่อ missing เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0307 | `  box.className='inline-status';box.innerHTML=\`<i></i><div><strong>รอไฟล์ ${missing} รายการ</strong><small>เลือก Required files ให้ครบ 4 รายการ</small></div>...` | สร้างหรืออัปเดต HTML ในหน้าเว็บจากข้อมูลที่ระบบคำนวณแล้ว |
| L0308 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0309 | `// อธิบาย: อัปเดตแถบ progress และข้อความสถานะระหว่างรัน` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0310 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0311 | `function progress(percent,message){` | ประกาศฟังก์ชัน progress เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0312 | `  $('#progressPanel').classList.remove('hidden');$('#progressPct').textContent=\`${Math.round(percent)}%\`;$('#progressBar').style.width=\`${Math.max(0,Math.min...` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0313 | `  const now=Date.now(),log=$('#logBox');` | ประกาศตัวแปร now แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0314 | `  if(now-lastProgressAt<120&&log.lastElementChild){log.lastElementChild.textContent=\`[${new Date().toLocaleTimeString('th-TH')}] ${message}\`;return;}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0315 | `  lastProgressAt=now;log.insertAdjacentHTML('beforeend',\`<div>[${new Date().toLocaleTimeString('th-TH')}] ${esc(message)}</div>\`);while(log.children.length>1...` | สร้างหรืออัปเดต HTML ในหน้าเว็บจากข้อมูลที่ระบบคำนวณแล้ว |
| L0316 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0317 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0318 | `// อธิบาย: ล้าง timer timeout ของงาน worker ที่จบแล้วหรือถูกยกเลิก` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0319 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0320 | `function clearWorkerJobTimer(job){if(job?.timer)clearTimeout(job.timer);}` | ประกาศฟังก์ชัน clearWorkerJobTimer เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0321 | `// อธิบาย: ปฏิเสธ promise ที่รอ worker ทั้งหมดเมื่อ worker พัง/ถูก restart` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0322 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0323 | `function rejectPendingWorkerJobs(error){` | ประกาศฟังก์ชัน rejectPendingWorkerJobs เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0324 | `  for(const [id,job] of state.workerJobs){clearWorkerJobTimer(job);try{job.reject(error);}catch{}state.workerJobs.delete(id);}` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0325 | `  state.activeWorkerJobId=null;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0326 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0327 | `// อธิบาย: ปิด worker เดิมและเคลียร์งานที่ค้าง เพื่อเริ่มใหม่แบบปลอดภัย` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0328 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0329 | `function terminateWorker(error=appError('BW-WORKER-004','Worker restarted')){` | ประกาศฟังก์ชัน terminateWorker เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0330 | `  const worker=state.worker;state.worker=null;state.workerReady=false;state.workerCachedRoles.clear();state.workerLastHeartbeat=null;` | ประกาศตัวแปร worker แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0331 | `  try{worker?.terminate();}catch{}` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L0332 | `  rejectPendingWorkerJobs(error);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0333 | `  const label=$('#engineReadyText');if(label)label.textContent='Worker stopped · Main-thread fallback ready';` | ประกาศตัวแปร label แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0334 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0335 | `// อธิบาย: ตั้ง timeout ให้ job ใน worker เพื่อกันงานค้างเงียบ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0336 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0337 | `function armWorkerTimeout(id){` | ประกาศฟังก์ชัน armWorkerTimeout เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0338 | `  const job=state.workerJobs.get(id);if(!job)return;clearWorkerJobTimer(job);` | ประกาศตัวแปร job แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0339 | `  job.timer=setTimeout(()=>{` | กำหนด handler/ฟังก์ชันให้ job.timer เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง |
| L0340 | `    if(!state.workerJobs.has(id))return;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0341 | `    const error=appError('BW-WORKER-002',\`Worker ไม่ตอบสนองเกิน ${Math.round(job.timeoutMs/60000)} นาที (${job.type})\`);` | ประกาศตัวแปร error แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0342 | `    recordDiagnosticError('worker.inactivityTimeout',error,error.code);terminateWorker(error);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0343 | `    if(!state.cancelRequested)initWorker().catch(()=>{});` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0344 | `  },job.timeoutMs);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0345 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0346 | `// อธิบาย: ต่ออายุ timeout เมื่อ worker ส่ง heartbeat/progress กลับมา` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0347 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0348 | `function touchWorkerJob(id,heartbeat=null){` | ประกาศฟังก์ชัน touchWorkerJob เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0349 | `  const job=state.workerJobs.get(id);if(!job)return;` | ประกาศตัวแปร job แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0350 | `  job.lastActivity=Date.now();if(heartbeat){state.workerLastHeartbeat=heartbeat.timestamp\|\|new Date().toISOString();}` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0351 | `  armWorkerTimeout(id);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0352 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0353 | `// อธิบาย: สร้าง Web Worker และลง listener รับข้อความ result/progress/error` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0354 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0355 | `async function initWorker(){` | ประกาศฟังก์ชัน initWorker เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0356 | `  try{` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L0357 | `    if(state.worker)terminateWorker(appError('BW-WORKER-004','เริ่ม Worker รุ่นใหม่'));` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0358 | `    const worker=new Worker('worker.js?v=3.5.8');state.worker=worker;state.workerGeneration++;` | ประกาศตัวแปร worker แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0359 | `    worker.onmessage=event=>{` | กำหนด handler/ฟังก์ชันให้ worker.onmessage เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง |
| L0360 | `      const message=event.data\|\|{},job=state.workerJobs.get(message.id);if(!job)return;` | ประกาศตัวแปร message แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0361 | `      if(message.type==='heartbeat'){touchWorkerJob(message.id,message.heartbeat);return;}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0362 | `      if(message.type==='progress'){touchWorkerJob(message.id);job.onProgress?.(message.progress);return;}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0363 | `      clearWorkerJobTimer(job);state.workerJobs.delete(message.id);if(state.activeWorkerJobId===message.id)state.activeWorkerJobId=null;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0364 | `      if(message.type==='done')job.resolve(message.result);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0365 | `      else{const detail=message.error\|\|{};job.reject(appError(detail.code\|\|'BW-WORKER-001',detail.message\|\|'Worker error'));}` | ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข |
| L0366 | `    };` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0367 | `    worker.onerror=event=>{` | กำหนด handler/ฟังก์ชันให้ worker.onerror เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง |
| L0368 | `      const error=appError('BW-WORKER-001',event?.message\|\|'Worker crashed');recordDiagnosticError('worker.onerror',error,error.code);` | ประกาศตัวแปร error แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0369 | `      terminateWorker(error);if(!state.cancelRequested)initWorker().catch(()=>{});` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L0370 | `    };` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0371 | `    const result=await workerRequest('ping',{},[],null,{allowNotReady:true,timeoutMs:4500});` | ประกาศตัวแปร result แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0372 | `    state.workerReady=true;$('#engineReadyText').textContent=\`Browser Worker Engine Ready · ${result.version\|\|CONFIG.version} · G${state.workerGeneration}\`;r...` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0373 | `  }catch(error){console.warn(error);terminateWorker(error?.code?error:appError('BW-WORKER-001','Worker unavailable',error));$('#engineReadyText').textContent...` | จับ error จาก try block แล้วแปลงเป็นข้อความ/สถานะที่ผู้ใช้หรือระบบเข้าใจได้ |
| L0374 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0375 | `// อธิบาย: ส่งคำสั่งไป worker พร้อมรอ promise ตอบกลับ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0376 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0377 | `function workerRequest(type,payload={},transfer=[],onProgress,options={}){` | ประกาศฟังก์ชัน workerRequest เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0378 | `  return new Promise((resolve,reject)=>{` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0379 | `    if(!state.worker\|\|(!state.workerReady&&!options.allowNotReady)){reject(appError('BW-WORKER-001','Worker unavailable'));return;}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0380 | `    const id=++state.workerSeq,timeoutMs=options.timeoutMs\|\|WORKER_INACTIVITY_TIMEOUTS[type]\|\|600000;` | ประกาศตัวแปร id แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0381 | `    state.workerJobs.set(id,{resolve,reject,onProgress,type,timeoutMs,lastActivity:Date.now(),timer:null});state.activeWorkerJobId=id;armWorkerTimeout(id);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0382 | `    try{state.worker.postMessage({id,type,...payload},transfer);}catch(error){const job=state.workerJobs.get(id);clearWorkerJobTimer(job);state.workerJobs.de...` | ส่งข้อความหรือข้อมูลข้าม context ไปยัง Web Worker/หน้าหลัก พร้อมอาจส่ง ArrayBuffer แบบ transfer เพื่อประหยัด memory |
| L0383 | `  });` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0384 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0385 | `// อธิบาย: restart worker แบบโปรแกรมสั่งหรือผู้ใช้สั่ง` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0386 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0387 | `async function restartWorkerEngine({manual=false}={}){` | ประกาศฟังก์ชัน restartWorkerEngine เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0388 | `  if(state.running&&!manual) return false;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0389 | `  terminateWorker(appError('BW-WORKER-004','Worker restarted'));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0390 | `  state.preflight=null;$('#preflightResult')?.classList.add('hidden');refreshReady();` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0391 | `  const ok=await initWorker();await refreshSystemStatus();return ok;` | ประกาศตัวแปร ok แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0392 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0393 | `// อธิบาย: ปุ่มผู้ใช้สำหรับ restart engine เมื่อสงสัยว่า worker ค้าง` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0394 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0395 | `async function manualRestartWorker(){` | ประกาศฟังก์ชัน manualRestartWorker เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0396 | `  if(state.running){toast('กำลัง Run อยู่ กรุณากด Cancel Run ก่อน',4500);return;}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0397 | `  const button=$('#restartWorkerBtn');if(button)button.disabled=true;setStatus('RESTARTING','running');` | ประกาศตัวแปร button แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0398 | `  const ok=await restartWorkerEngine({manual:true});toast(ok?'Restart Worker สำเร็จ — กรุณากด Preflight ใหม่':'Restart Worker ไม่สำเร็จ ระบบจะใช้ Fallback Mo...` | ประกาศตัวแปร ok แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0399 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0400 | `// อธิบาย: ยกเลิกงานที่กำลังรันและคืน UI ให้พร้อมใช้งาน` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0401 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0402 | `async function cancelActiveRun(){` | ประกาศฟังก์ชัน cancelActiveRun เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0403 | `  if(!state.running)return;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0404 | `  if(!state.workerReady){toast('Fallback Mode ไม่สามารถหยุดงานกลางคันได้ กรุณารอให้จบหรือปิดแท็บ',5500);return;}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0405 | `  const ok=await confirmAction('ยกเลิกการ Run','หยุด Worker ทันทีและล้าง Cache ของรอบนี้หรือไม่? ไฟล์ต้นฉบับและ Run History เดิมจะไม่ถูกลบ และต้องกด Prefligh...` | ประกาศตัวแปร ok แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0406 | `  state.cancelRequested=true;const error=appError('BW-WORKER-003','ผู้ใช้ยกเลิกการ Run');terminateWorker(error);state.preflight=null;$('#preflightResult')?.c...` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0407 | `  await initWorker();state.cancelRequested=false;refreshReady();toast('ยกเลิก Run แล้ว · Worker เริ่มใหม่ · กรุณากด Preflight ใหม่',5500);` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L0408 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0409 | `// อธิบาย: เตรียมไฟล์/ArrayBuffer เพื่อส่งเข้า worker แบบ transfer ได้` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0410 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0411 | `async function prepareWorkerFiles(){` | ประกาศฟังก์ชัน prepareWorkerFiles เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0412 | `  const selected=roles.filter(role=>role!=='etl'&&state.files[role]);` | สร้างตัวช่วยแบบ arrow function ชื่อ selected เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0413 | `  await workerRequest('reset');state.workerCachedRoles.clear();` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L0414 | `  for(let index=0;index<selected.length;index++){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0415 | `    const role=selected[index],file=state.files[role],base=3+Math.round(index/Math.max(1,selected.length)*65);` | ประกาศตัวแปร role แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0416 | `    progress(base,\`กำลังส่ง ${display[role]} เข้า Worker (${bytes(file.size)})\`);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0417 | `    const buffer=await file.arrayBuffer();` | ประกาศตัวแปร buffer แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0418 | `    await workerRequest('load-file',{file:{role,name:file.name,buffer}},[buffer],update=>progress(Math.min(72,base+Math.round((update.pct\|\|0)/100*9)),update....` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L0419 | `    state.workerCachedRoles.add(role);await yieldUi(0);` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L0420 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0421 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0422 | `// อธิบาย: ย่อผลลัพธ์ที่ใหญ่มากเพื่อเก็บใน state/UI โดยยังคง summary สำคัญ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0423 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0424 | `function compactResultForUi(result){const limit=2000,all=result.rows\|\|[],rows=all.slice(0,limit),duplicateSummary=BlackwolfEngine.internals.analyzeAlienDupli...` | ประกาศฟังก์ชัน compactResultForUi เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0425 | `// อธิบาย: ตรวจและเตรียมไฟล์ก่อนเรียก worker` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0426 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0427 | `async function ensureWorkerFiles(){` | ประกาศฟังก์ชัน ensureWorkerFiles เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0428 | `  const selected=roles.filter(role=>role!=='etl'&&state.files[role]);` | สร้างตัวช่วยแบบ arrow function ชื่อ selected เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0429 | `  if(selected.every(role=>state.workerCachedRoles.has(role))){progress(70,'ใช้ Workbook Cache จากขั้นตอนจำแนกไฟล์ ไม่อ่านไฟล์ขนาดใหญ่ซ้ำ');return;}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0430 | `  await prepareWorkerFiles();` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L0431 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0432 | `// อธิบาย: แกนหลักของการ preflight ใช้ตรวจไฟล์และข้อมูลก่อนรันจริง` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0433 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0434 | `async function mainPreflight(){` | ประกาศฟังก์ชัน mainPreflight เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0435 | `  const workbooks={},selected=roles.filter(role=>role!=='etl'&&state.files[role]);` | ประกาศตัวแปร workbooks แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0436 | `  for(let index=0;index<selected.length;index++){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0437 | `    const role=selected[index];progress(10+Math.round(index/Math.max(1,selected.length)*60),\`กำลังอ่าน ${display[role]} — Fallback Mode\`);await yieldUi(20);w...` | ประกาศตัวแปร role แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0438 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0439 | `  state.workbooks=workbooks;progress(78,'กำลังตรวจ Sheet, Header และ Date คอลัมน์ T — Fallback Mode');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0440 | `  return BlackwolfEngine.preflight(workbooks,state.files,state.etlText,manualStartDate());` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0441 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0442 | `// อธิบาย: ปุ่ม Preflight: เรียกตรวจไฟล์แล้ว render ผลบนหน้าจอ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0443 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0444 | `async function runPreflight(){` | ประกาศฟังก์ชัน runPreflight เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0445 | `  const parsed=BlackwolfEngine.parseEtl(state.etlText);if(parsed.invalid){toast(\`Auto-Mail 7.2 ผิดรูปแบบ ${parsed.invalid} บรรทัด\`,5000);return;}` | ประกาศตัวแปร parsed แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0446 | `  const button=$('#preflightBtn');button.disabled=true;button.textContent='กำลังตรวจสอบ...';setStatus('VALIDATING','running');$('#logBox').innerHTML='';progr...` | ประกาศตัวแปร button แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0447 | `  try{` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L0448 | `    let result;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0449 | `    if(state.workerReady){await ensureWorkerFiles();result=await workerRequest('validate',{etlText:state.etlText,manualStartDate:manualStartDate()},[],update...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0450 | `    else result=await mainPreflight();` | ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข |
| L0451 | `    state.preflight=result;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0452 | `    const box=$('#preflightResult');` | ประกาศตัวแปร box แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0453 | `    box.innerHTML=\`<h3>${result.ok?'✓ Preflight ผ่าน':'! Preflight ไม่ผ่าน'}</h3><div class="validation-files">${result.results.map(item=>\`<div class="valida...` | สร้างหรืออัปเดต HTML ในหน้าเว็บจากข้อมูลที่ระบบคำนวณแล้ว |
| L0454 | `    box.classList.remove('hidden');progress(100,result.ok?'Preflight ผ่าน พร้อม Run':'Preflight ไม่ผ่าน');refreshReady();toast(result.ok?'Preflight ผ่าน พร้อ...` | เพิ่ม/ลบ/สลับ CSS class เพื่อเปลี่ยนสถานะการแสดงผลของหน้าเว็บ |
| L0455 | `  }catch(error){recordDiagnosticError('runPreflight',error,'BW-PREFLIGHT');state.preflight={ok:false};refreshReady();toast(errorText(error),5500);console.err...` | จับ error จาก try block แล้วแปลงเป็นข้อความ/สถานะที่ผู้ใช้หรือระบบเข้าใจได้ |
| L0456 | `  finally{button.textContent='✓ ตรวจสอบไฟล์';button.disabled=!requiredRoles.every(role=>state.files[role]);}` | ส่วนที่ต้องทำเสมอหลัง try/catch เช่น ปลดล็อกปุ่ม เคลียร์สถานะ หรือคืน resource |
| L0457 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0458 | `// อธิบาย: ปุ่ม Run: ส่งงานเข้า engine, รับผลลัพธ์, บันทึก history และ render dashboard/results` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0459 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0460 | `async function runWorkflow(){` | ประกาศฟังก์ชัน runWorkflow เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0461 | `  if(!state.preflight?.ok\|\|state.running)return;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0462 | `  state.running=true;refreshReady();setStatus('RUNNING','running');$('#logBox').innerHTML='';progress(1,'เริ่ม BLACKWOLF V3.5.8 Hardened Workflow');` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0463 | `  try{` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L0464 | `    let result;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0465 | `    if(state.workerReady){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0466 | `      const raw=await workerRequest('run',{etlText:state.etlText,manualStartDate:manualStartDate(),today:new Date().toISOString()},[],update=>progress(update...` | สร้างตัวช่วยแบบ arrow function ชื่อ raw เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0467 | `      result={runId:raw.runId,summary:raw.summary,rows:raw.rows,duplicateSummary:raw.duplicateSummary,context:raw.context,outputs:{master:new Blob([raw.maste...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0468 | `    }else{` | ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข |
| L0469 | `      result=compactResultForUi(await BlackwolfEngine.run({workbooks:state.workbooks,etlText:state.etlText,manualStartDate:manualStartDate(),today:new Date()...` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L0470 | `    }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0471 | `    state.result=result;$('#currentRunLabel').textContent=result.runId;await saveRunRecord(result);setStatus('COMPLETED','success');$('#previewMode').textCon...` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L0472 | `  }catch(error){const code=error?.code\|\|'BW-RUN-001';recordDiagnosticError('runWorkflow',error,code);console.error(error);if(code==='BW-WORKER-003'){progress...` | จับ error จาก try block แล้วแปลงเป็นข้อความ/สถานะที่ผู้ใช้หรือระบบเข้าใจได้ |
| L0473 | `  finally{state.running=false;refreshReady();}` | ส่วนที่ต้องทำเสมอหลัง try/catch เช่น ปลดล็อกปุ่ม เคลียร์สถานะ หรือคืน resource |
| L0474 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0475 | `// อธิบาย: บันทึกผลการรันลง IndexedDB พร้อมวันหมดอายุ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0476 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0477 | `async function saveRunRecord(result){` | ประกาศฟังก์ชัน saveRunRecord เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0478 | `  try{` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L0479 | `    const createdAt=new Date().toISOString(),expiresAt=new Date(Date.now()+RETENTION_MS).toISOString();` | ประกาศตัวแปร createdAt แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0480 | `    await BlackwolfDB.put({id:result.runId,displayName:\`BLACKWOLF ${CONFIG.displayVersion} · Master + ISSUE\`,status:'completed',message:'ประมวลผลสำเร็จ เก็บใ...` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L0481 | `    await BlackwolfDB.pruneExpired();` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L0482 | `  }catch(error){recordDiagnosticError('saveRunRecord',error,'BW-HISTORY-SAVE');console.warn(error);toast(\`Run สำเร็จ แต่จัดเก็บ History ไม่ได้: ${error.messa...` | จับ error จาก try block แล้วแปลงเป็นข้อความ/สถานะที่ผู้ใช้หรือระบบเข้าใจได้ |
| L0483 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0484 | `// อธิบาย: ดาวน์โหลด Blob เป็นไฟล์ด้วย temporary object URL` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0485 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0486 | `function downloadBlob(blob,name){if(!blob){toast('ไม่พบไฟล์สำหรับดาวน์โหลด',4500);return;}const url=URL.createObjectURL(blob),anchor=document.createElement('...` | ประกาศฟังก์ชัน downloadBlob เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0487 | `// อธิบาย: ดาวน์โหลดไฟล์ Master ที่สร้างจากผล run ล่าสุด` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0488 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0489 | `function downloadMaster(){if(!state.result)return toast('ยังไม่มีผลลัพธ์');downloadBlob(state.result.outputs.master,state.result.outputs.names.master);}` | ประกาศฟังก์ชัน downloadMaster เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0490 | `// อธิบาย: ดาวน์โหลดไฟล์ ISSUE ที่สร้างจากผล run ล่าสุด` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0491 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0492 | `function downloadIssue(){if(!state.result)return toast('ยังไม่มีผลลัพธ์');downloadBlob(state.result.outputs.issue,state.result.outputs.names.issue);}` | ประกาศฟังก์ชัน downloadIssue เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0493 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0494 | `// อธิบาย: วาด KPI และกราฟสรุปสำหรับผู้บริหาร` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0495 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0496 | `function renderDashboard(){` | ประกาศฟังก์ชัน renderDashboard เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0497 | `  const summary=state.result?.summary;if(!summary)return;` | ประกาศตัวแปร summary แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0498 | `  $('#dashboardSubtitle').textContent=\`Run ${summary.RunId} · ${summary.DateStart} ถึง ${summary.DateEnd} · ${summary.TotalPolicies} policies\`;` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0499 | `  $('#kpiPending').textContent=fmt(summary.PendingPolicies);$('#kpiIncomplete').textContent=fmt(summary.IncompletePolicies);$('#kpiMenuE').textContent=fmt(su...` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0500 | `  renderBars('#statusChart',[['รอ Issue',summary.PendingPolicies],['ข้อมูลไม่สมบูรณ์',summary.IncompletePolicies],['Menu E',summary.MenuEPolicies],['Blacklis...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0501 | `  renderBars('#agingChart',[['1 - 7 วัน',summary.Age_1_7],['8 - 15 วัน',summary.Age_8_15],['16 - 30 วัน',summary.Age_16_30],['มากกว่า 30 วัน',summary.Age_Ove...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0502 | `  const reconciliation=[['Master Carry Forward',summary.MasterRowsCarriedForward,'rows'],['Daily เพิ่มใหม่',summary.DailyRowsAddedToBacklog,'rows'],['M190 รอ...` | ประกาศตัวแปร reconciliation แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0503 | `  $('#reconGrid').innerHTML=reconciliation.map(item=>\`<div class="recon-item"><span>${esc(item[0])}</span><strong>${fmt(item[1])}</strong><small>${esc(item[2...` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0504 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0505 | `// อธิบาย: วาด bar chart แบบง่ายจากข้อมูล label/value` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0506 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0507 | `function renderBars(selector,items){const max=Math.max(1,...items.map(item=>Number(item[1]\|\|0)));$(selector).innerHTML=items.map(([label,value])=>\`<div class...` | ประกาศฟังก์ชัน renderBars เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0508 | `// อธิบาย: แปลงสถานะของ row เป็น class สีสำหรับตารางผลลัพธ์` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0509 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0510 | `function resultStatusClass(status){` | ประกาศฟังก์ชัน resultStatusClass เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0511 | `  const value=String(status\|\|'').toLowerCase();` | ประกาศตัวแปร value แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0512 | `  if(value.includes('ไม่สมบูรณ์'))return'status-incomplete';` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0513 | `  if(value.includes('issue'))return'status-issue';` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0514 | `  if(value.includes('black'))return'status-blacklist';` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0515 | `  if(value.includes('menu')\|\|value.includes('เมนู'))return'status-menu';` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0516 | `  return'status-default';` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0517 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0518 | `// อธิบาย: เช็คว่า row ตรงกับ filter ช่วงอายุที่เลือกหรือไม่` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0519 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0520 | `function matchesAgingFilter(row,filter){` | ประกาศฟังก์ชัน matchesAgingFilter เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0521 | `  if(!filter)return true;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0522 | `  const days=Number(row?.AgingDays);` | ประกาศตัวแปร days แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0523 | `  if(!Number.isFinite(days))return false;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0524 | `  if(filter==='1-7')return days>=1&&days<=7;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0525 | `  if(filter==='8-15')return days>=8&&days<=15;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0526 | `  if(filter==='16-30')return days>=16&&days<=30;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0527 | `  if(filter==='31+')return days>30;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0528 | `  return true;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0529 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0530 | `// อธิบาย: อัปเดต dropdown/filter ผลลัพธ์ให้สัมพันธ์กับข้อมูลจริง` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0531 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0532 | `function syncResultFilters(rows){` | ประกาศฟังก์ชัน syncResultFilters เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0533 | `  const select=$('#tableStatusFilter');if(!select)return;` | ประกาศตัวแปร select แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0534 | `  const current=select.value;` | ประกาศตัวแปร current แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0535 | `  const statuses=[...new Set(rows.map(row=>String(row.PendingStatus\|\|'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'th'));` | สร้างตัวช่วยแบบ arrow function ชื่อ statuses เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0536 | `  select.innerHTML='<option value="">ทุกสถานะ</option>'+statuses.map(status=>\`<option value="${esc(status)}">${esc(status)}</option>\`).join('');` | สร้างหรืออัปเดต HTML ในหน้าเว็บจากข้อมูลที่ระบบคำนวณแล้ว |
| L0537 | `  if(statuses.includes(current))select.value=current;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0538 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0539 | `// อธิบาย: normalize alienCode เพื่อค้นหา/เทียบซ้ำแบบไม่ติดช่องว่างหรือ case` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0540 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0541 | `function normalizeAlienCode(value){return String(value??'').normalize('NFKC').replace(/\s+/g,'').trim().toUpperCase();}` | ประกาศฟังก์ชัน normalizeAlienCode เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0542 | `// อธิบาย: วาดตัวเลข summary ในหน้า results` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0543 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0544 | `function renderResultStats(rows){` | ประกาศฟังก์ชัน renderResultStats เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0545 | `  const incomplete=rows.filter(row=>String(row.PendingStatus\|\|'').includes('ข้อมูลไม่สมบูรณ์')).length,ready=Math.max(0,rows.length-incomplete);` | สร้างตัวช่วยแบบ arrow function ชื่อ incomplete เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0546 | `  const full=state.result?.duplicateSummary\|\|BlackwolfEngine.internals.analyzeAlienDuplicates(rows),codes=new Map((full.codes\|\|[]).map(item=>[normalizeAlienC...` | ประกาศตัวแปร full แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0547 | `  const duplicates={codes,duplicateCodes:Number(full.duplicateCodeCount\|\|0),duplicateRows:Number(full.duplicateRowCount\|\|0),list:full.codes\|\|[]};` | ประกาศตัวแปร duplicates แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0548 | `  const stats=[['ทั้งหมด',state.result?.summary?.TotalRows??rows.length,'รายการ'],['ข้อมูลไม่สมบูรณ์',state.result?.summary?.IncompletePolicies??incomplete,'...` | ประกาศตัวแปร stats แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0549 | `  const container=$('#resultDetailStats');if(!container)return duplicates;` | ประกาศตัวแปร container แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0550 | `  [...container.children].forEach((card,index)=>{const stat=stats[index];if(!stat)return;$('span',card).textContent=stat[0];$('strong',card).textContent=fmt(...` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0551 | `  const duplicateCard=$('.duplicate-alien-stat',container),alertBox=$('#alienDuplicateAlert');` | ประกาศตัวแปร duplicateCard แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0552 | `  if(duplicateCard){$('strong',duplicateCard).textContent=fmt(duplicates.duplicateCodes);$('small',duplicateCard).textContent=\`${fmt(duplicates.duplicateRows...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0553 | `  if(alertBox){const preview=duplicates.list.slice(0,12).map(item=>\`${item.alienCode} (${fmt(item.count)})\`).join(', '),more=duplicates.list.length>12?\` และอ...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0554 | `  return duplicates;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0555 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0556 | `// อธิบาย: จัดการวาดหน้าผลลัพธ์ทั้งหมด ทั้ง stats, table และ detail` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0557 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0558 | `function renderResults(){` | ประกาศฟังก์ชัน renderResults เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0559 | `  const result=state.result;$('#resultEmpty').classList.toggle('hidden',!!result);$('#resultContent').classList.toggle('hidden',!result);if(!result)return;` | ประกาศตัวแปร result แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0560 | `  const summary=result.summary;$('#resultSummary').innerHTML=[['Run ID',summary.RunId],['Date Range',\`${summary.DateStart} → ${summary.DateEnd}\`],['Pending P...` | ประกาศตัวแปร summary แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0561 | `  selectedDetailIndex=null;syncResultFilters(result.rows\|\|[]);renderTable();` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0562 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0563 | `// อธิบาย: วาดตารางรายการค้าง/ผลลัพธ์หลัก` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0564 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0565 | `function renderTable(){` | ประกาศฟังก์ชัน renderTable เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0566 | `  const allRows=state.result?.rows\|\|[],query=($('#tableSearch')?.value\|\|'').trim().toLowerCase(),statusFilter=$('#tableStatusFilter')?.value\|\|'',agingFilter=...` | ประกาศตัวแปร allRows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0567 | `  const duplicateInfo=renderResultStats(allRows);` | ประกาศตัวแปร duplicateInfo แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0568 | `  const filtered=allRows.map((row,index)=>({row,index})).filter(item=>{` | สร้างตัวช่วยแบบ arrow function ชื่อ filtered เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0569 | `    const haystack=[item.row.ProposalID,item.row.Policy,item.row.alienCode,item.row.PendingStatus,item.row.AgencyName,item.row.CreateDate,item.row.TotalPremi...` | ประกาศตัวแปร haystack แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0570 | `    return(!query\|\|haystack.includes(query))&&(!statusFilter\|\|String(item.row.PendingStatus\|\|'')===statusFilter)&&matchesAgingFilter(item.row,agingFilter);` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0571 | `  });` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0572 | `  const visible=filtered.slice(0,200),body=$('#resultTable');` | ประกาศตัวแปร visible แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0573 | `  $('#visibleResultCount').textContent=\`แสดง ${fmt(visible.length)} จาก ${fmt(filtered.length)} รายการ${filtered.length>200?' · จำกัดบนจอ 200':''}\`;` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0574 | `  body.innerHTML=visible.map(item=>{const row=item.row,date=row.CreateDate?BlackwolfEngine.normalize.dateKey(new Date(row.CreateDate)):'-',alienKey=normalize...` | กำหนด handler/ฟังก์ชันให้ body.innerHTML เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง |
| L0575 | `  $$('tr[data-row-index]',body).forEach(element=>element.addEventListener('click',()=>showResultDetail(Number(element.dataset.rowIndex))));` | ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด |
| L0576 | `  if(selectedDetailIndex!==null&&allRows[selectedDetailIndex])showResultDetail(selectedDetailIndex,false);else renderEmptyResultDetail();` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0577 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0578 | `// อธิบาย: แสดง panel ว่างเมื่อยังไม่ได้เลือก row` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0579 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0580 | `function renderEmptyResultDetail(){` | ประกาศฟังก์ชัน renderEmptyResultDetail เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0581 | `  const drawer=$('#resultDetailDrawer');if(!drawer)return;` | ประกาศตัวแปร drawer แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0582 | `  drawer.innerHTML='<div class="detail-drawer-empty"><span>▤</span><strong>เลือกรายการเพื่อดูรายละเอียด</strong><small>คลิกแถวข้อมูลทางซ้าย ระบบจะแสดงรายละเอ...` | สร้างหรืออัปเดต HTML ในหน้าเว็บจากข้อมูลที่ระบบคำนวณแล้ว |
| L0583 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0584 | `// อธิบาย: แสดงรายละเอียด row ที่ผู้ใช้เลือกจากตาราง` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0585 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0586 | `function showResultDetail(index,updateSelection=true){` | ประกาศฟังก์ชัน showResultDetail เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0587 | `  const rows=state.result?.rows\|\|[],row=rows[index];if(!row)return;` | ประกาศตัวแปร rows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0588 | `  selectedDetailIndex=index;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0589 | `  if(updateSelection)$$('#resultTable tr[data-row-index]').forEach(element=>element.classList.toggle('selected',Number(element.dataset.rowIndex)===index));` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0590 | `  const date=row.CreateDate?BlackwolfEngine.normalize.dateKey(new Date(row.CreateDate)):'-';` | ประกาศตัวแปร date แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0591 | `  const fields=[['ProposalID',row.ProposalID],['Policy',row.Policy],['alienCode',row.alienCode\|\|'-'],['CreateDate',date],['Premium',\`${money(row.TotalPremium...` | ประกาศตัวแปร fields แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0592 | `  $('#resultDetailDrawer').innerHTML=\`<div class="drawer-header"><div><span>RECORD DETAIL</span><h4>รายละเอียดรายการ</h4></div></div><div class="drawer-field...` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0593 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0594 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0595 | `// อธิบาย: วาด Executive Report จาก summary ล่าสุด` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0596 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0597 | `function renderReport(){` | ประกาศฟังก์ชัน renderReport เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0598 | `  const summary=state.result?.summary;$('#reportEmpty').classList.toggle('hidden',!!summary);$('#reportSheet').classList.toggle('hidden',!summary);if(!summar...` | ประกาศตัวแปร summary แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0599 | `  const total=Number(summary.TotalPolicies\|\|0),pending=Number(summary.PendingPolicies\|\|0),incomplete=Number(summary.IncompletePolicies\|\|0),menuE=Number(summa...` | ประกาศตัวแปร total แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0600 | `  $('#reportProcessed').textContent=summary.ProcessedAt\|\|'-';$('#reportDateRange').textContent=\`${summary.DateStart} ถึง ${summary.DateEnd}\`;$('#reportValida...` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0601 | `  [summary.Age_1_7,summary.Age_8_15,summary.Age_16_30,summary.Age_Over_30].forEach((value,index)=>{const count=Number(value\|\|0),percent=total?count/total*100...` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0602 | `  $('#reportPendingCard').textContent=fmt(pending);$('#reportIncompleteCard').textContent=fmt(incomplete);$('#reportMenuECard').textContent=fmt(menuE);$('#re...` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0603 | `  const statusRows=[['รอ Issue',pending,'ดำเนินการตามคิว'],['ข้อมูลไม่สมบูรณ์',incomplete,'ติดตามข้อมูลเพิ่ม'],['ติดปัญหาไม่เข้าในเมนู E',menuE,'เร่งตรวจสอบร...` | สร้างตัวช่วยแบบ arrow function ชื่อ statusRows เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0604 | `  $('#reportStatusBody').innerHTML=statusRows.map(([name,count,action])=>\`<tr><td>${esc(name)}</td><td>${fmt(count)}</td><td>${total?(count/total*100).toFixe...` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0605 | `  $('#reportDailyRows').textContent=fmt(summary.DailyRowsAfterDateStatusFilter);$('#reportM190').textContent=fmt(summary.M190RawRows);$('#reportAutoMail72')....` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0606 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0607 | `// อธิบาย: จับภาพ report panel ด้วย html2canvas` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0608 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0609 | `async function captureReport(){` | ประกาศฟังก์ชัน captureReport เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0610 | `  const report=$('#reportSheet');if(report.classList.contains('hidden'))throw new Error('ยังไม่มีรายงาน');if(typeof window.html2canvas!=='function')throw new...` | ประกาศตัวแปร report แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0611 | `  const rect=report.getBoundingClientRect(),width=Math.ceil(Math.max(report.scrollWidth,rect.width)),height=Math.ceil(Math.max(report.scrollHeight,rect.heigh...` | ประกาศตัวแปร rect แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0612 | `  return window.html2canvas(report,{backgroundColor:'#ffffff',scale,useCORS:true,allowTaint:false,logging:false,removeContainer:true,width,height,windowWidth...` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0613 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0614 | `// อธิบาย: ดาวน์โหลดรูปภาพรายงานผู้บริหารเป็น PNG` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0615 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0616 | `async function saveReportImage(){` | ประกาศฟังก์ชัน saveReportImage เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0617 | `  const button=$('#saveReportImageBtn'),old=button.textContent;button.disabled=true;button.textContent='กำลังสร้างรูป...';` | ประกาศตัวแปร button แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0618 | `  try{` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L0619 | `    const canvas=await captureReport(),blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('สร้างไฟล์ PNG ไม่...` | ประกาศตัวแปร canvas แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0620 | `    const requested=state.result?.outputs?.names?.report\|\|\`Report_${BlackwolfEngine.normalize.dateKey(new Date())}.png\`,name=/\.png$/i.test(requested)?reques...` | ประกาศตัวแปร requested แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0621 | `    downloadBlob(blob,name);toast('บันทึกรายงานเป็น PNG สำเร็จ');` | เริ่ม loop แบบวนซ้ำตามเงื่อนไข ใช้รอหรือทำงานจนกว่าจะครบเงื่อนไข |
| L0622 | `  }catch(error){recordDiagnosticError('saveReportImage',error,'BW-REPORT-IMAGE');console.error(error);toast(\`บันทึกรูปภาพไม่สำเร็จ: ${error.message}\`,6000);}...` | จับ error จาก try block แล้วแปลงเป็นข้อความ/สถานะที่ผู้ใช้หรือระบบเข้าใจได้ |
| L0623 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0624 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0625 | `// อธิบาย: แสดงวันที่ใน Run History แบบ yyyy-mm-dd` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0626 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0627 | `function formatHistoryDate(value){const date=new Date(value);return Number.isNaN(date.getTime())?'-':date.toLocaleDateString('en-CA');}` | ประกาศฟังก์ชัน formatHistoryDate เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0628 | `// อธิบาย: แสดงเวลาใน Run History แบบ HH:mm:ss` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0629 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0630 | `function formatHistoryTime(value){const date=new Date(value);return Number.isNaN(date.getTime())?'-':date.toLocaleTimeString('th-TH',{hour:'2-digit',minute:'...` | ประกาศฟังก์ชัน formatHistoryTime เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0631 | `// อธิบาย: คำนวณเวลานับถอยหลังก่อน Run History ถูกลบ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0632 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0633 | `function formatCountdown(expiresAt){const total=Math.max(0,Math.floor((new Date(expiresAt)-Date.now())/1000));if(total<=0)return'ครบกำหนดลบ';const days=Math....` | ประกาศฟังก์ชัน formatCountdown เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0634 | `// อธิบาย: โหลดและวาด Run History จาก IndexedDB` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0635 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0636 | `async function renderHistory(){` | ประกาศฟังก์ชัน renderHistory เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0637 | `  try{` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L0638 | `    await BlackwolfDB.pruneExpired();const list=await BlackwolfDB.list();` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L0639 | `    $('#historyList').innerHTML=list.length?list.map(record=>\`<div class="history-item" data-id="${esc(record.id)}"><div class="history-created"><strong>${es...` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0640 | `    $$('.history-item').forEach(element=>element.addEventListener('click',async event=>{if(event.target.closest('[data-delete]'))return;await openHistoryRun(...` | ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด |
| L0641 | `    $$('[data-delete]').forEach(button=>button.addEventListener('click',async event=>{event.stopPropagation();const ok=await confirmAction('ลบ Run History',\`...` | ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด |
| L0642 | `    clearInterval(historyCountdownTimer);historyCountdownTimer=setInterval(async()=>{const expired=$$('[data-expires-at]').some(element=>new Date(element.dat...` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L0643 | `  }catch(error){recordDiagnosticError('renderHistory',error,'BW-HISTORY-READ');console.error(error);$('#historyList').innerHTML=\`<div class="empty-row">อ่านป...` | จับ error จาก try block แล้วแปลงเป็นข้อความ/สถานะที่ผู้ใช้หรือระบบเข้าใจได้ |
| L0644 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0645 | `// อธิบาย: เปิดผล Run เก่าจาก History กลับมาแสดงใน UI` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0646 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0647 | `async function openHistoryRun(id){` | ประกาศฟังก์ชัน openHistoryRun เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0648 | `  try{setStatus('LOADING','running');const record=await BlackwolfDB.get(id);if(!record)throw new Error('ไม่พบ Run หรือถูกลบครบ 4 วันแล้ว');state.result={runI...` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L0649 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0650 | `// อธิบาย: เปิด modal ยืนยันก่อนทำงานเสี่ยง เช่น ล้างข้อมูล` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0651 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0652 | `function confirmAction(title,message){return new Promise(resolve=>{const modal=$('#confirmModal');$('#confirmTitle').textContent=title;$('#confirmText').text...` | ประกาศฟังก์ชัน confirmAction เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0653 | `// อธิบาย: อัปเดตสถานะ Browser/Worker/Storage ในหน้า Settings` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0654 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0655 | `async function refreshSystemStatus(){` | ประกาศฟังก์ชัน refreshSystemStatus เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0656 | `  const worker=!!state.workerReady,xlsx=!!window.XLSX;$('#settingsEngineStatus').textContent='พร้อมใช้งาน';$('#settingsEngineStatus').className='status-ok';$...` | ประกาศตัวแปร worker แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0657 | `  try{await BlackwolfDB.open();$('#settingsArchiveStatus').textContent='พร้อมใช้งาน';$('#settingsArchiveStatus').className='status-ok';}catch{$('#settingsArc...` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L0658 | `  $('#settingsActiveRuns').textContent=state.running?'1':'0';const detail=$('#settingsWorkerDetail');if(detail)detail.textContent=state.workerReady?\`Generati...` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0659 | `  try{const info=await BlackwolfDB.storageInfo();$('#storageUsage').textContent=\`${bytes(info.usage)} / ${info.quota?bytes(info.quota):'ไม่ทราบ'}\`;$('#storag...` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L0660 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0661 | `// อธิบาย: เปิดหน้าต่างคู่มือรูปภาพ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0662 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0663 | `function openGuide(){$('#guideModal').classList.remove('hidden');}` | ประกาศฟังก์ชัน openGuide เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0664 | `// อธิบาย: ปิดหน้าต่างคู่มือรูปภาพ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0665 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0666 | `function closeGuide(){$('#guideModal').classList.add('hidden');}` | ประกาศฟังก์ชัน closeGuide เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0667 | `// อธิบาย: ล้างไฟล์ที่เลือกและผลลัพธ์ในหน้าจอ โดยไม่ลบไฟล์ต้นฉบับในเครื่อง` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0668 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0669 | `function clearAll(){roles.forEach(role=>state.files[role]=null);state.workbooks={};state.workerCachedRoles.clear();state.etlText='';state.preflight=null;$('#...` | ประกาศฟังก์ชัน clearAll เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0670 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0671 | `// อธิบาย: สร้างข้อมูลตัวอย่างเพื่อ preview หน้าตา Excel-like เมื่อยังไม่มีผล run` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0672 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0673 | `function sampleRows(){return[{AgencyCode:'LBI0516',Mticode:'',AgencyName:'ต่างด้าว-SIAM COSMOS (7)',RequestCode:'7240978836',employeeName:'บริษัท ตัวอย่าง จำ...` | ประกาศฟังก์ชัน sampleRows เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0674 | `// อธิบาย: เลือกข้อมูลที่จะใช้ preview: ผลจริงถ้ามี ไม่งั้นใช้ sample` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0675 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0676 | `function previewData(){return state.result?.rows\|\|sampleRows();}` | ประกาศฟังก์ชัน previewData เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0677 | `// อธิบาย: สร้าง HTML table แบบคล้าย Excel จาก headers/rows` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0678 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0679 | `function excelTable(headers,rows,options={}){const head=headers.map((header,index)=>\`<th class="${options.purpleFrom!==undefined&&index>=options.purpleFrom?'...` | ประกาศฟังก์ชัน excelTable เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0680 | `// อธิบาย: ล้าง registry สำหรับกด drill-down ใน preview` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0681 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0682 | `function previewResetDrilldowns(){previewDrillRegistry=[];}` | ประกาศฟังก์ชัน previewResetDrilldowns เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0683 | `// อธิบาย: เก็บรายการย่อยของ block แล้วคืน index สำหรับปุ่ม drill-down` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0684 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0685 | `function previewRegisterDrilldown(title,rows){const index=previewDrillRegistry.length;previewDrillRegistry.push({title,rows:[...(rows\|\|[])]});return index;}` | ประกาศฟังก์ชัน previewRegisterDrilldown เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0686 | `// อธิบาย: สร้าง cell ที่กดดูรายละเอียด block ได้ถ้ามีข้อมูลย่อย` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0687 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0688 | `function previewDrillCell(value,index,className=''){const enabled=index!==null&&index!==undefined&&previewDrillRegistry[index]?.rows?.length;return\`<td class...` | ประกาศฟังก์ชัน previewDrillCell เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0689 | `// อธิบาย: เช็คว่า row ตรงกับ block PV ที่ preview อยู่หรือไม่` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0690 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0691 | `function previewRowMatchesPv(row,pv){` | ประกาศฟังก์ชัน previewRowMatchesPv เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0692 | `  const normalize=BlackwolfEngine.normalize,date=value=>value?normalize.dateKey(new Date(value)):'';` | ประกาศตัวแปร normalize แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0693 | `  return date(row.Date)===date(pv.Date)&&normalize.text(row.Policy)===normalize.text(pv.Policy)&&normalize.text(row.Mticode)===normalize.text(pv.Mticode)&&no...` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0694 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0695 | `// อธิบาย: แสดง label ของ Pivot โดยแทนค่าว่างเป็น (blank)` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0696 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0697 | `function previewPivotLabel(value){return value===null\|\|value===undefined\|\|String(value).trim()===''?'(blank)':value;}` | ประกาศฟังก์ชัน previewPivotLabel เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0698 | `// อธิบาย: แสดง date สำหรับ preview แบบ dd/mm/yyyy หรือ (blank)` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0699 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0700 | `function previewDate(value){return value?BlackwolfEngine.normalize.dateDisplay(new Date(value)):'(blank)';}` | ประกาศฟังก์ชัน previewDate เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0701 | `// อธิบาย: ดึงสถานะสำหรับ preview และแทนค่าว่างเป็น (blank)` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0702 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0703 | `function previewStatusValue(row){const value=BlackwolfEngine.normalize.text(row.Status);return value\|\|'(blank)';}` | ประกาศฟังก์ชัน previewStatusValue เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0704 | `// อธิบาย: เปิด modal แสดงข้อมูลด้านใน block PV/PV Final/Report` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0705 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0706 | `function openPreviewDrilldown(index){` | ประกาศฟังก์ชัน openPreviewDrilldown เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0707 | `  const entry=previewDrillRegistry[Number(index)],modal=$('#previewDrillModal');if(!entry\|\|!modal)return;` | ประกาศตัวแปร entry แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0708 | `  const rows=entry.rows\|\|[],limit=1000,visible=rows.slice(0,limit);` | ประกาศตัวแปร rows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0709 | `  $('#previewDrillTitle').textContent=entry.title;$('#previewDrillCount').textContent=\`${fmt(rows.length)} รายการ${rows.length>limit?\` · แสดง ${fmt(limit)} ร...` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0710 | `  $('#previewDrillBody').innerHTML=visible.map((row,rowIndex)=>\`<tr><td>${fmt(rowIndex+1)}</td><td>${esc(previewDate(row.Date\|\|row.CreateDate))}</td><td><str...` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0711 | `  modal.classList.remove('hidden');` | เพิ่ม/ลบ/สลับ CSS class เพื่อเปลี่ยนสถานะการแสดงผลของหน้าเว็บ |
| L0712 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0713 | `// อธิบาย: ปิด modal drill-down preview` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0714 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0715 | `function closePreviewDrilldown(){$('#previewDrillModal')?.classList.add('hidden');}` | ประกาศฟังก์ชัน closePreviewDrilldown เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0716 | `// อธิบาย: วาด preview ของ PV/PV Final พร้อม block drill-down` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0717 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0718 | `function renderPvPreview(sheet,sourceRows){` | ประกาศฟังก์ชัน renderPvPreview เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0719 | `  const headers=['Date','Policy','Mticode','AgencyName','ProposalID','สถานะไม่ issue','จำนวนวันที่ยังไม่ออกกรมธรรม์','ระยะเวลายังไม่ออกกรมธรรม์','Sum of Tota...` | ประกาศตัวแปร headers แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0720 | `  const allRows=sourceRows.map(row=>({...row,Date:row.Date?new Date(row.Date):null}));` | สร้างตัวช่วยแบบ arrow function ชื่อ allRows เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0721 | `  const statuses=[...new Set(allRows.map(previewStatusValue))];` | ประกาศตัวแปร statuses แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0722 | `  const filteredRows=sheet==='PV'&&previewPvStatusFilter!=='(All)'?allRows.filter(row=>previewStatusValue(row)===previewPvStatusFilter):allRows;` | ประกาศตัวแปร filteredRows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0723 | `  const pvRows=BlackwolfEngine.preview.aggregatePvRows(sheet==='PV'?filteredRows:allRows),limit=250;` | ประกาศตัวแปร pvRows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0724 | `  const headerHtml=headers.map(header=>\`<td class="head-blue pivot-header-cell">${esc(header)} <span>▾</span></td>\`).join('');` | สร้างตัวช่วยแบบ arrow function ชื่อ headerHtml เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0725 | `  const bodyHtml=pvRows.slice(0,limit).map((row,index)=>{` | สร้างตัวช่วยแบบ arrow function ชื่อ bodyHtml เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0726 | `    const source=allRows.filter(item=>previewRowMatchesPv(item,row)),drill=previewRegisterDrilldown(\`${sheet} · ${row.ProposalID\|\|'(blank)'}\`,source),values=...` | สร้างตัวช่วยแบบ arrow function ชื่อ source เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0727 | `    return\`<tr class="pivot-data-row" data-preview-drill="${drill}" tabindex="0"><td class="rownum">${sheet==='PV'?index+5:index+2}</td>${values.map((value,c...` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0728 | `  }).join('');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0729 | `  if(sheet==='PV'){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0730 | `    const options=['(All)',...statuses].map(value=>\`<option value="${esc(value)}"${previewPvStatusFilter===value?' selected':''}>${esc(value)}</option>\`).joi...` | สร้างตัวช่วยแบบ arrow function ชื่อ options เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0731 | `    $('#sheetStage').innerHTML=\`<div class="pivot-preview-note">Pivot Preview · คลิกแถวเพื่อดูข้อมูลต้นทางภายใน Block</div><table class="excel-table pivot-pr...` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0732 | `  }else{` | ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข |
| L0733 | `    $('#sheetStage').innerHTML=\`<div class="pivot-preview-note">PV Final คัดลอกผลจาก PV ชุดเดียวกัน · คลิกแถวเพื่อดูข้อมูลต้นทาง</div><table class="excel-tab...` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0734 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0735 | `  $('#formulaText').textContent=\`PV และ PV Final ใช้ชุดข้อมูลเดียวกัน ${fmt(pvRows.length)} กรมธรรม์ · คลิกเพื่อ Drill-down\`;` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0736 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0737 | `// อธิบาย: เลือก preview sheet ที่ผู้ใช้เลือกและวาดออกหน้าจอ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0738 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0739 | `function renderPreview(sheet){` | ประกาศฟังก์ชัน renderPreview เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0740 | `  state.activePreview=sheet;previewResetDrilldowns();$$('#sheetTabs button').forEach(button=>button.classList.toggle('active',button.dataset.sheet===sheet));...` | กำหนด handler/ฟังก์ชันให้ state.activePreview เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง |
| L0741 | `  if(sheet==='Data'){const headers=['AgencyCode','Mticode','AgencyName','RequestCode','employeeName','alienCode','alienNameEn','CertificateNo','Policy','Tota...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0742 | `  if(sheet==='ข้อมูลไม่สมบูรณ์'){const ids=state.result?.context?.smIds\|\|['7240978836','7240965993'];stage.innerHTML=excelTable(['สถานะ','Prop ID'],ids.map(v...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0743 | `  if(sheet==='Black List'){const ids=state.result?.context?.blIds\|\|['7240888888'];stage.innerHTML=excelTable(['สถานะ','Prop ID'],ids.map(value=>['Blacklist',...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0744 | `  if(sheet==='PV'\|\|sheet==='PV Final'){renderPvPreview(sheet,rows);return;}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0745 | `  renderReportPreview();` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0746 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0747 | `// อธิบาย: วาด preview ของ Report ตาม summary ล่าสุด` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0748 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0749 | `function renderReportPreview(){` | ประกาศฟังก์ชัน renderReportPreview เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0750 | `  const sourceRows=previewData().map(row=>({...row,Date:row.Date?new Date(row.Date):null})),rows=BlackwolfEngine.preview.aggregatePvRows(sourceRows),summary=...` | สร้างตัวช่วยแบบ arrow function ชื่อ sourceRows เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0751 | `  let html='<div class="pivot-preview-note">Report Pivot Preview · เว้น 1 แถวระหว่าง Block และซ่อน Block ที่ไม่มีข้อมูล · คลิกยอดหรือแถวเพื่อดูข้อมูลด้านใน</...` | ประกาศตัวแปร html แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0752 | `  html+=\`<tr><td class="rownum">1</td><td colspan="4" class="blue-title preview-drillable" data-preview-drill="${allDrill}">สถานะไม่ ISSUE.</td></tr>\`;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0753 | `  html+=\`<tr><td class="rownum">2</td><td colspan="2">ยอดเงินที่ยังไม่ Issue</td>${previewDrillCell(money(summary.TotalPremium),allDrill,'money')}<td>บาท</td...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0754 | `  html+='<tr class="report-block-spacer"><td class="rownum">4</td><td colspan="4"></td></tr><tr><td class="rownum">6</td><td colspan="4" class="green-title p...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0755 | `  const aging=BlackwolfEngine.preview.groupByAging(rows);` | ประกาศตัวแปร aging แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0756 | `  let currentRow=8;` | ประกาศตัวแปร currentRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0757 | `  aging.forEach(item=>{const details=rows.filter(row=>row.PendingRange===item[1]),drill=previewRegisterDrilldown(\`Report · ${item[1]}\`,details);html+=\`<tr><t...` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L0758 | `  html+=\`<tr><td class="rownum">${currentRow}</td><td class="grand preview-drillable" data-preview-drill="${allDrill}">Grand Total</td><td class="grand"></td...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0759 | `  const sections=[` | ประกาศตัวแปร sections แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0760 | `    {status:'รอ Issue',label:'รายการที่รอ ISSUE.',header:'head-blue',title:'blue-title'},` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0761 | `    {status:'ติดปัญหาไม่เข้าในเมนู E',label:'รายการติดปัญหาไม่เอาเข้าเมนู E',header:'head-orange',title:'orange-title'},` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0762 | `    {status:'ข้อมูลไม่สมบูรณ์',label:'รายการข้อมูลไม่สมบูรณ์',header:'head-purple',title:'purple-title'},` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0763 | `    {status:'Blacklist',label:'สถานะ Blacklist.',header:'head-red',title:'red-title'}` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0764 | `  ];` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0765 | `  for(const section of sections){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0766 | `    const subset=rows.filter(row=>row.PendingStatus===section.status),groups=BlackwolfEngine.preview.groupStatusRows(rows,section.status);if(!subset.length\|\|...` | สร้างตัวช่วยแบบ arrow function ชื่อ subset เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0767 | `    const sectionDrill=previewRegisterDrilldown(\`Report · ${section.label}\`,subset),sectionPremium=subset.reduce((total,row)=>total+Number(row.TotalPremium\|\|...` | ประกาศตัวแปร sectionDrill แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0768 | `    html+=\`<tr class="report-block-spacer"><td class="rownum">${blankRow}</td><td colspan="4"></td></tr><tr><td class="rownum">${titleRow}</td><td colspan="4...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0769 | `    groups.forEach((group,index)=>{const key=group[0]?BlackwolfEngine.normalize.dateKey(new Date(group[0])):'',details=subset.filter(item=>(item.Date?Blackwo...` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L0770 | `    currentRow=dataStart+groups.length;html+=\`<tr><td class="rownum">${currentRow}</td><td class="grand preview-drillable" data-preview-drill="${sectionDrill...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0771 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0772 | `  html+='</tbody></table>';$('#sheetStage').innerHTML=html;$('#formulaText').textContent='Report เรียง Block ตาม Flow · เว้น 1 แถว · ซ่อน Block ที่ไม่มีข้อมู...` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0773 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0774 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0775 | `// อธิบาย: รีเซ็ตข้อมูลใน Browser เช่น history, setting, local archive ตามที่ผู้ใช้ยืนยัน` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0776 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0777 | `async function resetProgram(){const ok=await confirmAction('รีเซ็ตโปรแกรม','ล้าง Run History, Excel ที่เก็บใน Browser, ภาษา ธีม และไฟล์ที่เลือกทั้งหมดหรือไม่...` | ประกาศฟังก์ชัน resetProgram เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0778 | `// อธิบาย: ผูก event ทุกปุ่ม/input/drag-drop ตอนเริ่มโปรแกรม` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0779 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0780 | `function bind(){` | ประกาศฟังก์ชัน bind เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0781 | `  $$('.nav').forEach(button=>button.addEventListener('click',()=>setPage(button.dataset.page)));$$('[data-go]').forEach(button=>button.addEventListener('clic...` | ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด |
| L0782 | `  $('#bulkInput').addEventListener('change',event=>loadFiles(event.target.files));const zone=$('#dropZone');zone.addEventListener('dragover',event=>{event.pr...` | ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด |
| L0783 | `  $('#autoMail72Input').addEventListener('input',()=>syncEtl(true));$('#manualStartDate').addEventListener('change',()=>invalidate({resetWorker:false,clearWo...` | ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด |
| L0784 | `  $('#refreshHistory').addEventListener('click',renderHistory);$('#refreshReportBtn').addEventListener('click',()=>{renderReport();toast('อัปเดตรายงานแล้ว');...` | ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด |
| L0785 | `  $('#guideBtn').addEventListener('click',openGuide);$('#settingsGuideBtn').addEventListener('click',openGuide);$('#guideClose').addEventListener('click',clo...` | ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด |
| L0786 | `  $('#sheetStage').addEventListener('click',event=>{const target=event.target.closest('[data-preview-drill]');if(target)openPreviewDrilldown(target.dataset.p...` | ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด |
| L0787 | `  $('#previewDrillClose').addEventListener('click',closePreviewDrilldown);$('#previewDrillModal').addEventListener('click',event=>{if(event.target.id==='prev...` | ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด |
| L0788 | `  $('#themeBtn').addEventListener('click',()=>applyTheme(document.body.classList.contains('dark')?'light':'dark'));$$('[data-theme-value]').forEach(button=>b...` | ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด |
| L0789 | `  $('#refreshSystemStatusBtn').addEventListener('click',refreshSystemStatus);$('#requestPersistenceBtn').addEventListener('click',async()=>{const ok=await Bl...` | ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด |
| L0790 | `  $$('#sheetTabs button').forEach(button=>button.addEventListener('click',()=>renderPreview(button.dataset.sheet)));` | ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด |
| L0791 | `  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')BlackwolfDB.pruneExpired().then(renderHistory).catch(()=>{});});` | ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด |
| L0792 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0793 | `// อธิบาย: ฟังก์ชันเริ่มต้นของ app: โหลด setting, เปิด worker, prune history, bind event และ render UI แรก` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0794 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0795 | `async function init(){` | ประกาศฟังก์ชัน init เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0796 | `  window.addEventListener('error',event=>recordDiagnosticError('window.error',event.error\|\|new Error(event.message\|\|'Window error'),'BW-WINDOW'));` | ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด |
| L0797 | `  window.addEventListener('unhandledrejection',event=>recordDiagnosticError('window.unhandledrejection',event.reason instanceof Error?event.reason:new Error(...` | ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด |
| L0798 | `  bind();applyTheme(storage.get(storageKey('theme'))\|\|'light');applyLanguage(state.language);updateClock();clockTimer=setInterval(updateClock,1000);renderFil...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0799 | `  await initWorker();` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L0800 | `  if(location.protocol==='file:'&&!state.workerReady){const banner=$('#runtimeBanner');if(banner){banner.classList.remove('hidden');banner.innerHTML='<strong...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0801 | `  try{await BlackwolfDB.requestPersistent();}catch{}` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L0802 | `  await BlackwolfDB.pruneExpired().catch(()=>0);await renderHistory();await refreshSystemStatus();` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L0803 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0804 | `init();` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0805 | `})();` | ปิดฟังก์ชันครอบไฟล์ และสั่งให้โค้ดภายในเริ่มทำงานทันที |
