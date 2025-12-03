package com.dulcecontrol.bakery.features.admin.catalogo.service.impl;

import com.dulcecontrol.bakery.features.admin.catalogo.dto.CategoriaCreateRequest;
import com.dulcecontrol.bakery.features.admin.catalogo.dto.CategoriaResponse;
import com.dulcecontrol.bakery.features.admin.catalogo.dto.CategoriaUpdateRequest;
import com.dulcecontrol.bakery.features.admin.catalogo.entity.Categoria;
import com.dulcecontrol.bakery.features.shared.catalogo.repository.CategoriaRepository;
import com.dulcecontrol.bakery.features.shared.catalogo.repository.ProductoRepository;
import com.dulcecontrol.bakery.features.admin.catalogo.service.ICategoriaAdminService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaAdminService implements ICategoriaAdminService {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategoriaResponse> listar(Long tiendaId) {
        return categoriaRepository.findByTiendaIdOrderByOrdenVisualAscNombreAsc(tiendaId)
                .stream()
                .map(categoria -> toResponseWithCount(categoria))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoriaResponse obtener(Long tiendaId, Long categoriaId) {
        Categoria categoria = categoriaRepository.findByIdAndTiendaId(categoriaId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));
        return toResponse(categoria);
    }

    @Override
    @Transactional
    public CategoriaResponse crear(Long tiendaId, CategoriaCreateRequest request) {
        validarDuplicadosAlCrear(tiendaId, request.getNombre(), request.getSlug());

        Categoria categoria = new Categoria();
        categoria.setTiendaId(tiendaId);
        categoria.setNombre(request.getNombre());
        categoria.setSlug(request.getSlug());
        categoria.setDescripcion(request.getDescripcion());
        categoria.setUrlImagen(request.getUrlImagen());
        categoria.setIcono(request.getIcono());
        categoria.setActiva(request.getActiva() == null ? Boolean.TRUE : request.getActiva());
        categoria.setOrdenVisual(request.getOrdenVisual() == null ? 0 : request.getOrdenVisual());

        Categoria guardada = categoriaRepository.save(categoria);
        return toResponse(guardada);
    }

    @Override
    @Transactional
    public CategoriaResponse actualizar(Long tiendaId, Long categoriaId, CategoriaUpdateRequest request) {
        Categoria categoria = categoriaRepository.findByIdAndTiendaId(categoriaId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));

        if (categoriaRepository.existsByTiendaIdAndNombreIgnoreCaseAndIdNot(tiendaId, request.getNombre(), categoriaId)) {
            throw new BadRequestException("El nombre de la categoría ya está registrado para esta tienda");
        }

        if (categoriaRepository.existsByTiendaIdAndSlugIgnoreCaseAndIdNot(tiendaId, request.getSlug(), categoriaId)) {
            throw new BadRequestException("El slug de la categoría ya está registrado para esta tienda");
        }

        categoria.setNombre(request.getNombre());
        categoria.setSlug(request.getSlug());
        categoria.setDescripcion(request.getDescripcion());
        categoria.setUrlImagen(request.getUrlImagen());
        categoria.setIcono(request.getIcono());
        if (request.getActiva() != null) {
            categoria.setActiva(request.getActiva());
        }
        if (request.getOrdenVisual() != null) {
            categoria.setOrdenVisual(request.getOrdenVisual());
        }

        Categoria actualizada = categoriaRepository.save(categoria);
        return toResponse(actualizada);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long categoriaId) {
        Categoria categoria = categoriaRepository.findByIdAndTiendaId(categoriaId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));
        
        // Validar que no tenga productos asignados
        long productosCount = productoRepository.countByCategoriaId(categoriaId);
        if (productosCount > 0) {
            throw new BadRequestException(
                String.format("No se puede eliminar la categoría porque tiene %d producto(s) asignado(s). " +
                    "Primero debes reasignar o eliminar estos productos.", productosCount)
            );
        }
        
        categoriaRepository.delete(categoria);
    }

    private void validarDuplicadosAlCrear(Long tiendaId, String nombre, String slug) {
        if (categoriaRepository.existsByTiendaIdAndNombreIgnoreCase(tiendaId, nombre)) {
            throw new BadRequestException("El nombre de la categoría ya está registrado para esta tienda");
        }
        if (categoriaRepository.existsByTiendaIdAndSlugIgnoreCase(tiendaId, slug)) {
            throw new BadRequestException("El slug de la categoría ya está registrado para esta tienda");
        }
    }

    private CategoriaResponse toResponse(Categoria categoria) {
        return CategoriaResponse.builder()
                .id(categoria.getId())
                .tiendaId(categoria.getTiendaId())
                .nombre(categoria.getNombre())
                .slug(categoria.getSlug())
                .descripcion(categoria.getDescripcion())
                .urlImagen(categoria.getUrlImagen())
                .icono(categoria.getIcono())
                .activa(categoria.getActiva())
                .ordenVisual(categoria.getOrdenVisual())
                .creadoEn(categoria.getCreadoEn())
                .build();
    }

    private CategoriaResponse toResponseWithCount(Categoria categoria) {
        long productosCount = productoRepository.countByCategoriaId(categoria.getId());
        return CategoriaResponse.builder()
                .id(categoria.getId())
                .tiendaId(categoria.getTiendaId())
                .nombre(categoria.getNombre())
                .slug(categoria.getSlug())
                .descripcion(categoria.getDescripcion())
                .urlImagen(categoria.getUrlImagen())
                .icono(categoria.getIcono())
                .activa(categoria.getActiva())
                .ordenVisual(categoria.getOrdenVisual())
                .productosCount(productosCount)
                .creadoEn(categoria.getCreadoEn())
                .build();
    }
}
