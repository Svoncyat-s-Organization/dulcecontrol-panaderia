package com.dulcecontrol.bakery.feature.superadmin.facturacion.service.impl;

import com.dulcecontrol.bakery.feature.superadmin.facturacion.dto.ComprobanteResponse;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.dto.DetalleComprobanteResponse;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.entity.Comprobante;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.entity.DetalleComprobante;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.entity.enums.EstadoSunat;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.entity.enums.TipoComprobante;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.repository.ComprobanteRepository;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.repository.DetalleComprobanteRepository;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.service.IComprobanteService;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComprobanteService implements IComprobanteService {

    private final ComprobanteRepository comprobanteRepository;
    private final DetalleComprobanteRepository detalleRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ComprobanteResponse> listar(Long tiendaId, EstadoSunat estadoSunat, TipoComprobante tipo) {
        List<Comprobante> items;
        if (tiendaId != null) {
            items = comprobanteRepository.findByTiendaIdOrderByFechaEmisionDesc(tiendaId);
        } else if (estadoSunat != null) {
            items = comprobanteRepository.findByEstadosSunatOrderByFechaEmisionDesc(estadoSunat);
        } else if (tipo != null) {
            items = comprobanteRepository.findByTiposComprobanteOrderByCorrelativoDesc(tipo);
        } else {
            items = comprobanteRepository.findAll();
        }
        return items.stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ComprobanteResponse obtener(Long id) {
        Comprobante c = comprobanteRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Comprobante no encontrado"));
        return toResponse(c);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DetalleComprobanteResponse> listarDetalles(Long comprobanteId) {
        return detalleRepository.findByComprobanteId(comprobanteId)
                .stream().map(this::toDetalleResponse).toList();
    }

    private ComprobanteResponse toResponse(Comprobante c) {
        return ComprobanteResponse.builder()
                .id(c.getId())
                .tiendaId(c.getTiendaId())
                .serieId(c.getSerieId())
                .tiposComprobante(c.getTiposComprobante())
                .correlativo(c.getCorrelativo())
                .estadoPago(c.getEstadoPago())
                .estadosSunat(c.getEstadosSunat())
                .fechaEmision(c.getFechaEmision())
                .clienteTipoDoc(c.getClienteTipoDoc())
                .clienteNumDoc(c.getClienteNumDoc())
                .clienteNombreDoc(c.getClienteNombreDoc())
                .clienteDireccion(c.getClienteDireccion())
                .moneda(c.getMoneda())
                .totalGravadoCentimos(c.getTotalGravadoCentimos())
                .totalIgvCentimos(c.getTotalIgvCentimos())
                .totalImporteCentimos(c.getTotalImporteCentimos())
                .urlXml(c.getUrlXml())
                .urlCdr(c.getUrlCdr())
                .urlPdf(c.getUrlPdf())
                .creadoEn(c.getCreadoEn())
                .build();
    }

    private DetalleComprobanteResponse toDetalleResponse(DetalleComprobante d) {
        return DetalleComprobanteResponse.builder()
                .id(d.getId())
                .comprobanteId(d.getComprobanteId())
                .descripcion(d.getDescripcion())
                .cantidad(d.getCantidad())
                .valorUnitarioCentimos(d.getValorUnitarioCentimos())
                .precioUnitarioCentimos(d.getPrecioUnitarioCentimos())
                .igvItemCentimos(d.getIgvItemCentimos())
                .totalItemCentimos(d.getTotalItemCentimos())
                .build();
    }
}