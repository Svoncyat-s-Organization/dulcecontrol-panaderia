package com.dulcecontrol.bakery.features.admin.ventas.service.impl;

import com.dulcecontrol.bakery.features.admin.ventas.dto.PedidoCreateRequest;
import com.dulcecontrol.bakery.features.admin.ventas.dto.PedidoResponse;
import com.dulcecontrol.bakery.features.admin.ventas.dto.PedidoUpdateRequest;
import com.dulcecontrol.bakery.features.admin.ventas.entity.Pedido;
import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.EstadoPagoPedido;
import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.EstadoPedido;
import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.TipoEntregaPedido;
import com.dulcecontrol.bakery.features.admin.ventas.entity.DetallePedido;
import com.dulcecontrol.bakery.features.admin.ventas.repository.DetallePedidoRepository;
import com.dulcecontrol.bakery.features.admin.ventas.repository.PedidoRepository;
import com.dulcecontrol.bakery.features.admin.ventas.repository.SesionCajaRepository;
import com.dulcecontrol.bakery.features.admin.ventas.service.IPedidoAdminService;
import com.dulcecontrol.bakery.features.admin.ventas.service.helper.VentasTenantValidator;
import com.dulcecontrol.bakery.features.admin.inventario.service.IInventarioProductoService;
import com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioProductoUpdateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioProductoResponse;
import com.dulcecontrol.bakery.features.admin.inventario.entity.MovimientoInventarioProducto;
import com.dulcecontrol.bakery.features.admin.inventario.entity.enums.MotivoMovimientoProducto;
import com.dulcecontrol.bakery.features.admin.inventario.entity.enums.TipoMovimientoInsumo;
import com.dulcecontrol.bakery.features.admin.inventario.repository.MovimientoInventarioProductoRepository;
import com.dulcecontrol.bakery.features.admin.produccion.entity.PlanProduccion;
import com.dulcecontrol.bakery.features.admin.produccion.entity.DetallePlanProduccion;
import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.EstadoPlanProduccion;
import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.EstadoItemProduccion;
import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.OrigenItemProduccion;
import com.dulcecontrol.bakery.features.admin.produccion.repository.PlanProduccionRepository;
import com.dulcecontrol.bakery.features.admin.produccion.repository.DetallePlanProduccionRepository;
import com.dulcecontrol.bakery.features.admin.inventario.entity.InventarioProducto;
import com.dulcecontrol.bakery.features.admin.inventario.repository.InventarioProductoRepository;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PedidoAdminService implements IPedidoAdminService {

    private final PedidoRepository pedidoRepository;
    private final SesionCajaRepository sesionCajaRepository;
    private final VentasTenantValidator tenantValidator;
    private final DetallePedidoRepository detallePedidoRepository;
    private final IInventarioProductoService inventarioProductoService;
    private final PlanProduccionRepository planProduccionRepository;
    private final DetallePlanProduccionRepository detallePlanProduccionRepository;
    private final InventarioProductoRepository inventarioProductoRepository;
    private final MovimientoInventarioProductoRepository movimientoProductoRepository;

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
        List<Pedido> pedidos = pedidoRepository.buscarPorFiltros(tiendaId, sedeId, estadoPedido, estadoPago,
                tipoEntrega, fechaDesde, fechaHasta);
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
        pedido.setRequiereComprobante(
                request.requiereComprobante() == null ? Boolean.TRUE : request.requiereComprobante());
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

        if (pedidoRepository.existsByTiendaIdAndCodigoPedidoIgnoreCaseAndIdNot(tiendaId, request.codigoPedido(),
                pedidoId)) {
            throw new BadRequestException("El código de pedido ya está registrado para la tienda");
        }

        tenantValidator.validarSedePerteneceATienda(tiendaId, request.sedeOrigenId());
        tenantValidator.validarClientePerteneceATienda(tiendaId, request.clienteId());
        validarSesionPerteneceATienda(tiendaId, request.sesionCajaId());

        EstadoPedido estadoAnterior = pedido.getEstadoPedido();

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

        // Generar planificación cuando el pedido cambia a EN_PREPARACION
        if (request.estadoPedido() == EstadoPedido.EN_PREPARACION && estadoAnterior != EstadoPedido.EN_PREPARACION) {
            generarPlanificacionParaPedido(tiendaId, pedido);
        }

        // Descontar inventario cuando el pedido se marca como ENTREGADO
        if (request.estadoPedido() == EstadoPedido.ENTREGADO && estadoAnterior != EstadoPedido.ENTREGADO) {
            descontarInventarioPorVenta(tiendaId, pedido);
        }

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

    /**
     * Descuenta del inventario los productos vendidos cuando se entrega el pedido.
     * Usa el servicio de inventario para activar automáticamente la verificación de
     * punto
     * de reposición y la generación de planificación.
     */
    private void descontarInventarioPorVenta(Long tiendaId, Pedido pedido) {
        log.info("📦 Pedido {} ENTREGADO. Descontando inventario de productos vendidos...", pedido.getCodigoPedido());

        // Obtener todos los detalles del pedido (productos y cantidades)
        List<DetallePedido> detalles = detallePedidoRepository.findByPedidoId(pedido.getId());

        if (detalles.isEmpty()) {
            log.warn("⚠️ El pedido {} no tiene detalles", pedido.getCodigoPedido());
            return;
        }

        Long sedeId = pedido.getSedeOrigenId();

        // Obtener todos los inventarios de la sede para buscar por producto
        List<com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioProductoResponse> inventarios = inventarioProductoService
                .listarPorTiendaYSede(tiendaId, sedeId);

        for (DetallePedido detalle : detalles) {
            Long productoId = detalle.getProductoId();
            Integer cantidadVendida = detalle.getCantidad();

            // Buscar el inventario del producto
            Optional<com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioProductoResponse> inventarioOpt = inventarios
                    .stream()
                    .filter(inv -> inv.getProductoId().equals(productoId))
                    .findFirst();

            if (inventarioOpt.isEmpty()) {
                log.error("❌ No se encontró inventario del producto {} en sede {}. No se puede descontar.",
                        productoId, sedeId);
                continue;
            }

            com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioProductoResponse inventario = inventarioOpt
                    .get();
            Integer cantidadActual = inventario.getCantidadActual();

            if (cantidadActual < cantidadVendida) {
                log.warn(
                        "⚠️ Inventario insuficiente del producto {}. Disponible: {}, Vendido: {}. Se descontará lo disponible.",
                        productoId, cantidadActual, cantidadVendida);
            }

            // Calcular nueva cantidad
            Integer nuevaCantidad = Math.max(0, cantidadActual - cantidadVendida);

            // Registrar movimiento de inventario SALIDA por venta
            MovimientoInventarioProducto movimiento = new MovimientoInventarioProducto();
            movimiento.setTiendaId(tiendaId);
            movimiento.setSedeId(sedeId);
            movimiento.setProductoId(productoId);
            movimiento.setTipoMovimiento(TipoMovimientoInsumo.SALIDA);
            movimiento.setCantidad(cantidadVendida);
            movimiento.setCantidadAnterior(cantidadActual);
            movimiento.setCantidadPosterior(nuevaCantidad);
            movimiento.setPedidoId(pedido.getId());
            movimiento.setMotivo(MotivoMovimientoProducto.VENTA);
            movimientoProductoRepository.save(movimiento);

            log.info("✅ Movimiento registrado: VENTA de {} unidades del producto #{}", cantidadVendida, productoId);

            // Usar el servicio para actualizar (esto activa la verificación de punto de
            // reposición)
            InventarioProductoUpdateRequest updateRequest = InventarioProductoUpdateRequest.builder()
                    .sedeId(inventario.getSedeId())
                    .productoId(inventario.getProductoId())
                    .cantidadActual(nuevaCantidad)
                    .ubicacionFisica(inventario.getUbicacionFisica())
                    .build();

            try {
                inventarioProductoService.actualizar(tiendaId, inventario.getId(), updateRequest);
                log.info("✅ Descontado {} unidades del producto {}. Stock anterior: {}, Stock nuevo: {}",
                        cantidadVendida, productoId, cantidadActual, nuevaCantidad);
            } catch (Exception e) {
                log.error("❌ Error al actualizar inventario del producto {}: {}", productoId, e.getMessage());
            }
        }

        log.info("✅ Inventario actualizado para pedido {}. {} productos procesados.",
                pedido.getCodigoPedido(), detalles.size());
    }

    /**
     * Genera un plan de producción cuando un pedido cambia a EN_PREPARACION.
     * Crea un plan con los productos del pedido marcados con origen PEDIDO_CLIENTE.
     */
    private void generarPlanificacionParaPedido(Long tiendaId, Pedido pedido) {
        log.info("📋 Pedido {} cambió a EN_PREPARACION. Generando planificación de producción...",
                pedido.getCodigoPedido());

        List<DetallePedido> detalles = detallePedidoRepository.findByPedidoId(pedido.getId());

        if (detalles.isEmpty()) {
            log.warn("⚠️ El pedido {} no tiene detalles", pedido.getCodigoPedido());
            return;
        }

        // Usar la fecha de entrega pactada o mañana
        java.time.LocalDate fechaProduccion = pedido.getFechaEntregaPactada() != null
                ? pedido.getFechaEntregaPactada().toLocalDate()
                : java.time.LocalDate.now().plusDays(1);

        log.info("📅 Fecha de producción calculada: {} (Fecha entrega pactada: {})",
                fechaProduccion, pedido.getFechaEntregaPactada());

        // Buscar plan de producción para esa fecha
        java.util.Optional<PlanProduccion> planOpt = planProduccionRepository.findBySedeIdAndFechaProduccion(
                pedido.getSedeOrigenId(), fechaProduccion);

        PlanProduccion plan;
        if (planOpt.isPresent()) {
            plan = planOpt.get();

            // Si el plan está FINALIZADO, reabrirlo a CONFIRMADO
            if (plan.getEstado() == EstadoPlanProduccion.FINALIZADO) {
                log.info("🔄 Plan para {} está FINALIZADO. Reabriendo a CONFIRMADO para agregar pedido {}...",
                        fechaProduccion, pedido.getCodigoPedido());
                plan.setEstado(EstadoPlanProduccion.CONFIRMADO);
                plan.setNotasMaestro((plan.getNotasMaestro() != null ? plan.getNotasMaestro() + " | " : "") +
                        "Reabierto para pedido " + pedido.getCodigoPedido());
                plan = planProduccionRepository.save(plan);
            } else {
                log.info("📋 Plan existente encontrado para fecha {} (estado: {})", fechaProduccion, plan.getEstado());
            }
        } else {
            // No existe plan, crear uno nuevo
            log.info("🎆 Creando nuevo plan de producción para pedido {} en fecha {}",
                    pedido.getCodigoPedido(), fechaProduccion);
            plan = new PlanProduccion();
            plan.setTiendaId(tiendaId);
            plan.setSedeId(pedido.getSedeOrigenId());
            plan.setFechaProduccion(fechaProduccion);
            plan.setEstado(EstadoPlanProduccion.CONFIRMADO);
            plan.setNotasMaestro("Plan generado para pedido " + pedido.getCodigoPedido());
            plan = planProduccionRepository.save(plan);
        }

        // Obtener detalles existentes del plan
        List<DetallePlanProduccion> detallesExistentes = detallePlanProduccionRepository
                .findByPlanIdOrderByIdAsc(plan.getId());

        // Agregar cada producto del pedido al plan
        for (DetallePedido detalle : detalles) {
            // Buscar si ya existe un detalle para este producto del mismo pedido
            java.util.Optional<DetallePlanProduccion> detalleExistenteOpt = detallesExistentes.stream()
                    .filter(d -> d.getProductoId().equals(detalle.getProductoId()) &&
                            d.getOrigen() == OrigenItemProduccion.PEDIDO_CLIENTE &&
                            d.getPedidoClienteId() != null &&
                            d.getPedidoClienteId().equals(pedido.getId()))
                    .findFirst();

            DetallePlanProduccion detallePlan;
            if (detalleExistenteOpt.isPresent()) {
                // Ya existe, actualizar cantidades y resetear estado
                detallePlan = detalleExistenteOpt.get();
                Integer cantidadPlanificadaAnterior = detallePlan.getCantidadPlanificada();
                Integer cantidadProducidaAnterior = detallePlan.getCantidadProducida();

                log.info("🔄 Detalle existente encontrado para producto {} del pedido {}. Actualizando...",
                        detalle.getProductoId(), pedido.getCodigoPedido());
                log.info("   Planificado anterior: {}, Producido anterior: {}", cantidadPlanificadaAnterior,
                        cantidadProducidaAnterior);

                // Ajustar inventario: restar lo que ya se había producido antes
                if (cantidadProducidaAnterior != null && cantidadProducidaAnterior > 0) {
                    java.util.Optional<InventarioProducto> inventarioOpt = inventarioProductoRepository
                            .findBySedeIdAndProductoId(pedido.getSedeOrigenId(), detalle.getProductoId());

                    if (inventarioOpt.isPresent()) {
                        InventarioProducto inventario = inventarioOpt.get();
                        Integer stockActual = inventario.getCantidadActual();
                        inventario.setCantidadActual(stockActual - cantidadProducidaAnterior);
                        inventarioProductoRepository.save(inventario);

                        log.info(
                                "⬅️ Ajustando inventario: restando {} unidades producidas anteriormente. Stock: {} -> {}",
                                cantidadProducidaAnterior, stockActual, inventario.getCantidadActual());
                    }
                }

                // Actualizar cantidades: REEMPLAZAR con la cantidad del pedido, NO sumar
                detallePlan.setCantidadSugerida(detalle.getCantidad());
                detallePlan.setCantidadPlanificada(detalle.getCantidad());
                detallePlan.setCantidadProducida(0);
                detallePlan.setCantidadMerma(0);
                detallePlan.setEstado(EstadoItemProduccion.PENDIENTE);
                detallePlan.setObservaciones("Producto del pedido " + pedido.getCodigoPedido() + " (actualizado)");

                log.info("✏️ Planificado actualizado: {} -> {} (cantidad del pedido)",
                        cantidadPlanificadaAnterior, detallePlan.getCantidadPlanificada());
            } else {
                // No existe, crear uno nuevo
                log.info("➕ Creando nuevo detalle para producto {} del pedido {}", detalle.getProductoId(),
                        pedido.getCodigoPedido());
                detallePlan = new DetallePlanProduccion();
                detallePlan.setPlanId(plan.getId());
                detallePlan.setProductoId(detalle.getProductoId());
                detallePlan.setOrigen(OrigenItemProduccion.PEDIDO_CLIENTE);
                detallePlan.setPedidoClienteId(pedido.getId());
                detallePlan.setDetallePedidoId(detalle.getId());
                detallePlan.setEsPersonalizado(false);
                detallePlan.setCantidadSugerida(detalle.getCantidad());
                detallePlan.setCantidadPlanificada(detalle.getCantidad());
                detallePlan.setCantidadProducida(0);
                detallePlan.setCantidadMerma(0);
                detallePlan.setEstado(EstadoItemProduccion.PENDIENTE);
                detallePlan.setObservaciones("Producto del pedido " + pedido.getCodigoPedido());
            }

            detallePlanProduccionRepository.save(detallePlan);
        }

        log.info("✅ Planificación creada para pedido {}. {} productos agregados al plan {}",
                pedido.getCodigoPedido(), detalles.size(), plan.getId());
    }
}
