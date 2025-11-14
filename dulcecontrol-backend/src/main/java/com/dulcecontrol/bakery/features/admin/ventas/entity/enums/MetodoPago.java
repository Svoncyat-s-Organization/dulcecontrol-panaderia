package com.dulcecontrol.bakery.features.admin.ventas.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum MetodoPago {
    EFECTIVO("efectivo"),
    YAPE("yape"),
    PLIN("plin"),
    TARJETA_CREDITO("tarjeta_credito"),
    TARJETA_DEBITO("tarjeta_debito"),
    TRANSFERENCIA("transferencia"),
    PASARELA_ONLINE("pasarela_online");

    private final String value;

    MetodoPago(String value) {
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
    public static MetodoPago fromValue(String value) {
        if (value == null) {
            return null;
        }
        for (MetodoPago metodo : values()) {
            if (metodo.value.equalsIgnoreCase(value)) {
                return metodo;
            }
        }
        throw new IllegalArgumentException("Método de pago desconocido: " + value);
    }
}
