package com.dulcecontrol.bakery.feature.admin.ventas.service.impl;

import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.MovimientoCajaCreateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.MovimientoCajaResponse;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.MovimientoCajaUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.MovimientoCaja;
import com.dulcecontrol.bakery.feature.admin.ventas.repository.MovimientoCajaRepository;
import com.dulcecontrol.bakery.feature.admin.ventas.repository.SesionCajaRepository;
import com.dulcecontrol.bakery.feature.admin.ventas.service.IMovimientoCajaAdminService;
import com.dulcecontrol.bakery.feature.admin.ventas.service.helper.VentasTenantValidator;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovimientoCajaAdminService implements IMovimientoCajaAdminService {

    private final MovimientoCajaRepository movimientoCajaRepository;
    private final SesionCajaRepository sesionCajaRepository;
    private final VentasTenantValidator tenantValidator;

    @Override
    @Transactional(readOnly = true)
    public List<MovimientoCajaResponse> listar(Long tiendaId, Long sesionCajaId) {
        validarSesionPerteneceATienda(tiendaId, sesionCajaId);
        return movimientoCajaRepository.findBySesionCajaIdOrderByCreadoEnDesc(sesionCajaId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MovimientoCajaResponse obtener(Long tiendaId, Long sesionCajaId, Long movimientoId) {
        validarSesionPerteneceATienda(tiendaId, sesionCajaId);
        MovimientoCaja movimiento = obtenerMovimiento(sesionCajaId, movimientoId);
        return toResponse(movimiento);
    }

    @Override
    @Transactional
    public MovimientoCajaResponse crear(Long tiendaId, Long sesionCajaId, MovimientoCajaCreateRequest request) {
        validarSesionPerteneceATienda(tiendaId, sesionCajaId);
        tenantValidator.validarPedidoPerteneceATienda(tiendaId, request.pedidoId());

        MovimientoCaja movimiento = new MovimientoCaja();
        movimiento.setSesionCajaId(sesionCajaId);
        movimiento.setTipoMovimiento(request.tipoMovimiento());
        movimiento.setMontoCentimos(request.montoCentimos());
        movimiento.setMetodoPago(request.metodoPago());
        movimiento.setPedidoId(request.pedidoId());
        movimiento.setConcepto(request.concepto());
        movimiento.setComprobanteAsociado(request.comprobanteAsociado());

        MovimientoCaja guardado = movimientoCajaRepository.save(movimiento);
        return toResponse(guardado);
    }

    @Override
    @Transactional
    public MovimientoCajaResponse actualizar(Long tiendaId, Long sesionCajaId, Long movimientoId, MovimientoCajaUpdateRequest request) {
        validarSesionPerteneceATienda(tiendaId, sesionCajaId);
        MovimientoCaja movimiento = obtenerMovimiento(sesionCajaId, movimientoId);
        tenantValidator.validarPedidoPerteneceATienda(tiendaId, request.pedidoId());

        movimiento.setTipoMovimiento(request.tipoMovimiento());
        movimiento.setMontoCentimos(request.montoCentimos());
        movimiento.setMetodoPago(request.metodoPago());
        movimiento.setPedidoId(request.pedidoId());
        movimiento.setConcepto(request.concepto());
        movimiento.setComprobanteAsociado(request.comprobanteAsociado());

        MovimientoCaja actualizado = movimientoCajaRepository.save(movimiento);
        return toResponse(actualizado);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long sesionCajaId, Long movimientoId) {
        validarSesionPerteneceATienda(tiendaId, sesionCajaId);
        MovimientoCaja movimiento = obtenerMovimiento(sesionCajaId, movimientoId);
        movimientoCajaRepository.delete(movimiento);
    }

    private void validarSesionPerteneceATienda(Long tiendaId, Long sesionCajaId) {
        if (sesionCajaId == null) {
            throw new BadRequestException("La sesión de caja es requerida");
        }
        sesionCajaRepository.findByIdAndTiendaId(sesionCajaId, tiendaId)
                .orElseThrow(() -> new BadRequestException("La sesión de caja indicada no pertenece a la tienda"));
    }

    private MovimientoCaja obtenerMovimiento(Long sesionCajaId, Long movimientoId) {
        return movimientoCajaRepository.findByIdAndSesionCajaId(movimientoId, sesionCajaId)
                .orElseThrow(() -> new ResourceNotFoundException("Movimiento de caja no encontrado"));
    }

    private MovimientoCajaResponse toResponse(MovimientoCaja movimiento) {
        return MovimientoCajaResponse.builder()
                .id(movimiento.getId())
                .sesionCajaId(movimiento.getSesionCajaId())
                .tipoMovimiento(movimiento.getTipoMovimiento())
                .montoCentimos(movimiento.getMontoCentimos())
                .metodoPago(movimiento.getMetodoPago())
                .pedidoId(movimiento.getPedidoId())
                .concepto(movimiento.getConcepto())
                .comprobanteAsociado(movimiento.getComprobanteAsociado())
                .creadoEn(movimiento.getCreadoEn())
                .actualizadoEn(movimiento.getActualizadoEn())
                .build();
    }
}
