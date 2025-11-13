package com.dulcecontrol.bakery.security.auth.service;

import com.dulcecontrol.bakery.security.auth.dto.UserProfileResponse;

public interface IAuthService {
    String login(String correo, String contrasenaPlana);

    /**
     * Obtiene el perfil del usuario autenticado por su correo extraído del JWT.
     * 
     * @param correo Correo del usuario autenticado
     * @return Datos del perfil del usuario
     */
    UserProfileResponse obtenerPerfilUsuario(String correo);
}
