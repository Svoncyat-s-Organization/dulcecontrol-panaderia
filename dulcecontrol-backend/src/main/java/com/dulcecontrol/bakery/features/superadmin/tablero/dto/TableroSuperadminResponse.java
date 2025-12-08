package com.dulcecontrol.bakery.features.superadmin.tablero.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TableroSuperadminResponse {
    private List<MetricaSuperadminResponse> resumenMetrics;
    private List<FacturacionMensualResponse> facturacionMensual;
    private List<DistribucionPlanResponse> distribucionPlanes;
    private List<TicketCriticoResponse> ticketsCriticos;
    private List<RenovacionProximaResponse> renovacionesProximas;
    private List<ActividadSeguridadResponse> actividadSeguridad;
}
