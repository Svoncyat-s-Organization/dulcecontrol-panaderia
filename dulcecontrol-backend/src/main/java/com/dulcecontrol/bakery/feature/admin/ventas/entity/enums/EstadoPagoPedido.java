package com.dulcecontrol.bakery.feature.admin.ventas.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EstadoPagoPedido {
    PENDIENTE("pendiente"),
    PARCIAL("parcial"),
    PAGADO_TOTAL("pagado_total"),
    REEMBOLSADO("reembolsado");

    private final String value;

    EstadoPagoPedido(String value) {
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
    public static EstadoPagoPedido fromValue(String value) {
        if (value == null) {
            return null;
        }
        for (EstadoPagoPedido estado : values()) {
            if (estado.value.equalsIgnoreCase(value)) {
                return estado;
            }
        }
        throw new IllegalArgumentException("Estado de pago desconocido: " + value);
    }
}
