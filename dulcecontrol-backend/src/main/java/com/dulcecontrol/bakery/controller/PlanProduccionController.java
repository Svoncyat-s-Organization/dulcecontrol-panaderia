package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.PlanProduccion;
import com.dulcecontrol.bakery.service.IPlanProduccionService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class PlanProduccionController {
    @Autowired
    private IPlanProduccionService servicePlanProduccion;

    @GetMapping("/planProduccion")
    public List<PlanProduccion> buscartodos() {
        return servicePlanProduccion.buscarTodos();
    }

    @PostMapping("/planProduccion")
    public PlanProduccion guardar(@RequestBody PlanProduccion planProduccion) {
        servicePlanProduccion.guardar(planProduccion);
        return planProduccion;
    }

    @PutMapping("/planProduccion/{id}")
    public PlanProduccion modificar(@RequestBody PlanProduccion planProduccion) {
        servicePlanProduccion.modificar(planProduccion);
        return planProduccion;
    }

    @GetMapping("/planProduccion/{id}")
    public Optional<PlanProduccion> buscarId(@PathVariable("id") Long id) {
        return servicePlanProduccion.buscarId(id);
    }

    @DeleteMapping("/planProduccion/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePlanProduccion.eliminar(id);
        return "PlanProduccion eliminado";
    }
}