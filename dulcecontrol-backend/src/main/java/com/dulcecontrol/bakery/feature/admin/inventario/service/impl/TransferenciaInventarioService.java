package com.dulcecontrol.bakery.feature.admin.inventario.service.impl;

import com.dulcecontrol.bakery.feature.admin.inventario.dto.ItemTransferenciaDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.dto.TransferenciaInventarioDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.ItemTransferencia;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.TransferenciaInventario;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.EstadoTransferencia;
import com.dulcecontrol.bakery.feature.admin.inventario.repository.ItemTransferenciaRepository;
import com.dulcecontrol.bakery.feature.admin.inventario.repository.TransferenciaInventarioRepository;
import com.dulcecontrol.bakery.feature.admin.inventario.service.ITransferenciaInventarioService;
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
    public List<TransferenciaInventarioDTO> listarPorTienda(Long tiendaId) {
        return repository.findByTiendaId(tiendaId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransferenciaInventarioDTO> listarPorEstado(Long tiendaId, EstadoTransferencia estado) {
        return repository.findByTiendaIdAndEstado(tiendaId, estado).stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TransferenciaInventarioDTO obtenerPorId(Long tiendaId, Long id) {
        TransferenciaInventario transferencia = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Transferencia no encontrada"));
        return toDTO(transferencia);
    }

    @Override
    @Transactional
    public TransferenciaInventarioDTO crear(Long tiendaId, TransferenciaInventarioDTO dto) {
        // Validar que las sedes sean diferentes
        if (dto.getSedeOrigenId().equals(dto.getSedeDestinoId())) {
            throw new BadRequestException("La sede de origen y destino deben ser diferentes");
        }

        TransferenciaInventario transferencia = new TransferenciaInventario();
        transferencia.setTiendaId(tiendaId);
        transferencia.setSedeOrigenId(dto.getSedeOrigenId());
        transferencia.setSedeDestinoId(dto.getSedeDestinoId());
        transferencia.setEstado(EstadoTransferencia.PENDIENTE);
        transferencia.setSolicitadoPor(dto.getSolicitadoPor());
        transferencia.setObservaciones(dto.getObservaciones());

        TransferenciaInventario guardado = repository.save(transferencia);

        // Guardar items
        if (dto.getItems() != null && !dto.getItems().isEmpty()) {
            for (ItemTransferenciaDTO itemDTO : dto.getItems()) {
                ItemTransferencia item = new ItemTransferencia();
                item.setTransferenciaId(guardado.getId());
                item.setInsumoId(itemDTO.getInsumoId());
                item.setProductoId(itemDTO.getProductoId());
                item.setCantidadEnviada(itemDTO.getCantidadEnviada());
                itemRepository.save(item);
            }
        }

        return toDTO(guardado);
    }

    @Override
    @Transactional
    public TransferenciaInventarioDTO actualizar(Long tiendaId, Long id, TransferenciaInventarioDTO dto) {
        TransferenciaInventario transferencia = repository.findByIdAndTiendaId(id, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Transferencia no encontrada"));

        // Solo se puede actualizar si está en estado PENDIENTE
        if (transferencia.getEstado() != EstadoTransferencia.PENDIENTE) {
            throw new BadRequestException("Solo se pueden actualizar transferencias en estado PENDIENTE");
        }

        transferencia.setSedeOrigenId(dto.getSedeOrigenId());
        transferencia.setSedeDestinoId(dto.getSedeDestinoId());
        transferencia.setObservaciones(dto.getObservaciones());

        TransferenciaInventario actualizado = repository.save(transferencia);

        // Actualizar items
        if (dto.getItems() != null) {
            itemRepository.deleteByTransferenciaId(id);
            for (ItemTransferenciaDTO itemDTO : dto.getItems()) {
                ItemTransferencia item = new ItemTransferencia();
                item.setTransferenciaId(actualizado.getId());
                item.setInsumoId(itemDTO.getInsumoId());
                item.setProductoId(itemDTO.getProductoId());
                item.setCantidadEnviada(itemDTO.getCantidadEnviada());
                itemRepository.save(item);
            }
        }

        return toDTO(actualizado);
    }

    @Override
    @Transactional
    public TransferenciaInventarioDTO cambiarEstado(Long tiendaId, Long id, EstadoTransferencia nuevoEstado) {
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
        return toDTO(actualizado);
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

    private TransferenciaInventarioDTO toDTO(TransferenciaInventario entity) {
        List<ItemTransferenciaDTO> items = itemRepository.findByTransferenciaId(entity.getId()).stream()
                .map(this::itemToDTO)
                .toList();

        return TransferenciaInventarioDTO.builder()
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

    private ItemTransferenciaDTO itemToDTO(ItemTransferencia entity) {
        return ItemTransferenciaDTO.builder()
                .id(entity.getId())
                .transferenciaId(entity.getTransferenciaId())
                .insumoId(entity.getInsumoId())
                .productoId(entity.getProductoId())
                .cantidadEnviada(entity.getCantidadEnviada())
                .cantidadRecibida(entity.getCantidadRecibida())
                .build();
    }
}
