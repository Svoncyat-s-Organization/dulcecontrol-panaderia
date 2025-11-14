package com.dulcecontrol.bakery.features.admin.inventario.service.impl;

import com.dulcecontrol.bakery.features.admin.inventario.dto.ItemTransferenciaCreateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.ItemTransferenciaResponse;
import com.dulcecontrol.bakery.features.admin.inventario.dto.TransferenciaInventarioCreateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.TransferenciaInventarioUpdateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.TransferenciaInventarioResponse;
import com.dulcecontrol.bakery.features.admin.inventario.entity.ItemTransferencia;
import com.dulcecontrol.bakery.features.admin.inventario.entity.TransferenciaInventario;
import com.dulcecontrol.bakery.features.admin.inventario.entity.enums.EstadoTransferencia;
import com.dulcecontrol.bakery.features.admin.inventario.repository.ItemTransferenciaRepository;
import com.dulcecontrol.bakery.features.admin.inventario.repository.TransferenciaInventarioRepository;
import com.dulcecontrol.bakery.features.admin.inventario.service.ITransferenciaInventarioService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransferenciaInventarioService implements ITransferenciaInventarioService {

    private final TransferenciaInventarioRepository repository;
    private final ItemTransferenciaRepository itemRepository;

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
        TransferenciaInventario transferencia = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Transferencia no encontrada"));

        // Validar transiciones de estado
        validarTransicionEstado(transferencia.getEstado(), nuevoEstado);

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

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long id) {
        TransferenciaInventario transferencia = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Transferencia no encontrada"));

        // Soft delete - cambia estado a CANCELADO
        repository.delete(transferencia);
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
