import { API_BASE_URL } from "../config/config.js";

const DOCTOR_API = API_BASE_URL + "/doctor";

export async function getDoctors() {
  try {
    const response = await fetch(DOCTOR_API);

    if (!response.ok) {
      console.error("Failed to fetch doctors:", response.status);
      return [];
    }

    const data = await response.json();
    console.log("getDoctors response:", data);

    return data.doctors || [];
  } catch (error) {
    console.error("getDoctors error:", error);
    return [];
  }
}

export async function filterDoctors(name, time, specialty) {
  const doctors = await getDoctors();

  const normalizedName = (name || "").toLowerCase().trim();
  const normalizedTime = (time || "").toLowerCase().trim();
  const normalizedSpecialty = (specialty || "").toLowerCase().trim();

  return doctors.filter((doctor) => {
    const doctorName = (doctor.name || "").toLowerCase();
    const doctorSpecialty = (doctor.specialty || doctor.specialization || "").toLowerCase();
    const availableTimes = doctor.availableTimes || doctor.available_times || [];

    const matchesName =
      !normalizedName ||
      doctorName.includes(normalizedName);

    const matchesSpecialty =
      !normalizedSpecialty ||
      normalizedSpecialty === "all specialties" ||
      normalizedSpecialty === "all" ||
      doctorSpecialty === normalizedSpecialty;

    const matchesTime =
      !normalizedTime ||
      normalizedTime === "all times" ||
      normalizedTime === "all" ||
      availableTimes.some((slot) => slot.toLowerCase().includes(normalizedTime));

    return matchesName && matchesSpecialty && matchesTime;
  });
}

export async function saveDoctor(doctor, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(doctor)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: data.error || "Failed to save doctor"
      };
    }

    return {
      success: true,
      message: data.message || "Doctor saved successfully"
    };
  } catch (error) {
    console.error("saveDoctor error:", error);
    return {
      success: false,
      message: "Unexpected error while saving doctor"
    };
  }
}

export async function deleteDoctor(id, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/${id}/${token}`, {
      method: "DELETE"
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete doctor");
    }

    return data;
  } catch (error) {
    console.error("deleteDoctor error:", error);
    throw error;
  }
}