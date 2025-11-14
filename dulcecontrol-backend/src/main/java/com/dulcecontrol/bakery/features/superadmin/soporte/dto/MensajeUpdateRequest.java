package com.dulcecontrol.bakery.features.superadmin.soporte.dto;

import lombok.Getter;

@Getter
public class MensajeUpdateRequest {
    private String mensaje;
    private Boolean esNotaInterna;
}