package com.dulcecontrol.bakery.features.superadmin.seguridad.service.impl;

import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.PerfilUpdateRequest;
import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.RolSuperadminSummaryResponse;
import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.UsuarioSuperadminCreateRequest;
import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.UsuarioSuperadminResponse;
import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.UsuarioSuperadminUpdateRequest;
import com.dulcecontrol.bakery.features.superadmin.seguridad.entity.RolSuperadmin;
import com.dulcecontrol.bakery.features.superadmin.seguridad.entity.UsuarioSuperadmin;
import com.dulcecontrol.bakery.features.superadmin.seguridad.repository.RolSuperadminRepository;
import com.dulcecontrol.bakery.features.superadmin.seguridad.repository.UsuarioSuperadminRepository;
import com.dulcecontrol.bakery.features.superadmin.seguridad.service.IUsuarioSuperadminService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioSuperadminService implements IUsuarioSuperadminService {

    private final UsuarioSuperadminRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final RolSuperadminRepository rolRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioSuperadminResponse> listar() {
        return usuarioRepository.findAll(Sort.by(Sort.Direction.DESC, "creadoEn")).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioSuperadminResponse obtenerPorId(Long id) {
        UsuarioSuperadmin usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Superadministrador no encontrado"));
        return toResponse(usuario);
    }

    @Override
    @Transactional
    public UsuarioSuperadminResponse crear(UsuarioSuperadminCreateRequest request) {
        String correoNormalizado = request.getCorreo().toLowerCase();
        String numeroDocNormalizado = limpiar(request.getNumeroDoc());
        validarDuplicadosAlCrear(correoNormalizado, numeroDocNormalizado);

        Set<RolSuperadmin> rolesAsignados = resolverRoles(request.getRoles(), true);

        UsuarioSuperadmin usuario = new UsuarioSuperadmin();
        usuario.setCorreo(correoNormalizado);
        usuario.setHashContrasena(passwordEncoder.encode(request.getContrasena()));
        usuario.setTipoDoc(request.getTipoDoc());
        usuario.setNumeroDoc(numeroDocNormalizado);
        usuario.setNombres(request.getNombres());
        usuario.setTelefono(limpiar(request.getTelefono()));
        usuario.setActivo(Boolean.TRUE);
        usuario.setRoles(new HashSet<>(rolesAsignados));

        UsuarioSuperadmin guardado = usuarioRepository.save(usuario);
        return toResponse(guardado);
    }

    @Override
    @Transactional
    public UsuarioSuperadminResponse actualizar(Long id, UsuarioSuperadminUpdateRequest request) {
        UsuarioSuperadmin usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Superadministrador no encontrado"));

        String correoNormalizado = request.getCorreo().toLowerCase();
        String numeroDocNormalizado = limpiar(request.getNumeroDoc());
        if (!usuario.getCorreo().equalsIgnoreCase(correoNormalizado) &&
                usuarioRepository.existsByCorreoAndIdNot(correoNormalizado, id)) {
            throw new BadRequestException("El correo ya está registrado");
        }

        if (numeroDocNormalizado != null) {
            boolean cambioNumeroDoc = usuario.getNumeroDoc() == null ||
                    !usuario.getNumeroDoc().equals(numeroDocNormalizado);
            if (cambioNumeroDoc && usuarioRepository.existsByNumeroDocAndIdNot(numeroDocNormalizado, id)) {
                throw new BadRequestException("El documento ya está registrado");
            }
        }

        usuario.setCorreo(correoNormalizado);
        usuario.setTipoDoc(request.getTipoDoc());
        usuario.setNumeroDoc(numeroDocNormalizado);
        usuario.setNombres(request.getNombres());
        usuario.setTelefono(limpiar(request.getTelefono()));

        if (request.getActivo() != null) {
            usuario.setActivo(request.getActivo());
        }

        if (request.getNuevaContrasena() != null && !request.getNuevaContrasena().isBlank()) {
            usuario.setHashContrasena(passwordEncoder.encode(request.getNuevaContrasena()));
        }

        if (request.getRoles() != null) {
            Set<RolSuperadmin> roles = resolverRoles(request.getRoles(), true);
            usuario.setRoles(new HashSet<>(roles));
        }

        UsuarioSuperadmin actualizado = usuarioRepository.save(usuario);
        return toResponse(actualizado);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        UsuarioSuperadmin usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Superadministrador no encontrado"));
        usuarioRepository.delete(usuario);
    }

    private void validarDuplicadosAlCrear(String correo, String numeroDoc) {
        if (usuarioRepository.existsByCorreo(correo)) {
            throw new BadRequestException("El correo ya está registrado");
        }
        if (numeroDoc != null && usuarioRepository.existsByNumeroDoc(numeroDoc)) {
            throw new BadRequestException("El documento ya está registrado");
        }
    }

    private String limpiar(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }

    private Set<RolSuperadmin> resolverRoles(Set<Long> rolesIds, boolean obligatorio) {
        if (rolesIds == null || rolesIds.isEmpty()) {
            if (obligatorio) {
                throw new BadRequestException("Debe asignar al menos un rol");
            }
            return Set.of();
        }

        List<RolSuperadmin> encontrados = rolRepository.findAllById(rolesIds);
        if (encontrados.size() != rolesIds.size()) {
            throw new BadRequestException("Uno o más roles no existen");
        }
        return new HashSet<>(encontrados);
    }

    private UsuarioSuperadminResponse toResponse(UsuarioSuperadmin usuario) {
        Set<RolSuperadmin> roles = usuario.getRoles() == null ? Set.of() : usuario.getRoles();

        return UsuarioSuperadminResponse.builder()
                .id(usuario.getId())
                .correo(usuario.getCorreo())
                .tipoDoc(usuario.getTipoDoc())
                .numeroDoc(usuario.getNumeroDoc())
                .nombres(usuario.getNombres())
                .telefono(usuario.getTelefono())
                .activo(usuario.getActivo())
                .creadoEn(usuario.getCreadoEn())
                .actualizadoEn(usuario.getActualizadoEn())
            .roles(roles.stream()
                        .sorted(Comparator.comparing(RolSuperadmin::getNombre, String.CASE_INSENSITIVE_ORDER))
                        .map(rol -> RolSuperadminSummaryResponse.builder()
                                .id(rol.getId())
                                .nombre(rol.getNombre())
                                .esSistema(rol.getEsSistema())
                                .build())
                        .collect(Collectors.toCollection(LinkedHashSet::new)))
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public UsuarioSuperadminResponse obtenerMiPerfil(Long usuarioId) {
        UsuarioSuperadmin usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return toResponse(usuario);
    }
    
    @Override
    @Transactional
    public UsuarioSuperadminResponse actualizarMiPerfil(Long usuarioId, PerfilUpdateRequest request) {
        UsuarioSuperadmin usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        // Validar correo si cambió
        if (request.getCorreo() != null && !request.getCorreo().isBlank()) {
            String correoNormalizado = request.getCorreo().toLowerCase();
            if (!usuario.getCorreo().equalsIgnoreCase(request.getCorreo()) &&
                usuarioRepository.existsByCorreoAndIdNot(correoNormalizado, usuarioId)) {
                throw new BadRequestException("El correo ya está registrado");
            }
            usuario.setCorreo(correoNormalizado);
        }
        
        // Actualizar nombres si se proporcionó
        if (request.getNombres() != null && !request.getNombres().isBlank()) {
            usuario.setNombres(request.getNombres());
        }
        
        // Actualizar teléfono si se proporcionó
        if (request.getTelefono() != null && !request.getTelefono().isBlank()) {
            usuario.setTelefono(request.getTelefono());
        }
        
        // Actualizar contraseña si se proporcionó
        if (request.getNuevaContrasena() != null && !request.getNuevaContrasena().isBlank()) {
            // Validar contraseña actual primero
            if (request.getContrasenaActual() == null || request.getContrasenaActual().isBlank()) {
                throw new BadRequestException("Debes proporcionar tu contraseña actual para cambiarla");
            }
            
            if (!passwordEncoder.matches(request.getContrasenaActual(), usuario.getHashContrasena())) {
                throw new BadRequestException("La contraseña actual es incorrecta");
            }
            
            usuario.setHashContrasena(passwordEncoder.encode(request.getNuevaContrasena()));
        }
        
        UsuarioSuperadmin guardado = usuarioRepository.save(usuario);
        return toResponse(guardado);
    }
}
