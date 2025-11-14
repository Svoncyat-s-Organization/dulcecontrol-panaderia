package com.dulcecontrol.bakery.feature.superadmin.soporte.dto;

import lombok.Getter;

@Getter
public class MensajeUpdateRequest {
    private String mensaje;
    private Boolean esNotaInterna;
}