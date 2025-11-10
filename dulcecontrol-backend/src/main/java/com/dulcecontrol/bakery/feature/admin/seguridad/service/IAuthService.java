package com.dulcecontrol.bakery.feature.admin.seguridad.service;

public interface IAuthService {
    /**
     * Autentica a un usuario y devuelve un token JWT.
     * 
     * @param correo     El correo del usuario.
     * @param contrasena La contraseña en texto plano.
     * @return Token JWT válido.
     */
    String login(String correo, String contrasena);
}