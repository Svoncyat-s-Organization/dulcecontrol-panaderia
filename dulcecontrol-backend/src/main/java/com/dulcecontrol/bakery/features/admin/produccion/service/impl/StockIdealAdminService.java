package com.dulcecontrol.bakery.features.admin.produccion.service.impl;

import com.dulcecontrol.bakery.features.admin.produccion.dto.StockIdealCreateRequest;
import com.dulcecontrol.bakery.features.admin.produccion.dto.StockIdealResponse;
import com.dulcecontrol.bakery.features.admin.produccion.dto.StockIdealUpdateRequest;
import com.dulcecontrol.bakery.features.admin.produccion.entity.StockIdeal;
import com.dulcecontrol.bakery.features.admin.produccion.repository.StockIdealRepository;
import com.dulcecontrol.bakery.features.admin.produccion.service.IStockIdealAdminService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StockIdealAdminService implements IStockIdealAdminService {

    private final StockIdealRepository stockIdealRepository;

    @Override
    @Transactional(readOnly = true)
    public List<StockIdealResponse> listarPorTienda(Long tiendaId, Long sedeId) {
        List<StockIdeal> registros = sedeId == null
                ? stockIdealRepository.findByTiendaId(tiendaId)
                : stockIdealRepository.findByTiendaIdAndSedeId(tiendaId, sedeId);

        return registros.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public StockIdealResponse obtenerPorId(Long tiendaId, Long stockId) {
        StockIdeal stockIdeal = obtenerEntidad(tiendaId, stockId);
        return toResponse(stockIdeal);
    }

    @Override
    @Transactional
    public StockIdealResponse crear(Long tiendaId, StockIdealCreateRequest request) {
        validarUnicidad(tiendaId, null, request.getSedeId(), request.getProductoId());

        StockIdeal stockIdeal = new StockIdeal();
        stockIdeal.setTiendaId(tiendaId);
        stockIdeal.setSedeId(request.getSedeId());
        stockIdeal.setProductoId(request.getProductoId());
        stockIdeal.setCantidadIdeal(request.getCantidadIdeal());
        stockIdeal.setPuntoReposicion(request.getPuntoReposicion());

        StockIdeal guardado = stockIdealRepository.save(stockIdeal);
        return toResponse(guardado);
    }

    @Override
    @Transactional
    public StockIdealResponse actualizar(Long tiendaId, Long stockId, StockIdealUpdateRequest request) {
        StockIdeal stockIdeal = obtenerEntidad(tiendaId, stockId);
        validarUnicidad(tiendaId, stockId, request.getSedeId(), request.getProductoId());

        stockIdeal.setSedeId(request.getSedeId());
        stockIdeal.setProductoId(request.getProductoId());
        stockIdeal.setCantidadIdeal(request.getCantidadIdeal());
        stockIdeal.setPuntoReposicion(request.getPuntoReposicion());

        StockIdeal actualizado = stockIdealRepository.save(stockIdeal);
        return toResponse(actualizado);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long stockId) {
        StockIdeal stockIdeal = obtenerEntidad(tiendaId, stockId);
        stockIdealRepository.delete(stockIdeal);
    }

    private void validarUnicidad(Long tiendaId, Long id, Long sedeId, Long productoId) {
        boolean existe = (id == null)
                ? stockIdealRepository.existsByTiendaIdAndSedeIdAndProductoId(tiendaId, sedeId, productoId)
                : stockIdealRepository.existsByTiendaIdAndSedeIdAndProductoIdAndIdNot(tiendaId, sedeId, productoId, id);
        if (existe) {
            throw new BadRequestException("Ya existe un stock ideal configurado para este producto en la sede indicada");
        }
    }

    private StockIdeal obtenerEntidad(Long tiendaId, Long stockId) {
        return stockIdealRepository.findByIdAndTiendaId(stockId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("El registro de stock ideal solicitado no existe"));
    }

    private StockIdealResponse toResponse(StockIdeal stockIdeal) {
        return StockIdealResponse.builder()
                .id(stockIdeal.getId())
                .tiendaId(stockIdeal.getTiendaId())
                .sedeId(stockIdeal.getSedeId())
                .productoId(stockIdeal.getProductoId())
                .cantidadIdeal(stockIdeal.getCantidadIdeal())
                .puntoReposicion(stockIdeal.getPuntoReposicion())
                .actualizadoEn(stockIdeal.getActualizadoEn())
                .build();
    }
}
