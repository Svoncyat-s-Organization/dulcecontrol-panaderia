package com.dulcecontrol.bakery.feature.admin.ventas.entity.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class MetodoPagoConverter implements AttributeConverter<MetodoPago, String> {

    @Override
    public String convertToDatabaseColumn(MetodoPago attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public MetodoPago convertToEntityAttribute(String dbData) {
        return dbData == null ? null : MetodoPago.fromValue(dbData);
    }
}
