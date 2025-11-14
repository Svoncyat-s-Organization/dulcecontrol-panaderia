package com.dulcecontrol.bakery.features.admin.compras.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EstadoOrdenCompra {
    BORRADOR("borrador"),
    ENVIADA("enviada"),
    RECIBIDA_PARCIAL("recibida_parcial"),
    RECIBIDA_TOTAL("recibida_total"),
    CANCELADA("cancelada");

    private final String valor;

    EstadoOrdenCompra(String valor) {
        this.valor = valor;
    }

    @JsonValue
    public String getValor() {
        return valor;
    }

    @JsonCreator
    public static EstadoOrdenCompra fromValor(String valor) {
        for (EstadoOrdenCompra estado : EstadoOrdenCompra.values()) {
            if (estado.valor.equalsIgnoreCase(valor)) {
                return estado;
            }
        }
        throw new IllegalArgumentException("Estado de orden de compra no válido: " + valor);
    }
}
