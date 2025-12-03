package com.dulcecontrol.bakery.features.admin.produccion.entity.enums;

import java.util.Arrays;

public enum EstadoPlanProduccion {
    BORRADOR("borrador"),
    CONFIRMADO("confirmado"),
    EN_PROCESO("en_proceso"),
    FINALIZADO("finalizado"),
    CANCELADO("cancelado");

    private final String dbValue;

    EstadoPlanProduccion(String dbValue) {
        this.dbValue = dbValue;
    }

    public String getDbValue() {
        return dbValue;
    }

    public static EstadoPlanProduccion fromDbValue(String value) {
        return Arrays.stream(values())
                .filter(item -> item.dbValue.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Estado de plan desconocido: " + value));
    }

    @Override
    public String toString() {
        return dbValue;
    }
}
