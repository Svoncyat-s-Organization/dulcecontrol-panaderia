package com.dulcecontrol.bakery.features.admin.configuracion.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ConfiguracionTiendaUpdateRequest {

    @NotBlank(message = "El RUC es obligatorio")
    private String ruc;

    @NotBlank(message = "La razón social es obligatoria")
    private String razonSocial;

    @NotBlank(message = "La dirección fiscal es obligatoria")
    private String direccionFiscal;

    @NotBlank(message = "El ubigeo fiscal es obligatorio")
    private String ubigeoFiscal;

    private String usuarioSunatSol;

    private String claveSunatSolEncriptada;

    private String certificadoDigitalUrl;

    private String modoSunat;

    @NotNull(message = "La tasa IGV es obligatoria")
    @DecimalMin(value = "0.00", message = "La tasa IGV debe ser mayor o igual a 0")
    @DecimalMax(value = "100.00", message = "La tasa IGV debe ser menor o igual a 100")
    private BigDecimal tasaIgv;

    private String apiKeyYape;

    private String apiKeyPlin;

    private String merchantIdNiubiz;

    private String bannerPrincipalUrl;

    private String mensajeBienvenida;

    private String horarioAtencion;

    private String redesSociales;

    private String politicasEnvio;

    private String politicasDevolucion;

    @Email(message = "El email de notificaciones debe tener un formato válido")
    private String emailNotificaciones;

    private String telegramBotToken;

    private String telegramChatId;
}