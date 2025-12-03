package com.dulcecontrol.bakery.features.publico.catalogo.controller;

import com.dulcecontrol.bakery.features.publico.catalogo.dto.CategoriaPublicaResponse;
import com.dulcecontrol.bakery.features.publico.catalogo.dto.ProductoDetallePublicoResponse;
import com.dulcecontrol.bakery.features.publico.catalogo.dto.ProductoPublicoResponse;
import com.dulcecontrol.bakery.features.publico.catalogo.service.ICatalogoPublicoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller público para el catálogo del storefront.
 * No requiere autenticación - endpoints accesibles para clientes.
 * 
 * Rutas base: /api/public/tienda/{tiendaId}/catalogo
 */
@RestController
@RequestMapping("/api/public/tienda/{tiendaId}/catalogo")
@RequiredArgsConstructor
@Slf4j
public class CatalogoPublicoController {

    private final ICatalogoPublicoService catalogoService;

    /**
     * GET /api/public/tienda/{tiendaId}/catalogo/categorias
     * 
     * Obtiene todas las categorías activas de una tienda.
     * Usado en HomePage para el carrusel de categorías.
     * 
     * @param tiendaId ID de la tienda
     * @return Lista de categorías ordenadas por ordenVisual
     */
    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaPublicaResponse>> obtenerCategorias(
        @PathVariable Long tiendaId
    ) {
        log.info("GET /api/public/tienda/{}/catalogo/categorias", tiendaId);
        List<CategoriaPublicaResponse> categorias = catalogoService.obtenerCategoriasActivas(tiendaId);
        return ResponseEntity.ok(categorias);
    }

    /**
     * GET /api/public/tienda/{tiendaId}/catalogo/productos
     * 
     * Busca productos con filtros opcionales y paginación.
     * Usado en ProductsPage, CategoryPage y HomePage (destacados).
     * 
     * Query params:
     * - categoriaId: Filtro por categoría
     * - destacado: true para productos destacados (HomePage)
     * - page: Número de página (default 0)
     * - size: Tamaño de página (default 12)
     * - sort: Ordenamiento (default: nombre,asc)
     * 
     * Ejemplos:
     * - /productos?destacado=true&size=4  → HomePage "Best Sellers"
     * - /productos?categoriaId=5&page=0&size=12  → CategoryPage
     * - /productos  → ProductsPage (todos)
     * 
     * @param tiendaId ID de la tienda
     * @param categoriaId Filtro opcional por categoría
     * @param destacado Filtro opcional por destacados
     * @param pageable Paginación (inyectada por Spring)
     * @return Página de productos
     */
    @GetMapping("/productos")
    public ResponseEntity<Page<ProductoPublicoResponse>> buscarProductos(
        @PathVariable Long tiendaId,
        @RequestParam(required = false) Long categoriaId,
        @RequestParam(required = false) Boolean destacado,
        @PageableDefault(size = 12, sort = "nombre", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        log.info("GET /api/public/tienda/{}/catalogo/productos - categoriaId: {}, destacado: {}, page: {}", 
            tiendaId, categoriaId, destacado, pageable.getPageNumber());
        
        Page<ProductoPublicoResponse> productos = catalogoService.buscarProductos(
            tiendaId, categoriaId, destacado, pageable
        );
        
        return ResponseEntity.ok(productos);
    }

    /**
     * GET /api/public/tienda/{tiendaId}/catalogo/productos/{slug}
     * 
     * Obtiene el detalle completo de un producto por slug.
     * Usado en ProductDetailPage.
     * 
     * Incluye:
     * - Galería de imágenes (imagenesGaleria JSONB)
     * - Atributos personalizados (atributos JSONB)
     * - Información de categoría
     * - Flag es_personalizable para mostrar form de personalización
     * 
     * @param tiendaId ID de la tienda
     * @param slug Slug único del producto (ej: "torta-chocolate-premium")
     * @return Detalle completo del producto
     */
    @GetMapping("/productos/{slug}")
    public ResponseEntity<ProductoDetallePublicoResponse> obtenerProductoPorSlug(
        @PathVariable Long tiendaId,
        @PathVariable String slug
    ) {
        log.info("GET /api/public/tienda/{}/catalogo/productos/{}", tiendaId, slug);
        ProductoDetallePublicoResponse producto = catalogoService.obtenerProductoPorSlug(tiendaId, slug);
        return ResponseEntity.ok(producto);
    }
}
