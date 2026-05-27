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

function showNoAppointments(message = "No Appointments found for today") {
  if (!tableBody) return;

  tableBody.innerHTML = `
    <tr>
      <td colspan="7" class="noPatientRecord">${message}</td>
    </tr>
  `;
}

async function openPrescriptionModal(name) {
  if (!modal || !modalBody) return;

  let prescriptions = [];

  try {
    prescriptions = await getPrescriptionsByPatientName(name, token);
  } catch (error) {
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

async function loadAppointments() {
  try {
    if (!tableBody) return;

    tableBody.innerHTML = "";

    let appointments = await getAllAppointments(selectedDate, patientName, token);

    if (!appointments || appointments.length === 0) {
      appointments = getDemoAppointments().filter((appointment) => {
        const matchesDate = appointment.appointmentTime.slice(0, 10) === selectedDate;
        const matchesName =
          patientName === "null" ||
          appointment.patient.name.toLowerCase().includes(patientName.toLowerCase());

        return matchesDate && matchesName;
      });
    }

    if (!appointments || appointments.length === 0) {
      showNoAppointments();
      return;
    }

    appointments.forEach((appointment) => {
      const row = createPatientRow(appointment, openPrescriptionModal);
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("loadAppointments error:", error);
    showNoAppointments("Unable to load appointments.");
  }
}

searchBar?.addEventListener("input", () => {
  patientName = searchBar.value.trim() === "" ? "null" : searchBar.value.trim();
  loadAppointments();
});

todayButton?.addEventListener("click", () => {
  selectedDate = new Date().toISOString().slice(0, 10);

  if (datePicker) {
    datePicker.value = selectedDate;
  }

  loadAppointments();
});

datePicker?.addEventListener("change", () => {
  selectedDate = datePicker.value;
  loadAppointments();
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

  if (!localStorage.getItem("token")) {
    localStorage.setItem("token", "demo-doctor-token");
  }

  token = localStorage.getItem("token");

  if (datePicker) {
    datePicker.value = selectedDate;
  }

  if (typeof renderContent === "function") {
    renderContent();
  }

  loadAppointments();
});
