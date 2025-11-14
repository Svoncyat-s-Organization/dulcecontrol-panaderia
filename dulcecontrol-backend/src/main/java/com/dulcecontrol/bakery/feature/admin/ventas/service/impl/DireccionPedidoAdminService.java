package com.dulcecontrol.bakery.feature.admin.ventas.service.impl;

import com.dulcecontrol.bakery.feature.admin.ventas.dto.DireccionPedidoCreateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.dto.DireccionPedidoResponse;
import com.dulcecontrol.bakery.feature.admin.ventas.dto.DireccionPedidoUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.DireccionPedido;
import com.dulcecontrol.bakery.feature.admin.ventas.repository.DireccionPedidoRepository;
import com.dulcecontrol.bakery.feature.admin.ventas.service.IDireccionPedidoAdminService;
import com.dulcecontrol.bakery.feature.admin.ventas.service.helper.VentasTenantValidator;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DireccionPedidoAdminService implements IDireccionPedidoAdminService {

    private final DireccionPedidoRepository direccionPedidoRepository;
    private final VentasTenantValidator tenantValidator;

    @Override
    @Transactional(readOnly = true)
    public List<DireccionPedidoResponse> listar(Long tiendaId, Long pedidoId) {
        tenantValidator.validarPedidoPerteneceATienda(tiendaId, pedidoId);
        return direccionPedidoRepository.findByPedidoId(pedidoId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DireccionPedidoResponse obtener(Long tiendaId, Long pedidoId, Long direccionId) {
        tenantValidator.validarPedidoPerteneceATienda(tiendaId, pedidoId);
        DireccionPedido direccion = obtenerDireccion(pedidoId, direccionId);
        return toResponse(direccion);
    }

    @Override
    @Transactional
    public DireccionPedidoResponse crear(Long tiendaId, Long pedidoId, DireccionPedidoCreateRequest request) {
        tenantValidator.validarPedidoPerteneceATienda(tiendaId, pedidoId);

        DireccionPedido direccion = new DireccionPedido();
        direccion.setPedidoId(pedidoId);
        direccion.setTipoDireccion(request.tipoDireccion());
        direccion.setNombreContacto(request.nombreContacto());
        direccion.setTipoDocContacto(request.tipoDocContacto());
        direccion.setNumeroDocContacto(request.numeroDocContacto());
        direccion.setTelefonoContacto(request.telefonoContacto());
        direccion.setEmailContacto(request.emailContacto());
        direccion.setDireccionCompleta(request.direccionCompleta());
        direccion.setReferencia(request.referencia());
        direccion.setDistrito(request.distrito());
        direccion.setProvincia(request.provincia());
        direccion.setDepartamento(request.departamento());
        direccion.setCodigoUbigeo(request.codigoUbigeo());
        direccion.setCodigoPostal(request.codigoPostal());

        DireccionPedido guardada = direccionPedidoRepository.save(direccion);
        return toResponse(guardada);
    }

    @Override
    @Transactional
    public DireccionPedidoResponse actualizar(Long tiendaId, Long pedidoId, Long direccionId, DireccionPedidoUpdateRequest request) {
        tenantValidator.validarPedidoPerteneceATienda(tiendaId, pedidoId);
        DireccionPedido direccion = obtenerDireccion(pedidoId, direccionId);

        direccion.setTipoDireccion(request.tipoDireccion());
        direccion.setNombreContacto(request.nombreContacto());
        direccion.setTipoDocContacto(request.tipoDocContacto());
        direccion.setNumeroDocContacto(request.numeroDocContacto());
        direccion.setTelefonoContacto(request.telefonoContacto());
        direccion.setEmailContacto(request.emailContacto());
        direccion.setDireccionCompleta(request.direccionCompleta());
        direccion.setReferencia(request.referencia());
        direccion.setDistrito(request.distrito());
        direccion.setProvincia(request.provincia());
        direccion.setDepartamento(request.departamento());
        direccion.setCodigoUbigeo(request.codigoUbigeo());
        direccion.setCodigoPostal(request.codigoPostal());

        DireccionPedido actualizada = direccionPedidoRepository.save(direccion);
        return toResponse(actualizada);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long pedidoId, Long direccionId) {
        tenantValidator.validarPedidoPerteneceATienda(tiendaId, pedidoId);
        DireccionPedido direccion = obtenerDireccion(pedidoId, direccionId);
        direccionPedidoRepository.delete(direccion);
    }

    private DireccionPedido obtenerDireccion(Long pedidoId, Long direccionId) {
        return direccionPedidoRepository.findByIdAndPedidoId(direccionId, pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Dirección del pedido no encontrada"));
    }

    private DireccionPedidoResponse toResponse(DireccionPedido direccion) {
        return DireccionPedidoResponse.builder()
                .id(direccion.getId())
                .pedidoId(direccion.getPedidoId())
                .tipoDireccion(direccion.getTipoDireccion())
                .nombreContacto(direccion.getNombreContacto())
                .tipoDocContacto(direccion.getTipoDocContacto())
                .numeroDocContacto(direccion.getNumeroDocContacto())
                .telefonoContacto(direccion.getTelefonoContacto())
                .emailContacto(direccion.getEmailContacto())
                .direccionCompleta(direccion.getDireccionCompleta())
                .referencia(direccion.getReferencia())
                .distrito(direccion.getDistrito())
                .provincia(direccion.getProvincia())
                .departamento(direccion.getDepartamento())
                .codigoUbigeo(direccion.getCodigoUbigeo())
                .codigoPostal(direccion.getCodigoPostal())
                .creadoEn(direccion.getCreadoEn())
                .build();
    }
}
