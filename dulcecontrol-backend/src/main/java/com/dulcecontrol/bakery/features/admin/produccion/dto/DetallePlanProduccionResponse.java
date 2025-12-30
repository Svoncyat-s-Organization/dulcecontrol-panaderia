package com.dulcecontrol.bakery.features.admin.produccion.dto;

import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.EstadoItemProduccion;
import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.OrigenItemProduccion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DetallePlanProduccionResponse {
    private Long id;
    private Long planId;
    private Long productoId;
    private String productoNombre;
    private OrigenItemProduccion origen;
    private Long pedidoClienteId;
    private Long detallePedidoId;
    private Boolean esPersonalizado;
    private Long personalizacionId;
    private Integer cantidadSugerida;
    private Integer cantidadPlanificada;
    private Integer cantidadProducida;
    private Integer cantidadMerma;
    private EstadoItemProduccion estado;
    private LocalDateTime horaTermino;
    private String observaciones;
    private String notasCliente;
}
