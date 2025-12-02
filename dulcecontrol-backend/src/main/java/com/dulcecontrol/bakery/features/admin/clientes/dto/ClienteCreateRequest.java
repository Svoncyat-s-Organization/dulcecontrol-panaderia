package com.dulcecontrol.bakery.features.admin.clientes.dto;

import com.dulcecontrol.bakery.features.admin.clientes.entity.enums.TipoDocumento;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClienteCreateRequest {

    private TipoDocumento tipoDocumento;

    private String numeroDoc;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombreDoc;

    @Email(message = "El email debe tener un formato válido")
    private String email;

    private String telefono;

    private Boolean esUsuarioVirtual;

    private String hashContrasena;

    private String notas;

    // Campos de dirección
    private String direccionEtiqueta;

    @NotBlank(message = "La dirección completa es obligatoria")
    private String direccionCompleta;

    private String direccionReferencia;

    private Long direccionDistritoId;

    private String direccionCodigoPostal;

    private Boolean direccionEsFiscal;

    private Boolean direccionEsEntrega;
}