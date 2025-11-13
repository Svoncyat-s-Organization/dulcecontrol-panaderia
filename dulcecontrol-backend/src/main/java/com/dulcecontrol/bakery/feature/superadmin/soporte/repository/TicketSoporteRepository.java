package com.dulcecontrol.bakery.feature.superadmin.soporte.repository;

import com.dulcecontrol.bakery.feature.superadmin.soporte.entity.TicketSoporte;
import com.dulcecontrol.bakery.feature.superadmin.soporte.entity.enums.EstadoTicket;
import com.dulcecontrol.bakery.feature.superadmin.soporte.entity.enums.PrioridadTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketSoporteRepository extends JpaRepository<TicketSoporte, Long> {
    List<TicketSoporte> findByTiendaIdOrderByPrioridadDesc(Long tiendaId);
    List<TicketSoporte> findByEstadoOrderByCreadoEnDesc(EstadoTicket estado);
    List<TicketSoporte> findByPrioridadOrderByCreadoEnDesc(PrioridadTicket prioridad);
}