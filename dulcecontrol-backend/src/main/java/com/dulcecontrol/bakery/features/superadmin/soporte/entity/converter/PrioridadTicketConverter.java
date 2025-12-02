package com.dulcecontrol.bakery.features.superadmin.soporte.entity.converter;

import com.dulcecontrol.bakery.features.superadmin.soporte.entity.enums.PrioridadTicket;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Locale;

@Converter(autoApply = false)
public class PrioridadTicketConverter implements AttributeConverter<PrioridadTicket, String> {

    @Override
    public String convertToDatabaseColumn(PrioridadTicket attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.name().toLowerCase(Locale.ROOT);
    }

    @Override
    public PrioridadTicket convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return null;
        }
        String normalized = dbData.trim().toLowerCase(Locale.ROOT);
        for (PrioridadTicket value : PrioridadTicket.values()) {
            if (value.name().equals(normalized)) {
                return value;
            }
        }
        throw new IllegalArgumentException("Valor de prioridad de ticket desconocido: " + dbData);
    }
}
