package com.project.back_end.controllers;

import com.project.back_end.DTO.Login;
import com.project.back_end.models.Doctor;
import com.project.back_end.services.DoctorService;
import com.project.back_end.services.Service;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.path}" + "doctor")
@CrossOrigin(origins = "*")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private Service service;

    @GetMapping("/availability/{user}/{doctorId}/{date}/{token}")
    public ResponseEntity<Map<String, Object>> getDoctorAvailability(
            @PathVariable String user,
            @PathVariable Long doctorId,
            @PathVariable String date,
            @PathVariable String token
    ) {
        Map<String, String> validationErrors = service.validateToken(token, user);

        if (!validationErrors.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", validationErrors.get("error"));
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        List<String> availability = doctorService.getDoctorAvailability(doctorId, LocalDate.parse(date));

        Map<String, Object> response = new HashMap<>();
        response.put("availability", availability);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDoctors() {
        Map<String, Object> response = new HashMap<>();
        response.put("doctors", doctorService.getDoctors());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{token}")
    public ResponseEntity<Map<String, String>> addDoctor(
            @Valid @RequestBody Doctor doctor,
            @PathVariable String token
    ) {
        Map<String, String> validationErrors = service.validateToken(token, "admin");

        if (!validationErrors.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(validationErrors);
        }

        int result = doctorService.saveDoctor(doctor);

        Map<String, String> response = new HashMap<>();

        if (result == 1) {
            response.put("message", "Doctor added to db");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        if (result == -1) {
            response.put("error", "Doctor already exists");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        response.put("error", "Some internal error occurred");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> doctorLogin(@Valid @RequestBody Login login) {
        return doctorService.validateDoctor(login);
    }

    @PutMapping("/{token}")
    public ResponseEntity<Map<String, String>> updateDoctor(
            @Valid @RequestBody Doctor doctor,
            @PathVariable String token
    ) {
        Map<String, String> validationErrors = service.validateToken(token, "admin");

        if (!validationErrors.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(validationErrors);
        }

        int result = doctorService.updateDoctor(doctor);

        Map<String, String> response = new HashMap<>();

        if (result == 1) {
            response.put("message", "Doctor updated");
            return ResponseEntity.ok(response);
        }

        if (result == -1) {
            response.put("error", "Doctor not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        response.put("error", "Some internal error occurred");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @DeleteMapping("/{id}/{token}")
    public ResponseEntity<Map<String, String>> deleteDoctor(
            @PathVariable long id,
            @PathVariable String token
    ) {
        Map<String, String> validationErrors = service.validateToken(token, "admin");

        if (!validationErrors.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(validationErrors);
        }

        int result = doctorService.deleteDoctor(id);

        Map<String, String> response = new HashMap<>();

        if (result == 1) {
            response.put("message", "Doctor deleted successfully");
            return ResponseEntity.ok(response);
        }

        if (result == -1) {
            response.put("error", "Doctor not found with id");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        response.put("error", "Some internal error occurred");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @GetMapping("/filter/{name}/{time}/{speciality}")
    public ResponseEntity<Map<String, Object>> filterDoctors(
            @PathVariable String name,
            @PathVariable String time,
            @PathVariable String speciality
    ) {
        return ResponseEntity.ok(service.filterDoctor(name, speciality, time));
    }
}
