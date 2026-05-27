package com.project.back_end.controllers;

import com.project.back_end.DTO.Login;
import com.project.back_end.models.Patient;
import com.project.back_end.services.PatientService;
import com.project.back_end.services.Service;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("${api.path}" + "patient")
@CrossOrigin(origins = "*")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private Service service;

    @GetMapping("/{token}")
    public ResponseEntity<Map<String, Object>> getPatientDetails(@PathVariable String token) {
        Map<String, String> validationErrors = service.validateToken(token, "patient");

        if (!validationErrors.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", validationErrors.get("error"));
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        return patientService.getPatientDetails(token);
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> createPatient(@Valid @RequestBody Patient patient) {
        Map<String, String> response = new HashMap<>();

        if (!service.validatePatient(patient)) {
            response.put("error", "Patient with email id or phone no already exist");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        int result = patientService.createPatient(patient);

        if (result == 1) {
            response.put("message", "Signup successful");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        response.put("error", "Internal server error");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> patientLogin(@Valid @RequestBody Login login) {
        return service.validatePatientLogin(login);
    }

    @GetMapping("/{id}/{token}")
    public ResponseEntity<Map<String, Object>> getPatientAppointments(
            @PathVariable Long id,
            @PathVariable String token
    ) {
        Map<String, String> validationErrors = service.validateToken(token, "patient");

        if (!validationErrors.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", validationErrors.get("error"));
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        return patientService.getPatientAppointment(id, token);
    }

    @GetMapping("/filter/{condition}/{name}/{token}")
    public ResponseEntity<Map<String, Object>> filterPatientAppointments(
            @PathVariable String condition,
            @PathVariable String name,
            @PathVariable String token
    ) {
        Map<String, String> validationErrors = service.validateToken(token, "patient");

        if (!validationErrors.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", validationErrors.get("error"));
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        return service.filterPatient(condition, name, token);
    }
}
