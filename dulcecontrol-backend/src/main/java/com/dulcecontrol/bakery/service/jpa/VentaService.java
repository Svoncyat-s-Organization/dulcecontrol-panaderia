package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.Venta;
import com.dulcecontrol.bakery.repository.VentaRepository;
import com.dulcecontrol.bakery.service.IVentaService;

@Service
public class VentaService implements IVentaService {
    @Autowired
    private VentaRepository repoVenta;

    public List<Venta> buscarTodos() {
        return repoVenta.findAll();
    }

    public void guardar(Venta venta) {
        repoVenta.save(venta);
    }

    public void modificar(Venta venta) {
        repoVenta.save(venta);
    }

    public Optional<Venta> buscarId(Long id) {
        return repoVenta.findById(id);
    }

    public void eliminar(Long id) {
        repoVenta.deleteById(id);
    }
}