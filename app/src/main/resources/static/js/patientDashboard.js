import { createDoctorCard } from "./components/doctorCard.js";
import { openModal, closeModal } from "./components/modals.js";
import { getDoctors, filterDoctors } from "./services/doctorServices.js";
import { patientLogin, patientSignup } from "./services/patientServices.js";

const contentDiv = document.getElementById("content");
const searchBar = document.getElementById("searchBar");
const filterTime = document.getElementById("filterTime");
const filterSpecialty = document.getElementById("filterSpecialty");

function renderDoctorCards(doctors) {
  if (!contentDiv) return;

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
  const doctors = await getDoctors();
  renderDoctorCards(doctors);
}

async function filterDoctorsOnChange() {
  const name = searchBar?.value || "";
  const time = filterTime?.value || "";
  const specialty = filterSpecialty?.value || "";

  const doctors = await filterDoctors(name, time, specialty);
  renderDoctorCards(doctors);
}

window.signupPatient = async function () {
  const patient = {
    name: document.getElementById("patientName")?.value?.trim(),
    email: document.getElementById("patientEmail")?.value?.trim(),
    password: document.getElementById("patientPassword")?.value,
    phone: document.getElementById("patientPhone")?.value?.trim(),
    address: document.getElementById("patientAddress")?.value?.trim()
  };

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

  try {
    const response = await patientLogin({ email, password });

    if (!response.ok) {
      alert("Invalid patient credentials.");
      return;
    }

    const data = await response.json();

    localStorage.setItem("token", data.token || "demo-patient-token");
    localStorage.setItem("userRole", "loggedPatient");
    localStorage.setItem("patientId", data.id || data.patientId || "1");

    window.location.href = "/pages/loggedPatientDashboard.html";
  } catch (error) {
    console.error("loginPatient error:", error);
    alert("Unexpected patient login error.");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("userRole")) {
    localStorage.setItem("userRole", "patient");
  }

  const signupBtn = document.getElementById("patientSignup");
  const loginBtn = document.getElementById("patientLogin");

  if (signupBtn) {
    signupBtn.addEventListener("click", () => openModal("patientSignup"));
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", () => openModal("patientLogin"));
  }

  searchBar?.addEventListener("input", filterDoctorsOnChange);
  filterTime?.addEventListener("change", filterDoctorsOnChange);
  filterSpecialty?.addEventListener("change", filterDoctorsOnChange);

  loadDoctorCards();
});
