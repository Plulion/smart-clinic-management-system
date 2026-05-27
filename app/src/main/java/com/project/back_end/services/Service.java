package com.project.back_end.services;

import com.project.back_end.DTO.Login;
import com.project.back_end.models.Admin;
import com.project.back_end.models.Appointment;
import com.project.back_end.models.Doctor;
import com.project.back_end.models.Patient;
import com.project.back_end.repo.AdminRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@org.springframework.stereotype.Service
public class Service {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private PatientService patientService;

    public Map<String, String> validateToken(String token, String user) {
        Map<String, String> response = new HashMap<>();

        if (!tokenService.validateToken(token, user)) {
            response.put("error", "Invalid or expired token");
        }

        return response;
    }

    public ResponseEntity<Map<String, String>> validateAdmin(Admin receivedAdmin) {
        Map<String, String> response = new HashMap<>();

        Admin admin = adminRepository.findByUsername(receivedAdmin.getUsername());

        if (admin == null || !admin.getPassword().equals(receivedAdmin.getPassword())) {
            response.put("error", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        response.put("token", tokenService.generateToken(admin.getUsername()));
        response.put("message", "Admin login successful");

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, String>> validatePatientLogin(Login login) {
        Map<String, String> response = new HashMap<>();

        String identifier = login.getIdentifier();

        if (identifier == null || identifier.isBlank()) {
            identifier = login.getEmail();
        }

        Patient patient = patientRepository.findByEmail(identifier);

        if (patient == null || !patient.getPassword().equals(login.getPassword())) {
            response.put("error", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        response.put("token", tokenService.generateToken(patient.getEmail()));
        response.put("id", String.valueOf(patient.getId()));
        response.put("message", "Patient login successful");

        return ResponseEntity.ok(response);
    }

    public Map<String, Object> filterDoctor(String name, String specialty, String time) {
        boolean hasName = name != null && !name.isBlank() && !"null".equalsIgnoreCase(name);
        boolean hasSpecialty = specialty != null && !specialty.isBlank() && !"null".equalsIgnoreCase(specialty);
        boolean hasTime = time != null && !time.isBlank() && !"null".equalsIgnoreCase(time);

        if (hasName && hasSpecialty && hasTime) {
            return doctorService.filterDoctorsByNameSpecilityandTime(name, specialty, time);
        }

        if (hasName && hasTime) {
            return doctorService.filterDoctorByNameAndTime(name, time);
        }

        if (hasName && hasSpecialty) {
            return doctorService.filterDoctorByNameAndSpecility(name, specialty);
        }

        if (hasSpecialty && hasTime) {
            return doctorService.filterDoctorByTimeAndSpecility(specialty, time);
        }

        if (hasSpecialty) {
            return doctorService.filterDoctorBySpecility(specialty);
        }

        if (hasTime) {
            return doctorService.filterDoctorsByTime(time);
        }

        if (hasName) {
            return doctorService.findDoctorByName(name);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("doctors", doctorService.getDoctors());
        return response;
    }

    public int validateAppointment(Appointment appointment) {
        if (appointment.getDoctor() == null || appointment.getDoctor().getId() == null) {
            return -1;
        }

        Doctor doctor = doctorRepository.findById(appointment.getDoctor().getId()).orElse(null);

        if (doctor == null) {
            return -1;
        }

        LocalDate appointmentDate = appointment.getAppointmentTime().toLocalDate();
        List<String> availability = doctorService.getDoctorAvailability(doctor.getId(), appointmentDate);

        String requestedTime = appointment.getAppointmentTime().toLocalTime().toString();

        boolean valid = availability.stream()
                .anyMatch(slot -> slot.startsWith(requestedTime));

        return valid ? 1 : 0;
    }

    public boolean validatePatient(Patient patient) {
        Patient existingPatient = patientRepository.findByEmailOrPhone(patient.getEmail(), patient.getPhone());
        return existingPatient == null;
    }

    public ResponseEntity<Map<String, Object>> filterPatient(String condition, String name, String token) {
        String email = tokenService.extractIdentifier(token);
        Patient patient = patientRepository.findByEmail(email);

        if (patient == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Patient not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        boolean hasCondition = condition != null && !condition.isBlank() && !"null".equalsIgnoreCase(condition);
        boolean hasName = name != null && !name.isBlank() && !"null".equalsIgnoreCase(name);

        if (hasCondition && hasName) {
            return patientService.filterByDoctorAndCondition(condition, name, patient.getId());
        }

        if (hasCondition) {
            return patientService.filterByCondition(condition, patient.getId());
        }

        if (hasName) {
            return patientService.filterByDoctor(name, patient.getId());
        }

        return patientService.getPatientAppointment(patient.getId(), token);
    }
}
