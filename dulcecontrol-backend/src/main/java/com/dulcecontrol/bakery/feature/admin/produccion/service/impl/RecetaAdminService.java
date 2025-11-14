package com.dulcecontrol.bakery.feature.admin.produccion.service.impl;

import com.dulcecontrol.bakery.feature.admin.produccion.dto.RecetaCreateRequest;
import com.dulcecontrol.bakery.feature.admin.produccion.dto.RecetaResponse;
import com.dulcecontrol.bakery.feature.admin.produccion.dto.RecetaUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.produccion.entity.Receta;
import com.dulcecontrol.bakery.feature.admin.produccion.repository.RecetaRepository;
import com.dulcecontrol.bakery.feature.admin.produccion.service.IRecetaAdminService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecetaAdminService implements IRecetaAdminService {

    private final RecetaRepository recetaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<RecetaResponse> listarPorTienda(Long tiendaId) {
        return recetaRepository.findByTiendaId(tiendaId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RecetaResponse obtenerPorId(Long tiendaId, Long recetaId) {
        Receta receta = obtenerEntidad(tiendaId, recetaId);
        return toResponse(receta);
    }

    @Override
    @Transactional
    public RecetaResponse crear(Long tiendaId, RecetaCreateRequest request) {
        validarUnicidad(tiendaId, null, request.getProductoId(), request.getInsumoId());

        Receta receta = new Receta();
        receta.setTiendaId(tiendaId);
        receta.setProductoId(request.getProductoId());
        receta.setInsumoId(request.getInsumoId());
        receta.setCantidadRequerida(request.getCantidadRequerida());
        receta.setUnidadMedida(request.getUnidadMedida());
        receta.setNotasPreparacion(request.getNotasPreparacion());

        Receta guardada = recetaRepository.save(receta);
        return toResponse(guardada);
    }

    @Override
    @Transactional
    public RecetaResponse actualizar(Long tiendaId, Long recetaId, RecetaUpdateRequest request) {
        Receta receta = obtenerEntidad(tiendaId, recetaId);
        validarUnicidad(tiendaId, recetaId, request.getProductoId(), request.getInsumoId());

        receta.setProductoId(request.getProductoId());
        receta.setInsumoId(request.getInsumoId());
        receta.setCantidadRequerida(request.getCantidadRequerida());
        receta.setUnidadMedida(request.getUnidadMedida());
        receta.setNotasPreparacion(request.getNotasPreparacion());

        Receta actualizada = recetaRepository.save(receta);
        return toResponse(actualizada);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long recetaId) {
        Receta receta = obtenerEntidad(tiendaId, recetaId);
        recetaRepository.delete(receta);
    }

    private void validarUnicidad(Long tiendaId, Long recetaId, Long productoId, Long insumoId) {
        boolean existe;
        if (recetaId == null) {
            existe = recetaRepository.existsByTiendaIdAndProductoIdAndInsumoId(tiendaId, productoId, insumoId);
        } else {
            existe = recetaRepository.existsByTiendaIdAndProductoIdAndInsumoIdAndIdNot(tiendaId, productoId, insumoId, recetaId);
        }
        if (existe) {
            throw new BadRequestException("Ya existe una receta registrada para este producto e insumo");
        }
    }

    private Receta obtenerEntidad(Long tiendaId, Long recetaId) {
        return recetaRepository.findByIdAndTiendaId(recetaId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("La receta solicitada no existe"));
    }

    private RecetaResponse toResponse(Receta receta) {
        return RecetaResponse.builder()
                .id(receta.getId())
                .tiendaId(receta.getTiendaId())
                .productoId(receta.getProductoId())
                .insumoId(receta.getInsumoId())
                .cantidadRequerida(receta.getCantidadRequerida())
                .unidadMedida(receta.getUnidadMedida())
                .notasPreparacion(receta.getNotasPreparacion())
                .creadoEn(receta.getCreadoEn())
                .build();
    }
}
