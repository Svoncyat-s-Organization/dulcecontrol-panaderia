package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.PagoPedido;
import com.dulcecontrol.bakery.repository.PagoPedidoRepository;
import com.dulcecontrol.bakery.service.IPagoPedidoService;

@Service
public class PagoPedidoService implements IPagoPedidoService {
    @Autowired
    private PagoPedidoRepository repoPagoPedido;

    public List<PagoPedido> buscarTodos() {
        return repoPagoPedido.findAll();
    }

    public void guardar(PagoPedido pagoPedido) {
        repoPagoPedido.save(pagoPedido);
    }

    public void modificar(PagoPedido pagoPedido) {
        repoPagoPedido.save(pagoPedido);
    }

    public Optional<PagoPedido> buscarId(Long id) {
        return repoPagoPedido.findById(id);
    }

    public void eliminar(Long id) {
        repoPagoPedido.deleteById(id);
    }
}