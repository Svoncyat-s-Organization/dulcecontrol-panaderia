package com.dulcecontrol.bakery.feature.admin.inventario.service.impl;

import com.dulcecontrol.bakery.feature.admin.inventario.dto.InventarioInsumoSedeDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.InventarioInsumoSede;
import com.dulcecontrol.bakery.feature.admin.inventario.repository.InventarioInsumoSedeRepository;
import com.dulcecontrol.bakery.feature.admin.inventario.service.IInventarioInsumoSedeService;
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
    public List<InventarioInsumoSedeDTO> listarPorTienda(Long tiendaId) {
        return repository.findByTiendaId(tiendaId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventarioInsumoSedeDTO> listarPorTiendaYSede(Long tiendaId, Long sedeId) {
        return repository.findByTiendaIdAndSedeId(tiendaId, sedeId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public InventarioInsumoSedeDTO obtenerPorId(Long tiendaId, Long id) {
        InventarioInsumoSede inventario = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventario de insumo no encontrado"));
        return toDTO(inventario);
    }

    @Override
    @Transactional
    public InventarioInsumoSedeDTO crear(Long tiendaId, InventarioInsumoSedeDTO dto) {
        // Validar que no exista duplicado
        if (repository.existsBySedeIdAndInsumoId(dto.getSedeId(), dto.getInsumoId())) {
            throw new BadRequestException("Ya existe un inventario para este insumo en la sede");
        }

        InventarioInsumoSede inventario = new InventarioInsumoSede();
        inventario.setTiendaId(tiendaId);
        inventario.setSedeId(dto.getSedeId());
        inventario.setInsumoId(dto.getInsumoId());
        inventario.setCantidadActual(dto.getCantidadActual() != null ? dto.getCantidadActual() : BigDecimal.ZERO);
        inventario.setUbicacionFisica(dto.getUbicacionFisica());

        InventarioInsumoSede guardado = repository.save(inventario);
        return toDTO(guardado);
    }

    @Override
    @Transactional
    public InventarioInsumoSedeDTO actualizar(Long tiendaId, Long id, InventarioInsumoSedeDTO dto) {
        InventarioInsumoSede inventario = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventario de insumo no encontrado"));

        inventario.setCantidadActual(dto.getCantidadActual());
        inventario.setUbicacionFisica(dto.getUbicacionFisica());

        InventarioInsumoSede actualizado = repository.save(inventario);
        return toDTO(actualizado);
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
    public List<InventarioInsumoSedeDTO> listarBajoStock(Long tiendaId, Long sedeId, BigDecimal cantidadMinima) {
        return repository.findBajoStock(tiendaId, sedeId, cantidadMinima).stream()
                .map(this::toDTO)
                .toList();
    }

    private InventarioInsumoSedeDTO toDTO(InventarioInsumoSede entity) {
        return InventarioInsumoSedeDTO.builder()
                .id(entity.getId())
                .sedeId(entity.getSedeId())
                .insumoId(entity.getInsumoId())
                .cantidadActual(entity.getCantidadActual())
                .ubicacionFisica(entity.getUbicacionFisica())
                .actualizadoEn(entity.getActualizadoEn())
                .build();
    }
}
