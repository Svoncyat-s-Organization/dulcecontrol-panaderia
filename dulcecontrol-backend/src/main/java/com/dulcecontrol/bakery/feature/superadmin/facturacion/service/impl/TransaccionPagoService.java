package com.dulcecontrol.bakery.feature.superadmin.facturacion.service.impl;

import com.dulcecontrol.bakery.feature.superadmin.facturacion.controller.dto.TransaccionPagoResponse;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.entity.enums.EstadoTransaccion;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.entity.TransaccionPago;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.repository.TransaccionPagoRepository;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.service.ITransaccionPagoService;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransaccionPagoService implements ITransaccionPagoService {

    private final TransaccionPagoRepository transaccionRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TransaccionPagoResponse> listar(Long comprobanteId, EstadoTransaccion estado) {
        List<TransaccionPago> items;
        if (comprobanteId != null) {
            items = transaccionRepository.findByComprobanteIdOrderByCreadoEnDesc(comprobanteId);
        } else if (estado != null) {
            items = transaccionRepository.findByEstadoOrderByCreadoEnDesc(estado);
        } else {
            items = transaccionRepository.findAll();
        }
        return items.stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TransaccionPagoResponse obtener(Long id) {
        TransaccionPago t = transaccionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transacción no encontrada"));
        return toResponse(t);
    }

    private TransaccionPagoResponse toResponse(TransaccionPago t) {
        return TransaccionPagoResponse.builder()
                .id(t.getId())
                .comprobanteId(t.getComprobanteId())
                .pasarela(t.getPasarela())
                .idTransaccionPasarela(t.getIdTransaccionPasarela())
                .montoCentimos(t.getMontoCentimos())
                .moneda(t.getMoneda())
                .estado(t.getEstado())
                .codigoError(t.getCodigoError())
                .mensajeError(t.getMensajeError())
                .metadataPasarela(t.getMetadataPasarela())
                .creadoEn(t.getCreadoEn())
                .build();
    }
}