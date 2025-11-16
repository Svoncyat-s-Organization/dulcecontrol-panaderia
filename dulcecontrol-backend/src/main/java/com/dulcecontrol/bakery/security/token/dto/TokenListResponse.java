package com.dulcecontrol.bakery.security.token.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenListResponse {
    private Long id;
    private String nombreCompleto;
    private String correo;
    private Boolean activo;
    private LocalDateTime creadoEn;
}
