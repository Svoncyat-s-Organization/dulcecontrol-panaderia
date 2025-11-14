package com.dulcecontrol.bakery.features.admin.compras.entity.converter;

import com.dulcecontrol.bakery.features.admin.compras.entity.enums.UnidadMedida;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class UnidadMedidaConverter implements AttributeConverter<UnidadMedida, String> {

    @Override
    public String convertToDatabaseColumn(UnidadMedida attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValor();
    }

    @Override
    public UnidadMedida convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }
        return UnidadMedida.fromValor(dbData);
    }
}
