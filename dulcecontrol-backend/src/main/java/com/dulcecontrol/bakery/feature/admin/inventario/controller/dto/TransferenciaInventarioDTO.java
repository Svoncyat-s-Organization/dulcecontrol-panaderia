package com.dulcecontrol.bakery.feature.admin.inventario.controller.dto;

import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.EstadoTransferencia;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransferenciaInventarioDTO {
    private Long id;

    @NotNull(message = "La sede de origen es requerida")
    private Long sedeOrigenId;

    @NotNull(message = "La sede de destino es requerida")
    private Long sedeDestinoId;

    private EstadoTransferencia estado;
    private Long solicitadoPor;
    private Long autorizadoPor;
    private Long recibidoPor;
    private LocalDateTime fechaSolicitud;
    private LocalDateTime fechaEnvio;
    private LocalDateTime fechaRecepcion;
    private String observaciones;

    private List<ItemTransferenciaDTO> items;
}
