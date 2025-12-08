package com.dulcecontrol.bakery.features.shared.ubigeo.controller;

import com.dulcecontrol.bakery.features.shared.ubigeo.dto.DepartamentoResponse;
import com.dulcecontrol.bakery.features.shared.ubigeo.dto.DistritoResponse;
import com.dulcecontrol.bakery.features.shared.ubigeo.dto.ProvinciaResponse;
import com.dulcecontrol.bakery.features.shared.ubigeo.service.IUbigeoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ubigeo")
@RequiredArgsConstructor
public class UbigeoController {

    private final IUbigeoService ubigeoService;

    @GetMapping("/departamentos")
    public ResponseEntity<List<DepartamentoResponse>> obtenerDepartamentos() {
        return ResponseEntity.ok(ubigeoService.obtenerDepartamentos());
    }

    @GetMapping("/departamentos/{departamentoId}/provincias")
    public ResponseEntity<List<ProvinciaResponse>> obtenerProvincias(
            @PathVariable Long departamentoId) {
        return ResponseEntity.ok(ubigeoService.obtenerProvinciasPorDepartamento(departamentoId));
    }

    @GetMapping("/provincias/{provinciaId}/distritos")
    public ResponseEntity<List<DistritoResponse>> obtenerDistritos(
            @PathVariable Long provinciaId) {
        return ResponseEntity.ok(ubigeoService.obtenerDistritosPorProvincia(provinciaId));
    }
}
