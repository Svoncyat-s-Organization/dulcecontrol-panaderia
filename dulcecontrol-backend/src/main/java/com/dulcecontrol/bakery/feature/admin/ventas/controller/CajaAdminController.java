package com.dulcecontrol.bakery.feature.admin.ventas.controller;

import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.CajaCreateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.CajaResponse;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.CajaUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.service.ICajaAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/ventas/cajas")
@RequiredArgsConstructor
@Validated
public class CajaAdminController {

    private final ICajaAdminService cajaAdminService;

    @GetMapping
    public ResponseEntity<List<CajaResponse>> listar(@PathVariable Long tiendaId,
                                                     @RequestParam(value = "sedeId", required = false) Long sedeId) {
        return ResponseEntity.ok(cajaAdminService.listar(tiendaId, sedeId));
    }

    @GetMapping("/{cajaId}")
    public ResponseEntity<CajaResponse> obtener(@PathVariable Long tiendaId, @PathVariable Long cajaId) {
        return ResponseEntity.ok(cajaAdminService.obtener(tiendaId, cajaId));
    }

    @PostMapping
    public ResponseEntity<CajaResponse> crear(@PathVariable Long tiendaId,
                                              @Valid @RequestBody CajaCreateRequest request) {
        CajaResponse response = cajaAdminService.crear(tiendaId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{cajaId}")
    public ResponseEntity<CajaResponse> actualizar(@PathVariable Long tiendaId,
                                                   @PathVariable Long cajaId,
                                                   @Valid @RequestBody CajaUpdateRequest request) {
        CajaResponse response = cajaAdminService.actualizar(tiendaId, cajaId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{cajaId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long tiendaId, @PathVariable Long cajaId) {
        cajaAdminService.eliminar(tiendaId, cajaId);
        return ResponseEntity.noContent().build();
    }
}
