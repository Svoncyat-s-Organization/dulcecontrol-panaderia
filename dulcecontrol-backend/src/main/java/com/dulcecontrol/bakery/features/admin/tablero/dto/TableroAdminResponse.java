package com.dulcecontrol.bakery.features.admin.tablero.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TableroAdminResponse {
    private List<MetricaResumenResponse> resumenMetrics;
    private List<VentaHistoricaResponse> ventasHistoricas;
    private List<CategoriaVendidaResponse> categoriasMasVendidas;
    private List<PedidoRecienteResponse> pedidosRecientes;
    private List<ProductoBajoStockResponse> productosBajoStock;
    private List<MejorClienteResponse> mejoresClientes;
}
