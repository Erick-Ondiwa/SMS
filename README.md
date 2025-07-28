# School Management System

A full-stack **School Management System** built with **React**, **Tailwind CSS**, **.NET Core**, **Entity Framework Core**, and **SQL Server**. The system enables streamlined management of courses, students, teachers, attendance, assignments, and results.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend Setup (.NET Core)](#backend-setup-net-core)
  - [Frontend Setup (React)](#frontend-setup-react)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
<!-- - [License](#license) -->

---

##  Overview

This project provides a role-based school management solution that helps:

- Teachers manage courses, assignments, attendance, and results.
- Students view assignments, attendance, and academic performance.
- Admins oversee student enrollment, course creation, and teacher assignments.

---

##  Features

### Teacher Module
- View and manage assigned courses.
- Record and view student attendance.
- Upload and review assignments.
- Enter and edit student results.

###  Student Module
- View enrolled courses.
- Access and download assignments.
- View attendance per course.
- View results grouped by academic stage (e.g. Y1S1, Y1S2).

###  Admin Module
- Register and manage students and teachers.
- Create courses and assign them to teachers.
- Enroll students into multiple courses at once.
- Monitor overall school performance.

---

##  Tech Stack

| Category        | Technology                   |
|----------------|------------------------------|
| **Frontend**    | React, Tailwind CSS, Axios   |
| **Backend**     | .NET Core Web API            |
| **Database**    | SQL Server, EF Core          |
| **Authentication** | JWT Token Authentication |
| **API Client**  | Axios (React)                |

---

##  Project Structure

SchoolManagementSystem/
├── frontend/             
│   ├── components/           
│   ├── pages/             
│   ├── services/          
│   ├── utils/              
│   └── App.jsx             
├── backend/               
│   ├── Controllers/        
│   ├── Models/               
│   ├── DTOs/             
│   ├── Data/               
│   ├── Migrations/           
│   └── Program.cs           
└── README.md                 


## Getting Started

### Prerequisites
- .NET 7 SDK
- Node.js
- SQL Server
- Visual Studio or VS Code

### Backend Setup (.NET Core)
- cd backend
- dotnet restore
- dotnet build

#### Apply migrations:

- dotnet ef database update
- dotnet run

### Frontend Setup (React + Tailwind CSS)
- cd fronetnd
- npm install
- npm run dev

## Key API Endpoints
- GET	/api/courses	<!-- Fetch all courses -->
- GET	/api/courses/{id}<!--	Get course details -->
- POST	/api/courses	<!--Create new course -->
- GET	/api/teachers/{id}/courses	<!-- Get courses assigned to a teacher -->
- GET	/api/courses/{courseId}/enrollments	<!-- Get enrolled students -->
- GET	/api/results/student/{userId}<!-- 	Get results for a student -->
- GET	/api/attendance/student/{userId}?courseId={id}	<!-- Get student attendance for a course -->

📸 Screenshots

## Contributing
- Fork the repository.
- Create your feature branch: git checkout -b feature/feature-name.
- Commit your changes: git commit -m "Add new feature".
- Push to the branch: git push origin feature/feature-name.
- Open a pull request.

# 👨 Author
## Erick Ondiwa

### erickondiwaz01@gmail.com
