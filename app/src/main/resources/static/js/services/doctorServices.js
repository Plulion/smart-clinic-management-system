const API_BASE_URL = "/api/doctors";

function getAuthHeaders(token) {
  const headers = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function getAllDoctors() {
  const response = await fetch(API_BASE_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch doctors.");
  }

  return response.json();
}

export async function addDoctor(doctor, token) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(doctor)
  });

  if (!response.ok) {
    throw new Error("Failed to add doctor.");
  }

  return response.json();
}

export async function deleteDoctor(doctorId, token) {
  const response = await fetch(`${API_BASE_URL}/${doctorId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token)
  });

  if (!response.ok) {
    throw new Error("Failed to delete doctor.");
  }

  return true;
}

export function filterDoctors(doctors, searchTerm, specialty, time) {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  return doctors.filter((doctor) => {
    const doctorName = (doctor.name || "").toLowerCase();
    const doctorSpecialty = doctor.specialty || doctor.specialization || "";
    const availableTimes = doctor.availableTimes || doctor.available_times || [];

    const matchesName = doctorName.includes(normalizedSearch);
    const matchesSpecialty = !specialty || doctorSpecialty === specialty;
    const matchesTime =
      !time ||
      (Array.isArray(availableTimes) &&
        availableTimes.some((availableTime) => availableTime.includes(time)));

    return matchesName && matchesSpecialty && matchesTime;
  });
}
