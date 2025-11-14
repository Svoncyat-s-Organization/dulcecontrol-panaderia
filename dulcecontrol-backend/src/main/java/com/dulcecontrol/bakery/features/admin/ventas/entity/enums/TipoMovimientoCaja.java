package com.dulcecontrol.bakery.features.admin.ventas.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TipoMovimientoCaja {
    VENTA("venta"),
    DEVOLUCION("devolucion"),
    GASTO_OPERATIVO("gasto_operativo"),
    RETIRO_EFECTIVO("retiro_efectivo"),
    INGRESO_EFECTIVO("ingreso_efectivo"),
    AJUSTE("ajuste");

    private final String value;

    TipoMovimientoCaja(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return value;
    }

    @JsonCreator
    public static TipoMovimientoCaja fromValue(String value) {
        if (value == null) {
            return null;
        }
        for (TipoMovimientoCaja tipo : values()) {
            if (tipo.value.equalsIgnoreCase(value)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de movimiento de caja desconocido: " + value);
    }
}
