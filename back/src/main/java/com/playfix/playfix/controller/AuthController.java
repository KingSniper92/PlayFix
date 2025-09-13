package com.playfix.playfix.controller;

import com.playfix.playfix.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Habilitar CORS para que tu JS pueda llamar desde otro origen

public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Clase interna para recibir el JSON {email, password}
    public static class LoginRequest {
        public String email;
        public String password;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        boolean success = authService.login(request.email, request.password);
        if (success) {
            return ResponseEntity.ok().body("{\"message\":\"Login exitoso\"}");
        } else {
            return ResponseEntity.status(401).body("{\"message\":\"Credenciales inválidas\"}");
        }
    }

}
