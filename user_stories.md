# Smart Clinic Portal - User Stories

## User Story Template

**Title:**  
_As a [user role], I want [feature/goal], so that [reason]._

**Acceptance Criteria:**
1. [Criteria 1]
2. [Criteria 2]
3. [Criteria 3]

**Priority:** [High/Medium/Low]

**Story Points:** [Estimated Effort in Points]

**Notes:**
- [Additional information or edge cases]

---

# Admin User Stories

## 1. Admin Login

**Title:**  
_As an admin, I want to log into the portal with my username and password, so that I can manage the platform securely._

**Acceptance Criteria:**
1. The admin can enter a valid username and password.
2. The system authenticates the admin credentials.
3. The admin is redirected to the admin dashboard after successful login.
4. The system displays an error message if the credentials are invalid.

**Priority:** High

**Story Points:** 3

**Notes:**
- Passwords must be stored securely.
- Invalid login attempts should not reveal sensitive information.

---

## 2. Admin Logout

**Title:**  
_As an admin, I want to log out of the portal, so that I can protect system access when I am finished._

**Acceptance Criteria:**
1. The admin can click a logout button.
2. The system ends the admin session.
3. The admin is redirected to the login page.
4. Protected pages cannot be accessed after logout.

**Priority:** High

**Story Points:** 2

**Notes:**
- Session tokens should be invalidated after logout.

---

## 3. Add Doctor

**Title:**  
_As an admin, I want to add doctors to the portal, so that patients can book appointments with them._

**Acceptance Criteria:**
1. The admin can enter doctor details such as name, specialization, email, and contact information.
2. The system validates the required doctor information.
3. The doctor profile is saved successfully.
4. The new doctor appears in the doctors list.

**Priority:** High

**Story Points:** 5

**Notes:**
- Duplicate doctor emails should not be allowed.

---

## 4. Delete Doctor Profile

**Title:**  
_As an admin, I want to delete a doctor's profile from the portal, so that inactive or unavailable doctors are removed from the system._

**Acceptance Criteria:**
1. The admin can select a doctor from the doctors list.
2. The system asks for confirmation before deleting the profile.
3. The doctor profile is removed from the portal.
4. The deleted doctor no longer appears in search results or booking options.

**Priority:** Medium

**Story Points:** 3

**Notes:**
- The system should handle doctors with existing appointments carefully.

---

## 5. Monthly Appointment Statistics

**Title:**  
_As an admin, I want to run a stored procedure in MySQL CLI to get the number of appointments per month, so that I can track usage statistics._

**Acceptance Criteria:**
1. The stored procedure can be executed from MySQL CLI.
2. The procedure returns the number of appointments grouped by month.
3. The result includes the month and total number of appointments.
4. The admin can use the result to monitor platform usage.

**Priority:** Medium

**Story Points:** 5

**Notes:**
- The stored procedure should return accurate results based on appointment dates.

---

# Patient User Stories

## 6. View Doctors Without Login

**Title:**  
_As a patient, I want to view a list of doctors without logging in, so that I can explore options before registering._

**Acceptance Criteria:**
1. The patient can access the doctors list without logging in.
2. The system displays doctor names and specializations.
3. The patient can view basic doctor information.
4. Booking appointments requires login or registration.

**Priority:** High

**Story Points:** 3

**Notes:**
- Public information should be limited to non-sensitive doctor details.

---

## 7. Patient Sign Up

**Title:**  
_As a patient, I want to sign up using my email and password, so that I can book appointments._

**Acceptance Criteria:**
1. The patient can enter email and password during registration.
2. The system validates the email format.
3. The system prevents duplicate email registrations.
4. The patient account is created successfully.

**Priority:** High

**Story Points:** 5

**Notes:**
- Passwords must be encrypted before storage.

---

## 8. Patient Login

**Title:**  
_As a patient, I want to log into the portal, so that I can manage my bookings._

**Acceptance Criteria:**
1. The patient can enter a registered email and password.
2. The system validates the credentials.
3. The patient is redirected to the patient dashboard after successful login.
4. The system shows an error message for invalid credentials.

**Priority:** High

**Story Points:** 3

**Notes:**
- The system should protect patient account information.

---

## 9. Patient Logout

**Title:**  
_As a patient, I want to log out of the portal, so that I can secure my account._

**Acceptance Criteria:**
1. The patient can click a logout button.
2. The system ends the patient session.
3. The patient is redirected to the login page.
4. The patient cannot access protected booking pages after logout.

**Priority:** High

**Story Points:** 2

**Notes:**
- Logout should work from all authenticated pages.

---

## 10. Book Appointment

**Title:**  
_As a patient, I want to log in and book an hour-long appointment, so that I can consult with a doctor._

**Acceptance Criteria:**
1. The patient can select an available doctor.
2. The patient can choose an available appointment time.
3. The system creates a one-hour appointment.
4. The booked time slot becomes unavailable for other patients.

**Priority:** High

**Story Points:** 5

**Notes:**
- The system should prevent double booking.

---

## 11. View Upcoming Appointments

**Title:**  
_As a patient, I want to view my upcoming appointments, so that I can prepare accordingly._

**Acceptance Criteria:**
1. The patient can access a list of upcoming appointments.
2. The system displays appointment date, time, doctor name, and specialization.
3. Past appointments are not shown in the upcoming appointments list.
4. The list is updated when new appointments are booked.

**Priority:** Medium

**Story Points:** 3

**Notes:**
- Appointments should be sorted by date and time.

---

# Doctor User Stories

## 12. Doctor Login

**Title:**  
_As a doctor, I want to log into the portal, so that I can manage my appointments._

**Acceptance Criteria:**
1. The doctor can enter valid login credentials.
2. The system authenticates the doctor.
3. The doctor is redirected to the doctor dashboard.
4. The system displays an error message for invalid login attempts.

**Priority:** High

**Story Points:** 3

**Notes:**
- Doctors should only access their own appointment information.

---

## 13. Doctor Logout

**Title:**  
_As a doctor, I want to log out of the portal, so that I can protect my data._

**Acceptance Criteria:**
1. The doctor can click a logout button.
2. The system ends the doctor session.
3. The doctor is redirected to the login page.
4. Doctor dashboard pages cannot be accessed after logout.

**Priority:** High

**Story Points:** 2

**Notes:**
- The session should be cleared securely.

---

## 14. View Appointment Calendar

**Title:**  
_As a doctor, I want to view my appointment calendar, so that I can stay organized._

**Acceptance Criteria:**
1. The doctor can access a calendar view.
2. The system displays all scheduled appointments.
3. Each appointment shows the patient name, date, and time.
4. The doctor can identify available and booked time slots.

**Priority:** High

**Story Points:** 5

**Notes:**
- Calendar data should be filtered by the logged-in doctor.

---

## 15. Mark Unavailability

**Title:**  
_As a doctor, I want to mark my unavailability, so that patients can only book available time slots._

**Acceptance Criteria:**
1. The doctor can select unavailable dates or time slots.
2. The system saves the unavailable schedule.
3. Patients cannot book appointments during unavailable times.
4. The doctor can update or remove unavailable time slots.

**Priority:** High

**Story Points:** 5

**Notes:**
- The system should prevent conflicts with existing appointments.

---

## 16. Update Doctor Profile

**Title:**  
_As a doctor, I want to update my profile with specialization and contact information, so that patients have up-to-date information._

**Acceptance Criteria:**
1. The doctor can edit profile fields such as specialization, phone number, and email.
2. The system validates the updated information.
3. The updated profile is saved successfully.
4. Patients can view the updated doctor information.

**Priority:** Medium

**Story Points:** 3

**Notes:**
- Some fields may require admin approval depending on business rules.

---

## 17. View Patient Details for Upcoming Appointments

**Title:**  
_As a doctor, I want to view patient details for upcoming appointments, so that I can be prepared._

**Acceptance Criteria:**
1. The doctor can open an upcoming appointment.
2. The system displays relevant patient information.
3. The doctor can view appointment date, time, and reason for visit if available.
4. The doctor cannot view unrelated patient records.

**Priority:** Medium

**Story Points:** 5

**Notes:**
- Patient information must be protected and only visible to authorized doctors.
