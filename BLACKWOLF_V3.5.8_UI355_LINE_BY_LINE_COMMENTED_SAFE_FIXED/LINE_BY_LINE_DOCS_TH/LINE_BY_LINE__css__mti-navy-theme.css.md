# อธิบายบรรทัดต่อบรรทัด: `css/mti-navy-theme.css`

**บทบาทไฟล์:** ไฟล์ตกแต่งหน้าจอ: layout, สี, responsive, component หรือ report style

> วิธีอ่าน: ดูเลขบรรทัด L0001, L0002, ... แล้วเทียบกับไฟล์โค้ดต้นฉบับ/ไฟล์ที่ใส่คอมเมนต์แล้วได้ทันที

| บรรทัด | โค้ด | คำอธิบายแบบคนเริ่มจากศูนย์ |
|---:|---|---|
| L0001 | `/* BLACKWOLF CSS TEACHING COMMENTS: css/mti-navy-theme.css ควบคุมหน้าตา/สี/ระยะ/ responsive ของ UI; ใช้ CSS comment รูปแบบนี้เพื่อไม่ให้ browser ตีความผิด */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0002 | `/* STEP: กฎในไฟล์นี้เป็นชั้นตกแต่ง/override ของ component เฉพาะส่วน */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0003 | `/*` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0004 | `  BLACKWOLF V3.5.5 — MTI Labour Portal inspired navy theme` | คำสั่ง CSS สำหรับควบคุมหน้าตา สี ระยะ หรือ responsive ของหน้าเว็บ |
| L0005 | `  COLOR-ONLY OVERRIDE` | คำสั่ง CSS สำหรับควบคุมหน้าตา สี ระยะ หรือ responsive ของหน้าเว็บ |
| L0006 | `  This file intentionally changes presentation colors only.` | คำสั่ง CSS สำหรับควบคุมหน้าตา สี ระยะ หรือ responsive ของหน้าเว็บ |
| L0007 | `  It does not change layout, HTML structure, JavaScript, workflow logic,` | คำสั่ง CSS สำหรับควบคุมหน้าตา สี ระยะ หรือ responsive ของหน้าเว็บ |
| L0008 | `  Excel processing, report calculations, duplicate handling, or storage.` | คำสั่ง CSS สำหรับควบคุมหน้าตา สี ระยะ หรือ responsive ของหน้าเว็บ |
| L0009 | `*/` | คำสั่ง CSS สำหรับควบคุมหน้าตา สี ระยะ หรือ responsive ของหน้าเว็บ |
| L0010 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0011 | `:root{` | เริ่มกำหนด style ให้ selector `:root` เช่น สี ระยะ ขนาด หรือ layout |
| L0012 | `  --mti-navy-950:#0b2f4b;` | กำหนด property `--mti-navy-950` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0013 | `  --mti-navy-900:#123f64;` | กำหนด property `--mti-navy-900` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0014 | `  --mti-navy-850:#15476f;` | กำหนด property `--mti-navy-850` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0015 | `  --mti-navy-800:#1b5078;` | กำหนด property `--mti-navy-800` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0016 | `  --mti-blue-700:#2b6e98;` | กำหนด property `--mti-blue-700` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0017 | `  --mti-blue-600:#3b87b2;` | กำหนด property `--mti-blue-600` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0018 | `  --mti-sky-500:#67c7e6;` | กำหนด property `--mti-sky-500` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0019 | `  --mti-sky-300:#b9e7f4;` | กำหนด property `--mti-sky-300` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0020 | `  --mti-sky-100:#e9f6fb;` | กำหนด property `--mti-sky-100` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0021 | `  --mti-ice:#f5f9fc;` | กำหนด property `--mti-ice` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0022 | `  --mti-white:#ffffff;` | กำหนด property `--mti-white` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0023 | `  --mti-ink:#102d46;` | กำหนด property `--mti-ink` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0024 | `  --mti-muted:#667f93;` | กำหนด property `--mti-muted` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0025 | `  --mti-line:#d5e2ea;` | กำหนด property `--mti-line` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0026 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0027 | `  --cyan:var(--mti-blue-600);` | กำหนด property `--cyan` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0028 | `  --cyan-deep:var(--mti-blue-700);` | กำหนด property `--cyan-deep` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0029 | `  --cyan-dark:var(--mti-navy-800);` | กำหนด property `--cyan-dark` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0030 | `  --blue-ice:var(--mti-sky-300);` | กำหนด property `--blue-ice` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0031 | `  --blue-ice-soft:var(--mti-sky-100);` | กำหนด property `--blue-ice-soft` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0032 | `  --navy:var(--mti-navy-950);` | กำหนด property `--navy` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0033 | `  --navy-2:var(--mti-navy-900);` | กำหนด property `--navy-2` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0034 | `  --accent:var(--mti-navy-800);` | กำหนด property `--accent` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0035 | `  --accent2:var(--mti-blue-600);` | กำหนด property `--accent2` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0036 | `  --bg:#edf5f9;` | กำหนด property `--bg` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0037 | `  --surface:var(--mti-white);` | กำหนด property `--surface` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0038 | `  --surface2:#f6fafc;` | กำหนด property `--surface2` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0039 | `  --text:var(--mti-ink);` | กำหนด property `--text` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0040 | `  --muted:var(--mti-muted);` | กำหนด property `--muted` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0041 | `  --line:var(--mti-line);` | กำหนด property `--line` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0042 | `  --shadow:0 16px 45px rgba(11,47,75,.10);` | กำหนด property `--shadow` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0043 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0044 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0045 | `body{` | เริ่มกำหนด style ให้ selector `body` เช่น สี ระยะ ขนาด หรือ layout |
| L0046 | `  background:` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0047 | `    radial-gradient(circle at 88% 0%,rgba(103,199,230,.18),transparent 28%),` | คำสั่ง CSS สำหรับควบคุมหน้าตา สี ระยะ หรือ responsive ของหน้าเว็บ |
| L0048 | `    linear-gradient(180deg,#f8fbfd 0%,#edf5f9 100%);` | คำสั่ง CSS สำหรับควบคุมหน้าตา สี ระยะ หรือ responsive ของหน้าเว็บ |
| L0049 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0050 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0051 | `/* Login — same layout, MTI navy / ice-blue colors */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0052 | `.auth-screen{` | เริ่มกำหนด style ให้ selector `.auth-screen` เช่น สี ระยะ ขนาด หรือ layout |
| L0053 | `  background:` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0054 | `    radial-gradient(circle at 78% 22%,rgba(103,199,230,.22),transparent 24%),` | คำสั่ง CSS สำหรับควบคุมหน้าตา สี ระยะ หรือ responsive ของหน้าเว็บ |
| L0055 | `    linear-gradient(135deg,var(--mti-navy-950) 0%,var(--mti-navy-900) 48%,var(--mti-navy-800) 100%);` | คำสั่ง CSS สำหรับควบคุมหน้าตา สี ระยะ หรือ responsive ของหน้าเว็บ |
| L0056 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0057 | `.auth-screen::before{` | เริ่มกำหนด style ให้ selector `.auth-screen::before` เช่น สี ระยะ ขนาด หรือ layout |
| L0058 | `  background:` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0059 | `    radial-gradient(circle at 18% 15%,rgba(255,255,255,.11),transparent 21%),` | คำสั่ง CSS สำหรับควบคุมหน้าตา สี ระยะ หรือ responsive ของหน้าเว็บ |
| L0060 | `    radial-gradient(circle at 86% 80%,rgba(103,199,230,.12),transparent 26%),` | คำสั่ง CSS สำหรับควบคุมหน้าตา สี ระยะ หรือ responsive ของหน้าเว็บ |
| L0061 | `    linear-gradient(115deg,transparent 0 36%,rgba(255,255,255,.055) 36% 37%,transparent 37% 100%);` | คำสั่ง CSS สำหรับควบคุมหน้าตา สี ระยะ หรือ responsive ของหน้าเว็บ |
| L0062 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0063 | `.auth-background-shape{` | เริ่มกำหนด style ให้ selector `.auth-background-shape` เช่น สี ระยะ ขนาด หรือ layout |
| L0064 | `  background:rgba(185,231,244,.055);` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0065 | `  box-shadow:inset 0 0 0 1px rgba(185,231,244,.11);` | กำหนด property `box-shadow` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0066 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0067 | `.auth-card{` | เริ่มกำหนด style ให้ selector `.auth-card` เช่น สี ระยะ ขนาด หรือ layout |
| L0068 | `  background:rgba(255,255,255,.985);` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0069 | `  border-color:rgba(255,255,255,.78);` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0070 | `  box-shadow:0 34px 90px rgba(2,24,42,.34);` | กำหนด property `box-shadow` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0071 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0072 | `.auth-brand-panel{` | เริ่มกำหนด style ให้ selector `.auth-brand-panel` เช่น สี ระยะ ขนาด หรือ layout |
| L0073 | `  background:linear-gradient(160deg,#ffffff 0%,#eef7fb 100%);` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0074 | `  border-right-color:#d6e6ee;` | กำหนด property `border-right-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0075 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0076 | `.auth-logo-wrap{` | เริ่มกำหนด style ให้ selector `.auth-logo-wrap` เช่น สี ระยะ ขนาด หรือ layout |
| L0077 | `  background:linear-gradient(145deg,#e7f4fa,#ffffff);` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0078 | `  box-shadow:0 18px 35px rgba(18,63,100,.17);` | กำหนด property `box-shadow` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0079 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0080 | `.auth-brand-panel h1,.auth-form h2{color:var(--mti-navy-950)}` | เริ่มกำหนด style ให้ selector `.auth-brand-panel h1,.auth-form h2` เช่น สี ระยะ ขนาด หรือ layout |
| L0081 | `.auth-brand-subtitle{color:var(--mti-navy-800)}` | เริ่มกำหนด style ให้ selector `.auth-brand-subtitle` เช่น สี ระยะ ขนาด หรือ layout |
| L0082 | `.auth-brand-copy{color:#617d92}` | เริ่มกำหนด style ให้ selector `.auth-brand-copy` เช่น สี ระยะ ขนาด หรือ layout |
| L0083 | `.auth-security-note{` | เริ่มกำหนด style ให้ selector `.auth-security-note` เช่น สี ระยะ ขนาด หรือ layout |
| L0084 | `  border-color:#d1e3eb;` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0085 | `  background:#ffffff;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0086 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0087 | `.auth-security-note>span{` | เริ่มกำหนด style ให้ selector `.auth-security-note>span` เช่น สี ระยะ ขนาด หรือ layout |
| L0088 | `  background:#e4f3f8;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0089 | `  color:var(--mti-navy-800);` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0090 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0091 | `.auth-eyebrow{color:var(--mti-blue-700)}` | เริ่มกำหนด style ให้ selector `.auth-eyebrow` เช่น สี ระยะ ขนาด หรือ layout |
| L0092 | `.auth-field>span{color:#1a3c58}` | เริ่มกำหนด style ให้ selector `.auth-field>span` เช่น สี ระยะ ขนาด หรือ layout |
| L0093 | `.auth-field>div{` | เริ่มกำหนด style ให้ selector `.auth-field>div` เช่น สี ระยะ ขนาด หรือ layout |
| L0094 | `  border-color:#cbdde6;` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0095 | `  background:#fbfdfe;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0096 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0097 | `.auth-field>div:focus-within{` | เริ่มกำหนด style ให้ selector `.auth-field>div:focus-within` เช่น สี ระยะ ขนาด หรือ layout |
| L0098 | `  border-color:var(--mti-blue-600);` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0099 | `  box-shadow:0 0 0 4px rgba(59,135,178,.12);` | กำหนด property `box-shadow` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0100 | `  background:#ffffff;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0101 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0102 | `.auth-field b,.auth-field button{color:#58758c}` | เริ่มกำหนด style ให้ selector `.auth-field b,.auth-field button` เช่น สี ระยะ ขนาด หรือ layout |
| L0103 | `.auth-field button:hover{` | เริ่มกำหนด style ให้ selector `.auth-field button:hover` เช่น สี ระยะ ขนาด หรือ layout |
| L0104 | `  background:#e8f4f9;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0105 | `  color:var(--mti-navy-800);` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0106 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0107 | `.auth-submit{` | เริ่มกำหนด style ให้ selector `.auth-submit` เช่น สี ระยะ ขนาด หรือ layout |
| L0108 | `  background:linear-gradient(135deg,var(--mti-navy-800),var(--mti-blue-600));` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0109 | `  box-shadow:0 15px 30px rgba(18,63,100,.25);` | กำหนด property `box-shadow` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0110 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0111 | `.auth-submit:hover{box-shadow:0 18px 35px rgba(18,63,100,.31)}` | เริ่มกำหนด style ให้ selector `.auth-submit:hover` เช่น สี ระยะ ขนาด หรือ layout |
| L0112 | `.auth-footnote{` | เริ่มกำหนด style ให้ selector `.auth-footnote` เช่น สี ระยะ ขนาด หรือ layout |
| L0113 | `  border-color:#d8e6ed;` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0114 | `  background:#f7fbfd;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0115 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0116 | `.auth-footnote>span{color:var(--mti-blue-700)}` | เริ่มกำหนด style ให้ selector `.auth-footnote>span` เช่น สี ระยะ ขนาด หรือ layout |
| L0117 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0118 | `/* App shell */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0119 | `.sidebar{` | เริ่มกำหนด style ให้ selector `.sidebar` เช่น สี ระยะ ขนาด หรือ layout |
| L0120 | `  background:linear-gradient(180deg,var(--mti-navy-950) 0%,#103b5d 58%,#092a44 100%);` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0121 | `  border-right-color:rgba(185,231,244,.12);` | กำหนด property `border-right-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0122 | `  box-shadow:12px 0 35px rgba(5,30,48,.15);` | กำหนด property `box-shadow` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0123 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0124 | `.brand span{color:#9db5c7}` | เริ่มกำหนด style ให้ selector `.brand span` เช่น สี ระยะ ขนาด หรือ layout |
| L0125 | `.nav{color:#c1d0dc}` | เริ่มกำหนด style ให้ selector `.nav` เช่น สี ระยะ ขนาด หรือ layout |
| L0126 | `.nav span{color:#87a8bf}` | เริ่มกำหนด style ให้ selector `.nav span` เช่น สี ระยะ ขนาด หรือ layout |
| L0127 | `.nav:hover{` | เริ่มกำหนด style ให้ selector `.nav:hover` เช่น สี ระยะ ขนาด หรือ layout |
| L0128 | `  background:rgba(103,199,230,.10);` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0129 | `  color:#ffffff;` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0130 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0131 | `.nav.active{` | เริ่มกำหนด style ให้ selector `.nav.active` เช่น สี ระยะ ขนาด หรือ layout |
| L0132 | `  background:linear-gradient(135deg,#2d739e,#4b9bc3);` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0133 | `  color:#ffffff;` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0134 | `  box-shadow:0 12px 24px rgba(9,47,75,.30);` | กำหนด property `box-shadow` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0135 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0136 | `.nav.active span{color:#ffffff}` | เริ่มกำหนด style ให้ selector `.nav.active span` เช่น สี ระยะ ขนาด หรือ layout |
| L0137 | `.engine-card{` | เริ่มกำหนด style ให้ selector `.engine-card` เช่น สี ระยะ ขนาด หรือ layout |
| L0138 | `  border-color:rgba(185,231,244,.20);` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0139 | `  background:rgba(8,38,61,.78);` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0140 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0141 | `.engine-card small{color:#96afc2}` | เริ่มกำหนด style ให้ selector `.engine-card small` เช่น สี ระยะ ขนาด หรือ layout |
| L0142 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0143 | `/* Header — dark blue like the reference site */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0144 | `.topbar{` | เริ่มกำหนด style ให้ selector `.topbar` เช่น สี ระยะ ขนาด หรือ layout |
| L0145 | `  background:linear-gradient(90deg,var(--mti-navy-900),#1b5078);` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0146 | `  border-color:rgba(185,231,244,.20);` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0147 | `  box-shadow:0 6px 24px rgba(11,47,75,.14);` | กำหนด property `box-shadow` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0148 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0149 | `.topbar h1{color:#ffffff}` | เริ่มกำหนด style ให้ selector `.topbar h1` เช่น สี ระยะ ขนาด หรือ layout |
| L0150 | `.topbar small{color:#bdd2e0}` | เริ่มกำหนด style ให้ selector `.topbar small` เช่น สี ระยะ ขนาด หรือ layout |
| L0151 | `.mode-chip{` | เริ่มกำหนด style ให้ selector `.mode-chip` เช่น สี ระยะ ขนาด หรือ layout |
| L0152 | `  background:rgba(185,231,244,.16);` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0153 | `  color:#dff5fc;` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0154 | `  border-color:rgba(185,231,244,.22);` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0155 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0156 | `.status-chip{` | เริ่มกำหนด style ให้ selector `.status-chip` เช่น สี ระยะ ขนาด หรือ layout |
| L0157 | `  background:rgba(255,255,255,.12);` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0158 | `  color:#e7f3f9;` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0159 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0160 | `.status-chip.running{` | เริ่มกำหนด style ให้ selector `.status-chip.running` เช่น สี ระยะ ขนาด หรือ layout |
| L0161 | `  background:#fff1d7;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0162 | `  color:#8c5a17;` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0163 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0164 | `.status-chip.success{` | เริ่มกำหนด style ให้ selector `.status-chip.success` เช่น สี ระยะ ขนาด หรือ layout |
| L0165 | `  background:#dff5e9;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0166 | `  color:#167550;` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0167 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0168 | `.status-chip.error{` | เริ่มกำหนด style ให้ selector `.status-chip.error` เช่น สี ระยะ ขนาด หรือ layout |
| L0169 | `  background:#ffe4e8;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0170 | `  color:#a92f44;` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0171 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0172 | `.clock-box,.current-run-box,.top-guide-btn,.icon-btn,.top-logout-btn{` | เริ่มกำหนด style ให้ selector `.clock-box,.current-run-box,.top-guide-btn,.icon-btn,.top-logout-btn` เช่น สี ระยะ ขนาด หรือ layout |
| L0173 | `  border-color:rgba(216,234,243,.35);` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0174 | `  background:rgba(255,255,255,.96);` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0175 | `  color:var(--mti-ink);` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0176 | `  box-shadow:0 7px 18px rgba(6,36,58,.14);` | กำหนด property `box-shadow` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0177 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0178 | `.clock-box small,.current-run-box small{color:#71889a}` | เริ่มกำหนด style ให้ selector `.clock-box small,.current-run-box small` เช่น สี ระยะ ขนาด หรือ layout |
| L0179 | `.top-logout-btn{color:#a42e42}` | เริ่มกำหนด style ให้ selector `.top-logout-btn` เช่น สี ระยะ ขนาด หรือ layout |
| L0180 | `.top-logout-btn:hover{` | เริ่มกำหนด style ให้ selector `.top-logout-btn:hover` เช่น สี ระยะ ขนาด หรือ layout |
| L0181 | `  background:#fff0f2;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0182 | `  border-color:#f4bdc7;` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0183 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0184 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0185 | `/* Shared surfaces */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0186 | `.hero{` | เริ่มกำหนด style ให้ selector `.hero` เช่น สี ระยะ ขนาด หรือ layout |
| L0187 | `  background:` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0188 | `    radial-gradient(circle at 88% 20%,rgba(185,231,244,.12),transparent 24%),` | คำสั่ง CSS สำหรับควบคุมหน้าตา สี ระยะ หรือ responsive ของหน้าเว็บ |
| L0189 | `    linear-gradient(125deg,var(--mti-navy-950) 0%,var(--mti-navy-900) 54%,var(--mti-navy-800) 100%);` | คำสั่ง CSS สำหรับควบคุมหน้าตา สี ระยะ หรือ responsive ของหน้าเว็บ |
| L0190 | `  box-shadow:0 22px 46px rgba(8,47,75,.22);` | กำหนด property `box-shadow` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0191 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0192 | `.hero p,.privacy-badge span{color:#c7d9e5}` | เริ่มกำหนด style ให้ selector `.hero p,.privacy-badge span` เช่น สี ระยะ ขนาด หรือ layout |
| L0193 | `.privacy-badge{` | เริ่มกำหนด style ให้ selector `.privacy-badge` เช่น สี ระยะ ขนาด หรือ layout |
| L0194 | `  border-color:rgba(185,231,244,.28);` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0195 | `  background:rgba(185,231,244,.09);` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0196 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0197 | `.eyebrow{color:var(--mti-blue-600)}` | เริ่มกำหนด style ให้ selector `.eyebrow` เช่น สี ระยะ ขนาด หรือ layout |
| L0198 | `.panel{` | เริ่มกำหนด style ให้ selector `.panel` เช่น สี ระยะ ขนาด หรือ layout |
| L0199 | `  border-color:#d8e5ec;` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0200 | `  box-shadow:0 16px 45px rgba(11,47,75,.09);` | กำหนด property `box-shadow` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0201 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0202 | `.panel-head{border-color:#e0eaf0}` | เริ่มกำหนด style ให้ selector `.panel-head` เช่น สี ระยะ ขนาด หรือ layout |
| L0203 | `.step,.count-chip{` | เริ่มกำหนด style ให้ selector `.step,.count-chip` เช่น สี ระยะ ขนาด หรือ layout |
| L0204 | `  background:#e6f3f8;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0205 | `  color:var(--mti-navy-800);` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0206 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0207 | `.btn.primary{` | เริ่มกำหนด style ให้ selector `.btn.primary` เช่น สี ระยะ ขนาด หรือ layout |
| L0208 | `  background:linear-gradient(135deg,var(--mti-navy-800),var(--mti-blue-600));` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0209 | `  box-shadow:0 10px 22px rgba(18,63,100,.20);` | กำหนด property `box-shadow` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0210 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0211 | `.btn.secondary{` | เริ่มกำหนด style ให้ selector `.btn.secondary` เช่น สี ระยะ ขนาด หรือ layout |
| L0212 | `  background:linear-gradient(135deg,var(--mti-navy-950),var(--mti-navy-800));` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0213 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0214 | `.btn.ghost{` | เริ่มกำหนด style ให้ selector `.btn.ghost` เช่น สี ระยะ ขนาด หรือ layout |
| L0215 | `  background:#ffffff;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0216 | `  border-color:#d6e3ea;` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0217 | `  color:var(--mti-ink);` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0218 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0219 | `.btn.ghost:hover{` | เริ่มกำหนด style ให้ selector `.btn.ghost:hover` เช่น สี ระยะ ขนาด หรือ layout |
| L0220 | `  border-color:#9fc7da;` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0221 | `  background:#eef7fb;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0222 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0223 | `.drop-zone{` | เริ่มกำหนด style ให้ selector `.drop-zone` เช่น สี ระยะ ขนาด หรือ layout |
| L0224 | `  border-color:#cddde6;` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0225 | `  background:linear-gradient(180deg,#f7fbfd,#ffffff);` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0226 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0227 | `.drop-zone:hover,.drop-zone.drag{` | เริ่มกำหนด style ให้ selector `.drop-zone:hover,.drop-zone.drag` เช่น สี ระยะ ขนาด หรือ layout |
| L0228 | `  background:#edf7fb;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0229 | `  border-color:var(--mti-blue-600);` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0230 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0231 | `.upload-icon{` | เริ่มกำหนด style ให้ selector `.upload-icon` เช่น สี ระยะ ขนาด หรือ layout |
| L0232 | `  background:#e3f2f8;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0233 | `  color:var(--mti-navy-800);` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0234 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0235 | `.drop-zone>b{` | เริ่มกำหนด style ให้ selector `.drop-zone>b` เช่น สี ระยะ ขนาด หรือ layout |
| L0236 | `  background:linear-gradient(135deg,var(--mti-navy-800),var(--mti-blue-600));` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0237 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0238 | `.package-score{` | เริ่มกำหนด style ให้ selector `.package-score` เช่น สี ระยะ ขนาด หรือ layout |
| L0239 | `  background:linear-gradient(145deg,var(--mti-navy-950),var(--mti-navy-800));` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0240 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0241 | `.file-chip{background:#f7fafc}` | เริ่มกำหนด style ให้ selector `.file-chip` เช่น สี ระยะ ขนาด หรือ layout |
| L0242 | `.file-chip.ready{` | เริ่มกำหนด style ให้ selector `.file-chip.ready` เช่น สี ระยะ ขนาด หรือ layout |
| L0243 | `  border-color:#afd9c8;` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0244 | `  background:#f0faf5;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0245 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0246 | `.action-strip{background:#f5f9fb}` | เริ่มกำหนด style ให้ selector `.action-strip` เช่น สี ระยะ ขนาด หรือ layout |
| L0247 | `.progress-track i,.bar-row i b,.bar-row b{` | เริ่มกำหนด style ให้ selector `.progress-track i,.bar-row i b,.bar-row b` เช่น สี ระยะ ขนาด หรือ layout |
| L0248 | `  background:linear-gradient(90deg,var(--mti-blue-600),var(--mti-sky-500));` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0249 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0250 | `.kpi{` | เริ่มกำหนด style ให้ selector `.kpi` เช่น สี ระยะ ขนาด หรือ layout |
| L0251 | `  background:linear-gradient(180deg,#ffffff,#f5f9fb);` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0252 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0253 | `.kpi.accent{` | เริ่มกำหนด style ให้ selector `.kpi.accent` เช่น สี ระยะ ขนาด หรือ layout |
| L0254 | `  background:linear-gradient(135deg,var(--mti-navy-800),var(--mti-blue-600));` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0255 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0256 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0257 | `/* Main headings and cards */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0258 | `.page-heading h2,.settings-section-heading h3,.panel-head h3{color:var(--mti-ink)}` | เริ่มกำหนด style ให้ selector `.page-heading h2,.settings-section-heading h3,.panel-head h3` เช่น สี ระยะ ขนาด หรือ layout |
| L0259 | `.table-panel .search,.detail-search .search,.detail-toolbar select{` | เริ่มกำหนด style ให้ selector `.table-panel .search,.detail-search .search,.detail-toolbar select` เช่น สี ระยะ ขนาด หรือ layout |
| L0260 | `  background:#ffffff;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0261 | `  border-color:#d5e2ea;` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0262 | `  color:var(--mti-ink);` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0263 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0264 | `.table-panel .search:focus,.detail-search .search:focus,.detail-toolbar select:focus{` | เริ่มกำหนด style ให้ selector `.table-panel .search:focus,.detail-search .search:focus,.detail-toolbar select:focus` เช่น สี ระยะ ขนาด หรือ layout |
| L0265 | `  border-color:var(--mti-blue-600);` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0266 | `  box-shadow:0 0 0 4px rgba(59,135,178,.10);` | กำหนด property `box-shadow` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0267 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0268 | `thead th{background:#edf5f9;color:#38566d}` | เริ่มกำหนด style ให้ selector `thead th` เช่น สี ระยะ ขนาด หรือ layout |
| L0269 | `th,td{border-color:#dbe6ec}` | เริ่มกำหนด style ให้ selector `th,td` เช่น สี ระยะ ขนาด หรือ layout |
| L0270 | `tbody tr:hover{background:#f0f7fa}` | เริ่มกำหนด style ให้ selector `tbody tr:hover` เช่น สี ระยะ ขนาด หรือ layout |
| L0271 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0272 | `/* Pending Detail Preview */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0273 | `.detail-preview-head{border-color:#d8e5ec}` | เริ่มกำหนด style ให้ selector `.detail-preview-head` เช่น สี ระยะ ขนาด หรือ layout |
| L0274 | `.detail-stat-grid>div{` | เริ่มกำหนด style ให้ selector `.detail-stat-grid>div` เช่น สี ระยะ ขนาด หรือ layout |
| L0275 | `  border-color:#d8e5ec;` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0276 | `  background:linear-gradient(180deg,#ffffff,#f5f9fb);` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0277 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0278 | `.detail-stat-grid>div::before{` | เริ่มกำหนด style ให้ selector `.detail-stat-grid>div::before` เช่น สี ระยะ ขนาด หรือ layout |
| L0279 | `  background:#e2f2f8;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0280 | `  color:var(--mti-navy-800);` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0281 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0282 | `.detail-stat-grid strong{color:var(--mti-navy-950)}` | เริ่มกำหนด style ให้ selector `.detail-stat-grid strong` เช่น สี ระยะ ขนาด หรือ layout |
| L0283 | `.detail-layout{border-color:#d8e5ec}` | เริ่มกำหนด style ให้ selector `.detail-layout` เช่น สี ระยะ ขนาด หรือ layout |
| L0284 | `.detail-table-wrap{background:#ffffff}` | เริ่มกำหนด style ให้ selector `.detail-table-wrap` เช่น สี ระยะ ขนาด หรือ layout |
| L0285 | `.detail-table th{` | เริ่มกำหนด style ให้ selector `.detail-table th` เช่น สี ระยะ ขนาด หรือ layout |
| L0286 | `  background:#edf5f9;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0287 | `  color:#38566d;` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0288 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0289 | `.detail-table tbody tr:hover{background:#eff7fa}` | เริ่มกำหนด style ให้ selector `.detail-table tbody tr:hover` เช่น สี ระยะ ขนาด หรือ layout |
| L0290 | `.detail-table tbody tr.selected{` | เริ่มกำหนด style ให้ selector `.detail-table tbody tr.selected` เช่น สี ระยะ ขนาด หรือ layout |
| L0291 | `  background:#e2f2f8;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0292 | `  box-shadow:inset 3px 0 0 var(--mti-blue-600);` | กำหนด property `box-shadow` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0293 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0294 | `.status-pill.status-issue{` | เริ่มกำหนด style ให้ selector `.status-pill.status-issue` เช่น สี ระยะ ขนาด หรือ layout |
| L0295 | `  background:#e3f1f8;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0296 | `  color:#1e658f;` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0297 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0298 | `.status-pill.status-default{` | เริ่มกำหนด style ให้ selector `.status-pill.status-default` เช่น สี ระยะ ขนาด หรือ layout |
| L0299 | `  background:#e8f7f1;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0300 | `  color:#16795a;` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0301 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0302 | `.detail-drawer{` | เริ่มกำหนด style ให้ selector `.detail-drawer` เช่น สี ระยะ ขนาด หรือ layout |
| L0303 | `  border-color:#d8e5ec;` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0304 | `  background:linear-gradient(180deg,#fbfdfe,#f2f7fa);` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0305 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0306 | `.detail-drawer-empty>span{` | เริ่มกำหนด style ให้ selector `.detail-drawer-empty>span` เช่น สี ระยะ ขนาด หรือ layout |
| L0307 | `  background:#e2f2f8;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0308 | `  color:var(--mti-navy-800);` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0309 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0310 | `.drawer-header{border-color:#d7e4eb}` | เริ่มกำหนด style ให้ selector `.drawer-header` เช่น สี ระยะ ขนาด หรือ layout |
| L0311 | `.drawer-header span{color:var(--mti-blue-700)}` | เริ่มกำหนด style ให้ selector `.drawer-header span` เช่น สี ระยะ ขนาด หรือ layout |
| L0312 | `.drawer-field{border-color:#d8e4eb}` | เริ่มกำหนด style ให้ selector `.drawer-field` เช่น สี ระยะ ขนาด หรือ layout |
| L0313 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0314 | `/* Management report */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0315 | `.report-sheet{` | เริ่มกำหนด style ให้ selector `.report-sheet` เช่น สี ระยะ ขนาด หรือ layout |
| L0316 | `  border-color:#d7e4eb;` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0317 | `  box-shadow:0 25px 65px rgba(11,47,75,.12);` | กำหนด property `box-shadow` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0318 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0319 | `.management-brand{` | เริ่มกำหนด style ให้ selector `.management-brand` เช่น สี ระยะ ขนาด หรือ layout |
| L0320 | `  background:linear-gradient(135deg,var(--mti-navy-950),var(--mti-navy-800))!important;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0321 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0322 | `.management-brand>span{` | เริ่มกำหนด style ให้ selector `.management-brand>span` เช่น สี ระยะ ขนาด หรือ layout |
| L0323 | `  background:linear-gradient(135deg,var(--mti-blue-600),var(--mti-sky-500))!important;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0324 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0325 | `.management-title>span,.management-section-title span{` | เริ่มกำหนด style ให้ selector `.management-title>span,.management-section-title span` เช่น สี ระยะ ขนาด หรือ layout |
| L0326 | `  color:var(--mti-blue-700)!important;` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0327 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0328 | `.management-title h1,.management-section-title h2,.mg-kpi strong{color:var(--mti-navy-900)}` | เริ่มกำหนด style ให้ selector `.management-title h1,.management-section-title h2,.mg-kpi strong` เช่น สี ระยะ ขนาด หรือ layout |
| L0329 | `.management-title p{color:#557790}` | เริ่มกำหนด style ให้ selector `.management-title p` เช่น สี ระยะ ขนาด หรือ layout |
| L0330 | `.management-meta,.mg-kpi,.management-summary-card,.management-aging-card{` | เริ่มกำหนด style ให้ selector `.management-meta,.mg-kpi,.management-summary-card,.management-aging-card` เช่น สี ระยะ ขนาด หรือ layout |
| L0331 | `  border-color:#d6e3ea;` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0332 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0333 | `.management-meta,.mg-kpi{background:#f7fafc}` | เริ่มกำหนด style ให้ selector `.management-meta,.mg-kpi` เช่น สี ระยะ ขนาด หรือ layout |
| L0334 | `.management-summary-card header,.management-aging-card header{` | เริ่มกำหนด style ให้ selector `.management-summary-card header,.management-aging-card header` เช่น สี ระยะ ขนาด หรือ layout |
| L0335 | `  background:linear-gradient(135deg,#e5f3f8,#f7fbfd)!important;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0336 | `  color:var(--mti-navy-900)!important;` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0337 | `  border-bottom-color:#cddfe8;` | กำหนด property `border-bottom-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0338 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0339 | `.management-summary-card header small,.management-aging-card header small{color:#5d7d93}` | เริ่มกำหนด style ให้ selector `.management-summary-card header small,.management-aging-card header small` เช่น สี ระยะ ขนาด หรือ layout |
| L0340 | `.management-summary-body{background:#f5f9fb}` | เริ่มกำหนด style ให้ selector `.management-summary-body` เช่น สี ระยะ ขนาด หรือ layout |
| L0341 | `.management-summary-body>div{border-color:#dae6ec}` | เริ่มกำหนด style ให้ selector `.management-summary-body>div` เช่น สี ระยะ ขนาด หรือ layout |
| L0342 | `.summary-premium strong{color:var(--mti-blue-700)!important}` | เริ่มกำหนด style ให้ selector `.summary-premium strong` เช่น สี ระยะ ขนาด หรือ layout |
| L0343 | `.mg-total .mg-icon,.mg-premium .mg-icon{` | เริ่มกำหนด style ให้ selector `.mg-total .mg-icon,.mg-premium .mg-icon` เช่น สี ระยะ ขนาด หรือ layout |
| L0344 | `  background:linear-gradient(135deg,var(--mti-blue-600),var(--mti-sky-500))!important;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0345 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0346 | `.mg-premium{` | เริ่มกำหนด style ให้ selector `.mg-premium` เช่น สี ระยะ ขนาด หรือ layout |
| L0347 | `  background:linear-gradient(145deg,#f5fbfd,#e7f4f9)!important;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0348 | `  border-color:#c7e0ea!important;` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0349 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0350 | `.management-aging-card .aging-row i b{` | เริ่มกำหนด style ให้ selector `.management-aging-card .aging-row i b` เช่น สี ระยะ ขนาด หรือ layout |
| L0351 | `  background:linear-gradient(90deg,var(--mti-blue-600),var(--mti-sky-500))!important;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0352 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0353 | `.management-report-footer{` | เริ่มกำหนด style ให้ selector `.management-report-footer` เช่น สี ระยะ ขนาด หรือ layout |
| L0354 | `  background:#edf4f8;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0355 | `  border-color:#d4e1e8;` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0356 | `  color:#668094;` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0357 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0358 | `.report-table th{background:var(--mti-navy-950)}` | เริ่มกำหนด style ให้ selector `.report-table th` เช่น สี ระยะ ขนาด หรือ layout |
| L0359 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0360 | `/* Settings / history / overlays */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0361 | `.settings-hero{` | เริ่มกำหนด style ให้ selector `.settings-hero` เช่น สี ระยะ ขนาด หรือ layout |
| L0362 | `  background:linear-gradient(135deg,var(--mti-navy-950),var(--mti-navy-800));` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0363 | `  box-shadow:0 18px 42px rgba(11,47,75,.20);` | กำหนด property `box-shadow` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0364 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0365 | `.settings-hero p{color:#d5e3ec}` | เริ่มกำหนด style ให้ selector `.settings-hero p` เช่น สี ระยะ ขนาด หรือ layout |
| L0366 | `.settings-section-heading>span{` | เริ่มกำหนด style ให้ selector `.settings-section-heading>span` เช่น สี ระยะ ขนาด หรือ layout |
| L0367 | `  background:#e2f1f7;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0368 | `  color:var(--mti-navy-800);` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0369 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0370 | `.settings-card{border-top-color:var(--mti-blue-600)}` | เริ่มกำหนด style ให้ selector `.settings-card` เช่น สี ระยะ ขนาด หรือ layout |
| L0371 | `.settings-icon{` | เริ่มกำหนด style ให้ selector `.settings-icon` เช่น สี ระยะ ขนาด หรือ layout |
| L0372 | `  background:#e5f2f7;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0373 | `  color:var(--mti-navy-800);` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0374 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0375 | `.segmented-control button.active{` | เริ่มกำหนด style ให้ selector `.segmented-control button.active` เช่น สี ระยะ ขนาด หรือ layout |
| L0376 | `  color:var(--mti-navy-800);` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0377 | `  box-shadow:0 3px 10px rgba(11,47,75,.09);` | กำหนด property `box-shadow` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0378 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0379 | `.storage-card{border-top-color:var(--mti-blue-700)}` | เริ่มกำหนด style ให้ selector `.storage-card` เช่น สี ระยะ ขนาด หรือ layout |
| L0380 | `.history-panel{background:linear-gradient(180deg,#ffffff,#f5f9fb)}` | เริ่มกำหนด style ให้ selector `.history-panel` เช่น สี ระยะ ขนาด หรือ layout |
| L0381 | `.history-item{border-color:#d7e4eb}` | เริ่มกำหนด style ให้ selector `.history-item` เช่น สี ระยะ ขนาด หรือ layout |
| L0382 | `.history-item:hover{box-shadow:0 14px 28px rgba(11,47,75,.10)}` | เริ่มกำหนด style ให้ selector `.history-item:hover` เช่น สี ระยะ ขนาด หรือ layout |
| L0383 | `.image-modal-content,.confirm-box{box-shadow:0 35px 100px rgba(3,27,45,.46)}` | เริ่มกำหนด style ให้ selector `.image-modal-content,.confirm-box` เช่น สี ระยะ ขนาด หรือ layout |
| L0384 | `.toast{background:var(--mti-navy-950)}` | เริ่มกำหนด style ให้ selector `.toast` เช่น สี ระยะ ขนาด หรือ layout |
| L0385 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0386 | `/* Dark mode keeps the same navy family */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0387 | `body.dark{` | เริ่มกำหนด style ให้ selector `body.dark` เช่น สี ระยะ ขนาด หรือ layout |
| L0388 | `  --bg:#071d2f;` | กำหนด property `--bg` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0389 | `  --surface:#0d2a42;` | กำหนด property `--surface` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0390 | `  --surface2:#0a2439;` | กำหนด property `--surface2` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0391 | `  --text:#eef7fb;` | กำหนด property `--text` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0392 | `  --muted:#9db4c5;` | กำหนด property `--muted` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0393 | `  --line:#244761;` | กำหนด property `--line` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0394 | `  --shadow:0 18px 50px rgba(0,0,0,.28);` | กำหนด property `--shadow` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0395 | `  background:linear-gradient(180deg,#071d2f,#0a263d);` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0396 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0397 | `body.dark .topbar{` | เริ่มกำหนด style ให้ selector `body.dark .topbar` เช่น สี ระยะ ขนาด หรือ layout |
| L0398 | `  background:linear-gradient(90deg,#08253c,#123f64);` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0399 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0400 | `body.dark .clock-box,body.dark .current-run-box,body.dark .top-guide-btn,` | คำสั่ง CSS สำหรับควบคุมหน้าตา สี ระยะ หรือ responsive ของหน้าเว็บ |
| L0401 | `body.dark .icon-btn,body.dark .top-logout-btn,body.dark .btn.ghost,` | คำสั่ง CSS สำหรับควบคุมหน้าตา สี ระยะ หรือ responsive ของหน้าเว็บ |
| L0402 | `body.dark .detail-toolbar select,body.dark .detail-search .search{` | เริ่มกำหนด style ให้ selector `body.dark .detail-toolbar select,body.dark .detail-search .search` เช่น สี ระยะ ขนาด หรือ layout |
| L0403 | `  background:#0d2a42;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0404 | `  border-color:#31556e;` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0405 | `  color:var(--text);` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0406 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0407 | `body.dark .detail-stat-grid>div,body.dark .detail-drawer,` | คำสั่ง CSS สำหรับควบคุมหน้าตา สี ระยะ หรือ responsive ของหน้าเว็บ |
| L0408 | `body.dark .detail-table-wrap,body.dark .detail-table th{` | เริ่มกำหนด style ให้ selector `body.dark .detail-table-wrap,body.dark .detail-table th` เช่น สี ระยะ ขนาด หรือ layout |
| L0409 | `  background:#0a2439;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0410 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0411 | `body.dark .detail-table tbody tr:hover{background:#123b58}` | เริ่มกำหนด style ให้ selector `body.dark .detail-table tbody tr:hover` เช่น สี ระยะ ขนาด หรือ layout |
| L0412 | `body.dark .detail-table tbody tr.selected{background:#164966}` | เริ่มกำหนด style ให้ selector `body.dark .detail-table tbody tr.selected` เช่น สี ระยะ ขนาด หรือ layout |
| L0413 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0414 | `(บรรทัดว่าง)` | บรรทัดว่าง ใช้แบ่งกลุ่ม style ให้อ่านง่าย |
| L0415 | `/* Remember password control */` | คอมเมนต์ CSS เดิม ใช้อธิบายกลุ่ม style ไม่กระทบการแสดงผล |
| L0416 | `.auth-remember{` | เริ่มกำหนด style ให้ selector `.auth-remember` เช่น สี ระยะ ขนาด หรือ layout |
| L0417 | `  display:flex;` | กำหนด property `display` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0418 | `  align-items:center;` | กำหนด property `align-items` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0419 | `  gap:11px;` | กำหนด property `gap` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0420 | `  margin:-1px 0 16px;` | กำหนด property `margin` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0421 | `  padding:11px 13px;` | กำหนด property `padding` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0422 | `  border:1px solid #cbdde9;` | กำหนด property `border` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0423 | `  border-radius:13px;` | กำหนด property `border-radius` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0424 | `  background:rgba(247,251,254,.92);` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0425 | `  cursor:pointer;` | กำหนด property `cursor` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0426 | `  user-select:none;` | กำหนด property `user-select` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0427 | `  transition:border-color .18s ease,background .18s ease,box-shadow .18s ease;` | กำหนด property `transition` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0428 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0429 | `.auth-remember:hover{` | เริ่มกำหนด style ให้ selector `.auth-remember:hover` เช่น สี ระยะ ขนาด หรือ layout |
| L0430 | `  border-color:#83afcb;` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0431 | `  background:#fff;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0432 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0433 | `.auth-remember:focus-within{` | เริ่มกำหนด style ให้ selector `.auth-remember:focus-within` เช่น สี ระยะ ขนาด หรือ layout |
| L0434 | `  border-color:var(--mti-blue-500,#2c78aa);` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0435 | `  box-shadow:0 0 0 4px rgba(44,120,170,.11);` | กำหนด property `box-shadow` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0436 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0437 | `.auth-remember input{` | เริ่มกำหนด style ให้ selector `.auth-remember input` เช่น สี ระยะ ขนาด หรือ layout |
| L0438 | `  position:absolute;` | กำหนด property `position` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0439 | `  width:1px;` | กำหนด property `width` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0440 | `  height:1px;` | กำหนด property `height` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0441 | `  opacity:0;` | กำหนด property `opacity` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0442 | `  pointer-events:none;` | กำหนด property `pointer-events` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0443 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0444 | `.auth-remember-box{` | เริ่มกำหนด style ให้ selector `.auth-remember-box` เช่น สี ระยะ ขนาด หรือ layout |
| L0445 | `  display:grid;` | กำหนด property `display` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0446 | `  flex:0 0 22px;` | กำหนด property `flex` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0447 | `  width:22px;` | กำหนด property `width` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0448 | `  height:22px;` | กำหนด property `height` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0449 | `  place-items:center;` | กำหนด property `place-items` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0450 | `  border:1.5px solid #9ab4c7;` | กำหนด property `border` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0451 | `  border-radius:7px;` | กำหนด property `border-radius` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0452 | `  color:transparent;` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0453 | `  background:#fff;` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0454 | `  font-size:13px;` | กำหนด property `font-size` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0455 | `  font-weight:900;` | กำหนด property `font-weight` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0456 | `  transition:.18s ease;` | กำหนด property `transition` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0457 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0458 | `.auth-remember input:checked+.auth-remember-box{` | เริ่มกำหนด style ให้ selector `.auth-remember input:checked+.auth-remember-box` เช่น สี ระยะ ขนาด หรือ layout |
| L0459 | `  border-color:var(--mti-blue-600,#256c9d);` | กำหนด property `border-color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0460 | `  color:#fff;` | กำหนด property `color` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0461 | `  background:linear-gradient(135deg,var(--mti-blue-500,#2c78aa),var(--mti-navy-800,#173f61));` | กำหนด property `background` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0462 | `  box-shadow:0 5px 12px rgba(18,63,100,.22);` | กำหนด property `box-shadow` เพื่อเปลี่ยนหน้าตาหรือ layout ของ element |
| L0463 | `}` | ปิด block ของ selector ก่อนหน้า |
| L0464 | `.auth-remember-copy{min-width:0}` | เริ่มกำหนด style ให้ selector `.auth-remember-copy` เช่น สี ระยะ ขนาด หรือ layout |
| L0465 | `.auth-remember-copy strong,.auth-remember-copy small{display:block}` | เริ่มกำหนด style ให้ selector `.auth-remember-copy strong,.auth-remember-copy small` เช่น สี ระยะ ขนาด หรือ layout |
| L0466 | `.auth-remember-copy strong{color:#173a56;font-size:11px;line-height:1.25}` | เริ่มกำหนด style ให้ selector `.auth-remember-copy strong` เช่น สี ระยะ ขนาด หรือ layout |
| L0467 | `.auth-remember-copy small{margin-top:3px;color:#71879a;font-size:9px;line-height:1.4}` | เริ่มกำหนด style ให้ selector `.auth-remember-copy small` เช่น สี ระยะ ขนาด หรือ layout |
| L0468 | `@media(max-width:620px){.auth-remember{padding:10px 11px}.auth-remember-copy small{font-size:8.5px}}` | เริ่มเงื่อนไข responsive เพื่อปรับหน้าจอตามความกว้างของอุปกรณ์ |
