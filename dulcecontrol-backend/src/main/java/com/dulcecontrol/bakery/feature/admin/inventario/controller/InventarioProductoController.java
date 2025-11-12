package com.dulcecontrol.bakery.feature.admin.inventario.controller;

import com.dulcecontrol.bakery.feature.admin.inventario.controller.dto.InventarioProductoDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.service.IInventarioProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/inventario/productos")
@RequiredArgsConstructor
public class InventarioProductoController {

    private final IInventarioProductoService service;

    @GetMapping
    public ResponseEntity<List<InventarioProductoDTO>> obtenerTodos() {
        return ResponseEntity.ok(service.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventarioProductoDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @GetMapping("/tienda/{tiendaId}")
    public ResponseEntity<List<InventarioProductoDTO>> obtenerPorTienda(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(service.obtenerPorTienda(tiendaId));
    }

    @GetMapping("/sede/{sedeId}")
    public ResponseEntity<List<InventarioProductoDTO>> obtenerPorSede(@PathVariable Long sedeId) {
        return ResponseEntity.ok(service.obtenerPorSede(sedeId));
    }

    @GetMapping("/sede/{sedeId}/producto/{productoId}")
    public ResponseEntity<InventarioProductoDTO> obtenerPorSedeYProducto(
            @PathVariable Long sedeId,
            @PathVariable Long productoId) {
        return ResponseEntity.ok(service.obtenerPorSedeYProducto(sedeId, productoId));
    }

    @GetMapping("/sede/{sedeId}/bajo")
    public ResponseEntity<List<InventarioProductoDTO>> obtenerInventarioBajo(
            @PathVariable Long sedeId,
            @RequestParam(defaultValue = "5") Integer cantidadMinima) {
        return ResponseEntity.ok(service.obtenerInventarioBajo(sedeId, cantidadMinima));
    }

    @GetMapping("/sede/{sedeId}/agotados")
    public ResponseEntity<List<InventarioProductoDTO>> obtenerProductosAgotados(@PathVariable Long sedeId) {
        return ResponseEntity.ok(service.obtenerProductosAgotados(sedeId));
    }

    @PostMapping
    public ResponseEntity<InventarioProductoDTO> crear(@RequestBody InventarioProductoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventarioProductoDTO> actualizar(
            @PathVariable Long id,
            @RequestBody InventarioProductoDTO dto) {
        return ResponseEntity.ok(service.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
