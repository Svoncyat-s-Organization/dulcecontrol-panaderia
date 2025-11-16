package com.dulcecontrol.bakery.security.token.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenProfileResponse {
    private Long id;
    private String nombreCompleto;
    private String correo;
    private Boolean activo;
}
