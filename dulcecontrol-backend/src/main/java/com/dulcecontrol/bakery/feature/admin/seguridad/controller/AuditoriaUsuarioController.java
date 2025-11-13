package com.dulcecontrol.bakery.feature.admin.seguridad.controller;

import com.dulcecontrol.bakery.feature.admin.seguridad.controller.dto.AuditoriaUsuarioResponse;
import com.dulcecontrol.bakery.feature.admin.seguridad.service.IAuditoriaUsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/seguridad/auditoria")
@RequiredArgsConstructor
public class AuditoriaUsuarioController {

    private final IAuditoriaUsuarioService auditoriaService;

    @GetMapping
    public ResponseEntity<Page<AuditoriaUsuarioResponse>> listarPaginado(
            @PathVariable Long tiendaId,
            @PageableDefault(size = 50, sort = "creadoEn", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(auditoriaService.listarPorTiendaPaginado(tiendaId, pageable));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<AuditoriaUsuarioResponse>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(auditoriaService.listarPorUsuario(usuarioId));
    }

    @GetMapping("/rango")
    public ResponseEntity<List<AuditoriaUsuarioResponse>> listarPorRangoFechas(
            @PathVariable Long tiendaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return ResponseEntity.ok(auditoriaService.listarPorRangoFechas(tiendaId, inicio, fin));
    }
}
