package com.dulcecontrol.bakery.features.admin.inventario.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EstadoTransferencia {
    PENDIENTE("pendiente"),
    EN_TRANSITO("en_transito"),
    RECIBIDO("recibido"),
    CANCELADO("cancelado");

    private final String valor;

    EstadoTransferencia(String valor) {
        this.valor = valor;
    }

    @JsonValue
    public String getValor() {
        return valor;
    }

    @JsonCreator
    public static EstadoTransferencia fromString(String valor) {
        if (valor == null) {
            return null;
        }
        for (EstadoTransferencia estado : EstadoTransferencia.values()) {
            if (estado.valor.equalsIgnoreCase(valor) || estado.name().equalsIgnoreCase(valor)) {
                return estado;
            }
        }
        throw new IllegalArgumentException("Estado de transferencia no válido: " + valor);
    }

    @Override
    public String toString() {
        return valor;
    }
}
