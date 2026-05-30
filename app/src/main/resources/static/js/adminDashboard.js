import { openModal, closeModal } from "./components/modals.js";
import { createDoctorCard } from "./components/doctorCard.js";
import { getDoctors, saveDoctor } from "./services/doctorServices.js";

const contentDiv = document.getElementById("content");
const searchBar = document.getElementById("searchBar");
const filterTime = document.getElementById("filterTime");
const filterSpecialty = document.getElementById("filterSpecialty");

let allDoctors = [];

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
  allDoctors = await getDoctors();

  console.log("Doctors loaded in admin dashboard:", allDoctors);

  renderDoctorCards(allDoctors);
}

function applyLocalFilters() {
  const name = (searchBar?.value || "").toLowerCase().trim();
  const time = (filterTime?.value || "").toLowerCase().trim();
  const specialty = (filterSpecialty?.value || "").toLowerCase().trim();

  const filteredDoctors = allDoctors.filter((doctor) => {
    const doctorName = (doctor.name || "").toLowerCase();
    const doctorSpecialty = (doctor.specialty || "").toLowerCase();
    const availableTimes = doctor.availableTimes || [];

    const matchesName =
      !name ||
      doctorName.includes(name);

    const matchesSpecialty =
      !specialty ||
      specialty === "all specialties" ||
      doctorSpecialty === specialty;

    const matchesTime =
      !time ||
      time === "all times" ||
      availableTimes.some((slot) => slot.toLowerCase().includes(time));

    return matchesName && matchesSpecialty && matchesTime;
  });

  console.log("Filtered doctors:", filteredDoctors);

  renderDoctorCards(filteredDoctors);
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
    await loadDoctorCards();
  } else {
    alert(result.message);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("userRole", "admin");

  const addDocBtn = document.getElementById("addDocBtn");

  if (addDocBtn) {
    addDocBtn.addEventListener("click", () => {
      openModal("addDoctor");
    });
  }

  searchBar?.addEventListener("input", applyLocalFilters);
  filterTime?.addEventListener("change", applyLocalFilters);
  filterSpecialty?.addEventListener("change", applyLocalFilters);

  loadDoctorCards();
});
