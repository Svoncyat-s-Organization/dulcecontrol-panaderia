package com.dulcecontrol.bakery.features.admin.configuracion.service.impl;

import com.dulcecontrol.bakery.features.admin.configuracion.dto.ConfiguracionTiendaResponse;
import com.dulcecontrol.bakery.features.admin.configuracion.dto.ConfiguracionTiendaUpdateRequest;
import com.dulcecontrol.bakery.features.admin.configuracion.entity.ConfiguracionTienda;
import com.dulcecontrol.bakery.features.admin.configuracion.repository.ConfiguracionTiendaRepository;
import com.dulcecontrol.bakery.features.admin.configuracion.service.IConfiguracionTiendaService;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ConfiguracionTiendaService implements IConfiguracionTiendaService {

    private final ConfiguracionTiendaRepository configuracionTiendaRepository;

    @Override
    @Transactional(readOnly = true)
    public ConfiguracionTiendaResponse obtenerPorTiendaId(Long tiendaId) {
        ConfiguracionTienda configuracion = configuracionTiendaRepository.findByTiendaId(tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Configuración de tienda no encontrada"));
        return toResponse(configuracion);
    }

    @Override
    @Transactional
    public ConfiguracionTiendaResponse actualizar(Long tiendaId, ConfiguracionTiendaUpdateRequest request) {
        ConfiguracionTienda configuracion = configuracionTiendaRepository.findByTiendaId(tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Configuración de tienda no encontrada"));

        configuracion.setRuc(request.getRuc());
        configuracion.setRazonSocial(request.getRazonSocial());
        configuracion.setDireccionFiscal(request.getDireccionFiscal());
        configuracion.setUbigeoFiscal(request.getUbigeoFiscal());
        configuracion.setUsuarioSunatSol(request.getUsuarioSunatSol());
        configuracion.setClaveSunatSolEncriptada(request.getClaveSunatSolEncriptada());
        configuracion.setCertificadoDigitalUrl(request.getCertificadoDigitalUrl());
        configuracion.setModoSunat(request.getModoSunat());
        configuracion.setTasaIgv(request.getTasaIgv());
        configuracion.setApiKeyYape(request.getApiKeyYape());
        configuracion.setApiKeyPlin(request.getApiKeyPlin());
        configuracion.setMerchantIdNiubiz(request.getMerchantIdNiubiz());
        configuracion.setBannerPrincipalUrl(request.getBannerPrincipalUrl());
        configuracion.setMensajeBienvenida(request.getMensajeBienvenida());
        configuracion.setHorarioAtencion(request.getHorarioAtencion());
        configuracion.setRedesSociales(request.getRedesSociales());
        configuracion.setEmailNotificaciones(request.getEmailNotificaciones());
        configuracion.setTelegramBotToken(request.getTelegramBotToken());
        configuracion.setTelegramChatId(request.getTelegramChatId());

        ConfiguracionTienda saved = configuracionTiendaRepository.save(configuracion);
        return toResponse(saved);
    }

    private ConfiguracionTiendaResponse toResponse(ConfiguracionTienda configuracion) {
        return ConfiguracionTiendaResponse.builder()
                .tiendaId(configuracion.getTiendaId())
                .ruc(configuracion.getRuc())
                .razonSocial(configuracion.getRazonSocial())
                .direccionFiscal(configuracion.getDireccionFiscal())
                .ubigeoFiscal(configuracion.getUbigeoFiscal())
                .usuarioSunatSol(configuracion.getUsuarioSunatSol())
                .claveSunatSolEncriptada(configuracion.getClaveSunatSolEncriptada())
                .certificadoDigitalUrl(configuracion.getCertificadoDigitalUrl())
                .modoSunat(configuracion.getModoSunat())
                .tasaIgv(configuracion.getTasaIgv())
                .apiKeyYape(configuracion.getApiKeyYape())
                .apiKeyPlin(configuracion.getApiKeyPlin())
                .merchantIdNiubiz(configuracion.getMerchantIdNiubiz())
                .bannerPrincipalUrl(configuracion.getBannerPrincipalUrl())
                .mensajeBienvenida(configuracion.getMensajeBienvenida())
                .horarioAtencion(configuracion.getHorarioAtencion())
                .redesSociales(configuracion.getRedesSociales())
                .emailNotificaciones(configuracion.getEmailNotificaciones())
                .telegramBotToken(configuracion.getTelegramBotToken())
                .telegramChatId(configuracion.getTelegramChatId())
                .actualizadoEn(configuracion.getActualizadoEn())
                .build();
    }
}