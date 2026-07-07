// [L0001] เริ่ม IIFE/ฟังก์ชันครอบไฟล์ เพื่อแยก scope ไม่ให้ตัวแปรชนกับไฟล์อื่น
(function(){
// [L0002] เปิด strict mode เพื่อให้ JavaScript จับข้อผิดพลาดเข้มขึ้น เช่น ห้ามใช้ตัวแปรที่ยังไม่ประกาศ
'use strict';
// [L0003] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0004] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// BLACKWOLF TEACHING COMMENTS: คอมเมนต์ชุดนี้เพิ่มเพื่ออธิบาย logic สำหรับอ่าน/ดูแลโค้ด
// [L0005] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// หลักสำคัญ: คอมเมนต์ขึ้นต้นด้วย // จะไม่ถูกรัน จึงไม่เปลี่ยน behavior ของ JavaScript
// [L0006] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ภาพรวม: ไฟล์ควบคุมหน้าล็อกอินทั้งหมด ตั้งแต่จำชื่อผู้ใช้ ตรวจ Hash และปลดล็อก UI
// [L0007] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ภาพรวม: ใช้ Web Crypto API เพื่อคำนวณ SHA-256/PBKDF2 ใน Browser โดยไม่ส่งข้อมูลออกนอกเครื่อง
// [L0008] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ภาพรวม: เก็บเฉพาะ session การล็อกอินและชื่อผู้ใช้ที่เลือกจำ ไม่เก็บรหัสผ่านจริง
// [L0009] กำหนดค่าคงที่ SESSION_KEY สำหรับใช้เป็นค่ากลางของ flow นี้
const SESSION_KEY='blackwolf.v356.authenticated';
// [L0010] กำหนดค่าคงที่ REMEMBER_KEY สำหรับใช้เป็นค่ากลางของ flow นี้
const REMEMBER_KEY='blackwolf.v356.rememberedUsername';
// [L0011] กำหนดค่าคงที่ PROFILE สำหรับใช้เป็นค่ากลางของ flow นี้
const PROFILE=globalThis.BLACKWOLF_ACCESS_PROFILE||null;
// [L0012] สร้างตัวช่วยแบบ arrow function ชื่อ $ เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
const $=selector=>document.querySelector(selector);
// [L0013] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0014] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แปลง Base64 เป็น byte array เพื่อใช้กับ Web Crypto
// [L0015] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0016] ประกาศฟังก์ชัน bytesFromBase64 เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function bytesFromBase64(value){
// [L0017] ประกาศตัวแปร binary แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const binary=atob(String(value||''));
// [L0018] ประกาศตัวแปร output แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const output=new Uint8Array(binary.length);
// [L0019] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(let index=0;index<binary.length;index++)output[index]=binary.charCodeAt(index);
// [L0020] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return output;
// [L0021] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0022] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แปลง byte array กลับเป็น Base64 สำหรับเทียบกับค่า Hash ที่เก็บไว้
// [L0023] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0024] ประกาศฟังก์ชัน base64FromBytes เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function base64FromBytes(value){
// [L0025] ประกาศตัวแปร binary แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let binary='';
// [L0026] ประกาศตัวแปร bytes แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const bytes=value instanceof Uint8Array?value:new Uint8Array(value);
// [L0027] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(const byte of bytes)binary+=String.fromCharCode(byte);
// [L0028] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return btoa(binary);
// [L0029] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0030] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เทียบ string แบบลด timing leak โดยวนเทียบทุกตำแหน่งก่อนคืนผล
// [L0031] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0032] ประกาศฟังก์ชัน constantTimeEqual เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function constantTimeEqual(left,right){
// [L0033] ประกาศตัวแปร a แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const a=String(left||''),b=String(right||'');
// [L0034] ประกาศตัวแปร diff แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let diff=a.length^b.length;
// [L0035] ประกาศตัวแปร length แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const length=Math.max(a.length,b.length);
// [L0036] เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว
  for(let index=0;index<length;index++)diff|=(a.charCodeAt(index%Math.max(1,a.length))||0)^(b.charCodeAt(index%Math.max(1,b.length))||0);
// [L0037] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return diff===0;
// [L0038] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0039] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ปรับ Username ให้เป็นมาตรฐานเดียวกันก่อนคำนวณ hash
// [L0040] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0041] ประกาศฟังก์ชัน normalizeUsername เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function normalizeUsername(value){return String(value||'').normalize('NFKC').trim().toUpperCase();}
// [L0042] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: คำนวณ SHA-256 ของข้อความแล้วคืนเป็น Base64
// [L0043] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0044] ประกาศฟังก์ชัน sha256Base64 เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function sha256Base64(value){
// [L0045] ประกาศตัวแปร digest แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));
// [L0046] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return base64FromBytes(digest);
// [L0047] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0048] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: คำนวณ PBKDF2-SHA-256 จาก password/salt/iterations ตาม profile
// [L0049] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0050] ประกาศฟังก์ชัน derivePasswordHash เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function derivePasswordHash(password,profile){
// [L0051] ประกาศตัวแปร key แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(String(password||'')),{name:'PBKDF2'},false,['deriveBits']);
// [L0052] ประกาศตัวแปร bits แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:bytesFromBase64(profile.salt),iterations:Number(profile.iterations||310000)},key,256);
// [L0053] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return base64FromBytes(bits);
// [L0054] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0055] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ตรวจ Username และ Password ที่ผู้ใช้กรอกกับ Hash ใน access-profile.js
// [L0056] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0057] ประกาศฟังก์ชัน verifyCredentials เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function verifyCredentials(username,password){
// [L0058] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!PROFILE||PROFILE.version!==1)throw new Error('ไม่พบ Creator Access Profile หรือ Profile ไม่ถูกต้อง');
// [L0059] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!globalThis.crypto?.subtle)throw new Error('Browser นี้ไม่รองรับ Web Crypto กรุณาใช้ Chrome หรือ Edge รุ่นปัจจุบัน');
// [L0060] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0061] ประกาศตัวแปร normalized แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const normalized=normalizeUsername(username);
// [L0062] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0063] คอมเมนต์แบบ block ใช้อธิบายหลายบรรทัด ไม่ถูกรันเป็นโค้ด
  /*
// [L0064] คอมเมนต์แบบ block ใช้อธิบายหลายบรรทัด ไม่ถูกรันเป็นโค้ด
   * รองรับ Access Profile ทั้ง 2 รูปแบบ:
// [L0065] คอมเมนต์แบบ block ใช้อธิบายหลายบรรทัด ไม่ถูกรันเป็นโค้ด
   * 1) Username Hash แบบ SHA-256 เดิม
// [L0066] คอมเมนต์แบบ block ใช้อธิบายหลายบรรทัด ไม่ถูกรันเป็นโค้ด
   * 2) Username Hash แบบ PBKDF2 ที่ Access Profile Builder บางเวอร์ชันสร้าง
// [L0067] คอมเมนต์แบบ block ใช้อธิบายหลายบรรทัด ไม่ถูกรันเป็นโค้ด
   * Password ยังคงตรวจด้วย PBKDF2-SHA-256 เท่านั้น
// [L0068] คอมเมนต์แบบ block ใช้อธิบายหลายบรรทัด ไม่ถูกรันเป็นโค้ด
   */
// [L0069] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
  const [legacyUsernameHash,pbkdf2UsernameHash,passwordHash]=await Promise.all([
// [L0070] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    sha256Base64(normalized),
// [L0071] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    derivePasswordHash(normalized,PROFILE),
// [L0072] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    derivePasswordHash(password,PROFILE)
// [L0073] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  ]);
// [L0074] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0075] ประกาศตัวแปร usernameMatches แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const usernameMatches=
// [L0076] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    constantTimeEqual(legacyUsernameHash,PROFILE.usernameHash)||
// [L0077] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    constantTimeEqual(pbkdf2UsernameHash,PROFILE.usernameHash);
// [L0078] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0079] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return usernameMatches&&constantTimeEqual(passwordHash,PROFILE.passwordHash);
// [L0080] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0081] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อ่านชื่อผู้ใช้ที่เคยเลือกจำไว้จาก localStorage
// [L0082] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0083] ประกาศฟังก์ชัน readRememberedUsername เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function readRememberedUsername(){try{return localStorage.getItem(REMEMBER_KEY)||'';}catch{return'';}}
// [L0084] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: บันทึกชื่อผู้ใช้ลง localStorage โดยไม่บันทึกรหัสผ่าน
// [L0085] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0086] ประกาศฟังก์ชัน saveRememberedUsername เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function saveRememberedUsername(username){try{localStorage.setItem(REMEMBER_KEY,String(username||''));}catch{}}
// [L0087] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ลบชื่อผู้ใช้ที่เคยจำไว้
// [L0088] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0089] ประกาศฟังก์ชัน clearRememberedUsername เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function clearRememberedUsername(){try{localStorage.removeItem(REMEMBER_KEY);}catch{}}
// [L0090] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เติมชื่อผู้ใช้ที่เคยจำไว้กลับเข้า form login
// [L0091] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0092] ประกาศฟังก์ชัน applyRememberedUsername เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function applyRememberedUsername(){
// [L0093] ประกาศตัวแปร remembered แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const remembered=readRememberedUsername(),username=$('#authUsername'),remember=$('#rememberPassword');
// [L0094] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(username)username.value=remembered;
// [L0095] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(remember)remember.checked=!!remembered;
// [L0096] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return!!remembered;
// [L0097] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0098] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ล็อก/ปลดล็อกหน้า app และบันทึกสถานะใน sessionStorage
// [L0099] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0100] ประกาศฟังก์ชัน setAuthenticated เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function setAuthenticated(value){
// [L0101] เริ่ม loop แบบวนซ้ำตามเงื่อนไข ใช้รอหรือทำงานจนกว่าจะครบเงื่อนไข
  document.body.classList.toggle('authenticated',value);
// [L0102] เริ่ม loop แบบวนซ้ำตามเงื่อนไข ใช้รอหรือทำงานจนกว่าจะครบเงื่อนไข
  document.body.classList.toggle('auth-locked',!value);
// [L0103] ประกาศตัวแปร shell แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const shell=$('#applicationShell');
// [L0104] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(shell)shell.setAttribute('aria-hidden',value?'false':'true');
// [L0105] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
  try{if(value)sessionStorage.setItem(SESSION_KEY,'1');else sessionStorage.removeItem(SESSION_KEY);}catch{}
// [L0106] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!value)setTimeout(()=>$('#authUsername')?.focus(),50);
// [L0107] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0108] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ล้างข้อความ error และกรอบแดงในฟอร์ม login
// [L0109] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0110] ประกาศฟังก์ชัน clearError เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function clearError(){
// [L0111] ประกาศตัวแปร error แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const error=$('#authError');if(error)error.textContent='';
// [L0112] เริ่ม loop แบบวนซ้ำตามเงื่อนไข ใช้รอหรือทำงานจนกว่าจะครบเงื่อนไข
  document.querySelectorAll('.auth-field').forEach(field=>field.classList.remove('has-error'));
// [L0113] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0114] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แสดง error login และเลือกช่อง password เพื่อให้กรอกใหม่ได้ทันที
// [L0115] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0116] ประกาศฟังก์ชัน showError เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function showError(message){
// [L0117] ประกาศตัวแปร error แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const error=$('#authError');if(error)error.textContent=message;
// [L0118] เริ่ม loop แบบวนซ้ำตามเงื่อนไข ใช้รอหรือทำงานจนกว่าจะครบเงื่อนไข
  document.querySelectorAll('.auth-field').forEach(field=>field.classList.add('has-error'));
// [L0119] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
  $('#authPassword')?.select();
// [L0120] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0121] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เปลี่ยนสถานะปุ่ม login ระหว่างกำลังตรวจรหัส
// [L0122] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0123] ประกาศฟังก์ชัน setSubmitting เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function setSubmitting(value){
// [L0124] ประกาศตัวแปร button แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const button=$('#authForm button[type="submit"]');
// [L0125] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(button){button.disabled=value;button.textContent=value?'กำลังตรวจสอบรหัส...':'▣ ล็อกอินเข้าสู่ระบบ';}
// [L0126] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0127] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เริ่มระบบ login ผูก event submit/show password และ logout
// [L0128] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0129] ประกาศฟังก์ชัน initAuth เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function initAuth(){
// [L0130] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  applyRememberedUsername();
// [L0131] ประกาศตัวแปร alreadyAuthenticated แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  let alreadyAuthenticated=false;
// [L0132] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
  try{alreadyAuthenticated=sessionStorage.getItem(SESSION_KEY)==='1';}catch{}
// [L0133] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  setAuthenticated(alreadyAuthenticated);
// [L0134] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(!PROFILE)showError('ไม่พบ access-profile.js กรุณาใช้ชุดโปรแกรมที่ครบถ้วน');
// [L0135] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0136] ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด
  $('#authForm')?.addEventListener('submit',async event=>{
// [L0137] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    event.preventDefault();clearError();setSubmitting(true);
// [L0138] ประกาศตัวแปร username แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const username=$('#authUsername')?.value.trim()||'',password=$('#authPassword')?.value||'';
// [L0139] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
    try{
// [L0140] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
      if(await verifyCredentials(username,password)){
// [L0141] ประกาศตัวแปร remember แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
        const remember=$('#rememberPassword')?.checked===true;
// [L0142] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
        if(remember)saveRememberedUsername(username);else clearRememberedUsername();
// [L0143] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
        setAuthenticated(true);
// [L0144] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
        if($('#authPassword'))$('#authPassword').value='';
// [L0145] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
        return;
// [L0146] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
      }
// [L0147] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      showError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบแล้วลองอีกครั้ง');
// [L0148] จับ error จาก try block แล้วแปลงเป็นข้อความ/สถานะที่ผู้ใช้หรือระบบเข้าใจได้
    }catch(error){showError(error?.message||'ตรวจสอบรหัสไม่สำเร็จ');}
// [L0149] ส่วนที่ต้องทำเสมอหลัง try/catch เช่น ปลดล็อกปุ่ม เคลียร์สถานะ หรือคืน resource
    finally{setSubmitting(false);}
// [L0150] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  });
// [L0151] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0152] ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด
  $('#togglePasswordBtn')?.addEventListener('click',()=>{
// [L0153] ประกาศตัวแปร input แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const input=$('#authPassword');if(!input)return;
// [L0154] ประกาศตัวแปร showing แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const showing=input.type==='text';input.type=showing?'password':'text';
// [L0155] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
    $('#togglePasswordBtn').textContent=showing?'◉':'◌';
// [L0156] อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event
    $('#togglePasswordBtn').setAttribute('aria-label',showing?'แสดงรหัสผ่าน':'ซ่อนรหัสผ่าน');input.focus();
// [L0157] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  });
// [L0158] ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด
  $('#authUsername')?.addEventListener('input',clearError);
// [L0159] ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด
  $('#authPassword')?.addEventListener('input',clearError);
// [L0160] ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด
  $('#rememberPassword')?.addEventListener('change',event=>{if(!event.target.checked)clearRememberedUsername();});
// [L0161] ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด
  $('#logoutBtn')?.addEventListener('click',()=>{
// [L0162] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    setAuthenticated(false);
// [L0163] ประกาศตัวแปร username แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const username=$('#authUsername'),password=$('#authPassword');
// [L0164] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(username)username.value='';if(password){password.value='';password.type='password';}
// [L0165] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    applyRememberedUsername();clearError();
// [L0166] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  });
// [L0167] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0168] ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAuth,{once:true});else initAuth();
// [L0169] ปิดฟังก์ชันครอบไฟล์ และสั่งให้โค้ดภายในเริ่มทำงานทันที
})();
