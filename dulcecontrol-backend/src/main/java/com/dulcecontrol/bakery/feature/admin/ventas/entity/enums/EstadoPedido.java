package com.dulcecontrol.bakery.feature.admin.ventas.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EstadoPedido {
    BORRADOR("borrador"),
    PENDIENTE_PAGO("pendiente_pago"),
    PAGADO("pagado"),
    EN_PREPARACION("en_preparacion"),
    LISTO_ENTREGA("listo_entrega"),
    ENTREGADO("entregado"),
    CANCELADO("cancelado"),
    DEVUELTO("devuelto");

    private final String value;

    EstadoPedido(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return value;
    }

    @JsonCreator
    public static EstadoPedido fromValue(String value) {
        if (value == null) {
            return null;
        }
        for (EstadoPedido estado : values()) {
            if (estado.value.equalsIgnoreCase(value)) {
                return estado;
            }
        }
        throw new IllegalArgumentException("Estado de pedido desconocido: " + value);
    }
}
