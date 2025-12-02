package com.dulcecontrol.bakery.features.superadmin.soporte.entity.converter;

import com.dulcecontrol.bakery.features.superadmin.soporte.entity.enums.TipoRemitente;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Locale;

@Converter(autoApply = false)
public class TipoRemitenteConverter implements AttributeConverter<TipoRemitente, String> {

    @Override
    public String convertToDatabaseColumn(TipoRemitente attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.name().toLowerCase(Locale.ROOT);
    }

    @Override
    public TipoRemitente convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return null;
        }
        String normalized = dbData.trim().toLowerCase(Locale.ROOT);
        for (TipoRemitente value : TipoRemitente.values()) {
            if (value.name().equals(normalized)) {
                return value;
            }
        }
        throw new IllegalArgumentException("Tipo de remitente desconocido: " + dbData);
    }
}
