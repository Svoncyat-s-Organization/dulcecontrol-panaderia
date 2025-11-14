package com.dulcecontrol.bakery.features.admin.facturacion.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TipoDocumentoCliente {
    DNI("DNI"),
    RUC("RUC");

    private final String valor;

    TipoDocumentoCliente(String valor) {
        this.valor = valor;
    }

    @JsonValue
    public String getValor() {
        return valor;
    }

    @JsonCreator
    public static TipoDocumentoCliente fromValor(String valor) {
        for (TipoDocumentoCliente tipo : TipoDocumentoCliente.values()) {
            if (tipo.valor.equalsIgnoreCase(valor)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de documento no válido: " + valor);
    }
}
