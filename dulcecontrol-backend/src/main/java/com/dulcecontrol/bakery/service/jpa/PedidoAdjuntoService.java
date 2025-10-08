package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.PedidoAdjunto;
import com.dulcecontrol.bakery.repository.PedidoAdjuntoRepository;
import com.dulcecontrol.bakery.service.IPedidoAdjuntoService;

@Service
public class PedidoAdjuntoService implements IPedidoAdjuntoService {
    @Autowired
    private PedidoAdjuntoRepository repoPedidoAdjunto;

    public List<PedidoAdjunto> buscarTodos() {
        return repoPedidoAdjunto.findAll();
    }

    public void guardar(PedidoAdjunto pedidoAdjunto) {
        repoPedidoAdjunto.save(pedidoAdjunto);
    }

    public void modificar(PedidoAdjunto pedidoAdjunto) {
        repoPedidoAdjunto.save(pedidoAdjunto);
    }

    public Optional<PedidoAdjunto> buscarId(Long id) {
        return repoPedidoAdjunto.findById(id);
    }

    public void eliminar(Long id) {
        repoPedidoAdjunto.deleteById(id);
    }
}