package com.dulcecontrol.bakery.security.auth.service;

import com.dulcecontrol.bakery.features.admin.clientes.entity.Cliente;
import com.dulcecontrol.bakery.features.admin.clientes.repository.ClienteRepository;
import com.dulcecontrol.bakery.features.admin.seguridad.entity.UsuarioTienda;
import com.dulcecontrol.bakery.features.admin.seguridad.repository.UsuarioTiendaRepository;
import com.dulcecontrol.bakery.features.superadmin.seguridad.entity.UsuarioSuperadmin;
import com.dulcecontrol.bakery.features.superadmin.seguridad.repository.UsuarioSuperadminRepository;
import com.dulcecontrol.bakery.features.superadmin.suscripciones.entity.Plan;
import com.dulcecontrol.bakery.features.superadmin.suscripciones.entity.Suscripcion;
import com.dulcecontrol.bakery.features.superadmin.suscripciones.entity.enums.EstadoSuscripcion;
import com.dulcecontrol.bakery.features.superadmin.suscripciones.repository.SuscripcionRepository;
import com.dulcecontrol.bakery.security.JwtProvider;
import com.dulcecontrol.bakery.security.TipoUsuario;
import com.dulcecontrol.bakery.security.auth.dto.AdminLoginRequest;
import com.dulcecontrol.bakery.security.auth.dto.AuthTokenResponse;
import com.dulcecontrol.bakery.security.auth.dto.StorefrontLoginRequest;
import com.dulcecontrol.bakery.security.auth.dto.SubscriptionStatusPayload;
import com.dulcecontrol.bakery.security.auth.dto.SuperadminLoginRequest;
import com.dulcecontrol.bakery.shared.exception.AuthenticationException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioSuperadminRepository usuarioSuperadminRepository;
    private final UsuarioTiendaRepository usuarioTiendaRepository;
    private final ClienteRepository clienteRepository;
    private final SuscripcionRepository suscripcionRepository;
    private final JwtProvider jwtProvider;
    private final BCryptPasswordEncoder passwordEncoder;

    private static final Set<EstadoSuscripcion> ESTADOS_VIGENTES =
            EnumSet.of(EstadoSuscripcion.EN_PRUEBA, EstadoSuscripcion.ACTIVA);

    public AuthTokenResponse loginSuperadmin(SuperadminLoginRequest request) {
        String email = normalizarCorreo(request.getEmail());
        UsuarioSuperadmin usuario = usuarioSuperadminRepository.findByCorreo(email)
                .orElseThrow(() -> new AuthenticationException("Credenciales inválidas"));

        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            throw new AuthenticationException("Usuario inactivo");
        }

        validarPassword(request.getPassword(), usuario.getHashContrasena());

        String token = jwtProvider.generarToken(usuario.getCorreo(), "ROLE_SUPERADMIN", TipoUsuario.SUPERADMIN, null,
            construirClaimsNombre(usuario.getNombres()), usuario.getId());
        return buildResponse(token, TipoUsuario.SUPERADMIN, null, usuario.getId(), null);
    }

    public AuthTokenResponse loginAdmin(AdminLoginRequest request) {
        String email = normalizarCorreo(request.getEmail());
        UsuarioTienda usuario = usuarioTiendaRepository.findByCorreo(email)
                .orElseThrow(() -> new AuthenticationException("Credenciales inválidas"));

        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            throw new AuthenticationException("Usuario inactivo");
        }

        validarPassword(request.getPassword(), usuario.getHashContrasena());

        usuario.setUltimoAccesoEn(LocalDateTime.now());
        usuarioTiendaRepository.save(usuario);

        Long tiendaId = usuario.getTiendaId();
        SubscriptionStatusPayload subscriptionStatus = obtenerSuscripcionActiva(tiendaId);
        String token = jwtProvider.generarToken(usuario.getCorreo(), "ROLE_ADMIN", TipoUsuario.ADMIN, tiendaId,
            construirClaimsNombre(usuario.getNombres()), usuario.getId());
        return buildResponse(token, TipoUsuario.ADMIN, tiendaId, usuario.getId(), subscriptionStatus);
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

        String token = jwtProvider.generarToken(cliente.getEmail(), "ROLE_CLIENTE", TipoUsuario.CLIENTE, tiendaId,
            construirClaimsNombre(cliente.getNombreDoc()), cliente.getId());
        return buildResponse(token, TipoUsuario.CLIENTE, tiendaId, cliente.getId(), null);
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

    private AuthTokenResponse buildResponse(String token, TipoUsuario tipoUsuario, Long tiendaId, Long userId,
                                            SubscriptionStatusPayload subscriptionStatus) {
        return AuthTokenResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(jwtProvider.getExpirationTime())
                .userType(tipoUsuario)
                .tiendaId(tiendaId)
                .userId(userId)
                .subscriptionStatus(subscriptionStatus)
                .build();
    }

    private Map<String, Object> construirClaimsNombre(String nombreCompleto) {
        if (nombreCompleto == null || nombreCompleto.isBlank()) {
            return null;
        }
        Map<String, Object> claims = new HashMap<>();
        claims.put("nombre_completo", nombreCompleto.trim());
        return claims;
    }

    private SubscriptionStatusPayload obtenerSuscripcionActiva(Long tiendaId) {
        List<Suscripcion> suscripciones = suscripcionRepository.findByTiendaId(tiendaId);
        if (suscripciones.isEmpty()) {
            throw new AuthenticationException(
                    "Tu tienda no cuenta con una suscripción activa. Contacta a soporte.");
        }

        suscripciones.sort(Comparator.comparing(Suscripcion::getFechaFin, Comparator.nullsLast(Comparator.naturalOrder())).reversed());
        LocalDateTime ahora = LocalDateTime.now();

        for (Suscripcion suscripcion : suscripciones) {
            if (!ESTADOS_VIGENTES.contains(suscripcion.getEstado())) {
                continue;
            }
            LocalDateTime fechaFin = suscripcion.getFechaFin();
            if (fechaFin != null && fechaFin.isBefore(ahora)) {
                continue;
            }
            return buildSubscriptionStatusPayload(suscripcion, ahora);
        }

        Suscripcion masReciente = suscripciones.get(0);
        LocalDateTime fechaFin = masReciente.getFechaFin();

        if (fechaFin != null && fechaFin.isBefore(ahora)) {
            throw new AuthenticationException(
                    "La suscripción de tu tienda ha vencido. Renueva tu plan para continuar.");
        }

        EstadoSuscripcion estado = masReciente.getEstado();
        if (estado == EstadoSuscripcion.CANCELADA) {
            throw new AuthenticationException(
                    "La suscripción de tu tienda fue cancelada. Contacta a soporte para reactivarla.");
        }
        if (estado == EstadoSuscripcion.VENCIDA) {
            throw new AuthenticationException(
                    "La suscripción de tu tienda ha vencido. Renueva tu plan para continuar.");
        }

        throw new AuthenticationException(
                "No encontramos una suscripción activa para tu tienda. Contacta a soporte.");
    }

    private SubscriptionStatusPayload buildSubscriptionStatusPayload(Suscripcion suscripcion, LocalDateTime referencia) {
        LocalDateTime fechaFin = suscripcion.getFechaFin();
        Long remainingSeconds = null;
        if (fechaFin != null) {
            long seconds = Duration.between(referencia, fechaFin).getSeconds();
            remainingSeconds = Math.max(seconds, 0L);
        }

        Plan plan = suscripcion.getPlan();

        return SubscriptionStatusPayload.builder()
                .id(suscripcion.getId())
                .estado(suscripcion.getEstado() != null ? suscripcion.getEstado().name() : null)
                .planNombre(plan != null ? plan.getNombre() : null)
                .planId(plan != null ? plan.getId() : null)
                .planCodigo(plan != null ? plan.getCodigo() : null)
                .ciclo(suscripcion.getCiclo() != null ? suscripcion.getCiclo().name() : null)
                .autorenovar(Boolean.TRUE.equals(suscripcion.getAutorenovar()))
                .fechaInicio(suscripcion.getFechaInicio())
                .fechaFin(fechaFin)
                .remainingSeconds(remainingSeconds)
                .enPeriodoPrueba(suscripcion.getEstado() == EstadoSuscripcion.EN_PRUEBA)
                .build();
    }
}
