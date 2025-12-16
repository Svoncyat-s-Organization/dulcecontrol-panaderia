package com.dulcecontrol.bakery.features.shared.suscripciones.model;

public final class PlanLimites {

    private final Integer maxUsuarios;
    private final Integer maxSedes;

    public PlanLimites(Integer maxUsuarios, Integer maxSedes) {
        this.maxUsuarios = normalizar(maxUsuarios);
        this.maxSedes = normalizar(maxSedes);
    }

    public static PlanLimites sinRestricciones() {
        return new PlanLimites(null, null);
    }

    public Integer getMaxUsuarios() {
        return maxUsuarios;
    }

    public Integer getMaxSedes() {
        return maxSedes;
    }

    public boolean tieneLimiteUsuarios() {
        return maxUsuarios != null;
    }

    public boolean tieneLimiteSedes() {
        return maxSedes != null;
    }

    @Override
    public String toString() {
        return "PlanLimites{" +
                "maxUsuarios=" + maxUsuarios +
                ", maxSedes=" + maxSedes +
                '}';
    }

    private Integer normalizar(Integer valor) {
        if (valor == null || valor <= 0) {
            return null;
        }
        return valor;
    }
}
