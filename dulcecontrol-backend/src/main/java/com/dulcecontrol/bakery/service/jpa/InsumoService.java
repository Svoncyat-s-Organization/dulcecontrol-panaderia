package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.Insumo;
import com.dulcecontrol.bakery.repository.InsumoRepository;
import com.dulcecontrol.bakery.service.IInsumoService;

@Service
public class InsumoService implements IInsumoService {
    @Autowired
    private InsumoRepository repoInsumo;

    public List<Insumo> buscarTodos() {
        return repoInsumo.findAll();
    }

    public void guardar(Insumo insumo) {
        repoInsumo.save(insumo);
    }

    public void modificar(Insumo insumo) {
        repoInsumo.save(insumo);
    }

    public Optional<Insumo> buscarId(Long id) {
        return repoInsumo.findById(id);
    }

    public void eliminar(Long id) {
        repoInsumo.deleteById(id);
    }
}