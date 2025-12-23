package com.dulcecontrol.bakery.features.shared.ubigeo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dulcecontrol.bakery.features.shared.ubigeo.entity.UbigeoDistrito;

@Repository
public interface UbigeoDistritoRepository extends JpaRepository<UbigeoDistrito, Long> {

    List<UbigeoDistrito> findByProvinciaIdOrderByNombreAsc(Long provinciaId);

    Optional<UbigeoDistrito> findByCodigoUbigeo(String codigoUbigeo);

    boolean existsByCodigoUbigeo(String codigoUbigeo);
}
