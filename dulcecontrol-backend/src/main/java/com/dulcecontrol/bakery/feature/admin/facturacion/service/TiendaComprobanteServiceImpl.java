package com.dulcecontrol.bakery.feature.admin.facturacion.service;

import com.dulcecontrol.bakery.feature.admin.facturacion.dto.TiendaComprobanteRequest;
import com.dulcecontrol.bakery.feature.admin.facturacion.dto.TiendaComprobanteResponse;
import com.dulcecontrol.bakery.feature.admin.facturacion.entity.TiendaComprobante;
import com.dulcecontrol.bakery.feature.admin.facturacion.entity.enums.EstadoSunat;
import com.dulcecontrol.bakery.feature.admin.facturacion.entity.enums.TipoComprobante;
import com.dulcecontrol.bakery.feature.admin.facturacion.repository.TiendaComprobanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TiendaComprobanteServiceImpl implements TiendaComprobanteService {

    private final TiendaComprobanteRepository tiendaComprobanteRepository;

    @Override
    @Transactional
    public TiendaComprobanteResponse crear(Long tiendaId, TiendaComprobanteRequest request) {
        // Validar que el tiendaId coincida
        if (!tiendaId.equals(request.getTiendaId())) {
            throw new IllegalArgumentException("El tiendaId de la URL no coincide con el tiendaId del request");
        }

        // Validar que no exista un comprobante para el pedido en esta tienda
        if (tiendaComprobanteRepository.existsByTiendaIdAndPedidoId(tiendaId, request.getPedidoId())) {
            throw new IllegalArgumentException("Ya existe un comprobante para el pedido: " + request.getPedidoId());
        }

        // Validar que no exista un comprobante con la misma serie y correlativo
        if (tiendaComprobanteRepository.findBySerieIdAndCorrelativo(request.getSerieId(), request.getCorrelativo())
                .isPresent()) {
            throw new IllegalArgumentException("Ya existe un comprobante con serie " + request.getSerieId()
                    + " y correlativo " + request.getCorrelativo());
        }

        TiendaComprobante comprobante = new TiendaComprobante();
        comprobante.setTiendaId(tiendaId);
        comprobante.setPedidoId(request.getPedidoId());
        comprobante.setSerieId(request.getSerieId());
        comprobante.setEmisorRazonSocial(request.getEmisorRazonSocial());
        comprobante.setEmisorRuc(request.getEmisorRuc());
        comprobante.setEmisorDireccion(request.getEmisorDireccion());
        comprobante.setClienteTipoDoc(request.getClienteTipoDoc());
        comprobante.setClienteNumeroDoc(request.getClienteNumeroDoc());
        comprobante.setClienteNombre(request.getClienteNombre());
        comprobante.setClienteDireccion(request.getClienteDireccion());
        comprobante.setTipoComprobante(request.getTipoComprobante());
        comprobante.setCorrelativo(request.getCorrelativo());
        comprobante
                .setFechaEmision(request.getFechaEmision() != null ? request.getFechaEmision() : LocalDateTime.now());
        comprobante.setMoneda(request.getMoneda() != null ? request.getMoneda() : "PEN");
        comprobante.setTotalGravadoCentimos(request.getTotalGravadoCentimos());
        comprobante.setTotalInafectoCentimos(request.getTotalInafectoCentimos());
        comprobante.setTotalExoneradoCentimos(request.getTotalExoneradoCentimos());
        comprobante.setTotalIgvCentimos(request.getTotalIgvCentimos());
        comprobante.setTotalImpuestosBolsaCentimos(request.getTotalImpuestosBolsaCentimos());
        comprobante.setTotalImporteCentimos(request.getTotalImporteCentimos());
        comprobante.setEstadoSunat(EstadoSunat.PENDIENTE);

        TiendaComprobante saved = tiendaComprobanteRepository.save(comprobante);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public TiendaComprobanteResponse obtenerPorIdYTienda(Long comprobanteId, Long tiendaId) {
        TiendaComprobante comprobante = tiendaComprobanteRepository.findByIdAndTiendaId(comprobanteId, tiendaId)
                .orElseThrow(() -> new IllegalArgumentException("Comprobante no encontrado con id: " + comprobanteId));
        return mapToResponse(comprobante);
    }

    @Override
    @Transactional(readOnly = true)
    public TiendaComprobanteResponse obtenerPorPedidoIdYTienda(Long pedidoId, Long tiendaId) {
        TiendaComprobante comprobante = tiendaComprobanteRepository.findByPedidoIdAndTiendaId(pedidoId, tiendaId)
                .orElseThrow(
                        () -> new IllegalArgumentException("No se encontró comprobante para el pedido: " + pedidoId));
        return mapToResponse(comprobante);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TiendaComprobanteResponse> listarPorTienda(Long tiendaId) {
        return tiendaComprobanteRepository.findByTiendaId(tiendaId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TiendaComprobanteResponse> listarPorSerie(Long serieId) {
        return tiendaComprobanteRepository.findBySerieId(serieId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TiendaComprobanteResponse> listarPorEstado(EstadoSunat estadoSunat) {
        return tiendaComprobanteRepository.findByEstadoSunat(estadoSunat)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TiendaComprobanteResponse> listarPorTiendaYEstado(Long tiendaId, EstadoSunat estadoSunat) {
        return tiendaComprobanteRepository.findByTiendaIdAndEstadoSunat(tiendaId, estadoSunat)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TiendaComprobanteResponse> listarPorTiendaYTipo(Long tiendaId, TipoComprobante tipoComprobante) {
        return tiendaComprobanteRepository.findByTiendaIdAndTipoComprobante(tiendaId, tipoComprobante)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TiendaComprobanteResponse> listarPorCliente(String clienteNumeroDoc) {
        return tiendaComprobanteRepository.findByClienteNumeroDoc(clienteNumeroDoc)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TiendaComprobanteResponse> listarPorRangoFechas(LocalDateTime inicio, LocalDateTime fin) {
        return tiendaComprobanteRepository.findByFechaEmisionBetween(inicio, fin)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TiendaComprobanteResponse> listarPorTiendaYRangoFechas(Long tiendaId, LocalDateTime inicio,
            LocalDateTime fin) {
        return tiendaComprobanteRepository.findByTiendaIdAndFechaEmisionBetween(tiendaId, inicio, fin)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TiendaComprobanteResponse actualizar(Long tiendaId, Long comprobanteId, TiendaComprobanteRequest request) {
        TiendaComprobante comprobante = tiendaComprobanteRepository.findByIdAndTiendaId(comprobanteId, tiendaId)
                .orElseThrow(() -> new IllegalArgumentException("Comprobante no encontrado con id: " + comprobanteId));

        // No permitir actualizar comprobantes ya enviados a SUNAT
        if (comprobante.getEstadoSunat() != EstadoSunat.PENDIENTE) {
            throw new IllegalArgumentException("No se puede actualizar un comprobante que ya ha sido enviado a SUNAT");
        }

        comprobante.setEmisorRazonSocial(request.getEmisorRazonSocial());
        comprobante.setEmisorRuc(request.getEmisorRuc());
        comprobante.setEmisorDireccion(request.getEmisorDireccion());
        comprobante.setClienteTipoDoc(request.getClienteTipoDoc());
        comprobante.setClienteNumeroDoc(request.getClienteNumeroDoc());
        comprobante.setClienteNombre(request.getClienteNombre());
        comprobante.setClienteDireccion(request.getClienteDireccion());
        comprobante.setMoneda(request.getMoneda());
        comprobante.setTotalGravadoCentimos(request.getTotalGravadoCentimos());
        comprobante.setTotalInafectoCentimos(request.getTotalInafectoCentimos());
        comprobante.setTotalExoneradoCentimos(request.getTotalExoneradoCentimos());
        comprobante.setTotalIgvCentimos(request.getTotalIgvCentimos());
        comprobante.setTotalImpuestosBolsaCentimos(request.getTotalImpuestosBolsaCentimos());
        comprobante.setTotalImporteCentimos(request.getTotalImporteCentimos());

        TiendaComprobante updated = tiendaComprobanteRepository.save(comprobante);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long comprobanteId) {
        TiendaComprobante comprobante = tiendaComprobanteRepository.findByIdAndTiendaId(comprobanteId, tiendaId)
                .orElseThrow(() -> new IllegalArgumentException("Comprobante no encontrado con id: " + comprobanteId));

        // Solo permitir eliminar comprobantes pendientes
        if (comprobante.getEstadoSunat() != EstadoSunat.PENDIENTE) {
            throw new IllegalArgumentException("Solo se pueden eliminar comprobantes en estado PENDIENTE");
        }

        tiendaComprobanteRepository.delete(comprobante);
    }

    @Override
    @Transactional
    public TiendaComprobanteResponse actualizarEstadoSunat(Long tiendaId, Long comprobanteId, EstadoSunat nuevoEstado,
            String codigoRespuesta, String descripcionRespuesta) {
        TiendaComprobante comprobante = tiendaComprobanteRepository.findByIdAndTiendaId(comprobanteId, tiendaId)
                .orElseThrow(() -> new IllegalArgumentException("Comprobante no encontrado con id: " + comprobanteId));

        comprobante.setEstadoSunat(nuevoEstado);
        comprobante.setRespuestaSunatCodigo(codigoRespuesta);
        comprobante.setRespuestaSunatDescripcion(descripcionRespuesta);

        TiendaComprobante updated = tiendaComprobanteRepository.save(comprobante);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public TiendaComprobanteResponse registrarEnvioSunat(Long tiendaId, Long comprobanteId, String codigoHash,
            String xmlUrl, String cdrUrl, String pdfUrl) {
        TiendaComprobante comprobante = tiendaComprobanteRepository.findByIdAndTiendaId(comprobanteId, tiendaId)
                .orElseThrow(() -> new IllegalArgumentException("Comprobante no encontrado con id: " + comprobanteId));

        comprobante.setCodigoHashCpe(codigoHash);
        comprobante.setXmlFirmadoUrl(xmlUrl);
        comprobante.setCdrSunatUrl(cdrUrl);
        comprobante.setRepresentacionImpresaUrl(pdfUrl);
        comprobante.setEstadoSunat(EstadoSunat.ENVIADO);

        TiendaComprobante updated = tiendaComprobanteRepository.save(comprobante);
        return mapToResponse(updated);
    }

    private TiendaComprobanteResponse mapToResponse(TiendaComprobante comprobante) {
        TiendaComprobanteResponse response = new TiendaComprobanteResponse();
        response.setId(comprobante.getId());
        response.setTiendaId(comprobante.getTiendaId());
        response.setPedidoId(comprobante.getPedidoId());
        response.setSerieId(comprobante.getSerieId());
        response.setEmisorRazonSocial(comprobante.getEmisorRazonSocial());
        response.setEmisorRuc(comprobante.getEmisorRuc());
        response.setEmisorDireccion(comprobante.getEmisorDireccion());
        response.setClienteTipoDoc(comprobante.getClienteTipoDoc());
        response.setClienteNumeroDoc(comprobante.getClienteNumeroDoc());
        response.setClienteNombre(comprobante.getClienteNombre());
        response.setClienteDireccion(comprobante.getClienteDireccion());
        response.setTipoComprobante(comprobante.getTipoComprobante());
        response.setCorrelativo(comprobante.getCorrelativo());
        response.setFechaEmision(comprobante.getFechaEmision());
        response.setMoneda(comprobante.getMoneda());
        response.setTotalGravadoCentimos(comprobante.getTotalGravadoCentimos());
        response.setTotalInafectoCentimos(comprobante.getTotalInafectoCentimos());
        response.setTotalExoneradoCentimos(comprobante.getTotalExoneradoCentimos());
        response.setTotalIgvCentimos(comprobante.getTotalIgvCentimos());
        response.setTotalImpuestosBolsaCentimos(comprobante.getTotalImpuestosBolsaCentimos());
        response.setTotalImporteCentimos(comprobante.getTotalImporteCentimos());
        response.setEstadoSunat(comprobante.getEstadoSunat());
        response.setCodigoHashCpe(comprobante.getCodigoHashCpe());
        response.setXmlFirmadoUrl(comprobante.getXmlFirmadoUrl());
        response.setCdrSunatUrl(comprobante.getCdrSunatUrl());
        response.setRepresentacionImpresaUrl(comprobante.getRepresentacionImpresaUrl());
        response.setRespuestaSunatCodigo(comprobante.getRespuestaSunatCodigo());
        response.setRespuestaSunatDescripcion(comprobante.getRespuestaSunatDescripcion());
        response.setCreadoEn(comprobante.getCreadoEn());
        return response;
    }
}
