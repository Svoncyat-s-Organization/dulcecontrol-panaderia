package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.PlanProduccion;
import com.dulcecontrol.bakery.repository.PlanProduccionRepository;
import com.dulcecontrol.bakery.service.IPlanProduccionService;

@Service
public class PlanProduccionService implements IPlanProduccionService {
    @Autowired
    private PlanProduccionRepository repoPlanProduccion;

    public List<PlanProduccion> buscarTodos() {
        return repoPlanProduccion.findAll();
    }

    public void guardar(PlanProduccion planProduccion) {
        repoPlanProduccion.save(planProduccion);
    }

    public void modificar(PlanProduccion planProduccion) {
        repoPlanProduccion.save(planProduccion);
    }

    public Optional<PlanProduccion> buscarId(Long id) {
        return repoPlanProduccion.findById(id);
    }

    public void eliminar(Long id) {
        repoPlanProduccion.deleteById(id);
    }
}