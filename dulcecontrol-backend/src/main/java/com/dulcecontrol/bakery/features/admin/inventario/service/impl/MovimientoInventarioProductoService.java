package com.dulcecontrol.bakery.features.admin.inventario.service.impl;

import com.dulcecontrol.bakery.features.admin.inventario.dto.MovimientoInventarioProductoCreateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.MovimientoInventarioProductoResponse;
import com.dulcecontrol.bakery.features.admin.inventario.entity.InventarioProducto;
import com.dulcecontrol.bakery.features.admin.inventario.entity.MovimientoInventarioProducto;
import com.dulcecontrol.bakery.features.admin.inventario.repository.InventarioProductoRepository;
import com.dulcecontrol.bakery.features.admin.inventario.repository.MovimientoInventarioProductoRepository;
import com.dulcecontrol.bakery.features.admin.inventario.service.IMovimientoInventarioProductoService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MovimientoInventarioProductoService implements IMovimientoInventarioProductoService {

    private final MovimientoInventarioProductoRepository repository;
    private final InventarioProductoRepository inventarioRepository;

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

    @Override
    @Transactional
    public MovimientoInventarioProductoResponse crear(Long tiendaId,
            MovimientoInventarioProductoCreateRequest request) {
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
        return toResponse(guardado);
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
        return MovimientoInventarioProductoResponse.builder()
                .id(entity.getId())
                .sedeId(entity.getSedeId())
                .productoId(entity.getProductoId())
                .tipoMovimiento(entity.getTipoMovimiento())
                .cantidad(entity.getCantidad())
                .cantidadAnterior(entity.getCantidadAnterior())
                .cantidadPosterior(entity.getCantidadPosterior())
                .pedidoId(entity.getPedidoId())
                .planProduccionId(entity.getPlanProduccionId())
                .motivo(entity.getMotivo())
                .responsableId(entity.getResponsableId())
                .creadoEn(entity.getCreadoEn())
                .build();
    }
}
