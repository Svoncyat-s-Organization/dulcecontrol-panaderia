package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.CategoriaProducto;
import com.dulcecontrol.bakery.repository.CategoriaProductoRepository;
import com.dulcecontrol.bakery.service.ICategoriaProductoService;

@Service
public class CategoriaProductoService implements ICategoriaProductoService {
    @Autowired
    private CategoriaProductoRepository repoCategoriaProducto;

    public List<CategoriaProducto> buscarTodos() {
        return repoCategoriaProducto.findAll();
    }

    public void guardar(CategoriaProducto categoriaProducto) {
        repoCategoriaProducto.save(categoriaProducto);
    }

    public void modificar(CategoriaProducto categoriaProducto) {
        repoCategoriaProducto.save(categoriaProducto);
    }

    public Optional<CategoriaProducto> buscarId(Long id) {
        return repoCategoriaProducto.findById(id);
    }

    public void eliminar(Long id) {
        repoCategoriaProducto.deleteById(id);
    }
}