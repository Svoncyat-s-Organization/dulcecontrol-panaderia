package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.Receta;
import com.dulcecontrol.bakery.repository.RecetaRepository;
import com.dulcecontrol.bakery.service.IRecetaService;

@Service
public class RecetaService implements IRecetaService {
    @Autowired
    private RecetaRepository repoReceta;

    public List<Receta> buscarTodos() {
        return repoReceta.findAll();
    }

    public void guardar(Receta receta) {
        repoReceta.save(receta);
    }

    public void modificar(Receta receta) {
        repoReceta.save(receta);
    }

    public Optional<Receta> buscarId(Long id) {
        return repoReceta.findById(id);
    }

    public void eliminar(Long id) {
        repoReceta.deleteById(id);
    }
}