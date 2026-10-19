FROM node:20-alpine

WORKDIR /app

# คัดลอกไฟล์ package.json เพื่อติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# คัดลอกโค้ดทั้งหมด
COPY . .

# สร้างไฟล์ database.sqlite เปล่าล่วงหน้า (ถ้ายังไม่มี) เพื่อป้องกันปัญหา Permission
RUN touch database.sqlite && chmod 666 database.sqlite

EXPOSE 5000

CMD ["npm", "start"]