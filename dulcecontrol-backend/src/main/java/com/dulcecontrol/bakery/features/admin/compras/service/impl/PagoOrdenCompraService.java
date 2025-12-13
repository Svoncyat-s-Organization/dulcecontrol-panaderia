package com.dulcecontrol.bakery.features.admin.compras.service.impl;

import com.dulcecontrol.bakery.features.admin.compras.dto.PagoOrdenCompraRequest;
import com.dulcecontrol.bakery.features.admin.compras.dto.PagoOrdenCompraResponse;
import com.dulcecontrol.bakery.features.admin.compras.entity.OrdenCompra;
import com.dulcecontrol.bakery.features.admin.compras.entity.PagoOrdenCompra;
import com.dulcecontrol.bakery.features.admin.compras.repository.OrdenCompraRepository;
import com.dulcecontrol.bakery.features.admin.compras.repository.PagoOrdenCompraRepository;
import com.dulcecontrol.bakery.features.admin.compras.service.IPagoOrdenCompraService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PagoOrdenCompraService implements IPagoOrdenCompraService {

    private final PagoOrdenCompraRepository pagoOrdenCompraRepository;
    private final OrdenCompraRepository ordenCompraRepository;

    @Override
    @Transactional
    public PagoOrdenCompraResponse registrarPago(PagoOrdenCompraRequest request) {
        // Validar que la orden existe
        OrdenCompra orden = ordenCompraRepository.findById(request.getOrdenCompraId())
                .orElseThrow(() -> new ResourceNotFoundException("Orden de compra no encontrada"));

        // Validar que la orden está a crédito
        if (orden.getMetodoPago() == null || 
            !orden.getMetodoPago().name().equalsIgnoreCase("CREDITO")) {
            throw new BadRequestException("Solo se pueden registrar pagos para órdenes a crédito");
        }

        // Validar que no se pague más del saldo pendiente
        Long saldoPendiente = orden.getSaldoPendienteCentimos() != null ? orden.getSaldoPendienteCentimos() : 0L;
        if (request.getMontoPagadoCentimos() > saldoPendiente) {
            throw new BadRequestException("El monto a pagar no puede ser mayor al saldo pendiente");
        }

        // Crear el registro de pago
        PagoOrdenCompra pago = new PagoOrdenCompra();
        pago.setOrdenCompraId(request.getOrdenCompraId());
        pago.setFechaPago(request.getFechaPago());
        pago.setMontoPagadoCentimos(request.getMontoPagadoCentimos());
        pago.setMetodoPago(request.getMetodoPago());
        pago.setReferenciaPago(request.getReferenciaPago());
        pago.setUrlFotoComprobante(request.getUrlFotoComprobante());
        pago.setObservaciones(request.getObservaciones());

        PagoOrdenCompra pagoGuardado = pagoOrdenCompraRepository.save(pago);

        // Actualizar la orden con el nuevo monto pagado
        Long montoPagadoActual = orden.getMontoPagadoCentimos() != null ? orden.getMontoPagadoCentimos() : 0L;
        Long montoPagadoTotal = montoPagadoActual + request.getMontoPagadoCentimos();
        Long totalOrden = orden.getTotalCompraCentimos() != null ? orden.getTotalCompraCentimos() : 0L;
        Long nuevoSaldoPendiente = totalOrden - montoPagadoTotal;
        
        orden.setMontoPagadoCentimos(montoPagadoTotal);
        orden.setSaldoPendienteCentimos(nuevoSaldoPendiente);
        ordenCompraRepository.save(orden);
        
        System.out.println("=== PAGO REGISTRADO ===");
        System.out.println("Orden ID: " + orden.getId());
        System.out.println("Monto del pago: " + request.getMontoPagadoCentimos());
        System.out.println("Monto pagado antes: " + montoPagadoActual);
        System.out.println("Monto pagado total ahora: " + montoPagadoTotal);
        System.out.println("Nuevo saldo pendiente: " + nuevoSaldoPendiente);
        System.out.println("=======================");

        return toResponse(pagoGuardado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PagoOrdenCompraResponse> obtenerHistorialPagos(Long ordenCompraId) {
        return pagoOrdenCompraRepository.findByOrdenCompraIdOrderByFechaPagoDesc(ordenCompraId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PagoOrdenCompraResponse obtenerPagoPorId(Long id) {
        PagoOrdenCompra pago = pagoOrdenCompraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado"));
        return toResponse(pago);
    }

    private PagoOrdenCompraResponse toResponse(PagoOrdenCompra pago) {
        return new PagoOrdenCompraResponse(
                pago.getId(),
                pago.getOrdenCompraId(),
                pago.getFechaPago(),
                pago.getMontoPagadoCentimos(),
                pago.getMetodoPago(),
                pago.getReferenciaPago(),
                pago.getUrlFotoComprobante(),
                pago.getObservaciones(),
                pago.getCreadoEn(),
                pago.getActualizadoEn()
        );
    }
}
