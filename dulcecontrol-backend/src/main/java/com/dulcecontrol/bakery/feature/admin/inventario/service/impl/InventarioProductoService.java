package com.dulcecontrol.bakery.feature.admin.inventario.service.impl;

import com.dulcecontrol.bakery.feature.admin.inventario.controller.dto.InventarioProductoDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.InventarioProducto;
import com.dulcecontrol.bakery.feature.admin.inventario.repository.InventarioProductoRepository;
import com.dulcecontrol.bakery.feature.admin.inventario.service.IInventarioProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventarioProductoService implements IInventarioProductoService {

    private final InventarioProductoRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<InventarioProductoDTO> obtenerTodos() {
        return repository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public InventarioProductoDTO obtenerPorId(Long id) {
        return repository.findById(id)
                .map(this::convertirADTO)
                .orElseThrow(() -> new RuntimeException("Inventario de producto no encontrado con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventarioProductoDTO> obtenerPorTienda(Long tiendaId) {
        return repository.findByTiendaId(tiendaId).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventarioProductoDTO> obtenerPorSede(Long sedeId) {
        return repository.findBySedeId(sedeId).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public InventarioProductoDTO obtenerPorSedeYProducto(Long sedeId, Long productoId) {
        return repository.findBySedeIdAndProductoId(sedeId, productoId)
                .map(this::convertirADTO)
                .orElseThrow(() -> new RuntimeException(
                        "Inventario no encontrado para sede: " + sedeId + " y producto: " + productoId));
    }

    @Override
    @Transactional
    public InventarioProductoDTO crear(InventarioProductoDTO dto) {
        InventarioProducto entidad = convertirAEntidad(dto);
        InventarioProducto guardado = repository.save(entidad);
        return convertirADTO(guardado);
    }

    @Override
    @Transactional
    public InventarioProductoDTO actualizar(Long id, InventarioProductoDTO dto) {
        InventarioProducto entidad = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventario de producto no encontrado con ID: " + id));

        if (dto.getCantidadActual() != null) {
            entidad.setCantidadActual(dto.getCantidadActual());
        }
        if (dto.getUbicacionFisica() != null) {
            entidad.setUbicacionFisica(dto.getUbicacionFisica());
        }

        InventarioProducto actualizado = repository.save(entidad);
        return convertirADTO(actualizado);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Inventario de producto no encontrado con ID: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventarioProductoDTO> obtenerInventarioBajo(Long sedeId, Integer cantidadMinima) {
        return repository.findInventarioBajo(sedeId, cantidadMinima).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventarioProductoDTO> obtenerProductosAgotados(Long sedeId) {
        return repository.findProductosAgotados(sedeId).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    private InventarioProductoDTO convertirADTO(InventarioProducto entidad) {
        InventarioProductoDTO dto = new InventarioProductoDTO();
        dto.setId(entidad.getId());
        dto.setTiendaId(entidad.getTiendaId());
        dto.setSedeId(entidad.getSedeId());
        dto.setProductoId(entidad.getProductoId());
        dto.setCantidadActual(entidad.getCantidadActual());
        dto.setUbicacionFisica(entidad.getUbicacionFisica());
        return dto;
    }

    private InventarioProducto convertirAEntidad(InventarioProductoDTO dto) {
        InventarioProducto entidad = new InventarioProducto();
        entidad.setId(dto.getId());
        entidad.setTiendaId(dto.getTiendaId());
        entidad.setSedeId(dto.getSedeId());
        entidad.setProductoId(dto.getProductoId());
        entidad.setCantidadActual(dto.getCantidadActual());
        entidad.setUbicacionFisica(dto.getUbicacionFisica());
        return entidad;
    }
}
