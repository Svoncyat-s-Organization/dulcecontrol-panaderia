package com.dulcecontrol.bakery.feature.admin.inventario.service.impl;

import com.dulcecontrol.bakery.feature.admin.inventario.controller.dto.MovimientoInventarioProductoDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.MovimientoInventarioProducto;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.MotivoMovimientoProducto;
import com.dulcecontrol.bakery.feature.admin.inventario.repository.MovimientoInventarioProductoRepository;
import com.dulcecontrol.bakery.feature.admin.inventario.service.IMovimientoInventarioProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovimientoInventarioProductoService implements IMovimientoInventarioProductoService {

    private final MovimientoInventarioProductoRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioProductoDTO> obtenerTodos() {
        return repository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public MovimientoInventarioProductoDTO obtenerPorId(Long id) {
        return repository.findById(id)
                .map(this::convertirADTO)
                .orElseThrow(() -> new RuntimeException("Movimiento no encontrado con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioProductoDTO> obtenerPorTienda(Long tiendaId) {
        return repository.findByTiendaId(tiendaId).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioProductoDTO> obtenerPorSede(Long sedeId) {
        return repository.findBySedeId(sedeId).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioProductoDTO> obtenerPorProducto(Long productoId) {
        return repository.findByProductoId(productoId).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioProductoDTO> obtenerPorSedeYProducto(Long sedeId, Long productoId) {
        return repository.findBySedeIdAndProductoIdOrderByCreadoEnDesc(sedeId, productoId).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioProductoDTO> obtenerPorMotivo(Long tiendaId, MotivoMovimientoProducto motivo) {
        return repository.findByTiendaIdAndMotivo(tiendaId, motivo).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MovimientoInventarioProductoDTO crear(MovimientoInventarioProductoDTO dto) {
        MovimientoInventarioProducto entidad = convertirAEntidad(dto);
        MovimientoInventarioProducto guardado = repository.save(entidad);
        return convertirADTO(guardado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioProductoDTO> obtenerPorRangoFechas(LocalDateTime fechaInicio,
            LocalDateTime fechaFin) {
        return repository.findByFechaRango(fechaInicio, fechaFin).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    private MovimientoInventarioProductoDTO convertirADTO(MovimientoInventarioProducto entidad) {
        MovimientoInventarioProductoDTO dto = new MovimientoInventarioProductoDTO();
        dto.setId(entidad.getId());
        dto.setTiendaId(entidad.getTiendaId());
        dto.setSedeId(entidad.getSedeId());
        dto.setProductoId(entidad.getProductoId());
        dto.setTipoMovimiento(entidad.getTipoMovimiento());
        dto.setCantidad(entidad.getCantidad());
        dto.setCantidadAnterior(entidad.getCantidadAnterior());
        dto.setCantidadPosterior(entidad.getCantidadPosterior());
        dto.setPedidoId(entidad.getPedidoId());
        dto.setPlanProduccionId(entidad.getPlanProduccionId());
        dto.setMotivo(entidad.getMotivo());
        dto.setResponsableId(entidad.getResponsableId());
        dto.setCreadoEn(entidad.getCreadoEn());
        return dto;
    }

    private MovimientoInventarioProducto convertirAEntidad(MovimientoInventarioProductoDTO dto) {
        MovimientoInventarioProducto entidad = new MovimientoInventarioProducto();
        entidad.setId(dto.getId());
        entidad.setTiendaId(dto.getTiendaId());
        entidad.setSedeId(dto.getSedeId());
        entidad.setProductoId(dto.getProductoId());
        entidad.setTipoMovimiento(dto.getTipoMovimiento());
        entidad.setCantidad(dto.getCantidad());
        entidad.setCantidadAnterior(dto.getCantidadAnterior());
        entidad.setCantidadPosterior(dto.getCantidadPosterior());
        entidad.setPedidoId(dto.getPedidoId());
        entidad.setPlanProduccionId(dto.getPlanProduccionId());
        entidad.setMotivo(dto.getMotivo());
        entidad.setResponsableId(dto.getResponsableId());
        return entidad;
    }
}
