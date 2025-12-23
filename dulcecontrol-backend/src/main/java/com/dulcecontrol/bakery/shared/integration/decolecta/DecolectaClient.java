package com.dulcecontrol.bakery.shared.integration.decolecta;

import com.dulcecontrol.bakery.shared.integration.decolecta.dto.ReniecDniResponse;
import com.dulcecontrol.bakery.shared.integration.decolecta.dto.SunatRucBasicoResponse;
import com.dulcecontrol.bakery.shared.integration.decolecta.dto.SunatRucFullResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Slf4j
@Component
@RequiredArgsConstructor
public class DecolectaClient {

    private final DecolectaProperties properties;
    private final RestClient.Builder restClientBuilder;

    /**
     * Consulta información de una persona por DNI en RENIEC
     */
    public ReniecDniResponse consultarDni(String dni) {
        validateToken();
        
        try {
            RestClient client = restClientBuilder
                    .baseUrl(properties.getBaseUrl())
                    .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                    .defaultHeader("Authorization", "Bearer " + properties.getApiToken())
                    .build();

            ReniecDniResponse response = client.get()
                    .uri("/reniec/dni?numero={dni}", dni)
                    .retrieve()
                    .body(ReniecDniResponse.class);

            log.info("Consulta DNI exitosa: {}", dni);
            return response;
            
        } catch (RestClientException e) {
            log.error("Error al consultar DNI {}: {}", dni, e.getMessage());
            throw new DecolectaException("Error al consultar DNI en RENIEC: " + e.getMessage(), e);
        }
    }

    /**
     * Consulta información básica de una empresa por RUC en SUNAT
     */
    public SunatRucBasicoResponse consultarRucBasico(String ruc) {
        validateToken();
        
        try {
            RestClient client = restClientBuilder
                    .baseUrl(properties.getBaseUrl())
                    .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                    .defaultHeader("Authorization", "Bearer " + properties.getApiToken())
                    .build();

            SunatRucBasicoResponse response = client.get()
                    .uri("/sunat/ruc?numero={ruc}", ruc)
                    .retrieve()
                    .body(SunatRucBasicoResponse.class);

            log.info("Consulta RUC básico exitosa: {}", ruc);
            return response;
            
        } catch (RestClientException e) {
            log.error("Error al consultar RUC básico {}: {}", ruc, e.getMessage());
            throw new DecolectaException("Error al consultar RUC básico en SUNAT: " + e.getMessage(), e);
        }
    }

    /**
     * Consulta información completa de una empresa por RUC en SUNAT
     */
    public SunatRucFullResponse consultarRucCompleto(String ruc) {
        validateToken();
        
        try {
            RestClient client = restClientBuilder
                    .baseUrl(properties.getBaseUrl())
                    .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                    .defaultHeader("Authorization", "Bearer " + properties.getApiToken())
                    .build();

            SunatRucFullResponse response = client.get()
                    .uri("/sunat/ruc/full?numero={ruc}", ruc)
                    .retrieve()
                    .body(SunatRucFullResponse.class);

            log.info("Consulta RUC completo exitosa: {}", ruc);
            return response;
            
        } catch (RestClientException e) {
            log.error("Error al consultar RUC completo {}: {}", ruc, e.getMessage());
            throw new DecolectaException("Error al consultar RUC completo en SUNAT: " + e.getMessage(), e);
        }
    }

    private void validateToken() {
        if (properties.getApiToken() == null || properties.getApiToken().isBlank()) {
            throw new DecolectaException("API Token de DECOLECTA no configurado. Configure 'decolecta.api-token' en application.properties");
        }
    }
}
