package com.dulcecontrol.bakery.features.admin.ubigeo.controller;

import com.dulcecontrol.bakery.features.admin.ubigeo.dto.UbigeoDepartamentoResponse;
import com.dulcecontrol.bakery.features.admin.ubigeo.dto.UbigeoDistritoResponse;
import com.dulcecontrol.bakery.features.admin.ubigeo.dto.UbigeoProvinciaResponse;
import com.dulcecontrol.bakery.features.admin.ubigeo.dto.UbigeoRutaResponse;
import com.dulcecontrol.bakery.features.admin.ubigeo.service.IUbigeoAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/ubigeo")
@RequiredArgsConstructor
public class UbigeoAdminController {

    private final IUbigeoAdminService ubigeoAdminService;

    @GetMapping("/departamentos")
    public ResponseEntity<List<UbigeoDepartamentoResponse>> listarDepartamentos() {
        return ResponseEntity.ok(ubigeoAdminService.listarDepartamentos());
    }

    @GetMapping("/departamentos/{departamentoId}/provincias")
    public ResponseEntity<List<UbigeoProvinciaResponse>> listarProvincias(@PathVariable Long departamentoId) {
        return ResponseEntity.ok(ubigeoAdminService.listarProvinciasPorDepartamento(departamentoId));
    }

    @GetMapping("/provincias/{provinciaId}/distritos")
    public ResponseEntity<List<UbigeoDistritoResponse>> listarDistritos(@PathVariable Long provinciaId) {
        return ResponseEntity.ok(ubigeoAdminService.listarDistritosPorProvincia(provinciaId));
    }

    @GetMapping("/distritos/{distritoId}/ruta")
    public ResponseEntity<UbigeoRutaResponse> obtenerRutaPorDistrito(@PathVariable Long distritoId) {
        return ResponseEntity.ok(ubigeoAdminService.obtenerRutaPorDistrito(distritoId));
    }
}
