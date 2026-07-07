# อธิบายบรรทัดต่อบรรทัด: `worker.js`

**บทบาทไฟล์:** Background Worker: รับงานหนักจาก app.js ไปประมวลผลนอก UI thread เพื่อลดอาการเว็บค้าง

> วิธีอ่าน: ดูเลขบรรทัด L0001, L0002, ... แล้วเทียบกับไฟล์โค้ดต้นฉบับ/ไฟล์ที่ใส่คอมเมนต์แล้วได้ทันที

| บรรทัด | โค้ด | คำอธิบายแบบคนเริ่มจากศูนย์ |
|---:|---|---|
| L0001 | `'use strict';` | เปิด strict mode เพื่อให้ JavaScript จับข้อผิดพลาดเข้มขึ้น เช่น ห้ามใช้ตัวแปรที่ยังไม่ประกาศ |
| L0002 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0003 | `// BLACKWOLF TEACHING COMMENTS: คอมเมนต์ชุดนี้เพิ่มเพื่ออธิบาย logic สำหรับอ่าน/ดูแลโค้ด` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0004 | `// หลักสำคัญ: คอมเมนต์ขึ้นต้นด้วย // จะไม่ถูกรัน จึงไม่เปลี่ยน behavior ของ JavaScript` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0005 | `// ภาพรวม: ไฟล์ Web Worker ใช้รันงานหนักแยกจากหน้าจอหลัก เพื่อให้ UI ไม่ค้างระหว่างอ่าน/สร้าง Excel` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0006 | `// ภาพรวม: รับคำสั่งจาก app.js แล้วเรียก BlackwolfEngine.preflight หรือ BlackwolfEngine.run` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0007 | `// ภาพรวม: ส่ง progress, heartbeat, result และ error กลับไปให้ UI แสดงสถานะ` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0008 | `importScripts('config.js?v=3.5.8','vendor/xlsx-js-style.min.js','vendor/jszip.min.js','engine.js?v=3.5.8');` | ทำงานกับโครงสร้าง ZIP ภายในไฟล์ .xlsx เพื่ออ่าน/แก้ XML เช่น pivot/table/cache |
| L0009 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0010 | `let cachedWorkbooks={};` | ประกาศตัวแปร cachedWorkbooks แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0011 | `let cachedFiles={};` | ประกาศตัวแปร cachedFiles แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0012 | `let busyRequestId=null;` | ประกาศตัวแปร busyRequestId แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0013 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0014 | `// อธิบาย: ส่งข้อความกลับจาก worker ไป main thread พร้อม transfer object ถ้ามี` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0015 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0016 | `function reply(id,type,payload,transfer){postMessage({id,type,...payload},transfer\|\|[]);}` | ประกาศฟังก์ชัน reply เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0017 | `// อธิบาย: แปลงชนิดคำสั่ง worker เป็น error code มาตรฐาน` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0018 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0019 | `function commandErrorCode(type){` | ประกาศฟังก์ชัน commandErrorCode เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0020 | `  return({ping:'BW-WORKER-000',reset:'BW-WORKER-004','detect-file':'BW-FILE-001','load-file':'BW-FILE-002',validate:'BW-PREFLIGHT-001',run:'BW-RUN-001'})[typ...` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0021 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0022 | `// อธิบาย: ส่ง heartbeat เป็นระยะเพื่อบอก UI ว่า worker ยังไม่ค้าง` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0023 | `// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป` | คอมเมนต์เดิม อธิบายเจตนาหรือขั้นตอนของผู้พัฒนา ไม่ถูกรันเป็นโค้ด |
| L0024 | `function beginHeartbeat(id,stage){` | ประกาศฟังก์ชัน beginHeartbeat เป็นขั้นตอนย่อยของระบบ เพื่อให้ส่วนอื่นเรียกใช้ซ้ำได้ |
| L0025 | `  const startedAt=Date.now();` | ประกาศตัวแปร startedAt แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0026 | `  const timer=setInterval(()=>reply(id,'heartbeat',{heartbeat:{stage,elapsedMs:Date.now()-startedAt,timestamp:new Date().toISOString()}}),2000);` | สร้างตัวช่วยแบบ arrow function ชื่อ timer เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0027 | `  return()=>clearInterval(timer);` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0028 | `}` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0029 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้เว้นช่วงให้โค้ดอ่านง่าย ไม่กระทบการทำงาน |
| L0030 | `self.onmessage=async event=>{` | กำหนด handler/ฟังก์ชันให้ self.onmessage เพื่อรอรับเหตุการณ์หรือเรียกใช้งานภายหลัง |
| L0031 | `  const message=event.data\|\|{},requestId=message.id,type=message.type;` | ประกาศตัวแปร message แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0032 | `  if(busyRequestId!==null){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0033 | `    reply(requestId,'error',{error:{code:'BW-WORKER-006',message:'Worker กำลังทำงานอื่นอยู่ กรุณารอหรือกด Cancel Run',stage:type}});` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0034 | `    return;` | คืนค่าผลลัพธ์ออกจากฟังก์ชัน เพื่อส่งต่อให้ขั้นตอนถัดไปใช้งาน |
| L0035 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0036 | `  const stopHeartbeat=beginHeartbeat(requestId,type\|\|'unknown');` | ประกาศตัวแปร stopHeartbeat แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0037 | `  busyRequestId=requestId;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0038 | `  try{` | เริ่ม try block สำหรับคำสั่งที่อาจ error เพื่อให้ระบบจับและจัดการข้อผิดพลาดได้ |
| L0039 | `    if(type==='ping'){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0040 | `      reply(requestId,'done',{result:{ok:true,version:self.BLACKWOLF_CONFIG.version}});return;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0041 | `    }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0042 | `    if(type==='reset'){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0043 | `      cachedWorkbooks={};cachedFiles={};reply(requestId,'done',{result:{ok:true}});return;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0044 | `    }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0045 | `    if(type==='detect-file'){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0046 | `      const file=message.file;if(!file?.name\|\|!file?.buffer)throw new Error('ข้อมูลไฟล์สำหรับตรวจประเภทไม่ครบ');` | ประกาศตัวแปร file แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0047 | `      const pseudo={name:file.name,arrayBuffer:async()=>file.buffer};` | สร้างตัวช่วยแบบ arrow function ชื่อ pseudo เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0048 | `      const workbook=await self.BlackwolfEngine.readWorkbook(pseudo);` | ประกาศตัวแปร workbook แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0049 | `      const result=self.BlackwolfEngine.detectWorkbookRole(workbook,file.name);` | ประกาศตัวแปร result แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0050 | `      if(result.role==='master')workbook.__sourceBuffer=file.buffer;` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0051 | `      if(result.role){cachedFiles[result.role]={name:file.name};cachedWorkbooks[result.role]=workbook;}` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0052 | `      reply(requestId,'done',{result});return;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0053 | `    }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0054 | `    if(type==='load-file'){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0055 | `      const file=message.file;if(!file?.role\|\|!file?.name\|\|!file?.buffer)throw new Error('ข้อมูลไฟล์สำหรับ Worker ไม่ครบ');` | ประกาศตัวแปร file แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0056 | `      reply(requestId,'progress',{progress:{pct:10,message:\`กำลังอ่าน ${file.name} ใน Background Worker\`}});` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0057 | `      const pseudo={name:file.name,arrayBuffer:async()=>file.buffer};` | สร้างตัวช่วยแบบ arrow function ชื่อ pseudo เพื่อย่อโค้ดและเรียกใช้ซ้ำในไฟล์นี้ |
| L0058 | `      cachedFiles[file.role]={name:file.name};` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0059 | `      cachedWorkbooks[file.role]=await self.BlackwolfEngine.readWorkbook(pseudo,file.role==='master');` | รอคำสั่ง asynchronous ให้เสร็จก่อน เช่น อ่านไฟล์ เปิดฐานข้อมูล หรือรอ worker ตอบกลับ |
| L0060 | `      reply(requestId,'progress',{progress:{pct:100,message:\`อ่าน ${file.name} สำเร็จ\`}});` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0061 | `      reply(requestId,'done',{result:{role:file.role,name:file.name}});return;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0062 | `    }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0063 | `    if(type==='validate'){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0064 | `      reply(requestId,'progress',{progress:{pct:78,message:'กำลังตรวจโครงสร้าง Sheet, Header, Date และ Pivot Package แบบ Strict'}});` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0065 | `      const result=await self.BlackwolfEngine.preflight(cachedWorkbooks,cachedFiles,message.etlText\|\|'',message.manualStartDate\|\|'');` | ประกาศตัวแปร result แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0066 | `      reply(requestId,'done',{result});return;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0067 | `    }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0068 | `    if(type==='run'){` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0069 | `      if(!cachedWorkbooks.master)throw new Error('ยังไม่มี Workbook Cache กรุณากดตรวจสอบไฟล์อีกครั้ง');` | ตรวจเงื่อนไขก่อนเลือกทางเดินของโปรแกรม ถ้าเงื่อนไขจริงจึงทำ block ถัดไป |
| L0070 | `      const result=await self.BlackwolfEngine.run({` | ประกาศตัวแปร result แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0071 | `        workbooks:cachedWorkbooks,etlText:message.etlText\|\|'',manualStartDate:message.manualStartDate\|\|'',today:new Date(message.today\|\|Date.now()),` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0072 | `        onProgress:(pct,text)=>reply(requestId,'progress',{progress:{pct,message:text}})` | ใช้ arrow function เป็น callback หรือ helper ขนาดสั้นสำหรับประมวลผลข้อมูล |
| L0073 | `      });` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0074 | `      const masterBuffer=await result.outputs.master.arrayBuffer(),issueBuffer=await result.outputs.issue.arrayBuffer();` | ประกาศตัวแปร masterBuffer แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0075 | `      const previewLimit=2000,allRows=result.rows\|\|[],rows=allRows.slice(0,previewLimit);` | ประกาศตัวแปร previewLimit แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0076 | `      const duplicateSummary=self.BlackwolfEngine.internals.analyzeAlienDuplicates(allRows);` | ประกาศตัวแปร duplicateSummary แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0077 | `      const summary={...result.summary,AlienDuplicateCodeCount:duplicateSummary.duplicateCodeCount,AlienDuplicateRowCount:duplicateSummary.duplicateRowCount,...` | ประกาศตัวแปร summary แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0078 | `      const safe={` | ประกาศตัวแปร safe แล้วกำหนดค่าเริ่มต้นจากข้อมูลหรือผลคำนวณในบรรทัดนี้ |
| L0079 | `        runId:result.runId,summary,rows,duplicateSummary,` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0080 | `        context:{smIds:(result.context.smIds\|\|[]).slice(0,previewLimit),blIds:(result.context.blIds\|\|[]).slice(0,previewLimit)},` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0081 | `        names:result.outputs.names,masterBuffer,issueBuffer` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0082 | `      };` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0083 | `      reply(requestId,'done',{result:safe},[masterBuffer,issueBuffer]);return;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0084 | `    }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0085 | `    throw new Error(\`Unknown worker command: ${type}\`);` | หยุด flow ปัจจุบันด้วย error เมื่อพบเงื่อนไขที่ทำต่ออย่างปลอดภัยไม่ได้ |
| L0086 | `  }catch(error){` | จับ error จาก try block แล้วแปลงเป็นข้อความ/สถานะที่ผู้ใช้หรือระบบเข้าใจได้ |
| L0087 | `    reply(requestId,'error',{error:{code:error?.code\|\|commandErrorCode(type),message:error?.message\|\|String(error),stack:error?.stack\|\|'',stage:type\|\|'unknow...` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0088 | `  }finally{` | ส่วนที่ต้องทำเสมอหลัง try/catch เช่น ปลดล็อกปุ่ม เคลียร์สถานะ หรือคืน resource |
| L0089 | `    stopHeartbeat();busyRequestId=null;` | คำสั่ง JavaScript ใน flow ปัจจุบัน ทำหน้าที่ประมวลผลข้อมูล อัปเดตสถานะ หรือเชื่อมขั้นตอนถัดไป |
| L0090 | `  }` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
| L0091 | `};` | ปิด block/object/array/function call ที่เปิดไว้ก่อนหน้า เพื่อให้โครงสร้างโค้ดสมบูรณ์ |
