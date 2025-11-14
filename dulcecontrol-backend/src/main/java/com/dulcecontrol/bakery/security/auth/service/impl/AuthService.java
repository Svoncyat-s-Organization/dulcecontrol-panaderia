package com.dulcecontrol.bakery.security.auth.service.impl;

import com.dulcecontrol.bakery.features.superadmin.seguridad.entity.UsuarioSuperadmin;
import com.dulcecontrol.bakery.features.superadmin.seguridad.repository.UsuarioSuperadminRepository;
import com.dulcecontrol.bakery.security.JwtProvider;
import com.dulcecontrol.bakery.security.auth.dto.UserProfileResponse;
import com.dulcecontrol.bakery.security.auth.service.IAuthService;
import com.dulcecontrol.bakery.shared.exception.AuthenticationException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {

    private final UsuarioSuperadminRepository usuarioSuperadminRepository;
    private final JwtProvider jwtProvider;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public String login(String correo, String contrasenaPlana) {
        // 1. Buscar usuario superadmin por correo
        UsuarioSuperadmin usuario = usuarioSuperadminRepository.findByCorreo(correo)
                .orElseThrow(() -> new AuthenticationException("Credenciales inválidas"));

        // 2. Verificar que el usuario esté activo
        if (!usuario.getActivo()) {
            throw new AuthenticationException("Usuario inactivo");
        }

        // 3. Validar contraseña
        if (!passwordEncoder.matches(contrasenaPlana, usuario.getHashContrasena())) {
            throw new AuthenticationException("Credenciales inválidas");
        }

        // 4. Generar JWT (sin persistencia en BD - stateless)
        return jwtProvider.generarToken(usuario.getCorreo(), "SUPERADMIN");
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse obtenerPerfilUsuario(String correo) {
        UsuarioSuperadmin usuario = usuarioSuperadminRepository.findByCorreo(correo)
                .orElseThrow(() -> new AuthenticationException("Usuario no encontrado"));

        return new UserProfileResponse(
                usuario.getId(),
                usuario.getCorreo(),
                usuario.getNombres(),
                "SUPERADMIN",
                usuario.getActivo());
    }
}
