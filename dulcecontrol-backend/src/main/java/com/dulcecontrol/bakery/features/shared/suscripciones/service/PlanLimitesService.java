package com.dulcecontrol.bakery.features.shared.suscripciones.service;

import com.dulcecontrol.bakery.features.shared.suscripciones.model.PlanLimites;
import com.dulcecontrol.bakery.features.superadmin.suscripciones.entity.Plan;
import com.dulcecontrol.bakery.features.superadmin.suscripciones.entity.Suscripcion;
import com.dulcecontrol.bakery.features.superadmin.suscripciones.entity.enums.EstadoSuscripcion;
import com.dulcecontrol.bakery.features.superadmin.suscripciones.repository.SuscripcionRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlanLimitesService {

    private static final List<EstadoSuscripcion> ESTADOS_VIGENTES =
            List.of(EstadoSuscripcion.ACTIVA, EstadoSuscripcion.EN_PRUEBA);

    private final SuscripcionRepository suscripcionRepository;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public PlanLimites obtenerLimitesVigentes(Long tiendaId) {
        if (tiendaId == null) {
            return PlanLimites.sinRestricciones();
        }

        List<Suscripcion> suscripciones = suscripcionRepository
                .findByTiendaIdAndEstadoInOrderByFechaFinDesc(tiendaId, ESTADOS_VIGENTES);

        Suscripcion vigente = suscripciones.stream().findFirst().orElse(null);
        if (vigente == null) {
            return PlanLimites.sinRestricciones();
        }

        return extraerLimites(vigente.getPlan());
    }

    private PlanLimites extraerLimites(Plan plan) {
        if (plan == null) {
            return PlanLimites.sinRestricciones();
        }

        String limitesJson = plan.getLimitesJson();
        if (limitesJson == null || limitesJson.isBlank()) {
            return PlanLimites.sinRestricciones();
        }

        try {
            JsonNode raiz = objectMapper.readTree(limitesJson);
            Integer maxUsuarios = leerEntero(raiz, "usuarios");
            Integer maxSedes = leerEntero(raiz, "sedes");
            return new PlanLimites(maxUsuarios, maxSedes);
        } catch (JsonProcessingException ex) {
            log.warn("No se pudieron parsear los límites del plan {}", plan.getCodigo(), ex);
            return PlanLimites.sinRestricciones();
        }
    }

    private Integer leerEntero(JsonNode raiz, String campo) {
        if (raiz == null || !raiz.has(campo)) {
            return null;
        }
        JsonNode nodo = raiz.get(campo);
        if (!nodo.isNumber()) {
            return null;
        }
        int valor = nodo.asInt();
        return valor > 0 ? valor : null;
    }
}
