package com.dulcecontrol.bakery.feature.admin.inventario.dto;

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
public class TransferenciaInventarioUpdateRequest {

    private Long sedeOrigenId;
    private Long sedeDestinoId;
    private Long autorizadoPor;
    private Long recibidoPor;
    private String observaciones;

    @Valid
    private List<ItemTransferenciaCreateRequest> items;
}
