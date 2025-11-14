package com.dulcecontrol.bakery.features.admin.facturacion.entity.converter;

import com.dulcecontrol.bakery.features.admin.facturacion.entity.enums.EstadoSunat;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EstadoSunatConverter implements AttributeConverter<EstadoSunat, String> {

    @Override
    public String convertToDatabaseColumn(EstadoSunat attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValor();
    }

    @Override
    public EstadoSunat convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }
        return EstadoSunat.fromValor(dbData);
    }
}
