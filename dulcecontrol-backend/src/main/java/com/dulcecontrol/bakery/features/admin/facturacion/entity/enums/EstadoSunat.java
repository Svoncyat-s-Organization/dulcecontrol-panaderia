package com.dulcecontrol.bakery.features.admin.facturacion.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EstadoSunat {
    PENDIENTE("pendiente"),
    ENVIADO("enviado"),
    ACEPTADO("aceptado"),
    OBSERVADO("observado"),
    RECHAZADO("rechazado"),
    ANULADO("anulado");

    private final String valor;

    EstadoSunat(String valor) {
        this.valor = valor;
    }

    @JsonValue
    public String getValor() {
        return valor;
    }

    @JsonCreator
    public static EstadoSunat fromValor(String valor) {
        for (EstadoSunat estado : EstadoSunat.values()) {
            if (estado.valor.equalsIgnoreCase(valor)) {
                return estado;
            }
        }
        throw new IllegalArgumentException("Estado SUNAT no válido: " + valor);
    }
}
