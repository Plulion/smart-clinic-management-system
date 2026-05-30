import { openModal } from "../components/modals.js";
import { API_BASE_URL } from "../config/config.js";

const ADMIN_LOGIN_API = API_BASE_URL + "/admin/login";
const DOCTOR_LOGIN_API = API_BASE_URL + "/doctor/login";

function selectRole(role) {
  localStorage.setItem("userRole", role);
}

function getValueByPossibleIds(ids) {
  for (const id of ids) {
    const element = document.getElementById(id);
    if (element && element.value !== undefined) {
      return element.value.trim();
    }
  }
  return "";
}

window.adminLoginHandler = async function () {
  const username = getValueByPossibleIds([
    "adminUsername",
    "username",
    "adminEmail",
    "email"
  ]);

  const password = getValueByPossibleIds([
    "adminPassword",
    "password"
  ]);

  const admin = { username, password };

  console.log("Admin login URL:", ADMIN_LOGIN_API);
  console.log("Admin login payload:", admin);

  try {
    const response = await fetch(ADMIN_LOGIN_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(admin)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Admin login failed:", data);
      alert(data.error || "Invalid credentials!");
      return;
    }

    localStorage.setItem("token", data.token || "demo-admin-token");
    selectRole("admin");
    window.location.href = "/admin/dashboard";
  } catch (error) {
    console.error("Admin login error:", error);
    alert("Unexpected admin login error.");
  }
};

window.doctorLoginHandler = async function () {
  const identifier = getValueByPossibleIds([
    "doctorEmail",
    "doctorIdentifier",
    "email"
  ]);

  const password = getValueByPossibleIds([
    "doctorPassword",
    "password"
  ]);

  const doctor = { identifier, password };

  console.log("Doctor login URL:", DOCTOR_LOGIN_API);
  console.log("Doctor login payload:", doctor);

  try {
    const response = await fetch(DOCTOR_LOGIN_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doctor)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Doctor login failed:", data);
      alert(data.error || "Invalid credentials!");
      return;
    }

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
