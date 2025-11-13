package com.dulcecontrol.bakery.feature.admin.inventario.service.impl;

import com.dulcecontrol.bakery.feature.admin.inventario.controller.dto.MovimientoInventarioProductoDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.InventarioProducto;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.MovimientoInventarioProducto;
import com.dulcecontrol.bakery.feature.admin.inventario.repository.InventarioProductoRepository;
import com.dulcecontrol.bakery.feature.admin.inventario.repository.MovimientoInventarioProductoRepository;
import com.dulcecontrol.bakery.feature.admin.inventario.service.IMovimientoInventarioProductoService;
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
    public List<MovimientoInventarioProductoDTO> listarPorTienda(Long tiendaId) {
        return repository.findByTiendaId(tiendaId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioProductoDTO> listarPorTiendaYSede(Long tiendaId, Long sedeId) {
        return repository.findByTiendaIdAndSedeId(tiendaId, sedeId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MovimientoInventarioProductoDTO> listarPorTiendaYSedePaginado(Long tiendaId, Long sedeId,
            Pageable pageable) {
        return repository.findByTiendaIdAndSedeIdOrderByCreadoEnDesc(tiendaId, sedeId, pageable)
                .map(this::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public MovimientoInventarioProductoDTO obtenerPorId(Long tiendaId, Long id) {
        MovimientoInventarioProducto movimiento = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Movimiento de inventario no encontrado"));
        return toDTO(movimiento);
    }

    @Override
    @Transactional
    public MovimientoInventarioProductoDTO crear(Long tiendaId, MovimientoInventarioProductoDTO dto) {
        // Buscar o crear inventario
        InventarioProducto inventario = inventarioRepository
                .findBySedeIdAndProductoId(dto.getSedeId(), dto.getProductoId())
                .orElseGet(() -> {
                    InventarioProducto nuevo = new InventarioProducto();
                    nuevo.setTiendaId(tiendaId);
                    nuevo.setSedeId(dto.getSedeId());
                    nuevo.setProductoId(dto.getProductoId());
                    nuevo.setCantidadActual(0);
                    return inventarioRepository.save(nuevo);
                });

        Integer cantidadAnterior = inventario.getCantidadActual();
        Integer nuevaCantidad;

        // Calcular nueva cantidad según tipo de movimiento
        switch (dto.getTipoMovimiento()) {
            case ENTRADA:
                nuevaCantidad = cantidadAnterior + dto.getCantidad();
                break;
            case SALIDA:
                nuevaCantidad = cantidadAnterior - dto.getCantidad();
                if (nuevaCantidad < 0) {
                    throw new BadRequestException("No hay suficiente stock. Stock actual: " + cantidadAnterior);
                }
                break;
            case AJUSTE:
                nuevaCantidad = dto.getCantidad(); // Ajuste establece la cantidad directamente
                break;
            case TRANSFERENCIA:
                // Para transferencias, el tipo de movimiento determina el signo
                if (dto.getCantidad() > 0) {
                    nuevaCantidad = cantidadAnterior + dto.getCantidad(); // Entrada
                } else {
                    nuevaCantidad = cantidadAnterior + dto.getCantidad(); // Salida (cantidad negativa)
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
        movimiento.setSedeId(dto.getSedeId());
        movimiento.setProductoId(dto.getProductoId());
        movimiento.setTipoMovimiento(dto.getTipoMovimiento());
        movimiento.setCantidad(dto.getCantidad());
        movimiento.setCantidadAnterior(cantidadAnterior);
        movimiento.setCantidadPosterior(nuevaCantidad);
        movimiento.setPedidoId(dto.getPedidoId());
        movimiento.setPlanProduccionId(dto.getPlanProduccionId());
        movimiento.setMotivo(dto.getMotivo());
        movimiento.setResponsableId(dto.getResponsableId());

        MovimientoInventarioProducto guardado = repository.save(movimiento);
        return toDTO(guardado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioProductoDTO> listarPorProducto(Long tiendaId, Long sedeId, Long productoId) {
        return repository.findByTiendaIdAndSedeIdAndProductoId(tiendaId, sedeId, productoId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioProductoDTO> listarPorRangoFechas(Long tiendaId, LocalDateTime inicio,
            LocalDateTime fin) {
        // Si no se proporcionan fechas, retornar todos los movimientos de la tienda
        if (inicio == null || fin == null) {
            return listarPorTienda(tiendaId);
        }
        return repository.findByTiendaIdAndCreadoEnBetween(tiendaId, inicio, fin).stream()
                .map(this::toDTO)
                .toList();
    }

    private MovimientoInventarioProductoDTO toDTO(MovimientoInventarioProducto entity) {
        return MovimientoInventarioProductoDTO.builder()
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
