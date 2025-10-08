package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.Pedido;
import com.dulcecontrol.bakery.repository.PedidoRepository;
import com.dulcecontrol.bakery.service.IPedidoService;

@Service
public class PedidoService implements IPedidoService {
    @Autowired
    private PedidoRepository repoPedido;

    public List<Pedido> buscarTodos() {
        return repoPedido.findAll();
    }

    public void guardar(Pedido pedido) {
        repoPedido.save(pedido);
    }

    public void modificar(Pedido pedido) {
        repoPedido.save(pedido);
    }

    public Optional<Pedido> buscarId(Long id) {
        return repoPedido.findById(id);
    }

    public void eliminar(Long id) {
        repoPedido.deleteById(id);
    }
}