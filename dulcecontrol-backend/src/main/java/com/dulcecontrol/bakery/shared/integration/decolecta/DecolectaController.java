package com.dulcecontrol.bakery.shared.integration.decolecta;

import com.dulcecontrol.bakery.shared.integration.decolecta.dto.ReniecDniResponse;
import com.dulcecontrol.bakery.shared.integration.decolecta.dto.SunatRucBasicoResponse;
import com.dulcecontrol.bakery.shared.integration.decolecta.dto.SunatRucFullResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/integration/decolecta")
@RequiredArgsConstructor
public class DecolectaController {

    private final DecolectaService decolectaService;

    /**
     * Consulta información de una persona por DNI
     * GET /api/integration/decolecta/reniec/dni/{dni}
     */
    @GetMapping("/reniec/dni/{dni}")
    public ResponseEntity<ReniecDniResponse> consultarDni(@PathVariable String dni) {
        ReniecDniResponse response = decolectaService.consultarPersonaPorDni(dni);
        return ResponseEntity.ok(response);
    }

    /**
     * Consulta información básica de una empresa por RUC
     * GET /api/integration/decolecta/sunat/ruc/{ruc}
     */
    @GetMapping("/sunat/ruc/{ruc}")
    public ResponseEntity<SunatRucBasicoResponse> consultarRucBasico(@PathVariable String ruc) {
        SunatRucBasicoResponse response = decolectaService.consultarEmpresaPorRucBasico(ruc);
        return ResponseEntity.ok(response);
    }

    /**
     * Consulta información completa de una empresa por RUC
     * GET /api/integration/decolecta/sunat/ruc/{ruc}/full
     */
    @GetMapping("/sunat/ruc/{ruc}/full")
    public ResponseEntity<SunatRucFullResponse> consultarRucCompleto(@PathVariable String ruc) {
        SunatRucFullResponse response = decolectaService.consultarEmpresaPorRucCompleto(ruc);
        return ResponseEntity.ok(response);
    }
}
