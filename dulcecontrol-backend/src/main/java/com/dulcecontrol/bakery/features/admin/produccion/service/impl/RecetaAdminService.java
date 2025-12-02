package com.dulcecontrol.bakery.features.admin.produccion.service.impl;

import com.dulcecontrol.bakery.features.admin.catalogo.entity.Producto;
import com.dulcecontrol.bakery.features.admin.catalogo.repository.ProductoRepository;
import com.dulcecontrol.bakery.features.admin.compras.entity.Insumo;
import com.dulcecontrol.bakery.features.admin.compras.repository.InsumoRepository;
import com.dulcecontrol.bakery.features.admin.produccion.dto.RecetaCreateRequest;
import com.dulcecontrol.bakery.features.admin.produccion.dto.RecetaResponse;
import com.dulcecontrol.bakery.features.admin.produccion.dto.RecetaUpdateRequest;
import com.dulcecontrol.bakery.features.admin.produccion.entity.Receta;
import com.dulcecontrol.bakery.features.admin.produccion.repository.RecetaRepository;
import com.dulcecontrol.bakery.features.admin.produccion.service.IRecetaAdminService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecetaAdminService implements IRecetaAdminService {

    private final RecetaRepository recetaRepository;
    private final ProductoRepository productoRepository;
    private final InsumoRepository insumoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<RecetaResponse> listarPorTienda(Long tiendaId) {
        List<Receta> recetas = recetaRepository.findByTiendaId(tiendaId);
        
        if (recetas.isEmpty()) {
            return List.of();
        }
        
        // Batch loading de productos
        Set<Long> productoIds = recetas.stream()
                .map(Receta::getProductoId)
                .collect(Collectors.toSet());
        Map<Long, Producto> productosMap = productoRepository.findAllById(productoIds)
                .stream()
                .collect(Collectors.toMap(Producto::getId, p -> p));
        
        // Batch loading de insumos
        Set<Long> insumoIds = recetas.stream()
                .map(Receta::getInsumoId)
                .collect(Collectors.toSet());
        Map<Long, Insumo> insumosMap = insumoRepository.findAllById(insumoIds)
                .stream()
                .collect(Collectors.toMap(Insumo::getId, i -> i));
        
        return recetas.stream()
                .map(receta -> toResponse(receta, productosMap, insumosMap))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RecetaResponse obtenerPorId(Long tiendaId, Long recetaId) {
        Receta receta = obtenerEntidad(tiendaId, recetaId);
        Producto producto = productoRepository.findById(receta.getProductoId()).orElse(null);
        Insumo insumo = insumoRepository.findById(receta.getInsumoId()).orElse(null);
        return toResponse(receta, producto, insumo);
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
        Producto producto = productoRepository.findById(guardada.getProductoId()).orElse(null);
        Insumo insumo = insumoRepository.findById(guardada.getInsumoId()).orElse(null);
        return toResponse(guardada, producto, insumo);
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
        Producto producto = productoRepository.findById(actualizada.getProductoId()).orElse(null);
        Insumo insumo = insumoRepository.findById(actualizada.getInsumoId()).orElse(null);
        return toResponse(actualizada, producto, insumo);
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

    private RecetaResponse toResponse(Receta receta, Map<Long, Producto> productosMap, Map<Long, Insumo> insumosMap) {
        Producto producto = productosMap.get(receta.getProductoId());
        Insumo insumo = insumosMap.get(receta.getInsumoId());
        return toResponse(receta, producto, insumo);
    }
    
    private RecetaResponse toResponse(Receta receta, Producto producto, Insumo insumo) {
        return RecetaResponse.builder()
                .id(receta.getId())
                .tiendaId(receta.getTiendaId())
                .productoId(receta.getProductoId())
                .productoNombre(producto != null ? producto.getNombre() : null)
                .productoSku(producto != null ? producto.getSku() : null)
                .insumoId(receta.getInsumoId())
                .insumoNombre(insumo != null ? insumo.getNombre() : null)
                .insumoCodigoInterno(insumo != null ? insumo.getCodigoInterno() : null)
                .cantidadRequerida(receta.getCantidadRequerida())
                .unidadMedida(receta.getUnidadMedida())
                .notasPreparacion(receta.getNotasPreparacion())
                .creadoEn(receta.getCreadoEn())
                .build();
    }
}
