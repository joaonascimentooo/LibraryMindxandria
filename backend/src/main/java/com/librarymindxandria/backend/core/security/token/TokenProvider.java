package com.librarymindxandria.backend.core.security.token;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class TokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(TokenProvider.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration-ms}")
    private long jwtExpirationMs;

    public String generateAccessToken(Authentication authentication) {
        String username = authentication.getName();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        Algorithm algorithm = Algorithm.HMAC512(jwtSecret);

        return JWT.create()
                .withSubject(username)
                .withIssuedAt(now)
                .withExpiresAt(expiryDate)
                .sign(algorithm);
    }

    public String getUsernameFromJWT(String token) {
        Algorithm algorithm = Algorithm.HMAC512(jwtSecret);
        JWTVerifier verifier = JWT.require(algorithm).build();

        DecodedJWT decodedJWT = verifier.verify(token);
        return decodedJWT.getSubject();
    }


    public boolean validateToken(String authToken) {
        try {
            Algorithm algorithm = Algorithm.HMAC512(jwtSecret);
            JWTVerifier verifier = JWT.require(algorithm).build();

            verifier.verify(authToken);
            return true;
        } catch (JWTVerificationException exception) {
            logger.error("Validação do Token JWT falhou: {}", exception.getMessage());
        }
        return false;
    }
}