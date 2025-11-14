package com.dulcecontrol.bakery.features.admin.produccion.entity.converter;

import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.UnidadMedidaReceta;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class UnidadMedidaRecetaConverter implements AttributeConverter<UnidadMedidaReceta, String> {

    @Override
    public String convertToDatabaseColumn(UnidadMedidaReceta attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getDbValue();
    }

    @Override
    public UnidadMedidaReceta convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return UnidadMedidaReceta.fromDbValue(dbData);
    }
}
