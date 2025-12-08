package com.dulcecontrol.bakery.features.admin.inventario.service.impl;

import com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioProductoCreateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioProductoUpdateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioProductoResponse;
import com.dulcecontrol.bakery.features.admin.inventario.entity.InventarioProducto;
import com.dulcecontrol.bakery.features.admin.inventario.repository.InventarioProductoRepository;
import com.dulcecontrol.bakery.features.admin.inventario.service.IInventarioProductoService;
import com.dulcecontrol.bakery.features.admin.catalogo.entity.Producto;
import com.dulcecontrol.bakery.features.admin.catalogo.entity.Categoria;
import com.dulcecontrol.bakery.features.shared.catalogo.repository.ProductoRepository;
import com.dulcecontrol.bakery.features.shared.catalogo.repository.CategoriaRepository;
import com.dulcecontrol.bakery.features.admin.produccion.entity.StockIdeal;
import com.dulcecontrol.bakery.features.admin.produccion.repository.StockIdealRepository;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InventarioProductoService implements IInventarioProductoService {

    private final InventarioProductoRepository repository;
    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final StockIdealRepository stockIdealRepository;

    @Override
    @Transactional(readOnly = true)
    public List<InventarioProductoResponse> listarPorTienda(Long tiendaId) {
        return repository.findByTiendaId(tiendaId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventarioProductoResponse> listarPorTiendaYSede(Long tiendaId, Long sedeId) {
        return repository.findByTiendaIdAndSedeId(tiendaId, sedeId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public InventarioProductoResponse obtenerPorId(Long tiendaId, Long id) {
        InventarioProducto inventario = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventario de producto no encontrado"));
        return toResponse(inventario);
    }

    @Override
    @Transactional
    public InventarioProductoResponse crear(Long tiendaId, InventarioProductoCreateRequest request) {
        // Validar que no exista duplicado
        if (repository.existsBySedeIdAndProductoId(request.getSedeId(), request.getProductoId())) {
            throw new BadRequestException("Ya existe un inventario para este producto en la sede");
        }

        InventarioProducto inventario = new InventarioProducto();
        inventario.setTiendaId(tiendaId);
        inventario.setSedeId(request.getSedeId());
        inventario.setProductoId(request.getProductoId());
        inventario.setCantidadActual(request.getCantidadActual() != null ? request.getCantidadActual() : 0);
        inventario.setUbicacionFisica(request.getUbicacionFisica());

        InventarioProducto guardado = repository.save(inventario);
        return toResponse(guardado);
    }

    @Override
    @Transactional
    public InventarioProductoResponse actualizar(Long tiendaId, Long id, InventarioProductoUpdateRequest request) {
        InventarioProducto inventario = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventario de producto no encontrado"));

        inventario.setCantidadActual(request.getCantidadActual());
        inventario.setUbicacionFisica(request.getUbicacionFisica());

        InventarioProducto actualizado = repository.save(inventario);
        return toResponse(actualizado);
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
    public List<InventarioProductoResponse> listarBajoStock(Long tiendaId, Long sedeId, Integer cantidadMinima) {
        return repository.findBajoStock(tiendaId, sedeId, cantidadMinima).stream()
                .map(this::toResponse)
                .toList();
    }

    private InventarioProductoResponse toResponse(InventarioProducto entity) {
        // Obtener datos del producto
        Producto producto = productoRepository.findById(entity.getProductoId())
                .orElse(null);
        
        String nombreProducto = producto != null ? producto.getNombre() : "Producto no encontrado";
        String sku = producto != null ? producto.getSku() : null;
        
        // Obtener categoría
        String categoriaNombre = null;
        if (producto != null && producto.getCategoriaId() != null) {
            categoriaNombre = categoriaRepository.findById(producto.getCategoriaId())
                    .map(Categoria::getNombre)
                    .orElse(null);
        }
        
        // Obtener stock ideal para esta sede
        Optional<StockIdeal> stockIdealOpt = stockIdealRepository.findByTiendaIdAndSedeIdAndProductoId(
                entity.getTiendaId(), entity.getSedeId(), entity.getProductoId());
        
        Integer stockIdeal = stockIdealOpt.map(StockIdeal::getCantidadIdeal).orElse(null);
        
        // Calcular estado de stock
        String estadoStock = calcularEstadoStock(entity.getCantidadActual(), stockIdeal);
        
        return InventarioProductoResponse.builder()
                .id(entity.getId())
                .sedeId(entity.getSedeId())
                .productoId(entity.getProductoId())
                .cantidadActual(entity.getCantidadActual())
                .ubicacionFisica(entity.getUbicacionFisica())
                .actualizadoEn(entity.getActualizadoEn())
                .nombreProducto(nombreProducto)
                .sku(sku)
                .stockIdeal(stockIdeal)
                .estadoStock(estadoStock)
                .categoriaNombre(categoriaNombre)
                .build();
    }
    
    private String calcularEstadoStock(Integer cantidadActual, Integer stockIdeal) {
        if (stockIdeal == null) {
            return "SIN_CONFIGURAR";
        }
        
        double porcentaje = (double) cantidadActual / stockIdeal;
        
        if (porcentaje >= 0.8) {
            return "OK";
        } else if (porcentaje >= 0.2) {
            return "BAJO_STOCK";
        } else {
            return "CRITICO";
        }
    }
}
