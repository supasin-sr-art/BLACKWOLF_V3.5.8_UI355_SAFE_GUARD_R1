# อธิบายบรรทัดต่อบรรทัด: `css/settings.css`

**บทบาทไฟล์:** ไฟล์ตกแต่งหน้าจอ: layout, สี, responsive, component หรือ report style

> วิธีอ่าน: ดูเลขบรรทัด L0001, L0002, ... แล้วเทียบกับไฟล์โค้ดต้นฉบับ/ไฟล์ที่ใส่คอมเมนต์แล้วได้ทันที

| บรรทัด | โค้ด | คำอธิบายแบบคนเริ่มจากศูนย์ |
|---:|---|---|
| L0001 | `/* BLACKWOLF CSS TEACHING COMMENTS: css/settings.css ควบคุมหน้าตา/สี/ระยะ/ responsive ของ UI; ใช้ CSS comment รูปแบบนี้เพื่อไม่ให้ browser ตีความผิด */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0002 | `/* STEP: กฎในไฟล์นี้จัดรูปแบบหน้า Settings/System Information */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0003 | `/* Settings and System Information */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0004 | `/* Settings */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0005 | `.settings-hero{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#25103f,#7047d9);color:#fff;border-radius:16px...` | เริ่มกำหนด style ให้ selector `.settings-hero` เช่น สี ระยะ ขนาด หรือ layout |
| L0006 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0007 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0008 | `.settings-columns-three{grid-template-columns:repeat(3,minmax(0,1fr))}` | เริ่มกำหนด style ให้ selector `.settings-columns-three` เช่น สี ระยะ ขนาด หรือ layout |
| L0009 | `.line-support-card{border-top-color:#06c755}` | เริ่มกำหนด style ให้ selector `.line-support-card` เช่น สี ระยะ ขนาด หรือ layout |
| L0010 | `.line-support-card .line-icon{font-size:8px;letter-spacing:-.02em}` | เริ่มกำหนด style ให้ selector `.line-support-card .line-icon` เช่น สี ระยะ ขนาด หรือ layout |
