package com.dulcecontrol.bakery.features.admin.clientes.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TipoDocumento {
    DNI,
    RUC;

    @JsonCreator
    public static TipoDocumento fromString(String value) {
        if (value == null) {
            return null;
        }
        for (TipoDocumento tipo : TipoDocumento.values()) {
            if (tipo.name().equalsIgnoreCase(value)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de documento inválido: " + value);
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}