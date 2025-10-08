package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.VentaItem;
import com.dulcecontrol.bakery.repository.VentaItemRepository;
import com.dulcecontrol.bakery.service.IVentaItemService;

@Service
public class VentaItemService implements IVentaItemService {
    @Autowired
    private VentaItemRepository repoVentaItem;

    public List<VentaItem> buscarTodos() {
        return repoVentaItem.findAll();
    }

    public void guardar(VentaItem ventaItem) {
        repoVentaItem.save(ventaItem);
    }

    public void modificar(VentaItem ventaItem) {
        repoVentaItem.save(ventaItem);
    }

    public Optional<VentaItem> buscarId(Long id) {
        return repoVentaItem.findById(id);
    }

    public void eliminar(Long id) {
        repoVentaItem.deleteById(id);
    }
}