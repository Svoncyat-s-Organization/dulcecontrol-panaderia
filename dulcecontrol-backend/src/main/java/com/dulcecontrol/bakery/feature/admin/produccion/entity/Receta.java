package com.dulcecontrol.bakery.feature.admin.produccion.entity;

import com.dulcecontrol.bakery.feature.admin.produccion.entity.converter.UnidadMedidaRecetaConverter;
import com.dulcecontrol.bakery.feature.admin.produccion.entity.enums.UnidadMedidaReceta;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "recetas")
@Getter
@Setter
public class Receta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(name = "producto_id", nullable = false)
    private Long productoId;

    @Column(name = "insumo_id", nullable = false)
    private Long insumoId;

    @Column(name = "cantidad_requerida", nullable = false, precision = 12, scale = 4)
    private BigDecimal cantidadRequerida;

    @Convert(converter = UnidadMedidaRecetaConverter.class)
    @Column(name = "unidad_medida", nullable = false, length = 20)
    private UnidadMedidaReceta unidadMedida;

    @Column(name = "notas_preparacion")
    private String notasPreparacion;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    void onCreate() {
        creadoEn = LocalDateTime.now();
    }
}
