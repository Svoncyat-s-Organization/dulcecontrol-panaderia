package com.dulcecontrol.bakery.features.admin.tablero.service.impl;

import com.dulcecontrol.bakery.features.admin.tablero.dto.*;
import com.dulcecontrol.bakery.features.admin.tablero.service.ITableroAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TableroAdminServiceImpl implements ITableroAdminService {

    private final EntityManager entityManager;

    private static final DecimalFormat MONEY_FORMAT = new DecimalFormat("S/ #,##0.00");
    private static final DateTimeFormatter DAY_FORMATTER = DateTimeFormatter.ofPattern("dd MMM");

    @Override
    public TableroAdminResponse obtenerEstadisticas(Long tiendaId, Long sedeId) {
        TableroAdminResponse response = new TableroAdminResponse();
        
        response.setResumenMetrics(obtenerMetricasResumen(tiendaId, sedeId));
        response.setVentasHistoricas(obtenerVentasHistoricas(tiendaId, sedeId));
        response.setCategoriasMasVendidas(obtenerCategoriasMasVendidas(tiendaId, sedeId));
        response.setPedidosRecientes(obtenerPedidosRecientes(tiendaId, sedeId));
        response.setProductosBajoStock(obtenerProductosBajoStock(tiendaId, sedeId));
        response.setMejoresClientes(obtenerMejoresClientes(tiendaId, sedeId));

        return response;
    }

    private List<MetricaResumenResponse> obtenerMetricasResumen(Long tiendaId, Long sedeId) {
        List<MetricaResumenResponse> metricas = new ArrayList<>();
        
        LocalDateTime inicioDia = LocalDate.now().atStartOfDay();
        LocalDateTime finDia = inicioDia.plusDays(1);
        LocalDateTime inicioAyer = inicioDia.minusDays(1);
        LocalDateTime finAyer = inicioDia;
        
        // Ventas del día
        String sqlVentasHoy = "SELECT COALESCE(SUM(p.monto_pagado_centimos), 0) / 100.0 FROM pedidos p WHERE p.tienda_id = :tiendaId " +
                (sedeId != null ? "AND p.sede_origen_id = :sedeId " : "") +
                "AND p.creado_en >= :inicio AND p.creado_en < :fin AND p.estado_pedido != 'CANCELADO'";
        Query queryVentasHoy = entityManager.createNativeQuery(sqlVentasHoy);
        queryVentasHoy.setParameter("tiendaId", tiendaId);
        queryVentasHoy.setParameter("inicio", inicioDia);
        queryVentasHoy.setParameter("fin", finDia);
        if (sedeId != null) queryVentasHoy.setParameter("sedeId", sedeId);
        Object result = queryVentasHoy.getSingleResult();
        BigDecimal ventasHoy = result != null ? new BigDecimal(result.toString()) : BigDecimal.ZERO;
        
        // Ventas de ayer
        Query queryVentasAyer = entityManager.createNativeQuery(sqlVentasHoy);
        queryVentasAyer.setParameter("tiendaId", tiendaId);
        queryVentasAyer.setParameter("inicio", inicioAyer);
        queryVentasAyer.setParameter("fin", finAyer);
        if (sedeId != null) queryVentasAyer.setParameter("sedeId", sedeId);
        Object resultAyer = queryVentasAyer.getSingleResult();
        BigDecimal ventasAyer = resultAyer != null ? new BigDecimal(resultAyer.toString()) : BigDecimal.ZERO;
        
        String trendVentas = calcularTrend(ventasHoy, ventasAyer);
        String trendColorVentas = ventasHoy.compareTo(ventasAyer) >= 0 ? "green" : "red";
        
        metricas.add(new MetricaResumenResponse(
            "ventas-dia",
            "Ventas del día",
            MONEY_FORMAT.format(ventasHoy),
            "vs. ayer",
            trendVentas,
            trendColorVentas,
            "cash"
        ));
        
        // Pedidos del día
        String sqlPedidosHoy = "SELECT COUNT(*) FROM pedidos p WHERE p.tienda_id = :tiendaId " +
                (sedeId != null ? "AND p.sede_origen_id = :sedeId " : "") +
                "AND DATE(p.creado_en) = CURDATE()";
        Query queryPedidosHoy = entityManager.createNativeQuery(sqlPedidosHoy);
        queryPedidosHoy.setParameter("tiendaId", tiendaId);
        if (sedeId != null) queryPedidosHoy.setParameter("sedeId", sedeId);
        Long pedidosHoy = ((Number) queryPedidosHoy.getSingleResult()).longValue();
        
        metricas.add(new MetricaResumenResponse(
            "pedidos-nuevos",
            "Pedidos del día",
            String.valueOf(pedidosHoy),
            "Hoy",
            "",
            "secondary",
            "shopping"
        ));
        
        // Productos bajo stock
        String sqlBajoStock = "SELECT COUNT(*) FROM inventario_productos ip " +
                "INNER JOIN productos p ON ip.producto_id = p.id " +
                "INNER JOIN stock_ideal si ON ip.producto_id = si.producto_id AND ip.sede_id = si.sede_id " +
                "WHERE p.tienda_id = :tiendaId " +
                (sedeId != null ? "AND ip.sede_id = :sedeId " : "") +
                "AND ip.cantidad_actual <= si.punto_reposicion";
        Query queryBajoStock = entityManager.createNativeQuery(sqlBajoStock);
        queryBajoStock.setParameter("tiendaId", tiendaId);
        if (sedeId != null) queryBajoStock.setParameter("sedeId", sedeId);
        Long productosAlerta = ((Number) queryBajoStock.getSingleResult()).longValue();
        
        metricas.add(new MetricaResumenResponse(
            "bajo-stock",
            "Productos con bajo stock",
            String.valueOf(productosAlerta),
            "Revisa inventario",
            productosAlerta > 0 ? "Alerta" : "Todo bien",
            productosAlerta > 0 ? "red" : "green",
            "alert"
        ));
        
        // Total de clientes registrados
        String sqlClientesTotal = "SELECT COUNT(*) FROM clientes c " +
                "WHERE c.tienda_id = :tiendaId AND c.activo = TRUE";
        Query queryClientesTotal = entityManager.createNativeQuery(sqlClientesTotal);
        queryClientesTotal.setParameter("tiendaId", tiendaId);
        Long clientesTotal = ((Number) queryClientesTotal.getSingleResult()).longValue();
        
        metricas.add(new MetricaResumenResponse(
            "clientes-activos",
            "Clientes registrados",
            String.valueOf(clientesTotal),
            "Total en la tienda",
            "",
            "secondary",
            "users"
        ));
        
        return metricas;
    }

    private List<VentaHistoricaResponse> obtenerVentasHistoricas(Long tiendaId, Long sedeId) {
        List<VentaHistoricaResponse> ventas = new ArrayList<>();
        LocalDate fechaFin = LocalDate.now();
        LocalDate fechaInicio = fechaFin.minusDays(13); // Últimos 14 días
        
        String sql = "SELECT DATE(p.creado_en) as fecha, COALESCE(SUM(p.monto_pagado_centimos), 0) / 100.0 as total " +
                "FROM pedidos p WHERE p.tienda_id = :tiendaId " +
                (sedeId != null ? "AND p.sede_origen_id = :sedeId " : "") +
                "AND p.estado_pedido != 'CANCELADO' " +
                "AND DATE(p.creado_en) >= :fechaInicio AND DATE(p.creado_en) <= :fechaFin " +
                "GROUP BY DATE(p.creado_en) ORDER BY fecha ASC";
        
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("tiendaId", tiendaId);
        query.setParameter("fechaInicio", fechaInicio);
        query.setParameter("fechaFin", fechaFin);
        if (sedeId != null) query.setParameter("sedeId", sedeId);
        
        @SuppressWarnings("unchecked")
        List<Object[]> resultados = query.getResultList();
        
        for (Object[] row : resultados) {
            java.sql.Date sqlDate = (java.sql.Date) row[0];
            LocalDate fecha = sqlDate.toLocalDate();
            Object montoObj = row[1];
            BigDecimal monto = montoObj != null ? new BigDecimal(montoObj.toString()) : BigDecimal.ZERO;
            ventas.add(new VentaHistoricaResponse(fecha.format(DAY_FORMATTER), monto));
        }
        
        return ventas;
    }

    private List<CategoriaVendidaResponse> obtenerCategoriasMasVendidas(Long tiendaId, Long sedeId) {
        String sql = "SELECT c.nombre, COALESCE(SUM(dp.subtotal_linea_centimos), 0) / 100.0 as ventas, COUNT(DISTINCT p.id) as pedidos " +
                "FROM detalles_pedido dp " +
                "INNER JOIN productos prod ON dp.producto_id = prod.id " +
                "INNER JOIN categorias c ON prod.categoria_id = c.id " +
                "INNER JOIN pedidos p ON dp.pedido_id = p.id " +
                "WHERE p.tienda_id = :tiendaId " +
                (sedeId != null ? "AND p.sede_origen_id = :sedeId " : "") +
                "AND p.estado_pedido != 'CANCELADO' " +
                "GROUP BY c.id, c.nombre ORDER BY ventas DESC LIMIT 4";
        
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("tiendaId", tiendaId);
        if (sedeId != null) query.setParameter("sedeId", sedeId);
        
        @SuppressWarnings("unchecked")
        List<Object[]> resultados = query.getResultList();
        
        return resultados.stream()
                .map(row -> {
                    String nombre = (String) row[0];
                    BigDecimal ventas = row[1] != null ? new BigDecimal(row[1].toString()) : BigDecimal.ZERO;
                    int pedidos = ((Number) row[2]).intValue();
                    return new CategoriaVendidaResponse(nombre, ventas, pedidos);
                })
                .collect(Collectors.toList());
    }

    private List<PedidoRecienteResponse> obtenerPedidosRecientes(Long tiendaId, Long sedeId) {
        String sql = "SELECT p.codigo_pedido, COALESCE(c.nombre_doc, 'Cliente anónimo') as cliente, " +
                "p.monto_pagado_centimos / 100.0 as total_pagado, p.estado_pedido " +
                "FROM pedidos p " +
                "LEFT JOIN clientes c ON p.cliente_id = c.id " +
                "WHERE p.tienda_id = :tiendaId " +
                (sedeId != null ? "AND p.sede_origen_id = :sedeId " : "") +
                "ORDER BY p.creado_en DESC LIMIT 5";
        
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("tiendaId", tiendaId);
        if (sedeId != null) query.setParameter("sedeId", sedeId);
        
        @SuppressWarnings("unchecked")
        List<Object[]> resultados = query.getResultList();
        
        return resultados.stream()
                .map(row -> {
                    String codigo = (String) row[0];
                    String cliente = (String) row[1];
                    Object totalObj = row[2];
                    BigDecimal total = totalObj != null ? new BigDecimal(totalObj.toString()) : BigDecimal.ZERO;
                    String estado = (String) row[3];
                    return new PedidoRecienteResponse(codigo, cliente, MONEY_FORMAT.format(total), mapEstadoPedido(estado));
                })
                .collect(Collectors.toList());
    }

    private List<ProductoBajoStockResponse> obtenerProductosBajoStock(Long tiendaId, Long sedeId) {
        String sql = "SELECT p.sku, p.nombre, ip.cantidad_actual, s.nombre as sede " +
                "FROM inventario_productos ip " +
                "INNER JOIN productos p ON ip.producto_id = p.id " +
                "INNER JOIN sedes s ON ip.sede_id = s.id " +
                "INNER JOIN stock_ideal si ON ip.producto_id = si.producto_id AND ip.sede_id = si.sede_id " +
                "WHERE p.tienda_id = :tiendaId " +
                (sedeId != null ? "AND ip.sede_id = :sedeId " : "") +
                "AND ip.cantidad_actual <= si.punto_reposicion " +
                "ORDER BY ip.cantidad_actual ASC LIMIT 5";
        
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("tiendaId", tiendaId);
        if (sedeId != null) query.setParameter("sedeId", sedeId);
        
        @SuppressWarnings("unchecked")
        List<Object[]> resultados = query.getResultList();
        
        return resultados.stream()
                .map(row -> new ProductoBajoStockResponse(
                        (String) row[0],
                        (String) row[1],
                        ((Number) row[2]).intValue(),
                        (String) row[3]
                ))
                .collect(Collectors.toList());
    }

    private List<MejorClienteResponse> obtenerMejoresClientes(Long tiendaId, Long sedeId) {
        String sql = "SELECT c.nombre_doc, COUNT(p.id) as num_compras, " +
                "AVG(p.monto_pagado_centimos) / 100.0 as ticket_promedio " +
                "FROM clientes c " +
                "INNER JOIN pedidos p ON c.id = p.cliente_id " +
                "WHERE c.tienda_id = :tiendaId " +
                (sedeId != null ? "AND p.sede_origen_id = :sedeId " : "") +
                "AND p.estado_pedido != 'CANCELADO' " +
                "GROUP BY c.id, c.nombre_doc " +
                "ORDER BY num_compras DESC, ticket_promedio DESC LIMIT 3";
        
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("tiendaId", tiendaId);
        if (sedeId != null) query.setParameter("sedeId", sedeId);
        
        @SuppressWarnings("unchecked")
        List<Object[]> resultados = query.getResultList();
        
        return resultados.stream()
                .map(row -> {
                    String nombre = (String) row[0];
                    int numCompras = ((Number) row[1]).intValue();
                    Object ticketObj = row[2];
                    BigDecimal ticketPromedio = ticketObj != null ? new BigDecimal(ticketObj.toString()) : BigDecimal.ZERO;
                    return new MejorClienteResponse(nombre, numCompras, MONEY_FORMAT.format(ticketPromedio));
                })
                .collect(Collectors.toList());
    }

    private String calcularTrend(BigDecimal valorActual, BigDecimal valorAnterior) {
        if (valorAnterior.compareTo(BigDecimal.ZERO) == 0) {
            return valorActual.compareTo(BigDecimal.ZERO) > 0 ? "+100%" : "0%";
        }
        BigDecimal diferencia = valorActual.subtract(valorAnterior);
        BigDecimal porcentaje = diferencia.divide(valorAnterior, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
        return (porcentaje.compareTo(BigDecimal.ZERO) >= 0 ? "+" : "") + 
                porcentaje.setScale(1, RoundingMode.HALF_UP) + "%";
    }

    private String mapEstadoPedido(String estado) {
        switch (estado.toUpperCase()) {
            case "ENTREGADO": return "Entregado";
            case "EN_PREPARACION": return "En preparación";
            case "LISTO_ENTREGA": return "Listo para entrega";
            case "PENDIENTE_PAGO": return "Pendiente";
            case "PAGADO": return "Pagado";
            case "CANCELADO": return "Cancelado";
            case "DEVUELTO": return "Devuelto";
            case "BORRADOR": return "Borrador";
            default: return "Pendiente";
        }
    }
}
