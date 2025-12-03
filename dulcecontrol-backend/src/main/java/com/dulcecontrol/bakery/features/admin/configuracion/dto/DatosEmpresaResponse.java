package com.dulcecontrol.bakery.features.admin.configuracion.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class DatosEmpresaResponse {

    // Identidad Legal (de tiendas)
    private final Long tiendaId;
    private final String numeroDoc; // RUC
    private final String nombreDoc; // Razón Social
    private final String nombreComercial;
    private final String correoContacto;
    private final String telefonoContacto;

    // Datos Fiscales (de configuracion_tienda)
    private final String direccionFiscal;
    private final String ubigeoFiscal;

    // Configuración SUNAT (de configuracion_tienda)
    private final String usuarioSunatSol;
    // NOTA: claveSunatSolEncriptada NO se expone por seguridad
    private final String certificadoDigitalUrl;
    private final String modoSunat; // PRUEBAS o PRODUCCION

    // Parámetros Globales
    private final BigDecimal tasaIgv;
    private final String logoUrl; // url_logo de dominios_tienda

    private final LocalDateTime actualizadoEn;
}
