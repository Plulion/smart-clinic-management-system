package com.project.back_end.mvc;

import com.project.back_end.services.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@Controller
public class DashboardController {

    @Autowired
    private Service service;

    @GetMapping("/")
    public String index() {
        return "redirect:/index.html";
    }

    @GetMapping("/admin/dashboard")
    public String adminDashboardFallback() {
        return "admin/adminDashboard";
    }

    @GetMapping("/doctor/dashboard")
    public String doctorDashboardFallback() {
        return "doctor/doctorDashboard";
    }

    @GetMapping("/adminDashboard/{token}")
    public String adminDashboard(@PathVariable String token) {
        Map<String, String> validationErrors = service.validateToken(token, "admin");

        if (validationErrors == null || validationErrors.isEmpty()) {
            return "admin/adminDashboard";
        }

        return "redirect:/";
    }

    @GetMapping("/doctorDashboard/{token}")
    public String doctorDashboard(@PathVariable String token) {
        Map<String, String> validationErrors = service.validateToken(token, "doctor");

        if (validationErrors == null || validationErrors.isEmpty()) {
            return "doctor/doctorDashboard";
        }

        return "redirect:/";
    }
}
