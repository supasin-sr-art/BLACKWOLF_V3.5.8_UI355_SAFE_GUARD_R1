# อธิบายบรรทัดต่อบรรทัด: `css/print.css`

**บทบาทไฟล์:** ไฟล์ตกแต่งหน้าจอ: layout, สี, responsive, component หรือ report style

> วิธีอ่าน: ดูเลขบรรทัด L0001, L0002, ... แล้วเทียบกับไฟล์โค้ดต้นฉบับ/ไฟล์ที่ใส่คอมเมนต์แล้วได้ทันที

| บรรทัด | โค้ด | คำอธิบายแบบคนเริ่มจากศูนย์ |
|---:|---|---|
| L0001 | `/* BLACKWOLF CSS TEACHING COMMENTS: css/print.css ควบคุมหน้าตา/สี/ระยะ/ responsive ของ UI; ใช้ CSS comment รูปแบบนี้เพื่อไม่ให้ browser ตีความผิด */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0002 | `/* STEP: กฎในไฟล์นี้ใช้เมื่อต้องพิมพ์หรือ export report */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0003 | `/* Print / Save PDF */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0004 | `@media print{body{background:#fff}.sidebar,.topbar,.page:not(#page-report),.report-page-heading,.toast,.image-modal,.confirm-modal{display:none!important}.ap...` | เริ่มเงื่อนไข responsive เพื่อปรับหน้าจอตามความกว้างของอุปกรณ์ |
