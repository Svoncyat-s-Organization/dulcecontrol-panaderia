package com.dulcecontrol.bakery.features.superadmin.seguridad.dto;

import com.dulcecontrol.bakery.features.superadmin.seguridad.entity.enums.TipoDocumento;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Set;

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
    private final Set<RolSuperadminSummaryResponse> roles;
}
