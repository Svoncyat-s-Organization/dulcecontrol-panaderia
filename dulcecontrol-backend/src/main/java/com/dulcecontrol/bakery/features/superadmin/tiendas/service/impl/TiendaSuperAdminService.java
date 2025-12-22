package com.dulcecontrol.bakery.features.superadmin.tiendas.service.impl;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dulcecontrol.bakery.features.admin.clientes.entity.Cliente;
import com.dulcecontrol.bakery.features.admin.clientes.repository.ClienteRepository;
import com.dulcecontrol.bakery.features.admin.seguridad.service.RolSistemaBootstrapService;
import com.dulcecontrol.bakery.features.superadmin.tiendas.dto.TiendaCreateRequest;
import com.dulcecontrol.bakery.features.superadmin.tiendas.dto.TiendaResponse;
import com.dulcecontrol.bakery.features.superadmin.tiendas.dto.TiendaUpdateRequest;
import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.Tienda;
import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.enums.EstadoTienda;
import com.dulcecontrol.bakery.features.superadmin.tiendas.repository.TiendaRepository;
import com.dulcecontrol.bakery.features.superadmin.tiendas.service.ITiendaSuperAdminService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TiendaSuperAdminService implements ITiendaSuperAdminService {

    private final TiendaRepository tiendaRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final RolSistemaBootstrapService rolSistemaBootstrapService;
    private final ClienteRepository clienteRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TiendaResponse> listar() {
        return tiendaRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TiendaResponse obtenerPorId(Long tiendaId) {
        Tienda tienda = obtenerEntidad(tiendaId);
        return toResponse(tienda);
    }

    @Override
    @Transactional
    public TiendaResponse crear(TiendaCreateRequest request) {
        String slugNormalizado = normalizarSlug(request.getSlug());
        validarUnicidadCreacion(slugNormalizado, request);

        Tienda tienda = Tienda.builder()
                .slug(slugNormalizado)
                .tipoDoc(request.getTipoDoc())
                .numeroDoc(request.getNumeroDoc().trim())
                .nombreDoc(request.getNombreDoc().trim())
                .nombreComercial(request.getNombreComercial())
                .correoContacto(request.getCorreoContacto().trim().toLowerCase())
                .telefonoContacto(request.getTelefonoContacto())
                .hashContrasena(passwordEncoder.encode(request.getContrasena()))
                .estado(request.getEstado() != null ? request.getEstado() : EstadoTienda.EN_PRUEBA)
                .build();

        Tienda guardada = tiendaRepository.save(tienda);
        rolSistemaBootstrapService.ensureDefaultRoles(guardada.getId());
        crearClienteGenerico(guardada.getId());
        return toResponse(guardada);
    }

    /**
     * Crea un cliente genérico para la tienda.
     * Este cliente se usa para ventas rápidas sin documento del cliente.
     */
    private void crearClienteGenerico(Long tiendaId) {
        // Verificar si ya existe cliente genérico
        if (clienteRepository.existsByTiendaIdAndNumeroDoc(tiendaId, "00000000")) {
            log.info("Cliente genérico ya existe para tienda {}", tiendaId);
            return;
        }

        Cliente clienteGenerico = new Cliente();
        clienteGenerico.setTiendaId(tiendaId);
        clienteGenerico.setTipoDoc(null);
        clienteGenerico.setNumeroDoc("00000000");
        clienteGenerico.setNombreDoc("CLIENTE GENÉRICO");
        clienteGenerico.setEmail(null);
        clienteGenerico.setTelefono(null);
        clienteGenerico.setEsUsuarioVirtual(false);
        clienteGenerico.setHashContrasena(null);
        clienteGenerico.setNotas("Cliente genérico para ventas sin identificación. Creado automáticamente por el sistema.");
        clienteGenerico.setActivo(true);

        clienteRepository.save(clienteGenerico);
        log.info("Cliente genérico creado automáticamente para tienda {}", tiendaId);
    }

    @Override
    @Transactional
    public TiendaResponse actualizar(Long tiendaId, TiendaUpdateRequest request) {
        Tienda tienda = obtenerEntidad(tiendaId);

        String slugNormalizado = normalizarSlug(request.getSlug());
        validarUnicidadActualizacion(tiendaId, slugNormalizado, request);

        tienda.setSlug(slugNormalizado);
        tienda.setTipoDoc(request.getTipoDoc());
        tienda.setNumeroDoc(request.getNumeroDoc().trim());
        tienda.setNombreDoc(request.getNombreDoc().trim());
        tienda.setNombreComercial(request.getNombreComercial());
        tienda.setCorreoContacto(request.getCorreoContacto().trim().toLowerCase());
        tienda.setTelefonoContacto(request.getTelefonoContacto());
        tienda.setEstado(request.getEstado());

        if (request.getNuevaContrasena() != null && !request.getNuevaContrasena().isBlank()) {
            tienda.setHashContrasena(passwordEncoder.encode(request.getNuevaContrasena()));
        }

        Tienda actualizada = tiendaRepository.save(tienda);
        return toResponse(actualizada);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId) {
        Tienda tienda = obtenerEntidad(tiendaId);
        tiendaRepository.delete(tienda);
    }

    private Tienda obtenerEntidad(Long tiendaId) {
        return tiendaRepository.findById(tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("La tienda solicitada no existe"));
    }

    private void validarUnicidadCreacion(String slugNormalizado, TiendaCreateRequest request) {
        if (tiendaRepository.existsBySlug(slugNormalizado)) {
            throw new BadRequestException("Ya existe una tienda con el mismo slug");
        }
        if (tiendaRepository.existsByNumeroDoc(request.getNumeroDoc())) {
            throw new BadRequestException("Ya existe una tienda con el mismo numero de documento");
        }
        if (tiendaRepository.existsByCorreoContacto(request.getCorreoContacto().trim().toLowerCase())) {
            throw new BadRequestException("Ya existe una tienda con el mismo correo de contacto");
        }
    }

    private void validarUnicidadActualizacion(Long tiendaId, String slugNormalizado, TiendaUpdateRequest request) {
        if (tiendaRepository.existsBySlugAndIdNot(slugNormalizado, tiendaId)) {
            throw new BadRequestException("El slug ya esta en uso por otra tienda");
        }
        if (tiendaRepository.existsByNumeroDocAndIdNot(request.getNumeroDoc(), tiendaId)) {
            throw new BadRequestException("Ya existe otra tienda con el mismo numero de documento");
        }
        if (tiendaRepository.existsByCorreoContactoAndIdNot(request.getCorreoContacto().trim().toLowerCase(), tiendaId)) {
            throw new BadRequestException("Ya existe otra tienda con el mismo correo de contacto");
        }
    }

    private TiendaResponse toResponse(Tienda tienda) {
        return TiendaResponse.builder()
                .id(tienda.getId())
                .slug(tienda.getSlug())
                .tipoDoc(tienda.getTipoDoc())
                .numeroDoc(tienda.getNumeroDoc())
                .nombreDoc(tienda.getNombreDoc())
                .nombreComercial(tienda.getNombreComercial())
                .correoContacto(tienda.getCorreoContacto())
                .telefonoContacto(tienda.getTelefonoContacto())
                .estado(tienda.getEstado())
                .creadoEn(tienda.getCreadoEn())
                .actualizadoEn(tienda.getActualizadoEn())
                .build();
    }

    private String normalizarSlug(String slug) {
        return slug.trim().toLowerCase();
    }
}
