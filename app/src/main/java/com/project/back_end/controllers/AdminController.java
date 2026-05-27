package com.project.back_end.controllers;

import com.project.back_end.models.Admin;
import com.project.back_end.services.Service;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("${api.path}" + "admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private Service service;

    @PostMapping
    public ResponseEntity<Map<String, String>> adminLogin(@Valid @RequestBody Admin admin) {
        return service.validateAdmin(admin);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> adminLoginAlias(@Valid @RequestBody Admin admin) {
        return service.validateAdmin(admin);
    }
}
