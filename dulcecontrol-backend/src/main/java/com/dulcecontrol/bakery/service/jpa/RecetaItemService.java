package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.RecetaItem;
import com.dulcecontrol.bakery.repository.RecetaItemRepository;
import com.dulcecontrol.bakery.service.IRecetaItemService;

@Service
public class RecetaItemService implements IRecetaItemService {
    @Autowired
    private RecetaItemRepository repoRecetaItem;

    public List<RecetaItem> buscarTodos() {
        return repoRecetaItem.findAll();
    }

    public void guardar(RecetaItem recetaItem) {
        repoRecetaItem.save(recetaItem);
    }

    public void modificar(RecetaItem recetaItem) {
        repoRecetaItem.save(recetaItem);
    }

    public Optional<RecetaItem> buscarId(Long id) {
        return repoRecetaItem.findById(id);
    }

    public void eliminar(Long id) {
        repoRecetaItem.deleteById(id);
    }
}