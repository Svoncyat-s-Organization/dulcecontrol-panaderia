package com.dulcecontrol.bakery.features.admin.seguridad.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "auditoria_usuarios")
@Data
public class AuditoriaUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(name = "usuario_id")
    private Long usuarioId;

    @Column(nullable = false, length = 100)
    private String accion;

    @Column(nullable = false, length = 100)
    private String entidad;

    @Column(name = "entidad_id")
    private Long entidadId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "valores_anteriores", columnDefinition = "JSON")
    private Map<String, Object> valoresAnteriores;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "valores_nuevos", columnDefinition = "JSON")
    private Map<String, Object> valoresNuevos;

    @Column(name = "ip_origen", length = 45)
    private String ipOrigen;

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    protected void onCreate() {
        creadoEn = LocalDateTime.now();
    }
}
