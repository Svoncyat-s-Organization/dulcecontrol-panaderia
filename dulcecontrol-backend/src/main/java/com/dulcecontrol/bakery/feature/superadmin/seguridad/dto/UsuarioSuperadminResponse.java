package com.dulcecontrol.bakery.feature.superadmin.seguridad.dto;

import com.dulcecontrol.bakery.feature.superadmin.seguridad.entity.enums.TipoDocumento;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UsuarioSuperadminResponse {

    private final Long id;
    private final String correo;
    private final TipoDocumento tipoDoc;
    private final String numeroDoc;
    private final String nombres;
    private final String telefono;
    private final Boolean activo;
    private final LocalDateTime creadoEn;
    private final LocalDateTime actualizadoEn;
}
