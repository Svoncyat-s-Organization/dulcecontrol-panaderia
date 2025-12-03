package com.dulcecontrol.bakery.features.admin.produccion.dto;

import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.EstadoPlanProduccion;
import lombok.Data;

@Data
public class PlanProduccionUpdateRequest {
    private EstadoPlanProduccion estado;
    private String notasMaestro;
}
