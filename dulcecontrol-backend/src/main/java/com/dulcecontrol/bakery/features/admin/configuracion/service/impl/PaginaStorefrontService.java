package com.dulcecontrol.bakery.features.admin.configuracion.service.impl;

import com.dulcecontrol.bakery.features.admin.configuracion.dto.PaginaStorefrontCreateRequest;
import com.dulcecontrol.bakery.features.admin.configuracion.dto.PaginaStorefrontResponse;
import com.dulcecontrol.bakery.features.admin.configuracion.dto.PaginaStorefrontUpdateRequest;
import com.dulcecontrol.bakery.features.admin.configuracion.entity.PaginaStorefront;
import com.dulcecontrol.bakery.features.admin.configuracion.repository.PaginaStorefrontRepository;
import com.dulcecontrol.bakery.features.admin.configuracion.service.IPaginaStorefrontService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaginaStorefrontService implements IPaginaStorefrontService {

    private final PaginaStorefrontRepository paginaStorefrontRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PaginaStorefrontResponse> listarPorTienda(Long tiendaId) {
        return paginaStorefrontRepository.findByTiendaId(tiendaId)
                .stream()
                .sorted(Comparator.comparing(PaginaStorefront::getOrdenMenu))
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaginaStorefrontResponse> buscarPorTiendaYTexto(Long tiendaId, String busqueda) {
        if (busqueda == null || busqueda.trim().isEmpty()) {
            return listarPorTienda(tiendaId);
        }
        return paginaStorefrontRepository.buscarPorTiendaYTexto(tiendaId, busqueda.trim())
                .stream()
                .sorted(Comparator.comparing(PaginaStorefront::getOrdenMenu))
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PaginaStorefrontResponse obtenerPorId(Long tiendaId, Long paginaId) {
        PaginaStorefront pagina = paginaStorefrontRepository.findByIdAndTiendaId(paginaId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Página no encontrada"));
        return toResponse(pagina);
    }

    @Override
    @Transactional
    public PaginaStorefrontResponse crear(Long tiendaId, PaginaStorefrontCreateRequest request) {
        // Validar slug único
        if (paginaStorefrontRepository.existsByTiendaIdAndSlug(tiendaId, request.getSlug())) {
            throw new BadRequestException("Ya existe una página con el mismo slug");
        }

        PaginaStorefront pagina = new PaginaStorefront();
        pagina.setTiendaId(tiendaId);
        pagina.setSlug(request.getSlug());
        pagina.setTitulo(request.getTitulo());
        pagina.setContenido(request.getContenido());
        pagina.setMetaDescripcion(request.getMetaDescripcion());
        pagina.setOrdenMenu(request.getOrdenMenu());
        pagina.setVisibleEnMenu(request.getVisibleEnMenu());
        pagina.setActiva(request.getActiva());

        PaginaStorefront saved = paginaStorefrontRepository.save(pagina);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public PaginaStorefrontResponse actualizar(Long tiendaId, Long paginaId, PaginaStorefrontUpdateRequest request) {
        PaginaStorefront pagina = paginaStorefrontRepository.findByIdAndTiendaId(paginaId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Página no encontrada"));

        // Validar slug único (excluyendo la actual)
        if (paginaStorefrontRepository.existsByTiendaIdAndSlugAndIdNot(tiendaId, request.getSlug(), paginaId)) {
            throw new BadRequestException("Ya existe otra página con el mismo slug");
        }

        pagina.setSlug(request.getSlug());
        pagina.setTitulo(request.getTitulo());
        pagina.setContenido(request.getContenido());
        pagina.setMetaDescripcion(request.getMetaDescripcion());
        pagina.setOrdenMenu(request.getOrdenMenu());
        pagina.setVisibleEnMenu(request.getVisibleEnMenu());
        pagina.setActiva(request.getActiva());

        PaginaStorefront saved = paginaStorefrontRepository.save(pagina);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long paginaId) {
        PaginaStorefront pagina = paginaStorefrontRepository.findByIdAndTiendaId(paginaId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Página no encontrada"));
        paginaStorefrontRepository.delete(pagina);
    }

    private PaginaStorefrontResponse toResponse(PaginaStorefront pagina) {
        return PaginaStorefrontResponse.builder()
                .id(pagina.getId())
                .tiendaId(pagina.getTiendaId())
                .slug(pagina.getSlug())
                .titulo(pagina.getTitulo())
                .contenido(pagina.getContenido())
                .metaDescripcion(pagina.getMetaDescripcion())
                .ordenMenu(pagina.getOrdenMenu())
                .visibleEnMenu(pagina.getVisibleEnMenu())
                .activa(pagina.getActiva())
                .creadoEn(pagina.getCreadoEn())
                .actualizadoEn(pagina.getActualizadoEn())
                .build();
    }
}