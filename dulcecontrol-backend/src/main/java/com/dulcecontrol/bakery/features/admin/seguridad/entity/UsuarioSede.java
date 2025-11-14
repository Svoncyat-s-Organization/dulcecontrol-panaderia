package com.dulcecontrol.bakery.features.admin.seguridad.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "usuario_sedes")
@Data
public class UsuarioSede {

    @EmbeddedId
    private UsuarioSedeId id;

    @Column(name = "es_sede_principal")
    private Boolean esSedePrincipal = Boolean.FALSE;
}
