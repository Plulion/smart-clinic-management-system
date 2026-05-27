package com.project.back_end.DTO;

import jakarta.validation.constraints.NotBlank;

public class Login {

    @NotBlank(message = "Identifier is required")
    private String identifier;

    @NotBlank(message = "Password is required")
    private String password;

    public Login() {
    }

    public Login(String identifier, String password) {
        this.identifier = identifier;
        this.password = password;
    }

    public String getIdentifier() {
        return identifier;
    }

    public String getPassword() {
        return password;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // Compatibility with frontend payloads that send "email"
    public String getEmail() {
        return identifier;
    }

    public void setEmail(String email) {
        this.identifier = email;
    }

    // Compatibility with admin payloads that send "username"
    public String getUsername() {
        return identifier;
    }

    public void setUsername(String username) {
        this.identifier = username;
    }
}
