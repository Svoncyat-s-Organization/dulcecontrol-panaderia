package com.dulcecontrol.bakery.feature.admin.configuracion.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class ConfiguracionTiendaResponse {

    private final Long tiendaId;
    private final String ruc;
    private final String razonSocial;
    private final String direccionFiscal;
    private final String ubigeoFiscal;
    private final String usuarioSunatSol;
    private final String claveSunatSolEncriptada;
    private final String certificadoDigitalUrl;
    private final String modoSunat;
    private final BigDecimal tasaIgv;
    private final String apiKeyYape;
    private final String apiKeyPlin;
    private final String merchantIdNiubiz;
    private final String bannerPrincipalUrl;
    private final String mensajeBienvenida;
    private final String horarioAtencion;
    private final String redesSociales;
    private final String politicasEnvio;
    private final String politicasDevolucion;
    private final String emailNotificaciones;
    private final String telegramBotToken;
    private final String telegramChatId;
    private final LocalDateTime actualizadoEn;
}