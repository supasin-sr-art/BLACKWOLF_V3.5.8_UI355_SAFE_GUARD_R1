# อธิบายบรรทัดต่อบรรทัด: `db.js`

**บทบาทไฟล์:** Local Archive: เก็บ/อ่าน/ลบ Run History ใน IndexedDB ของ Browser

> วิธีอ่าน: ดูเลขบรรทัด L0001, L0002, ... แล้วเทียบกับไฟล์โค้ดต้นฉบับ/ไฟล์ที่ใส่คอมเมนต์แล้วได้ทันที

| บรรทัด | โค้ด | คำอธิบายแบบคนเริ่มจากศูนย์ |
|---:|---|---|
| L0001 | `(function(global){` | เริ่ม IIFE/ฟังก์ชันครอบไฟล์ เพื่อแยก scope ไม่ให้ตัวแปรชนกับไฟล์อื่น |
| L0002 | `'use strict';` | เปิด strict mode เพื่อให้ JavaScript จับข้อผิดพลาดเข้มขึ้น เช่น ห้ามใช้ตัวแปรที่ยังไม่ประกาศ |
| L0003 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0004 | `// BLACKWOLF TEACHING COMMENTS: คอมเมนต์ชุดนี้เพิ่มเพื่ออธิบาย logic สำหรับอ่าน/ดูแลโค้ด` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0005 | `// หลักสำคัญ: คอมเมนต์ขึ้นต้นด้วย // จะไม่ถูกรัน จึงไม่เปลี่ยน behavior ของ JavaScript` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0006 | `// ภาพรวม: ไฟล์จัดการ Local Archive ด้วย IndexedDB ใน Browser` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0007 | `// ภาพรวม: เก็บประวัติการรัน ผลลัพธ์ และลบข้อมูลหมดอายุอัตโนมัติตาม retentionDays` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0008 | `// ภาพรวม: ทุกฟังก์ชันถูก export ผ่าน global.BlackwolfDB เพื่อให้ app.js เรียกใช้` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0009 | `const CONFIG=global.BLACKWOLF_CONFIG\|\|{dbName:'blackwolf-v354'};` | กำหนดค่าคงที่ CONFIG สำหรับใช้เป็นค่ากลางของ flow นี้ |
| L0010 | `const DB_NAME=CONFIG.dbName;` | กำหนดค่าคงที่ DB_NAME สำหรับใช้เป็นค่ากลางของ flow นี้ |
| L0011 | `const DB_VERSION=1;` | กำหนดค่าคงที่ DB_VERSION สำหรับใช้เป็นค่ากลางของ flow นี้ |
| L0012 | `const STORE='runs';` | กำหนดค่าคงที่ STORE สำหรับใช้เป็นค่ากลางของ flow นี้ |
| L0013 | `let dbPromise;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0014 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0015 | `// อธิบาย: เปิด IndexedDB และสร้าง object store/indexes ถ้ายังไม่มี` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0016 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0017 | `function open(){` | ประกาศฟังก์ชัน open เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0018 | `  if(dbPromise)return dbPromise;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0019 | `  dbPromise=new Promise((resolve,reject)=>{` | กำหนด handler/ฟังก์ชันให้ dbPromise เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง |
| L0020 | `    if(!('indexedDB' in global)){reject(new Error('IndexedDB ไม่พร้อมใช้งาน'));return;}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0021 | `    const request=indexedDB.open(DB_NAME,DB_VERSION);` | ประกาศตัวแปร request แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0022 | `    request.onupgradeneeded=()=>{` | กำหนด handler/ฟังก์ชันให้ request.onupgradeneeded เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง |
| L0023 | `      const db=request.result;` | ประกาศตัวแปร db แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0024 | `      if(!db.objectStoreNames.contains(STORE)){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0025 | `        const store=db.createObjectStore(STORE,{keyPath:'id'});` | ประกาศตัวแปร store แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0026 | `        store.createIndex('createdAt','createdAt');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0027 | `        store.createIndex('expiresAt','expiresAt');` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0028 | `      }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0029 | `    };` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0030 | `    request.onsuccess=()=>resolve(request.result);` | กำหนด handler/ฟังก์ชันให้ request.onsuccess เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง |
| L0031 | `    request.onerror=()=>reject(request.error\|\|new Error('เปิด Local Archive ไม่สำเร็จ'));` | กำหนด handler/ฟังก์ชันให้ request.onerror เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง |
| L0032 | `  });` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0033 | `  return dbPromise;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0034 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0035 | `// อธิบาย: ครอบการทำงาน IndexedDB transaction เพื่อให้ resolve/reject เป็น Promise เดียวกัน` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0036 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0037 | `function transact(mode,operation){` | ประกาศฟังก์ชัน transact เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0038 | `  return open().then(db=>new Promise((resolve,reject)=>{` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0039 | `    const transaction=db.transaction(STORE,mode);` | ประกาศตัวแปร transaction แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0040 | `    const store=transaction.objectStore(STORE);` | ประกาศตัวแปร store แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0041 | `    let value;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0042 | `    try{value=operation(store,transaction);}catch(error){reject(error);return;}` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L0043 | `    transaction.oncomplete=()=>resolve(value);` | กำหนด handler/ฟังก์ชันให้ transaction.oncomplete เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง |
| L0044 | `    transaction.onerror=()=>reject(transaction.error\|\|new Error('IndexedDB transaction failed'));` | กำหนด handler/ฟังก์ชันให้ transaction.onerror เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง |
| L0045 | `    transaction.onabort=()=>reject(transaction.error\|\|new Error('IndexedDB transaction aborted'));` | กำหนด handler/ฟังก์ชันให้ transaction.onabort เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง |
| L0046 | `  }));` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0047 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0048 | `// อธิบาย: บันทึกหรืออัปเดต record ใน Local Archive` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0049 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0050 | `async function put(record){return transact('readwrite',store=>store.put(record));}` | ประกาศฟังก์ชัน put เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0051 | `// อธิบาย: ดึง record ตาม id จาก Local Archive` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0052 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0053 | `async function get(id){const db=await open();return new Promise((resolve,reject)=>{const request=db.transaction(STORE,'readonly').objectStore(STORE).get(id);...` | ประกาศฟังก์ชัน get เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0054 | `// อธิบาย: ดึง record ทั้งหมดและเรียงจากใหม่ไปเก่า` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0055 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0056 | `async function list(){const db=await open();return new Promise((resolve,reject)=>{const request=db.transaction(STORE,'readonly').objectStore(STORE).getAll();...` | ประกาศฟังก์ชัน list เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0057 | `// อธิบาย: ลบ record ตาม id` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0058 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0059 | `async function remove(id){return transact('readwrite',store=>store.delete(id));}` | ประกาศฟังก์ชัน remove เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0060 | `// อธิบาย: ล้าง record ทั้งหมดใน Local Archive` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0061 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0062 | `async function clear(){return transact('readwrite',store=>store.clear());}` | ประกาศฟังก์ชัน clear เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0063 | `// อธิบาย: ลบ Run History ที่เกินวันหมดอายุ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0064 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0065 | `async function pruneExpired(now=Date.now()){const records=await list();const expired=records.filter(record=>new Date(record.expiresAt).getTime()<=now);for(co...` | ประกาศฟังก์ชัน pruneExpired เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0066 | `// อธิบาย: นับจำนวน record ใน Local Archive` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0067 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0068 | `async function count(){const db=await open();return new Promise((resolve,reject)=>{const request=db.transaction(STORE,'readonly').objectStore(STORE).count();...` | ประกาศฟังก์ชัน count เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0069 | `// อธิบาย: อ่าน usage/quota/persistent storage ของ Browser` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0070 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0071 | `async function storageInfo(){let estimate={usage:0,quota:0},persisted=false;if(navigator.storage?.estimate)estimate=await navigator.storage.estimate();if(nav...` | ประกาศฟังก์ชัน storageInfo เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0072 | `// อธิบาย: ขอ Browser ให้เก็บ storage แบบ persistent เพื่อลดโอกาสโดนลบอัตโนมัติ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0073 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0074 | `async function requestPersistent(){if(!navigator.storage?.persist)return false;return navigator.storage.persist();}` | ประกาศฟังก์ชัน requestPersistent เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0075 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0076 | `global.BlackwolfDB={open,put,get,list,remove,clear,pruneExpired,count,storageInfo,requestPersistent};` | เผยแพร่ค่า/function ไปยัง global object เพื่อให้ไฟล์อื่นเรียกใช้งานได้ |
| L0077 | `})(window);` | ปิดฟังก์ชันครอบไฟล์ และสั่งให้โค้ดภายในเริ่มทำงานทันที |
