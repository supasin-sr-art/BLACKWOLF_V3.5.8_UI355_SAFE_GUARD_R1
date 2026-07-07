(function(global){
'use strict';

// BLACKWOLF TEACHING COMMENTS: คอมเมนต์ชุดนี้เพิ่มเพื่ออธิบาย logic สำหรับอ่าน/ดูแลโค้ด
// หลักสำคัญ: คอมเมนต์ขึ้นต้นด้วย // จะไม่ถูกรัน จึงไม่เปลี่ยน behavior ของ JavaScript
// ภาพรวม: ไฟล์ตั้งค่ากลางของระบบ เช่น version, namespace, ชื่อฐานข้อมูล, อายุ Run History และชื่อไฟล์ผลลัพธ์
// ภาพรวม: ทุกโมดูลอ่านค่าจาก BLACKWOLF_CONFIG เพื่อลดการ hard-code หลายจุด
// ภาพรวม: Object.freeze ป้องกันการแก้ config ระหว่างโปรแกรมทำงาน
const config={
  version:'3.5.8',
  displayVersion:'V3.5.8',
  edition:'Professional Browser Edition',
  storageNamespace:'blackwolf.v354',
  dbName:'blackwolf-v354',
  retentionDays:4,
  masterBaseName:'เช็คกรมธรรม์ต่างด้าวที่ยังไม่ออก_WEB',
  issueBaseName:'เช็คสถานะ ISSUE_WEB',
  reportBaseName:'Report'
};
global.BLACKWOLF_CONFIG=Object.freeze(config);
})(typeof self!=='undefined'?self:globalThis);
