// [L0001] เปิด strict mode เพื่อให้ JavaScript จับข้อผิดพลาดเข้มขึ้น เช่น ห้ามใช้ตัวแปรที่ยังไม่ประกาศ
'use strict';
// [L0002] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0003] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// BLACKWOLF TEACHING COMMENTS: คอมเมนต์ชุดนี้เพิ่มเพื่ออธิบาย logic สำหรับอ่าน/ดูแลโค้ด
// [L0004] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// หลักสำคัญ: คอมเมนต์ขึ้นต้นด้วย // จะไม่ถูกรัน จึงไม่เปลี่ยน behavior ของ JavaScript
// [L0005] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ภาพรวม: ไฟล์ Web Worker ใช้รันงานหนักแยกจากหน้าจอหลัก เพื่อให้ UI ไม่ค้างระหว่างอ่าน/สร้าง Excel
// [L0006] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ภาพรวม: รับคำสั่งจาก app.js แล้วเรียก BlackwolfEngine.preflight หรือ BlackwolfEngine.run
// [L0007] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ภาพรวม: ส่ง progress, heartbeat, result และ error กลับไปให้ UI แสดงสถานะ
// [L0008] ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache
importScripts('config.js?v=3.5.8-safe-r1','vendor/xlsx-js-style.min.js','vendor/jszip.min.js','engine.js?v=3.5.8-safe-r1');
// [L0009] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0010] ประกาศตัวแปร cachedWorkbooks แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
let cachedWorkbooks={};
// [L0011] ประกาศตัวแปร cachedFiles แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
let cachedFiles={};
// [L0012] ประกาศตัวแปร busyRequestId แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
let busyRequestId=null;
// SAFE GUARD R1: เก็บ stage ล่าสุด เพื่อช่วยส่ง error กลับไปให้ UI ถ้า worker error นอก try/catch
let busyStage='idle';
// [L0013] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0014] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ส่งข้อความกลับจาก worker ไป main thread พร้อม transfer object ถ้ามี
// [L0015] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0016] ประกาศฟังก์ชัน reply เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function reply(id,type,payload,transfer){postMessage({id,type,...payload},transfer||[]);}
// SAFE GUARD R1: ส่ง error แบบปลอดภัยจาก global worker handler โดยไม่ให้ handler พังซ้ำ
function replyGlobalWorkerError(code,error){
  try{if(busyRequestId!==null)reply(busyRequestId,'error',{error:{code,message:error?.message||String(error||'Worker global error'),stack:error?.stack||'',stage:busyStage||'global'}});}catch{}
}
// SAFE GUARD R1: ดัก error ที่หลุดออกนอก onmessage try/catch เช่น library throw async ข้างนอก
self.addEventListener('error',event=>replyGlobalWorkerError('BW-WORKER-GLOBAL',event.error||new Error(event.message||'Worker global error')));
// SAFE GUARD R1: ดัก Promise rejection ที่ไม่มี catch ใน Worker เพื่อไม่ให้ UI เงียบ
self.addEventListener('unhandledrejection',event=>replyGlobalWorkerError('BW-WORKER-PROMISE',event.reason instanceof Error?event.reason:new Error(String(event.reason||'Worker unhandled rejection'))));
// [L0017] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: แปลงชนิดคำสั่ง worker เป็น error code มาตรฐาน
// [L0018] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0019] ประกาศฟังก์ชัน commandErrorCode เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function commandErrorCode(type){
// [L0020] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return({ping:'BW-WORKER-000',reset:'BW-WORKER-004','detect-file':'BW-FILE-001','load-file':'BW-FILE-002',validate:'BW-PREFLIGHT-001',run:'BW-RUN-001'})[type]||'BW-WORKER-001';
// [L0021] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0022] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// อธิบาย: ส่ง heartbeat เป็นระยะเพื่อบอก UI ว่า worker ยังไม่ค้าง
// [L0023] คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
// [L0024] ประกาศฟังก์ชัน beginHeartbeat เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้
function beginHeartbeat(id,stage){
// [L0025] ประกาศตัวแปร startedAt แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const startedAt=Date.now();
// [L0026] สร้างตัวช่วยแบบ arrow function ชื่อ timer เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
  const timer=setInterval(()=>reply(id,'heartbeat',{heartbeat:{stage,elapsedMs:Date.now()-startedAt,timestamp:new Date().toISOString()}}),2000);
// [L0027] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
  return()=>clearInterval(timer);
// [L0028] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
}
// [L0029] บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน

// [L0030] กำหนด handler/ฟังก์ชันให้ self.onmessage เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง
self.onmessage=async event=>{
// [L0031] ประกาศตัวแปร message แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const message=event.data||{},requestId=message.id,type=message.type;
  if(!requestId||!type){reply(requestId||0,'error',{error:{code:'BW-WORKER-MESSAGE',message:'Worker message ต้องมี id และ type',stage:type||'unknown'}});return;}
// [L0032] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
  if(busyRequestId!==null){
// [L0033] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    reply(requestId,'error',{error:{code:'BW-WORKER-006',message:'Worker กำลังทำงานอื่นอยู่ กรุณารอหรือกด Cancel Run',stage:type}});
// [L0034] คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน
    return;
// [L0035] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0036] ประกาศตัวแปร stopHeartbeat แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
  const stopHeartbeat=beginHeartbeat(requestId,type||'unknown');
// [L0037] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
  busyRequestId=requestId;busyStage=type||'unknown';
// [L0038] เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้
  try{
// [L0039] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(type==='ping'){
// [L0040] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      reply(requestId,'done',{result:{ok:true,version:self.BLACKWOLF_CONFIG.version}});return;
// [L0041] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
    }
// [L0042] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(type==='reset'){
// [L0043] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      cachedWorkbooks={};cachedFiles={};reply(requestId,'done',{result:{ok:true}});return;
// [L0044] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
    }
// [L0045] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(type==='detect-file'){
// [L0046] ประกาศตัวแปร file แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
      const file=message.file;if(!file?.name||!file?.buffer)throw new Error('ข้อมูลไฟล์สำหรับตรวจประเภทไม่ครบ');
// [L0047] สร้างตัวช่วยแบบ arrow function ชื่อ pseudo เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
      const pseudo={name:file.name,arrayBuffer:async()=>file.buffer};
// [L0048] ประกาศตัวแปร workbook แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
      const workbook=await self.BlackwolfEngine.readWorkbook(pseudo);
// [L0049] ประกาศตัวแปร result แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
      const result=self.BlackwolfEngine.detectWorkbookRole(workbook,file.name);
// [L0050] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
      if(result.role==='master')workbook.__sourceBuffer=file.buffer;
// [L0051] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
      if(result.role){cachedFiles[result.role]={name:file.name};cachedWorkbooks[result.role]=workbook;}
// [L0052] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      reply(requestId,'done',{result});return;
// [L0053] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
    }
// [L0054] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(type==='load-file'){
// [L0055] ประกาศตัวแปร file แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
      const file=message.file;if(!file?.role||!file?.name||!file?.buffer)throw new Error('ข้อมูลไฟล์สำหรับ Worker ไม่ครบ');
// [L0056] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      reply(requestId,'progress',{progress:{pct:10,message:`กำลังอ่าน ${file.name} ใน Background Worker`}});
// [L0057] สร้างตัวช่วยแบบ arrow function ชื่อ pseudo เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้
      const pseudo={name:file.name,arrayBuffer:async()=>file.buffer};
// [L0058] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      cachedFiles[file.role]={name:file.name};
// [L0059] รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ
      cachedWorkbooks[file.role]=await self.BlackwolfEngine.readWorkbook(pseudo,file.role==='master');
// [L0060] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      reply(requestId,'progress',{progress:{pct:100,message:`อ่าน ${file.name} สำเร็จ`}});
// [L0061] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      reply(requestId,'done',{result:{role:file.role,name:file.name}});return;
// [L0062] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
    }
// [L0063] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(type==='validate'){
// [L0064] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      reply(requestId,'progress',{progress:{pct:78,message:'กำลังตรวจโครงสร้าง Sheet, Header, Date และ Pivot Package แบบ Strict'}});
// [L0065] ประกาศตัวแปร result แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
      const result=await self.BlackwolfEngine.preflight(cachedWorkbooks,cachedFiles,message.etlText||'',message.manualStartDate||'');
// [L0066] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      reply(requestId,'done',{result});return;
// [L0067] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
    }
// [L0068] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
    if(type==='run'){
// [L0069] ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป
      if(!cachedWorkbooks.master)throw new Error('ยังไม่มี Workbook Cache กรุณากดตรวจสอบไฟล์อีกครั้ง');
// [L0070] ประกาศตัวแปร result แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
      const result=await self.BlackwolfEngine.run({
// [L0071] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
        workbooks:cachedWorkbooks,etlText:message.etlText||'',manualStartDate:message.manualStartDate||'',today:new Date(message.today||Date.now()),
// [L0072] ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล
        onProgress:(pct,text)=>reply(requestId,'progress',{progress:{pct,message:text}})
// [L0073] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
      });
// [L0074] ประกาศตัวแปร masterBuffer แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
      const masterBuffer=await result.outputs.master.arrayBuffer(),issueBuffer=await result.outputs.issue.arrayBuffer();
// [L0075] ประกาศตัวแปร previewLimit แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
      const previewLimit=2000,allRows=result.rows||[],rows=allRows.slice(0,previewLimit);
// [L0076] ประกาศตัวแปร duplicateSummary แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
      const duplicateSummary=self.BlackwolfEngine.internals.analyzeAlienDuplicates(allRows);
// [L0077] ประกาศตัวแปร summary แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
      const summary={...result.summary,AlienDuplicateCodeCount:duplicateSummary.duplicateCodeCount,AlienDuplicateRowCount:duplicateSummary.duplicateRowCount,WebPreviewRows:rows.length,WebPreviewTruncated:allRows.length>previewLimit};
// [L0078] ประกาศตัวแปร safe แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้
      const safe={
// [L0079] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
        runId:result.runId,summary,rows,duplicateSummary,
// [L0080] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
        context:{smIds:(result.context.smIds||[]).slice(0,previewLimit),blIds:(result.context.blIds||[]).slice(0,previewLimit)},
// [L0081] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
        names:result.outputs.names,masterBuffer,issueBuffer
// [L0082] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
      };
// [L0083] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
      reply(requestId,'done',{result:safe},[masterBuffer,issueBuffer]);return;
// [L0084] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
    }
// [L0085] หยุด flow ปัจจุบันด้วย error เมื่อพบเงื่อนไขที่ทำต่ออย่างปลอดภัยไม่ได้
    throw new Error(`Unknown worker command: ${type}`);
// [L0086] จับ error จาก try block แล้วแปลงเป็นข้อความ/สถานะที่ผู้ใช้หรือระบบเข้าใจได้
  }catch(error){
// [L0087] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    reply(requestId,'error',{error:{code:error?.code||commandErrorCode(type),message:error?.message||String(error),stack:error?.stack||'',stage:type||'unknown'}});
// [L0088] ส่วนที่ต้องทำเสมอหลัง try/catch เช่น ปลดล็อกปุ่ม เคลียร์สถานะ หรือคืน resource
  }finally{
// [L0089] คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป
    stopHeartbeat();busyRequestId=null;busyStage='idle';
// [L0090] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
  }
// [L0091] ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์
};
