package com.dulcecontrol.bakery.feature.admin.inventario.service.impl;

import com.dulcecontrol.bakery.feature.admin.inventario.dto.MovimientoInventarioInsumoDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.InventarioInsumoSede;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.MovimientoInventarioInsumo;
import com.dulcecontrol.bakery.feature.admin.inventario.repository.InventarioInsumoSedeRepository;
import com.dulcecontrol.bakery.feature.admin.inventario.repository.MovimientoInventarioInsumoRepository;
import com.dulcecontrol.bakery.feature.admin.inventario.service.IMovimientoInventarioInsumoService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MovimientoInventarioInsumoService implements IMovimientoInventarioInsumoService {

    private final MovimientoInventarioInsumoRepository repository;
    private final InventarioInsumoSedeRepository inventarioRepository;

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioInsumoDTO> listarPorTienda(Long tiendaId) {
        return repository.findByTiendaId(tiendaId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioInsumoDTO> listarPorTiendaYSede(Long tiendaId, Long sedeId) {
        return repository.findByTiendaIdAndSedeId(tiendaId, sedeId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MovimientoInventarioInsumoDTO> listarPorTiendaYSedePaginado(Long tiendaId, Long sedeId,
            Pageable pageable) {
        return repository.findByTiendaIdAndSedeIdOrderByCreadoEnDesc(tiendaId, sedeId, pageable)
                .map(this::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public MovimientoInventarioInsumoDTO obtenerPorId(Long tiendaId, Long id) {
        MovimientoInventarioInsumo movimiento = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Movimiento de inventario no encontrado"));
        return toDTO(movimiento);
    }

    @Override
    @Transactional
    public MovimientoInventarioInsumoDTO crear(Long tiendaId, MovimientoInventarioInsumoDTO dto) {
        // Buscar o crear inventario
        InventarioInsumoSede inventario = inventarioRepository
                .findBySedeIdAndInsumoId(dto.getSedeId(), dto.getInsumoId())
                .orElseGet(() -> {
                    InventarioInsumoSede nuevo = new InventarioInsumoSede();
                    nuevo.setTiendaId(tiendaId);
                    nuevo.setSedeId(dto.getSedeId());
                    nuevo.setInsumoId(dto.getInsumoId());
                    nuevo.setCantidadActual(BigDecimal.ZERO);
                    return inventarioRepository.save(nuevo);
                });

        BigDecimal cantidadAnterior = inventario.getCantidadActual();
        BigDecimal nuevaCantidad;

        // Calcular nueva cantidad según tipo de movimiento
        switch (dto.getTipoMovimiento()) {
            case ENTRADA:
                nuevaCantidad = cantidadAnterior.add(dto.getCantidad());
                break;
            case SALIDA:
                nuevaCantidad = cantidadAnterior.subtract(dto.getCantidad());
                if (nuevaCantidad.compareTo(BigDecimal.ZERO) < 0) {
                    throw new BadRequestException("No hay suficiente stock. Stock actual: " + cantidadAnterior);
                }
                break;
            case AJUSTE:
                nuevaCantidad = dto.getCantidad(); // Ajuste establece la cantidad directamente
                break;
            case TRANSFERENCIA:
                // Para transferencias, el tipo de movimiento (entrada/salida) determina el
                // signo
                if (dto.getCantidad().compareTo(BigDecimal.ZERO) > 0) {
                    nuevaCantidad = cantidadAnterior.add(dto.getCantidad()); // Entrada
                } else {
                    nuevaCantidad = cantidadAnterior.add(dto.getCantidad()); // Salida (cantidad negativa)
                    if (nuevaCantidad.compareTo(BigDecimal.ZERO) < 0) {
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
        MovimientoInventarioInsumo movimiento = new MovimientoInventarioInsumo();
        movimiento.setTiendaId(tiendaId);
        movimiento.setSedeId(dto.getSedeId());
        movimiento.setInsumoId(dto.getInsumoId());
        movimiento.setTipoMovimiento(dto.getTipoMovimiento());
        movimiento.setCantidad(dto.getCantidad());
        movimiento.setCantidadAnterior(cantidadAnterior);
        movimiento.setCantidadPosterior(nuevaCantidad);
        movimiento.setOrdenCompraId(dto.getOrdenCompraId());
        movimiento.setPlanProduccionId(dto.getPlanProduccionId());
        movimiento.setTransferenciaId(dto.getTransferenciaId());
        movimiento.setMotivo(dto.getMotivo());
        movimiento.setResponsableId(dto.getResponsableId());

        MovimientoInventarioInsumo guardado = repository.save(movimiento);
        return toDTO(guardado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioInsumoDTO> listarPorInsumo(Long tiendaId, Long sedeId, Long insumoId) {
        return repository.findByTiendaIdAndSedeIdAndInsumoId(tiendaId, sedeId, insumoId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioInsumoDTO> listarPorRangoFechas(Long tiendaId, LocalDateTime inicio,
            LocalDateTime fin) {
        // Si no se proporcionan fechas, retornar todos los movimientos de la tienda
        if (inicio == null || fin == null) {
            return listarPorTienda(tiendaId);
        }
        return repository.findByTiendaIdAndCreadoEnBetween(tiendaId, inicio, fin).stream()
                .map(this::toDTO)
                .toList();
    }

    private MovimientoInventarioInsumoDTO toDTO(MovimientoInventarioInsumo entity) {
        return MovimientoInventarioInsumoDTO.builder()
                .id(entity.getId())
                .sedeId(entity.getSedeId())
                .insumoId(entity.getInsumoId())
                .tipoMovimiento(entity.getTipoMovimiento())
                .cantidad(entity.getCantidad())
                .cantidadAnterior(entity.getCantidadAnterior())
                .cantidadPosterior(entity.getCantidadPosterior())
                .ordenCompraId(entity.getOrdenCompraId())
                .planProduccionId(entity.getPlanProduccionId())
                .transferenciaId(entity.getTransferenciaId())
                .motivo(entity.getMotivo())
                .responsableId(entity.getResponsableId())
                .creadoEn(entity.getCreadoEn())
                .build();
    }
}
