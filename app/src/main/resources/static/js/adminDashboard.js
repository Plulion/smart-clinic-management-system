import { openModal, closeModal } from "./components/modals.js";
import { createDoctorCard } from "./components/doctorCard.js";
import { getDoctors, filterDoctors, saveDoctor } from "./services/doctorServices.js";

const contentDiv = document.getElementById("content");
const searchBar = document.getElementById("searchBar");
const filterTime = document.getElementById("filterTime");
const filterSpecialty = document.getElementById("filterSpecialty");

function renderDoctorCards(doctors) {
  if (!contentDiv) return;

  contentDiv.innerHTML = "";

  if (!doctors || doctors.length === 0) {
    contentDiv.innerHTML = `<div class="empty-state">No doctors found.</div>`;
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

window.adminAddDoctor = async function () {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Admin token is missing. Please log in again.");
    return;
  }

  const availableTime = document.getElementById("doctorTime")?.value?.trim();

  const doctor = {
    name: document.getElementById("doctorName")?.value?.trim(),
    specialty: document.getElementById("doctorSpecialty")?.value,
    email: document.getElementById("doctorEmail")?.value?.trim(),
    phone: document.getElementById("doctorPhone")?.value?.trim(),
    password: document.getElementById("doctorPassword")?.value,
    availableTimes: availableTime ? [availableTime] : []
  };

  const result = await saveDoctor(doctor, token);

  if (result.success) {
    alert(result.message);
    closeModal();
    loadDoctorCards();
  } else {
    alert(result.message);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("userRole", "admin");

  if (!localStorage.getItem("token")) {
    localStorage.setItem("token", "demo-admin-token");
  }

  const addDocBtn = document.getElementById("addDocBtn");

  if (addDocBtn) {
    addDocBtn.addEventListener("click", () => {
      openModal("addDoctor");
    });
  }

  searchBar?.addEventListener("input", filterDoctorsOnChange);
  filterTime?.addEventListener("change", filterDoctorsOnChange);
  filterSpecialty?.addEventListener("change", filterDoctorsOnChange);

  loadDoctorCards();
});
