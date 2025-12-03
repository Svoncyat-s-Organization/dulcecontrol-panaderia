package com.dulcecontrol.bakery.features.admin.produccion.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PlanProduccionCreateRequest {

    @NotNull(message = "sedeId es requerido")
    private Long sedeId;

    @NotNull(message = "fechaProduccion es requerida")
    private LocalDate fechaProduccion;

    private String notasMaestro;

    private List<DetallePlanItem> detalles;

    @Data
    public static class DetallePlanItem {
        @NotNull(message = "productoId es requerido")
        private Long productoId;

        @NotNull(message = "cantidadPlanificada es requerida")
        private Integer cantidadPlanificada;

        private Integer cantidadSugerida;
        private String observaciones;
    }
}
