# BLACKWOLF V3.5.8 — Line-by-Line Commented Code

ไฟล์ชุดนี้สร้างขึ้นเพื่ออ่านโค้ดแบบเริ่มจากศูนย์ โดยใส่คอมเมนต์อธิบายก่อนบรรทัดโค้ดจริง และมีเอกสาร `.md` แยกสำหรับเทียบเลขบรรทัด

## กติกาสำคัญ

- ไฟล์ JavaScript ใช้ `//` ตามที่ขอ
- ไฟล์ HTML ใช้ `<!-- ... -->` เพราะถ้าใช้ `//` หน้าเว็บจะพัง
- ไฟล์ CSS ใช้ `/* ... */` เพราะถ้าใช้ `//` CSS จะผิด syntax
- ไฟล์ PowerShell ใช้ `#` และ Batch ใช้ `REM` เพราะเป็น comment syntax ที่ถูกต้องของภาษานั้น
- โฟลเดอร์ `ORIGINAL_CODE_BACKUP/` เก็บโค้ดต้นฉบับก่อนใส่คอมเมนต์ไว้เทียบ
- โฟลเดอร์ `LINE_BY_LINE_DOCS_TH/` คือคู่มืออธิบายบรรทัดต่อบรรทัด

## ลำดับอ่านแนะนำ

- `config.js` — ไฟล์ตั้งค่ากลาง: version, ชื่อฐานข้อมูล, อายุ history, ชื่อไฟล์ output
- `access-profile.js` — โปรไฟล์ยืนยันตัวตน: เก็บ hash/salt/iterations เท่านั้น ไม่เก็บรหัสผ่านจริง
- `auth.js` — ระบบล็อกอิน: ตรวจ username/password ด้วย hash ผ่าน Web Crypto และปลดล็อกหน้า app
- `db.js` — Local Archive: เก็บ/อ่าน/ลบ Run History ใน IndexedDB ของ Browser
- `index.html` — โครงหน้าเว็บ: auth screen, app shell, pages, modals และลำดับโหลด script
- `app.js` — ตัวควบคุมหน้าเว็บหลัก: ปุ่ม, อัปโหลด, preflight, worker, dashboard, results, report, history, settings
- `engine.js` — หัวใจประมวลผล Excel: อ่านไฟล์, normalize header/date/id, รวม backlog, ตัด issued, สร้าง Master/ISSUE และ patch pivot/XML
- `worker.js` — Background Worker: รับงานหนักจาก app.js ไปประมวลผลนอก UI thread เพื่อลดอาการเว็บค้าง

## รายการไฟล์ที่ใส่คอมเมนต์

| ไฟล์ | Comment style | บรรทัดเดิม | บรรทัดหลังใส่คอมเมนต์ | คู่มือ |
|---|---:|---:|---:|---|
| `config.js` | `//` | 21 | 42 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__config.js.md` |
| `access-profile.js` | `//` | 23 | 46 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__access-profile.js.md` |
| `auth.js` | `//` | 169 | 338 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__auth.js.md` |
| `db.js` | `//` | 77 | 154 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__db.js.md` |
| `index.html` | `<!-- -->` | 334 | 335 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__index.html.md` |
| `app.js` | `//` | 805 | 1610 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__app.js.md` |
| `engine.js` | `//` | 1733 | 3466 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__engine.js.md` |
| `worker.js` | `//` | 91 | 182 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__worker.js.md` |
| `CREATOR_ACCESS_PROFILE_BUILDER.html` | `<!-- -->` | 13 | 14 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__CREATOR_ACCESS_PROFILE_BUILDER.html.md` |
| `FINALIZE_BLACKWOLF_EXCEL.bat` | `REM` | 32 | 64 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__FINALIZE_BLACKWOLF_EXCEL.bat.md` |
| `START_LOCAL_WEB.bat` | `REM` | 56 | 112 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__START_LOCAL_WEB.bat.md` |
| `css/base.css` | `/* */` | 4 | 8 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__css__base.css.md` |
| `css/components.css` | `/* */` | 8 | 16 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__css__components.css.md` |
| `css/cyan-refresh.css` | `/* */` | 114 | 228 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__css__cyan-refresh.css.md` |
| `css/history.css` | `/* */` | 6 | 12 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__css__history.css.md` |
| `css/mti-navy-theme.css` | `/* */` | 468 | 936 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__css__mti-navy-theme.css.md` |
| `css/overlays.css` | `/* */` | 14 | 28 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__css__overlays.css.md` |
| `css/pivot-preview.css` | `/* */` | 11 | 22 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__css__pivot-preview.css.md` |
| `css/print.css` | `/* */` | 4 | 8 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__css__print.css.md` |
| `css/professional.css` | `/* */` | 54 | 108 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__css__professional.css.md` |
| `css/report.css` | `/* */` | 6 | 12 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__css__report.css.md` |
| `css/responsive.css` | `/* */` | 15 | 30 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__css__responsive.css.md` |
| `css/settings.css` | `/* */` | 10 | 20 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__css__settings.css.md` |
| `styles.css` | `/* */` | 33 | 66 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__styles.css.md` |
| `tools/Finalize-BlackwolfExcel.ps1` | `#` | 450 | 900 | `LINE_BY_LINE_DOCS_TH/LINE_BY_LINE__tools__Finalize-BlackwolfExcel.ps1.md` |

## วิธีใช้งานแบบปลอดภัย

1. อ่านจาก `LINE_BY_LINE_INDEX.md` ก่อน
2. เปิดไฟล์ `.js/.html/.css` ที่ใส่คอมเมนต์แล้วเพื่อดูคำอธิบายอยู่ติดกับโค้ด
3. ถ้าจะนำไปใช้งานจริง แนะนำใช้ไฟล์จากโฟลเดอร์นี้ได้ แต่ถ้าต้องการไฟล์ที่สั้นเหมือนเดิม ให้ใช้ `ORIGINAL_CODE_BACKUP/` เทียบกลับ
4. Vendor minified, PDF, Excel template, รูปภาพ และ license ไม่ได้แทรกคอมเมนต์ เพราะไม่ใช่โค้ดที่ควรแก้โดยตรง
