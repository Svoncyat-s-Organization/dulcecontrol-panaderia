package com.dulcecontrol.bakery.features.superadmin.facturacion.controller;

import com.dulcecontrol.bakery.features.superadmin.facturacion.dto.SerieCreateRequest;
import com.dulcecontrol.bakery.features.superadmin.facturacion.dto.SerieResponse;
import com.dulcecontrol.bakery.features.superadmin.facturacion.dto.SerieUpdateRequest;
import com.dulcecontrol.bakery.features.superadmin.facturacion.service.ISerieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/superadmin/facturacion/series")
@RequiredArgsConstructor
@Validated
public class SerieController {

    private final ISerieService serieService;

    @GetMapping
    public ResponseEntity<List<SerieResponse>> listar() {
        return ResponseEntity.ok(serieService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SerieResponse> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(serieService.obtener(id));
    }

    @PostMapping
    public ResponseEntity<SerieResponse> crear(@Valid @RequestBody SerieCreateRequest request) {
        SerieResponse response = serieService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SerieResponse> actualizar(@PathVariable Integer id, @Valid @RequestBody SerieUpdateRequest request) {
        return ResponseEntity.ok(serieService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        serieService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}