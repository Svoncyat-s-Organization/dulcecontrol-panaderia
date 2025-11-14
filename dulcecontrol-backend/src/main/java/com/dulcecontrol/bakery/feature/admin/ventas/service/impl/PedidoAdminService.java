package com.dulcecontrol.bakery.feature.admin.ventas.service.impl;

import com.dulcecontrol.bakery.feature.admin.ventas.dto.PedidoCreateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.dto.PedidoResponse;
import com.dulcecontrol.bakery.feature.admin.ventas.dto.PedidoUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.Pedido;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.EstadoPagoPedido;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.EstadoPedido;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.TipoEntregaPedido;
import com.dulcecontrol.bakery.feature.admin.ventas.repository.PedidoRepository;
import com.dulcecontrol.bakery.feature.admin.ventas.repository.SesionCajaRepository;
import com.dulcecontrol.bakery.feature.admin.ventas.service.IPedidoAdminService;
import com.dulcecontrol.bakery.feature.admin.ventas.service.helper.VentasTenantValidator;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoAdminService implements IPedidoAdminService {

    private final PedidoRepository pedidoRepository;
    private final SesionCajaRepository sesionCajaRepository;
    private final VentasTenantValidator tenantValidator;

    @Override
    @Transactional(readOnly = true)
    public List<PedidoResponse> listar(Long tiendaId,
                                       Long sedeId,
                                       EstadoPedido estadoPedido,
                                       EstadoPagoPedido estadoPago,
                                       TipoEntregaPedido tipoEntrega,
                                       LocalDateTime fechaDesde,
                                       LocalDateTime fechaHasta) {
        if (sedeId != null) {
            tenantValidator.validarSedePerteneceATienda(tiendaId, sedeId);
        }
        if (fechaDesde != null && fechaHasta != null && fechaDesde.isAfter(fechaHasta)) {
            throw new BadRequestException("La fecha inicial no puede ser mayor a la fecha final");
        }
        List<Pedido> pedidos = pedidoRepository.buscarPorFiltros(tiendaId, sedeId, estadoPedido, estadoPago, tipoEntrega, fechaDesde, fechaHasta);
        return pedidos.stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PedidoResponse obtener(Long tiendaId, Long pedidoId) {
        Pedido pedido = obtenerPedido(tiendaId, pedidoId);
        return toResponse(pedido);
    }

    @Override
    @Transactional
    public PedidoResponse crear(Long tiendaId, PedidoCreateRequest request) {
        if (pedidoRepository.existsByTiendaIdAndCodigoPedidoIgnoreCase(tiendaId, request.codigoPedido())) {
            throw new BadRequestException("El código de pedido ya está registrado para la tienda");
        }

        tenantValidator.validarSedePerteneceATienda(tiendaId, request.sedeOrigenId());
        tenantValidator.validarClientePerteneceATienda(tiendaId, request.clienteId());
        validarSesionPerteneceATienda(tiendaId, request.sesionCajaId());

        Pedido pedido = new Pedido();
        pedido.setCodigoPedido(request.codigoPedido());
        pedido.setTiendaId(tiendaId);
        pedido.setSedeOrigenId(request.sedeOrigenId());
        pedido.setClienteId(request.clienteId());
        pedido.setOrigen(request.origen());
        pedido.setSesionCajaId(request.sesionCajaId());
        pedido.setVendedorId(request.vendedorId());
        pedido.setEstadoPedido(request.estadoPedido());
        pedido.setEstadoPago(request.estadoPago());
        pedido.setTipoEntrega(request.tipoEntrega());
        pedido.setFechaEntregaPactada(request.fechaEntregaPactada());
        pedido.setDireccionEntrega(request.direccionEntrega());
        pedido.setCostoDeliveryCentimos(valorPorDefecto(request.costoDeliveryCentimos(), 0L));
        pedido.setMoneda(request.moneda() != null ? request.moneda() : "PEN");
        pedido.setSubtotalItemsCentimos(request.subtotalItemsCentimos());
        pedido.setDescuentoTotalCentimos(valorPorDefecto(request.descuentoTotalCentimos(), 0L));
        pedido.setImpuestosTotalesCentimos(valorPorDefecto(request.impuestosTotalesCentimos(), 0L));
        pedido.setTotalFinalCentimos(request.totalFinalCentimos());
        pedido.setMontoPagadoCentimos(valorPorDefecto(request.montoPagadoCentimos(), 0L));
        pedido.setRequiereComprobante(request.requiereComprobante() == null ? Boolean.TRUE : request.requiereComprobante());
        pedido.setTipoComprobante(request.tipoComprobante());
        pedido.setSerieComprobante(request.serieComprobante());
        pedido.setNumeroComprobante(request.numeroComprobante());
        pedido.setNotasPedido(request.notasPedido());

        Pedido guardado = pedidoRepository.save(pedido);
        return toResponse(guardado);
    }

    @Override
    @Transactional
    public PedidoResponse actualizar(Long tiendaId, Long pedidoId, PedidoUpdateRequest request) {
        Pedido pedido = obtenerPedido(tiendaId, pedidoId);

        if (pedidoRepository.existsByTiendaIdAndCodigoPedidoIgnoreCaseAndIdNot(tiendaId, request.codigoPedido(), pedidoId)) {
            throw new BadRequestException("El código de pedido ya está registrado para la tienda");
        }

        tenantValidator.validarSedePerteneceATienda(tiendaId, request.sedeOrigenId());
        tenantValidator.validarClientePerteneceATienda(tiendaId, request.clienteId());
        validarSesionPerteneceATienda(tiendaId, request.sesionCajaId());

        pedido.setCodigoPedido(request.codigoPedido());
        pedido.setSedeOrigenId(request.sedeOrigenId());
        pedido.setClienteId(request.clienteId());
        pedido.setOrigen(request.origen());
        pedido.setSesionCajaId(request.sesionCajaId());
        pedido.setVendedorId(request.vendedorId());
        pedido.setEstadoPedido(request.estadoPedido());
        pedido.setEstadoPago(request.estadoPago());
        pedido.setTipoEntrega(request.tipoEntrega());
        pedido.setFechaEntregaPactada(request.fechaEntregaPactada());
        pedido.setDireccionEntrega(request.direccionEntrega());
        pedido.setCostoDeliveryCentimos(valorPorDefecto(request.costoDeliveryCentimos(), 0L));
        pedido.setMoneda(request.moneda() != null ? request.moneda() : "PEN");
        pedido.setSubtotalItemsCentimos(request.subtotalItemsCentimos());
        pedido.setDescuentoTotalCentimos(valorPorDefecto(request.descuentoTotalCentimos(), 0L));
        pedido.setImpuestosTotalesCentimos(valorPorDefecto(request.impuestosTotalesCentimos(), 0L));
        pedido.setTotalFinalCentimos(request.totalFinalCentimos());
        pedido.setMontoPagadoCentimos(valorPorDefecto(request.montoPagadoCentimos(), 0L));
        if (request.requiereComprobante() != null) {
            pedido.setRequiereComprobante(request.requiereComprobante());
        }
        pedido.setTipoComprobante(request.tipoComprobante());
        pedido.setSerieComprobante(request.serieComprobante());
        pedido.setNumeroComprobante(request.numeroComprobante());
        pedido.setNotasPedido(request.notasPedido());

        Pedido actualizado = pedidoRepository.save(pedido);
        return toResponse(actualizado);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long pedidoId) {
        Pedido pedido = obtenerPedido(tiendaId, pedidoId);
        pedidoRepository.delete(pedido);
    }

    private void validarSesionPerteneceATienda(Long tiendaId, Long sesionCajaId) {
        if (sesionCajaId == null) {
            return;
        }
        sesionCajaRepository.findByIdAndTiendaId(sesionCajaId, tiendaId)
                .orElseThrow(() -> new BadRequestException("La sesión de caja indicada no pertenece a la tienda"));
    }

    private Pedido obtenerPedido(Long tiendaId, Long pedidoId) {
        return pedidoRepository.findByIdAndTiendaId(pedidoId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));
    }

    private Long valorPorDefecto(Long valor, Long porDefecto) {
        return valor == null ? porDefecto : valor;
    }

    private PedidoResponse toResponse(Pedido pedido) {
        return PedidoResponse.builder()
                .id(pedido.getId())
                .tiendaId(pedido.getTiendaId())
                .codigoPedido(pedido.getCodigoPedido())
                .sedeOrigenId(pedido.getSedeOrigenId())
                .clienteId(pedido.getClienteId())
                .origen(pedido.getOrigen())
                .sesionCajaId(pedido.getSesionCajaId())
                .vendedorId(pedido.getVendedorId())
                .estadoPedido(pedido.getEstadoPedido())
                .estadoPago(pedido.getEstadoPago())
                .tipoEntrega(pedido.getTipoEntrega())
                .fechaEntregaPactada(pedido.getFechaEntregaPactada())
                .direccionEntrega(pedido.getDireccionEntrega())
                .costoDeliveryCentimos(pedido.getCostoDeliveryCentimos())
                .moneda(pedido.getMoneda())
                .subtotalItemsCentimos(pedido.getSubtotalItemsCentimos())
                .descuentoTotalCentimos(pedido.getDescuentoTotalCentimos())
                .impuestosTotalesCentimos(pedido.getImpuestosTotalesCentimos())
                .totalFinalCentimos(pedido.getTotalFinalCentimos())
        .montoPagadoCentimos(pedido.getMontoPagadoCentimos())
        .saldoPendienteCentimos(pedido.getSaldoPendienteCentimos() == null
            ? null
            : pedido.getSaldoPendienteCentimos().longValue())
                .requiereComprobante(pedido.getRequiereComprobante())
                .tipoComprobante(pedido.getTipoComprobante())
                .serieComprobante(pedido.getSerieComprobante())
                .numeroComprobante(pedido.getNumeroComprobante())
                .notasPedido(pedido.getNotasPedido())
                .creadoEn(pedido.getCreadoEn())
                .actualizadoEn(pedido.getActualizadoEn())
                .build();
    }
}
