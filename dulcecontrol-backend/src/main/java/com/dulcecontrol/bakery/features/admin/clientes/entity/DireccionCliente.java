package com.dulcecontrol.bakery.features.admin.clientes.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "direcciones_cliente")
@Data
public class DireccionCliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cliente_id", nullable = false)
    private Long clienteId;

    @Column(length = 100)
    private String etiqueta;

    @Column(name = "direccion_completa", nullable = false, columnDefinition = "TEXT")
    private String direccionCompleta;

    @Column(columnDefinition = "TEXT")
    private String referencia;

    @Column(name = "distrito_id")
    private Long distritoId;

    @Column(name = "codigo_postal", length = 20)
    private String codigoPostal;

    @Column(name = "es_fiscal")
    private Boolean esFiscal = false;

    @Column(name = "es_entrega")
    private Boolean esEntrega = false;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    protected void onCreate() {
        creadoEn = LocalDateTime.now();
        if (esFiscal == null) {
            esFiscal = false;
        }
        if (esEntrega == null) {
            esEntrega = false;
        }
    }
}