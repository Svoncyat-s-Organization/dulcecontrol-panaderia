package com.dulcecontrol.bakery.shared.integration.decolecta.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class SunatRucBasicoResponse {
    
    @JsonProperty("razon_social")
    private String razonSocial;
    
    @JsonProperty("numero_documento")
    private String numeroDocumento;
    
    private String estado;
    
    private String condicion;
    
    private String direccion;
    
    private String ubigeo;
    
    @JsonProperty("via_tipo")
    private String viaTipo;
    
    @JsonProperty("via_nombre")
    private String viaNombre;
    
    @JsonProperty("zona_codigo")
    private String zonaCodigo;
    
    @JsonProperty("zona_tipo")
    private String zonaTipo;
    
    private String numero;
    
    private String interior;
    
    private String lote;
    
    private String dpto;
    
    private String manzana;
    
    private String kilometro;
    
    private String distrito;
    
    private String provincia;
    
    private String departamento;
    
    @JsonProperty("es_agente_retencion")
    private Boolean esAgenteRetencion;
    
    @JsonProperty("es_buen_contribuyente")
    private Boolean esBuenContribuyente;
    
    @JsonProperty("locales_anexos")
    private Object localesAnexos;
}
