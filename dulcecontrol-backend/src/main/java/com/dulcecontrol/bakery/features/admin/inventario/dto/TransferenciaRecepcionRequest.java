package com.dulcecontrol.bakery.features.admin.inventario.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransferenciaRecepcionRequest {

    private Long recibidoPor;

    @NotEmpty(message = "Debe incluir al menos un item")
    @Valid
    private List<ItemTransferenciaRecepcionRequest> items;
}
