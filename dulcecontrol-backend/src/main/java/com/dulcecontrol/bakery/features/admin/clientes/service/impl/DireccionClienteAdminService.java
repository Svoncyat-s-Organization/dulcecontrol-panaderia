package com.dulcecontrol.bakery.features.admin.clientes.service.impl;

import com.dulcecontrol.bakery.features.admin.clientes.dto.DireccionClienteCreateRequest;
import com.dulcecontrol.bakery.features.admin.clientes.dto.DireccionClienteResponse;
import com.dulcecontrol.bakery.features.admin.clientes.dto.DireccionClienteUpdateRequest;
import com.dulcecontrol.bakery.features.admin.clientes.entity.DireccionCliente;
import com.dulcecontrol.bakery.features.admin.clientes.repository.ClienteRepository;
import com.dulcecontrol.bakery.features.admin.clientes.repository.DireccionClienteRepository;
import com.dulcecontrol.bakery.features.admin.clientes.service.IDireccionClienteAdminService;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DireccionClienteAdminService implements IDireccionClienteAdminService {

    private final DireccionClienteRepository direccionClienteRepository;
    private final ClienteRepository clienteRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DireccionClienteResponse> listarPorCliente(Long tiendaId, Long clienteId) {
        // Verificar que el cliente existe y pertenece a la tienda
        clienteRepository.findByIdAndTiendaId(clienteId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));

        return direccionClienteRepository.findByClienteId(clienteId)
                .stream()
                .sorted(Comparator.comparing(DireccionCliente::getEtiqueta, Comparator.nullsLast(String::compareTo)))
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DireccionClienteResponse obtenerPorId(Long tiendaId, Long clienteId, Long direccionId) {
        // Verificar que el cliente existe y pertenece a la tienda
        clienteRepository.findByIdAndTiendaId(clienteId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));

        DireccionCliente direccion = direccionClienteRepository.findByIdAndClienteId(direccionId, clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Dirección no encontrada"));
        return toResponse(direccion);
    }

    @Override
    @Transactional
    public DireccionClienteResponse crear(Long tiendaId, Long clienteId, DireccionClienteCreateRequest request) {
        // Verificar que el cliente existe y pertenece a la tienda
        clienteRepository.findByIdAndTiendaId(clienteId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));

        DireccionCliente direccion = new DireccionCliente();
        direccion.setClienteId(clienteId);
        direccion.setEtiqueta(request.getEtiqueta());
        direccion.setDireccionCompleta(request.getDireccionCompleta());
        direccion.setReferencia(request.getReferencia());
        direccion.setDistritoId(request.getDistritoId());
        direccion.setCodigoPostal(request.getCodigoPostal());
        direccion.setEsFiscal(request.getEsFiscal() != null ? request.getEsFiscal() : false);
        direccion.setEsEntrega(request.getEsEntrega() != null ? request.getEsEntrega() : false);

        DireccionCliente saved = direccionClienteRepository.save(direccion);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public DireccionClienteResponse actualizar(Long tiendaId, Long clienteId, Long direccionId, DireccionClienteUpdateRequest request) {
        // Verificar que el cliente existe y pertenece a la tienda
        clienteRepository.findByIdAndTiendaId(clienteId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));

        DireccionCliente direccion = direccionClienteRepository.findByIdAndClienteId(direccionId, clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Dirección no encontrada"));

        direccion.setEtiqueta(request.getEtiqueta());
        direccion.setDireccionCompleta(request.getDireccionCompleta());
        direccion.setReferencia(request.getReferencia());
        direccion.setDistritoId(request.getDistritoId());
        direccion.setCodigoPostal(request.getCodigoPostal());
        direccion.setEsFiscal(request.getEsFiscal());
        direccion.setEsEntrega(request.getEsEntrega());

        DireccionCliente saved = direccionClienteRepository.save(direccion);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long clienteId, Long direccionId) {
        // Verificar que el cliente existe y pertenece a la tienda
        clienteRepository.findByIdAndTiendaId(clienteId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));

        DireccionCliente direccion = direccionClienteRepository.findByIdAndClienteId(direccionId, clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Dirección no encontrada"));
        direccionClienteRepository.delete(direccion);
    }

    private DireccionClienteResponse toResponse(DireccionCliente direccion) {
        return DireccionClienteResponse.builder()
                .id(direccion.getId())
                .clienteId(direccion.getClienteId())
                .etiqueta(direccion.getEtiqueta())
                .direccionCompleta(direccion.getDireccionCompleta())
                .referencia(direccion.getReferencia())
                .distritoId(direccion.getDistritoId())
                .codigoPostal(direccion.getCodigoPostal())
                .esFiscal(direccion.getEsFiscal())
                .esEntrega(direccion.getEsEntrega())
                .creadoEn(direccion.getCreadoEn())
                .build();
    }
}