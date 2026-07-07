# อธิบายบรรทัดต่อบรรทัด: `engine.js`

**บทบาทไฟล์:** หัวใจประมวลผล Excel: อ่านไฟล์, normalize header/date/id, รวม backlog, ตัด issued, สร้าง Master/ISSUE และ patch pivot/XML

> วิธีอ่าน: ดูเลขบรรทัด L0001, L0002, ... แล้วเทียบกับไฟล์โค้ดต้นฉบับ/ไฟล์ที่ใส่คอมเมนต์แล้วได้ทันที

| บรรทัด | โค้ด | คำอธิบายแบบคนเริ่มจากศูนย์ |
|---:|---|---|
| L0001 | `(function(global){` | เริ่ม IIFE/ฟังก์ชันครอบไฟล์ เพื่อแยก scope ไม่ให้ตัวแปรชนกับไฟล์อื่น |
| L0002 | `'use strict';` | เปิด strict mode เพื่อให้ JavaScript จับข้อผิดพลาดเข้มขึ้น เช่น ห้ามใช้ตัวแปรที่ยังไม่ประกาศ |
| L0003 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0004 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0005 | `// BLACKWOLF TEACHING COMMENTS: คอมเมนต์ชุดนี้เพิ่มเพื่ออธิบาย logic สำหรับอ่าน/ดูแลโค้ด` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0006 | `// หลักสำคัญ: คอมเมนต์ขึ้นต้นด้วย // จะไม่ถูกรัน จึงไม่เปลี่ยน behavior ของ JavaScript` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0007 | `// ภาพรวม: ไฟล์หัวใจของระบบ ใช้อ่าน Excel, normalize header, รวมข้อมูล, ตัดรายการที่ออกกรมธรรม์แล้ว, สร้าง Master/ISSUE และจัดการ Pivot/XML` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0008 | `// ภาพรวม: แบ่งงานเป็นชั้น ๆ: helper → extractor → reconcile/classify → summarize → workbook builder → pivot patcher → validation → run` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0009 | `// ภาพรวม: export BlackwolfEngine ให้ app.js/worker.js ใช้ และมี internals สำหรับ preview/diagnostic บางส่วน` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0010 | `const CONFIG=global.BLACKWOLF_CONFIG\|\|{` | กำหนดค่าคงที่ CONFIG สำหรับใช้เป็นค่ากลางของ flow นี้ |
| L0011 | `  version:'3.5.8',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0012 | `  masterBaseName:'เช็คกรมธรรม์ต่างด้าวที่ยังไม่ออก_WEB',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0013 | `  issueBaseName:'เช็คสถานะ ISSUE_WEB'` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0014 | `};` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0015 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0016 | `const DAILY_HEADERS=['AgencyCode','Mticode','AgencyName','RequestCode','employeeName','alienCode','alienNameEn','CertificateNo','TotalPremium','ProposalID','...` | กำหนดค่าคงที่ DAILY_HEADERS สำหรับใช้เป็นค่ากลางของ flow นี้ |
| L0017 | `const MASTER_AO_HEADERS=['AgencyCode','Mticode','AgencyName','RequestCode','employeeName','alienCode','alienNameEn','CertificateNo','Policy','TotalPremium','...` | กำหนดค่าคงที่ MASTER_AO_HEADERS สำหรับใช้เป็นค่ากลางของ flow นี้ |
| L0018 | `const MASTER_OUTPUT_HEADERS=[...MASTER_AO_HEADERS,'หมายเหตุ','สถานะไม่สมบูรณ์','สถานะ Blacklist.','ติดปัญหาไม่เข้าในเมนู E','Date','สถานะไม่ issue','จำนวนวัน...` | กำหนดค่าคงที่ MASTER_OUTPUT_HEADERS สำหรับใช้เป็นค่ากลางของ flow นี้ |
| L0019 | `const ISSUE_HEADERS=['AgencyCode','Mticode','AgencyName','RequestCode','employeeName','alienCode','alienNameEn','CertificateNo','PolicyNo','TotalPremium','Pr...` | กำหนดค่าคงที่ ISSUE_HEADERS สำหรับใช้เป็นค่ากลางของ flow นี้ |
| L0020 | `const ALLOWED_STATUS_KEYS=new Set(['','เสร็จสมบูรณ์','เสร็จสมบูรณ์(ติดปัญหาuploadfile)','ระบบขัดข้องกรุณาติดต่อไอที']);` | กำหนดค่าคงที่ ALLOWED_STATUS_KEYS สำหรับใช้เป็นค่ากลางของ flow นี้ |
| L0021 | `const COLORS={blue:'4F81BD',reportBlue:'0070C0',purple:'AB0CF2',darkPurple:'60497A',green:'00B050',red:'C0504D',orange:'F79646',white:'FFFFFF',black:'000000'...` | กำหนดค่าคงที่ COLORS สำหรับใช้เป็นค่ากลางของ flow นี้ |
| L0022 | `const BUNDLED_PIVOT_TEMPLATE_URL='assets/BLACKWOLF_Master_Pivot_Template_V2.5.3.xlsx';` | กำหนดค่าคงที่ BUNDLED_PIVOT_TEMPLATE_URL สำหรับใช้เป็นค่ากลางของ flow นี้ |
| L0023 | `let bundledPivotTemplatePromise=null;` | ประกาศตัวแปร bundledPivotTemplatePromise แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0024 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0025 | `const HEADER_ALIASES=new Map([` | กำหนดค่าคงที่ HEADER_ALIASES สำหรับใช้เป็นค่ากลางของ flow นี้ |
| L0026 | `  ['proposalid','ProposalID'],['proposal','ProposalID'],['propid','Prop ID'],['prop-id','Prop ID'],['prop id','Prop ID'],['cpropid','CPROP_ID'],` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0027 | `  ['checkpid','Check P-ID'],['checkp-id','Check P-ID'],['check p-id','Check P-ID'],['checkproposalid','Check P-ID'],` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0028 | `  ['policyno','PolicyNo'],['policy','Policy'],['createdate','CreateDate'],['create date','CreateDate'],` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0029 | `  ['totalpremium','TotalPremium'],['total premium','TotalPremium'],['agencycode','AgencyCode'],['agency code','AgencyCode'],` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0030 | `  ['agencyname','AgencyName'],['agency name','AgencyName'],['requestcode','RequestCode'],['request code','RequestCode'],` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0031 | `  ['employeename','employeeName'],['employee name','employeeName'],['aliencode','alienCode'],['alien code','alienCode'],` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0032 | `  ['aliennameen','alienNameEn'],['alien name en','alienNameEn'],['certificateno','CertificateNo'],['certificate no','CertificateNo'],` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0033 | `  ['epropid','EPropID'],['eprop id','EPropID'],['mticode','Mticode'],['discount','Discount'],['status','Status'],` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0034 | `  ['date','Date'],['no','No'],['group','Group'],['ออกกรมธรรม์','ออกกรมธรรม์'],` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0035 | `  ['สถานะไม่สมบูรณ์','สถานะไม่สมบูรณ์'],['สถานะblacklist','สถานะ Blacklist.'],['สถานะblacklist.','สถานะ Blacklist.'],` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0036 | `  ['ติดปัญหาไม่เข้าในเมนูe','ติดปัญหาไม่เข้าในเมนู E'],['สถานะไม่issue','สถานะไม่ issue'],` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0037 | `  ['จำนวนวันที่ยังไม่ออกกรมธรรม์','จำนวนวันที่ยังไม่ออกกรมธรรม์'],['ระยะเวลายังไม่ออกกรมธรรม์','ระยะเวลายังไม่ออกกรมธรรม์'],` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0038 | `  ['หมายเหตุ','หมายเหตุ']` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0039 | `]);` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0040 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0041 | `// อธิบาย: แปลงค่าทุกแบบเป็นข้อความสะอาด ตัดช่องว่าง/ขึ้นบรรทัด/Excel _x000D_` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0042 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0043 | `function text(value){return value===null\|\|value===undefined?'':String(value).replace(/[_]x000D_/gi,' ').replace(/[\r\n\t]+/g,' ').replace(/\s+/g,' ').trim();}` | ประกาศฟังก์ชัน text เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0044 | `// อธิบาย: normalize รหัส/เลขอ้างอิง เช่น ProposalID/Policy ให้ไม่ติด apostrophe หรือ .0 จาก Excel` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0045 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0046 | `function id(value){` | ประกาศฟังก์ชัน id เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0047 | `  if(value===null\|\|value===undefined\|\|value==='')return'';` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0048 | `  if(typeof value==='number'&&Number.isFinite(value))return Number.isInteger(value)?String(value):String(value).replace(/\.0+$/,'');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0049 | `  const normalized=text(value).replace(/^'/,'');` | ประกาศตัวแปร normalized แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0050 | `  return /^\d+(?:\.0+)?$/.test(normalized)?normalized.replace(/\.0+$/,''):normalized;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0051 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0052 | `// อธิบาย: ทำ key สำหรับเทียบชื่อ header/sheet แบบไม่สน case, ช่องว่าง และ separator` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0053 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0054 | `function rawKey(value){return text(value).normalize('NFKC').toLowerCase().replace(/[\s._\-\/()]+/g,'');}` | ประกาศฟังก์ชัน rawKey เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0055 | `// อธิบาย: แปลงชื่อ header ที่เขียนต่างกันให้เป็นชื่อมาตรฐานเดียวกันผ่าน alias map` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0056 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0057 | `function canonicalHeader(value){` | ประกาศฟังก์ชัน canonicalHeader เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0058 | `  const source=text(value).normalize('NFKC').toLowerCase();` | ประกาศตัวแปร source แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0059 | `  const compact=source.replace(/[\s._\-\/()]+/g,'');` | ประกาศตัวแปร compact แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0060 | `  return HEADER_ALIASES.get(source)\|\|HEADER_ALIASES.get(compact)\|\|text(value);` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0061 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0062 | `// อธิบาย: สร้าง key มาตรฐานของ header หลัง canonical แล้ว` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0063 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0064 | `function headerKey(value){return rawKey(canonicalHeader(value));}` | ประกาศฟังก์ชัน headerKey เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0065 | `// อธิบาย: แปลงค่าเป็นตัวเลข โดยรองรับ comma และค่าว่าง` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0066 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0067 | `function number(value){if(value===null\|\|value===undefined\|\|value==='')return 0;if(typeof value==='number')return Number.isFinite(value)?value:0;const parsed=...` | ประกาศฟังก์ชัน number เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0068 | `// อธิบาย: เช็คว่าค่ามีเนื้อหาจริง ไม่ใช่ null/undefined/blank` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0069 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0070 | `function hasValue(value){return value!==null&&value!==undefined&&String(value).trim()!=='';}` | ประกาศฟังก์ชัน hasValue เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0071 | `// อธิบาย: เติม 0 หน้าเลขวัน/เดือน/เวลาให้ครบ 2 หลัก` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0072 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0073 | `function pad(value){return String(value).padStart(2,'0');}` | ประกาศฟังก์ชัน pad เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0074 | `// อธิบาย: แปลง Date เป็น yyyy-mm-dd เพื่อใช้ในชื่อไฟล์/เปรียบเทียบ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0075 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0076 | `function dateKey(date){return date?\`${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}\`:'';}` | ประกาศฟังก์ชัน dateKey เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0077 | `// อธิบาย: แปลง Date เป็น dd/mm/yyyy สำหรับแสดงใน Excel/UI` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0078 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0079 | `function dateDisplay(date){return date?\`${pad(date.getDate())}/${pad(date.getMonth()+1)}/${date.getFullYear()}\`:'';}` | ประกาศฟังก์ชัน dateDisplay เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0080 | `// อธิบาย: แปลง Date เป็น yyyy-mm-dd HH:mm:ss สำหรับ audit/log` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0081 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0082 | `function dateTimeText(date){return date?\`${dateKey(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}\`:'';}` | ประกาศฟังก์ชัน dateTimeText เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0083 | `// อธิบาย: ตัดเวลาออก เหลือเฉพาะวันเพื่อคำนวณ aging ให้ตรง` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0084 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0085 | `function dateOnly(date){return date?new Date(date.getFullYear(),date.getMonth(),date.getDate()):null;}` | ประกาศฟังก์ชัน dateOnly เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0086 | `// อธิบาย: แปลง Date เป็น serial number ของ Excel` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0087 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0088 | `function excelSerial(value){` | ประกาศฟังก์ชัน excelSerial เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0089 | `  const date=value instanceof Date?value:parseDate(value);` | ประกาศตัวแปร date แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0090 | `  if(!date\|\|Number.isNaN(date.getTime()))return null;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0091 | `  const utc=Date.UTC(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds(),date.getMilliseconds());` | ประกาศตัวแปร utc แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0092 | `  return utc/86400000+25569;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0093 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0094 | `// อธิบาย: อ่านวันที่จาก Date object, serial Excel, dd/mm/yyyy, yyyy-mm-dd และปี พ.ศ.` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0095 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0096 | `function parseDate(value){` | ประกาศฟังก์ชัน parseDate เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0097 | `  if(value===null\|\|value===undefined\|\|value==='')return null;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0098 | `  if(value instanceof Date&&!Number.isNaN(value.getTime()))return new Date(value.getFullYear(),value.getMonth(),value.getDate(),value.getHours(),value.getMin...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0099 | `  if(typeof value==='number'&&Number.isFinite(value)){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0100 | `    const parsed=global.XLSX?.SSF?.parse_date_code(value);` | ประกาศตัวแปร parsed แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0101 | `    if(parsed)return new Date(parsed.y,parsed.m-1,parsed.d,parsed.H\|\|0,parsed.M\|\|0,Math.floor(parsed.S\|\|0));` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0102 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0103 | `  const source=text(value);` | ประกาศตัวแปร source แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0104 | `  let match=source.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);` | ประกาศตัวแปร match แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0105 | `  if(match){let year=+match[3];if(year>2400)year-=543;return new Date(year,+match[2]-1,+match[1],+(match[4]\|\|0),+(match[5]\|\|0),+(match[6]\|\|0));}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0106 | `  match=source.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})(?:[T\s](\d{1,2}):(\d{2})(?::(\d{2}))?)?/);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0107 | `  if(match){let year=+match[1];if(year>2400)year-=543;return new Date(year,+match[2]-1,+match[3],+(match[4]\|\|0),+(match[5]\|\|0),+(match[6]\|\|0));}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0108 | `  const parsed=new Date(source);` | ประกาศตัวแปร parsed แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0109 | `  return Number.isNaN(parsed.getTime())?null:parsed;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0110 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0111 | `// อธิบาย: คำนวณจำนวนวันระหว่างวันที่เริ่มต้นกับวันที่ปลายทาง` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0112 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0113 | `function daysBetween(start,end){if(!start\|\|!end)return null;return Math.max(0,Math.floor((dateOnly(end)-dateOnly(start))/86400000));}` | ประกาศฟังก์ชัน daysBetween เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0114 | `// อธิบาย: จัดกลุ่มอายุค้างเป็น 1-7, 8-15, 16-30, มากกว่า 30 วัน` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0115 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0116 | `function agingRange(days){if(days===null\|\|days===undefined)return'';if(days<=7)return'1 - 7 วัน';if(days<=15)return'8 - 15 วัน';if(days<=30)return'16 - 30 วั...` | ประกาศฟังก์ชัน agingRange เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0117 | `// อธิบาย: normalize สถานะแบบข้อความ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0118 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0119 | `function normalizeStatus(value){return text(value);}` | ประกาศฟังก์ชัน normalizeStatus เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0120 | `// อธิบาย: ทำ key ของสถานะเพื่อเทียบแบบไม่สนช่องว่าง/case` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0121 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0122 | `function statusKey(value){return text(value).normalize('NFKC').toLowerCase().replace(/\s+/g,'');}` | ประกาศฟังก์ชัน statusKey เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0123 | `// อธิบาย: คืน array ที่ไม่ซ้ำโดย normalize id ก่อน` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0124 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0125 | `function unique(values){const seen=new Set(),result=[];for(const value of values\|\|[]){const normalized=id(value);if(normalized&&!seen.has(normalized)){seen.a...` | ประกาศฟังก์ชัน unique เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0126 | `// อธิบาย: รวมตัวเลขของ field หนึ่งใน rows` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0127 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0128 | `function sum(rows,field){return (rows\|\|[]).reduce((total,row)=>total+number(row[field]),0);}` | ประกาศฟังก์ชัน sum เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0129 | `// อธิบาย: แตกข้อความเป็นบรรทัด รองรับ BOM ตอนต้นไฟล์` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0130 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0131 | `function textLines(value){return String(value\|\|'').replace(/^\uFEFF/,'').split(/\r?\n/);}` | ประกาศฟังก์ชัน textLines เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0132 | `// อธิบาย: ลบอักขระต้องห้ามของชื่อไฟล์ Windows` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0133 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0134 | `function safeFileName(value){return text(value).replace(/[\\/:*?"<>\|]+/g,'_');}` | ประกาศฟังก์ชัน safeFileName เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0135 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0136 | `// อธิบาย: อ่านไฟล์ Excel ด้วย XLSX library และเลือกเก็บ source buffer ได้` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0137 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0138 | `async function readWorkbook(file,preserveSource=false){const buffer=await file.arrayBuffer();const workbook=global.XLSX.read(buffer,{type:'array',cellDates:t...` | ประกาศฟังก์ชัน readWorkbook เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0139 | `// อธิบาย: แปลง worksheet เป็น matrix สองมิติแบบ raw` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0140 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0141 | `function sheetMatrix(worksheet){return global.XLSX.utils.sheet_to_json(worksheet,{header:1,raw:true,defval:null,blankrows:false});}` | ประกาศฟังก์ชัน sheetMatrix เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0142 | `// อธิบาย: สร้าง map จาก header name ไป column index` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0143 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0144 | `function headerMap(row){const map={};(row\|\|[]).forEach((value,index)=>{const key=headerKey(value);if(key&&!Object.prototype.hasOwnProperty.call(map,key))map[...` | ประกาศฟังก์ชัน headerMap เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0145 | `// อธิบาย: ค้นหา row ที่มี header ตามที่ต้องการภายในช่วง row แรก ๆ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0146 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0147 | `function findHeaderInMatrix(matrix,required,maxRows=60){const requirements=(required\|\|[]).map(headerKey);for(let rowIndex=0;rowIndex<Math.min(matrix.length,m...` | ประกาศฟังก์ชัน findHeaderInMatrix เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0148 | `// อธิบาย: เลือก sheet ที่มี header required โดยให้ชื่อ preferred มาก่อน` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0149 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0150 | `function findSheet(workbook,preferred,required){` | ประกาศฟังก์ชัน findSheet เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0151 | `  if(!workbook)return null;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0152 | `  const preferredNames=(Array.isArray(preferred)?preferred:[preferred]).filter(Boolean);` | ประกาศตัวแปร preferredNames แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0153 | `  const ordered=[...workbook.SheetNames].sort((left,right)=>{` | สร้างตัวช่วยแบบ arrow function ชื่อ ordered เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0154 | `    const leftIndex=preferredNames.findIndex(name=>rawKey(name)===rawKey(left));` | สร้างตัวช่วยแบบ arrow function ชื่อ leftIndex เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0155 | `    const rightIndex=preferredNames.findIndex(name=>rawKey(name)===rawKey(right));` | สร้างตัวช่วยแบบ arrow function ชื่อ rightIndex เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0156 | `    return(leftIndex<0?999:leftIndex)-(rightIndex<0?999:rightIndex);` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0157 | `  });` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0158 | `  for(const name of ordered){const matrix=sheetMatrix(workbook.Sheets[name]);const found=findHeaderInMatrix(matrix,required);if(found)return{name,matrix,...f...` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0159 | `  return null;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0160 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0161 | `// อธิบาย: หา sheet จากชื่อแบบ normalize` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0162 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0163 | `function findNamedSheet(workbook,name){if(!workbook)return null;const foundName=workbook.SheetNames.find(sheetName=>rawKey(sheetName)===rawKey(name));return ...` | ประกาศฟังก์ชัน findNamedSheet เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0164 | `// อธิบาย: อ่านค่า key/value จาก sheet _Audit` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0165 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0166 | `function auditValue(workbook,key){` | ประกาศฟังก์ชัน auditValue เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0167 | `  const audit=findNamedSheet(workbook,'_Audit');` | ประกาศตัวแปร audit แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0168 | `  if(!audit)return'';` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0169 | `  const wanted=rawKey(key);` | ประกาศตัวแปร wanted แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0170 | `  for(const row of audit.matrix\|\|[]){if(rawKey(row?.[0])===wanted)return text(row?.[1]);}` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0171 | `  return'';` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0172 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0173 | `// อธิบาย: อ่าน version ที่สร้าง Master จาก _Audit หรือ workbook properties` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0174 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0175 | `function masterEngineVersion(workbook){return auditValue(workbook,'Version')\|\|text(workbook?.Props?.Subject).replace(/^BLACKWOLF\s*/i,'');}` | ประกาศฟังก์ชัน masterEngineVersion เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0176 | `// อธิบาย: กันการใช้ Master เวอร์ชันเก่าที่รู้ว่ามีปัญหา Status/PV` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0177 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0178 | `function assertMasterVersionSafe(workbook){` | ประกาศฟังก์ชัน assertMasterVersionSafe เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0179 | `  const version=masterEngineVersion(workbook);` | ประกาศตัวแปร version แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0180 | `  if(version==='3.5.1'\|\|version==='3.5.2')throw new Error(\`Master ถูกสร้างด้วย BLACKWOLF V${version} ซึ่งมีปัญหา Status/PV เดิม กรุณาใช้ไฟล์ Manual V2.5.3 ที...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0181 | `  return version;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0182 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0183 | `// อธิบาย: อ่านค่า cell จาก row ด้วย header map` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0184 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0185 | `function valueAt(row,map,name){const index=map[headerKey(name)];return index===undefined?null:row[index];}` | ประกาศฟังก์ชัน valueAt เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0186 | `// อธิบาย: อ่านค่าจากหลาย header ที่เป็น alias แล้วคืนตัวแรกที่เจอ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0187 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0188 | `function firstValue(row,map,names){for(const name of names){const index=map[headerKey(name)];if(index!==undefined)return row[index];}return null;}` | ประกาศฟังก์ชัน firstValue เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0189 | `// อธิบาย: เดา role จากชื่อไฟล์เฉพาะกรณีโครงสร้างแยกยาก เช่น SM/Blacklist` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0190 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0191 | `function fileNameHint(fileName){` | ประกาศฟังก์ชัน fileNameHint เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0192 | `  const name=text(fileName).toLowerCase();` | ประกาศตัวแปร name แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0193 | `  if(/black\s*list\|blacklist\|บัญชีดำ/.test(name))return'blacklist';` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0194 | `  if(/ข้อมูลไม่สมบูรณ์\|(^\|[ _-])sm([ _.-]\|$)/.test(name))return'sm';` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0195 | `  if(/m190\|prd008\|premium by policy/.test(name))return'm190';` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0196 | `  if(/เช็คสถานะ.*issue\|check.*issue\|status.*issue/.test(name))return'issue';` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0197 | `  if(/รายงานงานประกันแรงงานต่างด้าว\|daily\s*report\|daily/.test(name))return'daily';` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0198 | `  if(/เช็คกรมธรรม์ต่างด้าวที่ยังไม่ออก\|master/.test(name))return'master';` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0199 | `  return null;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0200 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0201 | `// อธิบาย: ตรวจบทบาท workbook จาก sheet/header ไม่พึ่งชื่อไฟล์เป็นหลัก` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0202 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0203 | `function detectWorkbookRole(workbook,fileName=''){` | ประกาศฟังก์ชัน detectWorkbookRole เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0204 | `  const matches=[];` | ประกาศตัวแปร matches แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0205 | `  const namedData=findNamedSheet(workbook,'Data');` | ประกาศตัวแปร namedData แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0206 | `  const masterAw=namedData&&findHeaderInMatrix(namedData.matrix,['ProposalID','CreateDate','Date','สถานะไม่ issue']);` | ประกาศตัวแปร masterAw แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0207 | `  const masterAo=namedData&&findHeaderInMatrix(namedData.matrix,MASTER_AO_HEADERS);` | ประกาศตัวแปร masterAo แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0208 | `  if(masterAw)return{role:'master',matches:[{role:'master',score:100,reason:'พบ Sheet Data โครงสร้าง Master A:W และ Date'}],message:'พบ Sheet Data โครงสร้าง ...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0209 | `  if(masterAo)return{role:'master',matches:[{role:'master',score:97,reason:'พบ Sheet Data โครงสร้าง Master A:O'}],message:'พบ Sheet Data โครงสร้าง Master A:O'};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0210 | `  const namedCheck=findNamedSheet(workbook,'Check');` | ประกาศตัวแปร namedCheck แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0211 | `  const namedEtl=findNamedSheet(workbook,'ETL');` | ประกาศตัวแปร namedEtl แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0212 | `  if(namedData&&namedCheck&&namedEtl&&findHeaderInMatrix(namedCheck.matrix,['Check P-ID'])&&findHeaderInMatrix(namedEtl.matrix,['Policy','Group']))matches.pu...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0213 | `  const policyDetail=findNamedSheet(workbook,'Policy Detail');` | ประกาศตัวแปร policyDetail แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0214 | `  if(policyDetail&&findHeaderInMatrix(policyDetail.matrix,['Prop Id']))matches.push({role:'m190',score:95,reason:'พบ Sheet Policy Detail และ Prop Id'});` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0215 | `  if(namedData&&findHeaderInMatrix(namedData.matrix,DAILY_HEADERS))matches.push({role:'daily',score:88,reason:'พบ Header Daily Report ครบใน Sheet Data'});` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0216 | `  const control=findSheet(workbook,workbook.SheetNames,['CPROP_ID'])\|\|findSheet(workbook,workbook.SheetNames,['Prop ID']);` | ประกาศตัวแปร control แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0217 | `  if(control){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0218 | `    const hint=fileNameHint(fileName);` | ประกาศตัวแปร hint แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0219 | `    if(hint==='sm'\|\|workbook.SheetNames.some(name=>/ข้อมูลไม่สมบูรณ์\|(^\|\s)sm(\s\|$)/i.test(name)))matches.push({role:'sm',score:92,reason:\`พบ CPROP_ID / Prop...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0220 | `    if(hint==='blacklist'\|\|workbook.SheetNames.some(name=>/black\s*list\|blacklist\|บัญชีดำ/i.test(name)))matches.push({role:'blacklist',score:92,reason:\`พบ CP...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0221 | `    if(!matches.some(match=>match.role==='sm'\|\|match.role==='blacklist'))matches.push({role:'control-ambiguous',score:60,reason:\`พบ CPROP_ID / Prop ID แต่แยก...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0222 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0223 | `  const priority={issue:6,m190:4,daily:3,sm:2,blacklist:2,'control-ambiguous':1};` | ประกาศตัวแปร priority แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0224 | `  matches.sort((a,b)=>b.score-a.score\|\|(priority[b.role]\|\|0)-(priority[a.role]\|\|0));` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L0225 | `  if(!matches.length)return{role:null,matches:[],message:'ไม่พบโครงสร้างไฟล์ที่ระบบรองรับ'};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0226 | `  const top=matches[0];` | ประกาศตัวแปร top แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0227 | `  const competing=matches.filter(match=>match.role!==top.role&&match.score===top.score);` | สร้างตัวช่วยแบบ arrow function ชื่อ competing เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0228 | `  if(top.role==='control-ambiguous'\|\|competing.length)return{role:null,matches,message:'โครงสร้างไฟล์ไม่ชัดเจน กรุณาตรวจชื่อ Sheet/ชื่อไฟล์'};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0229 | `  return{role:top.role,matches,message:top.reason};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0230 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0231 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0232 | `// อธิบาย: แปลง row matrix เป็น object ตาม header map และ header ที่ต้องการ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0233 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0234 | `function rowFromMap(row,map,source){` | ประกาศฟังก์ชัน rowFromMap เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0235 | `  const certificateNo=text(valueAt(row,map,'CertificateNo'));` | ประกาศตัวแปร certificateNo แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0236 | `  const createDate=parseDate(valueAt(row,map,'CreateDate'));` | ประกาศตัวแปร createDate แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0237 | `  const storedDate=parseDate(valueAt(row,map,'Date'));` | ประกาศตัวแปร storedDate แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0238 | `  return{` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0239 | `    AgencyCode:text(valueAt(row,map,'AgencyCode')),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0240 | `    Mticode:text(valueAt(row,map,'Mticode')),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0241 | `    AgencyName:text(valueAt(row,map,'AgencyName')),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0242 | `    RequestCode:id(valueAt(row,map,'RequestCode')),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0243 | `    employeeName:text(valueAt(row,map,'employeeName')),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0244 | `    alienCode:id(valueAt(row,map,'alienCode')),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0245 | `    alienNameEn:text(valueAt(row,map,'alienNameEn')),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0246 | `    CertificateNo:certificateNo,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0247 | `    Policy:text(firstValue(row,map,['Policy','PolicyNo']))\|\|(certificateNo.length>=8?certificateNo.slice(0,8):''),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0248 | `    TotalPremium:number(valueAt(row,map,'TotalPremium')),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0249 | `    ProposalID:id(valueAt(row,map,'ProposalID')),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0250 | `    CreateDate:createDate,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0251 | `    Status:normalizeStatus(valueAt(row,map,'Status')),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0252 | `    EPropID:id(valueAt(row,map,'EPropID')),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0253 | `    Discount:text(valueAt(row,map,'Discount')),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0254 | `    StoredDate:storedDate,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0255 | `    ExistingIncompleteStatus:text(valueAt(row,map,'สถานะไม่สมบูรณ์')),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0256 | `    ExistingBlacklistStatus:text(valueAt(row,map,'สถานะ Blacklist.')),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0257 | `    ExistingMenuEProblem:text(valueAt(row,map,'ติดปัญหาไม่เข้าในเมนู E')),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0258 | `    ExistingPendingStatus:text(valueAt(row,map,'สถานะไม่ issue')),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0259 | `    DataSource:source` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0260 | `  };` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0261 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0262 | `// อธิบาย: ดึงข้อมูล Data จาก Master เดิมและ normalize column` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0263 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0264 | `function extractMasterData(workbook){` | ประกาศฟังก์ชัน extractMasterData เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0265 | `  const found=findSheet(workbook,['Data'],['ProposalID','CreateDate']);` | ประกาศตัวแปร found แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0266 | `  if(!found)return{rows:[],found:null,invalidRows:0};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0267 | `  const rows=[];let invalidRows=0;` | ประกาศตัวแปร rows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0268 | `  for(let index=found.rowIndex+1;index<found.matrix.length;index++){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0269 | `    const sourceRow=found.matrix[index]\|\|[];` | ประกาศตัวแปร sourceRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0270 | `    const row=rowFromMap(sourceRow,found.map,'Master Carry Forward');` | ประกาศตัวแปร row แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0271 | `    if(!row.ProposalID)continue;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0272 | `    if(!row.CreateDate&&row.StoredDate)row.CreateDate=row.StoredDate;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0273 | `    if(!row.CreateDate)invalidRows++;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0274 | `    rows.push(row);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0275 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0276 | `  return{rows,found,invalidRows};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0277 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0278 | `// อธิบาย: หาวันล่าสุดใน Master เพื่อใช้เป็น start date ต่อเนื่อง` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0279 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0280 | `function extractMasterMaxDate(workbook){` | ประกาศฟังก์ชัน extractMasterMaxDate เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0281 | `  const found=findSheet(workbook,['Data'],['ProposalID','Date']);` | ประกาศตัวแปร found แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0282 | `  if(!found)return{date:null,found:null,validRows:0};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0283 | `  let maxDate=null,validRows=0;` | ประกาศตัวแปร maxDate แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0284 | `  for(let index=found.rowIndex+1;index<found.matrix.length;index++){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0285 | `    const row=found.matrix[index]\|\|[];` | ประกาศตัวแปร row แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0286 | `    if(!id(valueAt(row,found.map,'ProposalID')))continue;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0287 | `    const date=parseDate(valueAt(row,found.map,'Date'));` | ประกาศตัวแปร date แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0288 | `    if(!date)continue;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0289 | `    validRows++;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0290 | `    const normalized=dateOnly(date);` | ประกาศตัวแปร normalized แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0291 | `    if(!maxDate\|\|normalized>maxDate)maxDate=normalized;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0292 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0293 | `  return{date:maxDate,found,validRows};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0294 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0295 | `// อธิบาย: ดึงข้อมูล Daily Report รอบปัจจุบัน` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0296 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0297 | `function extractDaily(workbook){` | ประกาศฟังก์ชัน extractDaily เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0298 | `  const found=findSheet(workbook,['Data'],DAILY_HEADERS);` | ประกาศตัวแปร found แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0299 | `  if(!found)throw new Error('Daily Report: ไม่พบ Sheet/Header ที่ต้องใช้');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0300 | `  const allDates=[],raw=[];` | ประกาศตัวแปร allDates แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0301 | `  for(let index=found.rowIndex+1;index<found.matrix.length;index++){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0302 | `    const sourceRow=found.matrix[index]\|\|[];` | ประกาศตัวแปร sourceRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0303 | `    const date=parseDate(valueAt(sourceRow,found.map,'CreateDate'));` | ประกาศตัวแปร date แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0304 | `    if(date)allDates.push(dateOnly(date));` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0305 | `    raw.push(sourceRow);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0306 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0307 | `  if(!allDates.length)throw new Error('Daily Report: ไม่พบ CreateDate ที่อ่านได้');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0308 | `  allDates.sort((left,right)=>left-right);` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L0309 | `  return{found,raw,minDate:allDates[0],maxDate:allDates[allDates.length-1],validDateRows:allDates.length,worksheetRows:raw.length};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0310 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0311 | `// อธิบาย: กรอง Daily ให้เหลือรายการที่ควรเข้าสู่ flow pending` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0312 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0313 | `function filterDailyRows(daily,startDate,endDate){` | ประกาศฟังก์ชัน filterDailyRows เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0314 | `  const rows=[];let skippedStatus=0,skippedDate=0,skippedNoProposal=0,blankStatusRows=0;` | ประกาศตัวแปร rows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0315 | `  for(const sourceRow of daily.raw){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0316 | `    const createDate=parseDate(valueAt(sourceRow,daily.found.map,'CreateDate'));` | ประกาศตัวแปร createDate แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0317 | `    if(!createDate\|\|dateOnly(createDate)<startDate\|\|dateOnly(createDate)>endDate){skippedDate++;continue;}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0318 | `    const sourceStatus=normalizeStatus(valueAt(sourceRow,daily.found.map,'Status'));` | ประกาศตัวแปร sourceStatus แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0319 | `    if(!ALLOWED_STATUS_KEYS.has(statusKey(sourceStatus))){skippedStatus++;continue;}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0320 | `    if(sourceStatus==='')blankStatusRows++;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0321 | `    const row=rowFromMap(sourceRow,daily.found.map,'Daily Report');` | ประกาศตัวแปร row แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0322 | `    if(!row.ProposalID){skippedNoProposal++;continue;}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0323 | `    rows.push(row);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0324 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0325 | `  return{rows,skippedStatus,skippedDate,skippedNoProposal,blankStatusRows};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0326 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0327 | `// อธิบาย: ดึงชุดรหัสจาก workbook ตาม header ที่กำหนด` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0328 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0329 | `function extractIds(workbook,preferred,headers){` | ประกาศฟังก์ชัน extractIds เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0330 | `  const candidates=Array.isArray(headers)?headers:[headers];` | ประกาศตัวแปร candidates แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0331 | `  for(const header of candidates){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0332 | `    const found=findSheet(workbook,preferred,[header]);` | ประกาศตัวแปร found แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0333 | `    if(!found)continue;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0334 | `    const ids=[];` | ประกาศตัวแปร ids แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0335 | `    for(let index=found.rowIndex+1;index<found.matrix.length;index++){const value=id(valueAt(found.matrix[index]\|\|[],found.map,header));if(value)ids.push(val...` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0336 | `    return{ids,found};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0337 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0338 | `  return{ids:[],found:null};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0339 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0340 | `// อธิบาย: ดึง control IDs จาก SM/Blacklist/other control sheets` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0341 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0342 | `function extractControlIds(workbook,preferred){return extractIds(workbook,preferred,['CPROP_ID','Prop ID','ProposalID']);}` | ประกาศฟังก์ชัน extractControlIds เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0343 | `// อธิบาย: ดึง Auto-Mail 7.2 / ETL จาก ISSUE workbook เดิมถ้ามี` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0344 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0345 | `function extractIssueEtl(workbook){` | ประกาศฟังก์ชัน extractIssueEtl เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0346 | `  const found=findSheet(workbook,['ETL'],['Policy','Group']);` | ประกาศตัวแปร found แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0347 | `  if(!found)return{records:[],found:null};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0348 | `  const records=[];` | ประกาศตัวแปร records แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0349 | `  for(let index=found.rowIndex+1;index<found.matrix.length;index++){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0350 | `    const row=found.matrix[index]\|\|[];` | ประกาศตัวแปร row แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0351 | `    const propId=id(firstValue(row,found.map,['Prop ID','CPROP_ID','ProposalID']));` | ประกาศตัวแปร propId แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0352 | `    if(!propId)continue;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0353 | `    records.push({No:number(firstValue(row,found.map,['No']))\|\|records.length+1,PropId:propId,Policy:text(firstValue(row,found.map,['Policy'])),Group:text(fi...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0354 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0355 | `  return{records,found};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0356 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0357 | `// อธิบาย: ดึง Check/M190 จาก ISSUE workbook` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0358 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0359 | `function extractIssueCheck(workbook){return extractIds(workbook,['Check'],['Check P-ID']);}` | ประกาศฟังก์ชัน extractIssueCheck เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0360 | `// อธิบาย: อ่านข้อความ Auto-Mail 7.2 รูปแบบ No.PropID:Policy:Group เป็น record` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0361 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0362 | `function parseEtl(value){` | ประกาศฟังก์ชัน parseEtl เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0363 | `  const records=[],errors=[],seen=new Set();let duplicates=0;` | ประกาศตัวแปร records แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0364 | `  textLines(value).forEach((line,index)=>{` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L0365 | `    if(!line.trim())return;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0366 | `    const match=line.match(/^\s*(\d+)\.(\d+)\s*:\s*([^:]+)\s*:\s*(.+?)\s*$/);` | ประกาศตัวแปร match แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0367 | `    if(!match){errors.push({line:index+1,value:line});return;}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0368 | `    const propId=id(match[2]);` | ประกาศตัวแปร propId แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0369 | `    if(seen.has(propId))duplicates++;else seen.add(propId);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0370 | `    records.push({No:Number(match[1]),PropId:propId,Policy:text(match[3]),Group:text(match[4])});` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0371 | `  });` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0372 | `  return{records,errors,duplicates,valid:records.length,invalid:errors.length,unique:seen.size};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0373 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0374 | `// อธิบาย: สร้างลายเซ็นของ row เพื่อช่วยตรวจ duplicate เชิงข้อมูล` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0375 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0376 | `function rowFingerprint(row){return [row.AgencyCode,row.Mticode,row.AgencyName,row.RequestCode,row.employeeName,row.alienCode,row.alienNameEn,row.Certificate...` | ประกาศฟังก์ชัน rowFingerprint เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0377 | `// อธิบาย: สร้าง token ระบุตัวตนที่เสถียรจากข้อมูลสำคัญ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0378 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0379 | `function stableIdentityToken(value){return text(value).normalize('NFKC').replace(/\s+/g,'').toUpperCase();}` | ประกาศฟังก์ชัน stableIdentityToken เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0380 | `// อธิบาย: ตรวจว่า token มีข้อมูลพอจะใช้เทียบ carry-forward ได้หรือไม่` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0381 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0382 | `function usableStableIdentity(value){const token=stableIdentityToken(value);if(!token)return false;const blocked=new Set(['-','–','—','N/A','NA','NULL','UNDE...` | ประกาศฟังก์ชัน usableStableIdentity เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0383 | `// อธิบาย: สร้าง identity ของ row จาก CertificateNo หรือ alienCode+ProposalID ตามกฎ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0384 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0385 | `function rowStableIdentity(row){` | ประกาศฟังก์ชัน rowStableIdentity เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0386 | `  const certificate=stableIdentityToken(row?.CertificateNo);` | ประกาศตัวแปร certificate แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0387 | `  if(usableStableIdentity(certificate)&&!/^[\-–—]+$/.test(certificate))return\`CERT\u241F${certificate}\`;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0388 | `  const alien=stableIdentityToken(row?.alienCode),proposal=id(row?.ProposalID);` | ประกาศตัวแปร alien แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0389 | `  if(usableStableIdentity(alien)&&proposal)return\`ALIEN_PROP\u241F${alien}\u241F${proposal}\`;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0390 | `  return'';` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0391 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0392 | `// อธิบาย: เลือกวันที่เก่าที่สุดจากกลุ่ม row เพื่อรักษาอายุค้างเดิม` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0393 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0394 | `function earliestDateValue(...values){let earliest=null;for(const value of values){const parsed=parseDate(value);if(parsed&&(!earliest\|\|parsed<earliest))earl...` | ประกาศฟังก์ชัน earliestDateValue เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0395 | `// อธิบาย: รวม row ที่เป็นคน/รายการเดียวกันให้เหลือ record ที่ถูกต้องกว่า` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0396 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0397 | `function mergeIdentityRows(existing,incoming,{refreshed=false}={}){` | ประกาศฟังก์ชัน mergeIdentityRows เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0398 | `  const merged={...existing,...incoming};` | ประกาศตัวแปร merged แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0399 | `  const preserveWhenIncomingBlank=['AgencyCode','Mticode','AgencyName','RequestCode','employeeName','alienCode','alienNameEn','CertificateNo','Policy','Propo...` | ประกาศตัวแปร preserveWhenIncomingBlank แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0400 | `  for(const field of preserveWhenIncomingBlank)if(!hasValue(incoming?.[field])&&hasValue(existing?.[field]))merged[field]=existing[field];` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0401 | `  merged.CreateDate=parseDate(incoming?.CreateDate)\|\|parseDate(existing?.CreateDate);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0402 | `  merged.StoredDate=earliestDateValue(existing?.StoredDate,incoming?.StoredDate)\|\|null;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0403 | `  merged.ExistingIncompleteStatus=text(existing?.ExistingIncompleteStatus)\|\|text(incoming?.ExistingIncompleteStatus);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0404 | `  merged.ExistingBlacklistStatus=text(existing?.ExistingBlacklistStatus)\|\|text(incoming?.ExistingBlacklistStatus);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0405 | `  merged.ExistingMenuEProblem=text(existing?.ExistingMenuEProblem)\|\|text(incoming?.ExistingMenuEProblem);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0406 | `  merged.ExistingPendingStatus=text(existing?.ExistingPendingStatus)\|\|text(incoming?.ExistingPendingStatus);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0407 | `  merged.DataSource=refreshed?'Master Carry Forward + Daily Refresh':(incoming?.DataSource\|\|existing?.DataSource\|\|'');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0408 | `  return merged;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0409 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0410 | `// อธิบาย: วิเคราะห์ duplicate จาก stable identity สำหรับ QA/summary` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0411 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0412 | `function analyzeStableDuplicateRows(rows){` | ประกาศฟังก์ชัน analyzeStableDuplicateRows เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0413 | `  const counts=new Map();` | ประกาศตัวแปร counts แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0414 | `  for(const row of rows\|\|[]){const key=rowStableIdentity(row);if(key)counts.set(key,(counts.get(key)\|\|0)+1);}` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0415 | `  let duplicateKeys=0,duplicateRows=0,extraRows=0;` | ประกาศตัวแปร duplicateKeys แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0416 | `  for(const count of counts.values())if(count>1){duplicateKeys++;duplicateRows+=count;extraRows+=count-1;}` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0417 | `  return{duplicateKeys,duplicateRows,extraRows};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0418 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0419 | `// อธิบาย: วิเคราะห์ alienCode ซ้ำเพื่อเตือนความเสี่ยงข้อมูลซ้ำ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0420 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0421 | `function analyzeAlienDuplicates(rows){` | ประกาศฟังก์ชัน analyzeAlienDuplicates เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0422 | `  const counts=new Map();` | ประกาศตัวแปร counts แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0423 | `  for(const row of rows\|\|[]){const code=stableIdentityToken(row?.alienCode);if(usableStableIdentity(code))counts.set(code,(counts.get(code)\|\|0)+1);}` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0424 | `  const codes=[];let duplicateRowCount=0;` | ประกาศตัวแปร codes แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0425 | `  for(const [alienCode,count] of counts)if(count>1){codes.push({alienCode,count});duplicateRowCount+=count;}` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0426 | `  codes.sort((left,right)=>right.count-left.count\|\|left.alienCode.localeCompare(right.alienCode));` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L0427 | `  return{duplicateCodeCount:codes.length,duplicateRowCount,codes};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0428 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0429 | `// อธิบาย: รวม Master เก่ากับ Daily ใหม่ แล้วตัดรายการที่ออกกรมธรรม์/อยู่ control list` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0430 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0431 | `function reconcileRows(carriedRows,dailyRows){` | ประกาศฟังก์ชัน reconcileRows เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0432 | `  const result=[],stableIndex=new Map(),unstableCarriedCounts=new Map();` | ประกาศตัวแปร result แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0433 | `  let masterDuplicatesCollapsed=0;` | ประกาศตัวแปร masterDuplicatesCollapsed แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0434 | `  for(const row of carriedRows\|\|[]){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0435 | `    const stableKey=rowStableIdentity(row);` | ประกาศตัวแปร stableKey แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0436 | `    if(stableKey){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0437 | `      if(stableIndex.has(stableKey)){const index=stableIndex.get(stableKey);result[index]=mergeIdentityRows(result[index],row);masterDuplicatesCollapsed++;}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0438 | `      else{stableIndex.set(stableKey,result.length);result.push(row);}` | ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข |
| L0439 | `      continue;` | ข้ามรอบ loop ปัจจุบัน แล้วไปตรวจรายการถัดไปทันที |
| L0440 | `    }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0441 | `    const fingerprint=rowFingerprint(row);unstableCarriedCounts.set(fingerprint,(unstableCarriedCounts.get(fingerprint)\|\|0)+1);result.push(row);` | ประกาศตัวแปร fingerprint แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0442 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0443 | `  const masterRowsAfterIdentity=result.length,dailyStableRows=[],dailyStableIndex=new Map(),dailyUnstableRows=[];` | ประกาศตัวแปร masterRowsAfterIdentity แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0444 | `  let dailyDuplicatesCollapsed=0;` | ประกาศตัวแปร dailyDuplicatesCollapsed แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0445 | `  for(const row of dailyRows\|\|[]){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0446 | `    const stableKey=rowStableIdentity(row);` | ประกาศตัวแปร stableKey แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0447 | `    if(stableKey){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0448 | `      if(dailyStableIndex.has(stableKey)){const index=dailyStableIndex.get(stableKey);dailyStableRows[index]=mergeIdentityRows(dailyStableRows[index],row);da...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0449 | `      else{dailyStableIndex.set(stableKey,dailyStableRows.length);dailyStableRows.push(row);}` | ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข |
| L0450 | `    }else dailyUnstableRows.push(row);` | ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข |
| L0451 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0452 | `  let skippedAlreadyCarried=0,added=0,refreshedFromDaily=0;` | ประกาศตัวแปร skippedAlreadyCarried แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0453 | `  for(const row of dailyStableRows){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0454 | `    const key=rowStableIdentity(row);` | ประกาศตัวแปร key แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0455 | `    if(stableIndex.has(key)){const index=stableIndex.get(key);result[index]=mergeIdentityRows(result[index],row,{refreshed:true});skippedAlreadyCarried++;ref...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0456 | `    else{stableIndex.set(key,result.length);result.push(row);added++;}` | ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข |
| L0457 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0458 | `  const seenDailyUnstable=new Map();` | ประกาศตัวแปร seenDailyUnstable แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0459 | `  for(const row of dailyUnstableRows){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0460 | `    const fingerprint=rowFingerprint(row),occurrence=(seenDailyUnstable.get(fingerprint)\|\|0)+1;seenDailyUnstable.set(fingerprint,occurrence);` | ประกาศตัวแปร fingerprint แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0461 | `    if(occurrence<=(unstableCarriedCounts.get(fingerprint)\|\|0)){skippedAlreadyCarried++;continue;}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0462 | `    result.push(row);added++;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0463 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0464 | `  return{rows:result,added,skippedAlreadyCarried,refreshedFromDaily,masterDuplicatesCollapsed,dailyDuplicatesCollapsed,masterRowsAfterIdentity,dailyRowsAfter...` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0465 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0466 | `// อธิบาย: reconcile แบบยึดชุดรหัส ใช้กับ check/control บางประเภท` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0467 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0468 | `function reconcileIdRows(existingIds,newIds){` | ประกาศฟังก์ชัน reconcileIdRows เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0469 | `  const result=[...existingIds],existingCounts=new Map(),seenNew=new Map();` | ประกาศตัวแปร result แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0470 | `  for(const value of existingIds){const normalized=id(value);if(normalized)existingCounts.set(normalized,(existingCounts.get(normalized)\|\|0)+1);}` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0471 | `  for(const value of newIds){const normalized=id(value);if(!normalized)continue;const occurrence=(seenNew.get(normalized)\|\|0)+1;seenNew.set(normalized,occurr...` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0472 | `  return result;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0473 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0474 | `// อธิบาย: หาวันเริ่มต้น/สิ้นสุดของรอบการประมวลผล` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0475 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0476 | `function resolveDateRange(masterInfo,daily,today,manualStartDate){` | ประกาศฟังก์ชัน resolveDateRange เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0477 | `  const manual=parseDate(manualStartDate);` | ประกาศตัวแปร manual แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0478 | `  const start=masterInfo.date?dateOnly(masterInfo.date):(manual?dateOnly(manual):null);` | ประกาศตัวแปร start แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0479 | `  if(!start)throw new Error('Master ไม่มี Date ที่อ่านได้ กรุณาระบุวันเริ่มต้นแบบ Manual ก่อน Run');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0480 | `  const end=daily.maxDate<dateOnly(today)?dateOnly(daily.maxDate):dateOnly(today);` | ประกาศตัวแปร end แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0481 | `  if(end<start)throw new Error(\`ช่วงวันที่ไม่ถูกต้อง: วันเริ่มต้น ${dateKey(start)} มากกว่าวันสิ้นสุด ${dateKey(end)}\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0482 | `  return{start,end,mode:masterInfo.date?'MASTER_DATE_T':'MANUAL_START_DATE',historical:false};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0483 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0484 | `// อธิบาย: เช็ค field สำคัญที่ขาด เพื่อระบุสถานะไม่สมบูรณ์` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0485 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0486 | `function missingRequiredFields(row){` | ประกาศฟังก์ชัน missingRequiredFields เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0487 | `  const fields=['AgencyCode','AgencyName','RequestCode','alienCode','alienNameEn','CertificateNo','Policy','ProposalID','CreateDate','EPropID','Discount'];` | ประกาศตัวแปร fields แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0488 | `  const missing=fields.filter(field=>!hasValue(row[field]));` | สร้างตัวช่วยแบบ arrow function ชื่อ missing เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0489 | `  if(!Number.isFinite(Number(row.TotalPremium)))missing.push('TotalPremium');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0490 | `  return missing;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0491 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0492 | `// อธิบาย: จัดประเภท row ค้าง เช่น ไม่สมบูรณ์ Blacklist ติดปัญหา E ไม่ issue` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0493 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0494 | `function classifyPending(rows,issuedIds,smIds,blacklistIds,today){` | ประกาศฟังก์ชัน classifyPending เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0495 | `  const issuedSet=new Set(unique(issuedIds)),smSet=new Set(unique(smIds)),blacklistSet=new Set(unique(blacklistIds));` | ประกาศตัวแปร issuedSet แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0496 | `  const pending=[],removed=[];` | ประกาศตัวแปร pending แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0497 | `  for(const sourceRow of rows){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0498 | `    const row={...sourceRow};` | ประกาศตัวแปร row แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0499 | `    if(issuedSet.has(row.ProposalID)){removed.push({...row,RemovalReason:'ออกกรมธรรม์แล้ว'});continue;}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0500 | `    const missing=missingRequiredFields(row);` | ประกาศตัวแปร missing แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0501 | `    const carriedForward=row.DataSource==='Master Carry Forward';` | ประกาศตัวแปร carriedForward แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0502 | `    const existingIncomplete=statusKey(row.ExistingIncompleteStatus)==='ข้อมูลไม่สมบูรณ์'\|\|statusKey(row.ExistingPendingStatus)==='ข้อมูลไม่สมบูรณ์';` | ประกาศตัวแปร existingIncomplete แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0503 | `    const existingBlacklist=statusKey(row.ExistingBlacklistStatus)==='blacklist'\|\|statusKey(row.ExistingPendingStatus)==='blacklist';` | ประกาศตัวแปร existingBlacklist แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0504 | `    const existingMenuE=statusKey(row.ExistingMenuEProblem)==='ติดปัญหาไม่เข้าในเมนูe'\|\|statusKey(row.ExistingPendingStatus)==='ติดปัญหาไม่เข้าในเมนูe';` | ประกาศตัวแปร existingMenuE แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0505 | `    const incomplete=smSet.has(row.ProposalID)\|\|existingIncomplete\|\|missing.length>0;` | ประกาศตัวแปร incomplete แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0506 | `    const blacklist=blacklistSet.has(row.ProposalID)\|\|existingBlacklist;` | ประกาศตัวแปร blacklist แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0507 | `    const menuE=existingMenuE&&!incomplete&&!blacklist;` | ประกาศตัวแปร menuE แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0508 | `    const rowDate=dateOnly(row.StoredDate\|\|row.CreateDate);` | ประกาศตัวแปร rowDate แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0509 | `    let pendingStatus='รอ Issue';` | ประกาศตัวแปร pendingStatus แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0510 | `    if(blacklist)pendingStatus='Blacklist';` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0511 | `    else if(incomplete)pendingStatus='ข้อมูลไม่สมบูรณ์';` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0512 | `    else if(menuE)pendingStatus='ติดปัญหาไม่เข้าในเมนู E';` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0513 | `    const agingDays=daysBetween(rowDate,today);` | ประกาศตัวแปร agingDays แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0514 | `    pending.push({...row,Date:rowDate,Note:row.CertificateNo.trim().startsWith('-')?'**ตรวจสอบเลขกรมธรรม์**':'',IncompleteStatus:incomplete?'ข้อมูลไม่สมบูรณ์...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0515 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0516 | `  return{pending,removed,issuedRemoved:removed.length};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0517 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0518 | `// อธิบาย: สร้าง key สำหรับ group ข้อมูลใน PV/PV Final` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0519 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0520 | `function pvGroupKey(row){` | ประกาศฟังก์ชัน pvGroupKey เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0521 | `  return[dateKey(row.Date),text(row.Policy),text(row.Mticode),text(row.AgencyName),id(row.ProposalID),text(row.PendingStatus),row.AgingDays===null\|\|row.Aging...` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0522 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0523 | `// อธิบาย: รวม rows ตาม key เพื่อทำ pivot-like summary` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0524 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0525 | `function aggregatePvRows(rows){` | ประกาศฟังก์ชัน aggregatePvRows เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0526 | `  const groups=new Map();` | ประกาศตัวแปร groups แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0527 | `  for(const row of rows\|\|[]){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0528 | `    if(!row\|\|!id(row.ProposalID)\|\|!text(row.PendingStatus))continue;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0529 | `    const key=pvGroupKey(row);` | ประกาศตัวแปร key แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0530 | `    if(!groups.has(key))groups.set(key,{Date:dateOnly(row.Date),Policy:text(row.Policy),Mticode:text(row.Mticode),AgencyName:text(row.AgencyName),ProposalID:...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0531 | `    const group=groups.get(key);` | ประกาศตัวแปร group แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0532 | `    group.TotalPremium+=number(row.TotalPremium);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0533 | `    group.SourceRows++;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0534 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0535 | `  return[...groups.values()];` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0536 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0537 | `// อธิบาย: สร้าง summary/KPI ทั้งหมดจาก context หลัง reconcile/classify` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0538 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0539 | `function summarize(context){` | ประกาศฟังก์ชัน summarize เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0540 | `  const pending=context.pending,pv=aggregatePvRows(pending);` | ประกาศตัวแปร pending แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0541 | `  return{` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0542 | `    Version:CONFIG.version,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0543 | `    ProcessedAt:dateTimeText(context.processedAt),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0544 | `    RunDate:dateKey(context.processedAt),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0545 | `    RunId:context.runId,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0546 | `    DateStart:dateKey(context.dateRange.start),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0547 | `    DateEnd:dateKey(context.dateRange.end),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0548 | `    DateMode:context.dateRange.mode,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0549 | `    ReportEarliestDate:dateKey(context.daily.minDate),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0550 | `    ReportLatestDate:dateKey(context.daily.maxDate),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0551 | `    ReportWorksheetRows:context.daily.worksheetRows,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0552 | `    ReportValidDateRows:context.daily.validDateRows,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0553 | `    DailyRowsAfterDateStatusFilter:context.dailyFiltered.length,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0554 | `    ReportRowsAfterDateStatusFilter:context.dailyFiltered.length,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0555 | `    DailyBlankStatusAccepted:context.dailyFilterStats.blankStatusRows,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0556 | `    DailyRowsAddedToBacklog:context.reconciled.added,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0557 | `    DailyRowsSkippedAlreadyCarried:context.reconciled.skippedAlreadyCarried,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0558 | `    DailyRowsRefreshedFromCurrent:context.reconciled.refreshedFromDaily,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0559 | `    DailyDuplicateRowsCollapsed:context.reconciled.dailyDuplicatesCollapsed,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0560 | `    DailyRowsAfterStableIdentity:context.reconciled.dailyRowsAfterIdentity,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0561 | `    MasterRowsCarriedForward:context.masterRows.length,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0562 | `    MasterDuplicateRowsCollapsed:context.reconciled.masterDuplicatesCollapsed,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0563 | `    MasterRowsAfterStableIdentity:context.reconciled.masterRowsAfterIdentity,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0564 | `    StableIdentityRule:'CertificateNo; fallback alienCode + ProposalID',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0565 | `    M190RawRows:context.m190Ids.length,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0566 | `    M190PropIdRows:context.m190Ids.length,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0567 | `    M190UniquePropIds:unique(context.m190Ids).length,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0568 | `    IssueOldCheckRowsIgnored:context.issueOldCheckRows,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0569 | `    IssueCheckRowsLoaded:context.checkIds.length,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0570 | `    IssueOldEtlRowsIgnored:context.issueOldEtlRows,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0571 | `    IssueEtlRowsLoaded:context.etl.records.length,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0572 | `    AutoMailRawRows:context.etl.records.length,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0573 | `    EtlTextRowsLoaded:context.etl.records.length,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0574 | `    EtlPropIdRows:context.etl.records.length,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0575 | `    AutoMailUniquePropIds:unique(context.etl.records.map(record=>record.PropId)).length,` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L0576 | `    AutoMailDuplicateRows:context.etl.duplicates,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0577 | `    CurrentIssuedUniquePropIds:context.issuedIds.length,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0578 | `    IssuedRowsRemoved:context.issuedRemoved,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0579 | `    SmRowsWritten:context.smIds.length,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0580 | `    SmUniquePropIds:unique(context.smIds).length,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0581 | `    BlacklistRowsWritten:context.blIds.length,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0582 | `    BlacklistUniquePropIds:unique(context.blIds).length,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0583 | `    PendingRowsWrittenToData:pending.length,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0584 | `    TotalRows:pending.length,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0585 | `    TotalPolicies:pv.length,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0586 | `    TotalPremium:sum(pending,'TotalPremium'),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0587 | `    PendingPolicies:pv.filter(row=>row.PendingStatus==='รอ Issue').length,` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L0588 | `    IncompletePolicies:pv.filter(row=>row.PendingStatus==='ข้อมูลไม่สมบูรณ์').length,` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L0589 | `    MenuEPolicies:pv.filter(row=>row.PendingStatus==='ติดปัญหาไม่เข้าในเมนู E').length,` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L0590 | `    BlacklistPolicies:pv.filter(row=>row.PendingStatus==='Blacklist').length,` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L0591 | `    Age_1_7:pv.filter(row=>row.AgingDays!==null&&row.AgingDays<=7).length,` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L0592 | `    Age_8_15:pv.filter(row=>row.AgingDays>7&&row.AgingDays<=15).length,` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L0593 | `    Age_16_30:pv.filter(row=>row.AgingDays>15&&row.AgingDays<=30).length,` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L0594 | `    Age_Over_30:pv.filter(row=>row.AgingDays>30).length,` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L0595 | `    ValidationStatus:'PASSED',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0596 | `    PremiumReconciled:'YES',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0597 | `    Engine:'Browser JavaScript + xlsx-js-style',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0598 | `    PowerShell:'NOT USED',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0599 | `    ExcelCOM:'NOT USED',` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0600 | `    MasterOutput:\`${CONFIG.masterBaseName}_${dateKey(context.processedAt)}.xlsx\`,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0601 | `    IssueOutput:\`${CONFIG.issueBaseName}_${dateKey(context.processedAt)}.xlsx\`` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0602 | `  };` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0603 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0604 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0605 | `// อธิบาย: สร้าง style border ของ cell ใน Excel` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0606 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0607 | `function border(){return{top:{style:'thin',color:{rgb:COLORS.grid}},bottom:{style:'thin',color:{rgb:COLORS.grid}},left:{style:'thin',color:{rgb:COLORS.grid}}...` | ประกาศฟังก์ชัน border เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0608 | `// อธิบาย: สร้าง style พื้นฐานของ cell` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0609 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0610 | `function baseStyle(extra={}){return{font:{name:'Tahoma',sz:11,color:{rgb:COLORS.black},...(extra.font\|\|{})},fill:extra.fill\|\|{patternType:'solid',fgColor:{rg...` | ประกาศฟังก์ชัน baseStyle เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0611 | `// อธิบาย: สร้าง style หัวตาราง Excel` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0612 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0613 | `function headerStyle(color,sz=11){return baseStyle({font:{bold:true,color:{rgb:COLORS.white},sz},fill:{patternType:'solid',fgColor:{rgb:color}},alignment:{ho...` | ประกาศฟังก์ชัน headerStyle เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0614 | `// อธิบาย: ใส่ style ให้ cell ถ้ามีอยู่` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0615 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0616 | `function setCellStyle(worksheet,row,column,style){const address=global.XLSX.utils.encode_cell({r:row,c:column});if(!worksheet[address])worksheet[address]={t:...` | ประกาศฟังก์ชัน setCellStyle เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0617 | `// อธิบาย: สร้าง cell สูตรพร้อม style และ cached value` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0618 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0619 | `function setFormulaCell(worksheet,row,column,formula,value,type='s'){const address=global.XLSX.utils.encode_cell({r:row,c:column});worksheet[address]={t:type...` | ประกาศฟังก์ชัน setFormulaCell เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0620 | `// อธิบาย: สร้าง cell value พร้อม style/type` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0621 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0622 | `function setValueCell(worksheet,row,column,value,type='s'){const address=global.XLSX.utils.encode_cell({r:row,c:column});worksheet[address]={t:type,v:value};}` | ประกาศฟังก์ชัน setValueCell เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0623 | `// อธิบาย: ไล่ใส่ style ให้ range ตารางใน worksheet` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0624 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0625 | `function applyGridStyles(worksheet,aoa,options={}){` | ประกาศฟังก์ชัน applyGridStyles เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0626 | `  const headerRows=new Set(options.headerRows\|\|[0]),purpleCols=new Set(options.purpleCols\|\|[]),dateCols=new Set(options.dateCols\|\|[]),moneyCols=new Set(optio...` | ประกาศตัวแปร headerRows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0627 | `  for(let row=0;row<aoa.length;row++)for(let column=0;column<(aoa[row]\|\|[]).length;column++){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0628 | `    if(headerRows.has(row)){setCellStyle(worksheet,row,column,headerStyle(purpleCols.has(column)?COLORS.purple:COLORS.blue));continue;}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0629 | `    const numFmt=dateCols.has(column)?(options.dateFormat\|\|'dd/mm/yyyy hh:mm:ss'):moneyCols.has(column)?(options.moneyFormat\|\|'#,##0.00'):idCols.has(column)?...` | ประกาศตัวแปร numFmt แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0630 | `    setCellStyle(worksheet,row,column,baseStyle({alignment:{horizontal:textCols.has(column)?'left':'center',vertical:'center',wrapText:textCols.has(column)},...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0631 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0632 | `  worksheet['!rows']=aoa.map((_,index)=>({hpt:headerRows.has(index)?24:20}));` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L0633 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0634 | `// อธิบาย: เพิ่ม worksheet เข้า workbook พร้อมตั้งชื่อ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0635 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0636 | `function addSheet(workbook,name,aoa,widths,options={}){` | ประกาศฟังก์ชัน addSheet เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0637 | `  const dateCols=new Set(options.dateCols\|\|[]);` | ประกาศตัวแปร dateCols แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0638 | `  // อธิบาย: ฟังก์ชัน outputAoa เป็นส่วนหนึ่งของ flow ใน engine.js ใช้จัดการขั้นตอนย่อยตามชื่อฟังก์ชันนี้` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0639 | `  // ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0640 | `  const outputAoa=(aoa\|\|[]).map(row=>(row\|\|[]).map((value,column)=>{` | สร้างตัวช่วยแบบ arrow function ชื่อ outputAoa เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0641 | `    if(!dateCols.has(column))return value;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0642 | `    const serial=excelSerial(value);` | ประกาศตัวแปร serial แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0643 | `    return serial===null?value:serial;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0644 | `  }));` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0645 | `  const worksheet=global.XLSX.utils.aoa_to_sheet(outputAoa,{cellDates:false});` | ประกาศตัวแปร worksheet แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0646 | `  applyGridStyles(worksheet,outputAoa,options);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0647 | `  worksheet['!cols']=(widths\|\|Array((outputAoa[0]\|\|[]).length).fill(15)).map(width=>({wch:width}));` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L0648 | `  if(options.autoFilter&&outputAoa.length)worksheet['!autofilter']={ref:\`A1:${global.XLSX.utils.encode_col((outputAoa[0]\|\|[]).length-1)}${outputAoa.length}\`};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0649 | `  global.XLSX.utils.book_append_sheet(workbook,worksheet,name);` | เรียกใช้ library XLSX/xlsx-js-style เพื่ออ่าน เขียน หรือจัดรูปแบบไฟล์ Excel |
| L0650 | `  return worksheet;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0651 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0652 | `// อธิบาย: สร้างสูตร P:W/คอลัมน์คำนวณของ Data sheet ต่อ row` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0653 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0654 | `function dataRowFormulas(excelRow,run){` | ประกาศฟังก์ชัน dataRowFormulas เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0655 | `  return{` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0656 | `    p:\`IF(LEFT(H${excelRow},1)="-","**ตรวจสอบเลขกรมธรรม์**","")\`,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0657 | `    q:\`IF(K${excelRow}="","",IF(OR(A${excelRow}="",C${excelRow}="",D${excelRow}="",F${excelRow}="",G${excelRow}="",H${excelRow}="",I${excelRow}="",J${excelRo...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0658 | `    r:\`IF(K${excelRow}="","",IFERROR(INDEX('Black List'!$A:$A,MATCH(K${excelRow},'Black List'!$B:$B,0)),""))\`,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0659 | `    t:\`IF(L${excelRow}="","",INT(L${excelRow}))\`,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0660 | `    u:\`IF(K${excelRow}="","",IF(R${excelRow}="Blacklist","Blacklist",IF(Q${excelRow}="ข้อมูลไม่สมบูรณ์","ข้อมูลไม่สมบูรณ์",IF(S${excelRow}="ติดปัญหาไม่เข้าใน...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0661 | `    v:\`IF(T${excelRow}="","",MAX(0,DATE(${run.getFullYear()},${run.getMonth()+1},${run.getDate()})-T${excelRow}))\`,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0662 | `    w:\`IF(V${excelRow}="","",IF(V${excelRow}<=7,"1 - 7 วัน",IF(V${excelRow}<=15,"8 - 15 วัน",IF(V${excelRow}<=30,"16 - 30 วัน","มากกว่า 30 วัน"))))\`` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0663 | `  };` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0664 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0665 | `// อธิบาย: สร้าง sheet Data ของ Master ใหม่จาก rows ที่ผ่านการคัดแล้ว` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0666 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0667 | `function buildDataSheet(workbook,context){` | ประกาศฟังก์ชัน buildDataSheet เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0668 | `  const dataRows=context.pending.map(row=>[row.AgencyCode,row.Mticode,row.AgencyName,row.RequestCode,row.employeeName,row.alienCode,row.alienNameEn,row.Certi...` | สร้างตัวช่วยแบบ arrow function ชื่อ dataRows เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0669 | `  const aoa=[MASTER_OUTPUT_HEADERS,...dataRows];` | ประกาศตัวแปร aoa แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0670 | `  const worksheet=addSheet(workbook,'Data',aoa,[14,13,38,18,38,21,30,18,16,18,16,21,28,20,16,22,28,22,34,13,30,30,30],{purpleCols:[15,16,17,18,19,20,21,22],d...` | ประกาศตัวแปร worksheet แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0671 | `  worksheet['!freeze']={xSplit:0,ySplit:1};` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0672 | `  const run=context.processedAt;` | ประกาศตัวแปร run แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0673 | `  for(let index=0;index<context.pending.length;index++){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0674 | `    const excelRow=index+2,row=context.pending[index],rowIndex=index+1;` | ประกาศตัวแปร excelRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0675 | `    const {p,q,r,t,u,v,w}=dataRowFormulas(excelRow,run);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0676 | `    setFormulaCell(worksheet,rowIndex,15,p,row.Note,'s');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0677 | `    setFormulaCell(worksheet,rowIndex,16,q,row.IncompleteStatus,'s');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0678 | `    setFormulaCell(worksheet,rowIndex,17,r,row.BlacklistStatus,'s');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0679 | `    setValueCell(worksheet,rowIndex,18,row.MenuEProblem,'s');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0680 | `    setFormulaCell(worksheet,rowIndex,19,t,row.Date?excelSerial(row.Date):'',row.Date?'n':'s');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0681 | `    setFormulaCell(worksheet,rowIndex,20,u,row.PendingStatus,'s');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0682 | `    setFormulaCell(worksheet,rowIndex,21,v,row.AgingDays===null?'':row.AgingDays,row.AgingDays===null?'s':'n');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0683 | `    setFormulaCell(worksheet,rowIndex,22,w,row.PendingRange,'s');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0684 | `    for(let column=15;column<=22;column++)setCellStyle(worksheet,rowIndex,column,baseStyle({alignment:{horizontal:column===15\|\|column===16\|\|column===17\|\|colu...` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0685 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0686 | `  worksheet['!ref']=\`A1:W${Math.max(1,aoa.length)}\`;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0687 | `  return worksheet;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0688 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0689 | `// อธิบาย: สร้าง sheet Check/SM/Blacklist/ETL หรือ control sheets ที่ต้องแนบใน workbook` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0690 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0691 | `function buildControlSheets(workbook,context){` | ประกาศฟังก์ชัน buildControlSheets เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0692 | `  const sm=[['สถานะ','Prop ID'],...context.smIds.map(value=>['ข้อมูลไม่สมบูรณ์',value])];` | สร้างตัวช่วยแบบ arrow function ชื่อ sm เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0693 | `  const smSheet=addSheet(workbook,'ข้อมูลไม่สมบูรณ์',sm,[22,22],{idCols:[1],autoFilter:true});` | ประกาศตัวแปร smSheet แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0694 | `  for(let column=0;column<2;column++)setCellStyle(smSheet,0,column,headerStyle(COLORS.green));` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0695 | `  const blacklist=[['สถานะ','Prop ID'],...context.blIds.map(value=>['Blacklist',value])];` | สร้างตัวช่วยแบบ arrow function ชื่อ blacklist เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0696 | `  const blacklistSheet=addSheet(workbook,'Black List',blacklist,[18,22],{idCols:[1],autoFilter:true});` | ประกาศตัวแปร blacklistSheet แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0697 | `  for(let column=0;column<2;column++)setCellStyle(blacklistSheet,0,column,headerStyle(COLORS.red));` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0698 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0699 | `// อธิบาย: ปรับ label สำหรับ pivot ให้ค่าว่างเป็น (blank)` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0700 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0701 | `function pivotLabel(value){return hasValue(value)?value:'(blank)';}` | ประกาศฟังก์ชัน pivotLabel เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0702 | `// อธิบาย: เตรียม rows สำหรับ PV/PV Final` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0703 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0704 | `function pvRows(context){return aggregatePvRows(context.pending).map(row=>[row.Date,pivotLabel(row.Policy),pivotLabel(row.Mticode),pivotLabel(row.AgencyName)...` | ประกาศฟังก์ชัน pvRows เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0705 | `// อธิบาย: สร้าง PV และ PV Final แบบ workbook ปกติ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0706 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0707 | `function buildPvSheets(workbook,context){` | ประกาศฟังก์ชัน buildPvSheets เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0708 | `  const headers=['Date','Policy','Mticode','AgencyName','ProposalID','สถานะไม่ issue','จำนวนวันที่ยังไม่ออกกรมธรรม์','ระยะเวลายังไม่ออกกรมธรรม์','Sum of Tota...` | ประกาศตัวแปร headers แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0709 | `  const rows=pvRows(context);` | ประกาศตัวแปร rows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0710 | `  const displayedRows=rows.map(row=>[row[0]?excelSerial(row[0]):'',...row.slice(1)]);` | สร้างตัวช่วยแบบ arrow function ชื่อ displayedRows เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0711 | `  const pv=[['','','','','','','','',''],['Status','(All)','','','','','','',''],['','','','','','','','',''],headers,...displayedRows];` | ประกาศตัวแปร pv แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0712 | `  const pvSheet=global.XLSX.utils.aoa_to_sheet(pv,{cellDates:false});` | ประกาศตัวแปร pvSheet แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0713 | `  pvSheet['!cols']=[{wch:18},{wch:13},{wch:12},{wch:56},{wch:17},{wch:28},{wch:30},{wch:28},{wch:22}];` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0714 | `  for(let row=0;row<pv.length;row++)for(let column=0;column<9;column++){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0715 | `    let style=baseStyle({numFmt:column===0?'dd/mm/yyyy':column===8?'#,##0':undefined,alignment:{horizontal:column===3?'left':'center',wrapText:column===3}});` | ประกาศตัวแปร style แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0716 | `    if(row===1&&column===0)style=headerStyle(COLORS.blue);if(row===3)style=headerStyle(COLORS.blue);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0717 | `    setCellStyle(pvSheet,row,column,style);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0718 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0719 | `  global.XLSX.utils.book_append_sheet(workbook,pvSheet,'PV');` | เรียกใช้ library XLSX/xlsx-js-style เพื่ออ่าน เขียน หรือจัดรูปแบบไฟล์ Excel |
| L0720 | `  const finalRows=[headers,...rows];` | ประกาศตัวแปร finalRows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0721 | `  return addSheet(workbook,'PV Final',finalRows,[18,13,12,56,17,28,30,28,22],{dateCols:[0],dateFormat:'dd/mm/yyyy',moneyCols:[8],moneyFormat:'#,##0',idCols:[...` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0722 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0723 | `// อธิบาย: group rows ตามช่วง aging` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0724 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0725 | `function groupByAging(rows){` | ประกาศฟังก์ชัน groupByAging เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0726 | `  const pv=aggregatePvRows(rows),order=['1 - 7 วัน','8 - 15 วัน','16 - 30 วัน','มากกว่า 30 วัน'];` | ประกาศตัวแปร pv แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0727 | `  return order.map((label,index)=>{const subset=pv.filter(row=>row.PendingRange===label);return[index+1,label,subset.length,sum(subset,'TotalPremium')];}).fi...` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0728 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0729 | `// อธิบาย: group rows ตามสถานะ เพื่อใช้ report` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0730 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0731 | `function groupStatusRows(rows,status){` | ประกาศฟังก์ชัน groupStatusRows เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0732 | `  const groups=new Map();` | ประกาศตัวแปร groups แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0733 | `  for(const row of aggregatePvRows(rows).filter(item=>item.PendingStatus===status)){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0734 | `    const key=dateKey(row.Date);` | ประกาศตัวแปร key แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0735 | `    if(!groups.has(key))groups.set(key,{date:row.Date,aging:row.AgingDays,rows:[]});` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0736 | `    groups.get(key).rows.push(row);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0737 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0738 | `  return[...groups.values()].sort((left,right)=>(left.date\|\|0)-(right.date\|\|0)).map(group=>[group.date,group.aging,group.rows.length,sum(group.rows,'TotalPre...` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0739 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0740 | `// อธิบาย: สร้าง Report sheet แบบ native worksheet` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0741 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0742 | `function buildReportSheet(workbook,context,summary){` | ประกาศฟังก์ชัน buildReportSheet เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0743 | `  const reportRows=aggregatePvRows(context.pending),aoa=[],merges=[],styles=[];` | ประกาศตัวแปร reportRows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0744 | `  // อธิบาย: ฟังก์ชัน add เป็นส่วนหนึ่งของ flow ใน engine.js ใช้จัดการขั้นตอนย่อยตามชื่อฟังก์ชันนี้` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0745 | `  // ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0746 | `  const add=(row,style=null)=>{aoa.push(row);styles.push(style);};` | ประกาศตัวแปร add แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0747 | `  // อธิบาย: ฟังก์ชัน title เป็นส่วนหนึ่งของ flow ใน engine.js ใช้จัดการขั้นตอนย่อยตามชื่อฟังก์ชันนี้` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0748 | `  // ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0749 | `  const title=(label,color)=>{const row=aoa.length;add([label,'','',''],{type:'title',color});merges.push({s:{r:row,c:0},e:{r:row,c:3}});};` | สร้างตัวช่วยแบบ arrow function ชื่อ title เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0750 | `  title('สถานะไม่ ISSUE.',COLORS.reportBlue);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0751 | `  add(['ยอดเงินที่ยังไม่ Issue','',summary.TotalPremium,'บาท'],{type:'kpiMoney'});` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0752 | `  add(['จำนวนกรมธรรม์','',summary.TotalPolicies,'กรมธรรม์'],{type:'kpiCount'});` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0753 | `  add([]);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0754 | `  title('จำนวนวันที่ยังไม่ออกกรมธรรม์',COLORS.green);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0755 | `  add(['No.','ระยะเวลายังไม่ออกกรมธรรม์','Count of Policy','TotalPremium'],{type:'header',color:COLORS.green});` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0756 | `  for(const row of groupByAging(reportRows))add(row,{type:'agingBody'});` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0757 | `  add(['Grand Total','',summary.TotalPolicies,summary.TotalPremium],{type:'grand',color:COLORS.green});` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0758 | `  const sections=[['รอ Issue','รายการที่รอ ISSUE.',COLORS.reportBlue],['ติดปัญหาไม่เข้าในเมนู E','รายการติดปัญหาไม่เอาเข้าเมนู E',COLORS.orange],['ข้อมูลไม่ส...` | ประกาศตัวแปร sections แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0759 | `  for(const [status,label,color] of sections){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0760 | `    const grouped=groupStatusRows(reportRows,status);` | ประกาศตัวแปร grouped แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0761 | `    if(!grouped.length)continue;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0762 | `    add([]);title(label,color);add(['Date','จำนวนวันที่ยังไม่ออกกรมธรรม์','Count of Policy','ผลรวม'],{type:'header',color});` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0763 | `    for(const row of grouped)add([excelSerial(row[0]),row[1],row[2],row[3]],{type:'statusBody'});` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0764 | `    const subset=reportRows.filter(item=>item.PendingStatus===status);` | สร้างตัวช่วยแบบ arrow function ชื่อ subset เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0765 | `    add(['Grand Total','',subset.length,sum(subset,'TotalPremium')],{type:'grand',color});` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0766 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0767 | `  const worksheet=global.XLSX.utils.aoa_to_sheet(aoa,{cellDates:false});` | ประกาศตัวแปร worksheet แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0768 | `  worksheet['!cols']=[{wch:23},{wch:34},{wch:17},{wch:18}];worksheet['!merges']=merges;worksheet['!rows']=aoa.map((_,index)=>({hpt:styles[index]?.type==='tit...` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L0769 | `  for(let row=0;row<aoa.length;row++)for(let column=0;column<4;column++){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0770 | `    const meta=styles[row]\|\|{};let style=baseStyle({border:meta.type?undefined:false});` | ประกาศตัวแปร meta แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0771 | `    if(meta.type==='title')style=headerStyle(meta.color,20);else if(meta.type==='header')style=headerStyle(meta.color,12);else if(meta.type==='grand'){style=...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0772 | `    setCellStyle(worksheet,row,column,style);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0773 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0774 | `  global.XLSX.utils.book_append_sheet(workbook,worksheet,'Report');` | เรียกใช้ library XLSX/xlsx-js-style เพื่ออ่าน เขียน หรือจัดรูปแบบไฟล์ Excel |
| L0775 | `  return worksheet;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0776 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0777 | `// อธิบาย: สร้าง _Audit sheet เก็บ version/summary/removed rows` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0778 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0779 | `function buildAuditSheet(workbook,summary,removedRows=[]){` | ประกาศฟังก์ชัน buildAuditSheet เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0780 | `  const aoa=[['Key','Value'],...Object.entries(summary),[],['REMOVED ISSUED ROWS',''],['ProposalID','Source'],...removedRows.map(row=>[row.ProposalID,row.Dat...` | สร้างตัวช่วยแบบ arrow function ชื่อ aoa เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0781 | `  const worksheet=global.XLSX.utils.aoa_to_sheet(aoa);` | ประกาศตัวแปร worksheet แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0782 | `  worksheet['!cols']=[{wch:42},{wch:68}];` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0783 | `  for(let row=0;row<aoa.length;row++)for(let column=0;column<2;column++)setCellStyle(worksheet,row,column,row===0\|\|aoa[row]?.[0]==='ProposalID'?headerStyle(C...` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0784 | `  global.XLSX.utils.book_append_sheet(workbook,worksheet,'_Audit');` | เรียกใช้ library XLSX/xlsx-js-style เพื่ออ่าน เขียน หรือจัดรูปแบบไฟล์ Excel |
| L0785 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0786 | `// อธิบาย: ตั้ง metadata ของ workbook เช่น Title/Subject/Created` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0787 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0788 | `function setWorkbookProperties(workbook,title,processedAt){` | ประกาศฟังก์ชัน setWorkbookProperties เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0789 | `  workbook.Props={Title:title,Subject:\`BLACKWOLF ${CONFIG.version}\`,Author:'BLACKWOLF Browser Engine',CreatedDate:processedAt,ModifiedDate:processedAt};` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0790 | `  workbook.Workbook=workbook.Workbook\|\|{};` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0791 | `  workbook.CalcPr={calcMode:'auto',fullCalcOnLoad:true,forceFullCalc:true};` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0792 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0793 | `// อธิบาย: สร้าง Master workbook แบบไม่ใช้ template pivot preserving` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0794 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0795 | `function buildMasterWorkbook(context,summary){` | ประกาศฟังก์ชัน buildMasterWorkbook เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0796 | `  const workbook=global.XLSX.utils.book_new();` | ประกาศตัวแปร workbook แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0797 | `  buildDataSheet(workbook,context);buildControlSheets(workbook,context);buildPvSheets(workbook,context);buildReportSheet(workbook,context,summary);buildAudit...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0798 | `  setWorkbookProperties(workbook,'เช็คกรมธรรม์ต่างด้าวที่ยังไม่ออก - BLACKWOLF Web Master',context.processedAt);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0799 | `  workbook.Workbook.Views=[{activeTab:5}];` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0800 | `  workbook.Workbook.Sheets=workbook.SheetNames.map(name=>({name,Hidden:name==='_Audit'?1:0}));` | กำหนด handler/ฟังก์ชันให้ workbook.Workbook.Sheets เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง |
| L0801 | `  return workbook;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0802 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0803 | `// อธิบาย: สร้าง ISSUE workbook พร้อม Data/Check/ETL` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0804 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0805 | `function buildIssueWorkbook(context,summary){` | ประกาศฟังก์ชัน buildIssueWorkbook เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0806 | `  const workbook=global.XLSX.utils.book_new(),issuedSet=new Set(context.issuedIds);` | ประกาศตัวแปร workbook แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0807 | `  const issueRows=context.dailyFiltered.map(row=>[row.AgencyCode,row.Mticode,row.AgencyName,row.RequestCode,row.employeeName,row.alienCode,row.alienNameEn,ro...` | สร้างตัวช่วยแบบ arrow function ชื่อ issueRows เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0808 | `  addSheet(workbook,'Data',[ISSUE_HEADERS,...issueRows],[14,13,38,18,38,21,30,18,16,18,16,21,28,20,16,18],{dateCols:[11],moneyCols:[9],idCols:[3,5,10,13],tex...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0809 | `  const checkRows=[['Check P-ID','ออกกรมธรรม์'],...context.checkIds.map(value=>[value,'ออกกรมธรรม์'])];` | สร้างตัวช่วยแบบ arrow function ชื่อ checkRows เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0810 | `  addSheet(workbook,'Check',checkRows,[22,20],{idCols:[0],autoFilter:true});` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0811 | `  const etlRows=[['No','Prop - ID','Policy','Group'],...context.etl.records.map((record,index)=>[record.No\|\|index+1,record.PropId,record.Policy,record.Group])];` | สร้างตัวช่วยแบบ arrow function ชื่อ etlRows เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0812 | `  addSheet(workbook,'ETL',etlRows,[10,22,18,18],{idCols:[1],autoFilter:true});` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0813 | `  buildAuditSheet(workbook,{Version:CONFIG.version,RunId:summary.RunId,ProcessedAt:summary.ProcessedAt,OldCheckRowsIgnored:context.issueOldCheckRows,OldEtlRo...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0814 | `  setWorkbookProperties(workbook,'เช็คสถานะ ISSUE - BLACKWOLF Web Working File',context.processedAt);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0815 | `  workbook.Workbook.Views=[{activeTab:0}];` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0816 | `  workbook.Workbook.Sheets=workbook.SheetNames.map(name=>({name,Hidden:name==='_Audit'?1:0}));` | กำหนด handler/ฟังก์ชันให้ workbook.Workbook.Sheets เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง |
| L0817 | `  return workbook;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0818 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0819 | `// อธิบาย: เขียน workbook object เป็น Blob .xlsx` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0820 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0821 | `function workbookBlob(workbook){const bytes=global.XLSX.write(workbook,{bookType:'xlsx',type:'array',compression:true,cellDates:false,cellStyles:true});retur...` | ประกาศฟังก์ชัน workbookBlob เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0822 | `// อธิบาย: escape XML special characters ก่อน patch ไฟล์ .xlsx ภายใน ZIP` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0823 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0824 | `function xmlEscape(value){return String(value===null\|\|value===undefined?'':value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/...` | ประกาศฟังก์ชัน xmlEscape เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0825 | `// อธิบาย: escape string เพื่อใส่ใน RegExp อย่างปลอดภัย` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0826 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0827 | `function regexEscape(value){return String(value).replace(/[.*+?^${}()\|[\]\\]/g,'\\$&');}` | ประกาศฟังก์ชัน regexEscape เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0828 | `// อธิบาย: แปลง index column เป็นชื่อ Excel column เช่น 0=A, 27=AB` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0829 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0830 | `function columnName(index){let value=index+1,name='';while(value){const remainder=(value-1)%26;name=String.fromCharCode(65+remainder)+name;value=Math.floor((...` | ประกาศฟังก์ชัน columnName เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0831 | `// อธิบาย: อ่าน style id ของ cell จาก worksheet XML` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0832 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0833 | `function xmlCellStyle(sheetXml,reference,fallback='0'){` | ประกาศฟังก์ชัน xmlCellStyle เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0834 | `  const match=sheetXml.match(new RegExp(\`<c\\b(?=[^>]*\\br="${regexEscape(reference)}")[^>]*>\`));` | ประกาศตัวแปร match แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0835 | `  if(!match)return fallback;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0836 | `  const style=match[0].match(/\bs="(\d+)"/);` | ประกาศตัวแปร style แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0837 | `  return style?style[1]:fallback;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0838 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0839 | `// อธิบาย: สร้าง XML cell แบบ inline string` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0840 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0841 | `function xmlTextCell(reference,value,style){` | ประกาศฟังก์ชัน xmlTextCell เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0842 | `  const source=String(value===null\|\|value===undefined?'':value),space=/^\s\|\s$\|[\r\n]/.test(source)?' xml:space="preserve"':'';` | ประกาศตัวแปร source แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0843 | `  return\`<c r="${reference}"${style!==undefined&&style!==null?\` s="${style}"\`:''} t="inlineStr"><is><t${space}>${xmlEscape(source)}</t></is></c>\`;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0844 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0845 | `// อธิบาย: สร้าง XML cell แบบ number` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0846 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0847 | `function xmlNumberCell(reference,value,style){` | ประกาศฟังก์ชัน xmlNumberCell เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0848 | `  const numeric=Number(value);` | ประกาศตัวแปร numeric แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0849 | `  return\`<c r="${reference}"${style!==undefined&&style!==null?\` s="${style}"\`:''}><v>${Number.isFinite(numeric)?numeric:0}</v></c>\`;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0850 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0851 | `// อธิบาย: สร้าง XML cell แบบ formula พร้อม cached value` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0852 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0853 | `function xmlFormulaCell(reference,formula,cachedValue,style,valueType='s'){` | ประกาศฟังก์ชัน xmlFormulaCell เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0854 | `  const stringType=valueType==='s',value=stringType?String(cachedValue===null\|\|cachedValue===undefined?'':cachedValue):Number(cachedValue);` | ประกาศตัวแปร stringType แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0855 | `  return\`<c r="${reference}"${style!==undefined&&style!==null?\` s="${style}"\`:''}${stringType?' t="str"':''}><f>${xmlEscape(formula)}</f><v>${xmlEscape(strin...` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0856 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0857 | `// อธิบาย: แทนที่ sheetData/dimension/autoFilter ใน worksheet XML` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0858 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0859 | `function replaceWorksheetData(sheetXml,rowsXml,dimensionRef,autoFilterRef=''){` | ประกาศฟังก์ชัน replaceWorksheetData เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0860 | `  let output=sheetXml.replace(/<dimension\b[^>]*\/>/,\`<dimension ref="${dimensionRef}"/>\`);` | ประกาศตัวแปร output แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0861 | `  if(/<sheetData\b[^>]*>[\s\S]*?<\/sheetData>/.test(output))output=output.replace(/<sheetData\b[^>]*>[\s\S]*?<\/sheetData>/,\`<sheetData>${rowsXml}</sheetData...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0862 | `  else output=output.replace(/<sheetData\b[^>]*\/>/,\`<sheetData>${rowsXml}</sheetData>\`);` | ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข |
| L0863 | `  if(autoFilterRef){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0864 | `    if(/<autoFilter\b[^>]*\/>/.test(output))output=output.replace(/<autoFilter\b[^>]*\/>/,\`<autoFilter ref="${autoFilterRef}"/>\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0865 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0866 | `  return output;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0867 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0868 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0869 | `// อธิบาย: ดึง child XML tag ชั้นเดียวจาก block ที่กำหนด` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0870 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0871 | `function directXmlChildren(block,tagName){` | ประกาศฟังก์ชัน directXmlChildren เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0872 | `  const result=[];let cursor=0;` | ประกาศตัวแปร result แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0873 | `  while(cursor<block.length){` | เริ่ม loop แบบวนซ้ำตามเงื่อนไข ใช้รอหรือทำงานจนกว่าจะครบเงื่อนไข |
| L0874 | `    const start=block.indexOf(\`<${tagName}\`,cursor);if(start<0)break;` | ประกาศตัวแปร start แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0875 | `    const openEnd=block.indexOf('>',start);if(openEnd<0)break;` | ประกาศตัวแปร openEnd แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0876 | `    if(block[openEnd-1]==='/'){result.push(block.slice(start,openEnd+1));cursor=openEnd+1;continue;}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0877 | `    const close=\`</${tagName}>\`,end=block.indexOf(close,openEnd+1);if(end<0)break;` | ประกาศตัวแปร close แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0878 | `    result.push(block.slice(start,end+close.length));cursor=end+close.length;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0879 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0880 | `  return result;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0881 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0882 | `// อธิบาย: เพิ่ม custom number format ใน styles.xml ถ้ายังไม่มี` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0883 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0884 | `function ensureCustomNumberFormat(stylesXml,formatCode){` | ประกาศฟังก์ชัน ensureCustomNumberFormat เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0885 | `  const escaped=xmlEscape(formatCode),formatTags=stylesXml.match(/<numFmt\b[^>]*\/>/g)\|\|[];` | ประกาศตัวแปร escaped แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0886 | `  const existing=formatTags.find(tag=>attrFromTag(tag,'formatCode')===formatCode\|\|attrFromTag(tag,'formatCode')===escaped);` | สร้างตัวช่วยแบบ arrow function ชื่อ existing เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0887 | `  if(existing)return{xml:stylesXml,numFmtId:Number(attrFromTag(existing,'numFmtId'))};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0888 | `  const ids=formatTags.map(tag=>Number(attrFromTag(tag,'numFmtId'))\|\|0),numFmtId=Math.max(163,...ids)+1,newTag=\`<numFmt numFmtId="${numFmtId}" formatCode="${...` | สร้างตัวช่วยแบบ arrow function ชื่อ ids เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0889 | `  let output=stylesXml;` | ประกาศตัวแปร output แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0890 | `  if(/<numFmts\b[^>]*>[\s\S]*?<\/numFmts>/.test(output))output=output.replace(/<numFmts\b([^>]*)>([\s\S]*?)<\/numFmts>/,(_,attrs,body)=>{const count=Number(a...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0891 | `  else output=output.replace(/<fonts\b/,\`<numFmts count="1">${newTag}</numFmts><fonts\`);` | ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข |
| L0892 | `  return{xml:output,numFmtId};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0893 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0894 | `// อธิบาย: เพิ่ม cell style ที่อ้าง custom number format` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0895 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0896 | `function ensureNumberFormatStyle(stylesXml,baseStyleId,formatCode='dd/mm/yyyy'){` | ประกาศฟังก์ชัน ensureNumberFormatStyle เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0897 | `  const fmt=ensureCustomNumberFormat(stylesXml,formatCode);let output=fmt.xml;` | ประกาศตัวแปร fmt แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0898 | `  const blockMatch=output.match(/<cellXfs\b[^>]*>[\s\S]*?<\/cellXfs>/);if(!blockMatch)return{xml:output,styleId:String(baseStyleId)};` | ประกาศตัวแปร blockMatch แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0899 | `  const block=blockMatch[0],styles=directXmlChildren(block,'xf'),base=styles[Number(baseStyleId)]\|\|styles[0];if(!base)return{xml:output,styleId:String(baseSt...` | ประกาศตัวแปร block แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0900 | `  let clone=base.replace(/\bnumFmtId="[^"]*"/,\`numFmtId="${fmt.numFmtId}"\`);` | ประกาศตัวแปร clone แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0901 | `  if(!/\bnumFmtId=/.test(clone))clone=clone.replace(/^<xf\b/,'<xf numFmtId="'+fmt.numFmtId+'"');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0902 | `  clone=/\bapplyNumberFormat=/.test(clone)?clone.replace(/\bapplyNumberFormat="[^"]*"/,'applyNumberFormat="1"'):clone.replace(/^<xf\b/,'<xf applyNumberFormat...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0903 | `  const open=block.match(/^<cellXfs\b[^>]*>/)?.[0]\|\|'<cellXfs>',count=styles.length+1,newOpen=/\bcount="[^"]*"/.test(open)?open.replace(/\bcount="[^"]*"/,\`co...` | ประกาศตัวแปร open แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0904 | `  output=output.replace(block,newBlock);return{xml:output,styleId:String(styles.length)};` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0905 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0906 | `// อธิบาย: เตรียม map style วันที่เพื่อใช้ตอน patch sheet XML` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0907 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0908 | `function ensureDateStyleMap(stylesXml,baseStyleIds){` | ประกาศฟังก์ชัน ensureDateStyleMap เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0909 | `  let output=stylesXml;const map={};` | ประกาศตัวแปร output แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0910 | `  for(const raw of [...new Set((baseStyleIds\|\|[]).map(value=>String(value??'0')))]){const result=ensureNumberFormatStyle(output,raw,'dd/mm/yyyy');output=resu...` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0911 | `  return{xml:output,map};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0912 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0913 | `// อธิบาย: อัปเดตช่วง ref ของ Excel table` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0914 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0915 | `function updateTableRange(tableXml,range){` | ประกาศฟังก์ชัน updateTableRange เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0916 | `  let output=tableXml.replace(/(<table\b[^>]*\bref=")[^"]*(")/,'$1'+range+'$2');` | ประกาศตัวแปร output แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0917 | `  output=output.replace(/(<autoFilter\b[^>]*\bref=")[^"]*(")/,'$1'+range+'$2');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0918 | `  const lastRow=Number((range.match(/:(?:[A-Z]+)(\d+)$/)\|\|[])[1]\|\|1);` | ประกาศตัวแปร lastRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0919 | `  output=output.replace(/(<sortState\b[^>]*\bref=")[^"]*(")/,'$1'+\`A2:W${lastRow}\`+'$2').replace(/(<sortCondition\b[^>]*\bref=")[^"]*(")/,'$1'+\`T1:T${lastRow...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0920 | `  return output;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0921 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0922 | `// อธิบาย: normalize path ภายใน xlsx zip relationship` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0923 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0924 | `function normalizeZipPath(basePath,target){` | ประกาศฟังก์ชัน normalizeZipPath เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0925 | `  const base=basePath.split('/');base.pop();` | ประกาศตัวแปร base แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0926 | `  for(const part of String(target\|\|'').split('/')){if(!part\|\|part==='.')continue;if(part==='..')base.pop();else base.push(part);}` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0927 | `  return base.join('/');` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0928 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0929 | `// อธิบาย: คำนวณ path ของ .rels สำหรับ worksheet หนึ่ง` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0930 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0931 | `function worksheetRelsPath(sheetPath){const parts=sheetPath.split('/'),file=parts.pop();return\`${parts.join('/')}/_rels/${file}.rels\`;}` | ประกาศฟังก์ชัน worksheetRelsPath เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0932 | `// อธิบาย: อ่าน attribute จาก XML tag ด้วย regex` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0933 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0934 | `function attrFromTag(tag,name){const match=tag.match(new RegExp(\`(?:^\|\\s)${regexEscape(name)}="([^"]*)"\`));return match?match[1]:'';}` | ประกาศฟังก์ชัน attrFromTag เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0935 | `// อธิบาย: หา path ของ worksheet จากชื่อ sheet ใน workbook.xml/rels` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0936 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0937 | `function worksheetPathByName(workbookXml,workbookRelsXml,name){` | ประกาศฟังก์ชัน worksheetPathByName เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0938 | `  const sheetTags=workbookXml.match(/<sheet\b[^>]*\/>/g)\|\|[];` | ประกาศตัวแปร sheetTags แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0939 | `  const tag=sheetTags.find(item=>attrFromTag(item,'name')===name);if(!tag)return'';` | สร้างตัวช่วยแบบ arrow function ชื่อ tag เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0940 | `  const relationId=attrFromTag(tag,'r:id');if(!relationId)return'';` | ประกาศตัวแปร relationId แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0941 | `  const relationTags=workbookRelsXml.match(/<Relationship\b[^>]*\/>/g)\|\|[];` | ประกาศตัวแปร relationTags แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0942 | `  const relation=relationTags.find(item=>attrFromTag(item,'Id')===relationId);if(!relation)return'';` | สร้างตัวช่วยแบบ arrow function ชื่อ relation เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0943 | `  return normalizeZipPath('xl/workbook.xml',attrFromTag(relation,'Target'));` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0944 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0945 | `// อธิบาย: หา table XML ที่ผูกกับ worksheet จาก relationship` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0946 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0947 | `async function tablePathForWorksheet(zip,sheetPath){` | ประกาศฟังก์ชัน tablePathForWorksheet เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0948 | `  const relPath=worksheetRelsPath(sheetPath),file=zip.file(relPath);if(!file)return'';` | ประกาศตัวแปร relPath แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0949 | `  const rels=await file.async('string'),relations=rels.match(/<Relationship\b[^>]*\/>/g)\|\|[];` | ประกาศตัวแปร rels แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0950 | `  const relation=relations.find(item=>/\/table$/.test(attrFromTag(item,'Type')));return relation?normalizeZipPath(sheetPath,attrFromTag(relation,'Target')):'';` | สร้างตัวช่วยแบบ arrow function ชื่อ relation เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0951 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0952 | `// อธิบาย: ตรวจรายการไฟล์สำคัญที่ template pivot ต้องมี` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0953 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0954 | `function pivotTemplateRequiredFiles(zip){` | ประกาศฟังก์ชัน pivotTemplateRequiredFiles เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0955 | `  const names=new Set(Object.keys(zip.files));` | ประกาศตัวแปร names แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0956 | `  return['xl/pivotTables/pivotTable1.xml','xl/pivotCache/pivotCacheDefinition1.xml','xl/pivotCache/pivotCacheDefinition2.xml'].every(name=>names.has(name));` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0957 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0958 | `// อธิบาย: คำนวณจำนวน column จาก range เช่น A1:W10` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0959 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0960 | `function rangeWidth(reference){` | ประกาศฟังก์ชัน rangeWidth เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0961 | `  const match=String(reference\|\|'').match(/^([A-Z]+)\d+:([A-Z]+)\d+$/);if(!match)return 0;` | ประกาศตัวแปร match แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0962 | `  const index=name=>[...name].reduce((value,character)=>value*26+character.charCodeAt(0)-64,0);` | สร้างตัวช่วยแบบ arrow function ชื่อ index เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0963 | `  return index(match[2])-index(match[1])+1;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0964 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0965 | `// อธิบาย: อ่าน relationship targets ตาม type ที่ต้องการ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0966 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0967 | `async function relationshipTargets(zip,partPath,typeSuffix){` | ประกาศฟังก์ชัน relationshipTargets เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0968 | `  const relPath=worksheetRelsPath(partPath),file=zip.file(relPath);if(!file)return[];` | ประกาศตัวแปร relPath แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0969 | `  const xml=await file.async('string'),tags=xml.match(/<Relationship\b[^>]*\/>/g)\|\|[];` | ประกาศตัวแปร xml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0970 | `  return tags.filter(tag=>String(attrFromTag(tag,'Type')).endsWith(typeSuffix)).map(tag=>({id:attrFromTag(tag,'Id'),target:normalizeZipPath(partPath,attrFrom...` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0971 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0972 | `// อธิบาย: ตรวจโครงสร้าง pivot template ภายใน zip ก่อน patch` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0973 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0974 | `async function inspectPivotTemplateZip(zip,options={}){` | ประกาศฟังก์ชัน inspectPivotTemplateZip เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0975 | `  const mode=options.mode\|\|'source',expectedReportPivotCount=options.expectedReportPivotCount??(mode==='source'?5:null);` | ประกาศตัวแปร mode แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0976 | `  if(!pivotTemplateRequiredFiles(zip))return{ok:false,message:'ขาด PivotTable1 หรือ PivotCacheDefinition หลัก'};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0977 | `  const workbookFile=zip.file('xl/workbook.xml'),relsFile=zip.file('xl/_rels/workbook.xml.rels'),stylesFile=zip.file('xl/styles.xml');` | ประกาศตัวแปร workbookFile แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0978 | `  if(!workbookFile\|\|!relsFile\|\|!stylesFile)return{ok:false,message:'Workbook relationships หรือ styles ไม่ครบ'};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0979 | `  const workbookXml=await workbookFile.async('string'),workbookRelsXml=await relsFile.async('string'),stylesXml=await stylesFile.async('string');` | ประกาศตัวแปร workbookXml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0980 | `  const dxfMatch=stylesXml.match(/<dxfs\b[^>]*\bcount="(\d+)"/),dxfCount=dxfMatch?Number(dxfMatch[1]):0;` | ประกาศตัวแปร dxfMatch แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0981 | `  const required=[['Data','Table1',23],['ข้อมูลไม่สมบูรณ์','SM',2],['Black List','BL',2],['PV Final','Table15',9]];` | ประกาศตัวแปร required แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0982 | `  for(const [sheetName,tableName,columnCount] of required){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0983 | `    const sheetPath=worksheetPathByName(workbookXml,workbookRelsXml,sheetName);if(!sheetPath\|\|!zip.file(sheetPath))return{ok:false,message:\`ขาด Sheet ${sheet...` | ประกาศตัวแปร sheetPath แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0984 | `    const tablePath=await tablePathForWorksheet(zip,sheetPath);if(!tablePath\|\|!zip.file(tablePath))return{ok:false,message:\`ขาด Table ของ Sheet ${sheetName}\`};` | ประกาศตัวแปร tablePath แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0985 | `    const tableXml=await zip.file(tablePath).async('string'),tableTag=(tableXml.match(/<table\b[^>]*>/)\|\|[])[0]\|\|'',columnsTag=(tableXml.match(/<tableColumns...` | ประกาศตัวแปร tableXml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0986 | `    if(attrFromTag(tableTag,'name')!==tableName\|\|attrFromTag(tableTag,'displayName')!==tableName)return{ok:false,message:\`Table ${tableName} ไม่ตรงโครงสร้าง\`};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0987 | `    const reference=attrFromTag(tableTag,'ref'),declaredColumns=Number(attrFromTag(columnsTag,'count')\|\|0),actualColumns=(tableXml.match(/<tableColumn\b/g)\|\|...` | ประกาศตัวแปร reference แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0988 | `    if(rangeWidth(reference)!==columnCount\|\|declaredColumns!==columnCount\|\|actualColumns!==columnCount)return{ok:false,message:\`Table ${tableName} จำนวนคอลัม...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0989 | `    const dxfIds=(tableXml.match(/(?:DxfId\|dxfId)="(\d+)"/g)\|\|[]).map(value=>Number((value.match(/\d+/)\|\|[])[0]\|\|0));` | ประกาศตัวแปร dxfIds แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0990 | `    if(dxfIds.some(value=>value<0\|\|value>=dxfCount))return{ok:false,message:\`Table ${tableName} อ้าง Style เกินขอบเขต\`};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0991 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0992 | `  const pvSheet=worksheetPathByName(workbookXml,workbookRelsXml,'PV'),reportSheet=worksheetPathByName(workbookXml,workbookRelsXml,'Report');` | ประกาศตัวแปร pvSheet แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0993 | `  if(!pvSheet\|\|!reportSheet\|\|!zip.file(pvSheet)\|\|!zip.file(reportSheet))return{ok:false,message:'ขาด Sheet PV หรือ Report'};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0994 | `  const pvRelations=await relationshipTargets(zip,pvSheet,'/pivotTable'),reportRelations=await relationshipTargets(zip,reportSheet,'/pivotTable');` | ประกาศตัวแปร pvRelations แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0995 | `  if(pvRelations.length!==1)return{ok:false,message:\`PV ต้องมี PivotTable 1 ตัว แต่พบ ${pvRelations.length}\`};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0996 | `  if(expectedReportPivotCount!==null&&reportRelations.length!==expectedReportPivotCount)return{ok:false,message:\`Report ต้องมี PivotTable ${expectedReportPiv...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0997 | `  if(mode==='source'&&reportRelations.length!==5)return{ok:false,message:\`Clean Template ต้องมี Report Pivot 5 ตัว แต่พบ ${reportRelations.length}\`};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0998 | `  const allRelations=[...pvRelations.map(item=>({...item,scope:'PV'})),...reportRelations.map(item=>({...item,scope:'Report'}))],targets=new Set();` | สร้างตัวช่วยแบบ arrow function ชื่อ allRelations เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0999 | `  for(const relation of allRelations){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L1000 | `    if(targets.has(relation.target))return{ok:false,message:\`Pivot relationship ซ้ำ ${relation.target}\`};targets.add(relation.target);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1001 | `    const pivotFile=zip.file(relation.target);if(!pivotFile)return{ok:false,message:\`ขาด ${relation.target}\`};` | ประกาศตัวแปร pivotFile แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1002 | `    const pivotXml=await pivotFile.async('string'),location=(pivotXml.match(/<location\b[^>]*\bref="([^"]+)"/)\|\|[])[1]\|\|'',fieldCount=Number((pivotXml.match(...` | ประกาศตัวแปร pivotXml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1003 | `    if(!/^[A-Z]+\d+:[A-Z]+\d+$/.test(location))return{ok:false,message:\`Pivot ${relation.target} ไม่มี Location ที่ถูกต้อง\`};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1004 | `    const expectedFields=relation.scope==='PV'?23:9;if(fieldCount!==expectedFields)return{ok:false,message:\`Pivot ${relation.target} ต้องมี ${expectedFields}...` | ประกาศตัวแปร expectedFields แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1005 | `    const cacheRelations=await relationshipTargets(zip,relation.target,'/pivotCacheDefinition');` | ประกาศตัวแปร cacheRelations แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1006 | `    if(cacheRelations.length!==1)return{ok:false,message:\`Pivot ${relation.target} ต้องผูก PivotCache 1 ตัว\`};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1007 | `    const expectedCache=relation.scope==='PV'?'xl/pivotCache/pivotCacheDefinition1.xml':'xl/pivotCache/pivotCacheDefinition2.xml';` | ประกาศตัวแปร expectedCache แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1008 | `    if(cacheRelations[0].target!==expectedCache)return{ok:false,message:\`Pivot ${relation.target} ผูก Cache ผิด (${cacheRelations[0].target})\`};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1009 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1010 | `  const orphanPivots=Object.keys(zip.files).filter(name=>/^xl\/pivotTables\/pivotTable\d+\.xml$/.test(name)&&!targets.has(name));` | สร้างตัวช่วยแบบ arrow function ชื่อ orphanPivots เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1011 | `  if(orphanPivots.length)return{ok:false,message:\`พบ PivotTable ไม่ได้ผูกกับ Sheet: ${orphanPivots.join(', ')}\`};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1012 | `  const cacheChecks=[['xl/pivotCache/pivotCacheDefinition1.xml','Data',23],['xl/pivotCache/pivotCacheDefinition2.xml','Table15',9]];` | ประกาศตัวแปร cacheChecks แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1013 | `  for(const [cachePath,sourceName,fieldCount] of cacheChecks){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L1014 | `    const file=zip.file(cachePath);if(!file)return{ok:false,message:\`ขาด ${cachePath}\`};` | ประกาศตัวแปร file แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1015 | `    const xml=await file.async('string'),declared=Number((xml.match(/<cacheFields\b[^>]*\bcount="(\d+)"/)\|\|[])[1]\|\|0),actual=(xml.match(/<cacheField\b/g)\|\|[]...` | ประกาศตัวแปร xml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1016 | `    if(declared!==fieldCount\|\|actual!==fieldCount)return{ok:false,message:\`${cachePath} จำนวน Cache Field ไม่ถูกต้อง\`};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1017 | `    const sourceOk=sourceName==='Data'?/<worksheetSource\b[^>]*\bsheet="Data"/.test(xml):/<worksheetSource\b[^>]*\bname="Table15"/.test(xml);` | ประกาศตัวแปร sourceOk แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1018 | `    if(!sourceOk)return{ok:false,message:\`${cachePath} ผูก Source ไม่ถูกต้อง\`};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1019 | `    const recordRelations=await relationshipTargets(zip,cachePath,'/pivotCacheRecords');` | ประกาศตัวแปร recordRelations แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1020 | `    if(recordRelations.length!==1\|\|!zip.file(recordRelations[0].target))return{ok:false,message:\`${cachePath} ขาด Pivot Cache Records\`};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1021 | `    if(mode!=='source'){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1022 | `      const tag=(xml.match(/<pivotCacheDefinition\b[^>]*>/)\|\|[])[0]\|\|'';` | ประกาศตัวแปร tag แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1023 | `      if(attrFromTag(tag,'refreshOnLoad')!=='0'\|\|attrFromTag(tag,'saveData')!=='1')return{ok:false,message:\`${cachePath} ต้องเก็บ Underlying Data และห้าม Aut...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1024 | `      const recordsXml=await zip.file(recordRelations[0].target).async('string'),definitionCount=Number(attrFromTag(tag,'recordCount')\|\|0),recordsTag=(record...` | ประกาศตัวแปร recordsXml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1025 | `      if(recordsCount!==actualRecords\|\|definitionCount!==recordsCount)return{ok:false,message:\`${cachePath} จำนวน Underlying Data ไม่ตรง (${definitionCount}/...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1026 | `    }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1027 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1028 | `  return{ok:true,message:\`Pivot Structure ผ่านแบบ Strict: PV ${pvRelations.length} · Report ${reportRelations.length} · Cache 2\`,details:{mode,pvPivotCount:p...` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1029 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1030 | `// อธิบาย: เปิด buffer template เป็น zip แล้ว inspect` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1031 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1032 | `async function inspectPivotTemplateBuffer(buffer,options={}){` | ประกาศฟังก์ชัน inspectPivotTemplateBuffer เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1033 | `  if(!buffer\|\|!global.JSZip)return{ok:false,message:'ไม่มี Pivot Template Buffer'};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1034 | `  try{return await inspectPivotTemplateZip(await global.JSZip.loadAsync(buffer),options);}catch(error){return{ok:false,message:error?.message\|\|String(error)};}` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L1035 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1036 | `// อธิบาย: inspect template จาก workbook หรือ bundled buffer` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1037 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1038 | `async function inspectPivotTemplate(workbook){` | ประกาศฟังก์ชัน inspectPivotTemplate เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1039 | `  if(!workbook?.__sourceBuffer\|\|!global.JSZip)return false;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1040 | `  if(typeof workbook.__pivotTemplateOk==='boolean')return workbook.__pivotTemplateOk;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1041 | `  const result=await inspectPivotTemplateBuffer(workbook.__sourceBuffer,{mode:'source'});workbook.__pivotTemplateOk=result.ok;workbook.__pivotTemplateDetails...` | ประกาศตัวแปร result แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1042 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1043 | `// อธิบาย: โหลด template pivot ที่ bundle มากับ assets` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1044 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1045 | `async function loadBundledPivotTemplate(){` | ประกาศฟังก์ชัน loadBundledPivotTemplate เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1046 | `  if(bundledPivotTemplatePromise)return bundledPivotTemplatePromise;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1047 | `  bundledPivotTemplatePromise=(async()=>{` | กำหนด handler/ฟังก์ชันให้ bundledPivotTemplatePromise เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง |
| L1048 | `    if(typeof global.fetch!=='function')return null;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1049 | `    const response=await global.fetch(BUNDLED_PIVOT_TEMPLATE_URL,{cache:'no-store'});if(!response.ok)throw new Error(\`โหลด Clean Pivot Template ไม่สำเร็จ (${...` | ประกาศตัวแปร response แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1050 | `    const buffer=await response.arrayBuffer(),inspection=await inspectPivotTemplateBuffer(buffer,{mode:'source'});if(!inspection.ok)throw new Error(\`Clean Pi...` | ประกาศตัวแปร buffer แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1051 | `  })().catch(error=>{console.warn('Bundled Pivot Template unavailable',error);return null;});` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L1052 | `  return bundledPivotTemplatePromise;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1053 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1054 | `// อธิบาย: เลือก template buffer จาก master เดิมหรือ bundled template` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1055 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1056 | `async function resolvePivotTemplateBuffer(workbook){` | ประกาศฟังก์ชัน resolvePivotTemplateBuffer เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1057 | `  const bundled=await loadBundledPivotTemplate();if(bundled)return{buffer:bundled,source:'BUNDLED_CLEAN_V2.5.3'};` | ประกาศตัวแปร bundled แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1058 | `  if(workbook?.__sourceBuffer&&await inspectPivotTemplate(workbook))return{buffer:workbook.__sourceBuffer,source:'UPLOADED_MASTER'};` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1059 | `  return null;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1060 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1061 | `// อธิบาย: สร้าง XML ของ Data sheet ใหม่สำหรับ template preserving` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1062 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1063 | `function buildDataSheetXml(sourceXml,context){` | ประกาศฟังก์ชัน buildDataSheetXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1064 | `  const headerStyles=MASTER_OUTPUT_HEADERS.map((_,column)=>xmlCellStyle(sourceXml,\`${columnName(column)}1\`,'0'));` | สร้างตัวช่วยแบบ arrow function ชื่อ headerStyles เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1065 | `  const bodyStyles=MASTER_OUTPUT_HEADERS.map((_,column)=>xmlCellStyle(sourceXml,\`${columnName(column)}2\`,headerStyles[column]\|\|'0'));` | สร้างตัวช่วยแบบ arrow function ชื่อ bodyStyles เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1066 | `  const headerCells=MASTER_OUTPUT_HEADERS.map((value,column)=>xmlTextCell(\`${columnName(column)}1\`,value,headerStyles[column])).join('');` | สร้างตัวช่วยแบบ arrow function ชื่อ headerCells เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1067 | `  const rows=[\`<row r="1" spans="1:23">${headerCells}</row>\`];` | ประกาศตัวแปร rows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1068 | `  const run=context.processedAt;` | ประกาศตัวแปร run แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1069 | `  for(let index=0;index<context.pending.length;index++){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L1070 | `    const excelRow=index+2,row=context.pending[index],cells=[];` | ประกาศตัวแปร excelRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1071 | `    const values=[row.AgencyCode,row.Mticode,row.AgencyName,row.RequestCode,row.employeeName,row.alienCode,row.alienNameEn,row.CertificateNo,row.Policy,row.T...` | ประกาศตัวแปร values แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1072 | `    for(let column=0;column<values.length;column++){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L1073 | `      const reference=\`${columnName(column)}${excelRow}\`,value=values[column],style=bodyStyles[column];` | ประกาศตัวแปร reference แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1074 | `      if(column===9)cells.push(xmlNumberCell(reference,number(value),style));` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1075 | `      else if(column===11){const serial=excelSerial(value);cells.push(serial===null?xmlTextCell(reference,'',style):xmlNumberCell(reference,serial,style));}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1076 | `      else cells.push(xmlTextCell(reference,value,style));` | ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข |
| L1077 | `    }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1078 | `    const {p,q,r,t,u,v,w}=dataRowFormulas(excelRow,run);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1079 | `    cells.push(xmlFormulaCell(\`P${excelRow}\`,p,row.Note,bodyStyles[15],'s'));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1080 | `    cells.push(xmlFormulaCell(\`Q${excelRow}\`,q,row.IncompleteStatus,bodyStyles[16],'s'));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1081 | `    cells.push(xmlFormulaCell(\`R${excelRow}\`,r,row.BlacklistStatus,bodyStyles[17],'s'));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1082 | `    cells.push(xmlTextCell(\`S${excelRow}\`,row.MenuEProblem,bodyStyles[18]));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1083 | `    const dateSerial=excelSerial(row.Date);cells.push(xmlFormulaCell(\`T${excelRow}\`,t,dateSerial===null?0:dateSerial,bodyStyles[19],'n'));` | ประกาศตัวแปร dateSerial แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1084 | `    cells.push(xmlFormulaCell(\`U${excelRow}\`,u,row.PendingStatus,bodyStyles[20],'s'));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1085 | `    cells.push(xmlFormulaCell(\`V${excelRow}\`,v,row.AgingDays===null\|\|row.AgingDays===undefined?0:row.AgingDays,bodyStyles[21],'n'));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1086 | `    cells.push(xmlFormulaCell(\`W${excelRow}\`,w,row.PendingRange,bodyStyles[22],'s'));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1087 | `    rows.push(\`<row r="${excelRow}" spans="1:23">${cells.join('')}</row>\`);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1088 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1089 | `  if(!context.pending.length)rows.push(\`<row r="2" spans="1:23">${MASTER_OUTPUT_HEADERS.map((_,column)=>xmlEmptyCell(\`${columnName(column)}2\`,bodyStyles[colu...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1090 | `  const lastRow=Math.max(2,context.pending.length+1),range=\`A1:W${lastRow}\`;` | ประกาศตัวแปร lastRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1091 | `  return{xml:replaceWorksheetData(sourceXml,rows.join(''),range,range),range,lastRow};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1092 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1093 | `// อธิบาย: สร้าง XML ของ control sheet เช่น Check/ETL` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1094 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1095 | `function buildControlSheetXml(sourceXml,statusLabel,ids){` | ประกาศฟังก์ชัน buildControlSheetXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1096 | `  const headers=['สถานะ','Prop ID'],headerStyles=headers.map((_,column)=>xmlCellStyle(sourceXml,\`${columnName(column)}1\`,'0')),bodyStyles=headers.map((_,colu...` | ประกาศตัวแปร headers แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1097 | `  const rows=[\`<row r="1" spans="1:2">${headers.map((value,column)=>xmlTextCell(\`${columnName(column)}1\`,value,headerStyles[column])).join('')}</row>\`];` | ประกาศตัวแปร rows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1098 | `  (ids\|\|[]).forEach((value,index)=>{const row=index+2;rows.push(\`<row r="${row}" spans="1:2">${xmlTextCell(\`A${row}\`,statusLabel,bodyStyles[0])}${xmlTextCell...` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L1099 | `  if(!(ids\|\|[]).length)rows.push(\`<row r="2" spans="1:2">${xmlEmptyCell('A2',bodyStyles[0])}${xmlEmptyCell('B2',bodyStyles[1])}</row>\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1100 | `  const lastRow=Math.max(2,(ids\|\|[]).length+1),range=\`A1:B${lastRow}\`;` | ประกาศตัวแปร lastRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1101 | `  return{xml:replaceWorksheetData(sourceXml,rows.join(''),range,range),range,lastRow};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1102 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1103 | `// อธิบาย: เตรียม rows สำหรับ PV Final แสดงผลเหมือน PV` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1104 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1105 | `function pvFinalDisplayRows(context){return pvRows(context);}` | ประกาศฟังก์ชัน pvFinalDisplayRows เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1106 | `// อธิบาย: สร้าง XML ของ PV sheet` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1107 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1108 | `function buildPvSheetXml(sourceXml,context,dateStyleMap={}){` | ประกาศฟังก์ชัน buildPvSheetXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1109 | `  const headers=['Date','Policy','Mticode','AgencyName','ProposalID','สถานะไม่ issue','จำนวนวันที่ยังไม่ออกกรมธรรม์','ระยะเวลายังไม่ออกกรมธรรม์','Sum of Tota...` | ประกาศตัวแปร headers แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1110 | `  const filterStyles=headers.map((_,column)=>xmlCellStyle(sourceXml,\`${columnName(column)}2\`,'0')),headerStyles=headers.map((_,column)=>xmlCellStyle(sourceXm...` | สร้างตัวช่วยแบบ arrow function ชื่อ filterStyles เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1111 | `  const rows=[\`<row r="2" spans="1:9">${reportStyledCells(2,['Status','(All)','','','','','','',''],filterStyles).join('')}</row>\`,\`<row r="4" spans="1:9">${...` | ประกาศตัวแปร rows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1112 | `  const values=pvFinalDisplayRows(context),dateStyle=dateStyleMap[bodyStyles[0]]\|\|bodyStyles[0];` | ประกาศตัวแปร values แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1113 | `  values.forEach((record,index)=>{const row=index+5,cells=[];record.forEach((value,column)=>{const reference=\`${columnName(column)}${row}\`,style=column===0?d...` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L1114 | `  const lastRow=values.length?values.length+4:4,locationRef=\`A4:I${Math.max(4,lastRow)}\`;` | ประกาศตัวแปร lastRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1115 | `  return{xml:replaceWorksheetData(sourceXml,rows.join(''),\`A1:I${Math.max(4,lastRow)}\`),lastRow,locationRef,rows:values};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1116 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1117 | `// อธิบาย: สร้าง XML ของ PV Final sheet` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1118 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1119 | `function buildPvFinalSheetXml(sourceXml,context,dateStyleMap={}){` | ประกาศฟังก์ชัน buildPvFinalSheetXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1120 | `  const headers=['Date','Policy','Mticode','AgencyName','ProposalID','สถานะไม่ issue','จำนวนวันที่ยังไม่ออกกรมธรรม์','ระยะเวลายังไม่ออกกรมธรรม์','Sum of Tota...` | ประกาศตัวแปร headers แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1121 | `  const headerStyles=headers.map((_,column)=>xmlCellStyle(sourceXml,\`${columnName(column)}1\`,'0')),bodyStyles=headers.map((_,column)=>xmlCellStyle(sourceXml,...` | สร้างตัวช่วยแบบ arrow function ชื่อ headerStyles เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1122 | `  const rows=[\`<row r="1" spans="1:9">${headers.map((value,column)=>xmlTextCell(\`${columnName(column)}1\`,value,headerStyles[column])).join('')}</row>\`];` | ประกาศตัวแปร rows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1123 | `  const values=pvFinalDisplayRows(context);` | ประกาศตัวแปร values แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1124 | `  values.forEach((record,index)=>{` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L1125 | `    const row=index+2,cells=[];` | ประกาศตัวแปร row แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1126 | `    record.forEach((value,column)=>{const reference=\`${columnName(column)}${row}\`,style=column===0?dateStyle:bodyStyles[column];if(column===0){const serial=e...` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L1127 | `    rows.push(\`<row r="${row}" spans="1:9">${cells.join('')}</row>\`);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1128 | `  });` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1129 | `  if(!values.length)rows.push(\`<row r="2" spans="1:9">${headers.map((_,column)=>xmlEmptyCell(\`${columnName(column)}2\`,column===0?dateStyle:bodyStyles[column]...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1130 | `  const lastRow=Math.max(2,values.length+1),range=\`A1:I${lastRow}\`;` | ประกาศตัวแปร lastRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1131 | `  return{xml:replaceWorksheetData(sourceXml,rows.join(''),range,range),range,lastRow,rows:values};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1132 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1133 | `const REPORT_BLOCKS=[` | กำหนดค่าคงที่ REPORT_BLOCKS สำหรับใช้เป็นค่ากลางของ flow นี้ |
| L1134 | `  {key:'waiting',status:'รอ Issue',label:'รายการที่รอ ISSUE.',pivotName:'PivotTable14',originalPivotRow:23},` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1135 | `  {key:'menuE',status:'ติดปัญหาไม่เข้าในเมนู E',label:'รายการติดปัญหาไม่เอาเข้าเมนู E',pivotName:'PivotTable5',originalPivotRow:54},` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1136 | `  {key:'incomplete',status:'ข้อมูลไม่สมบูรณ์',label:'รายการข้อมูลไม่สมบูรณ์',pivotName:'PivotTable3',originalPivotRow:134},` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1137 | `  {key:'blacklist',status:'Blacklist',label:'สถานะ Blacklist.',pivotName:'PivotTable1',originalPivotRow:170}` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1138 | `];` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1139 | `const REPORT_STATUS_ORDER=REPORT_BLOCKS.map(block=>block.status);` | สร้างตัวช่วยแบบ arrow function ชื่อ REPORT_STATUS_ORDER เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1140 | `const REPORT_AGING_ORDER=['1 - 7 วัน','8 - 15 วัน','16 - 30 วัน','มากกว่า 30 วัน'];` | กำหนดค่าคงที่ REPORT_AGING_ORDER สำหรับใช้เป็นค่ากลางของ flow นี้ |
| L1141 | `// อธิบาย: เพิ่มหรือแก้ attribute ใน XML root attribute string` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1142 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1143 | `function upsertXmlAttribute(attributes,name,value){` | ประกาศฟังก์ชัน upsertXmlAttribute เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1144 | `  const pattern=new RegExp(\`\\s${regexEscape(name)}="[^"]*"\`);` | ประกาศตัวแปร pattern แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1145 | `  return pattern.test(attributes)?attributes.replace(pattern,\` ${name}="${xmlEscape(value)}"\`):\`${attributes} ${name}="${xmlEscape(value)}"\`;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1146 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1147 | `// อธิบาย: สร้าง object item สำหรับ pivot cache` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1148 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1149 | `function pivotCacheItem(type,value=''){return{type,value:type==='n'?Number(value):String(value??'')};}` | ประกาศฟังก์ชัน pivotCacheItem เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1150 | `// อธิบาย: สร้าง key กันซ้ำของ pivot cache item` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1151 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1152 | `function pivotCacheItemKey(item){return\`${item.type}:${item.type==='n'&&Object.is(item.value,-0)?0:item.value}\`;}` | ประกาศฟังก์ชัน pivotCacheItemKey เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1153 | `// อธิบาย: สร้าง pivot cache item สำหรับวันที่` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1154 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1155 | `function pivotCacheDateItem(value){` | ประกาศฟังก์ชัน pivotCacheDateItem เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1156 | `  if(!value)return pivotCacheItem('m');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1157 | `  const key=dateKey(value);return key?pivotCacheItem('d',\`${key}T00:00:00\`):pivotCacheItem('m');` | ประกาศตัวแปร key แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1158 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1159 | `// อธิบาย: สร้าง pivot cache item สำหรับข้อความหรือ missing item` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1160 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1161 | `function pivotCacheTextItem(value){return hasValue(value)?pivotCacheItem('s',String(value)):pivotCacheItem('m');}` | ประกาศฟังก์ชัน pivotCacheTextItem เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1162 | `// อธิบาย: เลือกชนิด pivot cache item จากค่าจริง number/date/text/blank` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1163 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1164 | `function pivotCacheMixedItem(value){` | ประกาศฟังก์ชัน pivotCacheMixedItem เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1165 | `  if(value===null\|\|value===undefined\|\|value==='')return pivotCacheItem('m');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1166 | `  const numeric=Number(value);return typeof value==='number'&&Number.isFinite(numeric)?pivotCacheItem('n',numeric):pivotCacheItem('s',String(value));` | ประกาศตัวแปร numeric แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1167 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1168 | `// อธิบาย: สร้างรายการ unique items ตามลำดับที่ pivot ต้องใช้` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1169 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1170 | `function orderedUniquePivotItems(values,{fixed=[],sort='none'}={}){` | ประกาศฟังก์ชัน orderedUniquePivotItems เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1171 | `  const items=[],seen=new Set(),push=item=>{const key=pivotCacheItemKey(item);if(!seen.has(key)){seen.add(key);items.push(item);}};` | ประกาศตัวแปร items แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1172 | `  fixed.forEach(push);values.forEach(push);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1173 | `  if(sort==='date')items.sort((left,right)=>left.type==='m'?1:right.type==='m'?-1:String(left.value).localeCompare(String(right.value)));` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1174 | `  if(sort==='mixed')items.sort((left,right)=>{` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1175 | `    const rank=item=>item.type==='n'?0:item.type==='s'?1:2,difference=rank(left)-rank(right);if(difference)return difference;` | สร้างตัวช่วยแบบ arrow function ชื่อ rank เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1176 | `    if(left.type==='n')return left.value-right.value;return String(left.value).localeCompare(String(right.value),'th');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1177 | `  });` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1178 | `  return items;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1179 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1180 | `// อธิบาย: สร้าง XML ของ cache item แต่ละตัว` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1181 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1182 | `function pivotCacheValueXml(item,{unused=false}={}){` | ประกาศฟังก์ชัน pivotCacheValueXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1183 | `  const unusedAttribute=unused?' u="1"':'';` | ประกาศตัวแปร unusedAttribute แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1184 | `  if(item.type==='m')return'<m/>';` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1185 | `  if(item.type==='n')return\`<n v="${item.value}"${unusedAttribute}/>\`;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1186 | `  if(item.type==='d')return\`<d v="${xmlEscape(item.value)}"${unusedAttribute}/>\`;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1187 | `  return\`<s v="${xmlEscape(item.value)}"${unusedAttribute}/>\`;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1188 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1189 | `// อธิบาย: สร้าง sharedItems XML ของ pivot cache` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1190 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1191 | `function pivotSharedItemsXml(items,{usedKeys=new Set()}={}){` | ประกาศฟังก์ชัน pivotSharedItemsXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1192 | `  const types=new Set(items.map(item=>item.type)),attributes=[];` | สร้างตัวช่วยแบบ arrow function ชื่อ types เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1193 | `  const hasBlank=types.has('m'),hasString=types.has('s'),hasNumber=types.has('n'),hasDate=types.has('d');` | ประกาศตัวแปร hasBlank แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1194 | `  if(hasBlank)attributes.push('containsBlank="1"');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1195 | `  if(hasDate){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1196 | `    attributes.push('containsSemiMixedTypes="0"','containsMixedTypes="0"','containsNonDate="0"','containsDate="1"','containsString="0"');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1197 | `  }else if(hasNumber&&!hasString){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1198 | `    attributes.push('containsSemiMixedTypes="0"','containsMixedTypes="0"','containsString="0"','containsNumber="1"');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1199 | `  }else if(hasNumber&&hasString){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1200 | `    attributes.push('containsSemiMixedTypes="1"','containsMixedTypes="1"','containsString="1"','containsNumber="1"','containsNonDate="1"');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1201 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1202 | `  const numbers=items.filter(item=>item.type==='n').map(item=>item.value);` | สร้างตัวช่วยแบบ arrow function ชื่อ numbers เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1203 | `  if(numbers.length){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1204 | `    if(numbers.every(Number.isInteger))attributes.push('containsInteger="1"');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1205 | `    attributes.push(\`minValue="${Math.min(...numbers)}"\`,\`maxValue="${Math.max(...numbers)}"\`);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1206 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1207 | `  const dates=items.filter(item=>item.type==='d').map(item=>item.value).sort();` | สร้างตัวช่วยแบบ arrow function ชื่อ dates เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1208 | `  if(dates.length)attributes.push(\`minDate="${xmlEscape(dates[0])}"\`,\`maxDate="${xmlEscape(dates[dates.length-1])}"\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1209 | `  attributes.push(\`count="${items.length}"\`);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1210 | `  const children=items.map(item=>pivotCacheValueXml(item,{unused:usedKeys.size>0&&!usedKeys.has(pivotCacheItemKey(item))})).join('');` | สร้างตัวช่วยแบบ arrow function ชื่อ children เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1211 | `  return children?\`<sharedItems ${attributes.join(' ')}>${children}</sharedItems>\`:\`<sharedItems ${attributes.join(' ')}/>\`;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1212 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1213 | `// อธิบาย: สร้าง snapshot items/index ของ pivot cache สำหรับ Report` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1214 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1215 | `function buildReportPivotCacheSnapshot(rows){` | ประกาศฟังก์ชัน buildReportPivotCacheSnapshot เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1216 | `  const fieldNames=['Date','Policy','Mticode','AgencyName','ProposalID','สถานะไม่ issue','จำนวนวันที่ยังไม่ออกกรมธรรม์','ระยะเวลายังไม่ออกกรมธรรม์','Sum of T...` | ประกาศตัวแปร fieldNames แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1217 | `  const normalized=(rows\|\|[]).map(row=>[` | สร้างตัวช่วยแบบ arrow function ชื่อ normalized เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1218 | `    pivotCacheDateItem(row[0]),pivotCacheTextItem(row[1]),pivotCacheTextItem(row[2]),pivotCacheTextItem(row[3]),pivotCacheTextItem(row[4]),pivotCacheTextItem...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1219 | `  ]);` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1220 | `  const actualStatuses=new Set(normalized.map(row=>row[5]).filter(item=>item.type==='s').map(item=>item.value));` | สร้างตัวช่วยแบบ arrow function ชื่อ actualStatuses เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1221 | `  const unexpectedStatuses=[...actualStatuses].filter(value=>!REPORT_STATUS_ORDER.includes(value));` | สร้างตัวช่วยแบบ arrow function ชื่อ unexpectedStatuses เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1222 | `  if(unexpectedStatuses.length)throw new Error(\`BW-PIVOT-CACHE-005: พบสถานะนอก SOP: ${unexpectedStatuses.join(', ')}\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1223 | `  const actualAging=new Set(normalized.map(row=>row[7]).filter(item=>item.type==='s').map(item=>item.value));` | สร้างตัวช่วยแบบ arrow function ชื่อ actualAging เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1224 | `  const unexpectedAging=[...actualAging].filter(value=>!REPORT_AGING_ORDER.includes(value));` | สร้างตัวช่วยแบบ arrow function ชื่อ unexpectedAging เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1225 | `  if(unexpectedAging.length)throw new Error(\`BW-PIVOT-CACHE-006: พบช่วงวันนอก SOP: ${unexpectedAging.join(', ')}\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1226 | `  const shared=[];` | ประกาศตัวแปร shared แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1227 | `  for(let field=0;field<fieldNames.length;field++){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L1228 | `    const values=normalized.map(row=>row[field]);` | สร้างตัวช่วยแบบ arrow function ชื่อ values เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1229 | `    const options=field===0?{sort:'date'}:field===5?{fixed:REPORT_STATUS_ORDER.map(value=>pivotCacheItem('s',value))}:field===6?{sort:'mixed'}:field===7?{fix...` | ประกาศตัวแปร options แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1230 | `    const items=orderedUniquePivotItems(values,options),index=new Map(items.map((item,itemIndex)=>[pivotCacheItemKey(item),itemIndex])),usedKeys=new Set(valu...` | ประกาศตัวแปร items แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1231 | `    shared.push({items,index,usedKeys});` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1232 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1233 | `  const cacheFields=fieldNames.map((name,index)=>{` | สร้างตัวช่วยแบบ arrow function ชื่อ cacheFields เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1234 | `    const numFmtId=index===0?'14':'0';` | ประกาศตัวแปร numFmtId แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1235 | `    return\`<cacheField name="${xmlEscape(name)}" numFmtId="${numFmtId}">${pivotSharedItemsXml(shared[index].items,{usedKeys:shared[index].usedKeys})}</cacheF...` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1236 | `  }).join('');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1237 | `  const records=normalized.map(row=>\`<r>${row.map((item,index)=>{` | สร้างตัวช่วยแบบ arrow function ชื่อ records เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1238 | `    const itemIndex=shared[index].index.get(pivotCacheItemKey(item));` | ประกาศตัวแปร itemIndex แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1239 | `    if(itemIndex===undefined)throw new Error(\`BW-PIVOT-CACHE-001: ไม่พบ Cache Index field ${index}\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1240 | `    return\`<x v="${itemIndex}"/>\`;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1241 | `  }).join('')}</r>\`).join('');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1242 | `  return{` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1243 | `    fieldNames,normalized,shared,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1244 | `    cacheFieldsXml:\`<cacheFields count="${fieldNames.length}">${cacheFields}</cacheFields>\`,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1245 | `    recordsXml:\`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><pivotCacheRecords xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" x...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1246 | `    recordCount:normalized.length,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1247 | `    statusItems:shared[5].items.filter(item=>item.type==='s').map(item=>item.value)` | อ่านหรือเขียนข้อความ/ค่าฟอร์มบนหน้าเว็บ |
| L1248 | `  };` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1249 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1250 | `// อธิบาย: หา index ของ item ใน pivot sharedItems และ throw ถ้าไม่เจอ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1251 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1252 | `function pivotSharedIndex(snapshot,field,item,errorCode='BW-PIVOT-TABLE-001'){` | ประกาศฟังก์ชัน pivotSharedIndex เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1253 | `  const index=snapshot.shared[field]?.index.get(pivotCacheItemKey(item));` | ประกาศตัวแปร index แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1254 | `  if(index===undefined)throw new Error(\`${errorCode}: ไม่พบ Shared Item field ${field} value ${String(item?.value??'')}\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1255 | `  return index;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1256 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1257 | `// อธิบาย: อ่าน attributes ของ pivotTableDefinition root` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1258 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1259 | `function xmlRootAttributes(xml){return((xml.match(/<pivotTableDefinition\b([^>]*)>/)\|\|[])[1]\|\|'').trim();}` | ประกาศฟังก์ชัน xmlRootAttributes เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1260 | `// อธิบาย: ดึง style info เดิมของ pivot หรือใส่ค่า default` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1261 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1262 | `function pivotStyleInfoXml(xml){return(xml.match(/<pivotTableStyleInfo\b[^>]*\/>/)\|\|['<pivotTableStyleInfo name="PivotStyleMedium9" showRowHeaders="1" showCo...` | ประกาศฟังก์ชัน pivotStyleInfoXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1263 | `// อธิบาย: ทำความสะอาด attributes ที่ไม่ควรซ้ำก่อน rebuild pivot XML` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1264 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1265 | `function cleanPivotRootAttributes(xml){` | ประกาศฟังก์ชัน cleanPivotRootAttributes เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1266 | `  let attributes=xmlRootAttributes(xml).replace(/(?:^\|\s+)xmlns(:[A-Za-z0-9_]+)?="[^"]*"/g,'').trim().replace(/\s+refreshDataOnOpen="[^"]*"/g,'');` | ประกาศตัวแปร attributes แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1267 | `  for(const [name,value] of [['enableDrill','1'],['showDrill','1'],['preserveFormatting','1'],['compact','0'],['compactData','0'],['multipleFieldFilters','0'...` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L1268 | `  return attributes;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1269 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1270 | `// อธิบาย: สร้าง items XML ของ pivot field` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1271 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1272 | `function pivotItemsXml(snapshot,field,{visibleIndices=null,selectedIndex=null}={}){` | ประกาศฟังก์ชัน pivotItemsXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1273 | `  const sharedField=snapshot.shared[field],items=sharedField?.items\|\|[];` | ประกาศตัวแปร sharedField แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1274 | `  if(!items.length)return'';` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1275 | `  const visible=visibleIndices instanceof Set?visibleIndices:null;` | ประกาศตัวแปร visible แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1276 | `  return\`<items count="${items.length}">${items.map((item,index)=>{` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1277 | `    const attributes=[\`x="${index}"\`],used=sharedField.usedKeys.has(pivotCacheItemKey(item));` | ประกาศตัวแปร attributes แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1278 | `    if(!used)attributes.push('m="1"');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1279 | `    if(selectedIndex!==null&&selectedIndex!==undefined&&index!==selectedIndex)attributes.push('h="1"');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1280 | `    else if(visible&&!visible.has(index))attributes.push('h="1"');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1281 | `    return\`<item ${attributes.join(' ')}/>\`;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1282 | `  }).join('')}</items>\`;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1283 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1284 | `// อธิบาย: สร้าง pivotField XML แบบสั้น` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1285 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1286 | `function simplePivotField(attributes='',items=''){return\`<pivotField${attributes?' '+attributes:''}>${items}</pivotField>\`;}` | ประกาศฟังก์ชัน simplePivotField เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1287 | `// อธิบาย: สร้าง dataFields XML สำหรับ Report pivot เช่น Count/Sum` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1288 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1289 | `function reportDataFieldsXml(){return'<dataFields count="2"><dataField name="Count of Policy" fld="1" subtotal="count" numFmtId="3"/><dataField name="ผลรวม" ...` | ประกาศฟังก์ชัน reportDataFieldsXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1290 | `// อธิบาย: สร้าง column axis XML ของ Report pivot` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1291 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1292 | `function reportColumnAxisXml(){return'<colFields count="1"><field x="-2"/></colFields><colItems count="2"><i><x/></i><i i="1"><x v="1"/></i></colItems>';}` | ประกาศฟังก์ชัน reportColumnAxisXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1293 | `// อธิบาย: สร้าง pivot table XML สำหรับ aging report` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1294 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1295 | `function buildAgingPivotTableDefinition(existingXml,layout,snapshot){` | ประกาศฟังก์ชัน buildAgingPivotTableDefinition เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1296 | `  const visibleIndices=new Set((layout.groups\|\|[]).map(group=>pivotSharedIndex(snapshot,7,pivotCacheTextItem(group[1]))));` | สร้างตัวช่วยแบบ arrow function ชื่อ visibleIndices เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1297 | `  const fields=[];` | ประกาศตัวแปร fields แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1298 | `  for(let index=0;index<9;index++){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L1299 | `    if(index===1\|\|index===8)fields.push(simplePivotField('dataField="1" compact="0" outline="0" showAll="0" defaultSubtotal="0"'));` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1300 | `    else if(index===7)fields.push(simplePivotField('axis="axisRow" compact="0" outline="0" showAll="0" defaultSubtotal="0"',pivotItemsXml(snapshot,7,{visible...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1301 | `    else fields.push(simplePivotField('compact="0" outline="0" showAll="0" defaultSubtotal="0"'));` | ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข |
| L1302 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1303 | `  const rowItems=(layout.groups\|\|[]).map(group=>\`<i><x v="${pivotSharedIndex(snapshot,7,pivotCacheTextItem(group[1]))}"/></i>\`).join('')+'<i t="grand"><x/></...` | สร้างตัวช่วยแบบ arrow function ชื่อ rowItems เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1304 | `  return\`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><pivotTableDefinition xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ${cle...` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1305 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1306 | `// อธิบาย: สร้าง pivot table XML สำหรับ status report` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1307 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1308 | `function buildStatusPivotTableDefinition(existingXml,layout,snapshot){` | ประกาศฟังก์ชัน buildStatusPivotTableDefinition เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1309 | `  const statusIndex=pivotSharedIndex(snapshot,5,pivotCacheTextItem(layout.status),'BW-REPORT-FILTER-001');` | ประกาศตัวแปร statusIndex แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1310 | `  const dateVisible=new Set(),daysVisible=new Set(),rowItems=[];` | ประกาศตัวแปร dateVisible แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1311 | `  for(const group of layout.groups\|\|[]){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L1312 | `    const dateIndex=pivotSharedIndex(snapshot,0,pivotCacheDateItem(group[0])),daysIndex=pivotSharedIndex(snapshot,6,pivotCacheMixedItem(group[1]));` | ประกาศตัวแปร dateIndex แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1313 | `    dateVisible.add(dateIndex);daysVisible.add(daysIndex);rowItems.push(\`<i><x v="${dateIndex}"/><x v="${daysIndex}"/></i>\`);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1314 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1315 | `  rowItems.push('<i t="grand"><x/></i>');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1316 | `  const fields=[];` | ประกาศตัวแปร fields แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1317 | `  for(let index=0;index<9;index++){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L1318 | `    if(index===1\|\|index===8)fields.push(simplePivotField('dataField="1" compact="0" outline="0" showAll="0" defaultSubtotal="0"'));` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1319 | `    else if(index===0)fields.push(simplePivotField('axis="axisRow" compact="0" outline="0" showAll="0" sortType="ascending" defaultSubtotal="0"',pivotItemsXm...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1320 | `    else if(index===5)fields.push(simplePivotField('axis="axisPage" compact="0" outline="0" multipleItemSelectionAllowed="0" showAll="0" defaultSubtotal="0"'...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1321 | `    else if(index===6)fields.push(simplePivotField('axis="axisRow" compact="0" outline="0" showAll="0" sortType="ascending" defaultSubtotal="0"',pivotItemsXm...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1322 | `    else fields.push(simplePivotField('compact="0" outline="0" showAll="0" defaultSubtotal="0"'));` | ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข |
| L1323 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1324 | `  return{` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1325 | `    xml:\`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><pivotTableDefinition xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ${cle...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1326 | `    statusIndex` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1327 | `  };` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1328 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1329 | `// อธิบาย: สร้าง XML cell ว่างพร้อม style` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1330 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1331 | `function xmlEmptyCell(reference,style){return\`<c r="${reference}"${style!==undefined&&style!==null?\` s="${style}"\`:''}/>\`;}` | ประกาศฟังก์ชัน xmlEmptyCell เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1332 | `// อธิบาย: สร้าง XML row ของ Report พร้อมกำหนด height/hidden` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1333 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1334 | `function reportRowXml(rowNumber,cells,{height=20.1,hidden=false}={}){` | ประกาศฟังก์ชัน reportRowXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1335 | `  return\`<row r="${rowNumber}" spans="1:4"${hidden?' hidden="1"':''}${height?\` ht="${height}" customHeight="1"\`:''}>${cells.join('')}</row>\`;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1336 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1337 | `// อธิบาย: อ่าน style id จาก row ต้นแบบของ Report` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1338 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1339 | `function reportCellStyles(sourceXml,row){return[0,1,2,3].map(column=>xmlCellStyle(sourceXml,\`${columnName(column)}${row}\`,'0'));}` | ประกาศฟังก์ชัน reportCellStyles เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1340 | `// อธิบาย: สร้าง cells ของ Report โดยคง style และชนิด numeric/formula` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1341 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1342 | `function reportStyledCells(rowNumber,values,styles,numericColumns=[],formulaColumns={}){` | ประกาศฟังก์ชัน reportStyledCells เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1343 | `  return values.map((value,column)=>{` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1344 | `    const reference=\`${columnName(column)}${rowNumber}\`,style=styles[column];` | ประกาศตัวแปร reference แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1345 | `    if(formulaColumns[column])return xmlFormulaCell(reference,formulaColumns[column],value,style,'n');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1346 | `    if(value===null\|\|value===undefined\|\|value==='')return xmlEmptyCell(reference,style);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1347 | `    return numericColumns.includes(column)?xmlNumberCell(reference,value,style):xmlTextCell(reference,value,style);` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1348 | `  });` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1349 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1350 | `// อธิบาย: อัปเดต mergeCells ใน worksheet XML` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1351 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1352 | `function patchMergeCells(sheetXml,refs){` | ประกาศฟังก์ชัน patchMergeCells เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1353 | `  const block=\`<mergeCells count="${refs.length}">${refs.map(ref=>\`<mergeCell ref="${ref}"/>\`).join('')}</mergeCells>\`;` | ประกาศตัวแปร block แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1354 | `  if(/<mergeCells\b[^>]*>[\s\S]*?<\/mergeCells>/.test(sheetXml))return sheetXml.replace(/<mergeCells\b[^>]*>[\s\S]*?<\/mergeCells>/,block);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1355 | `  return sheetXml.replace(/<pageMargins\b/,\`${block}<pageMargins\`);` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1356 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1357 | `// อธิบาย: สร้าง Report sheet XML แบบ compact พร้อม staging ซ่อนสำหรับ pivot` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1358 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1359 | `function buildCompactReportSheetXml(sourceXml,context,summary,dateStyleMap={}){` | ประกาศฟังก์ชัน buildCompactReportSheetXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1360 | `  const reportRows=aggregatePvRows(context.pending),rows=[],merges=['A1:D1','A2:B2','A3:B3','A6:D6'],layouts={aging:null,sections:[],hiddenSections:[]};` | ประกาศตัวแปร reportRows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1361 | `  const topTitle=reportCellStyles(sourceXml,1),kpiMoney=reportCellStyles(sourceXml,2),kpiCount=reportCellStyles(sourceXml,3),blank4=reportCellStyles(sourceXm...` | ประกาศตัวแปร topTitle แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1362 | `  rows.push(reportRowXml(1,reportStyledCells(1,['สถานะไม่ ISSUE.','','',''],topTitle),{height:30}));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1363 | `  rows.push(reportRowXml(2,reportStyledCells(2,['ยอดเงินที่ยังไม่ Issue','',summary.TotalPremium,'บาท'],kpiMoney,[2],{2:'SUM(Table15[Sum of TotalPremium])'})));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1364 | `  rows.push(reportRowXml(3,reportStyledCells(3,['จำนวนกรมธรรม์','',summary.TotalPolicies,'กรมธรรม์'],kpiCount,[2],{2:'COUNTA(Table15[Policy])'})));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1365 | `  rows.push(reportRowXml(4,reportStyledCells(4,['','','',''],blank4)));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1366 | `  rows.push(reportRowXml(5,reportStyledCells(5,['','','',''],blank5),{hidden:true}));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1367 | `  rows.push(reportRowXml(6,reportStyledCells(6,['จำนวนวันที่ยังไม่ออกกรมธรรม์','','',''],agingTitle),{height:30}));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1368 | `  rows.push(reportRowXml(7,reportStyledCells(7,['No.','ระยะเวลายังไม่ออกกรมธรรม์','Count of Policy','TotalPremium'],agingHeader)));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1369 | `  const aging=groupByAging(reportRows);` | ประกาศตัวแปร aging แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1370 | `  let rowNumber=8;` | ประกาศตัวแปร rowNumber แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1371 | `  aging.forEach(item=>{rows.push(reportRowXml(rowNumber,reportStyledCells(rowNumber,item,agingBody,[0,2,3])));rowNumber++;});` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L1372 | `  const agingGrandRow=rowNumber;` | ประกาศตัวแปร agingGrandRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1373 | `  rows.push(reportRowXml(agingGrandRow,reportStyledCells(agingGrandRow,['Grand Total','',summary.TotalPolicies,summary.TotalPremium],agingGrand,[2,3])));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1374 | `  layouts.aging={ref:\`B7:D${agingGrandRow}\`,groups:aging};` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1375 | `  let cursor=agingGrandRow+2;` | ประกาศตัวแปร cursor แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1376 | `  const templateRows={waiting:21,menuE:52,incomplete:132,blacklist:168};` | ประกาศตัวแปร templateRows แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1377 | `  for(const block of REPORT_BLOCKS){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L1378 | `    const subset=reportRows.filter(item=>item.PendingStatus===block.status),groups=groupStatusRows(reportRows,block.status);` | สร้างตัวช่วยแบบ arrow function ชื่อ subset เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1379 | `    if(!subset.length\|\|!groups.length)continue;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1380 | `    const base=templateRows[block.key],filterStyles=reportCellStyles(sourceXml,base),titleStyles=reportCellStyles(sourceXml,base+1),valuesStyles=reportCellSt...` | ประกาศตัวแปร base แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1381 | `    const filterRow=cursor,titleRow=cursor+1,valuesRow=cursor+2,headerRow=cursor+3,dataStart=cursor+4;` | ประกาศตัวแปร filterRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1382 | `    rows.push(reportRowXml(filterRow,reportStyledCells(filterRow,['สถานะไม่ issue',block.status,'',''],filterStyles),{hidden:true}));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1383 | `    rows.push(reportRowXml(titleRow,reportStyledCells(titleRow,[block.label,'','',''],titleStyles),{height:30}));merges.push(\`A${titleRow}:D${titleRow}\`);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1384 | `    rows.push(reportRowXml(valuesRow,reportStyledCells(valuesRow,['','','Values',''],valuesStyles),{hidden:true}));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1385 | `    rows.push(reportRowXml(headerRow,reportStyledCells(headerRow,['Date','จำนวนวันที่ยังไม่ออกกรมธรรม์','Count of Policy','ผลรวม'],headerStyles)));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1386 | `    const statusDateStyles=[dateStyleMap[bodyStyles[0]]\|\|bodyStyles[0],bodyStyles[1],bodyStyles[2],bodyStyles[3]];groups.forEach((group,index)=>{const curren...` | สร้างตัวช่วยแบบ arrow function ชื่อ statusDateStyles เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1387 | `    const grandRow=dataStart+groups.length,sectionPremium=sum(subset,'TotalPremium');` | ประกาศตัวแปร grandRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1388 | `    rows.push(reportRowXml(grandRow,reportStyledCells(grandRow,['Grand Total','',subset.length,sectionPremium],grandStyles,[2,3])));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1389 | `    layouts.sections.push({...block,filterRow,titleRow,valuesRow,headerRow,dataStart,grandRow,ref:\`A${valuesRow}:D${grandRow}\`,groups,subset,hidden:false});` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1390 | `    cursor=grandRow+2;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1391 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1392 | `  const visibleLastRow=Math.max(agingGrandRow,...layouts.sections.map(item=>item.grandRow));` | สร้างตัวช่วยแบบ arrow function ชื่อ visibleLastRow เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1393 | `  // Hidden Pivot staging starts immediately after the visible report. A status PivotTable` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1394 | `  // renders its page filter two rows above <location ref>. Keep a hidden spacer row so` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1395 | `  // that the page filter lands on filterRow instead of leaking into the visible row below` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1396 | `  // the last Grand Total.` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1397 | `  let stagingCursor=visibleLastRow+1;` | ประกาศตัวแปร stagingCursor แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1398 | `  for(const block of REPORT_BLOCKS){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L1399 | `    if(layouts.sections.some(item=>item.key===block.key))continue;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1400 | `    const base=templateRows[block.key],filterStyles=reportCellStyles(sourceXml,base),valuesStyles=reportCellStyles(sourceXml,base+2),headerStyles=reportCellS...` | ประกาศตัวแปร base แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1401 | `    const filterRow=stagingCursor,spacerRow=stagingCursor+1,valuesRow=stagingCursor+2,headerRow=stagingCursor+3,grandRow=stagingCursor+4;` | ประกาศตัวแปร filterRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1402 | `    rows.push(reportRowXml(filterRow,reportStyledCells(filterRow,['สถานะไม่ issue',block.status,'',''],filterStyles),{hidden:true}));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1403 | `    rows.push(reportRowXml(spacerRow,reportStyledCells(spacerRow,['','','',''],valuesStyles),{hidden:true}));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1404 | `    rows.push(reportRowXml(valuesRow,reportStyledCells(valuesRow,['','','Values',''],valuesStyles),{hidden:true}));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1405 | `    rows.push(reportRowXml(headerRow,reportStyledCells(headerRow,['Date','จำนวนวันที่ยังไม่ออกกรมธรรม์','Count of Policy','ผลรวม'],headerStyles),{hidden:true...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1406 | `    rows.push(reportRowXml(grandRow,reportStyledCells(grandRow,['Grand Total','',0,0],grandStyles,[2,3]),{hidden:true}));` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1407 | `    layouts.hiddenSections.push({...block,filterRow,spacerRow,valuesRow,headerRow,grandRow,ref:\`A${valuesRow}:D${grandRow}\`,groups:[],subset:[],hidden:true});` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1408 | `    stagingCursor=grandRow+1;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1409 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1410 | `  const dimensionLastRow=Math.max(visibleLastRow,stagingCursor-1);` | ประกาศตัวแปร dimensionLastRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1411 | `  let output=replaceWorksheetData(sourceXml,rows.join(''),\`A1:D${dimensionLastRow}\`);` | ประกาศตัวแปร output แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1412 | `  output=patchMergeCells(output,merges);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1413 | `  output=output.replace(/(<sheetView\b[^>]*)(>)/,(_,attrs,end)=>{let next=attrs.replace(/\s+topLeftCell="[^"]*"/,'').replace(/\s+zoomScale="[^"]*"/,' zoomSca...` | กำหนด handler/ฟังก์ชันให้ output เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง |
| L1414 | `  return{xml:output,layouts,lastRow:visibleLastRow,dimensionLastRow};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1415 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1416 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L1417 | `// อธิบาย: ปรับตำแหน่ง pivot location ref` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1418 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1419 | `function patchPivotLocation(xml,ref){` | ประกาศฟังก์ชัน patchPivotLocation เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1420 | `  let output=xml.replace(/(<location\b[^>]*\bref=")[^"]*(")/,'$1'+ref+'$2');` | ประกาศตัวแปร output แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1421 | `  output=output.replace(/<pivotTableDefinition\b([^>]*)>/,(_,attrs)=>{let next=attrs.replace(/\s+refreshDataOnOpen="[^"]*"/g,'');for(const [name,value] of [[...` | กำหนด handler/ฟังก์ชันให้ output เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง |
| L1422 | `  return output;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1423 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1424 | `// อธิบาย: patch package ของ PV pivot ให้ชี้ข้อมูลใหม่` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1425 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1426 | `async function patchPvPivotPackage(zip,sheetPath,sourceXml,context,dateStyleMap){` | ประกาศฟังก์ชัน patchPvPivotPackage เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1427 | `  const pvResult=buildPvSheetXml(sourceXml,context,dateStyleMap),relsPath=worksheetRelsPath(sheetPath),relsFile=zip.file(relsPath);` | ประกาศตัวแปร pvResult แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1428 | `  if(relsFile){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1429 | `    const relsXml=await relsFile.async('string'),relation=(relsXml.match(/<Relationship\b[^>]*\/>/g)\|\|[]).find(tag=>/\/pivotTable"/.test(tag));` | ประกาศตัวแปร relsXml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1430 | `    if(relation){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1431 | `      const target=normalizeZipPath(sheetPath,attrFromTag(relation,'Target')),file=zip.file(target);` | ประกาศตัวแปร target แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1432 | `      if(file)zip.file(target,patchPivotLocation(await file.async('string'),pvResult.locationRef));` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1433 | `    }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1434 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1435 | `  zip.file(sheetPath,pvResult.xml);return pvResult;` | ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache |
| L1436 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1437 | `// อธิบาย: อ่าน row เริ่มต้นเดิมของ pivot location` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1438 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1439 | `function pivotOriginalStartRow(xml){const match=xml.match(/<location\b[^>]*\bref="[A-Z]+(\d+):/);return match?Number(match[1]):0;}` | ประกาศฟังก์ชัน pivotOriginalStartRow เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1440 | `// อธิบาย: patch Report pivot package ทั้ง worksheet, cache และ definitions` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1441 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1442 | `async function patchReportPivotPackage(zip,sheetPath,sourceXml,context,summary,contentTypesXml,dateStyleMap={},snapshot=null){` | ประกาศฟังก์ชัน patchReportPivotPackage เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1443 | `  const reportSnapshot=snapshot\|\|buildReportPivotCacheSnapshot(pvFinalDisplayRows(context)),reportResult=buildCompactReportSheetXml(sourceXml,context,summary...` | ประกาศตัวแปร reportSnapshot แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1444 | `  const relationTags=relsXml.match(/<Relationship\b[^>]*\/>/g)\|\|[],pivotRelations=[],filterMetadata=[];` | ประกาศตัวแปร relationTags แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1445 | `  for(const tag of relationTags){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L1446 | `    if(!/\/pivotTable"/.test(tag))continue;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1447 | `    const target=normalizeZipPath(sheetPath,attrFromTag(tag,'Target')),file=zip.file(target);if(!file)continue;` | ประกาศตัวแปร target แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1448 | `    const xml=await file.async('string'),pivotName=attrFromTag((xml.match(/<pivotTableDefinition\b[^>]*>/)\|\|[])[0]\|\|'','name');` | ประกาศตัวแปร xml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1449 | `    pivotRelations.push({tag,id:attrFromTag(tag,'Id'),target,xml,name:pivotName,start:pivotOriginalStartRow(xml)});` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1450 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1451 | `  const agingRelation=pivotRelations.find(item=>item.name==='PivotTable2')\|\|pivotRelations.find(item=>item.start===7);` | สร้างตัวช่วยแบบ arrow function ชื่อ agingRelation เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1452 | `  if(!agingRelation)throw new Error('BW-PIVOT-TABLE-002: ไม่พบ PivotTable2 สำหรับ Aging Report');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1453 | `  zip.file(agingRelation.target,buildAgingPivotTableDefinition(agingRelation.xml,reportResult.layouts.aging,reportSnapshot));` | ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache |
| L1454 | `  const statusLayouts=[...reportResult.layouts.sections,...reportResult.layouts.hiddenSections];` | ประกาศตัวแปร statusLayouts แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1455 | `  for(const relation of pivotRelations){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L1456 | `    if(relation===agingRelation)continue;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1457 | `    const layout=statusLayouts.find(item=>item.pivotName===relation.name)\|\|statusLayouts.find(item=>item.originalPivotRow===relation.start);` | สร้างตัวช่วยแบบ arrow function ชื่อ layout เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1458 | `    if(!layout)throw new Error(\`BW-REPORT-FILTER-005: ไม่พบ Layout สำหรับ Pivot เดิมแถว ${relation.start}\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1459 | `    const rebuilt=buildStatusPivotTableDefinition(relation.xml,layout,reportSnapshot);` | ประกาศตัวแปร rebuilt แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1460 | `    zip.file(relation.target,rebuilt.xml);` | ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache |
| L1461 | `    filterMetadata.push({pivotPath:relation.target,status:layout.status,item:rebuilt.statusIndex,location:layout.ref,pageRow:layout.filterRow,hiddenEndRow:la...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1462 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1463 | `  filterMetadata.sort((left,right)=>REPORT_STATUS_ORDER.indexOf(left.status)-REPORT_STATUS_ORDER.indexOf(right.status));` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L1464 | `  if(filterMetadata.length!==REPORT_BLOCKS.length)throw new Error(\`BW-REPORT-FILTER-004: Pivot Filter Metadata ${filterMetadata.length}/${REPORT_BLOCKS.lengt...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1465 | `  if(relsFile)zip.file(relsPath,relsXml);zip.file(sheetPath,reportResult.xml);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1466 | `  return{...reportResult,contentTypesXml,statusItems:reportSnapshot.statusItems,filterMetadata,snapshot:reportSnapshot};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1467 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1468 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L1469 | `// อธิบาย: ตั้ง print area ของ Report ให้พอดีกับแถวจริง` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1470 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1471 | `function patchReportPrintArea(workbookXml,lastRow){` | ประกาศฟังก์ชัน patchReportPrintArea เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1472 | `  return workbookXml.replace(/(<definedName\b[^>]*name="_xlnm\.Print_Area"[^>]*>)([^<]*Report[^<]*)(<\/definedName>)/g,(_,open,value,close)=>\`${open}'Report'...` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1473 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1474 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L1475 | `// อธิบาย: อัปเดต pivotCacheDefinition ให้ชี้ source range และ record count ใหม่` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1476 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1477 | `function patchPivotCacheSavedData(xml,{sourceRange='',recordCount=null,refreshOnLoad='0'}={}){` | ประกาศฟังก์ชัน patchPivotCacheSavedData เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1478 | `  let output=xml.replace(/<pivotCacheDefinition\b([^>]*)>/,(_,attrs)=>{` | สร้างตัวช่วยแบบ arrow function ชื่อ output เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1479 | `    let next=attrs;for(const [name,value] of [['refreshOnLoad',refreshOnLoad],['enableRefresh','1'],['backgroundQuery','0'],['saveData','1']])next=upsertXmlA...` | ประกาศตัวแปร next แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1480 | `    if(!/\sr:id="[^"]+"/.test(next))next=upsertXmlAttribute(next,'r:id','rId1');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1481 | `    if(recordCount!==null)next=upsertXmlAttribute(next,'recordCount',String(recordCount));` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1482 | `    return\`<pivotCacheDefinition${next}>\`;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1483 | `  });` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1484 | `  if(sourceRange)output=output.replace(/(<worksheetSource\b[^>]*\bref=")[^"]*(")/,'$1'+sourceRange+'$2');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1485 | `  return output;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1486 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1487 | `// อธิบาย: สร้าง/ปรับ pivotCacheDefinition สำหรับ Report` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1488 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1489 | `function buildReportPivotCacheDefinition(xml,rows,snapshot=null){` | ประกาศฟังก์ชัน buildReportPivotCacheDefinition เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1490 | `  const reportSnapshot=snapshot\|\|buildReportPivotCacheSnapshot(rows),outputBase=patchPivotCacheSavedData(xml,{recordCount:reportSnapshot.recordCount});` | ประกาศตัวแปร reportSnapshot แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1491 | `  if(!/<cacheFields\b[^>]*>[\s\S]*?<\/cacheFields>/.test(outputBase))throw new Error('BW-PIVOT-CACHE-002: Report Pivot Cache ไม่มี cacheFields');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1492 | `  const output=outputBase.replace(/<cacheFields\b[^>]*>[\s\S]*?<\/cacheFields>/,reportSnapshot.cacheFieldsXml);` | ประกาศตัวแปร output แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1493 | `  return{xml:output,...reportSnapshot};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1494 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1495 | `// อธิบาย: ดึง pivotField blocks จาก XML เพื่อ validation` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1496 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1497 | `function pivotFieldBlocks(xml){const container=(xml.match(/<pivotFields\b[^>]*>[\s\S]*?<\/pivotFields>/)\|\|[])[0]\|\|'';return container.match(/<pivotField\b[^>...` | ประกาศฟังก์ชัน pivotFieldBlocks เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1498 | `// อธิบาย: อ่าน references ของ item ใน pivotField` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1499 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1500 | `function pivotItemReferences(block){return[...(block.matchAll(/<item\b[^>]*\bx="(\d+)"[^>]*\/>/g))].map(match=>Number(match[1]));}` | ประกาศฟังก์ชัน pivotItemReferences เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1501 | `// อธิบาย: อ่าน item references ใน rowItems` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1502 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1503 | `function rowItemReferences(xml){return[...(xml.matchAll(/<rowItems\b[^>]*>[\s\S]*?<\/rowItems>/g))].flatMap(match=>[...match[0].matchAll(/<x\b[^>]*\bv="(\d+)...` | ประกาศฟังก์ชัน rowItemReferences เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1504 | `// อธิบาย: ตรวจ semantic ของ Report pivot ว่า cache/items/reference สอดคล้อง` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1505 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1506 | `async function validateReportPivotSemanticPackage(zip,snapshot){` | ประกาศฟังก์ชัน validateReportPivotSemanticPackage เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1507 | `  const failures=[],expectedCounts=snapshot.shared.map(field=>field.items.length),pivotPaths=Object.keys(zip.files).filter(name=>/^xl\/pivotTables\/pivotTabl...` | ประกาศตัวแปร failures แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1508 | `  if(pivotPaths.length!==5)failures.push(\`Report Pivot files ${pivotPaths.length}/5\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1509 | `  for(const path of pivotPaths){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L1510 | `    const xml=await zip.file(path).async('string'),fields=pivotFieldBlocks(xml),name=attrFromTag((xml.match(/<pivotTableDefinition\b[^>]*>/)\|\|[])[0]\|\|'','nam...` | ประกาศตัวแปร xml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1511 | `    if(fields.length!==expectedCounts.length){failures.push(\`${name\|\|path}: pivotFields ${fields.length}/${expectedCounts.length}\`);continue;}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1512 | `    fields.forEach((field,index)=>{` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L1513 | `      const references=pivotItemReferences(field);` | ประกาศตัวแปร references แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1514 | `      if(references.length&&references.length!==expectedCounts[index])failures.push(\`${name}: field ${index} items ${references.length}/${expectedCounts[inde...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1515 | `      if(new Set(references).size!==references.length)failures.push(\`${name}: field ${index} item x ซ้ำ\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1516 | `      if(references.some(value=>value<0\|\|value>=expectedCounts[index]))failures.push(\`${name}: field ${index} item x เกิน Cache\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1517 | `    });` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1518 | `    const page=(xml.match(/<pageField\b[^>]*\bfld="5"[^>]*\bitem="(\d+)"[^>]*\/>/)\|\|[])[1];` | ประกาศตัวแปร page แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1519 | `    if(name!=='PivotTable2'&&(page===undefined\|\|Number(page)>=expectedCounts[5]))failures.push(\`${name}: page filter ไม่ตรง Status Cache\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1520 | `    const refs=rowItemReferences(xml);if(refs.some(value=>!Number.isInteger(value)\|\|value<0))failures.push(\`${name}: rowItems index ไม่ถูกต้อง\`);` | สร้างตัวช่วยแบบ arrow function ชื่อ refs เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1521 | `    if(!/\benableDrill="1"/.test(xml)\|\|!/\bshowDrill="1"/.test(xml))failures.push(\`${name}: Drill-down ไม่ได้เปิด\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1522 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1523 | `  if(failures.length)throw new Error(\`BW-PIVOT-SEMANTIC-001: ${failures.join('; ')}\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1524 | `  return{ok:true,pivotCount:pivotPaths.length,cacheFieldCounts:expectedCounts.join(',')};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1525 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1526 | `// อธิบาย: อ่านเลข row ที่ถูกซ่อนใน worksheet XML` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1527 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1528 | `function worksheetHiddenRowSet(xml){` | ประกาศฟังก์ชัน worksheetHiddenRowSet เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1529 | `  const hidden=new Set();` | ประกาศตัวแปร hidden แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1530 | `  for(const match of xml.matchAll(/<row\b[^>]*>/g)){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L1531 | `    const row=Number(attrFromTag(match[0],'r'));` | ประกาศตัวแปร row แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1532 | `    if(row&&attrFromTag(match[0],'hidden')==='1')hidden.add(row);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1533 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1534 | `  return hidden;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1535 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1536 | `// อธิบาย: อ่าน rows ที่ pivot table วางอยู่` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1537 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1538 | `function pivotLocationRows(xml){` | ประกาศฟังก์ชัน pivotLocationRows เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1539 | `  const tag=(xml.match(/<location\b[^>]*\bref="[^"]+"[^>]*\/>/)\|\|[])[0]\|\|'',ref=attrFromTag(tag,'ref'),match=ref.match(/^[A-Z]+(\d+):[A-Z]+(\d+)$/);` | ประกาศตัวแปร tag แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1540 | `  return match?{ref,start:Number(match[1]),end:Number(match[2])}:null;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1541 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1542 | `// อธิบาย: ตรวจว่า staging rows ที่ใช้ feed pivot ถูกซ่อนจริงและไม่ชน report` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1543 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1544 | `async function validateHiddenReportPivotStaging(zip,sheetPath,reportPackage){` | ประกาศฟังก์ชัน validateHiddenReportPivotStaging เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1545 | `  const sheetFile=zip.file(sheetPath);if(!sheetFile)throw new Error('BW-REPORT-HIDDEN-001: ไม่พบ Report Worksheet');` | ประกาศตัวแปร sheetFile แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1546 | `  const sheetXml=await sheetFile.async('string'),hiddenRows=worksheetHiddenRowSet(sheetXml),failures=[];` | ประกาศตัวแปร sheetXml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1547 | `  for(const item of reportPackage.filterMetadata){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L1548 | `    const pivotFile=zip.file(item.pivotPath);if(!pivotFile){failures.push(\`${item.status}: ไม่พบ PivotTable XML\`);continue;}` | ประกาศตัวแปร pivotFile แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1549 | `    const pivotXml=await pivotFile.async('string'),location=pivotLocationRows(pivotXml);` | ประกาศตัวแปร pivotXml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1550 | `    if(!location){failures.push(\`${item.status}: ไม่พบ Pivot location\`);continue;}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1551 | `    const actualPageRow=location.start-2;` | ประกาศตัวแปร actualPageRow แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1552 | `    if(actualPageRow!==Number(item.pageRow))failures.push(\`${item.status}: Page Filter row ${actualPageRow}/${item.pageRow}\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1553 | `    if(!hiddenRows.has(actualPageRow))failures.push(\`${item.status}: Page Filter row ${actualPageRow} ไม่ถูกซ่อน\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1554 | `    if(item.hidden){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1555 | `      if(actualPageRow<=reportPackage.lastRow)failures.push(\`${item.status}: Hidden staging อยู่ในพื้นที่ Report ที่มองเห็น\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1556 | `      for(let row=actualPageRow;row<=location.end;row++)if(!hiddenRows.has(row))failures.push(\`${item.status}: Hidden staging row ${row} ไม่ถูกซ่อน\`);` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L1557 | `    }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1558 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1559 | `  if(failures.length)throw new Error(\`BW-REPORT-HIDDEN-001: ${failures.join('; ')}\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1560 | `  return{ok:true,statusPivotCount:reportPackage.filterMetadata.length,hiddenPivotCount:reportPackage.filterMetadata.filter(item=>item.hidden).length};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1561 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1562 | `// อธิบาย: เขียน pivotCacheRecords XML กลับเข้า zip` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1563 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1564 | `async function writePivotCacheRecords(zip,cachePath,recordsXml){` | ประกาศฟังก์ชัน writePivotCacheRecords เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1565 | `  const relations=await relationshipTargets(zip,cachePath,'/pivotCacheRecords');` | ประกาศตัวแปร relations แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1566 | `  if(relations.length!==1)throw new Error(\`BW-PIVOT-CACHE-003: ${cachePath} ต้องมี Pivot Cache Records 1 ตัว\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1567 | `  zip.file(relations[0].target,recordsXml);return relations[0].target;` | ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache |
| L1568 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1569 | `// อธิบาย: เปิดคุณสมบัติ drill-down ของ pivot XML` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1570 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1571 | `function enablePivotDrill(xml){return xml.replace(/<pivotTableDefinition\b([^>]*)>/,(_,attrs)=>{let next=attrs;for(const [name,value] of [['enableDrill','1']...` | ประกาศฟังก์ชัน enablePivotDrill เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1572 | `// อธิบาย: สร้าง XML ของ _Audit sheet สำหรับ template preserving path` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1573 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1574 | `function buildAuditSheetXml(summary,removedRows=[]){` | ประกาศฟังก์ชัน buildAuditSheetXml เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1575 | `  const data=[['Key','Value'],...Object.entries(summary),[],['REMOVED ISSUED ROWS',''],['ProposalID','Source'],...(removedRows\|\|[]).map(row=>[row.ProposalID,...` | สร้างตัวช่วยแบบ arrow function ชื่อ data เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1576 | `  const rows=data.map((values,index)=>{const row=index+1,cells=values.map((value,column)=>{const reference=\`${columnName(column)}${row}\`;return typeof value=...` | สร้างตัวช่วยแบบ arrow function ชื่อ rows เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1577 | `  return\`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><dimension ref="...` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1578 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1579 | `// อธิบาย: เพิ่มหรืออัปเดต _Audit sheet ใน xlsx zip package` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1580 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1581 | `function ensureAuditSheet(zip,workbookXml,workbookRelsXml,contentTypesXml,summary,removedRows){` | ประกาศฟังก์ชัน ensureAuditSheet เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1582 | `  const tags=workbookXml.match(/<sheet\b[^>]*\/>/g)\|\|[],existing=tags.find(tag=>attrFromTag(tag,'name')==='_Audit');let sheetPath='';` | ประกาศตัวแปร tags แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1583 | `  if(existing){const relationId=attrFromTag(existing,'r:id'),relation=(workbookRelsXml.match(/<Relationship\b[^>]*\/>/g)\|\|[]).find(tag=>attrFromTag(tag,'Id')...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1584 | `  else{` | ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข |
| L1585 | `    const sheetIds=tags.map(tag=>Number(attrFromTag(tag,'sheetId'))\|\|0),nextSheetId=Math.max(0,...sheetIds)+1;` | สร้างตัวช่วยแบบ arrow function ชื่อ sheetIds เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1586 | `    const relationIds=(workbookRelsXml.match(/Id="rId(\d+)"/g)\|\|[]).map(value=>Number((value.match(/\d+/)\|\|[])[0])\|\|0),nextRelationId=\`rId${Math.max(0,...rel...` | ประกาศตัวแปร relationIds แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1587 | `    const sheetNumbers=Object.keys(zip.files).map(name=>(name.match(/^xl\/worksheets\/sheet(\d+)\.xml$/)\|\|[])[1]).filter(Boolean).map(Number),nextSheetNumber...` | สร้างตัวช่วยแบบ arrow function ชื่อ sheetNumbers เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1588 | `    workbookXml=workbookXml.replace('</sheets>',\`<sheet name="_Audit" sheetId="${nextSheetId}" state="hidden" r:id="${nextRelationId}"/></sheets>\`);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1589 | `    workbookRelsXml=workbookRelsXml.replace('</Relationships>',\`<Relationship Id="${nextRelationId}" Type="http://schemas.openxmlformats.org/officeDocument/2...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1590 | `    if(!contentTypesXml.includes(\`PartName="/${sheetPath}"\`))contentTypesXml=contentTypesXml.replace('</Types>',\`<Override PartName="/${sheetPath}" ContentTy...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1591 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1592 | `  if(sheetPath)zip.file(sheetPath,buildAuditSheetXml(summary,removedRows));` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1593 | `  return{workbookXml,workbookRelsXml,contentTypesXml};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1594 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1595 | `// อธิบาย: ตรวจยอด PV/PV Final/Report ให้ reconcile กันก่อนส่งไฟล์ออก` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1596 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1597 | `function assertPvReportReconciliation(context,summary,pvResult,pvFinalResult,reportPackage){` | ประกาศฟังก์ชัน assertPvReportReconciliation เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1598 | `  const expected=pvFinalDisplayRows(context),expectedPremium=expected.reduce((total,row)=>total+number(row[8]),0),agingCount=(reportPackage.layouts.aging.gro...` | ประกาศตัวแปร expected แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1599 | `  const failures=[];` | ประกาศตัวแปร failures แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1600 | `  if(pvResult.rows.length!==expected.length)failures.push(\`PV ${pvResult.rows.length}/${expected.length}\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1601 | `  if(pvFinalResult.rows.length!==expected.length)failures.push(\`PV Final ${pvFinalResult.rows.length}/${expected.length}\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1602 | `  if(agingCount!==expected.length)failures.push(\`Report Aging ${agingCount}/${expected.length}\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1603 | `  if(sectionCount!==expected.length)failures.push(\`Report Block ${sectionCount}/${expected.length}\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1604 | `  if(Math.abs(expectedPremium-number(summary.TotalPremium))>.001)failures.push(\`PV Premium ${expectedPremium}/${summary.TotalPremium}\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1605 | `  if(Math.abs(sectionPremium-number(summary.TotalPremium))>.001)failures.push(\`Report Premium ${sectionPremium}/${summary.TotalPremium}\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1606 | `  if(failures.length)throw new Error(\`PV / PV Final / Report Reconciliation ไม่ผ่าน: ${failures.join(', ')}\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1607 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1608 | `// อธิบาย: สร้าง Master โดย patch จาก template เพื่อรักษา native pivot/drill-down` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1609 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1610 | `async function buildPivotPreservingMaster(templateBuffer,context,summary){` | ประกาศฟังก์ชัน buildPivotPreservingMaster เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1611 | `  if(!global.JSZip\|\|!templateBuffer)throw new Error('Pivot Template Engine ไม่พร้อมใช้งาน');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1612 | `  const zip=await global.JSZip.loadAsync(templateBuffer);if(!pivotTemplateRequiredFiles(zip))throw new Error('Master ไม่มี Pivot Template PV/Report ตามโครงสร...` | ประกาศตัวแปร zip แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1613 | `  let workbookXml=await zip.file('xl/workbook.xml').async('string'),workbookRelsXml=await zip.file('xl/_rels/workbook.xml.rels').async('string'),contentTypes...` | ประกาศตัวแปร workbookXml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1614 | `  const sheetPaths={data:worksheetPathByName(workbookXml,workbookRelsXml,'Data'),sm:worksheetPathByName(workbookXml,workbookRelsXml,'ข้อมูลไม่สมบูรณ์'),black...` | ประกาศตัวแปร sheetPaths แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1615 | `  if(Object.values(sheetPaths).some(value=>!value))throw new Error('Master Pivot Template ขาด Sheet Data / PV / PV Final / Report');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1616 | `  const dataXml=await zip.file(sheetPaths.data).async('string'),smXml=await zip.file(sheetPaths.sm).async('string'),blacklistXml=await zip.file(sheetPaths.bl...` | ประกาศตัวแปร dataXml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1617 | `  const dateBases=[xmlCellStyle(pvXml,'A5','0'),xmlCellStyle(pvFinalXml,'A2','0'),xmlCellStyle(reportXml,'A25','0'),xmlCellStyle(reportXml,'A56','0'),xmlCell...` | ประกาศตัวแปร dateBases แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1618 | `  const dataResult=buildDataSheetXml(dataXml,context),smResult=buildControlSheetXml(smXml,'ข้อมูลไม่สมบูรณ์',context.smIds),blacklistResult=buildControlSheet...` | ประกาศตัวแปร dataResult แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1619 | `  zip.file(sheetPaths.data,dataResult.xml);zip.file(sheetPaths.sm,smResult.xml);zip.file(sheetPaths.blacklist,blacklistResult.xml);zip.file(sheetPaths.pvFina...` | ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache |
| L1620 | `  for(const [sheetPath,range] of [[sheetPaths.data,dataResult.range],[sheetPaths.sm,smResult.range],[sheetPaths.blacklist,blacklistResult.range],[sheetPaths....` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L1621 | `  const pvResult=await patchPvPivotPackage(zip,sheetPaths.pv,pvXml,context,dateStyles.map),reportSnapshot=buildReportPivotCacheSnapshot(pvFinalResult.rows);` | ประกาศตัวแปร pvResult แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1622 | `  const reportPackage=await patchReportPivotPackage(zip,sheetPaths.report,reportXml,context,summary,contentTypesXml,dateStyles.map,reportSnapshot);contentTyp...` | ประกาศตัวแปร reportPackage แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1623 | `  const hiddenStagingInspection=await validateHiddenReportPivotStaging(zip,sheetPaths.report,reportPackage);` | ประกาศตัวแปร hiddenStagingInspection แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1624 | `  assertPvReportReconciliation(context,summary,pvResult,pvFinalResult,reportPackage);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1625 | `  const cacheDefinitions=Object.keys(zip.files).filter(name=>/^xl\/pivotCache\/pivotCacheDefinition\d+\.xml$/.test(name));let reportCacheRecordsPath='';` | สร้างตัวช่วยแบบ arrow function ชื่อ cacheDefinitions เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1626 | `  for(const name of cacheDefinitions){` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L1627 | `    const xml=await zip.file(name).async('string'),isDataCache=/<worksheetSource\b[^>]*\bsheet="Data"/.test(xml),isReportCache=/<worksheetSource\b[^>]*\bname...` | ประกาศตัวแปร xml แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1628 | `    if(isDataCache){zip.file(name,patchPivotCacheSavedData(xml,{sourceRange:dataResult.range}));continue;}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1629 | `    if(isReportCache){const rebuilt=buildReportPivotCacheDefinition(xml,pvFinalResult.rows,reportSnapshot);zip.file(name,rebuilt.xml);reportCacheRecordsPath=...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1630 | `    zip.file(name,patchPivotCacheSavedData(xml));` | ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache |
| L1631 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1632 | `  if(!reportCacheRecordsPath)throw new Error('BW-PIVOT-CACHE-004: ไม่พบ Report Pivot Cache Records');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1633 | `  const semanticInspection=await validateReportPivotSemanticPackage(zip,reportSnapshot);` | ประกาศตัวแปร semanticInspection แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1634 | `  const pivotTables=Object.keys(zip.files).filter(name=>/^xl\/pivotTables\/pivotTable\d+\.xml$/.test(name));for(const name of pivotTables)zip.file(name,enabl...` | สร้างตัวช่วยแบบ arrow function ชื่อ pivotTables เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1635 | `  const strictInspection=await inspectPivotTemplateZip(zip,{mode:'output',expectedReportPivotCount:5});` | ประกาศตัวแปร strictInspection แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1636 | `  if(!strictInspection.ok)throw new Error(\`BW-PIVOT-001: ${strictInspection.message}\`);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1637 | `  summary.PivotStructuralValidation='PASSED_STRICT_REUSABLE_MASTER';summary.PivotSemanticValidation='PASSED_CACHE_FIELDS_RECORDS_PIVOT_ITEMS';summary.PivotSe...` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L1638 | `  const audit=ensureAuditSheet(zip,workbookXml,workbookRelsXml,contentTypesXml,summary,context.removedRows);workbookXml=audit.workbookXml;workbookRelsXml=aud...` | ประกาศตัวแปร audit แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1639 | `  if(zip.file('xl/calcChain.xml'))zip.remove('xl/calcChain.xml');workbookRelsXml=workbookRelsXml.replace(/<Relationship\b[^>]*Type="[^"]*\/calcChain"[^>]*\/>...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1640 | `  zip.file('xl/workbook.xml',workbookXml);zip.file('xl/_rels/workbook.xml.rels',workbookRelsXml);zip.file('[Content_Types].xml',contentTypesXml);` | ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache |
| L1641 | `  const bytes=await zip.generateAsync({type:'uint8array',compression:'DEFLATE',compressionOptions:{level:6}});return new Blob([bytes],{type:'application/vnd....` | ประกาศตัวแปร bytes แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1642 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1643 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L1644 | `// อธิบาย: สร้างรหัส Run เช่น BWyyyymmdd_HHMMSS` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1645 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1646 | `function makeRunId(now=new Date()){return\`BW${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}$...` | ประกาศฟังก์ชัน makeRunId เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1647 | `// อธิบาย: สร้างชื่อไฟล์ output ตาม base name และวันที่รัน` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1648 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1649 | `function outputNames(processedAt){const runDate=dateKey(processedAt);return{master:\`${safeFileName(CONFIG.masterBaseName)}_${runDate}.xlsx\`,issue:\`${safeFile...` | ประกาศฟังก์ชัน outputNames เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1650 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L1651 | `// อธิบาย: ตรวจความพร้อมของไฟล์ ข้อมูล วันที่ และ template ก่อนรันจริง` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1652 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1653 | `async function preflight(workbooks,files,etlText='',manualStartDate=''){` | ประกาศฟังก์ชัน preflight เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1654 | `  const results=[];` | ประกาศตัวแปร results แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1655 | `  const master=findSheet(workbooks.master,['Data'],['ProposalID','CreateDate']);` | ประกาศตัวแปร master แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1656 | `  const masterInfo=extractMasterMaxDate(workbooks.master);` | ประกาศตัวแปร masterInfo แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1657 | `  const masterIdentity=master?analyzeStableDuplicateRows(extractMasterData(workbooks.master).rows):{duplicateKeys:0,duplicateRows:0,extraRows:0};` | ประกาศตัวแปร masterIdentity แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1658 | `  results.push({field:'master',name:files.master?.name\|\|'Master',ok:!!master,message:master?\`พบ Sheet ${master.name}; Header row ${master.rowIndex+1}; Date(T...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1659 | `  if(master)results.push({field:'masterIdentity',name:'Stable Record Identity',ok:true,message:masterIdentity.extraRows?\`พบแถวซ้ำจากรอบก่อน ${masterIdentity....` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1660 | `  const sourceVersion=masterEngineVersion(workbooks.master);` | ประกาศตัวแปร sourceVersion แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1661 | `  const unsafeVersion=sourceVersion==='3.5.1'\|\|sourceVersion==='3.5.2';` | ประกาศตัวแปร unsafeVersion แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1662 | `  results.push({field:'masterVersion',name:'Master Version',ok:!unsafeVersion,message:unsafeVersion?\`ห้ามใช้ Master V${sourceVersion} ต่อ เพราะเป็นรุ่นที่ St...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1663 | `  if(workbooks.master?.__sourceBuffer&&['PV','PV Final','Report'].every(name=>workbooks.master.SheetNames?.includes(name))){const uploadedOutput=await inspec...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1664 | `  const issueData=findNamedSheet(workbooks.issue,'Data'),issueCheck=extractIssueCheck(workbooks.issue),issueEtl=extractIssueEtl(workbooks.issue),issueOk=!!is...` | ประกาศตัวแปร issueData แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1665 | `  results.push({field:'issue',name:files.issue?.name\|\|'เช็คสถานะ ISSUE',ok:issueOk,message:issueOk?\`พบ Data + Check + ETL ครบ; ข้อมูลเดิม Check ${issueCheck....` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1666 | `  const dailyFound=findSheet(workbooks.daily,['Data'],DAILY_HEADERS);` | ประกาศตัวแปร dailyFound แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1667 | `  results.push({field:'daily',name:files.daily?.name\|\|'Daily Report',ok:!!dailyFound,message:dailyFound?\`พบ Sheet ${dailyFound.name}; Header row ${dailyFound...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1668 | `  const m190Found=findSheet(workbooks.m190,['Policy Detail'],['Prop Id']);` | ประกาศตัวแปร m190Found แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1669 | `  results.push({field:'m190',name:files.m190?.name\|\|'M190',ok:!!m190Found,message:m190Found?\`พบ Sheet ${m190Found.name}; Header row ${m190Found.rowIndex+1}\`:...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1670 | `  if(workbooks.sm){const found=extractControlIds(workbooks.sm,workbooks.sm.SheetNames);results.push({field:'sm',name:files.sm?.name\|\|'SM',ok:!!found.found,me...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1671 | `  if(workbooks.blacklist){const found=extractControlIds(workbooks.blacklist,workbooks.blacklist.SheetNames);results.push({field:'blacklist',name:files.blackl...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1672 | `  const etl=parseEtl(etlText);` | ประกาศตัวแปร etl แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1673 | `  if(etl.invalid)results.push({field:'etl',name:files.etl?.name\|\|'Auto-Mail 7.2',ok:false,message:\`ข้อความผิดรูปแบบ ${etl.invalid} บรรทัด\`});` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1674 | `  else results.push({field:'etl',name:files.etl?.name\|\|'Auto-Mail 7.2',ok:true,message:\`ข้อมูลรอบปัจจุบัน ${etl.records.length} แถว; ETL เดิมในไฟล์ ISSUE จะไ...` | ทางเลือกสำรองของเงื่อนไขก่อนหน้า ใช้เมื่อ if/else if ไม่เข้าเงื่อนไข |
| L1675 | `  let daily=null;` | ประกาศตัวแปร daily แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1676 | `  try{if(dailyFound)daily=extractDaily(workbooks.daily);}catch(error){results.push({field:'dailyDate',name:files.daily?.name\|\|'Daily Report',ok:false,message...` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L1677 | `  const manual=parseDate(manualStartDate);` | ประกาศตัวแปร manual แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1678 | `  const startOk=!!masterInfo.date\|\|!!manual;` | ประกาศตัวแปร startOk แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1679 | `  results.push({field:'startDate',name:'วันเริ่มต้น',ok:startOk,message:masterInfo.date?\`ใช้ Date คอลัมน์ T ล่าสุด: ${dateKey(masterInfo.date)}\`:manual?\`Mast...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1680 | `  if(startOk&&daily){const start=masterInfo.date\|\|dateOnly(manual),end=daily.maxDate<dateOnly(new Date())?daily.maxDate:dateOnly(new Date());if(end<start)res...` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L1681 | `  return{ok:results.every(result=>result.ok),results,masterDate:dateKey(masterInfo.date),manualStartDate:manual?dateKey(manual):'',issueOldCheckRows:issueChe...` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1682 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1683 | `// อธิบาย: ลำดับงานหลักทั้งหมดของ engine ตั้งแต่อ่านข้อมูลจนสร้าง blobs output` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1684 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1685 | `async function run({workbooks,etlText='',manualStartDate='',today=new Date(),onProgress=()=>{}}){` | ประกาศฟังก์ชัน run เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L1686 | `  const processedAt=new Date(today),runId=makeRunId(processedAt);` | ประกาศตัวแปร processedAt แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1687 | `  assertMasterVersionSafe(workbooks.master);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1688 | `  // อธิบาย: อัปเดตแถบ progress และข้อความสถานะระหว่างรัน` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1689 | `  // ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L1690 | `  const progress=async(percent,message)=>{onProgress(percent,message);await new Promise(resolve=>setTimeout(resolve,10));};` | สร้างตัวช่วยแบบ arrow function ชื่อ progress เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1691 | `  await progress(5,'อ่านรายการค้างและ Date จากไฟล์หลัก');` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L1692 | `  const masterData=extractMasterData(workbooks.master),masterInfo=extractMasterMaxDate(workbooks.master);` | ประกาศตัวแปร masterData แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1693 | `  await progress(12,'อ่านและตรวจช่วงวันที่จาก Daily Report');` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L1694 | `  const daily=extractDaily(workbooks.daily),dateRange=resolveDateRange(masterInfo,daily,dateOnly(processedAt),manualStartDate);` | ประกาศตัวแปร daily แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1695 | `  await progress(22,\`กรอง Daily Report ${dateKey(dateRange.start)} ถึง ${dateKey(dateRange.end)} รวม Status (blank)\`);` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L1696 | `  const filteredResult=filterDailyRows(daily,dateRange.start,dateRange.end),dailyFiltered=filteredResult.rows;` | ประกาศตัวแปร filteredResult แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1697 | `  await progress(32,'Carry Forward รายการค้างและรวมรายการเดิมด้วย Stable Record Identity');` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L1698 | `  const reconciled=reconcileRows(masterData.rows,dailyFiltered);` | ประกาศตัวแปร reconciled แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1699 | `  await progress(42,'ล้างข้อมูล Check/ETL เดิมในหน่วยความจำและอ่านข้อมูลรอบปัจจุบัน');` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L1700 | `  const oldCheck=extractIssueCheck(workbooks.issue),oldEtl=extractIssueEtl(workbooks.issue);` | ประกาศตัวแปร oldCheck แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1701 | `  const m190=extractIds(workbooks.m190,['Policy Detail'],['Prop Id']);` | ประกาศตัวแปร m190 แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1702 | `  const etl=parseEtl(etlText);if(etl.invalid)throw new Error(\`Auto-Mail 7.2 มีรูปแบบไม่ถูกต้อง ${etl.invalid} บรรทัด\`);` | ประกาศตัวแปร etl แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1703 | `  const checkIds=[...m190.ids];` | ประกาศตัวแปร checkIds แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1704 | `  const issuedIds=unique([...m190.ids,...etl.records.map(record=>record.PropId)]);` | สร้างตัวช่วยแบบ arrow function ชื่อ issuedIds เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1705 | `  await progress(54,'Merge ข้อมูลไม่สมบูรณ์และ Blacklist กับรายการค้างเดิม');` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L1706 | `  const oldSm=extractControlIds(workbooks.master,['ข้อมูลไม่สมบูรณ์']);` | ประกาศตัวแปร oldSm แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1707 | `  const oldBlacklist=extractControlIds(workbooks.master,['Black List','Blacklist']);` | ประกาศตัวแปร oldBlacklist แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1708 | `  const newSm=workbooks.sm?extractControlIds(workbooks.sm,workbooks.sm.SheetNames):{ids:[]};` | ประกาศตัวแปร newSm แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1709 | `  const newBlacklist=workbooks.blacklist?extractControlIds(workbooks.blacklist,workbooks.blacklist.SheetNames):{ids:[]};` | ประกาศตัวแปร newBlacklist แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1710 | `  const smBeforeRemoval=reconcileIdRows(oldSm.ids,newSm.ids),blacklistBeforeRemoval=reconcileIdRows(oldBlacklist.ids,newBlacklist.ids),issuedSet=new Set(issu...` | ประกาศตัวแปร smBeforeRemoval แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1711 | `  const smIds=smBeforeRemoval.filter(value=>!issuedSet.has(id(value))),blIds=blacklistBeforeRemoval.filter(value=>!issuedSet.has(id(value)));` | สร้างตัวช่วยแบบ arrow function ชื่อ smIds เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L1712 | `  await progress(66,'ลบเฉพาะ ProposalID ที่ยืนยันว่าออกกรมธรรม์แล้ว');` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L1713 | `  const classified=classifyPending(reconciled.rows,issuedIds,smIds,blIds,dateOnly(processedAt));` | ประกาศตัวแปร classified แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1714 | `  const context={runId,processedAt,masterInfo,masterRows:masterData.rows,daily,dateRange,dailyFiltered,dailyFilterStats:filteredResult,reconciled,m190Ids:m19...` | ประกาศตัวแปร context แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1715 | `  await progress(78,'สรุป Dashboard, Reconciliation และ Audit');` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L1716 | `  const summary=summarize(context),names=outputNames(processedAt);` | ประกาศตัวแปร summary แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1717 | `  await progress(88,'สร้างไฟล์หลักพร้อมสูตร P:W และไฟล์เช็คสถานะ ISSUE รอบใหม่');` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L1718 | `  const masterWorkbook=buildMasterWorkbook(context,summary),issueWorkbook=buildIssueWorkbook(context,summary);` | ประกาศตัวแปร masterWorkbook แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1719 | `  const resolvedTemplate=await resolvePivotTemplateBuffer(workbooks.master);if(!resolvedTemplate)throw new Error('ไม่พบ Clean Pivot Template ที่สมบูรณ์ — กรุ...` | ประกาศตัวแปร resolvedTemplate แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1720 | `  summary.PVWorkbookMode='SAVED_NATIVE_PIVOT_CACHE';summary.PivotTemplateSource=resolvedTemplate.source;summary.ExcelFinalizerRequired='NO';` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1721 | `  const masterOutput=await buildPivotPreservingMaster(resolvedTemplate.buffer,context,summary);` | ประกาศตัวแปร masterOutput แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1722 | `  const outputs={master:masterOutput,issue:workbookBlob(issueWorkbook),names};` | ประกาศตัวแปร outputs แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L1723 | `  await progress(100,'ประมวลผลสำเร็จ พร้อมดาวน์โหลดไฟล์หลัก 2 ไฟล์');` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L1724 | `  return{runId,summary,rows:context.pending,outputs,context};` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L1725 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1726 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L1727 | `global.BlackwolfEngine={` | เผยแพร่ค่า/function ไปยัง global object เพื่อให้ไฟล์อื่นเรียกใช้งานได้ |
| L1728 | `  readWorkbook,detectWorkbookRole,preflight,run,parseEtl,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1729 | `  preview:{aggregatePvRows,groupByAging,groupStatusRows},` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1730 | `  normalize:{text,id,key:rawKey,parseDate,dateKey,dateDisplay,excelSerial,canonicalHeader},` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1731 | `  internals:{findSheet,findNamedSheet,auditValue,masterEngineVersion,assertMasterVersionSafe,extractMasterData,extractMasterMaxDate,extractDaily,filterDailyR...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L1732 | `};` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L1733 | `})(typeof self!=='undefined'?self:globalThis);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
