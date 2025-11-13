package com.dulcecontrol.bakery.security.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para devolver el perfil del usuario autenticado.
 * Usado en el endpoint GET /api/v1/auth/me
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String correo;
    private String nombreCompleto;
    private String rol; // "SUPERADMIN"
    private Boolean activo;
}
