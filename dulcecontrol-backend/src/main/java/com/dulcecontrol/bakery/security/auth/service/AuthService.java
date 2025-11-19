package com.dulcecontrol.bakery.security.auth.service;

import com.dulcecontrol.bakery.features.admin.clientes.entity.Cliente;
import com.dulcecontrol.bakery.features.admin.clientes.repository.ClienteRepository;
import com.dulcecontrol.bakery.features.admin.seguridad.entity.UsuarioTienda;
import com.dulcecontrol.bakery.features.admin.seguridad.repository.UsuarioTiendaRepository;
import com.dulcecontrol.bakery.features.superadmin.seguridad.entity.UsuarioSuperadmin;
import com.dulcecontrol.bakery.features.superadmin.seguridad.repository.UsuarioSuperadminRepository;
import com.dulcecontrol.bakery.security.JwtProvider;
import com.dulcecontrol.bakery.security.TipoUsuario;
import com.dulcecontrol.bakery.security.auth.dto.AdminLoginRequest;
import com.dulcecontrol.bakery.security.auth.dto.AuthTokenResponse;
import com.dulcecontrol.bakery.security.auth.dto.StorefrontLoginRequest;
import com.dulcecontrol.bakery.security.auth.dto.SuperadminLoginRequest;
import com.dulcecontrol.bakery.shared.exception.AuthenticationException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioSuperadminRepository usuarioSuperadminRepository;
    private final UsuarioTiendaRepository usuarioTiendaRepository;
    private final ClienteRepository clienteRepository;
    private final JwtProvider jwtProvider;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthTokenResponse loginSuperadmin(SuperadminLoginRequest request) {
        String email = normalizarCorreo(request.getEmail());
        UsuarioSuperadmin usuario = usuarioSuperadminRepository.findByCorreo(email)
                .orElseThrow(() -> new AuthenticationException("Credenciales inválidas"));

        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            throw new AuthenticationException("Usuario inactivo");
        }

        validarPassword(request.getPassword(), usuario.getHashContrasena());

        String token = jwtProvider.generarToken(usuario.getCorreo(), "ROLE_SUPERADMIN", TipoUsuario.SUPERADMIN, null);
        return buildResponse(token, TipoUsuario.SUPERADMIN, null);
    }

    public AuthTokenResponse loginAdmin(AdminLoginRequest request) {
        String email = normalizarCorreo(request.getEmail());
        UsuarioTienda usuario = usuarioTiendaRepository.findByCorreo(email)
                .orElseThrow(() -> new AuthenticationException("Credenciales inválidas"));

        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            throw new AuthenticationException("Usuario inactivo");
        }

        validarPassword(request.getPassword(), usuario.getHashContrasena());

        Long tiendaId = usuario.getTiendaId();
        String token = jwtProvider.generarToken(usuario.getCorreo(), "ROLE_TIENDA", TipoUsuario.TIENDA, tiendaId);
        return buildResponse(token, TipoUsuario.TIENDA, tiendaId);
    }

    public AuthTokenResponse loginStorefront(StorefrontLoginRequest request) {
        Long tiendaId = request.getTiendaId();
        String email = normalizarCorreo(request.getEmail());
        Cliente cliente = clienteRepository.findByTiendaIdAndEmail(tiendaId, email)
                .orElseThrow(() -> new AuthenticationException("Credenciales inválidas"));

        if (!Boolean.TRUE.equals(cliente.getActivo())) {
            throw new AuthenticationException("Usuario inactivo");
        }

        validarPassword(request.getPassword(), cliente.getHashContrasena());

        String token = jwtProvider.generarToken(cliente.getEmail(), "ROLE_CLIENTE", TipoUsuario.CLIENTE, tiendaId);
        return buildResponse(token, TipoUsuario.CLIENTE, tiendaId);
    }

    private void validarPassword(String rawPassword, String hash) {
        if (hash == null || !passwordEncoder.matches(rawPassword, hash)) {
            throw new AuthenticationException("Credenciales inválidas");
        }
    }

    private String normalizarCorreo(String email) {
        if (email == null) {
            return null;
        }
        return email.trim().toLowerCase();
    }

    private AuthTokenResponse buildResponse(String token, TipoUsuario tipoUsuario, Long tiendaId) {
        return AuthTokenResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(jwtProvider.getExpirationTime())
                .userType(tipoUsuario)
                .tiendaId(tiendaId)
                .build();
    }
}
