# BLACKWOLF V3.5.8 — Hidden Pivot Staging Isolation

## ขอบเขตการแก้ไข

V3.5.8 แก้เฉพาะแถว Filter/Staging ที่หลุดออกมาใต้ Block สุดท้ายของ Sheet `Report` โดยคงโครง Pivot Native, Pivot Cache, Saved Underlying Data และ Drill-down ของ V3.5.8 ไว้เหมือนเดิมทั้งหมด

## ต้นเหตุ

PivotTable ที่มี Page Filter จะแสดง Page Filter ที่ตำแหน่ง **2 แถวเหนือ** จุดเริ่มต้นของ `<location ref>`. Hidden Pivot เดิมเว้นเพียง 1 แถว ทำให้ Filter ของ Pivot ที่ไม่มีข้อมูลไปตกในแถวที่ยังมองเห็นใต้ Grand Total

## วิธีแก้

- เพิ่ม Hidden Spacer 1 แถวให้ Pivot Staging ทุกตัว
- เริ่ม Hidden Staging ทันทีหลังแถว Report สุดท้าย
- ซ่อนตั้งแต่ Page Filter row จนถึง Grand Total ของ Hidden Pivot
- เพิ่ม Hard Validation `BW-REPORT-HIDDEN-001` ตรวจตำแหน่ง Page Filter และสถานะแถวซ่อนก่อนอนุญาตให้ดาวน์โหลด
- ไม่เปลี่ยน UI/CSS และไม่เปลี่ยน Business Logic ของข้อมูล
- คง `enableDrill=1`, `showDrill=1`, `saveData=1`, `refreshOnLoad=0`

## การติดตั้ง

1. ปิด BLACKWOLF และ Excel ทุกหน้าต่าง
2. แตก ZIP นี้ลงในโฟลเดอร์ใหม่ ห้ามวางทับรุ่นเก่า
3. เปิด `START_LOCAL_WEB.bat`
4. กด `Ctrl + F5` หนึ่งครั้ง
5. Run และดาวน์โหลด Master ใหม่

## ผลที่ต้องได้

- ไม่มีแถว Filter เล็ก ๆ ใต้ Block สุดท้าย
- Report จบที่ Grand Total ของ Block สุดท้าย
- ดับเบิลคลิก Count/Premium เพื่อเปิดรายละเอียดได้เหมือน V3.5.8
- ไม่มี Excel Repair หรือ Unreadable Content
