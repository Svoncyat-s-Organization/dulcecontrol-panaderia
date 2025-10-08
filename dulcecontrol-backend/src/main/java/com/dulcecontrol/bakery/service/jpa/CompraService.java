package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.Compra;
import com.dulcecontrol.bakery.repository.CompraRepository;
import com.dulcecontrol.bakery.service.ICompraService;

@Service
public class CompraService implements ICompraService {
    @Autowired
    private CompraRepository repoCompra;

    public List<Compra> buscarTodos() {
        return repoCompra.findAll();
    }

    public void guardar(Compra compra) {
        repoCompra.save(compra);
    }

    public void modificar(Compra compra) {
        repoCompra.save(compra);
    }

    public Optional<Compra> buscarId(Long id) {
        return repoCompra.findById(id);
    }

    public void eliminar(Long id) {
        repoCompra.deleteById(id);
    }
}