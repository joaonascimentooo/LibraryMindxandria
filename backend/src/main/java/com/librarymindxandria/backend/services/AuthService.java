package com.librarymindxandria.backend.services;

import com.librarymindxandria.backend.core.security.token.RefreshToken;
import com.librarymindxandria.backend.core.security.token.RefreshTokenService;
import com.librarymindxandria.backend.core.security.token.TokenProvider;
import com.librarymindxandria.backend.dtos.LoginRequestDTO;
import com.librarymindxandria.backend.dtos.RefreshTokenRequestDTO;
import com.librarymindxandria.backend.dtos.RegisterRequestDTO;
import com.librarymindxandria.backend.dtos.TokenResponseDTO;
import com.librarymindxandria.backend.models.User;
import com.librarymindxandria.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;

    @Transactional
    public void registerUser(RegisterRequestDTO signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Erro: Email já está em uso!");
        }

        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));

        userRepository.save(user);
    }

    @Transactional
    public TokenResponseDTO loginUser(LoginRequestDTO loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = tokenProvider.generateAccessToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado após login"));

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return new TokenResponseDTO(accessToken, refreshToken.getToken());
    }

    @Transactional
    public TokenResponseDTO refreshToken(RefreshTokenRequestDTO request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), null, new ArrayList<>());
                    String newAccessToken = tokenProvider.generateAccessToken(authentication);

                    RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user.getId());
                    return new TokenResponseDTO(newAccessToken, newRefreshToken.getToken());
                })
                .orElseThrow(() -> new RuntimeException("Refresh token não encontrado no banco de dados!"));
    }
}