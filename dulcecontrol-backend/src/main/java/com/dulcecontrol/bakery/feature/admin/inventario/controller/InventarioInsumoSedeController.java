package com.dulcecontrol.bakery.feature.admin.inventario.controller;

import com.dulcecontrol.bakery.feature.admin.inventario.controller.dto.InventarioInsumoSedeDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.service.IInventarioInsumoSedeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/inventario/insumos")
@RequiredArgsConstructor
public class InventarioInsumoSedeController {

    private final IInventarioInsumoSedeService service;

    @GetMapping
    public ResponseEntity<List<InventarioInsumoSedeDTO>> obtenerTodos() {
        return ResponseEntity.ok(service.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventarioInsumoSedeDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @GetMapping("/tienda/{tiendaId}")
    public ResponseEntity<List<InventarioInsumoSedeDTO>> obtenerPorTienda(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(service.obtenerPorTienda(tiendaId));
    }

    @GetMapping("/sede/{sedeId}")
    public ResponseEntity<List<InventarioInsumoSedeDTO>> obtenerPorSede(@PathVariable Long sedeId) {
        return ResponseEntity.ok(service.obtenerPorSede(sedeId));
    }

    @GetMapping("/sede/{sedeId}/insumo/{insumoId}")
    public ResponseEntity<InventarioInsumoSedeDTO> obtenerPorSedeEInsumo(
            @PathVariable Long sedeId,
            @PathVariable Long insumoId) {
        return ResponseEntity.ok(service.obtenerPorSedeEInsumo(sedeId, insumoId));
    }

    @GetMapping("/sede/{sedeId}/bajo")
    public ResponseEntity<List<InventarioInsumoSedeDTO>> obtenerInventarioBajo(
            @PathVariable Long sedeId,
            @RequestParam(defaultValue = "10.0") BigDecimal cantidadMinima) {
        return ResponseEntity.ok(service.obtenerInventarioBajo(sedeId, cantidadMinima));
    }

    @PostMapping
    public ResponseEntity<InventarioInsumoSedeDTO> crear(@RequestBody InventarioInsumoSedeDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventarioInsumoSedeDTO> actualizar(
            @PathVariable Long id,
            @RequestBody InventarioInsumoSedeDTO dto) {
        return ResponseEntity.ok(service.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
