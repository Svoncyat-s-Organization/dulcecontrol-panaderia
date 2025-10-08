package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.InventarioConfig;
import com.dulcecontrol.bakery.entity.InventarioProductoId;
import com.dulcecontrol.bakery.service.IInventarioConfigService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class InventarioConfigController {
    @Autowired
    private IInventarioConfigService serviceInventarioConfig;

    @GetMapping("/inventarioConfig")
    public List<InventarioConfig> buscartodos() {
        return serviceInventarioConfig.buscarTodos();
    }

    @PostMapping("/inventarioConfig")
    public InventarioConfig guardar(@RequestBody InventarioConfig inventarioConfig) {
        serviceInventarioConfig.guardar(inventarioConfig);
        return inventarioConfig;
    }

    @PutMapping("/inventarioConfig")
    public InventarioConfig modificar(@RequestBody InventarioConfig inventarioConfig) {
        serviceInventarioConfig.modificar(inventarioConfig);
        return inventarioConfig;
    }

    @GetMapping("/inventarioConfig/{sedeId}/{productoId}")
    public Optional<InventarioConfig> buscarId(@PathVariable Long sedeId, @PathVariable Long productoId) {
        InventarioProductoId id = new InventarioProductoId(sedeId, productoId);
        return serviceInventarioConfig.buscarId(id);
    }

    @DeleteMapping("/inventarioConfig/{sedeId}/{productoId}")
    public String eliminar(@PathVariable Long sedeId, @PathVariable Long productoId) {
        InventarioProductoId id = new InventarioProductoId(sedeId, productoId);
        serviceInventarioConfig.eliminar(id);
        return "InventarioConfig eliminado";
    }
}