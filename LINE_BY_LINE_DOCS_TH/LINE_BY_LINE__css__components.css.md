# อธิบายบรรทัดต่อบรรทัด: `css/components.css`

**บทบาทไฟล์:** ไฟล์ตกแต่งหน้าจอ: layout, สี, responsive, component หรือ report style

> วิธีอ่าน: ดูเลขบรรทัด L0001, L0002, ... แล้วเทียบกับไฟล์โค้ดต้นฉบับ/ไฟล์ที่ใส่คอมเมนต์แล้วได้ทันที

| บรรทัด | โค้ด | คำอธิบายแบบคนเริ่มจากศูนย์ |
|---:|---|---|
| L0001 | `/* BLACKWOLF CSS TEACHING COMMENTS: css/components.css ควบคุมหน้าตา/สี/ระยะ/ responsive ของ UI; ใช้ CSS comment รูปแบบนี้เพื่อไม่ให้ browser ตีความผิด */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0002 | `/* STEP: กฎในไฟล์นี้เป็นชั้นตกแต่ง/override ของ component เฉพาะส่วน */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0003 | `/* Navigation, controls, upload, workbook preview and dashboard components */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0004 | `/* V3.5.5 Professional Web components */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0005 | `.nav b{font:inherit}.topbar{height:86px}.top-actions{gap:8px;flex-wrap:nowrap}.clock-box,.current-run-box{display:flex;flex-direction:column;text-align:right...` | เริ่มกำหนด style ให้ selector `.nav b` เช่น สี ระยะ ขนาด หรือ layout |
| L0006 | `.btn.success{background:#12a66a;color:#fff}.btn.danger{background:#c83a4e;color:#fff}.btn.compact{padding:7px 10px}.btn.wide,.link-button{display:block;width...` | เริ่มกำหนด style ให้ selector `.btn.success` เช่น สี ระยะ ขนาด หรือ layout |
| L0007 | `.etl-inline-card{margin:0 20px 17px;border:1px solid #d9d7fb;background:linear-gradient(135deg,#fbfaff,#f5f3ff);border-radius:14px;padding:15px}.etl-inline-h...` | เริ่มกำหนด style ให้ selector `.etl-inline-card` เช่น สี ระยะ ขนาด หรือ layout |
| L0008 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
