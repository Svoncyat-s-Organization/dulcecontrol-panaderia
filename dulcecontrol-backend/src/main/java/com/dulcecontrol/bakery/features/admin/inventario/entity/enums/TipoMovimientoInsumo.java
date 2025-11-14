package com.dulcecontrol.bakery.features.admin.inventario.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TipoMovimientoInsumo {
    ENTRADA("entrada"),
    SALIDA("salida"),
    AJUSTE("ajuste"),
    TRANSFERENCIA("transferencia");

    private final String valor;

    TipoMovimientoInsumo(String valor) {
        this.valor = valor;
    }

    @JsonValue
    public String getValor() {
        return valor;
    }

    @JsonCreator
    public static TipoMovimientoInsumo fromString(String valor) {
        if (valor == null) {
            return null;
        }
        for (TipoMovimientoInsumo tipo : TipoMovimientoInsumo.values()) {
            if (tipo.valor.equalsIgnoreCase(valor) || tipo.name().equalsIgnoreCase(valor)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de movimiento de insumo no válido: " + valor);
    }

    @Override
    public String toString() {
        return valor;
    }
}
