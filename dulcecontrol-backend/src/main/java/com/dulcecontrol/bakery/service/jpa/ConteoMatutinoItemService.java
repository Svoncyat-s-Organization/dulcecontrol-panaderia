package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.ConteoMatutinoItem;
import com.dulcecontrol.bakery.repository.ConteoMatutinoItemRepository;
import com.dulcecontrol.bakery.service.IConteoMatutinoItemService;

@Service
public class ConteoMatutinoItemService implements IConteoMatutinoItemService {
    @Autowired
    private ConteoMatutinoItemRepository repoConteoMatutinoItem;

    public List<ConteoMatutinoItem> buscarTodos() {
        return repoConteoMatutinoItem.findAll();
    }

    public void guardar(ConteoMatutinoItem conteoMatutinoItem) {
        repoConteoMatutinoItem.save(conteoMatutinoItem);
    }

    public void modificar(ConteoMatutinoItem conteoMatutinoItem) {
        repoConteoMatutinoItem.save(conteoMatutinoItem);
    }

    public Optional<ConteoMatutinoItem> buscarId(Long id) {
        return repoConteoMatutinoItem.findById(id);
    }

    public void eliminar(Long id) {
        repoConteoMatutinoItem.deleteById(id);
    }
}