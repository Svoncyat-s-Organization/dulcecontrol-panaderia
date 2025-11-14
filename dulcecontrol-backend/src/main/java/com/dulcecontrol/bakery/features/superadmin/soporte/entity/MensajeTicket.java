package com.dulcecontrol.bakery.features.superadmin.soporte.entity;

import com.dulcecontrol.bakery.features.superadmin.soporte.entity.enums.TipoRemitente;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensajes_ticket")
@Data
public class MensajeTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_id", nullable = false)
    private Long ticketId;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_remitente", nullable = false, columnDefinition = "ENUM('superadmin','tienda','sistema')")
    private TipoRemitente tipoRemitente;

    @Column(name = "autor_admin_id")
    private Long autorAdminId;

    @Column(name = "mensaje", columnDefinition = "TEXT", nullable = false)
    private String mensaje;

    @Column(name = "es_nota_interna", nullable = false)
    private Boolean esNotaInterna = Boolean.FALSE;

    @Column(name = "leido_en")
    private LocalDateTime leidoEn;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    void onCreate() {
        creadoEn = LocalDateTime.now();
        if (esNotaInterna == null) esNotaInterna = Boolean.FALSE;
    }
}