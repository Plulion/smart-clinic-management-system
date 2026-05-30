import { API_BASE_URL } from "../config/config.js";

const APPOINTMENT_API = API_BASE_URL + "/appointments";

function normalizeValue(value) {
  if (!value || value.trim() === "") {
    return "null";
  }

  return encodeURIComponent(value.trim());
}

function normalizeToken(token) {
  if (!token || token.trim() === "") {
    return "";
  }

  return encodeURIComponent(token.trim());
}

function normalizeAppointmentList(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.appointments)) {
    return data.appointments;
  }

  if (Array.isArray(data.patients)) {
    return data.patients;
  }

  if (data.appointment) {
    return [data.appointment];
  }

  return [];
}

export async function getAllAppointments(selectedDate, patientName, token) {
  try {
    const safeDate = selectedDate || new Date().toISOString().slice(0, 10);
    const safePatientName = normalizeValue(patientName);
    const safeToken = normalizeToken(token);

    const url = `${APPOINTMENT_API}/${safeDate}/${safePatientName}/${safeToken}`;

    console.log("Appointments URL:", url);

    const response = await fetch(url, {
      method: "GET"
    });

    const data = await response.json().catch(() => []);

    if (!response.ok) {
      console.error("getAllAppointments failed:", response.status, data);
      return [];
    }

    console.log("Appointments response:", data);

    return normalizeAppointmentList(data);
  } catch (error) {
    console.error("getAllAppointments error:", error);
    return [];
  }
}

export async function getAppointmentsByDoctor(doctorId, token) {
  try {
    const safeDoctorId = encodeURIComponent(String(doctorId || ""));
    const safeToken = normalizeToken(token);

    const possibleUrls = [
      `${APPOINTMENT_API}/doctor/${safeDoctorId}/${safeToken}`,
      `${APPOINTMENT_API}/doctor/${safeDoctorId}`
    ];

    for (const url of possibleUrls) {
      console.log("Appointments by doctor URL:", url);

      const response = await fetch(url, {
        method: "GET"
      });

      const data = await response.json().catch(() => []);

      if (response.ok) {
        return normalizeAppointmentList(data);
      }

      console.warn("getAppointmentsByDoctor failed:", response.status, data);
    }

    return [];
  } catch (error) {
    console.error("getAppointmentsByDoctor error:", error);
    return [];
  }
}

export async function bookAppointment(appointment, token) {
  try {
    const safeToken = normalizeToken(token);

    const possibleUrls = [
      `${APPOINTMENT_API}/${safeToken}`,
      `${APPOINTMENT_API}`,
      `/appointment/${safeToken}`,
      `/appointment`
    ];

    for (const url of possibleUrls) {
      console.log("Book appointment URL:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(appointment)
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        return {
          success: true,
          message: data.message || "Appointment booked successfully.",
          data
        };
      }

      console.warn("bookAppointment failed:", response.status, data);
    }

    return {
      success: false,
      message: "No valid appointment booking endpoint responded successfully."
    };
  } catch (error) {
    console.error("bookAppointment error:", error);
    return {
      success: false,
      message: "Unexpected error while booking appointment."
    };
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
      },
      doctor: {
        id: 1,
        name: "Dr. Emily Adams",
        specialty: "Cardiologist"
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
      },
      doctor: {
        id: 1,
        name: "Dr. Emily Adams",
        specialty: "Cardiologist"
      }
    },
    {
      id: 3,
      appointmentTime: "2026-04-15T09:00:00",
      status: 1,
      patient: {
        id: 1,
        name: "Jane Doe",
        phone: "8881111111",
        email: "jane.doe@example.com"
      },
      doctor: {
        id: 1,
        name: "Dr. Emily Adams",
        specialty: "Cardiologist"
      }
    }
  ];
}