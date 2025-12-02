package com.dulcecontrol.bakery.features.admin.produccion.entity.enums;

import java.util.Arrays;

public enum EstadoItemProduccion {
    PENDIENTE("pendiente"),
    EN_HORNO("en_horno"),
    TERMINADO("terminado"),
    MERMA("merma");

    private final String dbValue;

    EstadoItemProduccion(String dbValue) {
        this.dbValue = dbValue;
    }

    public String getDbValue() {
        return dbValue;
    }

    public static EstadoItemProduccion fromDbValue(String value) {
        return Arrays.stream(values())
                .filter(item -> item.dbValue.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Estado de item desconocido: " + value));
    }

    @Override
    public String toString() {
        return dbValue;
    }
}
