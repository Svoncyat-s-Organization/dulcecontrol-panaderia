package com.dulcecontrol.bakery.features.admin.produccion.dto;

import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.EstadoPlanProduccion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanProduccionResponse {
    private Long id;
    private Long tiendaId;
    private Long sedeId;
    private LocalDate fechaProduccion;
    private EstadoPlanProduccion estado;
    private Long generadoPor;
    private Long confirmadoPor;
    private LocalDateTime horaInicioReal;
    private LocalDateTime horaFinReal;
    private String notasMaestro;
    private LocalDateTime creadoEn;
    private LocalDateTime actualizadoEn;
    private List<DetallePlanProduccionResponse> detalles;
}
