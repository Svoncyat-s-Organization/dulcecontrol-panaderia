package com.dulcecontrol.bakery.feature.superadmin.facturacion.entity;

import com.dulcecontrol.bakery.feature.superadmin.facturacion.entity.enums.EstadoTransaccion;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Type;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "transacciones_pago")
@Data
public class TransaccionPago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(name = "comprobante_id", nullable = false)
    private Long comprobanteId;

    @Column(nullable = false, length = 50)
    private String pasarela;

    @Column(name = "id_transaccion_pasarela", length = 100)
    private String idTransaccionPasarela;

    @Column(name = "monto_centimos", nullable = false)
    private Long montoCentimos;

    @Column(name = "moneda", columnDefinition = "CHAR(3)", nullable = false)
    private String moneda = "PEN";

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, columnDefinition = "ENUM('pendiente','exitoso','fallido','reembolsado')")
    private EstadoTransaccion estado = EstadoTransaccion.pendiente;

    @Column(name = "codigo_error", length = 100)
    private String codigoError;

    @Column(name = "mensaje_error")
    private String mensajeError;

    @Type(JsonType.class)
    @Column(name = "metadata_pasarela", columnDefinition = "json")
    private Map<String, Object> metadataPasarela;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    void onCreate() {
        creadoEn = LocalDateTime.now();
        if (moneda == null) moneda = "PEN";
        if (estado == null) estado = EstadoTransaccion.pendiente;
    }
}