package com.dulcecontrol.bakery.features.admin.catalogo.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TipoProducto {
    PRODUCTO_TERMINADO("producto_terminado"),
    INSUMO_VENTA("insumo_venta"),
    SERVICIO("servicio");

    private final String value;

    TipoProducto(String value) {
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
    public static TipoProducto fromValue(String value) {
        for (TipoProducto tipo : values()) {
            if (tipo.value.equalsIgnoreCase(value)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de producto desconocido: " + value);
    }
}
