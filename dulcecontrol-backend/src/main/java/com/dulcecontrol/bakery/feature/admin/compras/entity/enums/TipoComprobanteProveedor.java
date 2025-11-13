package com.dulcecontrol.bakery.feature.admin.compras.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TipoComprobanteProveedor {
    FACTURA("factura"),
    BOLETA("boleta"),
    NOTA_CREDITO("nota_credito"),
    NOTA_DEBITO("nota_debito");

    private final String valor;

    TipoComprobanteProveedor(String valor) {
        this.valor = valor;
    }

    @JsonValue
    public String getValor() {
        return valor;
    }

    @JsonCreator
    public static TipoComprobanteProveedor fromValor(String valor) {
        for (TipoComprobanteProveedor tipo : TipoComprobanteProveedor.values()) {
            if (tipo.valor.equalsIgnoreCase(valor)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de comprobante no válido: " + valor);
    }
}
