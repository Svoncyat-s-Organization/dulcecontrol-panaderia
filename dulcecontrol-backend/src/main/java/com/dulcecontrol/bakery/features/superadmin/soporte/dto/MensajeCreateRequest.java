package com.dulcecontrol.bakery.features.superadmin.soporte.dto;

import com.dulcecontrol.bakery.features.superadmin.soporte.entity.enums.TipoRemitente;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class MensajeCreateRequest {
    @NotNull
    private Long ticketId;
    @NotNull
    private TipoRemitente tipoRemitente;
    private Long autorAdminId;
    @NotBlank
    private String mensaje;
    private Boolean esNotaInterna;
}