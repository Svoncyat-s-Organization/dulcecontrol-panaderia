package com.dulcecontrol.bakery.enums;

/**
 * Estado del pago online
 * Según SQL: CHECK (pago_online_estado IN ('pendiente','pagado','rechazado'))
 */
public enum EstadoPagoOnline {
    PENDIENTE("pendiente"),
    PAGADO("pagado"),
    RECHAZADO("rechazado");

    private final String valor;

    EstadoPagoOnline(String valor) {
        this.valor = valor;
    }

    public String getValor() {
        return valor;
    }

    public static EstadoPagoOnline fromValor(String valor) {
        for (EstadoPagoOnline estado : values()) {
            if (estado.valor.equalsIgnoreCase(valor)) {
                return estado;
            }
        }
        throw new IllegalArgumentException("Estado de pago online inválido: " + valor);
    }
}
