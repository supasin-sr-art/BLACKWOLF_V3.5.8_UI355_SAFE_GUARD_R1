// [L0001] เริ่ม IIFE/ฟังก์ชันครอบไฟล์ เพื่อแยก scope ไม่ให้ตัวแปรชนกับไฟล์อื่น
(function(){
// [L0002] เปิด strict mode เพื่อให้ JavaScript จับข้อผิดพลาดเข้มขึ้น เช่น ห้ามใช้ตัวแปรที่ยังไม่ประกาศ
'use strict';
// [L0003] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0004] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0005] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// BLACKWOLF TEACHING COMMENTS: คอมเมนต์ชุดนี้เพิ่มเพื่ออธิบาย logic สำหรับอ่าน/ดูแลโค้ด
// [L0006] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// หลักสำคัญ: คอมเมนต์ขึ้นต้นด้วย // จะไม่ถูกรัน จึงไม่เปลี่ยน behavior ของ JavaScript
// [L0007] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ภาพรวม: ไฟล์ควบคุมหน้าจอหลักของ BLACKWOLF ทั้งหมด เช่น ปุ่ม, อัปโหลดไฟล์, progress, dashboard, results, report, history และ settings
// [L0008] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ภาพรวม: ทำหน้าที่เป็นตัวกลางระหว่างผู้ใช้, Web Worker, IndexedDB และ Engine
// [L0009] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ภาพรวม: ไม่ได้คำนวณ Excel หนัก ๆ เอง แต่ส่งงานให้ worker/engine เพื่อความเร็วและลดการค้าง
// [L0010] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ตัวช่วยเลือก element ตัวแรกจาก CSS selector เพื่อลดการเขียน document.querySelector ซ้ำ
// [L0011] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้
// [L0012] ประกาศตัวแปร $ แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
const $=(selector,root=document)=>root.querySelector(selector);
// [L0013] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ตัวช่วยเลือก elements หลายตัวแล้วแปลงเป็น Array เพื่อให้ forEach/map ได้ทันที
// [L0014] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้
// [L0015] ประกาศตัวแปร $$ แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
// [L0016] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ผูก event ให้ element แบบปลอดภัย ถ้า selector ไม่เจอจะไม่ทำให้โปรแกรม error
// [L0017] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้
// [L0018] สร้างตัวช่วยแบบ arrow function ชื่อ on เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
const on=(selector,event,handler)=>{const element=$(selector);if(element)element.addEventListener(event,handler);return element;};
// [L0019] กำหนดค่าคงที่ CONFIG สำหรับใช้เป็นค่ากลางของ flow นี้
const CONFIG=window.BLACKWOLF_CONFIG;
// [L0020] สร้าง object/array requiredRoles เพื่อเก็บสถานะหรือข้อมูลอ้างอิงที่ UI/ระบบใช้ร่วมกัน
const requiredRoles=['master','issue','daily','m190'];
// [L0021] สร้าง object/array roles เพื่อเก็บสถานะหรือข้อมูลอ้างอิงที่ UI/ระบบใช้ร่วมกัน
const roles=['master','issue','daily','m190','sm','blacklist','etl'];
// [L0022] สร้าง object/array display เพื่อเก็บสถานะหรือข้อมูลอ้างอิงที่ UI/ระบบใช้ร่วมกัน
const display={master:'ไฟล์หลัก / Master Working File',issue:'ไฟล์หลัก / เช็คสถานะ ISSUE',daily:'Daily Report',m190:'M190 Premium by Policy',sm:'ข้อมูลไม่สมบูรณ์ / SM',blacklist:'Blacklist',etl:'Auto-Mail 7.2'};
// [L0023] กำหนดค่าคงที่ RETENTION_MS สำหรับใช้เป็นค่ากลางของ flow นี้
const RETENTION_MS=CONFIG.retentionDays*24*60*60*1000;
// [L0024] สร้าง object/array storage เพื่อเก็บสถานะหรือข้อมูลอ้างอิงที่ UI/ระบบใช้ร่วมกัน
const storage={
// [L0025] อ่านหรือบันทึกข้อมูลชั่วคราวใน Browser เช่น session login หรือค่าที่ผู้ใช้เลือกจำไว้
  get:key=>{try{return localStorage.getItem(key);}catch{return null;}},
// [L0026] อ่านหรือบันทึกข้อมูลชั่วคราวใน Browser เช่น session login หรือค่าที่ผู้ใช้เลือกจำไว้
  set:(key,value)=>{try{localStorage.setItem(key,value);}catch{}},
// [L0027] อ่านหรือบันทึกข้อมูลชั่วคราวใน Browser เช่น session login หรือค่าที่ผู้ใช้เลือกจำไว้
  remove:key=>{try{localStorage.removeItem(key);}catch{}}
// [L0028] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
};
// [L0029] สร้างตัวช่วยแบบ arrow function ชื่อ storageKey เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
const storageKey=name=>`${CONFIG.storageNamespace}.${name}`;
// [L0030] สร้าง object/array state เพื่อเก็บสถานะหรือข้อมูลอ้างอิงที่ UI/ระบบใช้ร่วมกัน
const state={
// [L0031] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
  files:Object.fromEntries(roles.map(role=>[role,null])),
// [L0032] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  workbooks:{},
// [L0033] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  etlText:'',
// [L0034] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  preflight:null,
// [L0035] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  result:null,
// [L0036] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  activePreview:'Report',
// [L0037] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  worker:null,
// [L0038] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  workerReady:false,
// [L0039] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  workerSeq:0,
// [L0040] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  workerJobs:new Map(),
// [L0041] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  workerCachedRoles:new Set(),
// [L0042] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  workerGeneration:0,
// [L0043] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  workerLastHeartbeat:null,
// [L0044] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  activeWorkerJobId:null,
// [L0045] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  cancelRequested:false,
// [L0046] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  language:storage.get(storageKey('language'))||'th',
// [L0047] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  running:false,
// [L0048] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  classifying:false,
// [L0049] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  diagnosticErrors:[],
  // SAFE GUARD R1: รวม lock ของ action ที่ไม่ควรรันซ้อน เช่น upload/preflight/run/download
  actionLocks:new Set(),
  // SAFE GUARD R1: กัน confirm modal เปิดซ้อนกันหลายชั้น
  confirmPending:false,
  // SAFE GUARD R1: กัน bind event ซ้ำ หาก init ถูกเรียกซ้ำจาก browser/devtools โดยไม่ตั้งใจ
  boundEvents:false
// [L0050] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
};
// [L0051] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
let toastTimer,historyCountdownTimer,clockTimer,pageJumpTimer,lastProgressAt=0;
// [L0052] ประกาศตัวแปร selectedDetailIndex แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
let selectedDetailIndex=null;
// [L0053] ประกาศตัวแปร previewDrillRegistry แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
let previewDrillRegistry=[];
// [L0054] ประกาศตัวแปร previewPvStatusFilter แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
let previewPvStatusFilter='(All)';
// [L0055] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: พักงานสั้น ๆ เพื่อคืนจังหวะให้ Browser วาดหน้าจอและแสดง progress
// [L0056] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้
// [L0057] ประกาศตัวแปร yieldUi แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
const yieldUi=(milliseconds=0)=>new Promise(resolve=>setTimeout(resolve,milliseconds));
// SAFE GUARD R1: ตรวจว่าหน้าจอกำลังยุ่งกับงานสำคัญหรือไม่ เพื่อปิดปุ่ม/กัน action ซ้อน
function isUiBusy(){return state.running||state.classifying||state.actionLocks.has('preflight')||state.actionLocks.has('run')||state.actionLocks.has('history-open')||state.actionLocks.has('diagnostic-export')||state.actionLocks.has('report-image');}
// [L0058] กำหนดค่าคงที่ WORKER_INACTIVITY_TIMEOUTS สำหรับใช้เป็นค่ากลางของ flow นี้
const WORKER_INACTIVITY_TIMEOUTS={ping:4500,'detect-file':180000,'load-file':600000,validate:600000,run:900000,reset:120000};
// [L0059] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง Error ที่มี error code มาตรฐาน เพื่อให้ผู้ใช้เอารหัสไปค้นหาสาเหตุได้
// [L0060] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0061] ประกาศฟังก์ชัน appError เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function appError(code,message,cause){const error=new Error(message);error.code=code||'BW-UNCLASSIFIED';if(cause)error.cause=cause;return error;}
// [L0062] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แปลง Error เป็นข้อความอ่านง่าย โดยรวม error code กับ message
// [L0063] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0064] ประกาศฟังก์ชัน errorText เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function errorText(error){return`${error?.code?`[${error.code}] `:''}${error?.message||String(error||'Unknown error')}`;}
// [L0065] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0066] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: escape ข้อความก่อนใส่ HTML เพื่อลดโอกาส HTML แทรกผิดรูปหรือ XSS จากข้อมูลไฟล์
// [L0067] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0068] ประกาศฟังก์ชัน esc เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function esc(value){return String(value??'').replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));}
// [L0069] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แสดงตัวเลขรูปแบบไทย เช่น ใส่ comma ให้อ่านง่าย
// [L0070] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0071] ประกาศฟังก์ชัน fmt เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function fmt(value){return Number(value||0).toLocaleString('th-TH');}
// [L0072] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แสดงจำนวนเงิน/เบี้ยประกัน โดยคุมจำนวนทศนิยมให้เหมาะกับรายงาน
// [L0073] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0074] ประกาศฟังก์ชัน money เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function money(value){return Number(value||0).toLocaleString('th-TH',{minimumFractionDigits:0,maximumFractionDigits:2});}
// [L0075] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แปลงจำนวน byte เป็น B/KB/MB/GB เพื่อใช้ในหน้าสถานะระบบ
// [L0076] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0077] ประกาศฟังก์ชัน bytes เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function bytes(value){const size=Number(value||0);if(size<1024)return`${size} B`;if(size<1048576)return`${(size/1024).toFixed(1)} KB`;if(size<1073741824)return`${(size/1048576).toFixed(1)} MB`;return`${(size/1073741824).toFixed(2)} GB`;}
// [L0078] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แสดงกล่องแจ้งเตือนสั้น ๆ มุมหน้าจอ แล้วซ่อนอัตโนมัติ
// [L0079] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0080] ประกาศฟังก์ชัน toast เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function toast(message,milliseconds=3000){const element=$('#toast');element.textContent=message;element.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>element.classList.remove('show'),milliseconds);}
// [L0081] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อัปเดต status chip ด้านบนของระบบ เช่น Ready, Running, Error
// [L0082] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0083] ประกาศฟังก์ชัน setStatus เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function setStatus(label,type=''){const element=$('#globalStatus');element.textContent=label;element.className=`status-chip ${type}`;}
// [L0084] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: คืนชื่อหน้าเมนูตามภาษาที่เลือก
// [L0085] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0086] ประกาศฟังก์ชัน pageTitles เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function pageTitles(){return state.language==='en'?{prepare:'Prepare & Run',dashboard:'Executive Dashboard',results:'Approval & Download',report:'Executive Report',history:'Run History',settings:'Settings'}:{prepare:'เตรียมไฟล์และรัน',dashboard:'แดชบอร์ดผู้บริหาร',results:'ตรวจผลและดาวน์โหลด',report:'รายงานผู้บริหาร',history:'ประวัติการรัน',settings:'การตั้งค่า'};}
// [L0087] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เปลี่ยนภาษา UI และบันทึกค่าลง localStorage
// [L0088] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0089] ประกาศฟังก์ชัน applyLanguage เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function applyLanguage(language){state.language=language==='en'?'en':'th';storage.set(storageKey('language'),state.language);const labels=pageTitles();$$('.nav').forEach(button=>{const label=$('b',button);if(label)label.textContent=labels[button.dataset.page]||label.textContent;});$$('[data-language]').forEach(button=>button.classList.toggle('active',button.dataset.language===state.language));const active=$('.page.active')?.id.replace('page-','')||'prepare';$('#pageTitle').textContent=labels[active]||active;}
// [L0090] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เปลี่ยนธีม light/dark และบันทึกค่าลง localStorage
// [L0091] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0092] ประกาศฟังก์ชัน applyTheme เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function applyTheme(theme){const normalized=theme==='dark'?'dark':'light';document.body.classList.toggle('dark',normalized==='dark');storage.set(storageKey('theme'),normalized);$$('[data-theme-value]').forEach(button=>button.classList.toggle('active',button.dataset.themeValue===normalized));}
// [L0093] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เปลี่ยนหน้าที่กำลังแสดง และ sync สถานะปุ่มเมนู
// [L0094] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0095] ประกาศฟังก์ชัน setPage เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function setPage(page){$$('.page').forEach(element=>element.classList.toggle('active',element.id===`page-${page}`));$$('.nav').forEach(element=>element.classList.toggle('active',element.dataset.page===page));$('#pageTitle').textContent=pageTitles()[page]||page;if(page==='history')renderHistory();if(page==='report')renderReport();if(page==='settings')refreshSystemStatus();window.scrollTo({top:0,behavior:'smooth'});}
// [L0096] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อัปเดตวันเวลาแบบ real-time บน topbar
// [L0097] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0098] ประกาศฟังก์ชัน updateClock เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function updateClock(){const date=new Date();$('#liveDateTime').textContent=date.toLocaleString('th-TH',{weekday:'short',day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'});}
// [L0099] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อ่าน Manual Start Date จากช่องกรอก เพื่อใช้กรณี Master ไม่มี Date เดิม
// [L0100] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0101] ประกาศฟังก์ชัน manualStartDate เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function manualStartDate(){return $('#manualStartDate')?.value||'';}
// [L0102] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0103] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: จัดรูปแบบเวลาสำหรับไฟล์ diagnostic package
// [L0104] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0105] ประกาศฟังก์ชัน diagnosticTimestamp เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function diagnosticTimestamp(date=new Date()){
// [L0106] สร้างตัวช่วยแบบ arrow function ชื่อ pad เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const pad=value=>String(value).padStart(2,'0');
// [L0107] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return`${date.getFullYear()}${pad(date.getMonth()+1)}${pad(date.getDate())}_${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
// [L0108] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0109] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แปลงค่าที่อาจใหญ่หรือซับซ้อนให้ปลอดภัยก่อนใส่ diagnostic JSON
// [L0110] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0111] ประกาศฟังก์ชัน diagnosticSafeValue เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function diagnosticSafeValue(value){
// [L0112] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(value===undefined)return null;
// [L0113] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
  try{return JSON.parse(JSON.stringify(value));}catch{return String(value);}
// [L0114] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0115] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: บันทึก error ล่าสุดลง state เพื่อ export ให้ตรวจย้อนหลังได้
// [L0116] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0117] ประกาศฟังก์ชัน recordDiagnosticError เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function recordDiagnosticError(source,error,code='BW-UNCLASSIFIED'){
// [L0118] ประกาศตัวแปร item แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const item={timestamp:new Date().toISOString(),source:String(source||'unknown'),code,message:error?.message||String(error||'Unknown error'),stack:error?.stack||''};
// [L0119] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  state.diagnosticErrors.push(item);
// [L0120] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(state.diagnosticErrors.length>50)state.diagnosticErrors.splice(0,state.diagnosticErrors.length-50);
// [L0121] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return item;
// [L0122] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0123] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สรุปรายละเอียดไฟล์ที่เลือก เช่น ชื่อ ขนาด เวลาแก้ไขล่าสุด
// [L0124] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0125] ประกาศฟังก์ชัน selectedFileMetadata เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function selectedFileMetadata(){
// [L0126] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return roles.map(role=>{
// [L0127] ประกาศตัวแปร file แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const file=state.files[role];
// [L0128] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
    return{role,label:display[role],selected:!!file,name:file?.name||null,size:file?.size||0,sizeDisplay:file?bytes(file.size):null,type:file?.type||null,lastModified:file?.lastModified?new Date(file.lastModified).toISOString():null};
// [L0129] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  });
// [L0130] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0131] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ย่อข้อมูล Run History ให้พอแสดงใน UI โดยไม่โหลด blob ใหญ่เกินจำเป็น
// [L0132] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0133] ประกาศฟังก์ชัน compactHistoryRecord เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function compactHistoryRecord(record){
// [L0134] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{id:record.id||null,status:record.status||null,createdAt:record.createdAt||null,expiresAt:record.expiresAt||null,message:record.message||null,outputNames:diagnosticSafeValue(record.outputNames||{}),summary:diagnosticSafeValue(record.summary||{})};
// [L0135] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0136] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้างไฟล์ ZIP diagnostic รวมสถานะระบบ ไฟล์ที่เลือก และ error log สำหรับ debug
// [L0137] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0138] ประกาศฟังก์ชัน exportDiagnosticPackage เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function exportDiagnosticPackage(){
  if(state.actionLocks.has('diagnostic-export')){toast('Diagnostic ZIP กำลังสร้างอยู่ กรุณารอให้จบก่อน',3000);return;}
  state.actionLocks.add('diagnostic-export');refreshReady();
// [L0139] ประกาศตัวแปร button แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const button=$('#exportDiagnosticBtn'),status=$('#diagnosticExportStatus');
// [L0140] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(button)button.disabled=true;
// [L0141] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(status)status.textContent='กำลังรวบรวมข้อมูลตรวจสอบ...';
// [L0142] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
  try{
// [L0143] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(typeof JSZip==='undefined')throw new Error('JSZip ไม่พร้อมใช้งาน');
// [L0144] ประกาศตัวแปร now แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const now=new Date(),packageId=`BW-DIAG-${diagnosticTimestamp(now)}`;
// [L0145] ประกาศตัวแปร storageInfo แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    let storageInfo={usage:0,quota:0,persisted:false},history=[];
// [L0146] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
    try{storageInfo=await BlackwolfDB.storageInfo();}catch(error){recordDiagnosticError('diagnostic.storageInfo',error,'BW-DIAG-STORAGE');}
// [L0147] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
    try{history=(await BlackwolfDB.list()).map(compactHistoryRecord);}catch(error){recordDiagnosticError('diagnostic.history',error,'BW-DIAG-HISTORY');}
// [L0148] ประกาศตัวแปร environment แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const environment={
// [L0149] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      packageId,generatedAt:now.toISOString(),appVersion:CONFIG.version,displayVersion:CONFIG.displayVersion,edition:CONFIG.edition,
// [L0150] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      location:{protocol:location.protocol,host:location.host||null,path:location.pathname},
// [L0151] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      browser:{userAgent:navigator.userAgent,platform:navigator.platform||null,language:navigator.language,languages:navigator.languages||[],online:navigator.onLine,hardwareConcurrency:navigator.hardwareConcurrency||null,deviceMemory:navigator.deviceMemory||null,maxTouchPoints:navigator.maxTouchPoints||0},
// [L0152] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      screen:{width:screen.width,height:screen.height,availWidth:screen.availWidth,availHeight:screen.availHeight,pixelRatio:window.devicePixelRatio||1},
// [L0153] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||null,
// [L0154] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      worker:{ready:state.workerReady,generation:state.workerGeneration,lastHeartbeat:state.workerLastHeartbeat,cachedRoles:[...state.workerCachedRoles],pendingJobs:state.workerJobs.size,activeJobId:state.activeWorkerJobId},
// [L0155] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      workflow:{running:state.running,classifying:state.classifying,activePreview:state.activePreview,preflightOk:state.preflight?.ok??null,currentRunId:state.result?.runId||null},
// [L0156] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      capacity:memoryCapacityAdvice(),
// [L0157] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      storage:{usage:storageInfo.usage||0,quota:storageInfo.quota||0,persisted:!!storageInfo.persisted,retentionDays:CONFIG.retentionDays}
// [L0158] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
    };
// [L0159] ประกาศตัวแปร outputMetadata แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const outputMetadata=state.result?{
// [L0160] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      runId:state.result.runId||null,names:diagnosticSafeValue(state.result.outputs?.names||{}),
// [L0161] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      masterSize:state.result.outputs?.master?.size||0,issueSize:state.result.outputs?.issue?.size||0
// [L0162] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    }:null;
// [L0163] ประกาศตัวแปร diagnostic แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const diagnostic={
// [L0164] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      packageId,generatedAt:now.toISOString(),privacyNotice:'แพ็กเกจนี้ไม่รวมข้อมูลแรงงาน รายการ Data, รหัสผ่าน, ไฟล์ Excel ต้นฉบับ หรือไฟล์ผลลัพธ์',
// [L0165] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      environment,files:selectedFileMetadata(),preflight:diagnosticSafeValue(state.preflight),runSummary:diagnosticSafeValue(state.result?.summary||null),outputMetadata,
// [L0166] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      errors:diagnosticSafeValue(state.diagnosticErrors),historyCount:history.length
// [L0167] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
    };
// [L0168] ประกาศตัวแปร logText แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const logText=$('#logBox')?.innerText?.trim()||'ไม่มี Run Log ในหน้าปัจจุบัน';
// [L0169] ประกาศตัวแปร readme แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const readme=[
// [L0170] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      'BLACKWOLF Diagnostic Package',
// [L0171] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      `Package ID: ${packageId}`,
// [L0172] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      `Generated: ${now.toISOString()}`,
// [L0173] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      '',
// [L0174] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      'ไฟล์ภายใน:',
// [L0175] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      '- diagnostic.json: สรุปสถานะระบบและ Error',
// [L0176] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      '- environment.json: Browser / Worker / Storage',
// [L0177] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      '- file-metadata.json: ชื่อและขนาดไฟล์ที่เลือก (ไม่มีเนื้อหาข้อมูล)',
// [L0178] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      '- preflight.json: ผลตรวจโครงสร้างล่าสุด',
// [L0179] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      '- run-summary.json: Summary ล่าสุดเท่านั้น',
// [L0180] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      '- run-log.txt: Log ที่แสดงบนหน้าจอ',
// [L0181] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      '- history-summary.json: Summary ของ Run History โดยไม่แนบ Workbook หรือข้อมูลรายแถว',
// [L0182] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      '',
// [L0183] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      'ส่ง ZIP นี้ให้ผู้ดูแลพร้อม Screenshot และบอกขั้นตอนก่อนเกิดปัญหา',
// [L0184] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      'ข้อควรระวัง: แพ็กเกจไม่เก็บ Username/Password และไม่แนบไฟล์ Excel'
// [L0185] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    ].join('\r\n');
// [L0186] ประกาศตัวแปร zip แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const zip=new JSZip();
// [L0187] ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache
    zip.file('README.txt',readme);
// [L0188] ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache
    zip.file('diagnostic.json',JSON.stringify(diagnostic,null,2));
// [L0189] ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache
    zip.file('environment.json',JSON.stringify(environment,null,2));
// [L0190] ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache
    zip.file('file-metadata.json',JSON.stringify(selectedFileMetadata(),null,2));
// [L0191] ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache
    zip.file('preflight.json',JSON.stringify(diagnosticSafeValue(state.preflight),null,2));
// [L0192] ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache
    zip.file('run-summary.json',JSON.stringify(diagnosticSafeValue(state.result?.summary||null),null,2));
// [L0193] ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache
    zip.file('run-log.txt',logText);
// [L0194] ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache
    zip.file('history-summary.json',JSON.stringify(history,null,2));
// [L0195] ประกาศตัวแปร blob แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const blob=await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:6}});
// [L0196] เริ่ม loop แบบวนซ้ำตามเงื่อนไข ใช้รอหรือทำงานจนกว่าจะครบเงื่อนไข
    downloadBlob(blob,`${packageId}.zip`);
// [L0197] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(status)status.textContent=`สร้างสำเร็จ: ${packageId}`;
// [L0198] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    toast('สร้าง Diagnostic ZIP สำเร็จ — ไม่มีข้อมูลแรงงานหรือรหัสผ่าน',5000);
// [L0199] จับ error จาก try block แล้วแปลงเป็นข้อความ/สถานะที่ผู้ใช้หรือระบบเข้าใจได้
  }catch(error){
// [L0200] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    recordDiagnosticError('exportDiagnosticPackage',error,'BW-DIAG-EXPORT');
// [L0201] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(status)status.textContent=`สร้างไม่สำเร็จ: ${error.message}`;
// [L0202] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    toast(`สร้าง Diagnostic ZIP ไม่สำเร็จ: ${error.message}`,6500);
// [L0203] ส่วนที่ต้องทำเสมอหลัง try/catch เช่น ปลดล็อกปุ่ม เคลียร์สถานะ หรือคืน resource
  }finally{if(button)button.disabled=false;state.actionLocks.delete('diagnostic-export');refreshReady();}
// [L0204] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0205] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0206] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ตรวจว่าไฟล์ที่ผู้ใช้ลากเข้ามาเป็น Master/Daily/Issue/M190/SM/Blacklist/Auto-Mail จากโครงสร้างจริง
// [L0207] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0208] ประกาศฟังก์ชัน detectFileRole เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function detectFileRole(file){
// [L0209] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(file.name.toLowerCase().endsWith('.txt'))return{role:'etl',message:'ไฟล์ข้อความ Auto-Mail 7.2'};
// [L0210] ประกาศตัวแปร buffer แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let buffer=await file.arrayBuffer();
// [L0211] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(state.workerReady){
// [L0212] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
    try{const result=await workerRequest('detect-file',{file:{name:file.name,buffer}},[buffer]);if(result.role)state.workerCachedRoles.add(result.role);return result;}
// [L0213] จับ error จาก try block แล้วแปลงเป็นข้อความ/สถานะที่ผู้ใช้หรือระบบเข้าใจได้
    catch(error){console.warn('Worker detection fallback',error);buffer=await file.arrayBuffer();}
// [L0214] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0215] สร้างตัวช่วยแบบ arrow function ชื่อ pseudo เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const pseudo={name:file.name,arrayBuffer:async()=>buffer};
// [L0216] ประกาศตัวแปร workbook แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const workbook=await BlackwolfEngine.readWorkbook(pseudo);
// [L0217] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return BlackwolfEngine.detectWorkbookRole(workbook,file.name);
// [L0218] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0219] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: รับไฟล์จาก input/drop แล้วจัดเข้า role ที่ถูกต้อง พร้อม cache workbook ที่อ่านแล้ว
// [L0220] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0221] ประกาศฟังก์ชัน loadFiles เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function loadFiles(fileList){
// [L0222] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(state.running){toast('กำลัง Run อยู่ กรุณารอให้จบหรือกด Cancel Run ก่อน Upload ใหม่',4500);return;}
  if(state.classifying||state.actionLocks.has('upload')){toast('กำลังจำแนกไฟล์อยู่ กรุณารอให้จบก่อน',3000);return;}
  state.actionLocks.add('upload');
// [L0223] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  state.classifying=true;
// [L0224] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  setStatus('CLASSIFYING','running');
// [L0225] ประกาศตัวแปร matched แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let matched=0;
// [L0226] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
  try{
// [L0227] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
    for(const file of [...fileList]){
// [L0228] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
      if(file.name.toLowerCase().endsWith('.txt')){
// [L0229] ประกาศตัวแปร content แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
        const content=await file.text();
// [L0230] ประกาศตัวแปร input แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
        const input=$('#autoMail72Input');
// [L0231] อ่านหรือเขียนข้อความ/ค่าฟอร์มบนหน้าเว็บ
        input.value=input.value.trim()?`${input.value.trim()}\n${content.trim()}`:content;
// [L0232] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
        state.files.etl=file;
// [L0233] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
        syncEtl(false);
// [L0234] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
        matched++;
// [L0235] ข้ามรอบ loop ปัจจุบัน แล้วไปตรวจรายการถัดไปทันที
        continue;
// [L0236] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
      }
// [L0237] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      toast(`กำลังตรวจโครงสร้าง ${file.name}`,1600);
// [L0238] ประกาศตัวแปร detection แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
      const detection=await detectFileRole(file);
// [L0239] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
      if(!detection.role){toast(`จำแนกไฟล์ไม่ได้: ${file.name} — ${detection.message}`,6000);continue;}
// [L0240] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
      if(state.files[detection.role])toast(`แทนที่ ${display[detection.role]} ด้วย ${file.name}`,3500);
// [L0241] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      state.files[detection.role]=file;
// [L0242] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      matched++;
// [L0243] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
      await yieldUi(10);
// [L0244] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
    }
// [L0245] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(matched){invalidate({resetWorker:false,clearWorkbooks:true});renderFiles();toast(`รับและจำแนกไฟล์จากโครงสร้างภายในแล้ว ${matched} รายการ`,4200);}
// [L0246] จับ error จาก try block แล้วแปลงเป็นข้อความ/สถานะที่ผู้ใช้หรือระบบเข้าใจได้
  }catch(error){recordDiagnosticError('loadFiles',error,'BW-FILE-READ');console.error(error);toast(`อ่านไฟล์ไม่สำเร็จ: ${error.message}`,6000);}
// [L0247] ส่วนที่ต้องทำเสมอหลัง try/catch เช่น ปลดล็อกปุ่ม เคลียร์สถานะ หรือคืน resource
  finally{state.classifying=false;state.actionLocks.delete('upload');const input=$('#bulkInput');if(input)input.value='';refreshReady();}
// [L0248] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0249] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ล้างผล preflight/result เดิมเมื่อไฟล์หรือค่าเปลี่ยน เพื่อกันใช้ผลลัพธ์เก่า
// [L0250] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0251] ประกาศฟังก์ชัน invalidate เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function invalidate({resetWorker=true,clearWorkbooks=true}={}){if(clearWorkbooks)state.workbooks={};state.preflight=null;$('#preflightResult')?.classList.add('hidden');$('#progressPanel')?.classList.add('hidden');if(resetWorker){state.workerCachedRoles.clear();try{state.worker?.postMessage({id:++state.workerSeq,type:'reset'});}catch{}}refreshReady();}
// [L0252] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ประเมินความพร้อมด้าน memory/storage ของ Browser ก่อนรันไฟล์ใหญ่
// [L0253] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0254] ประกาศฟังก์ชัน memoryCapacityAdvice เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function memoryCapacityAdvice(){
// [L0255] สร้างตัวช่วยแบบ arrow function ชื่อ total เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const total=roles.reduce((sum,role)=>sum+Number(state.files[role]?.size||0),0),deviceMemory=Number(navigator.deviceMemory||0);
// [L0256] ประกาศตัวแปร advisoryLimit แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const advisoryLimit=deviceMemory&&deviceMemory<=4?250*1024**2:deviceMemory&&deviceMemory<=8?500*1024**2:750*1024**2;
// [L0257] ประกาศตัวแปร level แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const level=total>advisoryLimit?'warn':total>advisoryLimit*.7?'watch':'ok';
// [L0258] ประกาศตัวแปร ram แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const ram=deviceMemory?`${deviceMemory} GB RAM profile`:'Browser ไม่รายงาน RAM';
// [L0259] ประกาศตัวแปร text แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const text=total?`ไฟล์รวม ${bytes(total)} · ${ram} · ระดับทดสอบแนะนำไม่เกิน ${bytes(advisoryLimit)}`:`${ram} · ระบบใช้ Dense Workbook + Worker Cache เพื่อลดการอ่านซ้ำ`;
// [L0260] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{total,deviceMemory,advisoryLimit,level,text};
// [L0261] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0262] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แสดงคำแนะนำพื้นที่/หน่วยความจำบน UI
// [L0263] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0264] ประกาศฟังก์ชัน renderCapacityHint เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function renderCapacityHint(){
// [L0265] ประกาศตัวแปร element แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const element=$('#capacityHint');if(!element)return;
// [L0266] ประกาศตัวแปร advice แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const advice=memoryCapacityAdvice();element.className=`capacity-hint ${advice.level}`;
// [L0267] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('strong',element).textContent=advice.level==='warn'?'ขนาดไฟล์สูงกว่าระดับทดสอบของเครื่องนี้':advice.level==='watch'?'ขนาดไฟล์เริ่มสูง — ปิดโปรแกรมอื่นก่อน Run':'ขนาดไฟล์อยู่ในระดับปกติ';
// [L0268] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('small',element).textContent=advice.text;
// [L0269] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0270] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: วาดรายการไฟล์ที่แนบแล้วในหน้า Prepare
// [L0271] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0272] ประกาศฟังก์ชัน renderFiles เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function renderFiles(){
// [L0273] สร้างตัวช่วยแบบ arrow function ชื่อ ready เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const ready=requiredRoles.filter(role=>state.files[role]).length;
// [L0274] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('#readyCount').textContent=`${ready}/4`;
// [L0275] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('#fileChips').innerHTML=roles.map(role=>{
// [L0276] ประกาศตัวแปร file แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const file=state.files[role],optional=!requiredRoles.includes(role);
// [L0277] ประกาศตัวแปร emptyText แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    let emptyText=optional?'Optional — ไม่ได้เลือก':'Required — ยังไม่ได้เลือก';
// [L0278] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(role==='etl')emptyText=state.etlText?'ใช้ข้อความ Auto-Mail 7.2 ด้านล่าง':'ไม่มีข้อมูลรอบนี้ — ETL เดิมใน ISSUE จะถูกล้าง';
// [L0279] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
    return`<div class="file-chip ${file?'ready':''} ${optional?'optional':''}"><strong>${esc(display[role])}</strong><small>${file?esc(file.name):emptyText}</small></div>`;
// [L0280] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  }).join('');
// [L0281] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  renderCapacityHint();refreshReady();
// [L0282] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0283] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อ่าน/ซิงก์ข้อความ Auto-Mail 7.2 จาก textarea เข้าสู่ state
// [L0284] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0285] ประกาศฟังก์ชัน syncEtl เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function syncEtl(shouldInvalidate=true){
// [L0286] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  state.etlText=$('#autoMail72Input').value;
// [L0287] ประกาศตัวแปร parsed แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const parsed=BlackwolfEngine.parseEtl(state.etlText);
// [L0288] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('#etlValid').textContent=fmt(parsed.valid);$('#etlInvalid').textContent=fmt(parsed.invalid);$('#etlDuplicate').textContent=fmt(parsed.duplicates);
// [L0289] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('#autoMail72Input').classList.toggle('invalid',parsed.invalid>0);
// [L0290] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('#etlHint').textContent=parsed.invalid?`พบรูปแบบผิด ${parsed.invalid} บรรทัด — ตรวจ ลำดับ.ProposalID:Policy:Group`:'รูปแบบ: ลำดับ.ProposalID:Policy:Group · Duplicate เก็บครบ';
// [L0291] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(shouldInvalidate&&state.preflight)invalidate({resetWorker:false,clearWorkbooks:false});
// [L0292] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  renderFiles();
// [L0293] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0294] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ตรวจว่าไฟล์ขั้นต่ำครบหรือยัง เพื่อเปิด/ปิดปุ่ม Preflight/Run
// [L0295] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0296] ประกาศฟังก์ชัน refreshReady เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function refreshReady(){
// [L0297] สร้างตัวช่วยแบบ arrow function ชื่อ ready เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const ready=requiredRoles.every(role=>state.files[role]),busy=isUiBusy();
// SAFE GUARD R1: ขณะ Upload/Preflight/Run ให้ปิดช่องทางที่เปลี่ยน input หรือโหลด output เพื่อกัน state ชนกัน
  ['#bulkInput','#autoMail72Input','#manualStartDate','#clearEtlBtn','#clearBtn'].forEach(selector=>{const element=$(selector);if(element)element.disabled=busy;});
  const dropZone=$('#dropZone');if(dropZone){dropZone.classList.toggle('disabled',busy);dropZone.setAttribute('aria-disabled',busy?'true':'false');}
  const hasResult=!!state.result;['#downloadCombined','#downloadIssue','#saveReportImageBtn'].forEach(selector=>{const element=$(selector);if(element)element.disabled=busy||!hasResult;});
// [L0298] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('#preflightBtn').disabled=!ready||busy;
// [L0299] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('#runBtn').disabled=!state.preflight?.ok||busy;const cancel=$('#cancelRunBtn');if(cancel){cancel.classList.toggle('hidden',!state.running);cancel.disabled=!state.running||!state.workerReady;}
// [L0300] ประกาศตัวแปร box แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const box=$('#inlineStatus');
// [L0301] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(state.classifying){box.className='inline-status';box.innerHTML='<i></i><div><strong>กำลังจำแนกไฟล์</strong><small>ตรวจ Sheet และ Header ภายใน ไม่ใช้ชื่อไฟล์เป็นหลัก</small></div>';return;}
// [L0302] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(state.running){box.className='inline-status';box.innerHTML='<i></i><div><strong>กำลังประมวลผล</strong><small>ทำงานใน Background Worker กรุณารอจนเสร็จ</small></div>';return;}
// [L0303] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(state.preflight?.ok){box.className='inline-status ready';box.innerHTML='<i></i><div><strong>พร้อม Run</strong><small>จะสร้าง Master และเช็คสถานะ ISSUE ใหม่ 2 ไฟล์</small></div>';setStatus(state.result?'COMPLETED':'READY','success');return;}
// [L0304] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(state.preflight&&!state.preflight.ok){box.className='inline-status error';box.innerHTML='<i></i><div><strong>พบปัญหาในไฟล์</strong><small>ตรวจรายละเอียด Preflight ด้านล่าง</small></div>';setStatus('CHECK FILES','error');return;}
// [L0305] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(ready){box.className='inline-status';box.innerHTML='<i></i><div><strong>ไฟล์ Required ครบแล้ว</strong><small>กดตรวจสอบไฟล์ก่อน Run</small></div>';setStatus('FILES READY');return;}
// [L0306] สร้างตัวช่วยแบบ arrow function ชื่อ missing เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const missing=requiredRoles.filter(role=>!state.files[role]).length;
// [L0307] สร้างหรืออัปเดต HTML ในหน้าเว็บจากข้อมูลที่ระบบคำนวณแล้ว
  box.className='inline-status';box.innerHTML=`<i></i><div><strong>รอไฟล์ ${missing} รายการ</strong><small>เลือก Required files ให้ครบ 4 รายการ</small></div>`;setStatus('WAITING');
// [L0308] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0309] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อัปเดตแถบ progress และข้อความสถานะระหว่างรัน
// [L0310] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0311] ประกาศฟังก์ชัน progress เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function progress(percent,message){
// [L0312] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('#progressPanel').classList.remove('hidden');$('#progressPct').textContent=`${Math.round(percent)}%`;$('#progressBar').style.width=`${Math.max(0,Math.min(100,percent))}%`;$('#progressMessage').textContent=message;
// [L0313] ประกาศตัวแปร now แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const now=Date.now(),log=$('#logBox');
// [L0314] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(now-lastProgressAt<120&&log.lastElementChild){log.lastElementChild.textContent=`[${new Date().toLocaleTimeString('th-TH')}] ${message}`;return;}
// [L0315] สร้างหรืออัปเดต HTML ในหน้าเว็บจากข้อมูลที่ระบบคำนวณแล้ว
  lastProgressAt=now;log.insertAdjacentHTML('beforeend',`<div>[${new Date().toLocaleTimeString('th-TH')}] ${esc(message)}</div>`);while(log.children.length>180)log.removeChild(log.firstElementChild);log.scrollTop=log.scrollHeight;
// [L0316] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0317] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0318] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ล้าง timer timeout ของงาน worker ที่จบแล้วหรือถูกยกเลิก
// [L0319] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0320] ประกาศฟังก์ชัน clearWorkerJobTimer เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function clearWorkerJobTimer(job){if(job?.timer)clearTimeout(job.timer);}
// [L0321] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ปฏิเสธ promise ที่รอ worker ทั้งหมดเมื่อ worker พัง/ถูก restart
// [L0322] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0323] ประกาศฟังก์ชัน rejectPendingWorkerJobs เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function rejectPendingWorkerJobs(error){
// [L0324] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const [id,job] of state.workerJobs){clearWorkerJobTimer(job);try{job.reject(error);}catch{}state.workerJobs.delete(id);}
// [L0325] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  state.activeWorkerJobId=null;
// [L0326] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0327] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ปิด worker เดิมและเคลียร์งานที่ค้าง เพื่อเริ่มใหม่แบบปลอดภัย
// [L0328] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0329] ประกาศฟังก์ชัน terminateWorker เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function terminateWorker(error=appError('BW-WORKER-004','Worker restarted')){
// [L0330] ประกาศตัวแปร worker แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const worker=state.worker;state.worker=null;state.workerReady=false;state.workerCachedRoles.clear();state.workerLastHeartbeat=null;
// [L0331] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
  try{worker?.terminate();}catch{}
// [L0332] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  rejectPendingWorkerJobs(error);
// [L0333] ประกาศตัวแปร label แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const label=$('#engineReadyText');if(label)label.textContent='Worker stopped · Main-thread fallback ready';
// [L0334] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0335] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ตั้ง timeout ให้ job ใน worker เพื่อกันงานค้างเงียบ
// [L0336] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0337] ประกาศฟังก์ชัน armWorkerTimeout เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function armWorkerTimeout(id){
// [L0338] ประกาศตัวแปร job แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const job=state.workerJobs.get(id);if(!job)return;clearWorkerJobTimer(job);
// [L0339] กำหนด handler/ฟังก์ชันให้ job.timer เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง
  job.timer=setTimeout(()=>{
// [L0340] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!state.workerJobs.has(id))return;
// [L0341] ประกาศตัวแปร error แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const error=appError('BW-WORKER-002',`Worker ไม่ตอบสนองเกิน ${Math.round(job.timeoutMs/60000)} นาที (${job.type})`);
// [L0342] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    recordDiagnosticError('worker.inactivityTimeout',error,error.code);terminateWorker(error);
// [L0343] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!state.cancelRequested)initWorker().catch(()=>{});
// [L0344] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  },job.timeoutMs);
// [L0345] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0346] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ต่ออายุ timeout เมื่อ worker ส่ง heartbeat/progress กลับมา
// [L0347] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0348] ประกาศฟังก์ชัน touchWorkerJob เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function touchWorkerJob(id,heartbeat=null){
// [L0349] ประกาศตัวแปร job แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const job=state.workerJobs.get(id);if(!job)return;
// [L0350] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  job.lastActivity=Date.now();if(heartbeat){state.workerLastHeartbeat=heartbeat.timestamp||new Date().toISOString();}
// [L0351] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  armWorkerTimeout(id);
// [L0352] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0353] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง Web Worker และลง listener รับข้อความ result/progress/error
// [L0354] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0355] ประกาศฟังก์ชัน initWorker เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function initWorker(){
// [L0356] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
  try{
// [L0357] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(state.worker)terminateWorker(appError('BW-WORKER-004','เริ่ม Worker รุ่นใหม่'));
// [L0358] ประกาศตัวแปร worker แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const worker=new Worker('worker.js?v=3.5.8-safe-r1');state.worker=worker;state.workerGeneration++;
// [L0359] กำหนด handler/ฟังก์ชันให้ worker.onmessage เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง
    worker.onmessage=event=>{
// [L0360] ประกาศตัวแปร message แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
      const message=event.data||{},job=state.workerJobs.get(message.id);if(!job)return;
// [L0361] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
      if(message.type==='heartbeat'){touchWorkerJob(message.id,message.heartbeat);return;}
// [L0362] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
      if(message.type==='progress'){touchWorkerJob(message.id);job.onProgress?.(message.progress);return;}
// [L0363] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      clearWorkerJobTimer(job);state.workerJobs.delete(message.id);if(state.activeWorkerJobId===message.id)state.activeWorkerJobId=null;
// [L0364] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
      if(message.type==='done')job.resolve(message.result);
// [L0365] ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข
      else{const detail=message.error||{};job.reject(appError(detail.code||'BW-WORKER-001',detail.message||'Worker error'));}
// [L0366] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
    };
// [L0367] กำหนด handler/ฟังก์ชันให้ worker.onerror เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง
    worker.onerror=event=>{
// [L0368] ประกาศตัวแปร error แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
      const error=appError('BW-WORKER-001',event?.message||'Worker crashed');recordDiagnosticError('worker.onerror',error,error.code);
// [L0369] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
      terminateWorker(error);if(!state.cancelRequested)initWorker().catch(()=>{});
// [L0370] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
    };
// [L0371] ประกาศตัวแปร result แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const result=await workerRequest('ping',{},[],null,{allowNotReady:true,timeoutMs:4500});
// [L0372] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
    state.workerReady=true;$('#engineReadyText').textContent=`Browser Worker Engine Ready · ${result.version||CONFIG.version} · G${state.workerGeneration}`;return true;
// [L0373] จับ error จาก try block แล้วแปลงเป็นข้อความ/สถานะที่ผู้ใช้หรือระบบเข้าใจได้
  }catch(error){console.warn(error);terminateWorker(error?.code?error:appError('BW-WORKER-001','Worker unavailable',error));$('#engineReadyText').textContent='Main-thread fallback ready';return false;}
// [L0374] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0375] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ส่งคำสั่งไป worker พร้อมรอ promise ตอบกลับ
// [L0376] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0377] ประกาศฟังก์ชัน workerRequest เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function workerRequest(type,payload={},transfer=[],onProgress,options={}){
// [L0378] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return new Promise((resolve,reject)=>{
// [L0379] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!state.worker||(!state.workerReady&&!options.allowNotReady)){reject(appError('BW-WORKER-001','Worker unavailable'));return;}
// [L0380] ประกาศตัวแปร id แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const id=++state.workerSeq,timeoutMs=options.timeoutMs||WORKER_INACTIVITY_TIMEOUTS[type]||600000;
// [L0381] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    state.workerJobs.set(id,{resolve,reject,onProgress,type,timeoutMs,lastActivity:Date.now(),timer:null});state.activeWorkerJobId=id;armWorkerTimeout(id);
// [L0382] ส่งข้อความหรือข้อมูลข้าม context ไปยัง Web Worker/หน้าหลัก พร้อมอาจส่ง ArrayBuffer แบบ transfer เพื่อประหยัด memory
    try{state.worker.postMessage({id,type,...payload},transfer);}catch(error){const job=state.workerJobs.get(id);clearWorkerJobTimer(job);state.workerJobs.delete(id);state.activeWorkerJobId=null;reject(appError('BW-WORKER-007','ส่งงานเข้า Worker ไม่สำเร็จ',error));}
// [L0383] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  });
// [L0384] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0385] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: restart worker แบบโปรแกรมสั่งหรือผู้ใช้สั่ง
// [L0386] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0387] ประกาศฟังก์ชัน restartWorkerEngine เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function restartWorkerEngine({manual=false}={}){
// [L0388] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(state.running&&!manual) return false;
// [L0389] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  terminateWorker(appError('BW-WORKER-004','Worker restarted'));
// [L0390] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  state.preflight=null;$('#preflightResult')?.classList.add('hidden');refreshReady();
// [L0391] ประกาศตัวแปร ok แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const ok=await initWorker();await refreshSystemStatus();return ok;
// [L0392] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0393] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ปุ่มผู้ใช้สำหรับ restart engine เมื่อสงสัยว่า worker ค้าง
// [L0394] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0395] ประกาศฟังก์ชัน manualRestartWorker เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function manualRestartWorker(){
// [L0396] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(state.running){toast('กำลัง Run อยู่ กรุณากด Cancel Run ก่อน',4500);return;}
// [L0397] ประกาศตัวแปร button แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const button=$('#restartWorkerBtn');if(button)button.disabled=true;setStatus('RESTARTING','running');
// [L0398] ประกาศตัวแปร ok แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const ok=await restartWorkerEngine({manual:true});toast(ok?'Restart Worker สำเร็จ — กรุณากด Preflight ใหม่':'Restart Worker ไม่สำเร็จ ระบบจะใช้ Fallback Mode',5000);refreshReady();if(button)button.disabled=false;
// [L0399] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0400] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ยกเลิกงานที่กำลังรันและคืน UI ให้พร้อมใช้งาน
// [L0401] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0402] ประกาศฟังก์ชัน cancelActiveRun เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function cancelActiveRun(){
// [L0403] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!state.running)return;
// [L0404] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!state.workerReady){toast('Fallback Mode ไม่สามารถหยุดงานกลางคันได้ กรุณารอให้จบหรือปิดแท็บ',5500);return;}
// [L0405] ประกาศตัวแปร ok แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const ok=await confirmAction('ยกเลิกการ Run','หยุด Worker ทันทีและล้าง Cache ของรอบนี้หรือไม่? ไฟล์ต้นฉบับและ Run History เดิมจะไม่ถูกลบ และต้องกด Preflight ใหม่');if(!ok)return;
// [L0406] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  state.cancelRequested=true;const error=appError('BW-WORKER-003','ผู้ใช้ยกเลิกการ Run');terminateWorker(error);state.preflight=null;$('#preflightResult')?.classList.add('hidden');progress(100,`CANCELLED: ${errorText(error)}`);setStatus('CANCELLED','error');
// [L0407] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
  await initWorker();state.cancelRequested=false;refreshReady();toast('ยกเลิก Run แล้ว · Worker เริ่มใหม่ · กรุณากด Preflight ใหม่',5500);
// [L0408] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0409] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เตรียมไฟล์/ArrayBuffer เพื่อส่งเข้า worker แบบ transfer ได้
// [L0410] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0411] ประกาศฟังก์ชัน prepareWorkerFiles เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function prepareWorkerFiles(){
// [L0412] สร้างตัวช่วยแบบ arrow function ชื่อ selected เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const selected=roles.filter(role=>role!=='etl'&&state.files[role]);
// [L0413] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
  await workerRequest('reset');state.workerCachedRoles.clear();
// [L0414] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(let index=0;index<selected.length;index++){
// [L0415] ประกาศตัวแปร role แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const role=selected[index],file=state.files[role],base=3+Math.round(index/Math.max(1,selected.length)*65);
// [L0416] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    progress(base,`กำลังส่ง ${display[role]} เข้า Worker (${bytes(file.size)})`);
// [L0417] ประกาศตัวแปร buffer แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const buffer=await file.arrayBuffer();
// [L0418] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
    await workerRequest('load-file',{file:{role,name:file.name,buffer}},[buffer],update=>progress(Math.min(72,base+Math.round((update.pct||0)/100*9)),update.message));
// [L0419] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
    state.workerCachedRoles.add(role);await yieldUi(0);
// [L0420] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0421] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0422] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ย่อผลลัพธ์ที่ใหญ่มากเพื่อเก็บใน state/UI โดยยังคง summary สำคัญ
// [L0423] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0424] ประกาศฟังก์ชัน compactResultForUi เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function compactResultForUi(result){const limit=2000,all=result.rows||[],rows=all.slice(0,limit),duplicateSummary=BlackwolfEngine.internals.analyzeAlienDuplicates(all);return{...result,summary:{...result.summary,AlienDuplicateCodeCount:duplicateSummary.duplicateCodeCount,AlienDuplicateRowCount:duplicateSummary.duplicateRowCount,WebPreviewRows:rows.length,WebPreviewTruncated:all.length>limit},rows,duplicateSummary,context:{smIds:(result.context?.smIds||[]).slice(0,limit),blIds:(result.context?.blIds||[]).slice(0,limit)}};}
// [L0425] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ตรวจและเตรียมไฟล์ก่อนเรียก worker
// [L0426] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0427] ประกาศฟังก์ชัน ensureWorkerFiles เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function ensureWorkerFiles(){
// [L0428] สร้างตัวช่วยแบบ arrow function ชื่อ selected เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const selected=roles.filter(role=>role!=='etl'&&state.files[role]);
// [L0429] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(selected.every(role=>state.workerCachedRoles.has(role))){progress(70,'ใช้ Workbook Cache จากขั้นตอนจำแนกไฟล์ ไม่อ่านไฟล์ขนาดใหญ่ซ้ำ');return;}
// [L0430] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
  await prepareWorkerFiles();
// [L0431] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0432] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แกนหลักของการ preflight ใช้ตรวจไฟล์และข้อมูลก่อนรันจริง
// [L0433] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0434] ประกาศฟังก์ชัน mainPreflight เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function mainPreflight(){
// [L0435] ประกาศตัวแปร workbooks แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const workbooks={},selected=roles.filter(role=>role!=='etl'&&state.files[role]);
// [L0436] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(let index=0;index<selected.length;index++){
// [L0437] ประกาศตัวแปร role แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const role=selected[index];progress(10+Math.round(index/Math.max(1,selected.length)*60),`กำลังอ่าน ${display[role]} — Fallback Mode`);await yieldUi(20);workbooks[role]=await BlackwolfEngine.readWorkbook(state.files[role],role==='master');await yieldUi(20);
// [L0438] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0439] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  state.workbooks=workbooks;progress(78,'กำลังตรวจ Sheet, Header และ Date คอลัมน์ T — Fallback Mode');
// [L0440] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return BlackwolfEngine.preflight(workbooks,state.files,state.etlText,manualStartDate());
// [L0441] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0442] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ปุ่ม Preflight: เรียกตรวจไฟล์แล้ว render ผลบนหน้าจอ
// [L0443] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0444] ประกาศฟังก์ชัน runPreflight เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function runPreflight(){
  if(state.running||state.classifying){toast('ระบบกำลังทำงานอยู่ กรุณารอให้จบก่อนตรวจไฟล์',3500);return;}
  if(state.actionLocks.has('preflight')){toast('กำลัง Preflight อยู่ กรุณารอให้จบก่อน',3000);return;}
  state.actionLocks.add('preflight');refreshReady();
// [L0445] ประกาศตัวแปร parsed แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const parsed=BlackwolfEngine.parseEtl(state.etlText);if(parsed.invalid){state.actionLocks.delete('preflight');refreshReady();toast(`Auto-Mail 7.2 ผิดรูปแบบ ${parsed.invalid} บรรทัด`,5000);return;}
// [L0446] ประกาศตัวแปร button แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const button=$('#preflightBtn');button.disabled=true;button.textContent='กำลังตรวจสอบ...';setStatus('VALIDATING','running');$('#logBox').innerHTML='';progress(1,state.workerReady?'เริ่มตรวจสอบด้วย Background Worker':'เริ่มตรวจสอบแบบ Fallback');
// [L0447] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
  try{
// [L0448] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    let result;
// [L0449] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(state.workerReady){await ensureWorkerFiles();result=await workerRequest('validate',{etlText:state.etlText,manualStartDate:manualStartDate()},[],update=>progress(update.pct,update.message));}
// [L0450] ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข
    else result=await mainPreflight();
// [L0451] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    state.preflight=result;
// [L0452] ประกาศตัวแปร box แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const box=$('#preflightResult');
// [L0453] สร้างหรืออัปเดต HTML ในหน้าเว็บจากข้อมูลที่ระบบคำนวณแล้ว
    box.innerHTML=`<h3>${result.ok?'✓ Preflight ผ่าน':'! Preflight ไม่ผ่าน'}</h3><div class="validation-files">${result.results.map(item=>`<div class="validation-file ${item.ok?'':'fail'}"><div><strong>${esc(display[item.field]||item.field)} — ${esc(item.name)}</strong><small>${esc(item.message)}</small></div><b>${item.ok?'PASS':'FAIL'}</b></div>`).join('')}</div>`;
// [L0454] เพิ่ม/ลบ/สลับ CSS class เพื่อเปลี่ยนสถานะการแสดงผลของหน้าเว็บ
    box.classList.remove('hidden');progress(100,result.ok?'Preflight ผ่าน พร้อม Run':'Preflight ไม่ผ่าน');refreshReady();toast(result.ok?'Preflight ผ่าน พร้อม Run':'Preflight ไม่ผ่าน กรุณาตรวจไฟล์หรือวันเริ่มต้น',4500);
// [L0455] จับ error จาก try block แล้วแปลงเป็นข้อความ/สถานะที่ผู้ใช้หรือระบบเข้าใจได้
  }catch(error){recordDiagnosticError('runPreflight',error,'BW-PREFLIGHT');state.preflight={ok:false};refreshReady();toast(errorText(error),5500);console.error(error);}
// [L0456] ส่วนที่ต้องทำเสมอหลัง try/catch เช่น ปลดล็อกปุ่ม เคลียร์สถานะ หรือคืน resource
  finally{state.actionLocks.delete('preflight');button.textContent='✓ ตรวจสอบไฟล์';refreshReady();}
// [L0457] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0458] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ปุ่ม Run: ส่งงานเข้า engine, รับผลลัพธ์, บันทึก history และ render dashboard/results
// [L0459] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0460] ประกาศฟังก์ชัน runWorkflow เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function runWorkflow(){
// [L0461] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!state.preflight?.ok||state.running||state.actionLocks.has('run'))return;
  state.actionLocks.add('run');
// [L0462] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  state.running=true;refreshReady();setStatus('RUNNING','running');$('#logBox').innerHTML='';progress(1,'เริ่ม BLACKWOLF V3.5.8 Hardened Workflow');
// [L0463] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
  try{
// [L0464] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    let result;
// [L0465] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(state.workerReady){
// [L0466] สร้างตัวช่วยแบบ arrow function ชื่อ raw เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
      const raw=await workerRequest('run',{etlText:state.etlText,manualStartDate:manualStartDate(),today:new Date().toISOString()},[],update=>progress(update.pct,update.message));
// [L0467] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      result={runId:raw.runId,summary:raw.summary,rows:raw.rows,duplicateSummary:raw.duplicateSummary,context:raw.context,outputs:{master:new Blob([raw.masterBuffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),issue:new Blob([raw.issueBuffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),names:raw.names}};
// [L0468] ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข
    }else{
// [L0469] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
      result=compactResultForUi(await BlackwolfEngine.run({workbooks:state.workbooks,etlText:state.etlText,manualStartDate:manualStartDate(),today:new Date(),onProgress:progress}));
// [L0470] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
    }
// [L0471] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
    state.result=result;$('#currentRunLabel').textContent=result.runId;await saveRunRecord(result);setStatus('COMPLETED','success');$('#previewMode').textContent=`RUN ${result.runId}`;renderPreview(state.activePreview);renderDashboard();renderResults();renderReport();toast(`Run สำเร็จ: ${fmt(result.summary.TotalPolicies)} กรมธรรม์ · สร้างไฟล์หลัก 2 ไฟล์`,5000);clearTimeout(pageJumpTimer);pageJumpTimer=setTimeout(()=>setPage('results'),350);
// [L0472] จับ error จาก try block แล้วแปลงเป็นข้อความ/สถานะที่ผู้ใช้หรือระบบเข้าใจได้
  }catch(error){const code=error?.code||'BW-RUN-001';recordDiagnosticError('runWorkflow',error,code);console.error(error);if(code==='BW-WORKER-003'){progress(100,`CANCELLED: ${errorText(error)}`);setStatus('CANCELLED','error');}else{progress(100,`ERROR: ${errorText(error)}`);setStatus('ERROR','error');toast(errorText(error),6500);}}
// [L0473] ส่วนที่ต้องทำเสมอหลัง try/catch เช่น ปลดล็อกปุ่ม เคลียร์สถานะ หรือคืน resource
  finally{state.running=false;state.actionLocks.delete('run');refreshReady();}
// [L0474] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0475] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: บันทึกผลการรันลง IndexedDB พร้อมวันหมดอายุ
// [L0476] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0477] ประกาศฟังก์ชัน saveRunRecord เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function saveRunRecord(result){
// [L0478] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
  try{
// [L0479] ประกาศตัวแปร createdAt แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const createdAt=new Date().toISOString(),expiresAt=new Date(Date.now()+RETENTION_MS).toISOString();
// [L0480] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
    await BlackwolfDB.put({id:result.runId,displayName:`BLACKWOLF ${CONFIG.displayVersion} · Master + ISSUE`,status:'completed',message:'ประมวลผลสำเร็จ เก็บใน Browser ชั่วคราว 4 วัน',createdAt,expiresAt,summary:result.summary,rows:result.rows,duplicateSummary:result.duplicateSummary||null,context:result.context,masterWorkbook:result.outputs.master,issueWorkbook:result.outputs.issue,outputNames:result.outputs.names});
// [L0481] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
    await BlackwolfDB.pruneExpired();
// [L0482] จับ error จาก try block แล้วแปลงเป็นข้อความ/สถานะที่ผู้ใช้หรือระบบเข้าใจได้
  }catch(error){recordDiagnosticError('saveRunRecord',error,'BW-HISTORY-SAVE');console.warn(error);toast(`Run สำเร็จ แต่จัดเก็บ History ไม่ได้: ${error.message}`,6000);}
// [L0483] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0484] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ดาวน์โหลด Blob เป็นไฟล์ด้วย temporary object URL
// [L0485] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0486] ประกาศฟังก์ชัน downloadBlob เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function downloadBlob(blob,name){
  if(!blob){toast('ไม่พบไฟล์สำหรับดาวน์โหลด',4500);return;}
  const lockKey=`download:${name}`;
  if(state.running||state.classifying){toast('กำลังประมวลผลอยู่ กรุณารอให้จบก่อนดาวน์โหลด',3500);return;}
  if(state.actionLocks.has(lockKey)){toast('กำลังดาวน์โหลดไฟล์นี้อยู่ กรุณารอสักครู่',2500);return;}
  state.actionLocks.add(lockKey);refreshReady();
  let url='',anchor=null;
  try{
    url=URL.createObjectURL(blob);anchor=document.createElement('a');anchor.href=url;anchor.download=name;document.body.appendChild(anchor);anchor.click();toast(`ดาวน์โหลด ${name}`);
  }catch(error){recordDiagnosticError('downloadBlob',error,'BW-DOWNLOAD');console.error(error);toast(`ดาวน์โหลดไม่สำเร็จ: ${error.message}`,6000);}
  finally{
    try{anchor?.remove();}catch{}
    if(url)setTimeout(()=>{try{URL.revokeObjectURL(url);}catch{}},2500);
    setTimeout(()=>{state.actionLocks.delete(lockKey);refreshReady();},800);
  }
}
// [L0487] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ดาวน์โหลดไฟล์ Master ที่สร้างจากผล run ล่าสุด
// [L0488] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0489] ประกาศฟังก์ชัน downloadMaster เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function downloadMaster(){if(!state.result)return toast('ยังไม่มีผลลัพธ์');downloadBlob(state.result.outputs.master,state.result.outputs.names.master);}
// [L0490] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ดาวน์โหลดไฟล์ ISSUE ที่สร้างจากผล run ล่าสุด
// [L0491] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0492] ประกาศฟังก์ชัน downloadIssue เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function downloadIssue(){if(!state.result)return toast('ยังไม่มีผลลัพธ์');downloadBlob(state.result.outputs.issue,state.result.outputs.names.issue);}
// [L0493] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0494] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: วาด KPI และกราฟสรุปสำหรับผู้บริหาร
// [L0495] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0496] ประกาศฟังก์ชัน renderDashboard เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function renderDashboard(){
// [L0497] ประกาศตัวแปร summary แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const summary=state.result?.summary;if(!summary)return;
// [L0498] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('#dashboardSubtitle').textContent=`Run ${summary.RunId} · ${summary.DateStart} ถึง ${summary.DateEnd} · ${summary.TotalPolicies} policies`;
// [L0499] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('#kpiPending').textContent=fmt(summary.PendingPolicies);$('#kpiIncomplete').textContent=fmt(summary.IncompletePolicies);$('#kpiMenuE').textContent=fmt(summary.MenuEPolicies);$('#kpiBlacklist').textContent=fmt(summary.BlacklistPolicies);$('#kpiPremium').textContent=money(summary.TotalPremium);
// [L0500] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  renderBars('#statusChart',[['รอ Issue',summary.PendingPolicies],['ข้อมูลไม่สมบูรณ์',summary.IncompletePolicies],['Menu E',summary.MenuEPolicies],['Blacklist',summary.BlacklistPolicies]]);
// [L0501] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  renderBars('#agingChart',[['1 - 7 วัน',summary.Age_1_7],['8 - 15 วัน',summary.Age_8_15],['16 - 30 วัน',summary.Age_16_30],['มากกว่า 30 วัน',summary.Age_Over_30]]);
// [L0502] ประกาศตัวแปร reconciliation แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const reconciliation=[['Master Carry Forward',summary.MasterRowsCarriedForward,'rows'],['Daily เพิ่มใหม่',summary.DailyRowsAddedToBacklog,'rows'],['M190 รอบปัจจุบัน',summary.M190RawRows,'rows'],['Auto-Mail รอบปัจจุบัน',summary.AutoMailRawRows,'rows'],['ลบออกกรมธรรม์แล้ว',summary.IssuedRowsRemoved,'rows'],['Pending Output',summary.PendingRowsWrittenToData,'rows']];
// [L0503] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('#reconGrid').innerHTML=reconciliation.map(item=>`<div class="recon-item"><span>${esc(item[0])}</span><strong>${fmt(item[1])}</strong><small>${esc(item[2])}</small></div>`).join('');
// [L0504] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0505] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: วาด bar chart แบบง่ายจากข้อมูล label/value
// [L0506] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0507] ประกาศฟังก์ชัน renderBars เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function renderBars(selector,items){const max=Math.max(1,...items.map(item=>Number(item[1]||0)));$(selector).innerHTML=items.map(([label,value])=>`<div class="bar-row"><span>${esc(label)}</span><i><b style="width:${Math.max(2,Number(value||0)/max*100)}%"></b></i><strong>${fmt(value)}</strong></div>`).join('');}
// [L0508] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แปลงสถานะของ row เป็น class สีสำหรับตารางผลลัพธ์
// [L0509] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0510] ประกาศฟังก์ชัน resultStatusClass เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function resultStatusClass(status){
// [L0511] ประกาศตัวแปร value แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const value=String(status||'').toLowerCase();
// [L0512] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(value.includes('ไม่สมบูรณ์'))return'status-incomplete';
// [L0513] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(value.includes('issue'))return'status-issue';
// [L0514] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(value.includes('black'))return'status-blacklist';
// [L0515] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(value.includes('menu')||value.includes('เมนู'))return'status-menu';
// [L0516] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return'status-default';
// [L0517] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0518] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เช็คว่า row ตรงกับ filter ช่วงอายุที่เลือกหรือไม่
// [L0519] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0520] ประกาศฟังก์ชัน matchesAgingFilter เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function matchesAgingFilter(row,filter){
// [L0521] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!filter)return true;
// [L0522] ประกาศตัวแปร days แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const days=Number(row?.AgingDays);
// [L0523] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!Number.isFinite(days))return false;
// [L0524] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(filter==='1-7')return days>=1&&days<=7;
// [L0525] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(filter==='8-15')return days>=8&&days<=15;
// [L0526] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(filter==='16-30')return days>=16&&days<=30;
// [L0527] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(filter==='31+')return days>30;
// [L0528] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return true;
// [L0529] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0530] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อัปเดต dropdown/filter ผลลัพธ์ให้สัมพันธ์กับข้อมูลจริง
// [L0531] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0532] ประกาศฟังก์ชัน syncResultFilters เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function syncResultFilters(rows){
// [L0533] ประกาศตัวแปร select แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const select=$('#tableStatusFilter');if(!select)return;
// [L0534] ประกาศตัวแปร current แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const current=select.value;
// [L0535] สร้างตัวช่วยแบบ arrow function ชื่อ statuses เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const statuses=[...new Set(rows.map(row=>String(row.PendingStatus||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'th'));
// [L0536] สร้างหรืออัปเดต HTML ในหน้าเว็บจากข้อมูลที่ระบบคำนวณแล้ว
  select.innerHTML='<option value="">ทุกสถานะ</option>'+statuses.map(status=>`<option value="${esc(status)}">${esc(status)}</option>`).join('');
// [L0537] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(statuses.includes(current))select.value=current;
// [L0538] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0539] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: normalize alienCode เพื่อค้นหา/เทียบซ้ำแบบไม่ติดช่องว่างหรือ case
// [L0540] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0541] ประกาศฟังก์ชัน normalizeAlienCode เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function normalizeAlienCode(value){return String(value??'').normalize('NFKC').replace(/\s+/g,'').trim().toUpperCase();}
// [L0542] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: วาดตัวเลข summary ในหน้า results
// [L0543] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0544] ประกาศฟังก์ชัน renderResultStats เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function renderResultStats(rows){
// [L0545] สร้างตัวช่วยแบบ arrow function ชื่อ incomplete เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const incomplete=rows.filter(row=>String(row.PendingStatus||'').includes('ข้อมูลไม่สมบูรณ์')).length,ready=Math.max(0,rows.length-incomplete);
// [L0546] ประกาศตัวแปร full แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const full=state.result?.duplicateSummary||BlackwolfEngine.internals.analyzeAlienDuplicates(rows),codes=new Map((full.codes||[]).map(item=>[normalizeAlienCode(item.alienCode),Number(item.count||0)]));
// [L0547] ประกาศตัวแปร duplicates แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const duplicates={codes,duplicateCodes:Number(full.duplicateCodeCount||0),duplicateRows:Number(full.duplicateRowCount||0),list:full.codes||[]};
// [L0548] ประกาศตัวแปร stats แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const stats=[['ทั้งหมด',state.result?.summary?.TotalRows??rows.length,'รายการ'],['ข้อมูลไม่สมบูรณ์',state.result?.summary?.IncompletePolicies??incomplete,'รายการ'],['พร้อมตรวจสอบ',Math.max(0,(state.result?.summary?.TotalRows??rows.length)-(state.result?.summary?.IncompletePolicies??incomplete)),'รายการ']];
// [L0549] ประกาศตัวแปร container แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const container=$('#resultDetailStats');if(!container)return duplicates;
// [L0550] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  [...container.children].forEach((card,index)=>{const stat=stats[index];if(!stat)return;$('span',card).textContent=stat[0];$('strong',card).textContent=fmt(stat[1]);$('small',card).textContent=stat[2];});
// [L0551] ประกาศตัวแปร duplicateCard แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const duplicateCard=$('.duplicate-alien-stat',container),alertBox=$('#alienDuplicateAlert');
// [L0552] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(duplicateCard){$('strong',duplicateCard).textContent=fmt(duplicates.duplicateCodes);$('small',duplicateCard).textContent=`${fmt(duplicates.duplicateRows)} รายการ · ตรวจจากข้อมูลทั้งหมด`;}
// [L0553] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(alertBox){const preview=duplicates.list.slice(0,12).map(item=>`${item.alienCode} (${fmt(item.count)})`).join(', '),more=duplicates.list.length>12?` และอีก ${fmt(duplicates.list.length-12)} รหัส`:'';alertBox.classList.toggle('hidden',duplicates.duplicateCodes===0);alertBox.textContent=duplicates.duplicateCodes?`พบ alienCode ซ้ำ ${fmt(duplicates.duplicateCodes)} รหัส รวม ${fmt(duplicates.duplicateRows)} รายการ จากข้อมูลทั้งหมด · ${preview}${more}`:'';alertBox.title=duplicates.list.map(item=>`${item.alienCode} (${item.count})`).join('\n');}
// [L0554] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return duplicates;
// [L0555] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0556] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: จัดการวาดหน้าผลลัพธ์ทั้งหมด ทั้ง stats, table และ detail
// [L0557] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0558] ประกาศฟังก์ชัน renderResults เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function renderResults(){
// [L0559] ประกาศตัวแปร result แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const result=state.result;$('#resultEmpty').classList.toggle('hidden',!!result);$('#resultContent').classList.toggle('hidden',!result);if(!result)return;
// [L0560] ประกาศตัวแปร summary แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const summary=result.summary;$('#resultSummary').innerHTML=[['Run ID',summary.RunId],['Date Range',`${summary.DateStart} → ${summary.DateEnd}`],['Pending Policies',fmt(summary.TotalPolicies)],['Total Premium',money(summary.TotalPremium)],['Master Output',result.outputs.names.master],['ISSUE Output',result.outputs.names.issue]].map(item=>`<div class="summary-box"><span>${esc(item[0])}</span><strong>${esc(item[1])}</strong></div>`).join('');
// [L0561] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  selectedDetailIndex=null;syncResultFilters(result.rows||[]);renderTable();
// [L0562] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0563] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: วาดตารางรายการค้าง/ผลลัพธ์หลัก
// [L0564] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0565] ประกาศฟังก์ชัน renderTable เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function renderTable(){
// [L0566] ประกาศตัวแปร allRows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const allRows=state.result?.rows||[],query=($('#tableSearch')?.value||'').trim().toLowerCase(),statusFilter=$('#tableStatusFilter')?.value||'',agingFilter=$('#tableAgingFilter')?.value||'';
// [L0567] ประกาศตัวแปร duplicateInfo แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const duplicateInfo=renderResultStats(allRows);
// [L0568] สร้างตัวช่วยแบบ arrow function ชื่อ filtered เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const filtered=allRows.map((row,index)=>({row,index})).filter(item=>{
// [L0569] ประกาศตัวแปร haystack แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const haystack=[item.row.ProposalID,item.row.Policy,item.row.alienCode,item.row.PendingStatus,item.row.AgencyName,item.row.CreateDate,item.row.TotalPremium].join(' ').toLowerCase();
// [L0570] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
    return(!query||haystack.includes(query))&&(!statusFilter||String(item.row.PendingStatus||'')===statusFilter)&&matchesAgingFilter(item.row,agingFilter);
// [L0571] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  });
// [L0572] ประกาศตัวแปร visible แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const visible=filtered.slice(0,200),body=$('#resultTable');
// [L0573] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('#visibleResultCount').textContent=`แสดง ${fmt(visible.length)} จาก ${fmt(filtered.length)} รายการ${filtered.length>200?' · จำกัดบนจอ 200':''}`;
// [L0574] กำหนด handler/ฟังก์ชันให้ body.innerHTML เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง
  body.innerHTML=visible.map(item=>{const row=item.row,date=row.CreateDate?BlackwolfEngine.normalize.dateKey(new Date(row.CreateDate)):'-',alienKey=normalizeAlienCode(row.alienCode),duplicateCount=duplicateInfo?.codes?.get(alienKey)||0,duplicateClass=duplicateCount>1?' duplicate-alien-row':'',alienClass=duplicateCount>1?' class="duplicate-alien-cell"':'',alienTitle=duplicateCount>1?` title="คำเตือน: alienCode ${esc(alienKey)} ซ้ำทั้งหมด ${fmt(duplicateCount)} รายการ"`:'';return`<tr data-row-index="${item.index}" class="${selectedDetailIndex===item.index?'selected':''}${duplicateClass}"><td><strong>${esc(row.ProposalID)}</strong></td><td>${esc(row.Policy)}</td><td${alienClass}${alienTitle}><strong>${esc(row.alienCode||'-')}</strong></td><td>${esc(date)}</td><td class="premium-cell">${money(row.TotalPremium)}</td><td><span class="status-pill ${resultStatusClass(row.PendingStatus)}">${esc(row.PendingStatus||'ไม่ระบุ')}</span></td><td class="aging-cell">${row.AgingDays===null||row.AgingDays===undefined?'-':`${fmt(row.AgingDays)} วัน`}</td></tr>`;}).join('')||'<tr><td colspan="7" class="empty-row">ไม่พบรายการตามเงื่อนไข</td></tr>';
// [L0575] ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด
  $$('tr[data-row-index]',body).forEach(element=>element.addEventListener('click',()=>showResultDetail(Number(element.dataset.rowIndex))));
// [L0576] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(selectedDetailIndex!==null&&allRows[selectedDetailIndex])showResultDetail(selectedDetailIndex,false);else renderEmptyResultDetail();
// [L0577] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0578] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แสดง panel ว่างเมื่อยังไม่ได้เลือก row
// [L0579] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0580] ประกาศฟังก์ชัน renderEmptyResultDetail เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function renderEmptyResultDetail(){
// [L0581] ประกาศตัวแปร drawer แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const drawer=$('#resultDetailDrawer');if(!drawer)return;
// [L0582] สร้างหรืออัปเดต HTML ในหน้าเว็บจากข้อมูลที่ระบบคำนวณแล้ว
  drawer.innerHTML='<div class="detail-drawer-empty"><span>▤</span><strong>เลือกรายการเพื่อดูรายละเอียด</strong><small>คลิกแถวข้อมูลทางซ้าย ระบบจะแสดงรายละเอียดข้อมูลที่นี่</small></div>';
// [L0583] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0584] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แสดงรายละเอียด row ที่ผู้ใช้เลือกจากตาราง
// [L0585] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0586] ประกาศฟังก์ชัน showResultDetail เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function showResultDetail(index,updateSelection=true){
// [L0587] ประกาศตัวแปร rows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const rows=state.result?.rows||[],row=rows[index];if(!row)return;
// [L0588] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  selectedDetailIndex=index;
// [L0589] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(updateSelection)$$('#resultTable tr[data-row-index]').forEach(element=>element.classList.toggle('selected',Number(element.dataset.rowIndex)===index));
// [L0590] ประกาศตัวแปร date แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const date=row.CreateDate?BlackwolfEngine.normalize.dateKey(new Date(row.CreateDate)):'-';
// [L0591] ประกาศตัวแปร fields แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const fields=[['ProposalID',row.ProposalID],['Policy',row.Policy],['alienCode',row.alienCode||'-'],['CreateDate',date],['Premium',`${money(row.TotalPremium)} บาท`],['Status',row.PendingStatus||'ไม่ระบุ'],['Aging',row.AgingDays===null||row.AgingDays===undefined?'-':`${fmt(row.AgingDays)} วัน`],['Agency',row.AgencyName||'-'],['Run ID',state.result?.runId||state.result?.summary?.RunId||'-']];
// [L0592] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('#resultDetailDrawer').innerHTML=`<div class="drawer-header"><div><span>RECORD DETAIL</span><h4>รายละเอียดรายการ</h4></div></div><div class="drawer-fields">${fields.map(([label,value])=>`<div class="drawer-field"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join('')}</div>`;
// [L0593] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0594] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0595] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: วาด Executive Report จาก summary ล่าสุด
// [L0596] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0597] ประกาศฟังก์ชัน renderReport เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function renderReport(){
// [L0598] ประกาศตัวแปร summary แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const summary=state.result?.summary;$('#reportEmpty').classList.toggle('hidden',!!summary);$('#reportSheet').classList.toggle('hidden',!summary);if(!summary)return;
// [L0599] ประกาศตัวแปร total แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const total=Number(summary.TotalPolicies||0),pending=Number(summary.PendingPolicies||0),incomplete=Number(summary.IncompletePolicies||0),menuE=Number(summary.MenuEPolicies||0),blacklist=Number(summary.BlacklistPolicies||0),overdue=Number(summary.Age_8_15||0)+Number(summary.Age_16_30||0)+Number(summary.Age_Over_30||0),urgent=incomplete+menuE+blacklist;
// [L0600] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('#reportProcessed').textContent=summary.ProcessedAt||'-';$('#reportDateRange').textContent=`${summary.DateStart} ถึง ${summary.DateEnd}`;$('#reportValidation').textContent=summary.ValidationStatus||'PASSED';$('#reportPolicies').textContent=fmt(total);$('#reportPending').textContent=fmt(pending);$('#reportIncomplete').textContent=fmt(incomplete);$('#reportMenuE').textContent=fmt(menuE);$('#reportBlacklist').textContent=fmt(blacklist);$('#reportPremium').textContent=`${money(summary.TotalPremium)} บาท`;$('#reportDateRangeSummary').textContent=`${summary.DateStart} ถึง ${summary.DateEnd}`;$('#reportPoliciesSummary').textContent=`${fmt(total)} กรมธรรม์`;$('#reportOverdue').textContent=fmt(overdue);$('#reportUrgent').textContent=`${fmt(urgent)} กรมธรรม์`;$('#reportPremiumSummary').textContent=`${money(summary.TotalPremium)} บาท`;
// [L0601] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  [summary.Age_1_7,summary.Age_8_15,summary.Age_16_30,summary.Age_Over_30].forEach((value,index)=>{const count=Number(value||0),percent=total?count/total*100:0;$('#reportAge'+(index+1)).textContent=fmt(count);$('#reportAge'+(index+1)+'Bar').style.width=`${percent}%`;$('#reportAge'+(index+1)+'Pct').textContent=`${percent.toFixed(0)}%`;});
// [L0602] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('#reportPendingCard').textContent=fmt(pending);$('#reportIncompleteCard').textContent=fmt(incomplete);$('#reportMenuECard').textContent=fmt(menuE);$('#reportBlacklistCard').textContent=fmt(blacklist);$('#reportExecutiveNote').textContent=`มีกรมธรรม์คงเหลือ ${fmt(total)} รายการ มูลค่า ${money(summary.TotalPremium)} บาท`;
// [L0603] สร้างตัวช่วยแบบ arrow function ชื่อ statusRows เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const statusRows=[['รอ Issue',pending,'ดำเนินการตามคิว'],['ข้อมูลไม่สมบูรณ์',incomplete,'ติดตามข้อมูลเพิ่ม'],['ติดปัญหาไม่เข้าในเมนู E',menuE,'เร่งตรวจสอบระบบ'],['Blacklist',blacklist,'ตรวจสอบกรณีพิเศษ']].filter(row=>row[1]>0);
// [L0604] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('#reportStatusBody').innerHTML=statusRows.map(([name,count,action])=>`<tr><td>${esc(name)}</td><td>${fmt(count)}</td><td>${total?(count/total*100).toFixed(2):'0.00'}%</td><td>${esc(action)}</td></tr>`).join('')||'<tr><td colspan="4">ไม่มีรายการคงเหลือ</td></tr>';
// [L0605] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('#reportDailyRows').textContent=fmt(summary.DailyRowsAfterDateStatusFilter);$('#reportM190').textContent=fmt(summary.M190RawRows);$('#reportAutoMail72').textContent=fmt(summary.AutoMailRawRows);$('#reportIssuedRemoved').textContent=fmt(summary.IssuedRowsRemoved);$('#reportPendingWritten').textContent=fmt(summary.PendingRowsWrittenToData);$('#reportIssueDataRows').textContent=fmt(summary.DailyRowsAfterDateStatusFilter);$('#reportRunId').textContent=summary.RunId||state.result.runId;
// [L0606] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0607] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: จับภาพ report panel ด้วย html2canvas
// [L0608] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0609] ประกาศฟังก์ชัน captureReport เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function captureReport(){
// [L0610] ประกาศตัวแปร report แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const report=$('#reportSheet');if(report.classList.contains('hidden'))throw new Error('ยังไม่มีรายงาน');if(typeof window.html2canvas!=='function')throw new Error('โมดูลบันทึกรูปภาพไม่พร้อมใช้งาน');if(document.fonts?.ready)await document.fonts.ready;
// [L0611] ประกาศตัวแปร rect แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const rect=report.getBoundingClientRect(),width=Math.ceil(Math.max(report.scrollWidth,rect.width)),height=Math.ceil(Math.max(report.scrollHeight,rect.height)),scale=Math.min(2,Math.max(1,Math.sqrt(24000000/Math.max(1,width*height))));
// [L0612] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return window.html2canvas(report,{backgroundColor:'#ffffff',scale,useCORS:true,allowTaint:false,logging:false,removeContainer:true,width,height,windowWidth:Math.max(document.documentElement.clientWidth,width),windowHeight:Math.max(document.documentElement.clientHeight,height),scrollX:0,scrollY:0,onclone:clonedDocument=>{clonedDocument.body.classList.remove('dark');const cloned=clonedDocument.getElementById('reportSheet');if(cloned){cloned.classList.remove('hidden');cloned.style.margin='0';cloned.style.boxShadow='none';cloned.style.width=`${width}px`;cloned.style.maxWidth='none';}}});
// [L0613] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0614] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ดาวน์โหลดรูปภาพรายงานผู้บริหารเป็น PNG
// [L0615] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0616] ประกาศฟังก์ชัน saveReportImage เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function saveReportImage(){
  if(state.actionLocks.has('report-image')){toast('กำลังบันทึกรูปรายงานอยู่ กรุณารอให้จบก่อน',3000);return;}
  state.actionLocks.add('report-image');refreshReady();
// [L0617] ประกาศตัวแปร button แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const button=$('#saveReportImageBtn'),old=button.textContent;button.disabled=true;button.textContent='กำลังสร้างรูป...';
// [L0618] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
  try{
// [L0619] ประกาศตัวแปร canvas แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const canvas=await captureReport(),blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('สร้างไฟล์ PNG ไม่สำเร็จ')),'image/png',1));
// [L0620] ประกาศตัวแปร requested แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const requested=state.result?.outputs?.names?.report||`Report_${BlackwolfEngine.normalize.dateKey(new Date())}.png`,name=/\.png$/i.test(requested)?requested:requested.replace(/\.[^.]+$/,'')+'.png';
// [L0621] เริ่ม loop แบบวนซ้ำตามเงื่อนไข ใช้รอหรือทำงานจนกว่าจะครบเงื่อนไข
    downloadBlob(blob,name);toast('บันทึกรายงานเป็น PNG สำเร็จ');
// [L0622] จับ error จาก try block แล้วแปลงเป็นข้อความ/สถานะที่ผู้ใช้หรือระบบเข้าใจได้
  }catch(error){recordDiagnosticError('saveReportImage',error,'BW-REPORT-IMAGE');console.error(error);toast(`บันทึกรูปภาพไม่สำเร็จ: ${error.message}`,6000);}finally{state.actionLocks.delete('report-image');button.disabled=false;button.textContent=old;refreshReady();}
// [L0623] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0624] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0625] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แสดงวันที่ใน Run History แบบ yyyy-mm-dd
// [L0626] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0627] ประกาศฟังก์ชัน formatHistoryDate เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function formatHistoryDate(value){const date=new Date(value);return Number.isNaN(date.getTime())?'-':date.toLocaleDateString('en-CA');}
// [L0628] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แสดงเวลาใน Run History แบบ HH:mm:ss
// [L0629] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0630] ประกาศฟังก์ชัน formatHistoryTime เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function formatHistoryTime(value){const date=new Date(value);return Number.isNaN(date.getTime())?'-':date.toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit',second:'2-digit'});}
// [L0631] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: คำนวณเวลานับถอยหลังก่อน Run History ถูกลบ
// [L0632] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0633] ประกาศฟังก์ชัน formatCountdown เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function formatCountdown(expiresAt){const total=Math.max(0,Math.floor((new Date(expiresAt)-Date.now())/1000));if(total<=0)return'ครบกำหนดลบ';const days=Math.floor(total/86400),hours=Math.floor(total%86400/3600),minutes=Math.floor(total%3600/60);if(days>0)return`เหลือ ${days} วัน ${hours} ชม.`;if(hours>0)return`เหลือ ${hours} ชม. ${minutes} นาที`;return`เหลือ ${Math.max(1,minutes)} นาที`;}
// [L0634] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: โหลดและวาด Run History จาก IndexedDB
// [L0635] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0636] ประกาศฟังก์ชัน renderHistory เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function renderHistory(){
  clearInterval(historyCountdownTimer);
// [L0637] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
  try{
// [L0638] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
    await BlackwolfDB.pruneExpired();const list=await BlackwolfDB.list();
// [L0639] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
    $('#historyList').innerHTML=list.length?list.map(record=>`<div class="history-item" data-id="${esc(record.id)}"><div class="history-created"><strong>${esc(formatHistoryDate(record.createdAt))}</strong><small>${esc(formatHistoryTime(record.createdAt))}</small></div><div class="history-run-main"><strong>${esc(record.displayName||`BLACKWOLF ${CONFIG.displayVersion}`)}</strong><small>${esc(record.message||'ประมวลผลสำเร็จ')}</small><em>Run ID: ${esc(record.id)}</em></div><b class="history-status">เสร็จสมบูรณ์</b><span class="history-policy-count">${fmt(record.summary?.TotalPolicies||0)} กรมธรรม์</span><span class="history-retention-countdown" data-expires-at="${esc(record.expiresAt)}">${esc(formatCountdown(record.expiresAt))}</span><button class="history-delete-btn" data-delete="${esc(record.id)}">ลบ</button></div>`).join(''):'<div class="empty-row">ยังไม่มีประวัติ</div>';
// [L0640] ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด
    $$('.history-item').forEach(element=>element.addEventListener('click',async event=>{if(event.target.closest('[data-delete]'))return;await openHistoryRun(element.dataset.id);}));
// [L0641] ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด
    $$('[data-delete]').forEach(button=>button.addEventListener('click',async event=>{event.stopPropagation();const ok=await confirmAction('ลบ Run History',`ต้องการลบ Run ${button.dataset.delete} หรือไม่? การลบนี้ไม่กระทบไฟล์ที่ดาวน์โหลดเก็บเอง`);if(ok){await BlackwolfDB.remove(button.dataset.delete);if(state.result?.runId===button.dataset.delete){state.result=null;$('#currentRunLabel').textContent='-';renderResults();renderReport();}await renderHistory();toast('ลบ Run แล้ว');}}));
// [L0642] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
    historyCountdownTimer=setInterval(async()=>{const expired=$$('[data-expires-at]').some(element=>new Date(element.dataset.expiresAt)<=new Date());if(expired)await renderHistory();else $$('[data-expires-at]').forEach(element=>{element.textContent=formatCountdown(element.dataset.expiresAt);});},60000);
// [L0643] จับ error จาก try block แล้วแปลงเป็นข้อความ/สถานะที่ผู้ใช้หรือระบบเข้าใจได้
  }catch(error){recordDiagnosticError('renderHistory',error,'BW-HISTORY-READ');console.error(error);$('#historyList').innerHTML=`<div class="empty-row">อ่านประวัติไม่สำเร็จ: ${esc(error.message)}</div>`;}
// [L0644] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0645] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เปิดผล Run เก่าจาก History กลับมาแสดงใน UI
// [L0646] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0647] ประกาศฟังก์ชัน openHistoryRun เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function openHistoryRun(id){
  if(isUiBusy()){toast('ระบบกำลังทำงานอยู่ กรุณารอให้จบก่อนเปิด History',3500);return;}
  if(state.actionLocks.has('history-open')){toast('กำลังเปิด History อยู่ กรุณารอสักครู่',2500);return;}
  state.actionLocks.add('history-open');refreshReady();
// [L0648] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
  try{setStatus('LOADING','running');const record=await BlackwolfDB.get(id);if(!record)throw new Error('ไม่พบ Run หรือถูกลบครบ 4 วันแล้ว');state.result={runId:record.id,summary:record.summary,rows:record.rows||[],duplicateSummary:record.duplicateSummary||null,context:record.context||{},outputs:{master:record.masterWorkbook,issue:record.issueWorkbook,names:record.outputNames}};$('#currentRunLabel').textContent=record.id;$('#previewMode').textContent=`HISTORY ${record.id}`;renderPreview(state.activePreview);renderDashboard();renderResults();renderReport();setStatus('COMPLETED','success');setPage('results');toast(`เปิดประวัติ Run ${id}`);}catch(error){recordDiagnosticError('openHistory',error,'BW-HISTORY-OPEN');setStatus('ERROR','error');toast(error.message,5000);}finally{state.actionLocks.delete('history-open');refreshReady();}
// [L0649] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0650] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เปิด modal ยืนยันก่อนทำงานเสี่ยง เช่น ล้างข้อมูล
// [L0651] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0652] ประกาศฟังก์ชัน confirmAction เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function confirmAction(title,message){
  if(state.confirmPending)return Promise.resolve(false);
  state.confirmPending=true;
  return new Promise(resolve=>{
    const modal=$('#confirmModal'),okButton=$('#confirmOk'),cancelButton=$('#confirmCancel');
    $('#confirmTitle').textContent=title;$('#confirmText').textContent=message;modal.classList.remove('hidden');
    const done=value=>{state.confirmPending=false;modal.classList.add('hidden');okButton.onclick=null;cancelButton.onclick=null;resolve(value);};
    okButton.onclick=()=>done(true);cancelButton.onclick=()=>done(false);
  });
}
// [L0653] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อัปเดตสถานะ Browser/Worker/Storage ในหน้า Settings
// [L0654] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0655] ประกาศฟังก์ชัน refreshSystemStatus เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function refreshSystemStatus(){
// [L0656] ประกาศตัวแปร worker แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const worker=!!state.workerReady,xlsx=!!window.XLSX;$('#settingsEngineStatus').textContent='พร้อมใช้งาน';$('#settingsEngineStatus').className='status-ok';$('#settingsWorkerStatus').textContent=worker?'พร้อมใช้งาน':'Fallback Mode';$('#settingsWorkerStatus').className=worker?'status-ok':'status-warn';$('#settingsExcelStatus').textContent=xlsx?'พร้อมใช้งาน':'ไม่พร้อม';$('#settingsExcelStatus').className=xlsx?'status-ok':'status-bad';
// [L0657] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
  try{await BlackwolfDB.open();$('#settingsArchiveStatus').textContent='พร้อมใช้งาน';$('#settingsArchiveStatus').className='status-ok';}catch{$('#settingsArchiveStatus').textContent='ไม่พร้อม';$('#settingsArchiveStatus').className='status-bad';}
// [L0658] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('#settingsActiveRuns').textContent=state.running?'1':'0';const detail=$('#settingsWorkerDetail');if(detail)detail.textContent=state.workerReady?`Generation ${state.workerGeneration} · Pending ${state.workerJobs.size} · Heartbeat ${state.workerLastHeartbeat?new Date(state.workerLastHeartbeat).toLocaleTimeString('th-TH'):'รอการทำงาน'}`:'Fallback Mode';
// [L0659] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
  try{const info=await BlackwolfDB.storageInfo();$('#storageUsage').textContent=`${bytes(info.usage)} / ${info.quota?bytes(info.quota):'ไม่ทราบ'}`;$('#storagePersistence').textContent=info.persisted?'Browser ลดโอกาสลบให้อัตโนมัติ':'ยังไม่ได้รับสิทธิ์';$('#storagePersistence').className=info.persisted?'status-ok':'status-warn';}catch{$('#storageUsage').textContent='อ่านไม่ได้';$('#storagePersistence').textContent='ไม่พร้อม';}
// [L0660] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0661] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เปิดหน้าต่างคู่มือรูปภาพ
// [L0662] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0663] ประกาศฟังก์ชัน openGuide เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function openGuide(){closePreviewDrilldown();$('#guideModal').classList.remove('hidden');}
// [L0664] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ปิดหน้าต่างคู่มือรูปภาพ
// [L0665] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0666] ประกาศฟังก์ชัน closeGuide เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function closeGuide(){$('#guideModal').classList.add('hidden');}
// [L0667] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ล้างไฟล์ที่เลือกและผลลัพธ์ในหน้าจอ โดยไม่ลบไฟล์ต้นฉบับในเครื่อง
// [L0668] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0669] ประกาศฟังก์ชัน clearAll เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function clearAll(){roles.forEach(role=>state.files[role]=null);state.workbooks={};state.workerCachedRoles.clear();state.etlText='';state.preflight=null;$('#bulkInput').value='';$('#autoMail72Input').value='';$('#manualStartDate').value='';$('#preflightResult').classList.add('hidden');$('#progressPanel').classList.add('hidden');$('#previewMode').textContent='TEMPLATE PREVIEW';if(state.workerReady)workerRequest('reset').catch(()=>{});syncEtl(false);renderFiles();renderPreview('Report');toast('ล้างไฟล์ที่เตรียม Run แล้ว');}
// [L0670] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0671] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้างข้อมูลตัวอย่างเพื่อ preview หน้าตา Excel-like เมื่อยังไม่มีผล run
// [L0672] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0673] ประกาศฟังก์ชัน sampleRows เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function sampleRows(){return[{AgencyCode:'LBI0516',Mticode:'',AgencyName:'ต่างด้าว-SIAM COSMOS (7)',RequestCode:'7240978836',employeeName:'บริษัท ตัวอย่าง จำกัด',alienCode:'RA17655350265076221',alienNameEn:'HTET MYAT MOE',CertificateNo:'HP651477-1',Policy:'HP651477',TotalPremium:990,ProposalID:'7240978836',CreateDate:new Date(),Status:'',EPropID:'4005501597',Discount:'120.00',Note:'',IncompleteStatus:'ข้อมูลไม่สมบูรณ์',BlacklistStatus:'',MenuEProblem:'',Date:new Date(),PendingStatus:'ข้อมูลไม่สมบูรณ์',AgingDays:1,PendingRange:'1 - 7 วัน'}];}
// [L0674] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เลือกข้อมูลที่จะใช้ preview: ผลจริงถ้ามี ไม่งั้นใช้ sample
// [L0675] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0676] ประกาศฟังก์ชัน previewData เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function previewData(){return state.result?.rows||sampleRows();}
// [L0677] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง HTML table แบบคล้าย Excel จาก headers/rows
// [L0678] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0679] ประกาศฟังก์ชัน excelTable เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function excelTable(headers,rows,options={}){const head=headers.map((header,index)=>`<th class="${options.purpleFrom!==undefined&&index>=options.purpleFrom?'head-purple':'head-blue'}">${esc(header)}</th>`).join('');const startRow=options.startRow||2,headerRowNumber=options.headerRowNumber||'';const body=rows.slice(0,12).map((row,rowIndex)=>`<tr><td class="rownum">${rowIndex+startRow}</td>${row.map((value,columnIndex)=>`<td class="${options.moneyCols?.includes(columnIndex)?'money':''}">${value instanceof Date?esc(BlackwolfEngine.normalize.dateDisplay(value)):esc(value)}</td>`).join('')}</tr>`).join('');return`<table class="excel-table"><thead><tr><th class="rownum">${headerRowNumber}</th>${head}</tr></thead><tbody>${body||`<tr><td class="rownum">${startRow}</td><td colspan="${headers.length}">ไม่มีข้อมูล</td></tr>`}</tbody></table>`;}
// [L0680] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ล้าง registry สำหรับกด drill-down ใน preview
// [L0681] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0682] ประกาศฟังก์ชัน previewResetDrilldowns เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function previewResetDrilldowns(){previewDrillRegistry=[];}
// [L0683] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เก็บรายการย่อยของ block แล้วคืน index สำหรับปุ่ม drill-down
// [L0684] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0685] ประกาศฟังก์ชัน previewRegisterDrilldown เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function previewRegisterDrilldown(title,rows){const index=previewDrillRegistry.length;previewDrillRegistry.push({title,rows:[...(rows||[])]});return index;}
// [L0686] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง cell ที่กดดูรายละเอียด block ได้ถ้ามีข้อมูลย่อย
// [L0687] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0688] ประกาศฟังก์ชัน previewDrillCell เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function previewDrillCell(value,index,className=''){const enabled=index!==null&&index!==undefined&&previewDrillRegistry[index]?.rows?.length;return`<td class="${className}${enabled?' preview-drillable':''}"${enabled?` data-preview-drill="${index}" tabindex="0" title="คลิกเพื่อดูข้อมูลด้านในเหมือน Excel Pivot"`:''}>${value}</td>`;}
// [L0689] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เช็คว่า row ตรงกับ block PV ที่ preview อยู่หรือไม่
// [L0690] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0691] ประกาศฟังก์ชัน previewRowMatchesPv เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function previewRowMatchesPv(row,pv){
// [L0692] ประกาศตัวแปร normalize แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const normalize=BlackwolfEngine.normalize,date=value=>value?normalize.dateKey(new Date(value)):'';
// [L0693] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return date(row.Date)===date(pv.Date)&&normalize.text(row.Policy)===normalize.text(pv.Policy)&&normalize.text(row.Mticode)===normalize.text(pv.Mticode)&&normalize.text(row.AgencyName)===normalize.text(pv.AgencyName)&&normalize.id(row.ProposalID)===normalize.id(pv.ProposalID)&&normalize.text(row.PendingStatus)===normalize.text(pv.PendingStatus)&&String(row.AgingDays??'')===String(pv.AgingDays??'')&&normalize.text(row.PendingRange)===normalize.text(pv.PendingRange);
// [L0694] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0695] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แสดง label ของ Pivot โดยแทนค่าว่างเป็น (blank)
// [L0696] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0697] ประกาศฟังก์ชัน previewPivotLabel เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function previewPivotLabel(value){return value===null||value===undefined||String(value).trim()===''?'(blank)':value;}
// [L0698] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แสดง date สำหรับ preview แบบ dd/mm/yyyy หรือ (blank)
// [L0699] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0700] ประกาศฟังก์ชัน previewDate เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function previewDate(value){return value?BlackwolfEngine.normalize.dateDisplay(new Date(value)):'(blank)';}
// [L0701] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ดึงสถานะสำหรับ preview และแทนค่าว่างเป็น (blank)
// [L0702] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0703] ประกาศฟังก์ชัน previewStatusValue เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function previewStatusValue(row){const value=BlackwolfEngine.normalize.text(row.Status);return value||'(blank)';}
// [L0704] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เปิด modal แสดงข้อมูลด้านใน block PV/PV Final/Report
// [L0705] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0706] ประกาศฟังก์ชัน openPreviewDrilldown เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function openPreviewDrilldown(index){closeGuide();
// [L0707] ประกาศตัวแปร entry แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const entry=previewDrillRegistry[Number(index)],modal=$('#previewDrillModal');if(!entry||!modal)return;
// [L0708] ประกาศตัวแปร rows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const rows=entry.rows||[],limit=1000,visible=rows.slice(0,limit);
// [L0709] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('#previewDrillTitle').textContent=entry.title;$('#previewDrillCount').textContent=`${fmt(rows.length)} รายการ${rows.length>limit?` · แสดง ${fmt(limit)} รายการแรก`:''}`;
// [L0710] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('#previewDrillBody').innerHTML=visible.map((row,rowIndex)=>`<tr><td>${fmt(rowIndex+1)}</td><td>${esc(previewDate(row.Date||row.CreateDate))}</td><td><strong>${esc(row.ProposalID||'-')}</strong></td><td>${esc(row.Policy||'-')}</td><td>${esc(row.Mticode||'-')}</td><td>${esc(row.AgencyName||'-')}</td><td>${esc(row.alienCode||'-')}</td><td>${esc(row.alienNameEn||'-')}</td><td>${esc(row.PendingStatus||'-')}</td><td>${row.AgingDays===null||row.AgingDays===undefined?'-':fmt(row.AgingDays)}</td><td>${esc(row.PendingRange||'-')}</td><td class="money">${money(row.TotalPremium)}</td></tr>`).join('')||'<tr><td colspan="12" class="empty-row">ไม่มีข้อมูลใน Block นี้</td></tr>';
// [L0711] เพิ่ม/ลบ/สลับ CSS class เพื่อเปลี่ยนสถานะการแสดงผลของหน้าเว็บ
  modal.classList.remove('hidden');
// [L0712] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0713] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ปิด modal drill-down preview
// [L0714] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0715] ประกาศฟังก์ชัน closePreviewDrilldown เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function closePreviewDrilldown(){$('#previewDrillModal')?.classList.add('hidden');}
// [L0716] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: วาด preview ของ PV/PV Final พร้อม block drill-down
// [L0717] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0718] ประกาศฟังก์ชัน renderPvPreview เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function renderPvPreview(sheet,sourceRows){
// [L0719] ประกาศตัวแปร headers แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const headers=['Date','Policy','Mticode','AgencyName','ProposalID','สถานะไม่ issue','จำนวนวันที่ยังไม่ออกกรมธรรม์','ระยะเวลายังไม่ออกกรมธรรม์','Sum of TotalPremium'];
// [L0720] สร้างตัวช่วยแบบ arrow function ชื่อ allRows เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const allRows=sourceRows.map(row=>({...row,Date:row.Date?new Date(row.Date):null}));
// [L0721] ประกาศตัวแปร statuses แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const statuses=[...new Set(allRows.map(previewStatusValue))];
// [L0722] ประกาศตัวแปร filteredRows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const filteredRows=sheet==='PV'&&previewPvStatusFilter!=='(All)'?allRows.filter(row=>previewStatusValue(row)===previewPvStatusFilter):allRows;
// [L0723] ประกาศตัวแปร pvRows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const pvRows=BlackwolfEngine.preview.aggregatePvRows(sheet==='PV'?filteredRows:allRows),limit=250;
// [L0724] สร้างตัวช่วยแบบ arrow function ชื่อ headerHtml เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const headerHtml=headers.map(header=>`<td class="head-blue pivot-header-cell">${esc(header)} <span>▾</span></td>`).join('');
// [L0725] สร้างตัวช่วยแบบ arrow function ชื่อ bodyHtml เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const bodyHtml=pvRows.slice(0,limit).map((row,index)=>{
// [L0726] สร้างตัวช่วยแบบ arrow function ชื่อ source เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
    const source=allRows.filter(item=>previewRowMatchesPv(item,row)),drill=previewRegisterDrilldown(`${sheet} · ${row.ProposalID||'(blank)'}`,source),values=[previewDate(row.Date),previewPivotLabel(row.Policy),previewPivotLabel(row.Mticode),previewPivotLabel(row.AgencyName),previewPivotLabel(row.ProposalID),previewPivotLabel(row.PendingStatus),previewPivotLabel(row.AgingDays),previewPivotLabel(row.PendingRange),money(row.TotalPremium)];
// [L0727] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
    return`<tr class="pivot-data-row" data-preview-drill="${drill}" tabindex="0"><td class="rownum">${sheet==='PV'?index+5:index+2}</td>${values.map((value,column)=>`<td class="${column===8?'money ':''}preview-drillable" data-preview-drill="${drill}">${esc(value)}</td>`).join('')}</tr>`;
// [L0728] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  }).join('');
// [L0729] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(sheet==='PV'){
// [L0730] สร้างตัวช่วยแบบ arrow function ชื่อ options เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
    const options=['(All)',...statuses].map(value=>`<option value="${esc(value)}"${previewPvStatusFilter===value?' selected':''}>${esc(value)}</option>`).join('');
// [L0731] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
    $('#sheetStage').innerHTML=`<div class="pivot-preview-note">Pivot Preview · คลิกแถวเพื่อดูข้อมูลต้นทางภายใน Block</div><table class="excel-table pivot-preview-table"><tbody><tr><td class="rownum">1</td><td colspan="9"></td></tr><tr class="pivot-filter-row"><td class="rownum">2</td><td class="head-blue">Status</td><td><select id="previewPvStatusSelect" class="pivot-filter-select">${options}</select></td><td colspan="7"></td></tr><tr><td class="rownum">3</td><td colspan="9"></td></tr><tr><td class="rownum">4</td>${headerHtml}</tr>${bodyHtml||'<tr><td class="rownum">5</td><td colspan="9">ไม่มีข้อมูล</td></tr>'}</tbody></table>${pvRows.length>limit?`<div class="pivot-preview-limit">แสดง ${fmt(limit)} จาก ${fmt(pvRows.length)} แถว</div>`:''}`;
// [L0732] ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข
  }else{
// [L0733] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
    $('#sheetStage').innerHTML=`<div class="pivot-preview-note">PV Final คัดลอกผลจาก PV ชุดเดียวกัน · คลิกแถวเพื่อดูข้อมูลต้นทาง</div><table class="excel-table pivot-preview-table"><tbody><tr><td class="rownum">1</td>${headerHtml}</tr>${bodyHtml||'<tr><td class="rownum">2</td><td colspan="9">ไม่มีข้อมูล</td></tr>'}</tbody></table>${pvRows.length>limit?`<div class="pivot-preview-limit">แสดง ${fmt(limit)} จาก ${fmt(pvRows.length)} แถว</div>`:''}`;
// [L0734] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0735] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('#formulaText').textContent=`PV และ PV Final ใช้ชุดข้อมูลเดียวกัน ${fmt(pvRows.length)} กรมธรรม์ · คลิกเพื่อ Drill-down`;
// [L0736] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0737] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เลือก preview sheet ที่ผู้ใช้เลือกและวาดออกหน้าจอ
// [L0738] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0739] ประกาศฟังก์ชัน renderPreview เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function renderPreview(sheet){
// [L0740] กำหนด handler/ฟังก์ชันให้ state.activePreview เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง
  state.activePreview=sheet;previewResetDrilldowns();$$('#sheetTabs button').forEach(button=>button.classList.toggle('active',button.dataset.sheet===sheet));const rows=previewData(),stage=$('#sheetStage');
// [L0741] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(sheet==='Data'){const headers=['AgencyCode','Mticode','AgencyName','RequestCode','employeeName','alienCode','alienNameEn','CertificateNo','Policy','TotalPremium','ProposalID','CreateDate','Status','EPropID','Discount','หมายเหตุ','สถานะไม่สมบูรณ์','สถานะ Blacklist.','ติดปัญหาไม่เข้าในเมนู E','Date','สถานะไม่ issue','จำนวนวันที่ยังไม่ออกกรมธรรม์','ระยะเวลายังไม่ออกกรมธรรม์'];const body=rows.map(row=>[row.AgencyCode,row.Mticode,row.AgencyName,row.RequestCode,row.employeeName,row.alienCode,row.alienNameEn,row.CertificateNo,row.Policy,money(row.TotalPremium),row.ProposalID,new Date(row.CreateDate),row.Status,row.EPropID,row.Discount,row.Note,row.IncompleteStatus,row.BlacklistStatus,row.MenuEProblem,row.Date?new Date(row.Date):'',row.PendingStatus,row.AgingDays,row.PendingRange]);stage.innerHTML=excelTable(headers,body,{purpleFrom:15,moneyCols:[9]});$('#formulaText').textContent='สูตร P:W สร้างอัตโนมัติ';return;}
// [L0742] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(sheet==='ข้อมูลไม่สมบูรณ์'){const ids=state.result?.context?.smIds||['7240978836','7240965993'];stage.innerHTML=excelTable(['สถานะ','Prop ID'],ids.map(value=>['ข้อมูลไม่สมบูรณ์',value]),{});$('#formulaText').textContent='Carry Forward + Merge ข้อมูลใหม่';return;}
// [L0743] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(sheet==='Black List'){const ids=state.result?.context?.blIds||['7240888888'];stage.innerHTML=excelTable(['สถานะ','Prop ID'],ids.map(value=>['Blacklist',value]),{}).replaceAll('head-blue','head-red');$('#formulaText').textContent='Carry Forward + Merge ข้อมูลใหม่';return;}
// [L0744] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(sheet==='PV'||sheet==='PV Final'){renderPvPreview(sheet,rows);return;}
// [L0745] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  renderReportPreview();
// [L0746] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0747] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: วาด preview ของ Report ตาม summary ล่าสุด
// [L0748] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0749] ประกาศฟังก์ชัน renderReportPreview เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function renderReportPreview(){
// [L0750] สร้างตัวช่วยแบบ arrow function ชื่อ sourceRows เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const sourceRows=previewData().map(row=>({...row,Date:row.Date?new Date(row.Date):null})),rows=BlackwolfEngine.preview.aggregatePvRows(sourceRows),summary=state.result?.summary||{TotalPremium:rows.reduce((total,row)=>total+Number(row.TotalPremium||0),0),TotalPolicies:rows.length||0},allDrill=previewRegisterDrilldown('Report · กรมธรรม์ทั้งหมด',rows);
// [L0751] ประกาศตัวแปร html แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let html='<div class="pivot-preview-note">Report Pivot Preview · เว้น 1 แถวระหว่าง Block และซ่อน Block ที่ไม่มีข้อมูล · คลิกยอดหรือแถวเพื่อดูข้อมูลด้านใน</div><table class="excel-table pivot-preview-table report-pivot-preview"><tbody>';
// [L0752] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  html+=`<tr><td class="rownum">1</td><td colspan="4" class="blue-title preview-drillable" data-preview-drill="${allDrill}">สถานะไม่ ISSUE.</td></tr>`;
// [L0753] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  html+=`<tr><td class="rownum">2</td><td colspan="2">ยอดเงินที่ยังไม่ Issue</td>${previewDrillCell(money(summary.TotalPremium),allDrill,'money')}<td>บาท</td></tr><tr><td class="rownum">3</td><td colspan="2">จำนวนกรมธรรม์</td>${previewDrillCell(fmt(summary.TotalPolicies),allDrill)}<td>กรมธรรม์</td></tr>`;
// [L0754] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  html+='<tr class="report-block-spacer"><td class="rownum">4</td><td colspan="4"></td></tr><tr><td class="rownum">6</td><td colspan="4" class="green-title preview-drillable" data-preview-drill="'+allDrill+'">จำนวนวันที่ยังไม่ออกกรมธรรม์</td></tr><tr><td class="rownum">7</td><td class="head-green">No.</td><td class="head-green">ระยะเวลายังไม่ออกกรมธรรม์</td><td class="head-green">Count of Policy</td><td class="head-green">TotalPremium</td></tr>';
// [L0755] ประกาศตัวแปร aging แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const aging=BlackwolfEngine.preview.groupByAging(rows);
// [L0756] ประกาศตัวแปร currentRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let currentRow=8;
// [L0757] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
  aging.forEach(item=>{const details=rows.filter(row=>row.PendingRange===item[1]),drill=previewRegisterDrilldown(`Report · ${item[1]}`,details);html+=`<tr><td class="rownum">${currentRow}</td><td>${item[0]}</td><td>${esc(item[1])}</td>${previewDrillCell(fmt(item[2]),drill)}${previewDrillCell(money(item[3]),drill,'money')}</tr>`;currentRow++;});
// [L0758] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  html+=`<tr><td class="rownum">${currentRow}</td><td class="grand preview-drillable" data-preview-drill="${allDrill}">Grand Total</td><td class="grand"></td>${previewDrillCell(fmt(summary.TotalPolicies),allDrill,'grand')}${previewDrillCell(money(summary.TotalPremium),allDrill,'grand money')}</tr>`;
// [L0759] ประกาศตัวแปร sections แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const sections=[
// [L0760] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    {status:'รอ Issue',label:'รายการที่รอ ISSUE.',header:'head-blue',title:'blue-title'},
// [L0761] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    {status:'ติดปัญหาไม่เข้าในเมนู E',label:'รายการติดปัญหาไม่เอาเข้าเมนู E',header:'head-orange',title:'orange-title'},
// [L0762] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    {status:'ข้อมูลไม่สมบูรณ์',label:'รายการข้อมูลไม่สมบูรณ์',header:'head-purple',title:'purple-title'},
// [L0763] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    {status:'Blacklist',label:'สถานะ Blacklist.',header:'head-red',title:'red-title'}
// [L0764] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  ];
// [L0765] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const section of sections){
// [L0766] สร้างตัวช่วยแบบ arrow function ชื่อ subset เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
    const subset=rows.filter(row=>row.PendingStatus===section.status),groups=BlackwolfEngine.preview.groupStatusRows(rows,section.status);if(!subset.length||!groups.length)continue;
// [L0767] ประกาศตัวแปร sectionDrill แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const sectionDrill=previewRegisterDrilldown(`Report · ${section.label}`,subset),sectionPremium=subset.reduce((total,row)=>total+Number(row.TotalPremium||0),0),blankRow=currentRow+1,filterRow=blankRow+1,titleRow=filterRow+1,valuesRow=titleRow+1,headerRow=valuesRow+1,dataStart=headerRow+1;
// [L0768] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    html+=`<tr class="report-block-spacer"><td class="rownum">${blankRow}</td><td colspan="4"></td></tr><tr><td class="rownum">${titleRow}</td><td colspan="4" class="${section.title} preview-drillable" data-preview-drill="${sectionDrill}">${esc(section.label)}</td></tr><tr><td class="rownum">${headerRow}</td><td class="${section.header}">Date</td><td class="${section.header}">จำนวนวันที่ยังไม่ออกกรมธรรม์</td><td class="${section.header}">Count of Policy</td><td class="${section.header}">ผลรวม</td></tr>`;
// [L0769] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
    groups.forEach((group,index)=>{const key=group[0]?BlackwolfEngine.normalize.dateKey(new Date(group[0])):'',details=subset.filter(item=>(item.Date?BlackwolfEngine.normalize.dateKey(new Date(item.Date)):'')===key),drill=previewRegisterDrilldown(`Report · ${section.label} · ${key||'(blank)'}`,details),rowNumber=dataStart+index;html+=`<tr><td class="rownum">${rowNumber}</td><td>${group[0]?BlackwolfEngine.normalize.dateDisplay(group[0]):'(blank)'}</td><td>${previewPivotLabel(group[1])}</td>${previewDrillCell(fmt(group[2]),drill)}${previewDrillCell(money(group[3]),drill,'money')}</tr>`;});
// [L0770] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    currentRow=dataStart+groups.length;html+=`<tr><td class="rownum">${currentRow}</td><td class="grand preview-drillable" data-preview-drill="${sectionDrill}">Grand Total</td><td class="grand"></td>${previewDrillCell(fmt(subset.length),sectionDrill,'grand')}${previewDrillCell(money(sectionPremium),sectionDrill,'grand money')}</tr>`;
// [L0771] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0772] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  html+='</tbody></table>';$('#sheetStage').innerHTML=html;$('#formulaText').textContent='Report เรียง Block ตาม Flow · เว้น 1 แถว · ซ่อน Block ที่ไม่มีข้อมูล · Drill-down ได้';
// [L0773] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0774] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0775] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: รีเซ็ตข้อมูลใน Browser เช่น history, setting, local archive ตามที่ผู้ใช้ยืนยัน
// [L0776] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0777] ประกาศฟังก์ชัน resetProgram เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function resetProgram(){const ok=await confirmAction('รีเซ็ตโปรแกรม','ล้าง Run History, Excel ที่เก็บใน Browser, ภาษา ธีม และไฟล์ที่เลือกทั้งหมดหรือไม่? ไฟล์ที่ดาวน์โหลดเก็บเองจะไม่ถูกลบ');if(!ok)return;await BlackwolfDB.clear();storage.remove(storageKey('theme'));storage.remove(storageKey('language'));state.result=null;clearAll();applyLanguage('th');applyTheme('light');renderResults();renderReport();await renderHistory();$('#currentRunLabel').textContent='-';toast('รีเซ็ตโปรแกรมเรียบร้อยแล้ว');}
// [L0778] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ผูก event ทุกปุ่ม/input/drag-drop ตอนเริ่มโปรแกรม
// [L0779] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0780] ประกาศฟังก์ชัน bind เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function bind(){
  if(state.boundEvents)return;
  state.boundEvents=true;
// [L0781] ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด
  $$('.nav').forEach(button=>button.addEventListener('click',()=>setPage(button.dataset.page)));$$('[data-go]').forEach(button=>button.addEventListener('click',()=>setPage(button.dataset.go)));
// [L0782] ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด
  $('#bulkInput').addEventListener('change',event=>loadFiles(event.target.files));const zone=$('#dropZone');zone.addEventListener('dragover',event=>{event.preventDefault();zone.classList.add('drag');});zone.addEventListener('dragleave',()=>zone.classList.remove('drag'));zone.addEventListener('drop',event=>{event.preventDefault();zone.classList.remove('drag');loadFiles(event.dataTransfer.files);});
// [L0783] ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด
  $('#autoMail72Input').addEventListener('input',()=>syncEtl(true));$('#manualStartDate').addEventListener('change',()=>invalidate({resetWorker:false,clearWorkbooks:false}));$('#clearEtlBtn').addEventListener('click',()=>{$('#autoMail72Input').value='';state.files.etl=null;syncEtl(true);});$('#clearBtn').addEventListener('click',clearAll);on('#cancelRunBtn','click',cancelActiveRun);$('#preflightBtn').addEventListener('click',runPreflight);$('#runBtn').addEventListener('click',runWorkflow);$('#downloadCombined').addEventListener('click',downloadMaster);$('#downloadIssue').addEventListener('click',downloadIssue);$('#tableSearch').addEventListener('input',renderTable);$('#tableStatusFilter').addEventListener('change',renderTable);$('#tableAgingFilter').addEventListener('change',renderTable);$('#clearTableFiltersBtn').addEventListener('click',()=>{$('#tableSearch').value='';$('#tableStatusFilter').value='';$('#tableAgingFilter').value='';selectedDetailIndex=null;renderTable();});
// [L0784] ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด
  $('#refreshHistory').addEventListener('click',renderHistory);$('#refreshReportBtn').addEventListener('click',()=>{renderReport();toast('อัปเดตรายงานแล้ว');});$('#printReportBtn').addEventListener('click',()=>window.print());$('#saveReportImageBtn').addEventListener('click',saveReportImage);
// [L0785] ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด
  $('#guideBtn').addEventListener('click',openGuide);$('#settingsGuideBtn').addEventListener('click',openGuide);$('#guideClose').addEventListener('click',closeGuide);$('#guideModal').addEventListener('click',event=>{if(event.target.id==='guideModal')closeGuide();});
// [L0786] ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด
  $('#sheetStage').addEventListener('click',event=>{const target=event.target.closest('[data-preview-drill]');if(target)openPreviewDrilldown(target.dataset.previewDrill);});$('#sheetStage').addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&event.target.closest('[data-preview-drill]')){event.preventDefault();openPreviewDrilldown(event.target.closest('[data-preview-drill]').dataset.previewDrill);}});$('#sheetStage').addEventListener('change',event=>{if(event.target.id==='previewPvStatusSelect'){previewPvStatusFilter=event.target.value;renderPreview('PV');}});
// [L0787] ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด
  $('#previewDrillClose').addEventListener('click',closePreviewDrilldown);$('#previewDrillModal').addEventListener('click',event=>{if(event.target.id==='previewDrillModal')closePreviewDrilldown();});document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeGuide();closePreviewDrilldown();}});
// [L0788] ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด
  $('#themeBtn').addEventListener('click',()=>applyTheme(document.body.classList.contains('dark')?'light':'dark'));$$('[data-theme-value]').forEach(button=>button.addEventListener('click',()=>applyTheme(button.dataset.themeValue)));$$('[data-language]').forEach(button=>button.addEventListener('click',()=>applyLanguage(button.dataset.language)));
// [L0789] ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด
  $('#refreshSystemStatusBtn').addEventListener('click',refreshSystemStatus);$('#requestPersistenceBtn').addEventListener('click',async()=>{const ok=await BlackwolfDB.requestPersistent();toast(ok?'Browser อนุญาตให้ลดโอกาสลบ Storage อัตโนมัติแล้ว':'Browser ยังไม่อนุญาต — กรุณาดาวน์โหลดไฟล์เก็บเองทุกวัน',5000);refreshSystemStatus();});on('#exportDiagnosticBtn','click',exportDiagnosticPackage);on('#restartWorkerBtn','click',manualRestartWorker);$('#resetProgramBtn').addEventListener('click',resetProgram);
// [L0790] ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด
  $$('#sheetTabs button').forEach(button=>button.addEventListener('click',()=>renderPreview(button.dataset.sheet)));
// [L0791] ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')BlackwolfDB.pruneExpired().then(renderHistory).catch(()=>{});});
// [L0792] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0793] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ฟังก์ชันเริ่มต้นของ app: โหลด setting, เปิด worker, prune history, bind event และ render UI แรก
// [L0794] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0795] ประกาศฟังก์ชัน init เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function init(){
// [L0796] ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด
  if(!window.__BLACKWOLF_SAFE_GUARD_R1_ERRORS_BOUND){window.__BLACKWOLF_SAFE_GUARD_R1_ERRORS_BOUND=true;window.addEventListener('error',event=>recordDiagnosticError('window.error',event.error||new Error(event.message||'Window error'),'BW-WINDOW'));
// [L0797] ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด
  window.addEventListener('unhandledrejection',event=>recordDiagnosticError('window.unhandledrejection',event.reason instanceof Error?event.reason:new Error(String(event.reason||'Unhandled rejection')),'BW-PROMISE'));}
// [L0798] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  bind();applyTheme(storage.get(storageKey('theme'))||'light');applyLanguage(state.language);updateClock();clockTimer=setInterval(updateClock,1000);renderFiles();syncEtl(false);renderPreview('Report');renderResults();renderReport();
// [L0799] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
  await initWorker();
// [L0800] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(location.protocol==='file:'&&!state.workerReady){const banner=$('#runtimeBanner');if(banner){banner.classList.remove('hidden');banner.innerHTML='<strong>แนะนำการเปิดใช้งาน:</strong> กำลังใช้ Main-thread fallback ซึ่งอาจช้ากับไฟล์ใหญ่ กรุณาเปิดผ่าน <b>START_LOCAL_WEB.bat</b> หรือ GitHub Pages เพื่อใช้ Background Worker เต็มรูปแบบ';}}
// [L0801] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
  try{await BlackwolfDB.requestPersistent();}catch{}
// [L0802] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
  await BlackwolfDB.pruneExpired().catch(()=>0);await renderHistory();await refreshSystemStatus();
// [L0803] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0804] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
init();
// [L0805] ปิดฟังก์ชันครอบไฟล์ และสั่งให้โค้ดภายในเริ่มทำงานทันที
})();
