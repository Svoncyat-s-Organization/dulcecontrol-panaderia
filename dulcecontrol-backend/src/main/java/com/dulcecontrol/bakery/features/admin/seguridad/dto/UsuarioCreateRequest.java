package com.dulcecontrol.bakery.features.admin.seguridad.dto;

import java.util.List;

import com.dulcecontrol.bakery.features.admin.seguridad.entity.TipoDocumento;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioCreateRequest {

    @NotNull
    private Long rolId;

    @NotEmpty
    private List<Long> sedeIds;

    @Email
    @NotBlank
    private String correo;

    @NotBlank
    @Size(min = 8, max = 64)
    private String contrasena;

    @NotNull
    private TipoDocumento tipoDoc;

    @NotBlank
    @Pattern(regexp = "\\d{8}|\\d{11}", message = "El número de documento debe tener 8 dígitos para DNI o 11 para RUC")
    private String numeroDoc;

    @NotBlank
    private String nombres;

    @Size(max = 50)
    private String telefono;

    @AssertTrue(message = "El número de documento no coincide con el tipo seleccionado")
    public boolean isNumeroDocConsistenteConTipo() {
        if (tipoDoc == null || numeroDoc == null) {
            return true;
        }

        return switch (tipoDoc) {
            case DNI -> numeroDoc.matches("\\d{8}");
            case RUC -> numeroDoc.matches("\\d{11}");
        };
    }
}
