package com.dulcecontrol.bakery.feature.admin.ventas.controller.dto;

import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.TipoDireccionPedido;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.TipoDocumentoContacto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DireccionPedidoCreateRequest(
        @NotNull TipoDireccionPedido tipoDireccion,
        @NotBlank @Size(max = 255) String nombreContacto,
        TipoDocumentoContacto tipoDocContacto,
        @Size(max = 20) String numeroDocContacto,
        @NotBlank @Size(max = 50) String telefonoContacto,
        @Size(max = 255) String emailContacto,
        @NotBlank String direccionCompleta,
        String referencia,
        @Size(max = 100) String distrito,
        @Size(max = 100) String provincia,
        @Size(max = 100) String departamento,
        @Size(max = 6) String codigoUbigeo,
        @Size(max = 20) String codigoPostal
) {
}
