const API_BASE_URL = "/api/patients";

function getAuthHeaders(token) {
  const headers = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function getPatientData(token) {
  const response = await fetch(`${API_BASE_URL}/me`, {
    method: "GET",
    headers: getAuthHeaders(token)
  });

  if (!response.ok) {
    throw new Error("Failed to fetch patient data.");
  }

  return response.json();
}

export async function getPatientById(patientId, token) {
  const response = await fetch(`${API_BASE_URL}/${patientId}`, {
    method: "GET",
    headers: getAuthHeaders(token)
  });

  if (!response.ok) {
    throw new Error("Failed to fetch patient.");
  }

  return response.json();
}

export function filterAppointmentsByPatientName(appointments, searchTerm) {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  return appointments.filter((appointment) => {
    const patientName = appointment.patient?.name || appointment.patientName || "";
    return patientName.toLowerCase().includes(normalizedSearch);
  });
}
