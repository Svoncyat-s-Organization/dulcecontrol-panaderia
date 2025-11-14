package com.dulcecontrol.bakery.features.admin.produccion.entity.enums;

import java.util.Arrays;

public enum UnidadMedidaReceta {
    UNIDAD("unidad"),
    KG("kg"),
    G("g"),
    L("l"),
    ML("ml"),
    PAQUETE("paquete"),
    SACO("saco"),
    LATA("lata");

    private final String dbValue;

    UnidadMedidaReceta(String dbValue) {
        this.dbValue = dbValue;
    }

    public String getDbValue() {
        return dbValue;
    }

    public static UnidadMedidaReceta fromDbValue(String value) {
        return Arrays.stream(values())
                .filter(item -> item.dbValue.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unidad de medida desconocida: " + value));
    }
}
