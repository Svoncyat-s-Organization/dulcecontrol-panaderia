package com.dulcecontrol.bakery.feature.admin.inventario.service.impl;

import com.dulcecontrol.bakery.feature.admin.inventario.controller.dto.MovimientoInventarioInsumoDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.MovimientoInventarioInsumo;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.TipoMovimientoInsumo;
import com.dulcecontrol.bakery.feature.admin.inventario.repository.MovimientoInventarioInsumoRepository;
import com.dulcecontrol.bakery.feature.admin.inventario.service.IMovimientoInventarioInsumoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovimientoInventarioInsumoService implements IMovimientoInventarioInsumoService {

    private final MovimientoInventarioInsumoRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioInsumoDTO> obtenerTodos() {
        return repository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public MovimientoInventarioInsumoDTO obtenerPorId(Long id) {
        return repository.findById(id)
                .map(this::convertirADTO)
                .orElseThrow(() -> new RuntimeException("Movimiento no encontrado con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioInsumoDTO> obtenerPorTienda(Long tiendaId) {
        return repository.findByTiendaId(tiendaId).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioInsumoDTO> obtenerPorSede(Long sedeId) {
        return repository.findBySedeId(sedeId).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioInsumoDTO> obtenerPorInsumo(Long insumoId) {
        return repository.findByInsumoId(insumoId).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioInsumoDTO> obtenerPorSedeEInsumo(Long sedeId, Long insumoId) {
        return repository.findBySedeIdAndInsumoIdOrderByCreadoEnDesc(sedeId, insumoId).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioInsumoDTO> obtenerPorTipoMovimiento(Long tiendaId,
            TipoMovimientoInsumo tipoMovimiento) {
        return repository.findByTiendaIdAndTipoMovimiento(tiendaId, tipoMovimiento).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MovimientoInventarioInsumoDTO crear(MovimientoInventarioInsumoDTO dto) {
        MovimientoInventarioInsumo entidad = convertirAEntidad(dto);
        MovimientoInventarioInsumo guardado = repository.save(entidad);
        return convertirADTO(guardado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoInventarioInsumoDTO> obtenerPorRangoFechas(LocalDateTime fechaInicio,
            LocalDateTime fechaFin) {
        return repository.findByFechaRango(fechaInicio, fechaFin).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    private MovimientoInventarioInsumoDTO convertirADTO(MovimientoInventarioInsumo entidad) {
        MovimientoInventarioInsumoDTO dto = new MovimientoInventarioInsumoDTO();
        dto.setId(entidad.getId());
        dto.setTiendaId(entidad.getTiendaId());
        dto.setSedeId(entidad.getSedeId());
        dto.setInsumoId(entidad.getInsumoId());
        dto.setTipoMovimiento(entidad.getTipoMovimiento());
        dto.setCantidad(entidad.getCantidad());
        dto.setCantidadAnterior(entidad.getCantidadAnterior());
        dto.setCantidadPosterior(entidad.getCantidadPosterior());
        dto.setOrdenCompraId(entidad.getOrdenCompraId());
        dto.setPlanProduccionId(entidad.getPlanProduccionId());
        dto.setTransferenciaId(entidad.getTransferenciaId());
        dto.setMotivo(entidad.getMotivo());
        dto.setResponsableId(entidad.getResponsableId());
        dto.setCreadoEn(entidad.getCreadoEn());
        return dto;
    }

    private MovimientoInventarioInsumo convertirAEntidad(MovimientoInventarioInsumoDTO dto) {
        MovimientoInventarioInsumo entidad = new MovimientoInventarioInsumo();
        entidad.setId(dto.getId());
        entidad.setTiendaId(dto.getTiendaId());
        entidad.setSedeId(dto.getSedeId());
        entidad.setInsumoId(dto.getInsumoId());
        entidad.setTipoMovimiento(dto.getTipoMovimiento());
        entidad.setCantidad(dto.getCantidad());
        entidad.setCantidadAnterior(dto.getCantidadAnterior());
        entidad.setCantidadPosterior(dto.getCantidadPosterior());
        entidad.setOrdenCompraId(dto.getOrdenCompraId());
        entidad.setPlanProduccionId(dto.getPlanProduccionId());
        entidad.setTransferenciaId(dto.getTransferenciaId());
        entidad.setMotivo(dto.getMotivo());
        entidad.setResponsableId(dto.getResponsableId());
        return entidad;
    }
}
