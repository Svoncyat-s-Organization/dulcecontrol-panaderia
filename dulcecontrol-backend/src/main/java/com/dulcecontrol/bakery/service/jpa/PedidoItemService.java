package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.PedidoItem;
import com.dulcecontrol.bakery.repository.PedidoItemRepository;
import com.dulcecontrol.bakery.service.IPedidoItemService;

@Service
public class PedidoItemService implements IPedidoItemService {
    @Autowired
    private PedidoItemRepository repoPedidoItem;

    public List<PedidoItem> buscarTodos() {
        return repoPedidoItem.findAll();
    }

    public void guardar(PedidoItem pedidoItem) {
        repoPedidoItem.save(pedidoItem);
    }

    public void modificar(PedidoItem pedidoItem) {
        repoPedidoItem.save(pedidoItem);
    }

    public Optional<PedidoItem> buscarId(Long id) {
        return repoPedidoItem.findById(id);
    }

    public void eliminar(Long id) {
        repoPedidoItem.deleteById(id);
    }
}