package com.dulcecontrol.bakery.features.admin.seguridad.dto;

import com.dulcecontrol.bakery.features.admin.seguridad.entity.TipoDocumento;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class UsuarioResponse {

    private final Long id;
    private final Long tiendaId;
    private final Long rolId;
    private final String rolNombre;
    private final Long sedeId;
    private final String sedeNombre;
    private final List<Long> sedeIds;
    private final List<String> sedes;
    private final String correo;
    private final TipoDocumento tipoDoc;
    private final String numeroDoc;
    private final String nombres;
    private final String telefono;
    private final Boolean activo;
    private final LocalDateTime ultimoAccesoEn;
    private final LocalDateTime creadoEn;
}
