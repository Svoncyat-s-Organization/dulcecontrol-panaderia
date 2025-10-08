package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.RolPermiso;
import com.dulcecontrol.bakery.entity.RolPermisoId;
import com.dulcecontrol.bakery.service.IRolPermisoService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class RolPermisoController {
    @Autowired
    private IRolPermisoService serviceRolPermiso;

    @GetMapping("/rolPermiso")
    public List<RolPermiso> buscartodos() {
        return serviceRolPermiso.buscarTodos();
    }

    @PostMapping("/rolPermiso")
    public RolPermiso guardar(@RequestBody RolPermiso rolPermiso) {
        serviceRolPermiso.guardar(rolPermiso);
        return rolPermiso;
    }

    @PutMapping("/rolPermiso")
    public RolPermiso modificar(@RequestBody RolPermiso rolPermiso) {
        serviceRolPermiso.modificar(rolPermiso);
        return rolPermiso;
    }

    @GetMapping("/rolPermiso/{rolId}/{permisoId}")
    public Optional<RolPermiso> buscarId(@PathVariable Long rolId, @PathVariable Long permisoId) {
        RolPermisoId id = new RolPermisoId(rolId, permisoId);
        return serviceRolPermiso.buscarId(id);
    }

    @DeleteMapping("/rolPermiso/{rolId}/{permisoId}")
    public String eliminar(@PathVariable Long rolId, @PathVariable Long permisoId) {
        RolPermisoId id = new RolPermisoId(rolId, permisoId);
        serviceRolPermiso.eliminar(id);
        return "RolPermiso eliminado";
    }
}