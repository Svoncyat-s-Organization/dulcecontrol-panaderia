package com.dulcecontrol.bakery.enums;

/**
 * Métodos de pago disponibles
 * Según SQL: CHECK (metodo_pago IN ('efectivo','yape','plin','tarjeta'))
 */
public enum MetodoPago {
    EFECTIVO("efectivo"),
    YAPE("yape"),
    PLIN("plin"),
    TARJETA("tarjeta");

    private final String valor;

    MetodoPago(String valor) {
        this.valor = valor;
    }

    public String getValor() {
        return valor;
    }

    public static MetodoPago fromValor(String valor) {
        for (MetodoPago metodo : values()) {
            if (metodo.valor.equalsIgnoreCase(valor)) {
                return metodo;
            }
        }
        throw new IllegalArgumentException("Método de pago inválido: " + valor);
    }
}
