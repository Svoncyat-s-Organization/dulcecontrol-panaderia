package com.dulcecontrol.bakery.enums;

/**
 * Tipos de comprobante válidos
 * Según SQL: CHECK (comprobante_tipo IN ('boleta','factura','ticket'))
 */
public enum TipoComprobante {
    BOLETA("boleta"),
    FACTURA("factura"),
    TICKET("ticket");

    private final String valor;

    TipoComprobante(String valor) {
        this.valor = valor;
    }

    public String getValor() {
        return valor;
    }

    public static TipoComprobante fromValor(String valor) {
        for (TipoComprobante tipo : values()) {
            if (tipo.valor.equalsIgnoreCase(valor)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de comprobante inválido: " + valor);
    }
}
