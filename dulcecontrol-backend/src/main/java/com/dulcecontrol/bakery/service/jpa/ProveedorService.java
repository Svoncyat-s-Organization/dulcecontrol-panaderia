package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.Proveedor;
import com.dulcecontrol.bakery.repository.ProveedorRepository;
import com.dulcecontrol.bakery.service.IProveedorService;

@Service
public class ProveedorService implements IProveedorService {
    @Autowired
    private ProveedorRepository repoProveedor;

    public List<Proveedor> buscarTodos() {
        return repoProveedor.findAll();
    }

    public void guardar(Proveedor proveedor) {
        repoProveedor.save(proveedor);
    }

    public void modificar(Proveedor proveedor) {
        repoProveedor.save(proveedor);
    }

    public Optional<Proveedor> buscarId(Long id) {
        return repoProveedor.findById(id);
    }

    public void eliminar(Long id) {
        repoProveedor.deleteById(id);
    }
}