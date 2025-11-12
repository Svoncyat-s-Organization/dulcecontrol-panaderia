package com.dulcecontrol.bakery.feature.admin.inventario.controller.dto;

import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.EstadoTransferencia;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class TransferenciaInventarioDTO {
    private Long id;
    private Long tiendaId;
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
    private List<ItemTransferenciaDTO> items;
}
