package com.dulcecontrol.bakery.features.admin.inventario.service.impl;

import com.dulcecontrol.bakery.features.admin.inventario.dto.MovimientoInventarioInsumoCreateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.MovimientoInventarioInsumoResponse;
import com.dulcecontrol.bakery.features.admin.inventario.entity.InventarioInsumoSede;
import com.dulcecontrol.bakery.features.admin.inventario.entity.MovimientoInventarioInsumo;
import com.dulcecontrol.bakery.features.admin.inventario.repository.InventarioInsumoSedeRepository;
import com.dulcecontrol.bakery.features.admin.inventario.repository.MovimientoInventarioInsumoRepository;
import com.dulcecontrol.bakery.features.admin.inventario.service.IMovimientoInventarioInsumoService;
import com.dulcecontrol.bakery.features.admin.compras.entity.Insumo;
import com.dulcecontrol.bakery.features.admin.compras.repository.InsumoRepository;
import com.dulcecontrol.bakery.features.admin.seguridad.entity.UsuarioTienda;
import com.dulcecontrol.bakery.features.admin.seguridad.repository.UsuarioTiendaRepository;
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
    private final InsumoRepository insumoRepository;
    private final UsuarioTiendaRepository usuarioRepository;

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioInsumoResponse> listarPorTienda(Long tiendaId) {
        return repository.findByTiendaId(tiendaId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioInsumoResponse> listarPorTiendaYSede(Long tiendaId, Long sedeId) {
        return repository.findByTiendaIdAndSedeId(tiendaId, sedeId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MovimientoInventarioInsumoResponse> listarPorTiendaYSedePaginado(Long tiendaId, Long sedeId,
            Pageable pageable) {
        return repository.findByTiendaIdAndSedeIdOrderByCreadoEnDesc(tiendaId, sedeId, pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public MovimientoInventarioInsumoResponse obtenerPorId(Long tiendaId, Long id) {
        MovimientoInventarioInsumo movimiento = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Movimiento de inventario no encontrado"));
        return toResponse(movimiento);
    }

    @Override
    @Transactional
    public MovimientoInventarioInsumoResponse crear(Long tiendaId, MovimientoInventarioInsumoCreateRequest request) {
        // Buscar o crear inventario
        InventarioInsumoSede inventario = inventarioRepository
                .findBySedeIdAndInsumoId(request.getSedeId(), request.getInsumoId())
                .orElseGet(() -> {
                    InventarioInsumoSede nuevo = new InventarioInsumoSede();
                    nuevo.setTiendaId(tiendaId);
                    nuevo.setSedeId(request.getSedeId());
                    nuevo.setInsumoId(request.getInsumoId());
                    nuevo.setCantidadActual(BigDecimal.ZERO);
                    return inventarioRepository.save(nuevo);
                });

        BigDecimal cantidadAnterior = inventario.getCantidadActual();
        BigDecimal nuevaCantidad;

        // Calcular nueva cantidad según tipo de movimiento
        switch (request.getTipoMovimiento()) {
            case ENTRADA:
                nuevaCantidad = cantidadAnterior.add(request.getCantidad());
                break;
            case SALIDA:
                nuevaCantidad = cantidadAnterior.subtract(request.getCantidad());
                if (nuevaCantidad.compareTo(BigDecimal.ZERO) < 0) {
                    throw new BadRequestException("No hay suficiente stock. Stock actual: " + cantidadAnterior);
                }
                break;
            case AJUSTE:
                nuevaCantidad = request.getCantidad(); // Ajuste establece la cantidad directamente
                break;
            case TRANSFERENCIA:
                // Para transferencias, el tipo de movimiento (entrada/salida) determina el
                // signo
                if (request.getCantidad().compareTo(BigDecimal.ZERO) > 0) {
                    nuevaCantidad = cantidadAnterior.add(request.getCantidad()); // Entrada
                } else {
                    nuevaCantidad = cantidadAnterior.add(request.getCantidad()); // Salida (cantidad negativa)
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
        movimiento.setSedeId(request.getSedeId());
        movimiento.setInsumoId(request.getInsumoId());
        movimiento.setTipoMovimiento(request.getTipoMovimiento());
        movimiento.setCantidad(request.getCantidad());
        movimiento.setCantidadAnterior(cantidadAnterior);
        movimiento.setCantidadPosterior(nuevaCantidad);
        movimiento.setOrdenCompraId(request.getOrdenCompraId());
        movimiento.setPlanProduccionId(request.getPlanProduccionId());
        movimiento.setTransferenciaId(request.getTransferenciaId());
        movimiento.setMotivo(request.getMotivo());
        movimiento.setResponsableId(request.getResponsableId());

        MovimientoInventarioInsumo guardado = repository.save(movimiento);
        return toResponse(guardado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioInsumoResponse> listarPorInsumo(Long tiendaId, Long sedeId, Long insumoId) {
        return repository.findByTiendaIdAndSedeIdAndInsumoId(tiendaId, sedeId, insumoId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioInsumoResponse> listarPorRangoFechas(Long tiendaId, LocalDateTime inicio,
            LocalDateTime fin) {
        // Si no se proporcionan fechas, retornar todos los movimientos de la tienda
        if (inicio == null || fin == null) {
            return listarPorTienda(tiendaId);
        }
        return repository.findByTiendaIdAndCreadoEnBetween(tiendaId, inicio, fin).stream()
                .map(this::toResponse)
                .toList();
    }

    private MovimientoInventarioInsumoResponse toResponse(MovimientoInventarioInsumo entity) {
        // Enriquecer con datos del insumo
        Insumo insumo = insumoRepository.findById(entity.getInsumoId()).orElse(null);
        
        // Enriquecer con datos del usuario responsable
        String usuarioResponsable = null;
        if (entity.getResponsableId() != null) {
            usuarioResponsable = usuarioRepository.findById(entity.getResponsableId())
                    .map(UsuarioTienda::getNombres)
                    .orElse(null);
        }
        
        return MovimientoInventarioInsumoResponse.builder()
                .id(entity.getId())
                .sedeId(entity.getSedeId())
                .insumoId(entity.getInsumoId())
                .nombreInsumo(insumo != null ? insumo.getNombre() : null)
                .codigoInterno(insumo != null ? insumo.getCodigoInterno() : null)
                .unidadMedida(insumo != null && insumo.getUnidadBase() != null ? insumo.getUnidadBase().name() : null)
                .tipoMovimiento(entity.getTipoMovimiento())
                .cantidad(entity.getCantidad())
                .cantidadAnterior(entity.getCantidadAnterior())
                .cantidadPosterior(entity.getCantidadPosterior())
                .ordenCompraId(entity.getOrdenCompraId())
                .planProduccionId(entity.getPlanProduccionId())
                .transferenciaId(entity.getTransferenciaId())
                .motivo(entity.getMotivo())
                .responsableId(entity.getResponsableId())
                .usuarioResponsable(usuarioResponsable)
                .creadoEn(entity.getCreadoEn())
                .build();
    }
}
