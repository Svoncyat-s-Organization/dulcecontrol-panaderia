package com.dulcecontrol.bakery.feature.admin.ventas.controller;

import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.MovimientoCajaCreateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.MovimientoCajaResponse;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.MovimientoCajaUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.service.IMovimientoCajaAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/ventas/sesiones-caja/{sesionCajaId}/movimientos")
@RequiredArgsConstructor
@Validated
public class MovimientoCajaAdminController {

    private final IMovimientoCajaAdminService movimientoCajaAdminService;

    @GetMapping
    public ResponseEntity<List<MovimientoCajaResponse>> listar(@PathVariable Long tiendaId, @PathVariable Long sesionCajaId) {
        return ResponseEntity.ok(movimientoCajaAdminService.listar(tiendaId, sesionCajaId));
    }

    @GetMapping("/{movimientoId}")
    public ResponseEntity<MovimientoCajaResponse> obtener(@PathVariable Long tiendaId,
                                                          @PathVariable Long sesionCajaId,
                                                          @PathVariable Long movimientoId) {
        return ResponseEntity.ok(movimientoCajaAdminService.obtener(tiendaId, sesionCajaId, movimientoId));
    }

    @PostMapping
    public ResponseEntity<MovimientoCajaResponse> crear(@PathVariable Long tiendaId,
                                                        @PathVariable Long sesionCajaId,
                                                        @Valid @RequestBody MovimientoCajaCreateRequest request) {
        MovimientoCajaResponse response = movimientoCajaAdminService.crear(tiendaId, sesionCajaId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{movimientoId}")
    public ResponseEntity<MovimientoCajaResponse> actualizar(@PathVariable Long tiendaId,
                                                             @PathVariable Long sesionCajaId,
                                                             @PathVariable Long movimientoId,
                                                             @Valid @RequestBody MovimientoCajaUpdateRequest request) {
        MovimientoCajaResponse response = movimientoCajaAdminService.actualizar(tiendaId, sesionCajaId, movimientoId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{movimientoId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long tiendaId,
                                         @PathVariable Long sesionCajaId,
                                         @PathVariable Long movimientoId) {
        movimientoCajaAdminService.eliminar(tiendaId, sesionCajaId, movimientoId);
        return ResponseEntity.noContent().build();
    }
}
