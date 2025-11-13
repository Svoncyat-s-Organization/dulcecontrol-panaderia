package com.dulcecontrol.bakery.feature.admin.inventario.entity.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TipoMovimientoInsumoConverter implements AttributeConverter<TipoMovimientoInsumo, String> {

    @Override
    public String convertToDatabaseColumn(TipoMovimientoInsumo attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValor();
    }

    @Override
    public TipoMovimientoInsumo convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }
        return TipoMovimientoInsumo.fromString(dbData);
    }
}
