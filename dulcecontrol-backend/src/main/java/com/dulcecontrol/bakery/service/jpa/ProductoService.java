package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.Producto;
import com.dulcecontrol.bakery.repository.ProductoRepository;
import com.dulcecontrol.bakery.service.IProductoService;

@Service
public class ProductoService implements IProductoService {
    @Autowired
    private ProductoRepository repoProducto;

    public List<Producto> buscarTodos() {
        return repoProducto.findAll();
    }

    public void guardar(Producto producto) {
        repoProducto.save(producto);
    }

    public void modificar(Producto producto) {
        repoProducto.save(producto);
    }

    public Optional<Producto> buscarId(Long id) {
        return repoProducto.findById(id);
    }

    public void eliminar(Long id) {
        repoProducto.deleteById(id);
    }
}