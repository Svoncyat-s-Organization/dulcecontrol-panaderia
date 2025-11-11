package com.dulcecontrol.bakery.feature.admin.seguridad.service.impl;

import com.dulcecontrol.bakery.feature.admin.seguridad.entity.UsuarioTienda;
import com.dulcecontrol.bakery.feature.admin.seguridad.entity.UsuarioToken;
import com.dulcecontrol.bakery.feature.admin.seguridad.repository.UsuarioTiendaRepository;
import com.dulcecontrol.bakery.feature.admin.seguridad.repository.UsuarioTokenRepository;
import com.dulcecontrol.bakery.feature.admin.seguridad.service.IAuthService;
import com.dulcecontrol.bakery.security.JwtProvider;
import com.dulcecontrol.bakery.shared.exception.AuthenticationException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {

    private final UsuarioTiendaRepository usuarioRepository;
    private final UsuarioTokenRepository tokenRepository;
    private final JwtProvider jwtProvider;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public String login(String correo, String contrasenaPlana) {
        // 1. Buscar usuario activo por correo
        UsuarioTienda usuario = usuarioRepository.findByCorreoAndActivo(correo)
                .orElseThrow(() -> new AuthenticationException("Credenciales inválidas"));

        // 2. Validar contraseña
        if (!passwordEncoder.matches(contrasenaPlana, usuario.getHashContrasena())) {
            throw new AuthenticationException("Credenciales inválidas");
        }

        // 3. Generar JWT
        String token = jwtProvider.generarToken(usuario.getCorreo(), usuario.getRolId().toString());

        // 4. Guardar token en base de datos
        UsuarioToken sesion = new UsuarioToken();
        sesion.setUsuario(usuario);
        sesion.setTokenHash(token);
        sesion.setTipo("sesion");
        sesion.setExpiraEn(LocalDateTime.now().plusSeconds(jwtProvider.getExpirationTime()));

        tokenRepository.save(sesion);

        // 5. Actualizar último acceso del usuario
        usuario.setUltimoAccesoEn(LocalDateTime.now());
        usuarioRepository.save(usuario);

        return token;
    }
}
