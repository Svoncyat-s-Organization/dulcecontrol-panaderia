package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.RolPermiso;
import com.dulcecontrol.bakery.entity.RolPermisoId;
import com.dulcecontrol.bakery.repository.RolPermisoRepository;
import com.dulcecontrol.bakery.service.IRolPermisoService;

@Service
public class RolPermisoService implements IRolPermisoService {
    @Autowired
    private RolPermisoRepository repoRolPermiso;

    public List<RolPermiso> buscarTodos() {
        return repoRolPermiso.findAll();
    }

    public void guardar(RolPermiso rolPermiso) {
        repoRolPermiso.save(rolPermiso);
    }

    public void modificar(RolPermiso rolPermiso) {
        repoRolPermiso.save(rolPermiso);
    }

    public Optional<RolPermiso> buscarId(RolPermisoId id) {
        return repoRolPermiso.findById(id);
    }

    public void eliminar(RolPermisoId id) {
        repoRolPermiso.deleteById(id);
    }
}