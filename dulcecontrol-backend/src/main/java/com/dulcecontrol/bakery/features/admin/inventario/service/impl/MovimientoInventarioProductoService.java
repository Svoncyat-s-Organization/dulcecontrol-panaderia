package com.dulcecontrol.bakery.features.admin.inventario.service.impl;

import com.dulcecontrol.bakery.features.admin.inventario.dto.MovimientoInventarioProductoCreateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.MovimientoInventarioProductoResponse;
import com.dulcecontrol.bakery.features.admin.inventario.entity.InventarioProducto;
import com.dulcecontrol.bakery.features.admin.inventario.entity.MovimientoInventarioProducto;
import com.dulcecontrol.bakery.features.admin.inventario.entity.enums.TipoMovimientoInsumo;
import com.dulcecontrol.bakery.features.admin.inventario.repository.InventarioProductoRepository;
import com.dulcecontrol.bakery.features.admin.inventario.repository.MovimientoInventarioProductoRepository;
import com.dulcecontrol.bakery.features.admin.inventario.service.IMovimientoInventarioProductoService;
import com.dulcecontrol.bakery.features.admin.catalogo.entity.Producto;
import com.dulcecontrol.bakery.features.shared.catalogo.repository.ProductoRepository;
import com.dulcecontrol.bakery.features.admin.seguridad.entity.UsuarioTienda;
import com.dulcecontrol.bakery.features.admin.seguridad.repository.UsuarioTiendaRepository;
import com.dulcecontrol.bakery.features.admin.produccion.entity.PlanProduccion;
import com.dulcecontrol.bakery.features.admin.produccion.entity.DetallePlanProduccion;
import com.dulcecontrol.bakery.features.admin.produccion.entity.StockIdeal;
import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.EstadoPlanProduccion;
import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.EstadoItemProduccion;
import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.OrigenItemProduccion;
import com.dulcecontrol.bakery.features.admin.produccion.repository.StockIdealRepository;
import com.dulcecontrol.bakery.features.admin.produccion.repository.PlanProduccionRepository;
import com.dulcecontrol.bakery.features.admin.produccion.repository.DetallePlanProduccionRepository;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MovimientoInventarioProductoService implements IMovimientoInventarioProductoService {

    private final MovimientoInventarioProductoRepository repository;
    private final InventarioProductoRepository inventarioRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioTiendaRepository usuarioRepository;
    private final StockIdealRepository stockIdealRepository;
    private final PlanProduccionRepository planProduccionRepository;
    private final DetallePlanProduccionRepository detallePlanProduccionRepository;

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioProductoResponse> listarPorTienda(Long tiendaId) {
        return repository.findByTiendaId(tiendaId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioProductoResponse> listarPorTiendaYSede(Long tiendaId, Long sedeId) {
        return repository.findByTiendaIdAndSedeId(tiendaId, sedeId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MovimientoInventarioProductoResponse> listarPorTiendaYSedePaginado(Long tiendaId, Long sedeId,
            Pageable pageable) {
        return repository.findByTiendaIdAndSedeIdOrderByCreadoEnDesc(tiendaId, sedeId, pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public MovimientoInventarioProductoResponse obtenerPorId(Long tiendaId, Long id) {
        MovimientoInventarioProducto movimiento = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Movimiento de inventario no encontrado"));
        return toResponse(movimiento);
    }

    // Variable para tracking de planificación automática
    private ThreadLocal<Long> planGeneradoIdThreadLocal = new ThreadLocal<>();
    
    @Override
    @Transactional
    public MovimientoInventarioProductoResponse crear(Long tiendaId,
            MovimientoInventarioProductoCreateRequest request) {
        // Resetear variable de tracking
        planGeneradoIdThreadLocal.remove();
        
        // Buscar o crear inventario
        InventarioProducto inventario = inventarioRepository
                .findBySedeIdAndProductoId(request.getSedeId(), request.getProductoId())
                .orElseGet(() -> {
                    InventarioProducto nuevo = new InventarioProducto();
                    nuevo.setTiendaId(tiendaId);
                    nuevo.setSedeId(request.getSedeId());
                    nuevo.setProductoId(request.getProductoId());
                    nuevo.setCantidadActual(0);
                    return inventarioRepository.save(nuevo);
                });

        Integer cantidadAnterior = inventario.getCantidadActual();
        Integer nuevaCantidad;

        // Calcular nueva cantidad según tipo de movimiento
        switch (request.getTipoMovimiento()) {
            case ENTRADA:
                nuevaCantidad = cantidadAnterior + request.getCantidad();
                break;
            case SALIDA:
                nuevaCantidad = cantidadAnterior - request.getCantidad();
                if (nuevaCantidad < 0) {
                    throw new BadRequestException("No hay suficiente stock. Stock actual: " + cantidadAnterior);
                }
                break;
            case AJUSTE:
                nuevaCantidad = request.getCantidad(); // Ajuste establece la cantidad directamente
                break;
            case TRANSFERENCIA:
                // Para transferencias, el tipo de movimiento determina el signo
                if (request.getCantidad() > 0) {
                    nuevaCantidad = cantidadAnterior + request.getCantidad(); // Entrada
                } else {
                    nuevaCantidad = cantidadAnterior + request.getCantidad(); // Salida (cantidad negativa)
                    if (nuevaCantidad < 0) {
                        throw new BadRequestException(
                                "No hay suficiente stock para la transferencia. Stock actual: " + cantidadAnterior);
                    }
                }
                break;
            default:
                throw new BadRequestException("Tipo de movimiento no válido");
        }

        // Actualizar inventario
        inventario.setCantidadActual(nuevaCantidad);
        inventarioRepository.save(inventario);
        
        // Si es una SALIDA, verificar punto de reposición y generar planificación automática
        if (request.getTipoMovimiento() == TipoMovimientoInsumo.SALIDA) {
            verificarYGenerarPlanificacionAutomatica(tiendaId, inventario, cantidadAnterior, nuevaCantidad);
        }

        // Crear movimiento
        MovimientoInventarioProducto movimiento = new MovimientoInventarioProducto();
        movimiento.setTiendaId(tiendaId);
        movimiento.setSedeId(request.getSedeId());
        movimiento.setProductoId(request.getProductoId());
        movimiento.setTipoMovimiento(request.getTipoMovimiento());
        movimiento.setCantidad(request.getCantidad());
        movimiento.setCantidadAnterior(cantidadAnterior);
        movimiento.setCantidadPosterior(nuevaCantidad);
        movimiento.setPedidoId(request.getPedidoId());
        movimiento.setPlanProduccionId(request.getPlanProduccionId());
        movimiento.setMotivo(request.getMotivo());
        movimiento.setResponsableId(request.getResponsableId());

        MovimientoInventarioProducto guardado = repository.save(movimiento);
        MovimientoInventarioProductoResponse response = toResponse(guardado);
        
        // Agregar información de planificación automática si se generó
        Long planGeneradoId = planGeneradoIdThreadLocal.get();
        response.setPlanificacionAutomaticaGenerada(planGeneradoId != null);
        response.setPlanGeneradoId(planGeneradoId);
        
        // Limpiar ThreadLocal
        planGeneradoIdThreadLocal.remove();
        
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioProductoResponse> listarPorProducto(Long tiendaId, Long sedeId, Long productoId) {
        return repository.findByTiendaIdAndSedeIdAndProductoId(tiendaId, sedeId, productoId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioProductoResponse> listarPorRangoFechas(Long tiendaId, LocalDateTime inicio,
            LocalDateTime fin) {
        // Si no se proporcionan fechas, retornar todos los movimientos de la tienda
        if (inicio == null || fin == null) {
            return listarPorTienda(tiendaId);
        }
        return repository.findByTiendaIdAndCreadoEnBetween(tiendaId, inicio, fin).stream()
                .map(this::toResponse)
                .toList();
    }

    private MovimientoInventarioProductoResponse toResponse(MovimientoInventarioProducto entity) {
        // Enriquecer con datos del producto
        Producto producto = productoRepository.findById(entity.getProductoId()).orElse(null);
        
        // Enriquecer con datos del usuario responsable
        String usuarioResponsable = null;
        if (entity.getResponsableId() != null) {
            usuarioResponsable = usuarioRepository.findById(entity.getResponsableId())
                    .map(UsuarioTienda::getNombres)
                    .orElse(null);
        }
        
        return MovimientoInventarioProductoResponse.builder()
                .id(entity.getId())
                .sedeId(entity.getSedeId())
                .productoId(entity.getProductoId())
                .nombreProducto(producto != null ? producto.getNombre() : null)
                .sku(producto != null ? producto.getSku() : null)
                .tipoMovimiento(entity.getTipoMovimiento())
                .cantidad(entity.getCantidad())
                .cantidadAnterior(entity.getCantidadAnterior())
                .cantidadPosterior(entity.getCantidadPosterior())
                .pedidoId(entity.getPedidoId())
                .planProduccionId(entity.getPlanProduccionId())
                .motivo(entity.getMotivo())
                .responsableId(entity.getResponsableId())
                .usuarioResponsable(usuarioResponsable)
                .creadoEn(entity.getCreadoEn())
                .build();
    }
    
    /**
     * Verifica si el stock alcanzó el punto de reposición y genera automáticamente
     * una planificación de producción para reponer el stock ideal.
     * (Copiado de InventarioProductoService para evitar dependencia circular)
     */
    private void verificarYGenerarPlanificacionAutomatica(Long tiendaId, InventarioProducto inventario, 
                                                            Integer cantidadAnterior, Integer cantidadNueva) {
        log.info("🔎 [PLANIFICACION AUTO] Iniciando verificación - Producto: {}, Sede: {}, TiendaId: {}",
                inventario.getProductoId(), inventario.getSedeId(), tiendaId);
        
        // Obtener configuración de stock ideal
        Optional<StockIdeal> stockIdealOpt = stockIdealRepository.findByTiendaIdAndSedeIdAndProductoId(
                tiendaId, inventario.getSedeId(), inventario.getProductoId());
        
        if (stockIdealOpt.isEmpty()) {
            log.warn("❌ [PLANIFICACION AUTO] No hay stock ideal configurado para producto {} en sede {}", 
                    inventario.getProductoId(), inventario.getSedeId());
            return;
        }
        
        StockIdeal stockIdeal = stockIdealOpt.get();
        log.info("📋 [PLANIFICACION AUTO] Stock Ideal encontrado - Cantidad ideal: {}, Punto reposición: {}",
                stockIdeal.getCantidadIdeal(), stockIdeal.getPuntoReposicion());
        
        if (stockIdeal.getPuntoReposicion() == null) {
            log.warn("❌ [PLANIFICACION AUTO] No hay punto de reposición configurado para producto {} en sede {}", 
                    inventario.getProductoId(), inventario.getSedeId());
            return;
        }
        
        // Verificar si el stock actual es igual o menor al punto de reposición
        log.info("⚖️ [PLANIFICACION AUTO] Comparando: Stock nuevo ({}) vs Punto reposición ({})",
                cantidadNueva, stockIdeal.getPuntoReposicion());
        
        if (cantidadNueva > stockIdeal.getPuntoReposicion()) {
            log.info("✋ [PLANIFICACION AUTO] Stock ({}) aún está por encima del punto de reposición ({}). No se genera plan.",
                    cantidadNueva, stockIdeal.getPuntoReposicion());
            return;
        }
        
        log.info("⚠️ Stock de producto {} en sede {} alcanzó punto de reposición. Stock actual: {}, Punto reposición: {}",
                inventario.getProductoId(), inventario.getSedeId(), cantidadNueva, stockIdeal.getPuntoReposicion());
        
        // Calcular cantidad a planificar (diferencia entre stock ideal y actual)
        Integer cantidadAPlanificar = stockIdeal.getCantidadIdeal() - cantidadNueva;
        
        if (cantidadAPlanificar <= 0) {
            log.warn("La cantidad a planificar es 0 o negativa. Stock ideal: {}, Stock actual: {}",
                    stockIdeal.getCantidadIdeal(), cantidadNueva);
            return;
        }
        
        // Generar planificación para mañana
        LocalDate fechaProduccion = LocalDate.now().plusDays(1);
        
        // Buscar plan de producción para mañana
        Optional<PlanProduccion> planOpt = planProduccionRepository.findBySedeIdAndFechaProduccion(
                inventario.getSedeId(), fechaProduccion);
        
        PlanProduccion plan;
        if (planOpt.isPresent()) {
            plan = planOpt.get();
            
            // Si el plan está FINALIZADO, reabrirlo a CONFIRMADO para agregar nuevos productos
            if (plan.getEstado() == EstadoPlanProduccion.FINALIZADO) {
                log.info("🔄 Plan para {} está FINALIZADO. Reabriendo a CONFIRMADO para agregar nuevos productos...", fechaProduccion);
                plan.setEstado(EstadoPlanProduccion.CONFIRMADO);
                plan.setNotasMaestro((plan.getNotasMaestro() != null ? plan.getNotasMaestro() + " | " : "") + 
                        "Reabierto automáticamente por reposición de stock");
                plan = planProduccionRepository.save(plan);
            } else {
                log.info("📋 Plan existente encontrado para fecha {} (estado: {})", fechaProduccion, plan.getEstado());
            }
        } else {
            // No existe plan, crear uno nuevo
            log.info("🎆 Creando nuevo plan de producción automático para sede {} fecha {}",
                    inventario.getSedeId(), fechaProduccion);
            plan = new PlanProduccion();
            plan.setTiendaId(tiendaId);
            plan.setSedeId(inventario.getSedeId());
            plan.setFechaProduccion(fechaProduccion);
            plan.setEstado(EstadoPlanProduccion.CONFIRMADO);
            plan.setNotasMaestro("Plan generado automáticamente por reposición de stock");
            plan = planProduccionRepository.save(plan);
        }
        
        // Verificar si ya existe un detalle para este producto en el plan
        List<DetallePlanProduccion> detallesExistentes = detallePlanProduccionRepository
                .findByPlanIdOrderByIdAsc(plan.getId());
        
        Optional<DetallePlanProduccion> detalleExistenteOpt = detallesExistentes.stream()
                .filter(d -> d.getProductoId().equals(inventario.getProductoId()) && 
                              d.getOrigen() == OrigenItemProduccion.STOCK_DIARIO)
                .findFirst();
        
        DetallePlanProduccion detalle;
        if (detalleExistenteOpt.isPresent()) {
            // Ya existe, actualizar cantidades y resetear estado
            detalle = detalleExistenteOpt.get();
            Integer cantidadPlanificadaAnterior = detalle.getCantidadPlanificada();
            Integer cantidadProducidaAnterior = detalle.getCantidadProducida();
            
            log.info("🔄 Detalle existente encontrado para producto {}. Actualizando cantidades...", inventario.getProductoId());
            log.info("   Planificado anterior: {}, Producido anterior: {}", cantidadPlanificadaAnterior, cantidadProducidaAnterior);
            
            // Ajustar inventario: restar lo que ya se había producido antes
            if (cantidadProducidaAnterior != null && cantidadProducidaAnterior > 0) {
                Integer stockActual = inventario.getCantidadActual();
                inventario.setCantidadActual(stockActual - cantidadProducidaAnterior);
                inventarioRepository.save(inventario);
                log.info("⬅️ Ajustando inventario: restando {} unidades producidas anteriormente. Stock: {} -> {}", 
                        cantidadProducidaAnterior, stockActual, inventario.getCantidadActual());
            }
            
            // Actualizar cantidades
            detalle.setCantidadSugerida(detalle.getCantidadSugerida() + cantidadAPlanificar);
            detalle.setCantidadPlanificada(detalle.getCantidadPlanificada() + cantidadAPlanificar);
            detalle.setCantidadProducida(0);
            detalle.setCantidadMerma(0);
            detalle.setEstado(EstadoItemProduccion.PENDIENTE);
            detalle.setObservaciones(String.format("Reposición automática (actualizado). Stock actual: %d, Stock ideal: %d, Punto reposición: %d",
                    cantidadNueva, stockIdeal.getCantidadIdeal(), stockIdeal.getPuntoReposicion()));
            
            log.info("✏️ Planificado actualizado: {} -> {}", cantidadPlanificadaAnterior, detalle.getCantidadPlanificada());
        } else {
            // No existe, crear uno nuevo
            log.info("➕ Creando nuevo detalle de planificación para producto {}", inventario.getProductoId());
            detalle = new DetallePlanProduccion();
            detalle.setPlanId(plan.getId());
            detalle.setProductoId(inventario.getProductoId());
            detalle.setOrigen(OrigenItemProduccion.STOCK_DIARIO);
            detalle.setEsPersonalizado(false);
            detalle.setCantidadSugerida(cantidadAPlanificar);
            detalle.setCantidadPlanificada(cantidadAPlanificar);
            detalle.setCantidadProducida(0);
            detalle.setCantidadMerma(0);
            detalle.setEstado(EstadoItemProduccion.PENDIENTE);
            detalle.setObservaciones(String.format("Reposición automática. Stock actual: %d, Stock ideal: %d, Punto reposición: %d",
                    cantidadNueva, stockIdeal.getCantidadIdeal(), stockIdeal.getPuntoReposicion()));
        }
        
        detallePlanProduccionRepository.save(detalle);
        
        // Guardar ID del plan generado para retornar en la respuesta
        planGeneradoIdThreadLocal.set(plan.getId());
        
        log.info("✅ 🎉 Planificación automática creada: {} unidades de producto {} para fecha {}",
                cantidadAPlanificar, inventario.getProductoId(), fechaProduccion);
    }
}
