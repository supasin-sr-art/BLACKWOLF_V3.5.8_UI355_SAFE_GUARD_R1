# อธิบายบรรทัดต่อบรรทัด: `css/pivot-preview.css`

**บทบาทไฟล์:** ไฟล์ตกแต่งหน้าจอ: layout, สี, responsive, component หรือ report style

> วิธีอ่าน: ดูเลขบรรทัด L0001, L0002, ... แล้วเทียบกับไฟล์โค้ดต้นฉบับ/ไฟล์ที่ใส่คอมเมนต์แล้วได้ทันที

| บรรทัด | โค้ด | คำอธิบายแบบคนเริ่มจากศูนย์ |
|---:|---|---|
| L0001 | `/* BLACKWOLF CSS TEACHING COMMENTS: css/pivot-preview.css ควบคุมหน้าตา/สี/ระยะ/ responsive ของ UI; ใช้ CSS comment รูปแบบนี้เพื่อไม่ให้ browser ตีความผิด */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0002 | `/* STEP: กฎในไฟล์นี้ดูแลหน้าตา Excel-like preview และ drill-down */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0003 | `/* PV / PV Final / Report preview only */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0004 | `.pivot-preview-note{display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid var(--line);background:linear-gradient(90deg,#eef6ff,#f...` | เริ่มกำหนด style ให้ selector `.pivot-preview-note` เช่น สี ระยะ ขนาด หรือ layout |
| L0005 | `.preview-drill-modal{position:fixed;inset:0;z-index:230;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(5,12,28,.78);back...` | เริ่มกำหนด style ให้ selector `.preview-drill-modal` เช่น สี ระยะ ขนาด หรือ layout |
| L0006 | `body.dark .pivot-preview-note{background:linear-gradient(90deg,#10263a,#131d34);color:#c8d9eb}body.dark .pivot-filter-row td,body.dark .pivot-values-row td{b...` | เริ่มกำหนด style ให้ selector `body.dark .pivot-preview-note` เช่น สี ระยะ ขนาด หรือ layout |
| L0007 | `@media(max-width:760px){.preview-drill-modal{padding:8px}.preview-drill-dialog{width:100%;max-height:96vh;border-radius:16px}.preview-drill-head{padding:16px...` | เริ่มเงื่อนไข responsive เพื่อปรับหน้าจอตามความกว้างของอุปกรณ์ |
| L0008 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0009 | `/* Report preview: one visible blank worksheet row between blocks */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0010 | `.report-pivot-preview .report-block-spacer td{height:16px;padding:0;background:var(--surface)!important;border-top:0;border-bottom:0}` | เริ่มกำหนด style ให้ selector `.report-pivot-preview .report-block-spacer td` เช่น สี ระยะ ขนาด หรือ layout |
| L0011 | `.report-pivot-preview .report-block-spacer .rownum{background:var(--surface2)!important;border-right:1px solid var(--line);color:var(--muted)}` | เริ่มกำหนด style ให้ selector `.report-pivot-preview .report-block-spacer .rownum` เช่น สี ระยะ ขนาด หรือ layout |
