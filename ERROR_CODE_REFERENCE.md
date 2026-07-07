# BLACKWOLF V3.5.8 — Error Code Reference

เอกสารนี้ออกแบบให้ผู้ใช้ที่ไม่เขียนโค้ดสามารถแก้ปัญหาเบื้องต้นได้ โดย **ไม่ต้องเปิดหรือแก้ `engine.js`, `worker.js`, `auth.js` หรือ XML ของ Excel**

## ขั้นตอนมาตรฐานเมื่อพบ Error

1. หยุดใช้ไฟล์ผลลัพธ์ของรอบที่ Error ก่อน
2. ถ่าย Screenshot ให้เห็น Error Code และข้อความทั้งหมด
3. ไปที่ **Settings & System Information → Export Diagnostic Package**
4. เก็บไฟล์ Excel ต้นฉบับของรอบนั้นไว้ครบ
5. ทำตามวิธีแก้เบื้องต้นในตาราง
6. หากยังเกิดซ้ำ ส่ง Screenshot + Diagnostic ZIP + ชื่อ/ขนาดไฟล์ให้ผู้ดูแล

## Worker และการ Run

| Error Code | ความหมาย | ผู้ใช้แก้เบื้องต้นได้อย่างไร |
|---|---|---|
| `BW-WORKER-000` | Worker เกิดข้อผิดพลาดที่ยังไม่ได้จัดหมวด | Restart Worker, เลือกไฟล์ใหม่ และ Export Diagnostic ZIP หากเกิดซ้ำ |
| `BW-WORKER-001` | Worker เปิดไม่ได้หรือหยุดทำงาน | ปิดแท็บและหน้าต่าง Server แล้วเปิด `START_LOCAL_WEB.bat` ใหม่ จากนั้น Preflight ใหม่ |
| `BW-WORKER-002` | Worker ไม่มี Progress/Heartbeat เกินเวลาที่กำหนด | รอให้ระบบ Restart Worker, ลดจำนวนไฟล์ที่เปิดใน Browser, ปิดโปรแกรมที่ใช้ RAM สูง แล้ว Run ใหม่ |
| `BW-WORKER-003` | ผู้ใช้กด Cancel Run | เป็นสถานะปกติหลังยกเลิก กด Preflight ใหม่ก่อน Run |
| `BW-WORKER-004` | Worker ถูก Restart | เป็นสถานะควบคุม ระบบล้างเฉพาะ Cache ในหน่วยความจำ ต้อง Preflight ใหม่ |
| `BW-WORKER-006` | Worker กำลังมีงานอื่น | ห้ามกด Run ซ้ำ รอให้งานเดิมจบ หรือกด Cancel แล้ว Restart |
| `BW-WORKER-007` | ส่งไฟล์/คำสั่งเข้า Worker ไม่สำเร็จ | Restart Worker จากหน้า Settings แล้วเลือกไฟล์ใหม่ |
| `BW-RUN-001` | Workflow ล้มเหลว | ดูข้อความถัดจาก Error Code, Export Diagnostic ZIP และอย่าใช้ Output รอบนี้ |
| `BW-PREFLIGHT-001` | โครงสร้างไฟล์ไม่ผ่าน | ตรวจ Sheet/Header ตามรายการสีแดงแล้วเลือกไฟล์ที่ถูกต้อง |
| `BW-PREFLIGHT` | Preflight มีข้อผิดพลาดที่ยังไม่จำแนก | Restart Worker และ Preflight ใหม่ ถ้ายังซ้ำให้ส่ง Diagnostic ZIP |

## ไฟล์และ Excel

| Error Code | ความหมาย | ผู้ใช้แก้เบื้องต้นได้อย่างไร |
|---|---|---|
| `BW-FILE-001` | อ่าน Workbook ไม่ได้ | ปิดไฟล์ Excel ที่เปิดค้าง, ตรวจว่าเป็น `.xlsx`, ลอง Save As ใหม่ แล้วเลือกใหม่ |
| `BW-FILE-002` | โครงสร้างไฟล์ไม่ตรงประเภท | อย่าเปลี่ยนชื่อเพื่อหลอกระบบ ให้ใช้ไฟล์ที่มี Sheet/Header ตรงจริง |
| `BW-FILE-READ` | Browser อ่านไฟล์ไม่ได้ | Copy ไฟล์ไป Path สั้น เช่น `C:\BLACKWOLF\INPUT`, หลีกเลี่ยงชื่อยาวและไฟล์บน Network Drive |
| `BW-PIVOT-001` | Pivot Package ไม่ครบหรือสัมพันธ์กันไม่ถูกต้อง | ห้ามใช้ Output; ใช้ Clean Template ที่มากับระบบและ Run ใหม่ ถ้ายังซ้ำส่ง Diagnostic ZIP |
| `BW-PIVOT-CACHE-001` | ค่าใน Report Pivot Cache หา Shared Item Index ไม่พบ | ห้ามใช้ Output; Export Diagnostic ZIP และ Run ใหม่ด้วย Clean Template |
| `BW-PIVOT-CACHE-002` | Report Pivot Cache ไม่มีส่วน `cacheFields` | ห้ามใช้ Output; Clean Template เสียหรือไม่ตรงรุ่น |
| `BW-PIVOT-CACHE-003` | Pivot Cache ไม่ได้ผูก Pivot Cache Records เพียง 1 ชุด | ห้ามใช้ Output; ใช้ Clean Template ที่มากับระบบ |
| `BW-PIVOT-CACHE-004` | ระบบสร้าง Report Pivot Cache Records ไม่สำเร็จ | ห้ามใช้ Output; เก็บ Diagnostic ZIP และแจ้งผู้ดูแล |
| `BW-PIVOT-CACHE-005` | พบค่า `สถานะไม่ issue` นอก 4 สถานะที่ SOP อนุญาต | ตรวจค่าใน PV Final/Data ว่าตรงตัว: รอ Issue, ติดปัญหาไม่เข้าในเมนู E, ข้อมูลไม่สมบูรณ์, Blacklist แล้ว Run ใหม่ |
| `BW-PIVOT-CACHE-006` | พบค่าช่วงวันนอก SOP เช่นข้อความช่วงวันที่สะกดไม่ตรง | ตรวจให้เหลือ 1 - 7 วัน, 8 - 15 วัน, 16 - 30 วัน, มากกว่า 30 วัน แล้ว Run ใหม่ |
| `BW-PIVOT-TABLE-001` | PivotTable ต้องอ้างค่า Shared Item แต่ไม่พบ Index นั้นใน Pivot Cache | ระบบหยุดก่อนดาวน์โหลด; ใช้แพ็กเกจ V3.5.8 ทั้งชุดและ Export Diagnostic ZIP หากเกิดซ้ำ |
| `BW-PIVOT-TABLE-002` | ไม่พบ PivotTable2 สำหรับ Block จำนวนวันที่ยังไม่ออกกรมธรรม์ | Clean Template ไม่ครบหรือถูกแก้ ให้แตก ZIP ใหม่ทั้งชุดแล้ว Run ใหม่ |
| `BW-PIVOT-SEMANTIC-001` | Cache Fields, Cache Records และ PivotTable Items ไม่ตรงกันภายใน | เป็น Hard Stop ก่อนดาวน์โหลด ห้ามใช้ Output ของรอบนั้น; เปิด V3.5.8 จากโฟลเดอร์ใหม่ กด `Ctrl + F5` แล้ว Run ใหม่ |
| `BW-REPORT-IMAGE` | บันทึกภาพรายงานไม่สำเร็จ | Reload หน้าเว็บแล้วลองใหม่ หรือใช้ Print/PDF แทน; ไม่กระทบ Excel Output |
| `BW-REPORT-FILTER-001` | สถานะของ Block ไม่อยู่ใน Filter Metadata | ห้ามใช้ Output; Export Diagnostic ZIP และ Run ใหม่ด้วยไฟล์ต้นฉบับ |
| `BW-REPORT-FILTER-002` | Pivot ของ Block ไม่มี Field `สถานะไม่ issue` | ห้ามใช้ Output; Clean Template หรือ Pivot Structure ผิด |
| `BW-REPORT-FILTER-004` | จำนวน Pivot Filter Metadata ไม่เท่ากับจำนวน Block ที่มีข้อมูล | ห้ามใช้ Output; เก็บ Diagnostic ZIP และแจ้งผู้ดูแล |
| `BW-REPORT-FILTER-005` | ไม่พบ Layout ที่ตรงกับชื่อ/ตำแหน่ง Pivot เดิมของ Report | Clean Template ถูกเปลี่ยนโครงสร้าง ให้ใช้ Template ที่มากับ V3.5.8 แล้ว Run ใหม่ |
| `BW-REPORT-HIDDEN-001` | Page Filter หรือ Hidden Pivot Staging อาจหลุดมาแสดงใต้ Block สุดท้าย | ระบบหยุดก่อนดาวน์โหลด ตรวจว่าใช้แพ็กเกจ V3.5.8 ทั้งชุด กด `Ctrl + F5` และ Run ใหม่จาก Clean Template |

## Excel Pivot Finalizer

| Error Code | ความหมาย | ผู้ใช้แก้เบื้องต้นได้อย่างไร |
|---|---|---|
| `BW-FINALIZER-001` | ไม่พบไฟล์ที่เลือก | ย้ายไฟล์มาไว้ในโฟลเดอร์ local แล้วเลือกใหม่ |
| `BW-FINALIZER-002` | ไม่ใช่ไฟล์ `.xlsx` | เลือก Master Output `.xlsx` เท่านั้น |
| `BW-FINALIZER-003` | ไม่พบ Microsoft Excel Desktop | ติดตั้ง/ใช้เครื่องที่มี Excel Desktop; Finalizer ไม่รองรับ Excel Online |
| `BW-FINALIZER-004` | Refresh นานเกิน Timeout | ปิดไฟล์อื่น, เปิดเครื่องใหม่, ใช้ไฟล์ local แล้วลองใหม่; อย่าใช้ไฟล์ FINAL ที่ล้มเหลว |
| `BW-FINALIZER-005` | ขาด Sheet Data/PV/PV Final/Report | Output ไม่สมบูรณ์ ให้กลับไป Run ใหม่และส่ง Diagnostic ZIP |
| `BW-FINALIZER-006` | Refresh Pivot Cache ไม่สำเร็จ | ปิด Excel ทั้งหมด, Run Finalizer ใหม่; หากยังซ้ำอาจเป็น Pivot Package เสีย |
| `BW-FINALIZER-007` | PV หรือ Report ไม่มี PivotTable | ห้ามนำเสนอไฟล์นี้ ให้ Run ใหม่ด้วย V3.5.8 และส่ง Log |
| `BW-FINALIZER-008` | PivotTable บางตัว Refresh ไม่ผ่าน | ห้ามใช้ไฟล์ FINAL; เก็บ Finalizer Log และ Diagnostic ZIP |
| `BW-FINALIZER-009` | PV Final ไม่มี Excel Table | ห้ามใช้ Output; Template หรือ Table Relationship ผิด |
| `BW-FINALIZER-010` | Save แล้วเปิดตรวจซ้ำไม่ผ่าน | ไฟล์อาจเสีย/ถูกล็อก ให้ใช้ Output ต้นฉบับ Run Finalizer ใหม่ใน Path local |
| `BW-FINALIZER-011` | Filter สถานะของ Report ไม่ตรงกับ Block หรือไม่พบสถานะใน Pivot Cache | ห้ามใช้ไฟล์ FINAL; ตรวจว่า PV Final มีค่า `รอ Issue`, `ติดปัญหาไม่เข้าในเมนู E`, `ข้อมูลไม่สมบูรณ์`, `Blacklist` ตรงตัว แล้ว Run Finalizer ใหม่ |

## Launcher

| Error Code | ความหมาย | ผู้ใช้แก้เบื้องต้นได้อย่างไร |
|---|---|---|
| `BW-LAUNCH-001` | Port 8765–8775 ถูกใช้หมด | ปิดหน้าต่าง BLACKWOLF Server เก่า หรือ Restart เครื่อง |
| `BW-LAUNCH-002` | ไม่พบ Python 3 | ติดตั้ง Python 3 หรือใช้งานผ่านช่องทางเว็บที่ผู้ดูแลเตรียมไว้ |
| `BW-LAUNCH-003` | Local Server เปิดไม่สำเร็จ | ดูข้อความในหน้าต่าง Server, ตรวจ Antivirus/สิทธิ์โฟลเดอร์ แล้วเปิด BAT ใหม่ |

## Login / Access Profile

Login แบบ V3.5.8 ไม่เก็บ Password จริงใน Source Code แต่ผู้ใช้ที่มีสิทธิ์แก้ไฟล์ JavaScript ยังสามารถแก้ตัวโปรแกรมฝั่ง Browser ได้ จึงเป็น **Local Access Gate** ไม่ใช่ระบบ Security ระดับ Server/SSO

เมื่อจำรหัสไม่ได้ ผู้สร้างต้องใช้ `CREATOR_ACCESS_PROFILE_BUILDER.html` สร้าง `access-profile.js` ใหม่ แล้วแทนไฟล์เดิมทั้งไฟล์ ห้ามแก้ Hash ด้วยมือ

## สิ่งที่ผู้ใช้ทั่วไปห้ามแก้

- `engine.js`
- `worker.js`
- `auth.js`
- `access-profile.js` ด้วยมือ
- ไฟล์ใน `xl/pivotCache`, `xl/pivotTables` หรือ XML ภายใน XLSX
- สูตรคอลัมน์ P:W
- Header Alias และ Stable Identity Logic

การแก้ส่วนเหล่านี้อาจทำให้ข้อมูลถูกตัด รวมผิดคน หรือ Pivot เปิดได้แต่แสดงรายละเอียดผิดโดยไม่ขึ้น Error
