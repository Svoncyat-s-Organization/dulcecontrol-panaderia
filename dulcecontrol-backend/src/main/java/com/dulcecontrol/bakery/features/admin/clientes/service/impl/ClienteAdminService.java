package com.dulcecontrol.bakery.features.admin.clientes.service.impl;

import com.dulcecontrol.bakery.features.admin.clientes.dto.ClienteCreateRequest;
import com.dulcecontrol.bakery.features.admin.clientes.dto.ClienteResponse;
import com.dulcecontrol.bakery.features.admin.clientes.dto.ClienteUpdateRequest;
import com.dulcecontrol.bakery.features.admin.clientes.entity.Cliente;
import com.dulcecontrol.bakery.features.admin.clientes.repository.ClienteRepository;
import com.dulcecontrol.bakery.features.admin.clientes.service.IClienteAdminService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteAdminService implements IClienteAdminService {

    private final ClienteRepository clienteRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ClienteResponse> listarPorTienda(Long tiendaId) {
        return clienteRepository.findByTiendaId(tiendaId)
                .stream()
                .sorted(Comparator.comparing(Cliente::getNombreDoc))
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClienteResponse> buscarPorTiendaYTexto(Long tiendaId, String busqueda) {
        if (busqueda == null || busqueda.trim().isEmpty()) {
            return listarPorTienda(tiendaId);
        }
        return clienteRepository.buscarPorTiendaYTexto(tiendaId, busqueda.trim())
                .stream()
                .sorted(Comparator.comparing(Cliente::getNombreDoc))
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ClienteResponse obtenerPorId(Long tiendaId, Long clienteId) {
        Cliente cliente = clienteRepository.findByIdAndTiendaId(clienteId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));
        return toResponse(cliente);
    }

    @Override
    @Transactional
    public ClienteResponse crear(Long tiendaId, ClienteCreateRequest request) {
        // Validar duplicados
        if (request.getTipoDocumento() != null && request.getNumeroDoc() != null) {
            if (clienteRepository.existsByTiendaIdAndTipoDocAndNumeroDoc(
                    tiendaId, request.getTipoDocumento(), request.getNumeroDoc())) {
                throw new BadRequestException("Ya existe un cliente con el mismo tipo y número de documento");
            }
        }
        if (request.getEmail() != null && clienteRepository.existsByTiendaIdAndEmail(tiendaId, request.getEmail())) {
            throw new BadRequestException("Ya existe un cliente con el mismo email");
        }

        Cliente cliente = new Cliente();
        cliente.setTiendaId(tiendaId);
        cliente.setTipoDoc(request.getTipoDocumento());
        cliente.setNumeroDoc(request.getNumeroDoc());
        cliente.setNombreDoc(request.getNombreDoc());
        cliente.setEmail(request.getEmail());
        cliente.setTelefono(request.getTelefono());
        cliente.setEsUsuarioVirtual(request.getEsUsuarioVirtual() != null ? request.getEsUsuarioVirtual() : false);
        cliente.setHashContrasena(request.getHashContrasena());
        cliente.setNotas(request.getNotas());

        Cliente saved = clienteRepository.save(cliente);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public ClienteResponse actualizar(Long tiendaId, Long clienteId, ClienteUpdateRequest request) {
        Cliente cliente = clienteRepository.findByIdAndTiendaId(clienteId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));

        // Validar duplicados (excluyendo el actual)
        if (request.getTipoDocumento() != null && request.getNumeroDoc() != null) {
            if (clienteRepository.existsByTiendaIdAndTipoDocAndNumeroDocAndIdNot(
                    tiendaId, request.getTipoDocumento(), request.getNumeroDoc(), clienteId)) {
                throw new BadRequestException("Ya existe otro cliente con el mismo tipo y número de documento");
            }
        }
        if (request.getEmail() != null
                && clienteRepository.existsByTiendaIdAndEmailAndIdNot(tiendaId, request.getEmail(), clienteId)) {
            throw new BadRequestException("Ya existe otro cliente con el mismo email");
        }

        cliente.setTipoDoc(request.getTipoDocumento());
        cliente.setNumeroDoc(request.getNumeroDoc());
        cliente.setNombreDoc(request.getNombreDoc());
        cliente.setEmail(request.getEmail());
        cliente.setTelefono(request.getTelefono());
        cliente.setEsUsuarioVirtual(request.getEsUsuarioVirtual());
        cliente.setHashContrasena(request.getHashContrasena());
        cliente.setNotas(request.getNotas());
        if (request.getActivo() != null) {
            cliente.setActivo(request.getActivo());
        }

        Cliente saved = clienteRepository.save(cliente);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long clienteId) {
        Cliente cliente = clienteRepository.findByIdAndTiendaId(clienteId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));
        clienteRepository.delete(cliente);
    }

    private ClienteResponse toResponse(Cliente cliente) {
        return ClienteResponse.builder()
                .id(cliente.getId())
                .tiendaId(cliente.getTiendaId())
                .tipoDoc(cliente.getTipoDoc())
                .numeroDoc(cliente.getNumeroDoc())
                .nombreDoc(cliente.getNombreDoc())
                .email(cliente.getEmail())
                .telefono(cliente.getTelefono())
                .esUsuarioVirtual(cliente.getEsUsuarioVirtual())
                .notas(cliente.getNotas())
                .activo(cliente.getActivo())
                .creadoEn(cliente.getCreadoEn())
                .actualizadoEn(cliente.getActualizadoEn())
                .build();
    }
}