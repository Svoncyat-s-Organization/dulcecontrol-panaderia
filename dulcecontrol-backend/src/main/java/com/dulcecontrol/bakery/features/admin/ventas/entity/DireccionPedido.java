package com.dulcecontrol.bakery.features.admin.ventas.entity;

import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.TipoDireccionPedido;
import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.TipoDocumentoContacto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "direcciones_pedido")
@Getter
@Setter
public class DireccionPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pedido_id", nullable = false)
    private Long pedidoId;

    @Column(name = "tipo_direccion", nullable = false, columnDefinition = "ENUM('facturacion','envio')")
    private TipoDireccionPedido tipoDireccion;

    @Column(name = "nombre_contacto", nullable = false, length = 255)
    private String nombreContacto;

    @Column(name = "tipo_doc_contacto", columnDefinition = "ENUM('DNI','RUC')")
    private TipoDocumentoContacto tipoDocContacto;

    @Column(name = "numero_doc_contacto", length = 20)
    private String numeroDocContacto;

    @Column(name = "telefono_contacto", nullable = false, length = 50)
    private String telefonoContacto;

    @Column(name = "email_contacto", length = 255)
    private String emailContacto;

    @Column(name = "direccion_completa", nullable = false, columnDefinition = "TEXT")
    private String direccionCompleta;

    @Column(columnDefinition = "TEXT")
    private String referencia;

    @Column(length = 100)
    private String distrito;

    @Column(length = 100)
    private String provincia;

    @Column(length = 100)
    private String departamento;

    @Column(name = "codigo_ubigeo", columnDefinition = "char(6)")
    private String codigoUbigeo;

    @Column(name = "codigo_postal", length = 20)
    private String codigoPostal;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    void onCreate() {
        if (creadoEn == null) {
            creadoEn = LocalDateTime.now();
        }
    }
}
