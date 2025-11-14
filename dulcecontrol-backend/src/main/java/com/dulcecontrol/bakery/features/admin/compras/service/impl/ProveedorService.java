package com.dulcecontrol.bakery.features.admin.compras.service.impl;

import com.dulcecontrol.bakery.features.admin.compras.dto.ProveedorCreateRequest;
import com.dulcecontrol.bakery.features.admin.compras.dto.ProveedorResponse;
import com.dulcecontrol.bakery.features.admin.compras.dto.ProveedorUpdateRequest;
import com.dulcecontrol.bakery.features.admin.compras.entity.Proveedor;
import com.dulcecontrol.bakery.features.admin.compras.repository.ProveedorRepository;
import com.dulcecontrol.bakery.features.admin.compras.service.IProveedorService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProveedorService implements IProveedorService {

    private final ProveedorRepository proveedorRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProveedorResponse> listarPorTienda(Long tiendaId) {
        return proveedorRepository.findAll()
                .stream()
                .filter(proveedor -> proveedor.getTiendaId().equals(tiendaId))
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProveedorResponse> listarActivos(Long tiendaId) {
        return proveedorRepository.findByTiendaIdAndActivoTrue(tiendaId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProveedorResponse obtenerPorId(Long tiendaId, Long proveedorId) {
        Proveedor proveedor = proveedorRepository.findByIdAndTiendaId(proveedorId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado"));
        return toResponse(proveedor);
    }

    @Override
    @Transactional
    public ProveedorResponse crear(ProveedorCreateRequest request) {
        if (proveedorRepository.existsByTiendaIdAndNombreComercial(request.getTiendaId(),
                request.getNombreComercial())) {
            throw new BadRequestException("Ya existe un proveedor con ese nombre comercial");
        }

        Proveedor proveedor = new Proveedor();
        proveedor.setTiendaId(request.getTiendaId());
        proveedor.setNombreComercial(request.getNombreComercial());
        proveedor.setTipoDoc(request.getTipoDoc());
        proveedor.setNumeroDoc(request.getNumeroDoc());
        proveedor.setRazonSocial(request.getRazonSocial());
        proveedor.setNombreContacto(request.getNombreContacto());
        proveedor.setTelefonoContacto(request.getTelefonoContacto());
        proveedor.setEmailContacto(request.getEmailContacto());
        proveedor.setEsGenerico(request.getEsGenerico() != null ? request.getEsGenerico() : Boolean.FALSE);
        proveedor.setActivo(Boolean.TRUE);

        Proveedor guardado = proveedorRepository.save(proveedor);
        return toResponse(guardado);
    }

    @Override
    @Transactional
    public ProveedorResponse actualizar(Long tiendaId, Long proveedorId, ProveedorUpdateRequest request) {
        Proveedor proveedor = proveedorRepository.findByIdAndTiendaId(proveedorId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado"));

        if (!proveedor.getNombreComercial().equalsIgnoreCase(request.getNombreComercial()) &&
                proveedorRepository.existsByTiendaIdAndNombreComercialAndIdNot(tiendaId, request.getNombreComercial(),
                        proveedorId)) {
            throw new BadRequestException("Ya existe un proveedor con ese nombre comercial");
        }

        proveedor.setNombreComercial(request.getNombreComercial());
        proveedor.setTipoDoc(request.getTipoDoc());
        proveedor.setNumeroDoc(request.getNumeroDoc());
        proveedor.setRazonSocial(request.getRazonSocial());
        proveedor.setNombreContacto(request.getNombreContacto());
        proveedor.setTelefonoContacto(request.getTelefonoContacto());
        proveedor.setEmailContacto(request.getEmailContacto());

        if (request.getEsGenerico() != null) {
            proveedor.setEsGenerico(request.getEsGenerico());
        }

        if (request.getActivo() != null) {
            proveedor.setActivo(request.getActivo());
        }

        Proveedor actualizado = proveedorRepository.save(proveedor);
        return toResponse(actualizado);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long proveedorId) {
        Proveedor proveedor = proveedorRepository.findByIdAndTiendaId(proveedorId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado"));

        // Soft delete
        proveedor.setActivo(Boolean.FALSE);
        proveedorRepository.save(proveedor);
    }

    private ProveedorResponse toResponse(Proveedor proveedor) {
        return ProveedorResponse.builder()
                .id(proveedor.getId())
                .tiendaId(proveedor.getTiendaId())
                .nombreComercial(proveedor.getNombreComercial())
                .tipoDoc(proveedor.getTipoDoc())
                .numeroDoc(proveedor.getNumeroDoc())
                .razonSocial(proveedor.getRazonSocial())
                .nombreContacto(proveedor.getNombreContacto())
                .telefonoContacto(proveedor.getTelefonoContacto())
                .emailContacto(proveedor.getEmailContacto())
                .esGenerico(proveedor.getEsGenerico())
                .activo(proveedor.getActivo())
                .creadoEn(proveedor.getCreadoEn())
                .build();
    }
}
