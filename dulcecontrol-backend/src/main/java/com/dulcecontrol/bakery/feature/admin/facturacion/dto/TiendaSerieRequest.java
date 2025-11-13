package com.dulcecontrol.bakery.feature.admin.facturacion.dto;

import com.dulcecontrol.bakery.feature.admin.facturacion.entity.enums.TipoComprobante;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TiendaSerieRequest {

    @NotNull(message = "El tiendaId es obligatorio")
    private Long tiendaId;

    @NotNull(message = "El sedeId es obligatorio")
    private Long sedeId;

    @NotNull(message = "El tipo de comprobante es obligatorio")
    private TipoComprobante tipoComprobante;

    @NotNull(message = "La serie es obligatoria")
    @Size(min = 4, max = 4, message = "La serie debe tener exactamente 4 caracteres")
    @Pattern(regexp = "^[A-Z0-9]{4}$", message = "La serie solo puede contener letras mayúsculas y números")
    private String serie;

    private Integer correlativoActual = 0;

    private Boolean esElectronica = Boolean.TRUE;

    private Boolean activa = Boolean.TRUE;
}
