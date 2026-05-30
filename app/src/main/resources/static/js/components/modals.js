export function openModal(type) {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");

  if (!modal || !modalBody) {
    console.error("Modal or modal body not found.");
    return;
  }

  const modalType = normalizeModalType(type);
  let content = "";

  if (modalType === "adminLogin") {
    content = `
      <h2>Admin Login</h2>
      <form class="modal-form" onsubmit="adminLoginHandler(); return false;">
        <input class="input-field" id="adminUsername" type="text" placeholder="Username" required />
        <input class="input-field" id="adminPassword" type="password" placeholder="Password" required />
        <button class="button" type="submit">Login</button>
      </form>
    `;
  }

  if (modalType === "doctorLogin") {
    content = `
      <h2>Doctor Login</h2>
      <form class="modal-form" onsubmit="doctorLoginHandler(); return false;">
        <input class="input-field" id="doctorEmail" type="email" placeholder="Email" required />
        <input class="input-field" id="doctorPassword" type="password" placeholder="Password" required />
        <button class="button" type="submit">Login</button>
      </form>
    `;
  }

  if (modalType === "patientLogin") {
    content = `
      <h2>Patient Login</h2>
      <form class="modal-form" onsubmit="loginPatient(); return false;">
        <input class="input-field" id="patientLoginEmail" type="email" placeholder="Email" required />
        <input class="input-field" id="patientLoginPassword" type="password" placeholder="Password" required />
        <button class="button" type="submit">Login</button>
      </form>
    `;
  }

  if (modalType === "patientSignup") {
    content = `
      <h2>Patient Sign Up</h2>
      <form class="modal-form" onsubmit="signupPatient(); return false;">
        <input class="input-field" id="patientName" type="text" placeholder="Full name" required />
        <input class="input-field" id="patientEmail" type="email" placeholder="Email" required />
        <input class="input-field" id="patientPassword" type="password" placeholder="Password" required />
        <input class="input-field" id="patientPhone" type="text" placeholder="Phone" required />
        <input class="input-field" id="patientAddress" type="text" placeholder="Address" required />
        <button class="button" type="submit">Sign Up</button>
      </form>
    `;
  }

  if (modalType === "addDoctor") {
    content = `
      <h2>Add Doctor</h2>
      <form class="modal-form" onsubmit="adminAddDoctor(); return false;">
        <input class="input-field" id="doctorName" type="text" placeholder="Doctor name" required />

        <select class="input-field" id="doctorSpecialty" required>
          <option value="">Select specialty</option>
          <option value="Cardiologist">Cardiologist</option>
          <option value="Neurologist">Neurologist</option>
          <option value="Orthopedist">Orthopedist</option>
          <option value="Pediatrician">Pediatrician</option>
          <option value="Dermatologist">Dermatologist</option>
        </select>

        <input class="input-field" id="doctorEmail" type="email" placeholder="doctor@example.com" required />
        <input class="input-field" id="doctorPhone" type="text" placeholder="5551012020" required />
        <input class="input-field" id="doctorPassword" type="password" placeholder="Password" required />
        <input class="input-field" id="doctorTime" type="text" placeholder="09:00-10:00" />

        <button class="button" type="submit">Save Doctor</button>
      </form>
    `;
  }

  if (!content) {
    console.error("Unknown modal type:", type);
    content = `
      <h2>Modal Error</h2>
      <p>Unknown modal type: ${type}</p>
    `;
  }

  modalBody.innerHTML = content;
  modal.classList.add("active");
}

function normalizeModalType(type) {
  if (type === "login") return "patientLogin";
  if (type === "loginPatient") return "patientLogin";
  if (type === "patient-login") return "patientLogin";
  if (type === "patientLogin") return "patientLogin";

  if (type === "signup") return "patientSignup";
  if (type === "signUp") return "patientSignup";
  if (type === "signupPatient") return "patientSignup";
  if (type === "patient-signup") return "patientSignup";
  if (type === "patientSignup") return "patientSignup";
  if (type === "register") return "patientSignup";

  return type;
}

export function closeModal() {
  const modal = document.getElementById("modal");

  if (modal) {
    modal.classList.remove("active");
  }
}

window.openModal = openModal;
window.closeModal = closeModal;

document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.getElementById("closeModal");

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  window.addEventListener("click", (event) => {
    const modal = document.getElementById("modal");

    if (event.target === modal) {
      closeModal();
    }
  });
});