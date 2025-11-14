package com.dulcecontrol.bakery.features.admin.ventas.entity.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TipoMovimientoCajaConverter implements AttributeConverter<TipoMovimientoCaja, String> {

    @Override
    public String convertToDatabaseColumn(TipoMovimientoCaja attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public TipoMovimientoCaja convertToEntityAttribute(String dbData) {
        return dbData == null ? null : TipoMovimientoCaja.fromValue(dbData);
    }
}
