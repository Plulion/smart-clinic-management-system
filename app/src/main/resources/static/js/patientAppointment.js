import { getPatientAppointments } from "./services/patientServices.js";

const tableBody = document.getElementById("patientTableBody");
const searchBar = document.getElementById("searchBar");
const appointmentFilter = document.getElementById("appointmentFilter");

const token = localStorage.getItem("token");
const patientId = Number(localStorage.getItem("patientId") || "1");

let allAppointments = [];

document.addEventListener("DOMContentLoaded", initializePage);

function normalizeAppointment(appointment) {
  const patient = appointment.patient || {};
  const doctor = appointment.doctor || {};

  const rawDateTime =
    appointment.appointmentTime ||
    appointment.dateTime ||
    appointment.date ||
    "";

  let appointmentDate = "N/A";
  let appointmentTimeOnly = "N/A";

  if (rawDateTime) {
    const raw = String(rawDateTime);

    if (raw.includes("T")) {
      appointmentDate = raw.slice(0, 10);
      appointmentTimeOnly = raw.slice(11, 16);
    } else {
      appointmentDate = raw.slice(0, 10);
      appointmentTimeOnly = raw.slice(11, 16) || "N/A";
    }
  }

  return {
    id: appointment.id,
    patientId: appointment.patientId || patient.id,
    patientName: appointment.patientName || patient.name || "You",
    doctorId: appointment.doctorId || doctor.id,
    doctorName: appointment.doctorName || doctor.name || "N/A",
    appointmentDate,
    appointmentTimeOnly,
    status: appointment.status
  };
}

function isCurrentPatientAppointment(appointment) {
  return Number(appointment.patientId) === patientId;
}

async function initializePage() {
  try {
    if (!token) {
      throw new Error("No patient token found. Please log in again.");
    }

    if (!patientId) {
      throw new Error("No patientId found in localStorage.");
    }

    console.log("Loading appointments for patientId:", patientId);

    const appointmentData = await getPatientAppointments(patientId, token);

    console.log("Raw patient appointments:", appointmentData);

    allAppointments = (appointmentData || [])
      .map(normalizeAppointment)
      .filter(isCurrentPatientAppointment);

    console.log("Normalized patient appointments:", allAppointments);

    renderAppointments(allAppointments);
  } catch (error) {
    console.error("Error loading patient appointments:", error);
    renderAppointments([]);
  }
}

function getStatusLabel(status) {
  if (status === 0 || status === "0") return "Scheduled";
  if (status === 1 || status === "1") return "Completed";
  if (status === 2 || status === "2") return "Cancelled";
  return "Unknown";
}

function renderAppointments(appointments) {
  if (!tableBody) {
    console.error("patientTableBody not found.");
    return;
  }

  tableBody.innerHTML = "";

  if (!appointments || appointments.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;">No Appointments Found</td>
      </tr>
    `;
    return;
  }

  appointments.forEach((appointment) => {
    const tr = document.createElement("tr");

    const canEdit = appointment.status === 0 || appointment.status === "0";

    tr.innerHTML = `
      <td>${appointment.patientName || "You"}</td>
      <td>${appointment.doctorName || "N/A"}</td>
      <td>${appointment.appointmentDate || "N/A"}</td>
      <td>${appointment.appointmentTimeOnly || "N/A"}</td>
      <td>
        ${
          canEdit
            ? `<button class="edit-appointment-btn" data-id="${appointment.id}">Edit</button>`
            : getStatusLabel(appointment.status)
        }
      </td>
    `;

    if (canEdit) {
      const actionBtn = tr.querySelector(".edit-appointment-btn");
      actionBtn?.addEventListener("click", () => redirectToUpdatePage(appointment));
    }

    tableBody.appendChild(tr);
  });
}

function redirectToUpdatePage(appointment) {
  const queryString = new URLSearchParams({
    appointmentId: appointment.id,
    patientId: appointment.patientId,
    patientName: appointment.patientName || "You",
    doctorName: appointment.doctorName || "",
    doctorId: appointment.doctorId || "",
    appointmentDate: appointment.appointmentDate || "",
    appointmentTime: appointment.appointmentTimeOnly || ""
  }).toString();

  window.location.href = `/pages/updateAppointment.html?${queryString}`;
}

function applyLocalFilters() {
  const searchValue = (searchBar?.value || "").toLowerCase().trim();
  const filterValue = appointmentFilter?.value || "";

  let filtered = [...allAppointments];

  if (searchValue) {
    filtered = filtered.filter((appointment) => {
      return (
        appointment.doctorName.toLowerCase().includes(searchValue) ||
        appointment.patientName.toLowerCase().includes(searchValue)
      );
    });
  }

  if (filterValue && filterValue !== "allAppointments") {
    filtered = filtered.filter((appointment) => {
      if (filterValue === "scheduled") {
        return appointment.status === 0 || appointment.status === "0";
      }

      if (filterValue === "completed") {
        return appointment.status === 1 || appointment.status === "1";
      }

      if (filterValue === "cancelled") {
        return appointment.status === 2 || appointment.status === "2";
      }

      return true;
    });
  }

  renderAppointments(filtered);
}

searchBar?.addEventListener("input", applyLocalFilters);
appointmentFilter?.addEventListener("change", applyLocalFilters);