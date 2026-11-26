# ระบบ Dashboard สรุปฐานข้อมูลภาระงาน
**นางสาวศุภวรรณ อารีจิตรานุสรณ์** — ตำแหน่ง สถาปนิก (ผู้ชำนาญการพิเศษ)  
หัวหน้าหน่วยสถาปัตยกรรมและผังแม่บท • กองกายภาพและสิ่งแวดล้อม มหาวิทยาลัยมหิดล

เว็บไซต์ Interactive Dashboard สำหรับติดตามและสรุปผลภาระงานโดยเชื่อมต่อข้อมูลแบบเรียลไทม์ (Live Sync) กับ Google Sheets ครบทั้ง 10 ชีท

---

## โครงสร้างไฟล์ในโปรเจกต์
- `index.html` — หน้าเว็บหลักของ Dashboard
- `styles.css` — รูปแบบการจัดหน้าและรองรับการแสดงผลบนมือถือ/พิมพ์รายงาน
- `sheets-config.js` — การตั้งค่า Spreadsheet ID และรายชื่อชีททั้ง 10 ประเภทงาน
- `data-engine.js` — ระบบดึงข้อมูลสดจาก Google Sheets (JSONP + Cache สำรอง) และตัวคัดกรองข้อมูล
- `charts.js` — กราฟสรุปเชิงโต้ตอบ (แยกตามชีท, สถานะ, รายปี PA, หน่วยงาน)
- `app.js` — ตัวควบคุมการทำงาน ตารางเรียงลำดับ ค้นหา ส่งออก CSV และหน้าต่างรายละเอียด
- `.nojekyll` — ปิดการประมวลผล Jekyll เพื่อให้ GitHub Pages แสดงผล Static Web ได้ทันที
- `profile.jpg` — รูปโปรไฟล์ผู้รับผิดชอบ แสดงผลบนแถบหัวเว็บของ Dashboard อัตโนมัติ

---

## วิธีอัปโหลดขึ้น GitHub และเปิดใช้งาน GitHub Pages

1. **สร้าง Repository ใหม่บน GitHub**
   - ไปที่ [github.com/new](https://github.com/new)
   - ตั้งชื่อ Repository (เช่น `workload-dashboard` หรือ `supawan-workload`)
   - เลือกเป็น **Public** (สำหรับ GitHub Pages ฟรี) แล้วกด **Create repository**

2. **อัปโหลดไฟล์ทั้งหมดขึ้น GitHub**
   - ในหน้า Repository ที่เพิ่งสร้าง กด **uploading an existing file** (หรือเมนู **Add file** > **Upload files**)
   - ลากไฟล์ทั้งหมดในโฟลเดอร์นี้ ได้แก่:
     - `index.html`
     - `styles.css`
     - `sheets-config.js`
     - `data-engine.js`
     - `charts.js`
     - `app.js`
     - `profile.jpg`
     - `README.md`
     - `.nojekyll`
     - `.gitignore`
   - กด **Commit changes**

3. **เปิดใช้งาน GitHub Pages**
   - เข้าไปที่แท็บ **Settings** ของ Repository
   - เลือกเมนูด้านซ้าย **Pages**
   - ในส่วน **Build and deployment > Source** เลือก **Deploy from a branch**
   - ในส่วน **Branch** เลือก `main` และโฟลเดอร์ `/ (root)` แล้วกด **Save**
   - รอประมาณ 1–2 นาที ระบบจะแสดงลิงก์เว็บไซต์ เช่น `https://<username>.github.io/<repo-name>/`

---

## หมายเหตุสำคัญเกี่ยวกับการอัปเดตข้อมูล
- ข้อมูลบนหน้าเว็บจะดึงจาก Google Sheets โดยตรงทุกครั้งที่เปิดหน้าเว็บ หรือกดปุ่ม **"อัปเดตข้อมูล"**
- Google Sheet ต้นทางต้องตั้งค่าแชร์เป็น **"ทุกคนที่มีลิงก์สามารถดูได้ (Anyone with the link - Viewer)"** เพื่อให้หน้าเว็บดึงข้อมูลได้ตลอดเวลา
- หากมีการเพิ่มแท็บชีทใหม่ในอนาคต สามารถกดปุ่ม **"ตั้งค่าชีท"** บนหน้าเว็บเพื่อเพิ่มชื่อชีทและเลข `gid` ได้ทันที
