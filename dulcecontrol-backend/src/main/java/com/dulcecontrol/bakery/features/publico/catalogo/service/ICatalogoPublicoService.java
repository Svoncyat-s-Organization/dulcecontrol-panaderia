package com.dulcecontrol.bakery.features.publico.catalogo.service;

import com.dulcecontrol.bakery.features.publico.catalogo.dto.CategoriaPublicaResponse;
import com.dulcecontrol.bakery.features.publico.catalogo.dto.ProductoDetallePublicoResponse;
import com.dulcecontrol.bakery.features.publico.catalogo.dto.ProductoPublicoResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Interface del servicio de Catálogo Público.
 * Expone productos y categorías para el storefront sin autenticación.
 */
public interface ICatalogoPublicoService {

    /**
     * Obtiene todas las categorías activas de una tienda.
     * Usado en el carrusel de HomePage y menús de navegación.
     *
     * @param tiendaId ID de la tienda
     * @return Lista de categorías ordenadas por ordenVisual
     */
    List<CategoriaPublicaResponse> obtenerCategoriasActivas(Long tiendaId);

    /**
     * Busca productos con filtros opcionales.
     * Usado en ProductsPage y CategoryPage.
     *
     * @param tiendaId ID de la tienda
     * @param categoriaId Filtro opcional por categoría
     * @param destacado Filtro opcional por productos destacados
     * @param pageable Paginación y ordenamiento
     * @return Página de productos filtrados
     */
    Page<ProductoPublicoResponse> buscarProductos(
        Long tiendaId,
        Long categoriaId,
        Boolean destacado,
        Pageable pageable
    );

    /**
     * Obtiene el detalle completo de un producto por slug.
     * Usado en ProductDetailPage.
     *
     * @param tiendaId ID de la tienda
     * @param slug Slug único del producto
     * @return Detalle del producto con galería y atributos
     * @throws jakarta.persistence.EntityNotFoundException si no existe
     */
    ProductoDetallePublicoResponse obtenerProductoPorSlug(Long tiendaId, String slug);
}
