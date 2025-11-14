package com.dulcecontrol.bakery.features.superadmin.tiendas.service.impl;

import com.dulcecontrol.bakery.features.superadmin.tiendas.dto.SedeCreateRequest;
import com.dulcecontrol.bakery.features.superadmin.tiendas.dto.SedeResponse;
import com.dulcecontrol.bakery.features.superadmin.tiendas.dto.SedeUpdateRequest;
import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.Sede;
import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.Tienda;
import com.dulcecontrol.bakery.features.superadmin.tiendas.repository.SedeRepository;
import com.dulcecontrol.bakery.features.superadmin.tiendas.repository.TiendaRepository;
import com.dulcecontrol.bakery.features.superadmin.tiendas.service.ISedeSuperAdminService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SedeSuperAdminService implements ISedeSuperAdminService {

    private final SedeRepository sedeRepository;
    private final TiendaRepository tiendaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SedeResponse> listarPorTienda(Long tiendaId) {
        validarTiendaExiste(tiendaId);
        return sedeRepository.findByTiendaId(tiendaId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SedeResponse obtenerPorId(Long tiendaId, Long sedeId) {
        Sede sede = obtenerSede(tiendaId, sedeId);
        return toResponse(sede);
    }

    @Override
    @Transactional
    public SedeResponse crear(Long tiendaId, SedeCreateRequest request) {
        Tienda tienda = obtenerTienda(tiendaId);
        validarCodigoInternoDisponible(tiendaId, request.getCodigoInterno(), null);
        validarPrincipalUnico(tiendaId, request.getEsPrincipal());

        Sede sede = Sede.builder()
                .tienda(tienda)
                .codigoInterno(normalizar(request.getCodigoInterno()))
                .nombre(request.getNombre().trim())
                .direccion(request.getDireccion().trim())
                .telefono(normalizar(request.getTelefono()))
                .distritoId(request.getDistritoId())
                .esPrincipal(Boolean.TRUE.equals(request.getEsPrincipal()))
                .build();

        Sede guardada = sedeRepository.save(sede);
        return toResponse(guardada);
    }

    @Override
    @Transactional
    public SedeResponse actualizar(Long tiendaId, Long sedeId, SedeUpdateRequest request) {
        Sede sede = obtenerSede(tiendaId, sedeId);
        validarCodigoInternoDisponible(tiendaId, request.getCodigoInterno(), sedeId);
        validarPrincipalEnActualizacion(tiendaId, sede, request.getEsPrincipal());

        sede.setCodigoInterno(normalizar(request.getCodigoInterno()));
        sede.setNombre(request.getNombre().trim());
        sede.setDireccion(request.getDireccion().trim());
        sede.setTelefono(normalizar(request.getTelefono()));
        sede.setDistritoId(request.getDistritoId());

        if (request.getEsPrincipal() != null) {
            sede.setEsPrincipal(request.getEsPrincipal());
        }
        if (request.getActivo() != null) {
            sede.setActivo(request.getActivo());
        }

        Sede actualizada = sedeRepository.save(sede);
        return toResponse(actualizada);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long sedeId) {
        Sede sede = obtenerSede(tiendaId, sedeId);
        sedeRepository.delete(sede);
    }

    private Sede obtenerSede(Long tiendaId, Long sedeId) {
        return sedeRepository.findByIdAndTiendaId(sedeId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("La sede solicitada no existe para la tienda indicada"));
    }

    private Tienda obtenerTienda(Long tiendaId) {
        return tiendaRepository.findById(tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("La tienda indicada no existe"));
    }

    private void validarTiendaExiste(Long tiendaId) {
        if (!tiendaRepository.existsById(tiendaId)) {
            throw new ResourceNotFoundException("La tienda indicada no existe");
        }
    }

    private void validarCodigoInternoDisponible(Long tiendaId, String codigoInterno, Long sedeId) {
        if (codigoInterno == null || codigoInterno.isBlank()) {
            return;
        }
        String normalizado = codigoInterno.trim();
        boolean repetido = sedeId == null
                ? sedeRepository.existsByTiendaIdAndCodigoInterno(tiendaId, normalizado)
                : sedeRepository.existsByTiendaIdAndCodigoInternoAndIdNot(tiendaId, normalizado, sedeId);
        if (repetido) {
            throw new BadRequestException("Ya existe una sede con el mismo codigo interno en la tienda");
        }
    }

    private void validarPrincipalUnico(Long tiendaId, Boolean esPrincipalSolicitado) {
        if (!Boolean.TRUE.equals(esPrincipalSolicitado)) {
            return;
        }
        long totalPrincipales = sedeRepository.countByTiendaIdAndEsPrincipalTrue(tiendaId);
        if (totalPrincipales > 0) {
            throw new BadRequestException("La tienda ya tiene una sede principal");
        }
    }

    private void validarPrincipalEnActualizacion(Long tiendaId, Sede sede, Boolean esPrincipalSolicitado) {
        if (esPrincipalSolicitado == null) {
            return;
        }

        if (Boolean.TRUE.equals(esPrincipalSolicitado)) {
            if (!Boolean.TRUE.equals(sede.getEsPrincipal())) {
                validarPrincipalUnico(tiendaId, Boolean.TRUE);
            }
            return;
        }

        if (Boolean.TRUE.equals(sede.getEsPrincipal()) && Boolean.FALSE.equals(esPrincipalSolicitado)) {
            long otrasPrincipales = sedeRepository.countByTiendaIdAndEsPrincipalTrue(tiendaId);
            if (otrasPrincipales <= 1) {
                throw new BadRequestException("La tienda debe mantener al menos una sede principal");
            }
        }
    }

    private SedeResponse toResponse(Sede sede) {
        return SedeResponse.builder()
                .id(sede.getId())
                .tiendaId(sede.getTienda().getId())
                .codigoInterno(sede.getCodigoInterno())
                .nombre(sede.getNombre())
                .direccion(sede.getDireccion())
                .telefono(sede.getTelefono())
                .distritoId(sede.getDistritoId())
                .esPrincipal(sede.getEsPrincipal())
                .activo(sede.getActivo())
                .creadoEn(sede.getCreadoEn())
                .actualizadoEn(sede.getActualizadoEn())
                .build();
    }

    private String normalizar(String valor) {
        return valor == null ? null : valor.trim();
    }
}
