package com.dulcecontrol.bakery.features.admin.seguridad.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Builder
public class AuditoriaUsuarioResponse {

    private final Long id;
    private final Long tiendaId;
    private final Long usuarioId;
    private final String usuarioNombre;
    private final String accion;
    private final String entidad;
    private final Long entidadId;
    private final Map<String, Object> valoresAnteriores;
    private final Map<String, Object> valoresNuevos;
    private final String ipOrigen;
    private final LocalDateTime creadoEn;
}
