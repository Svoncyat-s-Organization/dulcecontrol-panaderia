package com.dulcecontrol.bakery.feature.admin.compras.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum UnidadMedida {
    UNIDAD("unidad"),
    KG("kg"),
    G("g"),
    L("l"),
    ML("ml"),
    PAQUETE("paquete"),
    SACO("saco"),
    LATA("lata");

    private final String valor;

    UnidadMedida(String valor) {
        this.valor = valor;
    }

    @JsonValue
    public String getValor() {
        return valor;
    }

    @JsonCreator
    public static UnidadMedida fromValor(String valor) {
        for (UnidadMedida unidad : UnidadMedida.values()) {
            if (unidad.valor.equalsIgnoreCase(valor)) {
                return unidad;
            }
        }
        throw new IllegalArgumentException("Unidad de medida no válida: " + valor);
    }
}
