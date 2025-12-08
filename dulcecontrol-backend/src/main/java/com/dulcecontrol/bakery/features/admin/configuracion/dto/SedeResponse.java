package com.dulcecontrol.bakery.features.admin.configuracion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SedeResponse {
    private Long id;
    private Long tiendaId;
    private String codigoInterno;
    private String nombre;
    private String direccion;
    private String telefono;
    private Long distritoId;
    private String distritoNombre;
    private String provinciaNombre;
    private String departamentoNombre;
    private Boolean esPrincipal;
    private Boolean activo;
    private LocalDateTime creadoEn;
    private LocalDateTime actualizadoEn;
}
