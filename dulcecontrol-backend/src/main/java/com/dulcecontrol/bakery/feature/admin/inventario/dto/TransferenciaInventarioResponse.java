package com.dulcecontrol.bakery.feature.admin.inventario.dto;

import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.EstadoTransferencia;
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
public class TransferenciaInventarioResponse {
    private Long id;
    private Long sedeOrigenId;
    private Long sedeDestinoId;
    private EstadoTransferencia estado;
    private Long solicitadoPor;
    private Long autorizadoPor;
    private Long recibidoPor;
    private LocalDateTime fechaSolicitud;
    private LocalDateTime fechaEnvio;
    private LocalDateTime fechaRecepcion;
    private String observaciones;
    private List<ItemTransferenciaResponse> items;
}
