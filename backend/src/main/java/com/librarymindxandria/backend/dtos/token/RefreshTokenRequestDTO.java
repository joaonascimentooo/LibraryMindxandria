package com.librarymindxandria.backend.dtos.token;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefreshTokenRequestDTO {
    private String refreshToken;
}
