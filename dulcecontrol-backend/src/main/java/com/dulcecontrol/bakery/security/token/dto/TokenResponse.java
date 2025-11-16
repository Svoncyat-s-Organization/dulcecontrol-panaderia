package com.dulcecontrol.bakery.security.token.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenResponse {
    private String accessToken;
    private String tokenType;
    private Long expiresIn; // segundos
}
