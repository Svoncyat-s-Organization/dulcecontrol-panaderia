package com.dulcecontrol.bakery.features.admin.configuracion.service;

import com.dulcecontrol.bakery.features.admin.configuracion.dto.ConfiguracionPublicaResponse;
import com.dulcecontrol.bakery.features.admin.configuracion.dto.ConfiguracionPublicaUpdateRequest;

/**
 * Servicio para gestionar la configuración pública de la tienda
 * (banner, mensaje, horarios, redes sociales, políticas)
 */
public interface IConfiguracionPublicaService {

    /**
     * Obtiene la configuración pública completa para mostrar al administrador
     */
    ConfiguracionPublicaResponse obtenerConfiguracionPublica(Long tiendaId);

    /**
     * Actualiza la configuración pública de la tienda
     */
    ConfiguracionPublicaResponse actualizarConfiguracionPublica(Long tiendaId, ConfiguracionPublicaUpdateRequest request);
}
