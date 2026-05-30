import { getAllAppointments, getDemoAppointments } from "./services/appointmentRecordService.js";
import { createPatientRow } from "./components/patientRows.js";
import { getPrescriptionsByPatientName, getDemoPrescriptions } from "./services/prescriptionServices.js";

const tableBody = document.getElementById("patientTableBody");
const searchBar = document.getElementById("searchBar");
const todayButton = document.getElementById("todayBtn") || document.getElementById("todayButton");
const datePicker = document.getElementById("dateFilter") || document.getElementById("datePicker");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeModal = document.getElementById("closeModal");

let selectedDate = new Date().toISOString().slice(0, 10);
let patientName = "null";
let token = localStorage.getItem("token");

function showMessage(message) {
  if (!tableBody) return;

  tableBody.innerHTML = `
    <tr>
      <td colspan="7" class="noPatientRecord">${message}</td>
    </tr>
  `;
}

function normalizePatientName(value) {
  const cleaned = (value || "").trim();
  return cleaned === "" ? "null" : cleaned;
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

async function fetchAppointmentsByDate(date, name = "null") {
  const appointments = await getAllAppointments(date, name, token);

  if (appointments && appointments.length > 0) {
    return appointments;
  }

  return [];
}

async function findMostRecentDateWithAppointments() {
  const today = new Date();
  const maxLookBackDays = 730; // Searches up to two years back.

  for (let i = 0; i <= maxLookBackDays; i++) {
    const candidateDate = new Date(today);
    candidateDate.setDate(today.getDate() - i);

    const candidateIsoDate = toIsoDate(candidateDate);
    const appointments = await fetchAppointmentsByDate(candidateIsoDate, patientName);

    if (appointments.length > 0) {
      return {
        date: candidateIsoDate,
        appointments
      };
    }
  }

  return {
    date: null,
    appointments: []
  };
}

function renderAppointments(appointments) {
  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (!appointments || appointments.length === 0) {
    showMessage("No appointments found.");
    return;
  }

  appointments.forEach((appointment) => {
    const row = createPatientRow(appointment, openPrescriptionModal);
    tableBody.appendChild(row);
  });
}

async function openPrescriptionModal(name) {
  if (!modal || !modalBody) return;

  let prescriptions = [];

  try {
    prescriptions = await getPrescriptionsByPatientName(name, token);
  } catch (error) {
    console.error("Prescription service error:", error);
    prescriptions = getDemoPrescriptions(name);
  }

  if (!prescriptions || prescriptions.length === 0) {
    prescriptions = getDemoPrescriptions(name);
  }

  modalBody.innerHTML = `
    <h2>Previous Prescriptions</h2>
    <div class="prescription-list">
      ${prescriptions.map((p) => `
        <div class="prescription-item">
          <p><strong>Patient:</strong> ${p.patientName || name}</p>
          <p><strong>Medication:</strong> ${p.medication || "N/A"}</p>
          <p><strong>Dosage:</strong> ${p.dosage || "N/A"}</p>
          <p><strong>Appointment ID:</strong> ${p.appointmentId || "N/A"}</p>
          <p><strong>Notes:</strong> ${p.doctorNotes || "No notes"}</p>
        </div>
      `).join("")}
    </div>
  `;

  modal.classList.add("active");
}

async function loadAppointments(options = {}) {
  const { autoFindDate = false } = options;

  try {
    if (!tableBody) return;

    token = localStorage.getItem("token");

    if (!token) {
      showMessage("Doctor token is missing. Please log in again.");
      return;
    }

    showMessage("Loading appointments...");

    let appointments = await fetchAppointmentsByDate(selectedDate, patientName);

    if ((!appointments || appointments.length === 0) && autoFindDate) {
      showMessage("No appointments for today. Searching the most recent appointment date...");

      const result = await findMostRecentDateWithAppointments();

      if (result.date) {
        selectedDate = result.date;

        if (datePicker) {
          datePicker.value = selectedDate;
        }

        appointments = result.appointments;
      }
    }

    if (!appointments || appointments.length === 0) {
      showMessage(`No appointments found for ${selectedDate}.`);
      return;
    }

    renderAppointments(appointments);
  } catch (error) {
    console.error("loadAppointments error:", error);
    showMessage("Unable to load appointments.");
  }
}

searchBar?.addEventListener("input", () => {
  patientName = normalizePatientName(searchBar.value);
  loadAppointments({ autoFindDate: false });
});

todayButton?.addEventListener("click", () => {
  selectedDate = new Date().toISOString().slice(0, 10);

  if (datePicker) {
    datePicker.value = selectedDate;
  }

  loadAppointments({ autoFindDate: true });
});

datePicker?.addEventListener("change", () => {
  selectedDate = datePicker.value;
  loadAppointments({ autoFindDate: false });
});

closeModal?.addEventListener("click", () => {
  modal?.classList.remove("active");
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.remove("active");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("userRole", "doctor");

  token = localStorage.getItem("token");

  if (!token) {
    showMessage("Please log in as a doctor to view appointments.");
    return;
  }

  if (datePicker) {
    datePicker.value = selectedDate;
  }

  if (typeof renderContent === "function") {
    renderContent();
  }

  loadAppointments({ autoFindDate: true });
});