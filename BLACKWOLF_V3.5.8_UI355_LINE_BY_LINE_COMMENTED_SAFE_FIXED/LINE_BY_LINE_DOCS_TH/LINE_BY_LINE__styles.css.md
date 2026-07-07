# อธิบายบรรทัดต่อบรรทัด: `styles.css`

**บทบาทไฟล์:** ไฟล์ตกแต่งหน้าจอ: layout, สี, responsive, component หรือ report style

> วิธีอ่าน: ดูเลขบรรทัด L0001, L0002, ... แล้วเทียบกับไฟล์โค้ดต้นฉบับ/ไฟล์ที่ใส่คอมเมนต์แล้วได้ทันที

| บรรทัด | โค้ด | คำอธิบายแบบคนเริ่มจากศูนย์ |
|---:|---|---|
| L0001 | `/* BLACKWOLF CSS TEACHING COMMENTS: styles.css ควบคุมหน้าตา/สี/ระยะ/ responsive ของ UI; ใช้ CSS comment รูปแบบนี้เพื่อไม่ให้ browser ตีความผิด */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0002 | `/* STEP: ไฟล์นี้เป็น loader รวม CSS ย่อยทั้งหมดผ่าน @import ก่อนใส่ override เล็กน้อยท้ายไฟล์ */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0003 | `/* BLACKWOLF V3.5.5 modular stylesheet loader */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0004 | `@import url("css/base.css");` | โหลดไฟล์ CSS ย่อยเข้ามารวมกับ stylesheet หลักตามลำดับ |
| L0005 | `@import url("css/components.css");` | โหลดไฟล์ CSS ย่อยเข้ามารวมกับ stylesheet หลักตามลำดับ |
| L0006 | `@import url("css/report.css");` | โหลดไฟล์ CSS ย่อยเข้ามารวมกับ stylesheet หลักตามลำดับ |
| L0007 | `@import url("css/history.css");` | โหลดไฟล์ CSS ย่อยเข้ามารวมกับ stylesheet หลักตามลำดับ |
| L0008 | `@import url("css/settings.css");` | โหลดไฟล์ CSS ย่อยเข้ามารวมกับ stylesheet หลักตามลำดับ |
| L0009 | `@import url("css/overlays.css");` | โหลดไฟล์ CSS ย่อยเข้ามารวมกับ stylesheet หลักตามลำดับ |
| L0010 | `@import url("css/professional.css");` | โหลดไฟล์ CSS ย่อยเข้ามารวมกับ stylesheet หลักตามลำดับ |
| L0011 | `@import url("css/pivot-preview.css");` | โหลดไฟล์ CSS ย่อยเข้ามารวมกับ stylesheet หลักตามลำดับ |
| L0012 | `@import url("css/responsive.css");` | โหลดไฟล์ CSS ย่อยเข้ามารวมกับ stylesheet หลักตามลำดับ |
| L0013 | `@import url("css/print.css");` | โหลดไฟล์ CSS ย่อยเข้ามารวมกับ stylesheet หลักตามลำดับ |
| L0014 | `@import url("css/cyan-refresh.css");` | โหลดไฟล์ CSS ย่อยเข้ามารวมกับ stylesheet หลักตามลำดับ |
| L0015 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0016 | `@import url("css/mti-navy-theme.css");` | โหลดไฟล์ CSS ย่อยเข้ามารวมกับ stylesheet หลักตามลำดับ |
| L0017 | `/* การ์ดส่วนช่วยเหลือและคู่มือ */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0018 | `.settings-columns-three .support-card{` | เริ่มกำหนด style ให้ selector `.settings-columns-three .support-card` เช่น สี ระยะ ขนาด หรือ layout |
| L0019 | `  display: flex;` | กำหนด property `display` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0020 | `  flex-direction: column;` | กำหนด property `flex-direction` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0021 | `  height: 100%;` | กำหนด property `height` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0022 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0023 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0024 | `/* เว้นช่องระหว่างข้อความกับปุ่ม */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0025 | `.settings-columns-three .support-card .btn,` | คำสั่ง CSS สำหรับควบคุมหน้าตา สี ระยะ หรือ responsive ของหน้าเว็บ |
| L0026 | `.settings-columns-three .support-card .link-button{` | เริ่มกำหนด style ให้ selector `.settings-columns-three .support-card .link-button` เช่น สี ระยะ ขนาด หรือ layout |
| L0027 | `  margin-top: 8px;` | กำหนด property `margin-top` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0028 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0029 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0030 | `/* ดันปุ่มให้อยู่ด้านล่างและตรงกันทุกการ์ด */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0031 | `.settings-columns-three .support-card .settings-card-head{` | เริ่มกำหนด style ให้ selector `.settings-columns-three .support-card .settings-card-head` เช่น สี ระยะ ขนาด หรือ layout |
| L0032 | `  flex: 1;` | กำหนด property `flex` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0033 | `}` | ปิด block ของ selector ก่อนหน้า |
