package com.dulcecontrol.bakery.feature.admin.ventas.service.impl;

import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.PersonalizacionItemCreateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.PersonalizacionItemResponse;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.PersonalizacionItemUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.DetallePedido;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.PersonalizacionItemPedido;
import com.dulcecontrol.bakery.feature.admin.ventas.repository.DetallePedidoRepository;
import com.dulcecontrol.bakery.feature.admin.ventas.repository.PersonalizacionItemPedidoRepository;
import com.dulcecontrol.bakery.feature.admin.ventas.service.IPersonalizacionItemPedidoAdminService;
import com.dulcecontrol.bakery.feature.admin.ventas.service.helper.VentasTenantValidator;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PersonalizacionItemPedidoAdminService implements IPersonalizacionItemPedidoAdminService {

    private final PersonalizacionItemPedidoRepository personalizacionRepository;
    private final DetallePedidoRepository detallePedidoRepository;
    private final VentasTenantValidator tenantValidator;

    @Override
    @Transactional(readOnly = true)
    public PersonalizacionItemResponse obtener(Long tiendaId, Long pedidoId, Long detallePedidoId) {
        tenantValidator.validarPedidoPerteneceATienda(tiendaId, pedidoId);
        obtenerDetalle(pedidoId, detallePedidoId);
        PersonalizacionItemPedido personalizacion = personalizacionRepository.findByDetallePedidoId(detallePedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Personalización no encontrada para el detalle"));
        return toResponse(personalizacion);
    }

    @Override
    @Transactional
    public PersonalizacionItemResponse crear(Long tiendaId, Long pedidoId, Long detallePedidoId, PersonalizacionItemCreateRequest request) {
        tenantValidator.validarPedidoPerteneceATienda(tiendaId, pedidoId);
        obtenerDetalle(pedidoId, detallePedidoId);

        if (personalizacionRepository.findByDetallePedidoId(detallePedidoId).isPresent()) {
            throw new BadRequestException("El detalle ya cuenta con una personalización registrada");
        }

        PersonalizacionItemPedido personalizacion = new PersonalizacionItemPedido();
        personalizacion.setDetallePedidoId(detallePedidoId);
        personalizacion.setDescripcionSolicitud(request.descripcionSolicitud());
        personalizacion.setTextoDedicatoria(request.textoDedicatoria());
        personalizacion.setImagenesReferencia(cloneLista(request.imagenesReferencia()));
        personalizacion.setSaborMasa(request.saborMasa());
        personalizacion.setSaborRelleno(request.saborRelleno());
        personalizacion.setTematica(request.tematica());
        personalizacion.setFechaLimiteProduccion(request.fechaLimiteProduccion());
        personalizacion.setCostoExtraPersonalizacionCentimos(request.costoExtraPersonalizacionCentimos());

        PersonalizacionItemPedido guardada = personalizacionRepository.save(personalizacion);
        return toResponse(guardada);
    }

    @Override
    @Transactional
    public PersonalizacionItemResponse actualizar(Long tiendaId, Long pedidoId, Long detallePedidoId, PersonalizacionItemUpdateRequest request) {
        tenantValidator.validarPedidoPerteneceATienda(tiendaId, pedidoId);
        obtenerDetalle(pedidoId, detallePedidoId);

        PersonalizacionItemPedido personalizacion = personalizacionRepository.findByDetallePedidoId(detallePedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Personalización no encontrada para el detalle"));

        personalizacion.setDescripcionSolicitud(request.descripcionSolicitud());
        personalizacion.setTextoDedicatoria(request.textoDedicatoria());
        personalizacion.setImagenesReferencia(cloneLista(request.imagenesReferencia()));
        personalizacion.setSaborMasa(request.saborMasa());
        personalizacion.setSaborRelleno(request.saborRelleno());
        personalizacion.setTematica(request.tematica());
        personalizacion.setFechaLimiteProduccion(request.fechaLimiteProduccion());
        personalizacion.setCostoExtraPersonalizacionCentimos(request.costoExtraPersonalizacionCentimos());

        PersonalizacionItemPedido actualizada = personalizacionRepository.save(personalizacion);
        return toResponse(actualizada);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long pedidoId, Long detallePedidoId) {
        tenantValidator.validarPedidoPerteneceATienda(tiendaId, pedidoId);
        obtenerDetalle(pedidoId, detallePedidoId);
        PersonalizacionItemPedido personalizacion = personalizacionRepository.findByDetallePedidoId(detallePedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Personalización no encontrada para el detalle"));
        personalizacionRepository.delete(personalizacion);
    }

    private DetallePedido obtenerDetalle(Long pedidoId, Long detallePedidoId) {
        return detallePedidoRepository.findByIdAndPedidoId(detallePedidoId, pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Detalle del pedido no encontrado"));
    }

    private List<String> cloneLista(List<String> origen) {
        return origen == null ? new ArrayList<>() : new ArrayList<>(origen);
    }

    private PersonalizacionItemResponse toResponse(PersonalizacionItemPedido personalizacion) {
        return PersonalizacionItemResponse.builder()
                .id(personalizacion.getId())
                .detallePedidoId(personalizacion.getDetallePedidoId())
                .descripcionSolicitud(personalizacion.getDescripcionSolicitud())
                .textoDedicatoria(personalizacion.getTextoDedicatoria())
                .imagenesReferencia(cloneLista(personalizacion.getImagenesReferencia()))
                .saborMasa(personalizacion.getSaborMasa())
                .saborRelleno(personalizacion.getSaborRelleno())
                .tematica(personalizacion.getTematica())
                .fechaLimiteProduccion(personalizacion.getFechaLimiteProduccion())
                .costoExtraPersonalizacionCentimos(personalizacion.getCostoExtraPersonalizacionCentimos())
                .build();
    }
}
