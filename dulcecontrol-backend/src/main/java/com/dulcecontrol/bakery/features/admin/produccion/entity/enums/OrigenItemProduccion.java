package com.dulcecontrol.bakery.features.admin.produccion.entity.enums;

import java.util.Arrays;

public enum OrigenItemProduccion {
    STOCK_DIARIO("stock_diario"),
    PEDIDO_CLIENTE("pedido_cliente");

    private final String dbValue;

    OrigenItemProduccion(String dbValue) {
        this.dbValue = dbValue;
    }

    public String getDbValue() {
        return dbValue;
    }

    public static OrigenItemProduccion fromDbValue(String value) {
        return Arrays.stream(values())
                .filter(item -> item.dbValue.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Origen de producción desconocido: " + value));
    }

    @Override
    public String toString() {
        return dbValue;
    }
}
