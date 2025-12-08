package com.dulcecontrol.bakery.features.superadmin.facturacion.controller;

import com.dulcecontrol.bakery.features.superadmin.facturacion.dto.MetodoPagoRequest;
import com.dulcecontrol.bakery.features.superadmin.facturacion.dto.MetodoPagoResponse;
import com.dulcecontrol.bakery.features.superadmin.facturacion.service.IMetodoPagoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/superadmin/facturacion/metodos-pago")
@RequiredArgsConstructor
@Validated
public class MetodoPagoController {

    private final IMetodoPagoService metodoPagoService;

    @GetMapping
    public ResponseEntity<List<MetodoPagoResponse>> listar() {
        return ResponseEntity.ok(metodoPagoService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MetodoPagoResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(metodoPagoService.obtener(id));
    }

    @PostMapping
    public ResponseEntity<MetodoPagoResponse> crear(@Valid @RequestBody MetodoPagoRequest request) {
        return new ResponseEntity<>(metodoPagoService.crear(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MetodoPagoResponse> actualizar(@PathVariable Long id,
            @Valid @RequestBody MetodoPagoRequest request) {
        return ResponseEntity.ok(metodoPagoService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        metodoPagoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
