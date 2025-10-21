package com.librarymindxandria.backend.controllers;

import com.librarymindxandria.backend.dtos.LoginRequestDTO;
import com.librarymindxandria.backend.dtos.RefreshTokenRequestDTO;
import com.librarymindxandria.backend.dtos.RegisterRequestDTO;
import com.librarymindxandria.backend.dtos.TokenResponseDTO;
import com.librarymindxandria.backend.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> authenticateUser(@Valid @RequestBody LoginRequestDTO loginRequest) {
        TokenResponseDTO tokenResponse = authService.loginUser(loginRequest);
        return ResponseEntity.ok(tokenResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequestDTO signUpRequest) {
        try {
            authService.registerUser(signUpRequest);
            return ResponseEntity.ok("Usuário registrado com sucesso!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponseDTO> refreshToken(@Valid @RequestBody RefreshTokenRequestDTO request) {
        try {
            TokenResponseDTO tokenResponse = authService.refreshToken(request);
            return ResponseEntity.ok(tokenResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new TokenResponseDTO(null, e.getMessage()));
        }
    }
}
