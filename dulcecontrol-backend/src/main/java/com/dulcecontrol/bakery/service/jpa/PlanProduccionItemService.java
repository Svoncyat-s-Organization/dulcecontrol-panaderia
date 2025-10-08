package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.PlanProduccionItem;
import com.dulcecontrol.bakery.repository.PlanProduccionItemRepository;
import com.dulcecontrol.bakery.service.IPlanProduccionItemService;

@Service
public class PlanProduccionItemService implements IPlanProduccionItemService {
    @Autowired
    private PlanProduccionItemRepository repoPlanProduccionItem;

    public List<PlanProduccionItem> buscarTodos() {
        return repoPlanProduccionItem.findAll();
    }

    public void guardar(PlanProduccionItem planProduccionItem) {
        repoPlanProduccionItem.save(planProduccionItem);
    }

    public void modificar(PlanProduccionItem planProduccionItem) {
        repoPlanProduccionItem.save(planProduccionItem);
    }

    public Optional<PlanProduccionItem> buscarId(Long id) {
        return repoPlanProduccionItem.findById(id);
    }

    public void eliminar(Long id) {
        repoPlanProduccionItem.deleteById(id);
    }
}