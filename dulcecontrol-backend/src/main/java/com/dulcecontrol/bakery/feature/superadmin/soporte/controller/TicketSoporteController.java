package com.dulcecontrol.bakery.feature.superadmin.soporte.controller;

import com.dulcecontrol.bakery.feature.superadmin.soporte.controller.dto.TicketCreateRequest;
import com.dulcecontrol.bakery.feature.superadmin.soporte.controller.dto.TicketResponse;
import com.dulcecontrol.bakery.feature.superadmin.soporte.controller.dto.TicketUpdateRequest;
import com.dulcecontrol.bakery.feature.superadmin.soporte.entity.enums.EstadoTicket;
import com.dulcecontrol.bakery.feature.superadmin.soporte.entity.enums.PrioridadTicket;
import com.dulcecontrol.bakery.feature.superadmin.soporte.service.ITicketSoporteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/superadmin/soporte/tickets")
@RequiredArgsConstructor
@Validated
public class TicketSoporteController {

    private final ITicketSoporteService ticketService;

    @GetMapping
    public ResponseEntity<List<TicketResponse>> listar(
            @RequestParam(required = false) Long tiendaId,
            @RequestParam(required = false) EstadoTicket estado,
            @RequestParam(required = false) PrioridadTicket prioridad) {
        return ResponseEntity.ok(ticketService.listar(tiendaId, estado, prioridad));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.obtener(id));
    }

    @PostMapping
    public ResponseEntity<TicketResponse> crear(@Valid @RequestBody TicketCreateRequest request) {
        TicketResponse response = ticketService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TicketResponse> actualizar(@PathVariable Long id, @Valid @RequestBody TicketUpdateRequest request) {
        return ResponseEntity.ok(ticketService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        ticketService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}