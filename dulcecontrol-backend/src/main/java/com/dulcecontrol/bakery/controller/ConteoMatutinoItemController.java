package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.ConteoMatutinoItem;
import com.dulcecontrol.bakery.service.IConteoMatutinoItemService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class ConteoMatutinoItemController {
    @Autowired
    private IConteoMatutinoItemService serviceConteoMatutinoItem;

    @GetMapping("/conteoMatutinoItem")
    public List<ConteoMatutinoItem> buscartodos() {
        return serviceConteoMatutinoItem.buscarTodos();
    }

    @PostMapping("/conteoMatutinoItem")
    public ConteoMatutinoItem guardar(@RequestBody ConteoMatutinoItem conteoMatutinoItem) {
        serviceConteoMatutinoItem.guardar(conteoMatutinoItem);
        return conteoMatutinoItem;
    }

    @PutMapping("/conteoMatutinoItem/{id}")
    public ConteoMatutinoItem modificar(@RequestBody ConteoMatutinoItem conteoMatutinoItem) {
        serviceConteoMatutinoItem.modificar(conteoMatutinoItem);
        return conteoMatutinoItem;
    }

    @GetMapping("/conteoMatutinoItem/{id}")
    public Optional<ConteoMatutinoItem> buscarId(@PathVariable("id") Long id) {
        return serviceConteoMatutinoItem.buscarId(id);
    }

    @DeleteMapping("/conteoMatutinoItem/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceConteoMatutinoItem.eliminar(id);
        return "ConteoMatutinoItem eliminado";
    }
}