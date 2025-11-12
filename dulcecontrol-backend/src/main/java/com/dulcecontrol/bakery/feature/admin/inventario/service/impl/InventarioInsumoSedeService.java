package com.dulcecontrol.bakery.feature.admin.inventario.service.impl;

import com.dulcecontrol.bakery.feature.admin.inventario.controller.dto.InventarioInsumoSedeDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.InventarioInsumoSede;
import com.dulcecontrol.bakery.feature.admin.inventario.repository.InventarioInsumoSedeRepository;
import com.dulcecontrol.bakery.feature.admin.inventario.service.IInventarioInsumoSedeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventarioInsumoSedeService implements IInventarioInsumoSedeService {

    private final InventarioInsumoSedeRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<InventarioInsumoSedeDTO> obtenerTodos() {
        return repository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public InventarioInsumoSedeDTO obtenerPorId(Long id) {
        return repository.findById(id)
                .map(this::convertirADTO)
                .orElseThrow(() -> new RuntimeException("Inventario de insumo no encontrado con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventarioInsumoSedeDTO> obtenerPorTienda(Long tiendaId) {
        return repository.findByTiendaId(tiendaId).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventarioInsumoSedeDTO> obtenerPorSede(Long sedeId) {
        return repository.findBySedeId(sedeId).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public InventarioInsumoSedeDTO obtenerPorSedeEInsumo(Long sedeId, Long insumoId) {
        return repository.findBySedeIdAndInsumoId(sedeId, insumoId)
                .map(this::convertirADTO)
                .orElseThrow(() -> new RuntimeException(
                        "Inventario no encontrado para sede: " + sedeId + " e insumo: " + insumoId));
    }

    @Override
    @Transactional
    public InventarioInsumoSedeDTO crear(InventarioInsumoSedeDTO dto) {
        InventarioInsumoSede entidad = convertirAEntidad(dto);
        InventarioInsumoSede guardado = repository.save(entidad);
        return convertirADTO(guardado);
    }

    @Override
    @Transactional
    public InventarioInsumoSedeDTO actualizar(Long id, InventarioInsumoSedeDTO dto) {
        InventarioInsumoSede entidad = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventario de insumo no encontrado con ID: " + id));

        if (dto.getCantidadActual() != null) {
            entidad.setCantidadActual(dto.getCantidadActual());
        }
        if (dto.getUbicacionFisica() != null) {
            entidad.setUbicacionFisica(dto.getUbicacionFisica());
        }

        InventarioInsumoSede actualizado = repository.save(entidad);
        return convertirADTO(actualizado);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Inventario de insumo no encontrado con ID: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventarioInsumoSedeDTO> obtenerInventarioBajo(Long sedeId, BigDecimal cantidadMinima) {
        return repository.findInventarioBajo(sedeId, cantidadMinima).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    private InventarioInsumoSedeDTO convertirADTO(InventarioInsumoSede entidad) {
        InventarioInsumoSedeDTO dto = new InventarioInsumoSedeDTO();
        dto.setId(entidad.getId());
        dto.setTiendaId(entidad.getTiendaId());
        dto.setSedeId(entidad.getSedeId());
        dto.setInsumoId(entidad.getInsumoId());
        dto.setCantidadActual(entidad.getCantidadActual());
        dto.setUbicacionFisica(entidad.getUbicacionFisica());
        return dto;
    }

    private InventarioInsumoSede convertirAEntidad(InventarioInsumoSedeDTO dto) {
        InventarioInsumoSede entidad = new InventarioInsumoSede();
        entidad.setId(dto.getId());
        entidad.setTiendaId(dto.getTiendaId());
        entidad.setSedeId(dto.getSedeId());
        entidad.setInsumoId(dto.getInsumoId());
        entidad.setCantidadActual(dto.getCantidadActual());
        entidad.setUbicacionFisica(dto.getUbicacionFisica());
        return entidad;
    }
}
