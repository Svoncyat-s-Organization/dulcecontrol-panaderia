package com.dulcecontrol.bakery.features.admin.compras.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class RecepcionParcialRequest {
    
    @NotNull(message = "El ID de la orden es requerido")
    private Long ordenCompraId;
    
    @NotEmpty(message = "Debe especificar al menos un insumo recibido")
    @Valid
    private List<ItemRecepcionParcial> items;
    
    @Data
    public static class ItemRecepcionParcial {
        @NotNull(message = "El ID del detalle es requerido")
        private Long detalleOrdenCompraId;
        
        @NotNull(message = "La cantidad recibida es requerida")
        private Double cantidadRecibida;
    }
}
