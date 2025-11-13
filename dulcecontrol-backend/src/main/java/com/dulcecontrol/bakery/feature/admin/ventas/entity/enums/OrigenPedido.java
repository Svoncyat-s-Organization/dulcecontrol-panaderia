package com.dulcecontrol.bakery.feature.admin.ventas.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum OrigenPedido {
    POS_LOCAL("pos_local"),
    STOREFRONT_ONLINE("storefront_online"),
    TELEFONO("telefono");

    private final String value;

    OrigenPedido(String value) {
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
    public static OrigenPedido fromValue(String value) {
        if (value == null) {
            return null;
        }
        for (OrigenPedido origen : values()) {
            if (origen.value.equalsIgnoreCase(value)) {
                return origen;
            }
        }
        throw new IllegalArgumentException("Origen de pedido desconocido: " + value);
    }
}
