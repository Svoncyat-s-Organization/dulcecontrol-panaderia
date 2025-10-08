package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.RecetaItem;
import com.dulcecontrol.bakery.service.IRecetaItemService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class RecetaItemController {
    @Autowired
    private IRecetaItemService serviceRecetaItem;

    @GetMapping("/recetaItem")
    public List<RecetaItem> buscartodos() {
        return serviceRecetaItem.buscarTodos();
    }

    @PostMapping("/recetaItem")
    public RecetaItem guardar(@RequestBody RecetaItem recetaItem) {
        serviceRecetaItem.guardar(recetaItem);
        return recetaItem;
    }

    @PutMapping("/recetaItem/{id}")
    public RecetaItem modificar(@RequestBody RecetaItem recetaItem) {
        serviceRecetaItem.modificar(recetaItem);
        return recetaItem;
    }

    @GetMapping("/recetaItem/{id}")
    public Optional<RecetaItem> buscarId(@PathVariable("id") Long id) {
        return serviceRecetaItem.buscarId(id);
    }

    @DeleteMapping("/recetaItem/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceRecetaItem.eliminar(id);
        return "RecetaItem eliminado";
    }
}