package com.dulcecontrol.bakery.feature.admin.ventas.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TipoDireccionPedido {
    FACTURACION("facturacion"),
    ENVIO("envio");

    private final String value;

    TipoDireccionPedido(String value) {
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
    public static TipoDireccionPedido fromValue(String value) {
        if (value == null) {
            return null;
        }
        for (TipoDireccionPedido tipo : values()) {
            if (tipo.value.equalsIgnoreCase(value)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de dirección de pedido desconocido: " + value);
    }
}
