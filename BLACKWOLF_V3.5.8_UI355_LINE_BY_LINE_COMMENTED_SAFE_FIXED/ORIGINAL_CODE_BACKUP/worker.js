'use strict';

// BLACKWOLF TEACHING COMMENTS: คอมเมนต์ชุดนี้เพิ่มเพื่ออธิบาย logic สำหรับอ่าน/ดูแลโค้ด
// หลักสำคัญ: คอมเมนต์ขึ้นต้นด้วย // จะไม่ถูกรัน จึงไม่เปลี่ยน behavior ของ JavaScript
// ภาพรวม: ไฟล์ Web Worker ใช้รันงานหนักแยกจากหน้าจอหลัก เพื่อให้ UI ไม่ค้างระหว่างอ่าน/สร้าง Excel
// ภาพรวม: รับคำสั่งจาก app.js แล้วเรียก BlackwolfEngine.preflight หรือ BlackwolfEngine.run
// ภาพรวม: ส่ง progress, heartbeat, result และ error กลับไปให้ UI แสดงสถานะ
importScripts('config.js?v=3.5.8','vendor/xlsx-js-style.min.js','vendor/jszip.min.js','engine.js?v=3.5.8');

let cachedWorkbooks={};
let cachedFiles={};
let busyRequestId=null;

// อธิบาย: ส่งข้อความกลับจาก worker ไป main thread พร้อม transfer object ถ้ามี
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function reply(id,type,payload,transfer){postMessage({id,type,...payload},transfer||[]);}
// อธิบาย: แปลงชนิดคำสั่ง worker เป็น error code มาตรฐาน
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function commandErrorCode(type){
  return({ping:'BW-WORKER-000',reset:'BW-WORKER-004','detect-file':'BW-FILE-001','load-file':'BW-FILE-002',validate:'BW-PREFLIGHT-001',run:'BW-RUN-001'})[type]||'BW-WORKER-001';
}
// อธิบาย: ส่ง heartbeat เป็นระยะเพื่อบอก UI ว่า worker ยังไม่ค้าง
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function beginHeartbeat(id,stage){
  const startedAt=Date.now();
  const timer=setInterval(()=>reply(id,'heartbeat',{heartbeat:{stage,elapsedMs:Date.now()-startedAt,timestamp:new Date().toISOString()}}),2000);
  return()=>clearInterval(timer);
}

self.onmessage=async event=>{
  const message=event.data||{},requestId=message.id,type=message.type;
  if(busyRequestId!==null){
    reply(requestId,'error',{error:{code:'BW-WORKER-006',message:'Worker กำลังทำงานอื่นอยู่ กรุณารอหรือกด Cancel Run',stage:type}});
    return;
  }
  const stopHeartbeat=beginHeartbeat(requestId,type||'unknown');
  busyRequestId=requestId;
  try{
    if(type==='ping'){
      reply(requestId,'done',{result:{ok:true,version:self.BLACKWOLF_CONFIG.version}});return;
    }
    if(type==='reset'){
      cachedWorkbooks={};cachedFiles={};reply(requestId,'done',{result:{ok:true}});return;
    }
    if(type==='detect-file'){
      const file=message.file;if(!file?.name||!file?.buffer)throw new Error('ข้อมูลไฟล์สำหรับตรวจประเภทไม่ครบ');
      const pseudo={name:file.name,arrayBuffer:async()=>file.buffer};
      const workbook=await self.BlackwolfEngine.readWorkbook(pseudo);
      const result=self.BlackwolfEngine.detectWorkbookRole(workbook,file.name);
      if(result.role==='master')workbook.__sourceBuffer=file.buffer;
      if(result.role){cachedFiles[result.role]={name:file.name};cachedWorkbooks[result.role]=workbook;}
      reply(requestId,'done',{result});return;
    }
    if(type==='load-file'){
      const file=message.file;if(!file?.role||!file?.name||!file?.buffer)throw new Error('ข้อมูลไฟล์สำหรับ Worker ไม่ครบ');
      reply(requestId,'progress',{progress:{pct:10,message:`กำลังอ่าน ${file.name} ใน Background Worker`}});
      const pseudo={name:file.name,arrayBuffer:async()=>file.buffer};
      cachedFiles[file.role]={name:file.name};
      cachedWorkbooks[file.role]=await self.BlackwolfEngine.readWorkbook(pseudo,file.role==='master');
      reply(requestId,'progress',{progress:{pct:100,message:`อ่าน ${file.name} สำเร็จ`}});
      reply(requestId,'done',{result:{role:file.role,name:file.name}});return;
    }
    if(type==='validate'){
      reply(requestId,'progress',{progress:{pct:78,message:'กำลังตรวจโครงสร้าง Sheet, Header, Date และ Pivot Package แบบ Strict'}});
      const result=await self.BlackwolfEngine.preflight(cachedWorkbooks,cachedFiles,message.etlText||'',message.manualStartDate||'');
      reply(requestId,'done',{result});return;
    }
    if(type==='run'){
      if(!cachedWorkbooks.master)throw new Error('ยังไม่มี Workbook Cache กรุณากดตรวจสอบไฟล์อีกครั้ง');
      const result=await self.BlackwolfEngine.run({
        workbooks:cachedWorkbooks,etlText:message.etlText||'',manualStartDate:message.manualStartDate||'',today:new Date(message.today||Date.now()),
        onProgress:(pct,text)=>reply(requestId,'progress',{progress:{pct,message:text}})
      });
      const masterBuffer=await result.outputs.master.arrayBuffer(),issueBuffer=await result.outputs.issue.arrayBuffer();
      const previewLimit=2000,allRows=result.rows||[],rows=allRows.slice(0,previewLimit);
      const duplicateSummary=self.BlackwolfEngine.internals.analyzeAlienDuplicates(allRows);
      const summary={...result.summary,AlienDuplicateCodeCount:duplicateSummary.duplicateCodeCount,AlienDuplicateRowCount:duplicateSummary.duplicateRowCount,WebPreviewRows:rows.length,WebPreviewTruncated:allRows.length>previewLimit};
      const safe={
        runId:result.runId,summary,rows,duplicateSummary,
        context:{smIds:(result.context.smIds||[]).slice(0,previewLimit),blIds:(result.context.blIds||[]).slice(0,previewLimit)},
        names:result.outputs.names,masterBuffer,issueBuffer
      };
      reply(requestId,'done',{result:safe},[masterBuffer,issueBuffer]);return;
    }
    throw new Error(`Unknown worker command: ${type}`);
  }catch(error){
    reply(requestId,'error',{error:{code:error?.code||commandErrorCode(type),message:error?.message||String(error),stack:error?.stack||'',stage:type||'unknown'}});
  }finally{
    stopHeartbeat();busyRequestId=null;
  }
};
