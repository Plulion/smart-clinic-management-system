import { openModal } from "../components/modals.js";
import { API_BASE_URL } from "../config/config.js";

const ADMIN_API = API_BASE_URL + "/admin";
const DOCTOR_API = API_BASE_URL + "/doctor/login";

function selectRole(role) {
  localStorage.setItem("userRole", role);
}

window.adminLoginHandler = async function () {
  const username = document.getElementById("adminUsername")?.value;
  const password = document.getElementById("adminPassword")?.value;

  const admin = { username, password };

  try {
    const response = await fetch(`${ADMIN_API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(admin)
    });

    if (!response.ok) {
      alert("Invalid credentials!");
      return;
    }

    const data = await response.json();
    localStorage.setItem("token", data.token || "demo-admin-token");
    selectRole("admin");
    window.location.href = "/admin/dashboard";
  } catch (error) {
    console.error("Admin login error:", error);
    alert("Unexpected admin login error.");
  }
};

window.doctorLoginHandler = async function () {
  const email = document.getElementById("doctorEmail")?.value;
  const password = document.getElementById("doctorPassword")?.value;

  const doctor = { email, password };

  try {
    const response = await fetch(DOCTOR_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doctor)
    });

    if (!response.ok) {
      alert("Invalid credentials!");
      return;
    }

    const data = await response.json();
    localStorage.setItem("token", data.token || "demo-doctor-token");
    localStorage.setItem("doctorId", data.id || data.doctorId || "1");
    selectRole("doctor");
    window.location.href = "/doctor/dashboard";
  } catch (error) {
    console.error("Doctor login error:", error);
    alert("Unexpected doctor login error.");
  }
};

window.onload = function () {
  const adminBtn = document.getElementById("adminBtn") || document.getElementById("adminLogin");
  const doctorBtn = document.getElementById("doctorBtn") || document.getElementById("doctorLogin");
  const patientBtn = document.getElementById("patientBtn");

  if (adminBtn) {
    adminBtn.addEventListener("click", () => {
      openModal("adminLogin");
    });
  }

  if (doctorBtn) {
    doctorBtn.addEventListener("click", () => {
      openModal("doctorLogin");
    });
  }

  if (patientBtn) {
    patientBtn.addEventListener("click", () => {
      localStorage.setItem("userRole", "patient");
      window.location.href = "/pages/patientDashboard.html";
    });
  }
};
