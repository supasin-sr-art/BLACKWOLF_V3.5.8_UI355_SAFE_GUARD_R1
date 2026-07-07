(function(global){
'use strict';

// BLACKWOLF TEACHING COMMENTS: คอมเมนต์ชุดนี้เพิ่มเพื่ออธิบาย logic สำหรับอ่าน/ดูแลโค้ด
// หลักสำคัญ: คอมเมนต์ขึ้นต้นด้วย // จะไม่ถูกรัน จึงไม่เปลี่ยน behavior ของ JavaScript
// ภาพรวม: ไฟล์จัดการ Local Archive ด้วย IndexedDB ใน Browser
// ภาพรวม: เก็บประวัติการรัน ผลลัพธ์ และลบข้อมูลหมดอายุอัตโนมัติตาม retentionDays
// ภาพรวม: ทุกฟังก์ชันถูก export ผ่าน global.BlackwolfDB เพื่อให้ app.js เรียกใช้
const CONFIG=global.BLACKWOLF_CONFIG||{dbName:'blackwolf-v354'};
const DB_NAME=CONFIG.dbName;
const DB_VERSION=1;
const STORE='runs';
let dbPromise;

// อธิบาย: เปิด IndexedDB และสร้าง object store/indexes ถ้ายังไม่มี
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function open(){
  if(dbPromise)return dbPromise;
  dbPromise=new Promise((resolve,reject)=>{
    if(!('indexedDB' in global)){reject(new Error('IndexedDB ไม่พร้อมใช้งาน'));return;}
    const request=indexedDB.open(DB_NAME,DB_VERSION);
    request.onupgradeneeded=()=>{
      const db=request.result;
      if(!db.objectStoreNames.contains(STORE)){
        const store=db.createObjectStore(STORE,{keyPath:'id'});
        store.createIndex('createdAt','createdAt');
        store.createIndex('expiresAt','expiresAt');
      }
    };
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||new Error('เปิด Local Archive ไม่สำเร็จ'));
  });
  return dbPromise;
}
// อธิบาย: ครอบการทำงาน IndexedDB transaction เพื่อให้ resolve/reject เป็น Promise เดียวกัน
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function transact(mode,operation){
  return open().then(db=>new Promise((resolve,reject)=>{
    const transaction=db.transaction(STORE,mode);
    const store=transaction.objectStore(STORE);
    let value;
    try{value=operation(store,transaction);}catch(error){reject(error);return;}
    transaction.oncomplete=()=>resolve(value);
    transaction.onerror=()=>reject(transaction.error||new Error('IndexedDB transaction failed'));
    transaction.onabort=()=>reject(transaction.error||new Error('IndexedDB transaction aborted'));
  }));
}
// อธิบาย: บันทึกหรืออัปเดต record ใน Local Archive
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function put(record){return transact('readwrite',store=>store.put(record));}
// อธิบาย: ดึง record ตาม id จาก Local Archive
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function get(id){const db=await open();return new Promise((resolve,reject)=>{const request=db.transaction(STORE,'readonly').objectStore(STORE).get(id);request.onsuccess=()=>resolve(request.result||null);request.onerror=()=>reject(request.error);});}
// อธิบาย: ดึง record ทั้งหมดและเรียงจากใหม่ไปเก่า
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function list(){const db=await open();return new Promise((resolve,reject)=>{const request=db.transaction(STORE,'readonly').objectStore(STORE).getAll();request.onsuccess=()=>resolve((request.result||[]).sort((left,right)=>new Date(right.createdAt)-new Date(left.createdAt)));request.onerror=()=>reject(request.error);});}
// อธิบาย: ลบ record ตาม id
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function remove(id){return transact('readwrite',store=>store.delete(id));}
// อธิบาย: ล้าง record ทั้งหมดใน Local Archive
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function clear(){return transact('readwrite',store=>store.clear());}
// อธิบาย: ลบ Run History ที่เกินวันหมดอายุ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function pruneExpired(now=Date.now()){const records=await list();const expired=records.filter(record=>new Date(record.expiresAt).getTime()<=now);for(const record of expired)await remove(record.id);return expired.length;}
// อธิบาย: นับจำนวน record ใน Local Archive
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function count(){const db=await open();return new Promise((resolve,reject)=>{const request=db.transaction(STORE,'readonly').objectStore(STORE).count();request.onsuccess=()=>resolve(request.result||0);request.onerror=()=>reject(request.error);});}
// อธิบาย: อ่าน usage/quota/persistent storage ของ Browser
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function storageInfo(){let estimate={usage:0,quota:0},persisted=false;if(navigator.storage?.estimate)estimate=await navigator.storage.estimate();if(navigator.storage?.persisted)persisted=await navigator.storage.persisted();return{usage:estimate.usage||0,quota:estimate.quota||0,persisted};}
// อธิบาย: ขอ Browser ให้เก็บ storage แบบ persistent เพื่อลดโอกาสโดนลบอัตโนมัติ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function requestPersistent(){if(!navigator.storage?.persist)return false;return navigator.storage.persist();}

global.BlackwolfDB={open,put,get,list,remove,clear,pruneExpired,count,storageInfo,requestPersistent};
})(window);
