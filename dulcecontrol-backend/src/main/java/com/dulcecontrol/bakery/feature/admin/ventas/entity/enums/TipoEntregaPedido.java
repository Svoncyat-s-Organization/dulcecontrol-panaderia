package com.dulcecontrol.bakery.feature.admin.ventas.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TipoEntregaPedido {
    RECOJO_TIENDA("recojo_tienda"),
    DELIVERY("delivery"),
    CONSUMO_LOCAL("consumo_local");

    private final String value;

    TipoEntregaPedido(String value) {
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
    public static TipoEntregaPedido fromValue(String value) {
        if (value == null) {
            return null;
        }
        for (TipoEntregaPedido tipo : values()) {
            if (tipo.value.equalsIgnoreCase(value)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de entrega desconocido: " + value);
    }
}
