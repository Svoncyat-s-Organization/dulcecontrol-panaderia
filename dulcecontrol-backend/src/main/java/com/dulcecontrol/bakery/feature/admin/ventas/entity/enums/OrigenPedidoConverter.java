package com.dulcecontrol.bakery.feature.admin.ventas.entity.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class OrigenPedidoConverter implements AttributeConverter<OrigenPedido, String> {

    @Override
    public String convertToDatabaseColumn(OrigenPedido attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public OrigenPedido convertToEntityAttribute(String dbData) {
        return dbData == null ? null : OrigenPedido.fromValue(dbData);
    }
}
