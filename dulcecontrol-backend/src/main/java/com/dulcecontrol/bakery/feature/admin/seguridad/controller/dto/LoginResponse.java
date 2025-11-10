package com.dulcecontrol.bakery.feature.admin.seguridad.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String accessToken;
    private String tokenType;
    private Long expiresIn; // segundos hasta expiración
}
