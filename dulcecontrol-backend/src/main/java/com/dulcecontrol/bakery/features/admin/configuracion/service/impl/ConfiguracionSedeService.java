package com.dulcecontrol.bakery.features.admin.configuracion.service.impl;

import com.dulcecontrol.bakery.features.admin.configuracion.dto.SedeResumenResponse;
import com.dulcecontrol.bakery.features.admin.configuracion.repository.SedeAdminRepository;
import com.dulcecontrol.bakery.features.admin.configuracion.service.IConfiguracionSedeService;
import com.dulcecontrol.bakery.features.admin.seguridad.entity.UsuarioSede;
import com.dulcecontrol.bakery.features.admin.seguridad.entity.UsuarioTienda;
import com.dulcecontrol.bakery.features.admin.seguridad.repository.UsuarioSedeRepository;
import com.dulcecontrol.bakery.features.admin.seguridad.repository.UsuarioTiendaRepository;
import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.Sede;
import com.dulcecontrol.bakery.shared.exception.AuthenticationException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConfiguracionSedeService implements IConfiguracionSedeService {

    private final UsuarioTiendaRepository usuarioTiendaRepository;
    private final UsuarioSedeRepository usuarioSedeRepository;
    private final SedeAdminRepository sedeRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SedeResumenResponse> listarAsignadas(Long tiendaId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new AuthenticationException("Usuario no autenticado");
        }

        String correo = authentication.getName();
        UsuarioTienda usuario = usuarioTiendaRepository.findByTiendaIdAndCorreo(tiendaId, correo)
                .orElseThrow(() -> new AuthenticationException("No autorizado para esta tienda"));

        List<UsuarioSede> usuarioSedes = usuarioSedeRepository.findByIdUsuarioId(usuario.getId());
        if (CollectionUtils.isEmpty(usuarioSedes)) {
            return List.of();
        }

        Set<Long> sedeIdsAutorizadas = usuarioSedes.stream()
                .map(usuarioSede -> usuarioSede.getId().getSedeId())
                .filter(Objects::nonNull)
                .collect(Collectors.toUnmodifiableSet());

        if (sedeIdsAutorizadas.isEmpty()) {
            return List.of();
        }

        List<Sede> sedes = sedeRepository.findByIdInAndActivoTrue(List.copyOf(sedeIdsAutorizadas));

        return sedes.stream()
                .filter(sede -> sede.getTienda() != null && tiendaId.equals(sede.getTienda().getId()))
                .sorted(Comparator
                        .comparing((Sede sede) -> Boolean.FALSE.equals(sede.getEsPrincipal()))
                        .thenComparing(Sede::getNombre, Comparator.nullsLast(String::compareToIgnoreCase)))
                .map(this::toResponse)
                .toList();
    }

    private SedeResumenResponse toResponse(Sede sede) {
        return SedeResumenResponse.builder()
                .id(sede.getId())
                .tiendaId(sede.getTienda() != null ? sede.getTienda().getId() : null)
                .nombre(sede.getNombre())
                .direccion(sede.getDireccion())
                .telefono(sede.getTelefono())
                .esPrincipal(Boolean.TRUE.equals(sede.getEsPrincipal()))
                .build();
    }
}
