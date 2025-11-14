package com.dulcecontrol.bakery.feature.superadmin.soporte.dto;

import com.dulcecontrol.bakery.feature.superadmin.soporte.entity.enums.TipoRemitente;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class MensajeResponse {
    private final Long id;
    private final Long ticketId;
    private final TipoRemitente tipoRemitente;
    private final Long autorAdminId;
    private final String mensaje;
    private final Boolean esNotaInterna;
    private final LocalDateTime leidoEn;
    private final LocalDateTime creadoEn;
}