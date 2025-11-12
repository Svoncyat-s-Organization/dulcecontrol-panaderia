package com.dulcecontrol.bakery.feature.admin.inventario.service.impl;

import com.dulcecontrol.bakery.feature.admin.inventario.controller.dto.InventarioProductoDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.InventarioProducto;
import com.dulcecontrol.bakery.feature.admin.inventario.repository.InventarioProductoRepository;
import com.dulcecontrol.bakery.feature.admin.inventario.service.IInventarioProductoService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventarioProductoService implements IInventarioProductoService {

    private final InventarioProductoRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<InventarioProductoDTO> listarPorTienda(Long tiendaId) {
        return repository.findByTiendaId(tiendaId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventarioProductoDTO> listarPorTiendaYSede(Long tiendaId, Long sedeId) {
        return repository.findByTiendaIdAndSedeId(tiendaId, sedeId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public InventarioProductoDTO obtenerPorId(Long tiendaId, Long id) {
        InventarioProducto inventario = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventario de producto no encontrado"));
        return toDTO(inventario);
    }

    @Override
    @Transactional
    public InventarioProductoDTO crear(Long tiendaId, InventarioProductoDTO dto) {
        // Validar que no exista duplicado
        if (repository.existsBySedeIdAndProductoId(dto.getSedeId(), dto.getProductoId())) {
            throw new BadRequestException("Ya existe un inventario para este producto en la sede");
        }

        InventarioProducto inventario = new InventarioProducto();
        inventario.setTiendaId(tiendaId);
        inventario.setSedeId(dto.getSedeId());
        inventario.setProductoId(dto.getProductoId());
        inventario.setCantidadActual(dto.getCantidadActual() != null ? dto.getCantidadActual() : 0);
        inventario.setUbicacionFisica(dto.getUbicacionFisica());

        InventarioProducto guardado = repository.save(inventario);
        return toDTO(guardado);
    }

    @Override
    @Transactional
    public InventarioProductoDTO actualizar(Long tiendaId, Long id, InventarioProductoDTO dto) {
        InventarioProducto inventario = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventario de producto no encontrado"));

        inventario.setCantidadActual(dto.getCantidadActual());
        inventario.setUbicacionFisica(dto.getUbicacionFisica());

        InventarioProducto actualizado = repository.save(inventario);
        return toDTO(actualizado);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long id) {
        InventarioProducto inventario = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventario de producto no encontrado"));
        repository.delete(inventario);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventarioProductoDTO> listarBajoStock(Long tiendaId, Long sedeId, Integer cantidadMinima) {
        return repository.findBajoStock(tiendaId, sedeId, cantidadMinima).stream()
                .map(this::toDTO)
                .toList();
    }

    private InventarioProductoDTO toDTO(InventarioProducto entity) {
        return InventarioProductoDTO.builder()
                .id(entity.getId())
                .sedeId(entity.getSedeId())
                .productoId(entity.getProductoId())
                .cantidadActual(entity.getCantidadActual())
                .ubicacionFisica(entity.getUbicacionFisica())
                .actualizadoEn(entity.getActualizadoEn())
                .build();
    }
}
