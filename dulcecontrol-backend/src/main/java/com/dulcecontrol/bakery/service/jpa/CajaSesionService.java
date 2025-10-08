package com.dulcecontrol.bakery.service.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dulcecontrol.bakery.entity.CajaSesion;
import com.dulcecontrol.bakery.repository.CajaSesionRepository;
import com.dulcecontrol.bakery.service.ICajaSesionService;

@Service
public class CajaSesionService implements ICajaSesionService {
    @Autowired
    private CajaSesionRepository repoCajaSesion;

    public List<CajaSesion> buscarTodos() {
        return repoCajaSesion.findAll();
    }

    public void guardar(CajaSesion cajaSesion) {
        repoCajaSesion.save(cajaSesion);
    }

    public void modificar(CajaSesion cajaSesion) {
        repoCajaSesion.save(cajaSesion);
    }

    public Optional<CajaSesion> buscarId(Long id) {
        return repoCajaSesion.findById(id);
    }

    public void eliminar(Long id) {
        repoCajaSesion.deleteById(id);
    }
}