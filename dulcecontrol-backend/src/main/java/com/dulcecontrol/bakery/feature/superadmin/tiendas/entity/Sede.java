package com.dulcecontrol.bakery.feature.superadmin.tiendas.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "sedes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE sedes SET eliminado_en = NOW(), activo = false WHERE id = ?")
@SQLRestriction("eliminado_en IS NULL")
public class Sede {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tienda_id", nullable = false)
    private Tienda tienda;

    @Column(name = "codigo_interno", length = 50)
    private String codigoInterno;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String direccion;

    @Column(length = 50)
    private String telefono;

    @Column(name = "distrito_id")
    private Long distritoId;

    @Column(name = "es_principal", nullable = false)
    private Boolean esPrincipal;

    @Column(nullable = false)
    private Boolean activo;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @Column(name = "eliminado_en")
    private LocalDateTime eliminadoEn;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        creadoEn = now;
        actualizadoEn = now;
        if (esPrincipal == null) {
            esPrincipal = Boolean.FALSE;
        }
        if (activo == null) {
            activo = Boolean.TRUE;
        }
    }

    @PreUpdate
    void onUpdate() {
        actualizadoEn = LocalDateTime.now();
    }
}
