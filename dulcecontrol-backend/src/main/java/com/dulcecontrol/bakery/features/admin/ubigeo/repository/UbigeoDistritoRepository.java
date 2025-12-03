package com.dulcecontrol.bakery.features.admin.ubigeo.repository;

import com.dulcecontrol.bakery.features.admin.ubigeo.entity.UbigeoDistrito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UbigeoDistritoRepository extends JpaRepository<UbigeoDistrito, Long> {

    List<UbigeoDistrito> findByProvinciaIdOrderByNombreAsc(Long provinciaId);
}
