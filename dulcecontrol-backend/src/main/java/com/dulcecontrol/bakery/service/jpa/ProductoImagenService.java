package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.ProductoImagen;
import com.dulcecontrol.bakery.repository.ProductoImagenRepository;
import com.dulcecontrol.bakery.service.IProductoImagenService;

@Service
public class ProductoImagenService implements IProductoImagenService {
    @Autowired
    private ProductoImagenRepository repoProductoImagen;

    public List<ProductoImagen> buscarTodos() {
        return repoProductoImagen.findAll();
    }

    public void guardar(ProductoImagen productoImagen) {
        repoProductoImagen.save(productoImagen);
    }

    public void modificar(ProductoImagen productoImagen) {
        repoProductoImagen.save(productoImagen);
    }

    public Optional<ProductoImagen> buscarId(Long id) {
        return repoProductoImagen.findById(id);
    }

    public void eliminar(Long id) {
        repoProductoImagen.deleteById(id);
    }
}