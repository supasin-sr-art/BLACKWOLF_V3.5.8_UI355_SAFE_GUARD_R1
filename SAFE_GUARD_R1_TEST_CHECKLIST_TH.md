# BLACKWOLF SAFE GUARD R1 — Test Checklist TH

## เปิดระบบ
- [ ] กด `START_LOCAL_WEB.bat`
- [ ] เห็น Port
- [ ] เห็น Python Version
- [ ] เห็น Startup Time
- [ ] Browser เปิด `http://127.0.0.1:<PORT>`

## Event ซ้ำ
- [ ] กด Upload ซ้ำเร็ว ๆ ระหว่างจำแนกไฟล์ ต้องไม่เริ่มซ้อน
- [ ] กด Preflight ซ้ำเร็ว ๆ ต้องไม่เริ่มซ้อน
- [ ] กด Run ซ้ำเร็ว ๆ ต้องไม่เริ่มซ้อน
- [ ] กด Diagnostic ZIP ซ้ำเร็ว ๆ ต้องไม่สร้างซ้อน

## Progress / Worker
- [ ] Progress เดินระหว่าง load-file / validate / run
- [ ] Worker heartbeat ไม่ทำให้ timeout ระหว่างงานยาว
- [ ] Cancel Run ยังคงหยุด Worker ได้
- [ ] Restart Worker ใช้ได้หลัง Cancel

## Download / Object URL
- [ ] Download Master หลัง Run สำเร็จ
- [ ] Download ISSUE หลัง Run สำเร็จ
- [ ] กด Download รัว ๆ แล้วไม่ error
- [ ] Save Report Image ไม่สร้างซ้อน

## Modal
- [ ] Guide modal เปิดได้
- [ ] Preview Drilldown เปิดได้
- [ ] Guide กับ Preview Drilldown ไม่ซ้อนกัน
- [ ] Confirm modal ไม่ซ้อนกันเมื่อกดลบ History รัว ๆ

## History / IndexedDB
- [ ] Run History แสดง
- [ ] เปิด History เก่าได้
- [ ] ลบ History ได้
- [ ] ถ้าเปิดหลายแท็บแล้ว DB blocked ต้องมี error อ่านง่าย

## Excel Output
- [ ] Master เปิดได้ไม่ Repair
- [ ] ISSUE เปิดได้ไม่ Repair
- [ ] PV / PV Final drill-down ได้
- [ ] Report block ถูก flow
- [ ] ใช้ไฟล์ Master ที่สร้างวันนี้รันต่อวันถัดไปได้
