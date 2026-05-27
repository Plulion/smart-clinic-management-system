export function openModal(type) {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");

  if (!modal || !modalBody) return;

  let content = "";

  if (type === "adminLogin") {
    content = `
      <h2>Admin Login</h2>
      <form class="modal-form" onsubmit="adminLoginHandler(); return false;">
        <input class="input-field" id="adminUsername" type="text" placeholder="Username" required />
        <input class="input-field" id="adminPassword" type="password" placeholder="Password" required />
        <button class="button" type="submit">Login</button>
      </form>
    `;
  }

  if (type === "doctorLogin") {
    content = `
      <h2>Doctor Login</h2>
      <form class="modal-form" onsubmit="doctorLoginHandler(); return false;">
        <input class="input-field" id="doctorEmail" type="email" placeholder="Email" required />
        <input class="input-field" id="doctorPassword" type="password" placeholder="Password" required />
        <button class="button" type="submit">Login</button>
      </form>
    `;
  }

  if (type === "patientLogin") {
    content = `
      <h2>Patient Login</h2>
      <form class="modal-form" onsubmit="loginPatient(); return false;">
        <input class="input-field" id="patientLoginEmail" type="email" placeholder="Email" required />
        <input class="input-field" id="patientLoginPassword" type="password" placeholder="Password" required />
        <button class="button" type="submit">Login</button>
      </form>
    `;
  }

  if (type === "patientSignup") {
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

  if (type === "addDoctor") {
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

  modalBody.innerHTML = content;
  modal.classList.add("active");
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
