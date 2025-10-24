package com.voicetotrace.controller;

import com.voicetotrace.model.User;
import com.voicetotrace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    public com.voicetotrace.service.AuthService authService;


    public static class AuthRequest {
        public String username;
        public String password;
        public String role;
        @PostMapping("/logout")
        public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
            try {
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(java.util.Map.of("error", "Invalid token header"));
                }
                String token = authHeader.substring(7);
            com.voicetotrace.service.AuthService service = new com.voicetotrace.service.AuthService();
            service.logout(token);
                return ResponseEntity.ok(java.util.Map.of("message", "Logout successful"));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(java.util.Map.of("error", e.getMessage()));
            }
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            String token = authService.login(request.username, request.password);
            return ResponseEntity.ok(java.util.Map.of("token", token, "message", "Login successful"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        try {
            String token = authService.register(request.username, request.password,
                    request.role != null ? request.role : "USER");
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(java.util.Map.of("token", token, "message", "User registered successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("error", e.getMessage()));
        }
    }
}