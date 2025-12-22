package com.dulcecontrol.bakery.features.admin.inventario.service.impl;

import com.dulcecontrol.bakery.features.admin.inventario.dto.ItemTransferenciaCreateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.ItemTransferenciaResponse;
import com.dulcecontrol.bakery.features.admin.inventario.dto.TransferenciaInventarioCreateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.ItemTransferenciaRecepcionRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.TransferenciaInventarioUpdateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.TransferenciaInventarioResponse;
import com.dulcecontrol.bakery.features.admin.inventario.dto.TransferenciaRecepcionRequest;
import com.dulcecontrol.bakery.features.admin.inventario.entity.InventarioInsumoSede;
import com.dulcecontrol.bakery.features.admin.inventario.entity.InventarioProducto;
import com.dulcecontrol.bakery.features.admin.inventario.entity.ItemTransferencia;
import com.dulcecontrol.bakery.features.admin.inventario.entity.MovimientoInventarioInsumo;
import com.dulcecontrol.bakery.features.admin.inventario.entity.MovimientoInventarioProducto;
import com.dulcecontrol.bakery.features.admin.inventario.entity.TransferenciaInventario;
import com.dulcecontrol.bakery.features.admin.inventario.entity.enums.EstadoTransferencia;
import com.dulcecontrol.bakery.features.admin.inventario.entity.enums.MotivoMovimientoProducto;
import com.dulcecontrol.bakery.features.admin.inventario.entity.enums.TipoMovimientoInsumo;
import com.dulcecontrol.bakery.features.admin.inventario.repository.InventarioInsumoSedeRepository;
import com.dulcecontrol.bakery.features.admin.inventario.repository.InventarioProductoRepository;
import com.dulcecontrol.bakery.features.admin.inventario.repository.ItemTransferenciaRepository;
import com.dulcecontrol.bakery.features.admin.inventario.repository.MovimientoInventarioInsumoRepository;
import com.dulcecontrol.bakery.features.admin.inventario.repository.MovimientoInventarioProductoRepository;
import com.dulcecontrol.bakery.features.admin.inventario.repository.TransferenciaInventarioRepository;
import com.dulcecontrol.bakery.features.admin.inventario.service.ITransferenciaInventarioService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TransferenciaInventarioService implements ITransferenciaInventarioService {

    private final TransferenciaInventarioRepository repository;
    private final ItemTransferenciaRepository itemRepository;
    private final InventarioProductoRepository inventarioProductoRepository;
    private final InventarioInsumoSedeRepository inventarioInsumoSedeRepository;
    private final MovimientoInventarioProductoRepository movimientoInventarioProductoRepository;
    private final MovimientoInventarioInsumoRepository movimientoInventarioInsumoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TransferenciaInventarioResponse> listarPorTienda(Long tiendaId) {
        return repository.findByTiendaId(tiendaId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransferenciaInventarioResponse> listarPorEstado(Long tiendaId, EstadoTransferencia estado) {
        return repository.findByTiendaIdAndEstado(tiendaId, estado).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TransferenciaInventarioResponse obtenerPorId(Long tiendaId, Long id) {
        TransferenciaInventario transferencia = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Transferencia no encontrada"));
        return toResponse(transferencia);
    }

    @Override
    @Transactional
    public TransferenciaInventarioResponse crear(Long tiendaId, TransferenciaInventarioCreateRequest request) {
        // Validar que las sedes sean diferentes
        if (request.getSedeOrigenId().equals(request.getSedeDestinoId())) {
            throw new BadRequestException("La sede de origen y destino deben ser diferentes");
        }

        TransferenciaInventario transferencia = new TransferenciaInventario();
        transferencia.setTiendaId(tiendaId);
        transferencia.setSedeOrigenId(request.getSedeOrigenId());
        transferencia.setSedeDestinoId(request.getSedeDestinoId());
        transferencia.setEstado(EstadoTransferencia.PENDIENTE);
        transferencia.setSolicitadoPor(request.getSolicitadoPor());
        transferencia.setObservaciones(request.getObservaciones());

        TransferenciaInventario guardado = repository.save(transferencia);

        // Guardar items
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (ItemTransferenciaCreateRequest itemRequest : request.getItems()) {
                ItemTransferencia item = new ItemTransferencia();
                item.setTransferenciaId(guardado.getId());
                item.setInsumoId(itemRequest.getInsumoId());
                item.setProductoId(itemRequest.getProductoId());
                item.setCantidadEnviada(itemRequest.getCantidadEnviada());
                itemRepository.save(item);
            }
        }

        return toResponse(guardado);
    }

    @Override
    @Transactional
    public TransferenciaInventarioResponse actualizar(Long tiendaId, Long id,
            TransferenciaInventarioUpdateRequest request) {
        TransferenciaInventario transferencia = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Transferencia no encontrada"));

        // Solo se puede actualizar si está en estado PENDIENTE
        if (transferencia.getEstado() != EstadoTransferencia.PENDIENTE) {
            throw new BadRequestException("Solo se pueden actualizar transferencias en estado PENDIENTE");
        }

        transferencia.setSedeOrigenId(request.getSedeOrigenId());
        transferencia.setSedeDestinoId(request.getSedeDestinoId());
        transferencia.setObservaciones(request.getObservaciones());

        TransferenciaInventario actualizado = repository.save(transferencia);

        // Actualizar items
        if (request.getItems() != null) {
            itemRepository.deleteByTransferenciaId(id);
            for (ItemTransferenciaCreateRequest itemRequest : request.getItems()) {
                ItemTransferencia item = new ItemTransferencia();
                item.setTransferenciaId(actualizado.getId());
                item.setInsumoId(itemRequest.getInsumoId());
                item.setProductoId(itemRequest.getProductoId());
                item.setCantidadEnviada(itemRequest.getCantidadEnviada());
                itemRepository.save(item);
            }
        }

        return toResponse(actualizado);
    }

    @Override
    @Transactional
    public TransferenciaInventarioResponse cambiarEstado(Long tiendaId, Long id, EstadoTransferencia nuevoEstado) {
        final TransferenciaInventario transferencia = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Transferencia no encontrada"));

        final EstadoTransferencia estadoAnterior = transferencia.getEstado();

        // Validar transiciones de estado
        validarTransicionEstado(estadoAnterior, nuevoEstado);

        List<ItemTransferencia> items = itemRepository.findByTransferenciaId(transferencia.getId());

        // Aplicar efectos de inventario según la transición
        if (estadoAnterior == EstadoTransferencia.PENDIENTE && nuevoEstado == EstadoTransferencia.EN_TRANSITO) {
            aplicarSalidaOrigen(tiendaId, transferencia, items);
        }
        if (estadoAnterior == EstadoTransferencia.EN_TRANSITO && nuevoEstado == EstadoTransferencia.RECIBIDO) {
            aplicarEntradaDestino(tiendaId, transferencia, items);
        }
        if (estadoAnterior == EstadoTransferencia.EN_TRANSITO && nuevoEstado == EstadoTransferencia.CANCELADO) {
            revertirSalidaOrigen(tiendaId, transferencia, items);
        }

        transferencia.setEstado(nuevoEstado);

        switch (nuevoEstado) {
            case PENDIENTE:
                // No se actualiza ninguna fecha adicional
                break;
            case EN_TRANSITO:
                transferencia.setFechaEnvio(LocalDateTime.now());
                break;
            case RECIBIDO:
                transferencia.setFechaRecepcion(LocalDateTime.now());
                break;
            case CANCELADO:
                // No se actualiza ninguna fecha adicional
                break;
        }

        TransferenciaInventario actualizado = repository.save(transferencia);
        return toResponse(actualizado);
    }

    private void aplicarSalidaOrigen(Long tiendaId, TransferenciaInventario transferencia, List<ItemTransferencia> items) {
        if (items == null || items.isEmpty()) {
            return;
        }

        Long sedeOrigenId = transferencia.getSedeOrigenId();

        for (ItemTransferencia item : items) {
            if (item.getProductoId() != null) {
                Integer cantidad = convertirCantidadProducto(item.getCantidadEnviada());
                InventarioProducto inventario = inventarioProductoRepository
                        .findBySedeIdAndProductoId(sedeOrigenId, item.getProductoId())
                        .orElseGet(() -> {
                            InventarioProducto nuevo = new InventarioProducto();
                            nuevo.setTiendaId(tiendaId);
                            nuevo.setSedeId(sedeOrigenId);
                            nuevo.setProductoId(item.getProductoId());
                            nuevo.setCantidadActual(0);
                            return inventarioProductoRepository.save(nuevo);
                        });

                Integer anterior = inventario.getCantidadActual();
                Integer posterior = anterior - cantidad;
                if (posterior < 0) {
                    throw new BadRequestException(
                            "No hay suficiente stock para enviar el producto (ID " + item.getProductoId() + "). Stock actual: " + anterior);
                }
                inventario.setCantidadActual(posterior);
                inventarioProductoRepository.save(inventario);

                registrarMovimientoProducto(tiendaId, sedeOrigenId, item.getProductoId(), TipoMovimientoInsumo.SALIDA,
                        cantidad, anterior, posterior);
            }

            if (item.getInsumoId() != null) {
                BigDecimal cantidad = item.getCantidadEnviada();
                if (cantidad == null || cantidad.compareTo(BigDecimal.ZERO) <= 0) {
                    throw new BadRequestException("La cantidad enviada del insumo es inválida");
                }

                InventarioInsumoSede inventario = inventarioInsumoSedeRepository
                        .findBySedeIdAndInsumoId(sedeOrigenId, item.getInsumoId())
                        .orElseGet(() -> {
                            InventarioInsumoSede nuevo = new InventarioInsumoSede();
                            nuevo.setTiendaId(tiendaId);
                            nuevo.setSedeId(sedeOrigenId);
                            nuevo.setInsumoId(item.getInsumoId());
                            nuevo.setCantidadActual(BigDecimal.ZERO);
                            return inventarioInsumoSedeRepository.save(nuevo);
                        });

                BigDecimal anterior = inventario.getCantidadActual();
                BigDecimal posterior = anterior.subtract(cantidad);
                if (posterior.compareTo(BigDecimal.ZERO) < 0) {
                    throw new BadRequestException(
                            "No hay suficiente stock para enviar el insumo (ID " + item.getInsumoId() + "). Stock actual: " + anterior);
                }
                inventario.setCantidadActual(posterior);
                inventarioInsumoSedeRepository.save(inventario);

                registrarMovimientoInsumo(tiendaId, sedeOrigenId, item.getInsumoId(), TipoMovimientoInsumo.SALIDA,
                        cantidad, anterior, posterior, transferencia.getId(), "Transferencia #" + transferencia.getId() + " (salida)");
            }
        }
    }

    private void aplicarEntradaDestino(Long tiendaId, TransferenciaInventario transferencia, List<ItemTransferencia> items) {
        if (items == null || items.isEmpty()) {
            return;
        }

        Long sedeDestinoId = transferencia.getSedeDestinoId();

        for (ItemTransferencia item : items) {
            BigDecimal cantidadRecibida = item.getCantidadRecibida();
            if (cantidadRecibida == null) {
                cantidadRecibida = item.getCantidadEnviada();
                item.setCantidadRecibida(cantidadRecibida);
                itemRepository.save(item);
            }

            if (item.getProductoId() != null) {
                Integer cantidad = convertirCantidadProducto(cantidadRecibida);
                InventarioProducto inventario = inventarioProductoRepository
                        .findBySedeIdAndProductoId(sedeDestinoId, item.getProductoId())
                        .orElseGet(() -> {
                            InventarioProducto nuevo = new InventarioProducto();
                            nuevo.setTiendaId(tiendaId);
                            nuevo.setSedeId(sedeDestinoId);
                            nuevo.setProductoId(item.getProductoId());
                            nuevo.setCantidadActual(0);
                            return inventarioProductoRepository.save(nuevo);
                        });

                Integer anterior = inventario.getCantidadActual();
                Integer posterior = anterior + cantidad;
                inventario.setCantidadActual(posterior);
                inventarioProductoRepository.save(inventario);

                registrarMovimientoProducto(tiendaId, sedeDestinoId, item.getProductoId(), TipoMovimientoInsumo.ENTRADA,
                        cantidad, anterior, posterior);
            }

            if (item.getInsumoId() != null) {
                BigDecimal cantidad = cantidadRecibida;
                if (cantidad == null || cantidad.compareTo(BigDecimal.ZERO) <= 0) {
                    throw new BadRequestException("La cantidad recibida del insumo es inválida");
                }

                InventarioInsumoSede inventario = inventarioInsumoSedeRepository
                        .findBySedeIdAndInsumoId(sedeDestinoId, item.getInsumoId())
                        .orElseGet(() -> {
                            InventarioInsumoSede nuevo = new InventarioInsumoSede();
                            nuevo.setTiendaId(tiendaId);
                            nuevo.setSedeId(sedeDestinoId);
                            nuevo.setInsumoId(item.getInsumoId());
                            nuevo.setCantidadActual(BigDecimal.ZERO);
                            return inventarioInsumoSedeRepository.save(nuevo);
                        });

                BigDecimal anterior = inventario.getCantidadActual();
                BigDecimal posterior = anterior.add(cantidad);
                inventario.setCantidadActual(posterior);
                inventarioInsumoSedeRepository.save(inventario);

                registrarMovimientoInsumo(tiendaId, sedeDestinoId, item.getInsumoId(), TipoMovimientoInsumo.ENTRADA,
                        cantidad, anterior, posterior, transferencia.getId(), "Transferencia #" + transferencia.getId() + " (entrada)");
            }
        }
    }

    private void revertirSalidaOrigen(Long tiendaId, TransferenciaInventario transferencia, List<ItemTransferencia> items) {
        if (items == null || items.isEmpty()) {
            return;
        }

        Long sedeOrigenId = transferencia.getSedeOrigenId();

        for (ItemTransferencia item : items) {
            if (item.getProductoId() != null) {
                Integer cantidad = convertirCantidadProducto(item.getCantidadEnviada());
                InventarioProducto inventario = inventarioProductoRepository
                        .findBySedeIdAndProductoId(sedeOrigenId, item.getProductoId())
                        .orElseGet(() -> {
                            InventarioProducto nuevo = new InventarioProducto();
                            nuevo.setTiendaId(tiendaId);
                            nuevo.setSedeId(sedeOrigenId);
                            nuevo.setProductoId(item.getProductoId());
                            nuevo.setCantidadActual(0);
                            return inventarioProductoRepository.save(nuevo);
                        });

                Integer anterior = inventario.getCantidadActual();
                Integer posterior = anterior + cantidad;
                inventario.setCantidadActual(posterior);
                inventarioProductoRepository.save(inventario);

                registrarMovimientoProducto(tiendaId, sedeOrigenId, item.getProductoId(), TipoMovimientoInsumo.ENTRADA,
                        cantidad, anterior, posterior);
            }

            if (item.getInsumoId() != null) {
                BigDecimal cantidad = item.getCantidadEnviada();
                if (cantidad == null || cantidad.compareTo(BigDecimal.ZERO) <= 0) {
                    throw new BadRequestException("La cantidad enviada del insumo es inválida");
                }

                InventarioInsumoSede inventario = inventarioInsumoSedeRepository
                        .findBySedeIdAndInsumoId(sedeOrigenId, item.getInsumoId())
                        .orElseGet(() -> {
                            InventarioInsumoSede nuevo = new InventarioInsumoSede();
                            nuevo.setTiendaId(tiendaId);
                            nuevo.setSedeId(sedeOrigenId);
                            nuevo.setInsumoId(item.getInsumoId());
                            nuevo.setCantidadActual(BigDecimal.ZERO);
                            return inventarioInsumoSedeRepository.save(nuevo);
                        });

                BigDecimal anterior = inventario.getCantidadActual();
                BigDecimal posterior = anterior.add(cantidad);
                inventario.setCantidadActual(posterior);
                inventarioInsumoSedeRepository.save(inventario);

                registrarMovimientoInsumo(tiendaId, sedeOrigenId, item.getInsumoId(), TipoMovimientoInsumo.ENTRADA,
                        cantidad, anterior, posterior, transferencia.getId(), "Transferencia #" + transferencia.getId() + " (reverso cancelación)");
            }
        }
    }

    private Integer convertirCantidadProducto(BigDecimal cantidad) {
        if (cantidad == null) {
            throw new BadRequestException("La cantidad del producto es requerida");
        }
        if (cantidad.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("La cantidad del producto debe ser mayor a 0");
        }

        BigDecimal normalizada = cantidad.stripTrailingZeros();
        if (normalizada.scale() > 0) {
            throw new BadRequestException("La cantidad del producto debe ser un entero (sin decimales)");
        }

        try {
            return normalizada.intValueExact();
        } catch (ArithmeticException ex) {
            throw new BadRequestException("La cantidad del producto está fuera de rango");
        }
    }

    private void registrarMovimientoProducto(Long tiendaId, Long sedeId, Long productoId, TipoMovimientoInsumo tipo,
            Integer cantidad, Integer anterior, Integer posterior) {
        MovimientoInventarioProducto movimiento = new MovimientoInventarioProducto();
        movimiento.setTiendaId(tiendaId);
        movimiento.setSedeId(sedeId);
        movimiento.setProductoId(productoId);
        movimiento.setTipoMovimiento(tipo);
        movimiento.setCantidad(cantidad);
        movimiento.setCantidadAnterior(anterior);
        movimiento.setCantidadPosterior(posterior);
        movimiento.setMotivo(MotivoMovimientoProducto.TRANSFERENCIA);
        movimientoInventarioProductoRepository.save(movimiento);
    }

    private void registrarMovimientoInsumo(Long tiendaId, Long sedeId, Long insumoId, TipoMovimientoInsumo tipo,
            BigDecimal cantidad, BigDecimal anterior, BigDecimal posterior, Long transferenciaId, String motivo) {
        MovimientoInventarioInsumo movimiento = new MovimientoInventarioInsumo();
        movimiento.setTiendaId(tiendaId);
        movimiento.setSedeId(sedeId);
        movimiento.setInsumoId(insumoId);
        movimiento.setTipoMovimiento(tipo);
        movimiento.setCantidad(cantidad);
        movimiento.setCantidadAnterior(anterior);
        movimiento.setCantidadPosterior(posterior);
        movimiento.setTransferenciaId(transferenciaId);
        movimiento.setMotivo(motivo);
        movimientoInventarioInsumoRepository.save(movimiento);
    }

    @Override
    @Transactional
    @SuppressWarnings("null")
    public void eliminar(Long tiendaId, Long id) {
        final TransferenciaInventario transferencia = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Transferencia no encontrada"));

        // Soft delete - cambia estado a CANCELADO
        repository.delete(transferencia);
    }

    @Override
    @Transactional
    public TransferenciaInventarioResponse recibir(Long tiendaId, Long id, TransferenciaRecepcionRequest request) {
        TransferenciaInventario transferencia = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Transferencia no encontrada"));

        if (transferencia.getEstado() != EstadoTransferencia.EN_TRANSITO) {
            throw new BadRequestException("Solo se pueden recibir transferencias en estado EN_TRANSITO");
        }

        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Debe incluir al menos un item para recibir");
        }

        List<ItemTransferencia> items = itemRepository.findByTransferenciaId(id);
        Map<Long, ItemTransferencia> itemsById = new HashMap<>();
        for (ItemTransferencia it : items) {
            if (it.getId() != null) {
                itemsById.put(it.getId(), it);
            }
        }

        for (ItemTransferenciaRecepcionRequest itemReq : request.getItems()) {
            ItemTransferencia item = itemsById.get(itemReq.getItemId());
            if (item == null) {
                throw new BadRequestException("El itemId " + itemReq.getItemId() + " no pertenece a la transferencia");
            }

            BigDecimal recibida = itemReq.getCantidadRecibida();
            if (recibida == null || recibida.compareTo(BigDecimal.ZERO) <= 0) {
                throw new BadRequestException("La cantidad recibida debe ser mayor a 0");
            }

            if (item.getCantidadEnviada() != null && recibida.compareTo(item.getCantidadEnviada()) > 0) {
                throw new BadRequestException("La cantidad recibida no puede superar la enviada");
            }

            // Para productos, la cantidad debe ser entera
            if (item.getProductoId() != null) {
                BigDecimal normalized = recibida.stripTrailingZeros();
                if (normalized.scale() > 0) {
                    throw new BadRequestException("Para productos, la cantidad recibida debe ser un entero");
                }
            }

            item.setCantidadRecibida(recibida);
            itemRepository.save(item);
        }

        if (request.getRecibidoPor() != null) {
            transferencia.setRecibidoPor(request.getRecibidoPor());
            repository.save(transferencia);
        }

        return cambiarEstado(tiendaId, id, EstadoTransferencia.RECIBIDO);
    }

    private void validarTransicionEstado(EstadoTransferencia estadoActual, EstadoTransferencia nuevoEstado) {
        boolean transicionValida = false;

        switch (estadoActual) {
            case PENDIENTE:
                transicionValida = nuevoEstado == EstadoTransferencia.EN_TRANSITO ||
                        nuevoEstado == EstadoTransferencia.CANCELADO;
                break;
            case EN_TRANSITO:
                transicionValida = nuevoEstado == EstadoTransferencia.RECIBIDO ||
                        nuevoEstado == EstadoTransferencia.CANCELADO;
                break;
            case RECIBIDO:
            case CANCELADO:
                transicionValida = false; // Estados finales
                break;
        }

        if (!transicionValida) {
            throw new BadRequestException(
                    String.format("No se puede cambiar de estado %s a %s", estadoActual, nuevoEstado));
        }
    }

    private TransferenciaInventarioResponse toResponse(TransferenciaInventario entity) {
        List<ItemTransferenciaResponse> items = itemRepository.findByTransferenciaId(entity.getId()).stream()
                .map(this::itemToResponse)
                .toList();

        return TransferenciaInventarioResponse.builder()
                .id(entity.getId())
                .sedeOrigenId(entity.getSedeOrigenId())
                .sedeDestinoId(entity.getSedeDestinoId())
                .estado(entity.getEstado())
                .solicitadoPor(entity.getSolicitadoPor())
                .autorizadoPor(entity.getAutorizadoPor())
                .recibidoPor(entity.getRecibidoPor())
                .fechaSolicitud(entity.getFechaSolicitud())
                .fechaEnvio(entity.getFechaEnvio())
                .fechaRecepcion(entity.getFechaRecepcion())
                .observaciones(entity.getObservaciones())
                .items(items)
                .build();
    }

    private ItemTransferenciaResponse itemToResponse(ItemTransferencia entity) {
        return ItemTransferenciaResponse.builder()
                .id(entity.getId())
                .transferenciaId(entity.getTransferenciaId())
                .insumoId(entity.getInsumoId())
                .productoId(entity.getProductoId())
                .cantidadEnviada(entity.getCantidadEnviada())
                .cantidadRecibida(entity.getCantidadRecibida())
                .build();
    }
}
