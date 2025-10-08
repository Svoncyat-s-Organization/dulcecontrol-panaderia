package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.Gasto;
import com.dulcecontrol.bakery.repository.GastoRepository;
import com.dulcecontrol.bakery.service.IGastoService;

@Service
public class GastoService implements IGastoService {
    @Autowired
    private GastoRepository repoGasto;

    public List<Gasto> buscarTodos() {
        return repoGasto.findAll();
    }

    public void guardar(Gasto gasto) {
        repoGasto.save(gasto);
    }

    public void modificar(Gasto gasto) {
        repoGasto.save(gasto);
    }

    public Optional<Gasto> buscarId(Long id) {
        return repoGasto.findById(id);
    }

    public void eliminar(Long id) {
        repoGasto.deleteById(id);
    }
}