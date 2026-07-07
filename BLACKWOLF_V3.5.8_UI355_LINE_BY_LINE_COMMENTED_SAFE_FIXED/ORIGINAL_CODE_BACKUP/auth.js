(function(){
'use strict';

// BLACKWOLF TEACHING COMMENTS: คอมเมนต์ชุดนี้เพิ่มเพื่ออธิบาย logic สำหรับอ่าน/ดูแลโค้ด
// หลักสำคัญ: คอมเมนต์ขึ้นต้นด้วย // จะไม่ถูกรัน จึงไม่เปลี่ยน behavior ของ JavaScript
// ภาพรวม: ไฟล์ควบคุมหน้าล็อกอินทั้งหมด ตั้งแต่จำชื่อผู้ใช้ ตรวจ Hash และปลดล็อก UI
// ภาพรวม: ใช้ Web Crypto API เพื่อคำนวณ SHA-256/PBKDF2 ใน Browser โดยไม่ส่งข้อมูลออกนอกเครื่อง
// ภาพรวม: เก็บเฉพาะ session การล็อกอินและชื่อผู้ใช้ที่เลือกจำ ไม่เก็บรหัสผ่านจริง
const SESSION_KEY='blackwolf.v356.authenticated';
const REMEMBER_KEY='blackwolf.v356.rememberedUsername';
const PROFILE=globalThis.BLACKWOLF_ACCESS_PROFILE||null;
const $=selector=>document.querySelector(selector);

// อธิบาย: แปลง Base64 เป็น byte array เพื่อใช้กับ Web Crypto
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function bytesFromBase64(value){
  const binary=atob(String(value||''));
  const output=new Uint8Array(binary.length);
  for(let index=0;index<binary.length;index++)output[index]=binary.charCodeAt(index);
  return output;
}
// อธิบาย: แปลง byte array กลับเป็น Base64 สำหรับเทียบกับค่า Hash ที่เก็บไว้
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function base64FromBytes(value){
  let binary='';
  const bytes=value instanceof Uint8Array?value:new Uint8Array(value);
  for(const byte of bytes)binary+=String.fromCharCode(byte);
  return btoa(binary);
}
// อธิบาย: เทียบ string แบบลด timing leak โดยวนเทียบทุกตำแหน่งก่อนคืนผล
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function constantTimeEqual(left,right){
  const a=String(left||''),b=String(right||'');
  let diff=a.length^b.length;
  const length=Math.max(a.length,b.length);
  for(let index=0;index<length;index++)diff|=(a.charCodeAt(index%Math.max(1,a.length))||0)^(b.charCodeAt(index%Math.max(1,b.length))||0);
  return diff===0;
}
// อธิบาย: ปรับ Username ให้เป็นมาตรฐานเดียวกันก่อนคำนวณ hash
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function normalizeUsername(value){return String(value||'').normalize('NFKC').trim().toUpperCase();}
// อธิบาย: คำนวณ SHA-256 ของข้อความแล้วคืนเป็น Base64
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function sha256Base64(value){
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));
  return base64FromBytes(digest);
}
// อธิบาย: คำนวณ PBKDF2-SHA-256 จาก password/salt/iterations ตาม profile
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function derivePasswordHash(password,profile){
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(String(password||'')),{name:'PBKDF2'},false,['deriveBits']);
  const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:bytesFromBase64(profile.salt),iterations:Number(profile.iterations||310000)},key,256);
  return base64FromBytes(bits);
}
// อธิบาย: ตรวจ Username และ Password ที่ผู้ใช้กรอกกับ Hash ใน access-profile.js
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
async function verifyCredentials(username,password){
  if(!PROFILE||PROFILE.version!==1)throw new Error('ไม่พบ Creator Access Profile หรือ Profile ไม่ถูกต้อง');
  if(!globalThis.crypto?.subtle)throw new Error('Browser นี้ไม่รองรับ Web Crypto กรุณาใช้ Chrome หรือ Edge รุ่นปัจจุบัน');

  const normalized=normalizeUsername(username);

  /*
   * รองรับ Access Profile ทั้ง 2 รูปแบบ:
   * 1) Username Hash แบบ SHA-256 เดิม
   * 2) Username Hash แบบ PBKDF2 ที่ Access Profile Builder บางเวอร์ชันสร้าง
   * Password ยังคงตรวจด้วย PBKDF2-SHA-256 เท่านั้น
   */
  const [legacyUsernameHash,pbkdf2UsernameHash,passwordHash]=await Promise.all([
    sha256Base64(normalized),
    derivePasswordHash(normalized,PROFILE),
    derivePasswordHash(password,PROFILE)
  ]);

  const usernameMatches=
    constantTimeEqual(legacyUsernameHash,PROFILE.usernameHash)||
    constantTimeEqual(pbkdf2UsernameHash,PROFILE.usernameHash);

  return usernameMatches&&constantTimeEqual(passwordHash,PROFILE.passwordHash);
}
// อธิบาย: อ่านชื่อผู้ใช้ที่เคยเลือกจำไว้จาก localStorage
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function readRememberedUsername(){try{return localStorage.getItem(REMEMBER_KEY)||'';}catch{return'';}}
// อธิบาย: บันทึกชื่อผู้ใช้ลง localStorage โดยไม่บันทึกรหัสผ่าน
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function saveRememberedUsername(username){try{localStorage.setItem(REMEMBER_KEY,String(username||''));}catch{}}
// อธิบาย: ลบชื่อผู้ใช้ที่เคยจำไว้
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function clearRememberedUsername(){try{localStorage.removeItem(REMEMBER_KEY);}catch{}}
// อธิบาย: เติมชื่อผู้ใช้ที่เคยจำไว้กลับเข้า form login
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function applyRememberedUsername(){
  const remembered=readRememberedUsername(),username=$('#authUsername'),remember=$('#rememberPassword');
  if(username)username.value=remembered;
  if(remember)remember.checked=!!remembered;
  return!!remembered;
}
// อธิบาย: ล็อก/ปลดล็อกหน้า app และบันทึกสถานะใน sessionStorage
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function setAuthenticated(value){
  document.body.classList.toggle('authenticated',value);
  document.body.classList.toggle('auth-locked',!value);
  const shell=$('#applicationShell');
  if(shell)shell.setAttribute('aria-hidden',value?'false':'true');
  try{if(value)sessionStorage.setItem(SESSION_KEY,'1');else sessionStorage.removeItem(SESSION_KEY);}catch{}
  if(!value)setTimeout(()=>$('#authUsername')?.focus(),50);
}
// อธิบาย: ล้างข้อความ error และกรอบแดงในฟอร์ม login
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function clearError(){
  const error=$('#authError');if(error)error.textContent='';
  document.querySelectorAll('.auth-field').forEach(field=>field.classList.remove('has-error'));
}
// อธิบาย: แสดง error login และเลือกช่อง password เพื่อให้กรอกใหม่ได้ทันที
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function showError(message){
  const error=$('#authError');if(error)error.textContent=message;
  document.querySelectorAll('.auth-field').forEach(field=>field.classList.add('has-error'));
  $('#authPassword')?.select();
}
// อธิบาย: เปลี่ยนสถานะปุ่ม login ระหว่างกำลังตรวจรหัส
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function setSubmitting(value){
  const button=$('#authForm button[type="submit"]');
  if(button){button.disabled=value;button.textContent=value?'กำลังตรวจสอบรหัส...':'▣ ล็อกอินเข้าสู่ระบบ';}
}
// อธิบาย: เริ่มระบบ login ผูก event submit/show password และ logout
// ขั้นตอน: รับ input → normalize/ประมวลผลตามหน้าที่ → คืนค่าให้ flow ถัดไป
function initAuth(){
  applyRememberedUsername();
  let alreadyAuthenticated=false;
  try{alreadyAuthenticated=sessionStorage.getItem(SESSION_KEY)==='1';}catch{}
  setAuthenticated(alreadyAuthenticated);
  if(!PROFILE)showError('ไม่พบ access-profile.js กรุณาใช้ชุดโปรแกรมที่ครบถ้วน');

  $('#authForm')?.addEventListener('submit',async event=>{
    event.preventDefault();clearError();setSubmitting(true);
    const username=$('#authUsername')?.value.trim()||'',password=$('#authPassword')?.value||'';
    try{
      if(await verifyCredentials(username,password)){
        const remember=$('#rememberPassword')?.checked===true;
        if(remember)saveRememberedUsername(username);else clearRememberedUsername();
        setAuthenticated(true);
        if($('#authPassword'))$('#authPassword').value='';
        return;
      }
      showError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบแล้วลองอีกครั้ง');
    }catch(error){showError(error?.message||'ตรวจสอบรหัสไม่สำเร็จ');}
    finally{setSubmitting(false);}
  });

  $('#togglePasswordBtn')?.addEventListener('click',()=>{
    const input=$('#authPassword');if(!input)return;
    const showing=input.type==='text';input.type=showing?'password':'text';
    $('#togglePasswordBtn').textContent=showing?'◉':'◌';
    $('#togglePasswordBtn').setAttribute('aria-label',showing?'แสดงรหัสผ่าน':'ซ่อนรหัสผ่าน');input.focus();
  });
  $('#authUsername')?.addEventListener('input',clearError);
  $('#authPassword')?.addEventListener('input',clearError);
  $('#rememberPassword')?.addEventListener('change',event=>{if(!event.target.checked)clearRememberedUsername();});
  $('#logoutBtn')?.addEventListener('click',()=>{
    setAuthenticated(false);
    const username=$('#authUsername'),password=$('#authPassword');
    if(username)username.value='';if(password){password.value='';password.type='password';}
    applyRememberedUsername();clearError();
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAuth,{once:true});else initAuth();
})();
