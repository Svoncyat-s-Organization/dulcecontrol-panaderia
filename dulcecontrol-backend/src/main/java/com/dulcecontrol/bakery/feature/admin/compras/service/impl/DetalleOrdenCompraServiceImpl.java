package com.dulcecontrol.bakery.feature.admin.compras.service.impl;

import com.dulcecontrol.bakery.feature.admin.compras.controller.dto.DetalleOrdenCompraRequest;
import com.dulcecontrol.bakery.feature.admin.compras.controller.dto.DetalleOrdenCompraResponse;
import com.dulcecontrol.bakery.feature.admin.compras.entity.DetalleOrdenCompra;
import com.dulcecontrol.bakery.feature.admin.compras.entity.OrdenCompra;
import com.dulcecontrol.bakery.feature.admin.compras.repository.DetalleOrdenCompraRepository;
import com.dulcecontrol.bakery.feature.admin.compras.repository.OrdenCompraRepository;
import com.dulcecontrol.bakery.feature.admin.compras.service.IDetalleOrdenCompraService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DetalleOrdenCompraServiceImpl implements IDetalleOrdenCompraService {

    private final DetalleOrdenCompraRepository detalleOrdenCompraRepository;
    private final OrdenCompraRepository ordenCompraRepository;

    @Override
    @Transactional(readOnly = true)
    public DetalleOrdenCompraResponse obtenerPorId(Long id) {
        DetalleOrdenCompra detalle = detalleOrdenCompraRepository.findById(id)
                .orElseThrow(
                        () -> new IllegalArgumentException("Detalle de orden de compra no encontrado con id: " + id));
        return mapToResponse(detalle);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DetalleOrdenCompraResponse> listarPorOrdenCompra(Long ordenCompraId) {
        return detalleOrdenCompraRepository.findByOrdenCompraId(ordenCompraId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DetalleOrdenCompraResponse> listarPendientesPorOrdenCompra(Long ordenCompraId) {
        return detalleOrdenCompraRepository.findDetallesPendientesByOrdenCompraId(ordenCompraId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DetalleOrdenCompraResponse crear(Long ordenCompraId, DetalleOrdenCompraRequest request) {
        // Validar que la orden existe
        ordenCompraRepository.findById(ordenCompraId)
                .orElseThrow(
                        () -> new IllegalArgumentException("Orden de compra no encontrada con id: " + ordenCompraId));

        // Crear el detalle
        DetalleOrdenCompra detalle = new DetalleOrdenCompra();
        detalle.setOrdenCompraId(ordenCompraId);
        detalle.setInsumoId(request.getInsumoId());
        detalle.setCantidadSolicitada(request.getCantidadSolicitada());
        detalle.setUnidadCompra(request.getUnidadCompra());
        detalle.setCostoUnitarioPactadoCentimos(request.getCostoUnitarioPactadoCentimos());

        // Calcular total de línea: cantidad * costo unitario
        long totalLinea = request.getCantidadSolicitada()
                .multiply(BigDecimal.valueOf(request.getCostoUnitarioPactadoCentimos())).longValue();
        detalle.setTotalLineaCentimos(totalLinea);

        detalle.setCantidadRecibida(BigDecimal.ZERO);
        detalle.setRecibidoCompleto(false);

        DetalleOrdenCompra saved = detalleOrdenCompraRepository.save(detalle);

        // Actualizar el total de la orden
        actualizarTotalOrden(ordenCompraId);

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public DetalleOrdenCompraResponse actualizar(Long id, DetalleOrdenCompraRequest request) {
        DetalleOrdenCompra detalle = detalleOrdenCompraRepository.findById(id)
                .orElseThrow(
                        () -> new IllegalArgumentException("Detalle de orden de compra no encontrado con id: " + id));

        // Actualizar campos
        detalle.setInsumoId(request.getInsumoId());
        detalle.setCantidadSolicitada(request.getCantidadSolicitada());
        detalle.setUnidadCompra(request.getUnidadCompra());
        detalle.setCostoUnitarioPactadoCentimos(request.getCostoUnitarioPactadoCentimos());

        // Recalcular total de línea: cantidad * costo unitario
        long totalLinea = request.getCantidadSolicitada()
                .multiply(BigDecimal.valueOf(request.getCostoUnitarioPactadoCentimos())).longValue();
        detalle.setTotalLineaCentimos(totalLinea);

        DetalleOrdenCompra updated = detalleOrdenCompraRepository.save(detalle);

        // Actualizar el total de la orden
        actualizarTotalOrden(detalle.getOrdenCompraId());

        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        DetalleOrdenCompra detalle = detalleOrdenCompraRepository.findById(id)
                .orElseThrow(
                        () -> new IllegalArgumentException("Detalle de orden de compra no encontrado con id: " + id));

        Long ordenCompraId = detalle.getOrdenCompraId();
        detalleOrdenCompraRepository.deleteById(id);

        // Actualizar el total de la orden
        actualizarTotalOrden(ordenCompraId);
    }

    @Override
    @Transactional
    public DetalleOrdenCompraResponse actualizarRecepcion(Long id, Double cantidadRecibida, Boolean recibidoCompleto) {
        DetalleOrdenCompra detalle = detalleOrdenCompraRepository.findById(id)
                .orElseThrow(
                        () -> new IllegalArgumentException("Detalle de orden de compra no encontrado con id: " + id));

        if (cantidadRecibida != null) {
            detalle.setCantidadRecibida(BigDecimal.valueOf(cantidadRecibida));

            // Verificar si se recibió completamente
            if (detalle.getCantidadRecibida().compareTo(detalle.getCantidadSolicitada()) >= 0) {
                detalle.setRecibidoCompleto(true);
            }
        }

        if (recibidoCompleto != null) {
            detalle.setRecibidoCompleto(recibidoCompleto);
        }

        DetalleOrdenCompra updated = detalleOrdenCompraRepository.save(detalle);
        return mapToResponse(updated);
    }

    private void actualizarTotalOrden(Long ordenCompraId) {
        List<DetalleOrdenCompra> detalles = detalleOrdenCompraRepository.findByOrdenCompraId(ordenCompraId);
        long total = detalles.stream()
                .mapToLong(DetalleOrdenCompra::getTotalLineaCentimos)
                .sum();

        OrdenCompra orden = ordenCompraRepository.findById(ordenCompraId)
                .orElseThrow(() -> new IllegalArgumentException("Orden de compra no encontrada"));
        orden.setTotalCompraCentimos(total);
        ordenCompraRepository.save(orden);
    }

    private DetalleOrdenCompraResponse mapToResponse(DetalleOrdenCompra detalle) {
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
