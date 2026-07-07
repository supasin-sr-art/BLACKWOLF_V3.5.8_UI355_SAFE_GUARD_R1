# อธิบายบรรทัดต่อบรรทัด: `auth.js`

**บทบาทไฟล์:** ระบบล็อกอิน: ตรวจ username/password ด้วย hash ผ่าน Web Crypto และปลดล็อกหน้า app

> วิธีอ่าน: ดูเลขบรรทัด L0001, L0002, ... แล้วเทียบกับไฟล์โค้ดต้นฉบับ/ไฟล์ที่ใส่คอมเมนต์แล้วได้ทันที

| บรรทัด | โค้ด | คำอธิบายแบบคนเริ่มจากศูนย์ |
|---:|---|---|
| L0001 | `(function(){` | เริ่ม IIFE/ฟังก์ชันครอบไฟล์ เพื่อแยก scope ไม่ให้ตัวแปรชนกับไฟล์อื่น |
| L0002 | `'use strict';` | เปิด strict mode เพื่อให้ JavaScript จับข้อผิดพลาดเข้มขึ้น เช่น ห้ามใช้ตัวแปรที่ยังไม่ประกาศ |
| L0003 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0004 | `// BLACKWOLF TEACHING COMMENTS: คอมเมนต์ชุดนี้เพิ่มเพื่ออธิบาย logic สำหรับอ่าน/ดูแลโค้ด` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0005 | `// หลักสำคัญ: คอมเมนต์ขึ้นต้นด้วย // จะไม่ถูกรัน จึงไม่เปลี่ยน behavior ของ JavaScript` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0006 | `// ภาพรวม: ไฟล์ควบคุมหน้าล็อกอินทั้งหมด ตั้งแต่จำชื่อผู้ใช้ ตรวจ Hash และปลดล็อก UI` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0007 | `// ภาพรวม: ใช้ Web Crypto API เพื่อคำนวณ SHA-256/PBKDF2 ใน Browser โดยไม่ส่งข้อมูลออกนอกเครื่อง` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0008 | `// ภาพรวม: เก็บเฉพาะ session การล็อกอินและชื่อผู้ใช้ที่เลือกจำ ไม่เก็บรหัสผ่านจริง` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0009 | `const SESSION_KEY='blackwolf.v356.authenticated';` | กำหนดค่าคงที่ SESSION_KEY สำหรับใช้เป็นค่ากลางของ flow นี้ |
| L0010 | `const REMEMBER_KEY='blackwolf.v356.rememberedUsername';` | กำหนดค่าคงที่ REMEMBER_KEY สำหรับใช้เป็นค่ากลางของ flow นี้ |
| L0011 | `const PROFILE=globalThis.BLACKWOLF_ACCESS_PROFILE\|\|null;` | กำหนดค่าคงที่ PROFILE สำหรับใช้เป็นค่ากลางของ flow นี้ |
| L0012 | `const $=selector=>document.querySelector(selector);` | สร้างตัวช่วยแบบ arrow function ชื่อ $ เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0013 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0014 | `// อธิบาย: แปลง Base64 เป็น byte array เพื่อใช้กับ Web Crypto` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0015 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0016 | `function bytesFromBase64(value){` | ประกาศฟังก์ชัน bytesFromBase64 เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0017 | `  const binary=atob(String(value\|\|''));` | ประกาศตัวแปร binary แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0018 | `  const output=new Uint8Array(binary.length);` | ประกาศตัวแปร output แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0019 | `  for(let index=0;index<binary.length;index++)output[index]=binary.charCodeAt(index);` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0020 | `  return output;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0021 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0022 | `// อธิบาย: แปลง byte array กลับเป็น Base64 สำหรับเทียบกับค่า Hash ที่เก็บไว้` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0023 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0024 | `function base64FromBytes(value){` | ประกาศฟังก์ชัน base64FromBytes เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0025 | `  let binary='';` | ประกาศตัวแปร binary แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0026 | `  const bytes=value instanceof Uint8Array?value:new Uint8Array(value);` | ประกาศตัวแปร bytes แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0027 | `  for(const byte of bytes)binary+=String.fromCharCode(byte);` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0028 | `  return btoa(binary);` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0029 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0030 | `// อธิบาย: เทียบ string แบบลด timing leak โดยวนเทียบทุกตำแหน่งก่อนคืนผล` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0031 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0032 | `function constantTimeEqual(left,right){` | ประกาศฟังก์ชัน constantTimeEqual เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0033 | `  const a=String(left\|\|''),b=String(right\|\|'');` | ประกาศตัวแปร a แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0034 | `  let diff=a.length^b.length;` | ประกาศตัวแปร diff แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0035 | `  const length=Math.max(a.length,b.length);` | ประกาศตัวแปร length แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0036 | `  for(let index=0;index<length;index++)diff\|=(a.charCodeAt(index%Math.max(1,a.length))\|\|0)^(b.charCodeAt(index%Math.max(1,b.length))\|\|0);` | เริ่ม loop เพื่อวนทำงานซ้ำกับรายการ/แถว/ไฟล์/element ทีละตัว |
| L0037 | `  return diff===0;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0038 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0039 | `// อธิบาย: ปรับ Username ให้เป็นมาตรฐานเดียวกันก่อนคำนวณ hash` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0040 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0041 | `function normalizeUsername(value){return String(value\|\|'').normalize('NFKC').trim().toUpperCase();}` | ประกาศฟังก์ชัน normalizeUsername เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0042 | `// อธิบาย: คำนวณ SHA-256 ของข้อความแล้วคืนเป็น Base64` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0043 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0044 | `async function sha256Base64(value){` | ประกาศฟังก์ชัน sha256Base64 เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0045 | `  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));` | ประกาศตัวแปร digest แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0046 | `  return base64FromBytes(digest);` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0047 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0048 | `// อธิบาย: คำนวณ PBKDF2-SHA-256 จาก password/salt/iterations ตาม profile` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0049 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0050 | `async function derivePasswordHash(password,profile){` | ประกาศฟังก์ชัน derivePasswordHash เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0051 | `  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(String(password\|\|'')),{name:'PBKDF2'},false,['deriveBits']);` | ประกาศตัวแปร key แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0052 | `  const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:bytesFromBase64(profile.salt),iterations:Number(profile.iterations\|\|310000)},k...` | ประกาศตัวแปร bits แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0053 | `  return base64FromBytes(bits);` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0054 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0055 | `// อธิบาย: ตรวจ Username และ Password ที่ผู้ใช้กรอกกับ Hash ใน access-profile.js` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0056 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0057 | `async function verifyCredentials(username,password){` | ประกาศฟังก์ชัน verifyCredentials เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0058 | `  if(!PROFILE\|\|PROFILE.version!==1)throw new Error('ไม่พบ Creator Access Profile หรือ Profile ไม่ถูกต้อง');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0059 | `  if(!globalThis.crypto?.subtle)throw new Error('Browser นี้ไม่รองรับ Web Crypto กรุณาใช้ Chrome หรือ Edge รุ่นปัจจุบัน');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0060 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0061 | `  const normalized=normalizeUsername(username);` | ประกาศตัวแปร normalized แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0062 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0063 | `  /*` | คอมเมนต์แบบ block ใช้อธิบายหลายบรรทัด ไม่ถูกรันเป็นโค้ด |
| L0064 | `   * รองรับ Access Profile ทั้ง 2 รูปแบบ:` | คอมเมนต์แบบ block ใช้อธิบายหลายบรรทัด ไม่ถูกรันเป็นโค้ด |
| L0065 | `   * 1) Username Hash แบบ SHA-256 เดิม` | คอมเมนต์แบบ block ใช้อธิบายหลายบรรทัด ไม่ถูกรันเป็นโค้ด |
| L0066 | `   * 2) Username Hash แบบ PBKDF2 ที่ Access Profile Builder บางเวอร์ชันสร้าง` | คอมเมนต์แบบ block ใช้อธิบายหลายบรรทัด ไม่ถูกรันเป็นโค้ด |
| L0067 | `   * Password ยังคงตรวจด้วย PBKDF2-SHA-256 เท่านั้น` | คอมเมนต์แบบ block ใช้อธิบายหลายบรรทัด ไม่ถูกรันเป็นโค้ด |
| L0068 | `   */` | คอมเมนต์แบบ block ใช้อธิบายหลายบรรทัด ไม่ถูกรันเป็นโค้ด |
| L0069 | `  const [legacyUsernameHash,pbkdf2UsernameHash,passwordHash]=await Promise.all([` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L0070 | `    sha256Base64(normalized),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0071 | `    derivePasswordHash(normalized,PROFILE),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0072 | `    derivePasswordHash(password,PROFILE)` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0073 | `  ]);` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0074 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0075 | `  const usernameMatches=` | ประกาศตัวแปร usernameMatches แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0076 | `    constantTimeEqual(legacyUsernameHash,PROFILE.usernameHash)\|\|` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0077 | `    constantTimeEqual(pbkdf2UsernameHash,PROFILE.usernameHash);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0078 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0079 | `  return usernameMatches&&constantTimeEqual(passwordHash,PROFILE.passwordHash);` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0080 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0081 | `// อธิบาย: อ่านชื่อผู้ใช้ที่เคยเลือกจำไว้จาก localStorage` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0082 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0083 | `function readRememberedUsername(){try{return localStorage.getItem(REMEMBER_KEY)\|\|'';}catch{return'';}}` | ประกาศฟังก์ชัน readRememberedUsername เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0084 | `// อธิบาย: บันทึกชื่อผู้ใช้ลง localStorage โดยไม่บันทึกรหัสผ่าน` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0085 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0086 | `function saveRememberedUsername(username){try{localStorage.setItem(REMEMBER_KEY,String(username\|\|''));}catch{}}` | ประกาศฟังก์ชัน saveRememberedUsername เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0087 | `// อธิบาย: ลบชื่อผู้ใช้ที่เคยจำไว้` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0088 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0089 | `function clearRememberedUsername(){try{localStorage.removeItem(REMEMBER_KEY);}catch{}}` | ประกาศฟังก์ชัน clearRememberedUsername เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0090 | `// อธิบาย: เติมชื่อผู้ใช้ที่เคยจำไว้กลับเข้า form login` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0091 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0092 | `function applyRememberedUsername(){` | ประกาศฟังก์ชัน applyRememberedUsername เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0093 | `  const remembered=readRememberedUsername(),username=$('#authUsername'),remember=$('#rememberPassword');` | ประกาศตัวแปร remembered แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0094 | `  if(username)username.value=remembered;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0095 | `  if(remember)remember.checked=!!remembered;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0096 | `  return!!remembered;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0097 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0098 | `// อธิบาย: ล็อก/ปลดล็อกหน้า app และบันทึกสถานะใน sessionStorage` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0099 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0100 | `function setAuthenticated(value){` | ประกาศฟังก์ชัน setAuthenticated เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0101 | `  document.body.classList.toggle('authenticated',value);` | เริ่ม loop แบบวนซ้ำตามเงื่อนไข ใช้รอหรือทำงานจนกว่าจะครบเงื่อนไข |
| L0102 | `  document.body.classList.toggle('auth-locked',!value);` | เริ่ม loop แบบวนซ้ำตามเงื่อนไข ใช้รอหรือทำงานจนกว่าจะครบเงื่อนไข |
| L0103 | `  const shell=$('#applicationShell');` | ประกาศตัวแปร shell แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0104 | `  if(shell)shell.setAttribute('aria-hidden',value?'false':'true');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0105 | `  try{if(value)sessionStorage.setItem(SESSION_KEY,'1');else sessionStorage.removeItem(SESSION_KEY);}catch{}` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L0106 | `  if(!value)setTimeout(()=>$('#authUsername')?.focus(),50);` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0107 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0108 | `// อธิบาย: ล้างข้อความ error และกรอบแดงในฟอร์ม login` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0109 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0110 | `function clearError(){` | ประกาศฟังก์ชัน clearError เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0111 | `  const error=$('#authError');if(error)error.textContent='';` | ประกาศตัวแปร error แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0112 | `  document.querySelectorAll('.auth-field').forEach(field=>field.classList.remove('has-error'));` | เริ่ม loop แบบวนซ้ำตามเงื่อนไข ใช้รอหรือทำงานจนกว่าจะครบเงื่อนไข |
| L0113 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0114 | `// อธิบาย: แสดง error login และเลือกช่อง password เพื่อให้กรอกใหม่ได้ทันที` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0115 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0116 | `function showError(message){` | ประกาศฟังก์ชัน showError เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0117 | `  const error=$('#authError');if(error)error.textContent=message;` | ประกาศตัวแปร error แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0118 | `  document.querySelectorAll('.auth-field').forEach(field=>field.classList.add('has-error'));` | เริ่ม loop แบบวนซ้ำตามเงื่อนไข ใช้รอหรือทำงานจนกว่าจะครบเงื่อนไข |
| L0119 | `  $('#authPassword')?.select();` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0120 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0121 | `// อธิบาย: เปลี่ยนสถานะปุ่ม login ระหว่างกำลังตรวจรหัส` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0122 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0123 | `function setSubmitting(value){` | ประกาศฟังก์ชัน setSubmitting เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0124 | `  const button=$('#authForm button[type="submit"]');` | ประกาศตัวแปร button แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0125 | `  if(button){button.disabled=value;button.textContent=value?'กำลังตรวจสอบรหัส...':'▣ ล็อกอินเข้าสู่ระบบ';}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0126 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0127 | `// อธิบาย: เริ่มระบบ login ผูก event submit/show password และ logout` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0128 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0129 | `function initAuth(){` | ประกาศฟังก์ชัน initAuth เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0130 | `  applyRememberedUsername();` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0131 | `  let alreadyAuthenticated=false;` | ประกาศตัวแปร alreadyAuthenticated แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0132 | `  try{alreadyAuthenticated=sessionStorage.getItem(SESSION_KEY)==='1';}catch{}` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L0133 | `  setAuthenticated(alreadyAuthenticated);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0134 | `  if(!PROFILE)showError('ไม่พบ access-profile.js กรุณาใช้ชุดโปรแกรมที่ครบถ้วน');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0135 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0136 | `  $('#authForm')?.addEventListener('submit',async event=>{` | ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด |
| L0137 | `    event.preventDefault();clearError();setSubmitting(true);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0138 | `    const username=$('#authUsername')?.value.trim()\|\|'',password=$('#authPassword')?.value\|\|'';` | ประกาศตัวแปร username แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0139 | `    try{` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L0140 | `      if(await verifyCredentials(username,password)){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0141 | `        const remember=$('#rememberPassword')?.checked===true;` | ประกาศตัวแปร remember แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0142 | `        if(remember)saveRememberedUsername(username);else clearRememberedUsername();` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0143 | `        setAuthenticated(true);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0144 | `        if($('#authPassword'))$('#authPassword').value='';` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0145 | `        return;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0146 | `      }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0147 | `      showError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบแล้วลองอีกครั้ง');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0148 | `    }catch(error){showError(error?.message\|\|'ตรวจสอบรหัสไม่สำเร็จ');}` | จับ error จาก try block แล้วแปลงเป็นข้อความ/สถานะที่ผู้ใช้หรือระบบเข้าใจได้ |
| L0149 | `    finally{setSubmitting(false);}` | ส่วนที่ต้องทำเสมอหลัง try/catch เช่น ปลดล็อกปุ่ม เคลียร์สถานะ หรือคืน resource |
| L0150 | `  });` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0151 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0152 | `  $('#togglePasswordBtn')?.addEventListener('click',()=>{` | ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด |
| L0153 | `    const input=$('#authPassword');if(!input)return;` | ประกาศตัวแปร input แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0154 | `    const showing=input.type==='text';input.type=showing?'password':'text';` | ประกาศตัวแปร showing แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0155 | `    $('#togglePasswordBtn').textContent=showing?'◉':'◌';` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0156 | `    $('#togglePasswordBtn').setAttribute('aria-label',showing?'แสดงรหัสผ่าน':'ซ่อนรหัสผ่าน');input.focus();` | อ้างอิง element ในหน้าเว็บ เพื่ออ่านค่า แก้ข้อความ เปลี่ยน class หรือผูก event |
| L0157 | `  });` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0158 | `  $('#authUsername')?.addEventListener('input',clearError);` | ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด |
| L0159 | `  $('#authPassword')?.addEventListener('input',clearError);` | ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด |
| L0160 | `  $('#rememberPassword')?.addEventListener('change',event=>{if(!event.target.checked)clearRememberedUsername();});` | ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด |
| L0161 | `  $('#logoutBtn')?.addEventListener('click',()=>{` | ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด |
| L0162 | `    setAuthenticated(false);` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0163 | `    const username=$('#authUsername'),password=$('#authPassword');` | ประกาศตัวแปร username แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0164 | `    if(username)username.value='';if(password){password.value='';password.type='password';}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0165 | `    applyRememberedUsername();clearError();` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0166 | `  });` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0167 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0168 | `if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAuth,{once:true});else initAuth();` | ผูก event listener เข้ากับ element/ระบบ เมื่อเกิดเหตุการณ์ เช่น click/input/submit จะเรียก callback ที่กำหนด |
| L0169 | `})();` | ปิดฟังก์ชันครอบไฟล์ และสั่งให้โค้ดภายในเริ่มทำงานทันที |
