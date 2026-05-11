# 🚀 ERP SEKOLAH - AI EXECUTION PLAN
## Syiar Gemilang (RGI)

---

# 🧠 GLOBAL RULE

## STACK
- Backend: NestJS
- Frontend: Next.js
- Database: MySQL

---

## RULE WAJIB

- Semua ID = UUID
- API prefix = /api/v1
- Gunakan DTO validation
- Gunakan pagination (limit, page)
- Semua perubahan data → audit_logs
- Modular (jangan campur logic)

---

# 🧱 CORE MASTER DATA (WAJIB DULU)

## TABLES

### majors
- id
- code (TKJ, DBS, DG, dll)
- name
- created_at

---

### batches
- id
- name (Angkatan 34)
- year_start
- year_end
- is_active

---

### classes
- id
- name (X TKJ 1)
- grade_level (10,11,12)
- major_id
- batch_id
- homeroom_teacher_id

---

### users
- id
- username
- password_hash
- role_id
- student_id (nullable)
- employee_id (nullable)

---

### roles
- id
- name (admin, guru, siswa, dll)

---

---

# 🥇 MODULE 1: STUDENT

## TABLES

### students
- id
- nis
- nik
- full_name
- gender
- birth_place
- birth_date
- address
- phone
- email
- status (active, alumni, moved)

- class_id
- major_id
- batch_id

- qr_code
- created_at

---

### parents
- id
- student_id
- father_name
- mother_name
- phone
- address

---

### student_histories
- id
- student_id
- type (masuk, pindah, keluar)
- description
- date

---

## API

POST   /students  
GET    /students  
GET    /students/:id  
PATCH  /students/:id  
DELETE /students/:id  

POST   /students/import  
GET    /students/export  

---

## LOGIC

- Saat create student:
  - major_id & batch_id ikut dari class
- Support filter:
  - by class
  - by major
  - by batch

---

---

# 🥈 MODULE 2: AUTH + ACL

## TABLES

### permissions
- id
- name

---

### role_permissions
- role_id
- permission_id

---

### audit_logs
- id
- user_id
- action
- module
- data
- created_at

---

### user_devices
- id
- user_id
- device_id
- is_active

---

## API

POST /auth/login  
POST /auth/logout  
GET  /auth/me  

POST /roles  
GET  /roles  
PATCH /roles/:id  

---

## FITUR

- JWT Authentication
- RBAC (Roles Guard)
- Audit log semua perubahan
- Device locking (CBT)

---

---

# 🏅 MODULE 3: PPDB (NEW)

## TABLES

### applicants
- id
- full_name
- email
- phone
- gender
- birth_place
- birth_date
- address
- previous_school
- status (pending, verified, accepted, rejected)
- created_at

---

## API

POST   /applicants
GET    /applicants
GET    /applicants/:id
PATCH  /applicants/:id
PATCH  /applicants/:id/verify
DELETE /applicants/:id

---

---

# 🥉 MODULE 4: HRM

## TABLES

### employees
- id
- full_name
- education
- position
- join_date
- status
- major_id (nullable)

---

### employee_documents
- id
- employee_id
- file_url
- type

---

### employee_attendance
- id
- employee_id
- date
- status

---

## API

POST /employees  
GET  /employees  
GET  /employees/:id  

POST /employees/:id/documents  

---

---

# 🏫 MODULE 5: ACADEMIC

## TABLES

### subjects
- id
- name
- major_id (nullable)

---

### schedules
- id
- class_id
- subject_id
- teacher_id
- day
- start_time
- end_time

---

### attendances
- id
- student_id
- schedule_id
- date
- status

---

### teaching_logs
- id
- teacher_id
- class_id
- subject_id
- note
- date

---

### academic_calendar
- id
- title
- date
- type

---

## API

POST /schedules  
GET  /schedules  

POST /attendance  
GET  /attendance/class/:id  

POST /teaching-log  

---

## RULE

- schedule wajib:
  - class_id
  - teacher_id
  - subject_id
- basic anti bentrok (no duplicate time)

---

---

# 🔥 MODULE 6: CBT

## TABLES

### exams
- id
- title
- subject_id
- major_id
- duration
- token
- start_time
- end_time

---

### questions
- id
- exam_id
- type (mcq, essay)
- question_text
- difficulty

---

### question_options
- id
- question_id
- option_text
- is_correct

---

### exam_sessions
- id
- exam_id
- student_id
- start_time
- end_time
- status
- device_id

---

### student_answers
- id
- session_id
- question_id
- answer

---

### exam_logs
- id
- session_id
- type (tab_switch, warning, violation)
- timestamp

---

## API

POST /exams  
GET  /exams  

POST /exams/:id/start  
POST /exams/:id/submit  

GET  /exams/:id/questions  
POST /answers  

---

## PHASE IMPLEMENTATION

### PHASE 1 (WAJIB)
- create exam
- bank soal
- start exam
- submit

---

### PHASE 2
- auto grading MCQ
- token system
- shuffle soal

---

### PHASE 3
- anti cheat
- websocket realtime

---

## RULE

- student hanya boleh akses exam sesuai major

---

---

# 🏆 MODULE 7: GRADING

## TABLES

### grades
- id
- student_id
- subject_id
- type (assignment, uts, uas, cbt)
- score
- weight
- exam_id (nullable)
- batch_id
- major_id
- created_at

---

### grade_components
- id
- name (Tugas, UTS, UAS, CBT)
- weight_percentage

---

### final_grades
- id
- student_id
- subject_id
- final_score
- grade_letter
- is_passed
- description
- semester
- batch_id
- major_id

---

## API

POST /grades  
GET  /grades/student/:id  

POST /grades/finalize  
GET  /grades/final/:student_id  

---

## LOGIC

### CBT Integration
- setelah exam submit → insert ke grades (type = cbt)

---

### Final Score

final_score =
(tugas * weight) +
(uts * weight) +
(uas * weight) +
(cbt * weight)

---

### KKM

- >= 75 → lulus
- < 75 → remedial

---

---

# 💰 MODULE 8: FINANCE (NEW)

## TABLES

### fees
- id
- name
- amount
- type
- description

---

### payments
- id
- student_id
- fee_id
- amount
- method
- status
- date

---

## API

POST /finance/fees
GET  /finance/fees
POST /finance/payments
GET  /finance/payments

---

---

# 📦 MODULE 9: ASSETS (NEW)

## TABLES

### assets
- id
- code
- name
- category
- location
- condition
- status
- created_at

---

## API

POST   /assets
GET    /assets
GET    /assets/:id
PATCH  /assets/:id
DELETE /assets/:id

---

---

# 🚀 SYSTEM FLOW

## CBT FLOW

login  
→ input token  
→ start exam  
→ submit  
→ nilai masuk grades  

---

## GRADING FLOW

cbt → grades  
guru input → grades  
→ hitung final  
→ final_grades  

---

# 🗺️ ROADMAP (PROPOSAL ALIGNMENT)

1. Master Data & User Management (DONE)
2. Modul Siswa & Kepegawaian (DONE)
3. Modul PPDB (BACKEND DONE, FRONTEND DONE)
4. Modul Akademik (DONE)
5. Modul CBT (CORE DONE, NEEDS REFINEMENT)
6. Modul Penilaian (DONE)
7. Modul Keuangan & Inventaris (BACKEND PARTIAL, FRONTEND MOCK)
8. Dashboard & Reporting (PENDING)

---

# ⚠️ FINAL RULE (ANTI BINGUNG)

- Kerjakan per module (jangan loncat)
- Selesaikan basic dulu
- Jangan implement semua fitur sekaligus
- Test per module sebelum lanjut

---

# 💀 TARGET

Jika semua selesai:

- Student system ✔
- Auth multi role ✔
- Academic ✔
- CBT ✔
- Grading ✔
- Finance & Assets ✔

= ERP SEKOLAH CORE SYSTEM 🚀
