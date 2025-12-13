package com.dulcecontrol.bakery.features.admin.compras.service.impl;

import com.dulcecontrol.bakery.features.admin.compras.dto.*;
import com.dulcecontrol.bakery.features.admin.compras.entity.DetalleOrdenCompra;
import com.dulcecontrol.bakery.features.admin.compras.entity.OrdenCompra;
import com.dulcecontrol.bakery.features.admin.compras.entity.PagoOrdenCompra;
import com.dulcecontrol.bakery.features.admin.compras.entity.enums.EstadoOrdenCompra;
import com.dulcecontrol.bakery.features.admin.compras.entity.enums.MetodoPago;
import com.dulcecontrol.bakery.features.admin.compras.repository.DetalleOrdenCompraRepository;
import com.dulcecontrol.bakery.features.admin.compras.repository.OrdenCompraRepository;
import com.dulcecontrol.bakery.features.admin.compras.service.IOrdenCompraService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrdenCompraService implements IOrdenCompraService {

    private final OrdenCompraRepository ordenCompraRepository;
    private final DetalleOrdenCompraRepository detalleOrdenCompraRepository;
    private final com.dulcecontrol.bakery.features.admin.compras.repository.ProveedorRepository proveedorRepository;
    private final com.dulcecontrol.bakery.features.superadmin.tiendas.repository.SedeRepository sedeRepository;
    private final com.dulcecontrol.bakery.features.admin.compras.repository.InsumoRepository insumoRepository;
    private final com.dulcecontrol.bakery.features.admin.inventario.repository.InventarioInsumoSedeRepository inventarioInsumoSedeRepository;
    private final com.dulcecontrol.bakery.features.admin.compras.repository.PagoOrdenCompraRepository pagoOrdenCompraRepository;

    @Override
    @Transactional(readOnly = true)
    public List<OrdenCompraResponse> listarPorTienda(Long tiendaId) {
        return ordenCompraRepository.findByTiendaId(tiendaId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrdenCompraResponse> listarPorTiendaYEstado(Long tiendaId, EstadoOrdenCompra estado) {
        return ordenCompraRepository.findByTiendaIdAndEstado(tiendaId, estado)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrdenCompraResponse> listarPorSede(Long sedeId) {
        return ordenCompraRepository.findBySedeDestino(sedeId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrdenCompraResponse> listarPorProveedor(Long proveedorId) {
        return ordenCompraRepository.findByProveedor(proveedorId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrdenCompraResponse> listarOrdenesPendientes(Long sedeId) {
        List<EstadoOrdenCompra> estadosPendientes = List.of(
                EstadoOrdenCompra.ENVIADA,
                EstadoOrdenCompra.RECIBIDA_PARCIAL);
        return ordenCompraRepository.findOrdenesPendientesPorSede(sedeId, estadosPendientes, LocalDate.now())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrdenCompraResponse> listarPorFechas(Long tiendaId, LocalDate fechaInicio, LocalDate fechaFin) {
        return ordenCompraRepository.findByTiendaIdAndFechaEmisionBetween(tiendaId, fechaInicio, fechaFin)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OrdenCompraResponse obtenerPorId(Long tiendaId, Long ordenCompraId) {
        OrdenCompra orden = ordenCompraRepository.findByIdAndTiendaId(ordenCompraId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Orden de compra no encontrada"));
        return toResponse(orden);
    }

    @Override
    @Transactional
    public OrdenCompraResponse crear(OrdenCompraCreateRequest request) {
        OrdenCompra orden = new OrdenCompra();
        orden.setTiendaId(request.getTiendaId());
        orden.setSedeDestinoId(request.getSedeDestinoId());
        orden.setProveedorId(request.getProveedorId());
        orden.setFechaEmision(request.getFechaEmision());
        orden.setFechaRecepcionEsperada(request.getFechaRecepcionEsperada());
        orden.setEstado(request.getEstado() != null ? request.getEstado() : EstadoOrdenCompra.BORRADOR);
        orden.setMoneda(request.getMoneda() != null ? request.getMoneda() : "PEN");
        orden.setMetodoPago(request.getMetodoPago());
        
        // Calcular total
        Long totalCentimos = calcularTotal(request.getDetalles());
        orden.setTotalCompraCentimos(totalCentimos);
        
        // Manejar pagos según el método de pago
        if (request.getMetodoPago() != null && request.getMetodoPago() == MetodoPago.CREDITO) {
            // Para crédito: registrar monto inicial y calcular saldo pendiente
            Long montoInicial = request.getMontoInicialCentimos() != null ? request.getMontoInicialCentimos() : 0L;
            orden.setMontoInicialCentimos(montoInicial);
            orden.setMontoPagadoCentimos(montoInicial);
            orden.setSaldoPendienteCentimos(totalCentimos - montoInicial);
        } else if (request.getMetodoPago() != null && request.getMetodoPago() == MetodoPago.EFECTIVO) {
            // Para efectivo: marcar como pagado completamente
            orden.setMontoInicialCentimos(totalCentimos);
            orden.setMontoPagadoCentimos(totalCentimos);
            orden.setSaldoPendienteCentimos(0L);
        } else {
            // Si no hay método de pago definido, valores por defecto
            orden.setMontoInicialCentimos(0L);
            orden.setMontoPagadoCentimos(0L);
            orden.setSaldoPendienteCentimos(0L);
        }
        
        orden.setReferenciaPago(request.getReferenciaPago());
        orden.setTipoComprobanteProveedor(request.getTipoComprobanteProveedor());
        orden.setSerieComprobanteProveedor(request.getSerieComprobanteProveedor());
        orden.setNumeroComprobanteProveedor(request.getNumeroComprobanteProveedor());
        orden.setUrlFotoComprobante(request.getUrlFotoComprobante());
        orden.setObservaciones(request.getObservaciones());
        orden.setRegistradoPor(request.getRegistradoPor());

        OrdenCompra guardada = ordenCompraRepository.save(orden);

        // Guardar detalles
        for (DetalleOrdenCompraRequest detalle : request.getDetalles()) {
            DetalleOrdenCompra detalleEntity = new DetalleOrdenCompra();
            detalleEntity.setOrdenCompraId(guardada.getId());
            detalleEntity.setInsumoId(detalle.getInsumoId());
            detalleEntity.setCantidadSolicitada(detalle.getCantidadSolicitada());
            detalleEntity.setUnidadCompra(detalle.getUnidadCompra());
            detalleEntity.setCostoUnitarioPactadoCentimos(detalle.getCostoUnitarioPactadoCentimos());

            Long totalLinea = calcularTotalLinea(
                    detalle.getCantidadSolicitada(),
                    detalle.getCostoUnitarioPactadoCentimos());
            detalleEntity.setTotalLineaCentimos(totalLinea);
            detalleEntity.setCantidadRecibida(detalle.getCantidadRecibida());
            detalleEntity.setRecibidoCompleto(detalle.getRecibidoCompleto());

            detalleOrdenCompraRepository.save(detalleEntity);
        }

        // Si es crédito y hay pago inicial, crear registro en historial de pagos
        if (request.getMetodoPago() == MetodoPago.CREDITO && 
            request.getMontoInicialCentimos() != null && 
            request.getMontoInicialCentimos() > 0) {
            
            PagoOrdenCompra pagoInicial = new PagoOrdenCompra();
            pagoInicial.setOrdenCompraId(guardada.getId());
            pagoInicial.setFechaPago(request.getFechaEmision() != null ? request.getFechaEmision() : LocalDate.now());
            pagoInicial.setMontoPagadoCentimos(request.getMontoInicialCentimos());
            pagoInicial.setUrlFotoComprobante(request.getUrlFotoComprobante());
            pagoInicial.setReferenciaPago(request.getReferenciaPago());
            pagoInicial.setObservaciones("Pago inicial al crear la orden");
            
            pagoOrdenCompraRepository.save(pagoInicial);
            
            System.out.println("=== PAGO INICIAL REGISTRADO ===");
            System.out.println("Orden ID: " + guardada.getId());
            System.out.println("Monto pagado: " + request.getMontoInicialCentimos());
            System.out.println("Tiene comprobante: " + (request.getUrlFotoComprobante() != null));
            System.out.println("================================");
        }

        return toResponse(guardada);
    }

    @Override
    @Transactional
    public OrdenCompraResponse actualizar(Long tiendaId, Long ordenCompraId, OrdenCompraUpdateRequest request) {
        OrdenCompra orden = ordenCompraRepository.findByIdAndTiendaId(ordenCompraId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Orden de compra no encontrada"));

        orden.setSedeDestinoId(request.getSedeDestinoId());
        orden.setProveedorId(request.getProveedorId());

        if (request.getFechaEmision() != null) {
            orden.setFechaEmision(request.getFechaEmision());
        }
        if (request.getFechaRecepcionEsperada() != null) {
            orden.setFechaRecepcionEsperada(request.getFechaRecepcionEsperada());
        }
        if (request.getFechaRecepcionReal() != null) {
            orden.setFechaRecepcionReal(request.getFechaRecepcionReal());
        }
        if (request.getEstado() != null) {
            orden.setEstado(request.getEstado());
        }
        if (request.getMoneda() != null) {
            orden.setMoneda(request.getMoneda());
        }

        orden.setMetodoPago(request.getMetodoPago());
        orden.setReferenciaPago(request.getReferenciaPago());
        orden.setTipoComprobanteProveedor(request.getTipoComprobanteProveedor());
        orden.setSerieComprobanteProveedor(request.getSerieComprobanteProveedor());
        orden.setNumeroComprobanteProveedor(request.getNumeroComprobanteProveedor());
        orden.setUrlFotoComprobante(request.getUrlFotoComprobante());
        orden.setObservaciones(request.getObservaciones());

        // Actualizar detalles si se proporcionan
        if (request.getDetalles() != null && !request.getDetalles().isEmpty()) {
            // Eliminar detalles existentes
            detalleOrdenCompraRepository.deleteByOrdenCompraId(ordenCompraId);

            // Crear nuevos detalles
            for (DetalleOrdenCompraRequest detalle : request.getDetalles()) {
                DetalleOrdenCompra detalleEntity = new DetalleOrdenCompra();
                detalleEntity.setOrdenCompraId(orden.getId());
                detalleEntity.setInsumoId(detalle.getInsumoId());
                detalleEntity.setCantidadSolicitada(detalle.getCantidadSolicitada());
                detalleEntity.setUnidadCompra(detalle.getUnidadCompra());
                detalleEntity.setCostoUnitarioPactadoCentimos(detalle.getCostoUnitarioPactadoCentimos());

                Long totalLinea = calcularTotalLinea(
                        detalle.getCantidadSolicitada(),
                        detalle.getCostoUnitarioPactadoCentimos());
                detalleEntity.setTotalLineaCentimos(totalLinea);
                detalleEntity.setCantidadRecibida(detalle.getCantidadRecibida());
                detalleEntity.setRecibidoCompleto(detalle.getRecibidoCompleto());

                detalleOrdenCompraRepository.save(detalleEntity);
            }

            // Recalcular total
            Long totalCentimos = calcularTotal(request.getDetalles());
            orden.setTotalCompraCentimos(totalCentimos);
        }

        OrdenCompra actualizada = ordenCompraRepository.save(orden);
        return toResponse(actualizada);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long ordenCompraId) {
        OrdenCompra orden = ordenCompraRepository.findByIdAndTiendaId(ordenCompraId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Orden de compra no encontrada"));

        // Solo se pueden eliminar órdenes en estado borrador
        if (orden.getEstado() != EstadoOrdenCompra.BORRADOR) {
            throw new BadRequestException("Solo se pueden eliminar órdenes en estado borrador");
        }

        // Eliminar detalles
        detalleOrdenCompraRepository.deleteByOrdenCompraId(ordenCompraId);

        // Eliminar orden
        ordenCompraRepository.delete(orden);
    }

    @Override
    @Transactional
    public OrdenCompraResponse cambiarEstado(Long tiendaId, Long ordenCompraId, EstadoOrdenCompra nuevoEstado) {
        OrdenCompra orden = ordenCompraRepository.findByIdAndTiendaId(ordenCompraId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Orden de compra no encontrada"));

        // Validar transiciones de estado
        validarCambioEstado(orden.getEstado(), nuevoEstado);

        orden.setEstado(nuevoEstado);

        // Si se marca como recibida total, actualizar fecha de recepción real
        if (nuevoEstado == EstadoOrdenCompra.RECIBIDA_TOTAL && orden.getFechaRecepcionReal() == null) {
            orden.setFechaRecepcionReal(LocalDate.now());
        }

        OrdenCompra actualizada = ordenCompraRepository.save(orden);
        return toResponse(actualizada);
    }

    private void validarCambioEstado(EstadoOrdenCompra estadoActual, EstadoOrdenCompra nuevoEstado) {
        // Lógica de validación de transiciones de estado
        if (estadoActual == EstadoOrdenCompra.CANCELADA) {
            throw new BadRequestException("No se puede cambiar el estado de una orden cancelada");
        }

        if (estadoActual == EstadoOrdenCompra.RECIBIDA_TOTAL && nuevoEstado != EstadoOrdenCompra.CANCELADA) {
            throw new BadRequestException("No se puede cambiar el estado de una orden ya recibida totalmente");
        }
    }

    private Long calcularTotal(List<DetalleOrdenCompraRequest> detalles) {
        return detalles.stream()
                .mapToLong(detalle -> calcularTotalLinea(
                        detalle.getCantidadSolicitada(),
                        detalle.getCostoUnitarioPactadoCentimos()))
                .sum();
    }

    private Long calcularTotalLinea(BigDecimal cantidad, Long costoUnitarioCentimos) {
        return cantidad.multiply(new BigDecimal(costoUnitarioCentimos)).longValue();
    }

    private OrdenCompraResponse toResponse(OrdenCompra orden) {
        List<DetalleOrdenCompra> detalles = detalleOrdenCompraRepository.findByOrdenCompraId(orden.getId());
        
        // Obtener nombre del proveedor
        String nombreProveedor = proveedorRepository.findById(orden.getProveedorId())
                .map(p -> p.getNombreComercial())
                .orElse("Proveedor no encontrado");
        
        // Obtener nombre de la sede
        String nombreSede = sedeRepository.findById(orden.getSedeDestinoId())
                .map(s -> s.getNombre())
                .orElse("Sede no encontrada");

        return OrdenCompraResponse.builder()
                .id(orden.getId())
                .tiendaId(orden.getTiendaId())
                .sedeDestinoId(orden.getSedeDestinoId())
                .nombreSede(nombreSede)
                .proveedorId(orden.getProveedorId())
                .nombreProveedor(nombreProveedor)
                .fechaEmision(orden.getFechaEmision())
                .fechaRecepcionEsperada(orden.getFechaRecepcionEsperada())
                .fechaRecepcionReal(orden.getFechaRecepcionReal())
                .estado(orden.getEstado())
                .moneda(orden.getMoneda())
                .totalCompraCentimos(orden.getTotalCompraCentimos())
                .metodoPago(orden.getMetodoPago())
                .montoInicialCentimos(orden.getMontoInicialCentimos())
                .montoPagadoCentimos(orden.getMontoPagadoCentimos())
                .saldoPendienteCentimos(orden.getSaldoPendienteCentimos())
                .referenciaPago(orden.getReferenciaPago())
                .tipoComprobanteProveedor(orden.getTipoComprobanteProveedor())
                .serieComprobanteProveedor(orden.getSerieComprobanteProveedor())
                .numeroComprobanteProveedor(orden.getNumeroComprobanteProveedor())
                .urlFotoComprobante(orden.getUrlFotoComprobante())
                .observaciones(orden.getObservaciones())
                .registradoPor(orden.getRegistradoPor())
                .creadoEn(orden.getCreadoEn())
                .actualizadoEn(orden.getActualizadoEn())
                .detalles(detalles.stream().map(this::toDetalleResponse).collect(Collectors.toList()))
                .build();
    }

    private DetalleOrdenCompraResponse toDetalleResponse(DetalleOrdenCompra detalle) {
        // Obtener nombre del insumo
        String nombreInsumo = insumoRepository.findById(detalle.getInsumoId())
                .map(i -> i.getNombre())
                .orElse("Insumo no encontrado");
        
        return DetalleOrdenCompraResponse.builder()
                .id(detalle.getId())
                .ordenCompraId(detalle.getOrdenCompraId())
                .insumoId(detalle.getInsumoId())
                .nombreInsumo(nombreInsumo)
                .cantidadSolicitada(detalle.getCantidadSolicitada())
                .unidadCompra(detalle.getUnidadCompra())
                .costoUnitarioPactadoCentimos(detalle.getCostoUnitarioPactadoCentimos())
                .totalLineaCentimos(detalle.getTotalLineaCentimos())
                .cantidadRecibida(detalle.getCantidadRecibida())
                .recibidoCompleto(detalle.getRecibidoCompleto())
                .build();
    }

    @Override
    @Transactional
    public OrdenCompraResponse recibirParcial(Long tiendaId, RecepcionParcialRequest request) {
        // Obtener la orden
        OrdenCompra orden = ordenCompraRepository.findByIdAndTiendaId(request.getOrdenCompraId(), tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Orden de compra no encontrada"));

        // Validar que la orden esté en estado ENVIADA
        if (orden.getEstado() != EstadoOrdenCompra.ENVIADA) {
            throw new BadRequestException("Solo se pueden recibir órdenes en estado ENVIADA");
        }

        // Procesar cada item recibido
        for (RecepcionParcialRequest.ItemRecepcionParcial item : request.getItems()) {
            DetalleOrdenCompra detalle = detalleOrdenCompraRepository.findById(item.getDetalleOrdenCompraId())
                    .orElseThrow(() -> new ResourceNotFoundException("Detalle de orden no encontrado"));

            // Validar que el detalle pertenece a la orden
            if (!detalle.getOrdenCompraId().equals(orden.getId())) {
                throw new BadRequestException("El detalle no pertenece a esta orden");
            }

            // Actualizar cantidad recibida
            BigDecimal cantidadAnterior = detalle.getCantidadRecibida() != null ? detalle.getCantidadRecibida() : BigDecimal.ZERO;
            BigDecimal cantidadRecibidaAhora = BigDecimal.valueOf(item.getCantidadRecibida());
            BigDecimal nuevaCantidadRecibida = cantidadAnterior.add(cantidadRecibidaAhora);
            
            detalle.setCantidadRecibida(nuevaCantidadRecibida);
            
            // Marcar como completo si se recibió todo
            if (nuevaCantidadRecibida.compareTo(detalle.getCantidadSolicitada()) >= 0) {
                detalle.setRecibidoCompleto(true);
            }
            
            detalleOrdenCompraRepository.save(detalle);

            // Actualizar inventario en la sede destino
            actualizarInventario(orden.getTiendaId(), orden.getSedeDestinoId(), detalle.getInsumoId(), cantidadRecibidaAhora);
        }

        // Verificar si todos los detalles están completos
        List<DetalleOrdenCompra> todosDetalles = detalleOrdenCompraRepository.findByOrdenCompraId(orden.getId());
        boolean todosCompletos = todosDetalles.stream()
                .allMatch(d -> d.getRecibidoCompleto() != null && d.getRecibidoCompleto());

        // Actualizar estado de la orden
        if (todosCompletos) {
            orden.setEstado(EstadoOrdenCompra.RECIBIDA_TOTAL);
        } else {
            orden.setEstado(EstadoOrdenCompra.RECIBIDA_PARCIAL);
        }
        
        orden.setFechaRecepcionReal(LocalDate.now());
        OrdenCompra ordenActualizada = ordenCompraRepository.save(orden);

        return toResponse(ordenActualizada);
    }

    @Override
    @Transactional
    public OrdenCompraResponse recibirTotal(Long tiendaId, Long ordenCompraId) {
        // Obtener la orden
        OrdenCompra orden = ordenCompraRepository.findByIdAndTiendaId(ordenCompraId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Orden de compra no encontrada"));

        // Validar que la orden esté en estado ENVIADA o RECIBIDA_PARCIAL
        if (orden.getEstado() != EstadoOrdenCompra.ENVIADA && 
            orden.getEstado() != EstadoOrdenCompra.RECIBIDA_PARCIAL) {
            throw new BadRequestException("Solo se pueden recibir totalmente órdenes en estado ENVIADA o RECIBIDA_PARCIAL");
        }

        // Obtener todos los detalles
        List<DetalleOrdenCompra> detalles = detalleOrdenCompraRepository.findByOrdenCompraId(ordenCompraId);

        // Recibir todo lo que falta de cada detalle
        for (DetalleOrdenCompra detalle : detalles) {
            BigDecimal cantidadRecibida = detalle.getCantidadRecibida() != null ? detalle.getCantidadRecibida() : BigDecimal.ZERO;
            BigDecimal cantidadFaltante = detalle.getCantidadSolicitada().subtract(cantidadRecibida);

            if (cantidadFaltante.compareTo(BigDecimal.ZERO) > 0) {
                // Actualizar detalle
                detalle.setCantidadRecibida(detalle.getCantidadSolicitada());
                detalle.setRecibidoCompleto(true);
                detalleOrdenCompraRepository.save(detalle);

                // Actualizar inventario
                actualizarInventario(orden.getTiendaId(), orden.getSedeDestinoId(), detalle.getInsumoId(), cantidadFaltante);
            }
        }

        // Actualizar estado de la orden a RECIBIDA_TOTAL
        orden.setEstado(EstadoOrdenCompra.RECIBIDA_TOTAL);
        orden.setFechaRecepcionReal(LocalDate.now());
        OrdenCompra ordenActualizada = ordenCompraRepository.save(orden);

        return toResponse(ordenActualizada);
    }

    private void actualizarInventario(Long tiendaId, Long sedeId, Long insumoId, BigDecimal cantidadASumar) {
        // Buscar el registro de inventario
        var inventarioOpt = inventarioInsumoSedeRepository.findBySedeIdAndInsumoId(sedeId, insumoId);

        if (inventarioOpt.isPresent()) {
            // Si existe, sumar a la cantidad actual
            var inventario = inventarioOpt.get();
            inventario.setCantidadActual(inventario.getCantidadActual().add(cantidadASumar));
            inventarioInsumoSedeRepository.save(inventario);
        } else {
            // Si no existe, crear nuevo registro
            var nuevoInventario = new com.dulcecontrol.bakery.features.admin.inventario.entity.InventarioInsumoSede();
            nuevoInventario.setTiendaId(tiendaId);
            nuevoInventario.setSedeId(sedeId);
            nuevoInventario.setInsumoId(insumoId);
            nuevoInventario.setCantidadActual(cantidadASumar);
            inventarioInsumoSedeRepository.save(nuevoInventario);
        }
    }
}
