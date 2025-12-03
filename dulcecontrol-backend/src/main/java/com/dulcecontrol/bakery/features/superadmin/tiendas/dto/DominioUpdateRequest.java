package com.dulcecontrol.bakery.features.superadmin.tiendas.dto;

import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.enums.TipoDominioTienda;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DominioUpdateRequest {

    @NotNull(message = "El tipo de dominio es obligatorio")
    private TipoDominioTienda tipo;

    @NotBlank(message = "La URL del dominio es obligatoria")
    @Size(max = 255, message = "La URL del dominio no puede superar los 255 caracteres")
    @Pattern(regexp = "^[a-zA-Z0-9.-]+$", message = "La URL del dominio solo puede contener letras, números, puntos y guiones")
    private String urlDominio;

    @Size(max = 500, message = "La URL del logo no puede superar los 500 caracteres")
    private String urlLogo;

    @Size(max = 500, message = "La URL del favicon no puede superar los 500 caracteres")
    private String urlFavicon;

    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "El color primario debe estar en formato HEX #RRGGBB")
    private String colorPrimario;

    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "El color secundario debe estar en formato HEX #RRGGBB")
    private String colorSecundario;
}
