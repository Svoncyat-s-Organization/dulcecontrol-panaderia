package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.PedidoEntrega;
import com.dulcecontrol.bakery.repository.PedidoEntregaRepository;
import com.dulcecontrol.bakery.service.IPedidoEntregaService;

@Service
public class PedidoEntregaService implements IPedidoEntregaService {
    @Autowired
    private PedidoEntregaRepository repoPedidoEntrega;

    public List<PedidoEntrega> buscarTodos() {
        return repoPedidoEntrega.findAll();
    }

    public void guardar(PedidoEntrega pedidoEntrega) {
        repoPedidoEntrega.save(pedidoEntrega);
    }

    public void modificar(PedidoEntrega pedidoEntrega) {
        repoPedidoEntrega.save(pedidoEntrega);
    }

    public Optional<PedidoEntrega> buscarId(Long id) {
        return repoPedidoEntrega.findById(id);
    }

    public void eliminar(Long id) {
        repoPedidoEntrega.deleteById(id);
    }
}