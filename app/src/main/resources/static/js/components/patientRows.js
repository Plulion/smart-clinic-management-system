function formatDateTime(value) {
  if (!value) return "N/A";

  const raw = String(value);

  // Expected backend format: 2026-04-15T09:00:00
  // We avoid new Date() to prevent timezone conversion.
  if (raw.includes("T")) {
    const [datePart, timePart] = raw.split("T");
    const time = timePart ? timePart.slice(0, 5) : "";

    return `${datePart} ${time}`;
  }

  // Expected SQL-like format: 2026-04-15 09:00:00
  if (raw.includes(" ")) {
    const [datePart, timePart] = raw.split(" ");
    const time = timePart ? timePart.slice(0, 5) : "";

    return `${datePart} ${time}`;
  }

  return raw;
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