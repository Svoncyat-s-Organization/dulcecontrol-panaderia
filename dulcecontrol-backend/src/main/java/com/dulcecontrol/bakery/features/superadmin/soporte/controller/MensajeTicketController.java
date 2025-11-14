package com.dulcecontrol.bakery.features.superadmin.soporte.controller;

import com.dulcecontrol.bakery.features.superadmin.soporte.dto.MensajeCreateRequest;
import com.dulcecontrol.bakery.features.superadmin.soporte.dto.MensajeResponse;
import com.dulcecontrol.bakery.features.superadmin.soporte.dto.MensajeUpdateRequest;
import com.dulcecontrol.bakery.features.superadmin.soporte.service.IMensajeTicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/superadmin/soporte")
@RequiredArgsConstructor
@Validated
public class MensajeTicketController {

    private final IMensajeTicketService mensajeService;

    @GetMapping("/mensajes")
    public ResponseEntity<List<MensajeResponse>> listar(@RequestParam(required = false) Long ticketId) {
        if (ticketId != null) {
            return ResponseEntity.ok(mensajeService.listarPorTicket(ticketId));
        }
        return ResponseEntity.ok(mensajeService.listarTodos());
    }

    @GetMapping("/mensajes/{id}")
    public ResponseEntity<MensajeResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(mensajeService.obtener(id));
    }

    @PostMapping("/mensajes")
    public ResponseEntity<MensajeResponse> crear(@Valid @RequestBody MensajeCreateRequest request) {
        MensajeResponse response = mensajeService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/mensajes/{id}")
    public ResponseEntity<MensajeResponse> actualizar(@PathVariable Long id, @Valid @RequestBody MensajeUpdateRequest request) {
        return ResponseEntity.ok(mensajeService.actualizar(id, request));
    }

    @DeleteMapping("/mensajes/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        mensajeService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tickets/{ticketId}/mensajes")
    public ResponseEntity<List<MensajeResponse>> listarPorTicketPath(@PathVariable Long ticketId) {
        return ResponseEntity.ok(mensajeService.listarPorTicket(ticketId));
    }
}