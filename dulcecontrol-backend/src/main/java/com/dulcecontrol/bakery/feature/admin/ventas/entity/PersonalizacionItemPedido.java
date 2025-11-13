package com.dulcecontrol.bakery.feature.admin.ventas.entity;

import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "personalizaciones_item_pedido")
@Getter
@Setter
public class PersonalizacionItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "detalle_pedido_id", nullable = false, unique = true)
    private Long detallePedidoId;

    @Column(name = "descripcion_solicitud", nullable = false, columnDefinition = "TEXT")
    private String descripcionSolicitud;

    @Column(name = "texto_dedicatoria", columnDefinition = "TEXT")
    private String textoDedicatoria;

    @Type(JsonType.class)
    @Column(name = "imagenes_referencia", columnDefinition = "json")
    private List<String> imagenesReferencia = new ArrayList<>();

    @Column(name = "sabor_masa", length = 100)
    private String saborMasa;

    @Column(name = "sabor_relleno", length = 100)
    private String saborRelleno;

    @Column(length = 100)
    private String tematica;

    @Column(name = "fecha_limite_produccion")
    private LocalDateTime fechaLimiteProduccion;

    @Column(name = "costo_extra_personalizacion_centimos")
    private Long costoExtraPersonalizacionCentimos = 0L;

    @PrePersist
    void onCreate() {
        if (imagenesReferencia == null) {
            imagenesReferencia = new ArrayList<>();
        }
        if (costoExtraPersonalizacionCentimos == null) {
            costoExtraPersonalizacionCentimos = 0L;
        }
    }

    @PreUpdate
    void onUpdate() {
        if (imagenesReferencia == null) {
            imagenesReferencia = new ArrayList<>();
        }
        if (costoExtraPersonalizacionCentimos == null) {
            costoExtraPersonalizacionCentimos = 0L;
        }
    }
}
