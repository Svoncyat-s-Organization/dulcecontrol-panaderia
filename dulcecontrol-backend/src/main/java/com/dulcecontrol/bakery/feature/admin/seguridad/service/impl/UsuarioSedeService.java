package com.dulcecontrol.bakery.feature.admin.seguridad.service.impl;

import com.dulcecontrol.bakery.feature.admin.seguridad.controller.dto.AsignarSedesRequest;
import com.dulcecontrol.bakery.feature.admin.seguridad.controller.dto.UsuarioSedeResponse;
import com.dulcecontrol.bakery.feature.admin.seguridad.entity.UsuarioSede;
import com.dulcecontrol.bakery.feature.admin.seguridad.entity.UsuarioSedeId;
import com.dulcecontrol.bakery.feature.admin.seguridad.repository.UsuarioSedeRepository;
import com.dulcecontrol.bakery.feature.admin.seguridad.repository.UsuarioTiendaRepository;
import com.dulcecontrol.bakery.feature.admin.seguridad.service.IUsuarioSedeService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioSedeService implements IUsuarioSedeService {

    private final UsuarioSedeRepository usuarioSedeRepository;
    private final UsuarioTiendaRepository usuarioTiendaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioSedeResponse> obtenerSedesPorUsuario(Long tiendaId, Long usuarioId) {
        // Validar que el usuario pertenece a la tienda
        usuarioTiendaRepository.findByIdAndTiendaId(usuarioId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        return usuarioSedeRepository.findByIdUsuarioId(usuarioId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public List<UsuarioSedeResponse> asignarSedes(Long tiendaId, Long usuarioId, AsignarSedesRequest request) {
        // Validar que el usuario pertenece a la tienda
        usuarioTiendaRepository.findByIdAndTiendaId(usuarioId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Validar que la sede principal esté en la lista de sedes
        if (request.getSedePrincipalId() != null && !request.getSedeIds().contains(request.getSedePrincipalId())) {
            throw new BadRequestException("La sede principal debe estar en la lista de sedes asignadas");
        }

        // Eliminar asignaciones actuales
        usuarioSedeRepository.deleteByIdUsuarioId(usuarioId);

        // Crear nuevas asignaciones
        for (Long sedeId : request.getSedeIds()) {
            UsuarioSede usuarioSede = new UsuarioSede();
            UsuarioSedeId id = new UsuarioSedeId(usuarioId, sedeId);
            usuarioSede.setId(id);
            usuarioSede.setEsSedePrincipal(sedeId.equals(request.getSedePrincipalId()));
            usuarioSedeRepository.save(usuarioSede);
        }

        return obtenerSedesPorUsuario(tiendaId, usuarioId);
    }

    @Override
    @Transactional
    public void removerSede(Long tiendaId, Long usuarioId, Long sedeId) {
        // Validar que el usuario pertenece a la tienda
        usuarioTiendaRepository.findByIdAndTiendaId(usuarioId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        UsuarioSedeId id = new UsuarioSedeId(usuarioId, sedeId);
        usuarioSedeRepository.deleteById(id);
    }

    private UsuarioSedeResponse toResponse(UsuarioSede usuarioSede) {
        return UsuarioSedeResponse.builder()
                .usuarioId(usuarioSede.getId().getUsuarioId())
                .sedeId(usuarioSede.getId().getSedeId())
                .sedeNombre(null) // Puede enriquecerse con una consulta a la tabla sedes
                .esSedePrincipal(usuarioSede.getEsSedePrincipal())
                .build();
    }
}
