package com.dulcecontrol.bakery.features.admin.inventario.service.impl;

import com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioInsumoSedeCreateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioInsumoSedeUpdateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioInsumoSedeResponse;
import com.dulcecontrol.bakery.features.admin.inventario.entity.InventarioInsumoSede;
import com.dulcecontrol.bakery.features.admin.inventario.repository.InventarioInsumoSedeRepository;
import com.dulcecontrol.bakery.features.admin.inventario.service.IInventarioInsumoSedeService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventarioInsumoSedeService implements IInventarioInsumoSedeService {

    private final InventarioInsumoSedeRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<InventarioInsumoSedeResponse> listarPorTienda(Long tiendaId) {
        return repository.findByTiendaId(tiendaId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventarioInsumoSedeResponse> listarPorTiendaYSede(Long tiendaId, Long sedeId) {
        return repository.findByTiendaIdAndSedeId(tiendaId, sedeId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public InventarioInsumoSedeResponse obtenerPorId(Long tiendaId, Long id) {
        InventarioInsumoSede inventario = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventario de insumo no encontrado"));
        return toResponse(inventario);
    }

    @Override
    @Transactional
    public InventarioInsumoSedeResponse crear(Long tiendaId, InventarioInsumoSedeCreateRequest request) {
        // Validar que no exista duplicado
        if (repository.existsBySedeIdAndInsumoId(request.getSedeId(), request.getInsumoId())) {
            throw new BadRequestException("Ya existe un inventario para este insumo en la sede");
        }

        InventarioInsumoSede inventario = new InventarioInsumoSede();
        inventario.setTiendaId(tiendaId);
        inventario.setSedeId(request.getSedeId());
        inventario.setInsumoId(request.getInsumoId());
        inventario
                .setCantidadActual(request.getCantidadActual() != null ? request.getCantidadActual() : BigDecimal.ZERO);
        inventario.setUbicacionFisica(request.getUbicacionFisica());

        InventarioInsumoSede guardado = repository.save(inventario);
        return toResponse(guardado);
    }

    @Override
    @Transactional
    public InventarioInsumoSedeResponse actualizar(Long tiendaId, Long id, InventarioInsumoSedeUpdateRequest request) {
        InventarioInsumoSede inventario = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventario de insumo no encontrado"));

        inventario.setCantidadActual(request.getCantidadActual());
        inventario.setUbicacionFisica(request.getUbicacionFisica());

        InventarioInsumoSede actualizado = repository.save(inventario);
        return toResponse(actualizado);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long id) {
        InventarioInsumoSede inventario = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventario de insumo no encontrado"));
        repository.delete(inventario);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventarioInsumoSedeResponse> listarBajoStock(Long tiendaId, Long sedeId, BigDecimal cantidadMinima) {
        return repository.findBajoStock(tiendaId, sedeId, cantidadMinima).stream()
                .map(this::toResponse)
                .toList();
    }

    private InventarioInsumoSedeResponse toResponse(InventarioInsumoSede entity) {
        return InventarioInsumoSedeResponse.builder()
                .id(entity.getId())
                .sedeId(entity.getSedeId())
                .insumoId(entity.getInsumoId())
                .cantidadActual(entity.getCantidadActual())
                .ubicacionFisica(entity.getUbicacionFisica())
                .actualizadoEn(entity.getActualizadoEn())
                .build();
    }
}
