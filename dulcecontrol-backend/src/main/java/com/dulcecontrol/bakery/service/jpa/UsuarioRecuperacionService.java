package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.UsuarioRecuperacion;
import com.dulcecontrol.bakery.repository.UsuarioRecuperacionRepository;
import com.dulcecontrol.bakery.service.IUsuarioRecuperacionService;

@Service
public class UsuarioRecuperacionService implements IUsuarioRecuperacionService {
    @Autowired
    private UsuarioRecuperacionRepository repoUsuarioRecuperacion;

    public List<UsuarioRecuperacion> buscarTodos() {
        return repoUsuarioRecuperacion.findAll();
    }

    public void guardar(UsuarioRecuperacion usuarioRecuperacion) {
        repoUsuarioRecuperacion.save(usuarioRecuperacion);
    }

    public void modificar(UsuarioRecuperacion usuarioRecuperacion) {
        repoUsuarioRecuperacion.save(usuarioRecuperacion);
    }

    public Optional<UsuarioRecuperacion> buscarId(Long id) {
        return repoUsuarioRecuperacion.findById(id);
    }

    public void eliminar(Long id) {
        repoUsuarioRecuperacion.deleteById(id);
    }
}