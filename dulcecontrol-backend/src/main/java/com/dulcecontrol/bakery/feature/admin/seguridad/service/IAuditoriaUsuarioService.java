package com.dulcecontrol.bakery.feature.admin.seguridad.service;

import com.dulcecontrol.bakery.feature.admin.seguridad.dto.AuditoriaUsuarioResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface IAuditoriaUsuarioService {

    void registrarAccion(Long tiendaId, Long usuarioId, String accion, String entidad,
            Long entidadId, Map<String, Object> valoresAnteriores,
            Map<String, Object> valoresNuevos, String ipOrigen, String userAgent);

    List<AuditoriaUsuarioResponse> listarPorTienda(Long tiendaId);

    Page<AuditoriaUsuarioResponse> listarPorTiendaPaginado(Long tiendaId, Pageable pageable);

    List<AuditoriaUsuarioResponse> listarPorUsuario(Long usuarioId);

    List<AuditoriaUsuarioResponse> listarPorRangoFechas(Long tiendaId, LocalDateTime inicio, LocalDateTime fin);
}
