package com.dulcecontrol.bakery.feature.admin.clientes.controller.dto;

import com.dulcecontrol.bakery.feature.admin.clientes.entity.enums.TipoDocumento;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ClienteResponse {

    private final Long id;
    private final Long tiendaId;
    private final TipoDocumento tipoDoc;
    private final String numeroDoc;
    private final String nombreDoc;
    private final String email;
    private final String telefono;
    private final Boolean esUsuarioVirtual;
    private final String notas;
    private final Boolean activo;
    private final LocalDateTime creadoEn;
    private final LocalDateTime actualizadoEn;
}