package com.dulcecontrol.bakery.features.admin.produccion.entity.converter;

import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.EstadoItemProduccion;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EstadoItemProduccionConverter implements AttributeConverter<EstadoItemProduccion, String> {

    @Override
    public String convertToDatabaseColumn(EstadoItemProduccion attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getDbValue();
    }

    @Override
    public EstadoItemProduccion convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return EstadoItemProduccion.fromDbValue(dbData);
    }
}
