package com.dulcecontrol.bakery.features.superadmin.tiendas.service.impl;

import com.dulcecontrol.bakery.features.superadmin.tiendas.dto.DominioCreateRequest;
import com.dulcecontrol.bakery.features.superadmin.tiendas.dto.DominioResponse;
import com.dulcecontrol.bakery.features.superadmin.tiendas.dto.DominioUpdateRequest;
import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.DominioTienda;
import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.Tienda;
import com.dulcecontrol.bakery.features.superadmin.tiendas.repository.DominioTiendaRepository;
import com.dulcecontrol.bakery.features.superadmin.tiendas.repository.TiendaRepository;
import com.dulcecontrol.bakery.features.superadmin.tiendas.service.IDominioSuperAdminService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DominioSuperAdminService implements IDominioSuperAdminService {

    private final DominioTiendaRepository dominioRepository;
    private final TiendaRepository tiendaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DominioResponse> listarPorTienda(Long tiendaId) {
        validarTiendaExiste(tiendaId);
        return dominioRepository.findByTiendaId(tiendaId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DominioResponse obtenerPorId(Long tiendaId, Long dominioId) {
        DominioTienda dominio = obtenerDominio(tiendaId, dominioId);
        return toResponse(dominio);
    }

    @Override
    @Transactional
    public DominioResponse crear(Long tiendaId, DominioCreateRequest request) {
        Tienda tienda = obtenerTienda(tiendaId);
        String dominioNormalizado = normalizarDominio(request.getUrlDominio());
        validarUrlDisponible(dominioNormalizado, null);

        DominioTienda dominio = DominioTienda.builder()
                .tienda(tienda)
                .tipo(request.getTipo())
                .urlDominio(dominioNormalizado)
                .urlLogo(normalizarUrl(request.getUrlLogo()))
                .urlFavicon(normalizarUrl(request.getUrlFavicon()))
                .colorPrimario(normalizarColor(request.getColorPrimario(), "#000000"))
                .colorSecundario(normalizarColor(request.getColorSecundario(), "#FFFFFF"))
                .build();

        DominioTienda guardado = dominioRepository.save(dominio);
        return toResponse(guardado);
    }

    @Override
    @Transactional
    public DominioResponse actualizar(Long tiendaId, Long dominioId, DominioUpdateRequest request) {
        DominioTienda dominio = obtenerDominio(tiendaId, dominioId);

        String dominioNormalizado = normalizarDominio(request.getUrlDominio());
        validarUrlDisponible(dominioNormalizado, dominioId);

        dominio.setTipo(request.getTipo());
        dominio.setUrlDominio(dominioNormalizado);
        dominio.setUrlLogo(normalizarUrl(request.getUrlLogo()));
        dominio.setUrlFavicon(normalizarUrl(request.getUrlFavicon()));
        dominio.setColorPrimario(normalizarColor(request.getColorPrimario(), "#000000"));
        dominio.setColorSecundario(normalizarColor(request.getColorSecundario(), "#FFFFFF"));

        DominioTienda actualizado = dominioRepository.save(dominio);
        return toResponse(actualizado);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long dominioId) {
        DominioTienda dominio = obtenerDominio(tiendaId, dominioId);
        dominioRepository.delete(dominio);
    }

    private DominioTienda obtenerDominio(Long tiendaId, Long dominioId) {
        return dominioRepository.findByIdAndTiendaId(dominioId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("El dominio solicitado no existe para la tienda indicada"));
    }

    private Tienda obtenerTienda(Long tiendaId) {
        return tiendaRepository.findById(tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("La tienda indicada no existe"));
    }

    private void validarTiendaExiste(Long tiendaId) {
        if (!tiendaRepository.existsById(tiendaId)) {
            throw new ResourceNotFoundException("La tienda indicada no existe");
        }
    }

    private void validarUrlDisponible(String urlDominio, Long dominioId) {
        boolean ocupado = dominioId == null
                ? dominioRepository.existsByUrlDominio(urlDominio)
                : dominioRepository.existsByUrlDominioAndIdNot(urlDominio, dominioId);

        if (ocupado) {
            throw new BadRequestException("La URL de dominio ya está registrada en otra tienda");
        }
    }

    private DominioResponse toResponse(DominioTienda dominio) {
        return DominioResponse.builder()
                .id(dominio.getId())
                .tiendaId(dominio.getTienda().getId())
                .tipo(dominio.getTipo())
                .urlDominio(dominio.getUrlDominio())
                .urlLogo(dominio.getUrlLogo())
                .urlFavicon(dominio.getUrlFavicon())
                .colorPrimario(dominio.getColorPrimario())
                .colorSecundario(dominio.getColorSecundario())
                .creadoEn(dominio.getCreadoEn())
                .actualizadoEn(dominio.getActualizadoEn())
                .build();
    }

    private String normalizarDominio(String dominio) {
        if (dominio == null) {
            return null;
        }
        String normalizado = dominio.trim().toLowerCase();
        if (normalizado.startsWith("http://")) {
            normalizado = normalizado.substring(7);
        } else if (normalizado.startsWith("https://")) {
            normalizado = normalizado.substring(8);
        }
        if (normalizado.endsWith("/")) {
            normalizado = normalizado.substring(0, normalizado.length() - 1);
        }
        return normalizado;
    }

    private String normalizarUrl(String url) {
        return url == null ? null : url.trim();
    }

    private String normalizarColor(String color, String valorPorDefecto) {
        if (color == null || color.isBlank()) {
            return valorPorDefecto;
        }
        String normalizado = color.trim();
        if (!normalizado.startsWith("#")) {
            normalizado = "#" + normalizado;
        }
        return normalizado.toUpperCase();
    }
}
