package com.dulcecontrol.bakery.features.admin.inventario.service.impl;

import com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioInsumoSedeCreateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioInsumoSedeUpdateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioInsumoSedeResponse;
import com.dulcecontrol.bakery.features.admin.inventario.dto.UbicacionFisicaUpdateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.entity.InventarioInsumoSede;
import com.dulcecontrol.bakery.features.admin.inventario.repository.InventarioInsumoSedeRepository;
import com.dulcecontrol.bakery.features.admin.inventario.service.IInventarioInsumoSedeService;
import com.dulcecontrol.bakery.features.admin.compras.entity.Insumo;
import com.dulcecontrol.bakery.features.admin.compras.repository.InsumoRepository;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventarioInsumoSedeService implements IInventarioInsumoSedeService {

    private final InventarioInsumoSedeRepository repository;
    private final InsumoRepository insumoRepository;

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
        return repository.findEnrichedByTiendaIdAndSedeId(tiendaId, sedeId).stream()
                .map(this::toResponseEnriquecido)
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
    public InventarioInsumoSedeResponse actualizarUbicacion(Long tiendaId, Long id, UbicacionFisicaUpdateRequest request) {
        InventarioInsumoSede inventario = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventario de insumo no encontrado"));

        String ubicacion = request != null ? request.getUbicacionFisica() : null;
        if (ubicacion != null) {
            ubicacion = ubicacion.trim();
            if (ubicacion.isBlank()) {
                ubicacion = null;
            }
        }

        inventario.setUbicacionFisica(ubicacion);
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

    private InventarioInsumoSedeResponse toResponseEnriquecido(InventarioInsumoSede entity) {
        Insumo insumo = insumoRepository.findById(entity.getInsumoId())
                .orElseThrow(() -> new ResourceNotFoundException("Insumo no encontrado"));

        String estadoStock = calcularEstadoStock(entity.getCantidadActual(), insumo.getStockMinimoGlobal());

        return InventarioInsumoSedeResponse.builder()
                .id(entity.getId())
                .sedeId(entity.getSedeId())
                .insumoId(entity.getInsumoId())
                .nombreInsumo(insumo.getNombre())
                .codigoInterno(insumo.getCodigoInterno())
                .unidadMedida(insumo.getUnidadBase() != null ? insumo.getUnidadBase().name() : "UNIDAD")
                .stockMinimo(insumo.getStockMinimoGlobal())
                .activo(insumo.getActivo())
                .cantidadActual(entity.getCantidadActual())
                .estadoStock(estadoStock)
                .ubicacionFisica(entity.getUbicacionFisica())
                .actualizadoEn(entity.getActualizadoEn())
                .build();
    }

    private String calcularEstadoStock(BigDecimal cantidadActual, BigDecimal stockMinimo) {
        if (stockMinimo == null || stockMinimo.compareTo(BigDecimal.ZERO) == 0) {
            return "SIN_CONFIGURAR";
        }

        BigDecimal porcentaje = cantidadActual
                .divide(stockMinimo, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));

        if (porcentaje.compareTo(BigDecimal.valueOf(80)) >= 0) {
            return "OK";
        } else if (porcentaje.compareTo(BigDecimal.valueOf(20)) >= 0) {
            return "BAJO_STOCK";
        } else {
            return "CRITICO";
        }
    }
}
