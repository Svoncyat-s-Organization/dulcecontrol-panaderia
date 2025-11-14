package com.dulcecontrol.bakery.feature.admin.produccion.controller;

import com.dulcecontrol.bakery.feature.admin.produccion.dto.StockIdealCreateRequest;
import com.dulcecontrol.bakery.feature.admin.produccion.dto.StockIdealResponse;
import com.dulcecontrol.bakery.feature.admin.produccion.dto.StockIdealUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.produccion.service.IStockIdealAdminService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/produccion/stock-ideal")
@RequiredArgsConstructor
@Validated
public class StockIdealAdminController {

    private final IStockIdealAdminService stockIdealAdminService;

    @GetMapping
    public ResponseEntity<List<StockIdealResponse>> listar(@PathVariable Long tiendaId,
            @RequestParam(value = "sedeId", required = false) Long sedeId) {
        return ResponseEntity.ok(stockIdealAdminService.listarPorTienda(tiendaId, sedeId));
    }

    @GetMapping("/{stockId}")
    public ResponseEntity<StockIdealResponse> obtener(@PathVariable Long tiendaId, @PathVariable Long stockId) {
        return ResponseEntity.ok(stockIdealAdminService.obtenerPorId(tiendaId, stockId));
    }

    @PostMapping
    public ResponseEntity<StockIdealResponse> crear(@PathVariable Long tiendaId,
            @Valid @RequestBody StockIdealCreateRequest request) {
        StockIdealResponse response = stockIdealAdminService.crear(tiendaId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{stockId}")
    public ResponseEntity<StockIdealResponse> actualizar(@PathVariable Long tiendaId,
            @PathVariable Long stockId,
            @Valid @RequestBody StockIdealUpdateRequest request) {
        StockIdealResponse response = stockIdealAdminService.actualizar(tiendaId, stockId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{stockId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long tiendaId, @PathVariable Long stockId) {
        stockIdealAdminService.eliminar(tiendaId, stockId);
        return ResponseEntity.noContent().build();
    }
}
