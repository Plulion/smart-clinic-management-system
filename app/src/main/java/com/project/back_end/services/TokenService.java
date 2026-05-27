package com.project.back_end.services;

@org.springframework.stereotype.Service
public class TokenService {

    public boolean validateToken(String token, String expectedRole) {
        if (token == null || expectedRole == null) {
            return false;
        }

        String normalizedToken = token.toLowerCase();
        String normalizedRole = expectedRole.toLowerCase();

        return normalizedToken.startsWith("demo") && normalizedToken.contains(normalizedRole);
    }
}
