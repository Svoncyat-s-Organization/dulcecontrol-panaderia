package com.dulcecontrol.bakery.features.admin.catalogo.service.impl;

import com.dulcecontrol.bakery.features.admin.catalogo.dto.ProductoCreateRequest;
import com.dulcecontrol.bakery.features.admin.catalogo.dto.ProductoResponse;
import com.dulcecontrol.bakery.features.admin.catalogo.dto.ProductoUpdateRequest;
import com.dulcecontrol.bakery.features.admin.catalogo.entity.Producto;
import com.dulcecontrol.bakery.features.shared.catalogo.repository.CategoriaRepository;
import com.dulcecontrol.bakery.features.shared.catalogo.repository.ProductoRepository;
import com.dulcecontrol.bakery.features.admin.catalogo.service.IProductoAdminService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductoAdminService implements IProductoAdminService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProductoResponse> listar(Long tiendaId, Long categoriaId) {
        List<Producto> productos;
        if (categoriaId != null) {
            validarCategoriaPerteneceATienda(tiendaId, categoriaId);
            productos = productoRepository.findByTiendaIdAndCategoriaIdOrderByNombreAsc(tiendaId, categoriaId);
        } else {
            productos = productoRepository.findByTiendaIdOrderByNombreAsc(tiendaId);
        }
        return productos.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProductoResponse obtener(Long tiendaId, Long productoId) {
        Producto producto = productoRepository.findByIdAndTiendaId(productoId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        return toResponse(producto);
    }

    @Override
    @Transactional
    public ProductoResponse crear(Long tiendaId, ProductoCreateRequest request) {
        validarDuplicadosAlCrear(tiendaId, request.getSku(), request.getSlug());
        Long categoriaId = resolverCategoriaId(tiendaId, request.getCategoriaId());

        Producto producto = new Producto();
        producto.setTiendaId(tiendaId);
        producto.setCategoriaId(categoriaId);
        producto.setNombre(request.getNombre());
        producto.setSlug(request.getSlug());
        producto.setSku(request.getSku());
        producto.setDescripcion(request.getDescripcion());
        producto.setTipo(request.getTipo());
        producto.setEsPersonalizable(request.getEsPersonalizable() != null ? request.getEsPersonalizable() : Boolean.FALSE);
        producto.setPrecioBaseCentimos(request.getPrecioBaseCentimos());
        producto.setPrecioOfertaCentimos(request.getPrecioOfertaCentimos());
        producto.setVisibleEnPos(request.getVisibleEnPos() != null ? request.getVisibleEnPos() : Boolean.TRUE);
        producto.setVisibleEnStorefront(request.getVisibleEnStorefront() != null ? request.getVisibleEnStorefront() : Boolean.TRUE);
        producto.setDestacadoStorefront(request.getDestacadoStorefront() != null ? request.getDestacadoStorefront() : Boolean.FALSE);
        producto.setUrlImagenPrincipal(request.getUrlImagenPrincipal());
        producto.setImagenesGaleria(cloneList(request.getImagenesGaleria()));
        producto.setAtributos(cloneMap(request.getAtributos()));
        producto.setActivo(request.getActivo() == null ? Boolean.TRUE : request.getActivo());

        Producto guardado = productoRepository.save(producto);
        return toResponse(guardado);
    }

    @Override
    @Transactional
    public ProductoResponse actualizar(Long tiendaId, Long productoId, ProductoUpdateRequest request) {
        Producto producto = productoRepository.findByIdAndTiendaId(productoId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        if (productoRepository.existsByTiendaIdAndSkuIgnoreCaseAndIdNot(tiendaId, request.getSku(), productoId)) {
            throw new BadRequestException("El SKU ya está registrado para esta tienda");
        }

        if (productoRepository.existsByTiendaIdAndSlugIgnoreCaseAndIdNot(tiendaId, request.getSlug(), productoId)) {
            throw new BadRequestException("El slug ya está registrado para esta tienda");
        }

        Long categoriaId = resolverCategoriaId(tiendaId, request.getCategoriaId());

        producto.setCategoriaId(categoriaId);
        producto.setNombre(request.getNombre());
        producto.setSlug(request.getSlug());
        producto.setSku(request.getSku());
        producto.setDescripcion(request.getDescripcion());
        producto.setTipo(request.getTipo());
        producto.setEsPersonalizable(request.getEsPersonalizable() != null ? request.getEsPersonalizable() : Boolean.FALSE);
        producto.setPrecioBaseCentimos(request.getPrecioBaseCentimos());
        producto.setPrecioOfertaCentimos(request.getPrecioOfertaCentimos());
        producto.setVisibleEnPos(request.getVisibleEnPos() != null ? request.getVisibleEnPos() : Boolean.TRUE);
        producto.setVisibleEnStorefront(request.getVisibleEnStorefront() != null ? request.getVisibleEnStorefront() : Boolean.TRUE);
        producto.setDestacadoStorefront(request.getDestacadoStorefront() != null ? request.getDestacadoStorefront() : Boolean.FALSE);
        producto.setUrlImagenPrincipal(request.getUrlImagenPrincipal());
        producto.setImagenesGaleria(cloneList(request.getImagenesGaleria()));
        producto.setAtributos(cloneMap(request.getAtributos()));
        if (request.getActivo() != null) {
            producto.setActivo(request.getActivo());
        }

        Producto actualizado = productoRepository.save(producto);
        return toResponse(actualizado);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long productoId) {
        Producto producto = productoRepository.findByIdAndTiendaId(productoId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        productoRepository.delete(producto);
    }

    private void validarDuplicadosAlCrear(Long tiendaId, String sku, String slug) {
        if (productoRepository.existsByTiendaIdAndSkuIgnoreCase(tiendaId, sku)) {
            throw new BadRequestException("El SKU ya está registrado para esta tienda");
        }
        if (productoRepository.existsByTiendaIdAndSlugIgnoreCase(tiendaId, slug)) {
            throw new BadRequestException("El slug ya está registrado para esta tienda");
        }
    }

    private Long resolverCategoriaId(Long tiendaId, Long categoriaId) {
        if (categoriaId == null) {
            return null;
        }
        return categoriaRepository.findByIdAndTiendaId(categoriaId, tiendaId)
                .orElseThrow(() -> new BadRequestException("La categoría indicada no pertenece a la tienda"))
                .getId();
    }

    private void validarCategoriaPerteneceATienda(Long tiendaId, Long categoriaId) {
        categoriaRepository.findByIdAndTiendaId(categoriaId, tiendaId)
                .orElseThrow(() -> new BadRequestException("La categoría indicada no pertenece a la tienda"));
    }

    private List<String> cloneList(List<String> source) {
        return source == null ? new ArrayList<>() : new ArrayList<>(source);
    }

    private Map<String, Object> cloneMap(Map<String, Object> source) {
        return source == null ? new HashMap<>() : new HashMap<>(source);
    }

    private ProductoResponse toResponse(Producto producto) {
        String categoriaNombre = null;
        if (producto.getCategoriaId() != null) {
            categoriaNombre = categoriaRepository.findById(producto.getCategoriaId())
                    .map(c -> c.getNombre())
                    .orElse(null);
        }
        
        return ProductoResponse.builder()
                .id(producto.getId())
                .tiendaId(producto.getTiendaId())
                .categoriaId(producto.getCategoriaId())
                .categoriaNombre(categoriaNombre)
                .nombre(producto.getNombre())
                .slug(producto.getSlug())
                .sku(producto.getSku())
                .descripcion(producto.getDescripcion())
                .tipo(producto.getTipo())
                .esPersonalizable(producto.getEsPersonalizable())
                .precioBaseCentimos(producto.getPrecioBaseCentimos())
                .precioOfertaCentimos(producto.getPrecioOfertaCentimos())
                .visibleEnPos(producto.getVisibleEnPos())
                .visibleEnStorefront(producto.getVisibleEnStorefront())
                .destacadoStorefront(producto.getDestacadoStorefront())
                .urlImagenPrincipal(producto.getUrlImagenPrincipal())
                .imagenesGaleria(cloneList(producto.getImagenesGaleria()))
                .atributos(cloneMap(producto.getAtributos()))
                .activo(producto.getActivo())
                .creadoEn(producto.getCreadoEn())
                .actualizadoEn(producto.getActualizadoEn())
                .build();
    }
}
