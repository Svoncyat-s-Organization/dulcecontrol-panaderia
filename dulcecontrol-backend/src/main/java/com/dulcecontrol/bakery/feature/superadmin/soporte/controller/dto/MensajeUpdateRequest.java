package com.dulcecontrol.bakery.feature.superadmin.soporte.controller.dto;

import lombok.Getter;

@Getter
public class MensajeUpdateRequest {
    private String mensaje;
    private Boolean esNotaInterna;
}