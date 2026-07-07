# อธิบายบรรทัดต่อบรรทัด: `css/responsive.css`

**บทบาทไฟล์:** ไฟล์ตกแต่งหน้าจอ: layout, สี, responsive, component หรือ report style

> วิธีอ่าน: ดูเลขบรรทัด L0001, L0002, ... แล้วเทียบกับไฟล์โค้ดต้นฉบับ/ไฟล์ที่ใส่คอมเมนต์แล้วได้ทันที

| บรรทัด | โค้ด | คำอธิบายแบบคนเริ่มจากศูนย์ |
|---:|---|---|
| L0001 | `/* BLACKWOLF CSS TEACHING COMMENTS: css/responsive.css ควบคุมหน้าตา/สี/ระยะ/ responsive ของ UI; ใช้ CSS comment รูปแบบนี้เพื่อไม่ให้ browser ตีความผิด */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0002 | `/* STEP: กฎในไฟล์นี้ปรับ layout ตามขนาดหน้าจอ/มือถือ */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0003 | `/* Responsive behavior */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0004 | `@media(max-width:1180px){.app-shell{grid-template-columns:220px 1fr}.kpi-grid{grid-template-columns:repeat(3,1fr)}.recon-grid{grid-template-columns:repeat(3,...` | เริ่มเงื่อนไข responsive เพื่อปรับหน้าจอตามความกว้างของอุปกรณ์ |
| L0005 | `@media(max-width:900px){.app-shell{display:block}.sidebar{position:relative;height:auto;padding:14px}.sidebar nav{grid-template-columns:repeat(4,1fr)}.engine...` | เริ่มเงื่อนไข responsive เพื่อปรับหน้าจอตามความกว้างของอุปกรณ์ |
| L0006 | `@media(max-width:600px){.sidebar nav{grid-template-columns:1fr 1fr}.top-actions .mode-chip{display:none}.kpi-grid,.result-summary,.recon-grid{grid-template-c...` | เริ่มเงื่อนไข responsive เพื่อปรับหน้าจอตามความกว้างของอุปกรณ์ |
| L0007 | `@media(max-width:1450px){.clock-box{display:none}.management-kpi-strip{grid-template-columns:repeat(3,1fr)}.management-reconciliation-grid{grid-template-colu...` | เริ่มเงื่อนไข responsive เพื่อปรับหน้าจอตามความกว้างของอุปกรณ์ |
| L0008 | `@media(max-width:1180px){.current-run-box{display:none}.top-guide-btn{padding:9px}.management-report-header{grid-template-columns:170px 1fr}.management-meta{...` | เริ่มเงื่อนไข responsive เพื่อปรับหน้าจอตามความกว้างของอุปกรณ์ |
| L0009 | `@media(max-width:900px){.sidebar nav{grid-template-columns:repeat(3,1fr)}.top-actions .status-chip{display:none}.report-actions{flex-wrap:wrap}.management-st...` | เริ่มเงื่อนไข responsive เพื่อปรับหน้าจอตามความกว้างของอุปกรณ์ |
| L0010 | `@media(max-width:600px){.sidebar nav{grid-template-columns:1fr 1fr}.top-guide-btn{font-size:0;width:35px;height:35px;padding:0}.top-guide-btn::before{content...` | เริ่มเงื่อนไข responsive เพื่อปรับหน้าจอตามความกว้างของอุปกรณ์ |
| L0011 | `@media(max-width:1100px){.app-shell{grid-template-columns:1fr}.sidebar{position:relative;height:auto}.page{padding:24px 18px 40px}.hero{padding:24px}.topbar{...` | เริ่มเงื่อนไข responsive เพื่อปรับหน้าจอตามความกว้างของอุปกรณ์ |
| L0012 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0013 | `@media(max-width:1180px){.settings-columns-three{grid-template-columns:1fr}}` | เริ่มเงื่อนไข responsive เพื่อปรับหน้าจอตามความกว้างของอุปกรณ์ |
| L0014 | `@media(max-width:760px){.top-actions{gap:6px}.current-run-box{display:none}.settings-columns-three{grid-template-columns:1fr}}` | เริ่มเงื่อนไข responsive เพื่อปรับหน้าจอตามความกว้างของอุปกรณ์ |
| L0015 | `@media(max-width:600px){.date-control-card{align-items:stretch;flex-direction:column}.date-control-card input{width:100%;min-width:0}.download-stack{gap:10px}}` | เริ่มเงื่อนไข responsive เพื่อปรับหน้าจอตามความกว้างของอุปกรณ์ |
