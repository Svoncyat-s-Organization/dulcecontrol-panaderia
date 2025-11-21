package com.dulcecontrol.bakery.features.admin.configuracion.controller;

import com.dulcecontrol.bakery.features.admin.configuracion.dto.SedeResumenResponse;
import com.dulcecontrol.bakery.features.admin.configuracion.service.IConfiguracionSedeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/configuracion/sedes")
@RequiredArgsConstructor
@Validated
public class ConfiguracionSedeController {

    private final IConfiguracionSedeService configuracionSedeService;

    @GetMapping
    public ResponseEntity<List<SedeResumenResponse>> listar(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(configuracionSedeService.listarAsignadas(tiendaId));
    }
}
