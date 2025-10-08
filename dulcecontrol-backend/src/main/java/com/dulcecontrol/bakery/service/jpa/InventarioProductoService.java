package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.InventarioProducto;
import com.dulcecontrol.bakery.entity.InventarioProductoId;
import com.dulcecontrol.bakery.repository.InventarioProductoRepository;
import com.dulcecontrol.bakery.service.IInventarioProductoService;

@Service
public class InventarioProductoService implements IInventarioProductoService {
    @Autowired
    private InventarioProductoRepository repoInventarioProducto;

    public List<InventarioProducto> buscarTodos() {
        return repoInventarioProducto.findAll();
    }

    public void guardar(InventarioProducto inventarioProducto) {
        repoInventarioProducto.save(inventarioProducto);
    }

    public void modificar(InventarioProducto inventarioProducto) {
        repoInventarioProducto.save(inventarioProducto);
    }

    public Optional<InventarioProducto> buscarId(InventarioProductoId id) {
        return repoInventarioProducto.findById(id);
    }

    public void eliminar(InventarioProductoId id) {
        repoInventarioProducto.deleteById(id);
    }
}