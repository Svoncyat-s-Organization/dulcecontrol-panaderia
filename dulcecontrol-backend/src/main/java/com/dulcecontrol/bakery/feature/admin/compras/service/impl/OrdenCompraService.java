package com.dulcecontrol.bakery.feature.admin.compras.service.impl;

import com.dulcecontrol.bakery.feature.admin.compras.controller.dto.*;
import com.dulcecontrol.bakery.feature.admin.compras.entity.DetalleOrdenCompra;
import com.dulcecontrol.bakery.feature.admin.compras.entity.OrdenCompra;
import com.dulcecontrol.bakery.feature.admin.compras.entity.enums.EstadoOrdenCompra;
import com.dulcecontrol.bakery.feature.admin.compras.repository.DetalleOrdenCompraRepository;
import com.dulcecontrol.bakery.feature.admin.compras.repository.OrdenCompraRepository;
import com.dulcecontrol.bakery.feature.admin.compras.service.IOrdenCompraService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrdenCompraService implements IOrdenCompraService {

    private final OrdenCompraRepository ordenCompraRepository;
    private final DetalleOrdenCompraRepository detalleOrdenCompraRepository;

    @Override
    @Transactional(readOnly = true)
    public List<OrdenCompraResponse> listarPorTienda(Long tiendaId) {
        return ordenCompraRepository.findByTiendaId(tiendaId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrdenCompraResponse> listarPorTiendaYEstado(Long tiendaId, EstadoOrdenCompra estado) {
        return ordenCompraRepository.findByTiendaIdAndEstado(tiendaId, estado)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrdenCompraResponse> listarPorSede(Long sedeId) {
        return ordenCompraRepository.findBySedeDestino(sedeId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrdenCompraResponse> listarPorProveedor(Long proveedorId) {
        return ordenCompraRepository.findByProveedor(proveedorId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrdenCompraResponse> listarOrdenesPendientes(Long sedeId) {
        List<EstadoOrdenCompra> estadosPendientes = List.of(
                EstadoOrdenCompra.ENVIADA,
                EstadoOrdenCompra.RECIBIDA_PARCIAL);
        return ordenCompraRepository.findOrdenesPendientesPorSede(sedeId, estadosPendientes, LocalDate.now())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrdenCompraResponse> listarPorFechas(Long tiendaId, LocalDate fechaInicio, LocalDate fechaFin) {
        return ordenCompraRepository.findByTiendaIdAndFechaEmisionBetween(tiendaId, fechaInicio, fechaFin)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OrdenCompraResponse obtenerPorId(Long tiendaId, Long ordenCompraId) {
        OrdenCompra orden = ordenCompraRepository.findByIdAndTiendaId(ordenCompraId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Orden de compra no encontrada"));
        return toResponse(orden);
    }

    @Override
    @Transactional
    public OrdenCompraResponse crear(OrdenCompraCreateRequest request) {
        OrdenCompra orden = new OrdenCompra();
        orden.setTiendaId(request.getTiendaId());
        orden.setSedeDestinoId(request.getSedeDestinoId());
        orden.setProveedorId(request.getProveedorId());
        orden.setFechaEmision(request.getFechaEmision());
        orden.setFechaRecepcionEsperada(request.getFechaRecepcionEsperada());
        orden.setEstado(request.getEstado() != null ? request.getEstado() : EstadoOrdenCompra.BORRADOR);
        orden.setMoneda(request.getMoneda() != null ? request.getMoneda() : "PEN");
        orden.setMetodoPago(request.getMetodoPago());
        orden.setReferenciaPago(request.getReferenciaPago());
        orden.setTipoComprobanteProveedor(request.getTipoComprobanteProveedor());
        orden.setSerieComprobanteProveedor(request.getSerieComprobanteProveedor());
        orden.setNumeroComprobanteProveedor(request.getNumeroComprobanteProveedor());
        orden.setUrlFotoComprobante(request.getUrlFotoComprobante());
        orden.setObservaciones(request.getObservaciones());
        orden.setRegistradoPor(request.getRegistradoPor());

        // Calcular total
        Long totalCentimos = calcularTotal(request.getDetalles());
        orden.setTotalCompraCentimos(totalCentimos);

        OrdenCompra guardada = ordenCompraRepository.save(orden);

        // Guardar detalles
        for (DetalleOrdenCompraRequest detalle : request.getDetalles()) {
            DetalleOrdenCompra detalleEntity = new DetalleOrdenCompra();
            detalleEntity.setOrdenCompraId(guardada.getId());
            detalleEntity.setInsumoId(detalle.getInsumoId());
            detalleEntity.setCantidadSolicitada(detalle.getCantidadSolicitada());
            detalleEntity.setUnidadCompra(detalle.getUnidadCompra());
            detalleEntity.setCostoUnitarioPactadoCentimos(detalle.getCostoUnitarioPactadoCentimos());

            Long totalLinea = calcularTotalLinea(
                    detalle.getCantidadSolicitada(),
                    detalle.getCostoUnitarioPactadoCentimos());
            detalleEntity.setTotalLineaCentimos(totalLinea);
            detalleEntity.setCantidadRecibida(detalle.getCantidadRecibida());
            detalleEntity.setRecibidoCompleto(detalle.getRecibidoCompleto());

            detalleOrdenCompraRepository.save(detalleEntity);
        }

        return toResponse(guardada);
    }

    @Override
    @Transactional
    public OrdenCompraResponse actualizar(Long tiendaId, Long ordenCompraId, OrdenCompraUpdateRequest request) {
        OrdenCompra orden = ordenCompraRepository.findByIdAndTiendaId(ordenCompraId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Orden de compra no encontrada"));

        orden.setSedeDestinoId(request.getSedeDestinoId());
        orden.setProveedorId(request.getProveedorId());

        if (request.getFechaEmision() != null) {
            orden.setFechaEmision(request.getFechaEmision());
        }
        if (request.getFechaRecepcionEsperada() != null) {
            orden.setFechaRecepcionEsperada(request.getFechaRecepcionEsperada());
        }
        if (request.getFechaRecepcionReal() != null) {
            orden.setFechaRecepcionReal(request.getFechaRecepcionReal());
        }
        if (request.getEstado() != null) {
            orden.setEstado(request.getEstado());
        }
        if (request.getMoneda() != null) {
            orden.setMoneda(request.getMoneda());
        }

        orden.setMetodoPago(request.getMetodoPago());
        orden.setReferenciaPago(request.getReferenciaPago());
        orden.setTipoComprobanteProveedor(request.getTipoComprobanteProveedor());
        orden.setSerieComprobanteProveedor(request.getSerieComprobanteProveedor());
        orden.setNumeroComprobanteProveedor(request.getNumeroComprobanteProveedor());
        orden.setUrlFotoComprobante(request.getUrlFotoComprobante());
        orden.setObservaciones(request.getObservaciones());

        // Actualizar detalles si se proporcionan
        if (request.getDetalles() != null && !request.getDetalles().isEmpty()) {
            // Eliminar detalles existentes
            detalleOrdenCompraRepository.deleteByOrdenCompraId(ordenCompraId);

            // Crear nuevos detalles
            for (DetalleOrdenCompraRequest detalle : request.getDetalles()) {
                DetalleOrdenCompra detalleEntity = new DetalleOrdenCompra();
                detalleEntity.setOrdenCompraId(orden.getId());
                detalleEntity.setInsumoId(detalle.getInsumoId());
                detalleEntity.setCantidadSolicitada(detalle.getCantidadSolicitada());
                detalleEntity.setUnidadCompra(detalle.getUnidadCompra());
                detalleEntity.setCostoUnitarioPactadoCentimos(detalle.getCostoUnitarioPactadoCentimos());

                Long totalLinea = calcularTotalLinea(
                        detalle.getCantidadSolicitada(),
                        detalle.getCostoUnitarioPactadoCentimos());
                detalleEntity.setTotalLineaCentimos(totalLinea);
                detalleEntity.setCantidadRecibida(detalle.getCantidadRecibida());
                detalleEntity.setRecibidoCompleto(detalle.getRecibidoCompleto());

                detalleOrdenCompraRepository.save(detalleEntity);
            }

            // Recalcular total
            Long totalCentimos = calcularTotal(request.getDetalles());
            orden.setTotalCompraCentimos(totalCentimos);
        }

        OrdenCompra actualizada = ordenCompraRepository.save(orden);
        return toResponse(actualizada);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long ordenCompraId) {
        OrdenCompra orden = ordenCompraRepository.findByIdAndTiendaId(ordenCompraId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Orden de compra no encontrada"));

        // Solo se pueden eliminar órdenes en estado borrador
        if (orden.getEstado() != EstadoOrdenCompra.BORRADOR) {
            throw new BadRequestException("Solo se pueden eliminar órdenes en estado borrador");
        }

        // Eliminar detalles
        detalleOrdenCompraRepository.deleteByOrdenCompraId(ordenCompraId);

        // Eliminar orden
        ordenCompraRepository.delete(orden);
    }

    @Override
    @Transactional
    public OrdenCompraResponse cambiarEstado(Long tiendaId, Long ordenCompraId, EstadoOrdenCompra nuevoEstado) {
        OrdenCompra orden = ordenCompraRepository.findByIdAndTiendaId(ordenCompraId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Orden de compra no encontrada"));

        // Validar transiciones de estado
        validarCambioEstado(orden.getEstado(), nuevoEstado);

        orden.setEstado(nuevoEstado);

        // Si se marca como recibida total, actualizar fecha de recepción real
        if (nuevoEstado == EstadoOrdenCompra.RECIBIDA_TOTAL && orden.getFechaRecepcionReal() == null) {
            orden.setFechaRecepcionReal(LocalDate.now());
        }

        OrdenCompra actualizada = ordenCompraRepository.save(orden);
        return toResponse(actualizada);
    }

    private void validarCambioEstado(EstadoOrdenCompra estadoActual, EstadoOrdenCompra nuevoEstado) {
        // Lógica de validación de transiciones de estado
        if (estadoActual == EstadoOrdenCompra.CANCELADA) {
            throw new BadRequestException("No se puede cambiar el estado de una orden cancelada");
        }

        if (estadoActual == EstadoOrdenCompra.RECIBIDA_TOTAL && nuevoEstado != EstadoOrdenCompra.CANCELADA) {
            throw new BadRequestException("No se puede cambiar el estado de una orden ya recibida totalmente");
        }
    }

    private Long calcularTotal(List<DetalleOrdenCompraRequest> detalles) {
        return detalles.stream()
                .mapToLong(detalle -> calcularTotalLinea(
                        detalle.getCantidadSolicitada(),
                        detalle.getCostoUnitarioPactadoCentimos()))
                .sum();
    }

    private Long calcularTotalLinea(BigDecimal cantidad, Long costoUnitarioCentimos) {
        return cantidad.multiply(new BigDecimal(costoUnitarioCentimos)).longValue();
    }

    private OrdenCompraResponse toResponse(OrdenCompra orden) {
        List<DetalleOrdenCompra> detalles = detalleOrdenCompraRepository.findByOrdenCompraId(orden.getId());

        return OrdenCompraResponse.builder()
                .id(orden.getId())
                .tiendaId(orden.getTiendaId())
                .sedeDestinoId(orden.getSedeDestinoId())
                .proveedorId(orden.getProveedorId())
                .fechaEmision(orden.getFechaEmision())
                .fechaRecepcionEsperada(orden.getFechaRecepcionEsperada())
                .fechaRecepcionReal(orden.getFechaRecepcionReal())
                .estado(orden.getEstado())
                .moneda(orden.getMoneda())
                .totalCompraCentimos(orden.getTotalCompraCentimos())
                .metodoPago(orden.getMetodoPago())
                .referenciaPago(orden.getReferenciaPago())
                .tipoComprobanteProveedor(orden.getTipoComprobanteProveedor())
                .serieComprobanteProveedor(orden.getSerieComprobanteProveedor())
                .numeroComprobanteProveedor(orden.getNumeroComprobanteProveedor())
                .urlFotoComprobante(orden.getUrlFotoComprobante())
                .observaciones(orden.getObservaciones())
                .registradoPor(orden.getRegistradoPor())
                .creadoEn(orden.getCreadoEn())
                .actualizadoEn(orden.getActualizadoEn())
                .detalles(detalles.stream().map(this::toDetalleResponse).collect(Collectors.toList()))
                .build();
    }

    private DetalleOrdenCompraResponse toDetalleResponse(DetalleOrdenCompra detalle) {
        return DetalleOrdenCompraResponse.builder()
                .id(detalle.getId())
                .ordenCompraId(detalle.getOrdenCompraId())
                .insumoId(detalle.getInsumoId())
                .cantidadSolicitada(detalle.getCantidadSolicitada())
                .unidadCompra(detalle.getUnidadCompra())
                .costoUnitarioPactadoCentimos(detalle.getCostoUnitarioPactadoCentimos())
                .totalLineaCentimos(detalle.getTotalLineaCentimos())
                .cantidadRecibida(detalle.getCantidadRecibida())
                .recibidoCompleto(detalle.getRecibidoCompleto())
                .build();
    }
}
