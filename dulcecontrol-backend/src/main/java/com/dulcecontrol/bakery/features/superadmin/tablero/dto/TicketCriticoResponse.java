package com.dulcecontrol.bakery.features.superadmin.tablero.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketCriticoResponse {
    private String id;
    private String tienda;
    private String prioridad;
    private String estado;
    private String vencimiento;
}
