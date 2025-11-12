package com.dulcecontrol.bakery.feature.admin.inventario.controller;

import com.dulcecontrol.bakery.feature.admin.inventario.controller.dto.InventarioInsumoSedeDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.service.IInventarioInsumoSedeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/inventario/insumos")
@RequiredArgsConstructor
@Validated
public class InventarioInsumoSedeController {

    private final IInventarioInsumoSedeService service;

    @GetMapping
    public ResponseEntity<List<InventarioInsumoSedeDTO>> listar(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(service.listarPorTienda(tiendaId));
    }

    @GetMapping("/sede/{sedeId}")
    public ResponseEntity<List<InventarioInsumoSedeDTO>> listarPorSede(
            @PathVariable Long tiendaId,
            @PathVariable Long sedeId) {
        return ResponseEntity.ok(service.listarPorTiendaYSede(tiendaId, sedeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventarioInsumoSedeDTO> obtener(
            @PathVariable Long tiendaId,
            @PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(tiendaId, id));
    }

    @GetMapping("/sede/{sedeId}/bajo-stock")
    public ResponseEntity<List<InventarioInsumoSedeDTO>> listarBajoStock(
            @PathVariable Long tiendaId,
            @PathVariable Long sedeId,
            @RequestParam(defaultValue = "10") BigDecimal cantidadMinima) {
        return ResponseEntity.ok(service.listarBajoStock(tiendaId, sedeId, cantidadMinima));
    }

    @PostMapping
    public ResponseEntity<InventarioInsumoSedeDTO> crear(
            @PathVariable Long tiendaId,
            @Valid @RequestBody InventarioInsumoSedeDTO dto) {
        InventarioInsumoSedeDTO creado = service.crear(tiendaId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventarioInsumoSedeDTO> actualizar(
            @PathVariable Long tiendaId,
            @PathVariable Long id,
            @Valid @RequestBody InventarioInsumoSedeDTO dto) {
        InventarioInsumoSedeDTO actualizado = service.actualizar(tiendaId, id, dto);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long tiendaId,
            @PathVariable Long id) {
        service.eliminar(tiendaId, id);
        return ResponseEntity.noContent().build();
    }
}
