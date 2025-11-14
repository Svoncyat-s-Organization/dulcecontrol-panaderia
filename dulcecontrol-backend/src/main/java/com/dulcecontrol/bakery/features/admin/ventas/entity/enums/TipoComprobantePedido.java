package com.dulcecontrol.bakery.features.admin.ventas.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TipoComprobantePedido {
    FACTURA("factura"),
    BOLETA("boleta"),
    NOTA_CREDITO("nota_credito"),
    NOTA_DEBITO("nota_debito");

    private final String value;

    TipoComprobantePedido(String value) {
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
    public static TipoComprobantePedido fromValue(String value) {
        if (value == null) {
            return null;
        }
        for (TipoComprobantePedido tipo : values()) {
            if (tipo.value.equalsIgnoreCase(value)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de comprobante desconocido: " + value);
    }
}
