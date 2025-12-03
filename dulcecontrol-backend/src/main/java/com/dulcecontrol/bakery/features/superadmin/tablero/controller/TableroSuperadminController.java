package com.dulcecontrol.bakery.features.superadmin.tablero.controller;

import com.dulcecontrol.bakery.features.superadmin.tablero.dto.TableroSuperadminResponse;
import com.dulcecontrol.bakery.features.superadmin.tablero.service.ITableroSuperadminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/superadmin/tablero")
@RequiredArgsConstructor
@Validated
public class TableroSuperadminController {

    private final ITableroSuperadminService tableroSuperadminService;

    @GetMapping("/estadisticas")
    public ResponseEntity<TableroSuperadminResponse> obtenerEstadisticas() {
        try {
            TableroSuperadminResponse estadisticas = tableroSuperadminService.obtenerEstadisticas();
            return ResponseEntity.ok(estadisticas);
        } catch (Exception e) {
            e.printStackTrace(); // Esto imprimirá el error en la consola del backend
            throw e;
        }
    }
}
