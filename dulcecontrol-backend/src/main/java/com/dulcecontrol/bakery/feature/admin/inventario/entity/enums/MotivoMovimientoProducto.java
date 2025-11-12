package com.dulcecontrol.bakery.feature.admin.inventario.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum MotivoMovimientoProducto {
    PRODUCCION("produccion"),
    VENTA("venta"),
    MERMA("merma"),
    AJUSTE("ajuste"),
    TRANSFERENCIA("transferencia"),
    DEVOLUCION("devolucion");

    private final String valor;

    MotivoMovimientoProducto(String valor) {
        this.valor = valor;
    }

    @JsonValue
    public String getValor() {
        return valor;
    }

    @JsonCreator
    public static MotivoMovimientoProducto fromString(String valor) {
        if (valor == null) {
            return null;
        }
        for (MotivoMovimientoProducto motivo : MotivoMovimientoProducto.values()) {
            if (motivo.valor.equalsIgnoreCase(valor) || motivo.name().equalsIgnoreCase(valor)) {
                return motivo;
            }
        }
        throw new IllegalArgumentException("Motivo de movimiento de producto no válido: " + valor);
    }

    @Override
    public String toString() {
        return valor;
    }
}
