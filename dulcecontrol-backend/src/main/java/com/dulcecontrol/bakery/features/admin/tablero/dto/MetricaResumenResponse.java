package com.dulcecontrol.bakery.features.admin.tablero.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MetricaResumenResponse {
    private String key;
    private String title;
    private String value;
    private String description;
    private String trend;
    private String trendColor;
    private String icon;
}
