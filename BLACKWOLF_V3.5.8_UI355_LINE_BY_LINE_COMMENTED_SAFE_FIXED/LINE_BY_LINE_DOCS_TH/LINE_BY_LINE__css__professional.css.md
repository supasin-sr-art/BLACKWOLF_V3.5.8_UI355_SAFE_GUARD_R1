# อธิบายบรรทัดต่อบรรทัด: `css/professional.css`

**บทบาทไฟล์:** ไฟล์ตกแต่งหน้าจอ: layout, สี, responsive, component หรือ report style

> วิธีอ่าน: ดูเลขบรรทัด L0001, L0002, ... แล้วเทียบกับไฟล์โค้ดต้นฉบับ/ไฟล์ที่ใส่คอมเมนต์แล้วได้ทันที

| บรรทัด | โค้ด | คำอธิบายแบบคนเริ่มจากศูนย์ |
|---:|---|---|
| L0001 | `/* BLACKWOLF CSS TEACHING COMMENTS: css/professional.css ควบคุมหน้าตา/สี/ระยะ/ responsive ของ UI; ใช้ CSS comment รูปแบบนี้เพื่อไม่ให้ browser ตีความผิด */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0002 | `/* STEP: กฎในไฟล์นี้เป็นชั้นตกแต่ง/override ของ component เฉพาะส่วน */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0003 | `/* V3.4 Professional polish */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0004 | `:root{` | เริ่มกำหนด style ให้ selector `:root` เช่น สี ระยะ ขนาด หรือ layout |
| L0005 | `  --bg:#eef2f8;` | กำหนด property `--bg` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0006 | `  --surface:#ffffff;` | กำหนด property `--surface` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0007 | `  --surface2:#f7f9fd;` | กำหนด property `--surface2` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0008 | `  --line:#e6ebf4;` | กำหนด property `--line` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0009 | `  --shadow:0 18px 50px rgba(15,23,42,.08);` | กำหนด property `--shadow` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0010 | `  --shadow-soft:0 8px 24px rgba(15,23,42,.06);` | กำหนด property `--shadow-soft` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0011 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0012 | `body{background:radial-gradient(circle at top right,rgba(92,80,221,.08),transparent 24%),linear-gradient(180deg,#eff3fa 0%,#eef2f8 100%)}` | เริ่มกำหนด style ให้ selector `body` เช่น สี ระยะ ขนาด หรือ layout |
| L0013 | `body.dark{--bg:#08101d;--surface:#0f1728;--surface2:#121c31;--text:#edf2ff;--muted:#99a7c1;--line:#1f2a42;--shadow:0 20px 55px rgba(0,0,0,.35);background:rad...` | เริ่มกำหนด style ให้ selector `body.dark` เช่น สี ระยะ ขนาด หรือ layout |
| L0014 | `::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:999px}body.dark ::-webkit-scrollbar-thumb{background:#2...` | เริ่มกำหนด style ให้ selector `::-webkit-scrollbar` เช่น สี ระยะ ขนาด หรือ layout |
| L0015 | `.sidebar{background:linear-gradient(180deg,#091120 0%,#10192e 55%,#0a1221 100%);border-right:1px solid rgba(255,255,255,.04)}` | เริ่มกำหนด style ให้ selector `.sidebar` เช่น สี ระยะ ขนาด หรือ layout |
| L0016 | `.sidebar::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 20% 20%,rgba(102,92,236,.18),transparent 25%),radial-gradient(circ...` | เริ่มกำหนด style ให้ selector `.sidebar::before` เช่น สี ระยะ ขนาด หรือ layout |
| L0017 | `.sidebar>*{position:relative;z-index:1}` | เริ่มกำหนด style ให้ selector `.sidebar>*` เช่น สี ระยะ ขนาด หรือ layout |
| L0018 | `.brand{padding:6px 8px 26px}.brand img{width:48px;height:48px}.brand strong{font-size:17px}` | เริ่มกำหนด style ให้ selector `.brand` เช่น สี ระยะ ขนาด หรือ layout |
| L0019 | `.nav{display:flex;align-items:center;gap:8px;border:1px solid transparent;transition:all .18s ease;padding:13px 14px;font-size:12px}.nav span{width:18px;text...` | เริ่มกำหนด style ให้ selector `.nav` เช่น สี ระยะ ขนาด หรือ layout |
| L0020 | `.engine-card{background:linear-gradient(180deg,rgba(17,27,47,.95),rgba(12,21,38,.95));border-color:#23314f;box-shadow:var(--shadow-soft)}` | เริ่มกำหนด style ให้ selector `.engine-card` เช่น สี ระยะ ขนาด หรือ layout |
| L0021 | `.topbar{height:88px;background:rgba(255,255,255,.88);box-shadow:0 10px 30px rgba(15,23,42,.04)}body.dark .topbar{background:rgba(12,18,31,.9)}` | เริ่มกำหนด style ให้ selector `.topbar` เช่น สี ระยะ ขนาด หรือ layout |
| L0022 | `.topbar h1{font-size:26px;letter-spacing:-.02em}.topbar small{font-size:10px}` | เริ่มกำหนด style ให้ selector `.topbar h1` เช่น สี ระยะ ขนาด หรือ layout |
| L0023 | `.top-actions{gap:12px}.clock-box,.current-run-box{border:1px solid var(--line);background:var(--surface);border-radius:14px;padding:9px 13px;min-width:170px;...` | เริ่มกำหนด style ให้ selector `.top-actions` เช่น สี ระยะ ขนาด หรือ layout |
| L0024 | `.page{padding:30px 34px 52px}.hero{position:relative;overflow:hidden;padding:30px 34px;background:linear-gradient(135deg,#111a32 0%,#352ca4 52%,#5a4df0 100%)...` | เริ่มกำหนด style ให้ selector `.page` เช่น สี ระยะ ขนาด หรือ layout |
| L0025 | `.runtime-banner{margin:0 0 18px;padding:15px 18px;border-radius:16px;border:1px solid #f2d38a;background:linear-gradient(135deg,#fff8e8,#fffdf6);color:#805b0...` | เริ่มกำหนด style ให้ selector `.runtime-banner` เช่น สี ระยะ ขนาด หรือ layout |
| L0026 | `.panel,.file-chip,.summary-box,.recon-item,.kpi,.mg-kpi,.management-summary-card,.management-aging-card,.management-reconciliation-grid>div,.management-statu...` | เริ่มกำหนด style ให้ selector `.panel,.file-chip,.summary-box,.recon-item,.kpi,.mg-kpi,.management-summary-card,.management-aging-card,.management-reconciliation-grid>div,.management-status-cards article,.history-item,.settings-card` เช่น สี ระยะ ขนาด หรือ layout |
| L0027 | `.panel{border-radius:20px}.panel-head{padding:20px 22px}` | เริ่มกำหนด style ให้ selector `.panel` เช่น สี ระยะ ขนาด หรือ layout |
| L0028 | `.drop-zone{border:1.5px dashed #cad4e4;background:linear-gradient(180deg,#fcfdff,#f8faff)}.drop-zone:hover,.drop-zone.drag{border-color:#786cf4;box-shadow:0 ...` | เริ่มกำหนด style ให้ selector `.drop-zone` เช่น สี ระยะ ขนาด หรือ layout |
| L0029 | `.package-score{background:linear-gradient(135deg,#0e1730,#182648)}.file-chip{border-radius:12px}.file-chip.ready{box-shadow:0 10px 20px rgba(20,132,94,.08)}` | เริ่มกำหนด style ให้ selector `.package-score` เช่น สี ระยะ ขนาด หรือ layout |
| L0030 | `.etl-inline-card{margin:0 20px 16px;padding:16px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(180deg,var(--surface),var(--surfa...` | เริ่มกำหนด style ให้ selector `.etl-inline-card` เช่น สี ระยะ ขนาด หรือ layout |
| L0031 | `.action-strip{padding:16px 20px;background:linear-gradient(180deg,var(--surface2),var(--surface))}.btn{border-radius:12px;padding:11px 15px;letter-spacing:.0...` | เริ่มกำหนด style ให้ selector `.action-strip` เช่น สี ระยะ ขนาด หรือ layout |
| L0032 | `.progress-panel{background:linear-gradient(180deg,var(--surface),var(--surface2))}.progress-track{margin-top:14px;margin-bottom:14px}.progress-track i{backgr...` | เริ่มกำหนด style ให้ selector `.progress-panel` เช่น สี ระยะ ขนาด หรือ layout |
| L0033 | `.page-heading h2{font-size:29px;margin:6px 0 5px}.page-heading p{font-size:12px;color:var(--muted)}` | เริ่มกำหนด style ให้ selector `.page-heading h2` เช่น สี ระยะ ขนาด หรือ layout |
| L0034 | `.kpi-grid{gap:14px}.kpi{border-radius:18px;padding:20px;border:1px solid var(--line);background:linear-gradient(180deg,var(--surface),var(--surface2))}.kpi s...` | เริ่มกำหนด style ให้ selector `.kpi-grid` เช่น สี ระยะ ขนาด หรือ layout |
| L0035 | `.bar-row{display:grid;grid-template-columns:140px 1fr 56px;gap:12px;align-items:center;margin:12px 0}.bar-row i{display:block;height:12px;border-radius:999px...` | เริ่มกำหนด style ให้ selector `.bar-row` เช่น สี ระยะ ขนาด หรือ layout |
| L0036 | `.summary-box{border-radius:16px;border:1px solid var(--line);background:linear-gradient(180deg,var(--surface),var(--surface2));padding:14px 16px}.summary-box...` | เริ่มกำหนด style ให้ selector `.summary-box` เช่น สี ระยะ ขนาด หรือ layout |
| L0037 | `.table-panel .search{border:1px solid var(--line);background:var(--surface);border-radius:12px;padding:10px 12px;min-width:240px}.table-wrap{overflow:auto;bo...` | เริ่มกำหนด style ให้ selector `.table-panel .search` เช่น สี ระยะ ขนาด หรือ layout |
| L0038 | `.report-sheet{overflow:hidden;border-radius:22px;box-shadow:0 24px 60px rgba(12,24,45,.12)}` | เริ่มกำหนด style ให้ selector `.report-sheet` เช่น สี ระยะ ขนาด หรือ layout |
| L0039 | `.history-panel{background:linear-gradient(180deg,var(--surface),var(--surface2))}.history-item{margin:10px 0;border:1px solid var(--line);border-radius:16px;...` | เริ่มกำหนด style ให้ selector `.history-panel` เช่น สี ระยะ ขนาด หรือ layout |
| L0040 | `.settings-card{border-radius:18px}.system-status-grid>div,.storage-metrics>div{background:linear-gradient(180deg,var(--surface),var(--surface2))}` | เริ่มกำหนด style ให้ selector `.settings-card` เช่น สี ระยะ ขนาด หรือ layout |
| L0041 | `.image-modal-content,.confirm-box{box-shadow:0 35px 100px rgba(0,0,0,.45)}` | เริ่มกำหนด style ให้ selector `.image-modal-content,.confirm-box` เช่น สี ระยะ ขนาด หรือ layout |
| L0042 | `.toast{position:fixed;right:24px;bottom:24px;max-width:420px;padding:14px 16px;border-radius:16px;background:#111827;color:#fff;box-shadow:0 20px 40px rgba(0...` | เริ่มกำหนด style ให้ selector `.toast` เช่น สี ระยะ ขนาด หรือ layout |
| L0043 | `.hidden{display:none!important}` | เริ่มกำหนด style ให้ selector `.hidden` เช่น สี ระยะ ขนาด หรือ layout |
| L0044 | `body.dark .panel,body.dark .clock-box,body.dark .current-run-box,body.dark .top-guide-btn,body.dark .icon-btn,body.dark .kpi,body.dark .summary-box,body.dark...` | เริ่มกำหนด style ให้ selector `body.dark .panel,body.dark .clock-box,body.dark .current-run-box,body.dark .top-guide-btn,body.dark .icon-btn,body.dark .kpi,body.dark .summary-box,body.dark .file-chip,body.dark .drop-zone,body.dark .settings-card,body.dark .history-item,body.dark #autoMail72Input,body.dark .table-panel .search` เช่น สี ระยะ ขนาด หรือ layout |
| L0045 | `body.dark .kpi.accent{background:linear-gradient(135deg,#4b42d8,#6558f0)}` | เริ่มกำหนด style ให้ selector `body.dark .kpi.accent` เช่น สี ระยะ ขนาด หรือ layout |
| L0046 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0047 | `.date-control-card{margin:0 20px 16px;padding:15px 16px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(180deg,var(--surface),var(...` | เริ่มกำหนด style ให้ selector `.date-control-card` เช่น สี ระยะ ขนาด หรือ layout |
| L0048 | `.download-stack{display:grid;gap:12px}.secondary-download{background:linear-gradient(135deg,#fff,#eef8ff);border-color:#bddff3}.secondary-download:hover{bord...` | เริ่มกำหนด style ให้ selector `.download-stack` เช่น สี ระยะ ขนาด หรือ layout |
| L0049 | `body.dark .date-control-card{background:linear-gradient(180deg,var(--surface),var(--surface2))}body.dark .date-badge{background:#153149;color:#8fd0f5}` | เริ่มกำหนด style ให้ selector `body.dark .date-control-card` เช่น สี ระยะ ขนาด หรือ layout |
| L0050 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0051 | `/* V3.5.5 result/report refinements */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0052 | `.result-summary{grid-template-columns:repeat(auto-fit,minmax(180px,1fr))}` | เริ่มกำหนด style ให้ selector `.result-summary` เช่น สี ระยะ ขนาด หรือ layout |
| L0053 | `.excel-table .head-orange{background:#f79646!important;color:#fff!important;font-weight:800}` | เริ่มกำหนด style ให้ selector `.excel-table .head-orange` เช่น สี ระยะ ขนาด หรือ layout |
| L0054 | `.excel-table .orange-title{background:#f79646!important;color:#fff!important;font-weight:900}` | เริ่มกำหนด style ให้ selector `.excel-table .orange-title` เช่น สี ระยะ ขนาด หรือ layout |
