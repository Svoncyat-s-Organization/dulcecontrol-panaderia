package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.Cliente;
import com.dulcecontrol.bakery.repository.ClienteRepository;
import com.dulcecontrol.bakery.service.IClienteService;

@Service
public class ClienteService implements IClienteService {
    @Autowired
    private ClienteRepository repoCliente;

    public List<Cliente> buscarTodos() {
        return repoCliente.findAll();
    }

    public void guardar(Cliente cliente) {
        repoCliente.save(cliente);
    }

    public void modificar(Cliente cliente) {
        repoCliente.save(cliente);
    }

    public Optional<Cliente> buscarId(Long id) {
        return repoCliente.findById(id);
    }

    public void eliminar(Long id) {
        repoCliente.deleteById(id);
    }
}