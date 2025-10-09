package com.dulcecontrol.bakery.enums;

/**
 * Estados posibles de un pedido
 * Según SQL: CHECK (estado IN
 * ('pendiente','en_preparacion','listo','entregado','anulado'))
 */
public enum EstadoPedido {
    PENDIENTE("pendiente"),
    EN_PREPARACION("en_preparacion"),
    LISTO("listo"),
    ENTREGADO("entregado"),
    ANULADO("anulado");

    private final String valor;

    EstadoPedido(String valor) {
        this.valor = valor;
    }

    public String getValor() {
        return valor;
    }

    public static EstadoPedido fromValor(String valor) {
        for (EstadoPedido estado : values()) {
            if (estado.valor.equalsIgnoreCase(valor)) {
                return estado;
            }
        }
        throw new IllegalArgumentException("Estado de pedido inválido: " + valor);
    }
}
