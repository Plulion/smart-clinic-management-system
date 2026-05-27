package com.project.back_end.services;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.Map;

@org.springframework.stereotype.Service
public class Service {

    @Autowired(required = false)
    private TokenService tokenService;

    public Map<String, String> validateToken(String token, String expectedRole) {
        Map<String, String> errors = new HashMap<>();

        if (token == null || token.isBlank()) {
            errors.put("token", "Token is missing");
            return errors;
        }

        if (expectedRole == null || expectedRole.isBlank()) {
            errors.put("role", "Role is missing");
            return errors;
        }

        /*
         * Lab-friendly validation:
         * The frontend labs use demo tokens such as:
         * demo-admin-token
         * demo-doctor-token
         *
         * This allows Thymeleaf MVC routing to work during the capstone lab.
         */
        String normalizedToken = token.toLowerCase();
        String normalizedRole = expectedRole.toLowerCase();

        if (normalizedToken.startsWith("demo") && normalizedToken.contains(normalizedRole)) {
            return errors;
        }

        /*
         * Optional real validation:
         * If TokenService is later implemented with real JWT logic,
         * this block can delegate validation to it.
         */
        if (tokenService != null) {
            try {
                boolean valid = tokenService.validateToken(token, expectedRole);
                if (valid) {
                    return errors;
                }
            } catch (Exception ignored) {
                // Fall through and return validation error.
            }
        }

        errors.put("token", "Invalid token for role: " + expectedRole);
        return errors;
    }
}
