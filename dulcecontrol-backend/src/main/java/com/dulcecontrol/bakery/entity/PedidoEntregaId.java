package com.dulcecontrol.bakery.entity;

import java.io.Serializable;
import java.util.Objects;

/**
 * Clase ID para PedidoEntrega.
 * PedidoEntrega usa Pedido como su clave primaria (relación @OneToOne con @Id
 * compartido).
 * Esta clase permite a Spring Data JPA trabajar correctamente con el
 * repositorio.
 */
public class PedidoEntregaId implements Serializable {

    private static final long serialVersionUID = 1L;

    private Pedido pedido; // Debe coincidir con el tipo y nombre del campo en PedidoEntrega

    public PedidoEntregaId() {
    }

    public PedidoEntregaId(Pedido pedido) {
        this.pedido = pedido;
    }

    // Constructor de compatibilidad para controllers
    public PedidoEntregaId(Long pedidoId) {
        if (pedidoId != null) {
            this.pedido = new Pedido();
            this.pedido.setId(pedidoId);
        }
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        PedidoEntregaId that = (PedidoEntregaId) o;
        return Objects.equals(pedido, that.pedido);
    }

    @Override
    public int hashCode() {
        return Objects.hash(pedido);
    }
}
