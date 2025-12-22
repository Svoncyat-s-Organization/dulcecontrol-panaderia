package com.dulcecontrol.bakery.features.admin.inventario.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UbicacionFisicaUpdateRequest {

    @Size(max = 100, message = "La ubicación física debe tener máximo 100 caracteres")
    private String ubicacionFisica;
}
