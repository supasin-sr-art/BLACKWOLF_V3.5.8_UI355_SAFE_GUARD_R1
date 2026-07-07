// [L0001] เริ่ม IIFE/ฟังก์ชันครอบไฟล์ เพื่อแยก scope ไม่ให้ตัวแปรชนกับไฟล์อื่น
(function(global){
// [L0002] เปิด strict mode เพื่อให้ JavaScript จับข้อผิดพลาดเข้มขึ้น เช่น ห้ามใช้ตัวแปรที่ยังไม่ประกาศ
'use strict';
// [L0003] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0004] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// BLACKWOLF TEACHING COMMENTS: คอมเมนต์ชุดนี้เพิ่มเพื่ออธิบาย logic สำหรับอ่าน/ดูแลโค้ด
// [L0005] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// หลักสำคัญ: คอมเมนต์ขึ้นต้นด้วย // จะไม่ถูกรัน จึงไม่เปลี่ยน behavior ของ JavaScript
// [L0006] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ภาพรวม: ไฟล์จัดการ Local Archive ด้วย IndexedDB ใน Browser
// [L0007] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ภาพรวม: เก็บประวัติการรัน ผลลัพธ์ และลบข้อมูลหมดอายุอัตโนมัติตาม retentionDays
// [L0008] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ภาพรวม: ทุกฟังก์ชันถูก export ผ่าน global.BlackwolfDB เพื่อให้ app.js เรียกใช้
// [L0009] กำหนดค่าคงที่ CONFIG สำหรับใช้เป็นค่ากลางของ flow นี้
const CONFIG=global.BLACKWOLF_CONFIG||{dbName:'blackwolf-v354'};
// [L0010] กำหนดค่าคงที่ DB_NAME สำหรับใช้เป็นค่ากลางของ flow นี้
const DB_NAME=CONFIG.dbName;
// [L0011] กำหนดค่าคงที่ DB_VERSION สำหรับใช้เป็นค่ากลางของ flow นี้
const DB_VERSION=1;
// [L0012] กำหนดค่าคงที่ STORE สำหรับใช้เป็นค่ากลางของ flow นี้
const STORE='runs';
// [L0013] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
let dbPromise;
// [L0014] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0015] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: เปิด IndexedDB และสร้าง object store/indexes ถ้ายังไม่มี
// [L0016] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0017] ประกาศฟังก์ชัน open เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function open(){
// [L0018] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(dbPromise)return dbPromise;
// [L0019] กำหนด handler/ฟังก์ชันให้ dbPromise เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง
  dbPromise=new Promise((resolve,reject)=>{
// [L0020] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(!('indexedDB' in global)){reject(new Error('IndexedDB ไม่พร้อมใช้งาน'));return;}
// [L0021] ประกาศตัวแปร request แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const request=indexedDB.open(DB_NAME,DB_VERSION);
// [L0022] กำหนด handler/ฟังก์ชันให้ request.onupgradeneeded เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง
    request.onupgradeneeded=()=>{
// [L0023] ประกาศตัวแปร db แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
      const db=request.result;
// [L0024] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
      if(!db.objectStoreNames.contains(STORE)){
// [L0025] ประกาศตัวแปร store แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
        const store=db.createObjectStore(STORE,{keyPath:'id'});
// [L0026] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
        store.createIndex('createdAt','createdAt');
// [L0027] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
        store.createIndex('expiresAt','expiresAt');
// [L0028] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
      }
// [L0029] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
    };
// [L0030] กำหนด handler/ฟังก์ชันให้ request.onsuccess เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง
    request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>{try{db.close();}catch{}};resolve(db);};
    request.onblocked=()=>reject(new Error('Local Archive ถูกแท็บอื่นเปิดค้างอยู่ กรุณาปิดแท็บ BLACKWOLF เก่าก่อน'));
// [L0031] กำหนด handler/ฟังก์ชันให้ request.onerror เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง
    request.onerror=()=>reject(request.error||new Error('เปิด Local Archive ไม่สำเร็จ'));
// [L0032] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  });
// [L0033] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return dbPromise;
// [L0034] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0035] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ครอบการทำงาน IndexedDB transaction เพื่อให้ resolve/reject เป็น Promise เดียวกัน
// [L0036] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0037] ประกาศฟังก์ชัน transact เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function transact(mode,operation){
// [L0038] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return open().then(db=>new Promise((resolve,reject)=>{
// [L0039] ประกาศตัวแปร transaction แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const transaction=db.transaction(STORE,mode);
// [L0040] ประกาศตัวแปร store แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
    const store=transaction.objectStore(STORE);
// [L0041] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    let value;
// [L0042] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
    try{value=operation(store,transaction);}catch(error){reject(error);return;}
// [L0043] กำหนด handler/ฟังก์ชันให้ transaction.oncomplete เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง
    transaction.oncomplete=()=>resolve(value);
// [L0044] กำหนด handler/ฟังก์ชันให้ transaction.onerror เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง
    transaction.onerror=()=>reject(transaction.error||new Error('IndexedDB transaction failed'));
// [L0045] กำหนด handler/ฟังก์ชันให้ transaction.onabort เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง
    transaction.onabort=()=>reject(transaction.error||new Error('IndexedDB transaction aborted'));
// [L0046] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }));
// [L0047] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0048] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: บันทึกหรืออัปเดต record ใน Local Archive
// [L0049] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0050] ประกาศฟังก์ชัน put เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function put(record){return transact('readwrite',store=>store.put(record));}
// [L0051] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ดึง record ตาม id จาก Local Archive
// [L0052] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0053] ประกาศฟังก์ชัน get เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function get(id){const db=await open();return new Promise((resolve,reject)=>{const request=db.transaction(STORE,'readonly').objectStore(STORE).get(id);request.onsuccess=()=>resolve(request.result||null);request.onerror=()=>reject(request.error);});}
// [L0054] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ดึง record ทั้งหมดและเรียงจากใหม่ไปเก่า
// [L0055] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0056] ประกาศฟังก์ชัน list เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function list(){const db=await open();return new Promise((resolve,reject)=>{const request=db.transaction(STORE,'readonly').objectStore(STORE).getAll();request.onsuccess=()=>resolve((request.result||[]).sort((left,right)=>new Date(right.createdAt)-new Date(left.createdAt)));request.onerror=()=>reject(request.error);});}
// [L0057] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ลบ record ตาม id
// [L0058] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0059] ประกาศฟังก์ชัน remove เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function remove(id){return transact('readwrite',store=>store.delete(id));}
// [L0060] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ล้าง record ทั้งหมดใน Local Archive
// [L0061] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0062] ประกาศฟังก์ชัน clear เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function clear(){return transact('readwrite',store=>store.clear());}
// [L0063] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ลบ Run History ที่เกินวันหมดอายุ
// [L0064] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0065] ประกาศฟังก์ชัน pruneExpired เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function pruneExpired(now=Date.now()){const records=await list();const expired=records.filter(record=>new Date(record.expiresAt).getTime()<=now);for(const record of expired)await remove(record.id);return expired.length;}
// [L0066] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: นับจำนวน record ใน Local Archive
// [L0067] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0068] ประกาศฟังก์ชัน count เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function count(){const db=await open();return new Promise((resolve,reject)=>{const request=db.transaction(STORE,'readonly').objectStore(STORE).count();request.onsuccess=()=>resolve(request.result||0);request.onerror=()=>reject(request.error);});}
// [L0069] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: อ่าน usage/quota/persistent storage ของ Browser
// [L0070] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0071] ประกาศฟังก์ชัน storageInfo เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function storageInfo(){let estimate={usage:0,quota:0},persisted=false;if(navigator.storage?.estimate)estimate=await navigator.storage.estimate();if(navigator.storage?.persisted)persisted=await navigator.storage.persisted();return{usage:estimate.usage||0,quota:estimate.quota||0,persisted};}
// [L0072] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ขอ Browser ให้เก็บ storage แบบ persistent เพื่อลดโอกาสโดนลบอัตโนมัติ
// [L0073] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0074] ประกาศฟังก์ชัน requestPersistent เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
async function requestPersistent(){if(!navigator.storage?.persist)return false;return navigator.storage.persist();}
// [L0075] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0076] เผยแพร่ค่า/function ไปยัง global object เพื่อให้ไฟล์อื่นเรียกใช้งานได้
global.BlackwolfDB={open,put,get,list,remove,clear,pruneExpired,count,storageInfo,requestPersistent};
// [L0077] ปิดฟังก์ชันครอบไฟล์ และสั่งให้โค้ดภายในเริ่มทำงานทันที
})(window);
