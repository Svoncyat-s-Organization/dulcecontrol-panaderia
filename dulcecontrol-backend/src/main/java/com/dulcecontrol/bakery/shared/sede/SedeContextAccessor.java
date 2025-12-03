package com.dulcecontrol.bakery.shared.sede;

import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class SedeContextAccessor {

    public Optional<SedeContext> currentContext() {
        return Optional.ofNullable(SedeContextHolder.get());
    }

    public Optional<Long> currentSedeId() {
        return currentContext().map(SedeContext::sedeId);
    }

    public Optional<Long> currentTiendaId() {
        return currentContext().map(SedeContext::tiendaId);
    }
}
