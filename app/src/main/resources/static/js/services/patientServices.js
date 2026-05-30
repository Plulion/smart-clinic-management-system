import { API_BASE_URL } from "../config/config.js";

const PATIENT_API = API_BASE_URL + "/patient";

function getJsonHeaders() {
  return {
    "Content-Type": "application/json"
  };
}

function normalizePatientList(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.patients)) {
    return data.patients;
  }

  if (data.patient) {
    return [data.patient];
  }

  return [];
}

function normalizeAppointmentList(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.appointments)) {
    return data.appointments;
  }

  if (Array.isArray(data.patientAppointments)) {
    return data.patientAppointments;
  }

  if (Array.isArray(data.appointmentList)) {
    return data.appointmentList;
  }

  if (data.appointment) {
    return [data.appointment];
  }

  return [];
}

export async function patientLogin(credentials) {
  return fetch(`${PATIENT_API}/login`, {
    method: "POST",
    headers: getJsonHeaders(),
    body: JSON.stringify(credentials)
  });
}

export async function patientSignup(patient) {
  try {
    const response = await fetch(PATIENT_API, {
      method: "POST",
      headers: getJsonHeaders(),
      body: JSON.stringify(patient)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: data.error || "Failed to sign up patient."
      };
    }

    return {
      success: true,
      message: data.message || "Patient signed up successfully.",
      patient: data.patient || data
    };
  } catch (error) {
    console.error("patientSignup error:", error);
    return {
      success: false,
      message: "Unexpected error while signing up patient."
    };
  }
}

export async function getPatients() {
  try {
    const response = await fetch(PATIENT_API, {
      method: "GET",
      headers: getJsonHeaders()
    });

    const data = await response.json().catch(() => ([]));

    if (!response.ok) {
      console.error("getPatients failed:", response.status, data);
      return [];
    }

    return normalizePatientList(data);
  } catch (error) {
    console.error("getPatients error:", error);
    return [];
  }
}

export async function getPatientData(token) {
  try {
    const safeToken = encodeURIComponent(token || "");
    const url = `${PATIENT_API}/${safeToken}`;

    console.log("Patient data URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: getJsonHeaders()
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("getPatientData failed:", response.status, data);
      return null;
    }

    return data.patient || data;
  } catch (error) {
    console.error("getPatientData error:", error);
    return null;
  }
}

export async function getPatientAppointments(patientId, token) {
  try {
    const safePatientId = encodeURIComponent(String(patientId || ""));
    const safeToken = encodeURIComponent(token || "");

    const url = `${PATIENT_API}/${safePatientId}/${safeToken}`;

    console.log("Patient appointments URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: getJsonHeaders()
    });

    const data = await response.json().catch(() => ([]));

    console.log("Patient appointments response:", data);

    if (!response.ok) {
      console.error("getPatientAppointments failed:", response.status, data);
      return [];
    }

    return normalizeAppointmentList(data);
  } catch (error) {
    console.error("getPatientAppointments error:", error);
    return [];
  }
}

export async function filterAppointments(condition, name, token) {
  try {
    const safeCondition = encodeURIComponent(condition || "null");
    const safeName = encodeURIComponent(name || "null");
    const safeToken = encodeURIComponent(token || "");

    const url = `${PATIENT_API}/filter/${safeCondition}/${safeName}/${safeToken}`;

    console.log("Filter patient appointments URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: getJsonHeaders()
    });

    const data = await response.json().catch(() => ({}));

    console.log("Filter patient appointments response:", data);

    if (!response.ok) {
      console.error("filterAppointments failed:", response.status, data);
      return { appointments: [] };
    }

    return data;
  } catch (error) {
    console.error("filterAppointments error:", error);
    return { appointments: [] };
  }
}