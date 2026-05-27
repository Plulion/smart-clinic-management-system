const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeModal = document.getElementById("closeModal");

function openModalContent(title, role) {
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <h2>${title}</h2>
    <p>Please continue as ${role}.</p>

    <form id="loginForm" class="modal-form">
      <input class="input-field" type="text" id="emailOrUsername" placeholder="Email or Username" required />
      <input class="input-field" type="password" id="password" placeholder="Password" required />
      <button class="button" type="submit">Continue</button>
    </form>
  `;

  modal.classList.add("active");

  const form = document.getElementById("loginForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    localStorage.setItem("userRole", role);
    localStorage.setItem("token", "demo-token");

    if (role === "admin") {
      window.location.href = "/admin/dashboard";
    } else if (role === "doctor") {
      window.location.href = "/doctor/dashboard";
    } else if (role === "loggedPatient") {
      window.location.href = "/pages/loggedPatientDashboard.html";
    }
  });
}

function selectRole(role) {
  if (role === "patient") {
    localStorage.setItem("userRole", "patient");
    window.location.href = "/pages/patientDashboard.html";
    return;
  }

  if (role === "admin") {
    openModalContent("Admin Login", "admin");
    return;
  }

  if (role === "doctor") {
    openModalContent("Doctor Login", "doctor");
    return;
  }
}

document.getElementById("adminBtn")?.addEventListener("click", () => selectRole("admin"));
document.getElementById("doctorBtn")?.addEventListener("click", () => selectRole("doctor"));
document.getElementById("patientBtn")?.addEventListener("click", () => selectRole("patient"));

closeModal?.addEventListener("click", () => {
  modal?.classList.remove("active");
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.remove("active");
  }
});
