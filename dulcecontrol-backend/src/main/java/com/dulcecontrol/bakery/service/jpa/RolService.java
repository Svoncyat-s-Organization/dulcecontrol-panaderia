package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.Rol;
import com.dulcecontrol.bakery.repository.RolRepository;
import com.dulcecontrol.bakery.service.IRolService;

@Service
public class RolService implements IRolService {
    @Autowired
    private RolRepository repoRol;

    public List<Rol> buscarTodos() {
        return repoRol.findAll();
    }

    public void guardar(Rol rol) {
        repoRol.save(rol);
    }

    public void modificar(Rol rol) {
        repoRol.save(rol);
    }

    public Optional<Rol> buscarId(Long id) {
        return repoRol.findById(id);
    }

    public void eliminar(Long id) {
        repoRol.deleteById(id);
    }
}