package com.dulcecontrol.bakery.feature.superadmin.seguridad.service.impl;

import com.dulcecontrol.bakery.feature.superadmin.seguridad.dto.UsuarioSuperadminCreateRequest;
import com.dulcecontrol.bakery.feature.superadmin.seguridad.dto.UsuarioSuperadminResponse;
import com.dulcecontrol.bakery.feature.superadmin.seguridad.dto.UsuarioSuperadminUpdateRequest;
import com.dulcecontrol.bakery.feature.superadmin.seguridad.entity.UsuarioSuperadmin;
import com.dulcecontrol.bakery.feature.superadmin.seguridad.repository.UsuarioSuperadminRepository;
import com.dulcecontrol.bakery.feature.superadmin.seguridad.service.IUsuarioSuperadminService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioSuperadminService implements IUsuarioSuperadminService {

    private final UsuarioSuperadminRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;

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

        UsuarioSuperadmin usuario = new UsuarioSuperadmin();
        usuario.setCorreo(correoNormalizado);
        usuario.setHashContrasena(passwordEncoder.encode(request.getContrasena()));
        usuario.setTipoDoc(request.getTipoDoc());
        usuario.setNumeroDoc(numeroDocNormalizado);
        usuario.setNombres(request.getNombres());
        usuario.setTelefono(limpiar(request.getTelefono()));
        usuario.setActivo(Boolean.TRUE);

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

    private UsuarioSuperadminResponse toResponse(UsuarioSuperadmin usuario) {
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
                .build();
    }
}
