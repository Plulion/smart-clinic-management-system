import { API_BASE_URL } from "../config/config.js";

const APPOINTMENT_API = API_BASE_URL + "/appointments";

function getHeaders(token) {
  const headers = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function getAllAppointments(selectedDate, patientName, token) {
  try {
    const query = new URLSearchParams({
      date: selectedDate || "",
      patientName: patientName || "null"
    });

    const response = await fetch(`${APPOINTMENT_API}?${query.toString()}`, {
      method: "GET",
      headers: getHeaders(token)
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("getAllAppointments error:", error);
    return [];
  }
}

export async function getAppointmentsByDoctor(doctorId, token) {
  try {
    const response = await fetch(`${APPOINTMENT_API}/doctor/${doctorId}`, {
      method: "GET",
      headers: getHeaders(token)
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("getAppointmentsByDoctor error:", error);
    return [];
  }
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
