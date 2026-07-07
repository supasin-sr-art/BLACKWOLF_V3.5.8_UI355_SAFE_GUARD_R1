(function(){
'use strict';


// BLACKWOLF TEACHING COMMENTS: คอมเมนต์ชุดนี้เพิ่มเพื่ออธิบาย logic สำหรับอ่าน/ดูแลโค้ด
// หลักสำคัญ: คอมเมนต์ขึ้นต้นด้วย // จะไม่ถูกรัน จึงไม่เปลี่ยน behavior ของ JavaScript
// ภาพรวม: ไฟล์ควบคุมหน้าจอหลักของ BLACKWOLF ทั้งหมด เช่น ปุ่ม, อัปโหลดไฟล์, progress, dashboard, results, report, history และ settings
// ภาพรวม: ทำหน้าที่เป็นตัวกลางระหว่างผู้ใช้, Web Worker, IndexedDB และ Engine
// ภาพรวม: ไม่ได้คำนวณ Excel หนัก ๆ เอง แต่ส่งงานให้ worker/engine เพื่อความเร็วและลดการค้าง
// อธิบาย: ตัวช่วยเลือก element ตัวแรกจาก CSS selector เพื่อลดการเขียน document.querySelector ซ้ำ
// ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้
const $=(selector,root=document)=>root.querySelector(selector);
// อธิบาย: ตัวช่วยเลือก elements หลายตัวแล้วแปลงเป็น Array เพื่อให้ forEach/map ได้ทันที
// ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
// อธิบาย: ผูก event ให้ element แบบปลอดภัย ถ้า selector ไม่เจอจะไม่ทำให้โปรแกรม error
// ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้
const on=(selector,event,handler)=>{const element=$(selector);if(element)element.addEventListener(event,handler);return element;};
const CONFIG=window.BLACKWOLF_CONFIG;
const requiredRoles=['master','issue','daily','m190'];
const roles=['master','issue','daily','m190','sm','blacklist','etl'];
const display={master:'ไฟล์หลัก / Master Working File',issue:'ไฟล์หลัก / เช็คสถานะ ISSUE',daily:'Daily Report',m190:'M190 Premium by Policy',sm:'ข้อมูลไม่สมบูรณ์ / SM',blacklist:'Blacklist',etl:'Auto-Mail 7.2'};
const RETENTION_MS=CONFIG.retentionDays*24*60*60*1000;
const storage={
  get:key=>{try{return localStorage.getItem(key);}catch{return null;}},
  set:(key,value)=>{try{localStorage.setItem(key,value);}catch{}},
  remove:key=>{try{localStorage.removeItem(key);}catch{}}
};
const storageKey=name=>`${CONFIG.storageNamespace}.${name}`;
const state={
  files:Object.fromEntries(roles.map(role=>[role,null])),
  workbooks:{},
  etlText:'',
  preflight:null,
  result:null,
  activePreview:'Report',
  worker:null,
  workerReady:false,
  workerSeq:0,
  workerJobs:new Map(),
  workerCachedRoles:new Set(),
  workerGeneration:0,
  workerLastHeartbeat:null,
  activeWorkerJobId:null,
  cancelRequested:false,
  language:storage.get(storageKey('language'))||'th',
  running:false,
  classifying:false,
  diagnosticErrors:[]
};
let toastTimer,historyCountdownTimer,clockTimer,lastProgressAt=0;
let selectedDetailIndex=null;
let previewDrillRegistry=[];
let previewPvStatusFilter='(All)';
// อธิบาย: พักงานสั้น ๆ เพื่อคืนจังหวะให้ Browser วาดหน้าจอและแสดง progress
// ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้
const yieldUi=(milliseconds=0)=>new Promise(resolve=>setTimeout(resolve,milliseconds));
const WORKER_INACTIVITY_TIMEOUTS={ping:4500,'detect-file':180000,'load-file':600000,validate:600000,run:900000,reset:120000};
// อธิบาย: สร้าง Error ที่มี error code มาตรฐาน เพื่อให้ผู้ใช้เอารหัสไปค้นหาสาเหตุได้
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function appError(code,message,cause){const error=new Error(message);error.code=code||'BW-UNCLASSIFIED';if(cause)error.cause=cause;return error;}
// อธิบาย: แปลง Error เป็นข้อความอ่านง่าย โดยรวม error code กับ message
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function errorText(error){return`${error?.code?`[${error.code}] `:''}${error?.message||String(error||'Unknown error')}`;}

// อธิบาย: escape ข้อความก่อนใส่ HTML เพื่อลดโอกาส HTML แทรกผิดรูปหรือ XSS จากข้อมูลไฟล์
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function esc(value){return String(value??'').replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));}
// อธิบาย: แสดงตัวเลขรูปแบบไทย เช่น ใส่ comma ให้อ่านง่าย
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function fmt(value){return Number(value||0).toLocaleString('th-TH');}
// อธิบาย: แสดงจำนวนเงิน/เบี้ยประกัน โดยคุมจำนวนทศนิยมให้เหมาะกับรายงาน
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function money(value){return Number(value||0).toLocaleString('th-TH',{minimumFractionDigits:0,maximumFractionDigits:2});}
// อธิบาย: แปลงจำนวน byte เป็น B/KB/MB/GB เพื่อใช้ในหน้าสถานะระบบ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function bytes(value){const size=Number(value||0);if(size<1024)return`${size} B`;if(size<1048576)return`${(size/1024).toFixed(1)} KB`;if(size<1073741824)return`${(size/1048576).toFixed(1)} MB`;return`${(size/1073741824).toFixed(2)} GB`;}
// อธิบาย: แสดงกล่องแจ้งเตือนสั้น ๆ มุมหน้าจอ แล้วซ่อนอัตโนมัติ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function toast(message,milliseconds=3000){const element=$('#toast');element.textContent=message;element.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>element.classList.remove('show'),milliseconds);}
// อธิบาย: อัปเดต status chip ด้านบนของระบบ เช่น Ready, Running, Error
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function setStatus(label,type=''){const element=$('#globalStatus');element.textContent=label;element.className=`status-chip ${type}`;}
// อธิบาย: คืนชื่อหน้าเมนูตามภาษาที่เลือก
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function pageTitles(){return state.language==='en'?{prepare:'Prepare & Run',dashboard:'Executive Dashboard',results:'Approval & Download',report:'Executive Report',history:'Run History',settings:'Settings'}:{prepare:'เตรียมไฟล์และรัน',dashboard:'แดชบอร์ดผู้บริหาร',results:'ตรวจผลและดาวน์โหลด',report:'รายงานผู้บริหาร',history:'ประวัติการรัน',settings:'การตั้งค่า'};}
// อธิบาย: เปลี่ยนภาษา UI และบันทึกค่าลง localStorage
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function applyLanguage(language){state.language=language==='en'?'en':'th';storage.set(storageKey('language'),state.language);const labels=pageTitles();$$('.nav').forEach(button=>{const label=$('b',button);if(label)label.textContent=labels[button.dataset.page]||label.textContent;});$$('[data-language]').forEach(button=>button.classList.toggle('active',button.dataset.language===state.language));const active=$('.page.active')?.id.replace('page-','')||'prepare';$('#pageTitle').textContent=labels[active]||active;}
// อธิบาย: เปลี่ยนธีม light/dark และบันทึกค่าลง localStorage
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function applyTheme(theme){const normalized=theme==='dark'?'dark':'light';document.body.classList.toggle('dark',normalized==='dark');storage.set(storageKey('theme'),normalized);$$('[data-theme-value]').forEach(button=>button.classList.toggle('active',button.dataset.themeValue===normalized));}
// อธิบาย: เปลี่ยนหน้าที่กำลังแสดง และ sync สถานะปุ่มเมนู
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function setPage(page){$$('.page').forEach(element=>element.classList.toggle('active',element.id===`page-${page}`));$$('.nav').forEach(element=>element.classList.toggle('active',element.dataset.page===page));$('#pageTitle').textContent=pageTitles()[page]||page;if(page==='history')renderHistory();if(page==='report')renderReport();if(page==='settings')refreshSystemStatus();window.scrollTo({top:0,behavior:'smooth'});}
// อธิบาย: อัปเดตวันเวลาแบบ real-time บน topbar
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function updateClock(){const date=new Date();$('#liveDateTime').textContent=date.toLocaleString('th-TH',{weekday:'short',day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'});}
// อธิบาย: อ่าน Manual Start Date จากช่องกรอก เพื่อใช้กรณี Master ไม่มี Date เดิม
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function manualStartDate(){return $('#manualStartDate')?.value||'';}

// อธิบาย: จัดรูปแบบเวลาสำหรับไฟล์ diagnostic package
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function diagnosticTimestamp(date=new Date()){
  const pad=value=>String(value).padStart(2,'0');
  return`${date.getFullYear()}${pad(date.getMonth()+1)}${pad(date.getDate())}_${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}
// อธิบาย: แปลงค่าที่อาจใหญ่หรือซับซ้อนให้ปลอดภัยก่อนใส่ diagnostic JSON
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function diagnosticSafeValue(value){
  if(value===undefined)return null;
  try{return JSON.parse(JSON.stringify(value));}catch{return String(value);}
}
// อธิบาย: บันทึก error ล่าสุดลง state เพื่อ export ให้ตรวจย้อนหลังได้
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function recordDiagnosticError(source,error,code='BW-UNCLASSIFIED'){
  const item={timestamp:new Date().toISOString(),source:String(source||'unknown'),code,message:error?.message||String(error||'Unknown error'),stack:error?.stack||''};
  state.diagnosticErrors.push(item);
  if(state.diagnosticErrors.length>50)state.diagnosticErrors.splice(0,state.diagnosticErrors.length-50);
  return item;
}
// อธิบาย: สรุปรายละเอียดไฟล์ที่เลือก เช่น ชื่อ ขนาด เวลาแก้ไขล่าสุด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function selectedFileMetadata(){
  return roles.map(role=>{
    const file=state.files[role];
    return{role,label:display[role],selected:!!file,name:file?.name||null,size:file?.size||0,sizeDisplay:file?bytes(file.size):null,type:file?.type||null,lastModified:file?.lastModified?new Date(file.lastModified).toISOString():null};
  });
}
// อธิบาย: ย่อข้อมูล Run History ให้พอแสดงใน UI โดยไม่โหลด blob ใหญ่เกินจำเป็น
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function compactHistoryRecord(record){
  return{id:record.id||null,status:record.status||null,createdAt:record.createdAt||null,expiresAt:record.expiresAt||null,message:record.message||null,outputNames:diagnosticSafeValue(record.outputNames||{}),summary:diagnosticSafeValue(record.summary||{})};
}
// อธิบาย: สร้างไฟล์ ZIP diagnostic รวมสถานะระบบ ไฟล์ที่เลือก และ error log สำหรับ debug
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function exportDiagnosticPackage(){
  const button=$('#exportDiagnosticBtn'),status=$('#diagnosticExportStatus');
  if(button)button.disabled=true;
  if(status)status.textContent='กำลังรวบรวมข้อมูลตรวจสอบ...';
  try{
    if(typeof JSZip==='undefined')throw new Error('JSZip ไม่พร้อมใช้งาน');
    const now=new Date(),packageId=`BW-DIAG-${diagnosticTimestamp(now)}`;
    let storageInfo={usage:0,quota:0,persisted:false},history=[];
    try{storageInfo=await BlackwolfDB.storageInfo();}catch(error){recordDiagnosticError('diagnostic.storageInfo',error,'BW-DIAG-STORAGE');}
    try{history=(await BlackwolfDB.list()).map(compactHistoryRecord);}catch(error){recordDiagnosticError('diagnostic.history',error,'BW-DIAG-HISTORY');}
    const environment={
      packageId,generatedAt:now.toISOString(),appVersion:CONFIG.version,displayVersion:CONFIG.displayVersion,edition:CONFIG.edition,
      location:{protocol:location.protocol,host:location.host||null,path:location.pathname},
      browser:{userAgent:navigator.userAgent,platform:navigator.platform||null,language:navigator.language,languages:navigator.languages||[],online:navigator.onLine,hardwareConcurrency:navigator.hardwareConcurrency||null,deviceMemory:navigator.deviceMemory||null,maxTouchPoints:navigator.maxTouchPoints||0},
      screen:{width:screen.width,height:screen.height,availWidth:screen.availWidth,availHeight:screen.availHeight,pixelRatio:window.devicePixelRatio||1},
      timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||null,
      worker:{ready:state.workerReady,generation:state.workerGeneration,lastHeartbeat:state.workerLastHeartbeat,cachedRoles:[...state.workerCachedRoles],pendingJobs:state.workerJobs.size,activeJobId:state.activeWorkerJobId},
      workflow:{running:state.running,classifying:state.classifying,activePreview:state.activePreview,preflightOk:state.preflight?.ok??null,currentRunId:state.result?.runId||null},
      capacity:memoryCapacityAdvice(),
      storage:{usage:storageInfo.usage||0,quota:storageInfo.quota||0,persisted:!!storageInfo.persisted,retentionDays:CONFIG.retentionDays}
    };
    const outputMetadata=state.result?{
      runId:state.result.runId||null,names:diagnosticSafeValue(state.result.outputs?.names||{}),
      masterSize:state.result.outputs?.master?.size||0,issueSize:state.result.outputs?.issue?.size||0
    }:null;
    const diagnostic={
      packageId,generatedAt:now.toISOString(),privacyNotice:'แพ็กเกจนี้ไม่รวมข้อมูลแรงงาน รายการ Data, รหัสผ่าน, ไฟล์ Excel ต้นฉบับ หรือไฟล์ผลลัพธ์',
      environment,files:selectedFileMetadata(),preflight:diagnosticSafeValue(state.preflight),runSummary:diagnosticSafeValue(state.result?.summary||null),outputMetadata,
      errors:diagnosticSafeValue(state.diagnosticErrors),historyCount:history.length
    };
    const logText=$('#logBox')?.innerText?.trim()||'ไม่มี Run Log ในหน้าปัจจุบัน';
    const readme=[
      'BLACKWOLF Diagnostic Package',
      `Package ID: ${packageId}`,
      `Generated: ${now.toISOString()}`,
      '',
      'ไฟล์ภายใน:',
      '- diagnostic.json: สรุปสถานะระบบและ Error',
      '- environment.json: Browser / Worker / Storage',
      '- file-metadata.json: ชื่อและขนาดไฟล์ที่เลือก (ไม่มีเนื้อหาข้อมูล)',
      '- preflight.json: ผลตรวจโครงสร้างล่าสุด',
      '- run-summary.json: Summary ล่าสุดเท่านั้น',
      '- run-log.txt: Log ที่แสดงบนหน้าจอ',
      '- history-summary.json: Summary ของ Run History โดยไม่แนบ Workbook หรือข้อมูลรายแถว',
      '',
      'ส่ง ZIP นี้ให้ผู้ดูแลพร้อม Screenshot และบอกขั้นตอนก่อนเกิดปัญหา',
      'ข้อควรระวัง: แพ็กเกจไม่เก็บ Username/Password และไม่แนบไฟล์ Excel'
    ].join('\r\n');
    const zip=new JSZip();
    zip.file('README.txt',readme);
    zip.file('diagnostic.json',JSON.stringify(diagnostic,null,2));
    zip.file('environment.json',JSON.stringify(environment,null,2));
    zip.file('file-metadata.json',JSON.stringify(selectedFileMetadata(),null,2));
    zip.file('preflight.json',JSON.stringify(diagnosticSafeValue(state.preflight),null,2));
    zip.file('run-summary.json',JSON.stringify(diagnosticSafeValue(state.result?.summary||null),null,2));
    zip.file('run-log.txt',logText);
    zip.file('history-summary.json',JSON.stringify(history,null,2));
    const blob=await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:6}});
    downloadBlob(blob,`${packageId}.zip`);
    if(status)status.textContent=`สร้างสำเร็จ: ${packageId}`;
    toast('สร้าง Diagnostic ZIP สำเร็จ — ไม่มีข้อมูลแรงงานหรือรหัสผ่าน',5000);
  }catch(error){
    recordDiagnosticError('exportDiagnosticPackage',error,'BW-DIAG-EXPORT');
    if(status)status.textContent=`สร้างไม่สำเร็จ: ${error.message}`;
    toast(`สร้าง Diagnostic ZIP ไม่สำเร็จ: ${error.message}`,6500);
  }finally{if(button)button.disabled=false;}
}

// อธิบาย: ตรวจว่าไฟล์ที่ผู้ใช้ลากเข้ามาเป็น Master/Daily/Issue/M190/SM/Blacklist/Auto-Mail จากโครงสร้างจริง
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function detectFileRole(file){
  if(file.name.toLowerCase().endsWith('.txt'))return{role:'etl',message:'ไฟล์ข้อความ Auto-Mail 7.2'};
  let buffer=await file.arrayBuffer();
  if(state.workerReady){
    try{const result=await workerRequest('detect-file',{file:{name:file.name,buffer}},[buffer]);if(result.role)state.workerCachedRoles.add(result.role);return result;}
    catch(error){console.warn('Worker detection fallback',error);buffer=await file.arrayBuffer();}
  }
  const pseudo={name:file.name,arrayBuffer:async()=>buffer};
  const workbook=await BlackwolfEngine.readWorkbook(pseudo);
  return BlackwolfEngine.detectWorkbookRole(workbook,file.name);
}
// อธิบาย: รับไฟล์จาก input/drop แล้วจัดเข้า role ที่ถูกต้อง พร้อม cache workbook ที่อ่านแล้ว
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function loadFiles(fileList){
  if(state.classifying)return;
  state.classifying=true;
  setStatus('CLASSIFYING','running');
  let matched=0;
  try{
    for(const file of [...fileList]){
      if(file.name.toLowerCase().endsWith('.txt')){
        const content=await file.text();
        const input=$('#autoMail72Input');
        input.value=input.value.trim()?`${input.value.trim()}\n${content.trim()}`:content;
        state.files.etl=file;
        syncEtl(false);
        matched++;
        continue;
      }
      toast(`กำลังตรวจโครงสร้าง ${file.name}`,1600);
      const detection=await detectFileRole(file);
      if(!detection.role){toast(`จำแนกไฟล์ไม่ได้: ${file.name} — ${detection.message}`,6000);continue;}
      if(state.files[detection.role])toast(`แทนที่ ${display[detection.role]} ด้วย ${file.name}`,3500);
      state.files[detection.role]=file;
      matched++;
      await yieldUi(10);
    }
    if(matched){invalidate({resetWorker:false,clearWorkbooks:true});renderFiles();toast(`รับและจำแนกไฟล์จากโครงสร้างภายในแล้ว ${matched} รายการ`,4200);}
  }catch(error){recordDiagnosticError('loadFiles',error,'BW-FILE-READ');console.error(error);toast(`อ่านไฟล์ไม่สำเร็จ: ${error.message}`,6000);}
  finally{state.classifying=false;refreshReady();}
}
// อธิบาย: ล้างผล preflight/result เดิมเมื่อไฟล์หรือค่าเปลี่ยน เพื่อกันใช้ผลลัพธ์เก่า
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function invalidate({resetWorker=true,clearWorkbooks=true}={}){if(clearWorkbooks)state.workbooks={};state.preflight=null;$('#preflightResult').classList.add('hidden');$('#progressPanel').classList.add('hidden');if(resetWorker){state.workerCachedRoles.clear();try{state.worker?.postMessage({id:++state.workerSeq,type:'reset'});}catch{}}refreshReady();}
// อธิบาย: ประเมินความพร้อมด้าน memory/storage ของ Browser ก่อนรันไฟล์ใหญ่
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function memoryCapacityAdvice(){
  const total=roles.reduce((sum,role)=>sum+Number(state.files[role]?.size||0),0),deviceMemory=Number(navigator.deviceMemory||0);
  const advisoryLimit=deviceMemory&&deviceMemory<=4?250*1024**2:deviceMemory&&deviceMemory<=8?500*1024**2:750*1024**2;
  const level=total>advisoryLimit?'warn':total>advisoryLimit*.7?'watch':'ok';
  const ram=deviceMemory?`${deviceMemory} GB RAM profile`:'Browser ไม่รายงาน RAM';
  const text=total?`ไฟล์รวม ${bytes(total)} · ${ram} · ระดับทดสอบแนะนำไม่เกิน ${bytes(advisoryLimit)}`:`${ram} · ระบบใช้ Dense Workbook + Worker Cache เพื่อลดการอ่านซ้ำ`;
  return{total,deviceMemory,advisoryLimit,level,text};
}
// อธิบาย: แสดงคำแนะนำพื้นที่/หน่วยความจำบน UI
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function renderCapacityHint(){
  const element=$('#capacityHint');if(!element)return;
  const advice=memoryCapacityAdvice();element.className=`capacity-hint ${advice.level}`;
  $('strong',element).textContent=advice.level==='warn'?'ขนาดไฟล์สูงกว่าระดับทดสอบของเครื่องนี้':advice.level==='watch'?'ขนาดไฟล์เริ่มสูง — ปิดโปรแกรมอื่นก่อน Run':'ขนาดไฟล์อยู่ในระดับปกติ';
  $('small',element).textContent=advice.text;
}
// อธิบาย: วาดรายการไฟล์ที่แนบแล้วในหน้า Prepare
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function renderFiles(){
  const ready=requiredRoles.filter(role=>state.files[role]).length;
  $('#readyCount').textContent=`${ready}/4`;
  $('#fileChips').innerHTML=roles.map(role=>{
    const file=state.files[role],optional=!requiredRoles.includes(role);
    let emptyText=optional?'Optional — ไม่ได้เลือก':'Required — ยังไม่ได้เลือก';
    if(role==='etl')emptyText=state.etlText?'ใช้ข้อความ Auto-Mail 7.2 ด้านล่าง':'ไม่มีข้อมูลรอบนี้ — ETL เดิมใน ISSUE จะถูกล้าง';
    return`<div class="file-chip ${file?'ready':''} ${optional?'optional':''}"><strong>${esc(display[role])}</strong><small>${file?esc(file.name):emptyText}</small></div>`;
  }).join('');
  renderCapacityHint();refreshReady();
}
// อธิบาย: อ่าน/ซิงก์ข้อความ Auto-Mail 7.2 จาก textarea เข้าสู่ state
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function syncEtl(shouldInvalidate=true){
  state.etlText=$('#autoMail72Input').value;
  const parsed=BlackwolfEngine.parseEtl(state.etlText);
  $('#etlValid').textContent=fmt(parsed.valid);$('#etlInvalid').textContent=fmt(parsed.invalid);$('#etlDuplicate').textContent=fmt(parsed.duplicates);
  $('#autoMail72Input').classList.toggle('invalid',parsed.invalid>0);
  $('#etlHint').textContent=parsed.invalid?`พบรูปแบบผิด ${parsed.invalid} บรรทัด — ตรวจ ลำดับ.ProposalID:Policy:Group`:'รูปแบบ: ลำดับ.ProposalID:Policy:Group · Duplicate เก็บครบ';
  if(shouldInvalidate&&state.preflight)invalidate({resetWorker:false,clearWorkbooks:false});
  renderFiles();
}
// อธิบาย: ตรวจว่าไฟล์ขั้นต่ำครบหรือยัง เพื่อเปิด/ปิดปุ่ม Preflight/Run
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function refreshReady(){
  const ready=requiredRoles.every(role=>state.files[role]);
  $('#preflightBtn').disabled=!ready||state.running||state.classifying;
  $('#runBtn').disabled=!state.preflight?.ok||state.running||state.classifying;const cancel=$('#cancelRunBtn');if(cancel){cancel.classList.toggle('hidden',!state.running);cancel.disabled=!state.running||!state.workerReady;}
  const box=$('#inlineStatus');
  if(state.classifying){box.className='inline-status';box.innerHTML='<i></i><div><strong>กำลังจำแนกไฟล์</strong><small>ตรวจ Sheet และ Header ภายใน ไม่ใช้ชื่อไฟล์เป็นหลัก</small></div>';return;}
  if(state.running){box.className='inline-status';box.innerHTML='<i></i><div><strong>กำลังประมวลผล</strong><small>ทำงานใน Background Worker กรุณารอจนเสร็จ</small></div>';return;}
  if(state.preflight?.ok){box.className='inline-status ready';box.innerHTML='<i></i><div><strong>พร้อม Run</strong><small>จะสร้าง Master และเช็คสถานะ ISSUE ใหม่ 2 ไฟล์</small></div>';setStatus(state.result?'COMPLETED':'READY','success');return;}
  if(state.preflight&&!state.preflight.ok){box.className='inline-status error';box.innerHTML='<i></i><div><strong>พบปัญหาในไฟล์</strong><small>ตรวจรายละเอียด Preflight ด้านล่าง</small></div>';setStatus('CHECK FILES','error');return;}
  if(ready){box.className='inline-status';box.innerHTML='<i></i><div><strong>ไฟล์ Required ครบแล้ว</strong><small>กดตรวจสอบไฟล์ก่อน Run</small></div>';setStatus('FILES READY');return;}
  const missing=requiredRoles.filter(role=>!state.files[role]).length;
  box.className='inline-status';box.innerHTML=`<i></i><div><strong>รอไฟล์ ${missing} รายการ</strong><small>เลือก Required files ให้ครบ 4 รายการ</small></div>`;setStatus('WAITING');
}
// อธิบาย: อัปเดตแถบ progress และข้อความสถานะระหว่างรัน
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function progress(percent,message){
  $('#progressPanel').classList.remove('hidden');$('#progressPct').textContent=`${Math.round(percent)}%`;$('#progressBar').style.width=`${Math.max(0,Math.min(100,percent))}%`;$('#progressMessage').textContent=message;
  const now=Date.now(),log=$('#logBox');
  if(now-lastProgressAt<120&&log.lastElementChild){log.lastElementChild.textContent=`[${new Date().toLocaleTimeString('th-TH')}] ${message}`;return;}
  lastProgressAt=now;log.insertAdjacentHTML('beforeend',`<div>[${new Date().toLocaleTimeString('th-TH')}] ${esc(message)}</div>`);while(log.children.length>180)log.removeChild(log.firstElementChild);log.scrollTop=log.scrollHeight;
}

// อธิบาย: ล้าง timer timeout ของงาน worker ที่จบแล้วหรือถูกยกเลิก
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function clearWorkerJobTimer(job){if(job?.timer)clearTimeout(job.timer);}
// อธิบาย: ปฏิเสธ promise ที่รอ worker ทั้งหมดเมื่อ worker พัง/ถูก restart
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function rejectPendingWorkerJobs(error){
  for(const [id,job] of state.workerJobs){clearWorkerJobTimer(job);try{job.reject(error);}catch{}state.workerJobs.delete(id);}
  state.activeWorkerJobId=null;
}
// อธิบาย: ปิด worker เดิมและเคลียร์งานที่ค้าง เพื่อเริ่มใหม่แบบปลอดภัย
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function terminateWorker(error=appError('BW-WORKER-004','Worker restarted')){
  const worker=state.worker;state.worker=null;state.workerReady=false;state.workerCachedRoles.clear();state.workerLastHeartbeat=null;
  try{worker?.terminate();}catch{}
  rejectPendingWorkerJobs(error);
  const label=$('#engineReadyText');if(label)label.textContent='Worker stopped · Main-thread fallback ready';
}
// อธิบาย: ตั้ง timeout ให้ job ใน worker เพื่อกันงานค้างเงียบ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function armWorkerTimeout(id){
  const job=state.workerJobs.get(id);if(!job)return;clearWorkerJobTimer(job);
  job.timer=setTimeout(()=>{
    if(!state.workerJobs.has(id))return;
    const error=appError('BW-WORKER-002',`Worker ไม่ตอบสนองเกิน ${Math.round(job.timeoutMs/60000)} นาที (${job.type})`);
    recordDiagnosticError('worker.inactivityTimeout',error,error.code);terminateWorker(error);
    if(!state.cancelRequested)initWorker().catch(()=>{});
  },job.timeoutMs);
}
// อธิบาย: ต่ออายุ timeout เมื่อ worker ส่ง heartbeat/progress กลับมา
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function touchWorkerJob(id,heartbeat=null){
  const job=state.workerJobs.get(id);if(!job)return;
  job.lastActivity=Date.now();if(heartbeat){state.workerLastHeartbeat=heartbeat.timestamp||new Date().toISOString();}
  armWorkerTimeout(id);
}
// อธิบาย: สร้าง Web Worker และลง listener รับข้อความ result/progress/error
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function initWorker(){
  try{
    if(state.worker)terminateWorker(appError('BW-WORKER-004','เริ่ม Worker รุ่นใหม่'));
    const worker=new Worker('worker.js?v=3.5.8');state.worker=worker;state.workerGeneration++;
    worker.onmessage=event=>{
      const message=event.data||{},job=state.workerJobs.get(message.id);if(!job)return;
      if(message.type==='heartbeat'){touchWorkerJob(message.id,message.heartbeat);return;}
      if(message.type==='progress'){touchWorkerJob(message.id);job.onProgress?.(message.progress);return;}
      clearWorkerJobTimer(job);state.workerJobs.delete(message.id);if(state.activeWorkerJobId===message.id)state.activeWorkerJobId=null;
      if(message.type==='done')job.resolve(message.result);
      else{const detail=message.error||{};job.reject(appError(detail.code||'BW-WORKER-001',detail.message||'Worker error'));}
    };
    worker.onerror=event=>{
      const error=appError('BW-WORKER-001',event?.message||'Worker crashed');recordDiagnosticError('worker.onerror',error,error.code);
      terminateWorker(error);if(!state.cancelRequested)initWorker().catch(()=>{});
    };
    const result=await workerRequest('ping',{},[],null,{allowNotReady:true,timeoutMs:4500});
    state.workerReady=true;$('#engineReadyText').textContent=`Browser Worker Engine Ready · ${result.version||CONFIG.version} · G${state.workerGeneration}`;return true;
  }catch(error){console.warn(error);terminateWorker(error?.code?error:appError('BW-WORKER-001','Worker unavailable',error));$('#engineReadyText').textContent='Main-thread fallback ready';return false;}
}
// อธิบาย: ส่งคำสั่งไป worker พร้อมรอ promise ตอบกลับ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function workerRequest(type,payload={},transfer=[],onProgress,options={}){
  return new Promise((resolve,reject)=>{
    if(!state.worker||(!state.workerReady&&!options.allowNotReady)){reject(appError('BW-WORKER-001','Worker unavailable'));return;}
    const id=++state.workerSeq,timeoutMs=options.timeoutMs||WORKER_INACTIVITY_TIMEOUTS[type]||600000;
    state.workerJobs.set(id,{resolve,reject,onProgress,type,timeoutMs,lastActivity:Date.now(),timer:null});state.activeWorkerJobId=id;armWorkerTimeout(id);
    try{state.worker.postMessage({id,type,...payload},transfer);}catch(error){const job=state.workerJobs.get(id);clearWorkerJobTimer(job);state.workerJobs.delete(id);state.activeWorkerJobId=null;reject(appError('BW-WORKER-007','ส่งงานเข้า Worker ไม่สำเร็จ',error));}
  });
}
// อธิบาย: restart worker แบบโปรแกรมสั่งหรือผู้ใช้สั่ง
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function restartWorkerEngine({manual=false}={}){
  if(state.running&&!manual) return false;
  terminateWorker(appError('BW-WORKER-004','Worker restarted'));
  state.preflight=null;$('#preflightResult')?.classList.add('hidden');refreshReady();
  const ok=await initWorker();await refreshSystemStatus();return ok;
}
// อธิบาย: ปุ่มผู้ใช้สำหรับ restart engine เมื่อสงสัยว่า worker ค้าง
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function manualRestartWorker(){
  if(state.running){toast('กำลัง Run อยู่ กรุณากด Cancel Run ก่อน',4500);return;}
  const button=$('#restartWorkerBtn');if(button)button.disabled=true;setStatus('RESTARTING','running');
  const ok=await restartWorkerEngine({manual:true});toast(ok?'Restart Worker สำเร็จ — กรุณากด Preflight ใหม่':'Restart Worker ไม่สำเร็จ ระบบจะใช้ Fallback Mode',5000);refreshReady();if(button)button.disabled=false;
}
// อธิบาย: ยกเลิกงานที่กำลังรันและคืน UI ให้พร้อมใช้งาน
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function cancelActiveRun(){
  if(!state.running)return;
  if(!state.workerReady){toast('Fallback Mode ไม่สามารถหยุดงานกลางคันได้ กรุณารอให้จบหรือปิดแท็บ',5500);return;}
  const ok=await confirmAction('ยกเลิกการ Run','หยุด Worker ทันทีและล้าง Cache ของรอบนี้หรือไม่? ไฟล์ต้นฉบับและ Run History เดิมจะไม่ถูกลบ และต้องกด Preflight ใหม่');if(!ok)return;
  state.cancelRequested=true;const error=appError('BW-WORKER-003','ผู้ใช้ยกเลิกการ Run');terminateWorker(error);state.preflight=null;$('#preflightResult')?.classList.add('hidden');progress(100,`CANCELLED: ${errorText(error)}`);setStatus('CANCELLED','error');
  await initWorker();state.cancelRequested=false;refreshReady();toast('ยกเลิก Run แล้ว · Worker เริ่มใหม่ · กรุณากด Preflight ใหม่',5500);
}
// อธิบาย: เตรียมไฟล์/ArrayBuffer เพื่อส่งเข้า worker แบบ transfer ได้
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function prepareWorkerFiles(){
  const selected=roles.filter(role=>role!=='etl'&&state.files[role]);
  await workerRequest('reset');state.workerCachedRoles.clear();
  for(let index=0;index<selected.length;index++){
    const role=selected[index],file=state.files[role],base=3+Math.round(index/Math.max(1,selected.length)*65);
    progress(base,`กำลังส่ง ${display[role]} เข้า Worker (${bytes(file.size)})`);
    const buffer=await file.arrayBuffer();
    await workerRequest('load-file',{file:{role,name:file.name,buffer}},[buffer],update=>progress(Math.min(72,base+Math.round((update.pct||0)/100*9)),update.message));
    state.workerCachedRoles.add(role);await yieldUi(0);
  }
}
// อธิบาย: ย่อผลลัพธ์ที่ใหญ่มากเพื่อเก็บใน state/UI โดยยังคง summary สำคัญ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function compactResultForUi(result){const limit=2000,all=result.rows||[],rows=all.slice(0,limit),duplicateSummary=BlackwolfEngine.internals.analyzeAlienDuplicates(all);return{...result,summary:{...result.summary,AlienDuplicateCodeCount:duplicateSummary.duplicateCodeCount,AlienDuplicateRowCount:duplicateSummary.duplicateRowCount,WebPreviewRows:rows.length,WebPreviewTruncated:all.length>limit},rows,duplicateSummary,context:{smIds:(result.context?.smIds||[]).slice(0,limit),blIds:(result.context?.blIds||[]).slice(0,limit)}};}
// อธิบาย: ตรวจและเตรียมไฟล์ก่อนเรียก worker
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function ensureWorkerFiles(){
  const selected=roles.filter(role=>role!=='etl'&&state.files[role]);
  if(selected.every(role=>state.workerCachedRoles.has(role))){progress(70,'ใช้ Workbook Cache จากขั้นตอนจำแนกไฟล์ ไม่อ่านไฟล์ขนาดใหญ่ซ้ำ');return;}
  await prepareWorkerFiles();
}
// อธิบาย: แกนหลักของการ preflight ใช้ตรวจไฟล์และข้อมูลก่อนรันจริง
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function mainPreflight(){
  const workbooks={},selected=roles.filter(role=>role!=='etl'&&state.files[role]);
  for(let index=0;index<selected.length;index++){
    const role=selected[index];progress(10+Math.round(index/Math.max(1,selected.length)*60),`กำลังอ่าน ${display[role]} — Fallback Mode`);await yieldUi(20);workbooks[role]=await BlackwolfEngine.readWorkbook(state.files[role],role==='master');await yieldUi(20);
  }
  state.workbooks=workbooks;progress(78,'กำลังตรวจ Sheet, Header และ Date คอลัมน์ T — Fallback Mode');
  return BlackwolfEngine.preflight(workbooks,state.files,state.etlText,manualStartDate());
}
// อธิบาย: ปุ่ม Preflight: เรียกตรวจไฟล์แล้ว render ผลบนหน้าจอ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function runPreflight(){
  const parsed=BlackwolfEngine.parseEtl(state.etlText);if(parsed.invalid){toast(`Auto-Mail 7.2 ผิดรูปแบบ ${parsed.invalid} บรรทัด`,5000);return;}
  const button=$('#preflightBtn');button.disabled=true;button.textContent='กำลังตรวจสอบ...';setStatus('VALIDATING','running');$('#logBox').innerHTML='';progress(1,state.workerReady?'เริ่มตรวจสอบด้วย Background Worker':'เริ่มตรวจสอบแบบ Fallback');
  try{
    let result;
    if(state.workerReady){await ensureWorkerFiles();result=await workerRequest('validate',{etlText:state.etlText,manualStartDate:manualStartDate()},[],update=>progress(update.pct,update.message));}
    else result=await mainPreflight();
    state.preflight=result;
    const box=$('#preflightResult');
    box.innerHTML=`<h3>${result.ok?'✓ Preflight ผ่าน':'! Preflight ไม่ผ่าน'}</h3><div class="validation-files">${result.results.map(item=>`<div class="validation-file ${item.ok?'':'fail'}"><div><strong>${esc(display[item.field]||item.field)} — ${esc(item.name)}</strong><small>${esc(item.message)}</small></div><b>${item.ok?'PASS':'FAIL'}</b></div>`).join('')}</div>`;
    box.classList.remove('hidden');progress(100,result.ok?'Preflight ผ่าน พร้อม Run':'Preflight ไม่ผ่าน');refreshReady();toast(result.ok?'Preflight ผ่าน พร้อม Run':'Preflight ไม่ผ่าน กรุณาตรวจไฟล์หรือวันเริ่มต้น',4500);
  }catch(error){recordDiagnosticError('runPreflight',error,'BW-PREFLIGHT');state.preflight={ok:false};refreshReady();toast(errorText(error),5500);console.error(error);}
  finally{button.textContent='✓ ตรวจสอบไฟล์';button.disabled=!requiredRoles.every(role=>state.files[role]);}
}
// อธิบาย: ปุ่ม Run: ส่งงานเข้า engine, รับผลลัพธ์, บันทึก history และ render dashboard/results
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function runWorkflow(){
  if(!state.preflight?.ok||state.running)return;
  state.running=true;refreshReady();setStatus('RUNNING','running');$('#logBox').innerHTML='';progress(1,'เริ่ม BLACKWOLF V3.5.8 Hardened Workflow');
  try{
    let result;
    if(state.workerReady){
      const raw=await workerRequest('run',{etlText:state.etlText,manualStartDate:manualStartDate(),today:new Date().toISOString()},[],update=>progress(update.pct,update.message));
      result={runId:raw.runId,summary:raw.summary,rows:raw.rows,duplicateSummary:raw.duplicateSummary,context:raw.context,outputs:{master:new Blob([raw.masterBuffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),issue:new Blob([raw.issueBuffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),names:raw.names}};
    }else{
      result=compactResultForUi(await BlackwolfEngine.run({workbooks:state.workbooks,etlText:state.etlText,manualStartDate:manualStartDate(),today:new Date(),onProgress:progress}));
    }
    state.result=result;$('#currentRunLabel').textContent=result.runId;await saveRunRecord(result);setStatus('COMPLETED','success');$('#previewMode').textContent=`RUN ${result.runId}`;renderPreview(state.activePreview);renderDashboard();renderResults();renderReport();toast(`Run สำเร็จ: ${fmt(result.summary.TotalPolicies)} กรมธรรม์ · สร้างไฟล์หลัก 2 ไฟล์`,5000);setTimeout(()=>setPage('results'),350);
  }catch(error){const code=error?.code||'BW-RUN-001';recordDiagnosticError('runWorkflow',error,code);console.error(error);if(code==='BW-WORKER-003'){progress(100,`CANCELLED: ${errorText(error)}`);setStatus('CANCELLED','error');}else{progress(100,`ERROR: ${errorText(error)}`);setStatus('ERROR','error');toast(errorText(error),6500);}}
  finally{state.running=false;refreshReady();}
}
// อธิบาย: บันทึกผลการรันลง IndexedDB พร้อมวันหมดอายุ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function saveRunRecord(result){
  try{
    const createdAt=new Date().toISOString(),expiresAt=new Date(Date.now()+RETENTION_MS).toISOString();
    await BlackwolfDB.put({id:result.runId,displayName:`BLACKWOLF ${CONFIG.displayVersion} · Master + ISSUE`,status:'completed',message:'ประมวลผลสำเร็จ เก็บใน Browser ชั่วคราว 4 วัน',createdAt,expiresAt,summary:result.summary,rows:result.rows,duplicateSummary:result.duplicateSummary||null,context:result.context,masterWorkbook:result.outputs.master,issueWorkbook:result.outputs.issue,outputNames:result.outputs.names});
    await BlackwolfDB.pruneExpired();
  }catch(error){recordDiagnosticError('saveRunRecord',error,'BW-HISTORY-SAVE');console.warn(error);toast(`Run สำเร็จ แต่จัดเก็บ History ไม่ได้: ${error.message}`,6000);}
}
// อธิบาย: ดาวน์โหลด Blob เป็นไฟล์ด้วย temporary object URL
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function downloadBlob(blob,name){if(!blob){toast('ไม่พบไฟล์สำหรับดาวน์โหลด',4500);return;}const url=URL.createObjectURL(blob),anchor=document.createElement('a');anchor.href=url;anchor.download=name;document.body.appendChild(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),2500);toast(`ดาวน์โหลด ${name}`);}
// อธิบาย: ดาวน์โหลดไฟล์ Master ที่สร้างจากผล run ล่าสุด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function downloadMaster(){if(!state.result)return toast('ยังไม่มีผลลัพธ์');downloadBlob(state.result.outputs.master,state.result.outputs.names.master);}
// อธิบาย: ดาวน์โหลดไฟล์ ISSUE ที่สร้างจากผล run ล่าสุด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function downloadIssue(){if(!state.result)return toast('ยังไม่มีผลลัพธ์');downloadBlob(state.result.outputs.issue,state.result.outputs.names.issue);}

// อธิบาย: วาด KPI และกราฟสรุปสำหรับผู้บริหาร
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function renderDashboard(){
  const summary=state.result?.summary;if(!summary)return;
  $('#dashboardSubtitle').textContent=`Run ${summary.RunId} · ${summary.DateStart} ถึง ${summary.DateEnd} · ${summary.TotalPolicies} policies`;
  $('#kpiPending').textContent=fmt(summary.PendingPolicies);$('#kpiIncomplete').textContent=fmt(summary.IncompletePolicies);$('#kpiMenuE').textContent=fmt(summary.MenuEPolicies);$('#kpiBlacklist').textContent=fmt(summary.BlacklistPolicies);$('#kpiPremium').textContent=money(summary.TotalPremium);
  renderBars('#statusChart',[['รอ Issue',summary.PendingPolicies],['ข้อมูลไม่สมบูรณ์',summary.IncompletePolicies],['Menu E',summary.MenuEPolicies],['Blacklist',summary.BlacklistPolicies]]);
  renderBars('#agingChart',[['1 - 7 วัน',summary.Age_1_7],['8 - 15 วัน',summary.Age_8_15],['16 - 30 วัน',summary.Age_16_30],['มากกว่า 30 วัน',summary.Age_Over_30]]);
  const reconciliation=[['Master Carry Forward',summary.MasterRowsCarriedForward,'rows'],['Daily เพิ่มใหม่',summary.DailyRowsAddedToBacklog,'rows'],['M190 รอบปัจจุบัน',summary.M190RawRows,'rows'],['Auto-Mail รอบปัจจุบัน',summary.AutoMailRawRows,'rows'],['ลบออกกรมธรรม์แล้ว',summary.IssuedRowsRemoved,'rows'],['Pending Output',summary.PendingRowsWrittenToData,'rows']];
  $('#reconGrid').innerHTML=reconciliation.map(item=>`<div class="recon-item"><span>${esc(item[0])}</span><strong>${fmt(item[1])}</strong><small>${esc(item[2])}</small></div>`).join('');
}
// อธิบาย: วาด bar chart แบบง่ายจากข้อมูล label/value
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function renderBars(selector,items){const max=Math.max(1,...items.map(item=>Number(item[1]||0)));$(selector).innerHTML=items.map(([label,value])=>`<div class="bar-row"><span>${esc(label)}</span><i><b style="width:${Math.max(2,Number(value||0)/max*100)}%"></b></i><strong>${fmt(value)}</strong></div>`).join('');}
// อธิบาย: แปลงสถานะของ row เป็น class สีสำหรับตารางผลลัพธ์
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function resultStatusClass(status){
  const value=String(status||'').toLowerCase();
  if(value.includes('ไม่สมบูรณ์'))return'status-incomplete';
  if(value.includes('issue'))return'status-issue';
  if(value.includes('black'))return'status-blacklist';
  if(value.includes('menu')||value.includes('เมนู'))return'status-menu';
  return'status-default';
}
// อธิบาย: เช็คว่า row ตรงกับ filter ช่วงอายุที่เลือกหรือไม่
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function matchesAgingFilter(row,filter){
  if(!filter)return true;
  const days=Number(row?.AgingDays);
  if(!Number.isFinite(days))return false;
  if(filter==='1-7')return days>=1&&days<=7;
  if(filter==='8-15')return days>=8&&days<=15;
  if(filter==='16-30')return days>=16&&days<=30;
  if(filter==='31+')return days>30;
  return true;
}
// อธิบาย: อัปเดต dropdown/filter ผลลัพธ์ให้สัมพันธ์กับข้อมูลจริง
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function syncResultFilters(rows){
  const select=$('#tableStatusFilter');if(!select)return;
  const current=select.value;
  const statuses=[...new Set(rows.map(row=>String(row.PendingStatus||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'th'));
  select.innerHTML='<option value="">ทุกสถานะ</option>'+statuses.map(status=>`<option value="${esc(status)}">${esc(status)}</option>`).join('');
  if(statuses.includes(current))select.value=current;
}
// อธิบาย: normalize alienCode เพื่อค้นหา/เทียบซ้ำแบบไม่ติดช่องว่างหรือ case
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function normalizeAlienCode(value){return String(value??'').normalize('NFKC').replace(/\s+/g,'').trim().toUpperCase();}
// อธิบาย: วาดตัวเลข summary ในหน้า results
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function renderResultStats(rows){
  const incomplete=rows.filter(row=>String(row.PendingStatus||'').includes('ข้อมูลไม่สมบูรณ์')).length,ready=Math.max(0,rows.length-incomplete);
  const full=state.result?.duplicateSummary||BlackwolfEngine.internals.analyzeAlienDuplicates(rows),codes=new Map((full.codes||[]).map(item=>[normalizeAlienCode(item.alienCode),Number(item.count||0)]));
  const duplicates={codes,duplicateCodes:Number(full.duplicateCodeCount||0),duplicateRows:Number(full.duplicateRowCount||0),list:full.codes||[]};
  const stats=[['ทั้งหมด',state.result?.summary?.TotalRows??rows.length,'รายการ'],['ข้อมูลไม่สมบูรณ์',state.result?.summary?.IncompletePolicies??incomplete,'รายการ'],['พร้อมตรวจสอบ',Math.max(0,(state.result?.summary?.TotalRows??rows.length)-(state.result?.summary?.IncompletePolicies??incomplete)),'รายการ']];
  const container=$('#resultDetailStats');if(!container)return duplicates;
  [...container.children].forEach((card,index)=>{const stat=stats[index];if(!stat)return;$('span',card).textContent=stat[0];$('strong',card).textContent=fmt(stat[1]);$('small',card).textContent=stat[2];});
  const duplicateCard=$('.duplicate-alien-stat',container),alertBox=$('#alienDuplicateAlert');
  if(duplicateCard){$('strong',duplicateCard).textContent=fmt(duplicates.duplicateCodes);$('small',duplicateCard).textContent=`${fmt(duplicates.duplicateRows)} รายการ · ตรวจจากข้อมูลทั้งหมด`;}
  if(alertBox){const preview=duplicates.list.slice(0,12).map(item=>`${item.alienCode} (${fmt(item.count)})`).join(', '),more=duplicates.list.length>12?` และอีก ${fmt(duplicates.list.length-12)} รหัส`:'';alertBox.classList.toggle('hidden',duplicates.duplicateCodes===0);alertBox.textContent=duplicates.duplicateCodes?`พบ alienCode ซ้ำ ${fmt(duplicates.duplicateCodes)} รหัส รวม ${fmt(duplicates.duplicateRows)} รายการ จากข้อมูลทั้งหมด · ${preview}${more}`:'';alertBox.title=duplicates.list.map(item=>`${item.alienCode} (${item.count})`).join('\n');}
  return duplicates;
}
// อธิบาย: จัดการวาดหน้าผลลัพธ์ทั้งหมด ทั้ง stats, table และ detail
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function renderResults(){
  const result=state.result;$('#resultEmpty').classList.toggle('hidden',!!result);$('#resultContent').classList.toggle('hidden',!result);if(!result)return;
  const summary=result.summary;$('#resultSummary').innerHTML=[['Run ID',summary.RunId],['Date Range',`${summary.DateStart} → ${summary.DateEnd}`],['Pending Policies',fmt(summary.TotalPolicies)],['Total Premium',money(summary.TotalPremium)],['Master Output',result.outputs.names.master],['ISSUE Output',result.outputs.names.issue]].map(item=>`<div class="summary-box"><span>${esc(item[0])}</span><strong>${esc(item[1])}</strong></div>`).join('');
  selectedDetailIndex=null;syncResultFilters(result.rows||[]);renderTable();
}
// อธิบาย: วาดตารางรายการค้าง/ผลลัพธ์หลัก
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function renderTable(){
  const allRows=state.result?.rows||[],query=($('#tableSearch')?.value||'').trim().toLowerCase(),statusFilter=$('#tableStatusFilter')?.value||'',agingFilter=$('#tableAgingFilter')?.value||'';
  const duplicateInfo=renderResultStats(allRows);
  const filtered=allRows.map((row,index)=>({row,index})).filter(item=>{
    const haystack=[item.row.ProposalID,item.row.Policy,item.row.alienCode,item.row.PendingStatus,item.row.AgencyName,item.row.CreateDate,item.row.TotalPremium].join(' ').toLowerCase();
    return(!query||haystack.includes(query))&&(!statusFilter||String(item.row.PendingStatus||'')===statusFilter)&&matchesAgingFilter(item.row,agingFilter);
  });
  const visible=filtered.slice(0,200),body=$('#resultTable');
  $('#visibleResultCount').textContent=`แสดง ${fmt(visible.length)} จาก ${fmt(filtered.length)} รายการ${filtered.length>200?' · จำกัดบนจอ 200':''}`;
  body.innerHTML=visible.map(item=>{const row=item.row,date=row.CreateDate?BlackwolfEngine.normalize.dateKey(new Date(row.CreateDate)):'-',alienKey=normalizeAlienCode(row.alienCode),duplicateCount=duplicateInfo?.codes?.get(alienKey)||0,duplicateClass=duplicateCount>1?' duplicate-alien-row':'',alienClass=duplicateCount>1?' class="duplicate-alien-cell"':'',alienTitle=duplicateCount>1?` title="คำเตือน: alienCode ${esc(alienKey)} ซ้ำทั้งหมด ${fmt(duplicateCount)} รายการ"`:'';return`<tr data-row-index="${item.index}" class="${selectedDetailIndex===item.index?'selected':''}${duplicateClass}"><td><strong>${esc(row.ProposalID)}</strong></td><td>${esc(row.Policy)}</td><td${alienClass}${alienTitle}><strong>${esc(row.alienCode||'-')}</strong></td><td>${esc(date)}</td><td class="premium-cell">${money(row.TotalPremium)}</td><td><span class="status-pill ${resultStatusClass(row.PendingStatus)}">${esc(row.PendingStatus||'ไม่ระบุ')}</span></td><td class="aging-cell">${row.AgingDays===null||row.AgingDays===undefined?'-':`${fmt(row.AgingDays)} วัน`}</td></tr>`;}).join('')||'<tr><td colspan="7" class="empty-row">ไม่พบรายการตามเงื่อนไข</td></tr>';
  $$('tr[data-row-index]',body).forEach(element=>element.addEventListener('click',()=>showResultDetail(Number(element.dataset.rowIndex))));
  if(selectedDetailIndex!==null&&allRows[selectedDetailIndex])showResultDetail(selectedDetailIndex,false);else renderEmptyResultDetail();
}
// อธิบาย: แสดง panel ว่างเมื่อยังไม่ได้เลือก row
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function renderEmptyResultDetail(){
  const drawer=$('#resultDetailDrawer');if(!drawer)return;
  drawer.innerHTML='<div class="detail-drawer-empty"><span>▤</span><strong>เลือกรายการเพื่อดูรายละเอียด</strong><small>คลิกแถวข้อมูลทางซ้าย ระบบจะแสดงรายละเอียดข้อมูลที่นี่</small></div>';
}
// อธิบาย: แสดงรายละเอียด row ที่ผู้ใช้เลือกจากตาราง
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function showResultDetail(index,updateSelection=true){
  const rows=state.result?.rows||[],row=rows[index];if(!row)return;
  selectedDetailIndex=index;
  if(updateSelection)$$('#resultTable tr[data-row-index]').forEach(element=>element.classList.toggle('selected',Number(element.dataset.rowIndex)===index));
  const date=row.CreateDate?BlackwolfEngine.normalize.dateKey(new Date(row.CreateDate)):'-';
  const fields=[['ProposalID',row.ProposalID],['Policy',row.Policy],['alienCode',row.alienCode||'-'],['CreateDate',date],['Premium',`${money(row.TotalPremium)} บาท`],['Status',row.PendingStatus||'ไม่ระบุ'],['Aging',row.AgingDays===null||row.AgingDays===undefined?'-':`${fmt(row.AgingDays)} วัน`],['Agency',row.AgencyName||'-'],['Run ID',state.result?.runId||state.result?.summary?.RunId||'-']];
  $('#resultDetailDrawer').innerHTML=`<div class="drawer-header"><div><span>RECORD DETAIL</span><h4>รายละเอียดรายการ</h4></div></div><div class="drawer-fields">${fields.map(([label,value])=>`<div class="drawer-field"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join('')}</div>`;
}

// อธิบาย: วาด Executive Report จาก summary ล่าสุด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function renderReport(){
  const summary=state.result?.summary;$('#reportEmpty').classList.toggle('hidden',!!summary);$('#reportSheet').classList.toggle('hidden',!summary);if(!summary)return;
  const total=Number(summary.TotalPolicies||0),pending=Number(summary.PendingPolicies||0),incomplete=Number(summary.IncompletePolicies||0),menuE=Number(summary.MenuEPolicies||0),blacklist=Number(summary.BlacklistPolicies||0),overdue=Number(summary.Age_8_15||0)+Number(summary.Age_16_30||0)+Number(summary.Age_Over_30||0),urgent=incomplete+menuE+blacklist;
  $('#reportProcessed').textContent=summary.ProcessedAt||'-';$('#reportDateRange').textContent=`${summary.DateStart} ถึง ${summary.DateEnd}`;$('#reportValidation').textContent=summary.ValidationStatus||'PASSED';$('#reportPolicies').textContent=fmt(total);$('#reportPending').textContent=fmt(pending);$('#reportIncomplete').textContent=fmt(incomplete);$('#reportMenuE').textContent=fmt(menuE);$('#reportBlacklist').textContent=fmt(blacklist);$('#reportPremium').textContent=`${money(summary.TotalPremium)} บาท`;$('#reportDateRangeSummary').textContent=`${summary.DateStart} ถึง ${summary.DateEnd}`;$('#reportPoliciesSummary').textContent=`${fmt(total)} กรมธรรม์`;$('#reportOverdue').textContent=fmt(overdue);$('#reportUrgent').textContent=`${fmt(urgent)} กรมธรรม์`;$('#reportPremiumSummary').textContent=`${money(summary.TotalPremium)} บาท`;
  [summary.Age_1_7,summary.Age_8_15,summary.Age_16_30,summary.Age_Over_30].forEach((value,index)=>{const count=Number(value||0),percent=total?count/total*100:0;$('#reportAge'+(index+1)).textContent=fmt(count);$('#reportAge'+(index+1)+'Bar').style.width=`${percent}%`;$('#reportAge'+(index+1)+'Pct').textContent=`${percent.toFixed(0)}%`;});
  $('#reportPendingCard').textContent=fmt(pending);$('#reportIncompleteCard').textContent=fmt(incomplete);$('#reportMenuECard').textContent=fmt(menuE);$('#reportBlacklistCard').textContent=fmt(blacklist);$('#reportExecutiveNote').textContent=`มีกรมธรรม์คงเหลือ ${fmt(total)} รายการ มูลค่า ${money(summary.TotalPremium)} บาท`;
  const statusRows=[['รอ Issue',pending,'ดำเนินการตามคิว'],['ข้อมูลไม่สมบูรณ์',incomplete,'ติดตามข้อมูลเพิ่ม'],['ติดปัญหาไม่เข้าในเมนู E',menuE,'เร่งตรวจสอบระบบ'],['Blacklist',blacklist,'ตรวจสอบกรณีพิเศษ']].filter(row=>row[1]>0);
  $('#reportStatusBody').innerHTML=statusRows.map(([name,count,action])=>`<tr><td>${esc(name)}</td><td>${fmt(count)}</td><td>${total?(count/total*100).toFixed(2):'0.00'}%</td><td>${esc(action)}</td></tr>`).join('')||'<tr><td colspan="4">ไม่มีรายการคงเหลือ</td></tr>';
  $('#reportDailyRows').textContent=fmt(summary.DailyRowsAfterDateStatusFilter);$('#reportM190').textContent=fmt(summary.M190RawRows);$('#reportAutoMail72').textContent=fmt(summary.AutoMailRawRows);$('#reportIssuedRemoved').textContent=fmt(summary.IssuedRowsRemoved);$('#reportPendingWritten').textContent=fmt(summary.PendingRowsWrittenToData);$('#reportIssueDataRows').textContent=fmt(summary.DailyRowsAfterDateStatusFilter);$('#reportRunId').textContent=summary.RunId||state.result.runId;
}
// อธิบาย: จับภาพ report panel ด้วย html2canvas
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function captureReport(){
  const report=$('#reportSheet');if(report.classList.contains('hidden'))throw new Error('ยังไม่มีรายงาน');if(typeof window.html2canvas!=='function')throw new Error('โมดูลบันทึกรูปภาพไม่พร้อมใช้งาน');if(document.fonts?.ready)await document.fonts.ready;
  const rect=report.getBoundingClientRect(),width=Math.ceil(Math.max(report.scrollWidth,rect.width)),height=Math.ceil(Math.max(report.scrollHeight,rect.height)),scale=Math.min(2,Math.max(1,Math.sqrt(24000000/Math.max(1,width*height))));
  return window.html2canvas(report,{backgroundColor:'#ffffff',scale,useCORS:true,allowTaint:false,logging:false,removeContainer:true,width,height,windowWidth:Math.max(document.documentElement.clientWidth,width),windowHeight:Math.max(document.documentElement.clientHeight,height),scrollX:0,scrollY:0,onclone:clonedDocument=>{clonedDocument.body.classList.remove('dark');const cloned=clonedDocument.getElementById('reportSheet');if(cloned){cloned.classList.remove('hidden');cloned.style.margin='0';cloned.style.boxShadow='none';cloned.style.width=`${width}px`;cloned.style.maxWidth='none';}}});
}
// อธิบาย: ดาวน์โหลดรูปภาพรายงานผู้บริหารเป็น PNG
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function saveReportImage(){
  const button=$('#saveReportImageBtn'),old=button.textContent;button.disabled=true;button.textContent='กำลังสร้างรูป...';
  try{
    const canvas=await captureReport(),blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('สร้างไฟล์ PNG ไม่สำเร็จ')),'image/png',1));
    const requested=state.result?.outputs?.names?.report||`Report_${BlackwolfEngine.normalize.dateKey(new Date())}.png`,name=/\.png$/i.test(requested)?requested:requested.replace(/\.[^.]+$/,'')+'.png';
    downloadBlob(blob,name);toast('บันทึกรายงานเป็น PNG สำเร็จ');
  }catch(error){recordDiagnosticError('saveReportImage',error,'BW-REPORT-IMAGE');console.error(error);toast(`บันทึกรูปภาพไม่สำเร็จ: ${error.message}`,6000);}finally{button.disabled=false;button.textContent=old;}
}

// อธิบาย: แสดงวันที่ใน Run History แบบ yyyy-mm-dd
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function formatHistoryDate(value){const date=new Date(value);return Number.isNaN(date.getTime())?'-':date.toLocaleDateString('en-CA');}
// อธิบาย: แสดงเวลาใน Run History แบบ HH:mm:ss
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function formatHistoryTime(value){const date=new Date(value);return Number.isNaN(date.getTime())?'-':date.toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit',second:'2-digit'});}
// อธิบาย: คำนวณเวลานับถอยหลังก่อน Run History ถูกลบ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function formatCountdown(expiresAt){const total=Math.max(0,Math.floor((new Date(expiresAt)-Date.now())/1000));if(total<=0)return'ครบกำหนดลบ';const days=Math.floor(total/86400),hours=Math.floor(total%86400/3600),minutes=Math.floor(total%3600/60);if(days>0)return`เหลือ ${days} วัน ${hours} ชม.`;if(hours>0)return`เหลือ ${hours} ชม. ${minutes} นาที`;return`เหลือ ${Math.max(1,minutes)} นาที`;}
// อธิบาย: โหลดและวาด Run History จาก IndexedDB
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function renderHistory(){
  try{
    await BlackwolfDB.pruneExpired();const list=await BlackwolfDB.list();
    $('#historyList').innerHTML=list.length?list.map(record=>`<div class="history-item" data-id="${esc(record.id)}"><div class="history-created"><strong>${esc(formatHistoryDate(record.createdAt))}</strong><small>${esc(formatHistoryTime(record.createdAt))}</small></div><div class="history-run-main"><strong>${esc(record.displayName||`BLACKWOLF ${CONFIG.displayVersion}`)}</strong><small>${esc(record.message||'ประมวลผลสำเร็จ')}</small><em>Run ID: ${esc(record.id)}</em></div><b class="history-status">เสร็จสมบูรณ์</b><span class="history-policy-count">${fmt(record.summary?.TotalPolicies||0)} กรมธรรม์</span><span class="history-retention-countdown" data-expires-at="${esc(record.expiresAt)}">${esc(formatCountdown(record.expiresAt))}</span><button class="history-delete-btn" data-delete="${esc(record.id)}">ลบ</button></div>`).join(''):'<div class="empty-row">ยังไม่มีประวัติ</div>';
    $$('.history-item').forEach(element=>element.addEventListener('click',async event=>{if(event.target.closest('[data-delete]'))return;await openHistoryRun(element.dataset.id);}));
    $$('[data-delete]').forEach(button=>button.addEventListener('click',async event=>{event.stopPropagation();const ok=await confirmAction('ลบ Run History',`ต้องการลบ Run ${button.dataset.delete} หรือไม่? การลบนี้ไม่กระทบไฟล์ที่ดาวน์โหลดเก็บเอง`);if(ok){await BlackwolfDB.remove(button.dataset.delete);if(state.result?.runId===button.dataset.delete){state.result=null;$('#currentRunLabel').textContent='-';renderResults();renderReport();}await renderHistory();toast('ลบ Run แล้ว');}}));
    clearInterval(historyCountdownTimer);historyCountdownTimer=setInterval(async()=>{const expired=$$('[data-expires-at]').some(element=>new Date(element.dataset.expiresAt)<=new Date());if(expired)await renderHistory();else $$('[data-expires-at]').forEach(element=>{element.textContent=formatCountdown(element.dataset.expiresAt);});},60000);
  }catch(error){recordDiagnosticError('renderHistory',error,'BW-HISTORY-READ');console.error(error);$('#historyList').innerHTML=`<div class="empty-row">อ่านประวัติไม่สำเร็จ: ${esc(error.message)}</div>`;}
}
// อธิบาย: เปิดผล Run เก่าจาก History กลับมาแสดงใน UI
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function openHistoryRun(id){
  try{setStatus('LOADING','running');const record=await BlackwolfDB.get(id);if(!record)throw new Error('ไม่พบ Run หรือถูกลบครบ 4 วันแล้ว');state.result={runId:record.id,summary:record.summary,rows:record.rows||[],duplicateSummary:record.duplicateSummary||null,context:record.context||{},outputs:{master:record.masterWorkbook,issue:record.issueWorkbook,names:record.outputNames}};$('#currentRunLabel').textContent=record.id;$('#previewMode').textContent=`HISTORY ${record.id}`;renderPreview(state.activePreview);renderDashboard();renderResults();renderReport();setStatus('COMPLETED','success');setPage('results');toast(`เปิดประวัติ Run ${id}`);}catch(error){recordDiagnosticError('openHistory',error,'BW-HISTORY-OPEN');setStatus('ERROR','error');toast(error.message,5000);}
}
// อธิบาย: เปิด modal ยืนยันก่อนทำงานเสี่ยง เช่น ล้างข้อมูล
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function confirmAction(title,message){return new Promise(resolve=>{const modal=$('#confirmModal');$('#confirmTitle').textContent=title;$('#confirmText').textContent=message;modal.classList.remove('hidden');const done=value=>{modal.classList.add('hidden');$('#confirmOk').onclick=null;$('#confirmCancel').onclick=null;resolve(value);};$('#confirmOk').onclick=()=>done(true);$('#confirmCancel').onclick=()=>done(false);});}
// อธิบาย: อัปเดตสถานะ Browser/Worker/Storage ในหน้า Settings
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function refreshSystemStatus(){
  const worker=!!state.workerReady,xlsx=!!window.XLSX;$('#settingsEngineStatus').textContent='พร้อมใช้งาน';$('#settingsEngineStatus').className='status-ok';$('#settingsWorkerStatus').textContent=worker?'พร้อมใช้งาน':'Fallback Mode';$('#settingsWorkerStatus').className=worker?'status-ok':'status-warn';$('#settingsExcelStatus').textContent=xlsx?'พร้อมใช้งาน':'ไม่พร้อม';$('#settingsExcelStatus').className=xlsx?'status-ok':'status-bad';
  try{await BlackwolfDB.open();$('#settingsArchiveStatus').textContent='พร้อมใช้งาน';$('#settingsArchiveStatus').className='status-ok';}catch{$('#settingsArchiveStatus').textContent='ไม่พร้อม';$('#settingsArchiveStatus').className='status-bad';}
  $('#settingsActiveRuns').textContent=state.running?'1':'0';const detail=$('#settingsWorkerDetail');if(detail)detail.textContent=state.workerReady?`Generation ${state.workerGeneration} · Pending ${state.workerJobs.size} · Heartbeat ${state.workerLastHeartbeat?new Date(state.workerLastHeartbeat).toLocaleTimeString('th-TH'):'รอการทำงาน'}`:'Fallback Mode';
  try{const info=await BlackwolfDB.storageInfo();$('#storageUsage').textContent=`${bytes(info.usage)} / ${info.quota?bytes(info.quota):'ไม่ทราบ'}`;$('#storagePersistence').textContent=info.persisted?'Browser ลดโอกาสลบให้อัตโนมัติ':'ยังไม่ได้รับสิทธิ์';$('#storagePersistence').className=info.persisted?'status-ok':'status-warn';}catch{$('#storageUsage').textContent='อ่านไม่ได้';$('#storagePersistence').textContent='ไม่พร้อม';}
}
// อธิบาย: เปิดหน้าต่างคู่มือรูปภาพ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function openGuide(){$('#guideModal').classList.remove('hidden');}
// อธิบาย: ปิดหน้าต่างคู่มือรูปภาพ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function closeGuide(){$('#guideModal').classList.add('hidden');}
// อธิบาย: ล้างไฟล์ที่เลือกและผลลัพธ์ในหน้าจอ โดยไม่ลบไฟล์ต้นฉบับในเครื่อง
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function clearAll(){roles.forEach(role=>state.files[role]=null);state.workbooks={};state.workerCachedRoles.clear();state.etlText='';state.preflight=null;$('#bulkInput').value='';$('#autoMail72Input').value='';$('#manualStartDate').value='';$('#preflightResult').classList.add('hidden');$('#progressPanel').classList.add('hidden');$('#previewMode').textContent='TEMPLATE PREVIEW';if(state.workerReady)workerRequest('reset').catch(()=>{});syncEtl(false);renderFiles();renderPreview('Report');toast('ล้างไฟล์ที่เตรียม Run แล้ว');}

// อธิบาย: สร้างข้อมูลตัวอย่างเพื่อ preview หน้าตา Excel-like เมื่อยังไม่มีผล run
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function sampleRows(){return[{AgencyCode:'LBI0516',Mticode:'',AgencyName:'ต่างด้าว-SIAM COSMOS (7)',RequestCode:'7240978836',employeeName:'บริษัท ตัวอย่าง จำกัด',alienCode:'RA17655350265076221',alienNameEn:'HTET MYAT MOE',CertificateNo:'HP651477-1',Policy:'HP651477',TotalPremium:990,ProposalID:'7240978836',CreateDate:new Date(),Status:'',EPropID:'4005501597',Discount:'120.00',Note:'',IncompleteStatus:'ข้อมูลไม่สมบูรณ์',BlacklistStatus:'',MenuEProblem:'',Date:new Date(),PendingStatus:'ข้อมูลไม่สมบูรณ์',AgingDays:1,PendingRange:'1 - 7 วัน'}];}
// อธิบาย: เลือกข้อมูลที่จะใช้ preview: ผลจริงถ้ามี ไม่งั้นใช้ sample
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function previewData(){return state.result?.rows||sampleRows();}
// อธิบาย: สร้าง HTML table แบบคล้าย Excel จาก headers/rows
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function excelTable(headers,rows,options={}){const head=headers.map((header,index)=>`<th class="${options.purpleFrom!==undefined&&index>=options.purpleFrom?'head-purple':'head-blue'}">${esc(header)}</th>`).join('');const startRow=options.startRow||2,headerRowNumber=options.headerRowNumber||'';const body=rows.slice(0,12).map((row,rowIndex)=>`<tr><td class="rownum">${rowIndex+startRow}</td>${row.map((value,columnIndex)=>`<td class="${options.moneyCols?.includes(columnIndex)?'money':''}">${value instanceof Date?esc(BlackwolfEngine.normalize.dateDisplay(value)):esc(value)}</td>`).join('')}</tr>`).join('');return`<table class="excel-table"><thead><tr><th class="rownum">${headerRowNumber}</th>${head}</tr></thead><tbody>${body||`<tr><td class="rownum">${startRow}</td><td colspan="${headers.length}">ไม่มีข้อมูล</td></tr>`}</tbody></table>`;}
// อธิบาย: ล้าง registry สำหรับกด drill-down ใน preview
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function previewResetDrilldowns(){previewDrillRegistry=[];}
// อธิบาย: เก็บรายการย่อยของ block แล้วคืน index สำหรับปุ่ม drill-down
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function previewRegisterDrilldown(title,rows){const index=previewDrillRegistry.length;previewDrillRegistry.push({title,rows:[...(rows||[])]});return index;}
// อธิบาย: สร้าง cell ที่กดดูรายละเอียด block ได้ถ้ามีข้อมูลย่อย
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function previewDrillCell(value,index,className=''){const enabled=index!==null&&index!==undefined&&previewDrillRegistry[index]?.rows?.length;return`<td class="${className}${enabled?' preview-drillable':''}"${enabled?` data-preview-drill="${index}" tabindex="0" title="คลิกเพื่อดูข้อมูลด้านในเหมือน Excel Pivot"`:''}>${value}</td>`;}
// อธิบาย: เช็คว่า row ตรงกับ block PV ที่ preview อยู่หรือไม่
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function previewRowMatchesPv(row,pv){
  const normalize=BlackwolfEngine.normalize,date=value=>value?normalize.dateKey(new Date(value)):'';
  return date(row.Date)===date(pv.Date)&&normalize.text(row.Policy)===normalize.text(pv.Policy)&&normalize.text(row.Mticode)===normalize.text(pv.Mticode)&&normalize.text(row.AgencyName)===normalize.text(pv.AgencyName)&&normalize.id(row.ProposalID)===normalize.id(pv.ProposalID)&&normalize.text(row.PendingStatus)===normalize.text(pv.PendingStatus)&&String(row.AgingDays??'')===String(pv.AgingDays??'')&&normalize.text(row.PendingRange)===normalize.text(pv.PendingRange);
}
// อธิบาย: แสดง label ของ Pivot โดยแทนค่าว่างเป็น (blank)
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function previewPivotLabel(value){return value===null||value===undefined||String(value).trim()===''?'(blank)':value;}
// อธิบาย: แสดง date สำหรับ preview แบบ dd/mm/yyyy หรือ (blank)
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function previewDate(value){return value?BlackwolfEngine.normalize.dateDisplay(new Date(value)):'(blank)';}
// อธิบาย: ดึงสถานะสำหรับ preview และแทนค่าว่างเป็น (blank)
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function previewStatusValue(row){const value=BlackwolfEngine.normalize.text(row.Status);return value||'(blank)';}
// อธิบาย: เปิด modal แสดงข้อมูลด้านใน block PV/PV Final/Report
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function openPreviewDrilldown(index){
  const entry=previewDrillRegistry[Number(index)],modal=$('#previewDrillModal');if(!entry||!modal)return;
  const rows=entry.rows||[],limit=1000,visible=rows.slice(0,limit);
  $('#previewDrillTitle').textContent=entry.title;$('#previewDrillCount').textContent=`${fmt(rows.length)} รายการ${rows.length>limit?` · แสดง ${fmt(limit)} รายการแรก`:''}`;
  $('#previewDrillBody').innerHTML=visible.map((row,rowIndex)=>`<tr><td>${fmt(rowIndex+1)}</td><td>${esc(previewDate(row.Date||row.CreateDate))}</td><td><strong>${esc(row.ProposalID||'-')}</strong></td><td>${esc(row.Policy||'-')}</td><td>${esc(row.Mticode||'-')}</td><td>${esc(row.AgencyName||'-')}</td><td>${esc(row.alienCode||'-')}</td><td>${esc(row.alienNameEn||'-')}</td><td>${esc(row.PendingStatus||'-')}</td><td>${row.AgingDays===null||row.AgingDays===undefined?'-':fmt(row.AgingDays)}</td><td>${esc(row.PendingRange||'-')}</td><td class="money">${money(row.TotalPremium)}</td></tr>`).join('')||'<tr><td colspan="12" class="empty-row">ไม่มีข้อมูลใน Block นี้</td></tr>';
  modal.classList.remove('hidden');
}
// อธิบาย: ปิด modal drill-down preview
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function closePreviewDrilldown(){$('#previewDrillModal')?.classList.add('hidden');}
// อธิบาย: วาด preview ของ PV/PV Final พร้อม block drill-down
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function renderPvPreview(sheet,sourceRows){
  const headers=['Date','Policy','Mticode','AgencyName','ProposalID','สถานะไม่ issue','จำนวนวันที่ยังไม่ออกกรมธรรม์','ระยะเวลายังไม่ออกกรมธรรม์','Sum of TotalPremium'];
  const allRows=sourceRows.map(row=>({...row,Date:row.Date?new Date(row.Date):null}));
  const statuses=[...new Set(allRows.map(previewStatusValue))];
  const filteredRows=sheet==='PV'&&previewPvStatusFilter!=='(All)'?allRows.filter(row=>previewStatusValue(row)===previewPvStatusFilter):allRows;
  const pvRows=BlackwolfEngine.preview.aggregatePvRows(sheet==='PV'?filteredRows:allRows),limit=250;
  const headerHtml=headers.map(header=>`<td class="head-blue pivot-header-cell">${esc(header)} <span>▾</span></td>`).join('');
  const bodyHtml=pvRows.slice(0,limit).map((row,index)=>{
    const source=allRows.filter(item=>previewRowMatchesPv(item,row)),drill=previewRegisterDrilldown(`${sheet} · ${row.ProposalID||'(blank)'}`,source),values=[previewDate(row.Date),previewPivotLabel(row.Policy),previewPivotLabel(row.Mticode),previewPivotLabel(row.AgencyName),previewPivotLabel(row.ProposalID),previewPivotLabel(row.PendingStatus),previewPivotLabel(row.AgingDays),previewPivotLabel(row.PendingRange),money(row.TotalPremium)];
    return`<tr class="pivot-data-row" data-preview-drill="${drill}" tabindex="0"><td class="rownum">${sheet==='PV'?index+5:index+2}</td>${values.map((value,column)=>`<td class="${column===8?'money ':''}preview-drillable" data-preview-drill="${drill}">${esc(value)}</td>`).join('')}</tr>`;
  }).join('');
  if(sheet==='PV'){
    const options=['(All)',...statuses].map(value=>`<option value="${esc(value)}"${previewPvStatusFilter===value?' selected':''}>${esc(value)}</option>`).join('');
    $('#sheetStage').innerHTML=`<div class="pivot-preview-note">Pivot Preview · คลิกแถวเพื่อดูข้อมูลต้นทางภายใน Block</div><table class="excel-table pivot-preview-table"><tbody><tr><td class="rownum">1</td><td colspan="9"></td></tr><tr class="pivot-filter-row"><td class="rownum">2</td><td class="head-blue">Status</td><td><select id="previewPvStatusSelect" class="pivot-filter-select">${options}</select></td><td colspan="7"></td></tr><tr><td class="rownum">3</td><td colspan="9"></td></tr><tr><td class="rownum">4</td>${headerHtml}</tr>${bodyHtml||'<tr><td class="rownum">5</td><td colspan="9">ไม่มีข้อมูล</td></tr>'}</tbody></table>${pvRows.length>limit?`<div class="pivot-preview-limit">แสดง ${fmt(limit)} จาก ${fmt(pvRows.length)} แถว</div>`:''}`;
  }else{
    $('#sheetStage').innerHTML=`<div class="pivot-preview-note">PV Final คัดลอกผลจาก PV ชุดเดียวกัน · คลิกแถวเพื่อดูข้อมูลต้นทาง</div><table class="excel-table pivot-preview-table"><tbody><tr><td class="rownum">1</td>${headerHtml}</tr>${bodyHtml||'<tr><td class="rownum">2</td><td colspan="9">ไม่มีข้อมูล</td></tr>'}</tbody></table>${pvRows.length>limit?`<div class="pivot-preview-limit">แสดง ${fmt(limit)} จาก ${fmt(pvRows.length)} แถว</div>`:''}`;
  }
  $('#formulaText').textContent=`PV และ PV Final ใช้ชุดข้อมูลเดียวกัน ${fmt(pvRows.length)} กรมธรรม์ · คลิกเพื่อ Drill-down`;
}
// อธิบาย: เลือก preview sheet ที่ผู้ใช้เลือกและวาดออกหน้าจอ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function renderPreview(sheet){
  state.activePreview=sheet;previewResetDrilldowns();$$('#sheetTabs button').forEach(button=>button.classList.toggle('active',button.dataset.sheet===sheet));const rows=previewData(),stage=$('#sheetStage');
  if(sheet==='Data'){const headers=['AgencyCode','Mticode','AgencyName','RequestCode','employeeName','alienCode','alienNameEn','CertificateNo','Policy','TotalPremium','ProposalID','CreateDate','Status','EPropID','Discount','หมายเหตุ','สถานะไม่สมบูรณ์','สถานะ Blacklist.','ติดปัญหาไม่เข้าในเมนู E','Date','สถานะไม่ issue','จำนวนวันที่ยังไม่ออกกรมธรรม์','ระยะเวลายังไม่ออกกรมธรรม์'];const body=rows.map(row=>[row.AgencyCode,row.Mticode,row.AgencyName,row.RequestCode,row.employeeName,row.alienCode,row.alienNameEn,row.CertificateNo,row.Policy,money(row.TotalPremium),row.ProposalID,new Date(row.CreateDate),row.Status,row.EPropID,row.Discount,row.Note,row.IncompleteStatus,row.BlacklistStatus,row.MenuEProblem,row.Date?new Date(row.Date):'',row.PendingStatus,row.AgingDays,row.PendingRange]);stage.innerHTML=excelTable(headers,body,{purpleFrom:15,moneyCols:[9]});$('#formulaText').textContent='สูตร P:W สร้างอัตโนมัติ';return;}
  if(sheet==='ข้อมูลไม่สมบูรณ์'){const ids=state.result?.context?.smIds||['7240978836','7240965993'];stage.innerHTML=excelTable(['สถานะ','Prop ID'],ids.map(value=>['ข้อมูลไม่สมบูรณ์',value]),{});$('#formulaText').textContent='Carry Forward + Merge ข้อมูลใหม่';return;}
  if(sheet==='Black List'){const ids=state.result?.context?.blIds||['7240888888'];stage.innerHTML=excelTable(['สถานะ','Prop ID'],ids.map(value=>['Blacklist',value]),{}).replaceAll('head-blue','head-red');$('#formulaText').textContent='Carry Forward + Merge ข้อมูลใหม่';return;}
  if(sheet==='PV'||sheet==='PV Final'){renderPvPreview(sheet,rows);return;}
  renderReportPreview();
}
// อธิบาย: วาด preview ของ Report ตาม summary ล่าสุด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function renderReportPreview(){
  const sourceRows=previewData().map(row=>({...row,Date:row.Date?new Date(row.Date):null})),rows=BlackwolfEngine.preview.aggregatePvRows(sourceRows),summary=state.result?.summary||{TotalPremium:rows.reduce((total,row)=>total+Number(row.TotalPremium||0),0),TotalPolicies:rows.length||0},allDrill=previewRegisterDrilldown('Report · กรมธรรม์ทั้งหมด',rows);
  let html='<div class="pivot-preview-note">Report Pivot Preview · เว้น 1 แถวระหว่าง Block และซ่อน Block ที่ไม่มีข้อมูล · คลิกยอดหรือแถวเพื่อดูข้อมูลด้านใน</div><table class="excel-table pivot-preview-table report-pivot-preview"><tbody>';
  html+=`<tr><td class="rownum">1</td><td colspan="4" class="blue-title preview-drillable" data-preview-drill="${allDrill}">สถานะไม่ ISSUE.</td></tr>`;
  html+=`<tr><td class="rownum">2</td><td colspan="2">ยอดเงินที่ยังไม่ Issue</td>${previewDrillCell(money(summary.TotalPremium),allDrill,'money')}<td>บาท</td></tr><tr><td class="rownum">3</td><td colspan="2">จำนวนกรมธรรม์</td>${previewDrillCell(fmt(summary.TotalPolicies),allDrill)}<td>กรมธรรม์</td></tr>`;
  html+='<tr class="report-block-spacer"><td class="rownum">4</td><td colspan="4"></td></tr><tr><td class="rownum">6</td><td colspan="4" class="green-title preview-drillable" data-preview-drill="'+allDrill+'">จำนวนวันที่ยังไม่ออกกรมธรรม์</td></tr><tr><td class="rownum">7</td><td class="head-green">No.</td><td class="head-green">ระยะเวลายังไม่ออกกรมธรรม์</td><td class="head-green">Count of Policy</td><td class="head-green">TotalPremium</td></tr>';
  const aging=BlackwolfEngine.preview.groupByAging(rows);
  let currentRow=8;
  aging.forEach(item=>{const details=rows.filter(row=>row.PendingRange===item[1]),drill=previewRegisterDrilldown(`Report · ${item[1]}`,details);html+=`<tr><td class="rownum">${currentRow}</td><td>${item[0]}</td><td>${esc(item[1])}</td>${previewDrillCell(fmt(item[2]),drill)}${previewDrillCell(money(item[3]),drill,'money')}</tr>`;currentRow++;});
  html+=`<tr><td class="rownum">${currentRow}</td><td class="grand preview-drillable" data-preview-drill="${allDrill}">Grand Total</td><td class="grand"></td>${previewDrillCell(fmt(summary.TotalPolicies),allDrill,'grand')}${previewDrillCell(money(summary.TotalPremium),allDrill,'grand money')}</tr>`;
  const sections=[
    {status:'รอ Issue',label:'รายการที่รอ ISSUE.',header:'head-blue',title:'blue-title'},
    {status:'ติดปัญหาไม่เข้าในเมนู E',label:'รายการติดปัญหาไม่เอาเข้าเมนู E',header:'head-orange',title:'orange-title'},
    {status:'ข้อมูลไม่สมบูรณ์',label:'รายการข้อมูลไม่สมบูรณ์',header:'head-purple',title:'purple-title'},
    {status:'Blacklist',label:'สถานะ Blacklist.',header:'head-red',title:'red-title'}
  ];
  for(const section of sections){
    const subset=rows.filter(row=>row.PendingStatus===section.status),groups=BlackwolfEngine.preview.groupStatusRows(rows,section.status);if(!subset.length||!groups.length)continue;
    const sectionDrill=previewRegisterDrilldown(`Report · ${section.label}`,subset),sectionPremium=subset.reduce((total,row)=>total+Number(row.TotalPremium||0),0),blankRow=currentRow+1,filterRow=blankRow+1,titleRow=filterRow+1,valuesRow=titleRow+1,headerRow=valuesRow+1,dataStart=headerRow+1;
    html+=`<tr class="report-block-spacer"><td class="rownum">${blankRow}</td><td colspan="4"></td></tr><tr><td class="rownum">${titleRow}</td><td colspan="4" class="${section.title} preview-drillable" data-preview-drill="${sectionDrill}">${esc(section.label)}</td></tr><tr><td class="rownum">${headerRow}</td><td class="${section.header}">Date</td><td class="${section.header}">จำนวนวันที่ยังไม่ออกกรมธรรม์</td><td class="${section.header}">Count of Policy</td><td class="${section.header}">ผลรวม</td></tr>`;
    groups.forEach((group,index)=>{const key=group[0]?BlackwolfEngine.normalize.dateKey(new Date(group[0])):'',details=subset.filter(item=>(item.Date?BlackwolfEngine.normalize.dateKey(new Date(item.Date)):'')===key),drill=previewRegisterDrilldown(`Report · ${section.label} · ${key||'(blank)'}`,details),rowNumber=dataStart+index;html+=`<tr><td class="rownum">${rowNumber}</td><td>${group[0]?BlackwolfEngine.normalize.dateDisplay(group[0]):'(blank)'}</td><td>${previewPivotLabel(group[1])}</td>${previewDrillCell(fmt(group[2]),drill)}${previewDrillCell(money(group[3]),drill,'money')}</tr>`;});
    currentRow=dataStart+groups.length;html+=`<tr><td class="rownum">${currentRow}</td><td class="grand preview-drillable" data-preview-drill="${sectionDrill}">Grand Total</td><td class="grand"></td>${previewDrillCell(fmt(subset.length),sectionDrill,'grand')}${previewDrillCell(money(sectionPremium),sectionDrill,'grand money')}</tr>`;
  }
  html+='</tbody></table>';$('#sheetStage').innerHTML=html;$('#formulaText').textContent='Report เรียง Block ตาม Flow · เว้น 1 แถว · ซ่อน Block ที่ไม่มีข้อมูล · Drill-down ได้';
}

// อธิบาย: รีเซ็ตข้อมูลใน Browser เช่น history, setting, local archive ตามที่ผู้ใช้ยืนยัน
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function resetProgram(){const ok=await confirmAction('รีเซ็ตโปรแกรม','ล้าง Run History, Excel ที่เก็บใน Browser, ภาษา ธีม และไฟล์ที่เลือกทั้งหมดหรือไม่? ไฟล์ที่ดาวน์โหลดเก็บเองจะไม่ถูกลบ');if(!ok)return;await BlackwolfDB.clear();storage.remove(storageKey('theme'));storage.remove(storageKey('language'));state.result=null;clearAll();applyLanguage('th');applyTheme('light');renderResults();renderReport();await renderHistory();$('#currentRunLabel').textContent='-';toast('รีเซ็ตโปรแกรมเรียบร้อยแล้ว');}
// อธิบาย: ผูก event ทุกปุ่ม/input/drag-drop ตอนเริ่มโปรแกรม
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function bind(){
  $$('.nav').forEach(button=>button.addEventListener('click',()=>setPage(button.dataset.page)));$$('[data-go]').forEach(button=>button.addEventListener('click',()=>setPage(button.dataset.go)));
  $('#bulkInput').addEventListener('change',event=>loadFiles(event.target.files));const zone=$('#dropZone');zone.addEventListener('dragover',event=>{event.preventDefault();zone.classList.add('drag');});zone.addEventListener('dragleave',()=>zone.classList.remove('drag'));zone.addEventListener('drop',event=>{event.preventDefault();zone.classList.remove('drag');loadFiles(event.dataTransfer.files);});
  $('#autoMail72Input').addEventListener('input',()=>syncEtl(true));$('#manualStartDate').addEventListener('change',()=>invalidate({resetWorker:false,clearWorkbooks:false}));$('#clearEtlBtn').addEventListener('click',()=>{$('#autoMail72Input').value='';state.files.etl=null;syncEtl(true);});$('#clearBtn').addEventListener('click',clearAll);on('#cancelRunBtn','click',cancelActiveRun);$('#preflightBtn').addEventListener('click',runPreflight);$('#runBtn').addEventListener('click',runWorkflow);$('#downloadCombined').addEventListener('click',downloadMaster);$('#downloadIssue').addEventListener('click',downloadIssue);$('#tableSearch').addEventListener('input',renderTable);$('#tableStatusFilter').addEventListener('change',renderTable);$('#tableAgingFilter').addEventListener('change',renderTable);$('#clearTableFiltersBtn').addEventListener('click',()=>{$('#tableSearch').value='';$('#tableStatusFilter').value='';$('#tableAgingFilter').value='';selectedDetailIndex=null;renderTable();});
  $('#refreshHistory').addEventListener('click',renderHistory);$('#refreshReportBtn').addEventListener('click',()=>{renderReport();toast('อัปเดตรายงานแล้ว');});$('#printReportBtn').addEventListener('click',()=>window.print());$('#saveReportImageBtn').addEventListener('click',saveReportImage);
  $('#guideBtn').addEventListener('click',openGuide);$('#settingsGuideBtn').addEventListener('click',openGuide);$('#guideClose').addEventListener('click',closeGuide);$('#guideModal').addEventListener('click',event=>{if(event.target.id==='guideModal')closeGuide();});
  $('#sheetStage').addEventListener('click',event=>{const target=event.target.closest('[data-preview-drill]');if(target)openPreviewDrilldown(target.dataset.previewDrill);});$('#sheetStage').addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&event.target.closest('[data-preview-drill]')){event.preventDefault();openPreviewDrilldown(event.target.closest('[data-preview-drill]').dataset.previewDrill);}});$('#sheetStage').addEventListener('change',event=>{if(event.target.id==='previewPvStatusSelect'){previewPvStatusFilter=event.target.value;renderPreview('PV');}});
  $('#previewDrillClose').addEventListener('click',closePreviewDrilldown);$('#previewDrillModal').addEventListener('click',event=>{if(event.target.id==='previewDrillModal')closePreviewDrilldown();});document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeGuide();closePreviewDrilldown();}});
  $('#themeBtn').addEventListener('click',()=>applyTheme(document.body.classList.contains('dark')?'light':'dark'));$$('[data-theme-value]').forEach(button=>button.addEventListener('click',()=>applyTheme(button.dataset.themeValue)));$$('[data-language]').forEach(button=>button.addEventListener('click',()=>applyLanguage(button.dataset.language)));
  $('#refreshSystemStatusBtn').addEventListener('click',refreshSystemStatus);$('#requestPersistenceBtn').addEventListener('click',async()=>{const ok=await BlackwolfDB.requestPersistent();toast(ok?'Browser อนุญาตให้ลดโอกาสลบ Storage อัตโนมัติแล้ว':'Browser ยังไม่อนุญาต — กรุณาดาวน์โหลดไฟล์เก็บเองทุกวัน',5000);refreshSystemStatus();});on('#exportDiagnosticBtn','click',exportDiagnosticPackage);on('#restartWorkerBtn','click',manualRestartWorker);$('#resetProgramBtn').addEventListener('click',resetProgram);
  $$('#sheetTabs button').forEach(button=>button.addEventListener('click',()=>renderPreview(button.dataset.sheet)));
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')BlackwolfDB.pruneExpired().then(renderHistory).catch(()=>{});});
}
// อธิบาย: ฟังก์ชันเริ่มต้นของ app: โหลด setting, เปิด worker, prune history, bind event และ render UI แรก
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function init(){
  window.addEventListener('error',event=>recordDiagnosticError('window.error',event.error||new Error(event.message||'Window error'),'BW-WINDOW'));
  window.addEventListener('unhandledrejection',event=>recordDiagnosticError('window.unhandledrejection',event.reason instanceof Error?event.reason:new Error(String(event.reason||'Unhandled rejection')),'BW-PROMISE'));
  bind();applyTheme(storage.get(storageKey('theme'))||'light');applyLanguage(state.language);updateClock();clockTimer=setInterval(updateClock,1000);renderFiles();syncEtl(false);renderPreview('Report');renderResults();renderReport();
  await initWorker();
  if(location.protocol==='file:'&&!state.workerReady){const banner=$('#runtimeBanner');if(banner){banner.classList.remove('hidden');banner.innerHTML='<strong>แนะนำการเปิดใช้งาน:</strong> กำลังใช้ Main-thread fallback ซึ่งอาจช้ากับไฟล์ใหญ่ กรุณาเปิดผ่าน <b>START_LOCAL_WEB.bat</b> หรือ GitHub Pages เพื่อใช้ Background Worker เต็มรูปแบบ';}}
  try{await BlackwolfDB.requestPersistent();}catch{}
  await BlackwolfDB.pruneExpired().catch(()=>0);await renderHistory();await refreshSystemStatus();
}
init();
})();
