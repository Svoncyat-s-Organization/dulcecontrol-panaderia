package com.dulcecontrol.bakery.features.admin.configuracion.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class DatosEmpresaUpdateRequest {

    // Identidad Legal
    @NotBlank(message = "El RUC es obligatorio")
    @Pattern(regexp = "^\\d{11}$", message = "El RUC debe tener exactamente 11 dígitos numéricos")
    private String numeroDoc;

    @NotBlank(message = "La razón social es obligatoria")
    private String nombreDoc;

    @NotBlank(message = "El nombre comercial es obligatorio")
    private String nombreComercial;

    @NotBlank(message = "El correo de contacto es obligatorio")
    @Email(message = "El correo debe tener un formato válido")
    private String correoContacto;

    private String telefonoContacto;

    // Datos Fiscales
    @NotBlank(message = "La dirección fiscal es obligatoria")
    private String direccionFiscal;

    @NotBlank(message = "El ubigeo fiscal es obligatorio")
    @Pattern(regexp = "^\\d{6}$", message = "El ubigeo debe tener 6 dígitos")
    private String ubigeoFiscal;

    // Configuración SUNAT
    private String usuarioSunatSol;

    // NOTA: Solo se envía si el usuario quiere cambiarla (no se expone la actual)
    private String claveSunatSol; // Se envía sin encriptar, el backend la encripta

    private String certificadoDigitalUrl;

    @NotBlank(message = "El modo SUNAT es obligatorio")
    @Pattern(regexp = "^(PRUEBAS|PRODUCCION)$", message = "El modo debe ser PRUEBAS o PRODUCCION")
    private String modoSunat;

    // Parámetros Globales
    @NotNull(message = "La tasa IGV es obligatoria")
    @DecimalMin(value = "0.00", message = "La tasa IGV debe ser mayor o igual a 0")
    @DecimalMax(value = "100.00", message = "La tasa IGV debe ser menor o igual a 100")
    private BigDecimal tasaIgv;

    private String logoUrl;
}
