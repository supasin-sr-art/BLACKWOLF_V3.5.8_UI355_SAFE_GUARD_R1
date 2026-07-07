# อธิบายบรรทัดต่อบรรทัด: `css/overlays.css`

**บทบาทไฟล์:** ไฟล์ตกแต่งหน้าจอ: layout, สี, responsive, component หรือ report style

> วิธีอ่าน: ดูเลขบรรทัด L0001, L0002, ... แล้วเทียบกับไฟล์โค้ดต้นฉบับ/ไฟล์ที่ใส่คอมเมนต์แล้วได้ทันที

| บรรทัด | โค้ด | คำอธิบายแบบคนเริ่มจากศูนย์ |
|---:|---|---|
| L0001 | `/* BLACKWOLF CSS TEACHING COMMENTS: css/overlays.css ควบคุมหน้าตา/สี/ระยะ/ responsive ของ UI; ใช้ CSS comment รูปแบบนี้เพื่อไม่ให้ browser ตีความผิด */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0002 | `/* STEP: กฎในไฟล์นี้เป็นชั้นตกแต่ง/override ของ component เฉพาะส่วน */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0003 | `/* Guide modal, confirmation modal and dark-mode compatibility */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0004 | `/* Guide + confirmation */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0005 | `.image-modal,.confirm-modal{position:fixed;inset:0;background:rgba(5,10,24,.82);z-index:200;display:flex;align-items:flex-start;justify-content:center;paddin...` | เริ่มกำหนด style ให้ selector `.image-modal,.confirm-modal` เช่น สี ระยะ ขนาด หรือ layout |
| L0006 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0007 | `body.dark .management-title h1,body.dark .management-section-title h2,body.dark .history-created strong{color:#dbeafe}body.dark .report-sheet,body.dark .mana...` | เริ่มกำหนด style ให้ selector `body.dark .management-title h1,body.dark .management-section-title h2,body.dark .history-created strong` เช่น สี ระยะ ขนาด หรือ layout |
| L0008 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0009 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0010 | `/* Quick guide modal only — Example 1 */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0011 | `.image-modal:has(.quick-guide-example-one){align-items:center;padding:24px}.quick-guide-example-one{width:min(1500px,calc(100vw - 58px));max-width:none;paddi...` | เริ่มกำหนด style ให้ selector `.image-modal:has(.quick-guide-example-one)` เช่น สี ระยะ ขนาด หรือ layout |
| L0012 | `@media(max-width:1180px){.quick-guide-example-one .quick-guide-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.quick-guide-example-one .quick-guide-card{...` | เริ่มเงื่อนไข responsive เพื่อปรับหน้าจอตามความกว้างของอุปกรณ์ |
| L0013 | `@media(max-width:760px){.image-modal:has(.quick-guide-example-one){align-items:flex-start;padding:58px 10px 12px}.quick-guide-example-one{width:100%;padding:...` | เริ่มเงื่อนไข responsive เพื่อปรับหน้าจอตามความกว้างของอุปกรณ์ |
| L0014 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
