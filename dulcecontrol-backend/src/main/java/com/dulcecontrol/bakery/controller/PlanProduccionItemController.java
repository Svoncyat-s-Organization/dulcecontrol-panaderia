package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.PlanProduccionItem;
import com.dulcecontrol.bakery.service.IPlanProduccionItemService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class PlanProduccionItemController {
    @Autowired
    private IPlanProduccionItemService servicePlanProduccionItem;

    @GetMapping("/planProduccionItem")
    public List<PlanProduccionItem> buscartodos() {
        return servicePlanProduccionItem.buscarTodos();
    }

    @PostMapping("/planProduccionItem")
    public PlanProduccionItem guardar(@RequestBody PlanProduccionItem planProduccionItem) {
        servicePlanProduccionItem.guardar(planProduccionItem);
        return planProduccionItem;
    }

    @PutMapping("/planProduccionItem/{id}")
    public PlanProduccionItem modificar(@RequestBody PlanProduccionItem planProduccionItem) {
        servicePlanProduccionItem.modificar(planProduccionItem);
        return planProduccionItem;
    }

    @GetMapping("/planProduccionItem/{id}")
    public Optional<PlanProduccionItem> buscarId(@PathVariable("id") Long id) {
        return servicePlanProduccionItem.buscarId(id);
    }

    @DeleteMapping("/planProduccionItem/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePlanProduccionItem.eliminar(id);
        return "PlanProduccionItem eliminado";
    }
}