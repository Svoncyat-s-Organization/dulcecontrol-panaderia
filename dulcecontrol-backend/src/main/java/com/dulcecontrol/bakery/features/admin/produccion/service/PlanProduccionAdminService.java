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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlanProduccionAdminService {

    private final PlanProduccionRepository planRepository;
    private final DetallePlanProduccionRepository detalleRepository;
    private final ProductoRepository productoRepository;

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

    @Transactional(readOnly = true)
    public List<PlanProduccionResponse> listPlanesByTienda(Long tiendaId, Long sedeId) {
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
}
