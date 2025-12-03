package com.dulcecontrol.bakery.features.superadmin.tablero.service.impl;

import com.dulcecontrol.bakery.features.superadmin.tablero.dto.*;
import com.dulcecontrol.bakery.features.superadmin.tablero.service.ITableroSuperadminService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TableroSuperadminServiceImpl implements ITableroSuperadminService {

    private final EntityManager entityManager;

    private static final DecimalFormat MONEY_FORMAT = new DecimalFormat("S/ #,##0");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("dd MMM HH:mm");

    @Override
    public TableroSuperadminResponse obtenerEstadisticas() {
        TableroSuperadminResponse response = new TableroSuperadminResponse();
        
        response.setResumenMetrics(obtenerMetricasResumen());
        response.setFacturacionMensual(obtenerFacturacionMensual());
        response.setDistribucionPlanes(obtenerDistribucionPlanes());
        response.setTicketsCriticos(obtenerTicketsCriticos());
        response.setRenovacionesProximas(obtenerRenovacionesProximas());
        response.setActividadSeguridad(obtenerActividadSeguridad());

        return response;
    }

    private List<MetricaSuperadminResponse> obtenerMetricasResumen() {
        List<MetricaSuperadminResponse> metricas = new ArrayList<>();
        
        // Total tiendas con desglose
        String sqlTotalTiendas = "SELECT COUNT(*) FROM tiendas";
        Long totalTiendas = ((Number) entityManager.createNativeQuery(sqlTotalTiendas).getSingleResult()).longValue();
        
        String sqlTiendasActivas = "SELECT COUNT(*) FROM tiendas t WHERE t.estado = 'ACTIVA'";
        Long tiendasActivas = ((Number) entityManager.createNativeQuery(sqlTiendasActivas).getSingleResult()).longValue();
        
        Long tiendasInactivas = totalTiendas - tiendasActivas;
        
        metricas.add(new MetricaSuperadminResponse(
            "total-tiendas",
            "Total de tiendas",
            String.valueOf(totalTiendas),
            tiendasActivas + " activas",
            tiendasInactivas > 0 ? tiendasInactivas + " inactivas" : "",
            tiendasInactivas > 0 ? "orange" : "green",
            "store"
        ));
        
        // Suscripciones por estado
        String sqlSuscripcionesActivas = "SELECT COUNT(*) FROM suscripciones WHERE estado = 'ACTIVA'";
        Long suscripcionesActivas = ((Number) entityManager.createNativeQuery(sqlSuscripcionesActivas).getSingleResult()).longValue();
        
        String sqlSuscripcionesTotal = "SELECT COUNT(*) FROM suscripciones";
        Long suscripcionesTotal = ((Number) entityManager.createNativeQuery(sqlSuscripcionesTotal).getSingleResult()).longValue();
        
        String sqlSuscripcionesPrueba = "SELECT COUNT(*) FROM suscripciones WHERE estado = 'EN_PRUEBA'";
        Long suscripcionesPrueba = ((Number) entityManager.createNativeQuery(sqlSuscripcionesPrueba).getSingleResult()).longValue();
        
        String sqlSuscripcionesVencidas = "SELECT COUNT(*) FROM suscripciones WHERE estado = 'VENCIDA'";
        Long suscripcionesVencidas = ((Number) entityManager.createNativeQuery(sqlSuscripcionesVencidas).getSingleResult()).longValue();
        
        metricas.add(new MetricaSuperadminResponse(
            "suscripciones",
            "Suscripciones",
            String.valueOf(suscripcionesTotal),
            suscripcionesActivas + " activas",
            (suscripcionesPrueba > 0 ? suscripcionesPrueba + " en prueba" : "") + 
            (suscripcionesVencidas > 0 ? (suscripcionesPrueba > 0 ? " · " : "") + suscripcionesVencidas + " vencidas" : ""),
            suscripcionesVencidas > 0 ? "red" : (suscripcionesPrueba > 0 ? "blue" : "green"),
            "rocket"
        ));
        
        // Facturación bruta (mes actual)
        String sqlFacturacion = "SELECT COALESCE(SUM(s.precio_pactado_centimos), 0) / 100.0 " +
                "FROM suscripciones s " +
                "INNER JOIN tiendas t ON s.tienda_id = t.id " +
                "WHERE t.estado = 'ACTIVA' AND s.estado = 'ACTIVA'";
        BigDecimal facturacionBruta = (BigDecimal) entityManager.createNativeQuery(sqlFacturacion).getSingleResult();
        
        metricas.add(new MetricaSuperadminResponse(
            "ingresos-brutos",
            "Facturación bruta",
            MONEY_FORMAT.format(facturacionBruta),
            "Mes en curso",
            "",
            "secondary",
            "cash"
        ));
        
        // Mensajes de soporte (con manejo de tablas no existentes)
        Long mensajesTotal = 0L;
        Long ticketsAbiertos = 0L;
        Long ticketsCriticos = 0L;
        
        try {
            String sqlMensajesTotal = "SELECT COUNT(*) FROM mensajes_ticket";
            mensajesTotal = ((Number) entityManager.createNativeQuery(sqlMensajesTotal).getSingleResult()).longValue();
            
            String sqlTicketsAbiertos = "SELECT COUNT(*) FROM tickets_soporte ts " +
                    "WHERE ts.estado IN ('ABIERTO', 'PENDIENTE_CLIENTE')";
            ticketsAbiertos = ((Number) entityManager.createNativeQuery(sqlTicketsAbiertos).getSingleResult()).longValue();
            
            String sqlTicketsCriticos = "SELECT COUNT(*) FROM tickets_soporte ts " +
                    "WHERE ts.estado IN ('ABIERTO', 'PENDIENTE_CLIENTE') AND ts.prioridad = 'CRITICA'";
            ticketsCriticos = ((Number) entityManager.createNativeQuery(sqlTicketsCriticos).getSingleResult()).longValue();
        } catch (Exception e) {
            // Tablas de soporte no existen aún
        }
        
        metricas.add(new MetricaSuperadminResponse(
            "mensajes-soporte",
            "Mensajes de soporte",
            String.valueOf(mensajesTotal),
            ticketsAbiertos + " tickets abiertos",
            ticketsCriticos > 0 ? ticketsCriticos + " críticos" : (ticketsAbiertos == 0 ? "Sin tickets" : "Sin críticos"),
            ticketsCriticos > 0 ? "red" : (ticketsAbiertos > 0 ? "orange" : "green"),
            "alert"
        ));
        
        return metricas;
    }

    private List<FacturacionMensualResponse> obtenerFacturacionMensual() {
        List<FacturacionMensualResponse> facturacion = new ArrayList<>();
        
        // Simulación de facturación mensual - ajustar según tablas reales de comprobantes/pagos
        String sql = "SELECT MONTH(s.creado_en) as mes, COALESCE(SUM(s.precio_pactado_centimos), 0) / 100.0 as total " +
                "FROM suscripciones s " +
                "WHERE YEAR(s.creado_en) = YEAR(NOW()) " +
                "GROUP BY MONTH(s.creado_en) ORDER BY mes ASC";
        
        @SuppressWarnings("unchecked")
        List<Object[]> resultados = entityManager.createNativeQuery(sql).getResultList();
        
        String[] meses = {"Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"};
        
        for (Object[] row : resultados) {
            int mesNum = ((Number) row[0]).intValue();
            BigDecimal total = (BigDecimal) row[1];
            facturacion.add(new FacturacionMensualResponse(meses[mesNum - 1], total));
        }
        
        return facturacion;
    }

    private List<DistribucionPlanResponse> obtenerDistribucionPlanes() {
        // Mostrar TODOS los planes activos, incluso si no tienen tiendas asignadas
        String sql = "SELECT p.nombre, " +
                "COALESCE(COUNT(s.id), 0) as cant_tiendas, " +
                "COALESCE(AVG(s.precio_pactado_centimos), p.precio_mensual_centimos) / 100.0 as ticket_promedio " +
                "FROM planes p " +
                "LEFT JOIN suscripciones s ON p.id = s.plan_id AND s.estado = 'ACTIVA' " +
                "LEFT JOIN tiendas t ON s.tienda_id = t.id AND t.estado = 'ACTIVA' " +
                "WHERE p.activo = TRUE " +
                "GROUP BY p.id, p.nombre, p.precio_mensual_centimos " +
                "ORDER BY cant_tiendas DESC, p.nombre";
        
        @SuppressWarnings("unchecked")
        List<Object[]> resultados = entityManager.createNativeQuery(sql).getResultList();
        
        return resultados.stream()
                .map(row -> {
                    String nombre = (String) row[0];
                    Integer tiendas = ((Number) row[1]).intValue();
                    BigDecimal precio = row[2] != null ? new BigDecimal(row[2].toString()) : BigDecimal.ZERO;
                    return new DistribucionPlanResponse(
                            nombre,
                            tiendas,
                            MONEY_FORMAT.format(precio)
                    );
                })
                .collect(Collectors.toList());
    }

    private List<TicketCriticoResponse> obtenerTicketsCriticos() {
        String sql = "SELECT ts.id, t.nombre_comercial, ts.prioridad, ts.estado, " +
                "ts.vencimiento_sla_en " +
                "FROM tickets_soporte ts " +
                "INNER JOIN tiendas t ON ts.tienda_id = t.id " +
                "WHERE ts.estado IN ('ABIERTO', 'PENDIENTE_CLIENTE') " +
                "AND ts.prioridad IN ('CRITICA', 'ALTA') " +
                "ORDER BY ts.prioridad ASC, ts.vencimiento_sla_en ASC LIMIT 5";
        
        @SuppressWarnings("unchecked")
        List<Object[]> resultados = entityManager.createNativeQuery(sql).getResultList();
        
        return resultados.stream()
                .map(row -> {
                    String codigo = "#" + row[0].toString();
                    String tienda = (String) row[1];
                    String prioridad = (String) row[2];
                    String estado = (String) row[3];
                    java.sql.Timestamp vencimiento = (java.sql.Timestamp) row[4];
                    
                    return new TicketCriticoResponse(
                            codigo,
                            tienda,
                            prioridad,
                            estado,
                            vencimiento != null ? vencimiento.toLocalDateTime().format(DATETIME_FORMATTER) : "Sin SLA"
                    );
                })
                .collect(Collectors.toList());
    }

    private List<RenovacionProximaResponse> obtenerRenovacionesProximas() {
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime limite30Dias = ahora.plusDays(30);
        
        String sql = "SELECT t.nombre_comercial, p.nombre, s.ciclo, " +
                "s.fecha_fin, t.estado " +
                "FROM suscripciones s " +
                "INNER JOIN tiendas t ON s.tienda_id = t.id " +
                "INNER JOIN planes p ON s.plan_id = p.id " +
                "WHERE s.fecha_fin BETWEEN :ahora AND :limite AND s.estado = 'ACTIVA' " +
                "ORDER BY s.fecha_fin ASC LIMIT 5";
        
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("ahora", ahora);
        query.setParameter("limite", limite30Dias);
        
        @SuppressWarnings("unchecked")
        List<Object[]> resultados = query.getResultList();
        
        return resultados.stream()
                .map(row -> {
                    String tienda = (String) row[0];
                    String planNombre = (String) row[1];
                    String frecuencia = (String) row[2];
                    java.sql.Timestamp fechaRenov = (java.sql.Timestamp) row[3];
                    String estado = (String) row[4];
                    
                    LocalDateTime fechaRenovacion = fechaRenov.toLocalDateTime();
                    long diasRestantes = ChronoUnit.DAYS.between(ahora, fechaRenovacion);
                    
                    return new RenovacionProximaResponse(
                            tienda,
                            planNombre + " · " + frecuencia,
                            fechaRenovacion.format(DATE_FORMATTER),
                            (int) diasRestantes,
                            estado
                    );
                })
                .collect(Collectors.toList());
    }

    private List<ActividadSeguridadResponse> obtenerActividadSeguridad() {
        try {
            String sql = "SELECT al.fecha_evento, al.tipo_evento, al.descripcion, al.nivel_severidad " +
                    "FROM auditoria_logs al " +
                    "WHERE al.modulo = 'SEGURIDAD' " +
                    "ORDER BY al.fecha_evento DESC LIMIT 5";
            
            @SuppressWarnings("unchecked")
            List<Object[]> resultados = entityManager.createNativeQuery(sql).getResultList();
            
            return resultados.stream()
                    .map(row -> {
                        java.sql.Timestamp fecha = (java.sql.Timestamp) row[0];
                        String evento = (String) row[1];
                        String detalle = (String) row[2];
                        String severidad = (String) row[3];
                        
                        return new ActividadSeguridadResponse(
                                fecha.toLocalDateTime().format(DATETIME_FORMATTER),
                                evento,
                                detalle,
                                severidad
                        );
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            // Tabla auditoria_logs no existe aún - devolver lista vacía
            return new ArrayList<>();
        }
    }
}
