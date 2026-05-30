# Smart Clinic Management System

Smart Clinic Management System is a full-stack clinic management application built with Java, Spring Boot, MySQL, MongoDB, Thymeleaf, JavaScript, Docker, and GitHub Actions.

The system supports three main roles:

- Admin: manages doctors and doctor availability.
- Doctor: views appointments and patient information.
- Patient: searches doctors, books appointments, and views appointment records.

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
- GitHub Actions workflows.

---

## Tech Stack

- Java 17
- Spring Boot 3.4.4
- Maven
- MySQL
- MongoDB
- Thymeleaf
- HTML
- CSS
- JavaScript
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
├── database-backups/
│   ├── cms_backup.sql
│   └── prescriptions_backup.archive
├── schema-design.md
├── user_stories.md
└── .github/workflows/