package com.dulcecontrol.bakery.enums;

/**
 * Modalidad de entrega del pedido
 * Según SQL: CHECK (modalidad IN ('retiro','delivery'))
 */
public enum ModalidadEntrega {
    RETIRO("retiro"),
    DELIVERY("delivery");

    private final String valor;

    ModalidadEntrega(String valor) {
        this.valor = valor;
    }

    public String getValor() {
        return valor;
    }

    public static ModalidadEntrega fromValor(String valor) {
        for (ModalidadEntrega modalidad : values()) {
            if (modalidad.valor.equalsIgnoreCase(valor)) {
                return modalidad;
            }
        }
        throw new IllegalArgumentException("Modalidad de entrega inválida: " + valor);
    }
}
