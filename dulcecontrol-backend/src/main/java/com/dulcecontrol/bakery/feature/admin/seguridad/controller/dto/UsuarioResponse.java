package com.dulcecontrol.bakery.feature.admin.seguridad.controller.dto;

import com.dulcecontrol.bakery.feature.admin.seguridad.entity.TipoDocumento;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UsuarioResponse {

    private final Long id;
    private final Long tiendaId;
    private final Long rolId;
    private final String rolNombre;
    private final String correo;
    private final TipoDocumento tipoDoc;
    private final String numeroDoc;
    private final String nombres;
    private final String telefono;
    private final Boolean activo;
    private final LocalDateTime ultimoAccesoEn;
    private final LocalDateTime creadoEn;
}
