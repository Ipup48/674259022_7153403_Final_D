# รายงานการส่งโครงงาน: ระบบจัดการกิจกรรม (Event Management System)

### ข้อมูลการส่งงาน
- **ชื่อ-นามสกุล นักศึกษา**: นายวุฒิชัย จันทร์มีชัย
- **ชุดโจทย์ที่ได้รับ**: ชุดโจทย์ที่ 4: กิจกรรม (`events` / `/api/events`)
- **หมวดหมู่ที่รองรับ (หมวดหมู่ D)**: อบรม, สัมมนา, จิตอาสา

---

## 🌐 Production URLs
- **Frontend URL (Vercel)**: `https://event-management-frontend-nine.vercel.app` *(ระบุ URL เมื่อ Deploy บน Vercel เรียบร้อยแล้ว)*
- **Backend API URL (Render)**: `https://event-management-backend-api.onrender.com` *(ระบุ URL เมื่อ Deploy บน Render เรียบร้อยแล้ว)*

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
├── frontend/                     # โค้ดส่วนหน้าบ้าน (React + Vite + Tailwind CSS)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── EventTable.jsx        # ตารางแสดงรายการกิจกรรม พร้อมปุ่มดู, แก้ไข, ลบ
│   │   │   ├── EventFormModal.jsx    # หน้าต่างกรอกข้อมูลกิจกรรม (เพิ่ม/แก้ไข)
│   │   │   ├── EventDetailModal.jsx  # หน้าต่างแสดงรายละเอียดกิจกรรม
│   │   │   └── ConfirmDeleteModal.jsx# หน้าต่างยืนยันการลบกิจกรรม
│   │   ├── pages/
│   │   │   └── EventPage.jsx         # หน้าหลักจัดการ State, Search, Filter และ Modals
│   │   ├── services/
│   │   │   └── eventService.js       # ฟังก์ชันเรียกใช้งาน RESTful API ด้วย Axios
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
└── backend/                      # โค้ดส่วนหลังบ้าน (Node.js + Express + Sequelize + SQLite)
    ├── config/
    │   └── database.js               # การเชื่อมต่อ SQLite ด้วย Sequelize
    ├── controller/
    │   └── eventController.js        # Controller จัดการ CRUD และ Validation
    ├── model/
    │   └── eventModel.js             # Event Model กำหนดโครงสร้าง Schema
    ├── router/
    │   └── eventRouter.js            # Router กำหนดเส้นทาง RESTful Endpoints
    ├── seeders/
    │   └── seed.js                   # สคริปต์ Seeder เติมข้อมูลกิจกรรมเริ่มต้น 12 รายการ
    ├── .env
    ├── .env.example
    ├── .gitignore
    ├── index.js                      # Express App Server Entry Point
    ├── nodemon.json
    └── package.json
```

---

## 🗄️ โครงสร้างฐานข้อมูล (Database Schema)

ตาราง: `events`

| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | INTEGER | Primary Key, Auto Increment | รหัสกิจกรรม |
| `title` | STRING(150) | NOT NULL, 1-150 ตัวอักษร | ชื่อกิจกรรม |
| `organizer` | STRING(100) | NOT NULL, 1-100 ตัวอักษร | ผู้จัดกิจกรรม |
| `category` | STRING(50) | NOT NULL, Enum: `อบรม`, `สัมมนา`, `จิตอาสา` | หมวดหมู่กิจกรรม |
| `eventDate` | DATEONLY | NOT NULL, YYYY-MM-DD | วันที่จัดกิจกรรม |
| `description` | TEXT | NOT NULL, 1-2,000 ตัวอักษร | รายละเอียดกิจกรรม |
| `status` | BOOLEAN | NOT NULL, Default: `true` | สถานะ (`true` = เผยแพร่, `false` = ฉบับร่าง) |
| `createdAt` | DATETIME | Generated automatically | วันที่สร้างข้อมูล |
| `updatedAt` | DATETIME | Generated automatically | วันที่แก้ไขข้อมูลล่าสุด |

---

## 🔌 ตาราง RESTful API Endpoints (`/api/events`)

| Method | Endpoint | Query / Body Parameters | คำอธิบาย | Status Code ที่ตอบกลับ |
|---|---|---|---|---|
| `GET` | `/api/events` | `?title=xxx&category=xxx&status=true/false` | อ่านรายการกิจกรรมทั้งหมด รองรับการค้นหาตามชื่อกิจกรรม (Op.like) และกรองหมวดหมู่ | `200 OK` (ข้อมูล Array หรือ `[]`) |
| `GET` | `/api/events/:id` | Path: `:id` (จำนวนเต็มบวก) | อ่านข้อมูลกิจกรรม 1 รายการตาม ID | `200 OK` หรือ `404 Not Found` / `400 Bad Request` |
| `POST` | `/api/events` | Body: `{ title, organizer, category, eventDate, description, status }` | สร้างกิจกรรมใหม่ (มี Data Validation ห้ามเว้นว่าง) | `201 Created` หรือ `400 Bad Request` |
| `PUT` | `/api/events/:id` | Path: `:id`, Body: ข้อมูลฟิลด์ที่ต้องการแก้ไข | แก้ไขข้อมูลกิจกรรมตามรหัส ID | `200 OK` หรือ `404 Not Found` / `400 Bad Request` |
| `DELETE` | `/api/events/:id` | Path: `:id` (จำนวนเต็มบวก) | ลบข้อมูลกิจกรรมออกจากระบบ | `200 OK` หรือ `404 Not Found` / `400 Bad Request` |

### กฎการตรวจสอบข้อมูล (Validation & Error Handling):
- หากฟิลด์ข้อความมีแต่ช่องว่าง (`.trim() === ''`) หรือส่งข้อมูลไม่ครบ ตอบ Status **400 Bad Request**
- หาก `id` ไม่ใช่จำนวนเต็มบวก ตอบ Status **400 Bad Request**
- หากค้นหา `id` ไม่พบในระบบ ตอบ Status **404 Not Found**
- หากระบบเกิดข้อผิดพลาดภายใน ตอบ Status **500 Internal Server Error**

---

## 🚀 วิธีการติดตั้งและการรันระบบ (Local Development)

### 1. การติดตั้งและรันฝั่ง Backend
```bash
# เข้าสู่โฟลเดอร์ backend
cd backend

# ติดตั้ง Dependencies
npm install

# รัน Seeder เพื่อเตรียมข้อมูลกิจกรรมเริ่มต้น 12 รายการ
npm run seed

# เริ่มรันเซิร์ฟเวอร์ Backend
npm run dev
# หรือ npm start
```
*Backend จะทำงานที่: `http://localhost:5000` (API: `http://localhost:5000/api/events`)*

### 2. การติดตั้งและรันฝั่ง Frontend
```bash
# เปิดหน้าต่าง Terminal ใหม่ แล้วเข้าสู่โฟลเดอร์ frontend
cd frontend

# ติดตั้ง Dependencies
npm install

# ตรวจสอบไฟล์ .env ว่าตั้งค่า VITE_API_URL ชี้ไปยัง backend
# VITE_API_URL=http://localhost:5000/api/events

# เริ่มรัน Frontend
npm run dev
```
*Frontend จะทำงานที่: `http://localhost:3000`*

---

## 🐳 การรันระบบด้วย Docker Compose (One-Command Run)

คุณสามารถสั่งรันทั้งระบบ (Frontend + Backend + SQLite + Seeder อัตโนมัติ) ได้ทันทีด้วยคำสั่งเดียว:

```bash
# รันระบบแบบ Background Daemon
docker compose up -d

# หรือ build ภาพใหม่พร้อมรัน
docker compose up -d --build
```

### การเข้าใช้งานหลังสั่งรัน Docker Compose:
- **Frontend Web UI**: [http://localhost:3000](http://localhost:3000) (ทำงานผ่าน Nginx พร้อม Reverse Proxy ไปยัง API)
- **Backend REST API**: [http://localhost:5000/api/events](http://localhost:5000/api/events)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### คำสั่งเสริมสำหรับจัดการ Docker:
```bash
# ดูสถานะและ Log การทำงานของ Containers
docker compose logs -f

# ดูเฉพาะ Log ของ Backend
docker compose logs -f backend

# หยุดการทำงานของ Containers
docker compose down

# หยุดและล้าง Volume ข้อมูลหากต้องการ reset ฐานข้อมูลใหม่ทั้งหมด
docker compose down -v
```

---

## ☁️ แนวทางการ Deploy สู่ระบบ Production

### Backend บน Render:
1. สร้าง **Web Service** บน Render ชี้มาที่ Root Directory: `backend`
2. กำหนด Build Command: `npm install && npm run seed`
3. กำหนด Start Command: `npm start`
4. ตั้ง Environment Variable: `PORT=5000`, `NODE_ENV=production`

### Frontend บน Vercel:
1. สร้าง **New Project** บน Vercel ชี้ Root Directory ไปที่ `frontend`
2. Framework Preset: **Vite**
3. ตั้ง Environment Variable: `VITE_API_URL=https://<your-render-backend-url>/api/events`
4. ไฟล์ `vercel.json` ได้ถูกกำหนดไว้แล้วเพื่อรองรับ Single Page Application (SPA) Routing

Frontend vercel : https://674259022-7153403-final-d.vercel.app/
Backend render : https://six74259022-7153403-final-d.onrender.com
