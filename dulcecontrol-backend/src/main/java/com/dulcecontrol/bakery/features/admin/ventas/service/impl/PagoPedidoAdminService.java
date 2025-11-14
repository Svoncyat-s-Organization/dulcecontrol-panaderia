package com.dulcecontrol.bakery.features.admin.ventas.service.impl;

import com.dulcecontrol.bakery.features.admin.ventas.dto.PagoPedidoCreateRequest;
import com.dulcecontrol.bakery.features.admin.ventas.dto.PagoPedidoResponse;
import com.dulcecontrol.bakery.features.admin.ventas.dto.PagoPedidoUpdateRequest;
import com.dulcecontrol.bakery.features.admin.ventas.entity.PagoPedido;
import com.dulcecontrol.bakery.features.admin.ventas.repository.PagoPedidoRepository;
import com.dulcecontrol.bakery.features.admin.ventas.repository.SesionCajaRepository;
import com.dulcecontrol.bakery.features.admin.ventas.service.IPagoPedidoAdminService;
import com.dulcecontrol.bakery.features.admin.ventas.service.helper.VentasTenantValidator;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PagoPedidoAdminService implements IPagoPedidoAdminService {

    private final PagoPedidoRepository pagoPedidoRepository;
    private final SesionCajaRepository sesionCajaRepository;
    private final VentasTenantValidator tenantValidator;

    @Override
    @Transactional(readOnly = true)
    public List<PagoPedidoResponse> listar(Long tiendaId, Long pedidoId) {
        tenantValidator.validarPedidoPerteneceATienda(tiendaId, pedidoId);
        return pagoPedidoRepository.findByPedidoIdOrderByFechaPagoDesc(pedidoId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PagoPedidoResponse obtener(Long tiendaId, Long pedidoId, Long pagoId) {
        tenantValidator.validarPedidoPerteneceATienda(tiendaId, pedidoId);
        PagoPedido pago = obtenerPago(pedidoId, pagoId);
        return toResponse(pago);
    }

    @Override
    @Transactional
    public PagoPedidoResponse crear(Long tiendaId, Long pedidoId, PagoPedidoCreateRequest request) {
        tenantValidator.validarPedidoPerteneceATienda(tiendaId, pedidoId);
        validarSesionPerteneceATienda(tiendaId, request.sesionCajaId());

        PagoPedido pago = new PagoPedido();
        pago.setPedidoId(pedidoId);
        pago.setSesionCajaId(request.sesionCajaId());
        pago.setMontoPagadoCentimos(request.montoPagadoCentimos());
        pago.setMetodoPago(request.metodoPago());
        pago.setReferenciaExterna(request.referenciaExterna());
        pago.setFechaPago(request.fechaPago() != null ? request.fechaPago() : LocalDateTime.now());
        pago.setRegistradoPor(request.registradoPor());

        PagoPedido guardado = pagoPedidoRepository.save(pago);
        return toResponse(guardado);
    }

    @Override
    @Transactional
    public PagoPedidoResponse actualizar(Long tiendaId, Long pedidoId, Long pagoId, PagoPedidoUpdateRequest request) {
        tenantValidator.validarPedidoPerteneceATienda(tiendaId, pedidoId);
        PagoPedido pago = obtenerPago(pedidoId, pagoId);
        validarSesionPerteneceATienda(tiendaId, request.sesionCajaId());

        pago.setSesionCajaId(request.sesionCajaId());
        pago.setMontoPagadoCentimos(request.montoPagadoCentimos());
        pago.setMetodoPago(request.metodoPago());
        pago.setReferenciaExterna(request.referenciaExterna());
        pago.setFechaPago(request.fechaPago());
        pago.setRegistradoPor(request.registradoPor());

        PagoPedido actualizado = pagoPedidoRepository.save(pago);
        return toResponse(actualizado);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long pedidoId, Long pagoId) {
        tenantValidator.validarPedidoPerteneceATienda(tiendaId, pedidoId);
        PagoPedido pago = obtenerPago(pedidoId, pagoId);
        pagoPedidoRepository.delete(pago);
    }

    private void validarSesionPerteneceATienda(Long tiendaId, Long sesionCajaId) {
        if (sesionCajaId == null) {
            return;
        }
        sesionCajaRepository.findByIdAndTiendaId(sesionCajaId, tiendaId)
                .orElseThrow(() -> new BadRequestException("La sesión de caja indicada no pertenece a la tienda"));
    }

    private PagoPedido obtenerPago(Long pedidoId, Long pagoId) {
        return pagoPedidoRepository.findByIdAndPedidoId(pagoId, pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pago del pedido no encontrado"));
    }

    private PagoPedidoResponse toResponse(PagoPedido pago) {
        return PagoPedidoResponse.builder()
                .id(pago.getId())
                .pedidoId(pago.getPedidoId())
                .sesionCajaId(pago.getSesionCajaId())
                .montoPagadoCentimos(pago.getMontoPagadoCentimos())
                .metodoPago(pago.getMetodoPago())
                .referenciaExterna(pago.getReferenciaExterna())
                .fechaPago(pago.getFechaPago())
                .registradoPor(pago.getRegistradoPor())
                .build();
    }
}
