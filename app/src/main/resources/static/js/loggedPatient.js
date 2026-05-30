import { getDoctors, filterDoctors } from "./services/doctorServices.js";
import { createDoctorCard } from "./components/doctorCard.js";
import { bookAppointment } from "./services/appointmentRecordService.js";

const contentDiv = document.getElementById("content");
const searchBar = document.getElementById("searchBar");
const filterTime = document.getElementById("filterTime");
const filterSpecialty = document.getElementById("filterSpecialty");

let allDoctors = [];

function getLoggedPatientFromStorage() {
  return {
    id: localStorage.getItem("patientId") || "1",
    name: localStorage.getItem("patientName") || "Jane Doe",
    email: localStorage.getItem("patientEmail") || "jane.doe@example.com"
  };
}

function renderDoctorCards(doctors) {
  if (!contentDiv) {
    console.error("Content container not found in logged patient dashboard.");
    return;
  }

  contentDiv.innerHTML = "";

  if (!doctors || doctors.length === 0) {
    contentDiv.innerHTML = `<p>No doctors found with the given filters.</p>`;
    return;
  }

  doctors.forEach((doctor) => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}

async function loadDoctorCards() {
  try {
    allDoctors = await getDoctors();
    console.log("Logged patient doctors loaded:", allDoctors);
    renderDoctorCards(allDoctors);
  } catch (error) {
    console.error("Failed to load doctors:", error);
    renderDoctorCards([]);
  }
}

async function filterDoctorsOnChange() {
  const name = searchBar?.value?.trim() || "";
  const time = filterTime?.value || "";
  const specialty = filterSpecialty?.value || "";

  try {
    const doctors = await filterDoctors(name, time, specialty);
    renderDoctorCards(doctors);
  } catch (error) {
    console.error("Failed to filter doctors:", error);
    renderDoctorCards(allDoctors);
  }
}

export function showBookingOverlay(event, doctor, patientFromService) {
  const patient = patientFromService || getLoggedPatientFromStorage();

  if (!patient || !patient.id) {
    alert("Patient information is missing. Please log in again.");
    return;
  }

  if (!doctor || !doctor.id) {
    alert("Doctor information is missing.");
    return;
  }

  const existingModal = document.querySelector(".modalApp");
  const existingRipple = document.querySelector(".ripple-overlay");

  if (existingModal) existingModal.remove();
  if (existingRipple) existingRipple.remove();

  const ripple = document.createElement("div");
  ripple.classList.add("ripple-overlay");
  ripple.style.left = `${event.clientX}px`;
  ripple.style.top = `${event.clientY}px`;
  document.body.appendChild(ripple);

  setTimeout(() => ripple.classList.add("active"), 50);

  const modalApp = document.createElement("div");
  modalApp.classList.add("modalApp");

  const availableTimes = doctor.availableTimes || doctor.available_times || [];

  modalApp.innerHTML = `
    <h2>Book Appointment</h2>

    <input class="input-field" type="text" value="${patient.name || "Patient"}" disabled />
    <input class="input-field" type="text" value="${doctor.name || "Doctor"}" disabled />
    <input class="input-field" type="text" value="${doctor.specialty || doctor.specialization || "Specialty"}" disabled />
    <input class="input-field" type="email" value="${doctor.email || ""}" disabled />

    <input class="input-field" type="date" id="appointment-date" required />

    <select class="input-field" id="appointment-time" required>
      <option value="">Select time</option>
      ${
        availableTimes.length > 0
          ? availableTimes.map((time) => `<option value="${time}">${time}</option>`).join("")
          : `<option value="09:00-10:00">09:00-10:00</option>`
      }
    </select>

    <div style="display: flex; gap: 10px; margin-top: 15px;">
      <button class="confirm-booking">Confirm Booking</button>
      <button class="cancel-booking" type="button">Cancel</button>
    </div>
  `;

  document.body.appendChild(modalApp);

  setTimeout(() => modalApp.classList.add("active"), 300);

  modalApp.querySelector(".cancel-booking")?.addEventListener("click", () => {
    ripple.remove();
    modalApp.remove();
  });

  modalApp.querySelector(".confirm-booking")?.addEventListener("click", async () => {
    const date = modalApp.querySelector("#appointment-date")?.value;
    const time = modalApp.querySelector("#appointment-time")?.value;
    const token = localStorage.getItem("token");

    if (!date || !time) {
      alert("Please select appointment date and time.");
      return;
    }

    if (!token) {
      alert("Patient token is missing. Please log in again.");
      return;
    }

    const startTime = time.split("-")[0];

    const appointment = {
      doctor: { id: Number(doctor.id) },
      patient: { id: Number(patient.id) },
      appointmentTime: `${date}T${startTime}:00`,
      status: 0
    };

    console.log("Booking appointment payload:", appointment);

    const result = await bookAppointment(appointment, token);

    if (result.success) {
      alert("Appointment booked successfully.");
      ripple.remove();
      modalApp.remove();
    } else {
      alert("Failed to book appointment: " + result.message);
    }
  });
}

window.showBookingOverlay = showBookingOverlay;

document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("userRole", "loggedPatient");

  searchBar?.addEventListener("input", filterDoctorsOnChange);
  filterTime?.addEventListener("change", filterDoctorsOnChange);
  filterSpecialty?.addEventListener("change", filterDoctorsOnChange);

  loadDoctorCards();
});