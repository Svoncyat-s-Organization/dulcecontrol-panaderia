package com.dulcecontrol.bakery.shared.sede;

import com.dulcecontrol.bakery.features.admin.configuracion.repository.SedeAdminRepository;
import com.dulcecontrol.bakery.features.admin.seguridad.entity.UsuarioSedeId;
import com.dulcecontrol.bakery.features.admin.seguridad.entity.UsuarioTienda;
import com.dulcecontrol.bakery.features.admin.seguridad.repository.UsuarioSedeRepository;
import com.dulcecontrol.bakery.features.admin.seguridad.repository.UsuarioTiendaRepository;
import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.Sede;
import com.dulcecontrol.bakery.security.TipoUsuario;
import com.dulcecontrol.bakery.shared.exception.AuthenticationException;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ForbiddenException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class SedeContextFilter extends OncePerRequestFilter {

    public static final String HEADER_SEDE_ID = "X-Sede-Id";

    private final UsuarioTiendaRepository usuarioTiendaRepository;
    private final UsuarioSedeRepository usuarioSedeRepository;
    private final SedeAdminRepository sedeAdminRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        try {
            aplicarContexto(request);
            filterChain.doFilter(request, response);
        } finally {
            SedeContextHolder.clear();
        }
    }

    private void aplicarContexto(HttpServletRequest request) {
        if (shouldSkip(request)) {
            return;
        }

        String headerValue = request.getHeader(HEADER_SEDE_ID);
        if (!StringUtils.hasText(headerValue)) {
            return;
        }

        Long sedeId = parseSedeId(headerValue);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AuthenticationException("Usuario no autenticado");
        }

        String correo = authentication.getName();
        if (!StringUtils.hasText(correo)) {
            throw new AuthenticationException("No se pudo determinar el usuario autenticado");
        }

        UsuarioTienda usuario = usuarioTiendaRepository.findByCorreo(correo)
                .orElseThrow(() -> new AuthenticationException("Usuario de tienda no encontrado"));

        usuarioSedeRepository.findById(new UsuarioSedeId(usuario.getId(), sedeId))
                .orElseThrow(() -> new ForbiddenException("No tienes acceso a la sede seleccionada"));

        Sede sede = sedeAdminRepository.findById(sedeId)
                .orElseThrow(() -> new ResourceNotFoundException("La sede seleccionada no existe"));

        if (Boolean.FALSE.equals(sede.getActivo())) {
            throw new ForbiddenException("La sede seleccionada está inactiva");
        }

        if (sede.getTienda() == null || !usuario.getTiendaId().equals(sede.getTienda().getId())) {
            throw new ForbiddenException("La sede no pertenece a tu tienda");
        }

        SedeContextHolder.set(new SedeContext(
                sede.getId(),
                sede.getTienda().getId(),
                sede.getNombre(),
                Boolean.TRUE.equals(sede.getEsPrincipal())));
    }

    private boolean shouldSkip(HttpServletRequest request) {
        Object userTypeAttr = request.getAttribute("userType");
        if (!(userTypeAttr instanceof TipoUsuario tipoUsuario)) {
            return true;
        }
        return tipoUsuario != TipoUsuario.ADMIN;
    }

    private Long parseSedeId(String raw) {
        try {
            return Long.parseLong(raw);
        } catch (NumberFormatException ex) {
            log.debug("Cabecera X-Sede-Id inválida: {}", raw);
            throw new BadRequestException("El valor de X-Sede-Id debe ser numérico");
        }
    }
}
