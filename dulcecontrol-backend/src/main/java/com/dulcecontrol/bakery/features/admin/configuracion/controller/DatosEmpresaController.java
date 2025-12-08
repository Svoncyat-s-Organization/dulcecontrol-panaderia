package com.dulcecontrol.bakery.features.admin.configuracion.controller;

import com.dulcecontrol.bakery.features.admin.configuracion.dto.DatosEmpresaResponse;
import com.dulcecontrol.bakery.features.admin.configuracion.dto.DatosEmpresaUpdateRequest;
import com.dulcecontrol.bakery.features.admin.configuracion.service.IDatosEmpresaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/configuracion/datos-empresa")
@RequiredArgsConstructor
@Validated
public class DatosEmpresaController {

    private final IDatosEmpresaService datosEmpresaService;

    @GetMapping
    public ResponseEntity<DatosEmpresaResponse> obtener(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(datosEmpresaService.obtenerPorTiendaId(tiendaId));
    }

    @PutMapping
    public ResponseEntity<DatosEmpresaResponse> actualizar(
            @PathVariable Long tiendaId,
            @Valid @RequestBody DatosEmpresaUpdateRequest request) {
        DatosEmpresaResponse response = datosEmpresaService.actualizar(tiendaId, request);
        return ResponseEntity.ok(response);
    }
}
