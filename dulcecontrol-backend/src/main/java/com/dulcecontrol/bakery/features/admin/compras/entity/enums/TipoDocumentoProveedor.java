package com.dulcecontrol.bakery.features.admin.compras.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TipoDocumentoProveedor {
    DNI("DNI"),
    RUC("RUC");

    private final String valor;

    TipoDocumentoProveedor(String valor) {
        this.valor = valor;
    }

    @JsonValue
    public String getValor() {
        return valor;
    }

    @JsonCreator
    public static TipoDocumentoProveedor fromValor(String valor) {
        for (TipoDocumentoProveedor tipo : TipoDocumentoProveedor.values()) {
            if (tipo.valor.equalsIgnoreCase(valor)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de documento no válido: " + valor);
    }
}
