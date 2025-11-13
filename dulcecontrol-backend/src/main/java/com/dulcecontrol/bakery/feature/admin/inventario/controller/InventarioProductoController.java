package com.dulcecontrol.bakery.feature.admin.inventario.controller;

import com.dulcecontrol.bakery.feature.admin.inventario.controller.dto.InventarioProductoDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.service.IInventarioProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/inventario/productos")
@RequiredArgsConstructor
@Validated
public class InventarioProductoController {

    private final IInventarioProductoService service;

    @GetMapping
    public ResponseEntity<List<InventarioProductoDTO>> listar(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(service.listarPorTienda(tiendaId));
    }

    @GetMapping("/sede/{sedeId}")
    public ResponseEntity<List<InventarioProductoDTO>> listarPorSede(
            @PathVariable Long tiendaId,
            @PathVariable Long sedeId) {
        return ResponseEntity.ok(service.listarPorTiendaYSede(tiendaId, sedeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventarioProductoDTO> obtener(
            @PathVariable Long tiendaId,
            @PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(tiendaId, id));
    }

    @GetMapping("/sede/{sedeId}/bajo-stock")
    public ResponseEntity<List<InventarioProductoDTO>> listarBajoStock(
            @PathVariable Long tiendaId,
            @PathVariable Long sedeId,
            @RequestParam(defaultValue = "5") Integer cantidadMinima) {
        return ResponseEntity.ok(service.listarBajoStock(tiendaId, sedeId, cantidadMinima));
    }

    @PostMapping
    public ResponseEntity<InventarioProductoDTO> crear(
            @PathVariable Long tiendaId,
            @Valid @RequestBody InventarioProductoDTO dto) {
        InventarioProductoDTO creado = service.crear(tiendaId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventarioProductoDTO> actualizar(
            @PathVariable Long tiendaId,
            @PathVariable Long id,
            @Valid @RequestBody InventarioProductoDTO dto) {
        InventarioProductoDTO actualizado = service.actualizar(tiendaId, id, dto);
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
