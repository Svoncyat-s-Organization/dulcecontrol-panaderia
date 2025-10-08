package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.Permiso;
import com.dulcecontrol.bakery.repository.PermisoRepository;
import com.dulcecontrol.bakery.service.IPermisoService;

@Service
public class PermisoService implements IPermisoService {
    @Autowired
    private PermisoRepository repoPermiso;

    public List<Permiso> buscarTodos() {
        return repoPermiso.findAll();
    }

    public void guardar(Permiso permiso) {
        repoPermiso.save(permiso);
    }

    public void modificar(Permiso permiso) {
        repoPermiso.save(permiso);
    }

    public Optional<Permiso> buscarId(Long id) {
        return repoPermiso.findById(id);
    }

    public void eliminar(Long id) {
        repoPermiso.deleteById(id);
    }
}