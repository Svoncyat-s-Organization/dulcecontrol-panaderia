package com.dulcecontrol.bakery.features.storefront.service.impl;

import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import com.dulcecontrol.bakery.features.admin.clientes.entity.Cliente;
import com.dulcecontrol.bakery.features.admin.clientes.repository.ClienteRepository;
import com.dulcecontrol.bakery.features.admin.ventas.entity.DetallePedido;
import com.dulcecontrol.bakery.features.admin.ventas.entity.Pedido;
import com.dulcecontrol.bakery.features.admin.ventas.entity.PersonalizacionItemPedido;
import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.EstadoPedido;
import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.OrigenPedido;
import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.TipoEntregaPedido;
import com.dulcecontrol.bakery.features.admin.ventas.repository.DetallePedidoRepository;
import com.dulcecontrol.bakery.features.admin.ventas.repository.PedidoRepository;
import com.dulcecontrol.bakery.features.admin.ventas.repository.PersonalizacionItemPedidoRepository;
import com.dulcecontrol.bakery.features.admin.catalogo.entity.Producto;
import com.dulcecontrol.bakery.features.shared.catalogo.repository.ProductoRepository;
import com.dulcecontrol.bakery.features.storefront.dto.PedidoPersonalizadoCreateRequest;
import com.dulcecontrol.bakery.features.storefront.dto.PedidoPersonalizadoResponse;
import com.dulcecontrol.bakery.features.storefront.service.IPedidoPersonalizadoStorefrontService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PedidoPersonalizadoStorefrontService implements IPedidoPersonalizadoStorefrontService {

    private final PedidoRepository pedidoRepository;
    private final DetallePedidoRepository detallePedidoRepository;
    private final PersonalizacionItemPedidoRepository personalizacionRepository;
    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;

    @Override
    @Transactional
    public PedidoPersonalizadoResponse crear(Long clienteId, PedidoPersonalizadoCreateRequest request) {
        // Validar cliente
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado"));

        // Validar producto
        Producto producto = productoRepository.findByIdAndTiendaId(request.productoId(), request.tiendaId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        // Crear pedido
        Pedido pedido = new Pedido();
        pedido.setCodigoPedido("PED-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        pedido.setTiendaId(request.tiendaId());
        pedido.setSedeOrigenId(1L); // Sede por defecto
        pedido.setClienteId(clienteId);
        pedido.setOrigen(OrigenPedido.STOREFRONT_ONLINE);
        pedido.setEstadoPedido(EstadoPedido.BORRADOR);
        pedido.setTipoEntrega(TipoEntregaPedido.RECOJO_TIENDA);
        pedido.setFechaEntregaPactada(LocalDateTime.now().plusDays(3)); // 3 días por defecto
        pedido.setSubtotalItemsCentimos(0L);
        pedido.setDescuentoTotalCentimos(0L);
        pedido.setImpuestosTotalesCentimos(0L);
        pedido.setTotalFinalCentimos(0L);
        pedido.setMoneda("PEN");
        pedido.setRequiereComprobante(false);
        pedido.setCreadoEn(LocalDateTime.now());
        pedido.setActualizadoEn(LocalDateTime.now());

        pedido = pedidoRepository.save(pedido);

        // Crear detalle de pedido
        DetallePedido detalle = new DetallePedido();
        detalle.setPedidoId(pedido.getId());
        detalle.setProductoId(producto.getId());
        detalle.setCantidad(request.cantidad());
        detalle.setPrecioUnitarioCentimos(producto.getPrecioBaseCentimos());
        detalle.setSubtotalLineaCentimos(producto.getPrecioBaseCentimos() * request.cantidad());
        detalle.setNotasItem("Pedido personalizado");

        detalle = detallePedidoRepository.save(detalle);

        // Crear personalización
        PersonalizacionItemPedido personalizacion = new PersonalizacionItemPedido();
        personalizacion.setDetallePedidoId(detalle.getId());
        personalizacion.setDescripcionSolicitud(request.descripcionSolicitud());
        personalizacion.setTextoDedicatoria(request.textoDedicatoria());
        personalizacion.setSaborMasa(request.saborMasa());
        personalizacion.setSaborRelleno(request.saborRelleno());
        personalizacion.setTematica(request.tematica());
        personalizacion.setCostoExtraPersonalizacionCentimos(0L);

        personalizacionRepository.save(personalizacion);

        // Retornar respuesta
        return PedidoPersonalizadoResponse.builder()
                .pedidoId(pedido.getId())
                .codigoPedido(pedido.getCodigoPedido())
                .nombreProducto(producto.getNombre())
                .cantidad(request.cantidad())
                .descripcionSolicitud(request.descripcionSolicitud())
                .estado(pedido.getEstadoPedido().name())
                .fechaCreacion(pedido.getCreadoEn())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PedidoPersonalizadoResponse> listarPorCliente(Long clienteId) {
        List<Pedido> pedidos = pedidoRepository.findByClienteIdOrderByCreadoEnDesc(clienteId);

        return pedidos.stream()
                .map(pedido -> {
                    DetallePedido detalle = detallePedidoRepository.findByPedidoId(pedido.getId()).stream()
                            .findFirst()
                            .orElse(null);

                    if (detalle == null) {
                        return null;
                    }

                    PersonalizacionItemPedido personalizacion = personalizacionRepository
                            .findByDetallePedidoId(detalle.getId())
                            .orElse(null);

                    Producto producto = productoRepository.findById(detalle.getProductoId()).orElse(null);

                    return PedidoPersonalizadoResponse.builder()
                            .pedidoId(pedido.getId())
                            .codigoPedido(pedido.getCodigoPedido())
                            .nombreProducto(producto != null ? producto.getNombre() : "Producto eliminado")
                            .cantidad(detalle.getCantidad())
                            .descripcionSolicitud(personalizacion != null ? personalizacion.getDescripcionSolicitud() : "")
                            .estado(pedido.getEstadoPedido().name())
                            .fechaCreacion(pedido.getCreadoEn())
                            .build();
                })
                .filter(response -> response != null)
                .toList();
    }
}
