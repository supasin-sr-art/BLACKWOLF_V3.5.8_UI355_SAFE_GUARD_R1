(function(global){
'use strict';


// BLACKWOLF TEACHING COMMENTS: คอมเมนต์ชุดนี้เพิ่มเพื่ออธิบาย logic สำหรับอ่าน/ดูแลโค้ด
// หลักสำคัญ: คอมเมนต์ขึ้นต้นด้วย // จะไม่ถูกรัน จึงไม่เปลี่ยน behavior ของ JavaScript
// ภาพรวม: ไฟล์หัวใจของระบบ ใช้อ่าน Excel, normalize header, รวมข้อมูล, ตัดรายการที่ออกกรมธรรม์แล้ว, สร้าง Master/ISSUE และจัดการ Pivot/XML
// ภาพรวม: แบ่งงานเป็นชั้น ๆ: helper → extractor → reconcile/classify → summarize → workbook builder → pivot patcher → validation → run
// ภาพรวม: export BlackwolfEngine ให้ app.js/worker.js ใช้ และมี internals สำหรับ preview/diagnostic บางส่วน
const CONFIG=global.BLACKWOLF_CONFIG||{
  version:'3.5.8',
  masterBaseName:'เช็คกรมธรรม์ต่างด้าวที่ยังไม่ออก_WEB',
  issueBaseName:'เช็คสถานะ ISSUE_WEB'
};

const DAILY_HEADERS=['AgencyCode','Mticode','AgencyName','RequestCode','employeeName','alienCode','alienNameEn','CertificateNo','TotalPremium','ProposalID','CreateDate','Status','EPropID','Discount'];
const MASTER_AO_HEADERS=['AgencyCode','Mticode','AgencyName','RequestCode','employeeName','alienCode','alienNameEn','CertificateNo','Policy','TotalPremium','ProposalID','CreateDate','Status','EPropID','Discount'];
const MASTER_OUTPUT_HEADERS=[...MASTER_AO_HEADERS,'หมายเหตุ','สถานะไม่สมบูรณ์','สถานะ Blacklist.','ติดปัญหาไม่เข้าในเมนู E','Date','สถานะไม่ issue','จำนวนวันที่ยังไม่ออกกรมธรรม์','ระยะเวลายังไม่ออกกรมธรรม์'];
const ISSUE_HEADERS=['AgencyCode','Mticode','AgencyName','RequestCode','employeeName','alienCode','alienNameEn','CertificateNo','PolicyNo','TotalPremium','ProposalID','CreateDate','Status','EPropID','Discount','สถานะ'];
const ALLOWED_STATUS_KEYS=new Set(['','เสร็จสมบูรณ์','เสร็จสมบูรณ์(ติดปัญหาuploadfile)','ระบบขัดข้องกรุณาติดต่อไอที']);
const COLORS={blue:'4F81BD',reportBlue:'0070C0',purple:'AB0CF2',darkPurple:'60497A',green:'00B050',red:'C0504D',orange:'F79646',white:'FFFFFF',black:'000000',grid:'7F7F7F',lightBlue:'DCE6F1',lightGray:'F2F2F2'};
const BUNDLED_PIVOT_TEMPLATE_URL='assets/BLACKWOLF_Master_Pivot_Template_V2.5.3.xlsx';
let bundledPivotTemplatePromise=null;

const HEADER_ALIASES=new Map([
  ['proposalid','ProposalID'],['proposal','ProposalID'],['propid','Prop ID'],['prop-id','Prop ID'],['prop id','Prop ID'],['cpropid','CPROP_ID'],
  ['checkpid','Check P-ID'],['checkp-id','Check P-ID'],['check p-id','Check P-ID'],['checkproposalid','Check P-ID'],
  ['policyno','PolicyNo'],['policy','Policy'],['createdate','CreateDate'],['create date','CreateDate'],
  ['totalpremium','TotalPremium'],['total premium','TotalPremium'],['agencycode','AgencyCode'],['agency code','AgencyCode'],
  ['agencyname','AgencyName'],['agency name','AgencyName'],['requestcode','RequestCode'],['request code','RequestCode'],
  ['employeename','employeeName'],['employee name','employeeName'],['aliencode','alienCode'],['alien code','alienCode'],
  ['aliennameen','alienNameEn'],['alien name en','alienNameEn'],['certificateno','CertificateNo'],['certificate no','CertificateNo'],
  ['epropid','EPropID'],['eprop id','EPropID'],['mticode','Mticode'],['discount','Discount'],['status','Status'],
  ['date','Date'],['no','No'],['group','Group'],['ออกกรมธรรม์','ออกกรมธรรม์'],
  ['สถานะไม่สมบูรณ์','สถานะไม่สมบูรณ์'],['สถานะblacklist','สถานะ Blacklist.'],['สถานะblacklist.','สถานะ Blacklist.'],
  ['ติดปัญหาไม่เข้าในเมนูe','ติดปัญหาไม่เข้าในเมนู E'],['สถานะไม่issue','สถานะไม่ issue'],
  ['จำนวนวันที่ยังไม่ออกกรมธรรม์','จำนวนวันที่ยังไม่ออกกรมธรรม์'],['ระยะเวลายังไม่ออกกรมธรรม์','ระยะเวลายังไม่ออกกรมธรรม์'],
  ['หมายเหตุ','หมายเหตุ']
]);

// อธิบาย: แปลงค่าทุกแบบเป็นข้อความสะอาด ตัดช่องว่าง/ขึ้นบรรทัด/Excel _x000D_
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function text(value){return value===null||value===undefined?'':String(value).replace(/[_]x000D_/gi,' ').replace(/[\r\n\t]+/g,' ').replace(/\s+/g,' ').trim();}
// อธิบาย: normalize รหัส/เลขอ้างอิง เช่น ProposalID/Policy ให้ไม่ติด apostrophe หรือ .0 จาก Excel
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function id(value){
  if(value===null||value===undefined||value==='')return'';
  if(typeof value==='number'&&Number.isFinite(value))return Number.isInteger(value)?String(value):String(value).replace(/\.0+$/,'');
  const normalized=text(value).replace(/^'/,'');
  return /^\d+(?:\.0+)?$/.test(normalized)?normalized.replace(/\.0+$/,''):normalized;
}
// อธิบาย: ทำ key สำหรับเทียบชื่อ header/sheet แบบไม่สน case, ช่องว่าง และ separator
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function rawKey(value){return text(value).normalize('NFKC').toLowerCase().replace(/[\s._\-\/()]+/g,'');}
// อธิบาย: แปลงชื่อ header ที่เขียนต่างกันให้เป็นชื่อมาตรฐานเดียวกันผ่าน alias map
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function canonicalHeader(value){
  const source=text(value).normalize('NFKC').toLowerCase();
  const compact=source.replace(/[\s._\-\/()]+/g,'');
  return HEADER_ALIASES.get(source)||HEADER_ALIASES.get(compact)||text(value);
}
// อธิบาย: สร้าง key มาตรฐานของ header หลัง canonical แล้ว
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function headerKey(value){return rawKey(canonicalHeader(value));}
// อธิบาย: แปลงค่าเป็นตัวเลข โดยรองรับ comma และค่าว่าง
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function number(value){if(value===null||value===undefined||value==='')return 0;if(typeof value==='number')return Number.isFinite(value)?value:0;const parsed=Number(String(value).replace(/,/g,'').trim());return Number.isFinite(parsed)?parsed:0;}
// อธิบาย: เช็คว่าค่ามีเนื้อหาจริง ไม่ใช่ null/undefined/blank
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function hasValue(value){return value!==null&&value!==undefined&&String(value).trim()!=='';}
// อธิบาย: เติม 0 หน้าเลขวัน/เดือน/เวลาให้ครบ 2 หลัก
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function pad(value){return String(value).padStart(2,'0');}
// อธิบาย: แปลง Date เป็น yyyy-mm-dd เพื่อใช้ในชื่อไฟล์/เปรียบเทียบ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function dateKey(date){return date?`${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`:'';}
// อธิบาย: แปลง Date เป็น dd/mm/yyyy สำหรับแสดงใน Excel/UI
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function dateDisplay(date){return date?`${pad(date.getDate())}/${pad(date.getMonth()+1)}/${date.getFullYear()}`:'';}
// อธิบาย: แปลง Date เป็น yyyy-mm-dd HH:mm:ss สำหรับ audit/log
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function dateTimeText(date){return date?`${dateKey(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`:'';}
// อธิบาย: ตัดเวลาออก เหลือเฉพาะวันเพื่อคำนวณ aging ให้ตรง
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function dateOnly(date){return date?new Date(date.getFullYear(),date.getMonth(),date.getDate()):null;}
// อธิบาย: แปลง Date เป็น serial number ของ Excel
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function excelSerial(value){
  const date=value instanceof Date?value:parseDate(value);
  if(!date||Number.isNaN(date.getTime()))return null;
  const utc=Date.UTC(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds(),date.getMilliseconds());
  return utc/86400000+25569;
}
// อธิบาย: อ่านวันที่จาก Date object, serial Excel, dd/mm/yyyy, yyyy-mm-dd และปี พ.ศ.
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function parseDate(value){
  if(value===null||value===undefined||value==='')return null;
  if(value instanceof Date&&!Number.isNaN(value.getTime()))return new Date(value.getFullYear(),value.getMonth(),value.getDate(),value.getHours(),value.getMinutes(),value.getSeconds());
  if(typeof value==='number'&&Number.isFinite(value)){
    const parsed=global.XLSX?.SSF?.parse_date_code(value);
    if(parsed)return new Date(parsed.y,parsed.m-1,parsed.d,parsed.H||0,parsed.M||0,Math.floor(parsed.S||0));
  }
  const source=text(value);
  let match=source.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  if(match){let year=+match[3];if(year>2400)year-=543;return new Date(year,+match[2]-1,+match[1],+(match[4]||0),+(match[5]||0),+(match[6]||0));}
  match=source.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})(?:[T\s](\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  if(match){let year=+match[1];if(year>2400)year-=543;return new Date(year,+match[2]-1,+match[3],+(match[4]||0),+(match[5]||0),+(match[6]||0));}
  const parsed=new Date(source);
  return Number.isNaN(parsed.getTime())?null:parsed;
}
// อธิบาย: คำนวณจำนวนวันระหว่างวันที่เริ่มต้นกับวันที่ปลายทาง
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function daysBetween(start,end){if(!start||!end)return null;return Math.max(0,Math.floor((dateOnly(end)-dateOnly(start))/86400000));}
// อธิบาย: จัดกลุ่มอายุค้างเป็น 1-7, 8-15, 16-30, มากกว่า 30 วัน
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function agingRange(days){if(days===null||days===undefined)return'';if(days<=7)return'1 - 7 วัน';if(days<=15)return'8 - 15 วัน';if(days<=30)return'16 - 30 วัน';return'มากกว่า 30 วัน';}
// อธิบาย: normalize สถานะแบบข้อความ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function normalizeStatus(value){return text(value);}
// อธิบาย: ทำ key ของสถานะเพื่อเทียบแบบไม่สนช่องว่าง/case
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function statusKey(value){return text(value).normalize('NFKC').toLowerCase().replace(/\s+/g,'');}
// อธิบาย: คืน array ที่ไม่ซ้ำโดย normalize id ก่อน
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function unique(values){const seen=new Set(),result=[];for(const value of values||[]){const normalized=id(value);if(normalized&&!seen.has(normalized)){seen.add(normalized);result.push(normalized);}}return result;}
// อธิบาย: รวมตัวเลขของ field หนึ่งใน rows
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function sum(rows,field){return (rows||[]).reduce((total,row)=>total+number(row[field]),0);}
// อธิบาย: แตกข้อความเป็นบรรทัด รองรับ BOM ตอนต้นไฟล์
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function textLines(value){return String(value||'').replace(/^\uFEFF/,'').split(/\r?\n/);}
// อธิบาย: ลบอักขระต้องห้ามของชื่อไฟล์ Windows
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function safeFileName(value){return text(value).replace(/[\\/:*?"<>|]+/g,'_');}

// อธิบาย: อ่านไฟล์ Excel ด้วย XLSX library และเลือกเก็บ source buffer ได้
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function readWorkbook(file,preserveSource=false){const buffer=await file.arrayBuffer();const workbook=global.XLSX.read(buffer,{type:'array',cellDates:true,cellNF:false,cellStyles:false,dense:true});if(preserveSource)workbook.__sourceBuffer=buffer;return workbook;}
// อธิบาย: แปลง worksheet เป็น matrix สองมิติแบบ raw
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function sheetMatrix(worksheet){return global.XLSX.utils.sheet_to_json(worksheet,{header:1,raw:true,defval:null,blankrows:false});}
// อธิบาย: สร้าง map จาก header name ไป column index
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function headerMap(row){const map={};(row||[]).forEach((value,index)=>{const key=headerKey(value);if(key&&!Object.prototype.hasOwnProperty.call(map,key))map[key]=index;});return map;}
// อธิบาย: ค้นหา row ที่มี header ตามที่ต้องการภายในช่วง row แรก ๆ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function findHeaderInMatrix(matrix,required,maxRows=60){const requirements=(required||[]).map(headerKey);for(let rowIndex=0;rowIndex<Math.min(matrix.length,maxRows);rowIndex++){const map=headerMap(matrix[rowIndex]||[]);if(requirements.every(key=>Object.prototype.hasOwnProperty.call(map,key)))return{rowIndex,map};}return null;}
// อธิบาย: เลือก sheet ที่มี header required โดยให้ชื่อ preferred มาก่อน
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function findSheet(workbook,preferred,required){
  if(!workbook)return null;
  const preferredNames=(Array.isArray(preferred)?preferred:[preferred]).filter(Boolean);
  const ordered=[...workbook.SheetNames].sort((left,right)=>{
    const leftIndex=preferredNames.findIndex(name=>rawKey(name)===rawKey(left));
    const rightIndex=preferredNames.findIndex(name=>rawKey(name)===rawKey(right));
    return(leftIndex<0?999:leftIndex)-(rightIndex<0?999:rightIndex);
  });
  for(const name of ordered){const matrix=sheetMatrix(workbook.Sheets[name]);const found=findHeaderInMatrix(matrix,required);if(found)return{name,matrix,...found};}
  return null;
}
// อธิบาย: หา sheet จากชื่อแบบ normalize
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function findNamedSheet(workbook,name){if(!workbook)return null;const foundName=workbook.SheetNames.find(sheetName=>rawKey(sheetName)===rawKey(name));return foundName?{name:foundName,matrix:sheetMatrix(workbook.Sheets[foundName])}:null;}
// อธิบาย: อ่านค่า key/value จาก sheet _Audit
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function auditValue(workbook,key){
  const audit=findNamedSheet(workbook,'_Audit');
  if(!audit)return'';
  const wanted=rawKey(key);
  for(const row of audit.matrix||[]){if(rawKey(row?.[0])===wanted)return text(row?.[1]);}
  return'';
}
// อธิบาย: อ่าน version ที่สร้าง Master จาก _Audit หรือ workbook properties
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function masterEngineVersion(workbook){return auditValue(workbook,'Version')||text(workbook?.Props?.Subject).replace(/^BLACKWOLF\s*/i,'');}
// อธิบาย: กันการใช้ Master เวอร์ชันเก่าที่รู้ว่ามีปัญหา Status/PV
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function assertMasterVersionSafe(workbook){
  const version=masterEngineVersion(workbook);
  if(version==='3.5.1'||version==='3.5.2')throw new Error(`Master ถูกสร้างด้วย BLACKWOLF V${version} ซึ่งมีปัญหา Status/PV เดิม กรุณาใช้ไฟล์ Manual V2.5.3 ที่ตรวจสอบแล้ว หรือ Master V3.5.4 ขึ้นไป`);
  return version;
}
// อธิบาย: อ่านค่า cell จาก row ด้วย header map
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function valueAt(row,map,name){const index=map[headerKey(name)];return index===undefined?null:row[index];}
// อธิบาย: อ่านค่าจากหลาย header ที่เป็น alias แล้วคืนตัวแรกที่เจอ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function firstValue(row,map,names){for(const name of names){const index=map[headerKey(name)];if(index!==undefined)return row[index];}return null;}
// อธิบาย: เดา role จากชื่อไฟล์เฉพาะกรณีโครงสร้างแยกยาก เช่น SM/Blacklist
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function fileNameHint(fileName){
  const name=text(fileName).toLowerCase();
  if(/black\s*list|blacklist|บัญชีดำ/.test(name))return'blacklist';
  if(/ข้อมูลไม่สมบูรณ์|(^|[ _-])sm([ _.-]|$)/.test(name))return'sm';
  if(/m190|prd008|premium by policy/.test(name))return'm190';
  if(/เช็คสถานะ.*issue|check.*issue|status.*issue/.test(name))return'issue';
  if(/รายงานงานประกันแรงงานต่างด้าว|daily\s*report|daily/.test(name))return'daily';
  if(/เช็คกรมธรรม์ต่างด้าวที่ยังไม่ออก|master/.test(name))return'master';
  return null;
}
// อธิบาย: ตรวจบทบาท workbook จาก sheet/header ไม่พึ่งชื่อไฟล์เป็นหลัก
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function detectWorkbookRole(workbook,fileName=''){
  const matches=[];
  const namedData=findNamedSheet(workbook,'Data');
  const masterAw=namedData&&findHeaderInMatrix(namedData.matrix,['ProposalID','CreateDate','Date','สถานะไม่ issue']);
  const masterAo=namedData&&findHeaderInMatrix(namedData.matrix,MASTER_AO_HEADERS);
  if(masterAw)return{role:'master',matches:[{role:'master',score:100,reason:'พบ Sheet Data โครงสร้าง Master A:W และ Date'}],message:'พบ Sheet Data โครงสร้าง Master A:W และ Date'};
  if(masterAo)return{role:'master',matches:[{role:'master',score:97,reason:'พบ Sheet Data โครงสร้าง Master A:O'}],message:'พบ Sheet Data โครงสร้าง Master A:O'};
  const namedCheck=findNamedSheet(workbook,'Check');
  const namedEtl=findNamedSheet(workbook,'ETL');
  if(namedData&&namedCheck&&namedEtl&&findHeaderInMatrix(namedCheck.matrix,['Check P-ID'])&&findHeaderInMatrix(namedEtl.matrix,['Policy','Group']))matches.push({role:'issue',score:100,reason:'พบ Sheet Data + Check + ETL'});
  const policyDetail=findNamedSheet(workbook,'Policy Detail');
  if(policyDetail&&findHeaderInMatrix(policyDetail.matrix,['Prop Id']))matches.push({role:'m190',score:95,reason:'พบ Sheet Policy Detail และ Prop Id'});
  if(namedData&&findHeaderInMatrix(namedData.matrix,DAILY_HEADERS))matches.push({role:'daily',score:88,reason:'พบ Header Daily Report ครบใน Sheet Data'});
  const control=findSheet(workbook,workbook.SheetNames,['CPROP_ID'])||findSheet(workbook,workbook.SheetNames,['Prop ID']);
  if(control){
    const hint=fileNameHint(fileName);
    if(hint==='sm'||workbook.SheetNames.some(name=>/ข้อมูลไม่สมบูรณ์|(^|\s)sm(\s|$)/i.test(name)))matches.push({role:'sm',score:92,reason:`พบ CPROP_ID / Prop ID ใน ${control.name}`});
    if(hint==='blacklist'||workbook.SheetNames.some(name=>/black\s*list|blacklist|บัญชีดำ/i.test(name)))matches.push({role:'blacklist',score:92,reason:`พบ CPROP_ID / Prop ID ใน ${control.name}`});
    if(!matches.some(match=>match.role==='sm'||match.role==='blacklist'))matches.push({role:'control-ambiguous',score:60,reason:`พบ CPROP_ID / Prop ID แต่แยก SM/Blacklist ไม่ได้`});
  }
  const priority={issue:6,m190:4,daily:3,sm:2,blacklist:2,'control-ambiguous':1};
  matches.sort((a,b)=>b.score-a.score||(priority[b.role]||0)-(priority[a.role]||0));
  if(!matches.length)return{role:null,matches:[],message:'ไม่พบโครงสร้างไฟล์ที่ระบบรองรับ'};
  const top=matches[0];
  const competing=matches.filter(match=>match.role!==top.role&&match.score===top.score);
  if(top.role==='control-ambiguous'||competing.length)return{role:null,matches,message:'โครงสร้างไฟล์ไม่ชัดเจน กรุณาตรวจชื่อ Sheet/ชื่อไฟล์'};
  return{role:top.role,matches,message:top.reason};
}

// อธิบาย: แปลง row matrix เป็น object ตาม header map และ header ที่ต้องการ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function rowFromMap(row,map,source){
  const certificateNo=text(valueAt(row,map,'CertificateNo'));
  const createDate=parseDate(valueAt(row,map,'CreateDate'));
  const storedDate=parseDate(valueAt(row,map,'Date'));
  return{
    AgencyCode:text(valueAt(row,map,'AgencyCode')),
    Mticode:text(valueAt(row,map,'Mticode')),
    AgencyName:text(valueAt(row,map,'AgencyName')),
    RequestCode:id(valueAt(row,map,'RequestCode')),
    employeeName:text(valueAt(row,map,'employeeName')),
    alienCode:id(valueAt(row,map,'alienCode')),
    alienNameEn:text(valueAt(row,map,'alienNameEn')),
    CertificateNo:certificateNo,
    Policy:text(firstValue(row,map,['Policy','PolicyNo']))||(certificateNo.length>=8?certificateNo.slice(0,8):''),
    TotalPremium:number(valueAt(row,map,'TotalPremium')),
    ProposalID:id(valueAt(row,map,'ProposalID')),
    CreateDate:createDate,
    Status:normalizeStatus(valueAt(row,map,'Status')),
    EPropID:id(valueAt(row,map,'EPropID')),
    Discount:text(valueAt(row,map,'Discount')),
    StoredDate:storedDate,
    ExistingIncompleteStatus:text(valueAt(row,map,'สถานะไม่สมบูรณ์')),
    ExistingBlacklistStatus:text(valueAt(row,map,'สถานะ Blacklist.')),
    ExistingMenuEProblem:text(valueAt(row,map,'ติดปัญหาไม่เข้าในเมนู E')),
    ExistingPendingStatus:text(valueAt(row,map,'สถานะไม่ issue')),
    DataSource:source
  };
}
// อธิบาย: ดึงข้อมูล Data จาก Master เดิมและ normalize column
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function extractMasterData(workbook){
  const found=findSheet(workbook,['Data'],['ProposalID','CreateDate']);
  if(!found)return{rows:[],found:null,invalidRows:0};
  const rows=[];let invalidRows=0;
  for(let index=found.rowIndex+1;index<found.matrix.length;index++){
    const sourceRow=found.matrix[index]||[];
    const row=rowFromMap(sourceRow,found.map,'Master Carry Forward');
    if(!row.ProposalID)continue;
    if(!row.CreateDate&&row.StoredDate)row.CreateDate=row.StoredDate;
    if(!row.CreateDate)invalidRows++;
    rows.push(row);
  }
  return{rows,found,invalidRows};
}
// อธิบาย: หาวันล่าสุดใน Master เพื่อใช้เป็น start date ต่อเนื่อง
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function extractMasterMaxDate(workbook){
  const found=findSheet(workbook,['Data'],['ProposalID','Date']);
  if(!found)return{date:null,found:null,validRows:0};
  let maxDate=null,validRows=0;
  for(let index=found.rowIndex+1;index<found.matrix.length;index++){
    const row=found.matrix[index]||[];
    if(!id(valueAt(row,found.map,'ProposalID')))continue;
    const date=parseDate(valueAt(row,found.map,'Date'));
    if(!date)continue;
    validRows++;
    const normalized=dateOnly(date);
    if(!maxDate||normalized>maxDate)maxDate=normalized;
  }
  return{date:maxDate,found,validRows};
}
// อธิบาย: ดึงข้อมูล Daily Report รอบปัจจุบัน
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function extractDaily(workbook){
  const found=findSheet(workbook,['Data'],DAILY_HEADERS);
  if(!found)throw new Error('Daily Report: ไม่พบ Sheet/Header ที่ต้องใช้');
  const allDates=[],raw=[];
  for(let index=found.rowIndex+1;index<found.matrix.length;index++){
    const sourceRow=found.matrix[index]||[];
    const date=parseDate(valueAt(sourceRow,found.map,'CreateDate'));
    if(date)allDates.push(dateOnly(date));
    raw.push(sourceRow);
  }
  if(!allDates.length)throw new Error('Daily Report: ไม่พบ CreateDate ที่อ่านได้');
  allDates.sort((left,right)=>left-right);
  return{found,raw,minDate:allDates[0],maxDate:allDates[allDates.length-1],validDateRows:allDates.length,worksheetRows:raw.length};
}
// อธิบาย: กรอง Daily ให้เหลือรายการที่ควรเข้าสู่ flow pending
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function filterDailyRows(daily,startDate,endDate){
  const rows=[];let skippedStatus=0,skippedDate=0,skippedNoProposal=0,blankStatusRows=0;
  for(const sourceRow of daily.raw){
    const createDate=parseDate(valueAt(sourceRow,daily.found.map,'CreateDate'));
    if(!createDate||dateOnly(createDate)<startDate||dateOnly(createDate)>endDate){skippedDate++;continue;}
    const sourceStatus=normalizeStatus(valueAt(sourceRow,daily.found.map,'Status'));
    if(!ALLOWED_STATUS_KEYS.has(statusKey(sourceStatus))){skippedStatus++;continue;}
    if(sourceStatus==='')blankStatusRows++;
    const row=rowFromMap(sourceRow,daily.found.map,'Daily Report');
    if(!row.ProposalID){skippedNoProposal++;continue;}
    rows.push(row);
  }
  return{rows,skippedStatus,skippedDate,skippedNoProposal,blankStatusRows};
}
// อธิบาย: ดึงชุดรหัสจาก workbook ตาม header ที่กำหนด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function extractIds(workbook,preferred,headers){
  const candidates=Array.isArray(headers)?headers:[headers];
  for(const header of candidates){
    const found=findSheet(workbook,preferred,[header]);
    if(!found)continue;
    const ids=[];
    for(let index=found.rowIndex+1;index<found.matrix.length;index++){const value=id(valueAt(found.matrix[index]||[],found.map,header));if(value)ids.push(value);}
    return{ids,found};
  }
  return{ids:[],found:null};
}
// อธิบาย: ดึง control IDs จาก SM/Blacklist/other control sheets
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function extractControlIds(workbook,preferred){return extractIds(workbook,preferred,['CPROP_ID','Prop ID','ProposalID']);}
// อธิบาย: ดึง Auto-Mail 7.2 / ETL จาก ISSUE workbook เดิมถ้ามี
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function extractIssueEtl(workbook){
  const found=findSheet(workbook,['ETL'],['Policy','Group']);
  if(!found)return{records:[],found:null};
  const records=[];
  for(let index=found.rowIndex+1;index<found.matrix.length;index++){
    const row=found.matrix[index]||[];
    const propId=id(firstValue(row,found.map,['Prop ID','CPROP_ID','ProposalID']));
    if(!propId)continue;
    records.push({No:number(firstValue(row,found.map,['No']))||records.length+1,PropId:propId,Policy:text(firstValue(row,found.map,['Policy'])),Group:text(firstValue(row,found.map,['Group']))});
  }
  return{records,found};
}
// อธิบาย: ดึง Check/M190 จาก ISSUE workbook
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function extractIssueCheck(workbook){return extractIds(workbook,['Check'],['Check P-ID']);}
// อธิบาย: อ่านข้อความ Auto-Mail 7.2 รูปแบบ No.PropID:Policy:Group เป็น record
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function parseEtl(value){
  const records=[],errors=[],seen=new Set();let duplicates=0;
  textLines(value).forEach((line,index)=>{
    if(!line.trim())return;
    const match=line.match(/^\s*(\d+)\.(\d+)\s*:\s*([^:]+)\s*:\s*(.+?)\s*$/);
    if(!match){errors.push({line:index+1,value:line});return;}
    const propId=id(match[2]);
    if(seen.has(propId))duplicates++;else seen.add(propId);
    records.push({No:Number(match[1]),PropId:propId,Policy:text(match[3]),Group:text(match[4])});
  });
  return{records,errors,duplicates,valid:records.length,invalid:errors.length,unique:seen.size};
}
// อธิบาย: สร้างลายเซ็นของ row เพื่อช่วยตรวจ duplicate เชิงข้อมูล
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function rowFingerprint(row){return [row.AgencyCode,row.Mticode,row.AgencyName,row.RequestCode,row.employeeName,row.alienCode,row.alienNameEn,row.CertificateNo,row.Policy,number(row.TotalPremium).toFixed(2),row.ProposalID,row.CreateDate?dateTimeText(row.CreateDate):'',row.Status,row.EPropID,row.Discount].map(value=>text(value).normalize('NFKC')).join('\u241F');}
// อธิบาย: สร้าง token ระบุตัวตนที่เสถียรจากข้อมูลสำคัญ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function stableIdentityToken(value){return text(value).normalize('NFKC').replace(/\s+/g,'').toUpperCase();}
// อธิบาย: ตรวจว่า token มีข้อมูลพอจะใช้เทียบ carry-forward ได้หรือไม่
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function usableStableIdentity(value){const token=stableIdentityToken(value);if(!token)return false;const blocked=new Set(['-','–','—','N/A','NA','NULL','UNDEFINED','(BLANK)','NONE','UNKNOWN','ไม่มี','ไม่ระบุ','ไม่ทราบ','0','00','000','0000','00000','000000']);return!blocked.has(token)&&!/^0+$/.test(token);}
// อธิบาย: สร้าง identity ของ row จาก CertificateNo หรือ alienCode+ProposalID ตามกฎ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function rowStableIdentity(row){
  const certificate=stableIdentityToken(row?.CertificateNo);
  if(usableStableIdentity(certificate)&&!/^[\-–—]+$/.test(certificate))return`CERT\u241F${certificate}`;
  const alien=stableIdentityToken(row?.alienCode),proposal=id(row?.ProposalID);
  if(usableStableIdentity(alien)&&proposal)return`ALIEN_PROP\u241F${alien}\u241F${proposal}`;
  return'';
}
// อธิบาย: เลือกวันที่เก่าที่สุดจากกลุ่ม row เพื่อรักษาอายุค้างเดิม
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function earliestDateValue(...values){let earliest=null;for(const value of values){const parsed=parseDate(value);if(parsed&&(!earliest||parsed<earliest))earliest=parsed;}return earliest;}
// อธิบาย: รวม row ที่เป็นคน/รายการเดียวกันให้เหลือ record ที่ถูกต้องกว่า
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function mergeIdentityRows(existing,incoming,{refreshed=false}={}){
  const merged={...existing,...incoming};
  const preserveWhenIncomingBlank=['AgencyCode','Mticode','AgencyName','RequestCode','employeeName','alienCode','alienNameEn','CertificateNo','Policy','ProposalID','EPropID','Discount'];
  for(const field of preserveWhenIncomingBlank)if(!hasValue(incoming?.[field])&&hasValue(existing?.[field]))merged[field]=existing[field];
  merged.CreateDate=parseDate(incoming?.CreateDate)||parseDate(existing?.CreateDate);
  merged.StoredDate=earliestDateValue(existing?.StoredDate,incoming?.StoredDate)||null;
  merged.ExistingIncompleteStatus=text(existing?.ExistingIncompleteStatus)||text(incoming?.ExistingIncompleteStatus);
  merged.ExistingBlacklistStatus=text(existing?.ExistingBlacklistStatus)||text(incoming?.ExistingBlacklistStatus);
  merged.ExistingMenuEProblem=text(existing?.ExistingMenuEProblem)||text(incoming?.ExistingMenuEProblem);
  merged.ExistingPendingStatus=text(existing?.ExistingPendingStatus)||text(incoming?.ExistingPendingStatus);
  merged.DataSource=refreshed?'Master Carry Forward + Daily Refresh':(incoming?.DataSource||existing?.DataSource||'');
  return merged;
}
// อธิบาย: วิเคราะห์ duplicate จาก stable identity สำหรับ QA/summary
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function analyzeStableDuplicateRows(rows){
  const counts=new Map();
  for(const row of rows||[]){const key=rowStableIdentity(row);if(key)counts.set(key,(counts.get(key)||0)+1);}
  let duplicateKeys=0,duplicateRows=0,extraRows=0;
  for(const count of counts.values())if(count>1){duplicateKeys++;duplicateRows+=count;extraRows+=count-1;}
  return{duplicateKeys,duplicateRows,extraRows};
}
// อธิบาย: วิเคราะห์ alienCode ซ้ำเพื่อเตือนความเสี่ยงข้อมูลซ้ำ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function analyzeAlienDuplicates(rows){
  const counts=new Map();
  for(const row of rows||[]){const code=stableIdentityToken(row?.alienCode);if(usableStableIdentity(code))counts.set(code,(counts.get(code)||0)+1);}
  const codes=[];let duplicateRowCount=0;
  for(const [alienCode,count] of counts)if(count>1){codes.push({alienCode,count});duplicateRowCount+=count;}
  codes.sort((left,right)=>right.count-left.count||left.alienCode.localeCompare(right.alienCode));
  return{duplicateCodeCount:codes.length,duplicateRowCount,codes};
}
// อธิบาย: รวม Master เก่ากับ Daily ใหม่ แล้วตัดรายการที่ออกกรมธรรม์/อยู่ control list
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function reconcileRows(carriedRows,dailyRows){
  const result=[],stableIndex=new Map(),unstableCarriedCounts=new Map();
  let masterDuplicatesCollapsed=0;
  for(const row of carriedRows||[]){
    const stableKey=rowStableIdentity(row);
    if(stableKey){
      if(stableIndex.has(stableKey)){const index=stableIndex.get(stableKey);result[index]=mergeIdentityRows(result[index],row);masterDuplicatesCollapsed++;}
      else{stableIndex.set(stableKey,result.length);result.push(row);}
      continue;
    }
    const fingerprint=rowFingerprint(row);unstableCarriedCounts.set(fingerprint,(unstableCarriedCounts.get(fingerprint)||0)+1);result.push(row);
  }
  const masterRowsAfterIdentity=result.length,dailyStableRows=[],dailyStableIndex=new Map(),dailyUnstableRows=[];
  let dailyDuplicatesCollapsed=0;
  for(const row of dailyRows||[]){
    const stableKey=rowStableIdentity(row);
    if(stableKey){
      if(dailyStableIndex.has(stableKey)){const index=dailyStableIndex.get(stableKey);dailyStableRows[index]=mergeIdentityRows(dailyStableRows[index],row);dailyDuplicatesCollapsed++;}
      else{dailyStableIndex.set(stableKey,dailyStableRows.length);dailyStableRows.push(row);}
    }else dailyUnstableRows.push(row);
  }
  let skippedAlreadyCarried=0,added=0,refreshedFromDaily=0;
  for(const row of dailyStableRows){
    const key=rowStableIdentity(row);
    if(stableIndex.has(key)){const index=stableIndex.get(key);result[index]=mergeIdentityRows(result[index],row,{refreshed:true});skippedAlreadyCarried++;refreshedFromDaily++;}
    else{stableIndex.set(key,result.length);result.push(row);added++;}
  }
  const seenDailyUnstable=new Map();
  for(const row of dailyUnstableRows){
    const fingerprint=rowFingerprint(row),occurrence=(seenDailyUnstable.get(fingerprint)||0)+1;seenDailyUnstable.set(fingerprint,occurrence);
    if(occurrence<=(unstableCarriedCounts.get(fingerprint)||0)){skippedAlreadyCarried++;continue;}
    result.push(row);added++;
  }
  return{rows:result,added,skippedAlreadyCarried,refreshedFromDaily,masterDuplicatesCollapsed,dailyDuplicatesCollapsed,masterRowsAfterIdentity,dailyRowsAfterIdentity:dailyStableRows.length+dailyUnstableRows.length};
}
// อธิบาย: reconcile แบบยึดชุดรหัส ใช้กับ check/control บางประเภท
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function reconcileIdRows(existingIds,newIds){
  const result=[...existingIds],existingCounts=new Map(),seenNew=new Map();
  for(const value of existingIds){const normalized=id(value);if(normalized)existingCounts.set(normalized,(existingCounts.get(normalized)||0)+1);}
  for(const value of newIds){const normalized=id(value);if(!normalized)continue;const occurrence=(seenNew.get(normalized)||0)+1;seenNew.set(normalized,occurrence);if(occurrence>(existingCounts.get(normalized)||0))result.push(normalized);}
  return result;
}
// อธิบาย: หาวันเริ่มต้น/สิ้นสุดของรอบการประมวลผล
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function resolveDateRange(masterInfo,daily,today,manualStartDate){
  const manual=parseDate(manualStartDate);
  const start=masterInfo.date?dateOnly(masterInfo.date):(manual?dateOnly(manual):null);
  if(!start)throw new Error('Master ไม่มี Date ที่อ่านได้ กรุณาระบุวันเริ่มต้นแบบ Manual ก่อน Run');
  const end=daily.maxDate<dateOnly(today)?dateOnly(daily.maxDate):dateOnly(today);
  if(end<start)throw new Error(`ช่วงวันที่ไม่ถูกต้อง: วันเริ่มต้น ${dateKey(start)} มากกว่าวันสิ้นสุด ${dateKey(end)}`);
  return{start,end,mode:masterInfo.date?'MASTER_DATE_T':'MANUAL_START_DATE',historical:false};
}
// อธิบาย: เช็ค field สำคัญที่ขาด เพื่อระบุสถานะไม่สมบูรณ์
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function missingRequiredFields(row){
  const fields=['AgencyCode','AgencyName','RequestCode','alienCode','alienNameEn','CertificateNo','Policy','ProposalID','CreateDate','EPropID','Discount'];
  const missing=fields.filter(field=>!hasValue(row[field]));
  if(!Number.isFinite(Number(row.TotalPremium)))missing.push('TotalPremium');
  return missing;
}
// อธิบาย: จัดประเภท row ค้าง เช่น ไม่สมบูรณ์ Blacklist ติดปัญหา E ไม่ issue
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function classifyPending(rows,issuedIds,smIds,blacklistIds,today){
  const issuedSet=new Set(unique(issuedIds)),smSet=new Set(unique(smIds)),blacklistSet=new Set(unique(blacklistIds));
  const pending=[],removed=[];
  for(const sourceRow of rows){
    const row={...sourceRow};
    if(issuedSet.has(row.ProposalID)){removed.push({...row,RemovalReason:'ออกกรมธรรม์แล้ว'});continue;}
    const missing=missingRequiredFields(row);
    const carriedForward=row.DataSource==='Master Carry Forward';
    const existingIncomplete=statusKey(row.ExistingIncompleteStatus)==='ข้อมูลไม่สมบูรณ์'||statusKey(row.ExistingPendingStatus)==='ข้อมูลไม่สมบูรณ์';
    const existingBlacklist=statusKey(row.ExistingBlacklistStatus)==='blacklist'||statusKey(row.ExistingPendingStatus)==='blacklist';
    const existingMenuE=statusKey(row.ExistingMenuEProblem)==='ติดปัญหาไม่เข้าในเมนูe'||statusKey(row.ExistingPendingStatus)==='ติดปัญหาไม่เข้าในเมนูe';
    const incomplete=smSet.has(row.ProposalID)||existingIncomplete||missing.length>0;
    const blacklist=blacklistSet.has(row.ProposalID)||existingBlacklist;
    const menuE=existingMenuE&&!incomplete&&!blacklist;
    const rowDate=dateOnly(row.StoredDate||row.CreateDate);
    let pendingStatus='รอ Issue';
    if(blacklist)pendingStatus='Blacklist';
    else if(incomplete)pendingStatus='ข้อมูลไม่สมบูรณ์';
    else if(menuE)pendingStatus='ติดปัญหาไม่เข้าในเมนู E';
    const agingDays=daysBetween(rowDate,today);
    pending.push({...row,Date:rowDate,Note:row.CertificateNo.trim().startsWith('-')?'**ตรวจสอบเลขกรมธรรม์**':'',IncompleteStatus:incomplete?'ข้อมูลไม่สมบูรณ์':'',BlacklistStatus:blacklist?'Blacklist':'',MenuEProblem:menuE?'ติดปัญหาไม่เข้าในเมนู E':'',PendingStatus:pendingStatus,AgingDays:agingDays,PendingRange:agingRange(agingDays),MissingFields:missing,WasCarriedForward:carriedForward});
  }
  return{pending,removed,issuedRemoved:removed.length};
}
// อธิบาย: สร้าง key สำหรับ group ข้อมูลใน PV/PV Final
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function pvGroupKey(row){
  return[dateKey(row.Date),text(row.Policy),text(row.Mticode),text(row.AgencyName),id(row.ProposalID),text(row.PendingStatus),row.AgingDays===null||row.AgingDays===undefined?'':String(row.AgingDays),text(row.PendingRange)].join('\u241F');
}
// อธิบาย: รวม rows ตาม key เพื่อทำ pivot-like summary
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function aggregatePvRows(rows){
  const groups=new Map();
  for(const row of rows||[]){
    if(!row||!id(row.ProposalID)||!text(row.PendingStatus))continue;
    const key=pvGroupKey(row);
    if(!groups.has(key))groups.set(key,{Date:dateOnly(row.Date),Policy:text(row.Policy),Mticode:text(row.Mticode),AgencyName:text(row.AgencyName),ProposalID:id(row.ProposalID),PendingStatus:text(row.PendingStatus),AgingDays:row.AgingDays===null||row.AgingDays===undefined?null:Number(row.AgingDays),PendingRange:text(row.PendingRange),TotalPremium:0,SourceRows:0});
    const group=groups.get(key);
    group.TotalPremium+=number(row.TotalPremium);
    group.SourceRows++;
  }
  return[...groups.values()];
}
// อธิบาย: สร้าง summary/KPI ทั้งหมดจาก context หลัง reconcile/classify
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function summarize(context){
  const pending=context.pending,pv=aggregatePvRows(pending);
  return{
    Version:CONFIG.version,
    ProcessedAt:dateTimeText(context.processedAt),
    RunDate:dateKey(context.processedAt),
    RunId:context.runId,
    DateStart:dateKey(context.dateRange.start),
    DateEnd:dateKey(context.dateRange.end),
    DateMode:context.dateRange.mode,
    ReportEarliestDate:dateKey(context.daily.minDate),
    ReportLatestDate:dateKey(context.daily.maxDate),
    ReportWorksheetRows:context.daily.worksheetRows,
    ReportValidDateRows:context.daily.validDateRows,
    DailyRowsAfterDateStatusFilter:context.dailyFiltered.length,
    ReportRowsAfterDateStatusFilter:context.dailyFiltered.length,
    DailyBlankStatusAccepted:context.dailyFilterStats.blankStatusRows,
    DailyRowsAddedToBacklog:context.reconciled.added,
    DailyRowsSkippedAlreadyCarried:context.reconciled.skippedAlreadyCarried,
    DailyRowsRefreshedFromCurrent:context.reconciled.refreshedFromDaily,
    DailyDuplicateRowsCollapsed:context.reconciled.dailyDuplicatesCollapsed,
    DailyRowsAfterStableIdentity:context.reconciled.dailyRowsAfterIdentity,
    MasterRowsCarriedForward:context.masterRows.length,
    MasterDuplicateRowsCollapsed:context.reconciled.masterDuplicatesCollapsed,
    MasterRowsAfterStableIdentity:context.reconciled.masterRowsAfterIdentity,
    StableIdentityRule:'CertificateNo; fallback alienCode + ProposalID',
    M190RawRows:context.m190Ids.length,
    M190PropIdRows:context.m190Ids.length,
    M190UniquePropIds:unique(context.m190Ids).length,
    IssueOldCheckRowsIgnored:context.issueOldCheckRows,
    IssueCheckRowsLoaded:context.checkIds.length,
    IssueOldEtlRowsIgnored:context.issueOldEtlRows,
    IssueEtlRowsLoaded:context.etl.records.length,
    AutoMailRawRows:context.etl.records.length,
    EtlTextRowsLoaded:context.etl.records.length,
    EtlPropIdRows:context.etl.records.length,
    AutoMailUniquePropIds:unique(context.etl.records.map(record=>record.PropId)).length,
    AutoMailDuplicateRows:context.etl.duplicates,
    CurrentIssuedUniquePropIds:context.issuedIds.length,
    IssuedRowsRemoved:context.issuedRemoved,
    SmRowsWritten:context.smIds.length,
    SmUniquePropIds:unique(context.smIds).length,
    BlacklistRowsWritten:context.blIds.length,
    BlacklistUniquePropIds:unique(context.blIds).length,
    PendingRowsWrittenToData:pending.length,
    TotalRows:pending.length,
    TotalPolicies:pv.length,
    TotalPremium:sum(pending,'TotalPremium'),
    PendingPolicies:pv.filter(row=>row.PendingStatus==='รอ Issue').length,
    IncompletePolicies:pv.filter(row=>row.PendingStatus==='ข้อมูลไม่สมบูรณ์').length,
    MenuEPolicies:pv.filter(row=>row.PendingStatus==='ติดปัญหาไม่เข้าในเมนู E').length,
    BlacklistPolicies:pv.filter(row=>row.PendingStatus==='Blacklist').length,
    Age_1_7:pv.filter(row=>row.AgingDays!==null&&row.AgingDays<=7).length,
    Age_8_15:pv.filter(row=>row.AgingDays>7&&row.AgingDays<=15).length,
    Age_16_30:pv.filter(row=>row.AgingDays>15&&row.AgingDays<=30).length,
    Age_Over_30:pv.filter(row=>row.AgingDays>30).length,
    ValidationStatus:'PASSED',
    PremiumReconciled:'YES',
    Engine:'Browser JavaScript + xlsx-js-style',
    PowerShell:'NOT USED',
    ExcelCOM:'NOT USED',
    MasterOutput:`${CONFIG.masterBaseName}_${dateKey(context.processedAt)}.xlsx`,
    IssueOutput:`${CONFIG.issueBaseName}_${dateKey(context.processedAt)}.xlsx`
  };
}

// อธิบาย: สร้าง style border ของ cell ใน Excel
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function border(){return{top:{style:'thin',color:{rgb:COLORS.grid}},bottom:{style:'thin',color:{rgb:COLORS.grid}},left:{style:'thin',color:{rgb:COLORS.grid}},right:{style:'thin',color:{rgb:COLORS.grid}}};}
// อธิบาย: สร้าง style พื้นฐานของ cell
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function baseStyle(extra={}){return{font:{name:'Tahoma',sz:11,color:{rgb:COLORS.black},...(extra.font||{})},fill:extra.fill||{patternType:'solid',fgColor:{rgb:COLORS.white}},border:extra.border===false?undefined:border(),alignment:{horizontal:'center',vertical:'center',wrapText:false,...(extra.alignment||{})},numFmt:extra.numFmt};}
// อธิบาย: สร้าง style หัวตาราง Excel
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function headerStyle(color,sz=11){return baseStyle({font:{bold:true,color:{rgb:COLORS.white},sz},fill:{patternType:'solid',fgColor:{rgb:color}},alignment:{horizontal:'center',vertical:'center',wrapText:true}});}
// อธิบาย: ใส่ style ให้ cell ถ้ามีอยู่
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function setCellStyle(worksheet,row,column,style){const address=global.XLSX.utils.encode_cell({r:row,c:column});if(!worksheet[address])worksheet[address]={t:'s',v:''};worksheet[address].s=style;if(style?.numFmt)worksheet[address].z=style.numFmt;}
// อธิบาย: สร้าง cell สูตรพร้อม style และ cached value
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function setFormulaCell(worksheet,row,column,formula,value,type='s'){const address=global.XLSX.utils.encode_cell({r:row,c:column});worksheet[address]={t:type,f:formula,v:value};}
// อธิบาย: สร้าง cell value พร้อม style/type
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function setValueCell(worksheet,row,column,value,type='s'){const address=global.XLSX.utils.encode_cell({r:row,c:column});worksheet[address]={t:type,v:value};}
// อธิบาย: ไล่ใส่ style ให้ range ตารางใน worksheet
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function applyGridStyles(worksheet,aoa,options={}){
  const headerRows=new Set(options.headerRows||[0]),purpleCols=new Set(options.purpleCols||[]),dateCols=new Set(options.dateCols||[]),moneyCols=new Set(options.moneyCols||[]),textCols=new Set(options.textCols||[]),idCols=new Set(options.idCols||[]);
  for(let row=0;row<aoa.length;row++)for(let column=0;column<(aoa[row]||[]).length;column++){
    if(headerRows.has(row)){setCellStyle(worksheet,row,column,headerStyle(purpleCols.has(column)?COLORS.purple:COLORS.blue));continue;}
    const numFmt=dateCols.has(column)?(options.dateFormat||'dd/mm/yyyy hh:mm:ss'):moneyCols.has(column)?(options.moneyFormat||'#,##0.00'):idCols.has(column)?'@':undefined;
    setCellStyle(worksheet,row,column,baseStyle({alignment:{horizontal:textCols.has(column)?'left':'center',vertical:'center',wrapText:textCols.has(column)},numFmt}));
  }
  worksheet['!rows']=aoa.map((_,index)=>({hpt:headerRows.has(index)?24:20}));
}
// อธิบาย: เพิ่ม worksheet เข้า workbook พร้อมตั้งชื่อ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function addSheet(workbook,name,aoa,widths,options={}){
  const dateCols=new Set(options.dateCols||[]);
  // อธิบาย: ฟังก์ชัน outputAoa เป็นส่วนหนึ่งของ flow ใน engine.js ใช้จัดการขั้นตอนย่อยตามชื่อฟังก์ชันนี้
  // ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้
  const outputAoa=(aoa||[]).map(row=>(row||[]).map((value,column)=>{
    if(!dateCols.has(column))return value;
    const serial=excelSerial(value);
    return serial===null?value:serial;
  }));
  const worksheet=global.XLSX.utils.aoa_to_sheet(outputAoa,{cellDates:false});
  applyGridStyles(worksheet,outputAoa,options);
  worksheet['!cols']=(widths||Array((outputAoa[0]||[]).length).fill(15)).map(width=>({wch:width}));
  if(options.autoFilter&&outputAoa.length)worksheet['!autofilter']={ref:`A1:${global.XLSX.utils.encode_col((outputAoa[0]||[]).length-1)}${outputAoa.length}`};
  global.XLSX.utils.book_append_sheet(workbook,worksheet,name);
  return worksheet;
}
// อธิบาย: สร้างสูตร P:W/คอลัมน์คำนวณของ Data sheet ต่อ row
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function dataRowFormulas(excelRow,run){
  return{
    p:`IF(LEFT(H${excelRow},1)="-","**ตรวจสอบเลขกรมธรรม์**","")`,
    q:`IF(K${excelRow}="","",IF(OR(A${excelRow}="",C${excelRow}="",D${excelRow}="",F${excelRow}="",G${excelRow}="",H${excelRow}="",I${excelRow}="",J${excelRow}="",L${excelRow}="",N${excelRow}="",O${excelRow}=""),"ข้อมูลไม่สมบูรณ์",IFERROR(INDEX('ข้อมูลไม่สมบูรณ์'!$A:$A,MATCH(K${excelRow},'ข้อมูลไม่สมบูรณ์'!$B:$B,0)),"")))`,
    r:`IF(K${excelRow}="","",IFERROR(INDEX('Black List'!$A:$A,MATCH(K${excelRow},'Black List'!$B:$B,0)),""))`,
    t:`IF(L${excelRow}="","",INT(L${excelRow}))`,
    u:`IF(K${excelRow}="","",IF(R${excelRow}="Blacklist","Blacklist",IF(Q${excelRow}="ข้อมูลไม่สมบูรณ์","ข้อมูลไม่สมบูรณ์",IF(S${excelRow}="ติดปัญหาไม่เข้าในเมนู E","ติดปัญหาไม่เข้าในเมนู E","รอ Issue"))))`,
    v:`IF(T${excelRow}="","",MAX(0,DATE(${run.getFullYear()},${run.getMonth()+1},${run.getDate()})-T${excelRow}))`,
    w:`IF(V${excelRow}="","",IF(V${excelRow}<=7,"1 - 7 วัน",IF(V${excelRow}<=15,"8 - 15 วัน",IF(V${excelRow}<=30,"16 - 30 วัน","มากกว่า 30 วัน"))))`
  };
}
// อธิบาย: สร้าง sheet Data ของ Master ใหม่จาก rows ที่ผ่านการคัดแล้ว
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function buildDataSheet(workbook,context){
  const dataRows=context.pending.map(row=>[row.AgencyCode,row.Mticode,row.AgencyName,row.RequestCode,row.employeeName,row.alienCode,row.alienNameEn,row.CertificateNo,row.Policy,row.TotalPremium,row.ProposalID,row.CreateDate,row.Status,row.EPropID,row.Discount,row.Note,row.IncompleteStatus,row.BlacklistStatus,row.MenuEProblem,row.Date,row.PendingStatus,row.AgingDays,row.PendingRange]);
  const aoa=[MASTER_OUTPUT_HEADERS,...dataRows];
  const worksheet=addSheet(workbook,'Data',aoa,[14,13,38,18,38,21,30,18,16,18,16,21,28,20,16,22,28,22,34,13,30,30,30],{purpleCols:[15,16,17,18,19,20,21,22],dateCols:[11,19],moneyCols:[9],idCols:[3,5,10,13],textCols:[2,4,6,12,15,16,17,18,20,22],autoFilter:true});
  worksheet['!freeze']={xSplit:0,ySplit:1};
  const run=context.processedAt;
  for(let index=0;index<context.pending.length;index++){
    const excelRow=index+2,row=context.pending[index],rowIndex=index+1;
    const {p,q,r,t,u,v,w}=dataRowFormulas(excelRow,run);
    setFormulaCell(worksheet,rowIndex,15,p,row.Note,'s');
    setFormulaCell(worksheet,rowIndex,16,q,row.IncompleteStatus,'s');
    setFormulaCell(worksheet,rowIndex,17,r,row.BlacklistStatus,'s');
    setValueCell(worksheet,rowIndex,18,row.MenuEProblem,'s');
    setFormulaCell(worksheet,rowIndex,19,t,row.Date?excelSerial(row.Date):'',row.Date?'n':'s');
    setFormulaCell(worksheet,rowIndex,20,u,row.PendingStatus,'s');
    setFormulaCell(worksheet,rowIndex,21,v,row.AgingDays===null?'':row.AgingDays,row.AgingDays===null?'s':'n');
    setFormulaCell(worksheet,rowIndex,22,w,row.PendingRange,'s');
    for(let column=15;column<=22;column++)setCellStyle(worksheet,rowIndex,column,baseStyle({alignment:{horizontal:column===15||column===16||column===17||column===18||column===20||column===22?'left':'center',wrapText:true},numFmt:column===19?'dd/mm/yyyy':column===21?'0':undefined}));
  }
  worksheet['!ref']=`A1:W${Math.max(1,aoa.length)}`;
  return worksheet;
}
// อธิบาย: สร้าง sheet Check/SM/Blacklist/ETL หรือ control sheets ที่ต้องแนบใน workbook
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function buildControlSheets(workbook,context){
  const sm=[['สถานะ','Prop ID'],...context.smIds.map(value=>['ข้อมูลไม่สมบูรณ์',value])];
  const smSheet=addSheet(workbook,'ข้อมูลไม่สมบูรณ์',sm,[22,22],{idCols:[1],autoFilter:true});
  for(let column=0;column<2;column++)setCellStyle(smSheet,0,column,headerStyle(COLORS.green));
  const blacklist=[['สถานะ','Prop ID'],...context.blIds.map(value=>['Blacklist',value])];
  const blacklistSheet=addSheet(workbook,'Black List',blacklist,[18,22],{idCols:[1],autoFilter:true});
  for(let column=0;column<2;column++)setCellStyle(blacklistSheet,0,column,headerStyle(COLORS.red));
}
// อธิบาย: ปรับ label สำหรับ pivot ให้ค่าว่างเป็น (blank)
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function pivotLabel(value){return hasValue(value)?value:'(blank)';}
// อธิบาย: เตรียม rows สำหรับ PV/PV Final
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function pvRows(context){return aggregatePvRows(context.pending).map(row=>[row.Date,pivotLabel(row.Policy),pivotLabel(row.Mticode),pivotLabel(row.AgencyName),pivotLabel(row.ProposalID),pivotLabel(row.PendingStatus),row.AgingDays===null||row.AgingDays===undefined?'(blank)':row.AgingDays,pivotLabel(row.PendingRange),row.TotalPremium]);}
// อธิบาย: สร้าง PV และ PV Final แบบ workbook ปกติ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function buildPvSheets(workbook,context){
  const headers=['Date','Policy','Mticode','AgencyName','ProposalID','สถานะไม่ issue','จำนวนวันที่ยังไม่ออกกรมธรรม์','ระยะเวลายังไม่ออกกรมธรรม์','Sum of TotalPremium'];
  const rows=pvRows(context);
  const displayedRows=rows.map(row=>[row[0]?excelSerial(row[0]):'',...row.slice(1)]);
  const pv=[['','','','','','','','',''],['Status','(All)','','','','','','',''],['','','','','','','','',''],headers,...displayedRows];
  const pvSheet=global.XLSX.utils.aoa_to_sheet(pv,{cellDates:false});
  pvSheet['!cols']=[{wch:18},{wch:13},{wch:12},{wch:56},{wch:17},{wch:28},{wch:30},{wch:28},{wch:22}];
  for(let row=0;row<pv.length;row++)for(let column=0;column<9;column++){
    let style=baseStyle({numFmt:column===0?'dd/mm/yyyy':column===8?'#,##0':undefined,alignment:{horizontal:column===3?'left':'center',wrapText:column===3}});
    if(row===1&&column===0)style=headerStyle(COLORS.blue);if(row===3)style=headerStyle(COLORS.blue);
    setCellStyle(pvSheet,row,column,style);
  }
  global.XLSX.utils.book_append_sheet(workbook,pvSheet,'PV');
  const finalRows=[headers,...rows];
  return addSheet(workbook,'PV Final',finalRows,[18,13,12,56,17,28,30,28,22],{dateCols:[0],dateFormat:'dd/mm/yyyy',moneyCols:[8],moneyFormat:'#,##0',idCols:[4],textCols:[3,5,7],autoFilter:true});
}
// อธิบาย: group rows ตามช่วง aging
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function groupByAging(rows){
  const pv=aggregatePvRows(rows),order=['1 - 7 วัน','8 - 15 วัน','16 - 30 วัน','มากกว่า 30 วัน'];
  return order.map((label,index)=>{const subset=pv.filter(row=>row.PendingRange===label);return[index+1,label,subset.length,sum(subset,'TotalPremium')];}).filter(row=>row[2]>0);
}
// อธิบาย: group rows ตามสถานะ เพื่อใช้ report
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function groupStatusRows(rows,status){
  const groups=new Map();
  for(const row of aggregatePvRows(rows).filter(item=>item.PendingStatus===status)){
    const key=dateKey(row.Date);
    if(!groups.has(key))groups.set(key,{date:row.Date,aging:row.AgingDays,rows:[]});
    groups.get(key).rows.push(row);
  }
  return[...groups.values()].sort((left,right)=>(left.date||0)-(right.date||0)).map(group=>[group.date,group.aging,group.rows.length,sum(group.rows,'TotalPremium')]);
}
// อธิบาย: สร้าง Report sheet แบบ native worksheet
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function buildReportSheet(workbook,context,summary){
  const reportRows=aggregatePvRows(context.pending),aoa=[],merges=[],styles=[];
  // อธิบาย: ฟังก์ชัน add เป็นส่วนหนึ่งของ flow ใน engine.js ใช้จัดการขั้นตอนย่อยตามชื่อฟังก์ชันนี้
  // ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้
  const add=(row,style=null)=>{aoa.push(row);styles.push(style);};
  // อธิบาย: ฟังก์ชัน title เป็นส่วนหนึ่งของ flow ใน engine.js ใช้จัดการขั้นตอนย่อยตามชื่อฟังก์ชันนี้
  // ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้
  const title=(label,color)=>{const row=aoa.length;add([label,'','',''],{type:'title',color});merges.push({s:{r:row,c:0},e:{r:row,c:3}});};
  title('สถานะไม่ ISSUE.',COLORS.reportBlue);
  add(['ยอดเงินที่ยังไม่ Issue','',summary.TotalPremium,'บาท'],{type:'kpiMoney'});
  add(['จำนวนกรมธรรม์','',summary.TotalPolicies,'กรมธรรม์'],{type:'kpiCount'});
  add([]);
  title('จำนวนวันที่ยังไม่ออกกรมธรรม์',COLORS.green);
  add(['No.','ระยะเวลายังไม่ออกกรมธรรม์','Count of Policy','TotalPremium'],{type:'header',color:COLORS.green});
  for(const row of groupByAging(reportRows))add(row,{type:'agingBody'});
  add(['Grand Total','',summary.TotalPolicies,summary.TotalPremium],{type:'grand',color:COLORS.green});
  const sections=[['รอ Issue','รายการที่รอ ISSUE.',COLORS.reportBlue],['ติดปัญหาไม่เข้าในเมนู E','รายการติดปัญหาไม่เอาเข้าเมนู E',COLORS.orange],['ข้อมูลไม่สมบูรณ์','รายการข้อมูลไม่สมบูรณ์',COLORS.darkPurple],['Blacklist','สถานะ Blacklist.',COLORS.red]];
  for(const [status,label,color] of sections){
    const grouped=groupStatusRows(reportRows,status);
    if(!grouped.length)continue;
    add([]);title(label,color);add(['Date','จำนวนวันที่ยังไม่ออกกรมธรรม์','Count of Policy','ผลรวม'],{type:'header',color});
    for(const row of grouped)add([excelSerial(row[0]),row[1],row[2],row[3]],{type:'statusBody'});
    const subset=reportRows.filter(item=>item.PendingStatus===status);
    add(['Grand Total','',subset.length,sum(subset,'TotalPremium')],{type:'grand',color});
  }
  const worksheet=global.XLSX.utils.aoa_to_sheet(aoa,{cellDates:false});
  worksheet['!cols']=[{wch:23},{wch:34},{wch:17},{wch:18}];worksheet['!merges']=merges;worksheet['!rows']=aoa.map((_,index)=>({hpt:styles[index]?.type==='title'?30:20}));
  for(let row=0;row<aoa.length;row++)for(let column=0;column<4;column++){
    const meta=styles[row]||{};let style=baseStyle({border:meta.type?undefined:false});
    if(meta.type==='title')style=headerStyle(meta.color,20);else if(meta.type==='header')style=headerStyle(meta.color,12);else if(meta.type==='grand'){style=headerStyle(meta.color,10);style.numFmt=column===2?'0':column===3?'#,##0':undefined;}else if(meta.type==='kpiMoney')style=baseStyle({font:{sz:column===0?14:11},numFmt:column===2?'#,##0':undefined});else if(meta.type==='kpiCount')style=baseStyle({font:{sz:column===0?14:11},numFmt:column===2?'0':undefined});else if(meta.type==='agingBody')style=baseStyle({numFmt:column===0||column===2?'0':column===3?'#,##0':undefined});else if(meta.type==='statusBody')style=baseStyle({numFmt:column===0?'dd/mm/yyyy':column===1||column===2?'0':column===3?'#,##0':undefined});
    setCellStyle(worksheet,row,column,style);
  }
  global.XLSX.utils.book_append_sheet(workbook,worksheet,'Report');
  return worksheet;
}
// อธิบาย: สร้าง _Audit sheet เก็บ version/summary/removed rows
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function buildAuditSheet(workbook,summary,removedRows=[]){
  const aoa=[['Key','Value'],...Object.entries(summary),[],['REMOVED ISSUED ROWS',''],['ProposalID','Source'],...removedRows.map(row=>[row.ProposalID,row.DataSource||''])];
  const worksheet=global.XLSX.utils.aoa_to_sheet(aoa);
  worksheet['!cols']=[{wch:42},{wch:68}];
  for(let row=0;row<aoa.length;row++)for(let column=0;column<2;column++)setCellStyle(worksheet,row,column,row===0||aoa[row]?.[0]==='ProposalID'?headerStyle(COLORS.blue):baseStyle({alignment:{horizontal:'left'}}));
  global.XLSX.utils.book_append_sheet(workbook,worksheet,'_Audit');
}
// อธิบาย: ตั้ง metadata ของ workbook เช่น Title/Subject/Created
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function setWorkbookProperties(workbook,title,processedAt){
  workbook.Props={Title:title,Subject:`BLACKWOLF ${CONFIG.version}`,Author:'BLACKWOLF Browser Engine',CreatedDate:processedAt,ModifiedDate:processedAt};
  workbook.Workbook=workbook.Workbook||{};
  workbook.CalcPr={calcMode:'auto',fullCalcOnLoad:true,forceFullCalc:true};
}
// อธิบาย: สร้าง Master workbook แบบไม่ใช้ template pivot preserving
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function buildMasterWorkbook(context,summary){
  const workbook=global.XLSX.utils.book_new();
  buildDataSheet(workbook,context);buildControlSheets(workbook,context);buildPvSheets(workbook,context);buildReportSheet(workbook,context,summary);buildAuditSheet(workbook,summary,context.removedRows);
  setWorkbookProperties(workbook,'เช็คกรมธรรม์ต่างด้าวที่ยังไม่ออก - BLACKWOLF Web Master',context.processedAt);
  workbook.Workbook.Views=[{activeTab:5}];
  workbook.Workbook.Sheets=workbook.SheetNames.map(name=>({name,Hidden:name==='_Audit'?1:0}));
  return workbook;
}
// อธิบาย: สร้าง ISSUE workbook พร้อม Data/Check/ETL
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function buildIssueWorkbook(context,summary){
  const workbook=global.XLSX.utils.book_new(),issuedSet=new Set(context.issuedIds);
  const issueRows=context.dailyFiltered.map(row=>[row.AgencyCode,row.Mticode,row.AgencyName,row.RequestCode,row.employeeName,row.alienCode,row.alienNameEn,row.CertificateNo,row.Policy,row.TotalPremium,row.ProposalID,row.CreateDate,row.Status,row.EPropID,row.Discount,issuedSet.has(row.ProposalID)?'ออกกรมธรรม์':'#N/A']);
  addSheet(workbook,'Data',[ISSUE_HEADERS,...issueRows],[14,13,38,18,38,21,30,18,16,18,16,21,28,20,16,18],{dateCols:[11],moneyCols:[9],idCols:[3,5,10,13],textCols:[2,4,6,12,15],autoFilter:true});
  const checkRows=[['Check P-ID','ออกกรมธรรม์'],...context.checkIds.map(value=>[value,'ออกกรมธรรม์'])];
  addSheet(workbook,'Check',checkRows,[22,20],{idCols:[0],autoFilter:true});
  const etlRows=[['No','Prop - ID','Policy','Group'],...context.etl.records.map((record,index)=>[record.No||index+1,record.PropId,record.Policy,record.Group])];
  addSheet(workbook,'ETL',etlRows,[10,22,18,18],{idCols:[1],autoFilter:true});
  buildAuditSheet(workbook,{Version:CONFIG.version,RunId:summary.RunId,ProcessedAt:summary.ProcessedAt,OldCheckRowsIgnored:context.issueOldCheckRows,OldEtlRowsIgnored:context.issueOldEtlRows,CurrentM190Rows:context.m190Ids.length,CurrentAutoMailRows:context.etl.records.length,CurrentCheckRows:context.checkIds.length,CurrentDataRows:context.dailyFiltered.length},[]);
  setWorkbookProperties(workbook,'เช็คสถานะ ISSUE - BLACKWOLF Web Working File',context.processedAt);
  workbook.Workbook.Views=[{activeTab:0}];
  workbook.Workbook.Sheets=workbook.SheetNames.map(name=>({name,Hidden:name==='_Audit'?1:0}));
  return workbook;
}
// อธิบาย: เขียน workbook object เป็น Blob .xlsx
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function workbookBlob(workbook){const bytes=global.XLSX.write(workbook,{bookType:'xlsx',type:'array',compression:true,cellDates:false,cellStyles:true});return new Blob([bytes],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});}
// อธิบาย: escape XML special characters ก่อน patch ไฟล์ .xlsx ภายใน ZIP
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function xmlEscape(value){return String(value===null||value===undefined?'':value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');}
// อธิบาย: escape string เพื่อใส่ใน RegExp อย่างปลอดภัย
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function regexEscape(value){return String(value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
// อธิบาย: แปลง index column เป็นชื่อ Excel column เช่น 0=A, 27=AB
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function columnName(index){let value=index+1,name='';while(value){const remainder=(value-1)%26;name=String.fromCharCode(65+remainder)+name;value=Math.floor((value-1)/26);}return name;}
// อธิบาย: อ่าน style id ของ cell จาก worksheet XML
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function xmlCellStyle(sheetXml,reference,fallback='0'){
  const match=sheetXml.match(new RegExp(`<c\\b(?=[^>]*\\br="${regexEscape(reference)}")[^>]*>`));
  if(!match)return fallback;
  const style=match[0].match(/\bs="(\d+)"/);
  return style?style[1]:fallback;
}
// อธิบาย: สร้าง XML cell แบบ inline string
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function xmlTextCell(reference,value,style){
  const source=String(value===null||value===undefined?'':value),space=/^\s|\s$|[\r\n]/.test(source)?' xml:space="preserve"':'';
  return`<c r="${reference}"${style!==undefined&&style!==null?` s="${style}"`:''} t="inlineStr"><is><t${space}>${xmlEscape(source)}</t></is></c>`;
}
// อธิบาย: สร้าง XML cell แบบ number
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function xmlNumberCell(reference,value,style){
  const numeric=Number(value);
  return`<c r="${reference}"${style!==undefined&&style!==null?` s="${style}"`:''}><v>${Number.isFinite(numeric)?numeric:0}</v></c>`;
}
// อธิบาย: สร้าง XML cell แบบ formula พร้อม cached value
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function xmlFormulaCell(reference,formula,cachedValue,style,valueType='s'){
  const stringType=valueType==='s',value=stringType?String(cachedValue===null||cachedValue===undefined?'':cachedValue):Number(cachedValue);
  return`<c r="${reference}"${style!==undefined&&style!==null?` s="${style}"`:''}${stringType?' t="str"':''}><f>${xmlEscape(formula)}</f><v>${xmlEscape(stringType?value:(Number.isFinite(value)?value:0))}</v></c>`;
}
// อธิบาย: แทนที่ sheetData/dimension/autoFilter ใน worksheet XML
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function replaceWorksheetData(sheetXml,rowsXml,dimensionRef,autoFilterRef=''){
  let output=sheetXml.replace(/<dimension\b[^>]*\/>/,`<dimension ref="${dimensionRef}"/>`);
  if(/<sheetData\b[^>]*>[\s\S]*?<\/sheetData>/.test(output))output=output.replace(/<sheetData\b[^>]*>[\s\S]*?<\/sheetData>/,`<sheetData>${rowsXml}</sheetData>`);
  else output=output.replace(/<sheetData\b[^>]*\/>/,`<sheetData>${rowsXml}</sheetData>`);
  if(autoFilterRef){
    if(/<autoFilter\b[^>]*\/>/.test(output))output=output.replace(/<autoFilter\b[^>]*\/>/,`<autoFilter ref="${autoFilterRef}"/>`);
  }
  return output;
}

// อธิบาย: ดึง child XML tag ชั้นเดียวจาก block ที่กำหนด
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function directXmlChildren(block,tagName){
  const result=[];let cursor=0;
  while(cursor<block.length){
    const start=block.indexOf(`<${tagName}`,cursor);if(start<0)break;
    const openEnd=block.indexOf('>',start);if(openEnd<0)break;
    if(block[openEnd-1]==='/'){result.push(block.slice(start,openEnd+1));cursor=openEnd+1;continue;}
    const close=`</${tagName}>`,end=block.indexOf(close,openEnd+1);if(end<0)break;
    result.push(block.slice(start,end+close.length));cursor=end+close.length;
  }
  return result;
}
// อธิบาย: เพิ่ม custom number format ใน styles.xml ถ้ายังไม่มี
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function ensureCustomNumberFormat(stylesXml,formatCode){
  const escaped=xmlEscape(formatCode),formatTags=stylesXml.match(/<numFmt\b[^>]*\/>/g)||[];
  const existing=formatTags.find(tag=>attrFromTag(tag,'formatCode')===formatCode||attrFromTag(tag,'formatCode')===escaped);
  if(existing)return{xml:stylesXml,numFmtId:Number(attrFromTag(existing,'numFmtId'))};
  const ids=formatTags.map(tag=>Number(attrFromTag(tag,'numFmtId'))||0),numFmtId=Math.max(163,...ids)+1,newTag=`<numFmt numFmtId="${numFmtId}" formatCode="${escaped}"/>`;
  let output=stylesXml;
  if(/<numFmts\b[^>]*>[\s\S]*?<\/numFmts>/.test(output))output=output.replace(/<numFmts\b([^>]*)>([\s\S]*?)<\/numFmts>/,(_,attrs,body)=>{const count=Number(attrFromTag(`<numFmts${attrs}>`,'count')||formatTags.length)+1,nextAttrs=/\bcount="[^"]*"/.test(attrs)?attrs.replace(/\bcount="[^"]*"/,`count="${count}"`):`${attrs} count="${count}"`;return`<numFmts${nextAttrs}>${body}${newTag}</numFmts>`;});
  else output=output.replace(/<fonts\b/,`<numFmts count="1">${newTag}</numFmts><fonts`);
  return{xml:output,numFmtId};
}
// อธิบาย: เพิ่ม cell style ที่อ้าง custom number format
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function ensureNumberFormatStyle(stylesXml,baseStyleId,formatCode='dd/mm/yyyy'){
  const fmt=ensureCustomNumberFormat(stylesXml,formatCode);let output=fmt.xml;
  const blockMatch=output.match(/<cellXfs\b[^>]*>[\s\S]*?<\/cellXfs>/);if(!blockMatch)return{xml:output,styleId:String(baseStyleId)};
  const block=blockMatch[0],styles=directXmlChildren(block,'xf'),base=styles[Number(baseStyleId)]||styles[0];if(!base)return{xml:output,styleId:String(baseStyleId)};
  let clone=base.replace(/\bnumFmtId="[^"]*"/,`numFmtId="${fmt.numFmtId}"`);
  if(!/\bnumFmtId=/.test(clone))clone=clone.replace(/^<xf\b/,'<xf numFmtId="'+fmt.numFmtId+'"');
  clone=/\bapplyNumberFormat=/.test(clone)?clone.replace(/\bapplyNumberFormat="[^"]*"/,'applyNumberFormat="1"'):clone.replace(/^<xf\b/,'<xf applyNumberFormat="1"');
  const open=block.match(/^<cellXfs\b[^>]*>/)?.[0]||'<cellXfs>',count=styles.length+1,newOpen=/\bcount="[^"]*"/.test(open)?open.replace(/\bcount="[^"]*"/,`count="${count}"`):open.replace(/>$/,` count="${count}">`),newBlock=newOpen+block.slice(open.length).replace(/<\/cellXfs>$/,`${clone}</cellXfs>`);
  output=output.replace(block,newBlock);return{xml:output,styleId:String(styles.length)};
}
// อธิบาย: เตรียม map style วันที่เพื่อใช้ตอน patch sheet XML
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function ensureDateStyleMap(stylesXml,baseStyleIds){
  let output=stylesXml;const map={};
  for(const raw of [...new Set((baseStyleIds||[]).map(value=>String(value??'0')))]){const result=ensureNumberFormatStyle(output,raw,'dd/mm/yyyy');output=result.xml;map[raw]=result.styleId;}
  return{xml:output,map};
}
// อธิบาย: อัปเดตช่วง ref ของ Excel table
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function updateTableRange(tableXml,range){
  let output=tableXml.replace(/(<table\b[^>]*\bref=")[^"]*(")/,'$1'+range+'$2');
  output=output.replace(/(<autoFilter\b[^>]*\bref=")[^"]*(")/,'$1'+range+'$2');
  const lastRow=Number((range.match(/:(?:[A-Z]+)(\d+)$/)||[])[1]||1);
  output=output.replace(/(<sortState\b[^>]*\bref=")[^"]*(")/,'$1'+`A2:W${lastRow}`+'$2').replace(/(<sortCondition\b[^>]*\bref=")[^"]*(")/,'$1'+`T1:T${lastRow}`+'$2');
  return output;
}
// อธิบาย: normalize path ภายใน xlsx zip relationship
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function normalizeZipPath(basePath,target){
  const base=basePath.split('/');base.pop();
  for(const part of String(target||'').split('/')){if(!part||part==='.')continue;if(part==='..')base.pop();else base.push(part);}
  return base.join('/');
}
// อธิบาย: คำนวณ path ของ .rels สำหรับ worksheet หนึ่ง
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function worksheetRelsPath(sheetPath){const parts=sheetPath.split('/'),file=parts.pop();return`${parts.join('/')}/_rels/${file}.rels`;}
// อธิบาย: อ่าน attribute จาก XML tag ด้วย regex
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function attrFromTag(tag,name){const match=tag.match(new RegExp(`(?:^|\\s)${regexEscape(name)}="([^"]*)"`));return match?match[1]:'';}
// อธิบาย: หา path ของ worksheet จากชื่อ sheet ใน workbook.xml/rels
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function worksheetPathByName(workbookXml,workbookRelsXml,name){
  const sheetTags=workbookXml.match(/<sheet\b[^>]*\/>/g)||[];
  const tag=sheetTags.find(item=>attrFromTag(item,'name')===name);if(!tag)return'';
  const relationId=attrFromTag(tag,'r:id');if(!relationId)return'';
  const relationTags=workbookRelsXml.match(/<Relationship\b[^>]*\/>/g)||[];
  const relation=relationTags.find(item=>attrFromTag(item,'Id')===relationId);if(!relation)return'';
  return normalizeZipPath('xl/workbook.xml',attrFromTag(relation,'Target'));
}
// อธิบาย: หา table XML ที่ผูกกับ worksheet จาก relationship
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function tablePathForWorksheet(zip,sheetPath){
  const relPath=worksheetRelsPath(sheetPath),file=zip.file(relPath);if(!file)return'';
  const rels=await file.async('string'),relations=rels.match(/<Relationship\b[^>]*\/>/g)||[];
  const relation=relations.find(item=>/\/table$/.test(attrFromTag(item,'Type')));return relation?normalizeZipPath(sheetPath,attrFromTag(relation,'Target')):'';
}
// อธิบาย: ตรวจรายการไฟล์สำคัญที่ template pivot ต้องมี
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function pivotTemplateRequiredFiles(zip){
  const names=new Set(Object.keys(zip.files));
  return['xl/pivotTables/pivotTable1.xml','xl/pivotCache/pivotCacheDefinition1.xml','xl/pivotCache/pivotCacheDefinition2.xml'].every(name=>names.has(name));
}
// อธิบาย: คำนวณจำนวน column จาก range เช่น A1:W10
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function rangeWidth(reference){
  const match=String(reference||'').match(/^([A-Z]+)\d+:([A-Z]+)\d+$/);if(!match)return 0;
  const index=name=>[...name].reduce((value,character)=>value*26+character.charCodeAt(0)-64,0);
  return index(match[2])-index(match[1])+1;
}
// อธิบาย: อ่าน relationship targets ตาม type ที่ต้องการ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function relationshipTargets(zip,partPath,typeSuffix){
  const relPath=worksheetRelsPath(partPath),file=zip.file(relPath);if(!file)return[];
  const xml=await file.async('string'),tags=xml.match(/<Relationship\b[^>]*\/>/g)||[];
  return tags.filter(tag=>String(attrFromTag(tag,'Type')).endsWith(typeSuffix)).map(tag=>({id:attrFromTag(tag,'Id'),target:normalizeZipPath(partPath,attrFromTag(tag,'Target')),tag}));
}
// อธิบาย: ตรวจโครงสร้าง pivot template ภายใน zip ก่อน patch
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function inspectPivotTemplateZip(zip,options={}){
  const mode=options.mode||'source',expectedReportPivotCount=options.expectedReportPivotCount??(mode==='source'?5:null);
  if(!pivotTemplateRequiredFiles(zip))return{ok:false,message:'ขาด PivotTable1 หรือ PivotCacheDefinition หลัก'};
  const workbookFile=zip.file('xl/workbook.xml'),relsFile=zip.file('xl/_rels/workbook.xml.rels'),stylesFile=zip.file('xl/styles.xml');
  if(!workbookFile||!relsFile||!stylesFile)return{ok:false,message:'Workbook relationships หรือ styles ไม่ครบ'};
  const workbookXml=await workbookFile.async('string'),workbookRelsXml=await relsFile.async('string'),stylesXml=await stylesFile.async('string');
  const dxfMatch=stylesXml.match(/<dxfs\b[^>]*\bcount="(\d+)"/),dxfCount=dxfMatch?Number(dxfMatch[1]):0;
  const required=[['Data','Table1',23],['ข้อมูลไม่สมบูรณ์','SM',2],['Black List','BL',2],['PV Final','Table15',9]];
  for(const [sheetName,tableName,columnCount] of required){
    const sheetPath=worksheetPathByName(workbookXml,workbookRelsXml,sheetName);if(!sheetPath||!zip.file(sheetPath))return{ok:false,message:`ขาด Sheet ${sheetName}`};
    const tablePath=await tablePathForWorksheet(zip,sheetPath);if(!tablePath||!zip.file(tablePath))return{ok:false,message:`ขาด Table ของ Sheet ${sheetName}`};
    const tableXml=await zip.file(tablePath).async('string'),tableTag=(tableXml.match(/<table\b[^>]*>/)||[])[0]||'',columnsTag=(tableXml.match(/<tableColumns\b[^>]*>/)||[])[0]||'';
    if(attrFromTag(tableTag,'name')!==tableName||attrFromTag(tableTag,'displayName')!==tableName)return{ok:false,message:`Table ${tableName} ไม่ตรงโครงสร้าง`};
    const reference=attrFromTag(tableTag,'ref'),declaredColumns=Number(attrFromTag(columnsTag,'count')||0),actualColumns=(tableXml.match(/<tableColumn\b/g)||[]).length;
    if(rangeWidth(reference)!==columnCount||declaredColumns!==columnCount||actualColumns!==columnCount)return{ok:false,message:`Table ${tableName} จำนวนคอลัมน์ไม่ถูกต้อง`};
    const dxfIds=(tableXml.match(/(?:DxfId|dxfId)="(\d+)"/g)||[]).map(value=>Number((value.match(/\d+/)||[])[0]||0));
    if(dxfIds.some(value=>value<0||value>=dxfCount))return{ok:false,message:`Table ${tableName} อ้าง Style เกินขอบเขต`};
  }
  const pvSheet=worksheetPathByName(workbookXml,workbookRelsXml,'PV'),reportSheet=worksheetPathByName(workbookXml,workbookRelsXml,'Report');
  if(!pvSheet||!reportSheet||!zip.file(pvSheet)||!zip.file(reportSheet))return{ok:false,message:'ขาด Sheet PV หรือ Report'};
  const pvRelations=await relationshipTargets(zip,pvSheet,'/pivotTable'),reportRelations=await relationshipTargets(zip,reportSheet,'/pivotTable');
  if(pvRelations.length!==1)return{ok:false,message:`PV ต้องมี PivotTable 1 ตัว แต่พบ ${pvRelations.length}`};
  if(expectedReportPivotCount!==null&&reportRelations.length!==expectedReportPivotCount)return{ok:false,message:`Report ต้องมี PivotTable ${expectedReportPivotCount} ตัว แต่พบ ${reportRelations.length}`};
  if(mode==='source'&&reportRelations.length!==5)return{ok:false,message:`Clean Template ต้องมี Report Pivot 5 ตัว แต่พบ ${reportRelations.length}`};
  const allRelations=[...pvRelations.map(item=>({...item,scope:'PV'})),...reportRelations.map(item=>({...item,scope:'Report'}))],targets=new Set();
  for(const relation of allRelations){
    if(targets.has(relation.target))return{ok:false,message:`Pivot relationship ซ้ำ ${relation.target}`};targets.add(relation.target);
    const pivotFile=zip.file(relation.target);if(!pivotFile)return{ok:false,message:`ขาด ${relation.target}`};
    const pivotXml=await pivotFile.async('string'),location=(pivotXml.match(/<location\b[^>]*\bref="([^"]+)"/)||[])[1]||'',fieldCount=Number((pivotXml.match(/<pivotFields\b[^>]*\bcount="(\d+)"/)||[])[1]||0);
    if(!/^[A-Z]+\d+:[A-Z]+\d+$/.test(location))return{ok:false,message:`Pivot ${relation.target} ไม่มี Location ที่ถูกต้อง`};
    const expectedFields=relation.scope==='PV'?23:9;if(fieldCount!==expectedFields)return{ok:false,message:`Pivot ${relation.target} ต้องมี ${expectedFields} fields แต่พบ ${fieldCount}`};
    const cacheRelations=await relationshipTargets(zip,relation.target,'/pivotCacheDefinition');
    if(cacheRelations.length!==1)return{ok:false,message:`Pivot ${relation.target} ต้องผูก PivotCache 1 ตัว`};
    const expectedCache=relation.scope==='PV'?'xl/pivotCache/pivotCacheDefinition1.xml':'xl/pivotCache/pivotCacheDefinition2.xml';
    if(cacheRelations[0].target!==expectedCache)return{ok:false,message:`Pivot ${relation.target} ผูก Cache ผิด (${cacheRelations[0].target})`};
  }
  const orphanPivots=Object.keys(zip.files).filter(name=>/^xl\/pivotTables\/pivotTable\d+\.xml$/.test(name)&&!targets.has(name));
  if(orphanPivots.length)return{ok:false,message:`พบ PivotTable ไม่ได้ผูกกับ Sheet: ${orphanPivots.join(', ')}`};
  const cacheChecks=[['xl/pivotCache/pivotCacheDefinition1.xml','Data',23],['xl/pivotCache/pivotCacheDefinition2.xml','Table15',9]];
  for(const [cachePath,sourceName,fieldCount] of cacheChecks){
    const file=zip.file(cachePath);if(!file)return{ok:false,message:`ขาด ${cachePath}`};
    const xml=await file.async('string'),declared=Number((xml.match(/<cacheFields\b[^>]*\bcount="(\d+)"/)||[])[1]||0),actual=(xml.match(/<cacheField\b/g)||[]).length;
    if(declared!==fieldCount||actual!==fieldCount)return{ok:false,message:`${cachePath} จำนวน Cache Field ไม่ถูกต้อง`};
    const sourceOk=sourceName==='Data'?/<worksheetSource\b[^>]*\bsheet="Data"/.test(xml):/<worksheetSource\b[^>]*\bname="Table15"/.test(xml);
    if(!sourceOk)return{ok:false,message:`${cachePath} ผูก Source ไม่ถูกต้อง`};
    const recordRelations=await relationshipTargets(zip,cachePath,'/pivotCacheRecords');
    if(recordRelations.length!==1||!zip.file(recordRelations[0].target))return{ok:false,message:`${cachePath} ขาด Pivot Cache Records`};
    if(mode!=='source'){
      const tag=(xml.match(/<pivotCacheDefinition\b[^>]*>/)||[])[0]||'';
      if(attrFromTag(tag,'refreshOnLoad')!=='0'||attrFromTag(tag,'saveData')!=='1')return{ok:false,message:`${cachePath} ต้องเก็บ Underlying Data และห้าม Auto Refresh ทับ Snapshot`};
      const recordsXml=await zip.file(recordRelations[0].target).async('string'),definitionCount=Number(attrFromTag(tag,'recordCount')||0),recordsTag=(recordsXml.match(/<pivotCacheRecords\b[^>]*>/)||[])[0]||'',recordsCount=Number(attrFromTag(recordsTag,'count')||0),actualRecords=(recordsXml.match(/<r(?:\s[^>]*)?>/g)||[]).length;
      if(recordsCount!==actualRecords||definitionCount!==recordsCount)return{ok:false,message:`${cachePath} จำนวน Underlying Data ไม่ตรง (${definitionCount}/${recordsCount}/${actualRecords})`};
    }
  }
  return{ok:true,message:`Pivot Structure ผ่านแบบ Strict: PV ${pvRelations.length} · Report ${reportRelations.length} · Cache 2`,details:{mode,pvPivotCount:pvRelations.length,reportPivotCount:reportRelations.length,cacheCount:2,savedUnderlyingData:mode!=='source'}};
}
// อธิบาย: เปิด buffer template เป็น zip แล้ว inspect
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function inspectPivotTemplateBuffer(buffer,options={}){
  if(!buffer||!global.JSZip)return{ok:false,message:'ไม่มี Pivot Template Buffer'};
  try{return await inspectPivotTemplateZip(await global.JSZip.loadAsync(buffer),options);}catch(error){return{ok:false,message:error?.message||String(error)};}
}
// อธิบาย: inspect template จาก workbook หรือ bundled buffer
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function inspectPivotTemplate(workbook){
  if(!workbook?.__sourceBuffer||!global.JSZip)return false;
  if(typeof workbook.__pivotTemplateOk==='boolean')return workbook.__pivotTemplateOk;
  const result=await inspectPivotTemplateBuffer(workbook.__sourceBuffer,{mode:'source'});workbook.__pivotTemplateOk=result.ok;workbook.__pivotTemplateDetails=result;return result.ok;
}
// อธิบาย: โหลด template pivot ที่ bundle มากับ assets
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function loadBundledPivotTemplate(){
  if(bundledPivotTemplatePromise)return bundledPivotTemplatePromise;
  bundledPivotTemplatePromise=(async()=>{
    if(typeof global.fetch!=='function')return null;
    const response=await global.fetch(BUNDLED_PIVOT_TEMPLATE_URL,{cache:'no-store'});if(!response.ok)throw new Error(`โหลด Clean Pivot Template ไม่สำเร็จ (${response.status})`);
    const buffer=await response.arrayBuffer(),inspection=await inspectPivotTemplateBuffer(buffer,{mode:'source'});if(!inspection.ok)throw new Error(`Clean Pivot Template ไม่ผ่าน: ${inspection.message}`);return buffer;
  })().catch(error=>{console.warn('Bundled Pivot Template unavailable',error);return null;});
  return bundledPivotTemplatePromise;
}
// อธิบาย: เลือก template buffer จาก master เดิมหรือ bundled template
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function resolvePivotTemplateBuffer(workbook){
  const bundled=await loadBundledPivotTemplate();if(bundled)return{buffer:bundled,source:'BUNDLED_CLEAN_V2.5.3'};
  if(workbook?.__sourceBuffer&&await inspectPivotTemplate(workbook))return{buffer:workbook.__sourceBuffer,source:'UPLOADED_MASTER'};
  return null;
}
// อธิบาย: สร้าง XML ของ Data sheet ใหม่สำหรับ template preserving
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function buildDataSheetXml(sourceXml,context){
  const headerStyles=MASTER_OUTPUT_HEADERS.map((_,column)=>xmlCellStyle(sourceXml,`${columnName(column)}1`,'0'));
  const bodyStyles=MASTER_OUTPUT_HEADERS.map((_,column)=>xmlCellStyle(sourceXml,`${columnName(column)}2`,headerStyles[column]||'0'));
  const headerCells=MASTER_OUTPUT_HEADERS.map((value,column)=>xmlTextCell(`${columnName(column)}1`,value,headerStyles[column])).join('');
  const rows=[`<row r="1" spans="1:23">${headerCells}</row>`];
  const run=context.processedAt;
  for(let index=0;index<context.pending.length;index++){
    const excelRow=index+2,row=context.pending[index],cells=[];
    const values=[row.AgencyCode,row.Mticode,row.AgencyName,row.RequestCode,row.employeeName,row.alienCode,row.alienNameEn,row.CertificateNo,row.Policy,row.TotalPremium,row.ProposalID,row.CreateDate,row.Status,row.EPropID,row.Discount];
    for(let column=0;column<values.length;column++){
      const reference=`${columnName(column)}${excelRow}`,value=values[column],style=bodyStyles[column];
      if(column===9)cells.push(xmlNumberCell(reference,number(value),style));
      else if(column===11){const serial=excelSerial(value);cells.push(serial===null?xmlTextCell(reference,'',style):xmlNumberCell(reference,serial,style));}
      else cells.push(xmlTextCell(reference,value,style));
    }
    const {p,q,r,t,u,v,w}=dataRowFormulas(excelRow,run);
    cells.push(xmlFormulaCell(`P${excelRow}`,p,row.Note,bodyStyles[15],'s'));
    cells.push(xmlFormulaCell(`Q${excelRow}`,q,row.IncompleteStatus,bodyStyles[16],'s'));
    cells.push(xmlFormulaCell(`R${excelRow}`,r,row.BlacklistStatus,bodyStyles[17],'s'));
    cells.push(xmlTextCell(`S${excelRow}`,row.MenuEProblem,bodyStyles[18]));
    const dateSerial=excelSerial(row.Date);cells.push(xmlFormulaCell(`T${excelRow}`,t,dateSerial===null?0:dateSerial,bodyStyles[19],'n'));
    cells.push(xmlFormulaCell(`U${excelRow}`,u,row.PendingStatus,bodyStyles[20],'s'));
    cells.push(xmlFormulaCell(`V${excelRow}`,v,row.AgingDays===null||row.AgingDays===undefined?0:row.AgingDays,bodyStyles[21],'n'));
    cells.push(xmlFormulaCell(`W${excelRow}`,w,row.PendingRange,bodyStyles[22],'s'));
    rows.push(`<row r="${excelRow}" spans="1:23">${cells.join('')}</row>`);
  }
  if(!context.pending.length)rows.push(`<row r="2" spans="1:23">${MASTER_OUTPUT_HEADERS.map((_,column)=>xmlEmptyCell(`${columnName(column)}2`,bodyStyles[column])).join('')}</row>`);
  const lastRow=Math.max(2,context.pending.length+1),range=`A1:W${lastRow}`;
  return{xml:replaceWorksheetData(sourceXml,rows.join(''),range,range),range,lastRow};
}
// อธิบาย: สร้าง XML ของ control sheet เช่น Check/ETL
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function buildControlSheetXml(sourceXml,statusLabel,ids){
  const headers=['สถานะ','Prop ID'],headerStyles=headers.map((_,column)=>xmlCellStyle(sourceXml,`${columnName(column)}1`,'0')),bodyStyles=headers.map((_,column)=>xmlCellStyle(sourceXml,`${columnName(column)}2`,headerStyles[column]||'0'));
  const rows=[`<row r="1" spans="1:2">${headers.map((value,column)=>xmlTextCell(`${columnName(column)}1`,value,headerStyles[column])).join('')}</row>`];
  (ids||[]).forEach((value,index)=>{const row=index+2;rows.push(`<row r="${row}" spans="1:2">${xmlTextCell(`A${row}`,statusLabel,bodyStyles[0])}${xmlTextCell(`B${row}`,value,bodyStyles[1])}</row>`);});
  if(!(ids||[]).length)rows.push(`<row r="2" spans="1:2">${xmlEmptyCell('A2',bodyStyles[0])}${xmlEmptyCell('B2',bodyStyles[1])}</row>`);
  const lastRow=Math.max(2,(ids||[]).length+1),range=`A1:B${lastRow}`;
  return{xml:replaceWorksheetData(sourceXml,rows.join(''),range,range),range,lastRow};
}
// อธิบาย: เตรียม rows สำหรับ PV Final แสดงผลเหมือน PV
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function pvFinalDisplayRows(context){return pvRows(context);}
// อธิบาย: สร้าง XML ของ PV sheet
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function buildPvSheetXml(sourceXml,context,dateStyleMap={}){
  const headers=['Date','Policy','Mticode','AgencyName','ProposalID','สถานะไม่ issue','จำนวนวันที่ยังไม่ออกกรมธรรม์','ระยะเวลายังไม่ออกกรมธรรม์','Sum of TotalPremium'];
  const filterStyles=headers.map((_,column)=>xmlCellStyle(sourceXml,`${columnName(column)}2`,'0')),headerStyles=headers.map((_,column)=>xmlCellStyle(sourceXml,`${columnName(column)}4`,'0')),bodyStyles=headers.map((_,column)=>xmlCellStyle(sourceXml,`${columnName(column)}5`,headerStyles[column]||'0'));
  const rows=[`<row r="2" spans="1:9">${reportStyledCells(2,['Status','(All)','','','','','','',''],filterStyles).join('')}</row>`,`<row r="4" spans="1:9">${headers.map((value,column)=>xmlTextCell(`${columnName(column)}4`,value,headerStyles[column])).join('')}</row>`];
  const values=pvFinalDisplayRows(context),dateStyle=dateStyleMap[bodyStyles[0]]||bodyStyles[0];
  values.forEach((record,index)=>{const row=index+5,cells=[];record.forEach((value,column)=>{const reference=`${columnName(column)}${row}`,style=column===0?dateStyle:bodyStyles[column];if(column===0){const serial=excelSerial(value);cells.push(serial===null?xmlTextCell(reference,'',style):xmlNumberCell(reference,serial,style));}else if(column===6||column===8)cells.push(typeof value==='number'?xmlNumberCell(reference,value,style):xmlTextCell(reference,value,style));else cells.push(xmlTextCell(reference,value,style));});rows.push(`<row r="${row}" spans="1:9">${cells.join('')}</row>`);});
  const lastRow=values.length?values.length+4:4,locationRef=`A4:I${Math.max(4,lastRow)}`;
  return{xml:replaceWorksheetData(sourceXml,rows.join(''),`A1:I${Math.max(4,lastRow)}`),lastRow,locationRef,rows:values};
}
// อธิบาย: สร้าง XML ของ PV Final sheet
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function buildPvFinalSheetXml(sourceXml,context,dateStyleMap={}){
  const headers=['Date','Policy','Mticode','AgencyName','ProposalID','สถานะไม่ issue','จำนวนวันที่ยังไม่ออกกรมธรรม์','ระยะเวลายังไม่ออกกรมธรรม์','Sum of TotalPremium'];
  const headerStyles=headers.map((_,column)=>xmlCellStyle(sourceXml,`${columnName(column)}1`,'0')),bodyStyles=headers.map((_,column)=>xmlCellStyle(sourceXml,`${columnName(column)}2`,headerStyles[column]||'0')),dateStyle=dateStyleMap[bodyStyles[0]]||bodyStyles[0];
  const rows=[`<row r="1" spans="1:9">${headers.map((value,column)=>xmlTextCell(`${columnName(column)}1`,value,headerStyles[column])).join('')}</row>`];
  const values=pvFinalDisplayRows(context);
  values.forEach((record,index)=>{
    const row=index+2,cells=[];
    record.forEach((value,column)=>{const reference=`${columnName(column)}${row}`,style=column===0?dateStyle:bodyStyles[column];if(column===0){const serial=excelSerial(value);cells.push(serial===null?xmlTextCell(reference,'',style):xmlNumberCell(reference,serial,style));}else if(column===6||column===8)cells.push(typeof value==='number'?xmlNumberCell(reference,value,style):xmlTextCell(reference,value,style));else cells.push(xmlTextCell(reference,value,style));});
    rows.push(`<row r="${row}" spans="1:9">${cells.join('')}</row>`);
  });
  if(!values.length)rows.push(`<row r="2" spans="1:9">${headers.map((_,column)=>xmlEmptyCell(`${columnName(column)}2`,column===0?dateStyle:bodyStyles[column])).join('')}</row>`);
  const lastRow=Math.max(2,values.length+1),range=`A1:I${lastRow}`;
  return{xml:replaceWorksheetData(sourceXml,rows.join(''),range,range),range,lastRow,rows:values};
}
const REPORT_BLOCKS=[
  {key:'waiting',status:'รอ Issue',label:'รายการที่รอ ISSUE.',pivotName:'PivotTable14',originalPivotRow:23},
  {key:'menuE',status:'ติดปัญหาไม่เข้าในเมนู E',label:'รายการติดปัญหาไม่เอาเข้าเมนู E',pivotName:'PivotTable5',originalPivotRow:54},
  {key:'incomplete',status:'ข้อมูลไม่สมบูรณ์',label:'รายการข้อมูลไม่สมบูรณ์',pivotName:'PivotTable3',originalPivotRow:134},
  {key:'blacklist',status:'Blacklist',label:'สถานะ Blacklist.',pivotName:'PivotTable1',originalPivotRow:170}
];
const REPORT_STATUS_ORDER=REPORT_BLOCKS.map(block=>block.status);
const REPORT_AGING_ORDER=['1 - 7 วัน','8 - 15 วัน','16 - 30 วัน','มากกว่า 30 วัน'];
// อธิบาย: เพิ่มหรือแก้ attribute ใน XML root attribute string
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function upsertXmlAttribute(attributes,name,value){
  const pattern=new RegExp(`\\s${regexEscape(name)}="[^"]*"`);
  return pattern.test(attributes)?attributes.replace(pattern,` ${name}="${xmlEscape(value)}"`):`${attributes} ${name}="${xmlEscape(value)}"`;
}
// อธิบาย: สร้าง object item สำหรับ pivot cache
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function pivotCacheItem(type,value=''){return{type,value:type==='n'?Number(value):String(value??'')};}
// อธิบาย: สร้าง key กันซ้ำของ pivot cache item
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function pivotCacheItemKey(item){return`${item.type}:${item.type==='n'&&Object.is(item.value,-0)?0:item.value}`;}
// อธิบาย: สร้าง pivot cache item สำหรับวันที่
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function pivotCacheDateItem(value){
  if(!value)return pivotCacheItem('m');
  const key=dateKey(value);return key?pivotCacheItem('d',`${key}T00:00:00`):pivotCacheItem('m');
}
// อธิบาย: สร้าง pivot cache item สำหรับข้อความหรือ missing item
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function pivotCacheTextItem(value){return hasValue(value)?pivotCacheItem('s',String(value)):pivotCacheItem('m');}
// อธิบาย: เลือกชนิด pivot cache item จากค่าจริง number/date/text/blank
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function pivotCacheMixedItem(value){
  if(value===null||value===undefined||value==='')return pivotCacheItem('m');
  const numeric=Number(value);return typeof value==='number'&&Number.isFinite(numeric)?pivotCacheItem('n',numeric):pivotCacheItem('s',String(value));
}
// อธิบาย: สร้างรายการ unique items ตามลำดับที่ pivot ต้องใช้
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function orderedUniquePivotItems(values,{fixed=[],sort='none'}={}){
  const items=[],seen=new Set(),push=item=>{const key=pivotCacheItemKey(item);if(!seen.has(key)){seen.add(key);items.push(item);}};
  fixed.forEach(push);values.forEach(push);
  if(sort==='date')items.sort((left,right)=>left.type==='m'?1:right.type==='m'?-1:String(left.value).localeCompare(String(right.value)));
  if(sort==='mixed')items.sort((left,right)=>{
    const rank=item=>item.type==='n'?0:item.type==='s'?1:2,difference=rank(left)-rank(right);if(difference)return difference;
    if(left.type==='n')return left.value-right.value;return String(left.value).localeCompare(String(right.value),'th');
  });
  return items;
}
// อธิบาย: สร้าง XML ของ cache item แต่ละตัว
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function pivotCacheValueXml(item,{unused=false}={}){
  const unusedAttribute=unused?' u="1"':'';
  if(item.type==='m')return'<m/>';
  if(item.type==='n')return`<n v="${item.value}"${unusedAttribute}/>`;
  if(item.type==='d')return`<d v="${xmlEscape(item.value)}"${unusedAttribute}/>`;
  return`<s v="${xmlEscape(item.value)}"${unusedAttribute}/>`;
}
// อธิบาย: สร้าง sharedItems XML ของ pivot cache
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function pivotSharedItemsXml(items,{usedKeys=new Set()}={}){
  const types=new Set(items.map(item=>item.type)),attributes=[];
  const hasBlank=types.has('m'),hasString=types.has('s'),hasNumber=types.has('n'),hasDate=types.has('d');
  if(hasBlank)attributes.push('containsBlank="1"');
  if(hasDate){
    attributes.push('containsSemiMixedTypes="0"','containsMixedTypes="0"','containsNonDate="0"','containsDate="1"','containsString="0"');
  }else if(hasNumber&&!hasString){
    attributes.push('containsSemiMixedTypes="0"','containsMixedTypes="0"','containsString="0"','containsNumber="1"');
  }else if(hasNumber&&hasString){
    attributes.push('containsSemiMixedTypes="1"','containsMixedTypes="1"','containsString="1"','containsNumber="1"','containsNonDate="1"');
  }
  const numbers=items.filter(item=>item.type==='n').map(item=>item.value);
  if(numbers.length){
    if(numbers.every(Number.isInteger))attributes.push('containsInteger="1"');
    attributes.push(`minValue="${Math.min(...numbers)}"`,`maxValue="${Math.max(...numbers)}"`);
  }
  const dates=items.filter(item=>item.type==='d').map(item=>item.value).sort();
  if(dates.length)attributes.push(`minDate="${xmlEscape(dates[0])}"`,`maxDate="${xmlEscape(dates[dates.length-1])}"`);
  attributes.push(`count="${items.length}"`);
  const children=items.map(item=>pivotCacheValueXml(item,{unused:usedKeys.size>0&&!usedKeys.has(pivotCacheItemKey(item))})).join('');
  return children?`<sharedItems ${attributes.join(' ')}>${children}</sharedItems>`:`<sharedItems ${attributes.join(' ')}/>`;
}
// อธิบาย: สร้าง snapshot items/index ของ pivot cache สำหรับ Report
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function buildReportPivotCacheSnapshot(rows){
  const fieldNames=['Date','Policy','Mticode','AgencyName','ProposalID','สถานะไม่ issue','จำนวนวันที่ยังไม่ออกกรมธรรม์','ระยะเวลายังไม่ออกกรมธรรม์','Sum of TotalPremium'];
  const normalized=(rows||[]).map(row=>[
    pivotCacheDateItem(row[0]),pivotCacheTextItem(row[1]),pivotCacheTextItem(row[2]),pivotCacheTextItem(row[3]),pivotCacheTextItem(row[4]),pivotCacheTextItem(row[5]),pivotCacheMixedItem(row[6]),pivotCacheTextItem(row[7]),pivotCacheMixedItem(row[8])
  ]);
  const actualStatuses=new Set(normalized.map(row=>row[5]).filter(item=>item.type==='s').map(item=>item.value));
  const unexpectedStatuses=[...actualStatuses].filter(value=>!REPORT_STATUS_ORDER.includes(value));
  if(unexpectedStatuses.length)throw new Error(`BW-PIVOT-CACHE-005: พบสถานะนอก SOP: ${unexpectedStatuses.join(', ')}`);
  const actualAging=new Set(normalized.map(row=>row[7]).filter(item=>item.type==='s').map(item=>item.value));
  const unexpectedAging=[...actualAging].filter(value=>!REPORT_AGING_ORDER.includes(value));
  if(unexpectedAging.length)throw new Error(`BW-PIVOT-CACHE-006: พบช่วงวันนอก SOP: ${unexpectedAging.join(', ')}`);
  const shared=[];
  for(let field=0;field<fieldNames.length;field++){
    const values=normalized.map(row=>row[field]);
    const options=field===0?{sort:'date'}:field===5?{fixed:REPORT_STATUS_ORDER.map(value=>pivotCacheItem('s',value))}:field===6?{sort:'mixed'}:field===7?{fixed:REPORT_AGING_ORDER.map(value=>pivotCacheItem('s',value))}:field===8?{sort:'mixed'}:{};
    const items=orderedUniquePivotItems(values,options),index=new Map(items.map((item,itemIndex)=>[pivotCacheItemKey(item),itemIndex])),usedKeys=new Set(values.map(pivotCacheItemKey));
    shared.push({items,index,usedKeys});
  }
  const cacheFields=fieldNames.map((name,index)=>{
    const numFmtId=index===0?'14':'0';
    return`<cacheField name="${xmlEscape(name)}" numFmtId="${numFmtId}">${pivotSharedItemsXml(shared[index].items,{usedKeys:shared[index].usedKeys})}</cacheField>`;
  }).join('');
  const records=normalized.map(row=>`<r>${row.map((item,index)=>{
    const itemIndex=shared[index].index.get(pivotCacheItemKey(item));
    if(itemIndex===undefined)throw new Error(`BW-PIVOT-CACHE-001: ไม่พบ Cache Index field ${index}`);
    return`<x v="${itemIndex}"/>`;
  }).join('')}</r>`).join('');
  return{
    fieldNames,normalized,shared,
    cacheFieldsXml:`<cacheFields count="${fieldNames.length}">${cacheFields}</cacheFields>`,
    recordsXml:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><pivotCacheRecords xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" count="${normalized.length}">${records}</pivotCacheRecords>`,
    recordCount:normalized.length,
    statusItems:shared[5].items.filter(item=>item.type==='s').map(item=>item.value)
  };
}
// อธิบาย: หา index ของ item ใน pivot sharedItems และ throw ถ้าไม่เจอ
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function pivotSharedIndex(snapshot,field,item,errorCode='BW-PIVOT-TABLE-001'){
  const index=snapshot.shared[field]?.index.get(pivotCacheItemKey(item));
  if(index===undefined)throw new Error(`${errorCode}: ไม่พบ Shared Item field ${field} value ${String(item?.value??'')}`);
  return index;
}
// อธิบาย: อ่าน attributes ของ pivotTableDefinition root
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function xmlRootAttributes(xml){return((xml.match(/<pivotTableDefinition\b([^>]*)>/)||[])[1]||'').trim();}
// อธิบาย: ดึง style info เดิมของ pivot หรือใส่ค่า default
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function pivotStyleInfoXml(xml){return(xml.match(/<pivotTableStyleInfo\b[^>]*\/>/)||['<pivotTableStyleInfo name="PivotStyleMedium9" showRowHeaders="1" showColHeaders="1" showRowStripes="0" showColStripes="0" showLastColumn="0"/>'])[0];}
// อธิบาย: ทำความสะอาด attributes ที่ไม่ควรซ้ำก่อน rebuild pivot XML
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function cleanPivotRootAttributes(xml){
  let attributes=xmlRootAttributes(xml).replace(/(?:^|\s+)xmlns(:[A-Za-z0-9_]+)?="[^"]*"/g,'').trim().replace(/\s+refreshDataOnOpen="[^"]*"/g,'');
  for(const [name,value] of [['enableDrill','1'],['showDrill','1'],['preserveFormatting','1'],['compact','0'],['compactData','0'],['multipleFieldFilters','0']])attributes=upsertXmlAttribute(attributes,name,value);
  return attributes;
}
// อธิบาย: สร้าง items XML ของ pivot field
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function pivotItemsXml(snapshot,field,{visibleIndices=null,selectedIndex=null}={}){
  const sharedField=snapshot.shared[field],items=sharedField?.items||[];
  if(!items.length)return'';
  const visible=visibleIndices instanceof Set?visibleIndices:null;
  return`<items count="${items.length}">${items.map((item,index)=>{
    const attributes=[`x="${index}"`],used=sharedField.usedKeys.has(pivotCacheItemKey(item));
    if(!used)attributes.push('m="1"');
    if(selectedIndex!==null&&selectedIndex!==undefined&&index!==selectedIndex)attributes.push('h="1"');
    else if(visible&&!visible.has(index))attributes.push('h="1"');
    return`<item ${attributes.join(' ')}/>`;
  }).join('')}</items>`;
}
// อธิบาย: สร้าง pivotField XML แบบสั้น
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function simplePivotField(attributes='',items=''){return`<pivotField${attributes?' '+attributes:''}>${items}</pivotField>`;}
// อธิบาย: สร้าง dataFields XML สำหรับ Report pivot เช่น Count/Sum
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function reportDataFieldsXml(){return'<dataFields count="2"><dataField name="Count of Policy" fld="1" subtotal="count" numFmtId="3"/><dataField name="ผลรวม" fld="8" subtotal="sum" numFmtId="3"/></dataFields>';}
// อธิบาย: สร้าง column axis XML ของ Report pivot
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function reportColumnAxisXml(){return'<colFields count="1"><field x="-2"/></colFields><colItems count="2"><i><x/></i><i i="1"><x v="1"/></i></colItems>';}
// อธิบาย: สร้าง pivot table XML สำหรับ aging report
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function buildAgingPivotTableDefinition(existingXml,layout,snapshot){
  const visibleIndices=new Set((layout.groups||[]).map(group=>pivotSharedIndex(snapshot,7,pivotCacheTextItem(group[1]))));
  const fields=[];
  for(let index=0;index<9;index++){
    if(index===1||index===8)fields.push(simplePivotField('dataField="1" compact="0" outline="0" showAll="0" defaultSubtotal="0"'));
    else if(index===7)fields.push(simplePivotField('axis="axisRow" compact="0" outline="0" showAll="0" defaultSubtotal="0"',pivotItemsXml(snapshot,7,{visibleIndices})));
    else fields.push(simplePivotField('compact="0" outline="0" showAll="0" defaultSubtotal="0"'));
  }
  const rowItems=(layout.groups||[]).map(group=>`<i><x v="${pivotSharedIndex(snapshot,7,pivotCacheTextItem(group[1]))}"/></i>`).join('')+'<i t="grand"><x/></i>';
  return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><pivotTableDefinition xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ${cleanPivotRootAttributes(existingXml)}><location ref="${xmlEscape(layout.ref)}" firstHeaderRow="0" firstDataRow="1" firstDataCol="1"/><pivotFields count="9">${fields.join('')}</pivotFields><rowFields count="1"><field x="7"/></rowFields><rowItems count="${(layout.groups||[]).length+1}">${rowItems}</rowItems>${reportColumnAxisXml()}${reportDataFieldsXml()}${pivotStyleInfoXml(existingXml)}</pivotTableDefinition>`;
}
// อธิบาย: สร้าง pivot table XML สำหรับ status report
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function buildStatusPivotTableDefinition(existingXml,layout,snapshot){
  const statusIndex=pivotSharedIndex(snapshot,5,pivotCacheTextItem(layout.status),'BW-REPORT-FILTER-001');
  const dateVisible=new Set(),daysVisible=new Set(),rowItems=[];
  for(const group of layout.groups||[]){
    const dateIndex=pivotSharedIndex(snapshot,0,pivotCacheDateItem(group[0])),daysIndex=pivotSharedIndex(snapshot,6,pivotCacheMixedItem(group[1]));
    dateVisible.add(dateIndex);daysVisible.add(daysIndex);rowItems.push(`<i><x v="${dateIndex}"/><x v="${daysIndex}"/></i>`);
  }
  rowItems.push('<i t="grand"><x/></i>');
  const fields=[];
  for(let index=0;index<9;index++){
    if(index===1||index===8)fields.push(simplePivotField('dataField="1" compact="0" outline="0" showAll="0" defaultSubtotal="0"'));
    else if(index===0)fields.push(simplePivotField('axis="axisRow" compact="0" outline="0" showAll="0" sortType="ascending" defaultSubtotal="0"',pivotItemsXml(snapshot,0,{visibleIndices:dateVisible})));
    else if(index===5)fields.push(simplePivotField('axis="axisPage" compact="0" outline="0" multipleItemSelectionAllowed="0" showAll="0" defaultSubtotal="0"',pivotItemsXml(snapshot,5,{selectedIndex:statusIndex})));
    else if(index===6)fields.push(simplePivotField('axis="axisRow" compact="0" outline="0" showAll="0" sortType="ascending" defaultSubtotal="0"',pivotItemsXml(snapshot,6,{visibleIndices:daysVisible})));
    else fields.push(simplePivotField('compact="0" outline="0" showAll="0" defaultSubtotal="0"'));
  }
  return{
    xml:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><pivotTableDefinition xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ${cleanPivotRootAttributes(existingXml)}><location ref="${xmlEscape(layout.ref)}" firstHeaderRow="1" firstDataRow="2" firstDataCol="2" rowPageCount="1" colPageCount="1"/><pivotFields count="9">${fields.join('')}</pivotFields><rowFields count="2"><field x="0"/><field x="6"/></rowFields><rowItems count="${rowItems.length}">${rowItems.join('')}</rowItems>${reportColumnAxisXml()}<pageFields count="1"><pageField fld="5" item="${statusIndex}" hier="-1"/></pageFields>${reportDataFieldsXml()}${pivotStyleInfoXml(existingXml)}</pivotTableDefinition>`,
    statusIndex
  };
}
// อธิบาย: สร้าง XML cell ว่างพร้อม style
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function xmlEmptyCell(reference,style){return`<c r="${reference}"${style!==undefined&&style!==null?` s="${style}"`:''}/>`;}
// อธิบาย: สร้าง XML row ของ Report พร้อมกำหนด height/hidden
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function reportRowXml(rowNumber,cells,{height=20.1,hidden=false}={}){
  return`<row r="${rowNumber}" spans="1:4"${hidden?' hidden="1"':''}${height?` ht="${height}" customHeight="1"`:''}>${cells.join('')}</row>`;
}
// อธิบาย: อ่าน style id จาก row ต้นแบบของ Report
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function reportCellStyles(sourceXml,row){return[0,1,2,3].map(column=>xmlCellStyle(sourceXml,`${columnName(column)}${row}`,'0'));}
// อธิบาย: สร้าง cells ของ Report โดยคง style และชนิด numeric/formula
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function reportStyledCells(rowNumber,values,styles,numericColumns=[],formulaColumns={}){
  return values.map((value,column)=>{
    const reference=`${columnName(column)}${rowNumber}`,style=styles[column];
    if(formulaColumns[column])return xmlFormulaCell(reference,formulaColumns[column],value,style,'n');
    if(value===null||value===undefined||value==='')return xmlEmptyCell(reference,style);
    return numericColumns.includes(column)?xmlNumberCell(reference,value,style):xmlTextCell(reference,value,style);
  });
}
// อธิบาย: อัปเดต mergeCells ใน worksheet XML
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function patchMergeCells(sheetXml,refs){
  const block=`<mergeCells count="${refs.length}">${refs.map(ref=>`<mergeCell ref="${ref}"/>`).join('')}</mergeCells>`;
  if(/<mergeCells\b[^>]*>[\s\S]*?<\/mergeCells>/.test(sheetXml))return sheetXml.replace(/<mergeCells\b[^>]*>[\s\S]*?<\/mergeCells>/,block);
  return sheetXml.replace(/<pageMargins\b/,`${block}<pageMargins`);
}
// อธิบาย: สร้าง Report sheet XML แบบ compact พร้อม staging ซ่อนสำหรับ pivot
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function buildCompactReportSheetXml(sourceXml,context,summary,dateStyleMap={}){
  const reportRows=aggregatePvRows(context.pending),rows=[],merges=['A1:D1','A2:B2','A3:B3','A6:D6'],layouts={aging:null,sections:[],hiddenSections:[]};
  const topTitle=reportCellStyles(sourceXml,1),kpiMoney=reportCellStyles(sourceXml,2),kpiCount=reportCellStyles(sourceXml,3),blank4=reportCellStyles(sourceXml,4),blank5=reportCellStyles(sourceXml,5),agingTitle=reportCellStyles(sourceXml,6),agingHeader=reportCellStyles(sourceXml,7),agingBody=reportCellStyles(sourceXml,8),agingGrand=reportCellStyles(sourceXml,9);
  rows.push(reportRowXml(1,reportStyledCells(1,['สถานะไม่ ISSUE.','','',''],topTitle),{height:30}));
  rows.push(reportRowXml(2,reportStyledCells(2,['ยอดเงินที่ยังไม่ Issue','',summary.TotalPremium,'บาท'],kpiMoney,[2],{2:'SUM(Table15[Sum of TotalPremium])'})));
  rows.push(reportRowXml(3,reportStyledCells(3,['จำนวนกรมธรรม์','',summary.TotalPolicies,'กรมธรรม์'],kpiCount,[2],{2:'COUNTA(Table15[Policy])'})));
  rows.push(reportRowXml(4,reportStyledCells(4,['','','',''],blank4)));
  rows.push(reportRowXml(5,reportStyledCells(5,['','','',''],blank5),{hidden:true}));
  rows.push(reportRowXml(6,reportStyledCells(6,['จำนวนวันที่ยังไม่ออกกรมธรรม์','','',''],agingTitle),{height:30}));
  rows.push(reportRowXml(7,reportStyledCells(7,['No.','ระยะเวลายังไม่ออกกรมธรรม์','Count of Policy','TotalPremium'],agingHeader)));
  const aging=groupByAging(reportRows);
  let rowNumber=8;
  aging.forEach(item=>{rows.push(reportRowXml(rowNumber,reportStyledCells(rowNumber,item,agingBody,[0,2,3])));rowNumber++;});
  const agingGrandRow=rowNumber;
  rows.push(reportRowXml(agingGrandRow,reportStyledCells(agingGrandRow,['Grand Total','',summary.TotalPolicies,summary.TotalPremium],agingGrand,[2,3])));
  layouts.aging={ref:`B7:D${agingGrandRow}`,groups:aging};
  let cursor=agingGrandRow+2;
  const templateRows={waiting:21,menuE:52,incomplete:132,blacklist:168};
  for(const block of REPORT_BLOCKS){
    const subset=reportRows.filter(item=>item.PendingStatus===block.status),groups=groupStatusRows(reportRows,block.status);
    if(!subset.length||!groups.length)continue;
    const base=templateRows[block.key],filterStyles=reportCellStyles(sourceXml,base),titleStyles=reportCellStyles(sourceXml,base+1),valuesStyles=reportCellStyles(sourceXml,base+2),headerStyles=reportCellStyles(sourceXml,base+3),bodyStyles=reportCellStyles(sourceXml,base+4),grandStyles=reportCellStyles(sourceXml,base+5);
    const filterRow=cursor,titleRow=cursor+1,valuesRow=cursor+2,headerRow=cursor+3,dataStart=cursor+4;
    rows.push(reportRowXml(filterRow,reportStyledCells(filterRow,['สถานะไม่ issue',block.status,'',''],filterStyles),{hidden:true}));
    rows.push(reportRowXml(titleRow,reportStyledCells(titleRow,[block.label,'','',''],titleStyles),{height:30}));merges.push(`A${titleRow}:D${titleRow}`);
    rows.push(reportRowXml(valuesRow,reportStyledCells(valuesRow,['','','Values',''],valuesStyles),{hidden:true}));
    rows.push(reportRowXml(headerRow,reportStyledCells(headerRow,['Date','จำนวนวันที่ยังไม่ออกกรมธรรม์','Count of Policy','ผลรวม'],headerStyles)));
    const statusDateStyles=[dateStyleMap[bodyStyles[0]]||bodyStyles[0],bodyStyles[1],bodyStyles[2],bodyStyles[3]];groups.forEach((group,index)=>{const current=dataStart+index;rows.push(reportRowXml(current,reportStyledCells(current,[excelSerial(group[0]),group[1],group[2],group[3]],statusDateStyles,[0,1,2,3])));});
    const grandRow=dataStart+groups.length,sectionPremium=sum(subset,'TotalPremium');
    rows.push(reportRowXml(grandRow,reportStyledCells(grandRow,['Grand Total','',subset.length,sectionPremium],grandStyles,[2,3])));
    layouts.sections.push({...block,filterRow,titleRow,valuesRow,headerRow,dataStart,grandRow,ref:`A${valuesRow}:D${grandRow}`,groups,subset,hidden:false});
    cursor=grandRow+2;
  }
  const visibleLastRow=Math.max(agingGrandRow,...layouts.sections.map(item=>item.grandRow));
  // Hidden Pivot staging starts immediately after the visible report. A status PivotTable
  // renders its page filter two rows above <location ref>. Keep a hidden spacer row so
  // that the page filter lands on filterRow instead of leaking into the visible row below
  // the last Grand Total.
  let stagingCursor=visibleLastRow+1;
  for(const block of REPORT_BLOCKS){
    if(layouts.sections.some(item=>item.key===block.key))continue;
    const base=templateRows[block.key],filterStyles=reportCellStyles(sourceXml,base),valuesStyles=reportCellStyles(sourceXml,base+2),headerStyles=reportCellStyles(sourceXml,base+3),grandStyles=reportCellStyles(sourceXml,base+5);
    const filterRow=stagingCursor,spacerRow=stagingCursor+1,valuesRow=stagingCursor+2,headerRow=stagingCursor+3,grandRow=stagingCursor+4;
    rows.push(reportRowXml(filterRow,reportStyledCells(filterRow,['สถานะไม่ issue',block.status,'',''],filterStyles),{hidden:true}));
    rows.push(reportRowXml(spacerRow,reportStyledCells(spacerRow,['','','',''],valuesStyles),{hidden:true}));
    rows.push(reportRowXml(valuesRow,reportStyledCells(valuesRow,['','','Values',''],valuesStyles),{hidden:true}));
    rows.push(reportRowXml(headerRow,reportStyledCells(headerRow,['Date','จำนวนวันที่ยังไม่ออกกรมธรรม์','Count of Policy','ผลรวม'],headerStyles),{hidden:true}));
    rows.push(reportRowXml(grandRow,reportStyledCells(grandRow,['Grand Total','',0,0],grandStyles,[2,3]),{hidden:true}));
    layouts.hiddenSections.push({...block,filterRow,spacerRow,valuesRow,headerRow,grandRow,ref:`A${valuesRow}:D${grandRow}`,groups:[],subset:[],hidden:true});
    stagingCursor=grandRow+1;
  }
  const dimensionLastRow=Math.max(visibleLastRow,stagingCursor-1);
  let output=replaceWorksheetData(sourceXml,rows.join(''),`A1:D${dimensionLastRow}`);
  output=patchMergeCells(output,merges);
  output=output.replace(/(<sheetView\b[^>]*)(>)/,(_,attrs,end)=>{let next=attrs.replace(/\s+topLeftCell="[^"]*"/,'').replace(/\s+zoomScale="[^"]*"/,' zoomScale="90"').replace(/\s+zoomScaleNormal="[^"]*"/,' zoomScaleNormal="90"');return`${next} topLeftCell="A1"${end}`;}).replace(/<selection\b[^>]*\/>/,'<selection activeCell="A1" sqref="A1"/>');
  return{xml:output,layouts,lastRow:visibleLastRow,dimensionLastRow};
}

// อธิบาย: ปรับตำแหน่ง pivot location ref
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function patchPivotLocation(xml,ref){
  let output=xml.replace(/(<location\b[^>]*\bref=")[^"]*(")/,'$1'+ref+'$2');
  output=output.replace(/<pivotTableDefinition\b([^>]*)>/,(_,attrs)=>{let next=attrs.replace(/\s+refreshDataOnOpen="[^"]*"/g,'');for(const [name,value] of [['enableDrill','1'],['showDrill','1'],['preserveFormatting','1']]){const pattern=new RegExp(`\\s${name}="[^"]*"`);next=pattern.test(next)?next.replace(pattern,` ${name}="${value}"`):next+` ${name}="${value}"`;}return`<pivotTableDefinition${next}>`;});
  return output;
}
// อธิบาย: patch package ของ PV pivot ให้ชี้ข้อมูลใหม่
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function patchPvPivotPackage(zip,sheetPath,sourceXml,context,dateStyleMap){
  const pvResult=buildPvSheetXml(sourceXml,context,dateStyleMap),relsPath=worksheetRelsPath(sheetPath),relsFile=zip.file(relsPath);
  if(relsFile){
    const relsXml=await relsFile.async('string'),relation=(relsXml.match(/<Relationship\b[^>]*\/>/g)||[]).find(tag=>/\/pivotTable"/.test(tag));
    if(relation){
      const target=normalizeZipPath(sheetPath,attrFromTag(relation,'Target')),file=zip.file(target);
      if(file)zip.file(target,patchPivotLocation(await file.async('string'),pvResult.locationRef));
    }
  }
  zip.file(sheetPath,pvResult.xml);return pvResult;
}
// อธิบาย: อ่าน row เริ่มต้นเดิมของ pivot location
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function pivotOriginalStartRow(xml){const match=xml.match(/<location\b[^>]*\bref="[A-Z]+(\d+):/);return match?Number(match[1]):0;}
// อธิบาย: patch Report pivot package ทั้ง worksheet, cache และ definitions
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function patchReportPivotPackage(zip,sheetPath,sourceXml,context,summary,contentTypesXml,dateStyleMap={},snapshot=null){
  const reportSnapshot=snapshot||buildReportPivotCacheSnapshot(pvFinalDisplayRows(context)),reportResult=buildCompactReportSheetXml(sourceXml,context,summary,dateStyleMap),relsPath=worksheetRelsPath(sheetPath),relsFile=zip.file(relsPath);let relsXml=relsFile?await relsFile.async('string'):'';
  const relationTags=relsXml.match(/<Relationship\b[^>]*\/>/g)||[],pivotRelations=[],filterMetadata=[];
  for(const tag of relationTags){
    if(!/\/pivotTable"/.test(tag))continue;
    const target=normalizeZipPath(sheetPath,attrFromTag(tag,'Target')),file=zip.file(target);if(!file)continue;
    const xml=await file.async('string'),pivotName=attrFromTag((xml.match(/<pivotTableDefinition\b[^>]*>/)||[])[0]||'','name');
    pivotRelations.push({tag,id:attrFromTag(tag,'Id'),target,xml,name:pivotName,start:pivotOriginalStartRow(xml)});
  }
  const agingRelation=pivotRelations.find(item=>item.name==='PivotTable2')||pivotRelations.find(item=>item.start===7);
  if(!agingRelation)throw new Error('BW-PIVOT-TABLE-002: ไม่พบ PivotTable2 สำหรับ Aging Report');
  zip.file(agingRelation.target,buildAgingPivotTableDefinition(agingRelation.xml,reportResult.layouts.aging,reportSnapshot));
  const statusLayouts=[...reportResult.layouts.sections,...reportResult.layouts.hiddenSections];
  for(const relation of pivotRelations){
    if(relation===agingRelation)continue;
    const layout=statusLayouts.find(item=>item.pivotName===relation.name)||statusLayouts.find(item=>item.originalPivotRow===relation.start);
    if(!layout)throw new Error(`BW-REPORT-FILTER-005: ไม่พบ Layout สำหรับ Pivot เดิมแถว ${relation.start}`);
    const rebuilt=buildStatusPivotTableDefinition(relation.xml,layout,reportSnapshot);
    zip.file(relation.target,rebuilt.xml);
    filterMetadata.push({pivotPath:relation.target,status:layout.status,item:rebuilt.statusIndex,location:layout.ref,pageRow:layout.filterRow,hiddenEndRow:layout.grandRow,hidden:!!layout.hidden});
  }
  filterMetadata.sort((left,right)=>REPORT_STATUS_ORDER.indexOf(left.status)-REPORT_STATUS_ORDER.indexOf(right.status));
  if(filterMetadata.length!==REPORT_BLOCKS.length)throw new Error(`BW-REPORT-FILTER-004: Pivot Filter Metadata ${filterMetadata.length}/${REPORT_BLOCKS.length}`);
  if(relsFile)zip.file(relsPath,relsXml);zip.file(sheetPath,reportResult.xml);
  return{...reportResult,contentTypesXml,statusItems:reportSnapshot.statusItems,filterMetadata,snapshot:reportSnapshot};
}

// อธิบาย: ตั้ง print area ของ Report ให้พอดีกับแถวจริง
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function patchReportPrintArea(workbookXml,lastRow){
  return workbookXml.replace(/(<definedName\b[^>]*name="_xlnm\.Print_Area"[^>]*>)([^<]*Report[^<]*)(<\/definedName>)/g,(_,open,value,close)=>`${open}'Report'!$A$1:$D$${lastRow}${close}`);
}

// อธิบาย: อัปเดต pivotCacheDefinition ให้ชี้ source range และ record count ใหม่
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function patchPivotCacheSavedData(xml,{sourceRange='',recordCount=null,refreshOnLoad='0'}={}){
  let output=xml.replace(/<pivotCacheDefinition\b([^>]*)>/,(_,attrs)=>{
    let next=attrs;for(const [name,value] of [['refreshOnLoad',refreshOnLoad],['enableRefresh','1'],['backgroundQuery','0'],['saveData','1']])next=upsertXmlAttribute(next,name,value);
    if(!/\sr:id="[^"]+"/.test(next))next=upsertXmlAttribute(next,'r:id','rId1');
    if(recordCount!==null)next=upsertXmlAttribute(next,'recordCount',String(recordCount));
    return`<pivotCacheDefinition${next}>`;
  });
  if(sourceRange)output=output.replace(/(<worksheetSource\b[^>]*\bref=")[^"]*(")/,'$1'+sourceRange+'$2');
  return output;
}
// อธิบาย: สร้าง/ปรับ pivotCacheDefinition สำหรับ Report
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function buildReportPivotCacheDefinition(xml,rows,snapshot=null){
  const reportSnapshot=snapshot||buildReportPivotCacheSnapshot(rows),outputBase=patchPivotCacheSavedData(xml,{recordCount:reportSnapshot.recordCount});
  if(!/<cacheFields\b[^>]*>[\s\S]*?<\/cacheFields>/.test(outputBase))throw new Error('BW-PIVOT-CACHE-002: Report Pivot Cache ไม่มี cacheFields');
  const output=outputBase.replace(/<cacheFields\b[^>]*>[\s\S]*?<\/cacheFields>/,reportSnapshot.cacheFieldsXml);
  return{xml:output,...reportSnapshot};
}
// อธิบาย: ดึง pivotField blocks จาก XML เพื่อ validation
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function pivotFieldBlocks(xml){const container=(xml.match(/<pivotFields\b[^>]*>[\s\S]*?<\/pivotFields>/)||[])[0]||'';return container.match(/<pivotField\b[^>]*?(?:\/>|>[\s\S]*?<\/pivotField>)/g)||[];}
// อธิบาย: อ่าน references ของ item ใน pivotField
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function pivotItemReferences(block){return[...(block.matchAll(/<item\b[^>]*\bx="(\d+)"[^>]*\/>/g))].map(match=>Number(match[1]));}
// อธิบาย: อ่าน item references ใน rowItems
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function rowItemReferences(xml){return[...(xml.matchAll(/<rowItems\b[^>]*>[\s\S]*?<\/rowItems>/g))].flatMap(match=>[...match[0].matchAll(/<x\b[^>]*\bv="(\d+)"[^>]*\/>/g)].map(item=>Number(item[1])));}
// อธิบาย: ตรวจ semantic ของ Report pivot ว่า cache/items/reference สอดคล้อง
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function validateReportPivotSemanticPackage(zip,snapshot){
  const failures=[],expectedCounts=snapshot.shared.map(field=>field.items.length),pivotPaths=Object.keys(zip.files).filter(name=>/^xl\/pivotTables\/pivotTable[2-6]\.xml$/.test(name)).sort();
  if(pivotPaths.length!==5)failures.push(`Report Pivot files ${pivotPaths.length}/5`);
  for(const path of pivotPaths){
    const xml=await zip.file(path).async('string'),fields=pivotFieldBlocks(xml),name=attrFromTag((xml.match(/<pivotTableDefinition\b[^>]*>/)||[])[0]||'','name');
    if(fields.length!==expectedCounts.length){failures.push(`${name||path}: pivotFields ${fields.length}/${expectedCounts.length}`);continue;}
    fields.forEach((field,index)=>{
      const references=pivotItemReferences(field);
      if(references.length&&references.length!==expectedCounts[index])failures.push(`${name}: field ${index} items ${references.length}/${expectedCounts[index]}`);
      if(new Set(references).size!==references.length)failures.push(`${name}: field ${index} item x ซ้ำ`);
      if(references.some(value=>value<0||value>=expectedCounts[index]))failures.push(`${name}: field ${index} item x เกิน Cache`);
    });
    const page=(xml.match(/<pageField\b[^>]*\bfld="5"[^>]*\bitem="(\d+)"[^>]*\/>/)||[])[1];
    if(name!=='PivotTable2'&&(page===undefined||Number(page)>=expectedCounts[5]))failures.push(`${name}: page filter ไม่ตรง Status Cache`);
    const refs=rowItemReferences(xml);if(refs.some(value=>!Number.isInteger(value)||value<0))failures.push(`${name}: rowItems index ไม่ถูกต้อง`);
    if(!/\benableDrill="1"/.test(xml)||!/\bshowDrill="1"/.test(xml))failures.push(`${name}: Drill-down ไม่ได้เปิด`);
  }
  if(failures.length)throw new Error(`BW-PIVOT-SEMANTIC-001: ${failures.join('; ')}`);
  return{ok:true,pivotCount:pivotPaths.length,cacheFieldCounts:expectedCounts.join(',')};
}
// อธิบาย: อ่านเลข row ที่ถูกซ่อนใน worksheet XML
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function worksheetHiddenRowSet(xml){
  const hidden=new Set();
  for(const match of xml.matchAll(/<row\b[^>]*>/g)){
    const row=Number(attrFromTag(match[0],'r'));
    if(row&&attrFromTag(match[0],'hidden')==='1')hidden.add(row);
  }
  return hidden;
}
// อธิบาย: อ่าน rows ที่ pivot table วางอยู่
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function pivotLocationRows(xml){
  const tag=(xml.match(/<location\b[^>]*\bref="[^"]+"[^>]*\/>/)||[])[0]||'',ref=attrFromTag(tag,'ref'),match=ref.match(/^[A-Z]+(\d+):[A-Z]+(\d+)$/);
  return match?{ref,start:Number(match[1]),end:Number(match[2])}:null;
}
// อธิบาย: ตรวจว่า staging rows ที่ใช้ feed pivot ถูกซ่อนจริงและไม่ชน report
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function validateHiddenReportPivotStaging(zip,sheetPath,reportPackage){
  const sheetFile=zip.file(sheetPath);if(!sheetFile)throw new Error('BW-REPORT-HIDDEN-001: ไม่พบ Report Worksheet');
  const sheetXml=await sheetFile.async('string'),hiddenRows=worksheetHiddenRowSet(sheetXml),failures=[];
  for(const item of reportPackage.filterMetadata){
    const pivotFile=zip.file(item.pivotPath);if(!pivotFile){failures.push(`${item.status}: ไม่พบ PivotTable XML`);continue;}
    const pivotXml=await pivotFile.async('string'),location=pivotLocationRows(pivotXml);
    if(!location){failures.push(`${item.status}: ไม่พบ Pivot location`);continue;}
    const actualPageRow=location.start-2;
    if(actualPageRow!==Number(item.pageRow))failures.push(`${item.status}: Page Filter row ${actualPageRow}/${item.pageRow}`);
    if(!hiddenRows.has(actualPageRow))failures.push(`${item.status}: Page Filter row ${actualPageRow} ไม่ถูกซ่อน`);
    if(item.hidden){
      if(actualPageRow<=reportPackage.lastRow)failures.push(`${item.status}: Hidden staging อยู่ในพื้นที่ Report ที่มองเห็น`);
      for(let row=actualPageRow;row<=location.end;row++)if(!hiddenRows.has(row))failures.push(`${item.status}: Hidden staging row ${row} ไม่ถูกซ่อน`);
    }
  }
  if(failures.length)throw new Error(`BW-REPORT-HIDDEN-001: ${failures.join('; ')}`);
  return{ok:true,statusPivotCount:reportPackage.filterMetadata.length,hiddenPivotCount:reportPackage.filterMetadata.filter(item=>item.hidden).length};
}
// อธิบาย: เขียน pivotCacheRecords XML กลับเข้า zip
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function writePivotCacheRecords(zip,cachePath,recordsXml){
  const relations=await relationshipTargets(zip,cachePath,'/pivotCacheRecords');
  if(relations.length!==1)throw new Error(`BW-PIVOT-CACHE-003: ${cachePath} ต้องมี Pivot Cache Records 1 ตัว`);
  zip.file(relations[0].target,recordsXml);return relations[0].target;
}
// อธิบาย: เปิดคุณสมบัติ drill-down ของ pivot XML
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function enablePivotDrill(xml){return xml.replace(/<pivotTableDefinition\b([^>]*)>/,(_,attrs)=>{let next=attrs;for(const [name,value] of [['enableDrill','1'],['showDrill','1'],['preserveFormatting','1']]){const pattern=new RegExp(`\\s${name}="[^"]*"`);next=pattern.test(next)?next.replace(pattern,` ${name}="${value}"`):next+` ${name}="${value}"`;}return`<pivotTableDefinition${next}>`;});}
// อธิบาย: สร้าง XML ของ _Audit sheet สำหรับ template preserving path
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function buildAuditSheetXml(summary,removedRows=[]){
  const data=[['Key','Value'],...Object.entries(summary),[],['REMOVED ISSUED ROWS',''],['ProposalID','Source'],...(removedRows||[]).map(row=>[row.ProposalID,row.DataSource||''])];
  const rows=data.map((values,index)=>{const row=index+1,cells=values.map((value,column)=>{const reference=`${columnName(column)}${row}`;return typeof value==='number'?xmlNumberCell(reference,value,'0'):xmlTextCell(reference,value,'0');}).join('');return`<row r="${row}" spans="1:2">${cells}</row>`;}).join('');
  return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><dimension ref="A1:B${Math.max(1,data.length)}"/><sheetViews><sheetView workbookViewId="0"/></sheetViews><sheetFormatPr defaultRowHeight="15"/><cols><col min="1" max="1" width="42" customWidth="1"/><col min="2" max="2" width="68" customWidth="1"/></cols><sheetData>${rows}</sheetData><pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/></worksheet>`;
}
// อธิบาย: เพิ่มหรืออัปเดต _Audit sheet ใน xlsx zip package
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function ensureAuditSheet(zip,workbookXml,workbookRelsXml,contentTypesXml,summary,removedRows){
  const tags=workbookXml.match(/<sheet\b[^>]*\/>/g)||[],existing=tags.find(tag=>attrFromTag(tag,'name')==='_Audit');let sheetPath='';
  if(existing){const relationId=attrFromTag(existing,'r:id'),relation=(workbookRelsXml.match(/<Relationship\b[^>]*\/>/g)||[]).find(tag=>attrFromTag(tag,'Id')===relationId);sheetPath=relation?normalizeZipPath('xl/workbook.xml',attrFromTag(relation,'Target')):'';if(!/\bstate=/.test(existing))workbookXml=workbookXml.replace(existing,existing.replace('/>',' state="hidden"/>'));}
  else{
    const sheetIds=tags.map(tag=>Number(attrFromTag(tag,'sheetId'))||0),nextSheetId=Math.max(0,...sheetIds)+1;
    const relationIds=(workbookRelsXml.match(/Id="rId(\d+)"/g)||[]).map(value=>Number((value.match(/\d+/)||[])[0])||0),nextRelationId=`rId${Math.max(0,...relationIds)+1}`;
    const sheetNumbers=Object.keys(zip.files).map(name=>(name.match(/^xl\/worksheets\/sheet(\d+)\.xml$/)||[])[1]).filter(Boolean).map(Number),nextSheetNumber=Math.max(0,...sheetNumbers)+1;sheetPath=`xl/worksheets/sheet${nextSheetNumber}.xml`;
    workbookXml=workbookXml.replace('</sheets>',`<sheet name="_Audit" sheetId="${nextSheetId}" state="hidden" r:id="${nextRelationId}"/></sheets>`);
    workbookRelsXml=workbookRelsXml.replace('</Relationships>',`<Relationship Id="${nextRelationId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${nextSheetNumber}.xml"/></Relationships>`);
    if(!contentTypesXml.includes(`PartName="/${sheetPath}"`))contentTypesXml=contentTypesXml.replace('</Types>',`<Override PartName="/${sheetPath}" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`);
  }
  if(sheetPath)zip.file(sheetPath,buildAuditSheetXml(summary,removedRows));
  return{workbookXml,workbookRelsXml,contentTypesXml};
}
// อธิบาย: ตรวจยอด PV/PV Final/Report ให้ reconcile กันก่อนส่งไฟล์ออก
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function assertPvReportReconciliation(context,summary,pvResult,pvFinalResult,reportPackage){
  const expected=pvFinalDisplayRows(context),expectedPremium=expected.reduce((total,row)=>total+number(row[8]),0),agingCount=(reportPackage.layouts.aging.groups||[]).reduce((total,row)=>total+number(row[2]),0),sectionCount=(reportPackage.layouts.sections||[]).reduce((total,item)=>total+item.subset.length,0),sectionPremium=(reportPackage.layouts.sections||[]).reduce((total,item)=>total+sum(item.subset,'TotalPremium'),0);
  const failures=[];
  if(pvResult.rows.length!==expected.length)failures.push(`PV ${pvResult.rows.length}/${expected.length}`);
  if(pvFinalResult.rows.length!==expected.length)failures.push(`PV Final ${pvFinalResult.rows.length}/${expected.length}`);
  if(agingCount!==expected.length)failures.push(`Report Aging ${agingCount}/${expected.length}`);
  if(sectionCount!==expected.length)failures.push(`Report Block ${sectionCount}/${expected.length}`);
  if(Math.abs(expectedPremium-number(summary.TotalPremium))>.001)failures.push(`PV Premium ${expectedPremium}/${summary.TotalPremium}`);
  if(Math.abs(sectionPremium-number(summary.TotalPremium))>.001)failures.push(`Report Premium ${sectionPremium}/${summary.TotalPremium}`);
  if(failures.length)throw new Error(`PV / PV Final / Report Reconciliation ไม่ผ่าน: ${failures.join(', ')}`);
}
// อธิบาย: สร้าง Master โดย patch จาก template เพื่อรักษา native pivot/drill-down
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function buildPivotPreservingMaster(templateBuffer,context,summary){
  if(!global.JSZip||!templateBuffer)throw new Error('Pivot Template Engine ไม่พร้อมใช้งาน');
  const zip=await global.JSZip.loadAsync(templateBuffer);if(!pivotTemplateRequiredFiles(zip))throw new Error('Master ไม่มี Pivot Template PV/Report ตามโครงสร้าง V2.5.3');
  let workbookXml=await zip.file('xl/workbook.xml').async('string'),workbookRelsXml=await zip.file('xl/_rels/workbook.xml.rels').async('string'),contentTypesXml=await zip.file('[Content_Types].xml').async('string'),stylesXml=await zip.file('xl/styles.xml').async('string');
  const sheetPaths={data:worksheetPathByName(workbookXml,workbookRelsXml,'Data'),sm:worksheetPathByName(workbookXml,workbookRelsXml,'ข้อมูลไม่สมบูรณ์'),blacklist:worksheetPathByName(workbookXml,workbookRelsXml,'Black List'),pv:worksheetPathByName(workbookXml,workbookRelsXml,'PV'),pvFinal:worksheetPathByName(workbookXml,workbookRelsXml,'PV Final'),report:worksheetPathByName(workbookXml,workbookRelsXml,'Report')};
  if(Object.values(sheetPaths).some(value=>!value))throw new Error('Master Pivot Template ขาด Sheet Data / PV / PV Final / Report');
  const dataXml=await zip.file(sheetPaths.data).async('string'),smXml=await zip.file(sheetPaths.sm).async('string'),blacklistXml=await zip.file(sheetPaths.blacklist).async('string'),pvXml=await zip.file(sheetPaths.pv).async('string'),pvFinalXml=await zip.file(sheetPaths.pvFinal).async('string'),reportXml=await zip.file(sheetPaths.report).async('string');
  const dateBases=[xmlCellStyle(pvXml,'A5','0'),xmlCellStyle(pvFinalXml,'A2','0'),xmlCellStyle(reportXml,'A25','0'),xmlCellStyle(reportXml,'A56','0'),xmlCellStyle(reportXml,'A136','0'),xmlCellStyle(reportXml,'A172','0')],dateStyles=ensureDateStyleMap(stylesXml,dateBases);stylesXml=dateStyles.xml;zip.file('xl/styles.xml',stylesXml);
  const dataResult=buildDataSheetXml(dataXml,context),smResult=buildControlSheetXml(smXml,'ข้อมูลไม่สมบูรณ์',context.smIds),blacklistResult=buildControlSheetXml(blacklistXml,'Blacklist',context.blIds),pvFinalResult=buildPvFinalSheetXml(pvFinalXml,context,dateStyles.map);
  zip.file(sheetPaths.data,dataResult.xml);zip.file(sheetPaths.sm,smResult.xml);zip.file(sheetPaths.blacklist,blacklistResult.xml);zip.file(sheetPaths.pvFinal,pvFinalResult.xml);
  for(const [sheetPath,range] of [[sheetPaths.data,dataResult.range],[sheetPaths.sm,smResult.range],[sheetPaths.blacklist,blacklistResult.range],[sheetPaths.pvFinal,pvFinalResult.range]]){const tablePath=await tablePathForWorksheet(zip,sheetPath);if(tablePath&&zip.file(tablePath)){const tableXml=await zip.file(tablePath).async('string');zip.file(tablePath,updateTableRange(tableXml,range));}}
  const pvResult=await patchPvPivotPackage(zip,sheetPaths.pv,pvXml,context,dateStyles.map),reportSnapshot=buildReportPivotCacheSnapshot(pvFinalResult.rows);
  const reportPackage=await patchReportPivotPackage(zip,sheetPaths.report,reportXml,context,summary,contentTypesXml,dateStyles.map,reportSnapshot);contentTypesXml=reportPackage.contentTypesXml;workbookXml=patchReportPrintArea(workbookXml,reportPackage.lastRow);
  const hiddenStagingInspection=await validateHiddenReportPivotStaging(zip,sheetPaths.report,reportPackage);
  assertPvReportReconciliation(context,summary,pvResult,pvFinalResult,reportPackage);
  const cacheDefinitions=Object.keys(zip.files).filter(name=>/^xl\/pivotCache\/pivotCacheDefinition\d+\.xml$/.test(name));let reportCacheRecordsPath='';
  for(const name of cacheDefinitions){
    const xml=await zip.file(name).async('string'),isDataCache=/<worksheetSource\b[^>]*\bsheet="Data"/.test(xml),isReportCache=/<worksheetSource\b[^>]*\bname="Table15"/.test(xml);
    if(isDataCache){zip.file(name,patchPivotCacheSavedData(xml,{sourceRange:dataResult.range}));continue;}
    if(isReportCache){const rebuilt=buildReportPivotCacheDefinition(xml,pvFinalResult.rows,reportSnapshot);zip.file(name,rebuilt.xml);reportCacheRecordsPath=await writePivotCacheRecords(zip,name,rebuilt.recordsXml);continue;}
    zip.file(name,patchPivotCacheSavedData(xml));
  }
  if(!reportCacheRecordsPath)throw new Error('BW-PIVOT-CACHE-004: ไม่พบ Report Pivot Cache Records');
  const semanticInspection=await validateReportPivotSemanticPackage(zip,reportSnapshot);
  const pivotTables=Object.keys(zip.files).filter(name=>/^xl\/pivotTables\/pivotTable\d+\.xml$/.test(name));for(const name of pivotTables)zip.file(name,enablePivotDrill(await zip.file(name).async('string')));
  const strictInspection=await inspectPivotTemplateZip(zip,{mode:'output',expectedReportPivotCount:5});
  if(!strictInspection.ok)throw new Error(`BW-PIVOT-001: ${strictInspection.message}`);
  summary.PivotStructuralValidation='PASSED_STRICT_REUSABLE_MASTER';summary.PivotSemanticValidation='PASSED_CACHE_FIELDS_RECORDS_PIVOT_ITEMS';summary.PivotSemanticDetails=semanticInspection.cacheFieldCounts;summary.ReportHiddenPivotStagingValidation=`PASSED_${hiddenStagingInspection.hiddenPivotCount}_HIDDEN`;summary.MasterReusableAsNextRun='YES';summary.PivotCacheMode='SAVED_UNDERLYING_DATA__NO_AUTO_REFRESH';summary.ExcelFinalizerRequired='NO';summary.ReportPivotCount=strictInspection.details.reportPivotCount;summary.ReportDownloadSnapshot='SOP_STATUS_BLOCKS_CORRECT_NO_VISIBLE_STAGING';summary.ReportUnderlyingData='SAVED';summary.ReportFilterMetadata=reportPackage.filterMetadata.map(item=>`${item.status}@${item.item}`).join('; ');
  const audit=ensureAuditSheet(zip,workbookXml,workbookRelsXml,contentTypesXml,summary,context.removedRows);workbookXml=audit.workbookXml;workbookRelsXml=audit.workbookRelsXml;contentTypesXml=audit.contentTypesXml;
  if(zip.file('xl/calcChain.xml'))zip.remove('xl/calcChain.xml');workbookRelsXml=workbookRelsXml.replace(/<Relationship\b[^>]*Type="[^"]*\/calcChain"[^>]*\/>/g,'');contentTypesXml=contentTypesXml.replace(/<Override\b[^>]*PartName="\/xl\/calcChain\.xml"[^>]*\/>/g,'');
  zip.file('xl/workbook.xml',workbookXml);zip.file('xl/_rels/workbook.xml.rels',workbookRelsXml);zip.file('[Content_Types].xml',contentTypesXml);
  const bytes=await zip.generateAsync({type:'uint8array',compression:'DEFLATE',compressionOptions:{level:6}});return new Blob([bytes],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
}

// อธิบาย: สร้างรหัส Run เช่น BWyyyymmdd_HHMMSS
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function makeRunId(now=new Date()){return`BW${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;}
// อธิบาย: สร้างชื่อไฟล์ output ตาม base name และวันที่รัน
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function outputNames(processedAt){const runDate=dateKey(processedAt);return{master:`${safeFileName(CONFIG.masterBaseName)}_${runDate}.xlsx`,issue:`${safeFileName(CONFIG.issueBaseName)}_${runDate}.xlsx`,report:`Report_${runDate}.png`};}

// อธิบาย: ตรวจความพร้อมของไฟล์ ข้อมูล วันที่ และ template ก่อนรันจริง
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function preflight(workbooks,files,etlText='',manualStartDate=''){
  const results=[];
  const master=findSheet(workbooks.master,['Data'],['ProposalID','CreateDate']);
  const masterInfo=extractMasterMaxDate(workbooks.master);
  const masterIdentity=master?analyzeStableDuplicateRows(extractMasterData(workbooks.master).rows):{duplicateKeys:0,duplicateRows:0,extraRows:0};
  results.push({field:'master',name:files.master?.name||'Master',ok:!!master,message:master?`พบ Sheet ${master.name}; Header row ${master.rowIndex+1}; Date(T) ที่อ่านได้ ${masterInfo.validRows} แถว`:'ไม่พบ ProposalID และ CreateDate ใน Sheet Data'});
  if(master)results.push({field:'masterIdentity',name:'Stable Record Identity',ok:true,message:masterIdentity.extraRows?`พบแถวซ้ำจากรอบก่อน ${masterIdentity.extraRows} แถว ระบบจะรวมอัตโนมัติด้วย CertificateNo หรือ alienCode + ProposalID โดยคง Date เดิมที่เก่าที่สุด`:'ไม่พบแถวซ้ำตาม Stable Record Identity ใน Master'});
  const sourceVersion=masterEngineVersion(workbooks.master);
  const unsafeVersion=sourceVersion==='3.5.1'||sourceVersion==='3.5.2';
  results.push({field:'masterVersion',name:'Master Version',ok:!unsafeVersion,message:unsafeVersion?`ห้ามใช้ Master V${sourceVersion} ต่อ เพราะเป็นรุ่นที่ Status/PV เคยคำนวณผิด กรุณากลับไปใช้ไฟล์ Manual V2.5.3 ที่ถูกต้อง หรือ Master V3.5.4 ขึ้นไป`:sourceVersion?`Master Engine Version: ${sourceVersion}`:'Master Legacy/Manual: อนุญาตให้ใช้เป็นฐานเริ่มต้น'});
  if(workbooks.master?.__sourceBuffer&&['PV','PV Final','Report'].every(name=>workbooks.master.SheetNames?.includes(name))){const uploadedOutput=await inspectPivotTemplateBuffer(workbooks.master.__sourceBuffer,{mode:'output'}),uploadedTemplateOk=await inspectPivotTemplate(workbooks.master),bundledOk=!!(await loadBundledPivotTemplate()),pivotTemplateOk=uploadedTemplateOk||bundledOk;const dynamicCount=uploadedOutput.ok?uploadedOutput.details.reportPivotCount:0;results.push({field:'pivotTemplate',name:'PV / PV Final / Report',ok:pivotTemplateOk,message:uploadedTemplateOk?'Master ใช้ซ้ำได้เต็มรูปแบบ: PV 1 + Report 5 + Cache 2':uploadedOutput.ok&&bundledOk?`Master Output ใช้เป็นข้อมูลต่อได้ (${dynamicCount} Report Pivot) และระบบจะใช้ Clean Template V2.5.3 สร้าง Pivot รอบใหม่อัตโนมัติ`:bundledOk?'Master Data ใช้ต่อได้ และระบบจะใช้ Clean Template V2.5.3 สร้าง Pivot รอบใหม่อัตโนมัติ':'ไม่พบ Clean Pivot Template สำหรับสร้าง Output กรุณาเปิดผ่าน START_LOCAL_WEB.bat และตรวจไฟล์ assets/BLACKWOLF_Master_Pivot_Template_V2.5.3.xlsx'});}
  const issueData=findNamedSheet(workbooks.issue,'Data'),issueCheck=extractIssueCheck(workbooks.issue),issueEtl=extractIssueEtl(workbooks.issue),issueOk=!!issueData&&!!issueCheck.found&&!!issueEtl.found;
  results.push({field:'issue',name:files.issue?.name||'เช็คสถานะ ISSUE',ok:issueOk,message:issueOk?`พบ Data + Check + ETL ครบ; ข้อมูลเดิม Check ${issueCheck.ids.length} และ ETL ${issueEtl.records.length} แถวจะถูกล้างก่อนวางข้อมูลรอบใหม่`:'ต้องมี Sheet Data, Check และ ETL ตามโครงสร้างไฟล์หลัก ISSUE'});
  const dailyFound=findSheet(workbooks.daily,['Data'],DAILY_HEADERS);
  results.push({field:'daily',name:files.daily?.name||'Daily Report',ok:!!dailyFound,message:dailyFound?`พบ Sheet ${dailyFound.name}; Header row ${dailyFound.rowIndex+1}; (blank) ใน Status อนุญาต`:'ขาด Header Daily Report ที่จำเป็น'});
  const m190Found=findSheet(workbooks.m190,['Policy Detail'],['Prop Id']);
  results.push({field:'m190',name:files.m190?.name||'M190',ok:!!m190Found,message:m190Found?`พบ Sheet ${m190Found.name}; Header row ${m190Found.rowIndex+1}`:'ไม่พบ Prop Id'});
  if(workbooks.sm){const found=extractControlIds(workbooks.sm,workbooks.sm.SheetNames);results.push({field:'sm',name:files.sm?.name||'SM',ok:!!found.found,message:found.found?`พบรายการใหม่ ${found.ids.length} แถว และจะ Merge กับรายการค้างเดิม`:'ไม่พบ CPROP_ID / Prop ID'});}
  if(workbooks.blacklist){const found=extractControlIds(workbooks.blacklist,workbooks.blacklist.SheetNames);results.push({field:'blacklist',name:files.blacklist?.name||'Blacklist',ok:!!found.found,message:found.found?`พบรายการใหม่ ${found.ids.length} แถว และจะ Merge กับรายการค้างเดิม`:'ไม่พบ CPROP_ID / Prop ID'});}
  const etl=parseEtl(etlText);
  if(etl.invalid)results.push({field:'etl',name:files.etl?.name||'Auto-Mail 7.2',ok:false,message:`ข้อความผิดรูปแบบ ${etl.invalid} บรรทัด`});
  else results.push({field:'etl',name:files.etl?.name||'Auto-Mail 7.2',ok:true,message:`ข้อมูลรอบปัจจุบัน ${etl.records.length} แถว; ETL เดิมในไฟล์ ISSUE จะไม่ถูกนำมาใช้`});
  let daily=null;
  try{if(dailyFound)daily=extractDaily(workbooks.daily);}catch(error){results.push({field:'dailyDate',name:files.daily?.name||'Daily Report',ok:false,message:error.message});}
  const manual=parseDate(manualStartDate);
  const startOk=!!masterInfo.date||!!manual;
  results.push({field:'startDate',name:'วันเริ่มต้น',ok:startOk,message:masterInfo.date?`ใช้ Date คอลัมน์ T ล่าสุด: ${dateKey(masterInfo.date)}`:manual?`Master ไม่มี Date ใช้วัน Manual: ${dateKey(manual)}`:'Master ไม่มี Date ที่อ่านได้ กรุณาระบุวันเริ่มต้น Manual'});
  if(startOk&&daily){const start=masterInfo.date||dateOnly(manual),end=daily.maxDate<dateOnly(new Date())?daily.maxDate:dateOnly(new Date());if(end<start)results.push({field:'dateRange',name:'ช่วงวันที่',ok:false,message:`วันเริ่มต้น ${dateKey(start)} มากกว่าวันสิ้นสุด ${dateKey(end)}`});}
  return{ok:results.every(result=>result.ok),results,masterDate:dateKey(masterInfo.date),manualStartDate:manual?dateKey(manual):'',issueOldCheckRows:issueCheck.ids.length,issueOldEtlRows:issueEtl.records.length,etlTextRows:etl.records.length};
}
// อธิบาย: ลำดับงานหลักทั้งหมดของ engine ตั้งแต่อ่านข้อมูลจนสร้าง blobs output
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function run({workbooks,etlText='',manualStartDate='',today=new Date(),onProgress=()=>{}}){
  const processedAt=new Date(today),runId=makeRunId(processedAt);
  assertMasterVersionSafe(workbooks.master);
  // อธิบาย: อัปเดตแถบ progress และข้อความสถานะระหว่างรัน
  // ขั้นตอน: เป็น helper แบบ arrow function ใช้เรียกซ้ำในไฟล์นี้
  const progress=async(percent,message)=>{onProgress(percent,message);await new Promise(resolve=>setTimeout(resolve,10));};
  await progress(5,'อ่านรายการค้างและ Date จากไฟล์หลัก');
  const masterData=extractMasterData(workbooks.master),masterInfo=extractMasterMaxDate(workbooks.master);
  await progress(12,'อ่านและตรวจช่วงวันที่จาก Daily Report');
  const daily=extractDaily(workbooks.daily),dateRange=resolveDateRange(masterInfo,daily,dateOnly(processedAt),manualStartDate);
  await progress(22,`กรอง Daily Report ${dateKey(dateRange.start)} ถึง ${dateKey(dateRange.end)} รวม Status (blank)`);
  const filteredResult=filterDailyRows(daily,dateRange.start,dateRange.end),dailyFiltered=filteredResult.rows;
  await progress(32,'Carry Forward รายการค้างและรวมรายการเดิมด้วย Stable Record Identity');
  const reconciled=reconcileRows(masterData.rows,dailyFiltered);
  await progress(42,'ล้างข้อมูล Check/ETL เดิมในหน่วยความจำและอ่านข้อมูลรอบปัจจุบัน');
  const oldCheck=extractIssueCheck(workbooks.issue),oldEtl=extractIssueEtl(workbooks.issue);
  const m190=extractIds(workbooks.m190,['Policy Detail'],['Prop Id']);
  const etl=parseEtl(etlText);if(etl.invalid)throw new Error(`Auto-Mail 7.2 มีรูปแบบไม่ถูกต้อง ${etl.invalid} บรรทัด`);
  const checkIds=[...m190.ids];
  const issuedIds=unique([...m190.ids,...etl.records.map(record=>record.PropId)]);
  await progress(54,'Merge ข้อมูลไม่สมบูรณ์และ Blacklist กับรายการค้างเดิม');
  const oldSm=extractControlIds(workbooks.master,['ข้อมูลไม่สมบูรณ์']);
  const oldBlacklist=extractControlIds(workbooks.master,['Black List','Blacklist']);
  const newSm=workbooks.sm?extractControlIds(workbooks.sm,workbooks.sm.SheetNames):{ids:[]};
  const newBlacklist=workbooks.blacklist?extractControlIds(workbooks.blacklist,workbooks.blacklist.SheetNames):{ids:[]};
  const smBeforeRemoval=reconcileIdRows(oldSm.ids,newSm.ids),blacklistBeforeRemoval=reconcileIdRows(oldBlacklist.ids,newBlacklist.ids),issuedSet=new Set(issuedIds);
  const smIds=smBeforeRemoval.filter(value=>!issuedSet.has(id(value))),blIds=blacklistBeforeRemoval.filter(value=>!issuedSet.has(id(value)));
  await progress(66,'ลบเฉพาะ ProposalID ที่ยืนยันว่าออกกรมธรรม์แล้ว');
  const classified=classifyPending(reconciled.rows,issuedIds,smIds,blIds,dateOnly(processedAt));
  const context={runId,processedAt,masterInfo,masterRows:masterData.rows,daily,dateRange,dailyFiltered,dailyFilterStats:filteredResult,reconciled,m190Ids:m190.ids,etl,checkIds,issuedIds,issueOldCheckRows:oldCheck.ids.length,issueOldEtlRows:oldEtl.records.length,smIds,blIds,pending:classified.pending,removedRows:classified.removed,issuedRemoved:classified.issuedRemoved};
  await progress(78,'สรุป Dashboard, Reconciliation และ Audit');
  const summary=summarize(context),names=outputNames(processedAt);
  await progress(88,'สร้างไฟล์หลักพร้อมสูตร P:W และไฟล์เช็คสถานะ ISSUE รอบใหม่');
  const masterWorkbook=buildMasterWorkbook(context,summary),issueWorkbook=buildIssueWorkbook(context,summary);
  const resolvedTemplate=await resolvePivotTemplateBuffer(workbooks.master);if(!resolvedTemplate)throw new Error('ไม่พบ Clean Pivot Template ที่สมบูรณ์ — กรุณาเปิดผ่าน START_LOCAL_WEB.bat แล้วตรวจสอบไฟล์ใหม่');
  summary.PVWorkbookMode='SAVED_NATIVE_PIVOT_CACHE';summary.PivotTemplateSource=resolvedTemplate.source;summary.ExcelFinalizerRequired='NO';
  const masterOutput=await buildPivotPreservingMaster(resolvedTemplate.buffer,context,summary);
  const outputs={master:masterOutput,issue:workbookBlob(issueWorkbook),names};
  await progress(100,'ประมวลผลสำเร็จ พร้อมดาวน์โหลดไฟล์หลัก 2 ไฟล์');
  return{runId,summary,rows:context.pending,outputs,context};
}

global.BlackwolfEngine={
  readWorkbook,detectWorkbookRole,preflight,run,parseEtl,
  preview:{aggregatePvRows,groupByAging,groupStatusRows},
  normalize:{text,id,key:rawKey,parseDate,dateKey,dateDisplay,excelSerial,canonicalHeader},
  internals:{findSheet,findNamedSheet,auditValue,masterEngineVersion,assertMasterVersionSafe,extractMasterData,extractMasterMaxDate,extractDaily,filterDailyRows,extractIds,extractControlIds,extractIssueEtl,extractIssueCheck,reconcileRows,reconcileIdRows,resolveDateRange,classifyPending,aggregatePvRows,summarize,buildMasterWorkbook,buildIssueWorkbook,buildPivotPreservingMaster,inspectPivotTemplate,inspectPivotTemplateBuffer,resolvePivotTemplateBuffer,outputNames,rowFingerprint,rowStableIdentity,analyzeStableDuplicateRows,analyzeAlienDuplicates,mergeIdentityRows,inspectPivotTemplateZip}
};
})(typeof self!=='undefined'?self:globalThis);
