package com.dulcecontrol.bakery.features.admin.inventario.service.impl;

import com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioProductoCreateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioProductoUpdateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioProductoResponse;
import com.dulcecontrol.bakery.features.admin.inventario.dto.UbicacionFisicaUpdateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.entity.InventarioProducto;
import com.dulcecontrol.bakery.features.admin.inventario.repository.InventarioProductoRepository;
import com.dulcecontrol.bakery.features.admin.inventario.service.IInventarioProductoService;
import com.dulcecontrol.bakery.features.admin.catalogo.entity.Producto;
import com.dulcecontrol.bakery.features.admin.catalogo.entity.Categoria;
import com.dulcecontrol.bakery.features.shared.catalogo.repository.ProductoRepository;
import com.dulcecontrol.bakery.features.shared.catalogo.repository.CategoriaRepository;
import com.dulcecontrol.bakery.features.admin.produccion.entity.StockIdeal;
import com.dulcecontrol.bakery.features.admin.produccion.repository.StockIdealRepository;
import com.dulcecontrol.bakery.features.admin.produccion.entity.PlanProduccion;
import com.dulcecontrol.bakery.features.admin.produccion.entity.DetallePlanProduccion;
import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.EstadoPlanProduccion;
import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.EstadoItemProduccion;
import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.OrigenItemProduccion;
import com.dulcecontrol.bakery.features.admin.produccion.repository.PlanProduccionRepository;
import com.dulcecontrol.bakery.features.admin.produccion.repository.DetallePlanProduccionRepository;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventarioProductoService implements IInventarioProductoService {

    private final InventarioProductoRepository repository;
    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final StockIdealRepository stockIdealRepository;
    private final PlanProduccionRepository planProduccionRepository;
    private final DetallePlanProduccionRepository detallePlanProduccionRepository;

    @Override
    @Transactional(readOnly = true)
    public List<InventarioProductoResponse> listarPorTienda(Long tiendaId) {
        return repository.findByTiendaId(tiendaId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventarioProductoResponse> listarPorTiendaYSede(Long tiendaId, Long sedeId) {
        return repository.findByTiendaIdAndSedeId(tiendaId, sedeId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public InventarioProductoResponse obtenerPorId(Long tiendaId, Long id) {
        InventarioProducto inventario = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventario de producto no encontrado"));
        return toResponse(inventario);
    }

    @Override
    @Transactional
    public InventarioProductoResponse crear(Long tiendaId, InventarioProductoCreateRequest request) {
        // Validar que no exista duplicado
        if (repository.existsBySedeIdAndProductoId(request.getSedeId(), request.getProductoId())) {
            throw new BadRequestException("Ya existe un inventario para este producto en la sede");
        }

        InventarioProducto inventario = new InventarioProducto();
        inventario.setTiendaId(tiendaId);
        inventario.setSedeId(request.getSedeId());
        inventario.setProductoId(request.getProductoId());
        inventario.setCantidadActual(request.getCantidadActual() != null ? request.getCantidadActual() : 0);
        inventario.setUbicacionFisica(request.getUbicacionFisica());

        InventarioProducto guardado = repository.save(inventario);
        return toResponse(guardado);
    }

    @Override
    @Transactional
    public InventarioProductoResponse actualizar(Long tiendaId, Long id, InventarioProductoUpdateRequest request) {
        InventarioProducto inventario = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventario de producto no encontrado"));

        Integer cantidadAnterior = inventario.getCantidadActual();
        Integer cantidadNueva = request.getCantidadActual();
        
        log.info("📊 Actualizando inventario - Producto: {}, Sede: {}, Stock anterior: {}, Stock nuevo: {}",
                inventario.getProductoId(), inventario.getSedeId(), cantidadAnterior, cantidadNueva);
        
        inventario.setCantidadActual(cantidadNueva);
        inventario.setUbicacionFisica(request.getUbicacionFisica());

        InventarioProducto actualizado = repository.save(inventario);
        
        // Verificar si se alcanzó el punto de reposición y generar planificación automática
        log.info("🔍 Verificando punto de reposición para producto {}...", actualizado.getProductoId());
        verificarYGenerarPlanificacionAutomatica(tiendaId, actualizado, cantidadAnterior, cantidadNueva);
        
        return toResponse(actualizado);
    }

        @Override
        @Transactional
        public InventarioProductoResponse actualizarUbicacion(Long tiendaId, Long id, UbicacionFisicaUpdateRequest request) {
                InventarioProducto inventario = repository.findByIdAndTiendaId(id, tiendaId)
                                .orElseThrow(() -> new ResourceNotFoundException("Inventario de producto no encontrado"));

                String ubicacion = request != null ? request.getUbicacionFisica() : null;
                if (ubicacion != null) {
                        ubicacion = ubicacion.trim();
                        if (ubicacion.isBlank()) {
                                ubicacion = null;
                        }
                }

                inventario.setUbicacionFisica(ubicacion);
                InventarioProducto actualizado = repository.save(inventario);
                return toResponse(actualizado);
        }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long id) {
        InventarioProducto inventario = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventario de producto no encontrado"));
        repository.delete(inventario);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventarioProductoResponse> listarBajoStock(Long tiendaId, Long sedeId, Integer cantidadMinima) {
        return repository.findBajoStock(tiendaId, sedeId, cantidadMinima).stream()
                .map(this::toResponse)
                .toList();
    }

    private InventarioProductoResponse toResponse(InventarioProducto entity) {
        // Obtener datos del producto
        Producto producto = productoRepository.findById(entity.getProductoId())
                .orElse(null);
        
        String nombreProducto = producto != null ? producto.getNombre() : "Producto no encontrado";
        String sku = producto != null ? producto.getSku() : null;
        
        // Obtener categoría
        String categoriaNombre = null;
        if (producto != null && producto.getCategoriaId() != null) {
            categoriaNombre = categoriaRepository.findById(producto.getCategoriaId())
                    .map(Categoria::getNombre)
                    .orElse(null);
        }
        
        // Obtener stock ideal para esta sede
        Optional<StockIdeal> stockIdealOpt = stockIdealRepository.findByTiendaIdAndSedeIdAndProductoId(
                entity.getTiendaId(), entity.getSedeId(), entity.getProductoId());
        
        Integer stockIdeal = stockIdealOpt.map(StockIdeal::getCantidadIdeal).orElse(null);
        
        // Calcular estado de stock
        String estadoStock = calcularEstadoStock(entity.getCantidadActual(), stockIdeal);
        
        return InventarioProductoResponse.builder()
                .id(entity.getId())
                .sedeId(entity.getSedeId())
                .productoId(entity.getProductoId())
                .cantidadActual(entity.getCantidadActual())
                .ubicacionFisica(entity.getUbicacionFisica())
                .actualizadoEn(entity.getActualizadoEn())
                .nombreProducto(nombreProducto)
                .sku(sku)
                .stockIdeal(stockIdeal)
                .estadoStock(estadoStock)
                .categoriaNombre(categoriaNombre)
                .build();
    }
    
    private String calcularEstadoStock(Integer cantidadActual, Integer stockIdeal) {
        if (stockIdeal == null) {
            return "SIN_CONFIGURAR";
        }
        
        double porcentaje = (double) cantidadActual / stockIdeal;
        
        if (porcentaje >= 0.8) {
            return "OK";
        } else if (porcentaje >= 0.2) {
            return "BAJO_STOCK";
        } else {
            return "CRITICO";
        }
    }
    
    /**
     * Verifica si el stock alcanzó el punto de reposición y genera automáticamente
     * una planificación de producción para reponer el stock ideal.
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
        
        log.info("Stock de producto {} en sede {} alcanzó punto de reposición. Stock actual: {}, Punto reposición: {}",
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
        
        // Buscar o crear plan de producción para mañana
        PlanProduccion plan = planProduccionRepository.findBySedeIdAndFechaProduccion(
                inventario.getSedeId(), fechaProduccion)
                .orElseGet(() -> {
                    log.info("Creando nuevo plan de producción automático para sede {} fecha {}",
                            inventario.getSedeId(), fechaProduccion);
                    PlanProduccion nuevoPlan = new PlanProduccion();
                    nuevoPlan.setTiendaId(tiendaId);
                    nuevoPlan.setSedeId(inventario.getSedeId());
                    nuevoPlan.setFechaProduccion(fechaProduccion);
                    nuevoPlan.setEstado(EstadoPlanProduccion.CONFIRMADO);
                    nuevoPlan.setNotasMaestro("Plan generado automáticamente por reposición de stock");
                    return planProduccionRepository.save(nuevoPlan);
                });
        
        // Verificar si ya existe un detalle para este producto en el plan
        List<DetallePlanProduccion> detallesExistentes = detallePlanProduccionRepository
                .findByPlanIdOrderByIdAsc(plan.getId());
        
        boolean yaExisteDetalle = detallesExistentes.stream()
                .anyMatch(d -> d.getProductoId().equals(inventario.getProductoId()) && 
                              d.getOrigen() == OrigenItemProduccion.STOCK_DIARIO);
        
        if (yaExisteDetalle) {
            log.info("Ya existe un detalle de planificación para producto {} en el plan {}",
                    inventario.getProductoId(), plan.getId());
            return;
        }
        
        // Crear detalle de planificación
        DetallePlanProduccion detalle = new DetallePlanProduccion();
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
        
        detallePlanProduccionRepository.save(detalle);
        
        log.info("✅ Planificación automática creada: {} unidades de producto {} para fecha {}",
                cantidadAPlanificar, inventario.getProductoId(), fechaProduccion);
    }
}
