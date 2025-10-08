package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.ConteoMatutino;
import com.dulcecontrol.bakery.repository.ConteoMatutinoRepository;
import com.dulcecontrol.bakery.service.IConteoMatutinoService;

@Service
public class ConteoMatutinoService implements IConteoMatutinoService {
    @Autowired
    private ConteoMatutinoRepository repoConteoMatutino;

    public List<ConteoMatutino> buscarTodos() {
        return repoConteoMatutino.findAll();
    }

    public void guardar(ConteoMatutino conteoMatutino) {
        repoConteoMatutino.save(conteoMatutino);
    }

    public void modificar(ConteoMatutino conteoMatutino) {
        repoConteoMatutino.save(conteoMatutino);
    }

    public Optional<ConteoMatutino> buscarId(Long id) {
        return repoConteoMatutino.findById(id);
    }

    public void eliminar(Long id) {
        repoConteoMatutino.deleteById(id);
    }
}