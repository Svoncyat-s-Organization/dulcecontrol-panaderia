package com.dulcecontrol.bakery.feature.admin.inventario.entity;

import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.EstadoTransferencia;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import java.time.LocalDateTime;

@Entity
@Table(name = "transferencias_inventario")
@SQLDelete(sql = "UPDATE transferencias_inventario SET estado = 'cancelado' WHERE id = ?")
@SQLRestriction("estado != 'cancelado'")
@Data
public class TransferenciaInventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(name = "sede_origen_id", nullable = false)
    private Long sedeOrigenId;

    @Column(name = "sede_destino_id", nullable = false)
    private Long sedeDestinoId;

    @Column(nullable = false, length = 50)
    private EstadoTransferencia estado = EstadoTransferencia.PENDIENTE;

    @Column(name = "solicitado_por")
    private Long solicitadoPor;

    @Column(name = "autorizado_por")
    private Long autorizadoPor;

    @Column(name = "recibido_por")
    private Long recibidoPor;

    @Column(name = "fecha_solicitud")
    private LocalDateTime fechaSolicitud;

    @Column(name = "fecha_envio")
    private LocalDateTime fechaEnvio;

    @Column(name = "fecha_recepcion")
    private LocalDateTime fechaRecepcion;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @PrePersist
    protected void onCreate() {
        if (fechaSolicitud == null) {
            fechaSolicitud = LocalDateTime.now();
        }
        if (estado == null) {
            estado = EstadoTransferencia.PENDIENTE;
        }
    }
}
