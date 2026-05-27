function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  window.location.href = "/";
}

function logoutPatient() {
  localStorage.removeItem("token");
  localStorage.setItem("userRole", "patient");
  window.location.href = "/pages/patientDashboard.html";
}

function renderHeader() {
  const headerDiv = document.getElementById("header");
  if (!headerDiv) return;

  let headerContent = "";
  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  if (window.location.pathname.endsWith("/") || window.location.pathname.endsWith("/index.html")) {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
  }

  if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
    localStorage.removeItem("userRole");
    alert("Session expired or invalid login. Please log in again.");
    window.location.href = "/";
    return;
  }

  headerContent += `
    <header class="header">
      <div class="header-brand">
        <span class="logo-text">Smart Clinic</span>
      </div>
      <nav class="header-nav">
  `;

  if (role === "admin") {
    headerContent += `
      <button id="addDocBtn" class="adminBtn">Add Doctor</button>
      <a href="#" id="logoutBtn">Logout</a>
    `;
  } else if (role === "doctor") {
    headerContent += `
      <a href="/doctor/dashboard">Home</a>
      <a href="#" id="logoutBtn">Logout</a>
    `;
  } else if (role === "patient") {
    headerContent += `
      <button id="loginBtn" class="adminBtn">Login</button>
      <button id="signupBtn" class="adminBtn">Sign Up</button>
    `;
  } else if (role === "loggedPatient") {
    headerContent += `
      <a href="/pages/loggedPatientDashboard.html">Home</a>
      <a href="/pages/patientAppointments.html">Appointments</a>
      <a href="#" id="logoutPatientBtn">Logout</a>
    `;
  } else {
    headerContent += `
      <a href="/">Home</a>
    `;
  }

  headerContent += `
      </nav>
    </header>
  `;

  headerDiv.innerHTML = headerContent;
  attachHeaderButtonListeners();
}

function attachHeaderButtonListeners() {
  const addDocBtn = document.getElementById("addDocBtn");
  if (addDocBtn) {
    addDocBtn.addEventListener("click", () => {
      if (typeof openModal === "function") {
        openModal("addDoctor");
      }
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (event) => {
      event.preventDefault();
      logout();
    });
  }

  const logoutPatientBtn = document.getElementById("logoutPatientBtn");
  if (logoutPatientBtn) {
    logoutPatientBtn.addEventListener("click", (event) => {
      event.preventDefault();
      logoutPatient();
    });
  }

  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      if (typeof openModal === "function") {
        openModal("loginPatient");
      }
    });
  }

  const signupBtn = document.getElementById("signupBtn");
  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      if (typeof openModal === "function") {
        openModal("signupPatient");
      }
    });
  }
}

window.logout = logout;
window.logoutPatient = logoutPatient;
window.renderHeader = renderHeader;

document.addEventListener("DOMContentLoaded", renderHeader);
