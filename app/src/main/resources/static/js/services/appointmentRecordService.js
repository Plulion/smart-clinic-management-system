const API_BASE_URL = "/api/appointments";

export async function getAppointmentsByDoctor(doctorId, token) {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/doctor/${doctorId}`, {
    method: "GET",
    headers
  });

  if (!response.ok) {
    throw new Error("Failed to fetch doctor appointments.");
  }

  return response.json();
}

export function getDemoAppointments() {
  return [
    {
      id: 1,
      appointmentTime: "2025-04-15T09:00:00",
      status: 1,
      patient: {
        id: 1,
        name: "Jane Doe",
        phone: "8881111111",
        email: "jane.doe@example.com"
      }
    },
    {
      id: 2,
      appointmentTime: "2025-04-15T10:00:00",
      status: 1,
      patient: {
        id: 2,
        name: "John Smith",
        phone: "8882222222",
        email: "john.smith@example.com"
      }
    },
    {
      id: 3,
      appointmentTime: "2025-04-16T11:00:00",
      status: 0,
      patient: {
        id: 3,
        name: "Emily Rose",
        phone: "8883333333",
        email: "emily.rose@example.com"
      }
    }
  ];
}
