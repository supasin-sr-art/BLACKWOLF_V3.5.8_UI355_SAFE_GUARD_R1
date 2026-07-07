# BLACKWOLF V3.5.8 Commented Build Change Log

Generated: 2026-07-06 02:34:03 local sandbox time

## สิ่งที่ทำ
- เพิ่มคอมเมนต์ `//` ในไฟล์ JavaScript หลัก: access-profile.js, config.js, db.js, auth.js, worker.js, app.js, engine.js
- เพิ่มคอมเมนต์แบบถูก syntax ใน HTML/CSS/PowerShell/BAT เพื่อไม่ให้โปรแกรมพัง
- เพิ่มเอกสาร `CODE_EXPLANATION_STEP_BY_STEP_TH.md` อธิบาย flow ทั้งระบบและ function index
- อัปเดต `FILE_MANIFEST_SHA256.txt` หลังแก้ไขไฟล์

## สิ่งที่ไม่แตะ
- `vendor/*.min.js` เพราะเป็น third-party minified library
- `assets/*.xlsx`, `assets/*.pdf`, `assets/*.png` เพราะเป็น binary/template/manual/image
- license/notice files เพราะเป็นข้อความสิทธิ์ของ library

## เหตุผลสำคัญ
`//` ใช้ได้ใน JavaScript แต่ไม่ใช่ comment ที่ถูกต้องของ HTML, CSS, PowerShell หรือ Batch ดังนั้นไฟล์เหล่านั้นใช้ comment syntax ของภาษานั้น ๆ แทน เพื่อรักษา behavior เดิมของระบบ
