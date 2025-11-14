package com.dulcecontrol.bakery.features.admin.ventas.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TipoDocumentoContacto {
    DNI("DNI"),
    RUC("RUC");

    private final String value;

    TipoDocumentoContacto(String value) {
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
    public static TipoDocumentoContacto fromValue(String value) {
        if (value == null) {
            return null;
        }
        for (TipoDocumentoContacto tipo : values()) {
            if (tipo.value.equalsIgnoreCase(value)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de documento de contacto desconocido: " + value);
    }
}
