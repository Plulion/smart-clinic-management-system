import { createDoctorCard } from "./components/doctorCard.js";
import { openModal, closeModal } from "./components/modals.js";
import { getDoctors, filterDoctors } from "./services/doctorServices.js";
import { patientLogin, patientSignup } from "./services/patientServices.js";

const contentDiv = document.getElementById("content");
const searchBar = document.getElementById("searchBar");
const filterTime = document.getElementById("filterTime");
const filterSpecialty = document.getElementById("filterSpecialty");

let allDoctors = [];

function renderDoctorCards(doctors) {
  if (!contentDiv) {
    console.error("Patient dashboard content container not found.");
    return;
  }

  contentDiv.innerHTML = "";

  if (!doctors || doctors.length === 0) {
    contentDiv.innerHTML = `<div class="empty-state">No doctors found with the given filters.</div>`;
    return;
  }

  doctors.forEach((doctor) => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}

async function loadDoctorCards() {
  try {
    allDoctors = await getDoctors();
    console.log("Patient dashboard doctors loaded:", allDoctors);
    renderDoctorCards(allDoctors);
  } catch (error) {
    console.error("loadDoctorCards error:", error);
    renderDoctorCards([]);
  }
}

async function filterDoctorsOnChange() {
  const name = searchBar?.value || "";
  const time = filterTime?.value || "";
  const specialty = filterSpecialty?.value || "";

  try {
    const doctors = await filterDoctors(name, time, specialty);
    renderDoctorCards(doctors);
  } catch (error) {
    console.error("filterDoctorsOnChange error:", error);
    renderDoctorCards(allDoctors);
  }
}

window.signupPatient = async function () {
  const patient = {
    name: document.getElementById("patientName")?.value?.trim(),
    email: document.getElementById("patientEmail")?.value?.trim(),
    password: document.getElementById("patientPassword")?.value,
    phone: document.getElementById("patientPhone")?.value?.trim(),
    address: document.getElementById("patientAddress")?.value?.trim()
  };

  if (!patient.name || !patient.email || !patient.password) {
    alert("Please complete the required patient information.");
    return;
  }

  const result = await patientSignup(patient);

  if (result.success) {
    alert(result.message);
    closeModal();
    window.location.reload();
  } else {
    alert(result.message);
  }
};

window.loginPatient = async function () {
  const email = document.getElementById("patientLoginEmail")?.value?.trim();
  const password = document.getElementById("patientLoginPassword")?.value;

  if (!email || !password) {
    alert("Please enter patient email and password.");
    return;
  }

  try {
    const response = await patientLogin({
      identifier: email,
      password
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Patient login failed:", data);
      alert(data.error || "Invalid patient credentials.");
      return;
    }

    localStorage.setItem("token", data.token || "demo-patient-token");
    localStorage.setItem("userRole", "loggedPatient");
    localStorage.setItem("patientId", data.id || data.patientId || "1");
    localStorage.setItem("patientEmail", email);
    localStorage.setItem("patientName", data.name || "Jane Doe");

    window.location.href = "/pages/loggedPatientDashboard.html";
  } catch (error) {
    console.error("loginPatient error:", error);
    alert("Unexpected patient login error.");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("userRole", "patient");

  const signupBtn = document.getElementById("patientSignup");
  const loginBtn = document.getElementById("patientLogin");

  if (signupBtn) {
    signupBtn.addEventListener("click", () => openModal("patientSignup"));
  } else {
    console.warn("Patient signup button not found.");
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", () => openModal("patientLogin"));
  } else {
    console.warn("Patient login button not found.");
  }

  searchBar?.addEventListener("input", filterDoctorsOnChange);
  filterTime?.addEventListener("change", filterDoctorsOnChange);
  filterSpecialty?.addEventListener("change", filterDoctorsOnChange);

  loadDoctorCards();
});