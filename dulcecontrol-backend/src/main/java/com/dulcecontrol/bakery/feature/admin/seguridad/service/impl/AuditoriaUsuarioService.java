package com.dulcecontrol.bakery.feature.admin.seguridad.service.impl;

import com.dulcecontrol.bakery.feature.admin.seguridad.controller.dto.AuditoriaUsuarioResponse;
import com.dulcecontrol.bakery.feature.admin.seguridad.entity.AuditoriaUsuario;
import com.dulcecontrol.bakery.feature.admin.seguridad.entity.UsuarioTienda;
import com.dulcecontrol.bakery.feature.admin.seguridad.repository.AuditoriaUsuarioRepository;
import com.dulcecontrol.bakery.feature.admin.seguridad.repository.UsuarioTiendaRepository;
import com.dulcecontrol.bakery.feature.admin.seguridad.service.IAuditoriaUsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuditoriaUsuarioService implements IAuditoriaUsuarioService {

    private final AuditoriaUsuarioRepository auditoriaRepository;
    private final UsuarioTiendaRepository usuarioRepository;

    @Override
    @Transactional
    public void registrarAccion(Long tiendaId, Long usuarioId, String accion, String entidad,
            Long entidadId, Map<String, Object> valoresAnteriores,
            Map<String, Object> valoresNuevos, String ipOrigen, String userAgent) {

        AuditoriaUsuario auditoria = new AuditoriaUsuario();
        auditoria.setTiendaId(tiendaId);
        auditoria.setUsuarioId(usuarioId);
        auditoria.setAccion(accion);
        auditoria.setEntidad(entidad);
        auditoria.setEntidadId(entidadId);
        auditoria.setValoresAnteriores(valoresAnteriores);
        auditoria.setValoresNuevos(valoresNuevos);
        auditoria.setIpOrigen(ipOrigen);
        auditoria.setUserAgent(userAgent);

        auditoriaRepository.save(auditoria);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditoriaUsuarioResponse> listarPorTienda(Long tiendaId) {
        return auditoriaRepository.findByTiendaIdOrderByCreadoEnDesc(tiendaId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditoriaUsuarioResponse> listarPorTiendaPaginado(Long tiendaId, Pageable pageable) {
        return auditoriaRepository.findByTiendaIdOrderByCreadoEnDesc(tiendaId, pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditoriaUsuarioResponse> listarPorUsuario(Long usuarioId) {
        return auditoriaRepository.findByUsuarioIdOrderByCreadoEnDesc(usuarioId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditoriaUsuarioResponse> listarPorRangoFechas(Long tiendaId, LocalDateTime inicio,
            LocalDateTime fin) {
        return auditoriaRepository.findByTiendaIdAndCreadoEnBetweenOrderByCreadoEnDesc(tiendaId, inicio, fin)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private AuditoriaUsuarioResponse toResponse(AuditoriaUsuario auditoria) {
        String usuarioNombre = null;
        if (auditoria.getUsuarioId() != null) {
            Optional<UsuarioTienda> usuario = usuarioRepository.findById(auditoria.getUsuarioId());
            usuarioNombre = usuario.map(UsuarioTienda::getNombres).orElse(null);
        }

        return AuditoriaUsuarioResponse.builder()
                .id(auditoria.getId())
                .tiendaId(auditoria.getTiendaId())
                .usuarioId(auditoria.getUsuarioId())
                .usuarioNombre(usuarioNombre)
                .accion(auditoria.getAccion())
                .entidad(auditoria.getEntidad())
                .entidadId(auditoria.getEntidadId())
                .valoresAnteriores(auditoria.getValoresAnteriores())
                .valoresNuevos(auditoria.getValoresNuevos())
                .ipOrigen(auditoria.getIpOrigen())
                .creadoEn(auditoria.getCreadoEn())
                .build();
    }
}
