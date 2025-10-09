package com.dulcecontrol.bakery.enums;

/**
 * Tipo de gasto
 * Según SQL: CHECK (tipo IN ('operativo','administrativo','servicios','otros'))
 */
public enum TipoGasto {
    OPERATIVO("operativo"),
    ADMINISTRATIVO("administrativo"),
    SERVICIOS("servicios"),
    OTROS("otros");

    private final String valor;

    TipoGasto(String valor) {
        this.valor = valor;
    }

    public String getValor() {
        return valor;
    }

    public static TipoGasto fromValor(String valor) {
        for (TipoGasto tipo : values()) {
            if (tipo.valor.equalsIgnoreCase(valor)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de gasto inválido: " + valor);
    }
}
