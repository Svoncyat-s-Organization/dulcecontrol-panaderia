package com.dulcecontrol.bakery.feature.admin.ventas.entity.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EstadoPagoPedidoConverter implements AttributeConverter<EstadoPagoPedido, String> {

    @Override
    public String convertToDatabaseColumn(EstadoPagoPedido attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public EstadoPagoPedido convertToEntityAttribute(String dbData) {
        return dbData == null ? null : EstadoPagoPedido.fromValue(dbData);
    }
}
