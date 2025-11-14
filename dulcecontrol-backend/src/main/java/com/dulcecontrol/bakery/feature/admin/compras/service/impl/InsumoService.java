package com.dulcecontrol.bakery.feature.admin.compras.service.impl;

import com.dulcecontrol.bakery.feature.admin.compras.dto.InsumoCreateRequest;
import com.dulcecontrol.bakery.feature.admin.compras.dto.InsumoResponse;
import com.dulcecontrol.bakery.feature.admin.compras.dto.InsumoUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.compras.entity.Insumo;
import com.dulcecontrol.bakery.feature.admin.compras.repository.InsumoRepository;
import com.dulcecontrol.bakery.feature.admin.compras.service.IInsumoService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InsumoService implements IInsumoService {

    private final InsumoRepository insumoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<InsumoResponse> listarPorTienda(Long tiendaId) {
        return insumoRepository.findAll()
                .stream()
                .filter(insumo -> insumo.getTiendaId().equals(tiendaId))
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<InsumoResponse> listarActivos(Long tiendaId) {
        return insumoRepository.findByTiendaIdAndActivoTrue(tiendaId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<InsumoResponse> listarConStockBajo(Long tiendaId) {
        return insumoRepository.findInsumosConStockBajo(tiendaId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public InsumoResponse obtenerPorId(Long tiendaId, Long insumoId) {
        Insumo insumo = insumoRepository.findByIdAndTiendaId(insumoId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Insumo no encontrado"));
        return toResponse(insumo);
    }

    @Override
    @Transactional
    public InsumoResponse crear(InsumoCreateRequest request) {
        if (insumoRepository.existsByTiendaIdAndNombre(request.getTiendaId(), request.getNombre())) {
            throw new BadRequestException("Ya existe un insumo con ese nombre");
        }

        Insumo insumo = new Insumo();
        insumo.setTiendaId(request.getTiendaId());
        insumo.setNombre(request.getNombre());
        insumo.setCodigoInterno(request.getCodigoInterno());
        insumo.setUnidadBase(request.getUnidadBase());
        insumo.setUnidadCompraHabitual(request.getUnidadCompraHabitual());
        insumo.setFactorConversion(request.getFactorConversion());
        insumo.setCostoPromedioUnitarioCentimos(request.getCostoPromedioUnitarioCentimos());
        insumo.setUltimoPrecioCompraCentimos(request.getUltimoPrecioCompraCentimos());
        insumo.setStockActualGlobal(request.getStockActualGlobal());
        insumo.setStockMinimoGlobal(request.getStockMinimoGlobal());
        insumo.setActivo(Boolean.TRUE);

        Insumo guardado = insumoRepository.save(insumo);
        return toResponse(guardado);
    }

    @Override
    @Transactional
    public InsumoResponse actualizar(Long tiendaId, Long insumoId, InsumoUpdateRequest request) {
        Insumo insumo = insumoRepository.findByIdAndTiendaId(insumoId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Insumo no encontrado"));

        if (!insumo.getNombre().equalsIgnoreCase(request.getNombre()) &&
                insumoRepository.existsByTiendaIdAndNombreAndIdNot(tiendaId, request.getNombre(), insumoId)) {
            throw new BadRequestException("Ya existe un insumo con ese nombre");
        }

        insumo.setNombre(request.getNombre());
        insumo.setCodigoInterno(request.getCodigoInterno());
        insumo.setUnidadBase(request.getUnidadBase());
        insumo.setUnidadCompraHabitual(request.getUnidadCompraHabitual());
        insumo.setFactorConversion(request.getFactorConversion());
        insumo.setCostoPromedioUnitarioCentimos(request.getCostoPromedioUnitarioCentimos());
        insumo.setUltimoPrecioCompraCentimos(request.getUltimoPrecioCompraCentimos());
        insumo.setStockActualGlobal(request.getStockActualGlobal());
        insumo.setStockMinimoGlobal(request.getStockMinimoGlobal());

        if (request.getActivo() != null) {
            insumo.setActivo(request.getActivo());
        }

        Insumo actualizado = insumoRepository.save(insumo);
        return toResponse(actualizado);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long insumoId) {
        Insumo insumo = insumoRepository.findByIdAndTiendaId(insumoId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Insumo no encontrado"));

        // Soft delete
        insumo.setActivo(Boolean.FALSE);
        insumoRepository.save(insumo);
    }

    private InsumoResponse toResponse(Insumo insumo) {
        return InsumoResponse.builder()
                .id(insumo.getId())
                .tiendaId(insumo.getTiendaId())
                .nombre(insumo.getNombre())
                .codigoInterno(insumo.getCodigoInterno())
                .unidadBase(insumo.getUnidadBase())
                .unidadCompraHabitual(insumo.getUnidadCompraHabitual())
                .factorConversion(insumo.getFactorConversion())
                .costoPromedioUnitarioCentimos(insumo.getCostoPromedioUnitarioCentimos())
                .ultimoPrecioCompraCentimos(insumo.getUltimoPrecioCompraCentimos())
                .stockActualGlobal(insumo.getStockActualGlobal())
                .stockMinimoGlobal(insumo.getStockMinimoGlobal())
                .activo(insumo.getActivo())
                .creadoEn(insumo.getCreadoEn())
                .build();
    }
}
