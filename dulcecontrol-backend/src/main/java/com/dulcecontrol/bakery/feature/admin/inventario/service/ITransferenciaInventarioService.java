package com.dulcecontrol.bakery.feature.admin.inventario.service;

import com.dulcecontrol.bakery.feature.admin.inventario.controller.dto.TransferenciaInventarioDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.EstadoTransferencia;
import java.time.LocalDateTime;
import java.util.List;

public interface ITransferenciaInventarioService {
    List<TransferenciaInventarioDTO> obtenerTodas();

    TransferenciaInventarioDTO obtenerPorId(Long id);

    List<TransferenciaInventarioDTO> obtenerPorTienda(Long tiendaId);

    List<TransferenciaInventarioDTO> obtenerPorSede(Long sedeId);

    List<TransferenciaInventarioDTO> obtenerPorEstado(EstadoTransferencia estado);

    TransferenciaInventarioDTO crear(TransferenciaInventarioDTO dto);

    TransferenciaInventarioDTO actualizar(Long id, TransferenciaInventarioDTO dto);

    void eliminar(Long id);

    TransferenciaInventarioDTO cambiarEstado(Long id, EstadoTransferencia nuevoEstado);

    TransferenciaInventarioDTO autorizarTransferencia(Long id, Long autorizadoPor);

    TransferenciaInventarioDTO recibirTransferencia(Long id, Long recibidoPor);

    List<TransferenciaInventarioDTO> obtenerPorRangoFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin);
}
