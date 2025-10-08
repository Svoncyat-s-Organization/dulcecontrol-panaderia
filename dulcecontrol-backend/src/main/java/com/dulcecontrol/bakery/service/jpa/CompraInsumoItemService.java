package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.CompraInsumoItem;
import com.dulcecontrol.bakery.repository.CompraInsumoItemRepository;
import com.dulcecontrol.bakery.service.ICompraInsumoItemService;

@Service
public class CompraInsumoItemService implements ICompraInsumoItemService {
    @Autowired
    private CompraInsumoItemRepository repoCompraInsumoItem;

    public List<CompraInsumoItem> buscarTodos() {
        return repoCompraInsumoItem.findAll();
    }

    public void guardar(CompraInsumoItem compraInsumoItem) {
        repoCompraInsumoItem.save(compraInsumoItem);
    }

    public void modificar(CompraInsumoItem compraInsumoItem) {
        repoCompraInsumoItem.save(compraInsumoItem);
    }

    public Optional<CompraInsumoItem> buscarId(Long id) {
        return repoCompraInsumoItem.findById(id);
    }

    public void eliminar(Long id) {
        repoCompraInsumoItem.deleteById(id);
    }
}