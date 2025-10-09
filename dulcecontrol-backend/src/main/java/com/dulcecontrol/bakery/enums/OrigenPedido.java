package com.dulcecontrol.bakery.enums;

/**
 * Origen del pedido
 * Según SQL: CHECK (origen IN ('local','online'))
 */
public enum OrigenPedido {
    LOCAL("local"),
    ONLINE("online");

    private final String valor;

    OrigenPedido(String valor) {
        this.valor = valor;
    }

    public String getValor() {
        return valor;
    }

    public static OrigenPedido fromValor(String valor) {
        for (OrigenPedido origen : values()) {
            if (origen.valor.equalsIgnoreCase(valor)) {
                return origen;
            }
        }
        throw new IllegalArgumentException("Origen de pedido inválido: " + valor);
    }
}
