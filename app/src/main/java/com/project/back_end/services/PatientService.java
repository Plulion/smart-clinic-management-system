package com.project.back_end.services;

import com.project.back_end.DTO.AppointmentDTO;
import com.project.back_end.models.Appointment;
import com.project.back_end.models.Patient;
import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.repo.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private TokenService tokenService;

    public int createPatient(Patient patient) {
        try {
            patientRepository.save(patient);
            return 1;
        } catch (Exception error) {
            return 0;
        }
    }

    public ResponseEntity<Map<String, Object>> getPatientAppointment(Long id, String token) {
        Map<String, Object> response = new HashMap<>();

        String email = tokenService.extractIdentifier(token);
        Patient patient = patientRepository.findByEmail(email);

        if (patient == null || !Objects.equals(patient.getId(), id)) {
            response.put("error", "Unauthorized access");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        List<AppointmentDTO> appointments = appointmentRepository.findByPatientId(id)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        response.put("appointments", appointments);
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, Object>> filterByCondition(String condition, Long id) {
        Map<String, Object> response = new HashMap<>();

        int status = "past".equalsIgnoreCase(condition) || "consulted".equalsIgnoreCase(condition) ? 1 : 0;

        List<AppointmentDTO> appointments =
                appointmentRepository.findByPatient_IdAndStatusOrderByAppointmentTimeAsc(id, status)
                        .stream()
                        .map(this::toDTO)
                        .collect(Collectors.toList());

        response.put("appointments", appointments);
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, Object>> filterByDoctor(String name, Long patientId) {
        Map<String, Object> response = new HashMap<>();

        List<AppointmentDTO> appointments =
                appointmentRepository.filterByDoctorNameAndPatientId(name, patientId)
                        .stream()
                        .map(this::toDTO)
                        .collect(Collectors.toList());

        response.put("appointments", appointments);
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, Object>> filterByDoctorAndCondition(String condition, String name, long patientId) {
        Map<String, Object> response = new HashMap<>();

        int status = "past".equalsIgnoreCase(condition) || "consulted".equalsIgnoreCase(condition) ? 1 : 0;

        List<AppointmentDTO> appointments =
                appointmentRepository.filterByDoctorNameAndPatientIdAndStatus(name, patientId, status)
                        .stream()
                        .map(this::toDTO)
                        .collect(Collectors.toList());

        response.put("appointments", appointments);
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, Object>> getPatientDetails(String token) {
        Map<String, Object> response = new HashMap<>();

        String email = tokenService.extractIdentifier(token);
        Patient patient = patientRepository.findByEmail(email);

        if (patient == null) {
            response.put("error", "Patient not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        response.put("patient", patient);
        return ResponseEntity.ok(response);
    }

    private AppointmentDTO toDTO(Appointment appointment) {
        return new AppointmentDTO(
                appointment.getId(),
                appointment.getDoctor().getId(),
                appointment.getDoctor().getName(),
                appointment.getPatient().getId(),
                appointment.getPatient().getName(),
                appointment.getPatient().getEmail(),
                appointment.getPatient().getPhone(),
                appointment.getPatient().getAddress(),
                appointment.getAppointmentTime(),
                appointment.getStatus()
        );
    }
}
