package com.dulcecontrol.bakery.features.publico.catalogo.service;

import com.dulcecontrol.bakery.features.publico.catalogo.dto.CategoriaPublicaResponse;
import com.dulcecontrol.bakery.features.publico.catalogo.dto.ProductoDetallePublicoResponse;
import com.dulcecontrol.bakery.features.publico.catalogo.dto.ProductoPublicoResponse;
import com.dulcecontrol.bakery.features.shared.catalogo.model.Categoria;
import com.dulcecontrol.bakery.features.shared.catalogo.model.Producto;
import com.dulcecontrol.bakery.features.shared.catalogo.repository.CategoriaRepository;
import com.dulcecontrol.bakery.features.shared.catalogo.repository.ProductoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementación del servicio de Catálogo Público.
 * Convierte entidades JPA a DTOs públicos sin exponer datos internos.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CatalogoPublicoService implements ICatalogoPublicoService {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;

    @Override
    public List<CategoriaPublicaResponse> obtenerCategoriasActivas(Long tiendaId) {
        log.debug("Obteniendo categorías activas para tienda: {}", tiendaId);
        
        List<Categoria> categorias = categoriaRepository.findCategoriasActivasByTiendaId(tiendaId);
        
        return categorias.stream()
            .map(this::mapToCategoriaResponse)
            .collect(Collectors.toList());
    }

    @Override
    public Page<ProductoPublicoResponse> buscarProductos(
        Long tiendaId,
        Long categoriaId,
        Boolean destacado,
        Pageable pageable
    ) {
        log.debug("Buscando productos - tienda: {}, categoria: {}, destacado: {}", 
            tiendaId, categoriaId, destacado);
        
        Page<Producto> productos = productoRepository.buscarProductosPublicos(
            tiendaId, categoriaId, destacado, pageable
        );
        
        return productos.map(this::mapToProductoResponse);
    }

    @Override
    public ProductoDetallePublicoResponse obtenerProductoPorSlug(Long tiendaId, String slug) {
        log.debug("Obteniendo producto por slug: {} para tienda: {}", slug, tiendaId);
        
        Producto producto = productoRepository.findByTiendaIdAndSlugForStorefront(tiendaId, slug)
            .orElseThrow(() -> new EntityNotFoundException(
                "Producto no encontrado con slug: " + slug + " en tienda: " + tiendaId
            ));
        
        return mapToProductoDetalleResponse(producto);
    }

    // === Mappers privados ===

    private CategoriaPublicaResponse mapToCategoriaResponse(Categoria categoria) {
        return CategoriaPublicaResponse.builder()
            .id(categoria.getId())
            .nombre(categoria.getNombre())
            .slug(categoria.getSlug())
            .descripcion(categoria.getDescripcion())
            .urlImagen(categoria.getUrlImagen())
            .icono(categoria.getIcono())
            .ordenVisual(categoria.getOrdenVisual())
            .build();
    }

    private ProductoPublicoResponse mapToProductoResponse(Producto producto) {
        String nombreCategoria = null;
        String slugCategoria = null;
        Long categoriaId = null;
        
        if (producto.getCategoria() != null) {
            nombreCategoria = producto.getCategoria().getNombre();
            slugCategoria = producto.getCategoria().getSlug();
            categoriaId = producto.getCategoria().getId();
        }
        
        return ProductoPublicoResponse.builder()
            .id(producto.getId())
            .nombre(producto.getNombre())
            .slug(producto.getSlug())
            .descripcion(producto.getDescripcion())
            .precioBaseCentimos(producto.getPrecioBaseCentimos())
            .precioOfertaCentimos(producto.getPrecioOfertaCentimos())
            .esPersonalizable(producto.getEsPersonalizable())
            .destacadoStorefront(producto.getDestacadoStorefront())
            .urlImagenPrincipal(producto.getUrlImagenPrincipal())
            .nombreCategoria(nombreCategoria)
            .slugCategoria(slugCategoria)
            .categoriaId(categoriaId)
            .build();
    }

    private ProductoDetallePublicoResponse mapToProductoDetalleResponse(Producto producto) {
        CategoriaPublicaResponse categoriaResponse = null;
        if (producto.getCategoria() != null) {
            categoriaResponse = mapToCategoriaResponse(producto.getCategoria());
        }
        
        return ProductoDetallePublicoResponse.builder()
            .id(producto.getId())
            .nombre(producto.getNombre())
            .slug(producto.getSlug())
            .descripcion(producto.getDescripcion())
            .precioBaseCentimos(producto.getPrecioBaseCentimos())
            .precioOfertaCentimos(producto.getPrecioOfertaCentimos())
            .esPersonalizable(producto.getEsPersonalizable())
            .urlImagenPrincipal(producto.getUrlImagenPrincipal())
            .imagenesGaleria(producto.getImagenesGaleria() != null 
                ? producto.getImagenesGaleria() 
                : Collections.emptyList())
            .atributos(producto.getAtributos() != null 
                ? producto.getAtributos() 
                : Collections.emptyMap())
            .categoria(categoriaResponse)
            .build();
    }
}
