package com.dulcecontrol.bakery.feature.admin.ventas.service.helper;

import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class VentasTenantValidator {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public void validarSedePerteneceATienda(Long tiendaId, Long sedeId) {
        if (sedeId == null) {
            return;
        }
        boolean pertenece = existe("SELECT COUNT(1) FROM sedes WHERE id = :id AND tienda_id = :tiendaId",
                tiendaId, sedeId);
        if (!pertenece) {
            throw new BadRequestException("La sede indicada no pertenece a la tienda");
        }
    }

    public void validarClientePerteneceATienda(Long tiendaId, Long clienteId) {
        if (clienteId == null) {
            return;
        }
        boolean pertenece = existe("SELECT COUNT(1) FROM clientes WHERE id = :id AND tienda_id = :tiendaId",
                tiendaId, clienteId);
        if (!pertenece) {
            throw new BadRequestException("El cliente indicado no pertenece a la tienda");
        }
    }

    public void validarPedidoPerteneceATienda(Long tiendaId, Long pedidoId) {
        if (pedidoId == null) {
            return;
        }
        boolean pertenece = existe("SELECT COUNT(1) FROM pedidos WHERE id = :id AND tienda_id = :tiendaId",
                tiendaId, pedidoId);
        if (!pertenece) {
            throw new BadRequestException("El pedido indicado no pertenece a la tienda");
        }
    }

    private boolean existe(String sql, Long tiendaId, Long id) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("tiendaId", tiendaId)
                .addValue("id", id);
        Integer count = jdbcTemplate.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }
}
