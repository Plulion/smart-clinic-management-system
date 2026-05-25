# Smart Clinic Management System - Architecture Design

## Section 1: Architecture Summary

The Smart Clinic Management System is designed as a three-tier Spring Boot web application. The presentation tier includes Thymeleaf-based web dashboards for Admin and Doctor users, as well as REST API consumers for modules such as appointments, patient dashboards, and patient records. This allows the application to support both traditional server-rendered web pages and JSON-based API communication for future frontend or mobile integrations.

The application tier is implemented using Spring Boot. It contains MVC controllers, REST controllers, services, and business logic. Thymeleaf controllers return dynamic HTML views, while REST controllers expose endpoints that return JSON responses. All controllers delegate business operations to the service layer, which centralizes validation rules, workflows, and coordination between different parts of the system.

The data tier uses two databases. MySQL stores structured relational data such as patients, doctors, appointments, and admin records. MongoDB stores flexible document-based data such as prescriptions. The application accesses these databases through repository interfaces. MySQL repositories use Spring Data JPA entities, while MongoDB repositories use document models. This architecture improves maintainability, scalability, and separation of concerns.

## Section 2: Numbered Flow of Data and Control

1. The user accesses the application through either a Thymeleaf web page, such as the Admin Dashboard or Doctor Dashboard, or through a REST API client such as an appointment module, patient dashboard, or patient record module.

2. The request is sent to the appropriate controller based on the URL path and HTTP method. Requests that need server-rendered pages are handled by MVC controllers, while requests that require JSON responses are handled by REST controllers.

3. The controller validates the incoming request and delegates the required operation to the service layer. The controller does not directly access the database because business logic should remain separated from request-handling logic.

4. The service layer applies business rules and coordinates application workflows. For example, before creating an appointment, the service layer may verify patient information, doctor availability, and appointment constraints.

5. After applying business logic, the service layer calls the appropriate repository. MySQL repositories are used for structured data such as Patient, Doctor, Appointment, and Admin entities. MongoDB repositories are used for document-based data such as Prescription records.

6. The repositories communicate with the databases and retrieve or persist data. MySQL data is mapped to JPA entity classes annotated with `@Entity`, while MongoDB data is mapped to document classes annotated with `@Document`.

7. The retrieved data is returned back through the service layer to the controller. In MVC flows, the controller adds the data to the model and returns a Thymeleaf template that is rendered as HTML. In REST flows, the controller serializes the data or DTOs into JSON and sends the response back to the client.