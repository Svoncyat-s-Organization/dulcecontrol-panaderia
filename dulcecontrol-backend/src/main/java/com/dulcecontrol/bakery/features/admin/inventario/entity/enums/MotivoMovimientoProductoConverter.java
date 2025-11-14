package com.dulcecontrol.bakery.features.admin.inventario.entity.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class MotivoMovimientoProductoConverter implements AttributeConverter<MotivoMovimientoProducto, String> {

    @Override
    public String convertToDatabaseColumn(MotivoMovimientoProducto attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValor();
    }

    @Override
    public MotivoMovimientoProducto convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }
        return MotivoMovimientoProducto.fromString(dbData);
    }
}
