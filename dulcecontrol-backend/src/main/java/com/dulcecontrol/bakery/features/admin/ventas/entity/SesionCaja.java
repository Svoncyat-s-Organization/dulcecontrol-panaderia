package com.dulcecontrol.bakery.features.admin.ventas.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "sesiones_caja")
@Getter
@Setter
public class SesionCaja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(name = "caja_id", nullable = false)
    private Long cajaId;

    @Column(name = "usuario_apertura_id", nullable = false)
    private Long usuarioAperturaId;

    @Column(name = "usuario_cierre_id")
    private Long usuarioCierreId;

    @Column(name = "monto_inicial_centimos", nullable = false)
    private Long montoInicialCentimos;

    @Column(name = "monto_final_esperado_centimos")
    private Long montoFinalEsperadoCentimos;

    @Column(name = "monto_final_real_centimos")
    private Long montoFinalRealCentimos;

    @Column(name = "diferencia_centimos", insertable = false, updatable = false, columnDefinition = "int")
    private Integer diferenciaCentimos;

    @Column(name = "fecha_apertura", nullable = false)
    private LocalDateTime fechaApertura;

    @Column(name = "fecha_cierre")
    private LocalDateTime fechaCierre;

    @Column(name = "esta_abierta", nullable = false)
    private Boolean estaAbierta = Boolean.TRUE;

    @PrePersist
    void onCreate() {
        if (fechaApertura == null) {
            fechaApertura = LocalDateTime.now();
        }
        if (estaAbierta == null) {
            estaAbierta = Boolean.TRUE;
        }
    }
}
