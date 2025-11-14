package com.dulcecontrol.bakery.features.superadmin.soporte.dto;

import com.dulcecontrol.bakery.features.superadmin.soporte.entity.enums.PrioridadTicket;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class TicketCreateRequest {
    @NotNull
    private Long tiendaId;

    private Long asignadoAId;

    @NotBlank
    @Size(max = 255)
    private String asunto;

    @NotNull
    private PrioridadTicket prioridad;
}