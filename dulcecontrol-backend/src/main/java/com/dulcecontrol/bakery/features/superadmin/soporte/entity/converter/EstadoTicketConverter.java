package com.dulcecontrol.bakery.features.superadmin.soporte.entity.converter;

import com.dulcecontrol.bakery.features.superadmin.soporte.entity.enums.EstadoTicket;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Locale;

@Converter(autoApply = false)
public class EstadoTicketConverter implements AttributeConverter<EstadoTicket, String> {

    @Override
    public String convertToDatabaseColumn(EstadoTicket attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.name().toLowerCase(Locale.ROOT);
    }

    @Override
    public EstadoTicket convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return null;
        }
        String normalized = dbData.trim().toLowerCase(Locale.ROOT);
        for (EstadoTicket value : EstadoTicket.values()) {
            if (value.name().equals(normalized)) {
                return value;
            }
        }
        throw new IllegalArgumentException("Valor de estado de ticket desconocido: " + dbData);
    }
}
