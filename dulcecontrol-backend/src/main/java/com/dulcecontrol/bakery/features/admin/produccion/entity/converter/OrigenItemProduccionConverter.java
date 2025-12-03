package com.dulcecontrol.bakery.features.admin.produccion.entity.converter;

import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.OrigenItemProduccion;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class OrigenItemProduccionConverter implements AttributeConverter<OrigenItemProduccion, String> {

    @Override
    public String convertToDatabaseColumn(OrigenItemProduccion attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getDbValue();
    }

    @Override
    public OrigenItemProduccion convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return OrigenItemProduccion.fromDbValue(dbData);
    }
}
