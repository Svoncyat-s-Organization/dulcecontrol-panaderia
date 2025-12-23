package com.dulcecontrol.bakery.features.admin.configuracion.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "configuracion_tienda")
@Data
public class ConfiguracionTienda {

    @Id
    @Column(name = "tienda_id")
    private Long tiendaId;

    @Column(length = 20)
    private String ruc;

    @Column(name = "razon_social", length = 255)
    private String razonSocial;

    @Column(name = "direccion_fiscal", columnDefinition = "TEXT")
    private String direccionFiscal;

    @Column(name = "ubigeo_fiscal", length = 6)
    private String ubigeoFiscal;

    @Column(name = "usuario_sunat_sol", length = 100)
    private String usuarioSunatSol;

    @Column(name = "clave_sunat_sol_encriptada", columnDefinition = "TEXT")
    private String claveSunatSolEncriptada;

    @Column(name = "certificado_digital_url", columnDefinition = "TEXT")
    private String certificadoDigitalUrl;

    @Column(name = "modo_sunat", length = 20)
    private String modoSunat = "pruebas";

    @Column(name = "tasa_igv", precision = 5, scale = 2)
    private BigDecimal tasaIgv = new BigDecimal("18.00");

    @Column(name = "api_key_yape", length = 255)
    private String apiKeyYape;

    @Column(name = "api_key_plin", length = 255)
    private String apiKeyPlin;

    @Column(name = "merchant_id_niubiz", length = 100)
    private String merchantIdNiubiz;

    @Column(name = "slogan_parte1", length = 50)
    private String sloganParte1;

    @Column(name = "slogan_parte2", length = 50)
    private String sloganParte2;

    @Column(name = "banner_principal_url", columnDefinition = "TEXT")
    private String bannerPrincipalUrl;

    @Column(name = "mensaje_bienvenida", columnDefinition = "TEXT")
    private String mensajeBienvenida;

    @Column(name = "horario_atencion", columnDefinition = "JSON")
    private String horarioAtencion;

    @Column(name = "redes_sociales", columnDefinition = "JSON")
    private String redesSociales;

    @Column(name = "email_notificaciones", length = 255)
    private String emailNotificaciones;

    @Column(name = "telegram_bot_token", length = 255)
    private String telegramBotToken;

    @Column(name = "telegram_chat_id", length = 100)
    private String telegramChatId;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        actualizadoEn = LocalDateTime.now();
    }
}