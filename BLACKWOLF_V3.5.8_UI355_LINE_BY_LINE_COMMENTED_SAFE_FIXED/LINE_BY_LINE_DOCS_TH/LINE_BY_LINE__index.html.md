# อธิบายบรรทัดต่อบรรทัด: `index.html`

**บทบาทไฟล์:** โครงหน้าเว็บ: auth screen, app shell, pages, modals และลำดับโหลด script

> วิธีอ่าน: ดูเลขบรรทัด L0001, L0002, ... แล้วเทียบกับไฟล์โค้ดต้นฉบับ/ไฟล์ที่ใส่คอมเมนต์แล้วได้ทันที

| บรรทัด | โค้ด | คำอธิบายแบบคนเริ่มจากศูนย์ |
|---:|---|---|
| L0001 | `<!doctype html>` | ประกาศเอกสารเป็น HTML5 ต้องอยู่ต้นไฟล์เพื่อให้ Browser ใช้ standard mode |
| L0002 | `<!-- BLACKWOLF HTML TEACHING COMMENTS: คอมเมนต์ HTML ใช้รูปแบบนี้เพื่อไม่ให้หน้าเว็บพัง -->` | คอมเมนต์ HTML เดิม ใช้อธิบายส่วนของหน้าเว็บ ไม่แสดงบนหน้าจอ |
| L0003 | `<html lang="th">` | เริ่มเอกสาร HTML และกำหนดภาษา/บริบทของหน้าเว็บ |
| L0004 | `<head>` | เริ่มส่วน head สำหรับ metadata, title, icon และไฟล์ CSS |
| L0005 | `  <!-- STEP 1: head เก็บ metadata, icon, viewport, title และ CSS loader -->` | คอมเมนต์ HTML เดิม ใช้อธิบายส่วนของหน้าเว็บ ไม่แสดงบนหน้าจอ |
| L0006 | `  <meta charset="utf-8">` | กำหนด metadata เช่น charset, viewport หรือ theme color ให้ Browser เข้าใจหน้าเว็บถูกต้อง |
| L0007 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0008 | `  <link` | โหลด resource ภายนอก เช่น icon หรือ stylesheet เข้ามาใช้กับหน้าเว็บ |
| L0009 | `    rel="icon"` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0010 | `    type="image/png"` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0011 | `    href="assets/blackwolf-logo.png"` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0012 | `  >` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0013 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0014 | `  <link` | โหลด resource ภายนอก เช่น icon หรือ stylesheet เข้ามาใช้กับหน้าเว็บ |
| L0015 | `    rel="apple-touch-icon"` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0016 | `    href="assets/blackwolf-logo.png"` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0017 | `  >` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0018 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0019 | `  <meta name="viewport" content="width=device-width, initial-scale=1">` | กำหนด metadata เช่น charset, viewport หรือ theme color ให้ Browser เข้าใจหน้าเว็บถูกต้อง |
| L0020 | `  <meta name="theme-color" content="#0b1020">` | กำหนด metadata เช่น charset, viewport หรือ theme color ให้ Browser เข้าใจหน้าเว็บถูกต้อง |
| L0021 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0022 | `  <title>BLACKWOLF V3.5.8 — Professional Browser Web</title>` | กำหนดชื่อหน้าเว็บที่แสดงบน browser tab |
| L0023 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0024 | `  <link rel="stylesheet" href="styles.css?v=3.5.8">` | โหลด resource ภายนอก เช่น icon หรือ stylesheet เข้ามาใช้กับหน้าเว็บ |
| L0025 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0026 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0027 | `</head>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0028 | `<body class="auth-locked">` | เริ่มส่วน body ซึ่งเป็นเนื้อหาที่ผู้ใช้เห็นและโต้ตอบได้ |
| L0029 | `<!-- STEP 2: เริ่มต้นด้วย auth-locked เพื่อซ่อน app จนกว่าจะ login ผ่าน -->` | คอมเมนต์ HTML เดิม ใช้อธิบายส่วนของหน้าเว็บ ไม่แสดงบนหน้าจอ |
| L0030 | `<!-- STEP 3: auth-screen คือหน้าล็อกอินที่ auth.js ควบคุม -->` | คอมเมนต์ HTML เดิม ใช้อธิบายส่วนของหน้าเว็บ ไม่แสดงบนหน้าจอ |
| L0031 | `<div class="auth-screen" id="authScreen" aria-labelledby="authTitle">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0032 | `  <div class="auth-background-shape auth-shape-one"></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0033 | `  <div class="auth-background-shape auth-shape-two"></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0034 | `  <section class="auth-card">` | แบ่งหน้าจอเป็น section หลัก เช่น prepare, dashboard, results, report, history หรือ settings |
| L0035 | `    <div class="auth-brand-panel">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0036 | `      <div class="auth-logo-wrap"><img src="assets/blackwolf-logo.png" alt="BLACKWOLF"></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0037 | `      <h1>BLACKWOLF</h1>` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0038 | `      <p class="auth-brand-subtitle">WORKFLOW PLATFORM</p>` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0039 | `      <p class="auth-brand-copy">แพลตฟอร์มบริหารจัดการกระบวนการทำงานที่ปลอดภัย เชื่อมต่อ และมีประสิทธิภาพ</p>` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0040 | `      <div class="auth-security-note"><span>✓</span><div><strong>Hashed Local Access</strong><small>ตรวจรหัสด้วย PBKDF2 Hash และประมวลผลไฟล์ภายใน Browser เคร...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0041 | `    </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0042 | `    <form class="auth-form" id="authForm" autocomplete="off">` | สร้างฟอร์มรับข้อมูลจากผู้ใช้ เช่น username/password หรือค่าที่ต้อง submit |
| L0043 | `      <span class="auth-eyebrow">AUTHORIZED ACCESS</span>` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0044 | `      <h2 id="authTitle">ลงชื่อเข้าใช้</h2>` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0045 | `      <p>กรอกชื่อผู้ใช้และรหัสผ่านเพื่อเข้าสู่ระบบ</p>` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0046 | `      <label class="auth-field">` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0047 | `        <span>ชื่อผู้ใช้ <em>(Username)</em></span>` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0048 | `        <div><b>◉</b><input id="authUsername" name="username" type="text" inputmode="text" autocomplete="username" placeholder="กรอกชื่อผู้ใช้" required></div>` | สร้างช่องกรอกข้อมูลหรือเลือกไฟล์ ผู้ใช้จะใส่ค่าผ่าน element นี้ |
| L0049 | `      </label>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0050 | `      <label class="auth-field">` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0051 | `        <span>รหัสผ่าน <em>(Password)</em></span>` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0052 | `        <div><b>▣</b><input id="authPassword" name="password" type="password" autocomplete="current-password" placeholder="กรอกรหัสผ่าน" required><button id=...` | สร้างช่องกรอกข้อมูลหรือเลือกไฟล์ ผู้ใช้จะใส่ค่าผ่าน element นี้ |
| L0053 | `      </label>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0054 | `      <label class="auth-remember" for="rememberPassword">` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0055 | `        <input id="rememberPassword" name="rememberPassword" type="checkbox">` | สร้างช่องกรอกข้อมูลหรือเลือกไฟล์ ผู้ใช้จะใส่ค่าผ่าน element นี้ |
| L0056 | `        <span class="auth-remember-box" aria-hidden="true">✓</span>` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0057 | `        <span class="auth-remember-copy"><strong>จดจำชื่อผู้ใช้</strong><small>บันทึกเฉพาะชื่อผู้ใช้ ไม่บันทึกรหัสผ่านใน Browser</small></span>` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0058 | `      </label>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0059 | `      <p class="auth-error" id="authError" role="alert"></p>` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0060 | `      <button class="auth-submit" type="submit"><span>▣</span> ล็อกอินเข้าสู่ระบบ</button>` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0061 | `      <div class="auth-footnote"><span>◈</span><div><strong>การเข้าถึงแบบจำกัดสิทธิ์</strong><small>ผู้ใช้ที่กรอกข้อมูลถูกต้องเท่านั้นจึงจะเข้าสู่หน้าทำงานได...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0062 | `    </form>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0063 | `  </section>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0064 | `</div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0065 | `<!-- STEP 4: app-shell คือหน้าหลักทั้งหมด หลัง login แล้วจึง aria-hidden=false -->` | คอมเมนต์ HTML เดิม ใช้อธิบายส่วนของหน้าเว็บ ไม่แสดงบนหน้าจอ |
| L0066 | `<div class="app-shell" id="applicationShell" aria-hidden="true">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0067 | `  <aside class="sidebar">` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0068 | `    <!-- STEP 5: sidebar เก็บ brand, menu navigation และสถานะ engine -->` | คอมเมนต์ HTML เดิม ใช้อธิบายส่วนของหน้าเว็บ ไม่แสดงบนหน้าจอ |
| L0069 | `    <div class="brand">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0070 | `      <img src="assets/blackwolf-logo.png" alt="BLACKWOLF">` | แสดงรูปภาพหรือไอคอนประกอบ UI |
| L0071 | `      <div><strong>BLACKWOLF</strong><span>PROFESSIONAL WEB V3.5.8</span></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0072 | `    </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0073 | `    <nav>` | สร้างเมนูนำทางด้านข้าง ใช้เปลี่ยนหน้าภายในแอป |
| L0074 | `      <button class="nav active" data-page="prepare"><span>▶</span><b>เตรียมไฟล์และรัน</b></button>` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0075 | `      <button class="nav" data-page="dashboard"><span>⌂</span><b>แดชบอร์ดผู้บริหาร</b></button>` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0076 | `      <button class="nav" data-page="results"><span>⇩</span><b>ตรวจผลและดาวน์โหลด</b></button>` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0077 | `      <button class="nav" data-page="report"><span>▧</span><b>รายงานผู้บริหาร</b></button>` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0078 | `      <button class="nav" data-page="history"><span>◷</span><b>ประวัติการรัน</b></button>` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0079 | `      <button class="nav" data-page="settings"><span>⚙</span><b>การตั้งค่า</b></button>` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0080 | `    </nav>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0081 | `    <div class="engine-card"><i></i><div><strong id="engineReadyText">Browser Worker Engine Ready</strong><small>No PowerShell · Local-only processing</small...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0082 | `  </aside>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0083 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0084 | `  <main>` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0085 | `    <!-- STEP 6: main เก็บทุก page เช่น prepare, dashboard, results, report, history, settings -->` | คอมเมนต์ HTML เดิม ใช้อธิบายส่วนของหน้าเว็บ ไม่แสดงบนหน้าจอ |
| L0086 | `    <header class="topbar">` | เริ่มส่วน head สำหรับ metadata, title, icon และไฟล์ CSS |
| L0087 | `      <div><small>Foreign Worker Policy Review</small><h1 id="pageTitle">เตรียมไฟล์และรัน</h1></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0088 | `      <div class="top-actions">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0089 | `        <div class="clock-box"><small>วันเวลาปัจจุบัน</small><strong id="liveDateTime">-</strong></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0090 | `        <span class="mode-chip">LOCAL PROCESSING</span>` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0091 | `        <span class="status-chip" id="globalStatus">WAITING</span>` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0092 | `        <div class="current-run-box"><small>CURRENT RUN</small><strong id="currentRunLabel">-</strong></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0093 | `        <button id="guideBtn" class="top-guide-btn" type="button">? วิธีใช้งาน</button>` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0094 | `        <button id="themeBtn" class="icon-btn" title="สลับธีม" type="button" aria-label="สลับธีม">◐</button>` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0095 | `        <button id="logoutBtn" class="top-logout-btn" type="button" title="ออกจากระบบ">ออกจากระบบ</button>` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0096 | `      </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0097 | `    </header>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0098 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0099 | `    <section class="page active" id="page-prepare">` | แบ่งหน้าจอเป็น section หลัก เช่น prepare, dashboard, results, report, history หรือ settings |
| L0100 | `      <div class="hero">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0101 | `        <div><span class="eyebrow">BLACKWOLF V3.5.8 PROFESSIONAL MODE</span><h2>โหลดไฟล์ครบในหน้าเดียว พร้อมประมวลผลแบบมืออาชีพ</h2><p>ประมวลผลด้วย Backgroun...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0102 | `        <div class="privacy-badge"><strong>2</strong><span>Working XLSX</span></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0103 | `      </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0104 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0105 | `      <article class="runtime-banner hidden" id="runtimeBanner"></article>` | สร้างกล่องเนื้อหา/card ภายในหน้า ใช้จัดกลุ่มข้อมูลให้เป็นระเบียบ |
| L0106 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0107 | `      <article class="panel unified-panel">` | สร้างกล่องเนื้อหา/card ภายในหน้า ใช้จัดกลุ่มข้อมูลให้เป็นระเบียบ |
| L0108 | `        <div class="panel-head">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0109 | `          <div><span class="step">01</span><h3>Work Package</h3><p>ลากไฟล์ทั้งหมดมาวางครั้งเดียว ระบบจำแนกและตรวจสอบให้อัตโนมัติ</p></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0110 | `          <button class="btn ghost" id="clearBtn" type="button">ล้างทั้งหมด</button>` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0111 | `        </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0112 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0113 | `        <label class="drop-zone" id="dropZone">` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0114 | `          <input id="bulkInput" type="file" accept=".xlsx,.xlsm,.xls,.txt" multiple hidden>` | สร้างช่องกรอกข้อมูลหรือเลือกไฟล์ ผู้ใช้จะใส่ค่าผ่าน element นี้ |
| L0115 | `          <span class="upload-icon">⇩</span>` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0116 | `          <div><strong>ลากไฟล์ทั้งหมดมาวาง หรือคลิกเพื่อเลือกพร้อมกัน</strong><small>Required: Master, เช็คสถานะ ISSUE, Daily Report, M190 · Optional: SM, Bl...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0117 | `          <b>SELECT ALL FILES</b>` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0118 | `        </label>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0119 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0120 | `        <div class="package-summary">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0121 | `          <div class="package-score"><strong id="readyCount">0/4</strong><span>Required Ready</span></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0122 | `          <div class="file-chips" id="fileChips"></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0123 | `        </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0124 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0125 | `        <div class="etl-inline-card">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0126 | `          <div class="etl-inline-head"><div><span class="etl-badge">AUTO-MAIL 7.2</span><strong>ใส่รายการ ETL เพิ่มเติม</strong><small>วางข้อความจาก Auto-Mai...` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0127 | `          <textarea id="autoMail72Input" spellcheck="false" placeholder="1.7240991292:HP651502:HLABOR&#10;2.7240895649:HP651248:HLABOR"></textarea>` | สร้างกล่องข้อความหลายบรรทัด สำหรับวางข้อมูล Auto-Mail 7.2 |
| L0128 | `          <div class="etl-stats"><span>Valid <b id="etlValid">0</b></span><span>Invalid <b id="etlInvalid">0</b></span><span>Duplicate <b id="etlDuplicate">0...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0129 | `        </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0130 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0131 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0132 | `        <div class="date-control-card">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0133 | `          <div><span class="date-badge">DATE T</span><strong>วันเริ่มต้น Manual</strong><small>ใช้เฉพาะเมื่อ Master ไม่มีวันที่ในคอลัมน์ T ระบบจะอ่าน Date คอ...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0134 | `          <input id="manualStartDate" type="date" aria-label="วันเริ่มต้น Manual">` | สร้างช่องกรอกข้อมูลหรือเลือกไฟล์ ผู้ใช้จะใส่ค่าผ่าน element นี้ |
| L0135 | `        </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0136 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0137 | `        <div class="action-strip">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0138 | `          <div class="inline-status" id="inlineStatus"><i></i><div><strong>รอไฟล์</strong><small>เลือก Required files ให้ครบ 4 รายการ</small></div></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0139 | `          <button class="btn secondary" id="preflightBtn" type="button" disabled>✓ ตรวจสอบไฟล์</button>` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0140 | `          <button class="btn primary" id="runBtn" type="button" disabled>▶ Run & Create 2 Excel Files</button>` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0141 | `        </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0142 | `      </article>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0143 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0144 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0145 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0146 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0147 | `    </section>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0148 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0149 | `    <section class="page" id="page-dashboard">` | แบ่งหน้าจอเป็น section หลัก เช่น prepare, dashboard, results, report, history หรือ settings |
| L0150 | `      <div class="page-heading"><div><span class="eyebrow">EXECUTIVE VIEW</span><h2>Executive Dashboard</h2><p id="dashboardSubtitle">ยังไม่มีผลการประมวลผล</...` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0151 | `      <div class="kpi-grid">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0152 | `        <article class="kpi"><span>Pending Policies</span><strong id="kpiPending">0</strong><small>รอ Issue</small></article><article class="kpi"><span>Incom...` | สร้างกล่องเนื้อหา/card ภายในหน้า ใช้จัดกลุ่มข้อมูลให้เป็นระเบียบ |
| L0153 | `      </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0154 | `      <div class="layout-two dashboard-layout"><article class="panel"><div class="panel-head"><div><h3>Status Distribution</h3><p>จำนวน ProposalID แยกตามสถาน...` | สร้างกล่องเนื้อหา/card ภายในหน้า ใช้จัดกลุ่มข้อมูลให้เป็นระเบียบ |
| L0155 | `      <article class="panel dashboard-recon"><div class="panel-head"><div><h3>Reconciliation</h3><p>ตรวจจำนวนรายการระหว่าง Source และ Output</p></div></div><...` | สร้างกล่องเนื้อหา/card ภายในหน้า ใช้จัดกลุ่มข้อมูลให้เป็นระเบียบ |
| L0156 | `    </section>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0157 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0158 | `    <section class="page" id="page-results">` | แบ่งหน้าจอเป็น section หลัก เช่น prepare, dashboard, results, report, history หรือ settings |
| L0159 | `      <div class="page-heading"><div><span class="eyebrow">TWO WORKING FILES</span><h2>Approval & Download</h2><p>ดาวน์โหลดไฟล์หลักทั้งสองไฟล์และเก็บเองทุกวั...` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0160 | `      <article class="panel empty-state" id="resultEmpty"><span>⇩</span><h3>ยังไม่มีไฟล์ผลลัพธ์</h3><p>เลือกไฟล์และ Run Workflow ก่อน</p></article>` | สร้างกล่องเนื้อหา/card ภายในหน้า ใช้จัดกลุ่มข้อมูลให้เป็นระเบียบ |
| L0161 | `      <div id="resultContent" class="hidden">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0162 | `        <div class="result-summary" id="resultSummary"></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0163 | `        <div class="download-stack">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0164 | `          <button class="combined-download" id="downloadCombined"><span class="xlsx-badge">XLSX</span><div><strong>เช็คกรมธรรม์ต่างด้าวที่ยังไม่ออก — Master ...` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0165 | `          <button class="combined-download secondary-download" id="downloadIssue"><span class="xlsx-badge">XLSX</span><div><strong>เช็คสถานะ ISSUE — Working ...` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0166 | `        </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0167 | `          <article class="panel preflight-result hidden" id="preflightResult"></article>` | สร้างกล่องเนื้อหา/card ภายในหน้า ใช้จัดกลุ่มข้อมูลให้เป็นระเบียบ |
| L0168 | `      <article class="panel progress-panel hidden" id="progressPanel">` | สร้างกล่องเนื้อหา/card ภายในหน้า ใช้จัดกลุ่มข้อมูลให้เป็นระเบียบ |
| L0169 | `        <div class="progress-head"><div><h3>กำลังประมวลผล</h3><p id="progressMessage">กำลังเตรียม...</p></div><strong id="progressPct">0%</strong></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0170 | `        <div class="progress-track"><i id="progressBar"></i></div><div class="log-box" id="logBox"></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0171 | `      </article>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0172 | `       <article class="panel workbook-preview" id="workbookPreviewPanel">` | สร้างกล่องเนื้อหา/card ภายในหน้า ใช้จัดกลุ่มข้อมูลให้เป็นระเบียบ |
| L0173 | `        <div class="panel-head"><div><span class="step">02</span><h3>รูปแบบ Workbook ผลลัพธ์</h3><p>Master ใหม่มีสูตร P:W พร้อมใช้วันถัดไป และไฟล์ ISSUE จะล้...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0174 | `        <div class="excel-window">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0175 | `          <div class="excel-ribbon"><span>BLACKWOLF — เช็คกรมธรรม์ต่างด้าวที่ยังไม่ออก</span><b id="previewMode">TEMPLATE PREVIEW</b></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0176 | `          <div class="formula-bar"><span>A1</span><i>fx</i><div id="formulaText">สถานะไม่ ISSUE.</div></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0177 | `          <div class="sheet-stage" id="sheetStage"></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0178 | `          <div class="sheet-tabs" id="sheetTabs">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0179 | `            <button data-sheet="Data">Data</button><button data-sheet="ข้อมูลไม่สมบูรณ์">ข้อมูลไม่สมบูรณ์</button><button data-sheet="Black List">Black List<...` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0180 | `          </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0181 | `        </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0182 | `      </article>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0183 | `        <article class="panel table-panel detail-preview-panel">` | สร้างกล่องเนื้อหา/card ภายในหน้า ใช้จัดกลุ่มข้อมูลให้เป็นระเบียบ |
| L0184 | `          <div class="detail-preview-head">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0185 | `            <div><span class="eyebrow">DETAIL CONTROL</span><h3>Pending Detail Preview</h3><p>ค้นหา กรอง และคลิกแต่ละแถวเพื่อดูรายละเอียดได้ทันที</p></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0186 | `            <div class="detail-actions"><button class="btn ghost" id="clearTableFiltersBtn" type="button">ล้างตัวกรอง</button></div>` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0187 | `          </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0188 | `          <div class="detail-stat-grid" id="resultDetailStats">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0189 | `            <div><span>ทั้งหมด</span><strong>0</strong><small>รายการ</small></div><div class="warning"><span>ข้อมูลไม่สมบูรณ์</span><strong>0</strong><small>...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0190 | `          </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0191 | `          <div class="detail-toolbar">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0192 | `            <label class="detail-search"><span>⌕</span><input id="tableSearch" class="search" placeholder="ค้นหา alienCode, ProposalID, Policy, Status..."></...` | สร้างช่องกรอกข้อมูลหรือเลือกไฟล์ ผู้ใช้จะใส่ค่าผ่าน element นี้ |
| L0193 | `            <select id="tableStatusFilter" aria-label="กรองตามสถานะ"><option value="">ทุกสถานะ</option></select>` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0194 | `            <select id="tableAgingFilter" aria-label="กรองตาม Aging"><option value="">ทุกช่วง Aging</option><option value="1-7">1 - 7 วัน</option><option val...` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0195 | `            <span class="detail-count" id="visibleResultCount">แสดง 0 รายการ</span>` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0196 | `          </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0197 | `          <div class="alien-duplicate-alert hidden" id="alienDuplicateAlert" role="alert" aria-live="polite"></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0198 | `          <div class="detail-layout">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0199 | `            <div class="table-wrap detail-table-wrap"><table class="detail-table"><thead><tr><th>ProposalID</th><th>Policy</th><th>alienCode</th><th>CreateDa...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0200 | `            <aside class="detail-drawer" id="resultDetailDrawer">` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0201 | `              <div class="detail-drawer-empty"><span>▤</span><strong>เลือกรายการเพื่อดูรายละเอียด</strong><small>คลิกแถวข้อมูลทางซ้าย ระบบจะแสดงรายละเอียดข้อ...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0202 | `            </aside>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0203 | `          </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0204 | `        </article>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0205 | `      </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0206 | `    </section>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0207 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0208 | `    <section class="page" id="page-report">` | แบ่งหน้าจอเป็น section หลัก เช่น prepare, dashboard, results, report, history หรือ settings |
| L0209 | `      <div class="page-heading report-page-heading"><div><span class="eyebrow">MANAGEMENT VIEW</span><h2>Executive Report Viewer</h2><p>รายงานสรุปสำหรับนำเสน...` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0210 | `      <article class="panel empty-state" id="reportEmpty"><span>▧</span><h3>ยังไม่มีรายงาน</h3><p>รัน Workflow ให้สำเร็จก่อน หรือเปิดจาก Run History</p></art...` | สร้างกล่องเนื้อหา/card ภายในหน้า ใช้จัดกลุ่มข้อมูลให้เป็นระเบียบ |
| L0211 | `      <article class="report-sheet hidden" id="reportSheet">` | สร้างกล่องเนื้อหา/card ภายในหน้า ใช้จัดกลุ่มข้อมูลให้เป็นระเบียบ |
| L0212 | `        <header class="management-report-header">` | เริ่มส่วน head สำหรับ metadata, title, icon และไฟล์ CSS |
| L0213 | `          <div class="management-brand"><span>BW</span><div><strong>BLACKWOLF</strong><small>WORKFLOW CENTER</small></div></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0214 | `          <div class="management-title"><span>EXECUTIVE DAILY REPORT</span><h1>รายงานสรุปผลการตรวจสอบกรมธรรม์แรงงานต่างด้าว</h1><p>Foreign Worker Policy Revi...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0215 | `          <div class="management-meta"><div><span>วันที่ประมวลผล</span><strong id="reportProcessed">-</strong></div><div><span>รอบข้อมูล</span><strong id="re...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0216 | `        </header>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0217 | `        <section class="management-kpi-strip">` | แบ่งหน้าจอเป็น section หลัก เช่น prepare, dashboard, results, report, history หรือ settings |
| L0218 | `          <article class="mg-kpi mg-total"><span class="mg-icon">✓</span><div><small>กรมธรรม์คงเหลือทั้งหมด</small><strong id="reportPolicies">0</strong><em>...` | สร้างกล่องเนื้อหา/card ภายในหน้า ใช้จัดกลุ่มข้อมูลให้เป็นระเบียบ |
| L0219 | `        </section>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0220 | `        <section class="management-overview-grid">` | แบ่งหน้าจอเป็น section หลัก เช่น prepare, dashboard, results, report, history หรือ settings |
| L0221 | `          <article class="management-summary-card"><header><small>EXECUTIVE SUMMARY</small><h2>สรุปภาพรวม</h2></header><div class="management-summary-body"><...` | สร้างกล่องเนื้อหา/card ภายในหน้า ใช้จัดกลุ่มข้อมูลให้เป็นระเบียบ |
| L0222 | `          <article class="management-aging-card"><header><small>AGING DISTRIBUTION</small><h2>จำนวนวันที่ยังไม่ออกกรมธรรม์</h2></header><div class="aging-lis...` | สร้างกล่องเนื้อหา/card ภายในหน้า ใช้จัดกลุ่มข้อมูลให้เป็นระเบียบ |
| L0223 | `        </section>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0224 | `        <section class="management-status-section"><div class="management-section-title"><div><span>STATUS OVERVIEW</span><h2>สถานะงานคงเหลือ</h2></div><p id...` | แบ่งหน้าจอเป็น section หลัก เช่น prepare, dashboard, results, report, history หรือ settings |
| L0225 | `        <section class="management-reconciliation-section"><div class="management-section-title"><div><span>WORKFLOW RECONCILIATION</span><h2>ผลการประมวลผลรอ...` | แบ่งหน้าจอเป็น section หลัก เช่น prepare, dashboard, results, report, history หรือ settings |
| L0226 | `        <footer class="management-report-footer"><div><strong>BLACKWOLF Workflow Platform</strong><span>รายงานสร้างภายในเครื่อง · สำหรับใช้ภายในองค์กร</span>...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0227 | `      </article>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0228 | `    </section>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0229 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0230 | `    <section class="page" id="page-history">` | แบ่งหน้าจอเป็น section หลัก เช่น prepare, dashboard, results, report, history หรือ settings |
| L0231 | `      <div class="page-heading"><div><span class="eyebrow">LOCAL ARCHIVE</span><h2>Run History</h2><p>ประวัติการประมวลผลและไฟล์ผลลัพธ์ที่เก็บภายใน Browser เค...` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0232 | `      <div class="history-retention-note"><div class="history-retention-main"><span class="history-retention-icon">◷</span><div><strong>จัดเก็บไฟล์ 4 วัน</st...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0233 | `      <article class="panel history-panel"><div class="history-list" id="historyList"><div class="empty-row">ยังไม่มีประวัติ</div></div></article>` | สร้างกล่องเนื้อหา/card ภายในหน้า ใช้จัดกลุ่มข้อมูลให้เป็นระเบียบ |
| L0234 | `    </section>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0235 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0236 | `    <section class="page" id="page-settings">` | แบ่งหน้าจอเป็น section หลัก เช่น prepare, dashboard, results, report, history หรือ settings |
| L0237 | `      <div class="settings-hero"><div><span class="eyebrow">CONTROL CENTER</span><h2>Settings & System Information</h2><p>ตั้งค่าการแสดงผล การช่วยเหลือ การจั...` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0238 | `      <div class="settings-grid">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0239 | `        <section class="settings-section"><div class="settings-section-heading"><span>01</span><div><h3>การแสดงผล</h3><p>ปรับภาษาและธีมให้เหมาะกับการใช้งาน</...` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0240 | `        <section class="settings-section">` | แบ่งหน้าจอเป็น section หลัก เช่น prepare, dashboard, results, report, history หรือ settings |
| L0241 | `          <div class="settings-section-heading"><span>02</span><div><h3>ช่วยเหลือและคู่มือ</h3><p>ติดต่อทีมงาน เปิดภาพแนะนำ และดาวน์โหลดคู่มือใช้งาน</p></div...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0242 | `          <div class="settings-columns settings-columns-three">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0243 | `            <article class="panel settings-card support-card line-support-card">` | สร้างกล่องเนื้อหา/card ภายในหน้า ใช้จัดกลุ่มข้อมูลให้เป็นระเบียบ |
| L0244 | `              <div class="settings-card-head"><span class="settings-icon line-icon">LINE</span><div><h3>แจ้งปัญหาผ่าน LINE</h3><p>เปิดกลุ่ม LINE สำหรับแจ้งปั...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0245 | `              <a class="btn success wide link-button" href="https://line.me/ti/g/5yfX4kpasW" target="_blank" rel="noopener noreferrer">เปิดกลุ่ม LINE</a>` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0246 | `            </article>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0247 | `            <article class="panel settings-card support-card">` | สร้างกล่องเนื้อหา/card ภายในหน้า ใช้จัดกลุ่มข้อมูลให้เป็นระเบียบ |
| L0248 | `              <div class="settings-card-head"><span class="settings-icon">?</span><div><h3>วิธีใช้งานแบบภาพ</h3><p>เปิดภาพแนะนำขั้นตอนตรวจสอบและดาวน์โหลดรายง...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0249 | `              <button class="btn ghost wide" id="settingsGuideBtn" type="button">เปิดวิธีใช้งาน</button>` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0250 | `            </article>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0251 | `            <article class="panel settings-card support-card">` | สร้างกล่องเนื้อหา/card ภายในหน้า ใช้จัดกลุ่มข้อมูลให้เป็นระเบียบ |
| L0252 | `              <div class="settings-card-head"><span class="settings-icon pdf-icon">PDF</span><div><h3>ดาวน์โหลดคู่มือ PDF</h3><p>คู่มือการทำงาน BLACKWOLF สำห...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0253 | `              <a class="btn primary wide link-button" href="assets/BLACKWOLF_User_Manual_V3.5.4.pdf" download>ดาวน์โหลดคู่มือ</a>` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0254 | `            </article>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0255 | `          </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0256 | `        </section>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0257 | `        <section class="settings-section"><div class="settings-section-heading"><span>03</span><div><h3>พื้นที่จัดเก็บผลลัพธ์</h3><p>ข้อมูล Run จัดเก็บใน Bro...` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0258 | `        <section class="settings-section"><div class="settings-section-heading"><span>04</span><div><h3>สถานะและข้อมูลระบบ</h3><p>ตรวจสอบองค์ประกอบสำคัญก่อนเ...` | แบ่งหน้าจอเป็น section หลัก เช่น prepare, dashboard, results, report, history หรือ settings |
| L0259 | `        <section class="settings-section"><div class="settings-section-heading"><span>05</span><div><h3>ความปลอดภัยและการรีเซ็ต</h3><p>ล้างประวัติและการตั้งค...` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0260 | `      </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0261 | `    </section>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0262 | `  </main>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0263 | `</div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0264 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0265 | `<!-- STEP 7: guideModal คือ popup คู่มือรูปภาพสำหรับผู้ใช้ -->` | คอมเมนต์ HTML เดิม ใช้อธิบายส่วนของหน้าเว็บ ไม่แสดงบนหน้าจอ |
| L0266 | `<div class="image-modal hidden" id="guideModal" role="dialog" aria-modal="true" aria-label="คู่มือขั้นตอนใช้งาน">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0267 | `  <button type="button" class="image-modal-close" id="guideClose" aria-label="ปิดคู่มือ">×</button>` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0268 | `  <div class="image-modal-content quick-guide-modal quick-guide-example-one">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0269 | `    <div class="quick-guide-sheet">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0270 | `      <div class="quick-guide-header">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0271 | `        <div class="quick-guide-brand">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0272 | `          <span class="quick-guide-brand-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5...` | แสดงรูปภาพหรือไอคอนประกอบ UI |
| L0273 | `          <div><h2>BLACKWOLF V3.5.8</h2><p>Quick Guide - Master + เช็คสถานะ ISSUE พร้อมไว้ข้ามวัน</p></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0274 | `        </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0275 | `        <span class="quick-guide-badge">LOCAL PROCESSING</span>` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0276 | `      </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0277 | `      <div class="quick-guide-grid">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0278 | `        <section class="quick-guide-card">` | แบ่งหน้าจอเป็น section หลัก เช่น prepare, dashboard, results, report, history หรือ settings |
| L0279 | `          <div class="quick-guide-card-top"><span class="quick-guide-number">1</span><h3>แนบไฟล์หลัก 4 ไฟล์</h3></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0280 | `          <div class="quick-guide-card-body"><span class="quick-guide-card-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.5A2.5 2.5 0 0 1 5....` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0281 | `        </section>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0282 | `        <section class="quick-guide-card">` | แบ่งหน้าจอเป็น section หลัก เช่น prepare, dashboard, results, report, history หรือ settings |
| L0283 | `          <div class="quick-guide-card-top"><span class="quick-guide-number">2</span><h3>ระบบจำแนกจากโครงสร้าง</h3></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0284 | `          <div class="quick-guide-card-body"><span class="quick-guide-card-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Zm...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0285 | `        </section>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0286 | `        <section class="quick-guide-card">` | แบ่งหน้าจอเป็น section หลัก เช่น prepare, dashboard, results, report, history หรือ settings |
| L0287 | `          <div class="quick-guide-card-top"><span class="quick-guide-number">3</span><h3>ตรวจ Date คอลัมน์ T</h3></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0288 | `          <div class="quick-guide-card-body"><span class="quick-guide-card-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h2v3h6V2h2v3h1a3 3 ...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0289 | `        </section>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0290 | `        <section class="quick-guide-card">` | แบ่งหน้าจอเป็น section หลัก เช่น prepare, dashboard, results, report, history หรือ settings |
| L0291 | `          <div class="quick-guide-card-top"><span class="quick-guide-number">4</span><h3>สร้าง Check และ ETL ใหม่</h3></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0292 | `          <div class="quick-guide-card-body"><span class="quick-guide-card-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 2h6a2 2 0 0 1 2 2h1a...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0293 | `        </section>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0294 | `        <section class="quick-guide-card">` | แบ่งหน้าจอเป็น section หลัก เช่น prepare, dashboard, results, report, history หรือ settings |
| L0295 | `          <div class="quick-guide-card-top"><span class="quick-guide-number">5</span><h3>Carry Forward รายการค้าง</h3></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0296 | `          <div class="quick-guide-card-body"><span class="quick-guide-card-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.9-4...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0297 | `        </section>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0298 | `        <section class="quick-guide-card">` | แบ่งหน้าจอเป็น section หลัก เช่น prepare, dashboard, results, report, history หรือ settings |
| L0299 | `          <div class="quick-guide-card-top"><span class="quick-guide-number">6</span><h3>ดาวน์โหลดไฟล์หลัก 2 ไฟล์</h3></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0300 | `          <div class="quick-guide-card-body"><span class="quick-guide-card-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 3h2v10.2l3.6-3.6L18...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0301 | `        </section>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0302 | `      </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0303 | `      <div class="quick-guide-footer">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0304 | `        <span class="quick-guide-footer-note"><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm-1 8v7h2v-7h-2...` | แสดงรูปภาพหรือไอคอนประกอบ UI |
| L0305 | `        <strong>ดาวน์โหลด Master + ISSUE หลัง Run ทุกครั้ง</strong>` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0306 | `      </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0307 | `    </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0308 | `  </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0309 | `</div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0310 | `<!-- STEP 8: previewDrillModal ใช้ดูข้อมูลด้านใน block PV/PV Final/Report -->` | คอมเมนต์ HTML เดิม ใช้อธิบายส่วนของหน้าเว็บ ไม่แสดงบนหน้าจอ |
| L0311 | `<div class="preview-drill-modal hidden" id="previewDrillModal" role="dialog" aria-modal="true" aria-labelledby="previewDrillTitle">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0312 | `  <div class="preview-drill-dialog">` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0313 | `    <header class="preview-drill-head"><div><span>EXCEL-LIKE DRILL-DOWN</span><h3 id="previewDrillTitle">รายละเอียดข้อมูลภายใน Block</h3><p id="previewDrillC...` | เริ่มส่วน head สำหรับ metadata, title, icon และไฟล์ CSS |
| L0314 | `    <div class="preview-drill-table-wrap"><table class="preview-drill-table"><thead><tr><th>No.</th><th>Date</th><th>ProposalID</th><th>Policy</th><th>Mticod...` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0315 | `    <footer class="preview-drill-foot">ข้อมูลนี้เป็นรายการด้านในของ PV / PV Final / Report ตาม Block ที่เลือก</footer>` | โครงสร้าง HTML สำหรับจัดวาง UI และเป็นจุดให้ CSS/JavaScript ควบคุมการแสดงผล |
| L0316 | `  </div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0317 | `</div>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0318 | `<!-- STEP 9: confirmModal ใช้ยืนยัน action สำคัญ เช่น reset -->` | คอมเมนต์ HTML เดิม ใช้อธิบายส่วนของหน้าเว็บ ไม่แสดงบนหน้าจอ |
| L0319 | `<div class="confirm-modal hidden" id="confirmModal"><div class="confirm-box"><h3 id="confirmTitle">ยืนยัน</h3><p id="confirmText"></p><div><button class="btn...` | สร้างปุ่มให้ผู้ใช้กดเพื่อสั่ง action เช่น login, run, download หรือปิด modal |
| L0320 | `<div class="toast" id="toast"></div>` | สร้าง container สำหรับจัด layout หรือเป็นจุดให้ JavaScript/CSS อ้างอิง |
| L0321 | `<!-- STEP 10: โหลด scripts ตามลำดับ dependency: config → vendor → engine/db → auth → app -->` | คอมเมนต์ HTML เดิม ใช้อธิบายส่วนของหน้าเว็บ ไม่แสดงบนหน้าจอ |
| L0322 | `<script src="config.js?v=3.5.8"></script>` | โหลด JavaScript ตามลำดับ dependency เพื่อให้ config/library/engine พร้อมก่อน app เริ่มทำงาน |
| L0323 | `<script src="vendor/xlsx-js-style.min.js"></script>` | โหลด JavaScript ตามลำดับ dependency เพื่อให้ config/library/engine พร้อมก่อน app เริ่มทำงาน |
| L0324 | `<script src="vendor/jszip.min.js"></script>` | โหลด JavaScript ตามลำดับ dependency เพื่อให้ config/library/engine พร้อมก่อน app เริ่มทำงาน |
| L0325 | `<script src="engine.js?v=3.5.8"></script>` | โหลด JavaScript ตามลำดับ dependency เพื่อให้ config/library/engine พร้อมก่อน app เริ่มทำงาน |
| L0326 | `<script src="db.js?v=3.5.8"></script>` | โหลด JavaScript ตามลำดับ dependency เพื่อให้ config/library/engine พร้อมก่อน app เริ่มทำงาน |
| L0327 | `<script src="vendor/html2canvas.min.js"></script>` | โหลด JavaScript ตามลำดับ dependency เพื่อให้ config/library/engine พร้อมก่อน app เริ่มทำงาน |
| L0328 | `<script src="access-profile.js?v=3.5.8"></script>` | โหลด JavaScript ตามลำดับ dependency เพื่อให้ config/library/engine พร้อมก่อน app เริ่มทำงาน |
| L0329 | `<script src="auth.js?v=3.5.8"></script>` | โหลด JavaScript ตามลำดับ dependency เพื่อให้ config/library/engine พร้อมก่อน app เริ่มทำงาน |
| L0330 | `<script src="app.js?v=3.5.8"></script>` | โหลด JavaScript ตามลำดับ dependency เพื่อให้ config/library/engine พร้อมก่อน app เริ่มทำงาน |
| L0331 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0332 | `(บรรทัดว่าง)` | บรรทัดว่าง ช่วยแบ่งโครงสร้าง HTML ให้อ่านง่าย |
| L0333 | `</body>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
| L0334 | `</html>` | ปิด tag ที่เปิดไว้ก่อนหน้า เพื่อจบ section/container นั้นอย่างถูกต้อง |
