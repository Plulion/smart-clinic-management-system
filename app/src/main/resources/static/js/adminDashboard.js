import { createDoctorCard } from "./components/doctorCard.js";
import { getAllDoctors, addDoctor, filterDoctors } from "./services/doctorServices.js";

let doctors = [];

const content = document.getElementById("content");
const searchBar = document.getElementById("searchBar");
const filterSpecialty = document.getElementById("filterSpecialty");
const filterTime = document.getElementById("filterTime");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeModal = document.getElementById("closeModal");

function renderDoctors(list) {
  if (!content) return;

  content.innerHTML = "";

  if (!list || list.length === 0) {
    content.innerHTML = `<div class="empty-state">No doctors found.</div>`;
    return;
  }

  list.forEach((doctor) => {
    const card = createDoctorCard(doctor);
    content.appendChild(card);
  });
}

function applyFilters() {
  const searchTerm = searchBar?.value || "";
  const specialty = filterSpecialty?.value || "";
  const time = filterTime?.value || "";

  const filteredDoctors = filterDoctors(doctors, searchTerm, specialty, time);
  renderDoctors(filteredDoctors);
}

async function loadDoctors() {
  try {
    doctors = await getAllDoctors();
    renderDoctors(doctors);
  } catch (error) {
    console.error(error);
    if (content) {
      content.innerHTML = `
        <div class="empty-state">
          Unable to load doctors. Make sure the backend is running.
        </div>
      `;
    }
  }
}

function getAddDoctorFormHtml() {
  return `
    <h2>Add Doctor</h2>
    <form id="addDoctorForm" class="modal-form">
      <label for="doctorName">Name</label>
      <input id="doctorName" class="input-field" type="text" placeholder="Doctor name" required />

      <label for="doctorSpecialty">Specialty</label>
      <select id="doctorSpecialty" class="input-field" required>
        <option value="">Select specialty</option>
        <option value="Cardiologist">Cardiologist</option>
        <option value="Neurologist">Neurologist</option>
        <option value="Orthopedist">Orthopedist</option>
        <option value="Pediatrician">Pediatrician</option>
        <option value="Dermatologist">Dermatologist</option>
      </select>

      <label for="doctorEmail">Email</label>
      <input id="doctorEmail" class="input-field" type="email" placeholder="doctor@example.com" required />

      <label for="doctorPhone">Phone</label>
      <input id="doctorPhone" class="input-field" type="text" placeholder="5551012020" required />

      <label for="doctorPassword">Password</label>
      <input id="doctorPassword" class="input-field" type="password" placeholder="Password" required />

      <label for="doctorTime">Available Time</label>
      <input id="doctorTime" class="input-field" type="text" placeholder="09:00-10:00" />

      <button class="button" type="submit">Save Doctor</button>
    </form>
  `;
}

function openModal(type) {
  if (!modal || !modalBody) return;

  if (type === "addDoctor") {
    modalBody.innerHTML = getAddDoctorFormHtml();
    modal.classList.add("active");

    const form = document.getElementById("addDoctorForm");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const availableTime = document.getElementById("doctorTime").value.trim();

      const doctor = {
        name: document.getElementById("doctorName").value.trim(),
        specialty: document.getElementById("doctorSpecialty").value,
        email: document.getElementById("doctorEmail").value.trim(),
        phone: document.getElementById("doctorPhone").value.trim(),
        password: document.getElementById("doctorPassword").value,
        availableTimes: availableTime ? [availableTime] : []
      };

      try {
        const token = localStorage.getItem("token");
        const savedDoctor = await addDoctor(doctor, token);
        doctors.push(savedDoctor);
        applyFilters();
        modal.classList.remove("active");
        alert("Doctor added successfully.");
      } catch (error) {
        console.error(error);
        alert("Error adding doctor. Check backend API and validation rules.");
      }
    });
  }
}

window.openModal = openModal;

searchBar?.addEventListener("input", applyFilters);
filterSpecialty?.addEventListener("change", applyFilters);
filterTime?.addEventListener("change", applyFilters);

closeModal?.addEventListener("click", () => {
  modal?.classList.remove("active");
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.remove("active");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("userRole", "admin");

  if (!localStorage.getItem("token")) {
    localStorage.setItem("token", "demo-token");
  }

  loadDoctors();
});
