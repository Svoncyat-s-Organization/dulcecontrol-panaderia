package com.dulcecontrol.bakery.feature.admin.inventario.repository;

import com.dulcecontrol.bakery.feature.admin.inventario.entity.ItemTransferencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemTransferenciaRepository extends JpaRepository<ItemTransferencia, Long> {

    List<ItemTransferencia> findByTransferenciaId(Long transferenciaId);

    void deleteByTransferenciaId(Long transferenciaId);
}
