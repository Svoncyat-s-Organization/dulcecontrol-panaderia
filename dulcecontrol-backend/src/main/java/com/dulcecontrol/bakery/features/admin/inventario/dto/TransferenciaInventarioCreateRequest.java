package com.dulcecontrol.bakery.features.admin.inventario.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransferenciaInventarioCreateRequest {

    @NotNull(message = "La sede de origen es requerida")
    private Long sedeOrigenId;

    @NotNull(message = "La sede de destino es requerida")
    private Long sedeDestinoId;

    private Long solicitadoPor;
    private String observaciones;

    @Valid
    private List<ItemTransferenciaCreateRequest> items;
}
