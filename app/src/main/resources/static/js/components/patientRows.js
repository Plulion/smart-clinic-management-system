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

export function createPatientRow(appointment, onViewPrescription) {
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

  if (prescriptionBtn) {
    prescriptionBtn.addEventListener("click", () => {
      const patientName = patient.name || appointment.patientName || "";
      onViewPrescription(patientName);
    });
  }

  return row;
}
