package com.dulcecontrol.bakery.enums;

/**
 * Estados posibles de una venta
 * Según SQL: CHECK (estado IN ('emitida','anulada'))
 */
public enum EstadoVenta {
    EMITIDA("emitida"),
    ANULADA("anulada");

    private final String valor;

    EstadoVenta(String valor) {
        this.valor = valor;
    }

    public String getValor() {
        return valor;
    }

    public static EstadoVenta fromValor(String valor) {
        for (EstadoVenta estado : values()) {
            if (estado.valor.equalsIgnoreCase(valor)) {
                return estado;
            }
        }
        throw new IllegalArgumentException("Estado de venta inválido: " + valor);
    }
}
