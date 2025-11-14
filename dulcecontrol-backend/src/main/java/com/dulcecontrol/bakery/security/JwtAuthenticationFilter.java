package com.dulcecontrol.bakery.security;

import com.dulcecontrol.bakery.features.superadmin.seguridad.entity.UsuarioSuperadmin;
import com.dulcecontrol.bakery.features.superadmin.seguridad.repository.UsuarioSuperadminRepository;
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

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final UsuarioSuperadminRepository usuarioSuperadminRepository;

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

                usuarioSuperadminRepository.findByCorreo(correo)
                        .ifPresent(usuario -> autenticarUsuario(usuario, request));
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

    private void autenticarUsuario(UsuarioSuperadmin usuario, HttpServletRequest request) {
        // Verificar que el usuario esté activo
        if (!usuario.getActivo()) {
            return;
        }

        List<SimpleGrantedAuthority> authorities = Collections.singletonList(
            new SimpleGrantedAuthority("ROLE_SUPERADMIN")
        );

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                usuario.getCorreo(), null, authorities);
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
    }
}
