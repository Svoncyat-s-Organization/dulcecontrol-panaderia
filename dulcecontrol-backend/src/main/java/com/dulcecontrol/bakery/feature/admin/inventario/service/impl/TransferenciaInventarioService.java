package com.dulcecontrol.bakery.feature.admin.inventario.service.impl;

import com.dulcecontrol.bakery.feature.admin.inventario.controller.dto.ItemTransferenciaDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.controller.dto.TransferenciaInventarioDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.ItemTransferencia;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.TransferenciaInventario;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.EstadoTransferencia;
import com.dulcecontrol.bakery.feature.admin.inventario.repository.ItemTransferenciaRepository;
import com.dulcecontrol.bakery.feature.admin.inventario.repository.TransferenciaInventarioRepository;
import com.dulcecontrol.bakery.feature.admin.inventario.service.ITransferenciaInventarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransferenciaInventarioService implements ITransferenciaInventarioService {

    private final TransferenciaInventarioRepository repository;
    private final ItemTransferenciaRepository itemRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TransferenciaInventarioDTO> obtenerTodas() {
        return repository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TransferenciaInventarioDTO obtenerPorId(Long id) {
        return repository.findById(id)
                .map(this::convertirADTO)
                .orElseThrow(() -> new RuntimeException("Transferencia no encontrada con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransferenciaInventarioDTO> obtenerPorTienda(Long tiendaId) {
        return repository.findByTiendaId(tiendaId).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransferenciaInventarioDTO> obtenerPorSede(Long sedeId) {
        return repository.findBySedeOrigenIdOrSedeDestinoId(sedeId).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransferenciaInventarioDTO> obtenerPorEstado(EstadoTransferencia estado) {
        return repository.findByEstado(estado).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TransferenciaInventarioDTO crear(TransferenciaInventarioDTO dto) {
        TransferenciaInventario entidad = convertirAEntidad(dto);
        TransferenciaInventario guardada = repository.save(entidad);

        // Guardar items si existen
        if (dto.getItems() != null && !dto.getItems().isEmpty()) {
            for (ItemTransferenciaDTO itemDTO : dto.getItems()) {
                ItemTransferencia item = convertirItemAEntidad(itemDTO);
                item.setTransferenciaId(guardada.getId());
                itemRepository.save(item);
            }
        }

        return convertirADTO(guardada);
    }

    @Override
    @Transactional
    public TransferenciaInventarioDTO actualizar(Long id, TransferenciaInventarioDTO dto) {
        TransferenciaInventario entidad = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transferencia no encontrada con ID: " + id));

        if (dto.getObservaciones() != null) {
            entidad.setObservaciones(dto.getObservaciones());
        }
        if (dto.getEstado() != null) {
            entidad.setEstado(dto.getEstado());
        }

        TransferenciaInventario actualizada = repository.save(entidad);
        return convertirADTO(actualizada);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Transferencia no encontrada con ID: " + id);
        }
        repository.deleteById(id); // Esto ejecutará el soft delete
    }

    @Override
    @Transactional
    public TransferenciaInventarioDTO cambiarEstado(Long id, EstadoTransferencia nuevoEstado) {
        TransferenciaInventario transferencia = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transferencia no encontrada con ID: " + id));

        transferencia.setEstado(nuevoEstado);

        if (nuevoEstado == EstadoTransferencia.en_transito && transferencia.getFechaEnvio() == null) {
            transferencia.setFechaEnvio(LocalDateTime.now());
        } else if (nuevoEstado == EstadoTransferencia.recibido && transferencia.getFechaRecepcion() == null) {
            transferencia.setFechaRecepcion(LocalDateTime.now());
        }

        TransferenciaInventario actualizada = repository.save(transferencia);
        return convertirADTO(actualizada);
    }

    @Override
    @Transactional
    public TransferenciaInventarioDTO autorizarTransferencia(Long id, Long autorizadoPor) {
        TransferenciaInventario transferencia = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transferencia no encontrada con ID: " + id));

        transferencia.setAutorizadoPor(autorizadoPor);
        transferencia.setEstado(EstadoTransferencia.en_transito);
        transferencia.setFechaEnvio(LocalDateTime.now());

        TransferenciaInventario actualizada = repository.save(transferencia);
        return convertirADTO(actualizada);
    }

    @Override
    @Transactional
    public TransferenciaInventarioDTO recibirTransferencia(Long id, Long recibidoPor) {
        TransferenciaInventario transferencia = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transferencia no encontrada con ID: " + id));

        transferencia.setRecibidoPor(recibidoPor);
        transferencia.setEstado(EstadoTransferencia.recibido);
        transferencia.setFechaRecepcion(LocalDateTime.now());

        TransferenciaInventario actualizada = repository.save(transferencia);
        return convertirADTO(actualizada);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransferenciaInventarioDTO> obtenerPorRangoFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        return repository.findByFechaSolicitudBetween(fechaInicio, fechaFin).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    private TransferenciaInventarioDTO convertirADTO(TransferenciaInventario entidad) {
        TransferenciaInventarioDTO dto = new TransferenciaInventarioDTO();
        dto.setId(entidad.getId());
        dto.setTiendaId(entidad.getTiendaId());
        dto.setSedeOrigenId(entidad.getSedeOrigenId());
        dto.setSedeDestinoId(entidad.getSedeDestinoId());
        dto.setEstado(entidad.getEstado());
        dto.setSolicitadoPor(entidad.getSolicitadoPor());
        dto.setAutorizadoPor(entidad.getAutorizadoPor());
        dto.setRecibidoPor(entidad.getRecibidoPor());
        dto.setFechaSolicitud(entidad.getFechaSolicitud());
        dto.setFechaEnvio(entidad.getFechaEnvio());
        dto.setFechaRecepcion(entidad.getFechaRecepcion());
        dto.setObservaciones(entidad.getObservaciones());

        // Cargar items
        List<ItemTransferenciaDTO> items = itemRepository.findByTransferenciaId(entidad.getId()).stream()
                .map(this::convertirItemADTO)
                .collect(Collectors.toList());
        dto.setItems(items);

        return dto;
    }

    private TransferenciaInventario convertirAEntidad(TransferenciaInventarioDTO dto) {
        TransferenciaInventario entidad = new TransferenciaInventario();
        entidad.setId(dto.getId());
        entidad.setTiendaId(dto.getTiendaId());
        entidad.setSedeOrigenId(dto.getSedeOrigenId());
        entidad.setSedeDestinoId(dto.getSedeDestinoId());
        entidad.setEstado(dto.getEstado());
        entidad.setSolicitadoPor(dto.getSolicitadoPor());
        entidad.setAutorizadoPor(dto.getAutorizadoPor());
        entidad.setRecibidoPor(dto.getRecibidoPor());
        entidad.setFechaSolicitud(dto.getFechaSolicitud());
        entidad.setFechaEnvio(dto.getFechaEnvio());
        entidad.setFechaRecepcion(dto.getFechaRecepcion());
        entidad.setObservaciones(dto.getObservaciones());
        return entidad;
    }

    private ItemTransferenciaDTO convertirItemADTO(ItemTransferencia entidad) {
        ItemTransferenciaDTO dto = new ItemTransferenciaDTO();
        dto.setId(entidad.getId());
        dto.setTransferenciaId(entidad.getTransferenciaId());
        dto.setInsumoId(entidad.getInsumoId());
        dto.setProductoId(entidad.getProductoId());
        dto.setCantidadEnviada(entidad.getCantidadEnviada());
        dto.setCantidadRecibida(entidad.getCantidadRecibida());
        return dto;
    }

    private ItemTransferencia convertirItemAEntidad(ItemTransferenciaDTO dto) {
        ItemTransferencia entidad = new ItemTransferencia();
        entidad.setId(dto.getId());
        entidad.setTransferenciaId(dto.getTransferenciaId());
        entidad.setInsumoId(dto.getInsumoId());
        entidad.setProductoId(dto.getProductoId());
        entidad.setCantidadEnviada(dto.getCantidadEnviada());
        entidad.setCantidadRecibida(dto.getCantidadRecibida());
        return entidad;
    }
}
