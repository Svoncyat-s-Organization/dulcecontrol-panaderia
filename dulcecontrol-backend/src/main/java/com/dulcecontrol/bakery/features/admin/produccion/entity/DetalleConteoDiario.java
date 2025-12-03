package com.dulcecontrol.bakery.features.admin.produccion.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "detalle_conteo_diario")
@Getter
@Setter
public class DetalleConteoDiario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "conteo_id", nullable = false)
    private Long conteoId;

    @Column(name = "producto_id", nullable = false)
    private Long productoId;

    @Column(name = "cantidad_fisica", nullable = false)
    private Integer cantidadFisica;

    @Column(name = "cantidad_sistema")
    private Integer cantidadSistema;

    @Column(name = "diferencia", insertable = false, updatable = false)
    private Integer diferencia;
}
