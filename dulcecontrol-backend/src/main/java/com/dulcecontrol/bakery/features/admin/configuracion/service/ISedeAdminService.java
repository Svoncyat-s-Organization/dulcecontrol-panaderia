package com.dulcecontrol.bakery.features.admin.configuracion.service;

import com.dulcecontrol.bakery.features.admin.configuracion.dto.SedeCreateRequest;
import com.dulcecontrol.bakery.features.admin.configuracion.dto.SedeResponse;
import com.dulcecontrol.bakery.features.admin.configuracion.dto.SedeUpdateRequest;

import java.util.List;

public interface ISedeAdminService {

    /**
     * Obtiene todas las sedes de una tienda
     */
    List<SedeResponse> obtenerSedesPorTienda(Long tiendaId);

    /**
     * Obtiene una sede específica
     */
    SedeResponse obtenerSedePorId(Long tiendaId, Long sedeId);

    /**
     * Crea una nueva sede
     * Valida:
     * - Nombre único dentro de la tienda
     * - Código interno único dentro de la tienda
     * - Solo una sede principal por tienda
     */
    SedeResponse crearSede(Long tiendaId, SedeCreateRequest request);

    /**
     * Actualiza una sede existente
     * Valida:
     * - Nombre único (excepto la propia sede)
     * - Código interno único (excepto la propia sede)
     * - Solo una sede principal por tienda
     */
    SedeResponse actualizarSede(Long tiendaId, Long sedeId, SedeUpdateRequest request);

    /**
     * Desactiva una sede (soft delete)
     * Valida:
     * - No se puede desactivar la sede principal si hay otras sedes activas
     */
    void desactivarSede(Long tiendaId, Long sedeId);

    /**
     * Elimina una sede permanentemente
     * Valida:
     * - No tiene cajas abiertas
     * - No tiene usuarios activos asignados
     */
    void eliminarSede(Long tiendaId, Long sedeId);
}
