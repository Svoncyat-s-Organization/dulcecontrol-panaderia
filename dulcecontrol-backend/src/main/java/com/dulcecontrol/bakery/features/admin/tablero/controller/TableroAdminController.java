package com.dulcecontrol.bakery.features.admin.tablero.controller;

import com.dulcecontrol.bakery.features.admin.tablero.dto.TableroAdminResponse;
import com.dulcecontrol.bakery.features.admin.tablero.service.ITableroAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/tablero")
@RequiredArgsConstructor
@Validated
public class TableroAdminController {

    private final ITableroAdminService tableroAdminService;

    @GetMapping("/estadisticas")
    public ResponseEntity<TableroAdminResponse> obtenerEstadisticas(
            @PathVariable Long tiendaId,
            @RequestParam(value = "sedeId", required = false) Long sedeId) {
        
        try {
            TableroAdminResponse estadisticas = tableroAdminService.obtenerEstadisticas(tiendaId, sedeId);
            return ResponseEntity.ok(estadisticas);
        } catch (Exception e) {
            e.printStackTrace(); // Esto imprimirá el error en la consola del backend
            throw e;
        }
    }
}
