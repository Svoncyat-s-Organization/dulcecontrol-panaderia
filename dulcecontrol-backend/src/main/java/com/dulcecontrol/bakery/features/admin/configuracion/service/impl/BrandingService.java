package com.dulcecontrol.bakery.features.admin.configuracion.service.impl;

import com.dulcecontrol.bakery.features.admin.configuracion.dto.BrandingResponse;
import com.dulcecontrol.bakery.features.admin.configuracion.dto.BrandingUpdateRequest;
import com.dulcecontrol.bakery.features.admin.configuracion.repository.DominioTiendaAdminRepository;
import com.dulcecontrol.bakery.features.admin.configuracion.service.IBrandingService;
import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.DominioTienda;
import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.enums.TipoDominioTienda;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BrandingService implements IBrandingService {

    private final DominioTiendaAdminRepository dominioTiendaAdminRepository;

    @Override
    @Transactional(readOnly = true)
    public BrandingResponse obtenerBrandingPorTienda(Long tiendaId) {
        DominioTienda dominio = dominioTiendaAdminRepository.findByTienda_IdAndTipo(tiendaId, TipoDominioTienda.TIENDA_VIRTUAL)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el dominio de tienda virtual para esta tienda"));

        return toBrandingResponse(dominio);
    }

    @Override
    @Transactional
    public BrandingResponse actualizarBranding(Long tiendaId, BrandingUpdateRequest request) {
        DominioTienda dominio = dominioTiendaAdminRepository.findByTienda_IdAndTipo(tiendaId, TipoDominioTienda.TIENDA_VIRTUAL)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el dominio de tienda virtual para esta tienda"));

        dominio.setUrlLogo(request.getUrlLogo());
        dominio.setUrlFavicon(request.getUrlFavicon());
        dominio.setColorPrimario(request.getColorPrimario());
        dominio.setColorSecundario(request.getColorSecundario());

        DominioTienda saved = dominioTiendaAdminRepository.save(dominio);
        return toBrandingResponse(saved);
    }

    private BrandingResponse toBrandingResponse(DominioTienda dominio) {
        return BrandingResponse.builder()
                .id(dominio.getId())
                .tiendaId(dominio.getTienda().getId())
                .tipo(dominio.getTipo().name())
                .urlDominio(dominio.getUrlDominio())
                .urlLogo(dominio.getUrlLogo())
                .urlFavicon(dominio.getUrlFavicon())
                .colorPrimario(dominio.getColorPrimario())
                .colorSecundario(dominio.getColorSecundario())
                .actualizadoEn(dominio.getActualizadoEn())
                .build();
    }
}
