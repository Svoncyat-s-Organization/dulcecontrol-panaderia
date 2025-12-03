package com.dulcecontrol.bakery.features.admin.configuracion.service;

import com.dulcecontrol.bakery.features.admin.configuracion.dto.SedeCreateRequest;
import com.dulcecontrol.bakery.features.admin.configuracion.dto.SedeResponse;
import com.dulcecontrol.bakery.features.admin.configuracion.dto.SedeUpdateRequest;
import com.dulcecontrol.bakery.features.admin.configuracion.repository.SedeAdminRepository;
import com.dulcecontrol.bakery.features.shared.ubigeo.entity.UbigeoDistrito;
import com.dulcecontrol.bakery.features.shared.ubigeo.repository.UbigeoDistritoRepository;
import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.Sede;
import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.Tienda;
import com.dulcecontrol.bakery.features.superadmin.tiendas.repository.TiendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SedeAdminService implements ISedeAdminService {

    private final SedeAdminRepository sedeRepository;
    private final TiendaRepository tiendaRepository;
    private final UbigeoDistritoRepository distritoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SedeResponse> obtenerSedesPorTienda(Long tiendaId) {
        validarTiendaExiste(tiendaId);
        return sedeRepository.findByTiendaIdOrderByEsPrincipalDescNombreAsc(tiendaId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SedeResponse obtenerSedePorId(Long tiendaId, Long sedeId) {
        Sede sede = sedeRepository.findByIdAndTiendaId(sedeId, tiendaId)
                .orElseThrow(() -> new IllegalArgumentException("Sede no encontrada"));
        return mapToResponse(sede);
    }

    @Override
    @Transactional
    public SedeResponse crearSede(Long tiendaId, SedeCreateRequest request) {
        Tienda tienda = validarTiendaExiste(tiendaId);

        // Validar nombre único
        if (sedeRepository.existsByTiendaIdAndNombre(tiendaId, request.getNombre())) {
            throw new IllegalArgumentException("Ya existe una sede con ese nombre");
        }

        // Validar código interno único
        if (sedeRepository.existsByTiendaIdAndCodigoInterno(tiendaId, request.getCodigoInterno())) {
            throw new IllegalArgumentException("Ya existe una sede con ese código interno");
        }

        // Validar distrito existe
        UbigeoDistrito distrito = distritoRepository.findById(request.getDistritoId())
                .orElseThrow(() -> new IllegalArgumentException("Distrito no encontrado"));

        // Validar solo una sede principal
        Boolean esPrincipal = request.getEsPrincipal() != null ? request.getEsPrincipal() : Boolean.FALSE;
        if (esPrincipal && sedeRepository.existsOtraSedePrincipal(tiendaId, 0L)) {
            throw new IllegalArgumentException("Ya existe una sede principal. Desactiva la actual antes de crear una nueva");
        }

        Sede sede = Sede.builder()
                .tienda(tienda)
                .codigoInterno(request.getCodigoInterno())
                .nombre(request.getNombre())
                .direccion(request.getDireccion())
                .telefono(request.getTelefono())
                .distritoId(request.getDistritoId())
                .esPrincipal(esPrincipal)
                .activo(Boolean.TRUE)
                .build();

        sede = sedeRepository.save(sede);
        return mapToResponse(sede);
    }

    @Override
    @Transactional
    public SedeResponse actualizarSede(Long tiendaId, Long sedeId, SedeUpdateRequest request) {
        Sede sede = sedeRepository.findByIdAndTiendaId(sedeId, tiendaId)
                .orElseThrow(() -> new IllegalArgumentException("Sede no encontrada"));

        // Validar nombre único (excepto la propia sede)
        if (sedeRepository.existsByTiendaIdAndNombreAndIdNot(tiendaId, request.getNombre(), sedeId)) {
            throw new IllegalArgumentException("Ya existe otra sede con ese nombre");
        }

        // Validar código interno único (excepto la propia sede)
        if (sedeRepository.existsByTiendaIdAndCodigoInternoAndIdNot(tiendaId, request.getCodigoInterno(), sedeId)) {
            throw new IllegalArgumentException("Ya existe otra sede con ese código interno");
        }

        // Validar distrito existe
        UbigeoDistrito distrito = distritoRepository.findById(request.getDistritoId())
                .orElseThrow(() -> new IllegalArgumentException("Distrito no encontrado"));

        // Validar solo una sede principal
        Boolean esPrincipal = request.getEsPrincipal() != null ? request.getEsPrincipal() : Boolean.FALSE;
        if (esPrincipal && !sede.getEsPrincipal() && sedeRepository.existsOtraSedePrincipal(tiendaId, sedeId)) {
            throw new IllegalArgumentException("Ya existe una sede principal. Desactiva la actual antes de marcar esta como principal");
        }

        sede.setCodigoInterno(request.getCodigoInterno());
        sede.setNombre(request.getNombre());
        sede.setDireccion(request.getDireccion());
        sede.setTelefono(request.getTelefono());
        sede.setDistritoId(request.getDistritoId());
        sede.setActivo(request.getActivo());
        sede.setEsPrincipal(esPrincipal);

        sede = sedeRepository.save(sede);
        return mapToResponse(sede);
    }

    @Override
    @Transactional
    public void desactivarSede(Long tiendaId, Long sedeId) {
        Sede sede = sedeRepository.findByIdAndTiendaId(sedeId, tiendaId)
                .orElseThrow(() -> new IllegalArgumentException("Sede no encontrada"));

        // Validar que no sea la sede principal con otras sedes activas
        if (sede.getEsPrincipal()) {
            long otrasSedesActivas = sedeRepository.findByTiendaIdOrderByEsPrincipalDescNombreAsc(tiendaId).stream()
                    .filter(s -> !s.getId().equals(sedeId) && s.getActivo())
                    .count();
            if (otrasSedesActivas > 0) {
                throw new IllegalArgumentException("No se puede desactivar la sede principal mientras haya otras sedes activas");
            }
        }

        sede.setActivo(Boolean.FALSE);
        sedeRepository.save(sede);
    }

    @Override
    @Transactional
    public void eliminarSede(Long tiendaId, Long sedeId) {
        Sede sede = sedeRepository.findByIdAndTiendaId(sedeId, tiendaId)
                .orElseThrow(() -> new IllegalArgumentException("Sede no encontrada"));

        // Validar que no sea la sede principal
        if (sede.getEsPrincipal()) {
            throw new IllegalArgumentException("No se puede eliminar la sede principal");
        }

        // TODO: Validar que no tenga cajas abiertas
        // TODO: Validar que no tenga usuarios activos asignados

        sedeRepository.delete(sede);
    }

    private Tienda validarTiendaExiste(Long tiendaId) {
        return tiendaRepository.findById(tiendaId)
                .orElseThrow(() -> new IllegalArgumentException("Tienda no encontrada"));
    }

    private SedeResponse mapToResponse(Sede sede) {
        String distritoNombre = null;
        String provinciaNombre = null;
        String departamentoNombre = null;

        if (sede.getDistritoId() != null) {
            UbigeoDistrito distrito = distritoRepository.findById(sede.getDistritoId()).orElse(null);
            if (distrito != null) {
                distritoNombre = distrito.getNombre();
                provinciaNombre = distrito.getProvincia().getNombre();
                departamentoNombre = distrito.getProvincia().getDepartamento().getNombre();
            }
        }

        return SedeResponse.builder()
                .id(sede.getId())
                .tiendaId(sede.getTienda().getId())
                .codigoInterno(sede.getCodigoInterno())
                .nombre(sede.getNombre())
                .direccion(sede.getDireccion())
                .telefono(sede.getTelefono())
                .distritoId(sede.getDistritoId())
                .distritoNombre(distritoNombre)
                .provinciaNombre(provinciaNombre)
                .departamentoNombre(departamentoNombre)
                .esPrincipal(sede.getEsPrincipal())
                .activo(sede.getActivo())
                .creadoEn(sede.getCreadoEn())
                .actualizadoEn(sede.getActualizadoEn())
                .build();
    }
}
