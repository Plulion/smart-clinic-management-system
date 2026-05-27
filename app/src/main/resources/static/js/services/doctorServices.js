import { API_BASE_URL } from "../config/config.js";

const DOCTOR_API = API_BASE_URL + "/doctors";

function getHeaders(token) {
  const headers = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function getDoctors() {
  try {
    const response = await fetch(DOCTOR_API);

    if (!response.ok) {
      throw new Error("Failed to fetch doctors");
    }

    return await response.json();
  } catch (error) {
    console.error("getDoctors error:", error);
    return [];
  }
}

export async function getAllDoctors() {
  return getDoctors();
}

export async function saveDoctor(doctor, token) {
  try {
    const response = await fetch(DOCTOR_API, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(doctor)
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Failed to save doctor"
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: "Doctor saved successfully",
      data
    };
  } catch (error) {
    console.error("saveDoctor error:", error);
    return {
      success: false,
      message: "Unexpected error while saving doctor"
    };
  }
}

export async function addDoctor(doctor, token) {
  const result = await saveDoctor(doctor, token);

  if (!result.success) {
    throw new Error(result.message);
  }

  return result.data;
}

export async function deleteDoctor(id, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/${id}`, {
      method: "DELETE",
      headers: getHeaders(token)
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Failed to delete doctor"
      };
    }

    return {
      success: true,
      message: "Doctor deleted successfully"
    };
  } catch (error) {
    console.error("deleteDoctor error:", error);
    return {
      success: false,
      message: "Unexpected error while deleting doctor"
    };
  }
}

export function filterDoctorsLocal(doctors, name, time, specialty) {
  const normalizedName = (name || "").toLowerCase().trim();

  return doctors.filter((doctor) => {
    const doctorName = (doctor.name || "").toLowerCase();
    const doctorSpecialty = doctor.specialty || doctor.specialization || "";
    const availableTimes = doctor.availableTimes || doctor.available_times || [];

    const matchesName = doctorName.includes(normalizedName);
    const matchesSpecialty = !specialty || doctorSpecialty === specialty;
    const matchesTime =
      !time ||
      (Array.isArray(availableTimes) &&
        availableTimes.some((availableTime) => availableTime.includes(time)));

    return matchesName && matchesSpecialty && matchesTime;
  });
}

export async function filterDoctors(name, time, specialty) {
  try {
    const doctors = await getDoctors();
    return filterDoctorsLocal(doctors, name, time, specialty);
  } catch (error) {
    console.error("filterDoctors error:", error);
    return [];
  }
}
