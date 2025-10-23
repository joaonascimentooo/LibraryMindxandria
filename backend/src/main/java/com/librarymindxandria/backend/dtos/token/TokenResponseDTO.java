package com.librarymindxandria.backend.dtos.token;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TokenResponseDTO {
    private String accessToken;
    private String refreshToken;
}
