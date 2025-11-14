package com.dulcecontrol.bakery.features.admin.facturacion.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TipoComprobante {
    FACTURA("factura"),
    BOLETA("boleta"),
    NOTA_CREDITO("nota_credito"),
    NOTA_DEBITO("nota_debito");

    private final String valor;

    TipoComprobante(String valor) {
        this.valor = valor;
    }

    @JsonValue
    public String getValor() {
        return valor;
    }

    @JsonCreator
    public static TipoComprobante fromValor(String valor) {
        for (TipoComprobante tipo : TipoComprobante.values()) {
            if (tipo.valor.equalsIgnoreCase(valor)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de comprobante no válido: " + valor);
    }
}
