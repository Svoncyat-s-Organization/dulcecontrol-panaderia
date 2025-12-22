package com.dulcecontrol.bakery.shared.integration.decolecta.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class SunatRucFullResponse extends SunatRucBasicoResponse {
    
    private String tipo;
    
    @JsonProperty("actividad_economica")
    private String actividadEconomica;
    
    @JsonProperty("numero_trabajadores")
    private String numeroTrabajadores;
    
    @JsonProperty("tipo_facturacion")
    private String tipoFacturacion;
    
    @JsonProperty("tipo_contabilidad")
    private String tipoContabilidad;
    
    @JsonProperty("comercio_exterior")
    private String comercioExterior;
}
