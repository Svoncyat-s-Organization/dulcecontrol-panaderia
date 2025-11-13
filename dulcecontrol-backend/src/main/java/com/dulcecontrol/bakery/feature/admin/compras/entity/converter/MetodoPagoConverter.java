package com.dulcecontrol.bakery.feature.admin.compras.entity.converter;

import com.dulcecontrol.bakery.feature.admin.compras.entity.enums.MetodoPago;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class MetodoPagoConverter implements AttributeConverter<MetodoPago, String> {

    @Override
    public String convertToDatabaseColumn(MetodoPago attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValor();
    }

    @Override
    public MetodoPago convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }
        return MetodoPago.fromValor(dbData);
    }
}
