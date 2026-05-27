package com.project.back_end.services;

import com.project.back_end.DTO.AppointmentDTO;
import com.project.back_end.models.Appointment;
import com.project.back_end.models.Patient;
import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private Service service;

    public int bookAppointment(Appointment appointment) {
        try {
            appointmentRepository.save(appointment);
            return 1;
        } catch (Exception error) {
            return 0;
        }
    }

    public ResponseEntity<Map<String, String>> updateAppointment(Appointment appointment) {
        Map<String, String> response = new HashMap<>();

        Optional<Appointment> existingAppointment = appointmentRepository.findById(appointment.getId());

        if (existingAppointment.isEmpty()) {
            response.put("error", "Appointment not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        int validation = service.validateAppointment(appointment);

        if (validation == -1) {
            response.put("error", "Doctor not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        if (validation == 0) {
            response.put("error", "Appointment time is unavailable");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        appointmentRepository.save(appointment);
        response.put("message", "Appointment updated");

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, String>> cancelAppointment(long id, String token) {
        Map<String, String> response = new HashMap<>();

        Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);

        if (optionalAppointment.isEmpty()) {
            response.put("error", "Appointment not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        Appointment appointment = optionalAppointment.get();

        String email = tokenService.extractIdentifier(token);
        Patient patient = patientRepository.findByEmail(email);

        if (patient == null || appointment.getPatient() == null || !Objects.equals(appointment.getPatient().getId(), patient.getId())) {
            response.put("error", "Unauthorized cancellation");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        appointmentRepository.delete(appointment);
        response.put("message", "Appointment cancelled");

        return ResponseEntity.ok(response);
    }

    public Map<String, Object> getAppointment(String pname, LocalDate date, String token) {
        Map<String, Object> response = new HashMap<>();

        String identifier = tokenService.extractIdentifier(token);
        Long doctorId = 1L;

        if (identifier != null && doctorRepository.findByEmail(identifier) != null) {
            doctorId = doctorRepository.findByEmail(identifier).getId();
        }

        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();

        List<Appointment> appointments;

        if (pname == null || pname.isBlank() || "null".equalsIgnoreCase(pname)) {
            appointments = appointmentRepository.findByDoctorIdAndAppointmentTimeBetween(doctorId, start, end);
        } else {
            appointments = appointmentRepository.findByDoctorIdAndPatient_NameContainingIgnoreCaseAndAppointmentTimeBetween(
                    doctorId,
                    pname,
                    start,
                    end
            );
        }

        List<AppointmentDTO> appointmentDTOs = appointments.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        response.put("appointments", appointmentDTOs);
        return response;
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
