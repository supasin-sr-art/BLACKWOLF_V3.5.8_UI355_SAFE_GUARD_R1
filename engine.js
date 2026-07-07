// [L0001] เริ่ม IIFE/ฟังก์ชันครอบไฟล์ เพื่อแยก scope ไม่ให้ตัวแปรชนกับไฟล์อื่น
(function(global){
// [L0002] เปิด strict mode เพื่อให้ JavaScript จับข้อผิดพลาดเข้มขึ้น เช่น ห้ามใช้ตัวแปรที่ยังไม่ประกาศ
'use strict';
// [L0003] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0004] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0005] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// BLACKWOLF TEACHING COMMENTS: คอมเมนต์ชุดนี้เพิ่มเพื่ออธิบาย logic สำหรับอ่าน/ดูแลโค้ด
// [L0006] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// หลักสำคัญ: คอมเมนต์ขึ้นต้นด้วย // จะไม่ถูกรัน จึงไม่เปลี่ยน behavior ของ JavaScript
// [L0007] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ภาพรวม: ไฟล์หัวใจของระบบ ใช้อ่าน Excel, normalize header, รวมข้อมูล, ตัดรายการที่ออกกรมธรรม์แล้ว, สร้าง Master/ISSUE และจัดการ Pivot/XML
// [L0008] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ภาพรวม: แบ่งงานเป็นชั้น ๆ: helper → extractor → reconcile/classify → summarize → workbook builder → pivot patcher → validation → run
// [L0009] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ภาพรวม: export BlackwolfEngine ให้ app.js/worker.js ใช้ และมี internals สำหรับ preview/diagnostic บางส่วน
// [L0010] กำหนดค่าคงที่ CONFIG สำหรับใช้เป็นค่ากลางของ flow นี้
const CONFIG=global.BLACKWOLF_CONFIG||{
// [L0011] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  version:'3.5.8',
// [L0012] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  masterBaseName:'เช็คกรมธรรม์ต่างด้าวที่ยังไม่ออก_WEB',
// [L0013] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  issueBaseName:'เช็คสถานะ ISSUE_WEB'
// [L0014] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
};
// [L0015] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0016] กำหนดค่าคงที่ DAILY_HEADERS สำหรับใช้เป็นค่ากลางของ flow นี้
const DAILY_HEADERS=['AgencyCode','Mticode','AgencyName','RequestCode','employeeName','alienCode','alienNameEn','CertificateNo','TotalPremium','ProposalID','CreateDate','Status','EPropID','Discount'];
// [L0017] กำหนดค่าคงที่ MASTER_AO_HEADERS สำหรับใช้เป็นค่ากลางของ flow นี้
const MASTER_AO_HEADERS=['AgencyCode','Mticode','AgencyName','RequestCode','employeeName','alienCode','alienNameEn','CertificateNo','Policy','TotalPremium','ProposalID','CreateDate','Status','EPropID','Discount'];
// [L0018] กำหนดค่าคงที่ MASTER_OUTPUT_HEADERS สำหรับใช้เป็นค่ากลางของ flow นี้
const MASTER_OUTPUT_HEADERS=[...MASTER_AO_HEADERS,'หมายเหตุ','สถานะไม่สมบูรณ์','สถานะ Blacklist.','ติดปัญหาไม่เข้าในเมนู E','Date','สถานะไม่ issue','จำนวนวันที่ยังไม่ออกกรมธรรม์','ระยะเวลายังไม่ออกกรมธรรม์'];
// [L0019] กำหนดค่าคงที่ ISSUE_HEADERS สำหรับใช้เป็นค่ากลางของ flow นี้
const ISSUE_HEADERS=['AgencyCode','Mticode','AgencyName','RequestCode','employeeName','alienCode','alienNameEn','CertificateNo','PolicyNo','TotalPremium','ProposalID','CreateDate','Status','EPropID','Discount','สถานะ'];
// [L0020] กำหนดค่าคงที่ ALLOWED_STATUS_KEYS สำหรับใช้เป็นค่ากลางของ flow นี้
const ALLOWED_STATUS_KEYS=new Set(['','เสร็จสมบูรณ์','เสร็จสมบูรณ์(ติดปัญหาuploadfile)','ระบบขัดข้องกรุณาติดต่อไอที']);
// [L0021] กำหนดค่าคงที่ COLORS สำหรับใช้เป็นค่ากลางของ flow นี้
const COLORS={blue:'4F81BD',reportBlue:'0070C0',purple:'AB0CF2',darkPurple:'60497A',green:'00B050',red:'C0504D',orange:'F79646',white:'FFFFFF',black:'000000',grid:'7F7F7F',lightBlue:'DCE6F1',lightGray:'F2F2F2'};
// [L0022] กำหนดค่าคงที่ BUNDLED_PIVOT_TEMPLATE_URL สำหรับใช้เป็นค่ากลางของ flow นี้
const BUNDLED_PIVOT_TEMPLATE_URL='assets/BLACKWOLF_Master_Pivot_Template_V2.5.3.xlsx';
// [L0023] ประกาศตัวแปร bundledPivotTemplatePromise แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
let bundledPivotTemplatePromise=null;
// [L0024] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0025] กำหนดค่าคงที่ HEADER_ALIASES สำหรับใช้เป็นค่ากลางของ flow นี้
const HEADER_ALIASES=new Map([
// [L0026] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  ['proposalid','ProposalID'],['proposal','ProposalID'],['propid','Prop ID'],['prop-id','Prop ID'],['prop id','Prop ID'],['cpropid','CPROP_ID'],
// [L0027] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  ['checkpid','Check P-ID'],['checkp-id','Check P-ID'],['check p-id','Check P-ID'],['checkproposalid','Check P-ID'],
// [L0028] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  ['policyno','PolicyNo'],['policy','Policy'],['createdate','CreateDate'],['create date','CreateDate'],
// [L0029] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  ['totalpremium','TotalPremium'],['total premium','TotalPremium'],['agencycode','AgencyCode'],['agency code','AgencyCode'],
// [L0030] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  ['agencyname','AgencyName'],['agency name','AgencyName'],['requestcode','RequestCode'],['request code','RequestCode'],
// [L0031] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  ['employeename','employeeName'],['employee name','employeeName'],['aliencode','alienCode'],['alien code','alienCode'],
// [L0032] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  ['aliennameen','alienNameEn'],['alien name en','alienNameEn'],['certificateno','CertificateNo'],['certificate no','CertificateNo'],
// [L0033] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  ['epropid','EPropID'],['eprop id','EPropID'],['mticode','Mticode'],['discount','Discount'],['status','Status'],
// [L0034] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  ['date','Date'],['no','No'],['group','Group'],['ออกกรมธรรม์','ออกกรมธรรม์'],
// [L0035] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  ['สถานะไม่สมบูรณ์','สถานะไม่สมบูรณ์'],['สถานะblacklist','สถานะ Blacklist.'],['สถานะblacklist.','สถานะ Blacklist.'],
// [L0036] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  ['ติดปัญหาไม่เข้าในเมนูe','ติดปัญหาไม่เข้าในเมนู E'],['สถานะไม่issue','สถานะไม่ issue'],
// [L0037] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  ['จำนวนวันที่ยังไม่ออกกรมธรรม์','จำนวนวันที่ยังไม่ออกกรมธรรม์'],['ระยะเวลายังไม่ออกกรมธรรม์','ระยะเวลายังไม่ออกกรมธรรม์'],
// [L0038] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  ['หมายเหตุ','หมายเหตุ']
// [L0039] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
]);
// [L0040] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0041] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แปลงค่าทุกแบบเป็นข้อความสะอาด ตัดช่องว่าง/ขึ้นบรรทัด/Excel _x000D_
// [L0042] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0043] ประกาศฟังก์ชัน text เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function text(value){return value===null||value===undefined?'':String(value).replace(/[_]x000D_/gi,' ').replace(/[\r\n\t]+/g,' ').replace(/\s+/g,' ').trim();}
// [L0044] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: normalize รหัส/เลขอ้างอิง เช่น ProposalID/Policy ให้ไม่ติด apostrophe หรือ .0 จาก Excel
// [L0045] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0046] ประกาศฟังก์ชัน id เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function id(value){
// [L0047] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(value===null||value===undefined||value==='')return'';
// [L0048] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(typeof value==='number'&&Number.isFinite(value))return Number.isInteger(value)?String(value):String(value).replace(/\.0+$/,'');
// [L0049] ประกาศตัวแปร normalized แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const normalized=text(value).replace(/^'/,'');
// [L0050] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return /^\d+(?:\.0+)?$/.test(normalized)?normalized.replace(/\.0+$/,''):normalized;
// [L0051] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0052] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ทำ key สำหรับเทียบชื่อ header/sheet แบบไม่สน case, ช่องว่าง และ separator
// [L0053] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0054] ประกาศฟังก์ชัน rawKey เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function rawKey(value){return text(value).normalize('NFKC').toLowerCase().replace(/[\s._\-\/()]+/g,'');}
// [L0055] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แปลงชื่อ header ที่เขียนต่างกันให้เป็นชื่อมาตรฐานเดียวกันผ่าน alias map
// [L0056] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0057] ประกาศฟังก์ชัน canonicalHeader เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function canonicalHeader(value){
// [L0058] ประกาศตัวแปร source แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const source=text(value).normalize('NFKC').toLowerCase();
// [L0059] ประกาศตัวแปร compact แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const compact=source.replace(/[\s._\-\/()]+/g,'');
// [L0060] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return HEADER_ALIASES.get(source)||HEADER_ALIASES.get(compact)||text(value);
// [L0061] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0062] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง key มาตรฐานของ header หลัง canonical แล้ว
// [L0063] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0064] ประกาศฟังก์ชัน headerKey เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function headerKey(value){return rawKey(canonicalHeader(value));}
// [L0065] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แปลงค่าเป็นตัวเลข โดยรองรับ comma และค่าว่าง
// [L0066] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0067] ประกาศฟังก์ชัน number เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function number(value){if(value===null||value===undefined||value==='')return 0;if(typeof value==='number')return Number.isFinite(value)?value:0;const parsed=Number(String(value).replace(/,/g,'').trim());return Number.isFinite(parsed)?parsed:0;}
// [L0068] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เช็คว่าค่ามีเนื้อหาจริง ไม่ใช่ null/undefined/blank
// [L0069] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0070] ประกาศฟังก์ชัน hasValue เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function hasValue(value){return value!==null&&value!==undefined&&String(value).trim()!=='';}
// [L0071] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เติม 0 หน้าเลขวัน/เดือน/เวลาให้ครบ 2 หลัก
// [L0072] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0073] ประกาศฟังก์ชัน pad เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function pad(value){return String(value).padStart(2,'0');}
// [L0074] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แปลง Date เป็น yyyy-mm-dd เพื่อใช้ในชื่อไฟล์/เปรียบเทียบ
// [L0075] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0076] ประกาศฟังก์ชัน dateKey เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function dateKey(date){return date?`${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`:'';}
// [L0077] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แปลง Date เป็น dd/mm/yyyy สำหรับแสดงใน Excel/UI
// [L0078] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0079] ประกาศฟังก์ชัน dateDisplay เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function dateDisplay(date){return date?`${pad(date.getDate())}/${pad(date.getMonth()+1)}/${date.getFullYear()}`:'';}
// [L0080] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แปลง Date เป็น yyyy-mm-dd HH:mm:ss สำหรับ audit/log
// [L0081] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0082] ประกาศฟังก์ชัน dateTimeText เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function dateTimeText(date){return date?`${dateKey(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`:'';}
// [L0083] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ตัดเวลาออก เหลือเฉพาะวันเพื่อคำนวณ aging ให้ตรง
// [L0084] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0085] ประกาศฟังก์ชัน dateOnly เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function dateOnly(date){return date?new Date(date.getFullYear(),date.getMonth(),date.getDate()):null;}
// [L0086] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แปลง Date เป็น serial number ของ Excel
// [L0087] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0088] ประกาศฟังก์ชัน excelSerial เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function excelSerial(value){
// [L0089] ประกาศตัวแปร date แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const date=value instanceof Date?value:parseDate(value);
// [L0090] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!date||Number.isNaN(date.getTime()))return null;
// [L0091] ประกาศตัวแปร utc แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const utc=Date.UTC(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds(),date.getMilliseconds());
// [L0092] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return utc/86400000+25569;
// [L0093] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0094] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อ่านวันที่จาก Date object, serial Excel, dd/mm/yyyy, yyyy-mm-dd และปี พ.ศ.
// [L0095] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0096] ประกาศฟังก์ชัน parseDate เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function parseDate(value){
// [L0097] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(value===null||value===undefined||value==='')return null;
// [L0098] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(value instanceof Date&&!Number.isNaN(value.getTime()))return new Date(value.getFullYear(),value.getMonth(),value.getDate(),value.getHours(),value.getMinutes(),value.getSeconds());
// [L0099] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(typeof value==='number'&&Number.isFinite(value)){
// [L0100] ประกาศตัวแปร parsed แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const parsed=global.XLSX?.SSF?.parse_date_code(value);
// [L0101] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(parsed)return new Date(parsed.y,parsed.m-1,parsed.d,parsed.H||0,parsed.M||0,Math.floor(parsed.S||0));
// [L0102] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0103] ประกาศตัวแปร source แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const source=text(value);
// [L0104] ประกาศตัวแปร match แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let match=source.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
// [L0105] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(match){let year=+match[3];if(year>2400)year-=543;return new Date(year,+match[2]-1,+match[1],+(match[4]||0),+(match[5]||0),+(match[6]||0));}
// [L0106] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  match=source.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})(?:[T\s](\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
// [L0107] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(match){let year=+match[1];if(year>2400)year-=543;return new Date(year,+match[2]-1,+match[3],+(match[4]||0),+(match[5]||0),+(match[6]||0));}
// [L0108] ประกาศตัวแปร parsed แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const parsed=new Date(source);
// [L0109] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return Number.isNaN(parsed.getTime())?null:parsed;
// [L0110] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0111] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: คำนวณจำนวนวันระหว่างวันที่เริ่มต้นกับวันที่ปลายทาง
// [L0112] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0113] ประกาศฟังก์ชัน daysBetween เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function daysBetween(start,end){if(!start||!end)return null;return Math.max(0,Math.floor((dateOnly(end)-dateOnly(start))/86400000));}
// [L0114] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: จัดกลุ่มอายุค้างเป็น 1-7, 8-15, 16-30, มากกว่า 30 วัน
// [L0115] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0116] ประกาศฟังก์ชัน agingRange เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function agingRange(days){if(days===null||days===undefined)return'';if(days<=7)return'1 - 7 วัน';if(days<=15)return'8 - 15 วัน';if(days<=30)return'16 - 30 วัน';return'มากกว่า 30 วัน';}
// [L0117] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: normalize สถานะแบบข้อความ
// [L0118] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0119] ประกาศฟังก์ชัน normalizeStatus เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function normalizeStatus(value){return text(value);}
// [L0120] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ทำ key ของสถานะเพื่อเทียบแบบไม่สนช่องว่าง/case
// [L0121] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0122] ประกาศฟังก์ชัน statusKey เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function statusKey(value){return text(value).normalize('NFKC').toLowerCase().replace(/\s+/g,'');}
// [L0123] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: คืน array ที่ไม่ซ้ำโดย normalize id ก่อน
// [L0124] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0125] ประกาศฟังก์ชัน unique เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function unique(values){const seen=new Set(),result=[];for(const value of values||[]){const normalized=id(value);if(normalized&&!seen.has(normalized)){seen.add(normalized);result.push(normalized);}}return result;}
// [L0126] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: รวมตัวเลขของ field หนึ่งใน rows
// [L0127] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0128] ประกาศฟังก์ชัน sum เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function sum(rows,field){return (rows||[]).reduce((total,row)=>total+number(row[field]),0);}
// [L0129] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แตกข้อความเป็นบรรทัด รองรับ BOM ตอนต้นไฟล์
// [L0130] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0131] ประกาศฟังก์ชัน textLines เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function textLines(value){return String(value||'').replace(/^\uFEFF/,'').split(/\r?\n/);}
// [L0132] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ลบอักขระต้องห้ามของชื่อไฟล์ Windows
// [L0133] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0134] ประกาศฟังก์ชัน safeFileName เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function safeFileName(value){return text(value).replace(/[\\/:*?"<>|]+/g,'_');}
// [L0135] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0136] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อ่านไฟล์ Excel ด้วย XLSX library และเลือกเก็บ source buffer ได้
// [L0137] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0138] ประกาศฟังก์ชัน readWorkbook เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function readWorkbook(file,preserveSource=false){const buffer=await file.arrayBuffer();const workbook=global.XLSX.read(buffer,{type:'array',cellDates:true,cellNF:false,cellStyles:false,dense:true});if(preserveSource)workbook.__sourceBuffer=buffer;return workbook;}
// [L0139] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แปลง worksheet เป็น matrix สองมิติแบบ raw
// [L0140] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0141] ประกาศฟังก์ชัน sheetMatrix เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function sheetMatrix(worksheet){return global.XLSX.utils.sheet_to_json(worksheet,{header:1,raw:true,defval:null,blankrows:false});}
// [L0142] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง map จาก header name ไป column index
// [L0143] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0144] ประกาศฟังก์ชัน headerMap เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function headerMap(row){const map={};(row||[]).forEach((value,index)=>{const key=headerKey(value);if(key&&!Object.prototype.hasOwnProperty.call(map,key))map[key]=index;});return map;}
// [L0145] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ค้นหา row ที่มี header ตามที่ต้องการภายในช่วง row แรก ๆ
// [L0146] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0147] ประกาศฟังก์ชัน findHeaderInMatrix เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function findHeaderInMatrix(matrix,required,maxRows=60){const requirements=(required||[]).map(headerKey);for(let rowIndex=0;rowIndex<Math.min(matrix.length,maxRows);rowIndex++){const map=headerMap(matrix[rowIndex]||[]);if(requirements.every(key=>Object.prototype.hasOwnProperty.call(map,key)))return{rowIndex,map};}return null;}
// [L0148] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เลือก sheet ที่มี header required โดยให้ชื่อ preferred มาก่อน
// [L0149] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0150] ประกาศฟังก์ชัน findSheet เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function findSheet(workbook,preferred,required){
// [L0151] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!workbook)return null;
// [L0152] ประกาศตัวแปร preferredNames แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const preferredNames=(Array.isArray(preferred)?preferred:[preferred]).filter(Boolean);
// [L0153] สร้างตัวช่วยแบบ arrow function ชื่อ ordered เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const ordered=[...workbook.SheetNames].sort((left,right)=>{
// [L0154] สร้างตัวช่วยแบบ arrow function ชื่อ leftIndex เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
    const leftIndex=preferredNames.findIndex(name=>rawKey(name)===rawKey(left));
// [L0155] สร้างตัวช่วยแบบ arrow function ชื่อ rightIndex เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
    const rightIndex=preferredNames.findIndex(name=>rawKey(name)===rawKey(right));
// [L0156] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
    return(leftIndex<0?999:leftIndex)-(rightIndex<0?999:rightIndex);
// [L0157] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  });
// [L0158] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const name of ordered){const matrix=sheetMatrix(workbook.Sheets[name]);const found=findHeaderInMatrix(matrix,required);if(found)return{name,matrix,...found};}
// [L0159] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return null;
// [L0160] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0161] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: หา sheet จากชื่อแบบ normalize
// [L0162] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0163] ประกาศฟังก์ชัน findNamedSheet เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function findNamedSheet(workbook,name){if(!workbook)return null;const foundName=workbook.SheetNames.find(sheetName=>rawKey(sheetName)===rawKey(name));return foundName?{name:foundName,matrix:sheetMatrix(workbook.Sheets[foundName])}:null;}
// [L0164] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อ่านค่า key/value จาก sheet _Audit
// [L0165] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0166] ประกาศฟังก์ชัน auditValue เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function auditValue(workbook,key){
// [L0167] ประกาศตัวแปร audit แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const audit=findNamedSheet(workbook,'_Audit');
// [L0168] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!audit)return'';
// [L0169] ประกาศตัวแปร wanted แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const wanted=rawKey(key);
// [L0170] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const row of audit.matrix||[]){if(rawKey(row?.[0])===wanted)return text(row?.[1]);}
// [L0171] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return'';
// [L0172] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0173] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อ่าน version ที่สร้าง Master จาก _Audit หรือ workbook properties
// [L0174] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0175] ประกาศฟังก์ชัน masterEngineVersion เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function masterEngineVersion(workbook){return auditValue(workbook,'Version')||text(workbook?.Props?.Subject).replace(/^BLACKWOLF\s*/i,'');}
// [L0176] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: กันการใช้ Master เวอร์ชันเก่าที่รู้ว่ามีปัญหา Status/PV
// [L0177] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0178] ประกาศฟังก์ชัน assertMasterVersionSafe เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function assertMasterVersionSafe(workbook){
// [L0179] ประกาศตัวแปร version แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const version=masterEngineVersion(workbook);
// [L0180] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(version==='3.5.1'||version==='3.5.2')throw new Error(`Master ถูกสร้างด้วย BLACKWOLF V${version} ซึ่งมีปัญหา Status/PV เดิม กรุณาใช้ไฟล์ Manual V2.5.3 ที่ตรวจสอบแล้ว หรือ Master V3.5.4 ขึ้นไป`);
// [L0181] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return version;
// [L0182] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0183] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อ่านค่า cell จาก row ด้วย header map
// [L0184] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0185] ประกาศฟังก์ชัน valueAt เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function valueAt(row,map,name){const index=map[headerKey(name)];return index===undefined?null:row[index];}
// [L0186] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อ่านค่าจากหลาย header ที่เป็น alias แล้วคืนตัวแรกที่เจอ
// [L0187] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0188] ประกาศฟังก์ชัน firstValue เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function firstValue(row,map,names){for(const name of names){const index=map[headerKey(name)];if(index!==undefined)return row[index];}return null;}
// [L0189] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เดา role จากชื่อไฟล์เฉพาะกรณีโครงสร้างแยกยาก เช่น SM/Blacklist
// [L0190] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0191] ประกาศฟังก์ชัน fileNameHint เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function fileNameHint(fileName){
// [L0192] ประกาศตัวแปร name แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const name=text(fileName).toLowerCase();
// [L0193] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(/black\s*list|blacklist|บัญชีดำ/.test(name))return'blacklist';
// [L0194] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(/ข้อมูลไม่สมบูรณ์|(^|[ _-])sm([ _.-]|$)/.test(name))return'sm';
// [L0195] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(/m190|prd008|premium by policy/.test(name))return'm190';
// [L0196] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(/เช็คสถานะ.*issue|check.*issue|status.*issue/.test(name))return'issue';
// [L0197] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(/รายงานงานประกันแรงงานต่างด้าว|daily\s*report|daily/.test(name))return'daily';
// [L0198] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(/เช็คกรมธรรม์ต่างด้าวที่ยังไม่ออก|master/.test(name))return'master';
// [L0199] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return null;
// [L0200] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0201] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ตรวจบทบาท workbook จาก sheet/header ไม่พึ่งชื่อไฟล์เป็นหลัก
// [L0202] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0203] ประกาศฟังก์ชัน detectWorkbookRole เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function detectWorkbookRole(workbook,fileName=''){
// [L0204] ประกาศตัวแปร matches แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const matches=[];
// [L0205] ประกาศตัวแปร namedData แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const namedData=findNamedSheet(workbook,'Data');
// [L0206] ประกาศตัวแปร masterAw แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const masterAw=namedData&&findHeaderInMatrix(namedData.matrix,['ProposalID','CreateDate','Date','สถานะไม่ issue']);
// [L0207] ประกาศตัวแปร masterAo แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const masterAo=namedData&&findHeaderInMatrix(namedData.matrix,MASTER_AO_HEADERS);
// [L0208] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(masterAw)return{role:'master',matches:[{role:'master',score:100,reason:'พบ Sheet Data โครงสร้าง Master A:W และ Date'}],message:'พบ Sheet Data โครงสร้าง Master A:W และ Date'};
// [L0209] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(masterAo)return{role:'master',matches:[{role:'master',score:97,reason:'พบ Sheet Data โครงสร้าง Master A:O'}],message:'พบ Sheet Data โครงสร้าง Master A:O'};
// [L0210] ประกาศตัวแปร namedCheck แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const namedCheck=findNamedSheet(workbook,'Check');
// [L0211] ประกาศตัวแปร namedEtl แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const namedEtl=findNamedSheet(workbook,'ETL');
// [L0212] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(namedData&&namedCheck&&namedEtl&&findHeaderInMatrix(namedCheck.matrix,['Check P-ID'])&&findHeaderInMatrix(namedEtl.matrix,['Policy','Group']))matches.push({role:'issue',score:100,reason:'พบ Sheet Data + Check + ETL'});
// [L0213] ประกาศตัวแปร policyDetail แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const policyDetail=findNamedSheet(workbook,'Policy Detail');
// [L0214] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(policyDetail&&findHeaderInMatrix(policyDetail.matrix,['Prop Id']))matches.push({role:'m190',score:95,reason:'พบ Sheet Policy Detail และ Prop Id'});
// [L0215] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(namedData&&findHeaderInMatrix(namedData.matrix,DAILY_HEADERS))matches.push({role:'daily',score:88,reason:'พบ Header Daily Report ครบใน Sheet Data'});
// [L0216] ประกาศตัวแปร control แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const control=findSheet(workbook,workbook.SheetNames,['CPROP_ID'])||findSheet(workbook,workbook.SheetNames,['Prop ID']);
// [L0217] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(control){
// [L0218] ประกาศตัวแปร hint แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const hint=fileNameHint(fileName);
// [L0219] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(hint==='sm'||workbook.SheetNames.some(name=>/ข้อมูลไม่สมบูรณ์|(^|\s)sm(\s|$)/i.test(name)))matches.push({role:'sm',score:92,reason:`พบ CPROP_ID / Prop ID ใน ${control.name}`});
// [L0220] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(hint==='blacklist'||workbook.SheetNames.some(name=>/black\s*list|blacklist|บัญชีดำ/i.test(name)))matches.push({role:'blacklist',score:92,reason:`พบ CPROP_ID / Prop ID ใน ${control.name}`});
// [L0221] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!matches.some(match=>match.role==='sm'||match.role==='blacklist'))matches.push({role:'control-ambiguous',score:60,reason:`พบ CPROP_ID / Prop ID แต่แยก SM/Blacklist ไม่ได้`});
// [L0222] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0223] ประกาศตัวแปร priority แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const priority={issue:6,m190:4,daily:3,sm:2,blacklist:2,'control-ambiguous':1};
// [L0224] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
  matches.sort((a,b)=>b.score-a.score||(priority[b.role]||0)-(priority[a.role]||0));
// [L0225] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!matches.length)return{role:null,matches:[],message:'ไม่พบโครงสร้างไฟล์ที่ระบบรองรับ'};
// [L0226] ประกาศตัวแปร top แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const top=matches[0];
// [L0227] สร้างตัวช่วยแบบ arrow function ชื่อ competing เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const competing=matches.filter(match=>match.role!==top.role&&match.score===top.score);
// [L0228] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(top.role==='control-ambiguous'||competing.length)return{role:null,matches,message:'โครงสร้างไฟล์ไม่ชัดเจน กรุณาตรวจชื่อ Sheet/ชื่อไฟล์'};
// [L0229] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{role:top.role,matches,message:top.reason};
// [L0230] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0231] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0232] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แปลง row matrix เป็น object ตาม header map และ header ที่ต้องการ
// [L0233] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0234] ประกาศฟังก์ชัน rowFromMap เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function rowFromMap(row,map,source){
// [L0235] ประกาศตัวแปร certificateNo แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const certificateNo=text(valueAt(row,map,'CertificateNo'));
// [L0236] ประกาศตัวแปร createDate แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const createDate=parseDate(valueAt(row,map,'CreateDate'));
// [L0237] ประกาศตัวแปร storedDate แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const storedDate=parseDate(valueAt(row,map,'Date'));
// [L0238] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{
// [L0239] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    AgencyCode:text(valueAt(row,map,'AgencyCode')),
// [L0240] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    Mticode:text(valueAt(row,map,'Mticode')),
// [L0241] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    AgencyName:text(valueAt(row,map,'AgencyName')),
// [L0242] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    RequestCode:id(valueAt(row,map,'RequestCode')),
// [L0243] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    employeeName:text(valueAt(row,map,'employeeName')),
// [L0244] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    alienCode:id(valueAt(row,map,'alienCode')),
// [L0245] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    alienNameEn:text(valueAt(row,map,'alienNameEn')),
// [L0246] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    CertificateNo:certificateNo,
// [L0247] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    Policy:text(firstValue(row,map,['Policy','PolicyNo']))||(certificateNo.length>=8?certificateNo.slice(0,8):''),
// [L0248] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    TotalPremium:number(valueAt(row,map,'TotalPremium')),
// [L0249] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    ProposalID:id(valueAt(row,map,'ProposalID')),
// [L0250] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    CreateDate:createDate,
// [L0251] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    Status:normalizeStatus(valueAt(row,map,'Status')),
// [L0252] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    EPropID:id(valueAt(row,map,'EPropID')),
// [L0253] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    Discount:text(valueAt(row,map,'Discount')),
// [L0254] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    StoredDate:storedDate,
// [L0255] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    ExistingIncompleteStatus:text(valueAt(row,map,'สถานะไม่สมบูรณ์')),
// [L0256] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    ExistingBlacklistStatus:text(valueAt(row,map,'สถานะ Blacklist.')),
// [L0257] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    ExistingMenuEProblem:text(valueAt(row,map,'ติดปัญหาไม่เข้าในเมนู E')),
// [L0258] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    ExistingPendingStatus:text(valueAt(row,map,'สถานะไม่ issue')),
// [L0259] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    DataSource:source
// [L0260] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  };
// [L0261] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0262] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ดึงข้อมูล Data จาก Master เดิมและ normalize column
// [L0263] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0264] ประกาศฟังก์ชัน extractMasterData เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function extractMasterData(workbook){
// [L0265] ประกาศตัวแปร found แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const found=findSheet(workbook,['Data'],['ProposalID','CreateDate']);
// [L0266] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!found)return{rows:[],found:null,invalidRows:0};
// [L0267] ประกาศตัวแปร rows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const rows=[];let invalidRows=0;
// [L0268] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(let index=found.rowIndex+1;index<found.matrix.length;index++){
// [L0269] ประกาศตัวแปร sourceRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const sourceRow=found.matrix[index]||[];
// [L0270] ประกาศตัวแปร row แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const row=rowFromMap(sourceRow,found.map,'Master Carry Forward');
// [L0271] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!row.ProposalID)continue;
// [L0272] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!row.CreateDate&&row.StoredDate)row.CreateDate=row.StoredDate;
// [L0273] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!row.CreateDate)invalidRows++;
// [L0274] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    rows.push(row);
// [L0275] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0276] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{rows,found,invalidRows};
// [L0277] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0278] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: หาวันล่าสุดใน Master เพื่อใช้เป็น start date ต่อเนื่อง
// [L0279] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0280] ประกาศฟังก์ชัน extractMasterMaxDate เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function extractMasterMaxDate(workbook){
// [L0281] ประกาศตัวแปร found แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const found=findSheet(workbook,['Data'],['ProposalID','Date']);
// [L0282] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!found)return{date:null,found:null,validRows:0};
// [L0283] ประกาศตัวแปร maxDate แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let maxDate=null,validRows=0;
// [L0284] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(let index=found.rowIndex+1;index<found.matrix.length;index++){
// [L0285] ประกาศตัวแปร row แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const row=found.matrix[index]||[];
// [L0286] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!id(valueAt(row,found.map,'ProposalID')))continue;
// [L0287] ประกาศตัวแปร date แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const date=parseDate(valueAt(row,found.map,'Date'));
// [L0288] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!date)continue;
// [L0289] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    validRows++;
// [L0290] ประกาศตัวแปร normalized แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const normalized=dateOnly(date);
// [L0291] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!maxDate||normalized>maxDate)maxDate=normalized;
// [L0292] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0293] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{date:maxDate,found,validRows};
// [L0294] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0295] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ดึงข้อมูล Daily Report รอบปัจจุบัน
// [L0296] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0297] ประกาศฟังก์ชัน extractDaily เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function extractDaily(workbook){
// [L0298] ประกาศตัวแปร found แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const found=findSheet(workbook,['Data'],DAILY_HEADERS);
// [L0299] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!found)throw new Error('Daily Report: ไม่พบ Sheet/Header ที่ต้องใช้');
// [L0300] ประกาศตัวแปร allDates แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const allDates=[],raw=[];
// [L0301] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(let index=found.rowIndex+1;index<found.matrix.length;index++){
// [L0302] ประกาศตัวแปร sourceRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const sourceRow=found.matrix[index]||[];
// [L0303] ประกาศตัวแปร date แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const date=parseDate(valueAt(sourceRow,found.map,'CreateDate'));
// [L0304] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(date)allDates.push(dateOnly(date));
// [L0305] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    raw.push(sourceRow);
// [L0306] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0307] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!allDates.length)throw new Error('Daily Report: ไม่พบ CreateDate ที่อ่านได้');
// [L0308] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
  allDates.sort((left,right)=>left-right);
// [L0309] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{found,raw,minDate:allDates[0],maxDate:allDates[allDates.length-1],validDateRows:allDates.length,worksheetRows:raw.length};
// [L0310] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0311] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: กรอง Daily ให้เหลือรายการที่ควรเข้าสู่ flow pending
// [L0312] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0313] ประกาศฟังก์ชัน filterDailyRows เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function filterDailyRows(daily,startDate,endDate){
// [L0314] ประกาศตัวแปร rows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const rows=[];let skippedStatus=0,skippedDate=0,skippedNoProposal=0,blankStatusRows=0;
// [L0315] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const sourceRow of daily.raw){
// [L0316] ประกาศตัวแปร createDate แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const createDate=parseDate(valueAt(sourceRow,daily.found.map,'CreateDate'));
// [L0317] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!createDate||dateOnly(createDate)<startDate||dateOnly(createDate)>endDate){skippedDate++;continue;}
// [L0318] ประกาศตัวแปร sourceStatus แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const sourceStatus=normalizeStatus(valueAt(sourceRow,daily.found.map,'Status'));
// [L0319] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!ALLOWED_STATUS_KEYS.has(statusKey(sourceStatus))){skippedStatus++;continue;}
// [L0320] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(sourceStatus==='')blankStatusRows++;
// [L0321] ประกาศตัวแปร row แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const row=rowFromMap(sourceRow,daily.found.map,'Daily Report');
// [L0322] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!row.ProposalID){skippedNoProposal++;continue;}
// [L0323] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    rows.push(row);
// [L0324] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0325] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{rows,skippedStatus,skippedDate,skippedNoProposal,blankStatusRows};
// [L0326] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0327] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ดึงชุดรหัสจาก workbook ตาม header ที่กำหนด
// [L0328] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0329] ประกาศฟังก์ชัน extractIds เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function extractIds(workbook,preferred,headers){
// [L0330] ประกาศตัวแปร candidates แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const candidates=Array.isArray(headers)?headers:[headers];
// [L0331] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const header of candidates){
// [L0332] ประกาศตัวแปร found แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const found=findSheet(workbook,preferred,[header]);
// [L0333] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!found)continue;
// [L0334] ประกาศตัวแปร ids แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const ids=[];
// [L0335] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
    for(let index=found.rowIndex+1;index<found.matrix.length;index++){const value=id(valueAt(found.matrix[index]||[],found.map,header));if(value)ids.push(value);}
// [L0336] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
    return{ids,found};
// [L0337] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0338] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{ids:[],found:null};
// [L0339] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0340] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ดึง control IDs จาก SM/Blacklist/other control sheets
// [L0341] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0342] ประกาศฟังก์ชัน extractControlIds เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function extractControlIds(workbook,preferred){return extractIds(workbook,preferred,['CPROP_ID','Prop ID','ProposalID']);}
// [L0343] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ดึง Auto-Mail 7.2 / ETL จาก ISSUE workbook เดิมถ้ามี
// [L0344] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0345] ประกาศฟังก์ชัน extractIssueEtl เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function extractIssueEtl(workbook){
// [L0346] ประกาศตัวแปร found แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const found=findSheet(workbook,['ETL'],['Policy','Group']);
// [L0347] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!found)return{records:[],found:null};
// [L0348] ประกาศตัวแปร records แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const records=[];
// [L0349] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(let index=found.rowIndex+1;index<found.matrix.length;index++){
// [L0350] ประกาศตัวแปร row แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const row=found.matrix[index]||[];
// [L0351] ประกาศตัวแปร propId แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const propId=id(firstValue(row,found.map,['Prop ID','CPROP_ID','ProposalID']));
// [L0352] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!propId)continue;
// [L0353] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    records.push({No:number(firstValue(row,found.map,['No']))||records.length+1,PropId:propId,Policy:text(firstValue(row,found.map,['Policy'])),Group:text(firstValue(row,found.map,['Group']))});
// [L0354] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0355] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{records,found};
// [L0356] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0357] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ดึง Check/M190 จาก ISSUE workbook
// [L0358] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0359] ประกาศฟังก์ชัน extractIssueCheck เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function extractIssueCheck(workbook){return extractIds(workbook,['Check'],['Check P-ID']);}
// [L0360] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อ่านข้อความ Auto-Mail 7.2 รูปแบบ No.PropID:Policy:Group เป็น record
// [L0361] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0362] ประกาศฟังก์ชัน parseEtl เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function parseEtl(value){
// [L0363] ประกาศตัวแปร records แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const records=[],errors=[],seen=new Set();let duplicates=0;
// [L0364] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
  textLines(value).forEach((line,index)=>{
// [L0365] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!line.trim())return;
// [L0366] ประกาศตัวแปร match แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const match=line.match(/^\s*(\d+)\.(\d+)\s*:\s*([^:]+)\s*:\s*(.+?)\s*$/);
// [L0367] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!match){errors.push({line:index+1,value:line});return;}
// [L0368] ประกาศตัวแปร propId แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const propId=id(match[2]);
// [L0369] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(seen.has(propId))duplicates++;else seen.add(propId);
// [L0370] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    records.push({No:Number(match[1]),PropId:propId,Policy:text(match[3]),Group:text(match[4])});
// [L0371] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  });
// [L0372] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{records,errors,duplicates,valid:records.length,invalid:errors.length,unique:seen.size};
// [L0373] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0374] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้างลายเซ็นของ row เพื่อช่วยตรวจ duplicate เชิงข้อมูล
// [L0375] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0376] ประกาศฟังก์ชัน rowFingerprint เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function rowFingerprint(row){return [row.AgencyCode,row.Mticode,row.AgencyName,row.RequestCode,row.employeeName,row.alienCode,row.alienNameEn,row.CertificateNo,row.Policy,number(row.TotalPremium).toFixed(2),row.ProposalID,row.CreateDate?dateTimeText(row.CreateDate):'',row.Status,row.EPropID,row.Discount].map(value=>text(value).normalize('NFKC')).join('\u241F');}
// [L0377] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง token ระบุตัวตนที่เสถียรจากข้อมูลสำคัญ
// [L0378] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0379] ประกาศฟังก์ชัน stableIdentityToken เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function stableIdentityToken(value){return text(value).normalize('NFKC').replace(/\s+/g,'').toUpperCase();}
// [L0380] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ตรวจว่า token มีข้อมูลพอจะใช้เทียบ carry-forward ได้หรือไม่
// [L0381] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0382] ประกาศฟังก์ชัน usableStableIdentity เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function usableStableIdentity(value){const token=stableIdentityToken(value);if(!token)return false;const blocked=new Set(['-','–','—','N/A','NA','NULL','UNDEFINED','(BLANK)','NONE','UNKNOWN','ไม่มี','ไม่ระบุ','ไม่ทราบ','0','00','000','0000','00000','000000']);return!blocked.has(token)&&!/^0+$/.test(token);}
// [L0383] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง identity ของ row จาก CertificateNo หรือ alienCode+ProposalID ตามกฎ
// [L0384] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0385] ประกาศฟังก์ชัน rowStableIdentity เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function rowStableIdentity(row){
// [L0386] ประกาศตัวแปร certificate แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const certificate=stableIdentityToken(row?.CertificateNo);
// [L0387] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(usableStableIdentity(certificate)&&!/^[\-–—]+$/.test(certificate))return`CERT\u241F${certificate}`;
// [L0388] ประกาศตัวแปร alien แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const alien=stableIdentityToken(row?.alienCode),proposal=id(row?.ProposalID);
// [L0389] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(usableStableIdentity(alien)&&proposal)return`ALIEN_PROP\u241F${alien}\u241F${proposal}`;
// [L0390] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return'';
// [L0391] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0392] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เลือกวันที่เก่าที่สุดจากกลุ่ม row เพื่อรักษาอายุค้างเดิม
// [L0393] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0394] ประกาศฟังก์ชัน earliestDateValue เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function earliestDateValue(...values){let earliest=null;for(const value of values){const parsed=parseDate(value);if(parsed&&(!earliest||parsed<earliest))earliest=parsed;}return earliest;}
// [L0395] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: รวม row ที่เป็นคน/รายการเดียวกันให้เหลือ record ที่ถูกต้องกว่า
// [L0396] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0397] ประกาศฟังก์ชัน mergeIdentityRows เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function mergeIdentityRows(existing,incoming,{refreshed=false}={}){
// [L0398] ประกาศตัวแปร merged แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const merged={...existing,...incoming};
// [L0399] ประกาศตัวแปร preserveWhenIncomingBlank แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const preserveWhenIncomingBlank=['AgencyCode','Mticode','AgencyName','RequestCode','employeeName','alienCode','alienNameEn','CertificateNo','Policy','ProposalID','EPropID','Discount'];
// [L0400] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const field of preserveWhenIncomingBlank)if(!hasValue(incoming?.[field])&&hasValue(existing?.[field]))merged[field]=existing[field];
// [L0401] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  merged.CreateDate=parseDate(incoming?.CreateDate)||parseDate(existing?.CreateDate);
// [L0402] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  merged.StoredDate=earliestDateValue(existing?.StoredDate,incoming?.StoredDate)||null;
// [L0403] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  merged.ExistingIncompleteStatus=text(existing?.ExistingIncompleteStatus)||text(incoming?.ExistingIncompleteStatus);
// [L0404] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  merged.ExistingBlacklistStatus=text(existing?.ExistingBlacklistStatus)||text(incoming?.ExistingBlacklistStatus);
// [L0405] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  merged.ExistingMenuEProblem=text(existing?.ExistingMenuEProblem)||text(incoming?.ExistingMenuEProblem);
// [L0406] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  merged.ExistingPendingStatus=text(existing?.ExistingPendingStatus)||text(incoming?.ExistingPendingStatus);
// [L0407] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  merged.DataSource=refreshed?'Master Carry Forward + Daily Refresh':(incoming?.DataSource||existing?.DataSource||'');
// [L0408] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return merged;
// [L0409] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0410] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: วิเคราะห์ duplicate จาก stable identity สำหรับ QA/summary
// [L0411] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0412] ประกาศฟังก์ชัน analyzeStableDuplicateRows เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function analyzeStableDuplicateRows(rows){
// [L0413] ประกาศตัวแปร counts แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const counts=new Map();
// [L0414] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const row of rows||[]){const key=rowStableIdentity(row);if(key)counts.set(key,(counts.get(key)||0)+1);}
// [L0415] ประกาศตัวแปร duplicateKeys แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let duplicateKeys=0,duplicateRows=0,extraRows=0;
// [L0416] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const count of counts.values())if(count>1){duplicateKeys++;duplicateRows+=count;extraRows+=count-1;}
// [L0417] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{duplicateKeys,duplicateRows,extraRows};
// [L0418] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0419] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: วิเคราะห์ alienCode ซ้ำเพื่อเตือนความเสี่ยงข้อมูลซ้ำ
// [L0420] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0421] ประกาศฟังก์ชัน analyzeAlienDuplicates เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function analyzeAlienDuplicates(rows){
// [L0422] ประกาศตัวแปร counts แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const counts=new Map();
// [L0423] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const row of rows||[]){const code=stableIdentityToken(row?.alienCode);if(usableStableIdentity(code))counts.set(code,(counts.get(code)||0)+1);}
// [L0424] ประกาศตัวแปร codes แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const codes=[];let duplicateRowCount=0;
// [L0425] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const [alienCode,count] of counts)if(count>1){codes.push({alienCode,count});duplicateRowCount+=count;}
// [L0426] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
  codes.sort((left,right)=>right.count-left.count||left.alienCode.localeCompare(right.alienCode));
// [L0427] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{duplicateCodeCount:codes.length,duplicateRowCount,codes};
// [L0428] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0429] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: รวม Master เก่ากับ Daily ใหม่ แล้วตัดรายการที่ออกกรมธรรม์/อยู่ control list
// [L0430] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0431] ประกาศฟังก์ชัน reconcileRows เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function reconcileRows(carriedRows,dailyRows){
// [L0432] ประกาศตัวแปร result แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const result=[],stableIndex=new Map(),unstableCarriedCounts=new Map();
// [L0433] ประกาศตัวแปร masterDuplicatesCollapsed แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let masterDuplicatesCollapsed=0;
// [L0434] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const row of carriedRows||[]){
// [L0435] ประกาศตัวแปร stableKey แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const stableKey=rowStableIdentity(row);
// [L0436] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(stableKey){
// [L0437] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
      if(stableIndex.has(stableKey)){const index=stableIndex.get(stableKey);result[index]=mergeIdentityRows(result[index],row);masterDuplicatesCollapsed++;}
// [L0438] ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข
      else{stableIndex.set(stableKey,result.length);result.push(row);}
// [L0439] ข้ามรอบ loop ปัจจุบัน แล้วไปตรวจรายการถัดไปทันที
      continue;
// [L0440] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
    }
// [L0441] ประกาศตัวแปร fingerprint แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const fingerprint=rowFingerprint(row);unstableCarriedCounts.set(fingerprint,(unstableCarriedCounts.get(fingerprint)||0)+1);result.push(row);
// [L0442] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0443] ประกาศตัวแปร masterRowsAfterIdentity แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const masterRowsAfterIdentity=result.length,dailyStableRows=[],dailyStableIndex=new Map(),dailyUnstableRows=[];
// [L0444] ประกาศตัวแปร dailyDuplicatesCollapsed แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let dailyDuplicatesCollapsed=0;
// [L0445] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const row of dailyRows||[]){
// [L0446] ประกาศตัวแปร stableKey แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const stableKey=rowStableIdentity(row);
// [L0447] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(stableKey){
// [L0448] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
      if(dailyStableIndex.has(stableKey)){const index=dailyStableIndex.get(stableKey);dailyStableRows[index]=mergeIdentityRows(dailyStableRows[index],row);dailyDuplicatesCollapsed++;}
// [L0449] ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข
      else{dailyStableIndex.set(stableKey,dailyStableRows.length);dailyStableRows.push(row);}
// [L0450] ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข
    }else dailyUnstableRows.push(row);
// [L0451] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0452] ประกาศตัวแปร skippedAlreadyCarried แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let skippedAlreadyCarried=0,added=0,refreshedFromDaily=0;
// [L0453] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const row of dailyStableRows){
// [L0454] ประกาศตัวแปร key แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const key=rowStableIdentity(row);
// [L0455] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(stableIndex.has(key)){const index=stableIndex.get(key);result[index]=mergeIdentityRows(result[index],row,{refreshed:true});skippedAlreadyCarried++;refreshedFromDaily++;}
// [L0456] ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข
    else{stableIndex.set(key,result.length);result.push(row);added++;}
// [L0457] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0458] ประกาศตัวแปร seenDailyUnstable แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const seenDailyUnstable=new Map();
// [L0459] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const row of dailyUnstableRows){
// [L0460] ประกาศตัวแปร fingerprint แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const fingerprint=rowFingerprint(row),occurrence=(seenDailyUnstable.get(fingerprint)||0)+1;seenDailyUnstable.set(fingerprint,occurrence);
// [L0461] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(occurrence<=(unstableCarriedCounts.get(fingerprint)||0)){skippedAlreadyCarried++;continue;}
// [L0462] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    result.push(row);added++;
// [L0463] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0464] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{rows:result,added,skippedAlreadyCarried,refreshedFromDaily,masterDuplicatesCollapsed,dailyDuplicatesCollapsed,masterRowsAfterIdentity,dailyRowsAfterIdentity:dailyStableRows.length+dailyUnstableRows.length};
// [L0465] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0466] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: reconcile แบบยึดชุดรหัส ใช้กับ check/control บางประเภท
// [L0467] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0468] ประกาศฟังก์ชัน reconcileIdRows เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function reconcileIdRows(existingIds,newIds){
// [L0469] ประกาศตัวแปร result แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const result=[...existingIds],existingCounts=new Map(),seenNew=new Map();
// [L0470] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const value of existingIds){const normalized=id(value);if(normalized)existingCounts.set(normalized,(existingCounts.get(normalized)||0)+1);}
// [L0471] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const value of newIds){const normalized=id(value);if(!normalized)continue;const occurrence=(seenNew.get(normalized)||0)+1;seenNew.set(normalized,occurrence);if(occurrence>(existingCounts.get(normalized)||0))result.push(normalized);}
// [L0472] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return result;
// [L0473] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0474] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: หาวันเริ่มต้น/สิ้นสุดของรอบการประมวลผล
// [L0475] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0476] ประกาศฟังก์ชัน resolveDateRange เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function resolveDateRange(masterInfo,daily,today,manualStartDate){
// [L0477] ประกาศตัวแปร manual แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const manual=parseDate(manualStartDate);
// [L0478] ประกาศตัวแปร start แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const start=masterInfo.date?dateOnly(masterInfo.date):(manual?dateOnly(manual):null);
// [L0479] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!start)throw new Error('Master ไม่มี Date ที่อ่านได้ กรุณาระบุวันเริ่มต้นแบบ Manual ก่อน Run');
// [L0480] ประกาศตัวแปร end แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const end=daily.maxDate<dateOnly(today)?dateOnly(daily.maxDate):dateOnly(today);
// [L0481] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(end<start)throw new Error(`ช่วงวันที่ไม่ถูกต้อง: วันเริ่มต้น ${dateKey(start)} มากกว่าวันสิ้นสุด ${dateKey(end)}`);
// [L0482] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{start,end,mode:masterInfo.date?'MASTER_DATE_T':'MANUAL_START_DATE',historical:false};
// [L0483] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0484] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เช็ค field สำคัญที่ขาด เพื่อระบุสถานะไม่สมบูรณ์
// [L0485] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0486] ประกาศฟังก์ชัน missingRequiredFields เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function missingRequiredFields(row){
// [L0487] ประกาศตัวแปร fields แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const fields=['AgencyCode','AgencyName','RequestCode','alienCode','alienNameEn','CertificateNo','Policy','ProposalID','CreateDate','EPropID','Discount'];
// [L0488] สร้างตัวช่วยแบบ arrow function ชื่อ missing เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const missing=fields.filter(field=>!hasValue(row[field]));
// [L0489] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!Number.isFinite(Number(row.TotalPremium)))missing.push('TotalPremium');
// [L0490] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return missing;
// [L0491] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0492] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: จัดประเภท row ค้าง เช่น ไม่สมบูรณ์ Blacklist ติดปัญหา E ไม่ issue
// [L0493] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0494] ประกาศฟังก์ชัน classifyPending เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function classifyPending(rows,issuedIds,smIds,blacklistIds,today){
// [L0495] ประกาศตัวแปร issuedSet แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const issuedSet=new Set(unique(issuedIds)),smSet=new Set(unique(smIds)),blacklistSet=new Set(unique(blacklistIds));
// [L0496] ประกาศตัวแปร pending แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const pending=[],removed=[];
// [L0497] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const sourceRow of rows){
// [L0498] ประกาศตัวแปร row แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const row={...sourceRow};
// [L0499] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(issuedSet.has(row.ProposalID)){removed.push({...row,RemovalReason:'ออกกรมธรรม์แล้ว'});continue;}
// [L0500] ประกาศตัวแปร missing แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const missing=missingRequiredFields(row);
// [L0501] ประกาศตัวแปร carriedForward แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const carriedForward=row.DataSource==='Master Carry Forward';
// [L0502] ประกาศตัวแปร existingIncomplete แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const existingIncomplete=statusKey(row.ExistingIncompleteStatus)==='ข้อมูลไม่สมบูรณ์'||statusKey(row.ExistingPendingStatus)==='ข้อมูลไม่สมบูรณ์';
// [L0503] ประกาศตัวแปร existingBlacklist แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const existingBlacklist=statusKey(row.ExistingBlacklistStatus)==='blacklist'||statusKey(row.ExistingPendingStatus)==='blacklist';
// [L0504] ประกาศตัวแปร existingMenuE แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const existingMenuE=statusKey(row.ExistingMenuEProblem)==='ติดปัญหาไม่เข้าในเมนูe'||statusKey(row.ExistingPendingStatus)==='ติดปัญหาไม่เข้าในเมนูe';
// [L0505] ประกาศตัวแปร incomplete แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const incomplete=smSet.has(row.ProposalID)||existingIncomplete||missing.length>0;
// [L0506] ประกาศตัวแปร blacklist แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const blacklist=blacklistSet.has(row.ProposalID)||existingBlacklist;
// [L0507] ประกาศตัวแปร menuE แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const menuE=existingMenuE&&!incomplete&&!blacklist;
// [L0508] ประกาศตัวแปร rowDate แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const rowDate=dateOnly(row.StoredDate||row.CreateDate);
// [L0509] ประกาศตัวแปร pendingStatus แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    let pendingStatus='รอ Issue';
// [L0510] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(blacklist)pendingStatus='Blacklist';
// [L0511] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    else if(incomplete)pendingStatus='ข้อมูลไม่สมบูรณ์';
// [L0512] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    else if(menuE)pendingStatus='ติดปัญหาไม่เข้าในเมนู E';
// [L0513] ประกาศตัวแปร agingDays แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const agingDays=daysBetween(rowDate,today);
// [L0514] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    pending.push({...row,Date:rowDate,Note:row.CertificateNo.trim().startsWith('-')?'**ตรวจสอบเลขกรมธรรม์**':'',IncompleteStatus:incomplete?'ข้อมูลไม่สมบูรณ์':'',BlacklistStatus:blacklist?'Blacklist':'',MenuEProblem:menuE?'ติดปัญหาไม่เข้าในเมนู E':'',PendingStatus:pendingStatus,AgingDays:agingDays,PendingRange:agingRange(agingDays),MissingFields:missing,WasCarriedForward:carriedForward});
// [L0515] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0516] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{pending,removed,issuedRemoved:removed.length};
// [L0517] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0518] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง key สำหรับ group ข้อมูลใน PV/PV Final
// [L0519] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0520] ประกาศฟังก์ชัน pvGroupKey เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function pvGroupKey(row){
// [L0521] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return[dateKey(row.Date),text(row.Policy),text(row.Mticode),text(row.AgencyName),id(row.ProposalID),text(row.PendingStatus),row.AgingDays===null||row.AgingDays===undefined?'':String(row.AgingDays),text(row.PendingRange)].join('\u241F');
// [L0522] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0523] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: รวม rows ตาม key เพื่อทำ pivot-like summary
// [L0524] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0525] ประกาศฟังก์ชัน aggregatePvRows เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function aggregatePvRows(rows){
// [L0526] ประกาศตัวแปร groups แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const groups=new Map();
// [L0527] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const row of rows||[]){
// [L0528] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!row||!id(row.ProposalID)||!text(row.PendingStatus))continue;
// [L0529] ประกาศตัวแปร key แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const key=pvGroupKey(row);
// [L0530] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!groups.has(key))groups.set(key,{Date:dateOnly(row.Date),Policy:text(row.Policy),Mticode:text(row.Mticode),AgencyName:text(row.AgencyName),ProposalID:id(row.ProposalID),PendingStatus:text(row.PendingStatus),AgingDays:row.AgingDays===null||row.AgingDays===undefined?null:Number(row.AgingDays),PendingRange:text(row.PendingRange),TotalPremium:0,SourceRows:0});
// [L0531] ประกาศตัวแปร group แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const group=groups.get(key);
// [L0532] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    group.TotalPremium+=number(row.TotalPremium);
// [L0533] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    group.SourceRows++;
// [L0534] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0535] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return[...groups.values()];
// [L0536] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0537] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง summary/KPI ทั้งหมดจาก context หลัง reconcile/classify
// [L0538] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0539] ประกาศฟังก์ชัน summarize เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function summarize(context){
// [L0540] ประกาศตัวแปร pending แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const pending=context.pending,pv=aggregatePvRows(pending);
// [L0541] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{
// [L0542] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    Version:CONFIG.version,
// [L0543] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    ProcessedAt:dateTimeText(context.processedAt),
// [L0544] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    RunDate:dateKey(context.processedAt),
// [L0545] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    RunId:context.runId,
// [L0546] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    DateStart:dateKey(context.dateRange.start),
// [L0547] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    DateEnd:dateKey(context.dateRange.end),
// [L0548] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    DateMode:context.dateRange.mode,
// [L0549] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    ReportEarliestDate:dateKey(context.daily.minDate),
// [L0550] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    ReportLatestDate:dateKey(context.daily.maxDate),
// [L0551] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    ReportWorksheetRows:context.daily.worksheetRows,
// [L0552] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    ReportValidDateRows:context.daily.validDateRows,
// [L0553] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    DailyRowsAfterDateStatusFilter:context.dailyFiltered.length,
// [L0554] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    ReportRowsAfterDateStatusFilter:context.dailyFiltered.length,
// [L0555] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    DailyBlankStatusAccepted:context.dailyFilterStats.blankStatusRows,
// [L0556] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    DailyRowsAddedToBacklog:context.reconciled.added,
// [L0557] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    DailyRowsSkippedAlreadyCarried:context.reconciled.skippedAlreadyCarried,
// [L0558] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    DailyRowsRefreshedFromCurrent:context.reconciled.refreshedFromDaily,
// [L0559] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    DailyDuplicateRowsCollapsed:context.reconciled.dailyDuplicatesCollapsed,
// [L0560] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    DailyRowsAfterStableIdentity:context.reconciled.dailyRowsAfterIdentity,
// [L0561] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    MasterRowsCarriedForward:context.masterRows.length,
// [L0562] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    MasterDuplicateRowsCollapsed:context.reconciled.masterDuplicatesCollapsed,
// [L0563] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    MasterRowsAfterStableIdentity:context.reconciled.masterRowsAfterIdentity,
// [L0564] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    StableIdentityRule:'CertificateNo; fallback alienCode + ProposalID',
// [L0565] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    M190RawRows:context.m190Ids.length,
// [L0566] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    M190PropIdRows:context.m190Ids.length,
// [L0567] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    M190UniquePropIds:unique(context.m190Ids).length,
// [L0568] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    IssueOldCheckRowsIgnored:context.issueOldCheckRows,
// [L0569] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    IssueCheckRowsLoaded:context.checkIds.length,
// [L0570] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    IssueOldEtlRowsIgnored:context.issueOldEtlRows,
// [L0571] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    IssueEtlRowsLoaded:context.etl.records.length,
// [L0572] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    AutoMailRawRows:context.etl.records.length,
// [L0573] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    EtlTextRowsLoaded:context.etl.records.length,
// [L0574] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    EtlPropIdRows:context.etl.records.length,
// [L0575] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
    AutoMailUniquePropIds:unique(context.etl.records.map(record=>record.PropId)).length,
// [L0576] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    AutoMailDuplicateRows:context.etl.duplicates,
// [L0577] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    CurrentIssuedUniquePropIds:context.issuedIds.length,
// [L0578] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    IssuedRowsRemoved:context.issuedRemoved,
// [L0579] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    SmRowsWritten:context.smIds.length,
// [L0580] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    SmUniquePropIds:unique(context.smIds).length,
// [L0581] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    BlacklistRowsWritten:context.blIds.length,
// [L0582] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    BlacklistUniquePropIds:unique(context.blIds).length,
// [L0583] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    PendingRowsWrittenToData:pending.length,
// [L0584] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    TotalRows:pending.length,
// [L0585] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    TotalPolicies:pv.length,
// [L0586] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    TotalPremium:sum(pending,'TotalPremium'),
// [L0587] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
    PendingPolicies:pv.filter(row=>row.PendingStatus==='รอ Issue').length,
// [L0588] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
    IncompletePolicies:pv.filter(row=>row.PendingStatus==='ข้อมูลไม่สมบูรณ์').length,
// [L0589] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
    MenuEPolicies:pv.filter(row=>row.PendingStatus==='ติดปัญหาไม่เข้าในเมนู E').length,
// [L0590] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
    BlacklistPolicies:pv.filter(row=>row.PendingStatus==='Blacklist').length,
// [L0591] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
    Age_1_7:pv.filter(row=>row.AgingDays!==null&&row.AgingDays<=7).length,
// [L0592] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
    Age_8_15:pv.filter(row=>row.AgingDays>7&&row.AgingDays<=15).length,
// [L0593] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
    Age_16_30:pv.filter(row=>row.AgingDays>15&&row.AgingDays<=30).length,
// [L0594] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
    Age_Over_30:pv.filter(row=>row.AgingDays>30).length,
// [L0595] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    ValidationStatus:'PASSED',
// [L0596] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    PremiumReconciled:'YES',
// [L0597] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    Engine:'Browser JavaScript + xlsx-js-style',
// [L0598] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    PowerShell:'NOT USED',
// [L0599] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    ExcelCOM:'NOT USED',
// [L0600] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    MasterOutput:`${CONFIG.masterBaseName}_${dateKey(context.processedAt)}.xlsx`,
// [L0601] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    IssueOutput:`${CONFIG.issueBaseName}_${dateKey(context.processedAt)}.xlsx`
// [L0602] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  };
// [L0603] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0604] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0605] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง style border ของ cell ใน Excel
// [L0606] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0607] ประกาศฟังก์ชัน border เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function border(){return{top:{style:'thin',color:{rgb:COLORS.grid}},bottom:{style:'thin',color:{rgb:COLORS.grid}},left:{style:'thin',color:{rgb:COLORS.grid}},right:{style:'thin',color:{rgb:COLORS.grid}}};}
// [L0608] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง style พื้นฐานของ cell
// [L0609] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0610] ประกาศฟังก์ชัน baseStyle เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function baseStyle(extra={}){return{font:{name:'Tahoma',sz:11,color:{rgb:COLORS.black},...(extra.font||{})},fill:extra.fill||{patternType:'solid',fgColor:{rgb:COLORS.white}},border:extra.border===false?undefined:border(),alignment:{horizontal:'center',vertical:'center',wrapText:false,...(extra.alignment||{})},numFmt:extra.numFmt};}
// [L0611] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง style หัวตาราง Excel
// [L0612] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0613] ประกาศฟังก์ชัน headerStyle เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function headerStyle(color,sz=11){return baseStyle({font:{bold:true,color:{rgb:COLORS.white},sz},fill:{patternType:'solid',fgColor:{rgb:color}},alignment:{horizontal:'center',vertical:'center',wrapText:true}});}
// [L0614] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ใส่ style ให้ cell ถ้ามีอยู่
// [L0615] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0616] ประกาศฟังก์ชัน setCellStyle เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function setCellStyle(worksheet,row,column,style){const address=global.XLSX.utils.encode_cell({r:row,c:column});if(!worksheet[address])worksheet[address]={t:'s',v:''};worksheet[address].s=style;if(style?.numFmt)worksheet[address].z=style.numFmt;}
// [L0617] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง cell สูตรพร้อม style และ cached value
// [L0618] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0619] ประกาศฟังก์ชัน setFormulaCell เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function setFormulaCell(worksheet,row,column,formula,value,type='s'){const address=global.XLSX.utils.encode_cell({r:row,c:column});worksheet[address]={t:type,f:formula,v:value};}
// [L0620] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง cell value พร้อม style/type
// [L0621] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0622] ประกาศฟังก์ชัน setValueCell เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function setValueCell(worksheet,row,column,value,type='s'){const address=global.XLSX.utils.encode_cell({r:row,c:column});worksheet[address]={t:type,v:value};}
// [L0623] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ไล่ใส่ style ให้ range ตารางใน worksheet
// [L0624] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0625] ประกาศฟังก์ชัน applyGridStyles เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function applyGridStyles(worksheet,aoa,options={}){
// [L0626] ประกาศตัวแปร headerRows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const headerRows=new Set(options.headerRows||[0]),purpleCols=new Set(options.purpleCols||[]),dateCols=new Set(options.dateCols||[]),moneyCols=new Set(options.moneyCols||[]),textCols=new Set(options.textCols||[]),idCols=new Set(options.idCols||[]);
// [L0627] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(let row=0;row<aoa.length;row++)for(let column=0;column<(aoa[row]||[]).length;column++){
// [L0628] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(headerRows.has(row)){setCellStyle(worksheet,row,column,headerStyle(purpleCols.has(column)?COLORS.purple:COLORS.blue));continue;}
// [L0629] ประกาศตัวแปร numFmt แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const numFmt=dateCols.has(column)?(options.dateFormat||'dd/mm/yyyy hh:mm:ss'):moneyCols.has(column)?(options.moneyFormat||'#,##0.00'):idCols.has(column)?'@':undefined;
// [L0630] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    setCellStyle(worksheet,row,column,baseStyle({alignment:{horizontal:textCols.has(column)?'left':'center',vertical:'center',wrapText:textCols.has(column)},numFmt}));
// [L0631] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0632] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
  worksheet['!rows']=aoa.map((_,index)=>({hpt:headerRows.has(index)?24:20}));
// [L0633] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0634] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เพิ่ม worksheet เข้า workbook พร้อมตั้งชื่อ
// [L0635] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0636] ประกาศฟังก์ชัน addSheet เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function addSheet(workbook,name,aoa,widths,options={}){
// [L0637] ประกาศตัวแปร dateCols แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const dateCols=new Set(options.dateCols||[]);
// [L0638] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
  // อธิบาย: ฟังก์ชัน outputAoa เป็นส่วนหนึ่งของ flow ใน engine.js ใช้จัดการขั้นตอนย่อยตามชื่อฟังก์ชันนี้
// [L0639] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
  // ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้
// [L0640] สร้างตัวช่วยแบบ arrow function ชื่อ outputAoa เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const outputAoa=(aoa||[]).map(row=>(row||[]).map((value,column)=>{
// [L0641] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!dateCols.has(column))return value;
// [L0642] ประกาศตัวแปร serial แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const serial=excelSerial(value);
// [L0643] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
    return serial===null?value:serial;
// [L0644] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }));
// [L0645] ประกาศตัวแปร worksheet แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const worksheet=global.XLSX.utils.aoa_to_sheet(outputAoa,{cellDates:false});
// [L0646] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  applyGridStyles(worksheet,outputAoa,options);
// [L0647] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
  worksheet['!cols']=(widths||Array((outputAoa[0]||[]).length).fill(15)).map(width=>({wch:width}));
// [L0648] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(options.autoFilter&&outputAoa.length)worksheet['!autofilter']={ref:`A1:${global.XLSX.utils.encode_col((outputAoa[0]||[]).length-1)}${outputAoa.length}`};
// [L0649] เรียกใช้ library XLSX/xlsx-js-style เพื่ออ่าน เขียน หรือจัดรูปแบบไฟล์ Excel
  global.XLSX.utils.book_append_sheet(workbook,worksheet,name);
// [L0650] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return worksheet;
// [L0651] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0652] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้างสูตร P:W/คอลัมน์คำนวณของ Data sheet ต่อ row
// [L0653] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0654] ประกาศฟังก์ชัน dataRowFormulas เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function dataRowFormulas(excelRow,run){
// [L0655] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{
// [L0656] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    p:`IF(LEFT(H${excelRow},1)="-","**ตรวจสอบเลขกรมธรรม์**","")`,
// [L0657] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    q:`IF(K${excelRow}="","",IF(OR(A${excelRow}="",C${excelRow}="",D${excelRow}="",F${excelRow}="",G${excelRow}="",H${excelRow}="",I${excelRow}="",J${excelRow}="",L${excelRow}="",N${excelRow}="",O${excelRow}=""),"ข้อมูลไม่สมบูรณ์",IFERROR(INDEX('ข้อมูลไม่สมบูรณ์'!$A:$A,MATCH(K${excelRow},'ข้อมูลไม่สมบูรณ์'!$B:$B,0)),"")))`,
// [L0658] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    r:`IF(K${excelRow}="","",IFERROR(INDEX('Black List'!$A:$A,MATCH(K${excelRow},'Black List'!$B:$B,0)),""))`,
// [L0659] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    t:`IF(L${excelRow}="","",INT(L${excelRow}))`,
// [L0660] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    u:`IF(K${excelRow}="","",IF(R${excelRow}="Blacklist","Blacklist",IF(Q${excelRow}="ข้อมูลไม่สมบูรณ์","ข้อมูลไม่สมบูรณ์",IF(S${excelRow}="ติดปัญหาไม่เข้าในเมนู E","ติดปัญหาไม่เข้าในเมนู E","รอ Issue"))))`,
// [L0661] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    v:`IF(T${excelRow}="","",MAX(0,DATE(${run.getFullYear()},${run.getMonth()+1},${run.getDate()})-T${excelRow}))`,
// [L0662] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    w:`IF(V${excelRow}="","",IF(V${excelRow}<=7,"1 - 7 วัน",IF(V${excelRow}<=15,"8 - 15 วัน",IF(V${excelRow}<=30,"16 - 30 วัน","มากกว่า 30 วัน"))))`
// [L0663] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  };
// [L0664] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0665] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง sheet Data ของ Master ใหม่จาก rows ที่ผ่านการคัดแล้ว
// [L0666] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0667] ประกาศฟังก์ชัน buildDataSheet เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function buildDataSheet(workbook,context){
// [L0668] สร้างตัวช่วยแบบ arrow function ชื่อ dataRows เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const dataRows=context.pending.map(row=>[row.AgencyCode,row.Mticode,row.AgencyName,row.RequestCode,row.employeeName,row.alienCode,row.alienNameEn,row.CertificateNo,row.Policy,row.TotalPremium,row.ProposalID,row.CreateDate,row.Status,row.EPropID,row.Discount,row.Note,row.IncompleteStatus,row.BlacklistStatus,row.MenuEProblem,row.Date,row.PendingStatus,row.AgingDays,row.PendingRange]);
// [L0669] ประกาศตัวแปร aoa แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const aoa=[MASTER_OUTPUT_HEADERS,...dataRows];
// [L0670] ประกาศตัวแปร worksheet แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const worksheet=addSheet(workbook,'Data',aoa,[14,13,38,18,38,21,30,18,16,18,16,21,28,20,16,22,28,22,34,13,30,30,30],{purpleCols:[15,16,17,18,19,20,21,22],dateCols:[11,19],moneyCols:[9],idCols:[3,5,10,13],textCols:[2,4,6,12,15,16,17,18,20,22],autoFilter:true});
// [L0671] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  worksheet['!freeze']={xSplit:0,ySplit:1};
// [L0672] ประกาศตัวแปร run แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const run=context.processedAt;
// [L0673] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(let index=0;index<context.pending.length;index++){
// [L0674] ประกาศตัวแปร excelRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const excelRow=index+2,row=context.pending[index],rowIndex=index+1;
// [L0675] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    const {p,q,r,t,u,v,w}=dataRowFormulas(excelRow,run);
// [L0676] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    setFormulaCell(worksheet,rowIndex,15,p,row.Note,'s');
// [L0677] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    setFormulaCell(worksheet,rowIndex,16,q,row.IncompleteStatus,'s');
// [L0678] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    setFormulaCell(worksheet,rowIndex,17,r,row.BlacklistStatus,'s');
// [L0679] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    setValueCell(worksheet,rowIndex,18,row.MenuEProblem,'s');
// [L0680] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    setFormulaCell(worksheet,rowIndex,19,t,row.Date?excelSerial(row.Date):'',row.Date?'n':'s');
// [L0681] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    setFormulaCell(worksheet,rowIndex,20,u,row.PendingStatus,'s');
// [L0682] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    setFormulaCell(worksheet,rowIndex,21,v,row.AgingDays===null?'':row.AgingDays,row.AgingDays===null?'s':'n');
// [L0683] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    setFormulaCell(worksheet,rowIndex,22,w,row.PendingRange,'s');
// [L0684] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
    for(let column=15;column<=22;column++)setCellStyle(worksheet,rowIndex,column,baseStyle({alignment:{horizontal:column===15||column===16||column===17||column===18||column===20||column===22?'left':'center',wrapText:true},numFmt:column===19?'dd/mm/yyyy':column===21?'0':undefined}));
// [L0685] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0686] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  worksheet['!ref']=`A1:W${Math.max(1,aoa.length)}`;
// [L0687] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return worksheet;
// [L0688] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0689] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง sheet Check/SM/Blacklist/ETL หรือ control sheets ที่ต้องแนบใน workbook
// [L0690] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0691] ประกาศฟังก์ชัน buildControlSheets เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function buildControlSheets(workbook,context){
// [L0692] สร้างตัวช่วยแบบ arrow function ชื่อ sm เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const sm=[['สถานะ','Prop ID'],...context.smIds.map(value=>['ข้อมูลไม่สมบูรณ์',value])];
// [L0693] ประกาศตัวแปร smSheet แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const smSheet=addSheet(workbook,'ข้อมูลไม่สมบูรณ์',sm,[22,22],{idCols:[1],autoFilter:true});
// [L0694] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(let column=0;column<2;column++)setCellStyle(smSheet,0,column,headerStyle(COLORS.green));
// [L0695] สร้างตัวช่วยแบบ arrow function ชื่อ blacklist เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const blacklist=[['สถานะ','Prop ID'],...context.blIds.map(value=>['Blacklist',value])];
// [L0696] ประกาศตัวแปร blacklistSheet แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const blacklistSheet=addSheet(workbook,'Black List',blacklist,[18,22],{idCols:[1],autoFilter:true});
// [L0697] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(let column=0;column<2;column++)setCellStyle(blacklistSheet,0,column,headerStyle(COLORS.red));
// [L0698] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0699] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ปรับ label สำหรับ pivot ให้ค่าว่างเป็น (blank)
// [L0700] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0701] ประกาศฟังก์ชัน pivotLabel เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function pivotLabel(value){return hasValue(value)?value:'(blank)';}
// [L0702] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เตรียม rows สำหรับ PV/PV Final
// [L0703] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0704] ประกาศฟังก์ชัน pvRows เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function pvRows(context){return aggregatePvRows(context.pending).map(row=>[row.Date,pivotLabel(row.Policy),pivotLabel(row.Mticode),pivotLabel(row.AgencyName),pivotLabel(row.ProposalID),pivotLabel(row.PendingStatus),row.AgingDays===null||row.AgingDays===undefined?'(blank)':row.AgingDays,pivotLabel(row.PendingRange),row.TotalPremium]);}
// [L0705] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง PV และ PV Final แบบ workbook ปกติ
// [L0706] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0707] ประกาศฟังก์ชัน buildPvSheets เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function buildPvSheets(workbook,context){
// [L0708] ประกาศตัวแปร headers แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const headers=['Date','Policy','Mticode','AgencyName','ProposalID','สถานะไม่ issue','จำนวนวันที่ยังไม่ออกกรมธรรม์','ระยะเวลายังไม่ออกกรมธรรม์','Sum of TotalPremium'];
// [L0709] ประกาศตัวแปร rows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const rows=pvRows(context);
// [L0710] สร้างตัวช่วยแบบ arrow function ชื่อ displayedRows เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const displayedRows=rows.map(row=>[row[0]?excelSerial(row[0]):'',...row.slice(1)]);
// [L0711] ประกาศตัวแปร pv แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const pv=[['','','','','','','','',''],['Status','(All)','','','','','','',''],['','','','','','','','',''],headers,...displayedRows];
// [L0712] ประกาศตัวแปร pvSheet แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const pvSheet=global.XLSX.utils.aoa_to_sheet(pv,{cellDates:false});
// [L0713] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  pvSheet['!cols']=[{wch:18},{wch:13},{wch:12},{wch:56},{wch:17},{wch:28},{wch:30},{wch:28},{wch:22}];
// [L0714] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(let row=0;row<pv.length;row++)for(let column=0;column<9;column++){
// [L0715] ประกาศตัวแปร style แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    let style=baseStyle({numFmt:column===0?'dd/mm/yyyy':column===8?'#,##0':undefined,alignment:{horizontal:column===3?'left':'center',wrapText:column===3}});
// [L0716] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(row===1&&column===0)style=headerStyle(COLORS.blue);if(row===3)style=headerStyle(COLORS.blue);
// [L0717] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    setCellStyle(pvSheet,row,column,style);
// [L0718] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0719] เรียกใช้ library XLSX/xlsx-js-style เพื่ออ่าน เขียน หรือจัดรูปแบบไฟล์ Excel
  global.XLSX.utils.book_append_sheet(workbook,pvSheet,'PV');
// [L0720] ประกาศตัวแปร finalRows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const finalRows=[headers,...rows];
// [L0721] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return addSheet(workbook,'PV Final',finalRows,[18,13,12,56,17,28,30,28,22],{dateCols:[0],dateFormat:'dd/mm/yyyy',moneyCols:[8],moneyFormat:'#,##0',idCols:[4],textCols:[3,5,7],autoFilter:true});
// [L0722] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0723] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: group rows ตามช่วง aging
// [L0724] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0725] ประกาศฟังก์ชัน groupByAging เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function groupByAging(rows){
// [L0726] ประกาศตัวแปร pv แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const pv=aggregatePvRows(rows),order=['1 - 7 วัน','8 - 15 วัน','16 - 30 วัน','มากกว่า 30 วัน'];
// [L0727] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return order.map((label,index)=>{const subset=pv.filter(row=>row.PendingRange===label);return[index+1,label,subset.length,sum(subset,'TotalPremium')];}).filter(row=>row[2]>0);
// [L0728] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0729] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: group rows ตามสถานะ เพื่อใช้ report
// [L0730] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0731] ประกาศฟังก์ชัน groupStatusRows เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function groupStatusRows(rows,status){
// [L0732] ประกาศตัวแปร groups แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const groups=new Map();
// [L0733] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const row of aggregatePvRows(rows).filter(item=>item.PendingStatus===status)){
// [L0734] ประกาศตัวแปร key แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const key=dateKey(row.Date);
// [L0735] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!groups.has(key))groups.set(key,{date:row.Date,aging:row.AgingDays,rows:[]});
// [L0736] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    groups.get(key).rows.push(row);
// [L0737] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0738] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return[...groups.values()].sort((left,right)=>(left.date||0)-(right.date||0)).map(group=>[group.date,group.aging,group.rows.length,sum(group.rows,'TotalPremium')]);
// [L0739] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0740] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง Report sheet แบบ native worksheet
// [L0741] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0742] ประกาศฟังก์ชัน buildReportSheet เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function buildReportSheet(workbook,context,summary){
// [L0743] ประกาศตัวแปร reportRows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const reportRows=aggregatePvRows(context.pending),aoa=[],merges=[],styles=[];
// [L0744] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
  // อธิบาย: ฟังก์ชัน add เป็นส่วนหนึ่งของ flow ใน engine.js ใช้จัดการขั้นตอนย่อยตามชื่อฟังก์ชันนี้
// [L0745] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
  // ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้
// [L0746] ประกาศตัวแปร add แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const add=(row,style=null)=>{aoa.push(row);styles.push(style);};
// [L0747] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
  // อธิบาย: ฟังก์ชัน title เป็นส่วนหนึ่งของ flow ใน engine.js ใช้จัดการขั้นตอนย่อยตามชื่อฟังก์ชันนี้
// [L0748] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
  // ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้
// [L0749] สร้างตัวช่วยแบบ arrow function ชื่อ title เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const title=(label,color)=>{const row=aoa.length;add([label,'','',''],{type:'title',color});merges.push({s:{r:row,c:0},e:{r:row,c:3}});};
// [L0750] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  title('สถานะไม่ ISSUE.',COLORS.reportBlue);
// [L0751] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  add(['ยอดเงินที่ยังไม่ Issue','',summary.TotalPremium,'บาท'],{type:'kpiMoney'});
// [L0752] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  add(['จำนวนกรมธรรม์','',summary.TotalPolicies,'กรมธรรม์'],{type:'kpiCount'});
// [L0753] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  add([]);
// [L0754] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  title('จำนวนวันที่ยังไม่ออกกรมธรรม์',COLORS.green);
// [L0755] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  add(['No.','ระยะเวลายังไม่ออกกรมธรรม์','Count of Policy','TotalPremium'],{type:'header',color:COLORS.green});
// [L0756] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const row of groupByAging(reportRows))add(row,{type:'agingBody'});
// [L0757] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  add(['Grand Total','',summary.TotalPolicies,summary.TotalPremium],{type:'grand',color:COLORS.green});
// [L0758] ประกาศตัวแปร sections แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const sections=[['รอ Issue','รายการที่รอ ISSUE.',COLORS.reportBlue],['ติดปัญหาไม่เข้าในเมนู E','รายการติดปัญหาไม่เอาเข้าเมนู E',COLORS.orange],['ข้อมูลไม่สมบูรณ์','รายการข้อมูลไม่สมบูรณ์',COLORS.darkPurple],['Blacklist','สถานะ Blacklist.',COLORS.red]];
// [L0759] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const [status,label,color] of sections){
// [L0760] ประกาศตัวแปร grouped แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const grouped=groupStatusRows(reportRows,status);
// [L0761] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!grouped.length)continue;
// [L0762] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    add([]);title(label,color);add(['Date','จำนวนวันที่ยังไม่ออกกรมธรรม์','Count of Policy','ผลรวม'],{type:'header',color});
// [L0763] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
    for(const row of grouped)add([excelSerial(row[0]),row[1],row[2],row[3]],{type:'statusBody'});
// [L0764] สร้างตัวช่วยแบบ arrow function ชื่อ subset เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
    const subset=reportRows.filter(item=>item.PendingStatus===status);
// [L0765] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    add(['Grand Total','',subset.length,sum(subset,'TotalPremium')],{type:'grand',color});
// [L0766] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0767] ประกาศตัวแปร worksheet แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const worksheet=global.XLSX.utils.aoa_to_sheet(aoa,{cellDates:false});
// [L0768] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
  worksheet['!cols']=[{wch:23},{wch:34},{wch:17},{wch:18}];worksheet['!merges']=merges;worksheet['!rows']=aoa.map((_,index)=>({hpt:styles[index]?.type==='title'?30:20}));
// [L0769] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(let row=0;row<aoa.length;row++)for(let column=0;column<4;column++){
// [L0770] ประกาศตัวแปร meta แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const meta=styles[row]||{};let style=baseStyle({border:meta.type?undefined:false});
// [L0771] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(meta.type==='title')style=headerStyle(meta.color,20);else if(meta.type==='header')style=headerStyle(meta.color,12);else if(meta.type==='grand'){style=headerStyle(meta.color,10);style.numFmt=column===2?'0':column===3?'#,##0':undefined;}else if(meta.type==='kpiMoney')style=baseStyle({font:{sz:column===0?14:11},numFmt:column===2?'#,##0':undefined});else if(meta.type==='kpiCount')style=baseStyle({font:{sz:column===0?14:11},numFmt:column===2?'0':undefined});else if(meta.type==='agingBody')style=baseStyle({numFmt:column===0||column===2?'0':column===3?'#,##0':undefined});else if(meta.type==='statusBody')style=baseStyle({numFmt:column===0?'dd/mm/yyyy':column===1||column===2?'0':column===3?'#,##0':undefined});
// [L0772] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    setCellStyle(worksheet,row,column,style);
// [L0773] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0774] เรียกใช้ library XLSX/xlsx-js-style เพื่ออ่าน เขียน หรือจัดรูปแบบไฟล์ Excel
  global.XLSX.utils.book_append_sheet(workbook,worksheet,'Report');
// [L0775] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return worksheet;
// [L0776] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0777] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง _Audit sheet เก็บ version/summary/removed rows
// [L0778] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0779] ประกาศฟังก์ชัน buildAuditSheet เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function buildAuditSheet(workbook,summary,removedRows=[]){
// [L0780] สร้างตัวช่วยแบบ arrow function ชื่อ aoa เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const aoa=[['Key','Value'],...Object.entries(summary),[],['REMOVED ISSUED ROWS',''],['ProposalID','Source'],...removedRows.map(row=>[row.ProposalID,row.DataSource||''])];
// [L0781] ประกาศตัวแปร worksheet แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const worksheet=global.XLSX.utils.aoa_to_sheet(aoa);
// [L0782] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  worksheet['!cols']=[{wch:42},{wch:68}];
// [L0783] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(let row=0;row<aoa.length;row++)for(let column=0;column<2;column++)setCellStyle(worksheet,row,column,row===0||aoa[row]?.[0]==='ProposalID'?headerStyle(COLORS.blue):baseStyle({alignment:{horizontal:'left'}}));
// [L0784] เรียกใช้ library XLSX/xlsx-js-style เพื่ออ่าน เขียน หรือจัดรูปแบบไฟล์ Excel
  global.XLSX.utils.book_append_sheet(workbook,worksheet,'_Audit');
// [L0785] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0786] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ตั้ง metadata ของ workbook เช่น Title/Subject/Created
// [L0787] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0788] ประกาศฟังก์ชัน setWorkbookProperties เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function setWorkbookProperties(workbook,title,processedAt){
// [L0789] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  workbook.Props={Title:title,Subject:`BLACKWOLF ${CONFIG.version}`,Author:'BLACKWOLF Browser Engine',CreatedDate:processedAt,ModifiedDate:processedAt};
// [L0790] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  workbook.Workbook=workbook.Workbook||{};
// [L0791] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  workbook.CalcPr={calcMode:'auto',fullCalcOnLoad:true,forceFullCalc:true};
// [L0792] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0793] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง Master workbook แบบไม่ใช้ template pivot preserving
// [L0794] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0795] ประกาศฟังก์ชัน buildMasterWorkbook เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function buildMasterWorkbook(context,summary){
// [L0796] ประกาศตัวแปร workbook แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const workbook=global.XLSX.utils.book_new();
// [L0797] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  buildDataSheet(workbook,context);buildControlSheets(workbook,context);buildPvSheets(workbook,context);buildReportSheet(workbook,context,summary);buildAuditSheet(workbook,summary,context.removedRows);
// [L0798] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  setWorkbookProperties(workbook,'เช็คกรมธรรม์ต่างด้าวที่ยังไม่ออก - BLACKWOLF Web Master',context.processedAt);
// [L0799] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  workbook.Workbook.Views=[{activeTab:5}];
// [L0800] กำหนด handler/ฟังก์ชันให้ workbook.Workbook.Sheets เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง
  workbook.Workbook.Sheets=workbook.SheetNames.map(name=>({name,Hidden:name==='_Audit'?1:0}));
// [L0801] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return workbook;
// [L0802] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0803] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง ISSUE workbook พร้อม Data/Check/ETL
// [L0804] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0805] ประกาศฟังก์ชัน buildIssueWorkbook เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function buildIssueWorkbook(context,summary){
// [L0806] ประกาศตัวแปร workbook แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const workbook=global.XLSX.utils.book_new(),issuedSet=new Set(context.issuedIds);
// [L0807] สร้างตัวช่วยแบบ arrow function ชื่อ issueRows เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const issueRows=context.dailyFiltered.map(row=>[row.AgencyCode,row.Mticode,row.AgencyName,row.RequestCode,row.employeeName,row.alienCode,row.alienNameEn,row.CertificateNo,row.Policy,row.TotalPremium,row.ProposalID,row.CreateDate,row.Status,row.EPropID,row.Discount,issuedSet.has(row.ProposalID)?'ออกกรมธรรม์':'#N/A']);
// [L0808] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  addSheet(workbook,'Data',[ISSUE_HEADERS,...issueRows],[14,13,38,18,38,21,30,18,16,18,16,21,28,20,16,18],{dateCols:[11],moneyCols:[9],idCols:[3,5,10,13],textCols:[2,4,6,12,15],autoFilter:true});
// [L0809] สร้างตัวช่วยแบบ arrow function ชื่อ checkRows เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const checkRows=[['Check P-ID','ออกกรมธรรม์'],...context.checkIds.map(value=>[value,'ออกกรมธรรม์'])];
// [L0810] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  addSheet(workbook,'Check',checkRows,[22,20],{idCols:[0],autoFilter:true});
// [L0811] สร้างตัวช่วยแบบ arrow function ชื่อ etlRows เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const etlRows=[['No','Prop - ID','Policy','Group'],...context.etl.records.map((record,index)=>[record.No||index+1,record.PropId,record.Policy,record.Group])];
// [L0812] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  addSheet(workbook,'ETL',etlRows,[10,22,18,18],{idCols:[1],autoFilter:true});
// [L0813] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  buildAuditSheet(workbook,{Version:CONFIG.version,RunId:summary.RunId,ProcessedAt:summary.ProcessedAt,OldCheckRowsIgnored:context.issueOldCheckRows,OldEtlRowsIgnored:context.issueOldEtlRows,CurrentM190Rows:context.m190Ids.length,CurrentAutoMailRows:context.etl.records.length,CurrentCheckRows:context.checkIds.length,CurrentDataRows:context.dailyFiltered.length},[]);
// [L0814] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  setWorkbookProperties(workbook,'เช็คสถานะ ISSUE - BLACKWOLF Web Working File',context.processedAt);
// [L0815] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  workbook.Workbook.Views=[{activeTab:0}];
// [L0816] กำหนด handler/ฟังก์ชันให้ workbook.Workbook.Sheets เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง
  workbook.Workbook.Sheets=workbook.SheetNames.map(name=>({name,Hidden:name==='_Audit'?1:0}));
// [L0817] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return workbook;
// [L0818] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0819] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เขียน workbook object เป็น Blob .xlsx
// [L0820] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0821] ประกาศฟังก์ชัน workbookBlob เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function workbookBlob(workbook){const bytes=global.XLSX.write(workbook,{bookType:'xlsx',type:'array',compression:true,cellDates:false,cellStyles:true});return new Blob([bytes],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});}
// [L0822] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: escape XML special characters ก่อน patch ไฟล์ .xlsx ภายใน ZIP
// [L0823] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0824] ประกาศฟังก์ชัน xmlEscape เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function xmlEscape(value){return String(value===null||value===undefined?'':value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');}
// [L0825] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: escape string เพื่อใส่ใน RegExp อย่างปลอดภัย
// [L0826] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0827] ประกาศฟังก์ชัน regexEscape เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function regexEscape(value){return String(value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
// [L0828] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แปลง index column เป็นชื่อ Excel column เช่น 0=A, 27=AB
// [L0829] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0830] ประกาศฟังก์ชัน columnName เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function columnName(index){let value=index+1,name='';while(value){const remainder=(value-1)%26;name=String.fromCharCode(65+remainder)+name;value=Math.floor((value-1)/26);}return name;}
// [L0831] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อ่าน style id ของ cell จาก worksheet XML
// [L0832] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0833] ประกาศฟังก์ชัน xmlCellStyle เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function xmlCellStyle(sheetXml,reference,fallback='0'){
// [L0834] ประกาศตัวแปร match แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const match=sheetXml.match(new RegExp(`<c\\b(?=[^>]*\\br="${regexEscape(reference)}")[^>]*>`));
// [L0835] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!match)return fallback;
// [L0836] ประกาศตัวแปร style แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const style=match[0].match(/\bs="(\d+)"/);
// [L0837] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return style?style[1]:fallback;
// [L0838] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0839] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง XML cell แบบ inline string
// [L0840] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0841] ประกาศฟังก์ชัน xmlTextCell เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function xmlTextCell(reference,value,style){
// [L0842] ประกาศตัวแปร source แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const source=String(value===null||value===undefined?'':value),space=/^\s|\s$|[\r\n]/.test(source)?' xml:space="preserve"':'';
// [L0843] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return`<c r="${reference}"${style!==undefined&&style!==null?` s="${style}"`:''} t="inlineStr"><is><t${space}>${xmlEscape(source)}</t></is></c>`;
// [L0844] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0845] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง XML cell แบบ number
// [L0846] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0847] ประกาศฟังก์ชัน xmlNumberCell เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function xmlNumberCell(reference,value,style){
// [L0848] ประกาศตัวแปร numeric แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const numeric=Number(value);
// [L0849] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return`<c r="${reference}"${style!==undefined&&style!==null?` s="${style}"`:''}><v>${Number.isFinite(numeric)?numeric:0}</v></c>`;
// [L0850] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0851] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง XML cell แบบ formula พร้อม cached value
// [L0852] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0853] ประกาศฟังก์ชัน xmlFormulaCell เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function xmlFormulaCell(reference,formula,cachedValue,style,valueType='s'){
// [L0854] ประกาศตัวแปร stringType แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const stringType=valueType==='s',value=stringType?String(cachedValue===null||cachedValue===undefined?'':cachedValue):Number(cachedValue);
// [L0855] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return`<c r="${reference}"${style!==undefined&&style!==null?` s="${style}"`:''}${stringType?' t="str"':''}><f>${xmlEscape(formula)}</f><v>${xmlEscape(stringType?value:(Number.isFinite(value)?value:0))}</v></c>`;
// [L0856] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0857] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แทนที่ sheetData/dimension/autoFilter ใน worksheet XML
// [L0858] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0859] ประกาศฟังก์ชัน replaceWorksheetData เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function replaceWorksheetData(sheetXml,rowsXml,dimensionRef,autoFilterRef=''){
// [L0860] ประกาศตัวแปร output แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let output=sheetXml.replace(/<dimension\b[^>]*\/>/,`<dimension ref="${dimensionRef}"/>`);
// [L0861] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(/<sheetData\b[^>]*>[\s\S]*?<\/sheetData>/.test(output))output=output.replace(/<sheetData\b[^>]*>[\s\S]*?<\/sheetData>/,`<sheetData>${rowsXml}</sheetData>`);
// [L0862] ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข
  else output=output.replace(/<sheetData\b[^>]*\/>/,`<sheetData>${rowsXml}</sheetData>`);
// [L0863] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(autoFilterRef){
// [L0864] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(/<autoFilter\b[^>]*\/>/.test(output))output=output.replace(/<autoFilter\b[^>]*\/>/,`<autoFilter ref="${autoFilterRef}"/>`);
// [L0865] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0866] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return output;
// [L0867] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0868] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0869] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ดึง child XML tag ชั้นเดียวจาก block ที่กำหนด
// [L0870] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0871] ประกาศฟังก์ชัน directXmlChildren เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function directXmlChildren(block,tagName){
// [L0872] ประกาศตัวแปร result แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const result=[];let cursor=0;
// [L0873] เริ่ม loop แบบวนซ้ำตามเงื่อนไข ใช้รอหรือทำงานจนกว่าจะครบเงื่อนไข
  while(cursor<block.length){
// [L0874] ประกาศตัวแปร start แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const start=block.indexOf(`<${tagName}`,cursor);if(start<0)break;
// [L0875] ประกาศตัวแปร openEnd แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const openEnd=block.indexOf('>',start);if(openEnd<0)break;
// [L0876] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(block[openEnd-1]==='/'){result.push(block.slice(start,openEnd+1));cursor=openEnd+1;continue;}
// [L0877] ประกาศตัวแปร close แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const close=`</${tagName}>`,end=block.indexOf(close,openEnd+1);if(end<0)break;
// [L0878] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    result.push(block.slice(start,end+close.length));cursor=end+close.length;
// [L0879] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0880] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return result;
// [L0881] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0882] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เพิ่ม custom number format ใน styles.xml ถ้ายังไม่มี
// [L0883] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0884] ประกาศฟังก์ชัน ensureCustomNumberFormat เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function ensureCustomNumberFormat(stylesXml,formatCode){
// [L0885] ประกาศตัวแปร escaped แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const escaped=xmlEscape(formatCode),formatTags=stylesXml.match(/<numFmt\b[^>]*\/>/g)||[];
// [L0886] สร้างตัวช่วยแบบ arrow function ชื่อ existing เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const existing=formatTags.find(tag=>attrFromTag(tag,'formatCode')===formatCode||attrFromTag(tag,'formatCode')===escaped);
// [L0887] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(existing)return{xml:stylesXml,numFmtId:Number(attrFromTag(existing,'numFmtId'))};
// [L0888] สร้างตัวช่วยแบบ arrow function ชื่อ ids เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const ids=formatTags.map(tag=>Number(attrFromTag(tag,'numFmtId'))||0),numFmtId=Math.max(163,...ids)+1,newTag=`<numFmt numFmtId="${numFmtId}" formatCode="${escaped}"/>`;
// [L0889] ประกาศตัวแปร output แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let output=stylesXml;
// [L0890] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(/<numFmts\b[^>]*>[\s\S]*?<\/numFmts>/.test(output))output=output.replace(/<numFmts\b([^>]*)>([\s\S]*?)<\/numFmts>/,(_,attrs,body)=>{const count=Number(attrFromTag(`<numFmts${attrs}>`,'count')||formatTags.length)+1,nextAttrs=/\bcount="[^"]*"/.test(attrs)?attrs.replace(/\bcount="[^"]*"/,`count="${count}"`):`${attrs} count="${count}"`;return`<numFmts${nextAttrs}>${body}${newTag}</numFmts>`;});
// [L0891] ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข
  else output=output.replace(/<fonts\b/,`<numFmts count="1">${newTag}</numFmts><fonts`);
// [L0892] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{xml:output,numFmtId};
// [L0893] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0894] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เพิ่ม cell style ที่อ้าง custom number format
// [L0895] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0896] ประกาศฟังก์ชัน ensureNumberFormatStyle เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function ensureNumberFormatStyle(stylesXml,baseStyleId,formatCode='dd/mm/yyyy'){
// [L0897] ประกาศตัวแปร fmt แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const fmt=ensureCustomNumberFormat(stylesXml,formatCode);let output=fmt.xml;
// [L0898] ประกาศตัวแปร blockMatch แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const blockMatch=output.match(/<cellXfs\b[^>]*>[\s\S]*?<\/cellXfs>/);if(!blockMatch)return{xml:output,styleId:String(baseStyleId)};
// [L0899] ประกาศตัวแปร block แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const block=blockMatch[0],styles=directXmlChildren(block,'xf'),base=styles[Number(baseStyleId)]||styles[0];if(!base)return{xml:output,styleId:String(baseStyleId)};
// [L0900] ประกาศตัวแปร clone แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let clone=base.replace(/\bnumFmtId="[^"]*"/,`numFmtId="${fmt.numFmtId}"`);
// [L0901] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!/\bnumFmtId=/.test(clone))clone=clone.replace(/^<xf\b/,'<xf numFmtId="'+fmt.numFmtId+'"');
// [L0902] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  clone=/\bapplyNumberFormat=/.test(clone)?clone.replace(/\bapplyNumberFormat="[^"]*"/,'applyNumberFormat="1"'):clone.replace(/^<xf\b/,'<xf applyNumberFormat="1"');
// [L0903] ประกาศตัวแปร open แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const open=block.match(/^<cellXfs\b[^>]*>/)?.[0]||'<cellXfs>',count=styles.length+1,newOpen=/\bcount="[^"]*"/.test(open)?open.replace(/\bcount="[^"]*"/,`count="${count}"`):open.replace(/>$/,` count="${count}">`),newBlock=newOpen+block.slice(open.length).replace(/<\/cellXfs>$/,`${clone}</cellXfs>`);
// [L0904] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  output=output.replace(block,newBlock);return{xml:output,styleId:String(styles.length)};
// [L0905] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0906] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เตรียม map style วันที่เพื่อใช้ตอน patch sheet XML
// [L0907] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0908] ประกาศฟังก์ชัน ensureDateStyleMap เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function ensureDateStyleMap(stylesXml,baseStyleIds){
// [L0909] ประกาศตัวแปร output แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let output=stylesXml;const map={};
// [L0910] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const raw of [...new Set((baseStyleIds||[]).map(value=>String(value??'0')))]){const result=ensureNumberFormatStyle(output,raw,'dd/mm/yyyy');output=result.xml;map[raw]=result.styleId;}
// [L0911] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{xml:output,map};
// [L0912] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0913] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อัปเดตช่วง ref ของ Excel table
// [L0914] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0915] ประกาศฟังก์ชัน updateTableRange เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function updateTableRange(tableXml,range){
// [L0916] ประกาศตัวแปร output แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let output=tableXml.replace(/(<table\b[^>]*\bref=")[^"]*(")/,'$1'+range+'$2');
// [L0917] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  output=output.replace(/(<autoFilter\b[^>]*\bref=")[^"]*(")/,'$1'+range+'$2');
// [L0918] ประกาศตัวแปร lastRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const lastRow=Number((range.match(/:(?:[A-Z]+)(\d+)$/)||[])[1]||1);
// [L0919] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  output=output.replace(/(<sortState\b[^>]*\bref=")[^"]*(")/,'$1'+`A2:W${lastRow}`+'$2').replace(/(<sortCondition\b[^>]*\bref=")[^"]*(")/,'$1'+`T1:T${lastRow}`+'$2');
// [L0920] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return output;
// [L0921] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0922] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: normalize path ภายใน xlsx zip relationship
// [L0923] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0924] ประกาศฟังก์ชัน normalizeZipPath เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function normalizeZipPath(basePath,target){
// [L0925] ประกาศตัวแปร base แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const base=basePath.split('/');base.pop();
// [L0926] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const part of String(target||'').split('/')){if(!part||part==='.')continue;if(part==='..')base.pop();else base.push(part);}
// [L0927] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return base.join('/');
// [L0928] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0929] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: คำนวณ path ของ .rels สำหรับ worksheet หนึ่ง
// [L0930] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0931] ประกาศฟังก์ชัน worksheetRelsPath เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function worksheetRelsPath(sheetPath){const parts=sheetPath.split('/'),file=parts.pop();return`${parts.join('/')}/_rels/${file}.rels`;}
// [L0932] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อ่าน attribute จาก XML tag ด้วย regex
// [L0933] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0934] ประกาศฟังก์ชัน attrFromTag เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function attrFromTag(tag,name){const match=tag.match(new RegExp(`(?:^|\\s)${regexEscape(name)}="([^"]*)"`));return match?match[1]:'';}
// [L0935] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: หา path ของ worksheet จากชื่อ sheet ใน workbook.xml/rels
// [L0936] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0937] ประกาศฟังก์ชัน worksheetPathByName เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function worksheetPathByName(workbookXml,workbookRelsXml,name){
// [L0938] ประกาศตัวแปร sheetTags แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const sheetTags=workbookXml.match(/<sheet\b[^>]*\/>/g)||[];
// [L0939] สร้างตัวช่วยแบบ arrow function ชื่อ tag เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const tag=sheetTags.find(item=>attrFromTag(item,'name')===name);if(!tag)return'';
// [L0940] ประกาศตัวแปร relationId แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const relationId=attrFromTag(tag,'r:id');if(!relationId)return'';
// [L0941] ประกาศตัวแปร relationTags แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const relationTags=workbookRelsXml.match(/<Relationship\b[^>]*\/>/g)||[];
// [L0942] สร้างตัวช่วยแบบ arrow function ชื่อ relation เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const relation=relationTags.find(item=>attrFromTag(item,'Id')===relationId);if(!relation)return'';
// [L0943] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return normalizeZipPath('xl/workbook.xml',attrFromTag(relation,'Target'));
// [L0944] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0945] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: หา table XML ที่ผูกกับ worksheet จาก relationship
// [L0946] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0947] ประกาศฟังก์ชัน tablePathForWorksheet เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function tablePathForWorksheet(zip,sheetPath){
// [L0948] ประกาศตัวแปร relPath แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const relPath=worksheetRelsPath(sheetPath),file=zip.file(relPath);if(!file)return'';
// [L0949] ประกาศตัวแปร rels แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const rels=await file.async('string'),relations=rels.match(/<Relationship\b[^>]*\/>/g)||[];
// [L0950] สร้างตัวช่วยแบบ arrow function ชื่อ relation เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const relation=relations.find(item=>/\/table$/.test(attrFromTag(item,'Type')));return relation?normalizeZipPath(sheetPath,attrFromTag(relation,'Target')):'';
// [L0951] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0952] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ตรวจรายการไฟล์สำคัญที่ template pivot ต้องมี
// [L0953] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0954] ประกาศฟังก์ชัน pivotTemplateRequiredFiles เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function pivotTemplateRequiredFiles(zip){
// [L0955] ประกาศตัวแปร names แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const names=new Set(Object.keys(zip.files));
// [L0956] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return['xl/pivotTables/pivotTable1.xml','xl/pivotCache/pivotCacheDefinition1.xml','xl/pivotCache/pivotCacheDefinition2.xml'].every(name=>names.has(name));
// [L0957] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0958] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: คำนวณจำนวน column จาก range เช่น A1:W10
// [L0959] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0960] ประกาศฟังก์ชัน rangeWidth เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function rangeWidth(reference){
// [L0961] ประกาศตัวแปร match แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const match=String(reference||'').match(/^([A-Z]+)\d+:([A-Z]+)\d+$/);if(!match)return 0;
// [L0962] สร้างตัวช่วยแบบ arrow function ชื่อ index เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const index=name=>[...name].reduce((value,character)=>value*26+character.charCodeAt(0)-64,0);
// [L0963] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return index(match[2])-index(match[1])+1;
// [L0964] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0965] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อ่าน relationship targets ตาม type ที่ต้องการ
// [L0966] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0967] ประกาศฟังก์ชัน relationshipTargets เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function relationshipTargets(zip,partPath,typeSuffix){
// [L0968] ประกาศตัวแปร relPath แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const relPath=worksheetRelsPath(partPath),file=zip.file(relPath);if(!file)return[];
// [L0969] ประกาศตัวแปร xml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const xml=await file.async('string'),tags=xml.match(/<Relationship\b[^>]*\/>/g)||[];
// [L0970] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return tags.filter(tag=>String(attrFromTag(tag,'Type')).endsWith(typeSuffix)).map(tag=>({id:attrFromTag(tag,'Id'),target:normalizeZipPath(partPath,attrFromTag(tag,'Target')),tag}));
// [L0971] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0972] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ตรวจโครงสร้าง pivot template ภายใน zip ก่อน patch
// [L0973] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0974] ประกาศฟังก์ชัน inspectPivotTemplateZip เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function inspectPivotTemplateZip(zip,options={}){
// [L0975] ประกาศตัวแปร mode แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const mode=options.mode||'source',expectedReportPivotCount=options.expectedReportPivotCount??(mode==='source'?5:null);
// [L0976] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!pivotTemplateRequiredFiles(zip))return{ok:false,message:'ขาด PivotTable1 หรือ PivotCacheDefinition หลัก'};
// [L0977] ประกาศตัวแปร workbookFile แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const workbookFile=zip.file('xl/workbook.xml'),relsFile=zip.file('xl/_rels/workbook.xml.rels'),stylesFile=zip.file('xl/styles.xml');
// [L0978] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!workbookFile||!relsFile||!stylesFile)return{ok:false,message:'Workbook relationships หรือ styles ไม่ครบ'};
// [L0979] ประกาศตัวแปร workbookXml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const workbookXml=await workbookFile.async('string'),workbookRelsXml=await relsFile.async('string'),stylesXml=await stylesFile.async('string');
// [L0980] ประกาศตัวแปร dxfMatch แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const dxfMatch=stylesXml.match(/<dxfs\b[^>]*\bcount="(\d+)"/),dxfCount=dxfMatch?Number(dxfMatch[1]):0;
// [L0981] ประกาศตัวแปร required แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const required=[['Data','Table1',23],['ข้อมูลไม่สมบูรณ์','SM',2],['Black List','BL',2],['PV Final','Table15',9]];
// [L0982] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const [sheetName,tableName,columnCount] of required){
// [L0983] ประกาศตัวแปร sheetPath แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const sheetPath=worksheetPathByName(workbookXml,workbookRelsXml,sheetName);if(!sheetPath||!zip.file(sheetPath))return{ok:false,message:`ขาด Sheet ${sheetName}`};
// [L0984] ประกาศตัวแปร tablePath แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const tablePath=await tablePathForWorksheet(zip,sheetPath);if(!tablePath||!zip.file(tablePath))return{ok:false,message:`ขาด Table ของ Sheet ${sheetName}`};
// [L0985] ประกาศตัวแปร tableXml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const tableXml=await zip.file(tablePath).async('string'),tableTag=(tableXml.match(/<table\b[^>]*>/)||[])[0]||'',columnsTag=(tableXml.match(/<tableColumns\b[^>]*>/)||[])[0]||'';
// [L0986] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(attrFromTag(tableTag,'name')!==tableName||attrFromTag(tableTag,'displayName')!==tableName)return{ok:false,message:`Table ${tableName} ไม่ตรงโครงสร้าง`};
// [L0987] ประกาศตัวแปร reference แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const reference=attrFromTag(tableTag,'ref'),declaredColumns=Number(attrFromTag(columnsTag,'count')||0),actualColumns=(tableXml.match(/<tableColumn\b/g)||[]).length;
// [L0988] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(rangeWidth(reference)!==columnCount||declaredColumns!==columnCount||actualColumns!==columnCount)return{ok:false,message:`Table ${tableName} จำนวนคอลัมน์ไม่ถูกต้อง`};
// [L0989] ประกาศตัวแปร dxfIds แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const dxfIds=(tableXml.match(/(?:DxfId|dxfId)="(\d+)"/g)||[]).map(value=>Number((value.match(/\d+/)||[])[0]||0));
// [L0990] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(dxfIds.some(value=>value<0||value>=dxfCount))return{ok:false,message:`Table ${tableName} อ้าง Style เกินขอบเขต`};
// [L0991] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0992] ประกาศตัวแปร pvSheet แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const pvSheet=worksheetPathByName(workbookXml,workbookRelsXml,'PV'),reportSheet=worksheetPathByName(workbookXml,workbookRelsXml,'Report');
// [L0993] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!pvSheet||!reportSheet||!zip.file(pvSheet)||!zip.file(reportSheet))return{ok:false,message:'ขาด Sheet PV หรือ Report'};
// [L0994] ประกาศตัวแปร pvRelations แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const pvRelations=await relationshipTargets(zip,pvSheet,'/pivotTable'),reportRelations=await relationshipTargets(zip,reportSheet,'/pivotTable');
// [L0995] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(pvRelations.length!==1)return{ok:false,message:`PV ต้องมี PivotTable 1 ตัว แต่พบ ${pvRelations.length}`};
// [L0996] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(expectedReportPivotCount!==null&&reportRelations.length!==expectedReportPivotCount)return{ok:false,message:`Report ต้องมี PivotTable ${expectedReportPivotCount} ตัว แต่พบ ${reportRelations.length}`};
// [L0997] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(mode==='source'&&reportRelations.length!==5)return{ok:false,message:`Clean Template ต้องมี Report Pivot 5 ตัว แต่พบ ${reportRelations.length}`};
// [L0998] สร้างตัวช่วยแบบ arrow function ชื่อ allRelations เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const allRelations=[...pvRelations.map(item=>({...item,scope:'PV'})),...reportRelations.map(item=>({...item,scope:'Report'}))],targets=new Set();
// [L0999] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const relation of allRelations){
// [L1000] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(targets.has(relation.target))return{ok:false,message:`Pivot relationship ซ้ำ ${relation.target}`};targets.add(relation.target);
// [L1001] ประกาศตัวแปร pivotFile แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const pivotFile=zip.file(relation.target);if(!pivotFile)return{ok:false,message:`ขาด ${relation.target}`};
// [L1002] ประกาศตัวแปร pivotXml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const pivotXml=await pivotFile.async('string'),location=(pivotXml.match(/<location\b[^>]*\bref="([^"]+)"/)||[])[1]||'',fieldCount=Number((pivotXml.match(/<pivotFields\b[^>]*\bcount="(\d+)"/)||[])[1]||0);
// [L1003] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!/^[A-Z]+\d+:[A-Z]+\d+$/.test(location))return{ok:false,message:`Pivot ${relation.target} ไม่มี Location ที่ถูกต้อง`};
// [L1004] ประกาศตัวแปร expectedFields แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const expectedFields=relation.scope==='PV'?23:9;if(fieldCount!==expectedFields)return{ok:false,message:`Pivot ${relation.target} ต้องมี ${expectedFields} fields แต่พบ ${fieldCount}`};
// [L1005] ประกาศตัวแปร cacheRelations แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const cacheRelations=await relationshipTargets(zip,relation.target,'/pivotCacheDefinition');
// [L1006] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(cacheRelations.length!==1)return{ok:false,message:`Pivot ${relation.target} ต้องผูก PivotCache 1 ตัว`};
// [L1007] ประกาศตัวแปร expectedCache แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const expectedCache=relation.scope==='PV'?'xl/pivotCache/pivotCacheDefinition1.xml':'xl/pivotCache/pivotCacheDefinition2.xml';
// [L1008] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(cacheRelations[0].target!==expectedCache)return{ok:false,message:`Pivot ${relation.target} ผูก Cache ผิด (${cacheRelations[0].target})`};
// [L1009] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L1010] สร้างตัวช่วยแบบ arrow function ชื่อ orphanPivots เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const orphanPivots=Object.keys(zip.files).filter(name=>/^xl\/pivotTables\/pivotTable\d+\.xml$/.test(name)&&!targets.has(name));
// [L1011] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(orphanPivots.length)return{ok:false,message:`พบ PivotTable ไม่ได้ผูกกับ Sheet: ${orphanPivots.join(', ')}`};
// [L1012] ประกาศตัวแปร cacheChecks แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const cacheChecks=[['xl/pivotCache/pivotCacheDefinition1.xml','Data',23],['xl/pivotCache/pivotCacheDefinition2.xml','Table15',9]];
// [L1013] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const [cachePath,sourceName,fieldCount] of cacheChecks){
// [L1014] ประกาศตัวแปร file แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const file=zip.file(cachePath);if(!file)return{ok:false,message:`ขาด ${cachePath}`};
// [L1015] ประกาศตัวแปร xml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const xml=await file.async('string'),declared=Number((xml.match(/<cacheFields\b[^>]*\bcount="(\d+)"/)||[])[1]||0),actual=(xml.match(/<cacheField\b/g)||[]).length;
// [L1016] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(declared!==fieldCount||actual!==fieldCount)return{ok:false,message:`${cachePath} จำนวน Cache Field ไม่ถูกต้อง`};
// [L1017] ประกาศตัวแปร sourceOk แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const sourceOk=sourceName==='Data'?/<worksheetSource\b[^>]*\bsheet="Data"/.test(xml):/<worksheetSource\b[^>]*\bname="Table15"/.test(xml);
// [L1018] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!sourceOk)return{ok:false,message:`${cachePath} ผูก Source ไม่ถูกต้อง`};
// [L1019] ประกาศตัวแปร recordRelations แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const recordRelations=await relationshipTargets(zip,cachePath,'/pivotCacheRecords');
// [L1020] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(recordRelations.length!==1||!zip.file(recordRelations[0].target))return{ok:false,message:`${cachePath} ขาด Pivot Cache Records`};
// [L1021] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(mode!=='source'){
// [L1022] ประกาศตัวแปร tag แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
      const tag=(xml.match(/<pivotCacheDefinition\b[^>]*>/)||[])[0]||'';
// [L1023] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
      if(attrFromTag(tag,'refreshOnLoad')!=='0'||attrFromTag(tag,'saveData')!=='1')return{ok:false,message:`${cachePath} ต้องเก็บ Underlying Data และห้าม Auto Refresh ทับ Snapshot`};
// [L1024] ประกาศตัวแปร recordsXml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
      const recordsXml=await zip.file(recordRelations[0].target).async('string'),definitionCount=Number(attrFromTag(tag,'recordCount')||0),recordsTag=(recordsXml.match(/<pivotCacheRecords\b[^>]*>/)||[])[0]||'',recordsCount=Number(attrFromTag(recordsTag,'count')||0),actualRecords=(recordsXml.match(/<r(?:\s[^>]*)?>/g)||[]).length;
// [L1025] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
      if(recordsCount!==actualRecords||definitionCount!==recordsCount)return{ok:false,message:`${cachePath} จำนวน Underlying Data ไม่ตรง (${definitionCount}/${recordsCount}/${actualRecords})`};
// [L1026] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
    }
// [L1027] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L1028] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{ok:true,message:`Pivot Structure ผ่านแบบ Strict: PV ${pvRelations.length} · Report ${reportRelations.length} · Cache 2`,details:{mode,pvPivotCount:pvRelations.length,reportPivotCount:reportRelations.length,cacheCount:2,savedUnderlyingData:mode!=='source'}};
// [L1029] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1030] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เปิด buffer template เป็น zip แล้ว inspect
// [L1031] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1032] ประกาศฟังก์ชัน inspectPivotTemplateBuffer เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function inspectPivotTemplateBuffer(buffer,options={}){
// [L1033] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!buffer||!global.JSZip)return{ok:false,message:'ไม่มี Pivot Template Buffer'};
// [L1034] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
  try{return await inspectPivotTemplateZip(await global.JSZip.loadAsync(buffer),options);}catch(error){return{ok:false,message:error?.message||String(error)};}
// [L1035] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1036] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: inspect template จาก workbook หรือ bundled buffer
// [L1037] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1038] ประกาศฟังก์ชัน inspectPivotTemplate เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function inspectPivotTemplate(workbook){
// [L1039] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!workbook?.__sourceBuffer||!global.JSZip)return false;
// [L1040] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(typeof workbook.__pivotTemplateOk==='boolean')return workbook.__pivotTemplateOk;
// [L1041] ประกาศตัวแปร result แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const result=await inspectPivotTemplateBuffer(workbook.__sourceBuffer,{mode:'source'});workbook.__pivotTemplateOk=result.ok;workbook.__pivotTemplateDetails=result;return result.ok;
// [L1042] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1043] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: โหลด template pivot ที่ bundle มากับ assets
// [L1044] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1045] ประกาศฟังก์ชัน loadBundledPivotTemplate เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function loadBundledPivotTemplate(){
// [L1046] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(bundledPivotTemplatePromise)return bundledPivotTemplatePromise;
// [L1047] กำหนด handler/ฟังก์ชันให้ bundledPivotTemplatePromise เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง
  bundledPivotTemplatePromise=(async()=>{
// [L1048] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(typeof global.fetch!=='function')return null;
// [L1049] ประกาศตัวแปร response แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const response=await global.fetch(BUNDLED_PIVOT_TEMPLATE_URL,{cache:'no-store'});if(!response.ok)throw new Error(`โหลด Clean Pivot Template ไม่สำเร็จ (${response.status})`);
// [L1050] ประกาศตัวแปร buffer แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const buffer=await response.arrayBuffer(),inspection=await inspectPivotTemplateBuffer(buffer,{mode:'source'});if(!inspection.ok)throw new Error(`Clean Pivot Template ไม่ผ่าน: ${inspection.message}`);return buffer;
// [L1051] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
  })().catch(error=>{console.warn('Bundled Pivot Template unavailable',error);return null;});
// [L1052] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return bundledPivotTemplatePromise;
// [L1053] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1054] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เลือก template buffer จาก master เดิมหรือ bundled template
// [L1055] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1056] ประกาศฟังก์ชัน resolvePivotTemplateBuffer เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function resolvePivotTemplateBuffer(workbook){
// [L1057] ประกาศตัวแปร bundled แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const bundled=await loadBundledPivotTemplate();if(bundled)return{buffer:bundled,source:'BUNDLED_CLEAN_V2.5.3'};
// [L1058] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(workbook?.__sourceBuffer&&await inspectPivotTemplate(workbook))return{buffer:workbook.__sourceBuffer,source:'UPLOADED_MASTER'};
// [L1059] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return null;
// [L1060] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1061] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง XML ของ Data sheet ใหม่สำหรับ template preserving
// [L1062] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1063] ประกาศฟังก์ชัน buildDataSheetXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function buildDataSheetXml(sourceXml,context){
// [L1064] สร้างตัวช่วยแบบ arrow function ชื่อ headerStyles เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const headerStyles=MASTER_OUTPUT_HEADERS.map((_,column)=>xmlCellStyle(sourceXml,`${columnName(column)}1`,'0'));
// [L1065] สร้างตัวช่วยแบบ arrow function ชื่อ bodyStyles เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const bodyStyles=MASTER_OUTPUT_HEADERS.map((_,column)=>xmlCellStyle(sourceXml,`${columnName(column)}2`,headerStyles[column]||'0'));
// [L1066] สร้างตัวช่วยแบบ arrow function ชื่อ headerCells เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const headerCells=MASTER_OUTPUT_HEADERS.map((value,column)=>xmlTextCell(`${columnName(column)}1`,value,headerStyles[column])).join('');
// [L1067] ประกาศตัวแปร rows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const rows=[`<row r="1" spans="1:23">${headerCells}</row>`];
// [L1068] ประกาศตัวแปร run แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const run=context.processedAt;
// [L1069] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(let index=0;index<context.pending.length;index++){
// [L1070] ประกาศตัวแปร excelRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const excelRow=index+2,row=context.pending[index],cells=[];
// [L1071] ประกาศตัวแปร values แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const values=[row.AgencyCode,row.Mticode,row.AgencyName,row.RequestCode,row.employeeName,row.alienCode,row.alienNameEn,row.CertificateNo,row.Policy,row.TotalPremium,row.ProposalID,row.CreateDate,row.Status,row.EPropID,row.Discount];
// [L1072] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
    for(let column=0;column<values.length;column++){
// [L1073] ประกาศตัวแปร reference แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
      const reference=`${columnName(column)}${excelRow}`,value=values[column],style=bodyStyles[column];
// [L1074] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
      if(column===9)cells.push(xmlNumberCell(reference,number(value),style));
// [L1075] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
      else if(column===11){const serial=excelSerial(value);cells.push(serial===null?xmlTextCell(reference,'',style):xmlNumberCell(reference,serial,style));}
// [L1076] ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข
      else cells.push(xmlTextCell(reference,value,style));
// [L1077] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
    }
// [L1078] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    const {p,q,r,t,u,v,w}=dataRowFormulas(excelRow,run);
// [L1079] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    cells.push(xmlFormulaCell(`P${excelRow}`,p,row.Note,bodyStyles[15],'s'));
// [L1080] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    cells.push(xmlFormulaCell(`Q${excelRow}`,q,row.IncompleteStatus,bodyStyles[16],'s'));
// [L1081] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    cells.push(xmlFormulaCell(`R${excelRow}`,r,row.BlacklistStatus,bodyStyles[17],'s'));
// [L1082] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    cells.push(xmlTextCell(`S${excelRow}`,row.MenuEProblem,bodyStyles[18]));
// [L1083] ประกาศตัวแปร dateSerial แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const dateSerial=excelSerial(row.Date);cells.push(xmlFormulaCell(`T${excelRow}`,t,dateSerial===null?0:dateSerial,bodyStyles[19],'n'));
// [L1084] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    cells.push(xmlFormulaCell(`U${excelRow}`,u,row.PendingStatus,bodyStyles[20],'s'));
// [L1085] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    cells.push(xmlFormulaCell(`V${excelRow}`,v,row.AgingDays===null||row.AgingDays===undefined?0:row.AgingDays,bodyStyles[21],'n'));
// [L1086] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    cells.push(xmlFormulaCell(`W${excelRow}`,w,row.PendingRange,bodyStyles[22],'s'));
// [L1087] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    rows.push(`<row r="${excelRow}" spans="1:23">${cells.join('')}</row>`);
// [L1088] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L1089] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!context.pending.length)rows.push(`<row r="2" spans="1:23">${MASTER_OUTPUT_HEADERS.map((_,column)=>xmlEmptyCell(`${columnName(column)}2`,bodyStyles[column])).join('')}</row>`);
// [L1090] ประกาศตัวแปร lastRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const lastRow=Math.max(2,context.pending.length+1),range=`A1:W${lastRow}`;
// [L1091] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{xml:replaceWorksheetData(sourceXml,rows.join(''),range,range),range,lastRow};
// [L1092] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1093] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง XML ของ control sheet เช่น Check/ETL
// [L1094] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1095] ประกาศฟังก์ชัน buildControlSheetXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function buildControlSheetXml(sourceXml,statusLabel,ids){
// [L1096] ประกาศตัวแปร headers แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const headers=['สถานะ','Prop ID'],headerStyles=headers.map((_,column)=>xmlCellStyle(sourceXml,`${columnName(column)}1`,'0')),bodyStyles=headers.map((_,column)=>xmlCellStyle(sourceXml,`${columnName(column)}2`,headerStyles[column]||'0'));
// [L1097] ประกาศตัวแปร rows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const rows=[`<row r="1" spans="1:2">${headers.map((value,column)=>xmlTextCell(`${columnName(column)}1`,value,headerStyles[column])).join('')}</row>`];
// [L1098] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
  (ids||[]).forEach((value,index)=>{const row=index+2;rows.push(`<row r="${row}" spans="1:2">${xmlTextCell(`A${row}`,statusLabel,bodyStyles[0])}${xmlTextCell(`B${row}`,value,bodyStyles[1])}</row>`);});
// [L1099] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!(ids||[]).length)rows.push(`<row r="2" spans="1:2">${xmlEmptyCell('A2',bodyStyles[0])}${xmlEmptyCell('B2',bodyStyles[1])}</row>`);
// [L1100] ประกาศตัวแปร lastRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const lastRow=Math.max(2,(ids||[]).length+1),range=`A1:B${lastRow}`;
// [L1101] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{xml:replaceWorksheetData(sourceXml,rows.join(''),range,range),range,lastRow};
// [L1102] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1103] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เตรียม rows สำหรับ PV Final แสดงผลเหมือน PV
// [L1104] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1105] ประกาศฟังก์ชัน pvFinalDisplayRows เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function pvFinalDisplayRows(context){return pvRows(context);}
// [L1106] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง XML ของ PV sheet
// [L1107] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1108] ประกาศฟังก์ชัน buildPvSheetXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function buildPvSheetXml(sourceXml,context,dateStyleMap={}){
// [L1109] ประกาศตัวแปร headers แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const headers=['Date','Policy','Mticode','AgencyName','ProposalID','สถานะไม่ issue','จำนวนวันที่ยังไม่ออกกรมธรรม์','ระยะเวลายังไม่ออกกรมธรรม์','Sum of TotalPremium'];
// [L1110] สร้างตัวช่วยแบบ arrow function ชื่อ filterStyles เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const filterStyles=headers.map((_,column)=>xmlCellStyle(sourceXml,`${columnName(column)}2`,'0')),headerStyles=headers.map((_,column)=>xmlCellStyle(sourceXml,`${columnName(column)}4`,'0')),bodyStyles=headers.map((_,column)=>xmlCellStyle(sourceXml,`${columnName(column)}5`,headerStyles[column]||'0'));
// [L1111] ประกาศตัวแปร rows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const rows=[`<row r="2" spans="1:9">${reportStyledCells(2,['Status','(All)','','','','','','',''],filterStyles).join('')}</row>`,`<row r="4" spans="1:9">${headers.map((value,column)=>xmlTextCell(`${columnName(column)}4`,value,headerStyles[column])).join('')}</row>`];
// [L1112] ประกาศตัวแปร values แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const values=pvFinalDisplayRows(context),dateStyle=dateStyleMap[bodyStyles[0]]||bodyStyles[0];
// [L1113] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
  values.forEach((record,index)=>{const row=index+5,cells=[];record.forEach((value,column)=>{const reference=`${columnName(column)}${row}`,style=column===0?dateStyle:bodyStyles[column];if(column===0){const serial=excelSerial(value);cells.push(serial===null?xmlTextCell(reference,'',style):xmlNumberCell(reference,serial,style));}else if(column===6||column===8)cells.push(typeof value==='number'?xmlNumberCell(reference,value,style):xmlTextCell(reference,value,style));else cells.push(xmlTextCell(reference,value,style));});rows.push(`<row r="${row}" spans="1:9">${cells.join('')}</row>`);});
// [L1114] ประกาศตัวแปร lastRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const lastRow=values.length?values.length+4:4,locationRef=`A4:I${Math.max(4,lastRow)}`;
// [L1115] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{xml:replaceWorksheetData(sourceXml,rows.join(''),`A1:I${Math.max(4,lastRow)}`),lastRow,locationRef,rows:values};
// [L1116] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1117] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง XML ของ PV Final sheet
// [L1118] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1119] ประกาศฟังก์ชัน buildPvFinalSheetXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function buildPvFinalSheetXml(sourceXml,context,dateStyleMap={}){
// [L1120] ประกาศตัวแปร headers แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const headers=['Date','Policy','Mticode','AgencyName','ProposalID','สถานะไม่ issue','จำนวนวันที่ยังไม่ออกกรมธรรม์','ระยะเวลายังไม่ออกกรมธรรม์','Sum of TotalPremium'];
// [L1121] สร้างตัวช่วยแบบ arrow function ชื่อ headerStyles เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const headerStyles=headers.map((_,column)=>xmlCellStyle(sourceXml,`${columnName(column)}1`,'0')),bodyStyles=headers.map((_,column)=>xmlCellStyle(sourceXml,`${columnName(column)}2`,headerStyles[column]||'0')),dateStyle=dateStyleMap[bodyStyles[0]]||bodyStyles[0];
// [L1122] ประกาศตัวแปร rows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const rows=[`<row r="1" spans="1:9">${headers.map((value,column)=>xmlTextCell(`${columnName(column)}1`,value,headerStyles[column])).join('')}</row>`];
// [L1123] ประกาศตัวแปร values แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const values=pvFinalDisplayRows(context);
// [L1124] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
  values.forEach((record,index)=>{
// [L1125] ประกาศตัวแปร row แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const row=index+2,cells=[];
// [L1126] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
    record.forEach((value,column)=>{const reference=`${columnName(column)}${row}`,style=column===0?dateStyle:bodyStyles[column];if(column===0){const serial=excelSerial(value);cells.push(serial===null?xmlTextCell(reference,'',style):xmlNumberCell(reference,serial,style));}else if(column===6||column===8)cells.push(typeof value==='number'?xmlNumberCell(reference,value,style):xmlTextCell(reference,value,style));else cells.push(xmlTextCell(reference,value,style));});
// [L1127] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    rows.push(`<row r="${row}" spans="1:9">${cells.join('')}</row>`);
// [L1128] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  });
// [L1129] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!values.length)rows.push(`<row r="2" spans="1:9">${headers.map((_,column)=>xmlEmptyCell(`${columnName(column)}2`,column===0?dateStyle:bodyStyles[column])).join('')}</row>`);
// [L1130] ประกาศตัวแปร lastRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const lastRow=Math.max(2,values.length+1),range=`A1:I${lastRow}`;
// [L1131] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{xml:replaceWorksheetData(sourceXml,rows.join(''),range,range),range,lastRow,rows:values};
// [L1132] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1133] กำหนดค่าคงที่ REPORT_BLOCKS สำหรับใช้เป็นค่ากลางของ flow นี้
const REPORT_BLOCKS=[
// [L1134] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  {key:'waiting',status:'รอ Issue',label:'รายการที่รอ ISSUE.',pivotName:'PivotTable14',originalPivotRow:23},
// [L1135] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  {key:'menuE',status:'ติดปัญหาไม่เข้าในเมนู E',label:'รายการติดปัญหาไม่เอาเข้าเมนู E',pivotName:'PivotTable5',originalPivotRow:54},
// [L1136] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  {key:'incomplete',status:'ข้อมูลไม่สมบูรณ์',label:'รายการข้อมูลไม่สมบูรณ์',pivotName:'PivotTable3',originalPivotRow:134},
// [L1137] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  {key:'blacklist',status:'Blacklist',label:'สถานะ Blacklist.',pivotName:'PivotTable1',originalPivotRow:170}
// [L1138] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
];
// [L1139] สร้างตัวช่วยแบบ arrow function ชื่อ REPORT_STATUS_ORDER เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
const REPORT_STATUS_ORDER=REPORT_BLOCKS.map(block=>block.status);
// [L1140] กำหนดค่าคงที่ REPORT_AGING_ORDER สำหรับใช้เป็นค่ากลางของ flow นี้
const REPORT_AGING_ORDER=['1 - 7 วัน','8 - 15 วัน','16 - 30 วัน','มากกว่า 30 วัน'];
// [L1141] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เพิ่มหรือแก้ attribute ใน XML root attribute string
// [L1142] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1143] ประกาศฟังก์ชัน upsertXmlAttribute เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function upsertXmlAttribute(attributes,name,value){
// [L1144] ประกาศตัวแปร pattern แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const pattern=new RegExp(`\\s${regexEscape(name)}="[^"]*"`);
// [L1145] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return pattern.test(attributes)?attributes.replace(pattern,` ${name}="${xmlEscape(value)}"`):`${attributes} ${name}="${xmlEscape(value)}"`;
// [L1146] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1147] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง object item สำหรับ pivot cache
// [L1148] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1149] ประกาศฟังก์ชัน pivotCacheItem เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function pivotCacheItem(type,value=''){return{type,value:type==='n'?Number(value):String(value??'')};}
// [L1150] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง key กันซ้ำของ pivot cache item
// [L1151] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1152] ประกาศฟังก์ชัน pivotCacheItemKey เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function pivotCacheItemKey(item){return`${item.type}:${item.type==='n'&&Object.is(item.value,-0)?0:item.value}`;}
// [L1153] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง pivot cache item สำหรับวันที่
// [L1154] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1155] ประกาศฟังก์ชัน pivotCacheDateItem เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function pivotCacheDateItem(value){
// [L1156] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!value)return pivotCacheItem('m');
// [L1157] ประกาศตัวแปร key แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const key=dateKey(value);return key?pivotCacheItem('d',`${key}T00:00:00`):pivotCacheItem('m');
// [L1158] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1159] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง pivot cache item สำหรับข้อความหรือ missing item
// [L1160] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1161] ประกาศฟังก์ชัน pivotCacheTextItem เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function pivotCacheTextItem(value){return hasValue(value)?pivotCacheItem('s',String(value)):pivotCacheItem('m');}
// [L1162] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เลือกชนิด pivot cache item จากค่าจริง number/date/text/blank
// [L1163] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1164] ประกาศฟังก์ชัน pivotCacheMixedItem เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function pivotCacheMixedItem(value){
// [L1165] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(value===null||value===undefined||value==='')return pivotCacheItem('m');
// [L1166] ประกาศตัวแปร numeric แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const numeric=Number(value);return typeof value==='number'&&Number.isFinite(numeric)?pivotCacheItem('n',numeric):pivotCacheItem('s',String(value));
// [L1167] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1168] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้างรายการ unique items ตามลำดับที่ pivot ต้องใช้
// [L1169] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1170] ประกาศฟังก์ชัน orderedUniquePivotItems เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function orderedUniquePivotItems(values,{fixed=[],sort='none'}={}){
// [L1171] ประกาศตัวแปร items แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const items=[],seen=new Set(),push=item=>{const key=pivotCacheItemKey(item);if(!seen.has(key)){seen.add(key);items.push(item);}};
// [L1172] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  fixed.forEach(push);values.forEach(push);
// [L1173] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(sort==='date')items.sort((left,right)=>left.type==='m'?1:right.type==='m'?-1:String(left.value).localeCompare(String(right.value)));
// [L1174] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(sort==='mixed')items.sort((left,right)=>{
// [L1175] สร้างตัวช่วยแบบ arrow function ชื่อ rank เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
    const rank=item=>item.type==='n'?0:item.type==='s'?1:2,difference=rank(left)-rank(right);if(difference)return difference;
// [L1176] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(left.type==='n')return left.value-right.value;return String(left.value).localeCompare(String(right.value),'th');
// [L1177] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  });
// [L1178] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return items;
// [L1179] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1180] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง XML ของ cache item แต่ละตัว
// [L1181] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1182] ประกาศฟังก์ชัน pivotCacheValueXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function pivotCacheValueXml(item,{unused=false}={}){
// [L1183] ประกาศตัวแปร unusedAttribute แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const unusedAttribute=unused?' u="1"':'';
// [L1184] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(item.type==='m')return'<m/>';
// [L1185] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(item.type==='n')return`<n v="${item.value}"${unusedAttribute}/>`;
// [L1186] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(item.type==='d')return`<d v="${xmlEscape(item.value)}"${unusedAttribute}/>`;
// [L1187] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return`<s v="${xmlEscape(item.value)}"${unusedAttribute}/>`;
// [L1188] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1189] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง sharedItems XML ของ pivot cache
// [L1190] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1191] ประกาศฟังก์ชัน pivotSharedItemsXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function pivotSharedItemsXml(items,{usedKeys=new Set()}={}){
// [L1192] สร้างตัวช่วยแบบ arrow function ชื่อ types เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const types=new Set(items.map(item=>item.type)),attributes=[];
// [L1193] ประกาศตัวแปร hasBlank แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const hasBlank=types.has('m'),hasString=types.has('s'),hasNumber=types.has('n'),hasDate=types.has('d');
// [L1194] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(hasBlank)attributes.push('containsBlank="1"');
// [L1195] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(hasDate){
// [L1196] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    attributes.push('containsSemiMixedTypes="0"','containsMixedTypes="0"','containsNonDate="0"','containsDate="1"','containsString="0"');
// [L1197] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  }else if(hasNumber&&!hasString){
// [L1198] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    attributes.push('containsSemiMixedTypes="0"','containsMixedTypes="0"','containsString="0"','containsNumber="1"');
// [L1199] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  }else if(hasNumber&&hasString){
// [L1200] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    attributes.push('containsSemiMixedTypes="1"','containsMixedTypes="1"','containsString="1"','containsNumber="1"','containsNonDate="1"');
// [L1201] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L1202] สร้างตัวช่วยแบบ arrow function ชื่อ numbers เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const numbers=items.filter(item=>item.type==='n').map(item=>item.value);
// [L1203] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(numbers.length){
// [L1204] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(numbers.every(Number.isInteger))attributes.push('containsInteger="1"');
// [L1205] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    attributes.push(`minValue="${Math.min(...numbers)}"`,`maxValue="${Math.max(...numbers)}"`);
// [L1206] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L1207] สร้างตัวช่วยแบบ arrow function ชื่อ dates เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const dates=items.filter(item=>item.type==='d').map(item=>item.value).sort();
// [L1208] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(dates.length)attributes.push(`minDate="${xmlEscape(dates[0])}"`,`maxDate="${xmlEscape(dates[dates.length-1])}"`);
// [L1209] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  attributes.push(`count="${items.length}"`);
// [L1210] สร้างตัวช่วยแบบ arrow function ชื่อ children เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const children=items.map(item=>pivotCacheValueXml(item,{unused:usedKeys.size>0&&!usedKeys.has(pivotCacheItemKey(item))})).join('');
// [L1211] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return children?`<sharedItems ${attributes.join(' ')}>${children}</sharedItems>`:`<sharedItems ${attributes.join(' ')}/>`;
// [L1212] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1213] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง snapshot items/index ของ pivot cache สำหรับ Report
// [L1214] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1215] ประกาศฟังก์ชัน buildReportPivotCacheSnapshot เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function buildReportPivotCacheSnapshot(rows){
// [L1216] ประกาศตัวแปร fieldNames แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const fieldNames=['Date','Policy','Mticode','AgencyName','ProposalID','สถานะไม่ issue','จำนวนวันที่ยังไม่ออกกรมธรรม์','ระยะเวลายังไม่ออกกรมธรรม์','Sum of TotalPremium'];
// [L1217] สร้างตัวช่วยแบบ arrow function ชื่อ normalized เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const normalized=(rows||[]).map(row=>[
// [L1218] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    pivotCacheDateItem(row[0]),pivotCacheTextItem(row[1]),pivotCacheTextItem(row[2]),pivotCacheTextItem(row[3]),pivotCacheTextItem(row[4]),pivotCacheTextItem(row[5]),pivotCacheMixedItem(row[6]),pivotCacheTextItem(row[7]),pivotCacheMixedItem(row[8])
// [L1219] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  ]);
// [L1220] สร้างตัวช่วยแบบ arrow function ชื่อ actualStatuses เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const actualStatuses=new Set(normalized.map(row=>row[5]).filter(item=>item.type==='s').map(item=>item.value));
// [L1221] สร้างตัวช่วยแบบ arrow function ชื่อ unexpectedStatuses เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const unexpectedStatuses=[...actualStatuses].filter(value=>!REPORT_STATUS_ORDER.includes(value));
// [L1222] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(unexpectedStatuses.length)throw new Error(`BW-PIVOT-CACHE-005: พบสถานะนอก SOP: ${unexpectedStatuses.join(', ')}`);
// [L1223] สร้างตัวช่วยแบบ arrow function ชื่อ actualAging เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const actualAging=new Set(normalized.map(row=>row[7]).filter(item=>item.type==='s').map(item=>item.value));
// [L1224] สร้างตัวช่วยแบบ arrow function ชื่อ unexpectedAging เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const unexpectedAging=[...actualAging].filter(value=>!REPORT_AGING_ORDER.includes(value));
// [L1225] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(unexpectedAging.length)throw new Error(`BW-PIVOT-CACHE-006: พบช่วงวันนอก SOP: ${unexpectedAging.join(', ')}`);
// [L1226] ประกาศตัวแปร shared แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const shared=[];
// [L1227] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(let field=0;field<fieldNames.length;field++){
// [L1228] สร้างตัวช่วยแบบ arrow function ชื่อ values เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
    const values=normalized.map(row=>row[field]);
// [L1229] ประกาศตัวแปร options แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const options=field===0?{sort:'date'}:field===5?{fixed:REPORT_STATUS_ORDER.map(value=>pivotCacheItem('s',value))}:field===6?{sort:'mixed'}:field===7?{fixed:REPORT_AGING_ORDER.map(value=>pivotCacheItem('s',value))}:field===8?{sort:'mixed'}:{};
// [L1230] ประกาศตัวแปร items แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const items=orderedUniquePivotItems(values,options),index=new Map(items.map((item,itemIndex)=>[pivotCacheItemKey(item),itemIndex])),usedKeys=new Set(values.map(pivotCacheItemKey));
// [L1231] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    shared.push({items,index,usedKeys});
// [L1232] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L1233] สร้างตัวช่วยแบบ arrow function ชื่อ cacheFields เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const cacheFields=fieldNames.map((name,index)=>{
// [L1234] ประกาศตัวแปร numFmtId แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const numFmtId=index===0?'14':'0';
// [L1235] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
    return`<cacheField name="${xmlEscape(name)}" numFmtId="${numFmtId}">${pivotSharedItemsXml(shared[index].items,{usedKeys:shared[index].usedKeys})}</cacheField>`;
// [L1236] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  }).join('');
// [L1237] สร้างตัวช่วยแบบ arrow function ชื่อ records เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const records=normalized.map(row=>`<r>${row.map((item,index)=>{
// [L1238] ประกาศตัวแปร itemIndex แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const itemIndex=shared[index].index.get(pivotCacheItemKey(item));
// [L1239] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(itemIndex===undefined)throw new Error(`BW-PIVOT-CACHE-001: ไม่พบ Cache Index field ${index}`);
// [L1240] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
    return`<x v="${itemIndex}"/>`;
// [L1241] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  }).join('')}</r>`).join('');
// [L1242] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{
// [L1243] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    fieldNames,normalized,shared,
// [L1244] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    cacheFieldsXml:`<cacheFields count="${fieldNames.length}">${cacheFields}</cacheFields>`,
// [L1245] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    recordsXml:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><pivotCacheRecords xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" count="${normalized.length}">${records}</pivotCacheRecords>`,
// [L1246] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    recordCount:normalized.length,
// [L1247] อ่านหรือเขียนข้อความ/ค่าฟอร์มบนหน้าเว็บ
    statusItems:shared[5].items.filter(item=>item.type==='s').map(item=>item.value)
// [L1248] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  };
// [L1249] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1250] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: หา index ของ item ใน pivot sharedItems และ throw ถ้าไม่เจอ
// [L1251] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1252] ประกาศฟังก์ชัน pivotSharedIndex เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function pivotSharedIndex(snapshot,field,item,errorCode='BW-PIVOT-TABLE-001'){
// [L1253] ประกาศตัวแปร index แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const index=snapshot.shared[field]?.index.get(pivotCacheItemKey(item));
// [L1254] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(index===undefined)throw new Error(`${errorCode}: ไม่พบ Shared Item field ${field} value ${String(item?.value??'')}`);
// [L1255] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return index;
// [L1256] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1257] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อ่าน attributes ของ pivotTableDefinition root
// [L1258] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1259] ประกาศฟังก์ชัน xmlRootAttributes เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function xmlRootAttributes(xml){return((xml.match(/<pivotTableDefinition\b([^>]*)>/)||[])[1]||'').trim();}
// [L1260] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ดึง style info เดิมของ pivot หรือใส่ค่า default
// [L1261] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1262] ประกาศฟังก์ชัน pivotStyleInfoXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function pivotStyleInfoXml(xml){return(xml.match(/<pivotTableStyleInfo\b[^>]*\/>/)||['<pivotTableStyleInfo name="PivotStyleMedium9" showRowHeaders="1" showColHeaders="1" showRowStripes="0" showColStripes="0" showLastColumn="0"/>'])[0];}
// [L1263] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ทำความสะอาด attributes ที่ไม่ควรซ้ำก่อน rebuild pivot XML
// [L1264] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1265] ประกาศฟังก์ชัน cleanPivotRootAttributes เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function cleanPivotRootAttributes(xml){
// [L1266] ประกาศตัวแปร attributes แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let attributes=xmlRootAttributes(xml).replace(/(?:^|\s+)xmlns(:[A-Za-z0-9_]+)?="[^"]*"/g,'').trim().replace(/\s+refreshDataOnOpen="[^"]*"/g,'');
// [L1267] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const [name,value] of [['enableDrill','1'],['showDrill','1'],['preserveFormatting','1'],['compact','0'],['compactData','0'],['multipleFieldFilters','0']])attributes=upsertXmlAttribute(attributes,name,value);
// [L1268] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return attributes;
// [L1269] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1270] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง items XML ของ pivot field
// [L1271] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1272] ประกาศฟังก์ชัน pivotItemsXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function pivotItemsXml(snapshot,field,{visibleIndices=null,selectedIndex=null}={}){
// [L1273] ประกาศตัวแปร sharedField แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const sharedField=snapshot.shared[field],items=sharedField?.items||[];
// [L1274] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!items.length)return'';
// [L1275] ประกาศตัวแปร visible แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const visible=visibleIndices instanceof Set?visibleIndices:null;
// [L1276] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return`<items count="${items.length}">${items.map((item,index)=>{
// [L1277] ประกาศตัวแปร attributes แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const attributes=[`x="${index}"`],used=sharedField.usedKeys.has(pivotCacheItemKey(item));
// [L1278] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!used)attributes.push('m="1"');
// [L1279] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(selectedIndex!==null&&selectedIndex!==undefined&&index!==selectedIndex)attributes.push('h="1"');
// [L1280] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    else if(visible&&!visible.has(index))attributes.push('h="1"');
// [L1281] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
    return`<item ${attributes.join(' ')}/>`;
// [L1282] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  }).join('')}</items>`;
// [L1283] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1284] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง pivotField XML แบบสั้น
// [L1285] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1286] ประกาศฟังก์ชัน simplePivotField เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function simplePivotField(attributes='',items=''){return`<pivotField${attributes?' '+attributes:''}>${items}</pivotField>`;}
// [L1287] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง dataFields XML สำหรับ Report pivot เช่น Count/Sum
// [L1288] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1289] ประกาศฟังก์ชัน reportDataFieldsXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function reportDataFieldsXml(){return'<dataFields count="2"><dataField name="Count of Policy" fld="1" subtotal="count" numFmtId="3"/><dataField name="ผลรวม" fld="8" subtotal="sum" numFmtId="3"/></dataFields>';}
// [L1290] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง column axis XML ของ Report pivot
// [L1291] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1292] ประกาศฟังก์ชัน reportColumnAxisXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function reportColumnAxisXml(){return'<colFields count="1"><field x="-2"/></colFields><colItems count="2"><i><x/></i><i i="1"><x v="1"/></i></colItems>';}
// [L1293] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง pivot table XML สำหรับ aging report
// [L1294] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1295] ประกาศฟังก์ชัน buildAgingPivotTableDefinition เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function buildAgingPivotTableDefinition(existingXml,layout,snapshot){
// [L1296] สร้างตัวช่วยแบบ arrow function ชื่อ visibleIndices เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const visibleIndices=new Set((layout.groups||[]).map(group=>pivotSharedIndex(snapshot,7,pivotCacheTextItem(group[1]))));
// [L1297] ประกาศตัวแปร fields แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const fields=[];
// [L1298] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(let index=0;index<9;index++){
// [L1299] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(index===1||index===8)fields.push(simplePivotField('dataField="1" compact="0" outline="0" showAll="0" defaultSubtotal="0"'));
// [L1300] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    else if(index===7)fields.push(simplePivotField('axis="axisRow" compact="0" outline="0" showAll="0" defaultSubtotal="0"',pivotItemsXml(snapshot,7,{visibleIndices})));
// [L1301] ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข
    else fields.push(simplePivotField('compact="0" outline="0" showAll="0" defaultSubtotal="0"'));
// [L1302] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L1303] สร้างตัวช่วยแบบ arrow function ชื่อ rowItems เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const rowItems=(layout.groups||[]).map(group=>`<i><x v="${pivotSharedIndex(snapshot,7,pivotCacheTextItem(group[1]))}"/></i>`).join('')+'<i t="grand"><x/></i>';
// [L1304] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><pivotTableDefinition xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ${cleanPivotRootAttributes(existingXml)}><location ref="${xmlEscape(layout.ref)}" firstHeaderRow="0" firstDataRow="1" firstDataCol="1"/><pivotFields count="9">${fields.join('')}</pivotFields><rowFields count="1"><field x="7"/></rowFields><rowItems count="${(layout.groups||[]).length+1}">${rowItems}</rowItems>${reportColumnAxisXml()}${reportDataFieldsXml()}${pivotStyleInfoXml(existingXml)}</pivotTableDefinition>`;
// [L1305] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1306] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง pivot table XML สำหรับ status report
// [L1307] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1308] ประกาศฟังก์ชัน buildStatusPivotTableDefinition เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function buildStatusPivotTableDefinition(existingXml,layout,snapshot){
// [L1309] ประกาศตัวแปร statusIndex แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const statusIndex=pivotSharedIndex(snapshot,5,pivotCacheTextItem(layout.status),'BW-REPORT-FILTER-001');
// [L1310] ประกาศตัวแปร dateVisible แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const dateVisible=new Set(),daysVisible=new Set(),rowItems=[];
// [L1311] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const group of layout.groups||[]){
// [L1312] ประกาศตัวแปร dateIndex แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const dateIndex=pivotSharedIndex(snapshot,0,pivotCacheDateItem(group[0])),daysIndex=pivotSharedIndex(snapshot,6,pivotCacheMixedItem(group[1]));
// [L1313] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    dateVisible.add(dateIndex);daysVisible.add(daysIndex);rowItems.push(`<i><x v="${dateIndex}"/><x v="${daysIndex}"/></i>`);
// [L1314] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L1315] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  rowItems.push('<i t="grand"><x/></i>');
// [L1316] ประกาศตัวแปร fields แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const fields=[];
// [L1317] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(let index=0;index<9;index++){
// [L1318] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(index===1||index===8)fields.push(simplePivotField('dataField="1" compact="0" outline="0" showAll="0" defaultSubtotal="0"'));
// [L1319] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    else if(index===0)fields.push(simplePivotField('axis="axisRow" compact="0" outline="0" showAll="0" sortType="ascending" defaultSubtotal="0"',pivotItemsXml(snapshot,0,{visibleIndices:dateVisible})));
// [L1320] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    else if(index===5)fields.push(simplePivotField('axis="axisPage" compact="0" outline="0" multipleItemSelectionAllowed="0" showAll="0" defaultSubtotal="0"',pivotItemsXml(snapshot,5,{selectedIndex:statusIndex})));
// [L1321] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    else if(index===6)fields.push(simplePivotField('axis="axisRow" compact="0" outline="0" showAll="0" sortType="ascending" defaultSubtotal="0"',pivotItemsXml(snapshot,6,{visibleIndices:daysVisible})));
// [L1322] ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข
    else fields.push(simplePivotField('compact="0" outline="0" showAll="0" defaultSubtotal="0"'));
// [L1323] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L1324] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{
// [L1325] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    xml:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><pivotTableDefinition xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ${cleanPivotRootAttributes(existingXml)}><location ref="${xmlEscape(layout.ref)}" firstHeaderRow="1" firstDataRow="2" firstDataCol="2" rowPageCount="1" colPageCount="1"/><pivotFields count="9">${fields.join('')}</pivotFields><rowFields count="2"><field x="0"/><field x="6"/></rowFields><rowItems count="${rowItems.length}">${rowItems.join('')}</rowItems>${reportColumnAxisXml()}<pageFields count="1"><pageField fld="5" item="${statusIndex}" hier="-1"/></pageFields>${reportDataFieldsXml()}${pivotStyleInfoXml(existingXml)}</pivotTableDefinition>`,
// [L1326] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    statusIndex
// [L1327] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  };
// [L1328] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1329] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง XML cell ว่างพร้อม style
// [L1330] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1331] ประกาศฟังก์ชัน xmlEmptyCell เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function xmlEmptyCell(reference,style){return`<c r="${reference}"${style!==undefined&&style!==null?` s="${style}"`:''}/>`;}
// [L1332] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง XML row ของ Report พร้อมกำหนด height/hidden
// [L1333] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1334] ประกาศฟังก์ชัน reportRowXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function reportRowXml(rowNumber,cells,{height=20.1,hidden=false}={}){
// [L1335] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return`<row r="${rowNumber}" spans="1:4"${hidden?' hidden="1"':''}${height?` ht="${height}" customHeight="1"`:''}>${cells.join('')}</row>`;
// [L1336] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1337] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อ่าน style id จาก row ต้นแบบของ Report
// [L1338] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1339] ประกาศฟังก์ชัน reportCellStyles เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function reportCellStyles(sourceXml,row){return[0,1,2,3].map(column=>xmlCellStyle(sourceXml,`${columnName(column)}${row}`,'0'));}
// [L1340] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง cells ของ Report โดยคง style และชนิด numeric/formula
// [L1341] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1342] ประกาศฟังก์ชัน reportStyledCells เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function reportStyledCells(rowNumber,values,styles,numericColumns=[],formulaColumns={}){
// [L1343] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return values.map((value,column)=>{
// [L1344] ประกาศตัวแปร reference แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const reference=`${columnName(column)}${rowNumber}`,style=styles[column];
// [L1345] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(formulaColumns[column])return xmlFormulaCell(reference,formulaColumns[column],value,style,'n');
// [L1346] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(value===null||value===undefined||value==='')return xmlEmptyCell(reference,style);
// [L1347] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
    return numericColumns.includes(column)?xmlNumberCell(reference,value,style):xmlTextCell(reference,value,style);
// [L1348] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  });
// [L1349] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1350] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อัปเดต mergeCells ใน worksheet XML
// [L1351] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1352] ประกาศฟังก์ชัน patchMergeCells เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function patchMergeCells(sheetXml,refs){
// [L1353] ประกาศตัวแปร block แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const block=`<mergeCells count="${refs.length}">${refs.map(ref=>`<mergeCell ref="${ref}"/>`).join('')}</mergeCells>`;
// [L1354] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(/<mergeCells\b[^>]*>[\s\S]*?<\/mergeCells>/.test(sheetXml))return sheetXml.replace(/<mergeCells\b[^>]*>[\s\S]*?<\/mergeCells>/,block);
// [L1355] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return sheetXml.replace(/<pageMargins\b/,`${block}<pageMargins`);
// [L1356] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1357] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง Report sheet XML แบบ compact พร้อม staging ซ่อนสำหรับ pivot
// [L1358] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1359] ประกาศฟังก์ชัน buildCompactReportSheetXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function buildCompactReportSheetXml(sourceXml,context,summary,dateStyleMap={}){
// [L1360] ประกาศตัวแปร reportRows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const reportRows=aggregatePvRows(context.pending),rows=[],merges=['A1:D1','A2:B2','A3:B3','A6:D6'],layouts={aging:null,sections:[],hiddenSections:[]};
// [L1361] ประกาศตัวแปร topTitle แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const topTitle=reportCellStyles(sourceXml,1),kpiMoney=reportCellStyles(sourceXml,2),kpiCount=reportCellStyles(sourceXml,3),blank4=reportCellStyles(sourceXml,4),blank5=reportCellStyles(sourceXml,5),agingTitle=reportCellStyles(sourceXml,6),agingHeader=reportCellStyles(sourceXml,7),agingBody=reportCellStyles(sourceXml,8),agingGrand=reportCellStyles(sourceXml,9);
// [L1362] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  rows.push(reportRowXml(1,reportStyledCells(1,['สถานะไม่ ISSUE.','','',''],topTitle),{height:30}));
// [L1363] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  rows.push(reportRowXml(2,reportStyledCells(2,['ยอดเงินที่ยังไม่ Issue','',summary.TotalPremium,'บาท'],kpiMoney,[2],{2:'SUM(Table15[Sum of TotalPremium])'})));
// [L1364] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  rows.push(reportRowXml(3,reportStyledCells(3,['จำนวนกรมธรรม์','',summary.TotalPolicies,'กรมธรรม์'],kpiCount,[2],{2:'COUNTA(Table15[Policy])'})));
// [L1365] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  rows.push(reportRowXml(4,reportStyledCells(4,['','','',''],blank4)));
// [L1366] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  rows.push(reportRowXml(5,reportStyledCells(5,['','','',''],blank5),{hidden:true}));
// [L1367] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  rows.push(reportRowXml(6,reportStyledCells(6,['จำนวนวันที่ยังไม่ออกกรมธรรม์','','',''],agingTitle),{height:30}));
// [L1368] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  rows.push(reportRowXml(7,reportStyledCells(7,['No.','ระยะเวลายังไม่ออกกรมธรรม์','Count of Policy','TotalPremium'],agingHeader)));
// [L1369] ประกาศตัวแปร aging แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const aging=groupByAging(reportRows);
// [L1370] ประกาศตัวแปร rowNumber แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let rowNumber=8;
// [L1371] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
  aging.forEach(item=>{rows.push(reportRowXml(rowNumber,reportStyledCells(rowNumber,item,agingBody,[0,2,3])));rowNumber++;});
// [L1372] ประกาศตัวแปร agingGrandRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const agingGrandRow=rowNumber;
// [L1373] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  rows.push(reportRowXml(agingGrandRow,reportStyledCells(agingGrandRow,['Grand Total','',summary.TotalPolicies,summary.TotalPremium],agingGrand,[2,3])));
// [L1374] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  layouts.aging={ref:`B7:D${agingGrandRow}`,groups:aging};
// [L1375] ประกาศตัวแปร cursor แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let cursor=agingGrandRow+2;
// [L1376] ประกาศตัวแปร templateRows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const templateRows={waiting:21,menuE:52,incomplete:132,blacklist:168};
// [L1377] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const block of REPORT_BLOCKS){
// [L1378] สร้างตัวช่วยแบบ arrow function ชื่อ subset เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
    const subset=reportRows.filter(item=>item.PendingStatus===block.status),groups=groupStatusRows(reportRows,block.status);
// [L1379] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!subset.length||!groups.length)continue;
// [L1380] ประกาศตัวแปร base แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const base=templateRows[block.key],filterStyles=reportCellStyles(sourceXml,base),titleStyles=reportCellStyles(sourceXml,base+1),valuesStyles=reportCellStyles(sourceXml,base+2),headerStyles=reportCellStyles(sourceXml,base+3),bodyStyles=reportCellStyles(sourceXml,base+4),grandStyles=reportCellStyles(sourceXml,base+5);
// [L1381] ประกาศตัวแปร filterRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const filterRow=cursor,titleRow=cursor+1,valuesRow=cursor+2,headerRow=cursor+3,dataStart=cursor+4;
// [L1382] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    rows.push(reportRowXml(filterRow,reportStyledCells(filterRow,['สถานะไม่ issue',block.status,'',''],filterStyles),{hidden:true}));
// [L1383] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    rows.push(reportRowXml(titleRow,reportStyledCells(titleRow,[block.label,'','',''],titleStyles),{height:30}));merges.push(`A${titleRow}:D${titleRow}`);
// [L1384] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    rows.push(reportRowXml(valuesRow,reportStyledCells(valuesRow,['','','Values',''],valuesStyles),{hidden:true}));
// [L1385] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    rows.push(reportRowXml(headerRow,reportStyledCells(headerRow,['Date','จำนวนวันที่ยังไม่ออกกรมธรรม์','Count of Policy','ผลรวม'],headerStyles)));
// [L1386] สร้างตัวช่วยแบบ arrow function ชื่อ statusDateStyles เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
    const statusDateStyles=[dateStyleMap[bodyStyles[0]]||bodyStyles[0],bodyStyles[1],bodyStyles[2],bodyStyles[3]];groups.forEach((group,index)=>{const current=dataStart+index;rows.push(reportRowXml(current,reportStyledCells(current,[excelSerial(group[0]),group[1],group[2],group[3]],statusDateStyles,[0,1,2,3])));});
// [L1387] ประกาศตัวแปร grandRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const grandRow=dataStart+groups.length,sectionPremium=sum(subset,'TotalPremium');
// [L1388] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    rows.push(reportRowXml(grandRow,reportStyledCells(grandRow,['Grand Total','',subset.length,sectionPremium],grandStyles,[2,3])));
// [L1389] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    layouts.sections.push({...block,filterRow,titleRow,valuesRow,headerRow,dataStart,grandRow,ref:`A${valuesRow}:D${grandRow}`,groups,subset,hidden:false});
// [L1390] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    cursor=grandRow+2;
// [L1391] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L1392] สร้างตัวช่วยแบบ arrow function ชื่อ visibleLastRow เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const visibleLastRow=Math.max(agingGrandRow,...layouts.sections.map(item=>item.grandRow));
// [L1393] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
  // Hidden Pivot staging starts immediately after the visible report. A status PivotTable
// [L1394] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
  // renders its page filter two rows above <location ref>. Keep a hidden spacer row so
// [L1395] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
  // that the page filter lands on filterRow instead of leaking into the visible row below
// [L1396] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
  // the last Grand Total.
// [L1397] ประกาศตัวแปร stagingCursor แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let stagingCursor=visibleLastRow+1;
// [L1398] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const block of REPORT_BLOCKS){
// [L1399] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(layouts.sections.some(item=>item.key===block.key))continue;
// [L1400] ประกาศตัวแปร base แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const base=templateRows[block.key],filterStyles=reportCellStyles(sourceXml,base),valuesStyles=reportCellStyles(sourceXml,base+2),headerStyles=reportCellStyles(sourceXml,base+3),grandStyles=reportCellStyles(sourceXml,base+5);
// [L1401] ประกาศตัวแปร filterRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const filterRow=stagingCursor,spacerRow=stagingCursor+1,valuesRow=stagingCursor+2,headerRow=stagingCursor+3,grandRow=stagingCursor+4;
// [L1402] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    rows.push(reportRowXml(filterRow,reportStyledCells(filterRow,['สถานะไม่ issue',block.status,'',''],filterStyles),{hidden:true}));
// [L1403] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    rows.push(reportRowXml(spacerRow,reportStyledCells(spacerRow,['','','',''],valuesStyles),{hidden:true}));
// [L1404] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    rows.push(reportRowXml(valuesRow,reportStyledCells(valuesRow,['','','Values',''],valuesStyles),{hidden:true}));
// [L1405] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    rows.push(reportRowXml(headerRow,reportStyledCells(headerRow,['Date','จำนวนวันที่ยังไม่ออกกรมธรรม์','Count of Policy','ผลรวม'],headerStyles),{hidden:true}));
// [L1406] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    rows.push(reportRowXml(grandRow,reportStyledCells(grandRow,['Grand Total','',0,0],grandStyles,[2,3]),{hidden:true}));
// [L1407] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    layouts.hiddenSections.push({...block,filterRow,spacerRow,valuesRow,headerRow,grandRow,ref:`A${valuesRow}:D${grandRow}`,groups:[],subset:[],hidden:true});
// [L1408] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    stagingCursor=grandRow+1;
// [L1409] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L1410] ประกาศตัวแปร dimensionLastRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const dimensionLastRow=Math.max(visibleLastRow,stagingCursor-1);
// [L1411] ประกาศตัวแปร output แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let output=replaceWorksheetData(sourceXml,rows.join(''),`A1:D${dimensionLastRow}`);
// [L1412] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  output=patchMergeCells(output,merges);
// [L1413] กำหนด handler/ฟังก์ชันให้ output เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง
  output=output.replace(/(<sheetView\b[^>]*)(>)/,(_,attrs,end)=>{let next=attrs.replace(/\s+topLeftCell="[^"]*"/,'').replace(/\s+zoomScale="[^"]*"/,' zoomScale="90"').replace(/\s+zoomScaleNormal="[^"]*"/,' zoomScaleNormal="90"');return`${next} topLeftCell="A1"${end}`;}).replace(/<selection\b[^>]*\/>/,'<selection activeCell="A1" sqref="A1"/>');
// [L1414] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{xml:output,layouts,lastRow:visibleLastRow,dimensionLastRow};
// [L1415] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1416] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L1417] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ปรับตำแหน่ง pivot location ref
// [L1418] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1419] ประกาศฟังก์ชัน patchPivotLocation เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function patchPivotLocation(xml,ref){
// [L1420] ประกาศตัวแปร output แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let output=xml.replace(/(<location\b[^>]*\bref=")[^"]*(")/,'$1'+ref+'$2');
// [L1421] กำหนด handler/ฟังก์ชันให้ output เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง
  output=output.replace(/<pivotTableDefinition\b([^>]*)>/,(_,attrs)=>{let next=attrs.replace(/\s+refreshDataOnOpen="[^"]*"/g,'');for(const [name,value] of [['enableDrill','1'],['showDrill','1'],['preserveFormatting','1']]){const pattern=new RegExp(`\\s${name}="[^"]*"`);next=pattern.test(next)?next.replace(pattern,` ${name}="${value}"`):next+` ${name}="${value}"`;}return`<pivotTableDefinition${next}>`;});
// [L1422] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return output;
// [L1423] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1424] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: patch package ของ PV pivot ให้ชี้ข้อมูลใหม่
// [L1425] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1426] ประกาศฟังก์ชัน patchPvPivotPackage เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function patchPvPivotPackage(zip,sheetPath,sourceXml,context,dateStyleMap){
// [L1427] ประกาศตัวแปร pvResult แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const pvResult=buildPvSheetXml(sourceXml,context,dateStyleMap),relsPath=worksheetRelsPath(sheetPath),relsFile=zip.file(relsPath);
// [L1428] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(relsFile){
// [L1429] ประกาศตัวแปร relsXml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const relsXml=await relsFile.async('string'),relation=(relsXml.match(/<Relationship\b[^>]*\/>/g)||[]).find(tag=>/\/pivotTable"/.test(tag));
// [L1430] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(relation){
// [L1431] ประกาศตัวแปร target แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
      const target=normalizeZipPath(sheetPath,attrFromTag(relation,'Target')),file=zip.file(target);
// [L1432] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
      if(file)zip.file(target,patchPivotLocation(await file.async('string'),pvResult.locationRef));
// [L1433] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
    }
// [L1434] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L1435] ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache
  zip.file(sheetPath,pvResult.xml);return pvResult;
// [L1436] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1437] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อ่าน row เริ่มต้นเดิมของ pivot location
// [L1438] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1439] ประกาศฟังก์ชัน pivotOriginalStartRow เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function pivotOriginalStartRow(xml){const match=xml.match(/<location\b[^>]*\bref="[A-Z]+(\d+):/);return match?Number(match[1]):0;}
// [L1440] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: patch Report pivot package ทั้ง worksheet, cache และ definitions
// [L1441] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1442] ประกาศฟังก์ชัน patchReportPivotPackage เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function patchReportPivotPackage(zip,sheetPath,sourceXml,context,summary,contentTypesXml,dateStyleMap={},snapshot=null){
// [L1443] ประกาศตัวแปร reportSnapshot แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const reportSnapshot=snapshot||buildReportPivotCacheSnapshot(pvFinalDisplayRows(context)),reportResult=buildCompactReportSheetXml(sourceXml,context,summary,dateStyleMap),relsPath=worksheetRelsPath(sheetPath),relsFile=zip.file(relsPath);let relsXml=relsFile?await relsFile.async('string'):'';
// [L1444] ประกาศตัวแปร relationTags แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const relationTags=relsXml.match(/<Relationship\b[^>]*\/>/g)||[],pivotRelations=[],filterMetadata=[];
// [L1445] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const tag of relationTags){
// [L1446] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!/\/pivotTable"/.test(tag))continue;
// [L1447] ประกาศตัวแปร target แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const target=normalizeZipPath(sheetPath,attrFromTag(tag,'Target')),file=zip.file(target);if(!file)continue;
// [L1448] ประกาศตัวแปร xml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const xml=await file.async('string'),pivotName=attrFromTag((xml.match(/<pivotTableDefinition\b[^>]*>/)||[])[0]||'','name');
// [L1449] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    pivotRelations.push({tag,id:attrFromTag(tag,'Id'),target,xml,name:pivotName,start:pivotOriginalStartRow(xml)});
// [L1450] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L1451] สร้างตัวช่วยแบบ arrow function ชื่อ agingRelation เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const agingRelation=pivotRelations.find(item=>item.name==='PivotTable2')||pivotRelations.find(item=>item.start===7);
// [L1452] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!agingRelation)throw new Error('BW-PIVOT-TABLE-002: ไม่พบ PivotTable2 สำหรับ Aging Report');
// [L1453] ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache
  zip.file(agingRelation.target,buildAgingPivotTableDefinition(agingRelation.xml,reportResult.layouts.aging,reportSnapshot));
// [L1454] ประกาศตัวแปร statusLayouts แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const statusLayouts=[...reportResult.layouts.sections,...reportResult.layouts.hiddenSections];
// [L1455] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const relation of pivotRelations){
// [L1456] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(relation===agingRelation)continue;
// [L1457] สร้างตัวช่วยแบบ arrow function ชื่อ layout เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
    const layout=statusLayouts.find(item=>item.pivotName===relation.name)||statusLayouts.find(item=>item.originalPivotRow===relation.start);
// [L1458] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!layout)throw new Error(`BW-REPORT-FILTER-005: ไม่พบ Layout สำหรับ Pivot เดิมแถว ${relation.start}`);
// [L1459] ประกาศตัวแปร rebuilt แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const rebuilt=buildStatusPivotTableDefinition(relation.xml,layout,reportSnapshot);
// [L1460] ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache
    zip.file(relation.target,rebuilt.xml);
// [L1461] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    filterMetadata.push({pivotPath:relation.target,status:layout.status,item:rebuilt.statusIndex,location:layout.ref,pageRow:layout.filterRow,hiddenEndRow:layout.grandRow,hidden:!!layout.hidden});
// [L1462] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L1463] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
  filterMetadata.sort((left,right)=>REPORT_STATUS_ORDER.indexOf(left.status)-REPORT_STATUS_ORDER.indexOf(right.status));
// [L1464] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(filterMetadata.length!==REPORT_BLOCKS.length)throw new Error(`BW-REPORT-FILTER-004: Pivot Filter Metadata ${filterMetadata.length}/${REPORT_BLOCKS.length}`);
// [L1465] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(relsFile)zip.file(relsPath,relsXml);zip.file(sheetPath,reportResult.xml);
// [L1466] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{...reportResult,contentTypesXml,statusItems:reportSnapshot.statusItems,filterMetadata,snapshot:reportSnapshot};
// [L1467] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1468] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L1469] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ตั้ง print area ของ Report ให้พอดีกับแถวจริง
// [L1470] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1471] ประกาศฟังก์ชัน patchReportPrintArea เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function patchReportPrintArea(workbookXml,lastRow){
// [L1472] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return workbookXml.replace(/(<definedName\b[^>]*name="_xlnm\.Print_Area"[^>]*>)([^<]*Report[^<]*)(<\/definedName>)/g,(_,open,value,close)=>`${open}'Report'!$A$1:$D$${lastRow}${close}`);
// [L1473] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1474] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L1475] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อัปเดต pivotCacheDefinition ให้ชี้ source range และ record count ใหม่
// [L1476] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1477] ประกาศฟังก์ชัน patchPivotCacheSavedData เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function patchPivotCacheSavedData(xml,{sourceRange='',recordCount=null,refreshOnLoad='0'}={}){
// [L1478] สร้างตัวช่วยแบบ arrow function ชื่อ output เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  let output=xml.replace(/<pivotCacheDefinition\b([^>]*)>/,(_,attrs)=>{
// [L1479] ประกาศตัวแปร next แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    let next=attrs;for(const [name,value] of [['refreshOnLoad',refreshOnLoad],['enableRefresh','1'],['backgroundQuery','0'],['saveData','1']])next=upsertXmlAttribute(next,name,value);
// [L1480] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!/\sr:id="[^"]+"/.test(next))next=upsertXmlAttribute(next,'r:id','rId1');
// [L1481] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(recordCount!==null)next=upsertXmlAttribute(next,'recordCount',String(recordCount));
// [L1482] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
    return`<pivotCacheDefinition${next}>`;
// [L1483] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  });
// [L1484] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(sourceRange)output=output.replace(/(<worksheetSource\b[^>]*\bref=")[^"]*(")/,'$1'+sourceRange+'$2');
// [L1485] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return output;
// [L1486] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1487] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง/ปรับ pivotCacheDefinition สำหรับ Report
// [L1488] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1489] ประกาศฟังก์ชัน buildReportPivotCacheDefinition เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function buildReportPivotCacheDefinition(xml,rows,snapshot=null){
// [L1490] ประกาศตัวแปร reportSnapshot แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const reportSnapshot=snapshot||buildReportPivotCacheSnapshot(rows),outputBase=patchPivotCacheSavedData(xml,{recordCount:reportSnapshot.recordCount});
// [L1491] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!/<cacheFields\b[^>]*>[\s\S]*?<\/cacheFields>/.test(outputBase))throw new Error('BW-PIVOT-CACHE-002: Report Pivot Cache ไม่มี cacheFields');
// [L1492] ประกาศตัวแปร output แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const output=outputBase.replace(/<cacheFields\b[^>]*>[\s\S]*?<\/cacheFields>/,reportSnapshot.cacheFieldsXml);
// [L1493] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{xml:output,...reportSnapshot};
// [L1494] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1495] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ดึง pivotField blocks จาก XML เพื่อ validation
// [L1496] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1497] ประกาศฟังก์ชัน pivotFieldBlocks เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function pivotFieldBlocks(xml){const container=(xml.match(/<pivotFields\b[^>]*>[\s\S]*?<\/pivotFields>/)||[])[0]||'';return container.match(/<pivotField\b[^>]*?(?:\/>|>[\s\S]*?<\/pivotField>)/g)||[];}
// [L1498] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อ่าน references ของ item ใน pivotField
// [L1499] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1500] ประกาศฟังก์ชัน pivotItemReferences เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function pivotItemReferences(block){return[...(block.matchAll(/<item\b[^>]*\bx="(\d+)"[^>]*\/>/g))].map(match=>Number(match[1]));}
// [L1501] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อ่าน item references ใน rowItems
// [L1502] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1503] ประกาศฟังก์ชัน rowItemReferences เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function rowItemReferences(xml){return[...(xml.matchAll(/<rowItems\b[^>]*>[\s\S]*?<\/rowItems>/g))].flatMap(match=>[...match[0].matchAll(/<x\b[^>]*\bv="(\d+)"[^>]*\/>/g)].map(item=>Number(item[1])));}
// [L1504] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ตรวจ semantic ของ Report pivot ว่า cache/items/reference สอดคล้อง
// [L1505] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1506] ประกาศฟังก์ชัน validateReportPivotSemanticPackage เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function validateReportPivotSemanticPackage(zip,snapshot){
// [L1507] ประกาศตัวแปร failures แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const failures=[],expectedCounts=snapshot.shared.map(field=>field.items.length),pivotPaths=Object.keys(zip.files).filter(name=>/^xl\/pivotTables\/pivotTable[2-6]\.xml$/.test(name)).sort();
// [L1508] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(pivotPaths.length!==5)failures.push(`Report Pivot files ${pivotPaths.length}/5`);
// [L1509] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const path of pivotPaths){
// [L1510] ประกาศตัวแปร xml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const xml=await zip.file(path).async('string'),fields=pivotFieldBlocks(xml),name=attrFromTag((xml.match(/<pivotTableDefinition\b[^>]*>/)||[])[0]||'','name');
// [L1511] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(fields.length!==expectedCounts.length){failures.push(`${name||path}: pivotFields ${fields.length}/${expectedCounts.length}`);continue;}
// [L1512] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
    fields.forEach((field,index)=>{
// [L1513] ประกาศตัวแปร references แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
      const references=pivotItemReferences(field);
// [L1514] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
      if(references.length&&references.length!==expectedCounts[index])failures.push(`${name}: field ${index} items ${references.length}/${expectedCounts[index]}`);
// [L1515] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
      if(new Set(references).size!==references.length)failures.push(`${name}: field ${index} item x ซ้ำ`);
// [L1516] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
      if(references.some(value=>value<0||value>=expectedCounts[index]))failures.push(`${name}: field ${index} item x เกิน Cache`);
// [L1517] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
    });
// [L1518] ประกาศตัวแปร page แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const page=(xml.match(/<pageField\b[^>]*\bfld="5"[^>]*\bitem="(\d+)"[^>]*\/>/)||[])[1];
// [L1519] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(name!=='PivotTable2'&&(page===undefined||Number(page)>=expectedCounts[5]))failures.push(`${name}: page filter ไม่ตรง Status Cache`);
// [L1520] สร้างตัวช่วยแบบ arrow function ชื่อ refs เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
    const refs=rowItemReferences(xml);if(refs.some(value=>!Number.isInteger(value)||value<0))failures.push(`${name}: rowItems index ไม่ถูกต้อง`);
// [L1521] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!/\benableDrill="1"/.test(xml)||!/\bshowDrill="1"/.test(xml))failures.push(`${name}: Drill-down ไม่ได้เปิด`);
// [L1522] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L1523] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(failures.length)throw new Error(`BW-PIVOT-SEMANTIC-001: ${failures.join('; ')}`);
// [L1524] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{ok:true,pivotCount:pivotPaths.length,cacheFieldCounts:expectedCounts.join(',')};
// [L1525] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1526] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อ่านเลข row ที่ถูกซ่อนใน worksheet XML
// [L1527] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1528] ประกาศฟังก์ชัน worksheetHiddenRowSet เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function worksheetHiddenRowSet(xml){
// [L1529] ประกาศตัวแปร hidden แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const hidden=new Set();
// [L1530] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const match of xml.matchAll(/<row\b[^>]*>/g)){
// [L1531] ประกาศตัวแปร row แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const row=Number(attrFromTag(match[0],'r'));
// [L1532] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(row&&attrFromTag(match[0],'hidden')==='1')hidden.add(row);
// [L1533] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L1534] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return hidden;
// [L1535] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1536] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อ่าน rows ที่ pivot table วางอยู่
// [L1537] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1538] ประกาศฟังก์ชัน pivotLocationRows เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function pivotLocationRows(xml){
// [L1539] ประกาศตัวแปร tag แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const tag=(xml.match(/<location\b[^>]*\bref="[^"]+"[^>]*\/>/)||[])[0]||'',ref=attrFromTag(tag,'ref'),match=ref.match(/^[A-Z]+(\d+):[A-Z]+(\d+)$/);
// [L1540] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return match?{ref,start:Number(match[1]),end:Number(match[2])}:null;
// [L1541] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1542] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ตรวจว่า staging rows ที่ใช้ feed pivot ถูกซ่อนจริงและไม่ชน report
// [L1543] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1544] ประกาศฟังก์ชัน validateHiddenReportPivotStaging เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function validateHiddenReportPivotStaging(zip,sheetPath,reportPackage){
// [L1545] ประกาศตัวแปร sheetFile แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const sheetFile=zip.file(sheetPath);if(!sheetFile)throw new Error('BW-REPORT-HIDDEN-001: ไม่พบ Report Worksheet');
// [L1546] ประกาศตัวแปร sheetXml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const sheetXml=await sheetFile.async('string'),hiddenRows=worksheetHiddenRowSet(sheetXml),failures=[];
// [L1547] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const item of reportPackage.filterMetadata){
// [L1548] ประกาศตัวแปร pivotFile แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const pivotFile=zip.file(item.pivotPath);if(!pivotFile){failures.push(`${item.status}: ไม่พบ PivotTable XML`);continue;}
// [L1549] ประกาศตัวแปร pivotXml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const pivotXml=await pivotFile.async('string'),location=pivotLocationRows(pivotXml);
// [L1550] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!location){failures.push(`${item.status}: ไม่พบ Pivot location`);continue;}
// [L1551] ประกาศตัวแปร actualPageRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const actualPageRow=location.start-2;
// [L1552] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(actualPageRow!==Number(item.pageRow))failures.push(`${item.status}: Page Filter row ${actualPageRow}/${item.pageRow}`);
// [L1553] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!hiddenRows.has(actualPageRow))failures.push(`${item.status}: Page Filter row ${actualPageRow} ไม่ถูกซ่อน`);
// [L1554] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(item.hidden){
// [L1555] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
      if(actualPageRow<=reportPackage.lastRow)failures.push(`${item.status}: Hidden staging อยู่ในพื้นที่ Report ที่มองเห็น`);
// [L1556] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
      for(let row=actualPageRow;row<=location.end;row++)if(!hiddenRows.has(row))failures.push(`${item.status}: Hidden staging row ${row} ไม่ถูกซ่อน`);
// [L1557] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
    }
// [L1558] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L1559] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(failures.length)throw new Error(`BW-REPORT-HIDDEN-001: ${failures.join('; ')}`);
// [L1560] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{ok:true,statusPivotCount:reportPackage.filterMetadata.length,hiddenPivotCount:reportPackage.filterMetadata.filter(item=>item.hidden).length};
// [L1561] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1562] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เขียน pivotCacheRecords XML กลับเข้า zip
// [L1563] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1564] ประกาศฟังก์ชัน writePivotCacheRecords เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function writePivotCacheRecords(zip,cachePath,recordsXml){
// [L1565] ประกาศตัวแปร relations แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const relations=await relationshipTargets(zip,cachePath,'/pivotCacheRecords');
// [L1566] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(relations.length!==1)throw new Error(`BW-PIVOT-CACHE-003: ${cachePath} ต้องมี Pivot Cache Records 1 ตัว`);
// [L1567] ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache
  zip.file(relations[0].target,recordsXml);return relations[0].target;
// [L1568] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1569] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เปิดคุณสมบัติ drill-down ของ pivot XML
// [L1570] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1571] ประกาศฟังก์ชัน enablePivotDrill เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function enablePivotDrill(xml){return xml.replace(/<pivotTableDefinition\b([^>]*)>/,(_,attrs)=>{let next=attrs;for(const [name,value] of [['enableDrill','1'],['showDrill','1'],['preserveFormatting','1']]){const pattern=new RegExp(`\\s${name}="[^"]*"`);next=pattern.test(next)?next.replace(pattern,` ${name}="${value}"`):next+` ${name}="${value}"`;}return`<pivotTableDefinition${next}>`;});}
// [L1572] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง XML ของ _Audit sheet สำหรับ template preserving path
// [L1573] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1574] ประกาศฟังก์ชัน buildAuditSheetXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function buildAuditSheetXml(summary,removedRows=[]){
// [L1575] สร้างตัวช่วยแบบ arrow function ชื่อ data เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const data=[['Key','Value'],...Object.entries(summary),[],['REMOVED ISSUED ROWS',''],['ProposalID','Source'],...(removedRows||[]).map(row=>[row.ProposalID,row.DataSource||''])];
// [L1576] สร้างตัวช่วยแบบ arrow function ชื่อ rows เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const rows=data.map((values,index)=>{const row=index+1,cells=values.map((value,column)=>{const reference=`${columnName(column)}${row}`;return typeof value==='number'?xmlNumberCell(reference,value,'0'):xmlTextCell(reference,value,'0');}).join('');return`<row r="${row}" spans="1:2">${cells}</row>`;}).join('');
// [L1577] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><dimension ref="A1:B${Math.max(1,data.length)}"/><sheetViews><sheetView workbookViewId="0"/></sheetViews><sheetFormatPr defaultRowHeight="15"/><cols><col min="1" max="1" width="42" customWidth="1"/><col min="2" max="2" width="68" customWidth="1"/></cols><sheetData>${rows}</sheetData><pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/></worksheet>`;
// [L1578] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1579] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เพิ่มหรืออัปเดต _Audit sheet ใน xlsx zip package
// [L1580] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1581] ประกาศฟังก์ชัน ensureAuditSheet เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function ensureAuditSheet(zip,workbookXml,workbookRelsXml,contentTypesXml,summary,removedRows){
// [L1582] ประกาศตัวแปร tags แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const tags=workbookXml.match(/<sheet\b[^>]*\/>/g)||[],existing=tags.find(tag=>attrFromTag(tag,'name')==='_Audit');let sheetPath='';
// [L1583] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(existing){const relationId=attrFromTag(existing,'r:id'),relation=(workbookRelsXml.match(/<Relationship\b[^>]*\/>/g)||[]).find(tag=>attrFromTag(tag,'Id')===relationId);sheetPath=relation?normalizeZipPath('xl/workbook.xml',attrFromTag(relation,'Target')):'';if(!/\bstate=/.test(existing))workbookXml=workbookXml.replace(existing,existing.replace('/>',' state="hidden"/>'));}
// [L1584] ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข
  else{
// [L1585] สร้างตัวช่วยแบบ arrow function ชื่อ sheetIds เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
    const sheetIds=tags.map(tag=>Number(attrFromTag(tag,'sheetId'))||0),nextSheetId=Math.max(0,...sheetIds)+1;
// [L1586] ประกาศตัวแปร relationIds แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const relationIds=(workbookRelsXml.match(/Id="rId(\d+)"/g)||[]).map(value=>Number((value.match(/\d+/)||[])[0])||0),nextRelationId=`rId${Math.max(0,...relationIds)+1}`;
// [L1587] สร้างตัวช่วยแบบ arrow function ชื่อ sheetNumbers เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
    const sheetNumbers=Object.keys(zip.files).map(name=>(name.match(/^xl\/worksheets\/sheet(\d+)\.xml$/)||[])[1]).filter(Boolean).map(Number),nextSheetNumber=Math.max(0,...sheetNumbers)+1;sheetPath=`xl/worksheets/sheet${nextSheetNumber}.xml`;
// [L1588] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    workbookXml=workbookXml.replace('</sheets>',`<sheet name="_Audit" sheetId="${nextSheetId}" state="hidden" r:id="${nextRelationId}"/></sheets>`);
// [L1589] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    workbookRelsXml=workbookRelsXml.replace('</Relationships>',`<Relationship Id="${nextRelationId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${nextSheetNumber}.xml"/></Relationships>`);
// [L1590] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!contentTypesXml.includes(`PartName="/${sheetPath}"`))contentTypesXml=contentTypesXml.replace('</Types>',`<Override PartName="/${sheetPath}" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`);
// [L1591] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L1592] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(sheetPath)zip.file(sheetPath,buildAuditSheetXml(summary,removedRows));
// [L1593] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{workbookXml,workbookRelsXml,contentTypesXml};
// [L1594] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1595] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ตรวจยอด PV/PV Final/Report ให้ reconcile กันก่อนส่งไฟล์ออก
// [L1596] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1597] ประกาศฟังก์ชัน assertPvReportReconciliation เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function assertPvReportReconciliation(context,summary,pvResult,pvFinalResult,reportPackage){
// [L1598] ประกาศตัวแปร expected แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const expected=pvFinalDisplayRows(context),expectedPremium=expected.reduce((total,row)=>total+number(row[8]),0),agingCount=(reportPackage.layouts.aging.groups||[]).reduce((total,row)=>total+number(row[2]),0),sectionCount=(reportPackage.layouts.sections||[]).reduce((total,item)=>total+item.subset.length,0),sectionPremium=(reportPackage.layouts.sections||[]).reduce((total,item)=>total+sum(item.subset,'TotalPremium'),0);
// [L1599] ประกาศตัวแปร failures แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const failures=[];
// [L1600] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(pvResult.rows.length!==expected.length)failures.push(`PV ${pvResult.rows.length}/${expected.length}`);
// [L1601] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(pvFinalResult.rows.length!==expected.length)failures.push(`PV Final ${pvFinalResult.rows.length}/${expected.length}`);
// [L1602] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(agingCount!==expected.length)failures.push(`Report Aging ${agingCount}/${expected.length}`);
// [L1603] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(sectionCount!==expected.length)failures.push(`Report Block ${sectionCount}/${expected.length}`);
// [L1604] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(Math.abs(expectedPremium-number(summary.TotalPremium))>.001)failures.push(`PV Premium ${expectedPremium}/${summary.TotalPremium}`);
// [L1605] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(Math.abs(sectionPremium-number(summary.TotalPremium))>.001)failures.push(`Report Premium ${sectionPremium}/${summary.TotalPremium}`);
// [L1606] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(failures.length)throw new Error(`PV / PV Final / Report Reconciliation ไม่ผ่าน: ${failures.join(', ')}`);
// [L1607] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1608] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้าง Master โดย patch จาก template เพื่อรักษา native pivot/drill-down
// [L1609] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1610] ประกาศฟังก์ชัน buildPivotPreservingMaster เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function buildPivotPreservingMaster(templateBuffer,context,summary){
// [L1611] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!global.JSZip||!templateBuffer)throw new Error('Pivot Template Engine ไม่พร้อมใช้งาน');
// [L1612] ประกาศตัวแปร zip แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const zip=await global.JSZip.loadAsync(templateBuffer);if(!pivotTemplateRequiredFiles(zip))throw new Error('Master ไม่มี Pivot Template PV/Report ตามโครงสร้าง V2.5.3');
// [L1613] ประกาศตัวแปร workbookXml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let workbookXml=await zip.file('xl/workbook.xml').async('string'),workbookRelsXml=await zip.file('xl/_rels/workbook.xml.rels').async('string'),contentTypesXml=await zip.file('[Content_Types].xml').async('string'),stylesXml=await zip.file('xl/styles.xml').async('string');
// [L1614] ประกาศตัวแปร sheetPaths แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const sheetPaths={data:worksheetPathByName(workbookXml,workbookRelsXml,'Data'),sm:worksheetPathByName(workbookXml,workbookRelsXml,'ข้อมูลไม่สมบูรณ์'),blacklist:worksheetPathByName(workbookXml,workbookRelsXml,'Black List'),pv:worksheetPathByName(workbookXml,workbookRelsXml,'PV'),pvFinal:worksheetPathByName(workbookXml,workbookRelsXml,'PV Final'),report:worksheetPathByName(workbookXml,workbookRelsXml,'Report')};
// [L1615] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(Object.values(sheetPaths).some(value=>!value))throw new Error('Master Pivot Template ขาด Sheet Data / PV / PV Final / Report');
// [L1616] ประกาศตัวแปร dataXml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const dataXml=await zip.file(sheetPaths.data).async('string'),smXml=await zip.file(sheetPaths.sm).async('string'),blacklistXml=await zip.file(sheetPaths.blacklist).async('string'),pvXml=await zip.file(sheetPaths.pv).async('string'),pvFinalXml=await zip.file(sheetPaths.pvFinal).async('string'),reportXml=await zip.file(sheetPaths.report).async('string');
// [L1617] ประกาศตัวแปร dateBases แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const dateBases=[xmlCellStyle(pvXml,'A5','0'),xmlCellStyle(pvFinalXml,'A2','0'),xmlCellStyle(reportXml,'A25','0'),xmlCellStyle(reportXml,'A56','0'),xmlCellStyle(reportXml,'A136','0'),xmlCellStyle(reportXml,'A172','0')],dateStyles=ensureDateStyleMap(stylesXml,dateBases);stylesXml=dateStyles.xml;zip.file('xl/styles.xml',stylesXml);
// [L1618] ประกาศตัวแปร dataResult แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const dataResult=buildDataSheetXml(dataXml,context),smResult=buildControlSheetXml(smXml,'ข้อมูลไม่สมบูรณ์',context.smIds),blacklistResult=buildControlSheetXml(blacklistXml,'Blacklist',context.blIds),pvFinalResult=buildPvFinalSheetXml(pvFinalXml,context,dateStyles.map);
// [L1619] ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache
  zip.file(sheetPaths.data,dataResult.xml);zip.file(sheetPaths.sm,smResult.xml);zip.file(sheetPaths.blacklist,blacklistResult.xml);zip.file(sheetPaths.pvFinal,pvFinalResult.xml);
// [L1620] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const [sheetPath,range] of [[sheetPaths.data,dataResult.range],[sheetPaths.sm,smResult.range],[sheetPaths.blacklist,blacklistResult.range],[sheetPaths.pvFinal,pvFinalResult.range]]){const tablePath=await tablePathForWorksheet(zip,sheetPath);if(tablePath&&zip.file(tablePath)){const tableXml=await zip.file(tablePath).async('string');zip.file(tablePath,updateTableRange(tableXml,range));}}
// [L1621] ประกาศตัวแปร pvResult แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const pvResult=await patchPvPivotPackage(zip,sheetPaths.pv,pvXml,context,dateStyles.map),reportSnapshot=buildReportPivotCacheSnapshot(pvFinalResult.rows);
// [L1622] ประกาศตัวแปร reportPackage แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const reportPackage=await patchReportPivotPackage(zip,sheetPaths.report,reportXml,context,summary,contentTypesXml,dateStyles.map,reportSnapshot);contentTypesXml=reportPackage.contentTypesXml;workbookXml=patchReportPrintArea(workbookXml,reportPackage.lastRow);
// [L1623] ประกาศตัวแปร hiddenStagingInspection แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const hiddenStagingInspection=await validateHiddenReportPivotStaging(zip,sheetPaths.report,reportPackage);
// [L1624] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  assertPvReportReconciliation(context,summary,pvResult,pvFinalResult,reportPackage);
// [L1625] สร้างตัวช่วยแบบ arrow function ชื่อ cacheDefinitions เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const cacheDefinitions=Object.keys(zip.files).filter(name=>/^xl\/pivotCache\/pivotCacheDefinition\d+\.xml$/.test(name));let reportCacheRecordsPath='';
// [L1626] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const name of cacheDefinitions){
// [L1627] ประกาศตัวแปร xml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const xml=await zip.file(name).async('string'),isDataCache=/<worksheetSource\b[^>]*\bsheet="Data"/.test(xml),isReportCache=/<worksheetSource\b[^>]*\bname="Table15"/.test(xml);
// [L1628] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(isDataCache){zip.file(name,patchPivotCacheSavedData(xml,{sourceRange:dataResult.range}));continue;}
// [L1629] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(isReportCache){const rebuilt=buildReportPivotCacheDefinition(xml,pvFinalResult.rows,reportSnapshot);zip.file(name,rebuilt.xml);reportCacheRecordsPath=await writePivotCacheRecords(zip,name,rebuilt.recordsXml);continue;}
// [L1630] ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache
    zip.file(name,patchPivotCacheSavedData(xml));
// [L1631] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L1632] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!reportCacheRecordsPath)throw new Error('BW-PIVOT-CACHE-004: ไม่พบ Report Pivot Cache Records');
// [L1633] ประกาศตัวแปร semanticInspection แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const semanticInspection=await validateReportPivotSemanticPackage(zip,reportSnapshot);
// [L1634] สร้างตัวช่วยแบบ arrow function ชื่อ pivotTables เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const pivotTables=Object.keys(zip.files).filter(name=>/^xl\/pivotTables\/pivotTable\d+\.xml$/.test(name));for(const name of pivotTables)zip.file(name,enablePivotDrill(await zip.file(name).async('string')));
// [L1635] ประกาศตัวแปร strictInspection แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const strictInspection=await inspectPivotTemplateZip(zip,{mode:'output',expectedReportPivotCount:5});
// [L1636] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!strictInspection.ok)throw new Error(`BW-PIVOT-001: ${strictInspection.message}`);
// [L1637] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
  summary.PivotStructuralValidation='PASSED_STRICT_REUSABLE_MASTER';summary.PivotSemanticValidation='PASSED_CACHE_FIELDS_RECORDS_PIVOT_ITEMS';summary.PivotSemanticDetails=semanticInspection.cacheFieldCounts;summary.ReportHiddenPivotStagingValidation=`PASSED_${hiddenStagingInspection.hiddenPivotCount}_HIDDEN`;summary.MasterReusableAsNextRun='YES';summary.PivotCacheMode='SAVED_UNDERLYING_DATA__NO_AUTO_REFRESH';summary.ExcelFinalizerRequired='NO';summary.ReportPivotCount=strictInspection.details.reportPivotCount;summary.ReportDownloadSnapshot='SOP_STATUS_BLOCKS_CORRECT_NO_VISIBLE_STAGING';summary.ReportUnderlyingData='SAVED';summary.ReportFilterMetadata=reportPackage.filterMetadata.map(item=>`${item.status}@${item.item}`).join('; ');
// [L1638] ประกาศตัวแปร audit แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const audit=ensureAuditSheet(zip,workbookXml,workbookRelsXml,contentTypesXml,summary,context.removedRows);workbookXml=audit.workbookXml;workbookRelsXml=audit.workbookRelsXml;contentTypesXml=audit.contentTypesXml;
// [L1639] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(zip.file('xl/calcChain.xml'))zip.remove('xl/calcChain.xml');workbookRelsXml=workbookRelsXml.replace(/<Relationship\b[^>]*Type="[^"]*\/calcChain"[^>]*\/>/g,'');contentTypesXml=contentTypesXml.replace(/<Override\b[^>]*PartName="\/xl\/calcChain\.xml"[^>]*\/>/g,'');
// [L1640] ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache
  zip.file('xl/workbook.xml',workbookXml);zip.file('xl/_rels/workbook.xml.rels',workbookRelsXml);zip.file('[Content_Types].xml',contentTypesXml);
// [L1641] ประกาศตัวแปร bytes แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const bytes=await zip.generateAsync({type:'uint8array',compression:'DEFLATE',compressionOptions:{level:6}});return new Blob([bytes],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
// [L1642] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1643] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L1644] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้างรหัส Run เช่น BWyyyymmdd_HHMMSS
// [L1645] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1646] ประกาศฟังก์ชัน makeRunId เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function makeRunId(now=new Date()){return`BW${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;}
// [L1647] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: สร้างชื่อไฟล์ output ตาม base name และวันที่รัน
// [L1648] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1649] ประกาศฟังก์ชัน outputNames เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function outputNames(processedAt){const runDate=dateKey(processedAt);return{master:`${safeFileName(CONFIG.masterBaseName)}_${runDate}.xlsx`,issue:`${safeFileName(CONFIG.issueBaseName)}_${runDate}.xlsx`,report:`Report_${runDate}.png`};}
// [L1650] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L1651] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ตรวจความพร้อมของไฟล์ ข้อมูล วันที่ และ template ก่อนรันจริง
// [L1652] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1653] ประกาศฟังก์ชัน preflight เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function preflight(workbooks,files,etlText='',manualStartDate=''){
// [L1654] ประกาศตัวแปร results แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const results=[];
// [L1655] ประกาศตัวแปร master แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const master=findSheet(workbooks.master,['Data'],['ProposalID','CreateDate']);
// [L1656] ประกาศตัวแปร masterInfo แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const masterInfo=extractMasterMaxDate(workbooks.master);
// [L1657] ประกาศตัวแปร masterIdentity แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const masterIdentity=master?analyzeStableDuplicateRows(extractMasterData(workbooks.master).rows):{duplicateKeys:0,duplicateRows:0,extraRows:0};
// [L1658] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  results.push({field:'master',name:files.master?.name||'Master',ok:!!master,message:master?`พบ Sheet ${master.name}; Header row ${master.rowIndex+1}; Date(T) ที่อ่านได้ ${masterInfo.validRows} แถว`:'ไม่พบ ProposalID และ CreateDate ใน Sheet Data'});
// [L1659] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(master)results.push({field:'masterIdentity',name:'Stable Record Identity',ok:true,message:masterIdentity.extraRows?`พบแถวซ้ำจากรอบก่อน ${masterIdentity.extraRows} แถว ระบบจะรวมอัตโนมัติด้วย CertificateNo หรือ alienCode + ProposalID โดยคง Date เดิมที่เก่าที่สุด`:'ไม่พบแถวซ้ำตาม Stable Record Identity ใน Master'});
// [L1660] ประกาศตัวแปร sourceVersion แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const sourceVersion=masterEngineVersion(workbooks.master);
// [L1661] ประกาศตัวแปร unsafeVersion แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const unsafeVersion=sourceVersion==='3.5.1'||sourceVersion==='3.5.2';
// [L1662] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  results.push({field:'masterVersion',name:'Master Version',ok:!unsafeVersion,message:unsafeVersion?`ห้ามใช้ Master V${sourceVersion} ต่อ เพราะเป็นรุ่นที่ Status/PV เคยคำนวณผิด กรุณากลับไปใช้ไฟล์ Manual V2.5.3 ที่ถูกต้อง หรือ Master V3.5.4 ขึ้นไป`:sourceVersion?`Master Engine Version: ${sourceVersion}`:'Master Legacy/Manual: อนุญาตให้ใช้เป็นฐานเริ่มต้น'});
// [L1663] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(workbooks.master?.__sourceBuffer&&['PV','PV Final','Report'].every(name=>workbooks.master.SheetNames?.includes(name))){const uploadedOutput=await inspectPivotTemplateBuffer(workbooks.master.__sourceBuffer,{mode:'output'}),uploadedTemplateOk=await inspectPivotTemplate(workbooks.master),bundledOk=!!(await loadBundledPivotTemplate()),pivotTemplateOk=uploadedTemplateOk||bundledOk;const dynamicCount=uploadedOutput.ok?uploadedOutput.details.reportPivotCount:0;results.push({field:'pivotTemplate',name:'PV / PV Final / Report',ok:pivotTemplateOk,message:uploadedTemplateOk?'Master ใช้ซ้ำได้เต็มรูปแบบ: PV 1 + Report 5 + Cache 2':uploadedOutput.ok&&bundledOk?`Master Output ใช้เป็นข้อมูลต่อได้ (${dynamicCount} Report Pivot) และระบบจะใช้ Clean Template V2.5.3 สร้าง Pivot รอบใหม่อัตโนมัติ`:bundledOk?'Master Data ใช้ต่อได้ และระบบจะใช้ Clean Template V2.5.3 สร้าง Pivot รอบใหม่อัตโนมัติ':'ไม่พบ Clean Pivot Template สำหรับสร้าง Output กรุณาเปิดผ่าน START_LOCAL_WEB.bat และตรวจไฟล์ assets/BLACKWOLF_Master_Pivot_Template_V2.5.3.xlsx'});}
// [L1664] ประกาศตัวแปร issueData แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const issueData=findNamedSheet(workbooks.issue,'Data'),issueCheck=extractIssueCheck(workbooks.issue),issueEtl=extractIssueEtl(workbooks.issue),issueOk=!!issueData&&!!issueCheck.found&&!!issueEtl.found;
// [L1665] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  results.push({field:'issue',name:files.issue?.name||'เช็คสถานะ ISSUE',ok:issueOk,message:issueOk?`พบ Data + Check + ETL ครบ; ข้อมูลเดิม Check ${issueCheck.ids.length} และ ETL ${issueEtl.records.length} แถวจะถูกล้างก่อนวางข้อมูลรอบใหม่`:'ต้องมี Sheet Data, Check และ ETL ตามโครงสร้างไฟล์หลัก ISSUE'});
// [L1666] ประกาศตัวแปร dailyFound แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const dailyFound=findSheet(workbooks.daily,['Data'],DAILY_HEADERS);
// [L1667] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  results.push({field:'daily',name:files.daily?.name||'Daily Report',ok:!!dailyFound,message:dailyFound?`พบ Sheet ${dailyFound.name}; Header row ${dailyFound.rowIndex+1}; (blank) ใน Status อนุญาต`:'ขาด Header Daily Report ที่จำเป็น'});
// [L1668] ประกาศตัวแปร m190Found แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const m190Found=findSheet(workbooks.m190,['Policy Detail'],['Prop Id']);
// [L1669] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  results.push({field:'m190',name:files.m190?.name||'M190',ok:!!m190Found,message:m190Found?`พบ Sheet ${m190Found.name}; Header row ${m190Found.rowIndex+1}`:'ไม่พบ Prop Id'});
// [L1670] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(workbooks.sm){const found=extractControlIds(workbooks.sm,workbooks.sm.SheetNames);results.push({field:'sm',name:files.sm?.name||'SM',ok:!!found.found,message:found.found?`พบรายการใหม่ ${found.ids.length} แถว และจะ Merge กับรายการค้างเดิม`:'ไม่พบ CPROP_ID / Prop ID'});}
// [L1671] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(workbooks.blacklist){const found=extractControlIds(workbooks.blacklist,workbooks.blacklist.SheetNames);results.push({field:'blacklist',name:files.blacklist?.name||'Blacklist',ok:!!found.found,message:found.found?`พบรายการใหม่ ${found.ids.length} แถว และจะ Merge กับรายการค้างเดิม`:'ไม่พบ CPROP_ID / Prop ID'});}
// [L1672] ประกาศตัวแปร etl แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const etl=parseEtl(etlText);
// [L1673] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(etl.invalid)results.push({field:'etl',name:files.etl?.name||'Auto-Mail 7.2',ok:false,message:`ข้อความผิดรูปแบบ ${etl.invalid} บรรทัด`});
// [L1674] ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข
  else results.push({field:'etl',name:files.etl?.name||'Auto-Mail 7.2',ok:true,message:`ข้อมูลรอบปัจจุบัน ${etl.records.length} แถว; ETL เดิมในไฟล์ ISSUE จะไม่ถูกนำมาใช้`});
// [L1675] ประกาศตัวแปร daily แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let daily=null;
// [L1676] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
  try{if(dailyFound)daily=extractDaily(workbooks.daily);}catch(error){results.push({field:'dailyDate',name:files.daily?.name||'Daily Report',ok:false,message:error.message});}
// [L1677] ประกาศตัวแปร manual แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const manual=parseDate(manualStartDate);
// [L1678] ประกาศตัวแปร startOk แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const startOk=!!masterInfo.date||!!manual;
// [L1679] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  results.push({field:'startDate',name:'วันเริ่มต้น',ok:startOk,message:masterInfo.date?`ใช้ Date คอลัมน์ T ล่าสุด: ${dateKey(masterInfo.date)}`:manual?`Master ไม่มี Date ใช้วัน Manual: ${dateKey(manual)}`:'Master ไม่มี Date ที่อ่านได้ กรุณาระบุวันเริ่มต้น Manual'});
// [L1680] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(startOk&&daily){const start=masterInfo.date||dateOnly(manual),end=daily.maxDate<dateOnly(new Date())?daily.maxDate:dateOnly(new Date());if(end<start)results.push({field:'dateRange',name:'ช่วงวันที่',ok:false,message:`วันเริ่มต้น ${dateKey(start)} มากกว่าวันสิ้นสุด ${dateKey(end)}`});}
// [L1681] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{ok:results.every(result=>result.ok),results,masterDate:dateKey(masterInfo.date),manualStartDate:manual?dateKey(manual):'',issueOldCheckRows:issueCheck.ids.length,issueOldEtlRows:issueEtl.records.length,etlTextRows:etl.records.length};
// [L1682] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1683] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ลำดับงานหลักทั้งหมดของ engine ตั้งแต่อ่านข้อมูลจนสร้าง blobs output
// [L1684] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L1685] ประกาศฟังก์ชัน run เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function run({workbooks,etlText='',manualStartDate='',today=new Date(),onProgress=()=>{}}){
// [L1686] ประกาศตัวแปร processedAt แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const processedAt=new Date(today),runId=makeRunId(processedAt);
// [L1687] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  assertMasterVersionSafe(workbooks.master);
// [L1688] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
  // อธิบาย: อัปเดตแถบ progress และข้อความสถานะระหว่างรัน
// [L1689] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
  // ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้
// [L1690] สร้างตัวช่วยแบบ arrow function ชื่อ progress เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const progress=async(percent,message)=>{onProgress(percent,message);await new Promise(resolve=>setTimeout(resolve,10));};
// [L1691] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
  await progress(5,'อ่านรายการค้างและ Date จากไฟล์หลัก');
// [L1692] ประกาศตัวแปร masterData แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const masterData=extractMasterData(workbooks.master),masterInfo=extractMasterMaxDate(workbooks.master);
// [L1693] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
  await progress(12,'อ่านและตรวจช่วงวันที่จาก Daily Report');
// [L1694] ประกาศตัวแปร daily แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const daily=extractDaily(workbooks.daily),dateRange=resolveDateRange(masterInfo,daily,dateOnly(processedAt),manualStartDate);
// [L1695] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
  await progress(22,`กรอง Daily Report ${dateKey(dateRange.start)} ถึง ${dateKey(dateRange.end)} รวม Status (blank)`);
// [L1696] ประกาศตัวแปร filteredResult แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const filteredResult=filterDailyRows(daily,dateRange.start,dateRange.end),dailyFiltered=filteredResult.rows;
// [L1697] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
  await progress(32,'Carry Forward รายการค้างและรวมรายการเดิมด้วย Stable Record Identity');
// [L1698] ประกาศตัวแปร reconciled แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const reconciled=reconcileRows(masterData.rows,dailyFiltered);
// [L1699] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
  await progress(42,'ล้างข้อมูล Check/ETL เดิมในหน่วยความจำและอ่านข้อมูลรอบปัจจุบัน');
// [L1700] ประกาศตัวแปร oldCheck แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const oldCheck=extractIssueCheck(workbooks.issue),oldEtl=extractIssueEtl(workbooks.issue);
// [L1701] ประกาศตัวแปร m190 แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const m190=extractIds(workbooks.m190,['Policy Detail'],['Prop Id']);
// [L1702] ประกาศตัวแปร etl แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const etl=parseEtl(etlText);if(etl.invalid)throw new Error(`Auto-Mail 7.2 มีรูปแบบไม่ถูกต้อง ${etl.invalid} บรรทัด`);
// [L1703] ประกาศตัวแปร checkIds แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const checkIds=[...m190.ids];
// [L1704] สร้างตัวช่วยแบบ arrow function ชื่อ issuedIds เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const issuedIds=unique([...m190.ids,...etl.records.map(record=>record.PropId)]);
// [L1705] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
  await progress(54,'Merge ข้อมูลไม่สมบูรณ์และ Blacklist กับรายการค้างเดิม');
// [L1706] ประกาศตัวแปร oldSm แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const oldSm=extractControlIds(workbooks.master,['ข้อมูลไม่สมบูรณ์']);
// [L1707] ประกาศตัวแปร oldBlacklist แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const oldBlacklist=extractControlIds(workbooks.master,['Black List','Blacklist']);
// [L1708] ประกาศตัวแปร newSm แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const newSm=workbooks.sm?extractControlIds(workbooks.sm,workbooks.sm.SheetNames):{ids:[]};
// [L1709] ประกาศตัวแปร newBlacklist แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const newBlacklist=workbooks.blacklist?extractControlIds(workbooks.blacklist,workbooks.blacklist.SheetNames):{ids:[]};
// [L1710] ประกาศตัวแปร smBeforeRemoval แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const smBeforeRemoval=reconcileIdRows(oldSm.ids,newSm.ids),blacklistBeforeRemoval=reconcileIdRows(oldBlacklist.ids,newBlacklist.ids),issuedSet=new Set(issuedIds);
// [L1711] สร้างตัวช่วยแบบ arrow function ชื่อ smIds เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const smIds=smBeforeRemoval.filter(value=>!issuedSet.has(id(value))),blIds=blacklistBeforeRemoval.filter(value=>!issuedSet.has(id(value)));
// [L1712] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
  await progress(66,'ลบเฉพาะ ProposalID ที่ยืนยันว่าออกกรมธรรม์แล้ว');
// [L1713] ประกาศตัวแปร classified แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const classified=classifyPending(reconciled.rows,issuedIds,smIds,blIds,dateOnly(processedAt));
// [L1714] ประกาศตัวแปร context แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const context={runId,processedAt,masterInfo,masterRows:masterData.rows,daily,dateRange,dailyFiltered,dailyFilterStats:filteredResult,reconciled,m190Ids:m190.ids,etl,checkIds,issuedIds,issueOldCheckRows:oldCheck.ids.length,issueOldEtlRows:oldEtl.records.length,smIds,blIds,pending:classified.pending,removedRows:classified.removed,issuedRemoved:classified.issuedRemoved};
// [L1715] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
  await progress(78,'สรุป Dashboard, Reconciliation และ Audit');
// [L1716] ประกาศตัวแปร summary แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const summary=summarize(context),names=outputNames(processedAt);
// [L1717] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
  await progress(88,'สร้างไฟล์หลักพร้อมสูตร P:W และไฟล์เช็คสถานะ ISSUE รอบใหม่');
// [L1718] ประกาศตัวแปร masterWorkbook แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const masterWorkbook=buildMasterWorkbook(context,summary),issueWorkbook=buildIssueWorkbook(context,summary);
// [L1719] ประกาศตัวแปร resolvedTemplate แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const resolvedTemplate=await resolvePivotTemplateBuffer(workbooks.master);if(!resolvedTemplate)throw new Error('ไม่พบ Clean Pivot Template ที่สมบูรณ์ — กรุณาเปิดผ่าน START_LOCAL_WEB.bat แล้วตรวจสอบไฟล์ใหม่');
// [L1720] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  summary.PVWorkbookMode='SAVED_NATIVE_PIVOT_CACHE';summary.PivotTemplateSource=resolvedTemplate.source;summary.ExcelFinalizerRequired='NO';
// [L1721] ประกาศตัวแปร masterOutput แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const masterOutput=await buildPivotPreservingMaster(resolvedTemplate.buffer,context,summary);
// [L1722] ประกาศตัวแปร outputs แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const outputs={master:masterOutput,issue:workbookBlob(issueWorkbook),names};
// [L1723] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
  await progress(100,'ประมวลผลสำเร็จ พร้อมดาวน์โหลดไฟล์หลัก 2 ไฟล์');
// [L1724] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return{runId,summary,rows:context.pending,outputs,context};
// [L1725] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L1726] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L1727] เผยแพร่ค่า/function ไปยัง global object เพื่อให้ไฟล์อื่นเรียกใช้งานได้
global.BlackwolfEngine={
// [L1728] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  readWorkbook,detectWorkbookRole,preflight,run,parseEtl,
// [L1729] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  preview:{aggregatePvRows,groupByAging,groupStatusRows},
// [L1730] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  normalize:{text,id,key:rawKey,parseDate,dateKey,dateDisplay,excelSerial,canonicalHeader},
// [L1731] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  internals:{findSheet,findNamedSheet,auditValue,masterEngineVersion,assertMasterVersionSafe,extractMasterData,extractMasterMaxDate,extractDaily,filterDailyRows,extractIds,extractControlIds,extractIssueEtl,extractIssueCheck,reconcileRows,reconcileIdRows,resolveDateRange,classifyPending,aggregatePvRows,summarize,buildMasterWorkbook,buildIssueWorkbook,buildPivotPreservingMaster,inspectPivotTemplate,inspectPivotTemplateBuffer,resolvePivotTemplateBuffer,outputNames,rowFingerprint,rowStableIdentity,analyzeStableDuplicateRows,analyzeAlienDuplicates,mergeIdentityRows,inspectPivotTemplateZip}
// [L1732] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
};
// [L1733] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
})(typeof self!=='undefined'?self:globalThis);
