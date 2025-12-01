package com.dulcecontrol.bakery.features.admin.compras.service;

import com.dulcecontrol.bakery.features.admin.compras.dto.OrdenCompraCreateRequest;
import com.dulcecontrol.bakery.features.admin.compras.dto.OrdenCompraResponse;
import com.dulcecontrol.bakery.features.admin.compras.dto.OrdenCompraUpdateRequest;
import com.dulcecontrol.bakery.features.admin.compras.dto.RecepcionParcialRequest;
import com.dulcecontrol.bakery.features.admin.compras.entity.enums.EstadoOrdenCompra;

import java.time.LocalDate;
import java.util.List;

public interface IOrdenCompraService {

    List<OrdenCompraResponse> listarPorTienda(Long tiendaId);

    List<OrdenCompraResponse> listarPorTiendaYEstado(Long tiendaId, EstadoOrdenCompra estado);

    List<OrdenCompraResponse> listarPorSede(Long sedeId);

    List<OrdenCompraResponse> listarPorProveedor(Long proveedorId);

    List<OrdenCompraResponse> listarOrdenesPendientes(Long sedeId);

    List<OrdenCompraResponse> listarPorFechas(Long tiendaId, LocalDate fechaInicio, LocalDate fechaFin);

    OrdenCompraResponse obtenerPorId(Long tiendaId, Long ordenCompraId);

    OrdenCompraResponse crear(OrdenCompraCreateRequest request);

    OrdenCompraResponse actualizar(Long tiendaId, Long ordenCompraId, OrdenCompraUpdateRequest request);

    void eliminar(Long tiendaId, Long ordenCompraId);

    OrdenCompraResponse cambiarEstado(Long tiendaId, Long ordenCompraId, EstadoOrdenCompra nuevoEstado);
    
    OrdenCompraResponse recibirParcial(Long tiendaId, RecepcionParcialRequest request);
    
    OrdenCompraResponse recibirTotal(Long tiendaId, Long ordenCompraId);
}
