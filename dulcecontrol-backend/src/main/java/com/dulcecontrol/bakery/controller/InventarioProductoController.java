package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.InventarioProducto;
import com.dulcecontrol.bakery.entity.InventarioProductoId;
import com.dulcecontrol.bakery.service.IInventarioProductoService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class InventarioProductoController {
    @Autowired
    private IInventarioProductoService serviceInventarioProducto;

    @GetMapping("/inventarioProducto")
    public List<InventarioProducto> buscartodos() {
        return serviceInventarioProducto.buscarTodos();
    }

    @PostMapping("/inventarioProducto")
    public InventarioProducto guardar(@RequestBody InventarioProducto inventarioProducto) {
        serviceInventarioProducto.guardar(inventarioProducto);
        return inventarioProducto;
    }

    @PutMapping("/inventarioProducto")
    public InventarioProducto modificar(@RequestBody InventarioProducto inventarioProducto) {
        serviceInventarioProducto.modificar(inventarioProducto);
        return inventarioProducto;
    }

    @GetMapping("/inventarioProducto/{sedeId}/{productoId}")
    public Optional<InventarioProducto> buscarId(@PathVariable Long sedeId, @PathVariable Long productoId) {
        InventarioProductoId id = new InventarioProductoId(sedeId, productoId);
        return serviceInventarioProducto.buscarId(id);
    }

    @DeleteMapping("/inventarioProducto/{sedeId}/{productoId}")
    public String eliminar(@PathVariable Long sedeId, @PathVariable Long productoId) {
        InventarioProductoId id = new InventarioProductoId(sedeId, productoId);
        serviceInventarioProducto.eliminar(id);
        return "InventarioProducto eliminado";
    }
}