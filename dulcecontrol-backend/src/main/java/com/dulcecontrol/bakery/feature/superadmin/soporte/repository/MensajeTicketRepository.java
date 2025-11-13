package com.dulcecontrol.bakery.feature.superadmin.soporte.repository;

import com.dulcecontrol.bakery.feature.superadmin.soporte.entity.MensajeTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeTicketRepository extends JpaRepository<MensajeTicket, Long> {
    List<MensajeTicket> findByTicketIdOrderByCreadoEnAsc(Long ticketId);
}