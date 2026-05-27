import { deleteDoctor } from "../services/doctorServices.js";
import { getPatientData } from "../services/patientServices.js";

export function createDoctorCard(doctor) {
  const card = document.createElement("div");
  card.classList.add("doctor-card");

  const role = localStorage.getItem("userRole");

  const infoDiv = document.createElement("div");
  infoDiv.classList.add("doctor-info");

  const name = document.createElement("h3");
  name.textContent = doctor.name || "Unknown Doctor";

  const specialty = document.createElement("p");
  specialty.innerHTML = `<strong>Specialty:</strong> ${doctor.specialty || doctor.specialization || "N/A"}`;

  const email = document.createElement("p");
  email.innerHTML = `<strong>Email:</strong> ${doctor.email || "N/A"}`;

  const phone = document.createElement("p");
  phone.innerHTML = `<strong>Phone:</strong> ${doctor.phone || "N/A"}`;

  const availability = document.createElement("p");
  const availableTimes = doctor.availableTimes || doctor.available_times || [];
  availability.innerHTML = `<strong>Availability:</strong> ${
    Array.isArray(availableTimes) && availableTimes.length > 0
      ? availableTimes.join(", ")
      : "Not available"
  }`;

  infoDiv.appendChild(name);
  infoDiv.appendChild(specialty);
  infoDiv.appendChild(email);
  infoDiv.appendChild(phone);
  infoDiv.appendChild(availability);

  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("card-actions");

  if (role === "admin") {
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Delete";
    removeBtn.classList.add("delete-btn");

    removeBtn.addEventListener("click", async () => {
      const confirmDelete = confirm(`Delete ${doctor.name}?`);
      if (!confirmDelete) return;

      try {
        const token = localStorage.getItem("token");
        await deleteDoctor(doctor.id, token);
        card.remove();
        alert("Doctor deleted successfully.");
      } catch (error) {
        console.error(error);
        alert("Error deleting doctor.");
      }
    });

    actionsDiv.appendChild(removeBtn);
  } else if (role === "patient") {
    const bookNow = document.createElement("button");
    bookNow.textContent = "Book Now";
    bookNow.classList.add("book-btn");

    bookNow.addEventListener("click", () => {
      alert("Patient needs to login first.");
    });

    actionsDiv.appendChild(bookNow);
  } else if (role === "loggedPatient") {
    const bookNow = document.createElement("button");
    bookNow.textContent = "Book Now";
    bookNow.classList.add("book-btn");

    bookNow.addEventListener("click", async (event) => {
      try {
        const token = localStorage.getItem("token");
        const patientData = await getPatientData(token);

        if (typeof window.showBookingOverlay === "function") {
          window.showBookingOverlay(event, doctor, patientData);
        } else {
          alert(`Booking selected for ${doctor.name}`);
        }
      } catch (error) {
        console.error(error);
        alert("Unable to load patient data.");
      }
    });

    actionsDiv.appendChild(bookNow);
  }

  card.appendChild(infoDiv);
  card.appendChild(actionsDiv);

  return card;
}
