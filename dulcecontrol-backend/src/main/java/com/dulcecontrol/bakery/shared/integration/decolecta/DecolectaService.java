package com.dulcecontrol.bakery.shared.integration.decolecta;

import com.dulcecontrol.bakery.shared.integration.decolecta.dto.ReniecDniResponse;
import com.dulcecontrol.bakery.shared.integration.decolecta.dto.SunatRucBasicoResponse;
import com.dulcecontrol.bakery.shared.integration.decolecta.dto.SunatRucFullResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class DecolectaService {

    private final DecolectaClient decolectaClient;

    /**
     * Consulta información de una persona por DNI
     * @param dni Número de DNI (8 dígitos)
     * @return Información de la persona
     */
    public ReniecDniResponse consultarPersonaPorDni(String dni) {
        validarDni(dni);
        log.info("Consultando persona con DNI: {}", dni);
        return decolectaClient.consultarDni(dni);
    }

    /**
     * Consulta información básica de una empresa por RUC
     * @param ruc Número de RUC (11 dígitos)
     * @return Información básica de la empresa
     */
    public SunatRucBasicoResponse consultarEmpresaPorRucBasico(String ruc) {
        validarRuc(ruc);
        log.info("Consultando empresa con RUC (básico): {}", ruc);
        return decolectaClient.consultarRucBasico(ruc);
    }

    /**
     * Consulta información completa de una empresa por RUC
     * @param ruc Número de RUC (11 dígitos)
     * @return Información completa de la empresa
     */
    public SunatRucFullResponse consultarEmpresaPorRucCompleto(String ruc) {
        validarRuc(ruc);
        log.info("Consultando empresa con RUC (completo): {}", ruc);
        return decolectaClient.consultarRucCompleto(ruc);
    }

    private void validarDni(String dni) {
        if (dni == null || !dni.matches("\\d{8}")) {
            throw new IllegalArgumentException("DNI inválido. Debe contener 8 dígitos");
        }
    }

    private void validarRuc(String ruc) {
        if (ruc == null || !ruc.matches("\\d{11}")) {
            throw new IllegalArgumentException("RUC inválido. Debe contener 11 dígitos");
        }
    }
}
