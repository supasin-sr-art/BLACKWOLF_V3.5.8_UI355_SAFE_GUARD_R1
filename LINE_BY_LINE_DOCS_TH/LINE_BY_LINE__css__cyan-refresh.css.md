# อธิบายบรรทัดต่อบรรทัด: `css/cyan-refresh.css`

**บทบาทไฟล์:** ไฟล์ตกแต่งหน้าจอ: layout, สี, responsive, component หรือ report style

> วิธีอ่าน: ดูเลขบรรทัด L0001, L0002, ... แล้วเทียบกับไฟล์โค้ดต้นฉบับ/ไฟล์ที่ใส่คอมเมนต์แล้วได้ทันที

| บรรทัด | โค้ด | คำอธิบายแบบคนเริ่มจากศูนย์ |
|---:|---|---|
| L0001 | `/* BLACKWOLF CSS TEACHING COMMENTS: css/cyan-refresh.css ควบคุมหน้าตา/สี/ระยะ/ responsive ของ UI; ใช้ CSS comment รูปแบบนี้เพื่อไม่ให้ browser ตีความผิด */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0002 | `/* STEP: กฎในไฟล์นี้เป็นชั้นตกแต่ง/override ของ component เฉพาะส่วน */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0003 | `/* BLACKWOLF Cyan + Blue Ice professional UI refresh — presentation layer only */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0004 | `:root{` | เริ่มกำหนด style ให้ selector `:root` เช่น สี ระยะ ขนาด หรือ layout |
| L0005 | `  --cyan:#09b7dc;` | กำหนด property `--cyan` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0006 | `  --cyan-deep:#008fc4;` | กำหนด property `--cyan-deep` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0007 | `  --cyan-dark:#0077aa;` | กำหนด property `--cyan-dark` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0008 | `  --blue-ice:#a4ecef;` | กำหนด property `--blue-ice` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0009 | `  --blue-ice-soft:#e7fbfc;` | กำหนด property `--blue-ice-soft` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0010 | `  --navy:#06172f;` | กำหนด property `--navy` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0011 | `  --navy-2:#0b2545;` | กำหนด property `--navy-2` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0012 | `  --accent:var(--cyan);` | กำหนด property `--accent` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0013 | `  --accent2:#087dd6;` | กำหนด property `--accent2` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0014 | `  --bg:#f2f8fc;` | กำหนด property `--bg` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0015 | `  --surface:#ffffff;` | กำหนด property `--surface` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0016 | `  --surface2:#f7fbfe;` | กำหนด property `--surface2` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0017 | `  --text:#10203a;` | กำหนด property `--text` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0018 | `  --muted:#66758c;` | กำหนด property `--muted` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0019 | `  --line:#d9e7f0;` | กำหนด property `--line` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0020 | `  --shadow:0 16px 45px rgba(11,57,88,.10);` | กำหนด property `--shadow` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0021 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0022 | `html{scroll-behavior:smooth}` | เริ่มกำหนด style ให้ selector `html` เช่น สี ระยะ ขนาด หรือ layout |
| L0023 | `body{background:radial-gradient(circle at 85% 0%,rgba(164,236,239,.45),transparent 27%),linear-gradient(180deg,#f8fcff 0%,#eef6fb 100%)}` | เริ่มกำหนด style ให้ selector `body` เช่น สี ระยะ ขนาด หรือ layout |
| L0024 | `body.auth-locked{overflow:hidden}` | เริ่มกำหนด style ให้ selector `body.auth-locked` เช่น สี ระยะ ขนาด หรือ layout |
| L0025 | `body.auth-locked .app-shell{filter:blur(4px);pointer-events:none;user-select:none}` | เริ่มกำหนด style ให้ selector `body.auth-locked .app-shell` เช่น สี ระยะ ขนาด หรือ layout |
| L0026 | `body.authenticated .auth-screen{opacity:0;visibility:hidden;pointer-events:none}` | เริ่มกำหนด style ให้ selector `body.authenticated .auth-screen` เช่น สี ระยะ ขนาด หรือ layout |
| L0027 | `body.authenticated .app-shell{filter:none;pointer-events:auto;user-select:auto}` | เริ่มกำหนด style ให้ selector `body.authenticated .app-shell` เช่น สี ระยะ ขนาด หรือ layout |
| L0028 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0029 | `/* Login */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0030 | `.auth-screen{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:28px;overflow:auto;background:linear-gradient(135deg,#068ec7 0%,#0bb...` | เริ่มกำหนด style ให้ selector `.auth-screen` เช่น สี ระยะ ขนาด หรือ layout |
| L0031 | `.auth-screen::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 20% 15%,rgba(255,255,255,.45),transparent 20%),radial-gradient...` | เริ่มกำหนด style ให้ selector `.auth-screen::before` เช่น สี ระยะ ขนาด หรือ layout |
| L0032 | `.auth-background-shape{position:absolute;border-radius:42px;background:rgba(255,255,255,.10);transform:rotate(35deg);box-shadow:inset 0 0 0 1px rgba(255,255,...` | เริ่มกำหนด style ให้ selector `.auth-background-shape` เช่น สี ระยะ ขนาด หรือ layout |
| L0033 | `.auth-shape-one{width:480px;height:480px;left:-170px;bottom:-250px}.auth-shape-two{width:620px;height:220px;right:-160px;top:80px}` | เริ่มกำหนด style ให้ selector `.auth-shape-one` เช่น สี ระยะ ขนาด หรือ layout |
| L0034 | `.auth-card{position:relative;width:min(980px,94vw);min-height:570px;display:grid;grid-template-columns:.95fr 1.05fr;background:rgba(255,255,255,.97);border:1...` | เริ่มกำหนด style ให้ selector `.auth-card` เช่น สี ระยะ ขนาด หรือ layout |
| L0035 | `.auth-brand-panel{padding:58px 58px 46px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:linear-gra...` | เริ่มกำหนด style ให้ selector `.auth-brand-panel` เช่น สี ระยะ ขนาด หรือ layout |
| L0036 | `.auth-logo-wrap{width:132px;height:132px;border-radius:32px;display:grid;place-items:center;background:linear-gradient(145deg,#e6fbfd,#fff);box-shadow:0 18px...` | เริ่มกำหนด style ให้ selector `.auth-logo-wrap` เช่น สี ระยะ ขนาด หรือ layout |
| L0037 | `.auth-brand-panel h1{margin:0;font-size:39px;letter-spacing:.025em;color:var(--navy)}.auth-brand-subtitle{margin:4px 0 23px;font-size:15px;letter-spacing:.13...` | เริ่มกำหนด style ให้ selector `.auth-brand-panel h1` เช่น สี ระยะ ขนาด หรือ layout |
| L0038 | `.auth-security-note{width:100%;margin-top:36px;padding:15px 17px;display:flex;align-items:center;gap:12px;text-align:left;border:1px solid #cbe9ef;background...` | เริ่มกำหนด style ให้ selector `.auth-security-note` เช่น สี ระยะ ขนาด หรือ layout |
| L0039 | `.auth-form{padding:58px 60px;display:flex;flex-direction:column;justify-content:center}.auth-eyebrow{font-size:10px;letter-spacing:.18em;font-weight:900;colo...` | เริ่มกำหนด style ให้ selector `.auth-form` เช่น สี ระยะ ขนาด หรือ layout |
| L0040 | `.auth-error{min-height:20px!important;margin:-5px 0 10px!important;color:#d4324f!important;font-size:11px!important}.auth-field.has-error>div{border-color:#e...` | เริ่มกำหนด style ให้ selector `.auth-error` เช่น สี ระยะ ขนาด หรือ layout |
| L0041 | `.auth-submit{height:54px;border:0;border-radius:14px;background:linear-gradient(135deg,var(--cyan),#087bd4);color:#fff;font-weight:900;font-size:14px;cursor:...` | เริ่มกำหนด style ให้ selector `.auth-submit` เช่น สี ระยะ ขนาด หรือ layout |
| L0042 | `.auth-footnote{margin-top:22px;padding:13px 15px;display:flex;gap:11px;align-items:center;border:1px solid #dce8ef;border-radius:14px;background:#f9fcfe}.aut...` | เริ่มกำหนด style ให้ selector `.auth-footnote` เช่น สี ระยะ ขนาด หรือ layout |
| L0043 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0044 | `/* Global shell */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0045 | `.app-shell{grid-template-columns:244px minmax(0,1fr)}` | เริ่มกำหนด style ให้ selector `.app-shell` เช่น สี ระยะ ขนาด หรือ layout |
| L0046 | `.sidebar{background:linear-gradient(180deg,#06152b 0%,#08213f 58%,#06172f 100%);padding:22px 14px;border-right:1px solid rgba(164,236,239,.12);box-shadow:12p...` | เริ่มกำหนด style ให้ selector `.sidebar` เช่น สี ระยะ ขนาด หรือ layout |
| L0047 | `.brand{padding:3px 8px 27px}.brand img{width:48px;height:48px}.brand strong{font-size:19px}.brand span{color:#8da9c3}` | เริ่มกำหนด style ให้ selector `.brand` เช่น สี ระยะ ขนาด หรือ layout |
| L0048 | `.sidebar nav{gap:6px}.nav{padding:13px 12px;border-radius:12px;color:#b7c5d7;font-size:12px;transition:.16s}.nav:hover{background:rgba(164,236,239,.08);color...` | เริ่มกำหนด style ให้ selector `.sidebar nav` เช่น สี ระยะ ขนาด หรือ layout |
| L0049 | `.engine-card{border-color:rgba(164,236,239,.19);background:rgba(7,31,58,.74)}` | เริ่มกำหนด style ให้ selector `.engine-card` เช่น สี ระยะ ขนาด หรือ layout |
| L0050 | `.topbar{height:82px;padding:0 28px;background:rgba(255,255,255,.88);border-color:#dceaf2;box-shadow:0 6px 24px rgba(11,57,88,.04)}.topbar h1{font-size:20px;c...` | เริ่มกำหนด style ให้ selector `.topbar` เช่น สี ระยะ ขนาด หรือ layout |
| L0051 | `.page{padding:28px 30px 48px}.eyebrow{color:var(--cyan-dark)}` | เริ่มกำหนด style ให้ selector `.page` เช่น สี ระยะ ขนาด หรือ layout |
| L0052 | `.hero{background:linear-gradient(125deg,#061a33 0%,#064f78 50%,#09b7dc 100%);box-shadow:0 22px 46px rgba(2,79,116,.22)}` | เริ่มกำหนด style ให้ selector `.hero` เช่น สี ระยะ ขนาด หรือ layout |
| L0053 | `.panel{border-color:#dce9f1;border-radius:19px;box-shadow:var(--shadow)}.panel-head{border-color:#e2edf3}.step,.count-chip{background:var(--blue-ice-soft);co...` | เริ่มกำหนด style ให้ selector `.panel` เช่น สี ระยะ ขนาด หรือ layout |
| L0054 | `.btn{border-radius:11px}.btn.primary{background:linear-gradient(135deg,var(--cyan),#0b81d5);box-shadow:0 10px 22px rgba(5,160,208,.20)}.btn.secondary{backgro...` | เริ่มกำหนด style ให้ selector `.btn` เช่น สี ระยะ ขนาด หรือ layout |
| L0055 | `.drop-zone:hover,.drop-zone.drag{background:#effcfd;border-color:var(--cyan)}.upload-icon{background:var(--blue-ice-soft);color:var(--cyan-dark)}.drop-zone>b...` | เริ่มกำหนด style ให้ selector `.drop-zone:hover,.drop-zone.drag` เช่น สี ระยะ ขนาด หรือ layout |
| L0056 | `.progress-track i{background:linear-gradient(90deg,var(--cyan),#0c82d6)}` | เริ่มกำหนด style ให้ selector `.progress-track i` เช่น สี ระยะ ขนาด หรือ layout |
| L0057 | `.kpi.accent{background:linear-gradient(135deg,#078fbf,#08bddc)}` | เริ่มกำหนด style ให้ selector `.kpi.accent` เช่น สี ระยะ ขนาด หรือ layout |
| L0058 | `.bar-row i b,.bar-row b{background:linear-gradient(90deg,var(--cyan),#1380dc)}` | เริ่มกำหนด style ให้ selector `.bar-row i b,.bar-row b` เช่น สี ระยะ ขนาด หรือ layout |
| L0059 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0060 | `/* Report page */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0061 | `.report-page-heading{align-items:center;padding:4px 2px}.report-actions{display:flex;gap:10px;align-items:center;position:static!important}.report-actions .b...` | เริ่มกำหนด style ให้ selector `.report-page-heading` เช่น สี ระยะ ขนาด หรือ layout |
| L0062 | `.report-sheet{max-width:1240px;margin:0 auto;background:#fff;border:1px solid #d9e7ef;border-radius:24px;box-shadow:0 25px 65px rgba(8,57,88,.12)}` | เริ่มกำหนด style ให้ selector `.report-sheet` เช่น สี ระยะ ขนาด หรือ layout |
| L0063 | `.management-brand{background:linear-gradient(135deg,#082443,#0b4773)!important}.management-brand>span{background:linear-gradient(135deg,var(--cyan),#0b80d4)!...` | เริ่มกำหนด style ให้ selector `.management-brand` เช่น สี ระยะ ขนาด หรือ layout |
| L0064 | `.management-title>span,.management-section-title span{color:var(--cyan-dark)!important}.management-summary-card header,.management-aging-card header{backgrou...` | เริ่มกำหนด style ให้ selector `.management-title>span,.management-section-title span` เช่น สี ระยะ ขนาด หรือ layout |
| L0065 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0066 | `/* Pending Detail Preview */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0067 | `.detail-preview-panel{overflow:hidden}.detail-preview-head{display:flex;justify-content:space-between;align-items:flex-end;gap:18px;padding:22px 24px 17px;bo...` | เริ่มกำหนด style ให้ selector `.detail-preview-panel` เช่น สี ระยะ ขนาด หรือ layout |
| L0068 | `.detail-stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:18px 24px}.detail-stat-grid>div{position:relative;min-height:86px;padding...` | เริ่มกำหนด style ให้ selector `.detail-stat-grid` เช่น สี ระยะ ขนาด หรือ layout |
| L0069 | `.detail-toolbar{display:grid;grid-template-columns:minmax(260px,1fr) 180px 170px auto;gap:10px;align-items:center;padding:0 24px 17px}.detail-search{position...` | เริ่มกำหนด style ให้ selector `.detail-toolbar` เช่น สี ระยะ ขนาด หรือ layout |
| L0070 | `.detail-layout{display:grid;grid-template-columns:minmax(0,1fr) 315px;border-top:1px solid var(--line);min-height:470px}.detail-table-wrap{max-height:540px;b...` | เริ่มกำหนด style ให้ selector `.detail-layout` เช่น สี ระยะ ขนาด หรือ layout |
| L0071 | `.detail-drawer{border-left:1px solid var(--line);background:linear-gradient(180deg,#fbfeff,#f5fafc);padding:20px;overflow:auto;max-height:540px}.detail-drawe...` | เริ่มกำหนด style ให้ selector `.detail-drawer` เช่น สี ระยะ ขนาด หรือ layout |
| L0072 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0073 | `/* Dark-mode overrides */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0074 | `body.dark{--bg:#071523;--surface:#0e2032;--surface2:#0a1a2a;--text:#eaf7fb;--muted:#91a9ba;--line:#1d3a50;--shadow:0 18px 50px rgba(0,0,0,.25);background:#07...` | เริ่มกำหนด style ให้ selector `body.dark` เช่น สี ระยะ ขนาด หรือ layout |
| L0075 | `body.dark .topbar{background:rgba(9,25,40,.9)}body.dark .clock-box,body.dark .current-run-box,body.dark .top-guide-btn,body.dark .icon-btn,body.dark .top-log...` | เริ่มกำหนด style ให้ selector `body.dark .topbar` เช่น สี ระยะ ขนาด หรือ layout |
| L0076 | `body.dark .detail-stat-grid>div,body.dark .detail-drawer,body.dark .detail-table-wrap,body.dark .detail-table th{background:#0b1b2b}body.dark .detail-table t...` | เริ่มกำหนด style ให้ selector `body.dark .detail-stat-grid>div,body.dark .detail-drawer,body.dark .detail-table-wrap,body.dark .detail-table th` เช่น สี ระยะ ขนาด หรือ layout |
| L0077 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0078 | `@media(max-width:1200px){.detail-layout{grid-template-columns:1fr}.detail-drawer{border-left:0;border-top:1px solid var(--line);max-height:none}.detail-drawe...` | เริ่มเงื่อนไข responsive เพื่อปรับหน้าจอตามความกว้างของอุปกรณ์ |
| L0079 | `@media(max-width:900px){.auth-card{grid-template-columns:1fr;max-width:560px}.auth-brand-panel{display:none}.auth-form{padding:44px}.detail-preview-head{alig...` | เริ่มเงื่อนไข responsive เพื่อปรับหน้าจอตามความกว้างของอุปกรณ์ |
| L0080 | `@media(max-width:620px){.auth-screen{padding:12px}.auth-form{padding:34px 24px}.auth-form h2{font-size:28px}.detail-stat-grid{grid-template-columns:1fr;paddi...` | เริ่มเงื่อนไข responsive เพื่อปรับหน้าจอตามความกว้างของอุปกรณ์ |
| L0081 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0082 | `@media print{.auth-screen,.top-logout-btn{display:none!important}}` | เริ่มเงื่อนไข responsive เพื่อปรับหน้าจอตามความกว้างของอุปกรณ์ |
| L0083 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0084 | `/* Pending Detail Preview: duplicate alienCode warning */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0085 | `#resultDetailStats .duplicate-alien-stat{` | เริ่มกำหนด style ให้ selector `#resultDetailStats .duplicate-alien-stat` เช่น สี ระยะ ขนาด หรือ layout |
| L0086 | `  border-color:rgba(239,68,68,.38);` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0087 | `  background:linear-gradient(135deg,rgba(239,68,68,.12),rgba(127,29,29,.06));` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0088 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0089 | `#resultDetailStats .duplicate-alien-stat span,` | คำสั่ง CSS สำหรับควบคุมหน้าตา สี ระยะ หรือ responsive ของหน้าเว็บ |
| L0090 | `#resultDetailStats .duplicate-alien-stat strong,` | คำสั่ง CSS สำหรับควบคุมหน้าตา สี ระยะ หรือ responsive ของหน้าเว็บ |
| L0091 | `#resultDetailStats .duplicate-alien-stat small{color:#dc2626;}` | เริ่มกำหนด style ให้ selector `#resultDetailStats .duplicate-alien-stat small` เช่น สี ระยะ ขนาด หรือ layout |
| L0092 | `.alien-duplicate-alert{` | เริ่มกำหนด style ให้ selector `.alien-duplicate-alert` เช่น สี ระยะ ขนาด หรือ layout |
| L0093 | `  display:flex;align-items:center;gap:10px;margin:12px 0;padding:11px 14px;` | กำหนด property `display` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0094 | `  border:1px solid rgba(239,68,68,.45);border-radius:12px;` | กำหนด property `border` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0095 | `  background:rgba(239,68,68,.10);color:#b91c1c;font-weight:700;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0096 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0097 | `.alien-duplicate-alert.hidden{display:none;}` | เริ่มกำหนด style ให้ selector `.alien-duplicate-alert.hidden` เช่น สี ระยะ ขนาด หรือ layout |
| L0098 | `.alien-duplicate-alert::before{` | เริ่มกำหนด style ให้ selector `.alien-duplicate-alert::before` เช่น สี ระยะ ขนาด หรือ layout |
| L0099 | `  content:"!";display:grid;place-items:center;flex:0 0 24px;width:24px;height:24px;` | กำหนด property `content` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0100 | `  border-radius:999px;background:#dc2626;color:#fff;font-size:14px;font-weight:900;` | กำหนด property `border-radius` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0101 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0102 | `#resultTable tr.duplicate-alien-row{background:rgba(239,68,68,.08);}` | เริ่มกำหนด style ให้ selector `#resultTable tr.duplicate-alien-row` เช่น สี ระยะ ขนาด หรือ layout |
| L0103 | `#resultTable tr.duplicate-alien-row:hover{background:rgba(239,68,68,.14);}` | เริ่มกำหนด style ให้ selector `#resultTable tr.duplicate-alien-row:hover` เช่น สี ระยะ ขนาด หรือ layout |
| L0104 | `#resultTable td.duplicate-alien-cell{` | เริ่มกำหนด style ให้ selector `#resultTable td.duplicate-alien-cell` เช่น สี ระยะ ขนาด หรือ layout |
| L0105 | `  position:relative;color:#dc2626!important;font-weight:800;` | กำหนด property `position` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0106 | `  background:rgba(239,68,68,.13);box-shadow:inset 3px 0 0 #ef4444;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0107 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0108 | `#resultTable td.duplicate-alien-cell::after{` | เริ่มกำหนด style ให้ selector `#resultTable td.duplicate-alien-cell::after` เช่น สี ระยะ ขนาด หรือ layout |
| L0109 | `  content:"ซ้ำ";display:inline-flex;align-items:center;margin-left:7px;padding:2px 7px;` | กำหนด property `content` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0110 | `  border-radius:999px;background:#dc2626;color:#fff;font-size:10px;line-height:1.35;` | กำหนด property `border-radius` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0111 | `  font-weight:800;vertical-align:middle;` | กำหนด property `font-weight` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0112 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0113 | `body.dark-theme .alien-duplicate-alert,` | คำสั่ง CSS สำหรับควบคุมหน้าตา สี ระยะ หรือ responsive ของหน้าเว็บ |
| L0114 | `body[data-theme="dark"] .alien-duplicate-alert{color:#fca5a5;background:rgba(239,68,68,.14);}` | เริ่มกำหนด style ให้ selector `body[data-theme="dark"] .alien-duplicate-alert` เช่น สี ระยะ ขนาด หรือ layout |
