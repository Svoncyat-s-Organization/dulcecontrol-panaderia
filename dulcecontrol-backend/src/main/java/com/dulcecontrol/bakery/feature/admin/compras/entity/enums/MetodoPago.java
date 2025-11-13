package com.dulcecontrol.bakery.feature.admin.compras.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum MetodoPago {
    EFECTIVO("efectivo"),
    TRANSFERENCIA("transferencia"),
    CREDITO("credito"),
    TARJETA("tarjeta");

    private final String valor;

    MetodoPago(String valor) {
        this.valor = valor;
    }

    @JsonValue
    public String getValor() {
        return valor;
    }

    @JsonCreator
    public static MetodoPago fromValor(String valor) {
        for (MetodoPago metodo : MetodoPago.values()) {
            if (metodo.valor.equalsIgnoreCase(valor)) {
                return metodo;
            }
        }
        throw new IllegalArgumentException("Método de pago no válido: " + valor);
    }
}
