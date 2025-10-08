package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.Usuario;
import com.dulcecontrol.bakery.repository.UsuarioRepository;
import com.dulcecontrol.bakery.service.IUsuarioService;

@Service
public class UsuarioService implements IUsuarioService {
    @Autowired
    private UsuarioRepository repoUsuario;

    public List<Usuario> buscarTodos() {
        return repoUsuario.findAll();
    }

    public void guardar(Usuario usuario) {
        repoUsuario.save(usuario);
    }

    public void modificar(Usuario usuario) {
        repoUsuario.save(usuario);
    }

    public Optional<Usuario> buscarId(Long id) {
        return repoUsuario.findById(id);
    }

    public void eliminar(Long id) {
        repoUsuario.deleteById(id);
    }
}