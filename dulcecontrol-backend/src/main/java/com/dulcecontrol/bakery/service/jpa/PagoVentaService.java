package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.PagoVenta;
import com.dulcecontrol.bakery.repository.PagoVentaRepository;
import com.dulcecontrol.bakery.service.IPagoVentaService;

@Service
public class PagoVentaService implements IPagoVentaService {
    @Autowired
    private PagoVentaRepository repoPagoVenta;

    public List<PagoVenta> buscarTodos() {
        return repoPagoVenta.findAll();
    }

    public void guardar(PagoVenta pagoVenta) {
        repoPagoVenta.save(pagoVenta);
    }

    public void modificar(PagoVenta pagoVenta) {
        repoPagoVenta.save(pagoVenta);
    }

    public Optional<PagoVenta> buscarId(Long id) {
        return repoPagoVenta.findById(id);
    }

    public void eliminar(Long id) {
        repoPagoVenta.deleteById(id);
    }
}