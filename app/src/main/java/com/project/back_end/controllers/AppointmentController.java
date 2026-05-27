package com.project.back_end.controllers;

import com.project.back_end.models.Appointment;
import com.project.back_end.services.AppointmentService;
import com.project.back_end.services.Service;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("${api.path}" + "appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private Service service;

    @GetMapping("/{date}/{patientName}/{token}")
    public ResponseEntity<Map<String, Object>> getAppointments(
            @PathVariable String date,
            @PathVariable String patientName,
            @PathVariable String token
    ) {
        Map<String, String> validationErrors = service.validateToken(token, "doctor");

        if (!validationErrors.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", validationErrors.get("error"));
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        Map<String, Object> response =
                appointmentService.getAppointment(patientName, LocalDate.parse(date), token);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{token}")
    public ResponseEntity<Map<String, String>> bookAppointment(
            @Valid @RequestBody Appointment appointment,
            @PathVariable String token
    ) {
        Map<String, String> validationErrors = service.validateToken(token, "patient");

        if (!validationErrors.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(validationErrors);
        }

        int validation = service.validateAppointment(appointment);

        Map<String, String> response = new HashMap<>();

        if (validation == -1) {
            response.put("error", "Doctor not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        if (validation == 0) {
            response.put("error", "Appointment time is unavailable");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        int result = appointmentService.bookAppointment(appointment);

        if (result == 1) {
            response.put("message", "Appointment booked successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        response.put("error", "Some internal error occurred");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @PutMapping("/{token}")
    public ResponseEntity<Map<String, String>> updateAppointment(
            @Valid @RequestBody Appointment appointment,
            @PathVariable String token
    ) {
        Map<String, String> validationErrors = service.validateToken(token, "patient");

        if (!validationErrors.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(validationErrors);
        }

        return appointmentService.updateAppointment(appointment);
    }

    @DeleteMapping("/{id}/{token}")
    public ResponseEntity<Map<String, String>> cancelAppointment(
            @PathVariable long id,
            @PathVariable String token
    ) {
        Map<String, String> validationErrors = service.validateToken(token, "patient");

        if (!validationErrors.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(validationErrors);
        }

        return appointmentService.cancelAppointment(id, token);
    }
}
