package com.dulcecontrol.bakery.features.admin.ventas.entity.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EstadoPedidoConverter implements AttributeConverter<EstadoPedido, String> {

    @Override
    public String convertToDatabaseColumn(EstadoPedido attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public EstadoPedido convertToEntityAttribute(String dbData) {
        return dbData == null ? null : EstadoPedido.fromValue(dbData);
    }
}
