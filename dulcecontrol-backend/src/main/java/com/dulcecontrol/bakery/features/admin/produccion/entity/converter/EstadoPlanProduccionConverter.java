package com.dulcecontrol.bakery.features.admin.produccion.entity.converter;

import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.EstadoPlanProduccion;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EstadoPlanProduccionConverter implements AttributeConverter<EstadoPlanProduccion, String> {

    @Override
    public String convertToDatabaseColumn(EstadoPlanProduccion attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getDbValue();
    }

    @Override
    public EstadoPlanProduccion convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return EstadoPlanProduccion.fromDbValue(dbData);
    }
}
