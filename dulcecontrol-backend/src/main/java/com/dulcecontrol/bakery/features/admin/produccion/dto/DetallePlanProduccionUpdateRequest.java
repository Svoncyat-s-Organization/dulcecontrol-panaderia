package com.dulcecontrol.bakery.features.admin.produccion.dto;

import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.EstadoItemProduccion;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class DetallePlanProduccionUpdateRequest {

    private Integer cantidadProducida;

    @Min(value = 0, message = "cantidadMerma debe ser >= 0")
    private Integer cantidadMerma;

    private EstadoItemProduccion estado;

    private String observaciones;
}
