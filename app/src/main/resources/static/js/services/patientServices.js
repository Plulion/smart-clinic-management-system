import { API_BASE_URL } from "../config/config.js";

const PATIENT_API = API_BASE_URL + "/patients";

function getHeaders(token) {
  const headers = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function patientSignup(data) {
  try {
    const response = await fetch(PATIENT_API, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Patient signup failed"
      };
    }

    return {
      success: true,
      message: "Patient registered successfully"
    };
  } catch (error) {
    console.error("patientSignup error:", error);
    return {
      success: false,
      message: "Unexpected signup error"
    };
  }
}

export async function patientLogin(data) {
  try {
    return await fetch(`${PATIENT_API}/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error("patientLogin error:", error);
    throw error;
  }
}

export async function getPatientData(token) {
  try {
    const response = await fetch(`${PATIENT_API}/me`, {
      method: "GET",
      headers: getHeaders(token)
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("getPatientData error:", error);
    return null;
  }
}

export async function getPatientById(id, token) {
  try {
    const response = await fetch(`${PATIENT_API}/${id}`, {
      method: "GET",
      headers: getHeaders(token)
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("getPatientById error:", error);
    return null;
  }
}

export async function getPatientAppointments(id, token, user = "patient") {
  try {
    const response = await fetch(`${PATIENT_API}/${id}/appointments?user=${user}`, {
      method: "GET",
      headers: getHeaders(token)
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("getPatientAppointments error:", error);
    return null;
  }
}

export async function filterAppointments(condition, name, token) {
  try {
    const query = new URLSearchParams({
      condition: condition || "",
      name: name || ""
    });

    const response = await fetch(`${PATIENT_API}/appointments/filter?${query.toString()}`, {
      method: "GET",
      headers: getHeaders(token)
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("filterAppointments error:", error);
    return [];
  }
}

export function filterAppointmentsByPatientName(appointments, searchTerm) {
  const normalizedSearch = (searchTerm || "").toLowerCase().trim();

  return appointments.filter((appointment) => {
    const patientName = appointment.patient?.name || appointment.patientName || "";
    return patientName.toLowerCase().includes(normalizedSearch);
  });
}
