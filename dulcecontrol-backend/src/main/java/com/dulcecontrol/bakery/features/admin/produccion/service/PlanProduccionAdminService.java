package com.dulcecontrol.bakery.features.admin.produccion.service;

import com.dulcecontrol.bakery.features.admin.catalogo.entity.Producto;
import com.dulcecontrol.bakery.features.shared.catalogo.repository.ProductoRepository;
import com.dulcecontrol.bakery.features.admin.produccion.dto.DetallePlanProduccionResponse;
import com.dulcecontrol.bakery.features.admin.produccion.dto.DetallePlanProduccionUpdateRequest;
import com.dulcecontrol.bakery.features.admin.produccion.dto.PlanProduccionCreateRequest;
import com.dulcecontrol.bakery.features.admin.produccion.dto.PlanProduccionResponse;
import com.dulcecontrol.bakery.features.admin.produccion.dto.PlanProduccionUpdateRequest;
import com.dulcecontrol.bakery.features.admin.produccion.entity.DetallePlanProduccion;
import com.dulcecontrol.bakery.features.admin.produccion.entity.PlanProduccion;
import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.EstadoItemProduccion;
import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.EstadoPlanProduccion;
import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.OrigenItemProduccion;
import com.dulcecontrol.bakery.features.admin.produccion.repository.DetallePlanProduccionRepository;
import com.dulcecontrol.bakery.features.admin.produccion.repository.PlanProduccionRepository;
import com.dulcecontrol.bakery.features.admin.produccion.repository.RecetaRepository;
import com.dulcecontrol.bakery.features.admin.produccion.entity.Receta;
import com.dulcecontrol.bakery.features.admin.inventario.entity.InventarioInsumoSede;
import com.dulcecontrol.bakery.features.admin.inventario.entity.InventarioProducto;
import com.dulcecontrol.bakery.features.admin.inventario.entity.MovimientoInventarioInsumo;
import com.dulcecontrol.bakery.features.admin.inventario.entity.MovimientoInventarioProducto;
import com.dulcecontrol.bakery.features.admin.inventario.entity.enums.MotivoMovimientoProducto;
import com.dulcecontrol.bakery.features.admin.inventario.entity.enums.TipoMovimientoInsumo;
import com.dulcecontrol.bakery.features.admin.inventario.repository.InventarioInsumoSedeRepository;
import com.dulcecontrol.bakery.features.admin.inventario.repository.InventarioProductoRepository;
import com.dulcecontrol.bakery.features.admin.inventario.repository.MovimientoInventarioInsumoRepository;
import com.dulcecontrol.bakery.features.admin.inventario.repository.MovimientoInventarioProductoRepository;
import com.dulcecontrol.bakery.features.admin.ventas.entity.Pedido;
import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.EstadoPedido;
import com.dulcecontrol.bakery.features.admin.ventas.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlanProduccionAdminService {

    private final PlanProduccionRepository planRepository;
    private final DetallePlanProduccionRepository detalleRepository;
    private final ProductoRepository productoRepository;
    private final RecetaRepository recetaRepository;
    private final InventarioInsumoSedeRepository inventarioInsumoRepository;
    private final InventarioProductoRepository inventarioProductoRepository;
    private final MovimientoInventarioInsumoRepository movimientoInsumoRepository;
    private final MovimientoInventarioProductoRepository movimientoProductoRepository;
    private final PedidoRepository pedidoRepository;

    @Transactional
    public PlanProduccionResponse createPlan(Long tiendaId, PlanProduccionCreateRequest request) {
        // Check if plan already exists for this sede/fecha
        planRepository.findBySedeIdAndFechaProduccion(request.getSedeId(), request.getFechaProduccion())
                .ifPresent(plan -> {
                    throw new IllegalStateException("Ya existe un plan de producción para esta sede y fecha");
                });

        PlanProduccion plan = new PlanProduccion();
        plan.setTiendaId(tiendaId);
        plan.setSedeId(request.getSedeId());
        plan.setFechaProduccion(request.getFechaProduccion());
        plan.setEstado(EstadoPlanProduccion.BORRADOR);
        plan.setNotasMaestro(request.getNotasMaestro());
        PlanProduccion savedPlan = planRepository.save(plan);

        if (request.getDetalles() != null && !request.getDetalles().isEmpty()) {
            List<DetallePlanProduccion> detalles = request.getDetalles().stream()
                    .map(item -> {
                        DetallePlanProduccion detalle = new DetallePlanProduccion();
                        detalle.setPlanId(savedPlan.getId());
                        detalle.setProductoId(item.getProductoId());
                        detalle.setOrigen(OrigenItemProduccion.STOCK_DIARIO);
                        detalle.setEsPersonalizado(Boolean.FALSE);
                        detalle.setCantidadSugerida(item.getCantidadSugerida() != null ? item.getCantidadSugerida() : 0);
                        detalle.setCantidadPlanificada(item.getCantidadPlanificada());
                        detalle.setCantidadProducida(0);
                        detalle.setCantidadMerma(0);
                        detalle.setEstado(EstadoItemProduccion.PENDIENTE);
                        detalle.setObservaciones(item.getObservaciones());
                        return detalle;
                    })
                    .collect(Collectors.toList());
            detalleRepository.saveAll(detalles);
        }

        return getPlanBySedeAndFecha(tiendaId, request.getSedeId(), request.getFechaProduccion());
    }

    @Transactional(readOnly = true)
    public PlanProduccionResponse getPlanBySedeAndFecha(Long tiendaId, Long sedeId, LocalDate fecha) {
        PlanProduccion plan = planRepository.findBySedeIdAndFechaProduccion(sedeId, fecha)
                .orElseThrow(() -> new RuntimeException("No se encontró plan de producción para esta fecha"));

        if (!plan.getTiendaId().equals(tiendaId)) {
            throw new RuntimeException("Plan no pertenece a la tienda especificada");
        }

        List<DetallePlanProduccion> detalles = detalleRepository.findByPlanIdOrderByIdAsc(plan.getId());

        List<Long> productoIds = detalles.stream()
                .map(DetallePlanProduccion::getProductoId)
                .distinct()
                .collect(Collectors.toList());

        Map<Long, Producto> productosMap = productoRepository.findAllById(productoIds).stream()
                .collect(Collectors.toMap(Producto::getId, Function.identity()));

        List<DetallePlanProduccionResponse> detalleResponses = detalles.stream()
                .map(d -> {
                    Producto producto = productosMap.get(d.getProductoId());
                    return DetallePlanProduccionResponse.builder()
                            .id(d.getId())
                            .planId(d.getPlanId())
                            .productoId(d.getProductoId())
                            .productoNombre(producto != null ? producto.getNombre() : "Producto desconocido")
                            .origen(d.getOrigen())
                            .pedidoClienteId(d.getPedidoClienteId())
                            .detallePedidoId(d.getDetallePedidoId())
                            .esPersonalizado(d.getEsPersonalizado())
                            .personalizacionId(d.getPersonalizacionId())
                            .cantidadSugerida(d.getCantidadSugerida())
                            .cantidadPlanificada(d.getCantidadPlanificada())
                            .cantidadProducida(d.getCantidadProducida())
                            .cantidadMerma(d.getCantidadMerma())
                            .estado(d.getEstado())
                            .horaTermino(d.getHoraTermino())
                            .observaciones(d.getObservaciones())
                            .build();
                })
                .collect(Collectors.toList());

        return PlanProduccionResponse.builder()
                .id(plan.getId())
                .tiendaId(plan.getTiendaId())
                .sedeId(plan.getSedeId())
                .fechaProduccion(plan.getFechaProduccion())
                .estado(plan.getEstado())
                .generadoPor(plan.getGeneradoPor())
                .confirmadoPor(plan.getConfirmadoPor())
                .horaInicioReal(plan.getHoraInicioReal())
                .horaFinReal(plan.getHoraFinReal())
                .notasMaestro(plan.getNotasMaestro())
                .creadoEn(plan.getCreadoEn())
                .actualizadoEn(plan.getActualizadoEn())
                .detalles(detalleResponses)
                .build();
    }

    @Transactional
    public PlanProduccionResponse updatePlan(Long tiendaId, Long planId, PlanProduccionUpdateRequest request) {
        PlanProduccion plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan no encontrado"));

        if (!plan.getTiendaId().equals(tiendaId)) {
            throw new RuntimeException("Plan no pertenece a la tienda especificada");
        }
        
        EstadoPlanProduccion estadoAnterior = plan.getEstado();

        if (request.getEstado() != null) {
            plan.setEstado(request.getEstado());
            if (request.getEstado() == EstadoPlanProduccion.EN_PROCESO && plan.getHoraInicioReal() == null) {
                plan.setHoraInicioReal(LocalDateTime.now());
            }
            if (request.getEstado() == EstadoPlanProduccion.FINALIZADO && plan.getHoraFinReal() == null) {
                plan.setHoraFinReal(LocalDateTime.now());
            }
        }

        if (request.getNotasMaestro() != null) {
            plan.setNotasMaestro(request.getNotasMaestro());
        }

        planRepository.save(plan);
        
        // Cuando el plan cambia a FINALIZADO, registrar movimientos de inventario y actualizar pedidos
        if (request.getEstado() == EstadoPlanProduccion.FINALIZADO && estadoAnterior != EstadoPlanProduccion.FINALIZADO) {
            registrarMovimientosInventarioAlFinalizar(tiendaId, plan);
            actualizarEstadoPedidosAsociados(plan);
        }
        
        return getPlanBySedeAndFecha(tiendaId, plan.getSedeId(), plan.getFechaProduccion());
    }

    @Transactional
    public DetallePlanProduccionResponse updateDetalle(Long tiendaId, Long detalleId, DetallePlanProduccionUpdateRequest request) {
        DetallePlanProduccion detalle = detalleRepository.findById(detalleId)
                .orElseThrow(() -> new RuntimeException("Detalle no encontrado"));

        PlanProduccion plan = planRepository.findById(detalle.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan no encontrado"));

        if (!plan.getTiendaId().equals(tiendaId)) {
            throw new RuntimeException("Detalle no pertenece a la tienda especificada");
        }
        
        // Validar que el plan esté EN_PROCESO para permitir edición
        if (plan.getEstado() != EstadoPlanProduccion.EN_PROCESO) {
            throw new RuntimeException("Solo se pueden editar detalles cuando el plan está EN_PROCESO. Estado actual: " + plan.getEstado());
        }
        
        EstadoItemProduccion estadoAnterior = detalle.getEstado();
        Integer cantidadProducidaAnterior = detalle.getCantidadProducida();

        if (request.getCantidadProducida() != null) {
            detalle.setCantidadProducida(request.getCantidadProducida());
        }
        if (request.getCantidadMerma() != null) {
            detalle.setCantidadMerma(request.getCantidadMerma());
        }
        if (request.getEstado() != null) {
            detalle.setEstado(request.getEstado());
            if (request.getEstado() == EstadoItemProduccion.TERMINADO && detalle.getHoraTermino() == null) {
                detalle.setHoraTermino(LocalDateTime.now());
            }
        }
        if (request.getObservaciones() != null) {
            detalle.setObservaciones(request.getObservaciones());
        }

        DetallePlanProduccion saved = detalleRepository.save(detalle);
        
        // Si cambió la cantidad producida, actualizar inventario
        if (request.getCantidadProducida() != null && !request.getCantidadProducida().equals(cantidadProducidaAnterior)) {
            actualizarInventarioPorCambioProduccion(tiendaId, plan.getSedeId(), saved, cantidadProducidaAnterior);
        }
        
        // Procesar cambios de estado (descuento de insumos cuando pasa a EN_HORNO)
        if (request.getEstado() != null && request.getEstado() != estadoAnterior) {
            if (request.getEstado() == EstadoItemProduccion.EN_HORNO && estadoAnterior != EstadoItemProduccion.EN_HORNO) {
                descontarInsumosProduccion(tiendaId, plan.getSedeId(), saved);
            }
        }

        Producto producto = productoRepository.findById(saved.getProductoId()).orElse(null);

        return DetallePlanProduccionResponse.builder()
                .id(saved.getId())
                .planId(saved.getPlanId())
                .productoId(saved.getProductoId())
                .productoNombre(producto != null ? producto.getNombre() : "Producto desconocido")
                .origen(saved.getOrigen())
                .pedidoClienteId(saved.getPedidoClienteId())
                .detallePedidoId(saved.getDetallePedidoId())
                .esPersonalizado(saved.getEsPersonalizado())
                .personalizacionId(saved.getPersonalizacionId())
                .cantidadSugerida(saved.getCantidadSugerida())
                .cantidadPlanificada(saved.getCantidadPlanificada())
                .cantidadProducida(saved.getCantidadProducida())
                .cantidadMerma(saved.getCantidadMerma())
                .estado(saved.getEstado())
                .horaTermino(saved.getHoraTermino())
                .observaciones(saved.getObservaciones())
                .build();
    }

    @Transactional
    public List<PlanProduccionResponse> listPlanesByTienda(Long tiendaId, Long sedeId) {
        // Verificar si existe plan para mañana, si no existe crearlo automáticamente
        LocalDate manana = LocalDate.now().plusDays(1);
        
        if (sedeId != null) {
            Optional<PlanProduccion> planMananaOpt = planRepository.findBySedeIdAndFechaProduccion(sedeId, manana);
            if (planMananaOpt.isEmpty()) {
                log.info("🎆 No existe plan para mañana ({}) en sede {}. Generando automáticamente...", manana, sedeId);
                PlanProduccion planManana = new PlanProduccion();
                planManana.setTiendaId(tiendaId);
                planManana.setSedeId(sedeId);
                planManana.setFechaProduccion(manana);
                planManana.setEstado(EstadoPlanProduccion.BORRADOR);
                planManana.setNotasMaestro("Plan generado automáticamente para el día siguiente");
                planRepository.save(planManana);
                log.info("✅ Plan para mañana generado automáticamente");
            }
        }
        
        List<PlanProduccion> planes = sedeId != null
                ? planRepository.findByTiendaIdAndSedeIdOrderByFechaProduccionDesc(tiendaId, sedeId)
                : planRepository.findByTiendaIdOrderByFechaProduccionDesc(tiendaId);

        // Obtener todos los IDs de planes
        List<Long> planIds = planes.stream()
                .map(PlanProduccion::getId)
                .collect(Collectors.toList());

        // Cargar todos los detalles de una vez (optimización N+1)
        List<DetallePlanProduccion> todosDetalles = planIds.isEmpty()
                ? List.of()
                : detalleRepository.findByPlanIdInOrderByPlanIdAscIdAsc(planIds);

        // Agrupar detalles por planId
        Map<Long, List<DetallePlanProduccion>> detallesPorPlan = todosDetalles.stream()
                .collect(Collectors.groupingBy(DetallePlanProduccion::getPlanId));

        // Obtener todos los productos únicos
        List<Long> productoIds = todosDetalles.stream()
                .map(DetallePlanProduccion::getProductoId)
                .distinct()
                .collect(Collectors.toList());

        Map<Long, Producto> productosMap = productoIds.isEmpty()
                ? Map.of()
                : productoRepository.findAllById(productoIds).stream()
                        .collect(Collectors.toMap(Producto::getId, Function.identity()));

        return planes.stream()
                .map(plan -> {
                    List<DetallePlanProduccion> detalles = detallesPorPlan.getOrDefault(plan.getId(), List.of());

                    List<DetallePlanProduccionResponse> detalleResponses = detalles.stream()
                            .map(d -> {
                                Producto producto = productosMap.get(d.getProductoId());
                                return DetallePlanProduccionResponse.builder()
                                        .id(d.getId())
                                        .planId(d.getPlanId())
                                        .productoId(d.getProductoId())
                                        .productoNombre(producto != null ? producto.getNombre() : "Producto desconocido")
                                        .origen(d.getOrigen())
                                        .pedidoClienteId(d.getPedidoClienteId())
                                        .detallePedidoId(d.getDetallePedidoId())
                                        .esPersonalizado(d.getEsPersonalizado())
                                        .personalizacionId(d.getPersonalizacionId())
                                        .cantidadSugerida(d.getCantidadSugerida())
                                        .cantidadPlanificada(d.getCantidadPlanificada())
                                        .cantidadProducida(d.getCantidadProducida())
                                        .cantidadMerma(d.getCantidadMerma())
                                        .estado(d.getEstado())
                                        .horaTermino(d.getHoraTermino())
                                        .observaciones(d.getObservaciones())
                                        .build();
                            })
                            .collect(Collectors.toList());

                    return PlanProduccionResponse.builder()
                            .id(plan.getId())
                            .tiendaId(plan.getTiendaId())
                            .sedeId(plan.getSedeId())
                            .fechaProduccion(plan.getFechaProduccion())
                            .estado(plan.getEstado())
                            .generadoPor(plan.getGeneradoPor())
                            .confirmadoPor(plan.getConfirmadoPor())
                            .horaInicioReal(plan.getHoraInicioReal())
                            .horaFinReal(plan.getHoraFinReal())
                            .notasMaestro(plan.getNotasMaestro())
                            .creadoEn(plan.getCreadoEn())
                            .actualizadoEn(plan.getActualizadoEn())
                            .detalles(detalleResponses)
                            .build();
                })
                .collect(Collectors.toList());
    }
    
    /**
     * Registra movimientos de inventario para todos los detalles TERMINADOS al finalizar el plan
     */
    private void registrarMovimientosInventarioAlFinalizar(Long tiendaId, PlanProduccion plan) {
        log.info("📦 Plan {} finalizado. Registrando movimientos de inventario...", plan.getId());
        
        List<DetallePlanProduccion> detalles = detalleRepository.findByPlanId(plan.getId());
        
        for (DetallePlanProduccion detalle : detalles) {
            if (detalle.getEstado() == EstadoItemProduccion.TERMINADO && detalle.getCantidadProducida() != null && detalle.getCantidadProducida() > 0) {
                sumarProductosInventario(tiendaId, plan.getSedeId(), detalle);
            }
            
            if (detalle.getCantidadMerma() != null && detalle.getCantidadMerma() > 0) {
                registrarMovimientoMerma(tiendaId, plan.getSedeId(), detalle);
            }
        }
        
        log.info("✅ Movimientos de inventario registrados para plan {}", plan.getId());
    }
    
    /**
     * Registra movimiento de inventario por merma
     */
    private void registrarMovimientoMerma(Long tiendaId, Long sedeId, DetallePlanProduccion detalle) {
        log.info("⚠️ Registrando merma de {} unidades del producto {}", detalle.getCantidadMerma(), detalle.getProductoId());
        
        MovimientoInventarioProducto movimiento = new MovimientoInventarioProducto();
        movimiento.setTiendaId(tiendaId);
        movimiento.setSedeId(sedeId);
        movimiento.setProductoId(detalle.getProductoId());
        movimiento.setTipoMovimiento(TipoMovimientoInsumo.SALIDA);
        movimiento.setCantidad(detalle.getCantidadMerma());
        movimiento.setPlanProduccionId(detalle.getPlanId());
        movimiento.setMotivo(MotivoMovimientoProducto.MERMA);
        
        Optional<InventarioProducto> inventarioOpt = inventarioProductoRepository
                .findBySedeIdAndProductoId(sedeId, detalle.getProductoId());
        
        if (inventarioOpt.isPresent()) {
            InventarioProducto inventario = inventarioOpt.get();
            movimiento.setCantidadAnterior(inventario.getCantidadActual());
            movimiento.setCantidadPosterior(inventario.getCantidadActual());
        } else {
            movimiento.setCantidadAnterior(0);
            movimiento.setCantidadPosterior(0);
        }
        
        movimientoProductoRepository.save(movimiento);
        log.info("✅ Movimiento de merma registrado");
    }
    
    /**
     * Procesa el cambio de estado de un detalle de producción
     * - EN_HORNO: Descuenta insumos del inventario
     * - TERMINADO: Suma productos al inventario
     */
    private void procesarCambioEstado(Long tiendaId, Long sedeId, DetallePlanProduccion detalle,
                                      EstadoItemProduccion estadoAnterior, EstadoItemProduccion estadoNuevo) {
        if (estadoNuevo == null || estadoNuevo == estadoAnterior) {
            return;
        }
        
        // Cuando pasa a EN_HORNO, descontar insumos
        if (estadoNuevo == EstadoItemProduccion.EN_HORNO && estadoAnterior != EstadoItemProduccion.EN_HORNO) {
            descontarInsumosProduccion(tiendaId, sedeId, detalle);
        }
        
        // Cuando pasa a TERMINADO, verificar si el plan global está FINALIZADO para sumar inventario
        if (estadoNuevo == EstadoItemProduccion.TERMINADO && estadoAnterior != EstadoItemProduccion.TERMINADO) {
            PlanProduccion plan = planRepository.findById(detalle.getPlanId()).orElse(null);
            if (plan != null && plan.getEstado() == EstadoPlanProduccion.FINALIZADO) {
                sumarProductosInventario(tiendaId, sedeId, detalle);
            } else {
                log.info("⏳ Producto {} marcado como TERMINADO, pero el plan aún no está FINALIZADO. No se suma al inventario todavía.", detalle.getProductoId());
            }
        }
    }
    
    /**
     * Descuenta los insumos necesarios del inventario según la receta del producto
     */
    private void descontarInsumosProduccion(Long tiendaId, Long sedeId, DetallePlanProduccion detalle) {
        log.info("🔥 Producto {} pasa a EN_HORNO. Descontando insumos...", detalle.getProductoId());
        
        // Buscar todas las recetas (insumos) del producto
        List<Receta> recetas = recetaRepository.findByTiendaIdAndProductoId(tiendaId, detalle.getProductoId());
        
        if (recetas.isEmpty()) {
            log.warn("⚠️ No hay receta configurada para producto {}", detalle.getProductoId());
            return;
        }
        
        Integer cantidadAPlanificar = detalle.getCantidadPlanificada();
        
        for (Receta receta : recetas) {
            // Calcular cantidad total de insumo necesaria
            BigDecimal cantidadPorUnidad = receta.getCantidadRequerida();
            BigDecimal cantidadTotal = cantidadPorUnidad.multiply(BigDecimal.valueOf(cantidadAPlanificar));
            
            // Buscar el inventario de insumo en la sede
            Optional<InventarioInsumoSede> inventarioOpt = inventarioInsumoRepository
                    .findBySedeIdAndInsumoId(sedeId, receta.getInsumoId());
            
            if (inventarioOpt.isEmpty()) {
                log.error("❌ No se encontró inventario del insumo {} en sede {}", 
                        receta.getInsumoId(), sedeId);
                continue;
            }
            
            InventarioInsumoSede inventario = inventarioOpt.get();
            BigDecimal cantidadActual = inventario.getCantidadActual();
            
            if (cantidadActual.compareTo(cantidadTotal) < 0) {
                log.warn("⚠️ Inventario insuficiente del insumo {}. Disponible: {}, Requerido: {}",
                        receta.getInsumoId(), cantidadActual, cantidadTotal);
                // Continuar de todas formas, descontar lo que hay
            }
            
            // Descontar del inventario
            BigDecimal cantidadNueva = cantidadActual.subtract(cantidadTotal);
            inventario.setCantidadActual(cantidadNueva);
            inventarioInsumoRepository.save(inventario);
            
            // Registrar movimiento de inventario SALIDA por producción
            MovimientoInventarioInsumo movimiento = new MovimientoInventarioInsumo();
            movimiento.setTiendaId(tiendaId);
            movimiento.setSedeId(sedeId);
            movimiento.setInsumoId(receta.getInsumoId());
            movimiento.setTipoMovimiento(TipoMovimientoInsumo.SALIDA);
            movimiento.setCantidad(cantidadTotal);
            movimiento.setCantidadAnterior(cantidadActual);
            movimiento.setCantidadPosterior(cantidadNueva);
            movimiento.setPlanProduccionId(detalle.getPlanId());
            movimiento.setMotivo("Consumo para producción de " + cantidadAPlanificar + " unidades del producto #" + detalle.getProductoId());
            movimientoInsumoRepository.save(movimiento);
            
            log.info("✅ Descontado {} {} del insumo {}. Stock anterior: {}, Stock actual: {}",
                    cantidadTotal, receta.getUnidadMedida(), receta.getInsumoId(), 
                    cantidadActual, cantidadNueva);
        }
    }
    
    /**
     * Suma la cantidad producida al inventario de productos
     */
    private void sumarProductosInventario(Long tiendaId, Long sedeId, DetallePlanProduccion detalle) {
        log.info("✅ Producto {} TERMINADO. Sumando al inventario...", detalle.getProductoId());
        
        Integer cantidadProducida = detalle.getCantidadProducida();
        
        if (cantidadProducida == null || cantidadProducida <= 0) {
            log.warn("⚠️ Cantidad producida no válida: {}", cantidadProducida);
            return;
        }
        
        // Buscar o crear el inventario del producto
        Optional<InventarioProducto> inventarioOpt = inventarioProductoRepository
                .findBySedeIdAndProductoId(sedeId, detalle.getProductoId());
        
        InventarioProducto inventario;
        if (inventarioOpt.isPresent()) {
            inventario = inventarioOpt.get();
        } else {
            log.info("📦 Creando nuevo registro de inventario para producto {} en sede {}",
                    detalle.getProductoId(), sedeId);
            inventario = new InventarioProducto();
            inventario.setTiendaId(tiendaId);
            inventario.setSedeId(sedeId);
            inventario.setProductoId(detalle.getProductoId());
            inventario.setCantidadActual(0);
        }
        
        Integer cantidadAnterior = inventario.getCantidadActual();
        Integer cantidadNueva = cantidadAnterior + cantidadProducida;
        inventario.setCantidadActual(cantidadNueva);
        inventarioProductoRepository.save(inventario);
        
        // Registrar movimiento de inventario ENTRADA por producción
        MovimientoInventarioProducto movimiento = new MovimientoInventarioProducto();
        movimiento.setTiendaId(tiendaId);
        movimiento.setSedeId(sedeId);
        movimiento.setProductoId(detalle.getProductoId());
        movimiento.setTipoMovimiento(TipoMovimientoInsumo.ENTRADA);
        movimiento.setCantidad(cantidadProducida);
        movimiento.setCantidadAnterior(cantidadAnterior);
        movimiento.setCantidadPosterior(cantidadNueva);
        movimiento.setPlanProduccionId(detalle.getPlanId());
        movimiento.setMotivo(MotivoMovimientoProducto.PRODUCCION);
        movimientoProductoRepository.save(movimiento);
        
        log.info("✅ Sumado {} unidades al inventario del producto {}. Stock anterior: {}, Stock actual: {}",
                cantidadProducida, detalle.getProductoId(), cantidadAnterior, cantidadNueva);
    }
    
    /**
     * Actualiza el inventario cuando cambia la cantidad producida de un detalle.
     * La diferencia entre la cantidad anterior y la nueva se suma o resta del inventario.
     */
    private void actualizarInventarioPorCambioProduccion(Long tiendaId, Long sedeId, DetallePlanProduccion detalle, Integer cantidadProducidaAnterior) {
        Integer cantidadNueva = detalle.getCantidadProducida();
        
        if (cantidadNueva == null || cantidadNueva <= 0) {
            log.warn("⚠️ Cantidad producida no válida: {}", cantidadNueva);
            return;
        }
        
        if (cantidadProducidaAnterior == null) {
            cantidadProducidaAnterior = 0;
        }
        
        // Calcular diferencia
        Integer diferencia = cantidadNueva - cantidadProducidaAnterior;
        
        if (diferencia == 0) {
            log.info("ℹ️ No hay cambio en la cantidad producida para producto {}", detalle.getProductoId());
            return;
        }
        
        log.info("📊 Actualizando inventario por cambio en producción. Producto: {}, Anterior: {}, Nueva: {}, Diferencia: {}", 
                detalle.getProductoId(), cantidadProducidaAnterior, cantidadNueva, diferencia);
        
        // Buscar o crear el inventario del producto
        Optional<InventarioProducto> inventarioOpt = inventarioProductoRepository
                .findBySedeIdAndProductoId(sedeId, detalle.getProductoId());
        
        InventarioProducto inventario;
        if (inventarioOpt.isPresent()) {
            inventario = inventarioOpt.get();
        } else {
            log.info("📦 Creando nuevo registro de inventario para producto {} en sede {}",
                    detalle.getProductoId(), sedeId);
            inventario = new InventarioProducto();
            inventario.setTiendaId(tiendaId);
            inventario.setSedeId(sedeId);
            inventario.setProductoId(detalle.getProductoId());
            inventario.setCantidadActual(0);
        }
        
        Integer cantidadAnterior = inventario.getCantidadActual();
        inventario.setCantidadActual(cantidadAnterior + diferencia);
        inventarioProductoRepository.save(inventario);
        
        log.info("✅ Inventario actualizado para producto {}. Stock anterior: {}, Stock nuevo: {}", 
                detalle.getProductoId(), cantidadAnterior, inventario.getCantidadActual());
    }
    
    /**
     * Actualiza el estado de los pedidos asociados al plan a LISTO_ENTREGA
     * cuando el plan se marca como FINALIZADO.
     */
    private void actualizarEstadoPedidosAsociados(PlanProduccion plan) {
        log.info("📋 Verificando pedidos asociados al plan {} para cambiar estado a LISTO_ENTREGA", plan.getId());
        
        // Obtener todos los detalles del plan que tienen origen PEDIDO_CLIENTE
        List<DetallePlanProduccion> detalles = detalleRepository.findByPlanIdOrderByIdAsc(plan.getId());
        
        // Obtener IDs únicos de pedidos
        List<Long> pedidoIds = detalles.stream()
                .filter(d -> d.getOrigen() == OrigenItemProduccion.PEDIDO_CLIENTE)
                .filter(d -> d.getPedidoClienteId() != null)
                .map(DetallePlanProduccion::getPedidoClienteId)
                .distinct()
                .toList();
        
        if (pedidoIds.isEmpty()) {
            log.info("ℹ️ No hay pedidos asociados a este plan");
            return;
        }
        
        // Actualizar estado de cada pedido a LISTO_ENTREGA
        for (Long pedidoId : pedidoIds) {
            Optional<Pedido> pedidoOpt = pedidoRepository.findById(pedidoId);
            if (pedidoOpt.isPresent()) {
                Pedido pedido = pedidoOpt.get();
                
                // Solo cambiar si está en EN_PREPARACION
                if (pedido.getEstadoPedido() == EstadoPedido.EN_PREPARACION) {
                    pedido.setEstadoPedido(EstadoPedido.LISTO_ENTREGA);
                    pedidoRepository.save(pedido);
                    log.info("✅ Pedido {} cambiado a LISTO_ENTREGA", pedido.getCodigoPedido());
                } else {
                    log.info("ℹ️ Pedido {} no está en EN_PREPARACION (estado actual: {}), no se cambia", 
                            pedido.getCodigoPedido(), pedido.getEstadoPedido());
                }
            }
        }
        
        log.info("✅ Procesados {} pedidos asociados al plan", pedidoIds.size());
    }
}
