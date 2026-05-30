
# Smart Clinic Management System

Smart Clinic Management System is a full-stack clinic management application built with Java, Spring Boot, MySQL, MongoDB, Thymeleaf, JavaScript, Docker, and GitHub Actions.

The project supports three main roles:

- **Admin**: manages doctors and doctor availability.
- **Doctor**: views appointments and patient information.
- **Patient**: searches doctors, books appointments, and views appointment records.

---

## Features

- Admin, doctor, and patient login.
- Token-based authentication.
- Doctor listing and search.
- Doctor creation and deletion by admin.
- Patient registration and login.
- Appointment booking and cancellation.
- Doctor appointment dashboard.
- Prescription storage using MongoDB.
- MySQL database with stored procedures.
- Docker support.
- GitHub Actions CI workflows.

---

## Tech Stack

### Backend

- Java 17
- Spring Boot 3.4.4
- Maven
- Spring Web
- Spring Data JPA
- Spring Data MongoDB
- Bean Validation
- Thymeleaf

### Databases

- MySQL
- MongoDB

### Frontend

- HTML
- CSS
- JavaScript
- Thymeleaf templates

### DevOps

- Docker
- GitHub Actions

---

## Project Structure

```text
java-database-capstone/
├── app/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/project/back_end/
│           │   ├── controllers/
│           │   ├── DTO/
│           │   ├── models/
│           │   ├── mvc/
│           │   ├── repo/
│           │   └── services/
│           └── resources/
│               ├── static/
│               ├── templates/
│               ├── application.properties
│               └── application-local-example.properties
├── database-backups/
│   ├── cms_backup.sql
│   └── prescriptions_backup.archive
├── schema-design.md
├── user_stories.md
└── .github/workflows/
exit
