package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.UsuarioRol;
import com.dulcecontrol.bakery.entity.UsuarioRolId;
import com.dulcecontrol.bakery.repository.UsuarioRolRepository;
import com.dulcecontrol.bakery.service.IUsuarioRolService;

@Service
public class UsuarioRolService implements IUsuarioRolService {
    @Autowired
    private UsuarioRolRepository repoUsuarioRol;

    public List<UsuarioRol> buscarTodos() {
        return repoUsuarioRol.findAll();
    }

    public void guardar(UsuarioRol usuarioRol) {
        repoUsuarioRol.save(usuarioRol);
    }

    public void modificar(UsuarioRol usuarioRol) {
        repoUsuarioRol.save(usuarioRol);
    }

    public Optional<UsuarioRol> buscarId(UsuarioRolId id) {
        return repoUsuarioRol.findById(id);
    }

    public void eliminar(UsuarioRolId id) {
        repoUsuarioRol.deleteById(id);
    }
}