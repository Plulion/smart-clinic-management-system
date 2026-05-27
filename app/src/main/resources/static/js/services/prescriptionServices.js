const API_BASE_URL = "/api/prescriptions";

export async function getPrescriptionsByPatientName(patientName, token) {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/patient/${encodeURIComponent(patientName)}`, {
    method: "GET",
    headers
  });

  if (!response.ok) {
    throw new Error("Failed to fetch prescriptions.");
  }

  return response.json();
}

export function getDemoPrescriptions(patientName) {
  return [
    {
      patientName,
      appointmentId: 1,
      medication: "Paracetamol",
      dosage: "500mg",
      doctorNotes: "Take 1 tablet every 6 hours."
    },
    {
      patientName,
      appointmentId: 2,
      medication: "Aspirin",
      dosage: "300mg",
      doctorNotes: "Take 1 tablet after meals."
    }
  ];
}
