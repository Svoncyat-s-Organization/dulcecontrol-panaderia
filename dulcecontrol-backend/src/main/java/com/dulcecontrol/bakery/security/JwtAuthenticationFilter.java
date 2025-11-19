package com.dulcecontrol.bakery.security;

import com.dulcecontrol.bakery.features.admin.clientes.entity.Cliente;
import com.dulcecontrol.bakery.features.admin.clientes.repository.ClienteRepository;
import com.dulcecontrol.bakery.features.admin.seguridad.entity.UsuarioTienda;
import com.dulcecontrol.bakery.features.admin.seguridad.repository.UsuarioTiendaRepository;
import com.dulcecontrol.bakery.features.superadmin.seguridad.entity.UsuarioSuperadmin;
import com.dulcecontrol.bakery.features.superadmin.seguridad.repository.UsuarioSuperadminRepository;
import com.dulcecontrol.bakery.security.token.entity.DesarrolladorToken;
import com.dulcecontrol.bakery.security.token.repository.DesarrolladorTokenRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import com.dulcecontrol.bakery.security.TipoUsuario;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final DesarrolladorTokenRepository desarrolladorTokenRepository;
    private final UsuarioSuperadminRepository usuarioSuperadminRepository;
    private final UsuarioTiendaRepository usuarioTiendaRepository;
    private final ClienteRepository clienteRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        String token = extraerToken(header);

        try {
            if (token != null && jwtProvider.validarToken(token) &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                String correo = jwtProvider.extraerCorreo(token);
                TipoUsuario tipoUsuario = jwtProvider.extraerTipoUsuario(token);
                if (tipoUsuario == null) {
                    tipoUsuario = TipoUsuario.DEVELOPER; // Backward compatibility
                }
                Long tiendaId = jwtProvider.extraerTiendaId(token);

                switch (tipoUsuario) {
                    case SUPERADMIN -> autenticarSuperadmin(correo, request);
                    case TIENDA -> autenticarUsuarioTienda(correo, tiendaId, request);
                    case CLIENTE -> autenticarCliente(correo, tiendaId, request);
                    case DEVELOPER -> autenticarDesarrollador(correo, request);
                }
            }
        } catch (Exception ex) {
            log.debug("Error validando token JWT: {}", ex.getMessage());
            // Si hay un error en el token, continuamos sin autenticación.
        }

        filterChain.doFilter(request, response);
    }

    private String extraerToken(String header) {
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }

    private void autenticarDesarrollador(String correo, HttpServletRequest request) {
        desarrolladorTokenRepository.findByCorreo(correo)
                .filter(DesarrolladorToken::getActivo)
                .ifPresent(dev -> establecerAutenticacion(dev.getCorreo(), TipoUsuario.DEVELOPER, null, request));
    }

    private void autenticarSuperadmin(String correo, HttpServletRequest request) {
        usuarioSuperadminRepository.findByCorreo(correo)
                .filter(usuario -> Boolean.TRUE.equals(usuario.getActivo()))
                .ifPresent(usuario -> establecerAutenticacion(usuario.getCorreo(), TipoUsuario.SUPERADMIN, null, request));
    }

    private void autenticarUsuarioTienda(String correo, Long tiendaIdToken, HttpServletRequest request) {
        usuarioTiendaRepository.findByCorreo(correo)
                .ifPresent(usuario -> {
                    if (!Boolean.TRUE.equals(usuario.getActivo())) {
                        return;
                    }
                    if (tiendaIdToken != null && !tiendaIdToken.equals(usuario.getTiendaId())) {
                        log.debug("El token de tienda no coincide con la tienda del usuario");
                        return;
                    }
                    establecerAutenticacion(usuario.getCorreo(), TipoUsuario.TIENDA, usuario.getTiendaId(), request);
                });
    }

    private void autenticarCliente(String correo, Long tiendaId, HttpServletRequest request) {
        if (tiendaId == null) {
            log.debug("Token de cliente sin tiendaId");
            return;
        }
        clienteRepository.findByTiendaIdAndEmail(tiendaId, correo)
                .ifPresent(cliente -> establecerAutenticacion(cliente.getEmail(), TipoUsuario.CLIENTE, tiendaId, request));
    }

    private void establecerAutenticacion(String principal, TipoUsuario tipoUsuario, Long tiendaId,
            HttpServletRequest request) {
        List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + tipoUsuario.name()));

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                principal, null, authorities);
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        request.setAttribute("tiendaId", tiendaId);
        request.setAttribute("userType", tipoUsuario);

        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
    }
}
