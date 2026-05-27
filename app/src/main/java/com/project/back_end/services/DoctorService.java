package com.project.back_end.services;

import com.project.back_end.DTO.Login;
import com.project.back_end.models.Appointment;
import com.project.back_end.models.Doctor;
import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.repo.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private TokenService tokenService;

    public List<String> getDoctorAvailability(Long doctorId, LocalDate date) {
        Optional<Doctor> optionalDoctor = doctorRepository.findById(doctorId);

        if (optionalDoctor.isEmpty()) {
            return Collections.emptyList();
        }

        Doctor doctor = optionalDoctor.get();
        List<String> availableTimes = doctor.getAvailableTimes();

        if (availableTimes == null) {
            return Collections.emptyList();
        }

        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();

        List<Appointment> appointments =
                appointmentRepository.findByDoctorIdAndAppointmentTimeBetween(doctorId, start, end);

        Set<String> bookedTimes = appointments.stream()
                .map(appointment -> appointment.getAppointmentTime().toLocalTime().toString())
                .collect(Collectors.toSet());

        return availableTimes.stream()
                .filter(slot -> {
                    String startTime = slot.contains("-") ? slot.split("-")[0] : slot;
                    return !bookedTimes.contains(startTime);
                })
                .collect(Collectors.toList());
    }

    public int saveDoctor(Doctor doctor) {
        try {
            Doctor existingDoctor = doctorRepository.findByEmail(doctor.getEmail());

            if (existingDoctor != null) {
                return -1;
            }

            doctorRepository.save(doctor);
            return 1;
        } catch (Exception error) {
            return 0;
        }
    }

    public int updateDoctor(Doctor doctor) {
        try {
            if (doctor.getId() == null || doctorRepository.findById(doctor.getId()).isEmpty()) {
                return -1;
            }

            doctorRepository.save(doctor);
            return 1;
        } catch (Exception error) {
            return 0;
        }
    }

    public List<Doctor> getDoctors() {
        return doctorRepository.findAll();
    }

    public int deleteDoctor(long id) {
        try {
            Optional<Doctor> optionalDoctor = doctorRepository.findById(id);

            if (optionalDoctor.isEmpty()) {
                return -1;
            }

            appointmentRepository.deleteAllByDoctorId(id);
            doctorRepository.deleteById(id);

            return 1;
        } catch (Exception error) {
            return 0;
        }
    }

    public ResponseEntity<Map<String, String>> validateDoctor(Login login) {
        Map<String, String> response = new HashMap<>();

        String identifier = login.getIdentifier();

        if (identifier == null || identifier.isBlank()) {
            identifier = login.getEmail();
        }

        Doctor doctor = doctorRepository.findByEmail(identifier);

        if (doctor == null || !doctor.getPassword().equals(login.getPassword())) {
            response.put("error", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        response.put("token", tokenService.generateToken(doctor.getEmail()));
        response.put("id", String.valueOf(doctor.getId()));
        response.put("message", "Doctor login successful");

        return ResponseEntity.ok(response);
    }

    public Map<String, Object> findDoctorByName(String name) {
        Map<String, Object> response = new HashMap<>();
        response.put("doctors", doctorRepository.findByNameLike(name));
        return response;
    }

    public Map<String, Object> filterDoctorsByNameSpecilityandTime(String name, String specialty, String amOrPm) {
        List<Doctor> doctors = doctorRepository.findByNameContainingIgnoreCaseAndSpecialtyIgnoreCase(name, specialty);
        return wrapDoctors(filterDoctorByTime(doctors, amOrPm));
    }

    public Map<String, Object> filterDoctorByNameAndTime(String name, String amOrPm) {
        List<Doctor> doctors = doctorRepository.findByNameLike(name);
        return wrapDoctors(filterDoctorByTime(doctors, amOrPm));
    }

    public Map<String, Object> filterDoctorByNameAndSpecility(String name, String specialty) {
        return wrapDoctors(doctorRepository.findByNameContainingIgnoreCaseAndSpecialtyIgnoreCase(name, specialty));
    }

    public Map<String, Object> filterDoctorByTimeAndSpecility(String specialty, String amOrPm) {
        List<Doctor> doctors = doctorRepository.findBySpecialtyIgnoreCase(specialty);
        return wrapDoctors(filterDoctorByTime(doctors, amOrPm));
    }

    public Map<String, Object> filterDoctorBySpecility(String specialty) {
        return wrapDoctors(doctorRepository.findBySpecialtyIgnoreCase(specialty));
    }

    public Map<String, Object> filterDoctorsByTime(String amOrPm) {
        return wrapDoctors(filterDoctorByTime(doctorRepository.findAll(), amOrPm));
    }

    private Map<String, Object> wrapDoctors(List<Doctor> doctors) {
        Map<String, Object> response = new HashMap<>();
        response.put("doctors", doctors);
        return response;
    }

    private List<Doctor> filterDoctorByTime(List<Doctor> doctors, String amOrPm) {
        if (amOrPm == null || amOrPm.isBlank()) {
            return doctors;
        }

        String normalized = amOrPm.trim().toUpperCase();

        return doctors.stream()
                .filter(doctor -> {
                    List<String> availableTimes = doctor.getAvailableTimes();

                    if (availableTimes == null) {
                        return false;
                    }

                    return availableTimes.stream().anyMatch(slot -> {
                        try {
                            String startTime = slot.contains("-") ? slot.split("-")[0] : slot;
                            int hour = Integer.parseInt(startTime.split(":")[0]);

                            if ("AM".equals(normalized)) {
                                return hour < 12;
                            }

                            if ("PM".equals(normalized)) {
                                return hour >= 12;
                            }

                            return slot.contains(amOrPm);
                        } catch (Exception error) {
                            return false;
                        }
                    });
                })
                .collect(Collectors.toList());
    }
}
