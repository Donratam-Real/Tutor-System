tutor-booking-system/                  <-- Root Directory (Project Name)
├── .gitignore                         <-- ไฟล์สำหรับ Git เพื่อละเว้นไฟล์ที่ไม่จำเป็น (เช่น /target, *.class)
├── pom.xml                            <-- Maven Build File (กำหนด Dependencies, Plugins)
├── Dockerfile                         <-- ไฟล์สำหรับสร้าง Docker Image
├── README.md                          <-- สรุปภาพรวมและวิธีการรันโปรเจกต์ (เราได้ร่างไว้แล้ว)
├── deploy/
│   └── docker-compose.yml             <-- สำหรับรัน App + Database ใน Dev Environment
│
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── tutos/             <-- Root Java Package
        │           ├── TutoSApplication.java  <-- Main Spring Boot Application Class
        │           ├── user/          <-- 👤 1. User/Profile Module
        │           │   ├── controller/      <-- REST API Endpoints (Auth, Profile)
        │           │   ├── model/           <-- Entities (User, TutorProfile)
        │           │   ├── repository/      <-- Spring Data JPA Interfaces
        │           │   └── service/         <-- Business Logic (Authentication, Profile Management)
        │           │
        │           ├── search/        <-- 🔍 2. Search & Filter Module
        │           │   ├── controller/
        │           │   └── service/         <-- Search Logic, Dynamic Queries
        │           │
        │           ├── booking/       <-- 📅 3. Booking/Calendar Module
        │           │   ├── controller/
        │           │   ├── model/           <-- Entities (Slot, Booking)
        │           │   ├── repository/
        │           │   └── service/         <-- Booking & Transaction Logic
        │           │
        │           ├── review/        <-- ⭐ 4. Review & Rating Module
        │           │   ├── controller/
        │           │   ├── model/           <-- Entities (Review, TutorAggregateRating)
        │           │   ├── repository/
        │           │   └── service/         <-- Review & Rating Calculation Logic
        │           │
        │           └── shared/        <-- Shared components (เช่น JWT Utils, Global Exception Handlers)
        │               ├── config/          <-- Spring Security Configuration
        │               └── exception/       <-- Custom Exceptions
        │
        └── resources/
            ├── application.yml        <-- Global Configuration (DB, Port, JWT Secret)
            ├── data.sql               <-- Initial data script (Optional)
            └── static/                <-- For static frontend files (ถ้าใช้)



ขั้นตอนการพัฒนาโปรเจกต์

✅ ขั้นตอนที่ 1 — สร้าง Spring Boot Project

ในขั้นตอนนี้จะเริ่มต้นสร้างโครงสร้างโปรเจกต์พื้นฐาน
สิ่งที่ทำ:

สร้าง Spring Boot Project (ผ่าน Spring Initializr)

เลือก dependencies เบื้องต้น เช่น
Spring Web, Spring Security, Spring Data JPA, PostgreSQL, Validation, Lombok

ตั้งค่าโครงสร้าง package ตามที่ออกแบบไว้

ตั้งค่าไฟล์ application.yml หรือ application.properties

เป้าหมาย:
ให้โปรเจกต์สามารถรันได้ แม้ยังไม่มีฟีเจอร์

✅ ขั้นตอนที่ 2 — ออกแบบฐานข้อมูล (Database Design)

ในระบบนี้ต้องออกแบบตารางหลัก เช่น:

User

TutorProfile

Availability

Booking

Review

สิ่งที่ทำ:

กำหนด ER-Diagram (ความสัมพันธ์ระหว่างตาราง)

สร้าง JPA Entities

Map ความสัมพันธ์ One-to-Many / Many-to-Many

ทดสอบเชื่อมต่อ PostgreSQL

เป้าหมาย:
ฐานข้อมูลพร้อมใช้งานสำหรับฟีเจอร์ต่อไป

✅ ขั้นตอนที่ 3 — ทำระบบ Authentication (JWT + Spring Security)

สิ่งที่ทำ:

สร้างระบบสมัครสมาชิก / ล็อกอิน

เขียน JWT Token Provider (generate / validate token)

เขียน JWT Filter

ทำ SecurityConfig เพื่อกำหนด access control

ทดสอบ login และรับ token

เป้าหมาย:
ผู้ใช้สามารถ login และได้รับ token สำหรับการเข้าถึงระบบ

✅ ขั้นตอนที่ 4 — ระบบโปรไฟล์ผู้ใช้งาน (Tutor / Student Profile)

ระบบจะแยกประเภทผู้ใช้เป็น 2 ฝั่ง:

นักเรียน (Student)

ติวเตอร์ (Tutor)

สิ่งที่ทำ:

API สำหรับสร้าง/แก้ไขข้อมูลโปรไฟล์

Tutor สามารถระบุ:

วิชาที่สอน

ระดับชั้น

ประสบการณ์

พื้นที่

ราคา

Student ดูโปรไฟล์ของ Tutor ได้

เป้าหมาย:
ผู้ใช้มีตัวตนในระบบ และ Tutor มีข้อมูลพร้อมสำหรับการค้นหา

✅ ขั้นตอนที่ 5 — ระบบค้นหาและฟิลเตอร์ Tutor

เป็นฟีเจอร์สำคัญที่ช่วยให้นักเรียนค้นหาติวเตอร์ตามความต้องการ

สิ่งที่ทำ:

สร้าง API ค้นหาเรียงตามวิชา / ระดับชั้น / ราคา / พื้นที่

เขียน query แบบ Dynamic Filtering

ใช้ JPA Specification หรือ Custom Query

เป้าหมาย:
ค้นหา Tutor ได้ตรงตามเงื่อนไขที่ผู้ใช้ต้องการ

✅ ขั้นตอนที่ 6 — ระบบตารางสอนและการจองคิว

ขั้นตอนนี้เป็นหัวใจของระบบทั้งหมด

สิ่งที่ทำ:

ฝั่ง Tutor:

เพิ่ม “เวลาว่าง” ในตารางสอน (Available Time Slots)

ฝั่ง Student:

จองคิวในช่วงเวลาที่ว่าง

ตรวจสอบเวลาซ้ำซ้อน (Double Booking)

บันทึกข้อมูลการจองลงใน Booking table

เป้าหมาย:
การจองเกิดขึ้นได้จริง และตรวจสอบปัญหาเวลาทับซ้อน

✅ ขั้นตอนที่ 7 — ระบบรีวิวและการให้คะแนน

เพื่อเพิ่มความน่าเชื่อถือของผู้สอน

สิ่งที่ทำ:

นักเรียนสามารถให้คะแนน (1–5)

เขียนรีวิวหลังเรียนเสร็จ

แสดงคะแนนเฉลี่ยในหน้าโปรไฟล์ของ Tutor

เป้าหมาย:
ผู้ใช้ใหม่เห็นความสามารถของ Tutor จากความคิดเห็นของนักเรียนที่ผ่านมา

✅ ขั้นตอนที่ 8 — การทดสอบระบบ

ก่อน deploy ต้องมีการทดสอบเพื่อลดข้อผิดพลาด

สิ่งที่ทำ:

Unit Test สำหรับ Service layer

Integration Test

ทดสอบ API ผ่าน Postman / Thunder Client

ทดสอบในสถานการณ์จริง เช่น
สมัคร → login → หา tutor → จองคิว → รีวิว

เป้าหมาย:
มั่นใจว่าระบบทำงานถูกต้องและพร้อมใช้งานจริง
