package com.dulcecontrol.bakery.features.admin.configuracion.service.impl;

import com.dulcecontrol.bakery.features.admin.configuracion.dto.ConfiguracionPublicaResponse;
import com.dulcecontrol.bakery.features.admin.configuracion.dto.ConfiguracionPublicaUpdateRequest;
import com.dulcecontrol.bakery.features.admin.configuracion.entity.ConfiguracionTienda;
import com.dulcecontrol.bakery.features.admin.configuracion.repository.ConfiguracionTiendaRepository;
import com.dulcecontrol.bakery.features.admin.configuracion.repository.DominioTiendaAdminRepository;
import com.dulcecontrol.bakery.features.admin.configuracion.service.IConfiguracionPublicaService;
import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.DominioTienda;
import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.Tienda;
import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.enums.TipoDominioTienda;
import com.dulcecontrol.bakery.features.superadmin.tiendas.repository.TiendaRepository;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ConfiguracionPublicaService implements IConfiguracionPublicaService {

    private final ConfiguracionTiendaRepository configuracionTiendaRepository;
    private final DominioTiendaAdminRepository dominioTiendaAdminRepository;
    private final TiendaRepository tiendaRepository;

    @Override
    @Transactional(readOnly = true)
    public ConfiguracionPublicaResponse obtenerConfiguracionPublica(Long tiendaId) {
        Tienda tienda = tiendaRepository.findById(tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Tienda no encontrada"));
        
        ConfiguracionTienda config = configuracionTiendaRepository.findByTiendaId(tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Configuración de tienda no encontrada"));

        DominioTienda dominio = dominioTiendaAdminRepository.findByTienda_IdAndTipo(tiendaId, TipoDominioTienda.TIENDA_VIRTUAL)
                .orElseThrow(() -> new ResourceNotFoundException("Dominio de tienda virtual no encontrado"));

        return ConfiguracionPublicaResponse.builder()
                .tiendaId(tiendaId)
                .nombreTienda(tienda.getNombreComercial())
                .sloganParte1(config.getSloganParte1())
                .sloganParte2(config.getSloganParte2())
                .bannerPrincipalUrl(config.getBannerPrincipalUrl())
                .mensajeBienvenida(config.getMensajeBienvenida())
                .horarioAtencion(config.getHorarioAtencion())
                .redesSociales(config.getRedesSociales())
                .urlLogo(dominio.getUrlLogo())
                .urlFavicon(dominio.getUrlFavicon())
                .colorPrimario(dominio.getColorPrimario())
                .colorSecundario(dominio.getColorSecundario())
                .build();
    }

    @Override
    @Transactional
    public ConfiguracionPublicaResponse actualizarConfiguracionPublica(Long tiendaId, ConfiguracionPublicaUpdateRequest request) {
        ConfiguracionTienda config = configuracionTiendaRepository.findByTiendaId(tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Configuración de tienda no encontrada"));

        config.setSloganParte1(request.getSloganParte1());
        config.setSloganParte2(request.getSloganParte2());
        config.setBannerPrincipalUrl(request.getBannerPrincipalUrl());
        config.setMensajeBienvenida(request.getMensajeBienvenida());
        config.setHorarioAtencion(request.getHorarioAtencion());
        config.setRedesSociales(request.getRedesSociales());

        configuracionTiendaRepository.save(config);

        return obtenerConfiguracionPublica(tiendaId);
    }
}
