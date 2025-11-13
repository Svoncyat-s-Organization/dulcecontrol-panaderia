package com.dulcecontrol.bakery.feature.admin.ventas.service.impl;

import com.dulcecontrol.bakery.feature.admin.catalogo.repository.ProductoRepository;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.DetallePedidoCreateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.DetallePedidoResponse;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.DetallePedidoUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.DetallePedido;
import com.dulcecontrol.bakery.feature.admin.ventas.repository.DetallePedidoRepository;
import com.dulcecontrol.bakery.feature.admin.ventas.service.IDetallePedidoAdminService;
import com.dulcecontrol.bakery.feature.admin.ventas.service.helper.VentasTenantValidator;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DetallePedidoAdminService implements IDetallePedidoAdminService {

    private final DetallePedidoRepository detallePedidoRepository;
    private final ProductoRepository productoRepository;
    private final VentasTenantValidator tenantValidator;

    @Override
    @Transactional(readOnly = true)
    public List<DetallePedidoResponse> listar(Long tiendaId, Long pedidoId) {
        tenantValidator.validarPedidoPerteneceATienda(tiendaId, pedidoId);
        return detallePedidoRepository.findByPedidoId(pedidoId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DetallePedidoResponse obtener(Long tiendaId, Long pedidoId, Long detalleId) {
        tenantValidator.validarPedidoPerteneceATienda(tiendaId, pedidoId);
        DetallePedido detalle = obtenerDetalle(pedidoId, detalleId);
        return toResponse(detalle);
    }

    @Override
    @Transactional
    public DetallePedidoResponse crear(Long tiendaId, Long pedidoId, DetallePedidoCreateRequest request) {
        tenantValidator.validarPedidoPerteneceATienda(tiendaId, pedidoId);
        validarProductoPerteneceATienda(tiendaId, request.productoId());

        DetallePedido detalle = new DetallePedido();
        detalle.setPedidoId(pedidoId);
        detalle.setProductoId(request.productoId());
        detalle.setCantidad(request.cantidad());
        detalle.setPrecioUnitarioCentimos(request.precioUnitarioCentimos());
        detalle.setSubtotalLineaCentimos(request.subtotalLineaCentimos());
        detalle.setNotasItem(request.notasItem());

        DetallePedido guardado = detallePedidoRepository.save(detalle);
        return toResponse(guardado);
    }

    @Override
    @Transactional
    public DetallePedidoResponse actualizar(Long tiendaId, Long pedidoId, Long detalleId, DetallePedidoUpdateRequest request) {
        tenantValidator.validarPedidoPerteneceATienda(tiendaId, pedidoId);
        DetallePedido detalle = obtenerDetalle(pedidoId, detalleId);
        validarProductoPerteneceATienda(tiendaId, request.productoId());

        detalle.setProductoId(request.productoId());
        detalle.setCantidad(request.cantidad());
        detalle.setPrecioUnitarioCentimos(request.precioUnitarioCentimos());
        detalle.setSubtotalLineaCentimos(request.subtotalLineaCentimos());
        detalle.setNotasItem(request.notasItem());

        DetallePedido actualizado = detallePedidoRepository.save(detalle);
        return toResponse(actualizado);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long pedidoId, Long detalleId) {
        tenantValidator.validarPedidoPerteneceATienda(tiendaId, pedidoId);
        DetallePedido detalle = obtenerDetalle(pedidoId, detalleId);
        detallePedidoRepository.delete(detalle);
    }

    private DetallePedido obtenerDetalle(Long pedidoId, Long detalleId) {
        return detallePedidoRepository.findByIdAndPedidoId(detalleId, pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Detalle del pedido no encontrado"));
    }

    private void validarProductoPerteneceATienda(Long tiendaId, Long productoId) {
        if (productoId == null) {
            throw new BadRequestException("El producto es obligatorio");
        }
        productoRepository.findByIdAndTiendaId(productoId, tiendaId)
                .orElseThrow(() -> new BadRequestException("El producto indicado no pertenece a la tienda"));
    }

    private DetallePedidoResponse toResponse(DetallePedido detalle) {
        return DetallePedidoResponse.builder()
                .id(detalle.getId())
                .pedidoId(detalle.getPedidoId())
                .productoId(detalle.getProductoId())
                .cantidad(detalle.getCantidad())
                .precioUnitarioCentimos(detalle.getPrecioUnitarioCentimos())
                .subtotalLineaCentimos(detalle.getSubtotalLineaCentimos())
                .notasItem(detalle.getNotasItem())
                .build();
    }
}
