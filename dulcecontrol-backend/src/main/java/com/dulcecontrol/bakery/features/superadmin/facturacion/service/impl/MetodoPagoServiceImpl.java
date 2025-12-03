package com.dulcecontrol.bakery.features.superadmin.facturacion.service.impl;

import com.dulcecontrol.bakery.features.superadmin.facturacion.dto.MetodoPagoRequest;
import com.dulcecontrol.bakery.features.superadmin.facturacion.dto.MetodoPagoResponse;
import com.dulcecontrol.bakery.features.superadmin.facturacion.entity.MetodoPago;
import com.dulcecontrol.bakery.features.superadmin.facturacion.repository.MetodoPagoRepository;
import com.dulcecontrol.bakery.features.superadmin.facturacion.service.IMetodoPagoService;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MetodoPagoServiceImpl implements IMetodoPagoService {

    private final MetodoPagoRepository metodoPagoRepository;

    @Override
    public List<MetodoPagoResponse> listar() {
        return metodoPagoRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MetodoPagoResponse obtener(Long id) {
        MetodoPago metodoPago = metodoPagoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Método de pago no encontrado"));
        return mapToResponse(metodoPago);
    }

    @Override
    public MetodoPagoResponse crear(MetodoPagoRequest request) {
        MetodoPago metodoPago = new MetodoPago();
        metodoPago.setNombre(request.getNombre());
        metodoPago.setCodigo(request.getCodigo());
        metodoPago.setActivo(request.getActivo());

        MetodoPago guardado = metodoPagoRepository.save(metodoPago);
        return mapToResponse(guardado);
    }

    @Override
    public MetodoPagoResponse actualizar(Long id, MetodoPagoRequest request) {
        MetodoPago metodoPago = metodoPagoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Método de pago no encontrado"));

        metodoPago.setNombre(request.getNombre());
        metodoPago.setCodigo(request.getCodigo());
        metodoPago.setActivo(request.getActivo());

        MetodoPago actualizado = metodoPagoRepository.save(metodoPago);
        return mapToResponse(actualizado);
    }

    @Override
    public void eliminar(Long id) {
        if (!metodoPagoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Método de pago no encontrado");
        }
        metodoPagoRepository.deleteById(id);
    }

    private MetodoPagoResponse mapToResponse(MetodoPago entity) {
        MetodoPagoResponse response = new MetodoPagoResponse();
        response.setId(entity.getId());
        response.setNombre(entity.getNombre());
        response.setCodigo(entity.getCodigo());
        response.setActivo(entity.getActivo());
        return response;
    }
}
