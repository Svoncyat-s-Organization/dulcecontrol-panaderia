package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.InventarioConfig;
import com.dulcecontrol.bakery.entity.InventarioProductoId;
import com.dulcecontrol.bakery.repository.InventarioConfigRepository;
import com.dulcecontrol.bakery.service.IInventarioConfigService;

@Service
public class InventarioConfigService implements IInventarioConfigService {
    @Autowired
    private InventarioConfigRepository repoInventarioConfig;

    public List<InventarioConfig> buscarTodos() {
        return repoInventarioConfig.findAll();
    }

    public void guardar(InventarioConfig inventarioConfig) {
        repoInventarioConfig.save(inventarioConfig);
    }

    public void modificar(InventarioConfig inventarioConfig) {
        repoInventarioConfig.save(inventarioConfig);
    }

    public Optional<InventarioConfig> buscarId(InventarioProductoId id) {
        return repoInventarioConfig.findById(id);
    }

    public void eliminar(InventarioProductoId id) {
        repoInventarioConfig.deleteById(id);
    }
}