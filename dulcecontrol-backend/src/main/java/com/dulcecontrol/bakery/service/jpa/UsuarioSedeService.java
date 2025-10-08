package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.UsuarioSede;
import com.dulcecontrol.bakery.entity.UsuarioSedeId;
import com.dulcecontrol.bakery.repository.UsuarioSedeRepository;
import com.dulcecontrol.bakery.service.IUsuarioSedeService;

@Service
public class UsuarioSedeService implements IUsuarioSedeService {
    @Autowired
    private UsuarioSedeRepository repoUsuarioSede;

    public List<UsuarioSede> buscarTodos() {
        return repoUsuarioSede.findAll();
    }

    public void guardar(UsuarioSede usuarioSede) {
        repoUsuarioSede.save(usuarioSede);
    }

    public void modificar(UsuarioSede usuarioSede) {
        repoUsuarioSede.save(usuarioSede);
    }

    public Optional<UsuarioSede> buscarId(UsuarioSedeId id) {
        return repoUsuarioSede.findById(id);
    }

    public void eliminar(UsuarioSedeId id) {
        repoUsuarioSede.deleteById(id);
    }
}