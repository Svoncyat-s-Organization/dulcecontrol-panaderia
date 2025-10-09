package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.Sede;
import com.dulcecontrol.bakery.repository.SedeRepository;
import com.dulcecontrol.bakery.service.ISedeService;

@Service
public class SedeService implements ISedeService {
    @Autowired
    private SedeRepository repoSede;

    public List<Sede> buscarTodos() {
        return repoSede.findAll();
    }

    public void guardar(Sede cliente) {
        repoSede.save(cliente);
    }

    public void modificar(Sede cliente) {
        repoSede.save(cliente);
    }

    public Optional<Sede> buscarId(Long id) {
        return repoSede.findById(id);
    }

    public void eliminar(Long id) {
        repoSede.deleteById(id);
    }
}
