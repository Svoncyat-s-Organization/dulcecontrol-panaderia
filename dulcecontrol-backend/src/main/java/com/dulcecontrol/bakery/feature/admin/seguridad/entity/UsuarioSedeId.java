package com.dulcecontrol.bakery.feature.admin.seguridad.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioSedeId implements Serializable {

    @Column(name = "usuario_id")
    private Long usuarioId;

    @Column(name = "sede_id")
    private Long sedeId;
}
