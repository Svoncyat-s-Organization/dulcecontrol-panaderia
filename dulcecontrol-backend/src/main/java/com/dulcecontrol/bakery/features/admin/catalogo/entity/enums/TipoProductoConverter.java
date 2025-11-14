package com.dulcecontrol.bakery.features.admin.catalogo.entity.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TipoProductoConverter implements AttributeConverter<TipoProducto, String> {

    @Override
    public String convertToDatabaseColumn(TipoProducto attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValue();
    }

    @Override
    public TipoProducto convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return TipoProducto.fromValue(dbData);
    }
}
