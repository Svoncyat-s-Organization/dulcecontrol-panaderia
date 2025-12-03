package com.dulcecontrol.bakery.features.admin.produccion.entity;

import com.dulcecontrol.bakery.features.admin.produccion.entity.converter.EstadoItemProduccionConverter;
import com.dulcecontrol.bakery.features.admin.produccion.entity.converter.OrigenItemProduccionConverter;
import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.EstadoItemProduccion;
import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.OrigenItemProduccion;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "detalles_plan_produccion")
@Getter
@Setter
public class DetallePlanProduccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "plan_id", nullable = false)
    private Long planId;

    @Column(name = "producto_id", nullable = false)
    private Long productoId;

    @Convert(converter = OrigenItemProduccionConverter.class)
    @Column(name = "origen", nullable = false, length = 20)
    private OrigenItemProduccion origen;

    @Column(name = "pedido_cliente_id")
    private Long pedidoClienteId;

    @Column(name = "detalle_pedido_id")
    private Long detallePedidoId;

    @Column(name = "es_personalizado", nullable = false)
    private Boolean esPersonalizado = Boolean.FALSE;

    @Column(name = "personalizacion_id")
    private Long personalizacionId;

    @Column(name = "cantidad_sugerida", nullable = false)
    private Integer cantidadSugerida;

    @Column(name = "cantidad_planificada", nullable = false)
    private Integer cantidadPlanificada;

    @Column(name = "cantidad_producida")
    private Integer cantidadProducida;

    @Column(name = "cantidad_merma")
    private Integer cantidadMerma;

    @Convert(converter = EstadoItemProduccionConverter.class)
    @Column(name = "estado", nullable = false, length = 20)
    private EstadoItemProduccion estado;

    @Column(name = "hora_termino")
    private LocalDateTime horaTermino;

    @Column(name = "observaciones")
    private String observaciones;
}
