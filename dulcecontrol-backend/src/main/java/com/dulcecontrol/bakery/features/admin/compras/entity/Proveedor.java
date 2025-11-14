package com.dulcecontrol.bakery.features.admin.compras.entity;

import com.dulcecontrol.bakery.features.admin.compras.entity.enums.TipoDocumentoProveedor;
import com.dulcecontrol.bakery.features.admin.compras.entity.converter.TipoDocumentoProveedorConverter;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "proveedores")
@Data
public class Proveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(name = "nombre_comercial", nullable = false)
    private String nombreComercial;

    @Convert(converter = TipoDocumentoProveedorConverter.class)
    @Column(name = "tipo_doc", nullable = false, columnDefinition = "ENUM('DNI', 'RUC')")
    private TipoDocumentoProveedor tipoDoc;

    @Column(name = "numero_doc", length = 20)
    private String numeroDoc;

    @Column(name = "razon_social")
    private String razonSocial;

    @Column(name = "nombre_contacto")
    private String nombreContacto;

    @Column(name = "telefono_contacto", length = 50)
    private String telefonoContacto;

    @Column(name = "email_contacto")
    private String emailContacto;

    @Column(name = "es_generico")
    private Boolean esGenerico = Boolean.FALSE;

    @Column(nullable = false)
    private Boolean activo = Boolean.TRUE;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    void onCreate() {
        creadoEn = LocalDateTime.now();
        if (activo == null) {
            activo = Boolean.TRUE;
        }
        if (esGenerico == null) {
            esGenerico = Boolean.FALSE;
        }
    }
}
