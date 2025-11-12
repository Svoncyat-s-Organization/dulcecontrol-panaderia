package com.dulcecontrol.bakery.feature.admin.inventario.repository;

import com.dulcecontrol.bakery.feature.admin.inventario.entity.ItemTransferencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ItemTransferenciaRepository extends JpaRepository<ItemTransferencia, Long> {

    List<ItemTransferencia> findByTransferenciaId(Long transferenciaId);

    @Query("SELECT i FROM ItemTransferencia i WHERE i.transferenciaId = :transferenciaId AND i.insumoId IS NOT NULL")
    List<ItemTransferencia> findInsumosDeTransferencia(@Param("transferenciaId") Long transferenciaId);

    @Query("SELECT i FROM ItemTransferencia i WHERE i.transferenciaId = :transferenciaId AND i.productoId IS NOT NULL")
    List<ItemTransferencia> findProductosDeTransferencia(@Param("transferenciaId") Long transferenciaId);
}
