import {
  getAppointmentsByDoctor,
  getDemoAppointments
} from "./services/appointmentRecordService.js";

import {
  filterAppointmentsByPatientName
} from "./services/patientServices.js";

import {
  getPrescriptionsByPatientName,
  getDemoPrescriptions
} from "./services/prescriptionServices.js";

let appointments = [];

const searchBar = document.getElementById("searchBar");
const todayBtn = document.getElementById("todayBtn");
const dateFilter = document.getElementById("dateFilter");
const tableBody = document.getElementById("patientTableBody");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeModal = document.getElementById("closeModal");

function formatDateTime(value) {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function getStatusLabel(status) {
  if (status === 0 || status === "0") return "Scheduled";
  if (status === 1 || status === "1") return "Completed";
  if (status === 2 || status === "2") return "Cancelled";
  return "Unknown";
}

function renderAppointments(list) {
  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (!list || list.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="noPatientRecord">No appointments found.</td>
      </tr>
    `;
    return;
  }

  list.forEach((appointment) => {
    const patient = appointment.patient || {};

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${patient.id || appointment.patientId || "N/A"}</td>
      <td>${patient.name || appointment.patientName || "N/A"}</td>
      <td>${patient.phone || appointment.patientPhone || "N/A"}</td>
      <td>${patient.email || appointment.patientEmail || "N/A"}</td>
      <td>${formatDateTime(appointment.appointmentTime || appointment.appointment_time)}</td>
      <td>${getStatusLabel(appointment.status)}</td>
      <td>
        <button class="prescription-btn">View Prescriptions</button>
      </td>
    `;

    const prescriptionBtn = row.querySelector(".prescription-btn");
    prescriptionBtn.addEventListener("click", () => {
      const patientName = patient.name || appointment.patientName || "";
      openPrescriptionModal(patientName);
    });

    tableBody.appendChild(row);
  });
}

function applyFilters() {
  let filtered = [...appointments];

  const searchTerm = searchBar?.value || "";
  filtered = filterAppointmentsByPatientName(filtered, searchTerm);

  const selectedDate = dateFilter?.value;
  if (selectedDate) {
    filtered = filtered.filter((appointment) => {
      const appointmentValue = appointment.appointmentTime || appointment.appointment_time;
      if (!appointmentValue) return false;

      const appointmentDate = new Date(appointmentValue).toISOString().slice(0, 10);
      return appointmentDate === selectedDate;
    });
  }

  renderAppointments(filtered);
}

async function loadAppointments() {
  try {
    const token = localStorage.getItem("token");
    const doctorId = localStorage.getItem("doctorId") || "1";

    appointments = await getAppointmentsByDoctor(doctorId, token);
  } catch (error) {
    console.warn("Backend appointments unavailable. Using demo appointments.", error);
    appointments = getDemoAppointments();
  }

  renderAppointments(appointments);
}

async function openPrescriptionModal(patientName) {
  if (!modal || !modalBody) return;

  let prescriptions = [];

  try {
    const token = localStorage.getItem("token");
    prescriptions = await getPrescriptionsByPatientName(patientName, token);
  } catch (error) {
    console.warn("Backend prescriptions unavailable. Using demo prescriptions.", error);
    prescriptions = getDemoPrescriptions(patientName);
  }

  const prescriptionHtml = prescriptions.length
    ? prescriptions.map((prescription) => `
        <div class="prescription-item">
          <p><strong>Patient:</strong> ${prescription.patientName || patientName}</p>
          <p><strong>Medication:</strong> ${prescription.medication || "N/A"}</p>
          <p><strong>Dosage:</strong> ${prescription.dosage || "N/A"}</p>
          <p><strong>Appointment ID:</strong> ${prescription.appointmentId || "N/A"}</p>
          <p><strong>Notes:</strong> ${prescription.doctorNotes || "No notes"}</p>
        </div>
      `).join("")
    : `<p class="noPatientRecord">No prescriptions found.</p>`;

  modalBody.innerHTML = `
    <h2>Previous Prescriptions</h2>
    <div class="prescription-list">
      ${prescriptionHtml}
    </div>
  `;

  modal.classList.add("active");
}

function showTodaysAppointments() {
  const today = new Date().toISOString().slice(0, 10);
  if (dateFilter) {
    dateFilter.value = today;
  }
  applyFilters();
}

searchBar?.addEventListener("input", applyFilters);
dateFilter?.addEventListener("change", applyFilters);
todayBtn?.addEventListener("click", showTodaysAppointments);

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

  if (!localStorage.getItem("token")) {
    localStorage.setItem("token", "demo-token");
  }

  loadAppointments();
});
