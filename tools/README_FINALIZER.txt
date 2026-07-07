BLACKWOLF V3.5.8 — Excel Pivot Finalizer (เครื่องมือเสริม)
=============================================================

สถานะใน V3.5.8
- Master ที่ดาวน์โหลดจากเว็บต้องเปิดด้วย Excel Desktop ได้โดยตรง โดยไม่ขึ้น Recover/Repair
- ต้องดับเบิลคลิกยอดใน PV และ Report Block ที่มีข้อมูลเพื่อเปิดรายละเอียดได้ทันที
- Finalizer ไม่ใช่ขั้นตอนบังคับสำหรับการเปิดไฟล์หรือ Drill-down
- ใช้ Finalizer เฉพาะเมื่อต้องการให้ Microsoft Excel Refresh/Save Pivot ใหม่และตรวจ Filter ซ้ำ

หน้าที่
- เปิดสำเนา Output ด้วย Microsoft Excel Desktop
- Refresh Pivot Cache และ PivotTable
- เปิด EnableDrilldown
- ตั้ง Filter ตาม SOP เฉพาะ Pivot ที่มีข้อมูลจริง
- ตรวจ PV Final ว่ายังมี Excel Table
- บันทึกเป็นไฟล์ใหม่ *_FINAL.xlsx โดยไม่เขียนทับไฟล์ต้นฉบับ
- เพิ่มผลตรวจใน Sheet _Audit และสร้าง *_FINALIZER_LOG.txt

SOP Report
- PivotTable14 = รอ Issue
- PivotTable5 = ติดปัญหาไม่เข้าในเมนู E
- PivotTable3 = ข้อมูลไม่สมบูรณ์
- PivotTable1 = Blacklist
- Block ที่ไม่มีข้อมูลไม่แสดงบน Report แต่ Pivot จะยังอยู่ใน Hidden Staging เพื่อใช้เป็น Master รอบถัดไป

วิธีใช้
1) Run BLACKWOLF V3.5.8 และดาวน์โหลด Master Output ใหม่
2) ปิดไฟล์ Excel ต้นฉบับก่อน
3) ลากไฟล์ Master .xlsx ไปวางบน FINALIZE_BLACKWOLF_EXCEL.bat
   หรือดับเบิลคลิก BAT แล้วเลือกไฟล์
4) รอข้อความ FINALIZER PASSED
5) เปิดไฟล์ *_FINAL.xlsx
6) ตรวจว่าไม่มี Recover/Repair Warning
7) ดับเบิลคลิกยอดใน PV และทุก Report Block ที่มีข้อมูล

ข้อกำหนด
- Windows + Microsoft Excel Desktop
- PowerShell ที่มากับ Windows
- ใช้ไฟล์ใน Local Drive และ Path สั้น
- ไม่ต้องใช้อินเทอร์เน็ต และไม่ส่งข้อมูลออกจากเครื่อง

ถ้าเกิด Error
- ห้ามใช้ไฟล์ *_FINAL.xlsx ที่ Finalizer แจ้ง FAILED
- เก็บ *_FINALIZER_LOG.txt
- Export Diagnostic Package จากหน้า Settings
- ส่ง Log + Diagnostic ZIP + Screenshot ให้ผู้ดูแล
- ดู ERROR_CODE_REFERENCE.md

คำเตือน
- ห้ามใช้ Output ที่ Excel เคย Recover/Repair แล้วเป็นไฟล์ทดสอบรอบใหม่
- ห้ามปิด Excel/PowerShell ระหว่างทำงาน
- Finalizer ไม่เปลี่ยน Business Logic หรือข้อมูลต้นทางโดยตั้งใจ
