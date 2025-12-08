package com.dulcecontrol.bakery.features.shared.ubigeo.repository;

import com.dulcecontrol.bakery.features.shared.ubigeo.entity.UbigeoDistrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UbigeoDistritoRepository extends JpaRepository<UbigeoDistrito, Long> {
    
    List<UbigeoDistrito> findByProvinciaIdOrderByNombreAsc(Long provinciaId);
}
